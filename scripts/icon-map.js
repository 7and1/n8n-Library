/**
 * Icon Mapping for n8n Library ETL
 * Maps n8n node types to simple-icons slugs and provides icon resolution utilities
 */

// Simple Icons CDN base URL
const SIMPLE_ICONS_CDN = 'https://cdn.simpleicons.org';

// Local icons path (relative to public)
const LOCAL_ICONS_PATH = '/icons/integrations';

/**
 * Mapping of n8n node types to simple-icons slugs
 * Keys are normalized node names (lowercase, without 'n8n-nodes-base.' prefix and 'Trigger' suffix)
 * Values are simple-icons slugs
 */
const ICON_MAP = {
  // AI & Machine Learning
  'openai': 'openai',
  'anthropic': 'anthropic',
  'openaiassistant': 'openai',
  'openaichat': 'openai',
  'langchain': 'langchain',
  'huggingface': 'huggingface',
  'ollama': 'ollama',
  'cohere': 'cohere',
  'gemini': 'google',
  'googleai': 'google',
  'googlevertexai': 'googlecloud',
  'mistralai': 'mistral',
  'mistral': 'mistral',
  'replicate': 'replicate',
  'stability': 'stablediffusion',
  'stabilityai': 'stablediffusion',
  'deepl': 'deepl',
  'ai': 'openai',
  'agent': 'openai',
  'basicllmchain': 'langchain',
  'summarizationchain': 'langchain',
  'retrievalqa': 'langchain',

  // Vector Stores & Embeddings
  'pinecone': 'pinecone',
  'pineconevectorstore': 'pinecone',
  'qdrant': 'qdrant',
  'qdrantvectorstore': 'qdrant',
  'weaviate': 'weaviate',
  'weaviatevectorstore': 'weaviate',
  'chromadb': 'googlechrome',
  'supabasevectorstore': 'supabase',
  'pgvector': 'postgresql',
  'vectorstorepgvector': 'postgresql',
  'inmemoryVectorstore': 'databricks',

  // Communication & Messaging
  'telegram': 'telegram',
  'discord': 'discord',
  'slack': 'slack',
  'whatsapp': 'whatsapp',
  'whatsappbusiness': 'whatsapp',
  'email': 'maildotru',
  'gmail': 'gmail',
  'smtp': 'maildotru',
  'imap': 'maildotru',
  'sendgrid': 'sendgrid',
  'mailchimp': 'mailchimp',
  'mailgun': 'mailgun',
  'postmark': 'postmark',
  'mailjet': 'mailjet',
  'ses': 'amazonses',
  'awsses': 'amazonses',
  'mandrill': 'mailchimp',
  'microsoftoutlook': 'microsoftoutlook',
  'outlook': 'microsoftoutlook',
  'mattermost': 'mattermost',
  'rocketchat': 'rocketdotchat',
  'teams': 'microsoftteams',
  'microsoftteams': 'microsoftteams',
  'line': 'line',
  'viber': 'viber',
  'twilio': 'twilio',
  'vonage': 'vonage',
  'messagebird': 'messagebird',
  'matrix': 'matrix',
  'zulip': 'zulip',
  'intercom': 'intercom',
  'crisp': 'crisp',
  'drift': 'drift',
  'pushbullet': 'pushbullet',
  'pushover': 'pushover',
  'gotify': 'gotify',

  // Cloud Storage & File Management
  'googledrive': 'googledrive',
  'dropbox': 'dropbox',
  'onedrive': 'onedrive',
  'microsoftonedrive': 'onedrive',
  'box': 'box',
  's3': 'amazons3',
  'awss3': 'amazons3',
  'nextcloud': 'nextcloud',
  'ftp': 'files',
  'sftp': 'files',
  'googlebigquery': 'googlebigquery',

  // Productivity & Project Management
  'notion': 'notion',
  'airtable': 'airtable',
  'googlesheets': 'googlesheets',
  'googledocs': 'googledocs',
  'googleslides': 'googleslides',
  'todoist': 'todoist',
  'trello': 'trello',
  'asana': 'asana',
  'clickup': 'clickup',
  'monday': 'mondaydotcom',
  'jira': 'jira',
  'jirasoftware': 'jira',
  'confluence': 'confluence',
  'linear': 'linear',
  'baserow': 'baserow',
  'coda': 'coda',
  'seatable': 'seatable',
  'evernote': 'evernote',
  'onenote': 'microsoftonenote',
  'googlecalendar': 'googlecalendar',
  'calendly': 'calendly',
  'wekan': 'wekan',
  'taiga': 'taiga',
  'kitemaker': 'kitemaker',
  'microsoftexcel': 'microsoftexcel',
  'excel': 'microsoftexcel',

  // DevOps & Infrastructure
  'github': 'github',
  'gitlab': 'gitlab',
  'bitbucket': 'bitbucket',
  'git': 'git',
  'docker': 'docker',
  'kubernetes': 'kubernetes',
  'aws': 'amazonaws',
  'awslambda': 'awslambda',
  'gcp': 'googlecloud',
  'azure': 'microsoftazure',
  'digitalocean': 'digitalocean',
  'heroku': 'heroku',
  'vercel': 'vercel',
  'netlify': 'netlify',
  'cloudflare': 'cloudflare',
  'jenkins': 'jenkins',
  'circleci': 'circleci',
  'travisci': 'travisci',
  'terraform': 'terraform',
  'ansible': 'ansible',
  'sentry': 'sentry',
  'sentryio': 'sentry',
  'datadog': 'datadog',
  'grafana': 'grafana',
  'prometheus': 'prometheus',
  'pagerduty': 'pagerduty',
  'ssh': 'gnubash',
  'executecommand': 'gnubash',
  'cortex': 'cortex',
  'rundeck': 'rundeck',
  'rabbitmq': 'rabbitmq',
  'mqtt': 'mqtt',

  // CRM & Sales
  'hubspot': 'hubspot',
  'pipedrive': 'pipedrive',
  'salesforce': 'salesforce',
  'zoho': 'zoho',
  'zohocrm': 'zoho',
  'zendesk': 'zendesk',
  'freshdesk': 'freshdesk',
  'helpscout': 'helpscout',
  'copper': 'copper',
  'close': 'close',
  'activecampaign': 'activecampaign',
  'keap': 'keap',
  'lemlist': 'lemlist',
  'hunter': 'hunter',
  'apollo': 'apollo',
  'outreach': 'outreach',
  'affinity': 'affinity',
  'orbit': 'orbit',
  'googlecontacts': 'googlecontacts',
  'salesmate': 'salesmate',

  // E-commerce & Payments
  'shopify': 'shopify',
  'woocommerce': 'woocommerce',
  'stripe': 'stripe',
  'paypal': 'paypal',
  'magento': 'magento',
  'bigcommerce': 'bigcommerce',
  'square': 'square',
  'gumroad': 'gumroad',
  'paddle': 'paddle',
  'chargebee': 'chargebee',
  'invoiceninja': 'invoiceninja',
  'quickbooks': 'quickbooks',
  'xero': 'xero',
  'wise': 'wise',
  'profitwell': 'profitwell',

  // Databases
  'postgres': 'postgresql',
  'postgresql': 'postgresql',
  'mysql': 'mysql',
  'mariadb': 'mariadb',
  'mongodb': 'mongodb',
  'redis': 'redis',
  'elasticsearch': 'elasticsearch',
  'supabase': 'supabase',
  'firebase': 'firebase',
  'googlecloudfirestore': 'firebase',
  'dynamodb': 'amazondynamodb',
  'snowflake': 'snowflake',
  'bigquery': 'googlebigquery',
  'sqlite': 'sqlite',
  'arangodb': 'arangodb',
  'neo4j': 'neo4j',
  'couchdb': 'couchbase',
  'cockroachdb': 'cockroachlabs',
  'cratedb': 'cratedb',
  'timescaledb': 'timescale',
  'questdb': 'questdb',
  'microsoftsql': 'microsoftsqlserver',
  'mssql': 'microsoftsqlserver',
  'clickhouse': 'clickhouse',

  // Social Media
  'twitter': 'twitter',
  'x': 'x',
  'facebook': 'facebook',
  'facebookads': 'facebook',
  'instagram': 'instagram',
  'linkedin': 'linkedin',
  'youtube': 'youtube',
  'tiktok': 'tiktok',
  'reddit': 'reddit',
  'pinterest': 'pinterest',
  'medium': 'medium',
  'spotify': 'spotify',

  // Content & CMS
  'wordpress': 'wordpress',
  'ghost': 'ghost',
  'contentful': 'contentful',
  'strapi': 'strapi',
  'storyblok': 'storyblok',
  'webflow': 'webflow',

  // Utilities & Tools
  'http': 'curl',
  'httprequest': 'curl',
  'webhook': 'webhook',
  'cron': 'clockify',
  'schedule': 'clockify',
  'graphql': 'graphql',
  'xml': 'xml',
  'json': 'json',
  'csv': 'files',
  'pdf': 'adobeacrobatreader',
  'readpdf': 'adobeacrobatreader',
  'html': 'html5',
  'htmlextract': 'html5',
  'markdown': 'markdown',
  'rss': 'rss',
  'rssfeed': 'rss',

  // Design & Media
  'figma': 'figma',
  'canva': 'canva',
  'bannerbear': 'bannerbear',
  'apitemplate': 'apitemplate',
  'editimage': 'imagemagick',
  'imagemagick': 'imagemagick',

  // Analytics
  'googleanalytics': 'googleanalytics',
  'posthog': 'posthog',
  'segment': 'segment',
  'mixpanel': 'mixpanel',
  'amplitude': 'amplitude',
  'clearbit': 'clearbit',

  // Automation & Integration
  'n8n': 'n8n',
  'zapier': 'zapier',
  'ifttt': 'ifttt',
  'make': 'integromat',
  'integromat': 'integromat',

  // Other Popular Services
  'notion': 'notion',
  'airtable': 'airtable',
  'typeform': 'typeform',
  'surveymonkey': 'surveymonkey',
  'jotform': 'jotform',
  'googleforms': 'googleforms',
  'zoom': 'zoom',
  'demio': 'demio',
  'clockify': 'clockify',
  'harvest': 'harvest',
  'toggl': 'toggltrack',
  'strava': 'strava',
  'bitly': 'bitly',
  'coingecko': 'coingecko',
  'hackernews': 'hackernews',
  'nasa': 'nasa',
  'openweathermap': 'openweathermap',
  'phantombuster': 'phantombuster',
  'brandfetch': 'brandfetch',
  'raindrop': 'raindrop',
  'disqus': 'disqus',
  'discourse': 'discourse',
  'beeminder': 'beeminder',
};

