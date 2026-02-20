#!/usr/bin/env node
/**
 * Observer Extract — Tier 1 (Default)
 *
 * Reads the most recent Claude Code session transcript and extracts
 * business-relevant observations: entities, project updates, tools,
 * decisions, action items.
 *
 * Triggered by: session-end-learn.sh hook
 * Output: .bizbrain/learning/observations/YYYY-MM-DD.json
 */

const { readFile, writeFile, readdir, mkdir } = require('fs/promises');
const { existsSync, statSync } = require('fs');
const { join, basename } = require('path');
const { homedir } = require('os');

const BIZBRAIN_ROOT = process.env.BIZBRAIN_ROOT || process.cwd();
const LEARNING_DIR = join(BIZBRAIN_ROOT, '.bizbrain', 'learning', 'observations');
const PENDING_FILE = join(BIZBRAIN_ROOT, '.bizbrain', 'learning', 'pending-insights.json');

// Patterns to detect business-relevant content
const PATTERNS = {
  entities: {
    // Company/person names often follow these patterns
    clientMention: /(?:client|customer|partner|vendor)\s+(?:named?|called?|:)\s+"?([A-Z][a-zA-Z\s]+)"?/gi,
    emailAddress: /[\w.-]+@[\w.-]+\.\w+/g,
    phoneNumber: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    dollarAmount: /\$[\d,]+(?:\.\d{2})?/g,
    url: /https?:\/\/[^\s<>"]+/g,
  },
  projects: {
    projectRef: /(?:project|repo|repository)\s+(?:named?|called?|:)\s+"?([A-Za-z][\w-]+)"?/gi,
    gitBranch: /(?:branch|checkout)\s+(?:to\s+)?([a-zA-Z][\w/-]+)/gi,
    deployment: /(?:deploy|deployed|deploying)\s+(?:to\s+)?(\w+)/gi,
  },
  decisions: {
    decided: /(?:decided|choosing|going with|selected|picked)\s+(.+?)(?:\.|$)/gim,
    todo: /(?:TODO|FIXME|HACK|need to|should|must)\s*:?\s*(.+?)(?:\.|$)/gim,
  },
  tools: {
    npmPackage: /(?:npm|pnpm|yarn|bun)\s+(?:install|add|i)\s+([\w@/-]+)/g,
    apiKey: /(?:API_KEY|SECRET|TOKEN|CREDENTIAL)\w*/g,
    service: /(?:using|integrated?|connected?)\s+(?:with\s+)?(\w+(?:\s+\w+)?)\s+(?:API|service|platform)/gi,
  },
};

/**
 * Extract observations from a session transcript
 */
function extractObservations(text) {
  const observations = {
    entities: [],
    projects: [],
    decisions: [],
    tools: [],
    amounts: [],
    urls: [],
    actionItems: [],
  };

  // Extract entities
  for (const [key, pattern] of Object.entries(PATTERNS.entities)) {
    const matches = [...text.matchAll(pattern)];
    matches.forEach(m => {
      const value = m[1] || m[0];
      if (!observations.entities.find(e => e.value === value)) {
        observations.entities.push({ type: key, value, context: getContext(text, m.index) });
      }
    });
  }

  // Extract project references
  for (const [key, pattern] of Object.entries(PATTERNS.projects)) {
    const matches = [...text.matchAll(pattern)];
    matches.forEach(m => {
      observations.projects.push({ type: key, value: m[1], context: getContext(text, m.index) });
    });
  }

  // Extract decisions
  for (const [key, pattern] of Object.entries(PATTERNS.decisions)) {
    const matches = [...text.matchAll(pattern)];
    matches.forEach(m => {
      if (key === 'todo') {
        observations.actionItems.push({ text: m[1].trim(), context: getContext(text, m.index) });
      } else {
        observations.decisions.push({ text: m[1].trim(), context: getContext(text, m.index) });
      }
    });
  }

  // Extract tools/services
  for (const [key, pattern] of Object.entries(PATTERNS.tools)) {
    const matches = [...text.matchAll(pattern)];
    matches.forEach(m => {
      observations.tools.push({ type: key, value: m[1] || m[0], context: getContext(text, m.index) });
    });
  }

  // Deduplicate
  observations.entities = dedup(observations.entities, 'value');
  observations.projects = dedup(observations.projects, 'value');
  observations.tools = dedup(observations.tools, 'value');

  return observations;
}

function getContext(text, index, radius = 100) {
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + radius);
  return text.slice(start, end).replace(/\n/g, ' ').trim();
}

