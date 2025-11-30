# 部署运维指南

> **版本**: v1.0
> **更新日期**: 2024-11-30
> **部署目标**: VPS (107.174.42.198) + Cloudflare CDN

---

## 1. 部署架构

### 1.1 架构图

```
                      ┌─────────────────┐
                      │   Cloudflare    │
                      │   DNS + CDN     │
                      │   SSL终止       │
                      └────────┬────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    VPS 107.174.42.198                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              nginx-proxy (端口 80/443)               │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │ n8n-library.com → 172.17.0.1:3002          │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                               │                             │
│                               ▼                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           n8n-library 容器 (端口 3002)              │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │  Nginx Alpine                               │    │   │
│  │  │  ├── /usr/share/nginx/html (静态文件)       │    │   │
│  │  │  └── Gzip + 缓存配置                       │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  数据目录: /opt/docker-projects/n8n-library/               │
│  ├── data/dist/          (静态文件)                        │
│  ├── config/nginx.conf   (Nginx 配置)                      │
│  └── logs/               (访问日志)                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 技术栈

| 组件 | 版本 | 用途 |
|------|------|------|
| Nginx | alpine | 静态文件服务 |
| Docker | 24.x | 容器化 |
| Cloudflare | - | DNS + CDN + SSL |
| GitHub Actions | - | CI/CD |

---

## 2. 项目目录结构

遵循 VPS SOP 规范:

```
/opt/docker-projects/n8n-library/
├── data/
│   ├── raw/                    # Git Submodules (构建时)
│   │   ├── awesome-n8n/
│   │   └── n8n-workflows/
│   └── dist/                   # 静态构建输出
│       ├── index.html
│       ├── _next/
│       ├── data/
│       └── ...
├── config/
│   └── nginx.conf              # Nginx 配置
├── logs/                       # 访问日志
│   ├── access.log
│   └── error.log
├── backups/                    # 自动备份
├── scripts/                    # 构建脚本
├── src/                        # Next.js 源码 (可选)
├── docker-compose.yml
├── Makefile
├── package.json
├── next.config.js
└── .env                        # 环境变量
```

---

## 3. Docker 配置

### 3.1 docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    image: nginx:alpine
    container_name: n8n_library_web
    restart: unless-stopped
    ports:
      - "3002:80"
    volumes:
      - ./data/dist:/usr/share/nginx/html:ro
      - ./config/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./logs:/var/log/nginx
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 3.2 config/nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml
        application/xml+rss
        application/x-javascript
        image/svg+xml;

    # 静态资源缓存 (永久缓存，带 hash)
    location /_next/static {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # 数据文件缓存 (1小时)
    location /data {
        expires 1h;
        add_header Cache-Control "public";

        # CORS for JSON files
        if ($request_filename ~* \.json$) {
            add_header Access-Control-Allow-Origin *;
        }
    }

    # 图标缓存 (1年)
    location /icons {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # 图片和字体缓存
    location ~* \.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # 主要路由 (Next.js 静态导出)
    location / {
        try_files $uri $uri.html $uri/index.html /404.html;
        expires 1h;
        add_header Cache-Control "public";
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # 错误页面
    error_page 404 /404.html;
    error_page 500 502 503 504 /500.html;

    # 禁用不需要的日志
    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }

    location = /robots.txt {
        log_not_found off;
        access_log off;
    }
}
```

---

## 4. Makefile