/**
 * Utility nodes that should be excluded from integration lists
 * These are n8n internal nodes, not external integrations
 */
const UTILITY_NODES = new Set([
  'n8n-nodes-base.set',
  'n8n-nodes-base.function',
  'n8n-nodes-base.functionItem',
  'n8n-nodes-base.noOp',
  'n8n-nodes-base.stickyNote',
  'n8n-nodes-base.merge',
  'n8n-nodes-base.if',
  'n8n-nodes-base.switch',
  'n8n-nodes-base.splitInBatches',
  'n8n-nodes-base.code',
  'n8n-nodes-base.manualTrigger',
  'n8n-nodes-base.start',
  'n8n-nodes-base.executeCommand',
  'n8n-nodes-base.filter',
  'n8n-nodes-base.sort',
  'n8n-nodes-base.limit',
  'n8n-nodes-base.itemLists',
  'n8n-nodes-base.dateTime',
  'n8n-nodes-base.crypto',
  'n8n-nodes-base.xml',
  'n8n-nodes-base.html',
  'n8n-nodes-base.markdown',
  'n8n-nodes-base.renameKeys',
  'n8n-nodes-base.respondToWebhook',
  'n8n-nodes-base.wait',
  'n8n-nodes-base.executeWorkflow',
  'n8n-nodes-base.errorTrigger',
  'n8n-nodes-base.stopAndError',
  'n8n-nodes-base.moveBinaryData',
  'n8n-nodes-base.spreadsheetFile',
  'n8n-nodes-base.readBinaryFile',
  'n8n-nodes-base.writeBinaryFile',
  'n8n-nodes-base.readBinaryFiles',
  'n8n-nodes-base.convertToFile',
  'n8n-nodes-base.extractFromFile',
  'n8n-nodes-base.aggregate',
  'n8n-nodes-base.compareDatasets',
  'n8n-nodes-base.removeDuplicates',
  'n8n-nodes-base.splitOut',
  'n8n-nodes-base.summarize',
  'n8n-nodes-base.debug',
  'n8n-nodes-base.noop',
]);

