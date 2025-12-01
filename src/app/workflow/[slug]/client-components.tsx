'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { N8nWorkflow } from '@/types';

// Re-export ImportActions from the component file
export { ImportActions } from '@/components/workflow/ImportActions';

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