```makefile
.PHONY: help deploy build logs down restart backup clean status

# 默认目标
help:
	@echo "n8n-library Makefile"
	@echo ""
	@echo "Usage:"
	@echo "  make deploy    - 构建并部署 (备份 → 拉取 → 构建 → 启动)"
	@echo "  make build     - 仅构建静态文件"
	@echo "  make logs      - 查看容器日志"
	@echo "  make down      - 停止容器"
	@echo "  make restart   - 重启容器"
	@echo "  make backup    - 备份当前数据"
	@echo "  make clean     - 清理构建缓存"
	@echo "  make status    - 查看服务状态"

# 完整部署流程
deploy: backup pull-submodules build start
	@echo "✅ Deployment complete!"

# 备份当前数据
backup:
	@echo "📦 Backing up current data..."
	@if [ -d "data/dist" ]; then \
		mkdir -p backups; \
		tar -czf backups/dist-$$(date +%Y%m%d-%H%M%S).tar.gz -C data dist; \
		echo "   Backup created in backups/"; \
	else \
		echo "   No existing data to backup"; \
	fi

# 更新 Git Submodules
pull-submodules:
	@echo "📥 Updating submodules..."
	git submodule update --init --recursive
	git submodule foreach git pull origin main

# 构建静态文件
build:
	@echo "🔨 Building static site..."
	npm ci
	node scripts/build-data.js
	npm run build
	@echo "📁 Moving build output..."
	rm -rf data/dist
	mv out data/dist
	@echo "   Build complete: data/dist/"

# 启动容器
start:
	@echo "🚀 Starting container..."
	docker compose up -d
	@echo "   Container started on port 3002"

# 查看日志
logs:
	docker compose logs -f --tail=100

# 停止容器
down:
	@echo "🛑 Stopping container..."
	docker compose down

# 重启容器
restart:
	@echo "🔄 Restarting container..."
	docker compose restart

# 清理构建缓存
clean:
	@echo "🧹 Cleaning build cache..."
	rm -rf .next out node_modules
	@echo "   Clean complete"

# 查看状态
status:
	@echo "📊 Service Status:"
	@docker compose ps
	@echo ""
	@echo "📁 Disk Usage:"
	@du -sh data/dist 2>/dev/null || echo "   No build output"
	@echo ""
	@echo "📈 Container Stats:"
	@docker stats --no-stream n8n_library_web 2>/dev/null || echo "   Container not running"

# 修复权限 (SOP 要求)
fix-perms:
	@echo "🔧 Fixing permissions..."
	sudo chown -R 101:101 data/dist logs
	sudo chmod -R 755 data/dist
	sudo chmod -R 755 logs

# 恢复最新备份
restore:
	@echo "📦 Restoring from latest backup..."
	@LATEST=$$(ls -t backups/*.tar.gz 2>/dev/null | head -1); \
	if [ -n "$$LATEST" ]; then \
		rm -rf data/dist; \
		mkdir -p data; \
		tar -xzf "$$LATEST" -C data; \
		echo "   Restored from $$LATEST"; \
	else \
		echo "   No backup found"; \
	fi
```

---

## 5. Nginx Proxy 配置

### 5.1 添加反向代理

编辑 `/opt/docker-projects/nginx-proxy/config/conf.d/default.conf`:

```nginx
# n8n Library
server {
    listen 80;
    listen 443 ssl;
    http2 on;
    server_name n8n-library.com www.n8n-library.com;

    # SSL (Cloudflare 终止，这里使用自签名)
    ssl_certificate /etc/nginx/ssl/server.crt;
    ssl_certificate_key /etc/nginx/ssl/server.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    # www 重定向到 non-www
    if ($host = 'www.n8n-library.com') {
        return 301 https://n8n-library.com$request_uri;
    }

    location / {
        proxy_pass http://172.17.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;

        # 缓存头透传
        proxy_pass_header Cache-Control;
        proxy_pass_header Expires;
        proxy_pass_header ETag;
        proxy_pass_header Last-Modified;

        # WebSocket 支持 (如需要)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # 健康检查端点
    location /health {
        access_log off;
        return 200 "OK";
    }
}
```

### 5.2 重载配置

```bash
docker exec nginx-proxy nginx -t  # 测试配置
docker exec nginx-proxy nginx -s reload  # 重载
```

---

## 6. Cloudflare 配置

### 6.1 DNS 设置

| 类型 | 名称 | 内容 | 代理状态 | TTL |
|------|------|------|----------|-----|
| A | n8n-library.com | 107.174.42.198 | 已代理 | Auto |
| A | www | 107.174.42.198 | 已代理 | Auto |

### 6.2 SSL/TLS 设置