function dedup(arr, key) {
  const seen = new Set();
  return arr.filter(item => {
    const val = item[key]?.toLowerCase();
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

/**
 * Find the most recent session transcript
 */
async function findLatestTranscript() {
  const projectsDir = join(homedir(), '.claude', 'projects');
  if (!existsSync(projectsDir)) return null;

  const folders = await readdir(projectsDir);
  let latestFile = null;
  let latestTime = 0;

  for (const folder of folders) {
    const folderPath = join(projectsDir, folder);
    try {
      const files = await readdir(folderPath);
      for (const file of files) {
        if (!file.endsWith('.jsonl')) continue;
        const filePath = join(folderPath, file);
        const { mtimeMs } = statSync(filePath);
        if (mtimeMs > latestTime) {
          latestTime = mtimeMs;
          latestFile = filePath;
        }
      }
    } catch {
      continue;
    }
  }

  return latestFile;
}

/**
 * Add observations to pending insights
 */
async function addToPending(observations, source) {
  let pending = { insights: [], lastUpdatedAt: null };

  if (existsSync(PENDING_FILE)) {
    try {
      pending = JSON.parse(await readFile(PENDING_FILE, 'utf8'));
    } catch {}
  }

  const now = new Date().toISOString();
  const newInsights = [];

  // Convert observations to insights
  if (observations.entities.length > 0) {
    newInsights.push({
      type: 'entities-detected',
      summary: `Detected ${observations.entities.length} entity mention(s)`,
      details: observations.entities.slice(0, 5),
      source,
      createdAt: now,
    });
  }

  if (observations.decisions.length > 0) {
    newInsights.push({
      type: 'decisions-made',
      summary: `${observations.decisions.length} decision(s) noted`,
      details: observations.decisions.slice(0, 5),
      source,
      createdAt: now,
    });
  }

  if (observations.actionItems.length > 0) {
    newInsights.push({
      type: 'action-items',
      summary: `${observations.actionItems.length} action item(s) found`,
      details: observations.actionItems.slice(0, 5),
      source,
      createdAt: now,
    });
  }

  if (observations.tools.length > 0) {
    newInsights.push({
      type: 'tools-used',
      summary: `${observations.tools.length} tool/service reference(s)`,
      details: observations.tools.slice(0, 5),
      source,
      createdAt: now,
    });
  }

  pending.insights = [...(pending.insights || []), ...newInsights];
  pending.lastUpdatedAt = now;

  await writeFile(PENDING_FILE, JSON.stringify(pending, null, 2));
  return newInsights.length;
}

/**
 * Main execution
 */
async function main() {
  console.log('[Observer] Extracting observations from latest session...');

  const transcriptPath = await findLatestTranscript();
  if (!transcriptPath) {
    console.log('[Observer] No session transcript found.');
    return;
  }

  console.log(`[Observer] Reading: ${basename(transcriptPath)}`);

  const raw = await readFile(transcriptPath, 'utf8');
  // JSONL — extract user/assistant text content
  const lines = raw.split('\n').filter(Boolean);
  const textParts = [];

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (entry.type === 'user' || entry.type === 'assistant') {
        const content = typeof entry.content === 'string'
          ? entry.content
          : Array.isArray(entry.content)
            ? entry.content.filter(c => c.type === 'text').map(c => c.text).join('\n')
            : '';
        if (content) textParts.push(content);
      }
    } catch {
      continue;
    }
  }

  const fullText = textParts.join('\n\n');
  if (fullText.length < 100) {
    console.log('[Observer] Session too short, skipping.');
    return;
  }

  const observations = extractObservations(fullText);
  const total = Object.values(observations).reduce((sum, arr) => sum + arr.length, 0);

  if (total === 0) {
    console.log('[Observer] No notable observations found.');
    return;
  }

  // Save daily observation file
  if (!existsSync(LEARNING_DIR)) {
    await mkdir(LEARNING_DIR, { recursive: true });
  }

  const today = new Date().toISOString().split('T')[0];
  const outputPath = join(LEARNING_DIR, `${today}.json`);

  let existing = { date: today, sessions: [] };
  if (existsSync(outputPath)) {
    try {
      existing = JSON.parse(await readFile(outputPath, 'utf8'));
    } catch {}
  }

  existing.sessions.push({
    source: basename(transcriptPath),
    extractedAt: new Date().toISOString(),
    observations,
  });

  await writeFile(outputPath, JSON.stringify(existing, null, 2));

  // Add to pending insights
  const insightCount = await addToPending(observations, basename(transcriptPath));

  console.log(`[Observer] Extracted: ${observations.entities.length} entities, ${observations.projects.length} projects, ${observations.decisions.length} decisions, ${observations.actionItems.length} action items, ${observations.tools.length} tools`);
  console.log(`[Observer] ${insightCount} new insight(s) added to pending.`);
}

main().catch(err => {
  console.error('[Observer] Error:', err.message);
  process.exit(1);
});
