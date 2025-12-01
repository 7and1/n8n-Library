/**
 * Utilities for workflow visualization
 */

import type { N8nWorkflow, N8nNode } from '@/types';
import type {
  CanvasNode,
  CanvasConnection,
  NodeCategory,
  NodeColors,
  ViewportBounds,
  CanvasConfig,
  ParsedWorkflow,
  N8nConnections,
} from '@/types/workflow-visualization';

// Default canvas configuration
export const DEFAULT_CANVAS_CONFIG: CanvasConfig = {
  width: 800,
  height: 400,
  padding: 40,
  nodeWidth: 140,
  nodeHeight: 60,
  gridSize: 20,
};

// Node category colors
export const NODE_COLORS: Record<NodeCategory, NodeColors> = {
  trigger: {
    bg: 'bg-green-100',
    border: 'border-green-400',
    text: 'text-green-700',
    darkBg: 'dark:bg-green-900/30',
    darkBorder: 'dark:border-green-600',
    darkText: 'dark:text-green-300',
  },
  http: {
    bg: 'bg-blue-100',
    border: 'border-blue-400',
    text: 'text-blue-700',
    darkBg: 'dark:bg-blue-900/30',
    darkBorder: 'dark:border-blue-600',
    darkText: 'dark:text-blue-300',
  },
  code: {
    bg: 'bg-purple-100',
    border: 'border-purple-400',
    text: 'text-purple-700',
    darkBg: 'dark:bg-purple-900/30',
    darkBorder: 'dark:border-purple-600',
    darkText: 'dark:text-purple-300',
  },
  logic: {
    bg: 'bg-orange-100',
    border: 'border-orange-400',
    text: 'text-orange-700',
    darkBg: 'dark:bg-orange-900/30',
    darkBorder: 'dark:border-orange-600',
    darkText: 'dark:text-orange-300',
  },
  transform: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-400',
    text: 'text-yellow-700',
    darkBg: 'dark:bg-yellow-900/30',
    darkBorder: 'dark:border-yellow-600',
    darkText: 'dark:text-yellow-300',
  },
  action: {
    bg: 'bg-indigo-100',
    border: 'border-indigo-400',
    text: 'text-indigo-700',
    darkBg: 'dark:bg-indigo-900/30',
    darkBorder: 'dark:border-indigo-600',
    darkText: 'dark:text-indigo-300',
  },
  note: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-700',
    darkBg: 'dark:bg-amber-900/20',
    darkBorder: 'dark:border-amber-600',
    darkText: 'dark:text-amber-300',
  },
  default: {
    bg: 'bg-gray-100',
    border: 'border-gray-400',
    text: 'text-gray-700',
    darkBg: 'dark:bg-gray-800',
    darkBorder: 'dark:border-gray-600',
    darkText: 'dark:text-gray-300',
  },
};

/**
 * Determine node category based on type string
 */
export function getNodeCategory(type: string): NodeCategory {
  const typeLower = type.toLowerCase();

  // Trigger nodes
  if (
    typeLower.includes('trigger') ||
    typeLower.includes('webhook') ||
    typeLower.includes('cron') ||
    typeLower.includes('schedule')
  ) {
    return 'trigger';
  }

  // HTTP/API nodes
  if (
    typeLower.includes('http') ||
    typeLower.includes('request') ||
    typeLower.includes('api')
  ) {
    return 'http';
  }

  // Code nodes
  if (
    typeLower.includes('code') ||
    typeLower.includes('function') ||
    typeLower.includes('javascript')
  ) {
    return 'code';
  }

  // Logic/Control flow nodes
  if (
    typeLower.includes('if') ||
    typeLower.includes('switch') ||
    typeLower.includes('merge') ||
    typeLower.includes('split') ||
    typeLower.includes('loop') ||
    typeLower.includes('filter')
  ) {
    return 'logic';
  }

  // Transform/Data nodes
  if (
    typeLower.includes('set') ||
    typeLower.includes('rename') ||
    typeLower.includes('move') ||
    typeLower.includes('convert') ||
    typeLower.includes('aggregate')
  ) {
    return 'transform';
  }

  // Sticky notes
  if (typeLower.includes('stickynote') || typeLower.includes('note')) {
    return 'note';
  }

  // Action nodes (most integrations)
  if (
    typeLower.includes('google') ||
    typeLower.includes('slack') ||
    typeLower.includes('telegram') ||
    typeLower.includes('discord') ||
    typeLower.includes('notion') ||
    typeLower.includes('airtable') ||
    typeLower.includes('sheets') ||
    typeLower.includes('mysql') ||
    typeLower.includes('postgres') ||
    typeLower.includes('mongodb') ||
    typeLower.includes('redis') ||
    typeLower.includes('send') ||
    typeLower.includes('create') ||
    typeLower.includes('update') ||
    typeLower.includes('delete')
  ) {
    return 'action';
  }

  return 'default';
}

