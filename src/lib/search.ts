'use client';

import Fuse, { IFuseOptions } from 'fuse.js';
import type { WorkflowMeta, FilterState, SortOption } from '@/types';

// Fuse.js options for fuzzy search
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
let cachedWorkflows: WorkflowMeta[] | null = null;

/**
 * Initialize or get Fuse instance
 */
export function initSearch(workflows: WorkflowMeta[]): Fuse<WorkflowMeta> {
  if (!fuseInstance || cachedWorkflows !== workflows) {
    fuseInstance = new Fuse(workflows, fuseOptions);
    cachedWorkflows = workflows;
  }
  return fuseInstance;
}

/**
 * Search workflows with Fuse.js
 */
export function searchWorkflows(
  workflows: WorkflowMeta[],
  query: string
): WorkflowMeta[] {
  if (!query.trim()) {
    return workflows;
  }

  const fuse = initSearch(workflows);
  const results = fuse.search(query);
  return results.map((r) => r.item);
}

/**
 * Apply filters to workflows
 */
export function filterWorkflows(
  workflows: WorkflowMeta[],
  filters: Partial<FilterState>
): WorkflowMeta[] {
  let filtered = [...workflows];

  // Filter by category
  if (filters.category) {
    filtered = filtered.filter((w) => w.category === filters.category);
  }

  // Filter by integration
  if (filters.integration) {
    filtered = filtered.filter((w) => w.integrations.includes(filters.integration!));
  }

  // Filter by source
  if (filters.source && filters.source !== 'all') {
    filtered = filtered.filter((w) => w.source === filters.source);
  }

  // Filter by quality
  if (filters.quality) {
    filtered = filtered.filter((w) => w.quality >= filters.quality!);
  }

  // Filter by trigger type
  if (filters.triggerType) {
    filtered = filtered.filter((w) => w.triggerType === filters.triggerType);
  }

  return filtered;
}

/**
 * Sort workflows by different criteria
 */
export function sortWorkflows(
  workflows: WorkflowMeta[],
  sortBy: SortOption
): WorkflowMeta[] {
  const sorted = [...workflows];

  switch (sortBy) {
    case 'quality':
      return sorted.sort((a, b) => {
        if (b.quality !== a.quality) return b.quality - a.quality;
        if (a.source === 'awesome' && b.source !== 'awesome') return -1;
        if (a.source !== 'awesome' && b.source === 'awesome') return 1;
        return 0;
      });

    case 'nodes':
      return sorted.sort((a, b) => b.nodeCount - a.nodeCount);

    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case 'relevance':
    default:
      // Already sorted by search relevance or default order
      return sorted;
  }
}

/**
 * Combined search, filter, and sort
 */
export function processWorkflows(
  workflows: WorkflowMeta[],
  filters: FilterState
): WorkflowMeta[] {
  // First search if there's a query
  let processed = filters.query
    ? searchWorkflows(workflows, filters.query)
    : workflows;

  // Apply filters
  processed = filterWorkflows(processed, filters);

  // Sort (skip if searching - already sorted by relevance)
  if (!filters.query || filters.sortBy !== 'relevance') {
    processed = sortWorkflows(processed, filters.sortBy);
  }

  return processed;
}

/**
 * Get default filter state
 */
export function getDefaultFilterState(): FilterState {
  return {
    query: '',
    category: null,
    integration: null,
    source: 'all',
    quality: null,
    triggerType: null,
    sortBy: 'quality',
  };
}

/**
 * Parse filters from URL search params
 */
export function parseFiltersFromURL(searchParams: URLSearchParams): Partial<FilterState> {
  const filters: Partial<FilterState> = {};

  const q = searchParams.get('q');
  if (q) filters.query = q;

  const category = searchParams.get('category');
  if (category) filters.category = category;

  const integration = searchParams.get('integration');
  if (integration) filters.integration = integration;

  const source = searchParams.get('source') as FilterState['source'];
  if (source && ['all', 'awesome', 'community'].includes(source)) {
    filters.source = source;
  }

  const quality = searchParams.get('quality');
  if (quality) {
    const qualityNum = parseInt(quality, 10);
    if (qualityNum >= 1 && qualityNum <= 5) filters.quality = qualityNum;
  }

  const trigger = searchParams.get('trigger') as FilterState['triggerType'];
  if (trigger && ['webhook', 'schedule', 'event', 'manual'].includes(trigger)) {
    filters.triggerType = trigger;
  }

  const sort = searchParams.get('sort') as SortOption;
  if (sort && ['relevance', 'quality', 'nodes', 'newest', 'name'].includes(sort)) {
    filters.sortBy = sort;
  }

  return filters;
}

/**
 * Build URL from filters
 */
export function buildURLFromFilters(filters: FilterState, basePath: string = '/search'): string {
  const params = new URLSearchParams();

  if (filters.query) params.set('q', filters.query);
  if (filters.category) params.set('category', filters.category);
  if (filters.integration) params.set('integration', filters.integration);
  if (filters.source !== 'all') params.set('source', filters.source);
  if (filters.quality) params.set('quality', filters.quality.toString());
  if (filters.triggerType) params.set('trigger', filters.triggerType);
  if (filters.sortBy !== 'quality') params.set('sort', filters.sortBy);

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}
