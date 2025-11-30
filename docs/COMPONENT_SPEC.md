# 组件开发规范

> **版本**: v1.0
> **更新日期**: 2024-11-30
> **组件目录**: `src/components/`

---

## 1. 概述

本文档定义了 n8n-library.com 前端组件的设计规范、API 接口和实现要求。

### 1.1 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI 框架 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 3.x | 样式 |
| shadcn/ui | latest | UI 组件库 |
| lucide-react | latest | 图标 |
| clsx + tailwind-merge | latest | 类名合并 |

### 1.2 目录结构

```
src/components/
├── ui/                     # shadcn/ui 基础组件
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── dialog.tsx
│   ├── tabs.tsx
│   └── collapsible.tsx
├── layout/                 # 布局组件
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Container.tsx
├── workflow/               # 工作流相关
│   ├── WorkflowCard.tsx
│   ├── WorkflowGrid.tsx
│   ├── NodeIcons.tsx
│   ├── NodeFlow.tsx
│   ├── IntegrationBadge.tsx
│   ├── CodeBlock.tsx
│   ├── CopyButton.tsx
│   └── ImportInstructions.tsx
├── search/                 # 搜索相关
│   ├── SearchBar.tsx
│   └── SearchFilters.tsx
└── category/               # 分类相关
    └── CategoryGrid.tsx
```

---

## 2. 工具函数

### 2.1 cn() - 类名合并

```typescript
// src/lib/utils.ts

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 2.2 类型定义

```typescript
// src/lib/types.ts

export interface WorkflowMeta {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  categoryName: string;
  source: 'awesome' | 'community';
  quality: number;
  nodeCount: number;
  integrations: string[];
  triggerType: string;
  createdAt: string;
}

export interface WorkflowDetail extends WorkflowMeta {
  sourceUrl: string;
  tags: string[];
  nodes: string[];
  integrationDetails: Integration[];
  workflow: object;
}

export interface Integration {
  name: string;
  slug: string;
  icon: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  color: string;
}
```

---

## 3. 布局组件

### 3.1 Header

**文件**: `src/components/layout/Header.tsx`

```typescript
interface HeaderProps {
  className?: string;
}
```

**功能**:
- Logo + 站点名称
- 导航链接 (Browse, Categories, About)
- 搜索快捷入口 (Cmd+K)
- GitHub 链接
- 深色模式切换 (可选)

**设计**:
```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo] n8n Library    Browse  Categories    [🔍] [GitHub] [🌙] │
└─────────────────────────────────────────────────────────────────┘
```

**实现要点**:
- 固定在顶部 (`sticky top-0`)
- 背景模糊效果 (`backdrop-blur`)
- 响应式: 移动端使用汉堡菜单

### 3.2 Footer

**文件**: `src/components/layout/Footer.tsx`

```typescript
interface FooterProps {
  className?: string;
}
```

**功能**:
- 非官方声明
- 数据来源链接
- 社交链接 (GitHub, Twitter)
- 最后同步时间 (可选)

**设计**:
```
┌─────────────────────────────────────────────────────────────────┐
│  Unofficial Community Project | Not affiliated with n8n GmbH   │
│  Data: awesome-n8n-templates | n8n-workflows                    │
│  [GitHub] [Twitter]                                             │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Container

**文件**: `src/components/layout/Container.tsx`

```typescript
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}
```

**最大宽度**:
- sm: `max-w-2xl` (672px)
- md: `max-w-4xl` (896px)
- lg: `max-w-6xl` (1152px)
- xl: `max-w-7xl` (1280px)
- full: `max-w-full`

---

## 4. 工作流组件

### 4.1 WorkflowCard

**文件**: `src/components/workflow/WorkflowCard.tsx`

```typescript
interface WorkflowCardProps {
  workflow: WorkflowMeta;
  className?: string;
  showCategory?: boolean;  // 默认 true
  showSource?: boolean;    // 默认 true
}
```

**功能**:
- 集成图标组 (最多 4 个)
- 标题 (2 行截断)
- 描述 (2 行截断)
- Featured 徽章 (awesome 来源)
- 节点数量
- 分类标签
- 点击跳转详情页

