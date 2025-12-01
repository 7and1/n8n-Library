'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QualityStars } from './QualityStars';
import { CategoryBadge } from './CategoryBadge';
import { TriggerBadge } from './TriggerBadge';
import { IntegrationIcon } from './IntegrationIcon';
import { WorkflowCanvas } from './WorkflowCanvas';
import { ImportActions } from './ImportActions';
import { useWorkflowPreview } from '@/contexts/WorkflowPreviewContext';
import type { WorkflowDetail } from '@/types';

// Fetch full workflow details
async function fetchWorkflowDetails(slug: string): Promise<WorkflowDetail | null> {
  try {
    const response = await fetch(`/data/workflows/${slug}.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export function WorkflowPreviewModal() {
  const { previewWorkflow, isOpen, closePreview, isLoading, setIsLoading } =
    useWorkflowPreview();
  const [fullWorkflow, setFullWorkflow] = useState<WorkflowDetail | null>(null);

  // Fetch full workflow if we only have meta
  useEffect(() => {
    if (!previewWorkflow || !isOpen) {
      setFullWorkflow(null);
      return;
    }

    // Check if we already have full workflow data
    if ('workflow' in previewWorkflow && previewWorkflow.workflow) {
      setFullWorkflow(previewWorkflow as WorkflowDetail);
      return;
    }

    // Fetch full workflow
    setIsLoading(true);
    fetchWorkflowDetails(previewWorkflow.slug)
      .then((data) => {
        setFullWorkflow(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [previewWorkflow, isOpen, setIsLoading]);

  if (!previewWorkflow) return null;

  const workflow = fullWorkflow || previewWorkflow;
  const hasFullData = !!fullWorkflow?.workflow;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closePreview()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between gap-4 pr-8">
            <div className="flex items-center gap-3 flex-wrap">
              <CategoryBadge
                slug={workflow.category}
                name={workflow.categoryName}
                icon={workflow.categoryIcon}
                color={`cat-${workflow.category.split('-')[0]}`}
              />
              {workflow.source === 'awesome' && (
                <Badge variant="awesome">Curated</Badge>
              )}
            </div>
            <QualityStars quality={workflow.quality} size="sm" />
          </div>
          <DialogTitle className="text-xl mt-2">{workflow.name}</DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {workflow.description}
          </p>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
            </div>
          )}

          {/* Workflow visualization */}
          {!isLoading && hasFullData && fullWorkflow?.workflow && (
            <WorkflowCanvas workflow={fullWorkflow.workflow} compact />
          )}

          {/* Quick info */}
          <div className="grid grid-cols-3 gap-4 py-2">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400">
                <Box className="w-4 h-4" />
                <span className="text-sm">Nodes</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {workflow.nodeCount}
              </p>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Trigger
              </div>
              <TriggerBadge trigger={workflow.triggerType} />
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Integrations
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {Array.isArray(workflow.integrations)
                  ? workflow.integrations.length
                  : 0}
              </p>
            </div>
          </div>

          {/* Integrations */}
          {Array.isArray(workflow.integrations) &&
            workflow.integrations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Integrations Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {/* Handle both simple string array and detailed integration objects */}
                  {workflow.integrations.slice(0, 8).map((integration, idx) => {
                    if (typeof integration === 'string') {
                      return (
                        <div
                          key={idx}
                          className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-sm"
                        >
                          {integration}
                        </div>
                      );
                    }
                    return (
                      <Link
                        key={integration.slug}
                        href={`/integration/${integration.slug}/`}
                        className="flex items-center gap-2 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <IntegrationIcon
                          slug={integration.icon}
                          name={integration.name}
                          size="sm"
                        />
                        <span className="text-sm">{integration.name}</span>
                      </Link>
                    );
                  })}
                  {workflow.integrations.length > 8 && (
                    <div className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-sm text-gray-500">
                      +{workflow.integrations.length - 8} more
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between gap-4">
            {/* Import actions - only if we have full workflow data */}
            {hasFullData && fullWorkflow?.workflow ? (
              <ImportActions
                workflow={fullWorkflow.workflow}
                workflowSlug={workflow.slug}
                sourceUrl={fullWorkflow.sourceUrl}
                variant="compact"
              />
            ) : (
              <div className="text-sm text-gray-500">
                {isLoading ? 'Loading...' : 'Loading workflow data...'}
              </div>
            )}

            {/* View details link */}
            <Link href={`/workflow/${workflow.slug}/`} onClick={closePreview}>
              <Button variant="outline" className="gap-2">
                View Details
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WorkflowPreviewModal;
