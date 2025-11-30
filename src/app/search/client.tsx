'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchBar } from '@/components/workflow/SearchBar';
import { FilterPanel } from '@/components/workflow/FilterPanel';
import { WorkflowGrid } from '@/components/workflow/WorkflowGrid';
import {
  processWorkflows,
  getDefaultFilterState,
  parseFiltersFromURL,
  buildURLFromFilters,
} from '@/lib/search';
import type { WorkflowMeta, Category, IntegrationSummary, FilterState } from '@/types';

interface SearchClientProps {
  initialWorkflows: WorkflowMeta[];
  categories: Category[];
  integrations: IntegrationSummary[];
}

const ITEMS_PER_PAGE = 24;

export function SearchClient({
  initialWorkflows,
  categories,
  integrations,
}: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...getDefaultFilterState(),
    ...parseFiltersFromURL(searchParams),
  }));

  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  // Process workflows based on filters
  const processedWorkflows = useMemo(() => {
    return processWorkflows(initialWorkflows, filters);
  }, [initialWorkflows, filters]);

  // Displayed workflows (with pagination)
  const displayedWorkflows = useMemo(() => {
    return processedWorkflows.slice(0, displayCount);
  }, [processedWorkflows, displayCount]);

  // Update URL when filters change
  useEffect(() => {
    const newUrl = buildURLFromFilters(filters, '/search');
    router.replace(newUrl, { scroll: false });
  }, [filters, router]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [filters]);

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, query }));
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const hasMore = displayCount < processedWorkflows.length;

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
        totalCount={initialWorkflows.length}
        filteredCount={processedWorkflows.length}
      />

      {/* Results */}
      <WorkflowGrid
        workflows={displayedWorkflows}
        columns={3}
        emptyMessage={
          filters.query
            ? `No workflows found for "${filters.query}". Try a different search term.`
            : 'No workflows match your filters. Try adjusting your criteria.'
        }
      />

      {/* Load more button */}
      {hasMore && (
        <div className="text-center pt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Load More ({processedWorkflows.length - displayCount} remaining)
          </button>
        </div>
      )}

      {/* Results summary */}
      {processedWorkflows.length > 0 && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Showing {displayedWorkflows.length} of {processedWorkflows.length} workflows
        </div>
      )}
    </div>
  );
}
