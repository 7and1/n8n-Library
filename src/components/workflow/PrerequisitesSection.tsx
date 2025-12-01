'use client';

import { useMemo } from 'react';
import {
  Key,
  ExternalLink,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { N8nWorkflow } from '@/types';
import { extractCredentials } from '@/lib/credential-extractor';
import {
  analyzeComplexity,
  getComplexityInfo,
  estimateSetupTime,
} from '@/lib/complexity';

interface PrerequisitesSectionProps {
  workflow: N8nWorkflow;
  className?: string;
}

// Icon component for credentials
function CredentialIcon({ icon }: { icon: string }) {
  // Map common icons to Simple Icons CDN
  const iconMap: Record<string, string> = {
    googlesheets: 'googlesheets',
    googledrive: 'googledrive',
    googlecalendar: 'googlecalendar',
    google: 'google',
    gmail: 'gmail',
    slack: 'slack',
    discord: 'discord',
    telegram: 'telegram',
    twilio: 'twilio',
    sendgrid: 'sendgrid',
    mailchimp: 'mailchimp',
    postgresql: 'postgresql',
    mysql: 'mysql',
    mongodb: 'mongodb',
    redis: 'redis',
    supabase: 'supabase',
    airtable: 'airtable',
    notion: 'notion',
    amazonaws: 'amazonaws',
    googlecloud: 'googlecloud',
    microsoftazure: 'microsoftazure',
    openai: 'openai',
    anthropic: 'anthropic',
    hubspot: 'hubspot',
    salesforce: 'salesforce',
    pipedrive: 'pipedrive',
    zendesk: 'zendesk',
    intercom: 'intercom',
    stripe: 'stripe',
    shopify: 'shopify',
    github: 'github',
    gitlab: 'gitlab',
    jira: 'jira',
    linear: 'linear',
    asana: 'asana',
    x: 'x',
    linkedin: 'linkedin',
    facebook: 'facebook',
    dropbox: 'dropbox',
    box: 'box',
    trello: 'trello',
    clickup: 'clickup',
    webflow: 'webflow',
    gumroad: 'gumroad',
  };

  const simpleIconName = iconMap[icon.toLowerCase()];

  if (simpleIconName) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://cdn.simpleicons.org/${simpleIconName}/currentColor`}
        alt=""
        className="w-5 h-5 dark:invert"
        loading="lazy"
      />
    );
  }

  // Fallback to Key icon
  return <Key className="w-5 h-5 text-gray-400" />;
}

export function PrerequisitesSection({
  workflow,
  className = '',
}: PrerequisitesSectionProps) {
  // Extract credentials and analyze complexity
  const credentials = useMemo(
    () => extractCredentials(workflow),
    [workflow]
  );
  const complexity = useMemo(() => analyzeComplexity(workflow), [workflow]);
  const complexityInfo = getComplexityInfo(complexity.level);
  const setupTime = estimateSetupTime(complexity);

  if (credentials.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand-500" />
          Prerequisites
        </h2>
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
          <div>
            <p className="font-medium text-green-700 dark:text-green-300">
              No credentials required!
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              This workflow can be imported and used immediately.
            </p>
          </div>
        </div>

        {/* Complexity indicator */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <ComplexityIndicator
            complexity={complexity}
            info={complexityInfo}
            setupTime={setupTime}
          />
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-brand-500" />
        Prerequisites
      </h2>

      {/* Credentials needed */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Key className="w-4 h-4" />
          Required Credentials ({credentials.length})
        </h3>
        <div className="space-y-2">
          {credentials.map((cred) => (
            <div
              key={cred.type}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <CredentialIcon icon={cred.icon} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {cred.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Used by: {cred.nodeNames.slice(0, 2).join(', ')}
                    {cred.nodeNames.length > 2 &&
                      ` +${cred.nodeNames.length - 2} more`}
                  </p>
                </div>
              </div>
              <a
                href={cred.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 hover:underline"
              >
                Docs
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Warning for many credentials */}
      {credentials.length >= 3 && (
        <div className="mb-6 flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-700 dark:text-amber-300">
              Multiple services required
            </p>
            <p className="text-amber-600 dark:text-amber-400">
              This workflow needs {credentials.length} different credentials.
              Make sure you have accounts for all services before importing.
            </p>
          </div>
        </div>
      )}

      {/* Complexity indicator */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <ComplexityIndicator
          complexity={complexity}
          info={complexityInfo}
          setupTime={setupTime}
        />
      </div>
    </Card>
  );
}

// Complexity indicator sub-component
function ComplexityIndicator({
  complexity,
  info,
  setupTime,
}: {
  complexity: ReturnType<typeof analyzeComplexity>;
  info: ReturnType<typeof getComplexityInfo>;
  setupTime: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Complexity
        </h3>
        <Badge className={`${info.bgColor} ${info.textColor}`}>
          {info.label}
        </Badge>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        {info.description}
      </p>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">
            Setup time: <strong className="text-gray-900 dark:text-white">{setupTime}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Score: <strong className="text-gray-900 dark:text-white">{complexity.score}/100</strong>
          </span>
        </div>
      </div>

      {/* Complexity factors */}
      <div className="flex flex-wrap gap-2 pt-2">
        {complexity.factors.hasCodeNodes && (
          <Badge variant="outline" className="text-xs">
            Custom Code
          </Badge>
        )}
        {complexity.factors.hasBranching && (
          <Badge variant="outline" className="text-xs">
            Conditional Logic
          </Badge>
        )}
        {complexity.factors.hasLoops && (
          <Badge variant="outline" className="text-xs">
            Loops
          </Badge>
        )}
        {complexity.factors.integrationCount > 3 && (
          <Badge variant="outline" className="text-xs">
            {complexity.factors.integrationCount} Integrations
          </Badge>
        )}
      </div>
    </div>
  );
}

export default PrerequisitesSection;
