import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Zap, GitFork, Users, Search, Clock, TrendingUp, CheckCircle2, Sparkles, Globe, Code2, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'n8n Library - 2,348+ Free n8n Workflow Templates & Automation Examples',
  description: 'Discover the largest collection of free n8n workflow templates. 2,348+ ready-to-use automation examples for AI, Slack, Google Sheets, Telegram & more. Import in seconds.',
  keywords: [
    'n8n workflows',
    'n8n templates',
    'workflow automation',
    'n8n examples',
    'automation templates',
    'no-code automation',
    'zapier alternative',
    'make alternative',
    'free automation templates',
  ],
  openGraph: {
    title: 'n8n Library - 2,348+ Free Workflow Templates',
    description: 'The largest collection of free n8n workflow templates. Ready-to-use automation for AI, messaging, productivity & more.',
    type: 'website',
  },
};
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/workflow/SearchBar';
import { WorkflowGrid } from '@/components/workflow/WorkflowGrid';
import { CategoryGrid } from '@/components/workflow/CategoryCard';
import { IntegrationIcon } from '@/components/workflow/IntegrationIcon';
import { getCategories, getFeaturedWorkflows, getLatestWorkflows, getTopIntegrations, getStats } from '@/lib/data';
import { formatNumber } from '@/lib/utils';

