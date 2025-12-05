import type { FilterState, SortOption, WorkflowMeta } from '@/types';

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

export function withDefaultFilters(partial: Partial<FilterState>): FilterState {
  return { ...getDefaultFilterState(), ...partial };
}

function mapFiltersFromRecord(getValue: (key: string) => string | null): Partial<FilterState> {
  const filters: Partial<FilterState> = {};

  const q = getValue('q');
  if (q) filters.query = q;

  const category = getValue('category');
  if (category) filters.category = category;

  const integration = getValue('integration');
  if (integration) filters.integration = integration;

  const source = getValue('source') as FilterState['source'];
  if (source && ['all', 'awesome', 'community'].includes(source)) {
    filters.source = source;
  }

  const quality = getValue('quality');
  if (quality) {
    const qualityNum = parseInt(quality, 10);
    if (qualityNum >= 1 && qualityNum <= 5) filters.quality = qualityNum;
  }

  const trigger = getValue('trigger') as FilterState['triggerType'];
  if (trigger && ['webhook', 'schedule', 'event', 'manual'].includes(trigger)) {
    filters.triggerType = trigger;
  }

  const sort = getValue('sort') as SortOption;
  if (sort && ['relevance', 'quality', 'nodes', 'newest', 'name'].includes(sort)) {
    filters.sortBy = sort;
  }

  return filters;
}

export function parseFiltersFromURL(searchParams: URLSearchParams): Partial<FilterState> {
  return mapFiltersFromRecord((key) => searchParams.get(key));
}

export function parseFiltersFromObject(
  params: Record<string, string | string[] | undefined>
): Partial<FilterState> {
  return mapFiltersFromRecord((key) => {
    const value = params[key];
    if (Array.isArray(value)) return value[0] ?? null;
    return value ?? null;
  });
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

export function clampPage(page?: number | null): number {
  if (!page || Number.isNaN(page) || page < 1) return 1;
  return page;
}

export function clampPageSize(size?: number | null, max: number = 48): number {
  if (!size || Number.isNaN(size) || size < 1) return 24;
  return Math.min(size, max);
}
