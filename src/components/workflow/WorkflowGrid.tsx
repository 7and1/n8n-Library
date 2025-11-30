'use client';

import { WorkflowCard, WorkflowCardSkeleton } from './WorkflowCard';
import { cn } from '@/lib/utils';
import type { WorkflowMeta } from '@/types';

interface WorkflowGridProps {
  workflows: WorkflowMeta[];
  variant?: 'default' | 'compact' | 'featured';
  columns?: 2 | 3 | 4;
  className?: string;
  emptyMessage?: string;
}

const columnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

export function WorkflowGrid({
  workflows,
  variant = 'default',
  columns = 3,
  className,
  emptyMessage = 'No workflows found.',
}: WorkflowGridProps) {
  if (workflows.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-4',
        columnClasses[columns],
        className
      )}
    >
      {workflows.map((workflow) => (
        <WorkflowCard
          key={workflow.id}
          workflow={workflow}
          variant={variant}
        />
      ))}
    </div>
  );
}

// Skeleton loader for WorkflowGrid
export function WorkflowGridSkeleton({
  count = 6,
  variant = 'default',
  columns = 3,
  className,
}: {
  count?: number;
  variant?: 'default' | 'compact' | 'featured';
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid gap-4',
        columnClasses[columns],
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <WorkflowCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
}