- **加密模式**: Full (严格)
- **始终使用 HTTPS**: 开启
- **自动 HTTPS 重写**: 开启
- **最低 TLS 版本**: TLS 1.2

### 6.3 缓存设置

- **缓存级别**: 标准
- **浏览器缓存 TTL**: 遵循现有头部
- **始终在线**: 开启

### 6.4 页面规则 (可选)

| URL 模式 | 设置 |
|----------|------|
| `*n8n-library.com/_next/static/*` | 缓存级别: 全部缓存, Edge 缓存 TTL: 1 个月 |
| `*n8n-library.com/data/*` | 缓存级别: 全部缓存, Edge 缓存 TTL: 1 小时 |

---

## 7. GitHub Actions CI/CD

### 7.1 工作流配置

**.github/workflows/deploy.yml**:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  schedule:
    # 每周日凌晨同步上游
    - cron: '0 0 * * 0'
  workflow_dispatch:  # 手动触发

env:
  NODE_VERSION: '18'

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Update submodules
        run: |
          git submodule update --remote --merge
          echo "Submodules updated"

      - name: Install dependencies
        run: npm ci

      - name: Build data
        run: |
          node scripts/build-data.js
          echo "Data build complete"

      - name: Build site
        run: |
          npm run build
          echo "Site build complete"

      - name: Deploy to VPS
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          source: "out/*"
          target: "/opt/docker-projects/n8n-library/data/dist"
          strip_components: 1
          overwrite: true

      - name: Restart container
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/docker-projects/n8n-library
            docker compose restart
            echo "Container restarted"

      - name: Health check
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            sleep 5
            curl -sf http://localhost:3002/ > /dev/null && echo "Health check passed" || exit 1
```

### 7.2 GitHub Secrets 配置

在仓库 Settings → Secrets and variables → Actions 添加:

| Secret 名称 | 值 |
|-------------|---|
| `VPS_HOST` | `107.174.42.198` |
| `VPS_USER` | `root` |
| `VPS_SSH_KEY` | SSH 私钥内容 |

### 7.3 生成 SSH 密钥

```bash
# 在本地生成专用密钥
ssh-keygen -t ed25519 -f ~/.ssh/n8n-library-deploy -C "github-actions"

# 将公钥添加到 VPS
ssh-copy-id -i ~/.ssh/n8n-library-deploy.pub root@107.174.42.198

# 将私钥内容添加到 GitHub Secrets (VPS_SSH_KEY)
cat ~/.ssh/n8n-library-deploy
```

---

## 8. 手动部署流程

如果不使用 GitHub Actions:

### 8.1 本地构建

```bash
# 在本地开发机器
cd /path/to/n8n-library

# 更新子模块
git submodule update --init --recursive
git submodule foreach git pull origin main

# 安装依赖
npm ci

# 构建数据
node scripts/build-data.js

# 构建站点
npm run build
```

### 8.2 上传到 VPS

```bash
# 使用 rsync
rsync -avz --delete out/ root@107.174.42.198:/opt/docker-projects/n8n-library/data/dist/

