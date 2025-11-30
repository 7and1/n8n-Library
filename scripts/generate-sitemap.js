#!/usr/bin/env node
/**
 * Sitemap Generator for n8n Library
 * Generates sitemap.xml and sitemap-index.xml for static export
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://n8n-library.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'out');
const DATA_DIR = path.join(__dirname, '..', 'public', 'data');

// URL entry helper
function createUrlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// Generate sitemap
async function generateSitemap() {
  console.log('🗺️  Generating sitemap...');

  const today = new Date().toISOString().split('T')[0];
  const urls = [];

  // Static pages
  const staticPages = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/search/', priority: '0.8', changefreq: 'daily' },
    { path: '/directory/', priority: '0.8', changefreq: 'daily' },
    { path: '/category/', priority: '0.8', changefreq: 'weekly' },
    { path: '/integration/', priority: '0.8', changefreq: 'weekly' },
    { path: '/about/', priority: '0.5', changefreq: 'monthly' },
    { path: '/submit/', priority: '0.5', changefreq: 'monthly' },
  ];

  for (const page of staticPages) {
    urls.push(createUrlEntry(
      `${BASE_URL}${page.path}`,
      today,
      page.changefreq,
      page.priority
    ));
  }

  // Category pages
  const categoriesPath = path.join(DATA_DIR, 'categories.json');
  if (fs.existsSync(categoriesPath)) {
    const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    for (const category of categories) {
      urls.push(createUrlEntry(
        `${BASE_URL}/category/${category.slug}/`,
        today,
        'weekly',
        '0.7'
      ));
    }
  }

  // Integration pages
  const integrationsPath = path.join(DATA_DIR, 'integrations.json');
  if (fs.existsSync(integrationsPath)) {
    const integrations = JSON.parse(fs.readFileSync(integrationsPath, 'utf8'));
    for (const integration of integrations) {
      urls.push(createUrlEntry(
        `${BASE_URL}/integration/${integration.slug}/`,
        today,
        'weekly',
        '0.6'
      ));
    }
  }

  // Workflow pages
  const indexPath = path.join(DATA_DIR, 'index.json');
  if (fs.existsSync(indexPath)) {
    const workflows = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    for (const workflow of workflows) {
      urls.push(createUrlEntry(
        `${BASE_URL}/workflow/${workflow.slug}/`,
        today,
        'monthly',
        '0.5'
      ));
    }
  }

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  // Write sitemap
  const sitemapPath = path.join(OUTPUT_DIR, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`✅ Generated sitemap.xml with ${urls.length} URLs`);

  // Generate sitemap index (for larger sitemaps)
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

  const sitemapIndexPath = path.join(OUTPUT_DIR, 'sitemap-index.xml');
  fs.writeFileSync(sitemapIndexPath, sitemapIndex);
  console.log('✅ Generated sitemap-index.xml');
}

// Run
generateSitemap().catch(console.error);
