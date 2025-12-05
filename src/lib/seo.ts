import type { Metadata } from 'next';
import type { WorkflowDetail, Category, IntegrationSummary } from '@/types';

const SITE_URL = process.env.SITE_URL || 'https://n8n-library.com';
const SITE_NAME = 'n8n Library';

/**
 * Default metadata
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Free n8n Workflow Templates`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Discover 2,348+ free n8n workflow templates. Browse curated automation templates for AI, Telegram, Slack, Google Sheets, and more. Open source and ready to use.',
  keywords: [
    'n8n',
    'workflow',
    'automation',
    'templates',
    'no-code',
    'low-code',
    'integration',
    'zapier alternative',
    'make alternative',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Free n8n Workflow Templates`,
    description:
      'Discover 2,348+ free n8n workflow templates for automation. AI, messaging, productivity, and more.',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Free n8n Workflow Templates`,
    description:
      'Discover 2,348+ free n8n workflow templates for automation.',
    images: [`${SITE_URL}/og-image.png`],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

/**
 * Generate metadata for workflow detail page
 */
export function generateWorkflowMetadata(workflow: WorkflowDetail): Metadata {
  const title = `${workflow.name} - n8n Workflow Template`;
  const description =
    workflow.description.length > 155
      ? workflow.description.slice(0, 152) + '...'
      : workflow.description;

  const integrationNames = workflow.integrations
    .slice(0, 3)
    .map((i) => i.name)
    .join(', ');

  return {
    title,
    description,
    keywords: [
      'n8n workflow',
      workflow.categoryName.toLowerCase(),
      ...workflow.integrations.map((i) => i.name.toLowerCase()),
      workflow.triggerType,
      'automation template',
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${SITE_URL}/workflow/${workflow.slug}/`,
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: workflow.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/workflow/${workflow.slug}/`,
    },
    other: {
      'article:published_time': workflow.createdAt,
      'article:tag': integrationNames,
    },
  };
}

/**
 * Generate metadata for category page
 */
export function generateCategoryMetadata(category: Category): Metadata {
  const title = `${category.name} n8n Templates & Workflows`;
  const description = `Browse ${category.count}+ free ${category.name.toLowerCase()} workflow templates for n8n. ${category.description}`;

  return {
    title,
    description,
    keywords: [
      'n8n',
      category.name.toLowerCase(),
      'workflow templates',
      'automation',
      `${category.name.toLowerCase()} automation`,
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_URL}/category/${category.slug}/`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/category/${category.slug}/`,
    },
  };
}

/**
 * Generate metadata for integration page
 */
export function generateIntegrationMetadata(integration: IntegrationSummary): Metadata {
  const title = `${integration.name} n8n Workflows & Templates`;
  const description = `Discover ${integration.count}+ free n8n workflow templates for ${integration.name}. Automate your ${integration.name} integration with ready-to-use automation templates.`;

  return {
    title,
    description,
    keywords: [
      'n8n',
      integration.name.toLowerCase(),
      `${integration.name.toLowerCase()} automation`,
      `${integration.name.toLowerCase()} workflow`,
      'integration',
      'automation template',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_URL}/integration/${integration.slug}/`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/integration/${integration.slug}/`,
    },
  };
}

/**
 * Generate JSON-LD structured data for workflow
 */
export function generateWorkflowJsonLd(workflow: WorkflowDetail): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: workflow.name,
    description: workflow.description,
    codeRepository: workflow.sourceUrl,
    programmingLanguage: 'JSON',
    runtimePlatform: 'n8n',
    applicationCategory: 'Automation',
    applicationSubCategory: workflow.categoryName,
    dateCreated: workflow.createdAt,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: workflow.quality,
      bestRating: 5,
      worstRating: 1,
      ratingCount: 1,
    },
    keywords: workflow.integrations.map((i) => i.name).join(', '),
    isAccessibleForFree: true,
    license: 'https://opensource.org/licenses/MIT',
  };
}

/**
 * Generate JSON-LD structured data for website
 */
export function generateWebsiteJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'Discover 2,348+ free n8n workflow templates for automation.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate JSON-LD structured data for category collection
 */
export function generateCategoryJsonLd(category: Category): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} n8n Templates`,
    description: category.description,
    url: `${SITE_URL}/category/${category.slug}/`,
    numberOfItems: category.count,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [],
    },
  };
}

/**
 * Generate BreadcrumbList JSON-LD
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
