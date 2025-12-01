/**
 * Calculate workflow complexity
 */

import type { N8nWorkflow } from '@/types';
import type { ComplexityLevel, ComplexityAnalysis } from '@/types/workflow-visualization';
import { extractCredentials } from './credential-extractor';

/**
 * Analyze workflow complexity
 */
export function analyzeComplexity(workflow: N8nWorkflow): ComplexityAnalysis {
  const nodes = workflow.nodes || [];

  // Filter out sticky notes
  const actionNodes = nodes.filter(
    (n) => !n.type.toLowerCase().includes('stickynote')
  );

  const nodeCount = actionNodes.length;
  const credentials = extractCredentials(workflow);
  const credentialCount = credentials.length;

  // Check for code nodes
  const hasCodeNodes = actionNodes.some((n) => {
    const type = n.type.toLowerCase();
    return type.includes('code') || type.includes('function') || type.includes('javascript');
  });

  // Check for branching (if/switch nodes)
  const hasBranching = actionNodes.some((n) => {
    const type = n.type.toLowerCase();
    return type.includes('if') || type.includes('switch') || type.includes('merge');
  });

  // Check for loops
  const hasLoops = actionNodes.some((n) => {
    const type = n.type.toLowerCase();
    return type.includes('loop') || type.includes('splitinbatches') || type.includes('foreach');
  });

  // Count unique integrations (excluding core nodes)
  const integrationSet = new Set<string>();
  for (const node of actionNodes) {
    const type = node.type.toLowerCase();
    // Skip core utility nodes
    if (
      type.includes('set') ||
      type.includes('if') ||
      type.includes('switch') ||
      type.includes('merge') ||
      type.includes('split') ||
      type.includes('code') ||
      type.includes('function') ||
      type.includes('noOp') ||
      type.includes('wait')
    ) {
      continue;
    }
    // Extract integration name
    const match = node.type.match(/n8n-nodes-base\.(\w+)/);
    if (match) {
      integrationSet.add(match[1]);
    }
  }
  const integrationCount = integrationSet.size;

  // Calculate score (0-100)
  let score = 0;

  // Node count contribution (0-30 points)
  if (nodeCount <= 3) score += 5;
  else if (nodeCount <= 6) score += 10;
  else if (nodeCount <= 10) score += 15;
  else if (nodeCount <= 15) score += 22;
  else score += 30;

  // Credential count contribution (0-25 points)
  score += Math.min(credentialCount * 5, 25);

  // Code nodes (0-15 points)
  if (hasCodeNodes) score += 15;

  // Branching (0-10 points)
  if (hasBranching) score += 10;

  // Loops (0-10 points)
  if (hasLoops) score += 10;

  // Integration count (0-10 points)
  score += Math.min(integrationCount * 2, 10);

  // Determine level
  let level: ComplexityLevel;
  if (score <= 15) level = 'simple';
  else if (score <= 35) level = 'moderate';
  else if (score <= 60) level = 'complex';
  else level = 'advanced';

  return {
    level,
    score,
    factors: {
      nodeCount,
      credentialCount,
      hasCodeNodes,
      hasBranching,
      hasLoops,
      integrationCount,
    },
  };
}

/**
 * Get complexity level label with color
 */
export function getComplexityInfo(level: ComplexityLevel): {
  label: string;
  color: string;
  description: string;
  bgColor: string;
  textColor: string;
} {
  switch (level) {
    case 'simple':
      return {
        label: 'Simple',
        color: 'green',
        description: 'Great for beginners. Few nodes, straightforward setup.',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        textColor: 'text-green-700 dark:text-green-300',
      };
    case 'moderate':
      return {
        label: 'Moderate',
        color: 'blue',
        description: 'Some experience helpful. Multiple integrations or logic.',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        textColor: 'text-blue-700 dark:text-blue-300',
      };
    case 'complex':
      return {
        label: 'Complex',
        color: 'orange',
        description: 'Advanced features used. Requires n8n experience.',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        textColor: 'text-orange-700 dark:text-orange-300',
      };
    case 'advanced':
      return {
        label: 'Advanced',
        color: 'red',
        description: 'Expert level. Custom code, complex logic, many integrations.',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        textColor: 'text-red-700 dark:text-red-300',
      };
  }
}

/**
 * Estimate setup time based on complexity
 */
export function estimateSetupTime(analysis: ComplexityAnalysis): string {
  const { level, factors } = analysis;

  // Base time in minutes
  let minutes = 5;

  // Add time for credentials (5 min each on average)
  minutes += factors.credentialCount * 5;

  // Add time based on level
  switch (level) {
    case 'simple':
      minutes += 5;
      break;
    case 'moderate':
      minutes += 10;
      break;
    case 'complex':
      minutes += 20;
      break;
    case 'advanced':
      minutes += 30;
      break;
  }

  // Format output
  if (minutes < 60) {
    return `~${Math.round(minutes / 5) * 5} min`;
  }
  const hours = Math.round(minutes / 60 * 2) / 2; // Round to nearest 0.5
  return `~${hours}${hours === 1 ? ' hour' : ' hours'}`;
}