**设计**:
```
┌─────────────────────────────────┐
│  [TG] [AI] [📧] [+2]           │  ← 集成图标
├─────────────────────────────────┤
│                                 │
│  Telegram AI Chatbot with      │  ← 标题 (line-clamp-2)
│  OpenAI GPT-4                  │
│                                 │
│  AI-powered chatbot that       │  ← 描述 (line-clamp-2)
│  responds to messages...       │
│                                 │
├─────────────────────────────────┤
│  ⭐ Featured  │  12 nodes      │  ← 元信息
└─────────────────────────────────┘
```

**CSS 类**:
```css
/* 卡片悬停效果 */
.workflow-card {
  @apply transition-all duration-200;
  @apply hover:shadow-lg hover:scale-[1.02];
  @apply hover:border-primary/50;
}
```

**实现代码框架**:
```tsx
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NodeIcons } from './NodeIcons';
import { cn } from '@/lib/utils';

export function WorkflowCard({
  workflow,
  className,
  showCategory = true,
  showSource = true,
}: WorkflowCardProps) {
  return (
    <Link href={`/workflow/${workflow.slug}/`}>
      <Card className={cn(
        'h-full transition-all duration-200',
        'hover:shadow-lg hover:scale-[1.02] hover:border-primary/50',
        className
      )}>
        <CardContent className="p-4">
          {/* 集成图标 */}
          <NodeIcons
            integrations={workflow.integrations}
            maxDisplay={4}
            size="sm"
            className="mb-3"
          />

          {/* 标题 */}
          <h3 className="font-semibold text-sm line-clamp-2 mb-2">
            {workflow.name}
          </h3>

          {/* 描述 */}
          <p className="text-xs text-muted-foreground line-clamp-2">
            {workflow.description}
          </p>
        </CardContent>

        <CardFooter className="px-4 py-3 border-t flex items-center justify-between">
          {/* 来源徽章 */}
          {showSource && workflow.source === 'awesome' && (
            <Badge variant="secondary" className="text-xs">
              ⭐ Featured
            </Badge>
          )}

          {/* 节点数 */}
          <span className="text-xs text-muted-foreground">
            {workflow.nodeCount} nodes
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
```

### 4.2 WorkflowGrid

**文件**: `src/components/workflow/WorkflowGrid.tsx`

```typescript
interface WorkflowGridProps {
  workflows: WorkflowMeta[];
  className?: string;
  columns?: 1 | 2 | 3 | 4;  // 默认 auto
  emptyMessage?: string;
}
```

