/**
 * Category Rules for n8n Library ETL
 * Defines category mappings and classification rules
 */

// 8 main categories with metadata
const CATEGORIES = [
  {
    slug: 'ai-automation',
    name: 'AI & Automation',
    icon: '🤖',
    color: 'cat-ai',
    description: 'AI-powered workflows using OpenAI, Claude, LangChain, and other machine learning tools',
    keywords: [
      'openai', 'anthropic', 'langchain', 'llm', 'gpt', 'ai', 'chatgpt',
      'ollama', 'huggingface', 'cohere', 'gemini', 'claude', 'mistral',
      'replicate', 'stability', 'deepl', 'sentiment', 'embedding', 'vector',
      'pinecone', 'qdrant', 'weaviate', 'chromadb', 'agent'
    ],
  },
  {
    slug: 'communication',
    name: 'Communication',
    icon: '💬',
    color: 'cat-comm',
    description: 'Messaging, email, and notification workflows for Telegram, Slack, Discord, and more',
    keywords: [
      'telegram', 'discord', 'slack', 'whatsapp', 'email', 'gmail', 'smtp',
      'twilio', 'sendgrid', 'mailchimp', 'mailgun', 'postmark', 'outlook',
      'imap', 'mattermost', 'rocketchat', 'teams', 'line', 'viber', 'sms',
      'push', 'notification', 'messenger', 'matrix'
    ],
  },
  {
    slug: 'productivity',
    name: 'Productivity',
    icon: '📊',
    color: 'cat-prod',
    description: 'Task management, documentation, and collaboration tools like Notion, Airtable, Google Sheets',
    keywords: [
      'notion', 'airtable', 'googlesheets', 'todoist', 'trello', 'asana',
      'clickup', 'monday', 'googledocs', 'dropbox', 'googledrive', 'onedrive',
      'box', 'confluence', 'jira', 'linear', 'baserow', 'coda', 'seatable',
      'evernote', 'onenote', 'calendar', 'scheduling'
    ],
  },
  {
    slug: 'devops',
    name: 'DevOps',
    icon: '🔧',
    color: 'cat-devops',
    description: 'CI/CD, infrastructure automation, and developer tools for GitHub, GitLab, Docker, AWS',
    keywords: [
      'github', 'gitlab', 'docker', 'aws', 'jenkins', 'kubernetes', 'ssh',
      'terraform', 'ansible', 'cicd', 'bitbucket', 'circleci', 'travisci',
      'digitalocean', 'heroku', 'vercel', 'netlify', 'cloudflare', 'gcp',
      'azure', 'sentry', 'datadog', 'grafana', 'prometheus', 'uptime'
    ],
  },
  {
    slug: 'crm-sales',
    name: 'CRM & Sales',
    icon: '💼',
    color: 'cat-crm',
    description: 'Customer relationship management and sales automation with HubSpot, Salesforce, Pipedrive',
    keywords: [
      'hubspot', 'pipedrive', 'salesforce', 'zoho', 'intercom', 'zendesk',
      'freshdesk', 'crisp', 'drift', 'calendly', 'lemlist', 'hunter',
      'apollo', 'outreach', 'copper', 'close', 'activecampaign', 'keap',
      'mailerlite', 'convertkit', 'drip', 'lead', 'crm'
    ],
  },
  {
    slug: 'e-commerce',
    name: 'E-commerce',
    icon: '🛒',
    color: 'cat-ecom',
    description: 'Online store automation and payment workflows for Shopify, WooCommerce, Stripe',
    keywords: [
      'shopify', 'woocommerce', 'stripe', 'paypal', 'magento', 'bigcommerce',
      'square', 'gumroad', 'paddle', 'chargebee', 'razorpay', 'mollie',
      'invoice', 'payment', 'order', 'inventory', 'product', 'cart', 'checkout'
    ],
  },
  {
    slug: 'data-processing',
    name: 'Data Processing',
    icon: '💾',
    color: 'cat-data',
    description: 'Database operations, file processing, and data transformation with PostgreSQL, MongoDB, CSV',
    keywords: [
      'postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'csv', 'pdf',
      'excel', 'json', 'xml', 'supabase', 'firebase', 'dynamodb', 'snowflake',
      'bigquery', 'sqlite', 'mariadb', 'arangodb', 'neo4j', 'ftp', 'sftp',
      'spreadsheet', 'database', 'sql', 'query', 'etl', 'transform'
    ],
  },
  {
    slug: 'utilities',
    name: 'Utilities',
    icon: '🔌',
    color: 'cat-util',
    description: 'General purpose workflows, webhooks, scheduled tasks, and miscellaneous automations',
    keywords: [
      'webhook', 'http', 'cron', 'schedule', 'manual', 'code', 'function',
      'set', 'merge', 'split', 'filter', 'loop', 'wait', 'delay', 'timer',
      'trigger', 'execute', 'workflow', 'automation'
    ],
  },
];

