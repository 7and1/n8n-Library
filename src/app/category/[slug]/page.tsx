import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, CheckCircle2, Zap, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WorkflowGrid } from '@/components/workflow/WorkflowGrid';
import { SearchBar } from '@/components/workflow/SearchBar';
import {
  getCategories,
  getCategoryBySlug,
  getWorkflowsByCategory,
} from '@/lib/data';
import { generateCategoryMetadata, generateCategoryJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';

// Category-specific content for SEO
const categoryContent: Record<string, {
  intro: string;
  benefits: string[];
  useCases: string[];
  tip: string;
}> = {
  'ai-automation': {
    intro: `AI automation is where the magic happens in 2024. With over 75% of n8n workflows now incorporating LLM integrations, it's clear that artificial intelligence isn't just a buzzword - it's the backbone of modern automation. These templates connect you to OpenAI, Claude, Mistral, local models, and everything in between.`,
    benefits: [
      'Build intelligent chatbots and AI agents that actually understand context',
      'Automate content generation - from blog posts to social media to emails',
      'Process and analyze documents at scale with vector databases',
      'Create RAG (Retrieval Augmented Generation) pipelines in minutes',
    ],
    useCases: [
      'Customer support automation with GPT-4',
      'Document analysis and summarization',
      'AI-powered data extraction',
      'Intelligent lead qualification',
    ],
    tip: `Pro tip: Start with a simple AI workflow first. Add a webhook trigger, connect to OpenAI, and return the response. Once you understand the basics, scale up to agents and chains.`,
  },
  'communication': {
    intro: `Team communication is the nervous system of any organization. These workflows connect your Slack, Discord, Telegram, email, and SMS into one unified automation layer. Stop manually forwarding messages and let n8n handle the routing.`,
    benefits: [
      'Sync messages across platforms automatically',
      'Route notifications based on content and urgency',
      'Create unified inbox workflows',
      'Build custom alerting systems',
    ],
    useCases: [
      'Slack-to-Email notification routing',
      'Discord bot automation',
      'Telegram alert systems',
      'Multi-channel broadcast workflows',
    ],
    tip: `Pro tip: Set up a "notification hub" workflow that receives all your alerts and routes them to the right channel based on priority. One workflow to rule them all.`,
  },
  'productivity': {
    intro: `Productivity isn't about working harder - it's about automating the boring stuff so you can focus on what matters. These workflows handle spreadsheet syncing, task management, calendar automation, and all those repetitive tasks that eat up your day.`,
    benefits: [
      'Sync data between Google Sheets, Airtable, and Notion automatically',
      'Automate task creation and assignment',
      'Schedule recurring reports and updates',
      'Build personal dashboards that update themselves',
    ],
    useCases: [
      'Google Sheets to database sync',
      'Automated meeting scheduling',
      'Task automation with Notion/Todoist',
      'Report generation and distribution',
    ],
    tip: `Pro tip: The best productivity workflows are the ones you forget exist. Set up a workflow, test it thoroughly, and let it run in the background. Automation should be invisible.`,
  },
  'devops': {
    intro: `DevOps is all about automation - it's literally in the job description. These workflows handle CI/CD notifications, infrastructure monitoring, deployment triggers, and incident response. If you're still manually checking build statuses, we need to talk.`,
    benefits: [
      'Get instant notifications on build failures',
      'Automate deployment workflows',
      'Monitor infrastructure and respond to incidents',
      'Sync issues across GitHub, Jira, and Linear',
    ],
    useCases: [
      'GitHub Actions integration',
      'Docker deployment automation',
      'Server monitoring and alerts',
      'Incident response workflows',
    ],
    tip: `Pro tip: Connect your CI/CD pipeline to Slack or Discord first. That instant feedback loop on every commit is a game-changer for team productivity.`,
  },
  'crm-sales': {
    intro: `Sales is a numbers game, and automation is how you multiply your numbers. These workflows handle lead scoring, CRM syncing, follow-up sequences, and pipeline management. Stop dropping leads and start closing deals.`,
    benefits: [
      'Automate lead capture and qualification',
      'Sync contacts across HubSpot, Salesforce, and Pipedrive',
      'Trigger follow-up sequences automatically',
      'Build real-time sales dashboards',
    ],
    useCases: [
      'Lead scoring automation',
      'CRM data synchronization',
      'Automated follow-up emails',
      'Pipeline stage automation',
    ],
    tip: `Pro tip: The best sales automation feels personal. Use merge fields, timing delays, and conditional logic to make automated outreach feel like it was written just for that prospect.`,
  },
  'e-commerce': {
    intro: `E-commerce runs on automation. Order processing, inventory updates, customer notifications, review requests - it all needs to happen automatically. These workflows connect your Shopify, WooCommerce, and payment systems into a seamless operation.`,
    benefits: [
      'Automate order fulfillment workflows',
      'Sync inventory across platforms',
      'Trigger customer notifications at every stage',
      'Build automated review and feedback systems',
    ],
    useCases: [
      'Order confirmation and tracking',
      'Inventory sync across channels',
      'Abandoned cart recovery',
      'Review request automation',
    ],
    tip: `Pro tip: Set up a post-purchase workflow that sends a thank you, asks for a review after delivery, and offers a discount for the next order. Customer lifetime value goes way up.`,
  },
  'data-processing': {
    intro: `Data is the new oil, but only if you can refine it. These workflows handle ETL operations, data transformation, format conversion, and database synchronization. Turn messy data into actionable insights.`,
    benefits: [
      'Transform data between formats automatically',
      'Build ETL pipelines without writing code',
      'Sync databases and APIs in real-time',
      'Clean and validate data at scale',
    ],
    useCases: [
      'CSV to database import',
      'API data aggregation',
      'Data cleaning pipelines',
      'Cross-platform data sync',
    ],
    tip: `Pro tip: Always validate incoming data before processing. A single malformed record can break an entire pipeline. Build in error handling from day one.`,
  },
  'utilities': {
    intro: `These are the Swiss Army knife workflows - the ones that don't fit neatly into other categories but are incredibly useful. File operations, scheduling, webhooks, and general-purpose automation tools.`,
    benefits: [
      'Automate file management and backups',
      'Build custom webhooks for any service',
      'Schedule tasks with precision',
      'Create utility workflows you can reuse everywhere',
    ],
    useCases: [
      'File backup automation',
      'Scheduled report generation',
      'Webhook routing and transformation',
      'System health checks',
    ],
    tip: `Pro tip: Build small, reusable utility workflows that you can call from other workflows. Think of them as functions - single responsibility, well-tested, infinitely composable.`,
  },
};

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

// Generate static paths for all categories
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

// Generate metadata
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) {
    return { title: 'Category Not Found' };
  }
  return generateCategoryMetadata(category);
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [category, workflows, allCategories] = await Promise.all([
    getCategoryBySlug(params.slug),
    getWorkflowsByCategory(params.slug),
    getCategories(),
  ]);

  if (!category) {
    notFound();
  }

  // JSON-LD structured data
  const categoryJsonLd = generateCategoryJsonLd(category);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: 'https://n8n-library.com/' },
    { name: 'Categories', url: 'https://n8n-library.com/category/' },
    { name: category.name, url: `https://n8n-library.com/category/${category.slug}/` },
  ]);

  // Get related categories (exclude current)
  const relatedCategories = allCategories
    .filter((c) => c.slug !== category.slug)
    .slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd) }}
      />
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
            <Link href="/category/" className="hover:text-brand-600 dark:hover:text-brand-400">
              Categories
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white">{category.name}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-5xl">{category.icon}</span>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {category.name} Workflows
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
              </div>
            </div>

            {/* Stats & Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {category.count}
                </span>{' '}
                workflow templates available
              </p>
              <div className="w-full sm:w-auto sm:min-w-[300px]">
                <SearchBar
                  size="sm"
                  placeholder={`Search ${category.name.toLowerCase()} workflows...`}
                />
              </div>
            </div>
          </div>

          {/* Workflow grid */}
          <WorkflowGrid
            workflows={workflows}
            columns={3}
            emptyMessage={`No ${category.name.toLowerCase()} workflows found.`}
          />

          {/* Rich Content Section */}
          {categoryContent[category.slug] && (
            <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
              <div className="max-w-3xl">
                {/* Introduction */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  About {category.name} Automation
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
                  {categoryContent[category.slug].intro}
                </p>

                {/* Benefits */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  What You Can Build
                </h3>
                <ul className="space-y-3 mb-8">
                  {categoryContent[category.slug].benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-400">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Popular Use Cases */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Popular Use Cases
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {categoryContent[category.slug].useCases.map((useCase, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900"
                    >
                      <Zap className="w-4 h-4 text-brand-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{useCase}</span>
                    </div>
                  ))}
                </div>

                {/* Pro Tip */}
                <Card className="p-6 bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">💡 </strong>
                    {categoryContent[category.slug].tip}
                  </p>
                </Card>

                {/* How to Get Started */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    How to Get Started
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                      <div>
                        <p className="text-gray-700 dark:text-gray-300">
                          <strong>Browse the templates above</strong> - find one that matches your use case or comes close.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                      <div>
                        <p className="text-gray-700 dark:text-gray-300">
                          <strong>Download the JSON file</strong> - click the download button on any workflow page.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                      <div>
                        <p className="text-gray-700 dark:text-gray-300">
                          <strong>Import into n8n</strong> - go to Workflows → Import from File and select your JSON.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                      <div>
                        <p className="text-gray-700 dark:text-gray-300">
                          <strong>Configure and customize</strong> - add your credentials and tweak the workflow to fit your needs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Related categories */}
          {relatedCategories.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Explore Other Categories
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}/`}
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all"
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white block">
                        {cat.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {cat.count} workflows
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back button */}
          <div className="mt-12">
            <Link href="/category/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to categories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
