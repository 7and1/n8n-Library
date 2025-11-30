# ETL 数据管道规范

> **版本**: v1.0
> **更新日期**: 2024-11-30
> **脚本位置**: `scripts/build-data.js`

---

## 1. 概述

ETL (Extract, Transform, Load) 脚本负责从两个 Git Submodule 数据源解析 n8n 工作流 JSON 文件，提取元数据，进行分类映射和质量评分，最终生成供前端使用的静态 JSON 文件。

### 1.1 数据流

```
data/raw/awesome-n8n/       ─┐
                             ├─→ scripts/build-data.js ─→ public/data/
data/raw/n8n-workflows/     ─┘

输入:
  - ~288 个 JSON (awesome-n8n)
  - ~2,061 个 JSON (n8n-workflows)

输出:
  - public/data/index.json          (~2MB)
  - public/data/categories.json     (~2KB)
  - public/data/integrations.json   (~10KB)
  - public/data/workflows/[slug].json (每个 ~5-50KB)
```

### 1.2 运行命令

```bash
node scripts/build-data.js

# 带调试输出
DEBUG=1 node scripts/build-data.js

# 只处理 awesome 库
node scripts/build-data.js --source=awesome

# 只处理 community 库
node scripts/build-data.js --source=community
```

---

## 2. 数据结构定义

### 2.1 WorkflowMeta (索引元数据)

```typescript
interface WorkflowMeta {
  // 标识
  id: string;                      // 唯一 hash (基于文件路径)
  slug: string;                    // URL-safe slug (用于路由)

  // 基本信息
  name: string;                    // 显示名称
  description: string;             // 描述 (200字符截断)

  // 来源与质量
  source: 'awesome' | 'community'; // 数据来源
  quality: 1 | 2 | 3 | 4 | 5;     // 质量评分
  sourceUrl: string;               // GitHub 原文件链接

  // 分类
  category: string;                // 分类 slug
  categoryName: string;            // 分类显示名
  tags: string[];                  // 搜索标签

  // 节点信息
  nodes: string[];                 // 节点类型列表 (去重)
  nodeCount: number;               // 节点总数
  integrations: string[];          // 集成 slug 列表 (索引用)
  triggerType: string;             // 触发类型

  // 时间
  createdAt: string;               // ISO 8601 日期
}
```

### 2.2 WorkflowDetail (详情数据)

```typescript
interface WorkflowDetail extends WorkflowMeta {
  // 扩展字段
  fullDescription: string;         // 完整描述
  integrationDetails: Integration[]; // 集成详情
  filePath: string;                // 原文件路径

  // 原始 n8n JSON
  workflow: object;                // 完整 n8n JSON (用于下载)
}

interface Integration {
  name: string;                    // 显示名 (e.g., "Telegram")
  slug: string;                    // URL slug (e.g., "telegram")
  icon: string;                    // simple-icons slug 或 URL
}
```

### 2.3 Category (分类)

```typescript
interface Category {
  slug: string;                    // URL slug
  name: string;                    // 显示名
  description: string;             // 分类描述
  icon: string;                    // Emoji 图标
  count: number;                   // workflow 数量
  color: string;                   // Tailwind 颜色类
}
```

### 2.4 IntegrationSummary (集成摘要)

```typescript
interface IntegrationSummary {
  slug: string;                    // URL slug
  name: string;                    // 显示名
  icon: string;                    // 图标来源
  count: number;                   // workflow 数量
  categories: string[];            // 相关分类
}
```

---

## 3. 分类映射规则

### 3.1 Awesome 库映射 (文件夹 → 分类)

```javascript
// scripts/category-rules.js

const AWESOME_FOLDER_MAP = {
  // AI & Automation
  'AI_Research_RAG_and_Data_Analysis': 'ai-automation',
  'OpenAI_and_LLMs': 'ai-automation',

  // Communication
  'Gmail_and_Email_Automation': 'communication',
  'Telegram': 'communication',
  'Discord': 'communication',
  'Slack': 'communication',
  'WhatsApp': 'communication',
  'Instagram_Twitter_Social_Media': 'communication',

  // Productivity
  'Google_Drive_and_Google_Sheets': 'productivity',
  'Notion': 'productivity',
  'Airtable': 'productivity',
  'Forms_and_Surveys': 'productivity',
  'WordPress': 'productivity',

  // Data Processing
  'Database_and_Storage': 'data-processing',
  'PDF_and_Document_Processing': 'data-processing',

  // CRM & Sales
  'HR_and_Recruitment': 'crm-sales',

  // DevOps
  'devops': 'devops',

  // Utilities
  'Other_Integrations_and_Use_Cases': 'utilities',
  'Other': 'utilities',
};
```

