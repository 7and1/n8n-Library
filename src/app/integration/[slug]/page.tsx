import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WorkflowGrid } from '@/components/workflow/WorkflowGrid';
import { SearchBar } from '@/components/workflow/SearchBar';
import { IntegrationIcon } from '@/components/workflow/IntegrationIcon';
import {
  getIntegrations,
  getIntegrationBySlug,
  getWorkflowsByIntegration,
} from '@/lib/data';
import { generateIntegrationMetadata, generateBreadcrumbJsonLd } from '@/lib/seo';

interface IntegrationPageProps {
  params: {
    slug: string;
  };
}

// Generate static paths for top integrations
export async function generateStaticParams() {
  const integrations = await getIntegrations();
  // Generate pages for all integrations
  return integrations.map((integration) => ({
    slug: integration.slug,
  }));
}

// Generate metadata
export async function generateMetadata({
  params,
}: IntegrationPageProps): Promise<Metadata> {
  const integration = await getIntegrationBySlug(params.slug);
  if (!integration) {
    return { title: 'Integration Not Found' };
  }
  return generateIntegrationMetadata(integration);
}

export default async function IntegrationPage({ params }: IntegrationPageProps) {
  const [integration, workflows, allIntegrations] = await Promise.all([
    getIntegrationBySlug(params.slug),
    getWorkflowsByIntegration(params.slug),
    getIntegrations(),
  ]);

  if (!integration) {
    notFound();
  }

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: 'https://n8n-library.com/' },
    { name: 'Integrations', url: 'https://n8n-library.com/integration/' },
    { name: integration.name, url: `https://n8n-library.com/integration/${integration.slug}/` },
  ]);

  // Get related integrations (same categories, exclude current)
  const relatedIntegrations = allIntegrations
    .filter(
      (i) =>
        i.slug !== integration.slug &&
        i.categories.some((c) => integration.categories.includes(c))
    )
    .slice(0, 6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/integration/" className="hover:text-brand-600 dark:hover:text-brand-400">
              Integrations
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white">{integration.name}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
                <IntegrationIcon
                  slug={integration.icon}
                  name={integration.name}
                  size="lg"
                />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {integration.name} Workflows
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Discover n8n automation templates using {integration.name}. Ready to import and customize.
                </p>
              </div>
            </div>

            {/* Stats & Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {integration.count}
                </span>{' '}
                workflow templates available
              </p>
              <div className="w-full sm:w-auto sm:min-w-[300px]">
                <SearchBar
                  size="sm"
                  placeholder={`Search ${integration.name} workflows...`}
                />
              </div>
            </div>
          </div>

          {/* Workflow grid */}
          <WorkflowGrid
            workflows={workflows}
            columns={3}
            emptyMessage={`No ${integration.name} workflows found.`}
          />

          {/* Rich Content Section */}
          <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-3xl">
              {/* Introduction */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Automate {integration.name} with n8n
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                {integration.name} is one of the most popular integrations in the n8n ecosystem.
                With <strong>{integration.count} ready-to-use templates</strong>, you can connect {integration.name} to
                hundreds of other apps and services without writing a single line of code.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
                These workflows are built by the community and cover everything from simple data syncs
                to complex multi-step automations. Each template is free to download, import into n8n,
                and customize for your specific needs.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">{integration.count}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Templates</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">Free</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">100% Free</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">1-Click</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Import</div>
                </Card>
              </div>

              {/* How to Use */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                How to Use These {integration.name} Templates
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Find a template</strong> that matches your use case from the list above.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Download the JSON file</strong> from the workflow detail page.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Import into n8n</strong> - go to Workflows → Import from File.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Add your {integration.name} credentials</strong> and configure the workflow.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Why Automate with {integration.name}?
              </h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-400">
                    <strong className="text-gray-900 dark:text-white">Save hours every week</strong> by automating repetitive tasks
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-400">
                    <strong className="text-gray-900 dark:text-white">Connect to 400+ apps</strong> - n8n integrates with virtually everything
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-400">
                    <strong className="text-gray-900 dark:text-white">No coding required</strong> - visual workflow builder makes it easy
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-400">
                    <strong className="text-gray-900 dark:text-white">Self-host for free</strong> - keep your data on your own servers
                  </span>
                </li>
              </ul>

              {/* CTA */}
              <Card className="p-6 bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800">
                <div className="flex items-start gap-4">
                  <Zap className="w-6 h-6 text-brand-600 dark:text-brand-400 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      <strong className="text-gray-900 dark:text-white">New to n8n?</strong>{' '}
                      Get started in 5 minutes. Download the{' '}
                      <a href="https://n8n.io" target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 hover:underline">
                        n8n desktop app
                      </a>{' '}
                      or self-host with Docker.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Questions? Contact us at{' '}
                      <a href="mailto:auto@n8n-library.com" className="text-brand-600 dark:text-brand-400 hover:underline">
                        auto@n8n-library.com
                      </a>
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Related integrations */}
          {relatedIntegrations.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Related Integrations
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {relatedIntegrations.map((int) => (
                  <Link
                    key={int.slug}
                    href={`/integration/${int.slug}/`}
                    className="flex flex-col items-center p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all group"
                  >
                    <IntegrationIcon
                      slug={int.icon}
                      name={int.name}
                      size="md"
                    />
                    <span className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors text-center">
                      {int.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {int.count} workflows
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back button */}
          <div className="mt-12">
            <Link href="/integration/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to integrations
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