/**
 * Get short display name for node type
 */
export function getShortNodeType(type: string): string {
  // Remove common prefixes
  let short = type
    .replace('n8n-nodes-base.', '')
    .replace('n8n-nodes-', '')
    .replace('@n8n/', '');

  // Convert camelCase to Title Case with spaces
  short = short.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Capitalize first letter
  return short.charAt(0).toUpperCase() + short.slice(1);
}

/**
 * Calculate viewport bounds from node positions
 */
export function calculateViewportBounds(nodes: N8nNode[]): ViewportBounds {
  if (nodes.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 };
  }

  // Filter out sticky notes for bounds calculation (they're often far from main flow)
  const actionNodes = nodes.filter(
    (n) => !n.type.toLowerCase().includes('stickynote')
  );
  const nodesToUse = actionNodes.length > 0 ? actionNodes : nodes;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const node of nodesToUse) {
    const [x, y] = node.position;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  // Add node dimensions to max values
  maxX += DEFAULT_CANVAS_CONFIG.nodeWidth;
  maxY += DEFAULT_CANVAS_CONFIG.nodeHeight;

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Normalize node positions to fit within canvas
 */
export function normalizePositions(
  nodes: N8nNode[],
  bounds: ViewportBounds,
  canvasWidth: number,
  canvasHeight: number,
  config: CanvasConfig = DEFAULT_CANVAS_CONFIG
): CanvasNode[] {
  const { padding, nodeWidth, nodeHeight } = config;

  // Calculate available space
  const availableWidth = canvasWidth - padding * 2 - nodeWidth;
  const availableHeight = canvasHeight - padding * 2 - nodeHeight;

  // Calculate scale factors
  const scaleX = bounds.width > 0 ? availableWidth / bounds.width : 1;
  const scaleY = bounds.height > 0 ? availableHeight / bounds.height : 1;
  const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down

  return nodes.map((node, index) => {
    const [originalX, originalY] = node.position;

    // Normalize position
    const normalizedX = (originalX - bounds.minX) * scale + padding;
    const normalizedY = (originalY - bounds.minY) * scale + padding;

    // Extract credential types
    const credentialTypes = node.credentials
      ? Object.keys(node.credentials)
      : [];

    return {
      id: node.id || `node-${index}`,
      name: node.name,
      type: node.type,
      shortType: getShortNodeType(node.type),
      category: getNodeCategory(node.type),
      x: normalizedX,
      y: normalizedY,
      width: nodeWidth,
      height: nodeHeight,
      hasCredentials: credentialTypes.length > 0,
      credentialTypes,
    };
  });
}

/**
 * Parse n8n connections format into simple connection list
 */
export function parseConnections(
  workflow: N8nWorkflow,
  canvasNodes: CanvasNode[]
): CanvasConnection[] {
  const connections: CanvasConnection[] = [];
  const rawConnections = workflow.connections as N8nConnections;

  if (!rawConnections || typeof rawConnections !== 'object') {
    return connections;
  }

  // Create lookup maps
  const nodeByName = new Map<string, CanvasNode>();
  const nodeById = new Map<string, CanvasNode>();

  for (const node of canvasNodes) {
    nodeByName.set(node.name, node);
    nodeById.set(node.id, node);
  }

  // Also map original nodes by name for matching
  const originalNodes = workflow.nodes || [];
  const nodeIdToName = new Map<string, string>();
  for (const node of originalNodes) {
    if (node.id) {
      nodeIdToName.set(node.id, node.name);
    }
  }

  // Helper function to find node by key (name or id)
  const findNode = (key: string): CanvasNode | undefined => {
    let node = nodeByName.get(key) || nodeById.get(key);
    if (!node) {
      // Try to find by original node id
      const nodeName = nodeIdToName.get(key);
      if (nodeName) {
        node = nodeByName.get(nodeName);
      }
    }
    return node;
  };

  // Parse connections
  let connectionIndex = 0;
  for (const [sourceKey, outputs] of Object.entries(rawConnections)) {
    // Source can be node name or node id
    const sourceNode = findNode(sourceKey);

    if (!sourceNode || !outputs) continue;

    // Process each output type (usually 'main')
    for (const [, outputConnections] of Object.entries(outputs)) {
      if (!outputConnections || !Array.isArray(outputConnections)) continue;

      // Each output can have multiple connections
      outputConnections.forEach((connArray, outputIndex) => {
        if (!Array.isArray(connArray)) return;

        for (const conn of connArray) {
          if (!conn || typeof conn !== 'object') continue;

          // Target can be 'node' property (name or id)
          const targetKey = conn.node;
          if (!targetKey) continue;

          // Skip error-handler nodes (generated by ETL)
          if (targetKey.startsWith('error-handler-')) continue;

          const targetNode = findNode(targetKey);

          if (!targetNode) continue;

          connections.push({
            id: `conn-${connectionIndex++}`,
            sourceId: sourceNode.id,
            targetId: targetNode.id,
            sourceOutput: outputIndex,
            targetInput: conn.index || 0,
          });
        }
      });
    }
  }

  return connections;
}

/**
 * Generate SVG path for a bezier curve connection
 */
export function generateConnectionPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  nodeWidth: number,
  nodeHeight: number
): string {
  // Connection points: right side of source, left side of target
  const startX = sourceX + nodeWidth;
  const startY = sourceY + nodeHeight / 2;
  const endX = targetX;
  const endY = targetY + nodeHeight / 2;

  // Calculate control points for smooth bezier curve
  const dx = Math.abs(endX - startX);
  const controlOffset = Math.min(dx * 0.5, 100);

  const cp1x = startX + controlOffset;
  const cp1y = startY;
  const cp2x = endX - controlOffset;
  const cp2y = endY;

  return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
}

