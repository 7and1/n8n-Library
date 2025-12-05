'use client';

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { WorkflowCard } from './WorkflowCard';
import type { WorkflowMeta } from '@/types';
import { cn } from '@/lib/utils';

interface VirtualizedWorkflowGridProps {
  workflows: WorkflowMeta[];
  columns?: 2 | 3 | 4;
  rowHeight?: number;
  className?: string;
  emptyMessage?: string;
}

const columnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

export function VirtualizedWorkflowGrid({
  workflows,
  columns = 3,
  rowHeight = 320,
  className,
  emptyMessage = 'No workflows found.',
}: VirtualizedWorkflowGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const rowCount = Math.max(1, Math.ceil(workflows.length / columns));
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 6,
  });

  const virtualItems = virtualizer.getVirtualItems();

  if (workflows.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className={cn(
        'overflow-auto max-h-[70vh] sm:max-h-[75vh] pr-1 focus:outline-none',
        className
      )}
    >
      <div
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualItems.map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const items = workflows.slice(startIndex, startIndex + columns);
          return (
            <div
              key={virtualRow.key}
              className={cn('absolute left-0 right-0 grid gap-4', columnClasses[columns])}
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              {items.map((workflow) => (
                <WorkflowCard key={workflow.id} workflow={workflow} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
