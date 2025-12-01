/**
 * Extract required credentials from workflow
 */

import type { N8nWorkflow } from '@/types';
import type { RequiredCredential } from '@/types/workflow-visualization';

// Mapping of credential types to human-readable names and icons
const CREDENTIAL_INFO: Record<
  string,
  { name: string; icon: string; docsPath: string }
> = {
  // Google services
  googleSheetsOAuth2Api: {
    name: 'Google Sheets',
    icon: 'googlesheets',
    docsPath: 'google-sheets',
  },
  googleDriveOAuth2Api: {
    name: 'Google Drive',
    icon: 'googledrive',
    docsPath: 'google-drive',
  },
  googleCalendarOAuth2Api: {
    name: 'Google Calendar',
    icon: 'googlecalendar',
    docsPath: 'google-calendar',
  },
  googleOAuth2Api: {
    name: 'Google OAuth2',
    icon: 'google',
    docsPath: 'google',
  },
  gmailOAuth2: {
    name: 'Gmail',
    icon: 'gmail',
    docsPath: 'gmail',
  },

  // Communication
  slackOAuth2Api: { name: 'Slack', icon: 'slack', docsPath: 'slack' },
  slackApi: { name: 'Slack', icon: 'slack', docsPath: 'slack' },
  discordWebhookApi: {
    name: 'Discord Webhook',
    icon: 'discord',
    docsPath: 'discord',
  },
  discordOAuth2Api: { name: 'Discord', icon: 'discord', docsPath: 'discord' },
  telegramApi: { name: 'Telegram', icon: 'telegram', docsPath: 'telegram' },
  twilioApi: { name: 'Twilio', icon: 'twilio', docsPath: 'twilio' },
  sendGridApi: { name: 'SendGrid', icon: 'sendgrid', docsPath: 'sendgrid' },
  mailchimpApi: { name: 'Mailchimp', icon: 'mailchimp', docsPath: 'mailchimp' },

  // Databases
  postgresApi: {
    name: 'PostgreSQL',
    icon: 'postgresql',
    docsPath: 'postgres',
  },
  mySqlApi: { name: 'MySQL', icon: 'mysql', docsPath: 'mysql' },
  mongoDbApi: { name: 'MongoDB', icon: 'mongodb', docsPath: 'mongodb' },
  redisApi: { name: 'Redis', icon: 'redis', docsPath: 'redis' },
  supabaseApi: { name: 'Supabase', icon: 'supabase', docsPath: 'supabase' },
  airtableApi: { name: 'Airtable', icon: 'airtable', docsPath: 'airtable' },
  notionApi: { name: 'Notion', icon: 'notion', docsPath: 'notion' },

  // Cloud services
  awsApi: { name: 'AWS', icon: 'amazonaws', docsPath: 'aws' },
  googleCloudApi: {
    name: 'Google Cloud',
    icon: 'googlecloud',
    docsPath: 'google-cloud',
  },
  azureApi: {
    name: 'Microsoft Azure',
    icon: 'microsoftazure',
    docsPath: 'azure',
  },

  // AI services
  openAiApi: { name: 'OpenAI', icon: 'openai', docsPath: 'openai' },
  anthropicApi: { name: 'Anthropic', icon: 'anthropic', docsPath: 'anthropic' },

  // CRM & Business
  hubspotApi: { name: 'HubSpot', icon: 'hubspot', docsPath: 'hubspot' },
  salesforceOAuth2Api: {
    name: 'Salesforce',
    icon: 'salesforce',
    docsPath: 'salesforce',
  },
  pipedriveApi: { name: 'Pipedrive', icon: 'pipedrive', docsPath: 'pipedrive' },
  zendeskApi: { name: 'Zendesk', icon: 'zendesk', docsPath: 'zendesk' },
  intercomApi: { name: 'Intercom', icon: 'intercom', docsPath: 'intercom' },
  stripeApi: { name: 'Stripe', icon: 'stripe', docsPath: 'stripe' },
  shopifyApi: { name: 'Shopify', icon: 'shopify', docsPath: 'shopify' },

  // Development
  githubOAuth2Api: { name: 'GitHub', icon: 'github', docsPath: 'github' },
  gitlabOAuth2Api: { name: 'GitLab', icon: 'gitlab', docsPath: 'gitlab' },
  jiraCloudApi: { name: 'Jira', icon: 'jira', docsPath: 'jira' },
  linearApi: { name: 'Linear', icon: 'linear', docsPath: 'linear' },
  asanaApi: { name: 'Asana', icon: 'asana', docsPath: 'asana' },

  // Generic
  httpBasicAuth: {
    name: 'HTTP Basic Auth',
    icon: 'lock',
    docsPath: 'http-request',
  },
  httpHeaderAuth: {
    name: 'HTTP Header Auth',
    icon: 'key',
    docsPath: 'http-request',
  },
  httpBearerAuth: {
    name: 'Bearer Token',
    icon: 'key',
    docsPath: 'http-request',
  },
  oAuth2Api: { name: 'OAuth2', icon: 'lock', docsPath: 'credentials' },

  // Social
  twitterOAuth2Api: { name: 'Twitter/X', icon: 'x', docsPath: 'twitter' },
  linkedInOAuth2Api: {
    name: 'LinkedIn',
    icon: 'linkedin',
    docsPath: 'linkedin',
  },
  facebookGraphApi: {
    name: 'Facebook',
    icon: 'facebook',
    docsPath: 'facebook',
  },

  // Other
  dropboxOAuth2Api: { name: 'Dropbox', icon: 'dropbox', docsPath: 'dropbox' },
  boxOAuth2Api: { name: 'Box', icon: 'box', docsPath: 'box' },
  trelloApi: { name: 'Trello', icon: 'trello', docsPath: 'trello' },
  clickUpApi: { name: 'ClickUp', icon: 'clickup', docsPath: 'clickup' },
  webflowApi: { name: 'Webflow', icon: 'webflow', docsPath: 'webflow' },
  gumroadApi: { name: 'Gumroad', icon: 'gumroad', docsPath: 'gumroad' },
  beehiivApi: { name: 'Beehiiv', icon: 'email', docsPath: 'beehiiv' },
};

