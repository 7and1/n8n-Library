import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchClient } from '../search/client';
import { getCategories, getIntegrations, getStats } from '@/lib/data';
import { WorkflowGridSkeleton } from '@/components/workflow/WorkflowGrid';
import { clampPage, clampPageSize, parseFiltersFromObject, withDefaultFilters } from '@/lib/search';
import { executeWorkflowSearch } from '@/lib/search/engine';

export const metadata: Metadata = {
  title: 'All Workflows Directory',
  description:
    'Browse our complete directory of 2,348+ free n8n workflow templates. Filter by category, integration, quality, and more.',
};
export const dynamic = 'force-dynamic';

interface DirectoryPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

async function DirectoryContent({ searchParams }: DirectoryPageProps) {
  const partialFilters = parseFiltersFromObject(searchParams);
  const filters = withDefaultFilters(partialFilters);
  const pageParam = parseInt((searchParams.page as string) ?? '1', 10);
  const pageSizeParam = parseInt((searchParams.pageSize as string) ?? '24', 10);
  const page = clampPage(pageParam);
  const pageSize = clampPageSize(pageSizeParam);

  const [categories, integrations, stats, initialResponse] = await Promise.all([
    getCategories(),
    getIntegrations(),
    getStats(),
    executeWorkflowSearch(filters, page, pageSize),
  ]);

  return (
    <SearchClient
      categories={categories}
      integrations={integrations}
      initialFilters={filters}
      initialResponse={initialResponse}
      totalWorkflows={stats?.total ?? initialResponse.total}
      basePath="/directory"
    />
  );
}

export default function DirectoryPage(props: DirectoryPageProps) {
  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Workflow Directory
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse our complete collection of n8n automation templates. Use filters to find exactly what you need.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
              <div className="h-16 bg-gray-100 dark:bg-gray-800/50 rounded-xl animate-pulse" />
              <WorkflowGridSkeleton count={12} columns={3} />
            </div>
          }
        >
          <DirectoryContent {...props} />
        </Suspense>
      </div>
    </div>
  );
}