/**
 * Brand colors for popular integrations (used for styling)
 */
const BRAND_COLORS = {
  'openai': '#412991',
  'anthropic': '#191919',
  'telegram': '#26A5E4',
  'discord': '#5865F2',
  'slack': '#4A154B',
  'github': '#181717',
  'gmail': '#EA4335',
  'notion': '#000000',
  'airtable': '#18BFFF',
  'stripe': '#635BFF',
  'shopify': '#7AB55C',
  'hubspot': '#FF5C35',
  'salesforce': '#00A1E0',
  'postgres': '#4169E1',
  'mongodb': '#47A248',
  'redis': '#DC382D',
  'aws': '#FF9900',
  'google': '#4285F4',
  'microsoft': '#5E5E5E',
};

/**
 * Normalize a node type string to a lookup key
 * @param {string} nodeType - Full node type (e.g., 'n8n-nodes-base.telegramTrigger')
 * @returns {string} Normalized key (e.g., 'telegram')
 */
function normalizeNodeType(nodeType) {
  if (!nodeType) return '';

  // Remove prefix
  let normalized = nodeType.replace(/^n8n-nodes-base\./, '');
  normalized = normalized.replace(/^@n8n\/n8n-nodes-langchain\./, '');
  normalized = normalized.replace(/^n8n-nodes-langchain\./, '');

  // Remove common suffixes
  normalized = normalized.replace(/Trigger$/i, '');
  normalized = normalized.replace(/V\d+$/i, ''); // Version suffix like V2, V3
  normalized = normalized.replace(/Api$/i, '');

  return normalized.toLowerCase();
}