export default async function HomePage() {
  // Fetch data in parallel
  const [categories, featuredWorkflows, latestWorkflows, topIntegrations, stats] = await Promise.all([
    getCategories(),
    getFeaturedWorkflows(12),
    getLatestWorkflows(12),
    getTopIntegrations(12),
    getStats(),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-200/30 dark:bg-brand-900/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-medium">
              <GitFork className="w-4 h-4" />
              {stats ? formatNumber(stats.total) : '2,348'}+ Free Templates
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Discover n8n Workflow{' '}
              <span className="bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
                Templates
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Browse our collection of curated automation templates. Connect your favorite apps, automate repetitive tasks, and build powerful workflows in minutes.
            </p>

            {/* Search bar */}
            <div className="max-w-xl mx-auto mb-8">
              <SearchBar size="lg" placeholder="Search workflows by name, integration, or use case..." />
            </div>

            {/* Quick stats */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-500" />
                <span>{stats ? stats.bySource.awesome : 280} Curated</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-500" />
                <span>{stats ? stats.bySource.community : '2,000'}+ Community</span>
              </div>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-brand-500" />
                <span>{stats ? stats.integrations : 360}+ Integrations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Browse by Category
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Find workflows organized by use case
              </p>
            </div>
            <Link href="/category/">
              <Button variant="ghost" className="hidden sm:flex gap-2">
                View all categories
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <CategoryGrid categories={categories} columns={4} />
        </div>
      </section>

      {/* Featured Workflows Section */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Featured Workflows
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Hand-picked high-quality automation templates
              </p>
            </div>
            <Link href="/directory/">
              <Button variant="ghost" className="hidden sm:flex gap-2">
                Browse all
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <WorkflowGrid workflows={featuredWorkflows} columns={3} />

          <div className="mt-8 text-center sm:hidden">
            <Link href="/directory/">
              <Button variant="outline" className="gap-2">
                Browse all workflows
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Integrations Section */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Popular Integrations
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Browse workflows by your favorite apps and services
              </p>
            </div>
            <Link href="/integration/">
              <Button variant="ghost" className="hidden sm:flex gap-2">
                View all integrations
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {topIntegrations.map((integration) => (
              <Link
                key={integration.slug}
                href={`/integration/${integration.slug}/`}
                className="flex flex-col items-center p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all group"
              >
                <IntegrationIcon
                  slug={integration.icon}
                  name={integration.name}
                  size="lg"
                />
                <span className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {integration.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {integration.count} workflows
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/integration/">
              <Button variant="outline" className="gap-2">
                View all {stats ? stats.integrations : 364} integrations
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Added Section */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-brand-500" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Latest Added
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Recently added automation templates from the community
              </p>
            </div>
            <Link href="/directory/?sort=newest">
              <Button variant="ghost" className="hidden sm:flex gap-2">
                View all new
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <WorkflowGrid workflows={latestWorkflows} columns={3} />

          <div className="mt-8 text-center sm:hidden">
            <Link href="/directory/?sort=newest">
              <Button variant="outline" className="gap-2">
                View all new workflows
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-brand-500 to-brand-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Have a Great Workflow to Share?
          </h2>
          <p className="text-brand-100 mb-8 max-w-2xl mx-auto">
            Help the n8n community by contributing your automation templates. All submissions are reviewed and added to our library.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/submit/">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-brand-600 hover:bg-gray-100"
              >
                Submit a Workflow
              </Button>
            </Link>
            <a
              href="https://github.com/enescingoz/awesome-n8n-templates"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                <GitFork className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Rich Content Section - SEO optimized */}
      <section className="py-16 sm:py-24 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6" id="what-is-n8n">
              What is n8n and Why Should You Care?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              Look, I&apos;m going to be straight with you. The workflow automation market is exploding - we&apos;re
              talking about a <strong>$24.5 billion industry in 2024</strong> that&apos;s racing toward
              <strong> $78.6 billion by 2030</strong>. That&apos;s a 21.5% compound growth rate. Why? Because
              businesses are finally waking up to a simple truth: <em>repetitive tasks are productivity killers</em>.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              n8n (pronounced &quot;n-eight-n&quot;) is the fair-code automation platform that&apos;s changing the game.
              With <strong>230,000+ active users</strong> and growing 5x year-over-year, it&apos;s become the go-to
              choice for developers and technical teams who want real control over their automations - not some
              watered-down, click-here-pray-it-works solution.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-12">
            <Card className="p-6 text-center bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/20 dark:to-gray-900">
              <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-1">230K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active n8n Users</div>
            </Card>
            <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">$24.5B</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Market Size 2024</div>
            </Card>
            <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">75%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">LLM Integrations</div>
            </Card>
            <Card className="p-6 text-center bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-900">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">21.5%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Industry CAGR</div>
            </Card>
          </div>

          {/* Why Use Templates */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6" id="why-templates">
              Why Use Pre-Built Workflow Templates?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              Here&apos;s the deal - you could build every workflow from scratch. Spend hours figuring out the
              right node configurations, debugging connection issues, and wondering why your webhook isn&apos;t
              firing. <em>Or</em>, you could do what smart engineers do: start with a working template and
              customize it.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="flex items-start gap-4 p-6 rounded-xl bg-gray-50 dark:bg-gray-900">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Save 10+ Hours Per Workflow</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Why reinvent the wheel? Our templates are battle-tested by the community. Import, configure
                  your credentials, and you&apos;re running in minutes - not days.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-xl bg-gray-50 dark:bg-gray-900">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Code2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Learn Best Practices</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Each template shows you how experienced developers structure their workflows. Error handling,
                  data transformation, conditional logic - it&apos;s all there.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-xl bg-gray-50 dark:bg-gray-900">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI-Ready Templates</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Over 75% of n8n workflows now use LLM integrations. Our library includes cutting-edge AI
                  automation templates for OpenAI, Claude, Mistral, and more.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-xl bg-gray-50 dark:bg-gray-900">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">100% Free & Open Source</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Every template in our library is free to use. No subscriptions, no paywalls. Just copy,
                  paste, and automate. That&apos;s the open-source way.
                </p>
              </div>
            </div>
          </div>

          {/* How to Use */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6" id="how-to-use">
              How to Use n8n Library Templates
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              Getting started is stupidly simple. Seriously. If you can copy and paste, you can automate.
              Here&apos;s the three-minute workflow that will change how you work:
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4 my-8">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800">
              <div className="flex-shrink-0 w-10 h-10 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Find Your Template</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Browse by category, search by integration, or just scroll. We have {stats ? formatNumber(stats.total) : '2,348'}+ templates covering everything from AI chatbots to CRM automation.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800">
              <div className="flex-shrink-0 w-10 h-10 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Download or Copy the JSON</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Click the download button or copy the JSON directly. Each template is a complete, ready-to-import workflow file.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800">
              <div className="flex-shrink-0 w-10 h-10 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Import into n8n</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  In n8n, go to Workflows → Import from File. Select your JSON, configure your credentials, and activate. You&apos;re automating.
                </p>
              </div>
            </div>
          </div>

          {/* Popular Use Cases */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6" id="use-cases">
              What Can You Automate? (Spoiler: Almost Everything)
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              The automation possibilities are basically infinite, but here are the workflows our users
              build most often. These aren&apos;t theoretical - they&apos;re running in production right now:
            </p>
          </div>

          {/* Use Cases Grid */}
          <div className="grid md:grid-cols-2 gap-4 my-8">
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                AI & LLM Automation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                Build AI agents, automate content generation, create chatbots, and process documents with GPT-4, Claude, and local LLMs.
              </p>
              <Link href="/category/ai-automation/" className="text-brand-600 dark:text-brand-400 text-sm hover:underline">
                Browse AI Templates →
              </Link>
            </div>
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Team Communication
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                Connect Slack, Discord, Telegram, and email. Route notifications, sync messages, and keep your team in sync.
              </p>
              <Link href="/category/communication/" className="text-brand-600 dark:text-brand-400 text-sm hover:underline">
                Browse Communication Templates →
              </Link>
            </div>
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                CRM & Sales
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                Automate lead scoring, sync contacts across platforms, trigger follow-ups, and never drop a lead again.
              </p>
              <Link href="/category/crm-sales/" className="text-brand-600 dark:text-brand-400 text-sm hover:underline">
                Browse CRM Templates →
              </Link>
            </div>
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-500" />
                Data & Productivity
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                Sync spreadsheets, transform data, backup files, and create reporting dashboards that update themselves.
              </p>
              <Link href="/category/productivity/" className="text-brand-600 dark:text-brand-400 text-sm hover:underline">
                Browse Productivity Templates →
              </Link>
            </div>
          </div>

          {/* Market Data Table */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6" id="market-data">
              The Automation Market is Exploding (Here&apos;s the Data)
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              I&apos;m not just hyping automation because it sounds cool. The numbers speak for themselves.
              Here&apos;s what the latest industry research shows:
            </p>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto my-8">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Metric</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">2024</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">2030 (Projected)</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                <tr className="bg-white dark:bg-gray-950">
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Workflow Automation Market</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">$24.5B</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">$78.6B</td>
                  <td className="px-4 py-3 text-green-600 dark:text-green-400">+21.5% CAGR</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Cloud Deployment Share</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">62.87%</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">~75%</td>
                  <td className="px-4 py-3 text-green-600 dark:text-green-400">Growing</td>
                </tr>
                <tr className="bg-white dark:bg-gray-950">
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">n8n Active Users</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">230,000+</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">-</td>
                  <td className="px-4 py-3 text-green-600 dark:text-green-400">+5x YoY</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Digital Transformation Investment</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">$2.5T</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">$3.4T (2026)</td>
                  <td className="px-4 py-3 text-green-600 dark:text-green-400">+36%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-8">
            Sources:{' '}
            <a href="https://www.researchandmarkets.com/report/workflow-automation-software" target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 hover:underline">Research and Markets</a>,{' '}
            <a href="https://blog.n8n.io/2024-in-review/" target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 hover:underline">n8n Blog</a>,{' '}
            <a href="https://www.gminsights.com/industry-analysis/workflow-automation-market" target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 hover:underline">GM Insights</a>
          </p>

          {/* Why n8n */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6" id="why-n8n">
              Why n8n Over Zapier or Make?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              Look, Zapier and Make are fine tools. They work. But here&apos;s why technical teams
              are switching to n8n in droves:
            </p>
            <ul className="space-y-3 my-6 list-none pl-0">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <span className="text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">Self-hosted option</strong> - Your data stays on your servers. No third-party dependencies. Full control.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <span className="text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">Real code when needed</strong> - Write JavaScript or Python directly in your workflows. No limitations.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <span className="text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">Fair-code license</strong> - Open source with sustainable business model. Inspect every line.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <span className="text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">AI-native architecture</strong> - 75% of workflows use LLM integrations. Built for the AI era.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <span className="text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">No execution limits</strong> - Self-host and run unlimited workflows. Scale without scaling costs.
                </span>
              </li>
            </ul>
          </div>

          {/* About n8n Library */}
          <div className="prose prose-lg dark:prose-invert max-w-none mt-12 pt-12 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6" id="about-library">
              About n8n Library
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              n8n Library is an independent, community-driven project. We&apos;re not affiliated with
              n8n GmbH - we&apos;re just automation enthusiasts who believe the best workflows
              should be accessible to everyone.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              Our collection combines curated templates from the{' '}
              <a href="https://github.com/enescingoz/awesome-n8n-templates" target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 hover:underline">
                awesome-n8n-templates
              </a>{' '}
              repository with community contributions. Every template is reviewed for quality, security,
              and usefulness before being added to the library.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              Questions? Ideas? Want to contribute? Reach out at{' '}
              <a href="mailto:auto@n8n-library.com" className="text-brand-600 dark:text-brand-400 hover:underline">
                auto@n8n-library.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
