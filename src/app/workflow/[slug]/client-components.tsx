'use client';

import { useState } from 'react';
import { Download, Copy, Check, ChevronDown, ChevronUp, Code, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { N8nWorkflow } from '@/types';

interface DownloadButtonProps {
  workflow: object;
  name: string;
}

export function DownloadButton({ workflow, name }: DownloadButtonProps) {
  const handleDownload = () => {
    const json = JSON.stringify(workflow, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleDownload} className="gap-2">
      <Download className="w-4 h-4" />
      Download JSON
    </Button>
  );
}

interface CopyButtonProps {
  workflow: object;
}

export function CopyButton({ workflow }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const json = JSON.stringify(workflow, null, 2);
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Button variant="outline" onClick={handleCopy} className="gap-2">
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-500" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copy JSON
        </>
      )}
    </Button>
  );
}

interface JsonCodePreviewProps {
  workflow: N8nWorkflow;
}

export function JsonCodePreview({ workflow }: JsonCodePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const json = JSON.stringify(workflow, null, 2);
  const previewLines = json.split('\n').slice(0, 20).join('\n');
  const hasMore = json.split('\n').length > 20;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            workflow.json
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-2 h-8">
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-500" />
              <span className="text-xs">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </Button>
      </div>
      <div className="relative">
        <pre className="p-4 text-xs sm:text-sm overflow-x-auto bg-gray-900 text-gray-100 max-h-[400px] overflow-y-auto">
          <code>{isExpanded ? json : previewLines}</code>
          {!isExpanded && hasMore && (
            <span className="text-gray-500">
              {'\n'}...
            </span>
          )}
        </pre>
        {hasMore && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2 pt-8 bg-gradient-to-t from-gray-900 to-transparent">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-2"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show All ({json.split('\n').length} lines)
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

interface WorkflowVisualizationProps {
  workflow: N8nWorkflow;
}

// Helper to get node type category for coloring
function getNodeCategory(type: string): string {
  if (type.includes('trigger') || type.includes('Trigger')) return 'trigger';
  if (type.includes('webhook') || type.includes('Webhook')) return 'trigger';
  if (type.includes('http') || type.includes('Http')) return 'http';
  if (type.includes('function') || type.includes('code') || type.includes('Code')) return 'code';
  if (type.includes('if') || type.includes('switch') || type.includes('If') || type.includes('Switch')) return 'logic';
  if (type.includes('set') || type.includes('Set')) return 'transform';
  return 'default';
}

// Color mapping for node categories
const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  trigger: { bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-300 dark:border-green-700', text: 'text-green-700 dark:text-green-300' },
  http: { bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-300 dark:border-blue-700', text: 'text-blue-700 dark:text-blue-300' },
  code: { bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-300 dark:border-purple-700', text: 'text-purple-700 dark:text-purple-300' },
  logic: { bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-300 dark:border-orange-700', text: 'text-orange-700 dark:text-orange-300' },
  transform: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-300 dark:border-yellow-700', text: 'text-yellow-700 dark:text-yellow-300' },
  default: { bg: 'bg-gray-100 dark:bg-gray-800', border: 'border-gray-300 dark:border-gray-600', text: 'text-gray-700 dark:text-gray-300' },
};

export function WorkflowVisualization({ workflow }: WorkflowVisualizationProps) {
  const nodes = workflow.nodes || [];

  if (nodes.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500 dark:text-gray-400">
        No nodes found in this workflow.
      </Card>
    );
  }

  // Sort nodes by position (left to right, top to bottom)
  const sortedNodes = [...nodes].sort((a, b) => {
    const [ax, ay] = a.position;
    const [bx, by] = b.position;
    if (Math.abs(ay - by) > 100) return ay - by; // Different rows
    return ax - bx; // Same row, sort by x
  });

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Workflow className="w-5 h-5 text-brand-500" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Workflow Structure ({nodes.length} nodes)
        </h2>
      </div>

      {/* Node flow visualization */}
      <div className="flex flex-wrap gap-3 items-center">
        {sortedNodes.map((node, index) => {
          const category = getNodeCategory(node.type);
          const colors = categoryColors[category];
          const shortType = node.type.split('.').pop() || node.type;

          return (
            <div key={node.id || index} className="flex items-center gap-2">
              <div
                className={`px-3 py-2 rounded-lg border ${colors.bg} ${colors.border} min-w-[120px] max-w-[200px]`}
              >
                <div className={`text-xs font-medium ${colors.text} truncate`}>
                  {shortType}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate" title={node.name}>
                  {node.name}
                </div>
              </div>
              {index < sortedNodes.length - 1 && (
                <div className="text-gray-400 dark:text-gray-600 flex-shrink-0">
                  →
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Node Types:</div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(categoryColors).map(([key, colors]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded ${colors.bg} ${colors.border} border`} />
              <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{key}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
