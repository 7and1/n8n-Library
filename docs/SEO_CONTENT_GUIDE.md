# SEO 与内容策略指南

> **版本**: v1.0
> **更新日期**: 2024-11-30
> **目标**: 长尾 SEO 流量 + 用户价值

---

## 1. SEO 策略概述

### 1.1 目标关键词类型

| 类型 | 示例 | 页面 | 预估竞争 |
|------|------|------|----------|
| **品牌词** | n8n templates, n8n workflows | 首页 | 高 |
| **分类词** | n8n ai automation, n8n telegram bot | 分类页 | 中 |
| **集成词** | n8n openai workflow, n8n google sheets | 集成页 | 中低 |
| **长尾词** | how to connect telegram to openai n8n | 详情页 | 低 |
| **问题词** | n8n workflow examples, free n8n templates | 搜索页 | 中 |

### 1.2 SEO 架构

```
                    ┌─────────────────────┐
                    │      首页           │
                    │  (品牌 + 核心词)     │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼───────┐      ┌───────▼───────┐      ┌───────▼───────┐
│   分类页 x8    │      │   集成页 x50   │      │   目录页      │
│ (分类关键词)   │      │ (集成关键词)   │      │ (全量索引)    │
└───────┬───────┘      └───────┬───────┘      └───────────────┘
        │                      │
        └──────────┬───────────┘
                   │
           ┌───────▼───────┐
           │  详情页 x2,300 │
           │  (长尾关键词)  │
           └───────────────┘
```

---

## 2. 页面 SEO 模板

### 2.1 首页

**URL**: `https://n8n-library.com/`

**Title** (50-60 字符):
```
2,300+ Free n8n Workflow Templates - n8n Library
```

**Meta Description** (150-160 字符):
```
Discover 2,300+ free n8n workflow templates. Browse AI automation, email marketing, CRM integrations and more. Copy & import in seconds. Unofficial community collection.
```

**H1**:
```
2,300+ Free n8n Workflow Templates
```

**内容要点**:
- 统计数字突出 (2,300+, 8 categories, 50+ integrations)
- Unofficial community 声明
- 快速入口 (分类、热门集成)
- 精选推荐 (Featured)

### 2.2 分类页

**URL**: `https://n8n-library.com/category/{slug}/`

**Title 模板**:
```
{Category Name} n8n Templates & Workflows - n8n Library
```

**示例**:
```
AI & Automation n8n Templates & Workflows - n8n Library
```

**Meta Description 模板**:
```
Browse {count} free n8n {category} templates. Ready-to-use workflows for {use_cases}. Copy JSON and import instantly. Updated weekly.
```

**示例**:
```
Browse 523 free n8n AI automation templates. Ready-to-use workflows for OpenAI, LangChain, chatbots. Copy JSON and import instantly. Updated weekly.
```

**H1**:
```
{Icon} {Category Name} Workflows
```

**内容结构**:
1. 分类描述 (100-200 字)
2. 热门集成 (该分类下的)
3. Featured 精选
4. 全部 workflows (分页/虚拟滚动)

### 2.3 集成页

**URL**: `https://n8n-library.com/integration/{slug}/`

**Title 模板**:
```
n8n {Integration} Workflow Templates - n8n Library
```

**示例**:
```
n8n Telegram Workflow Templates - n8n Library
```

**Meta Description 模板**:
```
{count} n8n workflow templates using {Integration}. Automate {use_cases} with ready-made workflows. Free, open-source, one-click import.
```

**示例**:
```
156 n8n workflow templates using Telegram. Automate chatbots, notifications, message handling with ready-made workflows. Free, open-source, one-click import.
```

**H1**:
```
{Integration} n8n Workflows
```

**内容结构**:
1. 集成介绍 (50-100 字)
2. 常见用例
3. 相关集成 (常一起使用的)
4. 全部 workflows

### 2.4 详情页

**URL**: `https://n8n-library.com/workflow/{slug}/`

**Title 模板**:
```
{Workflow Name} - Free n8n Template
```

