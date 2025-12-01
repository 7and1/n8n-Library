'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Workflow, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { N8nWorkflow } from '@/types';
import type { CanvasNode, CanvasConnection, NodeCategory } from '@/types/workflow-visualization';
import {
  parseWorkflow,
  NODE_COLORS,
  generateConnectionPath,
  sortNodesForLinearDisplay,
  hasValidConnections,
  DEFAULT_CANVAS_CONFIG,
} from '@/lib/workflow-visualization';

interface WorkflowCanvasProps {
  workflow: N8nWorkflow;
  className?: string;
  compact?: boolean;
}

// Node component
function CanvasNodeComponent({
  node,
  scale,
}: {
  node: CanvasNode;
  scale: number;
}) {
  const colors = NODE_COLORS[node.category];
  const fontSize = Math.max(10, 12 * scale);

  return (
    <g transform={`translate(${node.x}, ${node.y})`}>
      {/* Node background */}
      <rect
        width={node.width}
        height={node.height}
        rx={8}
        className={`${colors.bg} ${colors.darkBg} stroke-2 ${colors.border} ${colors.darkBorder}`}
        style={{ fill: 'currentColor' }}
      />
      {/* Credential indicator */}
      {node.hasCredentials && (
        <circle
          cx={node.width - 8}
          cy={8}
          r={5}
          className="fill-amber-500 dark:fill-amber-400"
        />
      )}
      {/* Node type label */}
      <text
        x={node.width / 2}
        y={18}
        textAnchor="middle"
        className={`${colors.text} ${colors.darkText} font-medium`}
        style={{ fontSize: fontSize - 2 }}
      >
        {node.shortType.length > 16
          ? node.shortType.substring(0, 14) + '...'
          : node.shortType}
      </text>
      {/* Node name */}
      <text
        x={node.width / 2}
        y={38}
        textAnchor="middle"
        className="fill-gray-900 dark:fill-white font-semibold"
        style={{ fontSize }}
      >
        {node.name.length > 14 ? node.name.substring(0, 12) + '...' : node.name}
      </text>
    </g>
  );
}

// Connection path component
function ConnectionPathComponent({
  connection,
  nodes,
  config,
}: {
  connection: CanvasConnection;
  nodes: Map<string, CanvasNode>;
  config: typeof DEFAULT_CANVAS_CONFIG;
}) {
  const sourceNode = nodes.get(connection.sourceId);
  const targetNode = nodes.get(connection.targetId);

  if (!sourceNode || !targetNode) return null;

  const path = generateConnectionPath(
    sourceNode.x,
    sourceNode.y,
    targetNode.x,
    targetNode.y,
    config.nodeWidth,
    config.nodeHeight
  );

  return (
    <path
      d={path}
      fill="none"
      className="stroke-gray-400 dark:stroke-gray-500"
      strokeWidth={2}
      strokeLinecap="round"
      markerEnd="url(#arrowhead)"
    />
  );
}

// Linear fallback visualization
function LinearVisualization({
  nodes,
  compact,
}: {
  nodes: CanvasNode[];
  compact?: boolean;
}) {
  const sortedNodes = sortNodesForLinearDisplay(nodes);

  return (
    <div className={`flex flex-wrap gap-2 items-center ${compact ? 'p-2' : 'p-4'}`}>
      {sortedNodes.map((node, index) => {
        const colors = NODE_COLORS[node.category];
        return (
          <div key={node.id} className="flex items-center gap-2">
            <div
              className={`
                ${compact ? 'px-2 py-1.5 min-w-[80px] max-w-[120px]' : 'px-3 py-2 min-w-[100px] max-w-[160px]'}
                rounded-lg border-2 ${colors.bg} ${colors.darkBg} ${colors.border} ${colors.darkBorder}
                relative
              `}
            >
              {node.hasCredentials && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500" />
              )}
              <div
                className={`text-[10px] font-medium ${colors.text} ${colors.darkText} truncate`}
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
              <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">
                →
              </span>
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
    <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Node Types:
      </span>
      {Array.from(categories).map((category) => {
        const colors = NODE_COLORS[category];
        return (
          <div key={category} className="flex items-center gap-1.5">
            <div
              className={`w-3 h-3 rounded ${colors.bg} ${colors.darkBg} border ${colors.border} ${colors.darkBorder}`}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
              {category}
            </span>
          </div>
        );
      })}
      <div className="flex items-center gap-1.5 ml-2">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
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
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Parse workflow data
  const parsed = useMemo(() => {
    return parseWorkflow(
      workflow,
      dimensions.width,
      compact ? 250 : dimensions.height
    );
  }, [workflow, dimensions, compact]);

  // Check if we have valid connections
  const useGraphView = useMemo(
    () => hasValidConnections(workflow) && parsed.connections.length > 0,
    [workflow, parsed]
  );

  // Get unique categories for legend
  const categories = useMemo(() => {
    const cats = new Set<NodeCategory>();
    parsed.nodes.forEach((node) => cats.add(node.category));
    cats.delete('note'); // Don't show sticky notes in legend
    return cats;
  }, [parsed.nodes]);

  // Create node lookup map
  const nodeMap = useMemo(() => {
    const map = new Map<string, CanvasNode>();
    parsed.nodes.forEach((node) => map.set(node.id, node));
    return map;
  }, [parsed.nodes]);

  // Handle resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: compact ? 250 : Math.max(300, entry.contentRect.height),
        });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [compact]);

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

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
        {useGraphView && !compact && (
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
            <span className="text-xs text-gray-500 w-10 text-center">
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

      {/* Canvas */}
      <div
        ref={containerRef}
        className={`relative ${compact ? 'min-h-[200px]' : 'min-h-[300px]'} bg-white dark:bg-gray-900`}
      >
        {useGraphView ? (
          <svg
            width="100%"
            height={compact ? 250 : 400}
            viewBox={`0 0 ${dimensions.width} ${compact ? 250 : dimensions.height}`}
            className="overflow-visible"
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: 'center center',
            }}
          >
            {/* Defs for arrow marker */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  className="fill-gray-400 dark:fill-gray-500"
                />
              </marker>
            </defs>

            {/* Connections */}
            <g className="connections">
              {parsed.connections.map((conn) => (
                <ConnectionPathComponent
                  key={conn.id}
                  connection={conn}
                  nodes={nodeMap}
                  config={DEFAULT_CANVAS_CONFIG}
                />
              ))}
            </g>

            {/* Nodes */}
            <g className="nodes">
              {parsed.nodes.map((node) => (
                <CanvasNodeComponent key={node.id} node={node} scale={zoom} />
              ))}
            </g>
          </svg>
        ) : (
          <LinearVisualization nodes={parsed.nodes} compact={compact} />
        )}
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