# 或使用 scp
scp -r out/* root@107.174.42.198:/opt/docker-projects/n8n-library/data/dist/
```

### 8.3 重启服务

```bash
ssh root@107.174.42.198 "cd /opt/docker-projects/n8n-library && docker compose restart"
```

---

## 9. 监控与日志

### 9.1 查看访问日志

```bash
# 实时查看
docker exec n8n_library_web tail -f /var/log/nginx/access.log

# 或通过 Makefile
cd /opt/docker-projects/n8n-library
make logs
```

### 9.2 分析访问日志

```bash
# 统计访问最多的页面
docker exec n8n_library_web cat /var/log/nginx/access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -20

# 统计状态码分布
docker exec n8n_library_web cat /var/log/nginx/access.log | awk '{print $9}' | sort | uniq -c | sort -rn
```

### 9.3 健康检查

```bash
# 本地检查
curl -I http://localhost:3002/

# 外部检查
curl -I https://n8n-library.com/

# 检查特定页面
curl -I https://n8n-library.com/workflow/telegram-ai-chatbot/
```

### 9.4 资源监控

```bash
# 容器资源使用
docker stats n8n_library_web

# 磁盘使用
du -sh /opt/docker-projects/n8n-library/data/dist

# 内存使用
free -h
```

---

## 10. 故障排除

### 10.1 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 404 错误 | Nginx 路由配置 | 检查 `try_files` 规则 |
| 502 Bad Gateway | 容器未运行 | `docker compose up -d` |
| CSS/JS 未加载 | 路径问题 | 检查 `trailingSlash` 配置 |
| 缓存未更新 | CDN 缓存 | Cloudflare 清除缓存 |
| 构建失败 | 依赖问题 | `rm -rf node_modules && npm ci` |

### 10.2 调试命令

```bash
# 检查容器状态
docker compose ps
docker compose logs web

# 检查 Nginx 配置
docker exec n8n_library_web nginx -t

# 检查文件权限
ls -la /opt/docker-projects/n8n-library/data/dist/

# 检查端口占用
ss -tlnp | grep 3002

# 进入容器调试
docker exec -it n8n_library_web sh
```

### 10.3 回滚流程

```bash
cd /opt/docker-projects/n8n-library

# 查看备份列表
ls -la backups/

# 恢复最新备份
make restore

# 重启容器
make restart
```

---

## 11. 性能优化

### 11.1 Nginx 优化

```nginx
# 在 nginx.conf 顶部添加
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 65535;
    multi_accept on;
    use epoll;
}

http {
    # 开启 sendfile
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    # 连接超时
    keepalive_timeout 65;
    keepalive_requests 1000;

    # 缓冲区
    client_body_buffer_size 128k;
    client_max_body_size 10m;

    # 开启 open_file_cache
    open_file_cache max=1000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
}
```

### 11.2 Cloudflare 优化

- **Auto Minify**: 开启 (JavaScript, CSS, HTML)
- **Brotli**: 开启
- **Early Hints**: 开启
- **Rocket Loader**: 测试后决定

### 11.3 构建优化

```javascript
// next.config.js
const nextConfig = {
  output: 'export',

  // 压缩
  compress: true,

  // 分析打包
  // npm install @next/bundle-analyzer
  // ANALYZE=true npm run build
};
```

---

## 12. 备份策略

### 12.1 自动备份

每次 `make deploy` 自动创建备份。

### 12.2 备份清理

```bash
# 保留最近 7 天备份
find /opt/docker-projects/n8n-library/backups -name "*.tar.gz" -mtime +7 -delete
```

### 12.3 添加 Cron 清理任务

```bash
# 编辑 crontab
crontab -e

# 添加每日清理
0 4 * * * find /opt/docker-projects/n8n-library/backups -name "*.tar.gz" -mtime +7 -delete
```

---

## 13. 安全加固

### 13.1 Nginx 安全头

已在 `nginx.conf` 中配置:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

### 13.2 Cloudflare WAF

- 启用托管规则
- 启用 Bot Fight Mode
- 配置速率限制 (可选)

### 13.3 SSH 安全

- 禁用密码登录
- 使用密钥认证
- 限制 root 登录 (可选)

---

## 14. 域名注册与配置清单

### 14.1 域名注册

1. 在域名注册商 (如 Namecheap, Cloudflare) 注册 `n8n-library.com`
2. 将域名转入 Cloudflare (如果不在 Cloudflare)

### 14.2 Cloudflare 配置清单

- [ ] DNS A 记录指向 VPS IP
- [ ] SSL/TLS 设置为 Full (Strict)
- [ ] 开启 Always Use HTTPS
- [ ] 开启 Auto Minify
- [ ] 开启 Brotli
- [ ] 配置页面规则 (可选)

### 14.3 VPS 配置清单

- [ ] 创建项目目录 `/opt/docker-projects/n8n-library`
- [ ] 配置 docker-compose.yml
- [ ] 配置 Nginx
- [ ] 配置反向代理
- [ ] 测试健康检查
- [ ] 设置 GitHub Actions secrets

---

**文档结束**
