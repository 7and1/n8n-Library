'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Activity } from 'lucide-react';
import { SearchBar } from '@/components/workflow/SearchBar';
import { FilterPanel } from '@/components/workflow/FilterPanel';
import { VirtualizedWorkflowGrid } from '@/components/workflow/VirtualizedWorkflowGrid';
import { WorkflowGridSkeleton } from '@/components/workflow/WorkflowGrid';
import {
  parseFiltersFromURL,
  buildURLFromFilters,
  withDefaultFilters,
} from '@/lib/search';
import type {
  Category,
  IntegrationSummary,
  FilterState,
  SearchResponse,
} from '@/types';

interface SearchClientProps {
  categories: Category[];
  integrations: IntegrationSummary[];
  initialFilters: FilterState;
  initialResponse: SearchResponse;
  totalWorkflows: number;
  basePath?: '/search' | '/directory';
}

const PAGE_SIZE = 24;

export function SearchClient({
  categories,
  integrations,
  initialFilters,
  initialResponse,
  totalWorkflows,
  basePath = '/search',
}: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [results, setResults] = useState(initialResponse.results);
  const [total, setTotal] = useState(initialResponse.total);
  const [page, setPage] = useState(initialResponse.page);
  const [hasMore, setHasMore] = useState(initialResponse.hasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState(initialResponse.tookMs ?? 0);
  const [loadingMode, setLoadingMode] = useState<'idle' | 'filters' | 'append'>('idle');
  const urlKeyRef = useRef(buildURLFromFilters(initialFilters, basePath));
  const filtersRef = useRef(filters);
  const requestKeyRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Sync filters when the URL is changed via browser navigation
  useEffect(() => {
    const parsed = withDefaultFilters(parseFiltersFromURL(searchParams));
    const parsedKey = buildURLFromFilters(parsed, basePath);
    if (parsedKey !== urlKeyRef.current) {
      urlKeyRef.current = parsedKey;
      setFilters(parsed);
    }
  }, [searchParams, basePath]);

  const fetchPage = useCallback(
    async (targetPage: number, append: boolean, requestKey: number) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsLoading(true);
      setLoadingMode(append ? 'append' : 'filters');
      setError(null);

      const activeFilters = filtersRef.current;
      const params = new URLSearchParams();
      if (activeFilters.query) params.set('q', activeFilters.query);
      if (activeFilters.category) params.set('category', activeFilters.category);
      if (activeFilters.integration) params.set('integration', activeFilters.integration);
      if (activeFilters.source !== 'all') params.set('source', activeFilters.source);
      if (activeFilters.quality) params.set('quality', activeFilters.quality.toString());
      if (activeFilters.triggerType) params.set('trigger', activeFilters.triggerType);
      if (activeFilters.sortBy !== 'quality') params.set('sort', activeFilters.sortBy);
      params.set('page', String(targetPage));
      params.set('pageSize', String(PAGE_SIZE));

      try {
        const response = await fetch(`/api/workflows/search?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Search request failed');
        }

        const json = await response.json();
        if (!json.success) {
          throw new Error(json.error || 'Search failed');
        }

        if (requestKey !== requestKeyRef.current) {
          return;
        }

        const data: SearchResponse = json.data;
        setResults((prev) => (append ? [...prev, ...data.results] : data.results));
        setTotal(data.total);
        setPage(data.page);
        setHasMore(data.hasMore);
        setLatencyMs(data.tookMs ?? 0);
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return;
        }
        if (requestKey !== requestKeyRef.current) {
          return;
        }
        setError((err as Error).message ?? 'Unknown error');
      } finally {
        if (requestKey === requestKeyRef.current) {
          setIsLoading(false);
          setLoadingMode('idle');
        }
      }
    },
    []
  );

  // Update URL and trigger search when filters change
  useEffect(() => {
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      return;
    }
    const nextUrl = buildURLFromFilters(filters, basePath);
    if (nextUrl !== urlKeyRef.current) {
      urlKeyRef.current = nextUrl;
      router.replace(nextUrl, { scroll: false });
    }
    const nextRequestKey = requestKeyRef.current + 1;
    requestKeyRef.current = nextRequestKey;
    fetchPage(1, false, nextRequestKey);
  }, [filters, basePath, router, fetchPage]);

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, query }));
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    const currentRequestKey = requestKeyRef.current;
    fetchPage(nextPage, true, currentRequestKey);
  };

  const showFilterSkeleton = isLoading && loadingMode === 'filters';
  const latencyText = latencyMs >= 1 ? `${latencyMs.toFixed(1)} ms` : '<1 ms';
  const filterSummary =
    total === totalWorkflows
      ? `${total.toLocaleString()} workflows available`
      : `${total.toLocaleString()} of ${totalWorkflows.toLocaleString()} workflows match`;

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <SearchBar
        initialQuery={filters.query}
        onSearch={handleSearch}
        redirectOnSearch={false}
        size="lg"
        autoFocus
      />

      {/* Filters */}
      <FilterPanel
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={categories}
        integrations={integrations}
        totalCount={totalWorkflows}
        filteredCount={total}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        <span>{filterSummary}</span>
        <span className="inline-flex items-center gap-1 font-medium text-gray-600 dark:text-gray-300">
          <Activity className="w-3.5 h-3.5 text-brand-500" />
          {showFilterSkeleton ? 'Updating results…' : `${latencyText} server time`}
        </span>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </div>
      )}

      {showFilterSkeleton ? (
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-6">
          <WorkflowGridSkeleton count={9} columns={3} />
        </div>
      ) : (
        <VirtualizedWorkflowGrid
          workflows={results}
          columns={3}
          emptyMessage={
            filters.query
              ? `No workflows found for "${filters.query}". Try a different search term.`
              : 'No workflows match your filters. Try adjusting your criteria.'
          }
          className="rounded-xl border border-gray-100 dark:border-gray-800"
        />
      )}

      {/* Load more button */}
      {hasMore && results.length > 0 && (
        <div className="text-center pt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
          >
            {isLoading ? 'Loading…' : `Load More (${total - results.length} remaining)`}
          </button>
        </div>
      )}

      {/* Results summary */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        {results.length > 0
          ? `Loaded ${results.length} of ${total} workflows${isLoading ? ' · Updating…' : ''}`
          : 'No workflows to display'}
      </div>
    </div>
  );
}
