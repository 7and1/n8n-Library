import type { Metadata } from 'next';
import { CategoryGrid } from '@/components/workflow/CategoryCard';
import { getCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Workflow Categories - Browse by Use Case',
  description:
    'Browse n8n workflow templates organized by category. Find automation templates for AI, communication, productivity, DevOps, CRM, e-commerce, and more.',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Browse by Category
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our collection of n8n workflow templates organized by use case. Each category contains curated and community automation templates.
          </p>
        </div>

        {/* Categories grid */}
        <CategoryGrid categories={categories} columns={4} />

        {/* Additional info */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Can&apos;t find what you&apos;re looking for?{' '}
            <a
              href="/search/"
              className="text-brand-600 dark:text-brand-400 hover:underline"
            >
              Try searching
            </a>{' '}
            or{' '}
            <a
              href="/submit/"
              className="text-brand-600 dark:text-brand-400 hover:underline"
            >
              submit your own workflow
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
