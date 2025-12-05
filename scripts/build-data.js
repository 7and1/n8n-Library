#!/usr/bin/env node

/**
 * ETL Build Script for n8n Library
 * Extracts, transforms, and loads workflow data from GitHub repositories
 *
 * Data Sources:
 * - awesome-n8n-templates (~288 curated workflows)
 * - n8n-workflows (~2,061 community workflows)
 *
 * Output:
 * - public/data/index.json (search index)
 * - public/data/categories.json (category metadata)
 * - public/data/integrations.json (integration summary)
 * - public/data/workflows/[slug].json (individual workflow details)
 */

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const crypto = require('crypto');

const sinceArg = process.argv.find(arg => arg.startsWith('--since='));
const parsedSince = sinceArg ? new Date(sinceArg.split('=')[1]) : null;

const CONFIG = {
  awesomeRoot: path.resolve(__dirname, '../data/raw/awesome-n8n/'),
  communityRoot: path.resolve(__dirname, '../data/raw/n8n-workflows/workflows/'),
  communityRepoRoot: path.resolve(__dirname, '../data/raw/n8n-workflows/'),
  outputDir: path.resolve(__dirname, '../public/data/'),
  workflowsDir: path.resolve(__dirname, '../public/data/workflows/'),
  debug: process.env.DEBUG === '1' || process.argv.includes('--debug'),
  sourceFilter: process.argv.find(arg => arg.startsWith('--source='))?.split('=')[1] || 'all',
  force: process.argv.includes('--force'),
  since: parsedSince && !Number.isNaN(parsedSince.getTime()) ? parsedSince : null,
  maxWorkers:
    parseInt(
      process.argv.find(arg => arg.startsWith('--max-workers='))?.split('=')[1] || '',
      10
    ) || Math.max(1, (os.cpus()?.length || 2) - 1),
  pretty: process.argv.includes('--pretty'),
  revalidateUrl:
    process.env.WORKFLOW_REVALIDATE_URL ||
    process.env.REVALIDATE_URL ||
    process.argv.find(arg => arg.startsWith('--revalidate-url='))?.split('=')[1] ||
    null,
  revalidateToken:
    process.env.WORKFLOW_REVALIDATE_TOKEN ||
    process.env.REVALIDATE_TOKEN ||
    process.argv.find(arg => arg.startsWith('--revalidate-token='))?.split('=')[1] ||
    null,
};

const startTime = Date.now();

// Check if pre-built data exists (skip ETL on CI when data is already committed)
const prebuiltIndex = path.resolve(__dirname, '../public/data/index.json');
const prebuiltWorkflows = path.resolve(__dirname, '../public/data/workflows/');
if (!CONFIG.force && fs.existsSync(prebuiltIndex) && fs.existsSync(prebuiltWorkflows)) {
  const files = fs.readdirSync(prebuiltWorkflows);
  if (files.length > 0) {
    console.log('✅ Pre-built data found, skipping ETL pipeline (use --force to rebuild)');
    console.log(`   Found ${files.length} workflow files in public/data/workflows/`);
    process.exit(0);
  }
}

// Import helper modules
const {
  CATEGORIES,
  AWESOME_FOLDER_MAP,
  CATEGORY_PRIORITY,
  determineCategory,
  getCategoryBySlug,
} = require('./category-rules');

const {
  UTILITY_NODES,
  normalizeNodeType,
  getIconSlug,
  getIconInfo,
  formatDisplayName,
  generateSlug: generateIntegrationSlug,
  isUtilityNode,
  extractIntegrations,
} = require('./icon-map');

const CACHE_DIR = path.resolve(__dirname, '../.cache');
const MANIFEST_PATH = path.join(CACHE_DIR, 'workflow-manifest.json');
const manifestState = loadManifest();
const manifestEntries = manifestState.workflows;
let manifestDirty = false;
let manifestUpdatedAt = manifestState.updatedAt || null;
let cacheHits = 0;
let skippedBySince = 0;

// Track used slugs for uniqueness
const usedSlugs = new Set();

