'use client';

import { useState } from 'react';
import { ChevronDown, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Category, IntegrationSummary, FilterState, SortOption, TriggerType } from '@/types';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories: Category[];
  integrations: IntegrationSummary[];
  totalCount: number;
  filteredCount: number;
  className?: string;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'quality', label: 'Quality' },
  { value: 'newest', label: 'Newest' },
  { value: 'nodes', label: 'Most Nodes' },
  { value: 'name', label: 'Name A-Z' },
];

const triggerOptions: { value: TriggerType; label: string }[] = [
  { value: 'webhook', label: 'Webhook' },
  { value: 'schedule', label: 'Scheduled' },
  { value: 'event', label: 'Event' },
  { value: 'manual', label: 'Manual' },
];

const sourceOptions = [
  { value: 'all', label: 'All Sources' },
  { value: 'awesome', label: 'Curated Only' },
  { value: 'community', label: 'Community Only' },
];

export function FilterPanel({
  filters,
  onFiltersChange,
  categories,
  integrations: _integrations,
  totalCount,
  filteredCount,
  className,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters =
    filters.category ||
    filters.integration ||
    filters.source !== 'all' ||
    filters.quality ||
    filters.triggerType;

  const activeFilterCount = [
    filters.category,
    filters.integration,
    filters.source !== 'all' ? filters.source : null,
    filters.quality,
    filters.triggerType,
  ].filter(Boolean).length;

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      ...filters,
      category: null,
      integration: null,
      source: 'all',
      quality: null,
      triggerType: null,
    });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Filter header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="default" className="ml-1">
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform',
                isExpanded && 'rotate-180'
              )}
            />
          </Button>

          {/* Results count */}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredCount === totalCount
              ? `${totalCount} workflows`
              : `${filteredCount} of ${totalCount} workflows`}
          </span>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Sort:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value as SortOption)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-800"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expanded filters */}
      {isExpanded && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          {/* Category filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() =>
                    updateFilter(
                      'category',
                      filters.category === cat.slug ? null : cat.slug
                    )
                  }
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-full border transition-colors',
                    filters.category === cat.slug
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-brand-300'
                  )}
                >
                  {cat.icon} {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </div>

          {/* Source filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Source
            </label>
            <div className="flex flex-wrap gap-2">
              {sourceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateFilter('source', option.value as FilterState['source'])
                  }
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-full border transition-colors',
                    filters.source === option.value
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-brand-300'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trigger type filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Trigger Type
            </label>
            <div className="flex flex-wrap gap-2">
              {triggerOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateFilter(
                      'triggerType',
                      filters.triggerType === option.value ? null : option.value
                    )
                  }
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-full border transition-colors',
                    filters.triggerType === option.value
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-brand-300'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quality filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Minimum Quality
            </label>
            <div className="flex flex-wrap gap-2">
              {[5, 4, 3].map((q) => (
                <button
                  key={q}
                  onClick={() =>
                    updateFilter('quality', filters.quality === q ? null : q)
                  }
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-full border transition-colors',
                    filters.quality === q
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-brand-300'
                  )}
                >
                  {'★'.repeat(q)} & up
                </button>
              ))}
            </div>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Active filters chips */}
      {hasActiveFilters && !isExpanded && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-gray-200"
              onClick={() => updateFilter('category', null)}
            >
              {categories.find((c) => c.slug === filters.category)?.name}
              <X className="w-3 h-3" />
            </Badge>
          )}
          {filters.source !== 'all' && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-gray-200"
              onClick={() => updateFilter('source', 'all')}
            >
              {filters.source === 'awesome' ? 'Curated' : 'Community'}
              <X className="w-3 h-3" />
            </Badge>
          )}
          {filters.triggerType && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-gray-200"
              onClick={() => updateFilter('triggerType', null)}
            >
              {filters.triggerType}
              <X className="w-3 h-3" />
            </Badge>
          )}
          {filters.quality && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-gray-200"
              onClick={() => updateFilter('quality', null)}
            >
              {'★'.repeat(filters.quality)}+
              <X className="w-3 h-3" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
