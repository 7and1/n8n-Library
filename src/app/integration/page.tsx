import type { Metadata } from 'next';
import Link from 'next/link';
import { IntegrationIcon } from '@/components/workflow/IntegrationIcon';
import { SearchBar } from '@/components/workflow/SearchBar';
import { getIntegrations } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Integrations - Browse Workflows by App',
  description:
    'Browse n8n workflow templates by integration. Find automation templates for Slack, Telegram, Gmail, Google Sheets, OpenAI, and 150+ more apps and services.',
};

export default async function IntegrationsPage() {
  const integrations = await getIntegrations();

  // Group by first letter for better navigation
  const groupedIntegrations = integrations.reduce(
    (acc, integration) => {
      const letter = integration.name[0].toUpperCase();
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(integration);
      return acc;
    },
    {} as Record<string, typeof integrations>
  );

  const letters = Object.keys(groupedIntegrations).sort();

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Browse by Integration
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Find n8n workflow templates for your favorite apps and services. We support {integrations.length}+ integrations.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <SearchBar size="md" placeholder="Search integrations..." />
          </div>
        </div>

        {/* Letter navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#${letter}`}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand-100 hover:text-brand-600 dark:hover:bg-brand-900/30 dark:hover:text-brand-400 transition-colors"
            >
              {letter}
            </a>
          ))}
        </div>

        {/* Integrations by letter */}
        <div className="space-y-12">
          {letters.map((letter) => (
            <div key={letter} id={letter}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 sticky top-20 bg-white dark:bg-gray-950 py-2 z-10">
                {letter}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {groupedIntegrations[letter].map((integration) => (
                  <Link
                    key={integration.slug}
                    href={`/integration/${integration.slug}/`}
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all group"
                  >
                    <IntegrationIcon
                      slug={integration.icon}
                      name={integration.name}
                      size="md"
                    />
                    <div className="min-w-0">
                      <span className="font-medium text-gray-900 dark:text-white block truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {integration.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {integration.count} workflows
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Missing an integration?{' '}
            <a
              href="/submit/"
              className="text-brand-600 dark:text-brand-400 hover:underline"
            >
              Submit a workflow
            </a>{' '}
            using your favorite app.
          </p>
        </div>
      </div>
    </div>
  );
}
