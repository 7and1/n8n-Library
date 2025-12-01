'use client';

import { useMemo, useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Workflow, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { N8nWorkflow } from '@/types';
import type { CanvasNode, NodeCategory } from '@/types/workflow-visualization';
import {
  parseWorkflow,
  sortNodesForLinearDisplay,
} from '@/lib/workflow-visualization';

interface WorkflowCanvasProps {
  workflow: N8nWorkflow;
  className?: string;
  compact?: boolean;
}

// Tailwind color classes for HTML legend
const NODE_COLORS: Record<NodeCategory, { bg: string; border: string; text: string }> = {
  trigger: { bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-400 dark:border-green-600', text: 'text-green-700 dark:text-green-300' },
  http: { bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-400 dark:border-blue-600', text: 'text-blue-700 dark:text-blue-300' },
  code: { bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-400 dark:border-purple-600', text: 'text-purple-700 dark:text-purple-300' },
  logic: { bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-400 dark:border-orange-600', text: 'text-orange-700 dark:text-orange-300' },
  transform: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-400 dark:border-yellow-600', text: 'text-yellow-700 dark:text-yellow-300' },
  action: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', border: 'border-indigo-400 dark:border-indigo-600', text: 'text-indigo-700 dark:text-indigo-300' },
  note: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-300 dark:border-amber-600', text: 'text-amber-700 dark:text-amber-300' },
  default: { bg: 'bg-gray-100 dark:bg-gray-800', border: 'border-gray-400 dark:border-gray-600', text: 'text-gray-700 dark:text-gray-300' },
};

// Linear visualization (using HTML/Tailwind for proper styling)
function LinearVisualization({
  nodes,
  compact,
}: {
  nodes: CanvasNode[];
  compact?: boolean;
}) {
  const sortedNodes = sortNodesForLinearDisplay(nodes);

  return (
    <div className={`flex flex-wrap gap-3 items-center justify-start ${compact ? 'p-3' : 'p-6'}`}>
      {sortedNodes.map((node, index) => {
        const colors = NODE_COLORS[node.category];
        return (
          <div key={node.id} className="flex items-center gap-3">
            <div
              className={`
                ${compact ? 'px-3 py-2 min-w-[100px] max-w-[140px]' : 'px-4 py-3 min-w-[120px] max-w-[180px]'}
                rounded-lg border-2 shadow-sm ${colors.bg} ${colors.border}
                relative transition-all hover:shadow-md
              `}
            >
              {node.hasCredentials && (
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-amber-500 border-2 border-white dark:border-gray-900" />
              )}
              <div
                className={`text-[10px] font-medium ${colors.text} truncate mb-0.5`}
              >
                {node.shortType}
              </div>
              <div
                className={`${compact ? 'text-xs' : 'text-sm'} font-semibold text-gray-900 dark:text-white truncate`}
                title={node.name}
              >
                {node.name}
              </div>
            </div>
            {index < sortedNodes.length - 1 && (
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-gray-400 dark:text-gray-500 flex-shrink-0">
                <path
                  d="M5 12h14m-4-4l4 4-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Legend component
function CanvasLegend({ categories }: { categories: Set<NodeCategory> }) {
  return (
    <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
        Node Types:
      </span>
      {Array.from(categories).map((category) => {
        const colors = NODE_COLORS[category];
        return (
          <div key={category} className="flex items-center gap-1.5">
            <div
              className={`w-3 h-3 rounded ${colors.bg} border ${colors.border}`}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
              {category}
            </span>
          </div>
        );
      })}
      <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-gray-300 dark:border-gray-600">
        <span className="w-3 h-3 rounded-full bg-amber-500" />
        <span className="text-xs text-gray-600 dark:text-gray-400">
          Requires credentials
        </span>
      </div>
    </div>
  );
}

export function WorkflowCanvas({
  workflow,
  className = '',
  compact = false,
}: WorkflowCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  // Parse workflow data
  const parsed = useMemo(() => {
    return parseWorkflow(workflow, 800, compact ? 200 : 300);
  }, [workflow, compact]);

  // Get unique categories for legend
  const categories = useMemo(() => {
    const cats = new Set<NodeCategory>();
    parsed.nodes.forEach((node) => cats.add(node.category));
    cats.delete('note');
    return cats;
  }, [parsed.nodes]);

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
  const handleReset = () => setZoom(1);

  // Empty state
  if (parsed.nodes.length === 0) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <AlertCircle className="w-8 h-8 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-500 dark:text-gray-400">
          No nodes found in this workflow.
        </p>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Workflow className="w-4 h-4 text-brand-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Workflow Structure ({parsed.nodes.length} nodes)
          </span>
        </div>
        {!compact && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="h-7 w-7 p-0"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs text-gray-500 w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="h-7 w-7 p-0"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-7 w-7 p-0"
              title="Reset view"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Canvas - Always use LinearVisualization for clearer display */}
      <div
        ref={containerRef}
        className={`relative bg-white dark:bg-gray-900 overflow-auto`}
        style={{
          minHeight: compact ? 150 : 180,
          maxHeight: compact ? 250 : 400,
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
        }}
      >
        <LinearVisualization nodes={parsed.nodes} compact={compact} />
      </div>

      {/* Legend */}
      {!compact && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/30">
          <CanvasLegend categories={categories} />
        </div>
      )}
    </Card>
  );
}

export default WorkflowCanvas;
