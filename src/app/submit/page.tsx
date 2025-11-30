import type { Metadata } from 'next';
import Link from 'next/link';
import { GitFork, FileJson, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Submit a Workflow',
  description:
    'Share your n8n workflow templates with the community. Learn how to submit your automation workflows to n8n Library.',
};

export default function SubmitPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Submit Your Workflow
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Share your automation expertise with the n8n community
          </p>
        </div>

        {/* Main content */}
        <div className="space-y-8">
          {/* Option 1: GitHub PR */}
          <Card className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <GitFork className="w-6 h-6 text-brand-600 dark:text-brand-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Option 1: GitHub Pull Request (Recommended)
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Submit your workflow directly to our curated awesome-n8n-templates repository.
                </p>

                <ol className="space-y-4 mb-6">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center text-sm font-medium">
                      1
                    </span>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Fork</strong> the{' '}
                        <a
                          href="https://github.com/enescingoz/awesome-n8n-templates"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-600 dark:text-brand-400 hover:underline"
                        >
                          awesome-n8n-templates
                        </a>{' '}
                        repository
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center text-sm font-medium">
                      2
                    </span>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Export</strong> your workflow from n8n as JSON
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center text-sm font-medium">
                      3
                    </span>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Add</strong> your JSON file to the appropriate category folder
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center text-sm font-medium">
                      4
                    </span>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Create</strong> a pull request with a description of your workflow
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="flex-shrink-0 w-6 h-6 text-green-500" />
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Wait</strong> for review and merge!
                      </p>
                    </div>
                  </li>
                </ol>

                <a
                  href="https://github.com/enescingoz/awesome-n8n-templates"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="gap-2">
                    Go to Repository
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </Card>

          {/* Option 2: GitHub Issue */}
          <Card className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileJson className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Option 2: GitHub Issue
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Not comfortable with pull requests? Create an issue and we&apos;ll add it for you.
                </p>

                <ol className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm font-medium">
                      1
                    </span>
                    <p className="text-gray-700 dark:text-gray-300">
                      Create a new issue with title: <code className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                        [Workflow] Your Workflow Name
                      </code>
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm font-medium">
                      2
                    </span>
                    <p className="text-gray-700 dark:text-gray-300">
                      Include: description, category, and paste your workflow JSON
                    </p>
                  </li>
                </ol>

                <a
                  href="https://github.com/enescingoz/awesome-n8n-templates/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="gap-2">
                    Create Issue
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </Card>

          {/* Guidelines */}
          <Card className="p-6 sm:p-8 bg-gray-50 dark:bg-gray-800/50 border-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Submission Guidelines
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Working workflows only</strong> - Test before submitting
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Remove credentials</strong> - Never include API keys or secrets
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Descriptive names</strong> - Use clear, meaningful workflow names
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Add documentation</strong> - Include Sticky Notes explaining the workflow
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Original work</strong> - Only submit workflows you created or have permission to share
                </span>
              </li>
            </ul>
          </Card>

          {/* Back to browse */}
          <div className="text-center">
            <Link href="/directory/">
              <Button variant="ghost" className="gap-2">
                Browse existing workflows
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
