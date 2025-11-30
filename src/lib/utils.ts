import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Unknown date';
  }
}

/**
 * Format number with K/M suffix
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generate slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Get category color class
 */
export function getCategoryColor(color: string): string {
  const colorMap: Record<string, string> = {
    'cat-ai': 'bg-purple-500',
    'cat-comm': 'bg-blue-500',
    'cat-prod': 'bg-emerald-500',
    'cat-devops': 'bg-amber-500',
    'cat-crm': 'bg-pink-500',
    'cat-ecom': 'bg-teal-500',
    'cat-data': 'bg-indigo-500',
    'cat-util': 'bg-gray-500',
  };
  return colorMap[color] || 'bg-gray-500';
}

/**
 * Get trigger type label
 */
export function getTriggerLabel(trigger: string): string {
  const labels: Record<string, string> = {
    webhook: 'Webhook',
    schedule: 'Scheduled',
    event: 'Event',
    manual: 'Manual',
  };
  return labels[trigger] || trigger;
}

/**
 * Get trigger type icon name
 */
export function getTriggerIcon(trigger: string): string {
  const icons: Record<string, string> = {
    webhook: 'Webhook',
    schedule: 'Clock',
    event: 'Zap',
    manual: 'Play',
  };
  return icons[trigger] || 'Circle';
}

/**
 * Get source label
 */
export function getSourceLabel(source: string): string {
  return source === 'awesome' ? 'Curated' : 'Community';
}

/**
 * Build absolute URL
 */
export function absoluteUrl(path: string): string {
  const baseUrl = process.env.SITE_URL || 'https://n8n-library.com';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Parse query params from URL search string
 */
export function parseSearchParams(searchParams: URLSearchParams): Record<string, string> {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

/**
 * Build query string from object
 */
export function buildQueryString(params: Record<string, string | null | undefined>): string {
  const entries = Object.entries(params).filter(([, value]) => value != null && value !== '');
  if (entries.length === 0) return '';
  return '?' + new URLSearchParams(entries as [string, string][]).toString();
}
