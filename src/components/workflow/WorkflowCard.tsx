import Link from 'next/link';
import { GitFork, Box } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QualityStars } from './QualityStars';
import { CategoryBadge } from './CategoryBadge';
import { TriggerBadge } from './TriggerBadge';
import { IntegrationIcons } from './IntegrationIcon';
import { cn, truncate } from '@/lib/utils';
import type { WorkflowMeta, Integration } from '@/types';

interface WorkflowCardProps {
  workflow: WorkflowMeta;
  integrationDetails?: Integration[];
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export function WorkflowCard({
  workflow,
  integrationDetails,
  variant = 'default',
  className,
}: WorkflowCardProps) {
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  // Prepare integration data for icons
  const integrations = integrationDetails ||
    workflow.integrations.slice(0, 4).map((slug) => ({
      slug,
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      icon: slug,
    }));

  return (
    <Link href={`/workflow/${workflow.slug}/`} className="block no-underline group">
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-200',
          'hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-700',
          'hover:-translate-y-0.5',
          isFeatured && 'ring-2 ring-brand-500/20',
          className
        )}
      >
        {/* Featured badge */}
        {isFeatured && (
          <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-medium px-2 py-0.5 rounded-bl-lg">
            Featured
          </div>
        )}

        <div className={cn('p-4', isCompact && 'p-3')}>
          {/* Header: Category & Quality */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <CategoryBadge
              slug={workflow.category}
              name={workflow.categoryName}
              icon={workflow.categoryIcon}
              color={`cat-${workflow.category.split('-')[0]}`}
              size="sm"
            />
            <QualityStars quality={workflow.quality} size="sm" />
          </div>

          {/* Title */}
          <h3
            className={cn(
              'font-semibold text-gray-900 dark:text-gray-100 mb-2',
              'group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors',
              isCompact ? 'text-sm line-clamp-1' : 'text-base line-clamp-2'
            )}
          >
            {workflow.name}
          </h3>

          {/* Description */}
          {!isCompact && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {truncate(workflow.description, 120)}
            </p>
          )}

          {/* Integrations */}
          <div className="flex items-center gap-3 mb-3">
            <IntegrationIcons
              integrations={integrations as Integration[]}
              maxIcons={4}
              size="sm"
            />
          </div>

          {/* Footer: Meta info */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-3">
              {/* Node count */}
              <span className="flex items-center gap-1">
                <Box className="w-3.5 h-3.5" />
                {workflow.nodeCount} nodes
              </span>

              {/* Trigger type */}
              <TriggerBadge trigger={workflow.triggerType} size="sm" />
            </div>

            {/* Source badge */}
            {workflow.source === 'awesome' && (
              <Badge variant="awesome" className="text-xs">
                <GitFork className="w-3 h-3 mr-1" />
                Curated
              </Badge>
            )}
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </Card>
    </Link>
  );
}

// Skeleton loader for WorkflowCard
export function WorkflowCardSkeleton({
  variant = 'default',
}: {
  variant?: 'default' | 'compact' | 'featured';
}) {
  const isCompact = variant === 'compact';

  return (
    <Card className={cn('overflow-hidden', isCompact ? 'p-3' : 'p-4')}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      <div className={cn('mb-2', isCompact ? 'h-5' : 'h-12')}>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
        {!isCompact && (
          <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        )}
      </div>

      {!isCompact && (
        <div className="mb-3">
          <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-1" />
          <div className="h-4 w-2/3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      )}

      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </Card>
  );
}
