/**
 * Utilities for n8n workflow import
 */

import type { N8nWorkflow } from '@/types';
import type { N8nInstanceSettings } from '@/types/workflow-visualization';

// LocalStorage key for n8n settings
const STORAGE_KEY = 'n8n-library-instance-settings';

/**
 * Get saved n8n instance settings from localStorage
 */
export function getInstanceSettings(): N8nInstanceSettings | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const settings = JSON.parse(stored) as N8nInstanceSettings;
    return settings;
  } catch {
    return null;
  }
}

/**
 * Save n8n instance settings to localStorage
 */
export function saveInstanceSettings(settings: N8nInstanceSettings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    console.error('Failed to save n8n instance settings');
  }
}

/**
 * Clear n8n instance settings from localStorage
 */
export function clearInstanceSettings(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.error('Failed to clear n8n instance settings');
  }
}

/**
 * Detect instance type from URL
 */
export function detectInstanceType(
  url: string
): 'cloud' | 'self-hosted' | 'local' {
  const urlLower = url.toLowerCase();

  if (urlLower.includes('app.n8n.cloud')) {
    return 'cloud';
  }

  if (
    urlLower.includes('localhost') ||
    urlLower.includes('127.0.0.1') ||
    urlLower.includes('0.0.0.0')
  ) {
    return 'local';
  }

  return 'self-hosted';
}

/**
 * Validate n8n instance URL format
 */
export function validateInstanceUrl(url: string): {
  valid: boolean;
  error?: string;
  normalizedUrl?: string;
} {
  if (!url.trim()) {
    return { valid: false, error: 'URL is required' };
  }

  // Add protocol if missing
  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  try {
    const parsed = new URL(normalizedUrl);

    // Remove trailing slash
    normalizedUrl = parsed.origin + parsed.pathname.replace(/\/+$/, '');

    return { valid: true, normalizedUrl };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Encode workflow JSON for URL
 */
export function encodeWorkflowForUrl(workflow: N8nWorkflow): string {
  const json = JSON.stringify(workflow);
  // Use base64 encoding for URL safety
  if (typeof window !== 'undefined') {
    return btoa(unescape(encodeURIComponent(json)));
  }
  return Buffer.from(json, 'utf-8').toString('base64');
}

/**
 * Generate n8n import URL
 * Opens the workflow editor with the workflow pre-loaded
 */
export function generateImportUrl(
  instanceUrl: string,
  workflow: N8nWorkflow
): string {
  const validation = validateInstanceUrl(instanceUrl);
  if (!validation.valid || !validation.normalizedUrl) {
    throw new Error(validation.error || 'Invalid URL');
  }

  const base = validation.normalizedUrl;
  const encoded = encodeWorkflowForUrl(workflow);

  // n8n import URL format
  return `${base}/workflow/import?data=${encoded}`;
}

/**
 * Generate n8n deep link (n8n:// protocol)
 * For opening in desktop n8n app
 */
export function generateDeepLink(workflow: N8nWorkflow): string {
  const encoded = encodeWorkflowForUrl(workflow);
  return `n8n://import?data=${encoded}`;
}

/**
 * Open workflow in user's n8n instance
 */
export function openInN8n(
  workflow: N8nWorkflow,
  instanceUrl: string
): boolean {
  try {
    const url = generateImportUrl(instanceUrl, workflow);

    // Update last used timestamp
    const currentSettings = getInstanceSettings();
    if (currentSettings) {
      saveInstanceSettings({
        ...currentSettings,
        lastUsed: new Date().toISOString(),
      });
    }

    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
    return true;
  } catch (error) {
    console.error('Failed to open in n8n:', error);
    return false;
  }
}

/**
 * Open workflow using deep link
 */
export function openWithDeepLink(workflow: N8nWorkflow): void {
  const url = generateDeepLink(workflow);
  window.location.href = url;
}

/**
 * Download workflow as JSON file
 */
export function downloadWorkflow(workflow: N8nWorkflow, filename: string): void {
  const json = JSON.stringify(workflow, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.json') ? filename : `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

/**
 * Copy workflow JSON to clipboard
 */
export async function copyWorkflowToClipboard(
  workflow: N8nWorkflow
): Promise<boolean> {
  try {
    const json = JSON.stringify(workflow, null, 2);
    await navigator.clipboard.writeText(json);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Check if browser supports n8n deep links
 */
export function supportsDeepLinks(): boolean {
  // Deep links generally work on desktop, not mobile web
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent
  );

  return !isMobile;
}

/**
 * Get helpful text for import method
 */
export function getImportInstructions(method: 'url' | 'deeplink' | 'file'): string {
  switch (method) {
    case 'url':
      return 'Opens your n8n instance in a new tab with this workflow ready to import.';
    case 'deeplink':
      return 'Opens the n8n desktop app directly with this workflow (requires n8n desktop).';
    case 'file':
      return 'Download the JSON file, then import it in n8n via Workflows → Import from File.';
    default:
      return '';
  }
}
