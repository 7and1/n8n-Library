import Link from 'next/link';
import { Github, Heart, ExternalLink, Mail } from 'lucide-react';

const footerLinks = {
  browse: [
    { name: 'All Workflows', href: '/directory/' },
    { name: 'Categories', href: '/category/' },
    { name: 'Integrations', href: '/integration/' },
    { name: 'Search', href: '/search/' },
  ],
  categories: [
    { name: 'AI & Automation', href: '/category/ai-automation/' },
    { name: 'Communication', href: '/category/communication/' },
    { name: 'Productivity', href: '/category/productivity/' },
    { name: 'DevOps', href: '/category/devops/' },
  ],
  resources: [
    { name: 'About', href: '/about/' },
    { name: 'Submit Workflow', href: '/submit/' },
    { name: 'Contact Us', href: 'mailto:auto@n8n-library.com', external: true },
    { name: 'n8n Official', href: 'https://n8n.io', external: true },
    { name: 'n8n Docs', href: 'https://docs.n8n.io', external: true },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">n</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                n8n Library
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Discover 2,348+ free n8n workflow templates. Open source, community-driven.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/7and1/n8n-library"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="mailto:auto@n8n-library.com"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          {/* Browse links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Browse
            </h3>
            <ul className="space-y-2">
              {footerLinks.browse.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Category links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Categories
            </h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Resources
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} n8n Library. Not affiliated with n8n GmbH.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for the n8n community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