### 3.2 Community 库映射 (节点关键词 → 分类)

```javascript
// 基于 n8n-workflows/context/def_categories.json

const NODE_CATEGORY_RULES = {
  'ai-automation': [
    'openai', 'anthropic', 'langchain', 'llm', 'gpt', 'ai',
    'chatgpt', 'ollama', 'huggingface', 'cohere', 'gemini',
    'claude', 'mistral', 'replicate', 'stability'
  ],

  'communication': [
    'telegram', 'discord', 'slack', 'whatsapp', 'email',
    'gmail', 'smtp', 'twilio', 'sendgrid', 'mailchimp',
    'mailgun', 'postmark', 'outlook', 'imap', 'mattermost'
  ],

  'productivity': [
    'notion', 'airtable', 'googlesheets', 'todoist', 'trello',
    'asana', 'clickup', 'monday', 'googledocs', 'dropbox',
    'googledrive', 'onedrive', 'box', 'confluence', 'jira'
  ],

  'devops': [
    'ssh', 'docker', 'github', 'gitlab', 'jenkins', 'aws',
    'kubernetes', 'terraform', 'ansible', 'cicd', 'bitbucket',
    'circleci', 'travisci', 'digitalocean', 'heroku'
  ],

  'crm-sales': [
    'hubspot', 'pipedrive', 'salesforce', 'zoho', 'intercom',
    'zendesk', 'freshdesk', 'crisp', 'drift', 'calendly',
    'lemlist', 'hunter', 'apollo', 'outreach'
  ],

  'e-commerce': [
    'shopify', 'woocommerce', 'stripe', 'paypal', 'magento',
    'bigcommerce', 'square', 'gumroad', 'paddle', 'chargebee'
  ],

  'data-processing': [
    'postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch',
    'csv', 'pdf', 'excel', 'json', 'xml', 'supabase',
    'firebase', 'dynamodb', 'snowflake', 'bigquery'
  ],

  'utilities': [
    'webhook', 'http', 'cron', 'schedule', 'manual',
    'code', 'function', 'set', 'merge', 'split'
  ]
};

// 分类优先级 (越小越优先)
const CATEGORY_PRIORITY = {
  'ai-automation': 1,
  'communication': 2,
  'productivity': 3,
  'crm-sales': 4,
  'e-commerce': 5,
  'devops': 6,
  'data-processing': 7,
  'utilities': 8,
};
```

### 3.3 分类决策逻辑

```javascript
function determineCategory(workflow, folderName, source) {
  // 1. Awesome 库: 直接用文件夹映射
  if (source === 'awesome') {
    return AWESOME_FOLDER_MAP[folderName] || 'utilities';
  }

  // 2. Community 库: 基于节点分析
  const nodes = extractNodeTypes(workflow);
  const categoryScores = {};

  for (const node of nodes) {
    const normalizedNode = node.toLowerCase().replace('n8n-nodes-base.', '');

    for (const [category, keywords] of Object.entries(NODE_CATEGORY_RULES)) {
      if (keywords.some(kw => normalizedNode.includes(kw))) {
        categoryScores[category] = (categoryScores[category] || 0) + 1;
      }
    }
  }

  // 3. 选择得分最高的分类
  if (Object.keys(categoryScores).length === 0) {
    return 'utilities';
  }

  // 同分时按优先级排序
  const sorted = Object.entries(categoryScores)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];  // 分数高优先
      return CATEGORY_PRIORITY[a[0]] - CATEGORY_PRIORITY[b[0]];  // 优先级
    });

  return sorted[0][0];
}
```

---

## 4. 质量评分算法

### 4.1 评分规则

| 来源 | 基础分 | 加分规则 |
|------|--------|----------|
| awesome | 4 | +1 有 StickyNote 描述 |
| community | 2 | +1 有意义名称, +1 节点数>5, +1 有描述 |

### 4.2 实现代码

