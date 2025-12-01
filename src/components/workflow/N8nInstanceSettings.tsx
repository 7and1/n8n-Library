'use client';

import { useState, useEffect } from 'react';
import { Settings, Cloud, Server, Monitor, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  getInstanceSettings,
  saveInstanceSettings,
  clearInstanceSettings,
  validateInstanceUrl,
  detectInstanceType,
} from '@/lib/n8n-import';
import type { N8nInstanceSettings } from '@/types/workflow-visualization';

interface N8nInstanceSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (settings: N8nInstanceSettings) => void;
}

export function N8nInstanceSettingsModal({
  open,
  onOpenChange,
  onSave,
}: N8nInstanceSettingsModalProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Load existing settings
  useEffect(() => {
    if (open) {
      const settings = getInstanceSettings();
      if (settings) {
        setUrl(settings.instanceUrl);
      }
      setError(null);
      setSaved(false);
    }
  }, [open]);

  const handleSave = () => {
    const validation = validateInstanceUrl(url);

    if (!validation.valid) {
      setError(validation.error || 'Invalid URL');
      return;
    }

    const normalizedUrl = validation.normalizedUrl!;
    const type = detectInstanceType(normalizedUrl);

    const settings: N8nInstanceSettings = {
      instanceUrl: normalizedUrl,
      type,
      lastUsed: new Date().toISOString(),
    };

    saveInstanceSettings(settings);
    setSaved(true);

    if (onSave) {
      onSave(settings);
    }

    // Close after brief feedback
    setTimeout(() => {
      onOpenChange(false);
    }, 1000);
  };

  const handleClear = () => {
    clearInstanceSettings();
    setUrl('');
    setError(null);
  };

  const instanceType = url ? detectInstanceType(url) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-500" />
            Configure n8n Instance
          </DialogTitle>
          <DialogDescription>
            Enter your n8n instance URL to enable one-click workflow import.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* URL Input */}
          <div className="space-y-2">
            <label
              htmlFor="n8n-url"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              n8n Instance URL
            </label>
            <input
              id="n8n-url"
              type="url"
              placeholder="https://your-instance.app.n8n.cloud"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
                setSaved(false);
              }}
              className={`
                w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800
                text-gray-900 dark:text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-brand-500
                ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
              `}
            />
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <X className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>

          {/* Instance Type Indicator */}
          {instanceType && !error && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              {instanceType === 'cloud' && (
                <>
                  <Cloud className="w-4 h-4 text-blue-500" />
                  <span>n8n Cloud instance detected</span>
                </>
              )}
              {instanceType === 'self-hosted' && (
                <>
                  <Server className="w-4 h-4 text-purple-500" />
                  <span>Self-hosted instance detected</span>
                </>
              )}
              {instanceType === 'local' && (
                <>
                  <Monitor className="w-4 h-4 text-green-500" />
                  <span>Local development instance detected</span>
                </>
              )}
            </div>
          )}

          {/* Example URLs */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Example URLs:
            </p>
            <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <li>• n8n Cloud: https://yourname.app.n8n.cloud</li>
              <li>• Self-hosted: https://n8n.yourdomain.com</li>
              <li>• Local: http://localhost:5678</li>
            </ul>
          </div>

          {/* Success feedback */}
          {saved && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
              <Check className="w-4 h-4" />
              Settings saved successfully!
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {getInstanceSettings() && (
            <Button
              variant="ghost"
              onClick={handleClear}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Clear
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!url.trim() || saved}>
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Button to open settings modal
export function N8nInstanceSettingsButton({
  variant = 'ghost',
  size = 'sm',
}: {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}) {
  const [open, setOpen] = useState(false);
  const [hasSettings, setHasSettings] = useState(false);

  useEffect(() => {
    setHasSettings(!!getInstanceSettings());
  }, []);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Settings className="w-4 h-4" />
        {hasSettings ? 'n8n Settings' : 'Configure n8n'}
      </Button>
      <N8nInstanceSettingsModal
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setHasSettings(!!getInstanceSettings());
          }
        }}
      />
    </>
  );
}

export default N8nInstanceSettingsModal;
