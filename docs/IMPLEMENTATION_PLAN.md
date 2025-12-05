# n8n-library.com 详细实施方案

> **版本**: v1.0
> **更新日期**: 2024-11-30
> **状态**: 待执行

---

## 目录

1. [项目概述](#1-项目概述)
2. [数据源分析](#2-数据源分析)
3. [竞品分析洞察](#3-竞品分析洞察)
4. [技术架构](#4-技术架构)
5. [Phase 1: 数据基础](#5-phase-1-数据基础)
6. [Phase 2: 前端基础](#6-phase-2-前端基础)
7. [Phase 3: 页面开发](#7-phase-3-页面开发)
8. [Phase 4: 搜索与 UX](#8-phase-4-搜索与-ux)
9. [Phase 5: SEO 与内容](#9-phase-5-seo-与内容)
10. [Phase 6: 部署上线](#10-phase-6-部署上线)
11. [开发顺序清单](#11-开发顺序清单)
12. [潜在问题与解决方案](#12-潜在问题与解决方案)

---

## 1. 项目概述

### 1.1 项目定位

**n8n-library.com** 是一个非官方的 n8n 工作流模板社区库，聚合来自 GitHub 的开源工作流资源。

| 维度 | 定位 |
|------|------|
| **目标用户** | 学习者、开发者、自动化探索者 |
| **核心价值** | 发现 + 学习 + SEO 长尾流量 |
| **数据来源** | GitHub 开源聚合 (自动化同步) |
| **成本** | ~$1/月 (域名) |
| **差异化** | 精选策展 vs 海量堆砌 |

### 1.2 数据规模

| 来源 | 数量 | 质量 |
|------|------|------|
| awesome-n8n-templates | 288 | ⭐⭐⭐⭐⭐ 人工精选 |
| n8n-workflows | 2,061+ | ⭐⭐⭐ 社区贡献 |
| **总计** | ~2,349 | - |

### 1.3 页面规模预估

| 页面类型 | 数量 |
|----------|------|
| 首页 | 1 |
| 目录页 | 1 |
| 搜索页 | 1 |
| 分类页 | 8 |
| 集成页 | 50+ |
| 详情页 | ~2,349 |
| 静态页 | 2 |
| **总计** | ~2,412 |

---

## 2. 数据源分析

### 2.1 awesome-n8n-templates (精选库)

**仓库**: https://github.com/enescingoz/awesome-n8n-templates

**目录结构**:
```
awesome-n8n-templates/
├── AI_Research_RAG_and_Data_Analysis/
├── OpenAI_and_LLMs/
├── Gmail_and_Email_Automation/
├── Telegram/
├── Discord/
├── Slack/
├── WhatsApp/
├── Google_Drive_and_Google_Sheets/
├── Notion/
├── Airtable/
├── Forms_and_Surveys/
├── Database_and_Storage/
├── PDF_and_Document_Processing/
├── Instagram_Twitter_Social_Media/
├── WordPress/
├── HR_and_Recruitment/
├── devops/
├── Other_Integrations_and_Use_Cases/
└── README.md  # 包含 Title, Description, Department 表格
```

**特点**:
- 文件夹名即分类
- README 包含结构化元数据表格
- 质量高，有详细描述
- 大部分有 StickyNote 说明

**文件夹 → 分类映射**:
```javascript
const AWESOME_FOLDER_MAP = {
  'AI_Research_RAG_and_Data_Analysis': 'ai-automation',
  'OpenAI_and_LLMs': 'ai-automation',
  'Gmail_and_Email_Automation': 'communication',
  'Telegram': 'communication',
  'Discord': 'communication',
  'Slack': 'communication',
  'WhatsApp': 'communication',
  'Google_Drive_and_Google_Sheets': 'productivity',
  'Notion': 'productivity',
  'Airtable': 'productivity',
  'Forms_and_Surveys': 'productivity',
  'Database_and_Storage': 'data-processing',
  'PDF_and_Document_Processing': 'data-processing',
  'Instagram_Twitter_Social_Media': 'social-media',
  'WordPress': 'productivity',
  'HR_and_Recruitment': 'crm-sales',
  'devops': 'devops',
  'Other_Integrations_and_Use_Cases': 'utilities',
  'Other': 'utilities',
};
```

### 2.2 n8n-workflows (社区库)

**仓库**: https://github.com/Zie619/n8n-workflows

**目录结构**:
```
n8n-workflows/
├── workflows/              # 主目录，190 个子文件夹
│   ├── Manual/            # 391 个文件
│   ├── Splitout/          # 194 个文件
│   ├── Code/              # 183 个文件
│   ├── Http/              # 176 个文件
│   ├── Telegram/          # 119 个文件
│   ├── Wait/              # 104 个文件
│   ├── Webhook/           # 65 个文件
│   └── ... (更多服务文件夹)
├── context/
│   ├── def_categories.json     # 服务 → 分类映射
│   ├── unique_categories.json  # 分类定义
│   └── search_categories.json  # 搜索分类
├── templates/              # 精选模板
└── README.md
```

**命名规范**:
```
[ID]_[ServiceA]_[ServiceB]_[Trigger].json

示例:
0756_Airtable_Create_Triggered.json
0015_HTTP_Cron_Update_Webhook.json
1120_Airtable_Mindee_Automate_Webhook.json
```

**JSON 结构**:
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "active": boolean,
  "nodes": [...],
  "connections": {...},
  "settings": {...},
  "meta": {
    "instanceId": "string",
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601",
    "license": "MIT",
    "category": "string",
    "status": "active",
    "priority": "high"
  },
  "tags": ["string"]
}
```

**关键文件 - context/def_categories.json**:
```json
{
  "AI Agent Development": ["openai", "anthropic", "langchain", ...],
  "Communication & Messaging": ["telegram", "slack", "discord", ...],
  "CRM & Sales": ["hubspot", "salesforce", "pipedrive", ...],
  // ... 15 个分类
}
```

### 2.3 数据质量对比

| 维度 | awesome-n8n | n8n-workflows |
|------|-------------|---------------|
| 描述完整性 | 95%+ | 30-40% |
| 命名规范性 | 高 | 中等 |
| StickyNote | 多数有 | 少数有 |
| 分类准确性 | 文件夹即分类 | 需要解析 |
| 更新频率 | 较慢 | 活跃 |

---

## 3. 竞品分析洞察

### 3.1 主要竞品

| 平台 | 模板数 | 模式 | 特点 |
|------|--------|------|------|
| **n8n.io/workflows** | 7,164+ | 免费 + Creator Program | 官方，海量，API 驱动 |
| **haveworkflow.com** | ~500 | 免费 + 付费 | 多平台 (n8n/Zapier/Make) |
| **n8nmarket.com** | ~200 | 付费为主 | Premium 定制服务 |

### 3.2 竞品 SEO 策略

**n8n.io**:
- Title: `Discover 2,156 Marketing Automation Workflows`
- 使用数字强调规模
- 按分类细分页面

**haveworkflow.com**:
- 教育内容 + 模板
- 社区论坛增加粘性
- 多平台覆盖

### 3.3 差异化机会

| 策略 | 说明 |
|------|------|
| **精选策展** | 质量 > 数量，不是海量堆砌 |
| **深度内容** | 每个模板配学习指南 |
| **长尾 SEO** | 专注特定用例搜索词 |
| **免费开源** | 完全透明，GitHub 托管 |

### 3.4 卡片设计最佳实践

基于竞品分析，卡片应包含:
- 集成图标 (最多 4 个 + N)
- 标题 (2 行截断)
- 描述 (2 行截断)
- Featured 徽章 (awesome 来源)
- 节点数量
- 分类标签

---

## 4. 技术架构

### 4.1 技术栈

| 层级 | 技术 | 理由 |
|------|------|------|
| **框架** | Next.js 14 (App Router) | SSG 最佳支持 |
| **语言** | TypeScript | 类型安全 |
| **样式** | Tailwind CSS + shadcn/ui | 快速开发 |
| **搜索** | Fuse.js | 客户端即时搜索 |
| **数据** | 静态 JSON | 零数据库成本 |
| **图标** | simple-icons + fallback | 覆盖率高 |
| **部署** | VPS + Nginx + Cloudflare | 符合 SOP |

### 4.2 目录结构

```
n8n-library/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Action
├── data/
│   └── raw/                        # Git Submodules
│       ├── awesome-n8n/
│       └── n8n-workflows/
├── scripts/
│   ├── build-data.js               # ETL 主脚本
│   ├── icon-map.js                 # 图标映射
│   └── category-rules.js           # 分类规则
├── public/
│   ├── data/
│   │   ├── index.json              # 搜索索引
│   │   ├── categories.json         # 分类数据
│   │   ├── integrations.json       # 集成数据
│   │   └── workflows/              # 详情 JSON
│   │       └── [slug].json
│   └── icons/
│       └── integrations/           # 本地图标
├── src/
│   ├── app/                        # Next.js App Router
│   ├── components/                 # React 组件
│   ├── lib/                        # 工具函数
│   └── styles/                     # 样式文件
├── config/
│   └── nginx.conf                  # Nginx 配置
├── docs/                           # 文档 (不提交)
├── docker-compose.yml
├── Makefile
├── next.config.js
├── tailwind.config.js
├── package.json
├── .gitmodules
└── README.md
```

### 4.3 数据流

```
┌─────────────────┐    ┌─────────────────┐
│ awesome-n8n     │    │ n8n-workflows   │
│ (Git Submodule) │    │ (Git Submodule) │
└────────┬────────┘    └────────┬────────┘
         │                      │
         └──────────┬───────────┘
                    ▼
         ┌─────────────────────┐
         │  scripts/build-data │
         │  - 解析 JSON        │
         │  - 提取元数据       │
         │  - 分类映射         │
         │  - 质量评分         │
         │  - 图标映射         │
         └──────────┬──────────┘
                    ▼
         ┌─────────────────────┐
         │  public/data/       │
         │  - index.json       │
         │  - categories.json  │
         │  - workflows/*.json │
         └──────────┬──────────┘
                    ▼
         ┌─────────────────────┐
         │  Next.js SSG        │
         │  ~2,400 静态页面    │
         └──────────┬──────────┘
                    ▼
         ┌─────────────────────┐
         │  /out 静态目录      │
         │  → Nginx 托管       │
         └─────────────────────┘
```

---

## 5. Phase 1: 数据基础

### 5.1 目录创建

```bash
# 在项目根目录执行
mkdir -p data/raw
mkdir -p scripts
mkdir -p public/data/workflows
mkdir -p public/icons/integrations
mkdir -p config
```

### 5.2 Git Submodule 配置

**.gitmodules**:
```ini
[submodule "data/raw/awesome-n8n"]
    path = data/raw/awesome-n8n
    url = https://github.com/enescingoz/awesome-n8n-templates.git
    branch = main

[submodule "data/raw/n8n-workflows"]
    path = data/raw/n8n-workflows
    url = https://github.com/Zie619/n8n-workflows.git
    branch = main
```

**初始化命令**:
```bash
git submodule add https://github.com/enescingoz/awesome-n8n-templates.git data/raw/awesome-n8n
git submodule add https://github.com/Zie619/n8n-workflows.git data/raw/n8n-workflows
git submodule update --init --recursive
```

### 5.3 ETL 脚本规范

详见 `/docs/ETL_SPECIFICATION.md`

**核心数据结构**:

```typescript
interface WorkflowMeta {
  id: string;                      // 唯一 hash ID
  slug: string;                    // URL slug
  name: string;                    // 显示名称
  description: string;             // 描述 (提取或生成)
  source: 'awesome' | 'community'; // 数据来源
  quality: 1 | 2 | 3 | 4 | 5;     // 质量评分
  sourceUrl: string;               // GitHub 原链接
  category: string;                // 分类 slug
  categoryName: string;            // 分类显示名
  tags: string[];                  // 搜索标签
  nodes: string[];                 // 节点类型列表
  nodeCount: number;               // 节点总数
  integrations: Integration[];     // 集成列表
  triggerType: string;             // 触发类型
  filePath: string;                // 原文件路径
  createdAt: string;               // 创建时间
}

interface Integration {
  name: string;                    // 显示名
  slug: string;                    // URL slug
  icon: string;                    // 图标来源
}

interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;                    // Emoji
  count: number;
  color: string;                   // Tailwind 颜色类
}
```

**质量评分算法**:

```javascript
// awesome 来源: 基础分 4
function calculateAwesomeQuality(json) {
  let score = 4;
  if (hasStickyNotes(json)) score++;  // +1 有 StickyNote
  return Math.min(score, 5);
}

// community 来源: 基础分 2
function calculateCommunityQuality(json, fileName) {
  let score = 2;
  if (json.name && !json.name.match(/^\d+$/)) score++;  // +1 有意义名称
  if (countNodes(json) > 5) score++;                     // +1 复杂度
  if (json.description || hasStickyNotes(json)) score++; // +1 有描述
  return Math.min(score, 5);
}
```

### 5.4 输出文件规范

**index.json** (~2MB, gzip ~400KB):
```json
[
  {
    "id": "abc123",
    "slug": "telegram-ai-chatbot",
    "name": "Telegram AI Chatbot with OpenAI",
    "description": "AI-powered chatbot that responds to Telegram messages...",
    "category": "ai-automation",
    "categoryName": "AI & Automation",
    "source": "awesome",
    "quality": 5,
    "nodeCount": 12,
    "integrations": ["telegram", "openai"],
    "triggerType": "webhook"
  },
  // ... ~2,349 条
]
```

**workflows/[slug].json**:
```json
{
  "id": "abc123",
  "slug": "telegram-ai-chatbot",
  "name": "Telegram AI Chatbot with OpenAI",
  "description": "Full description...",
  "source": "awesome",
  "quality": 5,
  "sourceUrl": "https://github.com/...",
  "category": "ai-automation",
  "categoryName": "AI & Automation",
  "tags": ["telegram", "openai", "chatbot", "ai"],
  "nodes": ["telegramTrigger", "openAi", "set", "telegramSend"],
  "nodeCount": 12,
  "integrations": [
    { "name": "Telegram", "slug": "telegram", "icon": "telegram" },
    { "name": "OpenAI", "slug": "openai", "icon": "openai" }
  ],
  "triggerType": "webhook",
  "filePath": "data/raw/awesome-n8n/Telegram/telegram-ai-chatbot.json",
  "createdAt": "2024-01-15T00:00:00Z",
  "workflow": {
    // 完整的 n8n JSON，用于下载
  }
}
```

**categories.json**:
```json
[
  {
    "slug": "ai-automation",
    "name": "AI & Automation",
    "description": "AI-powered workflows using OpenAI, LangChain, and more",
    "icon": "🤖",
    "count": 523,
    "color": "cat-ai"
  },
  // ... 8 个分类
]
```

**integrations.json**:
```json
[
  {
    "slug": "telegram",
    "name": "Telegram",
    "icon": "telegram",
    "count": 156,
    "categories": ["communication", "ai-automation"]
  },
  // ... Top 100 集成
]
```

### 5.5 验证清单

- [ ] 总 workflow 数量: ~2,349
- [ ] 无重复 slug
- [ ] 所有分类正确映射
- [ ] 所有集成有图标或 fallback
- [ ] index.json 大小 < 3MB
- [ ] 每个 workflow JSON 包含有效 n8n 结构
- [ ] 无空描述 (生成 fallback)

---

## 6. Phase 2: 前端基础

### 6.1 项目初始化

```bash
# 创建 Next.js 14 项目
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 安装依赖
npm install fuse.js lucide-react clsx tailwind-merge class-variance-authority
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-tabs
npm install react-syntax-highlighter
npm install next-sitemap

# 开发依赖
npm install -D @types/react-syntax-highlighter
```

### 6.2 Next.js 配置

**next.config.js**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',              // 静态导出
  trailingSlash: true,           // URL 末尾斜杠
  images: {
    unoptimized: true,           // 静态导出必需
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.simpleicons.org' },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
```

### 6.3 Tailwind 配置

**tailwind.config.js**:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // n8n 品牌色
        'n8n-orange': '#FF6D5A',
        'n8n-pink': '#EB4899',
        'n8n-purple': '#9333EA',
        // 分类颜色
        'cat-ai': '#8B5CF6',
        'cat-comm': '#3B82F6',
        'cat-prod': '#10B981',
        'cat-devops': '#F59E0B',
        'cat-crm': '#EC4899',
        'cat-ecom': '#EF4444',
        'cat-data': '#06B6D4',
        'cat-util': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### 6.4 核心组件规范

详见 `/docs/COMPONENT_SPEC.md`

**组件清单**:

| 组件 | 用途 | 依赖 |
|------|------|------|
| `WorkflowCard` | 模板卡片 | NodeIcons, Badge |
| `WorkflowGrid` | 卡片网格 | WorkflowCard |
| `NodeIcons` | 集成图标组 | - |
| `NodeFlow` | 简化流程图 | - |
| `SearchBar` | 搜索框 | - |
| `SearchFilters` | 筛选器 | Select, Checkbox |
| `CategoryGrid` | 分类网格 | Card |
| `CodeBlock` | JSON 代码块 | react-syntax-highlighter |
| `CopyButton` | 复制按钮 | - |
| `ImportInstructions` | 导入说明 | Collapsible |

---

## 7. Phase 3: 页面开发

### 7.1 路由结构

```
src/app/
├── layout.tsx                  # 根布局
├── page.tsx                    # 首页
├── not-found.tsx               # 404
├── directory/
│   └── page.tsx                # 目录页
├── search/
│   └── page.tsx                # 搜索页 (CSR)
├── category/
│   └── [slug]/
│       └── page.tsx            # 分类页 (SSG)
├── integration/
│   └── [slug]/
│       └── page.tsx            # 集成页 (SSG)
├── workflow/
│   └── [slug]/
│       └── page.tsx            # 详情页 (SSG)
├── submit/
│   └── page.tsx                # 贡献指南
└── about/
    └── page.tsx                # 关于页
```

### 7.2 首页 (`/`)

**数据获取**:
```typescript
async function getHomePageData() {
  const indexData = await import('@/public/data/index.json');
  const categories = await import('@/public/data/categories.json');
  const integrations = await import('@/public/data/integrations.json');

  return {
    stats: {
      total: indexData.default.length,
      featured: indexData.default.filter(w => w.source === 'awesome').length,
    },
    featured: indexData.default
      .filter(w => w.source === 'awesome')
      .slice(0, 12),
    latest: indexData.default
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 12),
    categories: categories.default,
    topIntegrations: integrations.default.slice(0, 20),
  };
}
```

**页面区块**:
1. Hero + 统计数字
2. 分类网格 (8 个)
3. Featured 精选 (12 个)
4. 热门集成 (20 个图标)
5. 最新添加 (12 个)
6. Footer

### 7.3 分类页 (`/category/[slug]`)

**静态路径生成**:
```typescript
export async function generateStaticParams() {
  const categories = await import('@/public/data/categories.json');
  return categories.default.map(cat => ({ slug: cat.slug }));
}
```

**生成 8 个页面**:
- `/category/ai-automation`
- `/category/communication`
- `/category/productivity`
- `/category/devops`
- `/category/crm-sales`
- `/category/e-commerce`
- `/category/data-processing`
- `/category/utilities`

### 7.4 集成页 (`/integration/[slug]`)

**静态路径生成**:
```typescript
export async function generateStaticParams() {
  const integrations = await import('@/public/data/integrations.json');
  return integrations.default.slice(0, 50).map(int => ({ slug: int.slug }));
}
```

**生成 50+ 页面** (Top 集成):
- `/integration/openai`
- `/integration/telegram`
- `/integration/google-sheets`
- `/integration/slack`
- `/integration/notion`
- ...

### 7.5 详情页 (`/workflow/[slug]`)

**静态路径生成**:
```typescript
export async function generateStaticParams() {
  const index = await import('@/public/data/index.json');
  return index.default.map(w => ({ slug: w.slug }));
}
```

**生成 ~2,349 页面**

**页面区块**:
1. 面包屑导航
2. 标题 + 描述
3. 元信息 (分类、节点数、来源)
4. 节点流程可视化
5. 集成图标列表
6. 复制/下载按钮
7. JSON 代码块
8. 导入说明 (可折叠)
9. 相关推荐 (同分类/集成)

### 7.6 搜索页 (`/search`)

**客户端渲染 (CSR)**:
```typescript
'use client';

// URL 状态同步
// /search?q=telegram&category=communication&source=awesome&sort=quality
```

**功能**:
- Fuse.js 即时搜索
- URL 参数同步
- 筛选: 分类、来源、节点数
- 排序: 相关性、日期、质量、名称
- 虚拟滚动

---

## 8. Phase 4: 搜索与 UX

### 8.1 Fuse.js 配置

**src/lib/search.ts**:
```typescript
import Fuse from 'fuse.js';

const FUSE_OPTIONS: Fuse.IFuseOptions<WorkflowMeta> = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'description', weight: 0.25 },
    { name: 'integrations', weight: 0.2 },
    { name: 'tags', weight: 0.1 },
    { name: 'categoryName', weight: 0.05 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  useExtendedSearch: true,
};
```

### 8.2 URL 状态同步

```typescript
interface SearchState {
  q: string;                  // 搜索词
  category: string | null;    // 分类筛选
  source: 'all' | 'awesome' | 'community';
  sort: 'relevance' | 'date' | 'quality' | 'name';
  page: number;
}

// URL: /search?q=telegram&category=communication&source=awesome
```

### 8.3 筛选器配置

```typescript
interface FilterOptions {
  categories: string[];           // 多选
  source: 'all' | 'awesome' | 'community';
  nodeCount: { min: number; max: number };
  integrations: string[];         // 多选
  triggerType: string[];          // webhook, schedule, manual
  quality: number[];              // 1-5 星
}
```

### 8.4 虚拟滚动

使用 `@tanstack/react-virtual`:
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

// 只渲染可见项 (~20 个)
// 支持 2000+ 条目无性能问题
```

### 8.5 响应式断点

```css
/* Tailwind 断点 */
sm: 640px   /* 手机横屏 */
md: 768px   /* 平板 */
lg: 1024px  /* 桌面 */
xl: 1280px  /* 大屏 */

/* 卡片网格 */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

---

## 9. Phase 5: SEO 与内容

详见 `/docs/SEO_CONTENT_GUIDE.md`

### 9.1 Title/Description 模板

| 页面 | Title | Description |
|------|-------|-------------|
| 首页 | `2,348+ Free n8n Workflow Templates - n8n Library` | `Discover 2,348+ free n8n workflow templates. Browse AI automation, email marketing, CRM integrations and more. Copy & import in seconds.` |
| 分类 | `{Category} n8n Templates & Workflows - n8n Library` | `Browse {count} free n8n {category} templates. Ready-to-use workflows. One-click import.` |
| 集成 | `n8n {Integration} Workflow Templates - n8n Library` | `{count} n8n workflow templates using {Integration}. Ready-made automations.` |
| 详情 | `{Name} - Free n8n Template` | `{description} Free n8n template with {nodeCount} nodes. Uses {integrations}.` |
| 搜索 | `Search n8n Templates - n8n Library` | `Search 2,348+ free n8n workflow templates. Find automation workflows for any use case.` |

### 9.2 Schema.org 结构化数据

**详情页**:
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "name": "Telegram AI Chatbot with OpenAI",
  "description": "AI-powered chatbot workflow...",
  "programmingLanguage": "n8n Workflow JSON",
  "runtimePlatform": "n8n",
  "license": "MIT",
  "isAccessibleForFree": true,
  "author": {
    "@type": "Organization",
    "name": "n8n Community"
  }
}
```

**面包屑**:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://n8n-library.com/" },
    { "@type": "ListItem", "position": 2, "name": "AI Automation", "item": "https://n8n-library.com/category/ai-automation/" },
    { "@type": "ListItem", "position": 3, "name": "Telegram AI Chatbot" }
  ]
}
```

### 9.3 Sitemap 配置

**next-sitemap.config.js**:
```javascript
module.exports = {
  siteUrl: 'https://n8n-library.com',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,

  transform: async (config, path) => {
    if (path === '/') return { loc: path, priority: 1.0, changefreq: 'daily' };
    if (path.startsWith('/category/')) return { loc: path, priority: 0.9 };
    if (path.startsWith('/integration/')) return { loc: path, priority: 0.8 };
    return { loc: path, priority: 0.7 };
  },
};
```

### 9.4 robots.txt

```
User-agent: *
Allow: /

Sitemap: https://n8n-library.com/sitemap.xml

Disallow: /api/
Disallow: /data/*.json
```

---

## 10. Phase 6: 部署上线

详见 `/docs/DEPLOYMENT_GUIDE.md`

### 10.1 Docker 配置

**docker-compose.yml**:
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
```

### 10.2 Nginx 配置

**config/nginx.conf**:
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript;

    location /_next/static {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /data {
        expires 1h;
        add_header Cache-Control "public";
    }

    location / {
        try_files $uri $uri.html $uri/index.html /404.html;
        expires 1h;
    }

    error_page 404 /404.html;
}
```

### 10.3 Nginx Proxy 配置

添加到 `/opt/docker-projects/nginx-proxy/config/conf.d/default.conf`:

```nginx
server {
    listen 80;
    listen 443 ssl;
    http2 on;
    server_name n8n-library.com www.n8n-library.com;

    ssl_certificate /etc/nginx/ssl/server.crt;
    ssl_certificate_key /etc/nginx/ssl/server.key;

    location / {
        proxy_pass http://172.17.0.1:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

### 10.4 Makefile

```makefile
.PHONY: deploy build logs down clean

deploy: build
	@echo "Deploying n8n-library..."
	docker compose up -d

build:
	@echo "Building static site..."
	npm ci
	node scripts/build-data.js
	npm run build
	rm -rf data/dist
	mv out data/dist

logs:
	docker compose logs -f

down:
	docker compose down

clean:
	rm -rf data/dist out node_modules .next
```

### 10.5 GitHub Action

**.github/workflows/deploy.yml**:
```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # 每周日同步

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Update submodules
        run: git submodule update --remote --merge

      - name: Install & Build
        run: |
          npm ci
          node scripts/build-data.js
          npm run build

      - name: Deploy to VPS
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          source: "out/*"
          target: "/opt/docker-projects/n8n-library/data/dist"
```

---

## 11. 开发顺序清单

### Phase 1: 项目设置 (步骤 1-5)

| # | 任务 | 依赖 |
|---|------|------|
| 1 | 初始化 Next.js 项目 | - |
| 2 | 配置 next.config.js | 1 |
| 3 | 配置 tailwind.config.js | 1 |
| 4 | 创建 .gitmodules | 1 |
| 5 | 添加 Git Submodules | 4 |

### Phase 2: 数据管道 (步骤 6-10)

| # | 任务 | 依赖 |
|---|------|------|
| 6 | 创建 scripts/icon-map.js | 5 |
| 7 | 创建 scripts/category-rules.js | 5 |
| 8 | 创建 scripts/build-data.js | 6, 7 |
| 9 | 运行 ETL，生成 public/data/*.json | 8 |
| 10 | 验证输出数据 | 9 |

### Phase 3: 核心组件 (步骤 11-20)

| # | 任务 | 依赖 |
|---|------|------|
| 11 | 创建 src/lib/utils.ts | 1 |
| 12 | 创建 src/lib/constants.ts | 1 |
| 13 | 创建 src/lib/categories.ts | 12 |
| 14 | 创建 src/lib/icons.ts | 6, 12 |
| 15 | 创建 src/lib/data.ts | 9, 11 |
| 16 | 安装 shadcn/ui 组件 | 3 |
| 17 | 创建 src/components/ui/* | 16 |
| 18 | 创建 Header.tsx | 17 |
| 19 | 创建 Footer.tsx | 17 |
| 20 | 创建 Container.tsx | 17 |

### Phase 4: Workflow 组件 (步骤 21-29)

| # | 任务 | 依赖 |
|---|------|------|
| 21 | 创建 NodeIcons.tsx | 14, 17 |
| 22 | 创建 IntegrationBadge.tsx | 14, 17 |
| 23 | 创建 WorkflowCard.tsx | 21, 22 |
| 24 | 创建 WorkflowGrid.tsx | 23 |
| 25 | 创建 CategoryGrid.tsx | 13, 17 |
| 26 | 创建 NodeFlow.tsx | 17 |
| 27 | 创建 CodeBlock.tsx | 17 |
| 28 | 创建 CopyButton.tsx | 17 |
| 29 | 创建 ImportInstructions.tsx | 17 |

### Phase 5: 搜索组件 (步骤 30-32)

| # | 任务 | 依赖 |
|---|------|------|
| 30 | 创建 src/lib/search.ts | 15 |
| 31 | 创建 SearchBar.tsx | 17 |
| 32 | 创建 SearchFilters.tsx | 13, 17 |

### Phase 6: 页面 (步骤 33-42)

| # | 任务 | 依赖 |
|---|------|------|
| 33 | 创建 src/app/layout.tsx | 18, 19 |
| 34 | 创建 src/app/page.tsx (首页) | 15, 24, 25 |
| 35 | 创建 category/[slug]/page.tsx | 15, 24 |
| 36 | 创建 integration/[slug]/page.tsx | 15, 24 |
| 37 | 创建 workflow/[slug]/page.tsx | 15, 26-29 |
| 38 | 创建 search/page.tsx | 30-32, 24 |
| 39 | 创建 directory/page.tsx | 15, 24 |
| 40 | 创建 submit/page.tsx | 20 |
| 41 | 创建 about/page.tsx | 20 |
| 42 | 创建 not-found.tsx | 20 |

### Phase 7: SEO & 部署 (步骤 43-50)

| # | 任务 | 依赖 |
|---|------|------|
| 43 | 配置 next-sitemap.config.js | 34-42 |
| 44 | 添加 robots.txt | 43 |
| 45 | 添加结构化数据 | 34-42 |
| 46 | 创建 Dockerfile | - |
| 47 | 创建 docker-compose.yml | 46 |
| 48 | 创建 config/nginx.conf | - |
| 49 | 创建 Makefile | 47, 48 |
| 50 | 创建 .github/workflows/deploy.yml | 49 |

### Phase 8: 测试 & 上线 (步骤 51-56)

| # | 任务 | 依赖 |
|---|------|------|
| 51 | 测试构建流程 | 34-50 |
| 52 | 测试所有路由 | 51 |
| 53 | 性能审计 | 52 |
| 54 | SEO 审计 | 52 |
| 55 | 移动端测试 | 52 |
| 56 | 部署到生产 | 51-55 |

---

## 12. 潜在问题与解决方案

### 12.1 图标缺失

**问题**: 部分 n8n 集成没有 simple-icons 对应

**解决**: 三级 fallback
1. simple-icons CDN
2. 本地 SVG `/public/icons/integrations/`
3. 首字母占位符

### 12.2 JSON 文件过大

**问题**: index.json 可能达 2-3MB

**解决**:
1. Nginx Gzip 压缩 (~400KB)
2. 如需要可分片加载
3. 按需懒加载搜索索引

### 12.3 构建时间

**问题**: ~2,400 静态页面构建耗时

**解决**:
1. Next.js 并行生成
2. GitHub Actions 缓存 node_modules
3. 预期时间: 3-5 分钟

### 12.4 搜索架构

**现状**: Fuse.js 在 Node 端构建（`src/lib/search/engine.ts`），客户端只消费 `/api/workflows/search` JSON。

**收益**:
1. 不再向浏览器下发 2MB `index.json` + Fuse bundle，内存占用 <500KB。
2. 通过 `datasetHash` + `meta.json` 热重载，确保 Fuse 在数据更新后自动重建。
3. 客户端 VirtualizedGrid + skeleton 状态提升体验。

### 12.5 Slug 冲突

**问题**: 两个 workflow 可能生成相同 slug

**解决**:
```javascript
function generateUniqueSlug(name, existingSlugs) {
  let slug = slugify(name);
  let counter = 1;
  while (existingSlugs.has(slug)) {
    slug = `${slugify(name)}-${counter++}`;
  }
  existingSlugs.add(slug);
  return slug;
}
```

### 12.6 缺失描述

**问题**: 部分社区 workflow 无描述

**解决**: 自动生成
```javascript
function generateDescription(workflow) {
  const integrations = extractIntegrations(workflow);
  const trigger = detectTriggerType(workflow);

  if (integrations.length >= 2) {
    return `Automate ${integrations[0].name} and ${integrations[1].name} with this n8n workflow.`;
  }
  return `n8n automation workflow with ${workflow.nodeCount || 'multiple'} nodes.`;
}
```

---

## 附录 A: 分类定义

```javascript
const CATEGORIES = [
  {
    slug: 'ai-automation',
    name: 'AI & Automation',
    icon: '🤖',
    color: 'cat-ai',
    description: 'AI-powered workflows using OpenAI, Claude, LangChain',
    keywords: ['openai', 'anthropic', 'langchain', 'llm', 'gpt', 'chatgpt', 'ollama', 'huggingface'],
  },
  {
    slug: 'communication',
    name: 'Communication',
    icon: '💬',
    color: 'cat-comm',
    description: 'Messaging, email, and notification workflows',
    keywords: ['telegram', 'discord', 'slack', 'whatsapp', 'email', 'gmail', 'smtp', 'twilio'],
  },
  {
    slug: 'productivity',
    name: 'Productivity',
    icon: '📊',
    color: 'cat-prod',
    description: 'Task management, docs, and collaboration tools',
    keywords: ['notion', 'airtable', 'googlesheets', 'todoist', 'trello', 'asana', 'clickup'],
  },
  {
    slug: 'devops',
    name: 'DevOps',
    icon: '🔧',
    color: 'cat-devops',
    description: 'CI/CD, infrastructure, and developer tools',
    keywords: ['github', 'gitlab', 'docker', 'aws', 'jenkins', 'kubernetes', 'ssh'],
  },
  {
    slug: 'crm-sales',
    name: 'CRM & Sales',
    icon: '💼',
    color: 'cat-crm',
    description: 'Customer relationship and sales automation',
    keywords: ['hubspot', 'pipedrive', 'salesforce', 'zoho', 'intercom', 'zendesk'],
  },
  {
    slug: 'e-commerce',
    name: 'E-commerce',
    icon: '🛒',
    color: 'cat-ecom',
    description: 'Online store and payment workflows',
    keywords: ['shopify', 'woocommerce', 'stripe', 'paypal', 'magento', 'square'],
  },
  {
    slug: 'data-processing',
    name: 'Data Processing',
    icon: '💾',
    color: 'cat-data',
    description: 'Database, file, and data transformation',
    keywords: ['postgres', 'mysql', 'mongodb', 'redis', 'csv', 'pdf', 'excel', 'json', 'supabase'],
  },
  {
    slug: 'utilities',
    name: 'Utilities',
    icon: '🔌',
    color: 'cat-util',
    description: 'General purpose and miscellaneous workflows',
    keywords: ['webhook', 'http', 'cron', 'schedule', 'manual'],
  },
];
```

---

## 附录 B: 图标映射

```javascript
const ICON_MAP = {
  // Communication
  'telegram': 'telegram',
  'telegramTrigger': 'telegram',
  'slack': 'slack',
  'discord': 'discord',
  'gmail': 'gmail',
  'whatsapp': 'whatsapp',

  // AI/LLM
  'openAi': 'openai',
  'anthropic': 'anthropic',
  'googleGemini': 'googlegemini',

  // Productivity
  'notion': 'notion',
  'airtable': 'airtable',
  'googleSheets': 'googlesheets',
  'googleDrive': 'googledrive',

  // Databases
  'postgres': 'postgresql',
  'mysql': 'mysql',
  'mongodb': 'mongodb',
  'redis': 'redis',
  'supabase': 'supabase',

  // DevOps
  'github': 'github',
  'gitlab': 'gitlab',
  'docker': 'docker',

  // E-commerce
  'shopify': 'shopify',
  'stripe': 'stripe',
  'woocommerce': 'woocommerce',

  // Social
  'twitter': 'x',
  'linkedin': 'linkedin',
  'instagram': 'instagram',

  // Generic
  'httpRequest': 'curl',
  'webhook': null,  // 自定义图标
  'cron': null,     // 自定义图标
};
```

---

**文档结束**

下一步: 执行 Phase 1 数据基础任务