```javascript
function calculateQuality(workflow, fileName, source) {
  if (source === 'awesome') {
    let score = 4;
    if (hasStickyNotes(workflow)) score++;
    return Math.min(score, 5);
  }

  // community
  let score = 2;

  // +1 有意义名称 (非纯数字/UUID)
  if (workflow.name && !workflow.name.match(/^[\d\-]+$|^[a-f0-9\-]{36}$/i)) {
    score++;
  }

  // +1 节点数 > 5
  const nodeCount = countNodes(workflow);
  if (nodeCount > 5) score++;

  // +1 有描述
  if (workflow.description || hasStickyNotes(workflow)) {
    score++;
  }

  return Math.min(score, 5);
}

function hasStickyNotes(workflow) {
  return (workflow.nodes || []).some(
    node => node.type === 'n8n-nodes-base.stickyNote' && node.parameters?.content
  );
}

function countNodes(workflow) {
  return (workflow.nodes || []).length;
}
```

---

## 5. 集成提取

### 5.1 忽略的工具节点

```javascript
const UTILITY_NODES = [
  'n8n-nodes-base.set',
  'n8n-nodes-base.function',
  'n8n-nodes-base.functionItem',
  'n8n-nodes-base.noOp',
  'n8n-nodes-base.stickyNote',
  'n8n-nodes-base.merge',
  'n8n-nodes-base.if',
  'n8n-nodes-base.switch',
  'n8n-nodes-base.splitInBatches',
  'n8n-nodes-base.code',
  'n8n-nodes-base.manualTrigger',
  'n8n-nodes-base.start',
  'n8n-nodes-base.executeCommand',
  'n8n-nodes-base.filter',
  'n8n-nodes-base.sort',
  'n8n-nodes-base.limit',
  'n8n-nodes-base.itemLists',
  'n8n-nodes-base.dateTime',
  'n8n-nodes-base.crypto',
  'n8n-nodes-base.xml',
  'n8n-nodes-base.html',
  'n8n-nodes-base.markdown',
  'n8n-nodes-base.renameKeys',
  'n8n-nodes-base.respondToWebhook',
  'n8n-nodes-base.wait',
  'n8n-nodes-base.executeWorkflow',
  'n8n-nodes-base.errorTrigger',
  'n8n-nodes-base.stopAndError',
];

function isUtilityNode(nodeType) {
  return UTILITY_NODES.includes(nodeType);
}
```

### 5.2 提取逻辑

```javascript
function extractIntegrations(workflow) {
  const nodes = workflow.nodes || [];
  const integrations = new Map();

  for (const node of nodes) {
    const nodeType = node.type || '';

    // 跳过工具节点
    if (isUtilityNode(nodeType)) continue;

    // 提取集成名
    const integrationName = normalizeIntegrationName(nodeType);
    if (!integrationName) continue;

    if (!integrations.has(integrationName)) {
      integrations.set(integrationName, {
        name: formatDisplayName(integrationName),
        slug: slugify(integrationName),
        icon: getIconForIntegration(integrationName),
      });
    }
  }

  return Array.from(integrations.values());
}

function normalizeIntegrationName(nodeType) {
  // n8n-nodes-base.telegram → telegram
  // n8n-nodes-base.telegramTrigger → telegram

  const match = nodeType.match(/n8n-nodes-base\.(.+)/);
  if (!match) return null;

  let name = match[1];

  // 移除 Trigger 后缀
  name = name.replace(/Trigger$/i, '');

  // 常见映射
  const mappings = {
    'googlesheets': 'google-sheets',
    'googledrive': 'google-drive',
    'googledocs': 'google-docs',
    'microsoftoutlook': 'outlook',
    'microsoftexcel': 'excel',
    'microsoftteams': 'teams',
  };

  return mappings[name.toLowerCase()] || name;
}

function formatDisplayName(name) {
  // telegram → Telegram
  // google-sheets → Google Sheets

  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
```

---

## 6. 触发类型检测

```javascript
function detectTriggerType(workflow) {
  const nodes = workflow.nodes || [];

  for (const node of nodes) {
    const type = (node.type || '').toLowerCase();

    if (type.includes('webhook')) return 'webhook';
    if (type.includes('schedule') || type.includes('cron')) return 'schedule';
    if (type.includes('trigger') && !type.includes('manual')) {
      // 服务触发器 (e.g., telegramTrigger, gmailTrigger)
      return 'event';
    }
  }

  return 'manual';
}
```

---

## 7. 描述生成

