import { promises as fs } from 'fs';
import path from 'path';
import type {
  WorkflowMeta,
  WorkflowDetail,
  Category,
  IntegrationSummary,
  Stats,
} from '@/types';

const DATA_DIR = path.join(process.cwd(), 'public/data');

/**
 * Get all workflows metadata (search index)
 */
export async function getAllWorkflows(): Promise<WorkflowMeta[]> {
  try {
    const filePath = path.join(DATA_DIR, 'index.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as WorkflowMeta[];
  } catch (error) {
    console.error('Error loading workflows index:', error);
    return [];
  }
}

/**
 * Get workflow detail by slug
 */
export async function getWorkflowBySlug(slug: string): Promise<WorkflowDetail | null> {
  try {
    const filePath = path.join(DATA_DIR, 'workflows', `${slug}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as WorkflowDetail;
  } catch (error) {
    console.error(`Error loading workflow ${slug}:`, error);
    return null;
  }
}

/**
 * Get all workflow slugs for static generation
 */
export async function getAllWorkflowSlugs(): Promise<string[]> {
  try {
    const workflows = await getAllWorkflows();
    return workflows.map((w) => w.slug);
  } catch (error) {
    console.error('Error getting workflow slugs:', error);
    return [];
  }
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const filePath = path.join(DATA_DIR, 'categories.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as Category[];
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const categories = await getCategories();
    return categories.find((c) => c.slug === slug) || null;
  } catch (error) {
    console.error(`Error loading category ${slug}:`, error);
    return null;
  }
}

/**
 * Get all integrations
 */
export async function getIntegrations(): Promise<IntegrationSummary[]> {
  try {
    const filePath = path.join(DATA_DIR, 'integrations.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as IntegrationSummary[];
  } catch (error) {
    console.error('Error loading integrations:', error);
    return [];
  }
}

/**
 * Get integration by slug
 */
export async function getIntegrationBySlug(slug: string): Promise<IntegrationSummary | null> {
  try {
    const integrations = await getIntegrations();
    return integrations.find((i) => i.slug === slug) || null;
  } catch (error) {
    console.error(`Error loading integration ${slug}:`, error);
    return null;
  }
}

/**
 * Get workflows by category
 */
export async function getWorkflowsByCategory(categorySlug: string): Promise<WorkflowMeta[]> {
  try {
    const workflows = await getAllWorkflows();
    return workflows.filter((w) => w.category === categorySlug);
  } catch (error) {
    console.error(`Error filtering workflows by category ${categorySlug}:`, error);
    return [];
  }
}

/**
 * Get workflows by integration
 */
export async function getWorkflowsByIntegration(integrationSlug: string): Promise<WorkflowMeta[]> {
  try {
    const workflows = await getAllWorkflows();
    return workflows.filter((w) => w.integrations.includes(integrationSlug));
  } catch (error) {
    console.error(`Error filtering workflows by integration ${integrationSlug}:`, error);
    return [];
  }
}

/**
 * Get featured workflows (high quality, curated)
 */
export async function getFeaturedWorkflows(limit: number = 12): Promise<WorkflowMeta[]> {
  try {
    const workflows = await getAllWorkflows();
    return workflows
      .filter((w) => w.quality >= 4)
      .sort((a, b) => {
        // Prioritize awesome source
        if (a.source === 'awesome' && b.source !== 'awesome') return -1;
        if (a.source !== 'awesome' && b.source === 'awesome') return 1;
        // Then by quality
        return b.quality - a.quality;
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting featured workflows:', error);
    return [];
  }
}

/**
 * Get stats
 */
export async function getStats(): Promise<Stats | null> {
  try {
    const filePath = path.join(DATA_DIR, 'stats.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as Stats;
  } catch (error) {
    console.error('Error loading stats:', error);
    return null;
  }
}

/**
 * Get related workflows (same category or integration)
 */
export async function getRelatedWorkflows(
  workflow: WorkflowDetail,
  limit: number = 6
): Promise<WorkflowMeta[]> {
  try {
    const allWorkflows = await getAllWorkflows();

    // Score each workflow by relevance
    const scored = allWorkflows
      .filter((w) => w.slug !== workflow.slug)
      .map((w) => {
        let score = 0;
        // Same category
        if (w.category === workflow.category) score += 3;
        // Shared integrations
        const sharedIntegrations = w.integrations.filter((i) =>
          workflow.integrations.some((wi) => wi.slug === i)
        ).length;
        score += sharedIntegrations * 2;
        // Same trigger type
        if (w.triggerType === workflow.triggerType) score += 1;
        // Quality bonus
        score += w.quality;
        return { workflow: w, score };
      })
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map((s) => s.workflow);
  } catch (error) {
    console.error('Error getting related workflows:', error);
    return [];
  }
}

/**
 * Get latest added workflows (sorted by createdAt)
 */
export async function getLatestWorkflows(limit: number = 12): Promise<WorkflowMeta[]> {
  try {
    const workflows = await getAllWorkflows();
    return workflows
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting latest workflows:', error);
    return [];
  }
}

/**
 * Search workflows (basic server-side search for initial load)
 */
export async function searchWorkflows(query: string, limit: number = 50): Promise<WorkflowMeta[]> {
  try {
    const workflows = await getAllWorkflows();
    const lowerQuery = query.toLowerCase();

    return workflows
      .filter(
        (w) =>
          w.name.toLowerCase().includes(lowerQuery) ||
          w.description.toLowerCase().includes(lowerQuery) ||
          w.integrations.some((i) => i.includes(lowerQuery))
      )
      .slice(0, limit);
  } catch (error) {
    console.error('Error searching workflows:', error);
    return [];
  }
}