/**
 * Get the simple-icons slug for an integration
 * @param {string} nodeType - Full or normalized node type
 * @returns {string|null} Simple-icons slug or null if not found
 */
function getIconSlug(nodeType) {
  const normalized = normalizeNodeType(nodeType);
  return ICON_MAP[normalized] || null;
}

/**
 * Get the icon URL for an integration with fallback strategy
 * Three-tier fallback:
 * 1. simple-icons CDN
 * 2. Local SVG file
 * 3. Placeholder with first letter
 *
 * @param {string} nodeType - Full or normalized node type
 * @param {Object} options - Options
 * @param {string} options.color - Icon color (default: currentColor)
 * @param {string} options.size - Icon size (default: 24)
 * @returns {Object} Icon information object
 */
function getIconInfo(nodeType, options = {}) {
  const { color = 'currentColor', size = 24 } = options;
  const normalized = normalizeNodeType(nodeType);
  const slug = ICON_MAP[normalized];

  if (slug) {
    return {
      type: 'simple-icons',
      slug,
      url: `${SIMPLE_ICONS_CDN}/${slug}/${color}`,
      cdnUrl: `${SIMPLE_ICONS_CDN}/${slug}`,
      localPath: `${LOCAL_ICONS_PATH}/${slug}.svg`,
      fallback: false,
    };
  }

  // No mapping found - use placeholder
  const displayName = formatDisplayName(normalized);
  const firstLetter = displayName.charAt(0).toUpperCase();

  return {
    type: 'placeholder',
    slug: normalized,
    letter: firstLetter,
    displayName,
    fallback: true,
  };
}

/**
 * Format a node type into a human-readable display name
 * @param {string} name - Normalized integration name
 * @returns {string} Display name (e.g., 'google-sheets' → 'Google Sheets')
 */
