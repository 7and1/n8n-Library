import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchClient } from './client';
import { getAllWorkflows, getCategories, getIntegrations } from '@/lib/data';
import { WorkflowGridSkeleton } from '@/components/workflow/WorkflowGrid';

export const metadata: Metadata = {
  title: 'Search Workflows',
  description:
    'Search through 2,300+ n8n workflow templates. Filter by category, integration, trigger type, and more.',
};

async function SearchContent() {
  // Fetch all data for client-side search
  const [workflows, categories, integrations] = await Promise.all([
    getAllWorkflows(),
    getCategories(),
    getIntegrations(),
  ]);

  return (
    <SearchClient
      initialWorkflows={workflows}
      categories={categories}
      integrations={integrations}
    />
  );
}

export default function SearchPage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Search Workflows
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find the perfect automation template from our collection of 2,300+ n8n workflows.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
              <div className="h-16 bg-gray-100 dark:bg-gray-800/50 rounded-xl animate-pulse" />
              <WorkflowGridSkeleton count={9} columns={3} />
            </div>
          }
        >
          <SearchContent />
        </Suspense>
      </div>
    </div>
  );
}
