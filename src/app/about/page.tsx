import type { Metadata } from 'next';
import Link from 'next/link';
import { GitFork, Heart, Users, Zap, ExternalLink, Github, Mail, CheckCircle2, TrendingUp, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getStats } from '@/lib/data';

export const metadata: Metadata = {
  title: 'About n8n Library - Free Workflow Templates for Automation',
  description:
    'n8n Library is the largest free collection of n8n workflow templates. 2,348+ automation examples, 360+ integrations. Learn about our mission and data sources.',
  keywords: [
    'n8n library',
    'workflow templates',
    'automation community',
    'n8n tutorials',
    'free automation',
    'open source automation',
  ],
};

export default async function AboutPage() {
  const stats = await getStats();

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About n8n Library
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            The largest free collection of n8n workflow templates
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            <Card className="p-4 text-center bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/20 dark:to-gray-900">
              <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-1">
                {stats.total.toLocaleString()}+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Workflows</div>
            </Card>
            <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {stats.bySource.awesome}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Curated</div>
            </Card>
            <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {stats.integrations}+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Integrations</div>
            </Card>
            <Card className="p-4 text-center bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-900">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                {stats.categories}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
            </Card>
          </div>
        )}

        {/* Introduction */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            What is n8n Library?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-4">
            Let me be real with you - building automation workflows from scratch is a time sink.
            Every minute you spend configuring nodes and debugging connections is a minute you&apos;re
            not shipping features or growing your business.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-4">
            n8n Library exists to solve that problem. We&apos;ve collected over <strong>2,348 free
            n8n workflow templates</strong> from the community, organized them by category and
            integration, and made them available for anyone to download and use. No accounts,
            no subscriptions, no BS.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            Think of us as the GitHub for n8n workflows - a place where automation enthusiasts
            share what works, learn from each other, and save countless hours of development time.
          </p>
        </div>

        {/* Why We Built This */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Why We Built This
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
            The automation space is exploding. The workflow automation market hit{' '}
            <strong>$24.5 billion in 2024</strong> and is projected to reach{' '}
            <strong>$78.6 billion by 2030</strong>. n8n alone has over <strong>230,000 active users</strong>.
            But here&apos;s the thing - most people are reinventing the wheel.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
              <TrendingUp className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">75% of n8n workflows use AI</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">LLM integrations are now the norm</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
              <Globe className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">150+ integrations covered</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">From Slack to OpenAI to Shopify</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
              <Shield className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">100% free forever</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">No paywalls, no premium tiers</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
              <Zap className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Import in seconds</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Download JSON, import, done</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Our Data Sources
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
            Every template in our library comes from trusted community sources. We don&apos;t
            auto-generate workflows - these are real automation solutions built by real people
            solving real problems.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center">
                  <GitFork className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Awesome n8n Templates
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {stats?.bySource.awesome || 280} curated workflows
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Hand-picked, high-quality templates maintained by the community.
                Every workflow is reviewed for quality and usefulness.
              </p>
              <a
                href="https://github.com/enescingoz/awesome-n8n-templates"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
              >
                View on GitHub <ExternalLink className="w-3 h-3" />
              </a>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    n8n Workflows
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {stats?.bySource.community.toLocaleString() || '2,000'}+ community workflows
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Community-contributed workflows from the broader n8n ecosystem.
                Real solutions for real automation challenges.
              </p>
              <a
                href="https://github.com/Zie619/n8n-workflows"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
              >
                View on GitHub <ExternalLink className="w-3 h-3" />
              </a>
            </Card>
          </div>
        </div>

        {/* Who Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Who Is This For?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 dark:text-gray-400">
                <strong className="text-gray-900 dark:text-white">Beginners</strong> who want to learn automation patterns without starting from zero
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 dark:text-gray-400">
                <strong className="text-gray-900 dark:text-white">Developers</strong> who need working examples for client projects or internal tools
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 dark:text-gray-400">
                <strong className="text-gray-900 dark:text-white">Teams</strong> looking to standardize workflows across their organization
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 dark:text-gray-400">
                <strong className="text-gray-900 dark:text-white">Entrepreneurs</strong> building automated businesses without a technical background
              </span>
            </li>
          </ul>
        </div>

        {/* Contributing */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Contributing
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-4">
            Have a workflow that&apos;s been running flawlessly in production? Share it with the community.
            The best automation knowledge is collective - and we&apos;d love your contribution.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 dark:text-gray-400">Submit your own workflows via GitHub PR or issue</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 dark:text-gray-400">Report issues or suggest improvements to existing templates</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 dark:text-gray-400">Help translate or document workflows for the community</span>
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <Card className="p-6 mb-12 bg-gray-50 dark:bg-gray-900 border-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Important Disclaimer
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            <strong>n8n Library is not affiliated with n8n GmbH.</strong> This is an independent,
            community-driven project. We are automation enthusiasts, not the company behind n8n.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            n8n is a registered trademark of n8n GmbH. For official n8n resources, documentation,
            and support, please visit{' '}
            <a href="https://n8n.io" target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 hover:underline">
              n8n.io
            </a>.
          </p>
        </Card>

        {/* Contact */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-4">
            Questions? Feedback? Partnership ideas? We&apos;d love to hear from you.
          </p>
          <Card className="p-6 bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800">
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-brand-600 dark:text-brand-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email Us</p>
                <a
                  href="mailto:auto@n8n-library.com"
                  className="text-brand-600 dark:text-brand-400 hover:underline"
                >
                  auto@n8n-library.com
                </a>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/submit/">
              <Button size="lg" className="gap-2">
                <Zap className="w-4 h-4" />
                Submit a Workflow
              </Button>
            </Link>
            <a
              href="https://github.com/enescingoz/awesome-n8n-templates"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="gap-2">
                <Github className="w-4 h-4" />
                View on GitHub
              </Button>
            </a>
          </div>
        </div>

        {/* Footer message */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for the n8n community
          </p>
        </div>
      </div>
    </div>
  );
}