function loadManifest() {
  try {
    if (!fs.existsSync(MANIFEST_PATH)) {
      return { version: 1, workflows: {}, updatedAt: null };
    }
    const raw = fs.readFileSync(MANIFEST_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      version: parsed.version || 1,
      workflows: parsed.workflows || {},
      updatedAt: parsed.updatedAt || null,
    };
  } catch (error) {
    console.warn('⚠ Unable to load cache manifest, rebuilding everything.');
    if (CONFIG.debug) {
      console.error(error);
    }
    return { version: 1, workflows: {}, updatedAt: null };
  }
}

function saveManifest() {
  if (!manifestDirty) return;
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
  const payload = {
    version: 1,
    updatedAt: new Date().toISOString(),
    workflows: manifestEntries,
  };
  writeJsonFile(MANIFEST_PATH, payload);
  manifestUpdatedAt = payload.updatedAt;
}

function hashContent(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

function getRelativePath(filePath) {
  return path.relative(process.cwd(), filePath);
}

function getCachedWorkflow(relativePath, hash) {
  if (CONFIG.force) return null;
  const entry = manifestEntries[relativePath];
  if (!entry) return null;
  if (hash && entry.hash && entry.hash !== hash) {
    return null;
  }
  cacheHits += 1;
  usedSlugs.add(entry.workflow.slug);
  return entry.workflow;
}

function cacheWorkflow(relativePath, hash, workflow) {
  manifestEntries[relativePath] = { hash, workflow };
  manifestDirty = true;
}

function getRepoInfo(label, repoPath) {
  const base = {
    label,
    path: repoPath,
    exists: fs.existsSync(repoPath),
  };

  if (!base.exists) {
    return { ...base, error: 'missing repository path' };
  }

  try {
    const commit = execSync('git rev-parse HEAD', { cwd: repoPath }).toString().trim();
    const shortCommit = execSync('git rev-parse --short HEAD', { cwd: repoPath }).toString().trim();
    let remote = null;
    try {
      remote = execSync('git remote get-url origin', { cwd: repoPath }).toString().trim();
    } catch (error) {
      if (CONFIG.debug) {
        console.warn(`⚠ Unable to read remote for ${label}:`, error.message);
      }
    }
    let lastCommitAt = null;
    try {
      lastCommitAt = execSync('git log -1 --format=%cI', { cwd: repoPath }).toString().trim();
    } catch (error) {
      if (CONFIG.debug) {
        console.warn(`⚠ Unable to read last commit time for ${label}:`, error.message);
      }
    }
    let status = null;
    try {
      status = execSync('git status --short --untracked-files=no', { cwd: repoPath })
        .toString()
        .trim();
    } catch (error) {
      if (CONFIG.debug) {
        console.warn(`⚠ Unable to read git status for ${label}:`, error.message);
      }
    }

    return {
      ...base,
      commit,
      shortCommit,
      lastCommitAt,
      remote,
      dirty: Boolean(status),
    };
  } catch (error) {
    return { ...base, error: error.message };
  }
}

// ============================================
// Utility Functions
// ============================================

/**
 * Generate a unique hash ID from file path
 */
function generateHash(str) {
  return crypto.createHash('md5').update(str).digest('hex').substring(0, 12);
}

/**
 * Generate a URL-safe slug with uniqueness guarantee
 */
function generateSlug(name, source, id) {
  // Base slug from name
  let base = (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);

  // Fallback for empty slug
  if (!base) {
    base = source === 'awesome' ? 'workflow' : `workflow-${id.substring(0, 8)}`;
  }

  // Ensure uniqueness
  let slug = base;
  let counter = 1;

  while (usedSlugs.has(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }

  usedSlugs.add(slug);
  return slug;
}

/**
 * Format file name to readable title
 */
function formatFileName(fileName) {
  return fileName
    .replace(/^\d+_/, '')      // Remove numeric prefix
    .replace(/_/g, ' ')        // Underscores to spaces
    .replace(/\s+/g, ' ')      // Multiple spaces to single
    .trim();
}

/**
 * Clean description text
 */
function cleanDescription(text) {
  if (!text) return '';

  return text
    .replace(/[\n\r]+/g, ' ')    // Newlines to spaces
    .replace(/\s+/g, ' ')        // Multiple spaces to single
    .replace(/[#*_`]/g, '')      // Remove Markdown
    .trim()
    .substring(0, 500);
}

/**
 * Check if workflow has StickyNote descriptions
 */
function hasStickyNotes(workflow) {
  return (workflow.nodes || []).some(
    node => node.type === 'n8n-nodes-base.stickyNote' && node.parameters?.content
  );
}

/**
 * Get StickyNote content
 */
function getStickyNoteContent(workflow) {
  const sticky = (workflow.nodes || []).find(
    node => node.type === 'n8n-nodes-base.stickyNote' && node.parameters?.content
  );
  return sticky?.parameters?.content || '';
}

/**
 * Count nodes in workflow
 */
function countNodes(workflow) {
  return (workflow.nodes || []).length;
}

/**
 * Extract all node types from workflow
 */
function extractNodeTypes(workflow) {
  return [...new Set(
    (workflow.nodes || [])
      .map(n => n.type)
      .filter(Boolean)
  )];
}

/**
 * Calculate quality score (1-5)
 */
function calculateQuality(workflow, fileName, source) {
  if (source === 'awesome') {
    // Curated workflows start at 4
    let score = 4;
    if (hasStickyNotes(workflow)) score++;
    return Math.min(score, 5);
  }

  // Community workflows start at 2
  let score = 2;

  // +1 for meaningful name (not just numbers/UUID)
  const name = workflow.name || '';
  if (name && !name.match(/^[\d\-]+$|^[a-f0-9\-]{36}$/i)) {
    score++;
  }

  // +1 for >5 nodes
  if (countNodes(workflow) > 5) {
    score++;
  }

  // +1 for description
  if (workflow.description || hasStickyNotes(workflow)) {
    score++;
  }

  return Math.min(score, 5);
}

/**
 * Extract description with fallback priority
 */
function extractDescription(workflow) {
  // 1. Native description field
  if (workflow.description && workflow.description.trim()) {
    return cleanDescription(workflow.description);
  }

  // 2. StickyNote content
  const stickyContent = getStickyNoteContent(workflow);
  if (stickyContent) {
    return cleanDescription(stickyContent);
  }

  // 3. Meta description
  if (workflow.meta?.description) {
    return cleanDescription(workflow.meta.description);
  }

  // 4. Auto-generate
  return generateDescription(workflow);
}

/**
 * Auto-generate description from workflow content
 */
function generateDescription(workflow) {
  const integrations = extractIntegrations(workflow);
  const trigger = detectTriggerType(workflow);
  const nodeCount = countNodes(workflow);

  if (integrations.length >= 2) {
    const names = integrations.slice(0, 3).map(i => i.name);
    if (names.length === 2) {
      return `Automate ${names[0]} and ${names[1]} with this n8n workflow. ${trigger} triggered.`;
    }
    return `Connect ${names.join(', ')} and more with this n8n workflow. ${nodeCount} nodes total.`;
  }

  if (integrations.length === 1) {
    return `n8n workflow template for ${integrations[0].name} automation. ${nodeCount} nodes.`;
  }

  return `n8n automation workflow with ${nodeCount} nodes. ${trigger} triggered.`;
}

/**
 * Detect workflow trigger type
 */
function detectTriggerType(workflow) {
  const nodes = workflow.nodes || [];

  for (const node of nodes) {
    const type = (node.type || '').toLowerCase();

    if (type.includes('webhook')) return 'webhook';
    if (type.includes('schedule') || type.includes('cron')) return 'schedule';
    if (type.includes('trigger') && !type.includes('manual')) {
      return 'event';
    }
  }

  return 'manual';
}

/**
 * Extract search tags from workflow
 */
function extractTags(workflow, name, integrations) {
  const tags = new Set();

  // From name
  (name || '').toLowerCase().split(/\s+/).forEach(word => {
    if (word.length > 2 && word.length < 20) tags.add(word);
  });

  // From integrations
  integrations.forEach(int => tags.add(int.slug));

  // From workflow tags
  (workflow.tags || []).forEach(tag => {
    if (typeof tag === 'string') {
      tags.add(tag.toLowerCase());
    } else if (tag?.name) {
      tags.add(tag.name.toLowerCase());
    }
  });

  return Array.from(tags).slice(0, 20);
}

/**
 * Build GitHub source URL
 */
function buildSourceUrl(filePath, source) {
  // Get relative path
  let relativePath = filePath;

  if (source === 'awesome') {
    const baseIdx = filePath.indexOf('awesome-n8n');
    if (baseIdx !== -1) {
      relativePath = filePath.substring(baseIdx).replace('awesome-n8n/', '');
    }
    const encodedPath = relativePath.split('/').map(encodeURIComponent).join('/');
    return `https://github.com/enescingoz/awesome-n8n-templates/blob/main/${encodedPath}`;
  } else {
    const baseIdx = filePath.indexOf('n8n-workflows');
    if (baseIdx !== -1) {
      relativePath = filePath.substring(baseIdx).replace('n8n-workflows/', '');
    }
    const encodedPath = relativePath.split('/').map(encodeURIComponent).join('/');
    return `https://github.com/Zie619/n8n-workflows/blob/main/${encodedPath}`;
  }
}

// ============================================
// Parsing Functions
// ============================================

/**
 * Parse a single workflow JSON
 */
function parseWorkflow(json, filePath, folderName, source) {
  // Validate structure
  if (!json.nodes || !Array.isArray(json.nodes)) {
    if (CONFIG.debug) {
      console.warn(`  ⚠ Invalid structure: ${filePath}`);
    }
    return null;
  }

  const fileName = path.basename(filePath, '.json');
  const name = json.name || formatFileName(fileName);
  const id = generateHash(filePath);
  const slug = generateSlug(name, source, id);

  const category = determineCategory(json, folderName, source);
  const categoryMeta = getCategoryBySlug(category);

  const integrations = extractIntegrations(json);
  const description = extractDescription(json);
  const nodeTypes = extractNodeTypes(json);

  return {
    // Identifiers
    id,
    slug,

    // Basic info
    name,
    description: description.substring(0, 200),
    fullDescription: description,

    // Source & Quality
    source,
    quality: calculateQuality(json, fileName, source),
    sourceUrl: buildSourceUrl(filePath, source),

    // Category
    category,
    categoryName: categoryMeta.name,
    categoryIcon: categoryMeta.icon,

    // Tags & Search
    tags: extractTags(json, name, integrations),

    // Nodes
    nodes: nodeTypes,
    nodeCount: countNodes(json),

    // Integrations
    integrations: integrations.map(i => i.slug),
    integrationDetails: integrations,

    // Trigger
    triggerType: detectTriggerType(json),

    // Metadata
    filePath,
    createdAt: json.meta?.createdAt || json.createdAt || new Date().toISOString(),

    // Raw workflow (for downloads)
    workflow: json,
  };
}

/**
 * Parse awesome-n8n-templates repository
 */
async function parseAwesomeLibrary() {
  console.log('📂 Parsing awesome-n8n-templates...');

  if (!fs.existsSync(CONFIG.awesomeRoot)) {
    console.error(`  ❌ Directory not found: ${CONFIG.awesomeRoot}`);
    return [];
  }

  const workflows = [];
  const entries = fs.readdirSync(CONFIG.awesomeRoot, { withFileTypes: true });
  const folders = entries.filter(d => d.isDirectory() && !d.name.startsWith('.'));
  const tasks = [];

  for (const folder of folders) {
    const folderPath = path.join(CONFIG.awesomeRoot, folder.name);
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.json'));

    if (CONFIG.debug && files.length > 0) {
      console.log(`  📁 ${folder.name}: ${files.length} files`);
    }

    for (const file of files) {
      tasks.push({ filePath: path.join(folderPath, file), folder: folder.name });
    }
  }

  const rootJsonFiles = entries
    .filter(e => e.isFile() && e.name.endsWith('.json'))
    .map(e => ({ filePath: path.join(CONFIG.awesomeRoot, e.name), folder: 'Other' }));

  tasks.push(...rootJsonFiles);

  await runWithConcurrency(tasks, CONFIG.maxWorkers, async ({ filePath, folder }) => {
    const workflow = await loadWorkflowFromFile(filePath, folder, 'awesome');
    if (workflow) {
      workflows.push(workflow);
    }
  });

  console.log(`  ✅ Found ${workflows.length} workflows\n`);
  return workflows;
}

/**
 * Parse n8n-workflows repository
 */
async function parseCommunityLibrary() {
  console.log('📂 Parsing n8n-workflows...');

  if (!fs.existsSync(CONFIG.communityRoot)) {
    console.error(`  ❌ Directory not found: ${CONFIG.communityRoot}`);
    return [];
  }

  const workflows = [];
  const entries = fs.readdirSync(CONFIG.communityRoot, { withFileTypes: true });
  const folders = entries.filter(d => d.isDirectory());

  let processed = 0;
  let errors = 0;
  const tasks = [];

  for (const folder of folders) {
    const folderPath = path.join(CONFIG.communityRoot, folder.name);
    let files;
    try {
      files = fs.readdirSync(folderPath).filter(f => f.endsWith('.json'));
    } catch (err) {
      continue;
    }

    for (const file of files) {
      tasks.push({ filePath: path.join(folderPath, file), folder: folder.name });
    }
  }

  await runWithConcurrency(tasks, CONFIG.maxWorkers, async ({ filePath, folder }) => {
    const workflow = await loadWorkflowFromFile(filePath, folder, 'community');
    if (workflow) {
      workflows.push(workflow);
      processed++;
      if (processed % 500 === 0 && processed > 0) {
        process.stdout.write(`  📊 Processed ${processed} workflows...\r`);
      }
    } else {
      errors++;
    }
  });

  console.log(`  ✅ Found ${workflows.length} workflows (${errors} errors)\n`);
  return workflows;
}

// ============================================
// Output Generation
// ============================================

/**
 * Ensure output directories exist
 */
function ensureDirectories() {
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  if (!fs.existsSync(CONFIG.workflowsDir)) {
    fs.mkdirSync(CONFIG.workflowsDir, { recursive: true });
  }
}

async function loadWorkflowFromFile(filePath, folderName, source) {
  const relativePath = getRelativePath(filePath);
  try {
    const stats = await fsp.stat(filePath);
    if (CONFIG.since && stats.mtime < CONFIG.since) {
      const cached = getCachedWorkflow(relativePath);
      if (cached) {
        skippedBySince += 1;
        return cached;
      }
    }

    const content = await fsp.readFile(filePath, 'utf-8');
    const hash = hashContent(content);
    const cached = getCachedWorkflow(relativePath, hash);
    if (cached) {
      return cached;
    }

    const json = JSON.parse(content);
    const workflow = parseWorkflow(json, filePath, folderName, source);
    if (workflow) {
      cacheWorkflow(relativePath, hash, workflow);
    }
    return workflow;
  } catch (err) {
    console.error(`  ❌ Error parsing ${filePath}: ${err.message}`);
    return null;
  }
}

function writeJsonFile(filePath, data) {
  const content = CONFIG.pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  fs.writeFileSync(filePath, content);
}

async function runWithConcurrency(items, limit, iterator) {
  const queue = [...items];
  if (queue.length === 0) return;
  const workerCount = Math.max(1, Math.min(limit, queue.length));
  const workers = Array.from({ length: workerCount }, async () => {
    while (queue.length) {
      const item = queue.shift();
      if (!item) return;
      await iterator(item);
    }
  });
  await Promise.all(workers);
}

/**
 * Generate index.json (search index)
 */
function generateIndex(workflows) {
  const indexData = workflows.map(w => ({
    id: w.id,
    slug: w.slug,
    name: w.name,
    description: w.description,
    category: w.category,
    categoryName: w.categoryName,
    categoryIcon: w.categoryIcon,
    source: w.source,
    quality: w.quality,
    nodeCount: w.nodeCount,
    integrations: w.integrations,
    triggerType: w.triggerType,
    createdAt: w.createdAt,
  }));

  // Sort by quality (descending), then by source (awesome first)
  indexData.sort((a, b) => {
    if (b.quality !== a.quality) return b.quality - a.quality;
    if (a.source === 'awesome' && b.source !== 'awesome') return -1;
    if (a.source !== 'awesome' && b.source === 'awesome') return 1;
    return 0;
  });

  const outputPath = path.join(CONFIG.outputDir, 'index.json');
  writeJsonFile(outputPath, indexData);

  const sizeMB = (Buffer.byteLength(JSON.stringify(indexData)) / 1024 / 1024).toFixed(2);
  console.log(`  ✅ index.json: ${indexData.length} workflows (${sizeMB} MB)`);

  return indexData;
}

/**
 * Generate categories.json
 */
function generateCategories(workflows) {
  const counts = {};

  for (const w of workflows) {
    counts[w.category] = (counts[w.category] || 0) + 1;
  }

  const categories = CATEGORIES.map(cat => ({
    slug: cat.slug,
    name: cat.name,
    icon: cat.icon,
    color: cat.color,
    description: cat.description,
    count: counts[cat.slug] || 0,
  })).sort((a, b) => b.count - a.count);

  const outputPath = path.join(CONFIG.outputDir, 'categories.json');
  writeJsonFile(outputPath, categories);

  console.log(`  ✅ categories.json: ${categories.length} categories`);

  return categories;
}

/**
 * Generate integrations.json
 */
function generateIntegrations(workflows) {
  const integrationMap = new Map();

  for (const w of workflows) {
    for (const int of w.integrationDetails) {
      const key = int.slug;

      if (!integrationMap.has(key)) {
        integrationMap.set(key, {
          slug: int.slug,
          name: int.name,
          icon: int.icon,
          iconType: int.iconType,
          iconUrl: int.iconUrl,
          count: 0,
          categories: new Set(),
        });
      }

      const entry = integrationMap.get(key);
      entry.count++;
      entry.categories.add(w.category);
    }
  }

  // Convert to array and sort by count
  const allIntegrations = Array.from(integrationMap.values())
    .map(int => ({
      slug: int.slug,
      name: int.name,
      icon: int.icon,
      iconType: int.iconType,
      iconUrl: int.iconUrl,
      count: int.count,
      categories: Array.from(int.categories),
    }))
    .sort((a, b) => b.count - a.count);

  const topIntegrations = allIntegrations.slice(0, 150);

  const allPath = path.join(CONFIG.outputDir, 'integrations.json');
  const topPath = path.join(CONFIG.outputDir, 'integrations_top.json');
  writeJsonFile(allPath, allIntegrations);
  writeJsonFile(topPath, topIntegrations);

  console.log(
    `  ✅ integrations.json: ${allIntegrations.length} total · integrations_top.json: ${topIntegrations.length} featured`
  );

  return { allIntegrations, topIntegrations };
}

/**
 * Generate individual workflow detail files
 */
function generateWorkflowFiles(workflows) {
  let count = 0;

  for (const w of workflows) {
    const detailData = {
      id: w.id,
      slug: w.slug,
      name: w.name,
      description: w.fullDescription,
      source: w.source,
      quality: w.quality,
      sourceUrl: w.sourceUrl,
      category: w.category,
      categoryName: w.categoryName,
      categoryIcon: w.categoryIcon,
      tags: w.tags,
      nodes: w.nodes,
      nodeCount: w.nodeCount,
      integrations: w.integrationDetails,
      triggerType: w.triggerType,
      filePath: w.filePath,
      createdAt: w.createdAt,
      workflow: w.workflow,
    };

    const outputPath = path.join(CONFIG.workflowsDir, `${w.slug}.json`);
    writeJsonFile(outputPath, detailData);
    count++;

    // Progress
    if (count % 500 === 0) {
      process.stdout.write(`  📝 Generated ${count} workflow files...\r`);
    }
  }

  console.log(`  ✅ workflows/: ${count} individual files`);
  return count;
}

/**
 * Generate stats summary
 */
function generateStats(workflows, categories, integrations) {
  const stats = {
    total: workflows.length,
    bySource: {
      awesome: workflows.filter(w => w.source === 'awesome').length,
      community: workflows.filter(w => w.source === 'community').length,
    },
    byQuality: {
      5: workflows.filter(w => w.quality === 5).length,
      4: workflows.filter(w => w.quality === 4).length,
      3: workflows.filter(w => w.quality === 3).length,
      2: workflows.filter(w => w.quality === 2).length,
      1: workflows.filter(w => w.quality === 1).length,
    },
    byTrigger: {},
    categories: categories.length,
    integrations: integrations.length,
    avgNodesPerWorkflow: (workflows.reduce((sum, w) => sum + w.nodeCount, 0) / workflows.length).toFixed(1),
    generatedAt: new Date().toISOString(),
  };

  // Count by trigger type
  workflows.forEach(w => {
    stats.byTrigger[w.triggerType] = (stats.byTrigger[w.triggerType] || 0) + 1;
  });

  const outputPath = path.join(CONFIG.outputDir, 'stats.json');
  writeJsonFile(outputPath, stats);

  return stats;
}

function createMetaPayload({
  workflowCount,
  workflowFileCount,
  indexData,
  categories,
  integrations,
  topIntegrations,
  stats,
  finishedAt,
}) {
  const datasetHash = hashContent(JSON.stringify(indexData));
  const cacheMisses = Math.max(workflowCount - cacheHits, 0);
  return {
    version: 1,
    datasetHash,
    startedAt: new Date(startTime).toISOString(),
    generatedAt: finishedAt.toISOString(),
    durationMs: finishedAt.getTime() - startTime,
    cli: {
      force: CONFIG.force,
      since: CONFIG.since ? CONFIG.since.toISOString() : null,
      maxWorkers: CONFIG.maxWorkers,
      pretty: CONFIG.pretty,
      source: CONFIG.sourceFilter,
    },
    cache: {
      manifestPath: path.relative(process.cwd(), MANIFEST_PATH),
      manifestEntries: Object.keys(manifestEntries).length,
      manifestUpdatedAt,
      hits: cacheHits,
      misses: cacheMisses,
      skippedBySince,
      usedSinceFilter: Boolean(CONFIG.since),
      revalidate: null,
    },
    counts: {
      workflows: workflowCount,
      workflowFiles: workflowFileCount,
      categories: categories.length,
      integrations: integrations.length,
      featuredIntegrations: topIntegrations.length,
    },
    stats,
    sources: {
      awesome: getRepoInfo('awesome-n8n', CONFIG.awesomeRoot),
      community: getRepoInfo('n8n-workflows', CONFIG.communityRepoRoot || CONFIG.communityRoot),
    },
    files: {
      index: path.relative(process.cwd(), path.join(CONFIG.outputDir, 'index.json')),
      categories: path.relative(process.cwd(), path.join(CONFIG.outputDir, 'categories.json')),
      integrations: path.relative(process.cwd(), path.join(CONFIG.outputDir, 'integrations.json')),
      integrationsTop: path.relative(process.cwd(), path.join(CONFIG.outputDir, 'integrations_top.json')),
      workflowsDir: path.relative(process.cwd(), CONFIG.workflowsDir),
    },
  };
}

async function triggerCacheRevalidation(metaPayload) {
  if (!CONFIG.revalidateUrl) return null;
  if (typeof fetch !== 'function') {
    console.warn('  ⚠ Cannot trigger cache revalidation: fetch API unavailable in this runtime');
    return null;
  }
  console.log('🔁 Triggering workflows-data cache revalidation...');

  try {
    const response = await fetch(CONFIG.revalidateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(CONFIG.revalidateToken ? { Authorization: `Bearer ${CONFIG.revalidateToken}` } : {}),
      },
      body: JSON.stringify({
        tag: 'workflows-data',
        datasetHash: metaPayload.datasetHash,
      }),
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(body.error || `HTTP ${response.status}`);
    }

    console.log('  ✅ Next.js cache revalidation requested');
    return {
      success: true,
      status: response.status,
      timestamp: new Date().toISOString(),
      url: CONFIG.revalidateUrl,
      body,
    };
  } catch (error) {
    console.warn('  ⚠ Failed to trigger cache revalidation:', error.message);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      url: CONFIG.revalidateUrl,
    };
  }
}

/**
 * Print summary statistics
 */
function printSummary(stats, meta) {
  console.log('\n📈 ETL Summary');
  console.log('═'.repeat(50));
  console.log(`Total Workflows: ${stats.total}`);
  console.log(`  - Awesome (curated): ${stats.bySource.awesome}`);
  console.log(`  - Community: ${stats.bySource.community}`);
  console.log('');
  console.log('Quality Distribution:');
  console.log(`  ★★★★★ (5): ${stats.byQuality[5]}`);
  console.log(`  ★★★★☆ (4): ${stats.byQuality[4]}`);
  console.log(`  ★★★☆☆ (3): ${stats.byQuality[3]}`);
  console.log(`  ★★☆☆☆ (2): ${stats.byQuality[2]}`);
  console.log(`  ★☆☆☆☆ (1): ${stats.byQuality[1]}`);
  console.log('');
  console.log('Trigger Types:');
  Object.entries(stats.byTrigger)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
  console.log('');
  console.log(`Categories: ${stats.categories}`);
  console.log(`Unique Integrations: ${stats.integrations}`);
  console.log(`Avg Nodes/Workflow: ${stats.avgNodesPerWorkflow}`);
  console.log('');
  console.log(`Cache hits: ${cacheHits}`);
  if (CONFIG.since) {
    console.log(`  └─ reused via --since cutoff: ${skippedBySince}`);
  }
  if (meta) {
    console.log('');
    console.log(`Dataset hash: ${meta.datasetHash}`);
    console.log(`Manifest entries: ${meta.cache.manifestEntries}`);
    console.log(`Meta duration: ${(meta.durationMs / 1000).toFixed(2)}s`);
    if (meta.cache.revalidate) {
      console.log(
        `Revalidate: ${meta.cache.revalidate.success ? 'OK' : 'FAILED'} ${meta.cache.revalidate.url || ''}`
      );
    }
  }
  console.log('═'.repeat(50));
}

// ============================================
// Main Execution
// ============================================

async function main() {
  console.log('🚀 n8n Library ETL Pipeline');
  console.log('═'.repeat(50));
  console.log(`Source filter: ${CONFIG.sourceFilter}`);
  console.log(`Debug mode: ${CONFIG.debug ? 'ON' : 'OFF'}`);
  console.log('═'.repeat(50));
  console.log('');

  // Ensure directories
  ensureDirectories();

  // Parse data sources
  let workflows = [];

  if (CONFIG.sourceFilter === 'all' || CONFIG.sourceFilter === 'awesome') {
    const awesomeWorkflows = await parseAwesomeLibrary();
    workflows = workflows.concat(awesomeWorkflows);
  }

  if (CONFIG.sourceFilter === 'all' || CONFIG.sourceFilter === 'community') {
    const communityWorkflows = await parseCommunityLibrary();
    workflows = workflows.concat(communityWorkflows);
  }

  if (workflows.length === 0) {
    console.error('❌ No workflows found! Check data source paths.');
    process.exit(1);
  }

  console.log(`📊 Total workflows to process: ${workflows.length}\n`);

  // Generate outputs
  console.log('📝 Generating output files...');
  const indexData = generateIndex(workflows);
  const categories = generateCategories(workflows);
  const { allIntegrations, topIntegrations } = generateIntegrations(workflows);
  const workflowFileCount = generateWorkflowFiles(workflows);

  // Generate and print stats
  const stats = generateStats(workflows, categories, allIntegrations);

  // Persist manifest + meta
  saveManifest();
  const finishedAt = new Date();
  const metaPayload = createMetaPayload({
    workflowCount: workflows.length,
    workflowFileCount,
    indexData,
    categories,
    integrations: allIntegrations,
    topIntegrations,
    stats,
    finishedAt,
  });
  const revalidateInfo = await triggerCacheRevalidation(metaPayload);
  if (revalidateInfo) {
    metaPayload.cache.revalidate = revalidateInfo;
  }
  const metaPath = path.join(CONFIG.outputDir, 'meta.json');
  writeJsonFile(metaPath, metaPayload);
  console.log(`  ✅ meta.json written (hash ${metaPayload.datasetHash})`);

  printSummary(stats, metaPayload);

  console.log('\n✅ ETL Pipeline Complete!');
  console.log(`📁 Output: ${CONFIG.outputDir}`);
}

// Run
main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