**响应式列数**:
```css
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

**实现**:
```tsx
export function WorkflowGrid({
  workflows,
  className,
  columns,
  emptyMessage = 'No workflows found',
}: WorkflowGridProps) {
  if (workflows.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  const gridCols = columns
    ? `grid-cols-${columns}`
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className={cn('grid gap-4', gridCols, className)}>
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
}
```

### 4.3 NodeIcons

**文件**: `src/components/workflow/NodeIcons.tsx`

```typescript
interface NodeIconsProps {
  integrations: string[] | Integration[];
  maxDisplay?: number;  // 默认 4
  size?: 'sm' | 'md' | 'lg';  // 默认 'md'
  className?: string;
  showTooltip?: boolean;  // 默认 true
}
```

**尺寸**:
- sm: 20px
- md: 28px
- lg: 36px

**图标解析策略**:
1. simple-icons CDN: `https://cdn.simpleicons.org/{slug}`
2. 本地 fallback: `/icons/integrations/{slug}.svg`
3. 首字母占位符

**实现**:
```tsx
import Image from 'next/image';
import { getIconUrl, getIntegrationName } from '@/lib/icons';
import { cn } from '@/lib/utils';

const SIZES = {
  sm: 20,
  md: 28,
  lg: 36,
};

export function NodeIcons({
  integrations,
  maxDisplay = 4,
  size = 'md',
  className,
  showTooltip = true,
}: NodeIconsProps) {
  const items = integrations.slice(0, maxDisplay);
  const remaining = integrations.length - maxDisplay;
  const iconSize = SIZES[size];

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {items.map((integration, index) => {
        const slug = typeof integration === 'string' ? integration : integration.slug;
        const name = typeof integration === 'string'
          ? getIntegrationName(slug)
          : integration.name;

        return (
          <div
            key={index}
            className="relative"
            title={showTooltip ? name : undefined}
          >
            <IntegrationIcon
              slug={slug}
              size={iconSize}
              alt={name}
            />
          </div>
        );
      })}

      {remaining > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full',
            'bg-muted text-muted-foreground text-xs font-medium'
          )}
          style={{ width: iconSize, height: iconSize }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

function IntegrationIcon({ slug, size, alt }: { slug: string; size: number; alt: string }) {
  const [error, setError] = useState(false);
  const iconUrl = getIconUrl(slug);

  if (error || !iconUrl) {
    // 首字母 fallback
    return (
      <div
        className="flex items-center justify-center rounded bg-muted text-xs font-medium"
        style={{ width: size, height: size }}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={iconUrl}
      alt={alt}
      width={size}
      height={size}
      className="rounded"
      onError={() => setError(true)}
    />
  );
}
```

### 4.4 NodeFlow

**文件**: `src/components/workflow/NodeFlow.tsx`

简化的水平流程可视化，不是完整画布。

```typescript
interface NodeFlowProps {
  nodes: Array<{
    name: string;
    type: string;
  }>;
  maxNodes?: number;  // 默认 6
  className?: string;
}
```

**设计**:
```
┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
│  [TG]  │ →  │  [⚙️]  │ →  │  [AI]  │ →  │  [TG]  │
│Trigger │    │  Set   │    │ OpenAI │    │  Send  │
└────────┘    └────────┘    └────────┘    └────────┘
```

**实现**:
```tsx
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NodeFlow({ nodes, maxNodes = 6, className }: NodeFlowProps) {
  const displayNodes = nodes.slice(0, maxNodes);
  const hasMore = nodes.length > maxNodes;

  return (
    <div className={cn('flex items-center flex-wrap gap-2', className)}>
      {displayNodes.map((node, index) => (
        <Fragment key={index}>
          <NodeBox name={node.name} type={node.type} />
          {index < displayNodes.length - 1 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          )}
        </Fragment>
      ))}

      {hasMore && (
        <>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className="px-3 py-2 rounded border text-xs text-muted-foreground">
            +{nodes.length - maxNodes} more
          </div>
        </>
      )}
    </div>
  );
}

function NodeBox({ name, type }: { name: string; type: string }) {
  const icon = getNodeIcon(type);

  return (
    <div className="flex flex-col items-center gap-1 p-2 rounded border bg-card min-w-[80px]">
      <div className="w-6 h-6">
        {icon}
      </div>
      <span className="text-xs text-center line-clamp-1">
        {formatNodeName(name)}
      </span>
    </div>
  );
}
```

### 4.5 IntegrationBadge

**文件**: `src/components/workflow/IntegrationBadge.tsx`

```typescript
interface IntegrationBadgeProps {
  integration: Integration | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showCount?: number;  // 显示 workflow 数量
  onClick?: () => void;
  className?: string;
}
```

**实现**:
```tsx
export function IntegrationBadge({
  integration,
  size = 'md',
  showIcon = true,
  showCount,
  onClick,
  className,
}: IntegrationBadgeProps) {
  const slug = typeof integration === 'string' ? integration : integration.slug;
  const name = typeof integration === 'string'
    ? getIntegrationName(slug)
    : integration.name;

  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full',
        'bg-secondary text-secondary-foreground',
        onClick && 'hover:bg-secondary/80 cursor-pointer',
        className
      )}
    >
      {showIcon && (
        <IntegrationIcon slug={slug} size={16} alt={name} />
      )}
      <span className="text-xs font-medium">{name}</span>
      {showCount !== undefined && (
        <span className="text-xs text-muted-foreground">({showCount})</span>
      )}
    </Wrapper>
  );
}
```

### 4.6 CodeBlock

**文件**: `src/components/workflow/CodeBlock.tsx`

```typescript
interface CodeBlockProps {
  code: string;
  language?: string;  // 默认 'json'
  maxHeight?: number;  // 默认 400px
  showLineNumbers?: boolean;  // 默认 true
  className?: string;
}
```

**功能**:
- 语法高亮 (react-syntax-highlighter)
- 行号显示
- 可滚动
- 复制按钮

**实现**:
```tsx
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyButton } from './CopyButton';
import { cn } from '@/lib/utils';

export function CodeBlock({
  code,
  language = 'json',
  maxHeight = 400,
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  return (
    <div className={cn('relative rounded-lg overflow-hidden', className)}>
      <CopyButton
        text={code}
        className="absolute top-2 right-2 z-10"
      />

      <div
        className="overflow-auto"
        style={{ maxHeight }}
      >
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: '13px',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
```

### 4.7 CopyButton

**文件**: `src/components/workflow/CopyButton.tsx`

```typescript
interface CopyButtonProps {
  text: string;
  className?: string;
  variant?: 'default' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  label?: string;  // 默认无文字，只有图标
}
```

**功能**:
- 点击复制到剪贴板
- 复制成功反馈 (图标变化 + toast)
- 2 秒后恢复

**实现**:
```tsx
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CopyButton({
  text,
  className,
  variant = 'secondary',
  size = 'sm',
  label,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn('gap-1.5', className)}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
      {label && <span>{copied ? 'Copied!' : label}</span>}
    </Button>
  );
}
```

### 4.8 ImportInstructions

**文件**: `src/components/workflow/ImportInstructions.tsx`

```typescript
interface ImportInstructionsProps {
  className?: string;
  defaultOpen?: boolean;  // 默认 false
}
```

**内容**:
1. 复制 JSON
2. 在 n8n 中打开 Workflows → Import
3. 粘贴并导入
4. 配置凭据

**实现**:
```tsx
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ImportInstructions({
  className,
  defaultOpen = false,
}: ImportInstructionsProps) {
  return (
    <Collapsible defaultOpen={defaultOpen} className={className}>
      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:underline">
        <ChevronDown className="w-4 h-4 transition-transform [[data-state=open]>&]:rotate-180" />
        How to Import
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-3">
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Copy the JSON code above</li>
          <li>In n8n, click <strong>Workflows</strong> → <strong>Import from URL/File</strong></li>
          <li>Paste the JSON and click <strong>Import</strong></li>
          <li>Configure your credentials for each service</li>
        </ol>

        <p className="mt-3 text-xs text-muted-foreground">
          💡 Tip: You can also download the JSON file and import it directly.
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}
```

---

## 5. 搜索组件

### 5.1 SearchBar

**文件**: `src/components/search/SearchBar.tsx`

```typescript
interface SearchBarProps {
  value?: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  showShortcut?: boolean;  // 显示 Cmd+K 提示
}
```

**功能**:
- 输入框
- 搜索图标
- 清除按钮
- Debounce (300ms)
- 键盘快捷键 (Cmd+K 聚焦)

**实现**:
```tsx
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/lib/hooks';

export function SearchBar({
  value = '',
  onChange,
  onSubmit,
  placeholder = 'Search workflows...',
  className,
  autoFocus = false,
  showShortcut = true,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  // 同步外部值
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce 回调
  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

      <Input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit?.()}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="pl-9 pr-20"
      />

      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {localValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        )}

        {showShortcut && !localValue && (
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border bg-muted text-xs text-muted-foreground">
            ⌘K
          </kbd>
        )}
      </div>
    </div>
  );
}
```

### 5.2 SearchFilters

**文件**: `src/components/search/SearchFilters.tsx`

```typescript
interface SearchFiltersProps {
  filters: {
    category: string | null;
    source: 'all' | 'awesome' | 'community';
    sort: 'relevance' | 'date' | 'quality' | 'name';
  };
  onChange: (filters: Partial<SearchFiltersProps['filters']>) => void;
  categories: Category[];
  className?: string;
}
```

**功能**:
- 分类筛选 (下拉)
- 来源筛选 (All / Featured / Community)
- 排序方式 (相关性 / 日期 / 质量 / 名称)
- 清除所有筛选

**实现**:
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SearchFilters({
  filters,
  onChange,
  categories,
  className,
}: SearchFiltersProps) {
  const hasFilters = filters.category || filters.source !== 'all';

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {/* 分类筛选 */}
      <Select
        value={filters.category || 'all'}
        onValueChange={(value) => onChange({ category: value === 'all' ? null : value })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.slug} value={cat.slug}>
              {cat.icon} {cat.name} ({cat.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 来源筛选 */}
      <Select
        value={filters.source}
        onValueChange={(value: any) => onChange({ source: value })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          <SelectItem value="awesome">⭐ Featured</SelectItem>
          <SelectItem value="community">Community</SelectItem>
        </SelectContent>
      </Select>

      {/* 排序 */}
      <Select
        value={filters.sort}
        onValueChange={(value: any) => onChange({ sort: value })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="date">Newest</SelectItem>
          <SelectItem value="quality">Quality</SelectItem>
          <SelectItem value="name">Name A-Z</SelectItem>
        </SelectContent>
      </Select>

      {/* 清除筛选 */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ category: null, source: 'all' })}
          className="text-xs"
        >
          <X className="w-3 h-3 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
```

---

## 6. 分类组件

### 6.1 CategoryGrid

**文件**: `src/components/category/CategoryGrid.tsx`

```typescript
interface CategoryGridProps {
  categories: Category[];
  columns?: 2 | 4 | 8;
  className?: string;
}
```

**设计**:
```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│  🤖 AI  │ │ 💬 Comm │ │ 📊 Prod │ │ 🔧 Dev  │
│   523   │ │   412   │ │   389   │ │   201   │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
```

**实现**:
```tsx
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function CategoryGrid({
  categories,
  columns,
  className,
}: CategoryGridProps) {
  const gridCols = columns
    ? `grid-cols-${columns}`
    : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-8';

  return (
    <div className={cn('grid gap-3', gridCols, className)}>
      {categories.map((category) => (
        <Link key={category.slug} href={`/category/${category.slug}/`}>
          <Card className={cn(
            'transition-all duration-200',
            'hover:shadow-md hover:scale-105',
            `hover:border-${category.color}`
          )}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-1">{category.icon}</div>
              <div className="text-sm font-medium truncate">
                {category.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {category.count}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
```

---

## 7. 图标工具

### 7.1 图标映射

**文件**: `src/lib/icons.ts`

```typescript
// n8n 节点类型 → simple-icons slug
const ICON_MAP: Record<string, string | null> = {
  // Communication
  'telegram': 'telegram',
  'slack': 'slack',
  'discord': 'discord',
  'gmail': 'gmail',
  'whatsapp': 'whatsapp',
  'outlook': 'microsoftoutlook',

  // AI
  'openai': 'openai',
  'anthropic': 'anthropic',

  // Productivity
  'notion': 'notion',
  'airtable': 'airtable',
  'google-sheets': 'googlesheets',
  'google-drive': 'googledrive',

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

  // Generic (需要本地图标)
  'webhook': null,
  'http': null,
  'cron': null,
};

export function getIconUrl(slug: string): string | null {
  const normalizedSlug = slug.toLowerCase().replace(/-/g, '');
  const simpleIconSlug = ICON_MAP[normalizedSlug] || ICON_MAP[slug];

  if (simpleIconSlug === null) {
    // 需要本地图标
    return `/icons/integrations/${slug}.svg`;
  }

  if (simpleIconSlug) {
    return `https://cdn.simpleicons.org/${simpleIconSlug}`;
  }

  // 尝试 simple-icons
  return `https://cdn.simpleicons.org/${normalizedSlug}`;
}

export function getIntegrationName(slug: string): string {
  const NAMES: Record<string, string> = {
    'google-sheets': 'Google Sheets',
    'google-drive': 'Google Drive',
    'openai': 'OpenAI',
    // ... more mappings
  };

  return NAMES[slug] ||
    slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
```

---

## 8. Hooks

### 8.1 useDebounce

```typescript
// src/lib/hooks.ts

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

### 8.2 useSearchParams

```typescript
// src/lib/hooks.ts

import { useSearchParams as useNextSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function useQueryParams<T extends Record<string, string | null>>() {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setParams = useCallback((newParams: Partial<T>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.replace(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  return {
    params: Object.fromEntries(searchParams.entries()) as T,
    setParams,
  };
}
```

---

## 9. 测试要点

每个组件应测试:

1. **渲染测试**: 正确渲染所有 props
2. **交互测试**: 点击、输入等事件
3. **响应式测试**: 不同屏幕尺寸
4. **边界测试**: 空数据、超长文本、特殊字符
5. **无障碍测试**: 键盘导航、屏幕阅读器

---

**文档结束**