function formatDisplayName(name) {
  if (!name) return 'Unknown';

  // Special case mappings
  const specialNames = {
    'googlesheets': 'Google Sheets',
    'googledrive': 'Google Drive',
    'googledocs': 'Google Docs',
    'googlecalendar': 'Google Calendar',
    'googleanalytics': 'Google Analytics',
    'googlecontacts': 'Google Contacts',
    'googlecloudfirestore': 'Cloud Firestore',
    'googlebigquery': 'BigQuery',
    'microsoftoutlook': 'Outlook',
    'microsoftexcel': 'Excel',
    'microsoftteams': 'Microsoft Teams',
    'microsoftonenote': 'OneNote',
    'microsoftsql': 'SQL Server',
    'amazons3': 'Amazon S3',
    'amazondynamodb': 'DynamoDB',
    'amazonses': 'Amazon SES',
    'awslambda': 'AWS Lambda',
    'awss3': 'Amazon S3',
    'awsses': 'Amazon SES',
    'awssns': 'Amazon SNS',
    'awssqs': 'Amazon SQS',
    'awscomprehend': 'AWS Comprehend',
    'awstranscribe': 'AWS Transcribe',
    'awsrekognition': 'AWS Rekognition',
    'postgresql': 'PostgreSQL',
    'mysql': 'MySQL',
    'mongodb': 'MongoDB',
    'redis': 'Redis',
    'elasticsearch': 'Elasticsearch',
    'neo4j': 'Neo4j',
    'graphql': 'GraphQL',
    'httprequest': 'HTTP Request',
    'rssfeed': 'RSS Feed',
    'openai': 'OpenAI',
    'langchain': 'LangChain',
    'huggingface': 'Hugging Face',
    'pineconevectorstore': 'Pinecone',
    'qdrantvectorstore': 'Qdrant',
    'supabasevectorstore': 'Supabase Vector',
    'vectorstorepgvector': 'pgvector',
    'whatsappbusiness': 'WhatsApp Business',
    'rocketdotchat': 'Rocket.Chat',
    'mondaydotcom': 'monday.com',
    'jirasoftware': 'Jira',
    'sentryio': 'Sentry',
    'zohocrm': 'Zoho CRM',
    'facebookads': 'Facebook Ads',
    'basicllmchain': 'LLM Chain',
    'summarizationchain': 'Summarization Chain',
    'inmemoryVectorstore': 'In-Memory Vector Store',
  };

  if (specialNames[name.toLowerCase()]) {
    return specialNames[name.toLowerCase()];
  }

  // Generic formatting: split camelCase and capitalize
  return name
    // Insert space before uppercase letters
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Replace hyphens and underscores with spaces
    .replace(/[-_]/g, ' ')
    // Capitalize first letter of each word
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
}

/**
 * Generate a slug from a display name
 * @param {string} name - Display name or integration name
 * @returns {string} URL-safe slug
 */
function generateSlug(name) {
  if (!name) return 'unknown';

  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

/**
 * Check if a node type is a utility node (should be excluded from integrations)
 * @param {string} nodeType - Full node type
 * @returns {boolean} True if utility node
 */
function isUtilityNode(nodeType) {
  return UTILITY_NODES.has(nodeType);
}

/**
 * Get brand color for an integration
 * @param {string} nodeType - Full or normalized node type
 * @returns {string|null} Hex color or null
 */
function getBrandColor(nodeType) {
  const normalized = normalizeNodeType(nodeType);
  const slug = ICON_MAP[normalized];
  return BRAND_COLORS[slug] || BRAND_COLORS[normalized] || null;
}

/**
 * Extract all integrations from a workflow
 * @param {Object} workflow - n8n workflow JSON
 * @returns {Array} Array of integration objects
 */
function extractIntegrations(workflow) {
  const nodes = workflow.nodes || [];
  const integrations = new Map();

  for (const node of nodes) {
    const nodeType = node.type || '';

    // Skip utility nodes
    if (isUtilityNode(nodeType)) continue;

    // Get normalized name
    const normalized = normalizeNodeType(nodeType);
    if (!normalized) continue;

    // Skip if already added
    if (integrations.has(normalized)) continue;

    const displayName = formatDisplayName(normalized);
    const slug = generateSlug(displayName);
    const iconInfo = getIconInfo(nodeType);

    integrations.set(normalized, {
      name: displayName,
      slug,
      nodeType: normalized,
      icon: iconInfo.slug || normalized,
      iconType: iconInfo.type,
      iconUrl: iconInfo.url || null,
      brandColor: getBrandColor(nodeType),
    });
  }

  return Array.from(integrations.values());
}

/**
 * Get icon URL for simple-icons CDN with color
 * @param {string} slug - Simple-icons slug
 * @param {string} color - Hex color without # (optional)
 * @returns {string} CDN URL
 */
function getSimpleIconUrl(slug, color = null) {
  if (color) {
    return `${SIMPLE_ICONS_CDN}/${slug}/${color}`;
  }
  return `${SIMPLE_ICONS_CDN}/${slug}`;
}

module.exports = {
  ICON_MAP,
  UTILITY_NODES,
  BRAND_COLORS,
  SIMPLE_ICONS_CDN,
  LOCAL_ICONS_PATH,
  normalizeNodeType,
  getIconSlug,
  getIconInfo,
  formatDisplayName,
  generateSlug,
  isUtilityNode,
  getBrandColor,
  extractIntegrations,
  getSimpleIconUrl,
};