### 7.1 提取优先级

1. workflow.description (原生字段)
2. StickyNote 内容 (第一个)
3. workflow.meta.description
4. 自动生成

### 7.2 实现代码

```javascript
function extractDescription(workflow) {
  // 1. 原生 description
  if (workflow.description && workflow.description.trim()) {
    return cleanDescription(workflow.description);
  }

  // 2. StickyNote 内容
  const stickyNote = (workflow.nodes || []).find(
    n => n.type === 'n8n-nodes-base.stickyNote' && n.parameters?.content
  );
  if (stickyNote) {
    return cleanDescription(stickyNote.parameters.content);
  }

  // 3. meta.description
  if (workflow.meta?.description) {
    return cleanDescription(workflow.meta.description);
  }

  // 4. 自动生成
  return generateDescription(workflow);
}

function cleanDescription(text) {
  return text
    .replace(/[\n\r]+/g, ' ')     // 换行转空格
    .replace(/\s+/g, ' ')          // 多空格合并
    .replace(/[#*_`]/g, '')        // 移除 Markdown 符号
    .trim()
    .substring(0, 500);            // 截断
}

function generateDescription(workflow) {
  const integrations = extractIntegrations(workflow);
  const trigger = detectTriggerType(workflow);
  const nodeCount = countNodes(workflow);

  if (integrations.length >= 2) {
    const names = integrations.slice(0, 3).map(i => i.name);
    if (names.length === 2) {
      return `Automate ${names[0]} and ${names[1]} with this n8n workflow. Triggered by ${trigger}.`;
    }
    return `Connect ${names.join(', ')} and more with this n8n workflow. ${nodeCount} nodes total.`;
  }

  if (integrations.length === 1) {
    return `n8n workflow template for ${integrations[0].name} automation. ${nodeCount} nodes.`;
  }

  return `n8n automation workflow with ${nodeCount} nodes. ${trigger} triggered.`;
}
```

---

## 8. Slug 生成

### 8.1 规则

- URL-safe (a-z, 0-9, -)
- 小写
- 空格转连字符
- 特殊字符移除
- 唯一性保证 (冲突时加数字后缀)

### 8.2 实现代码

```javascript
const existingSlugs = new Set();

function generateSlug(name, source, id) {
  // 基础 slug
  let base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // 只保留字母数字空格连字符
    .replace(/\s+/g, '-')           // 空格转连字符
    .replace(/-+/g, '-')            // 多连字符合并
    .replace(/^-|-$/g, '')          // 移除首尾连字符
    .substring(0, 80);              // 限制长度

  // 空 slug 处理
  if (!base) {
    base = source === 'awesome' ? 'workflow' : `workflow-${id}`;
  }

  // 唯一性检查
  let slug = base;
  let counter = 1;

  while (existingSlugs.has(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }

  existingSlugs.add(slug);
  return slug;
}
```

---

## 9. 文件解析

### 9.1 Awesome 库解析

```javascript
const fs = require('fs');
const path = require('path');

const AWESOME_ROOT = 'data/raw/awesome-n8n';

function parseAwesomeLibrary() {
  const workflows = [];
  const folders = fs.readdirSync(AWESOME_ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const folder of folders) {
    const folderPath = path.join(AWESOME_ROOT, folder);
    const files = fs.readdirSync(folderPath)
      .filter(f => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(folderPath, file);

      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const json = JSON.parse(content);

        const workflow = parseWorkflow(json, filePath, folder, 'awesome');
        if (workflow) {
          workflows.push(workflow);
        }
      } catch (err) {
        console.error(`Error parsing ${filePath}: ${err.message}`);
      }
    }
  }

  return workflows;
}
```

### 9.2 Community 库解析

```javascript
const COMMUNITY_ROOT = 'data/raw/n8n-workflows/workflows';