/**
 * Get documentation URL for a credential type
 */
export function getCredentialDocsUrl(credentialType: string): string {
  const info = CREDENTIAL_INFO[credentialType];
  const docsPath = info?.docsPath || credentialType.replace(/Api$|OAuth2Api$/, '').toLowerCase();
  return `https://docs.n8n.io/integrations/builtin/credentials/${docsPath}/`;
}

/**
 * Get human-readable name for credential type
 */
export function getCredentialName(credentialType: string): string {
  const info = CREDENTIAL_INFO[credentialType];
  if (info) return info.name;

  // Generate name from type
  return credentialType
    .replace(/Api$|OAuth2Api$|OAuth2$/, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (s) => s.toUpperCase());
}

/**
 * Get icon identifier for credential type
 */
export function getCredentialIcon(credentialType: string): string {
  const info = CREDENTIAL_INFO[credentialType];
  if (info) return info.icon;

  // Default icon based on type
  if (credentialType.includes('OAuth')) return 'lock';
  if (credentialType.includes('Api')) return 'key';
  return 'settings';
}

/**
 * Extract all required credentials from a workflow
 */
export function extractCredentials(workflow: N8nWorkflow): RequiredCredential[] {
  const credentialMap = new Map<string, { nodeNames: string[] }>();

  const nodes = workflow.nodes || [];

  for (const node of nodes) {
    if (!node.credentials) continue;

    for (const [credType] of Object.entries(node.credentials)) {
      const existing = credentialMap.get(credType);
      if (existing) {
        existing.nodeNames.push(node.name);
      } else {
        credentialMap.set(credType, { nodeNames: [node.name] });
      }
    }
  }

  // Convert to array
  const credentials: RequiredCredential[] = [];

  credentialMap.forEach((data, type) => {
    credentials.push({
      type,
      name: getCredentialName(type),
      nodeNames: data.nodeNames,
      icon: getCredentialIcon(type),
      docsUrl: getCredentialDocsUrl(type),
    });
  });

  // Sort by name
  return credentials.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get unique service names required by workflow
 */
export function getRequiredServices(workflow: N8nWorkflow): string[] {
  const credentials = extractCredentials(workflow);
  return Array.from(new Set(credentials.map((c) => c.name)));
}
