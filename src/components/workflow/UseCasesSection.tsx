'use client';

import { useMemo } from 'react';
import {
  Lightbulb,
  Zap,
  Clock,
  Users,
  TrendingUp,
  Shield,
  RefreshCw,
  Bell,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { N8nWorkflow } from '@/types';
import type { UseCase } from '@/types/workflow-visualization';

interface UseCasesSectionProps {
  workflow: N8nWorkflow;
  workflowName: string;
  category: string;
  integrations: string[];
  className?: string;
}

// Icon mapping for use cases
const USE_CASE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  automation: Zap,
  schedule: Clock,
  team: Users,
  growth: TrendingUp,
  security: Shield,
  sync: RefreshCw,
  notification: Bell,
  idea: Lightbulb,
};

// Generate use cases based on workflow characteristics
function generateUseCases(
  workflowName: string,
  category: string,
  integrations: string[],
  nodeTypes: string[] = []
): UseCase[] {
  const useCases: UseCase[] = [];
  const nameLower = workflowName.toLowerCase();
  const hasSchedule = nodeTypes.some(t => t.includes('cron') || t.includes('schedule'));
  const hasWebhook = nodeTypes.some(t => t.includes('webhook') || t.includes('trigger'));

  // Category-based use cases
  if (category === 'ai-automation') {
    useCases.push({
      title: 'AI-Powered Content Creation',
      scenario: 'Automate content generation, summarization, or analysis using AI capabilities.',
      benefit: 'Save hours of manual work while maintaining quality and consistency.',
      icon: 'automation',
    });
  }

  if (category === 'data-sync') {
    useCases.push({
      title: 'Keep Data in Sync',
      scenario: 'Automatically synchronize data between different platforms without manual exports.',
      benefit: 'Eliminate data silos and ensure everyone works with up-to-date information.',
      icon: 'sync',
    });
  }

  if (category === 'communication') {
    useCases.push({
      title: 'Streamline Team Communication',
      scenario: 'Automatically route notifications and updates to the right channels and people.',
      benefit: 'Reduce information overload while keeping everyone informed.',
      icon: 'notification',
    });
  }

  // Integration-based use cases
  if (integrations.some(i => i.toLowerCase().includes('slack') || i.toLowerCase().includes('discord'))) {
    useCases.push({
      title: 'Team Notifications',
      scenario: 'Send automated alerts and updates to your team chat when important events occur.',
      benefit: 'Never miss critical updates - your team stays informed in real-time.',
      icon: 'team',
    });
  }

  if (integrations.some(i => i.toLowerCase().includes('sheet') || i.toLowerCase().includes('airtable'))) {
    useCases.push({
      title: 'Automated Reporting',
      scenario: 'Automatically collect and organize data into spreadsheets for analysis.',
      benefit: 'Spend less time on data entry and more time on insights.',
      icon: 'growth',
    });
  }

  if (integrations.some(i => i.toLowerCase().includes('email') || i.toLowerCase().includes('gmail'))) {
    useCases.push({
      title: 'Email Automation',
      scenario: 'Automate email responses, forwarding, or organization based on rules.',
      benefit: 'Handle routine email tasks automatically and focus on what matters.',
      icon: 'automation',
    });
  }

  // Trigger-based use cases
  if (hasSchedule) {
    useCases.push({
      title: 'Scheduled Operations',
      scenario: 'Run automated tasks at specific times - daily reports, weekly cleanups, monthly backups.',
      benefit: 'Set it and forget it - reliable automation that runs on your schedule.',
      icon: 'schedule',
    });
  }

  if (hasWebhook) {
    useCases.push({
      title: 'Real-time Response',
      scenario: 'React instantly when events happen - new orders, form submissions, or API calls.',
      benefit: 'Zero delay between trigger and action for time-sensitive workflows.',
      icon: 'automation',
    });
  }

  // Name-based use cases
  if (nameLower.includes('backup') || nameLower.includes('sync')) {
    useCases.push({
      title: 'Data Protection',
      scenario: 'Automatically backup or synchronize important data to prevent loss.',
      benefit: 'Peace of mind knowing your data is safe and recoverable.',
      icon: 'security',
    });
  }

  if (nameLower.includes('lead') || nameLower.includes('crm') || nameLower.includes('sales')) {
    useCases.push({
      title: 'Sales Automation',
      scenario: 'Automate lead capture, follow-ups, and CRM updates to close more deals.',
      benefit: 'Focus on selling, not on manual data entry and tracking.',
      icon: 'growth',
    });
  }

  // Generic fallbacks if we don't have enough
  if (useCases.length < 2) {
    useCases.push({
      title: 'Time Savings',
      scenario: 'Replace repetitive manual tasks with reliable automation.',
      benefit: 'Reclaim hours every week for higher-value work.',
      icon: 'automation',
    });
  }

  if (useCases.length < 3) {
    useCases.push({
      title: 'Error Reduction',
      scenario: 'Eliminate human error from routine processes with consistent automation.',
      benefit: 'Improve accuracy and reliability across your workflows.',
      icon: 'security',
    });
  }

  // Deduplicate and limit to 3
  const seen = new Set<string>();
  return useCases
    .filter(uc => {
      if (seen.has(uc.title)) return false;
      seen.add(uc.title);
      return true;
    })
    .slice(0, 3);
}

export function UseCasesSection({
  workflow,
  workflowName,
  category,
  integrations,
  className = '',
}: UseCasesSectionProps) {
  // Extract node types from workflow
  const nodeTypes = useMemo(() => {
    return (workflow.nodes || []).map(n => n.type.toLowerCase());
  }, [workflow]);

  // Generate use cases
  const useCases = useMemo(() => {
    return generateUseCases(workflowName, category, integrations, nodeTypes);
  }, [workflowName, category, integrations, nodeTypes]);

  if (useCases.length === 0) return null;

  return (
    <Card className={`p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-brand-500" />
        When to Use This Workflow
      </h2>

      <div className="space-y-4">
        {useCases.map((useCase, index) => {
          const IconComponent = USE_CASE_ICONS[useCase.icon || 'idea'] || Lightbulb;

          return (
            <div
              key={index}
              className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {useCase.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {useCase.scenario}
                </p>
                <p className="text-sm text-brand-600 dark:text-brand-400 mt-2 font-medium">
                  {useCase.benefit}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default UseCasesSection;
