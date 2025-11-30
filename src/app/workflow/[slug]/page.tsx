import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  ExternalLink,
  Box,
  GitFork,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QualityStars } from '@/components/workflow/QualityStars';
import { CategoryBadge } from '@/components/workflow/CategoryBadge';
import { TriggerBadge } from '@/components/workflow/TriggerBadge';
import { IntegrationIcon } from '@/components/workflow/IntegrationIcon';
import { WorkflowGrid } from '@/components/workflow/WorkflowGrid';
import {
  getAllWorkflowSlugs,
  getWorkflowBySlug,
  getRelatedWorkflows,
} from '@/lib/data';
import {
  generateWorkflowMetadata,
  generateWorkflowJsonLd,
  generateBreadcrumbJsonLd,
} from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import { CopyButton, DownloadButton, JsonCodePreview, WorkflowVisualization } from './client-components';

interface WorkflowPageProps {
  params: {
    slug: string;
  };
}

// Generate static paths for all workflows
export async function generateStaticParams() {
  const slugs = await getAllWorkflowSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata
export async function generateMetadata({
  params,
}: WorkflowPageProps): Promise<Metadata> {
  const workflow = await getWorkflowBySlug(params.slug);
  if (!workflow) {
    return { title: 'Workflow Not Found' };
  }
  return generateWorkflowMetadata(workflow);
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const workflow = await getWorkflowBySlug(params.slug);

  if (!workflow) {
    notFound();
  }

  const relatedWorkflows = await getRelatedWorkflows(workflow, 6);

  // JSON-LD structured data
  const workflowJsonLd = generateWorkflowJsonLd(workflow);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: 'https://n8n-library.com/' },
    { name: workflow.categoryName, url: `https://n8n-library.com/category/${workflow.category}/` },
    { name: workflow.name, url: `https://n8n-library.com/workflow/${workflow.slug}/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workflowJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
            <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <Link
              href={`/category/${workflow.category}/`}
              className="hover:text-brand-600 dark:hover:text-brand-400"
            >
              {workflow.categoryName}
            </Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <span className="text-gray-900 dark:text-white truncate">{workflow.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <CategoryBadge
                      slug={workflow.category}
                      name={workflow.categoryName}
                      icon={workflow.categoryIcon}
                      color={`cat-${workflow.category.split('-')[0]}`}
                    />
                    {workflow.source === 'awesome' && (
                      <Badge variant="awesome">
                        <GitFork className="w-3 h-3 mr-1" />
                        Curated
                      </Badge>
                    )}
                  </div>
                  <QualityStars quality={workflow.quality} size="md" showLabel />
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {workflow.name}
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {workflow.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <DownloadButton workflow={workflow.workflow} name={workflow.slug} />
                <CopyButton workflow={workflow.workflow} />
                <a
                  href={workflow.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View on GitHub
                  </Button>
                </a>
              </div>

              {/* Integrations */}
              <Card className="p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Integrations Used ({workflow.integrations.length})
                </h2>
                <div className="flex flex-wrap gap-3">
                  {workflow.integrations.map((integration) => (
                    <Link
                      key={integration.slug}
                      href={`/integration/${integration.slug}/`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand-300 dark:hover:border-brand-600 transition-colors"
                    >
                      <IntegrationIcon
                        slug={integration.icon}
                        name={integration.name}
                        size="sm"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {integration.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </Card>

              {/* Workflow Visualization */}
              <div className="mb-6">
                <WorkflowVisualization workflow={workflow.workflow} />
              </div>

              {/* JSON Code Preview */}
              <div className="mb-6">
                <JsonCodePreview workflow={workflow.workflow} />
              </div>

              {/* How to use */}
              <Card className="p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  How to Use This Workflow
                </h2>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center text-sm font-medium">
                      1
                    </span>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Download</strong> the JSON file using the button above
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center text-sm font-medium">
                      2
                    </span>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Import</strong> in n8n: Workflows → Import from File
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center text-sm font-medium">
                      3
                    </span>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Configure</strong> your credentials for each integration
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center text-sm font-medium">
                      4
                    </span>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Customize</strong> the workflow to fit your needs
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="flex-shrink-0 w-6 h-6 text-green-500" />
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Activate</strong> and you&apos;re ready to go!
                      </p>
                    </div>
                  </li>
                </ol>
              </Card>

              {/* Tags */}
              {workflow.tags.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {workflow.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/search/?q=${encodeURIComponent(tag)}`}
                        className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Quick info */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Workflow Details
                  </h3>
                  <dl className="space-y-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <Box className="w-4 h-4" />
                        Nodes
                      </dt>
                      <dd className="font-medium text-gray-900 dark:text-white">
                        {workflow.nodeCount}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-gray-500 dark:text-gray-400">Trigger</dt>
                      <dd>
                        <TriggerBadge trigger={workflow.triggerType} />
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-gray-500 dark:text-gray-400">Source</dt>
                      <dd className="font-medium text-gray-900 dark:text-white capitalize">
                        {workflow.source}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Added
                      </dt>
                      <dd className="font-medium text-gray-900 dark:text-white">
                        {formatDate(workflow.createdAt)}
                      </dd>
                    </div>
                  </dl>
                </Card>

                {/* Need help */}
                <Card className="p-6 bg-gray-50 dark:bg-gray-800/50 border-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Need Help?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Check out the official n8n documentation for detailed guides.
                  </p>
                  <a
                    href="https://docs.n8n.io"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full gap-2">
                      <ExternalLink className="w-4 h-4" />
                      n8n Docs
                    </Button>
                  </a>
                </Card>
              </div>
            </div>
          </div>

          {/* Related workflows */}
          {relatedWorkflows.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Related Workflows
              </h2>
              <WorkflowGrid workflows={relatedWorkflows} columns={3} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
