/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://n8n-library.com',
  outDir: './out',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 5000,

  // Exclude non-content pages
  exclude: ['/api/*', '/404', '/500'],

  // Robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    additionalSitemaps: [
      // Add additional sitemaps if needed
    ],
  },

  // Transform function for each URL
  transform: async (config, path) => {
    // Set priorities based on path type
    let priority = 0.7;
    let changefreq = 'weekly';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.startsWith('/category/')) {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path.startsWith('/integration/')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (path.startsWith('/workflow/')) {
      priority = 0.6;
      changefreq = 'monthly';
    } else if (path === '/search/' || path === '/directory/') {
      priority = 0.8;
      changefreq = 'daily';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