/**
 * Parse workflow and prepare for canvas rendering
 */
export function parseWorkflow(
  workflow: N8nWorkflow,
  canvasWidth: number = DEFAULT_CANVAS_CONFIG.width,
  canvasHeight: number = DEFAULT_CANVAS_CONFIG.height
): ParsedWorkflow {
  const nodes = workflow.nodes || [];

  // Filter out sticky notes for main visualization
  const actionNodes = nodes.filter(
    (n) => !n.type.toLowerCase().includes('stickynote')
  );
  const nodesToRender = actionNodes.length > 0 ? actionNodes : nodes;

  // Calculate bounds
  const bounds = calculateViewportBounds(nodesToRender);

  // Normalize positions
  const canvasNodes = normalizePositions(
    nodesToRender,
    bounds,
    canvasWidth,
    canvasHeight
  );

  // Parse connections
  const connections = parseConnections(workflow, canvasNodes);

  return {
    nodes: canvasNodes,
    connections,
    bounds,
    hasValidConnections: connections.length > 0,
  };
}

/**
 * Sort nodes for linear display (fallback when connections aren't available)
 */
export function sortNodesForLinearDisplay(nodes: CanvasNode[]): CanvasNode[] {
  return [...nodes].sort((a, b) => {
    // Group by approximate row (y position within 100px tolerance)
    const rowA = Math.floor(a.y / 100);
    const rowB = Math.floor(b.y / 100);

    if (rowA !== rowB) {
      return rowA - rowB;
    }

    // Within same row, sort by x position (left to right)
    return a.x - b.x;
  });
}

/**
 * Check if workflow has meaningful connections data
 */
export function hasValidConnections(workflow: N8nWorkflow): boolean {
  const connections = workflow.connections;
  if (!connections || typeof connections !== 'object') return false;

  // Check if any connection points to a real node (not error-handler)
  for (const outputs of Object.values(connections)) {
    if (!outputs || typeof outputs !== 'object') continue;

    for (const connArray of Object.values(outputs)) {
      if (!Array.isArray(connArray)) continue;

      for (const conns of connArray) {
        if (!Array.isArray(conns)) continue;

        for (const conn of conns) {
          if (
            conn &&
            typeof conn === 'object' &&
            conn.node &&
            !conn.node.startsWith('error-handler-')
          ) {
            return true;
          }
        }
      }
    }
  }

  return false;
}