**示例**:
```
Telegram AI Chatbot with OpenAI GPT-4 - Free n8n Template
```

**Meta Description 模板**:
```
{description} Free n8n template with {nodeCount} nodes. Uses {integrations}. Copy JSON and import to your n8n instance instantly.
```

**示例**:
```
AI-powered chatbot that responds to Telegram messages using GPT-4. Free n8n template with 12 nodes. Uses Telegram, OpenAI. Copy JSON and import instantly.
```

**H1**:
```
{Workflow Name}
```

**内容结构**:
1. 描述
2. 元信息 (分类、节点数、来源)
3. 节点流程可视化
4. 集成列表
5. JSON 代码块
6. 导入说明
7. 相关推荐

### 2.5 搜索页

**URL**: `https://n8n-library.com/search/`

**Title**:
```
Search n8n Workflow Templates - n8n Library
```

**Meta Description**:
```
Search 2,300+ free n8n workflow templates. Filter by category, integration, or use case. Find the perfect automation for your needs.
```

**注意**: 搜索页是 CSR，需要确保:
- 有基础 HTML 内容 (无 JS 时显示)
- 使用 `noindex` 避免重复内容问题

### 2.6 目录页

**URL**: `https://n8n-library.com/directory/`

**Title**:
```
All n8n Workflow Templates A-Z - n8n Library
```

**Meta Description**:
```
Complete directory of 2,300+ n8n workflow templates. Browse alphabetically or by category. Find every automation template in one place.
```

---

## 3. 结构化数据

### 3.1 Organization (全站)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "n8n Library",
  "url": "https://n8n-library.com",
  "description": "Unofficial community collection of n8n workflow templates",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://n8n-library.com/search/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### 3.2 BreadcrumbList (所有页面)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://n8n-library.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "AI & Automation",
      "item": "https://n8n-library.com/category/ai-automation/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Telegram AI Chatbot"
    }
  ]
}
```

### 3.3 SoftwareSourceCode (详情页)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "name": "Telegram AI Chatbot with OpenAI GPT-4",
  "description": "AI-powered chatbot that responds to Telegram messages using OpenAI GPT-4",
  "programmingLanguage": "n8n Workflow JSON",
  "runtimePlatform": "n8n",
  "license": "https://opensource.org/licenses/MIT",
  "isAccessibleForFree": true,
  "dateCreated": "2024-01-15",
  "dateModified": "2024-06-20",
  "author": {
    "@type": "Organization",
    "name": "n8n Community"
  },
  "codeRepository": "https://github.com/enescingoz/awesome-n8n-templates",
  "keywords": ["n8n", "telegram", "openai", "chatbot", "automation"]
}
```