function parseCommunityLibrary() {
  const workflows = [];
  const folders = fs.readdirSync(COMMUNITY_ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const folder of folders) {
    const folderPath = path.join(COMMUNITY_ROOT, folder);
    const files = fs.readdirSync(folderPath)
      .filter(f => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(folderPath, file);

      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const json = JSON.parse(content);

        const workflow = parseWorkflow(json, filePath, folder, 'community');
        if (workflow) {
          workflows.push(workflow);
        }
      } catch (err) {
        console.error(`Error parsing ${filePath}: ${err.message}`);
      }
    }
  }

  return workflows;
}
```

### 9.3 统一解析函数

```javascript
function parseWorkflow(json, filePath, folderName, source) {
  // 验证基本结构
  if (!json.nodes || !Array.isArray(json.nodes)) {
    console.warn(`Invalid workflow structure: ${filePath}`);
    return null;
  }

  const fileName = path.basename(filePath, '.json');
  const name = json.name || formatFileName(fileName);
  const id = generateHash(filePath);
  const slug = generateSlug(name, source, id);

  const category = determineCategory(json, folderName, source);
  const categoryName = CATEGORIES.find(c => c.slug === category)?.name || 'Utilities';

  const integrations = extractIntegrations(json);
  const description = extractDescription(json);

  return {
    id,
    slug,
    name,
    description: description.substring(0, 200),
    fullDescription: description,
    source,
    quality: calculateQuality(json, fileName, source),
    sourceUrl: buildSourceUrl(filePath, source),
    category,
    categoryName,
    tags: extractTags(json, name, integrations),
    nodes: extractNodeTypes(json),
    nodeCount: countNodes(json),
    integrations: integrations.map(i => i.slug),
    integrationDetails: integrations,
    triggerType: detectTriggerType(json),
    filePath,
    createdAt: json.meta?.createdAt || new Date().toISOString(),
    workflow: json,  // 完整 JSON
  };
}

