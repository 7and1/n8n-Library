/**
 * Core TypeScript types for n8n Library
 */

// Workflow metadata for search index
export interface WorkflowMeta {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  categoryName: string;
  categoryIcon: string;
  source: 'awesome' | 'community';
  quality: 1 | 2 | 3 | 4 | 5;
  nodeCount: number;
  integrations: string[];
  triggerType: TriggerType;
  createdAt: string;
}

// Full workflow detail
export interface WorkflowDetail extends Omit<WorkflowMeta, 'description' | 'integrations'> {
  description: string; // Full description
  sourceUrl: string;
  tags: string[];
  nodes: string[];
  integrations: Integration[]; // Override with detailed integration objects
  filePath: string;
  workflow: N8nWorkflow;
}

// Integration info
export interface Integration {
  name: string;
  slug: string;
  icon: string;
  iconType: 'simple-icons' | 'placeholder';
  iconUrl: string | null;
  brandColor?: string | null;
}

// Integration summary for listing
export interface IntegrationSummary {
  slug: string;
  name: string;
  icon: string;
  iconType: 'simple-icons' | 'placeholder';
  iconUrl: string | null;
  count: number;
  categories: string[];
}

// Category
export interface Category {
  slug: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  count: number;
}

// Trigger types
export type TriggerType = 'webhook' | 'schedule' | 'event' | 'manual';

// N8n workflow JSON structure
export interface N8nWorkflow {
  name?: string;
  nodes: N8nNode[];
  connections: Record<string, unknown>;
  settings?: Record<string, unknown>;
  staticData?: unknown;
  tags?: Array<string | { name: string }>;
  meta?: {
    createdAt?: string;
    description?: string;
  };
  description?: string;
  createdAt?: string;
}

// N8n node
export interface N8nNode {
  id?: string;
  name: string;
  type: string;
  typeVersion?: number;
  position: [number, number];
  parameters?: Record<string, unknown>;
  credentials?: Record<string, unknown>;
}

// Search result
export interface SearchResult {
  item: WorkflowMeta;
  score: number;
  matches?: Array<{
    key: string;
    value: string;
    indices: Array<[number, number]>;
  }>;
}

export interface SearchResponse {
  results: WorkflowMeta[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  tookMs: number;
}

// Filter state
export interface FilterState {
  query: string;
  category: string | null;
  integration: string | null;
  source: 'all' | 'awesome' | 'community';
  quality: number | null;
  triggerType: TriggerType | null;
  sortBy: SortOption;
}

// Sort options
export type SortOption = 'relevance' | 'quality' | 'nodes' | 'newest' | 'name';

// Stats
export interface Stats {
  total: number;
  bySource: {
    awesome: number;
    community: number;
  };
  byQuality: Record<number, number>;
  byTrigger: Record<string, number>;
  categories: number;
  integrations: number;
  avgNodesPerWorkflow: string;
  generatedAt: string;
}

export interface RepoMetadata {
  label: string;
  path: string;
  exists: boolean;
  commit?: string;
  shortCommit?: string;
  lastCommitAt?: string;
  remote?: string | null;
  dirty?: boolean;
  error?: string;
}

export interface CacheRevalidateInfo {
  success: boolean;
  status?: number;
  timestamp: string;
  url?: string;
  body?: Record<string, unknown>;
  error?: string;
}

export interface DatasetMeta {
  version: number;
  datasetHash: string;
  startedAt: string;
  generatedAt: string;
  durationMs: number;
  cli: {
    force: boolean;
    since: string | null;
    maxWorkers: number;
    pretty: boolean;
    source: string;
  };
  cache: {
    manifestPath: string;
    manifestEntries: number;
    manifestUpdatedAt?: string | null;
    hits: number;
    misses: number;
    skippedBySince: number;
    usedSinceFilter: boolean;
    revalidate: CacheRevalidateInfo | null;
  };
  counts: {
    workflows: number;
    workflowFiles: number;
    categories: number;
    integrations: number;
    featuredIntegrations: number;
  };
  stats: Stats;
  sources: {
    awesome: RepoMetadata;
    community: RepoMetadata;
  };
  files: {
    index: string;
    categories: string;
    integrations: string;
    integrationsTop: string;
    workflowsDir: string;
  };
}

// Page props for static generation
export interface PageParams {
  params: {
    slug: string;
  };
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