### 3.4 ItemList (分类页/集成页)

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "AI & Automation n8n Workflows",
  "description": "Collection of AI-powered n8n workflow templates",
  "numberOfItems": 523,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "url": "https://n8n-library.com/workflow/telegram-ai-chatbot/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "url": "https://n8n-library.com/workflow/openai-document-analyzer/"
    }
  ]
}
```

---

## 4. 技术 SEO

### 4.1 Sitemap 配置

**next-sitemap.config.js**:
```javascript
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://n8n-library.com',
  generateRobotsTxt: true,
  sitemapSize: 5000,

  // 排除搜索页
  exclude: ['/search', '/search/*'],

  // 自定义优先级
  transform: async (config, path) => {
    // 首页
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }

    // 分类页
    if (path.startsWith('/category/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.9,
      };
    }

    // 集成页
    if (path.startsWith('/integration/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
      };
    }

    // 详情页
    if (path.startsWith('/workflow/')) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.7,
      };
    }

    // 其他页面
    return {
      loc: path,
      changefreq: 'monthly',
      priority: 0.5,
    };
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/data/*.json'],
      },
    ],
    additionalSitemaps: [
      'https://n8n-library.com/sitemap-0.xml',
    ],
  },
};
```

### 4.2 robots.txt

```
# robots.txt for n8n-library.com

User-agent: *
Allow: /

# Block raw data files
Disallow: /data/
Disallow: /_next/

# Block search with query params (avoid duplicate content)
Disallow: /search?*

# Sitemap
Sitemap: https://n8n-library.com/sitemap.xml
```

### 4.3 Canonical URLs

每个页面必须有 canonical 标签:

```tsx
// src/app/workflow/[slug]/page.tsx
export async function generateMetadata({ params }) {
  return {
    alternates: {
      canonical: `https://n8n-library.com/workflow/${params.slug}/`,
    },
  };
}
```

### 4.4 Open Graph

```tsx
// src/app/layout.tsx
export const metadata = {
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://n8n-library.com',
    siteName: 'n8n Library',
    images: [
      {
        url: 'https://n8n-library.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'n8n Library - Free Workflow Templates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@n8n_library',  // 如果有的话
  },
};
```

### 4.5 性能优化 (Core Web Vitals)

| 指标 | 目标 | 策略 |
|------|------|------|
| **LCP** | < 2.5s | 静态生成、CDN、图片懒加载 |
| **FID** | < 100ms | 最小化 JS、代码分割 |
| **CLS** | < 0.1 | 预留图片空间、字体预加载 |

**具体措施**:

1. **静态生成**: 所有页面 SSG
2. **图片优化**: 使用 Next.js Image (unoptimized 但指定尺寸)
3. **字体预加载**:
   ```tsx
   // src/app/layout.tsx
   import { Inter } from 'next/font/google';
   const inter = Inter({ subsets: ['latin'] });
   ```
4. **CSS 优化**: Tailwind purge 未使用样式
5. **JS 分割**: 搜索页按需加载

---

## 5. 内容策略

### 5.1 页面内容最低要求

| 页面类型 | 最低字数 | 内容要求 |
|----------|----------|----------|
| 首页 | 500+ | 价值主张、统计、使用指南 |
| 分类页 | 300+ | 分类描述、用例、热门推荐 |
| 集成页 | 200+ | 集成介绍、常见用例 |
| 详情页 | 150+ | 描述、导入说明、相关推荐 |
| About | 500+ | 项目介绍、免责声明、贡献指南 |

### 5.2 首页内容示例

```markdown
# 2,300+ Free n8n Workflow Templates

Discover the largest unofficial collection of n8n automation templates.
Browse, copy, and import ready-made workflows in seconds.

## Why n8n Library?

- **Free & Open Source**: All templates are free to use
- **GitHub-Sourced**: Curated from active open-source repositories
- **One-Click Import**: Copy JSON and paste into your n8n instance
- **Weekly Updates**: Automatically synced with upstream sources

## Featured Categories

[Category Grid]

## How It Works

1. **Browse** - Explore templates by category or integration
2. **Preview** - See node flow and requirements
3. **Copy** - One-click JSON copy
4. **Import** - Paste into n8n and configure credentials

## Data Sources

This site aggregates workflows from:
- [awesome-n8n-templates](https://github.com/enescingoz/awesome-n8n-templates) - 288 curated templates
- [n8n-workflows](https://github.com/Zie619/n8n-workflows) - 2,061 community workflows

**Disclaimer**: This is an unofficial community project. Not affiliated with n8n GmbH.
```

### 5.3 分类页内容模板

```markdown
# 🤖 AI & Automation Workflows

Supercharge your automation with AI-powered n8n workflows.
Connect OpenAI, Claude, LangChain, and other AI services to build intelligent automation.

## Popular AI Integrations

[Integration Badges: OpenAI, Anthropic, LangChain, Ollama, HuggingFace]

## What You Can Build

- **Chatbots**: Telegram, Slack, Discord bots powered by GPT
- **Document Processing**: Extract, summarize, translate documents
- **Content Generation**: Blog posts, social media, emails
- **Data Analysis**: Automated insights from your data

## Featured Templates

[Featured Grid - 6 items]

## All AI Templates ({count})

[Full Grid with filters]
```

### 5.4 详情页内容模板

```markdown
# Telegram AI Chatbot with OpenAI GPT-4

AI-powered chatbot that responds to Telegram messages using OpenAI's GPT-4 model.
Supports text chat, image generation, and multilingual responses.

## Overview

| Category | AI & Automation |
| Nodes | 12 |
| Source | Featured (awesome-n8n-templates) |
| Trigger | Webhook |

## Workflow Flow

[NodeFlow Component]

## Integrations Used

[Integration Badges: Telegram, OpenAI, Webhook]

## JSON Code

[CodeBlock with Copy Button]

## How to Import

1. Copy the JSON above
2. In n8n, go to **Workflows** → **Import from URL/File**
3. Paste the JSON and click **Import**
4. Configure your credentials:
   - Telegram Bot Token
   - OpenAI API Key

## Related Workflows

[Related Grid - 3 items]
```

---

## 6. 内部链接策略

### 6.1 链接层级

```
首页
├── 链接到所有分类页
├── 链接到 Top 20 集成页
├── 链接到 Featured 详情页
└── 链接到 About, Submit

分类页
├── 链接到父级 (首页)
├── 链接到相关集成页
├── 链接到该分类的详情页
└── 链接到其他分类 (侧边栏)

集成页
├── 链接到父级 (首页)
├── 链接到相关分类页
├── 链接到该集成的详情页
└── 链接到相关集成 (常一起使用)

详情页
├── 面包屑导航 (首页 > 分类 > 当前)
├── 链接到分类页
├── 链接到集成页
├── 链接到相关详情页
└── 链接到源 GitHub 仓库
```

### 6.2 面包屑导航

每个非首页都应有面包屑:

```tsx
// src/components/Breadcrumb.tsx
interface BreadcrumbItem {
  name: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
      <ol className="flex items-center gap-1">
        <li>
          <Link href="/" className="hover:text-foreground">Home</Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <ChevronRight className="w-3 h-3" />
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground">
                {item.name}
              </Link>
            ) : (
              <span className="text-foreground">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

### 6.3 相关推荐算法

详情页底部的相关推荐:

```typescript
function getRelatedWorkflows(current: WorkflowMeta, all: WorkflowMeta[], limit = 3): WorkflowMeta[] {
  // 评分系统
  const scores = all
    .filter(w => w.id !== current.id)
    .map(w => {
      let score = 0;

      // 同分类 +3
      if (w.category === current.category) score += 3;

      // 共享集成 +2 per integration
      const sharedIntegrations = w.integrations.filter(i =>
        current.integrations.includes(i)
      );
      score += sharedIntegrations.length * 2;

      // 同来源 +1
      if (w.source === current.source) score += 1;

      // 质量加权 +0.5 per quality point
      score += w.quality * 0.5;

      return { workflow: w, score };
    })
    .sort((a, b) => b.score - a.score);

  return scores.slice(0, limit).map(s => s.workflow);
}
```

---

## 7. 监控与分析

### 7.1 Google Search Console

提交后监控:
- 索引覆盖率 (目标: 100%)
- 核心网页指标
- 搜索性能 (点击、展示、CTR)
- 移动可用性

### 7.2 关键指标

| 指标 | 目标 | 工具 |
|------|------|------|
| 索引页面数 | ~2,400 | Google Search Console |
| 平均 CTR | > 3% | Google Search Console |
| 跳出率 | < 60% | Analytics |
| 页面停留时间 | > 1min | Analytics |
| LCP | < 2.5s | Lighthouse |

### 7.3 Schema 测试

上线前使用 [Schema Markup Validator](https://validator.schema.org/) 验证所有结构化数据。

---

## 8. 内容更新计划

### 8.1 自动更新

- **每周**: GitHub Action 同步上游数据
- **每次构建**: 更新 sitemap lastmod

### 8.2 手动优化

- **月度**: 审查 Search Console 数据，优化低 CTR 页面
- **季度**: 添加新内容页 (教程、最佳实践)

---

**文档结束**