function buildSourceUrl(filePath, source) {
  const relativePath = filePath.replace(/^data\/raw\//, '');
  const encodedPath = relativePath.split('/').map(encodeURIComponent).join('/');

  if (source === 'awesome') {
    return `https://github.com/enescingoz/awesome-n8n-templates/blob/main/${encodedPath}`;
  }
  return `https://github.com/Zie619/n8n-workflows/blob/main/${encodedPath}`;
}
```

---

## 10. 输出生成

### 10.1 index.json

```javascript
function generateIndex(workflows) {
  const indexData = workflows.map(w => ({
    id: w.id,
    slug: w.slug,
    name: w.name,
    description: w.description,
    category: w.category,
    categoryName: w.categoryName,
    source: w.source,
    quality: w.quality,
    nodeCount: w.nodeCount,
    integrations: w.integrations,
    triggerType: w.triggerType,
    createdAt: w.createdAt,
  }));

  fs.writeFileSync(
    'public/data/index.json',
    JSON.stringify(indexData, null, 0)  // 无缩进，减小体积
  );

  console.log(`Generated index.json with ${indexData.length} workflows`);
}
```

### 10.2 workflows/[slug].json

```javascript
function generateWorkflowFiles(workflows) {
  const dir = 'public/data/workflows';

  // 确保目录存在
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const w of workflows) {
    const detailData = {
      id: w.id,
      slug: w.slug,
      name: w.name,
      description: w.fullDescription,
      source: w.source,
      quality: w.quality,
      sourceUrl: w.sourceUrl,
      category: w.category,
      categoryName: w.categoryName,
      tags: w.tags,
      nodes: w.nodes,
      nodeCount: w.nodeCount,
      integrations: w.integrationDetails,
      triggerType: w.triggerType,
      filePath: w.filePath,
      createdAt: w.createdAt,
      workflow: w.workflow,
    };

    fs.writeFileSync(
      path.join(dir, `${w.slug}.json`),
      JSON.stringify(detailData, null, 0)
    );
  }

  console.log(`Generated ${workflows.length} workflow detail files`);
}
```

### 10.3 categories.json

```javascript
function generateCategories(workflows) {
  const counts = {};

  for (const w of workflows) {
    counts[w.category] = (counts[w.category] || 0) + 1;
  }

  const categories = CATEGORIES.map(cat => ({
    ...cat,
    count: counts[cat.slug] || 0,
  })).sort((a, b) => b.count - a.count);

  fs.writeFileSync(
    'public/data/categories.json',
    JSON.stringify(categories, null, 2)
  );

  console.log(`Generated categories.json with ${categories.length} categories`);
}
```

### 10.4 integrations.json

```javascript
function generateIntegrations(workflows) {
  const integrationMap = new Map();

  for (const w of workflows) {
    for (const int of w.integrationDetails) {
      if (!integrationMap.has(int.slug)) {
        integrationMap.set(int.slug, {
          slug: int.slug,
          name: int.name,
          icon: int.icon,
          count: 0,
          categories: new Set(),
        });
      }

      const entry = integrationMap.get(int.slug);
      entry.count++;
      entry.categories.add(w.category);
    }
  }

  const integrations = Array.from(integrationMap.values())
    .map(int => ({
      ...int,
      categories: Array.from(int.categories),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 100);  // Top 100

  fs.writeFileSync(
    'public/data/integrations.json',
    JSON.stringify(integrations, null, 2)
  );

  console.log(`Generated integrations.json with ${integrations.length} integrations`);
}
```

---

## 11. 主执行流程

```javascript
// scripts/build-data.js

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 导入规则
const { AWESOME_FOLDER_MAP, NODE_CATEGORY_RULES, CATEGORIES } = require('./category-rules');
const { ICON_MAP, getIconForIntegration } = require('./icon-map');

// ... (上述所有函数定义)

async function main() {
  console.log('🚀 Starting ETL process...\n');

  // 1. 解析数据源
  console.log('📂 Parsing awesome-n8n-templates...');
  const awesomeWorkflows = parseAwesomeLibrary();
  console.log(`   Found ${awesomeWorkflows.length} workflows\n`);

  console.log('📂 Parsing n8n-workflows...');
  const communityWorkflows = parseCommunityLibrary();
  console.log(`   Found ${communityWorkflows.length} workflows\n`);

  // 2. 合并
  const allWorkflows = [...awesomeWorkflows, ...communityWorkflows];
  console.log(`📊 Total workflows: ${allWorkflows.length}\n`);

  // 3. 生成输出
  console.log('📝 Generating output files...');
  generateIndex(allWorkflows);
  generateWorkflowFiles(allWorkflows);
  generateCategories(allWorkflows);
  generateIntegrations(allWorkflows);

  // 4. 统计
  console.log('\n✅ ETL complete!\n');
  printStats(allWorkflows);
}

function printStats(workflows) {
  const stats = {
    total: workflows.length,
    awesome: workflows.filter(w => w.source === 'awesome').length,
    community: workflows.filter(w => w.source === 'community').length,
    categories: new Set(workflows.map(w => w.category)).size,
    integrations: new Set(workflows.flatMap(w => w.integrations)).size,
    avgNodes: (workflows.reduce((sum, w) => sum + w.nodeCount, 0) / workflows.length).toFixed(1),
  };

  console.log('📈 Statistics:');
  console.log(`   Total workflows: ${stats.total}`);
  console.log(`   - Awesome: ${stats.awesome}`);
  console.log(`   - Community: ${stats.community}`);
  console.log(`   Categories: ${stats.categories}`);
  console.log(`   Unique integrations: ${stats.integrations}`);
  console.log(`   Avg nodes/workflow: ${stats.avgNodes}`);
}

// 辅助函数
function generateHash(str) {
  return crypto.createHash('md5').update(str).digest('hex').substring(0, 12);
}

function formatFileName(fileName) {
  // 0756_Airtable_Create_Triggered → Airtable Create Triggered
  return fileName
    .replace(/^\d+_/, '')           // 移除数字前缀
    .replace(/_/g, ' ')             // 下划线转空格
    .replace(/\s+/g, ' ')           // 多空格合并
    .trim();
}

function extractNodeTypes(workflow) {
  return [...new Set(
    (workflow.nodes || [])
      .map(n => n.type)
      .filter(Boolean)
  )];
}

function extractTags(workflow, name, integrations) {
  const tags = new Set();

  // 从名称提取
  name.toLowerCase().split(/\s+/).forEach(word => {
    if (word.length > 2) tags.add(word);
  });

  // 从集成提取
  integrations.forEach(int => tags.add(int.slug));

  // 从标签提取
  (workflow.tags || []).forEach(tag => tags.add(tag.toLowerCase()));

  return Array.from(tags).slice(0, 20);
}

main().catch(console.error);
```

---

## 12. 验证清单

运行 ETL 后检查:

- [ ] `public/data/index.json` 存在且非空
- [ ] `public/data/categories.json` 包含 8 个分类
- [ ] `public/data/integrations.json` 包含 50+ 集成
- [ ] `public/data/workflows/` 目录包含 ~2,300 个 JSON 文件
- [ ] 无重复 slug
- [ ] 所有分类有对应 workflow
- [ ] 无空描述
- [ ] 统计数据合理

---

**文档结束**