// Awesome library folder to category mapping
const AWESOME_FOLDER_MAP = {
  // AI & Automation
  'AI_Research_RAG_and_Data_Analysis': 'ai-automation',
  'OpenAI_and_LLMs': 'ai-automation',

  // Communication
  'Gmail_and_Email_Automation': 'communication',
  'Telegram': 'communication',
  'Discord': 'communication',
  'Slack': 'communication',
  'WhatsApp': 'communication',
  'Instagram_Twitter_Social_Media': 'communication',

  // Productivity
  'Google_Drive_and_Google_Sheets': 'productivity',
  'Notion': 'productivity',
  'Airtable': 'productivity',
  'Forms_and_Surveys': 'productivity',
  'WordPress': 'productivity',

  // Data Processing
  'Database_and_Storage': 'data-processing',
  'PDF_and_Document_Processing': 'data-processing',

  // CRM & Sales
  'HR_and_Recruitment': 'crm-sales',

  // DevOps
  'devops': 'devops',

  // Utilities (default)
  'Other_Integrations_and_Use_Cases': 'utilities',
  'Other': 'utilities',
};

// Category priority for tie-breaking (lower = higher priority)
const CATEGORY_PRIORITY = {
  'ai-automation': 1,
  'communication': 2,
  'productivity': 3,
  'crm-sales': 4,
  'e-commerce': 5,
  'devops': 6,
  'data-processing': 7,
  'utilities': 8,
};

// Build keyword-to-category lookup for faster matching
const KEYWORD_TO_CATEGORY = {};
for (const cat of CATEGORIES) {
  for (const keyword of cat.keywords) {
    if (!KEYWORD_TO_CATEGORY[keyword]) {
      KEYWORD_TO_CATEGORY[keyword] = [];
    }
    KEYWORD_TO_CATEGORY[keyword].push(cat.slug);
  }
}

/**
 * Determine category based on workflow nodes and source
 */
function determineCategory(workflow, folderName, source) {
  // For awesome library, use folder mapping
  if (source === 'awesome') {
    return AWESOME_FOLDER_MAP[folderName] || 'utilities';
  }

  // For community library, analyze node types
  const nodes = workflow.nodes || [];
  const categoryScores = {};

  for (const node of nodes) {
    const nodeType = (node.type || '').toLowerCase().replace('n8n-nodes-base.', '');

    // Check each keyword
    for (const [keyword, categories] of Object.entries(KEYWORD_TO_CATEGORY)) {
      if (nodeType.includes(keyword)) {
        for (const category of categories) {
          categoryScores[category] = (categoryScores[category] || 0) + 1;
        }
      }
    }
  }

  // If no matches, return utilities
  if (Object.keys(categoryScores).length === 0) {
    return 'utilities';
  }

  // Sort by score (descending) and priority (ascending for ties)
  const sorted = Object.entries(categoryScores)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return CATEGORY_PRIORITY[a[0]] - CATEGORY_PRIORITY[b[0]];
    });

  return sorted[0][0];
}

/**
 * Get category metadata by slug
 */
function getCategoryBySlug(slug) {
  return CATEGORIES.find(c => c.slug === slug) || CATEGORIES[CATEGORIES.length - 1];
}

module.exports = {
  CATEGORIES,
  AWESOME_FOLDER_MAP,
  CATEGORY_PRIORITY,
  KEYWORD_TO_CATEGORY,
  determineCategory,
  getCategoryBySlug,
};
