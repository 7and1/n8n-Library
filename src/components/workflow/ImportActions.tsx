'use client';

import { useState, useEffect } from 'react';
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  Settings,
  Rocket,
  Link2,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { N8nInstanceSettingsModal } from './N8nInstanceSettings';
import {
  getInstanceSettings,
  openInN8n,
  openWithDeepLink,
  downloadWorkflow,
  copyWorkflowToClipboard,
  supportsDeepLinks,
} from '@/lib/n8n-import';
import type { N8nWorkflow } from '@/types';

interface ImportActionsProps {
  workflow: N8nWorkflow;
  workflowSlug: string;
  sourceUrl?: string;
  variant?: 'default' | 'compact';
  className?: string;
}

export function ImportActions({
  workflow,
  workflowSlug,
  sourceUrl,
  variant = 'default',
  className = '',
}: ImportActionsProps) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [hasInstance, setHasInstance] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);

  // Check for saved instance settings
  useEffect(() => {
    setHasInstance(!!getInstanceSettings());
  }, [settingsOpen]);

  const handleCopy = async () => {
    const success = await copyWorkflowToClipboard(workflow);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadWorkflow(workflow, workflowSlug);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleOpenInN8n = () => {
    const settings = getInstanceSettings();
    if (settings) {
      openInN8n(workflow, settings.instanceUrl);
    } else {
      setSettingsOpen(true);
    }
    setShowImportMenu(false);
  };

  const handleDeepLink = () => {
    openWithDeepLink(workflow);
    setShowImportMenu(false);
  };

  const isCompact = variant === 'compact';

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Primary Action: Open in n8n */}
      <div className="relative">
        <div className="flex">
          <Button
            onClick={handleOpenInN8n}
            className={`gap-2 ${hasInstance ? 'rounded-r-none' : ''}`}
            title={
              hasInstance
                ? 'Open in your n8n instance'
                : 'Configure n8n instance'
            }
          >
            <Rocket className="w-4 h-4" />
            {isCompact ? 'Import' : 'Open in n8n'}
          </Button>
          {hasInstance && (
            <Button
              onClick={() => setShowImportMenu(!showImportMenu)}
              className="rounded-l-none border-l border-brand-600 px-2"
              title="More import options"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Import options dropdown */}
        {showImportMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowImportMenu(false)}
            />
            <div className="absolute top-full left-0 mt-1 z-20 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
              <button
                onClick={handleOpenInN8n}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Rocket className="w-4 h-4 text-brand-500" />
                <div className="text-left">
                  <div className="font-medium">Open in n8n</div>
                  <div className="text-xs text-gray-500">
                    Import to your instance
                  </div>
                </div>
              </button>
              {supportsDeepLinks() && (
                <button
                  onClick={handleDeepLink}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Link2 className="w-4 h-4 text-purple-500" />
                  <div className="text-left">
                    <div className="font-medium">Open Desktop App</div>
                    <div className="text-xs text-gray-500">
                      n8n:// deep link
                    </div>
                  </div>
                </button>
              )}
              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
              <button
                onClick={() => {
                  setSettingsOpen(true);
                  setShowImportMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Settings className="w-4 h-4 text-gray-500" />
                <div className="text-left">
                  <div className="font-medium">Change Instance</div>
                  <div className="text-xs text-gray-500">
                    Update n8n URL
                  </div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Download JSON */}
      <Button
        variant="outline"
        onClick={handleDownload}
        className="gap-2"
        title="Download workflow JSON file"
      >
        {downloaded ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            {!isCompact && 'Downloaded!'}
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            {!isCompact && 'Download'}
          </>
        )}
      </Button>

      {/* Copy JSON */}
      <Button
        variant="outline"
        onClick={handleCopy}
        className="gap-2"
        title="Copy workflow JSON to clipboard"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            {!isCompact && 'Copied!'}
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            {!isCompact && 'Copy'}
          </>
        )}
      </Button>

      {/* View on GitHub */}
      {sourceUrl && (
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            {!isCompact && 'GitHub'}
          </Button>
        </a>
      )}

      {/* Settings Modal */}
      <N8nInstanceSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onSave={() => setHasInstance(true)}
      />
    </div>
  );
}

export default ImportActions;
