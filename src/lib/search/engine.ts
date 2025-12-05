import Fuse, { IFuseOptions } from 'fuse.js';
import { performance } from 'node:perf_hooks';
import type { FilterState, SearchResponse, WorkflowMeta } from '@/types';
import { getAllWorkflows, getDatasetMeta } from '@/lib/data';
import { filterWorkflows, sortWorkflows, withDefaultFilters } from '@/lib/search';

const fuseOptions: IFuseOptions<WorkflowMeta> = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'integrations', weight: 0.2 },
    { name: 'categoryName', weight: 0.1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  includeScore: true,
  minMatchCharLength: 2,
};

let fuseInstance: Fuse<WorkflowMeta> | null = null;
let cachedDatasetHash: string | null = null;

function getNow(): number {
  try {
    return performance.now();
  } catch {
    return Date.now();
  }
}

async function ensureFuse(workflows: WorkflowMeta[], datasetHash: string) {
  if (!fuseInstance || cachedDatasetHash !== datasetHash) {
    fuseInstance = new Fuse(workflows, fuseOptions);
    cachedDatasetHash = datasetHash;
  }
  return fuseInstance;
}

function runQuery(workflows: WorkflowMeta[], query: string): WorkflowMeta[] {
  if (!query.trim()) return workflows;
  if (!fuseInstance) {
    throw new Error('Fuse instance not initialized');
  }
  return fuseInstance.search(query).map((r) => r.item);
}

export async function executeWorkflowSearch(
  incomingFilters: Partial<FilterState>,
  page: number,
  pageSize: number
): Promise<SearchResponse> {
  const filters = withDefaultFilters(incomingFilters);
  const start = getNow();
  const [workflows, meta] = await Promise.all([getAllWorkflows(), getDatasetMeta()]);
  const datasetHash = meta?.datasetHash ?? `len:${workflows.length}`;
  await ensureFuse(workflows, datasetHash);
  const searched = filters.query ? runQuery(workflows, filters.query) : workflows;
  const filtered = filterWorkflows(searched, filters);
  const sorted = !filters.query || filters.sortBy !== 'relevance'
    ? sortWorkflows(filtered, filters.sortBy)
    : filtered;

  const total = sorted.length;
  const clampedPage = Math.max(1, page);
  const offset = (clampedPage - 1) * pageSize;
  const results = sorted.slice(offset, offset + pageSize);
  const tookMs = Math.round((getNow() - start) * 100) / 100;

  return {
    results,
    total,
    page: clampedPage,
    pageSize,
    hasMore: offset + pageSize < total,
    tookMs,
  };
}
