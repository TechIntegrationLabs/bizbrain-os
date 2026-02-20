#!/usr/bin/env node
/**
 * BizBrain Learner Pipe — Tier 3 (Full Context)
 *
 * Screenpipe custom pipe that runs every 30 minutes.
 * Queries the local Screenpipe API for recent screen text,
 * filters for business relevance, and writes structured data
 * to .bizbrain/learning/screenpipe/
 *
 * Requires: Screenpipe running locally on port 3030
 *
 * This pipe integrates with Screenpipe's pipe system.
 * Install: screenpipe pipe install ./bizbrain-learner
 */

const { readFile, writeFile, mkdir } = require('fs/promises');
const { existsSync } = require('fs');
const { join } = require('path');

const BIZBRAIN_ROOT = process.env.BIZBRAIN_ROOT || process.cwd();
const SCREENPIPE_API = process.env.SCREENPIPE_API || 'http://localhost:3030';
const LEARNING_DIR = join(BIZBRAIN_ROOT, '.bizbrain', 'learning', 'screenpipe');
const PENDING_FILE = join(BIZBRAIN_ROOT, '.bizbrain', 'learning', 'pending-insights.json');
const RUN_INTERVAL = 30 * 60 * 1000; // 30 minutes

// Business relevance keywords
const BUSINESS_KEYWORDS = [
  'invoice', 'proposal', 'contract', 'meeting', 'deadline', 'payment',
  'client', 'project', 'deploy', 'release', 'budget', 'estimate',
  'revenue', 'expense', 'milestone', 'sprint', 'roadmap', 'strategy',
  'partner', 'vendor', 'customer', 'lead', 'prospect', 'deal',
  'github.com', 'slack', 'notion', 'jira', 'figma', 'vercel',
  'supabase', 'stripe', 'openai', 'anthropic',
];

const NOISE_PATTERNS = [
  /cookie\s*(?:consent|notice|policy)/i,
  /accept\s*(?:all|cookies)/i,
  /privacy\s*policy/i,
  /terms\s*(?:of|and)\s*(?:service|use)/i,
  /subscribe\s*(?:to\s*)?(?:our\s*)?newsletter/i,
  /sign\s*(?:up|in)\s*(?:for|with)/i,
];

/**
 * Query Screenpipe for recent screen content
 */
async function queryScreenpipe(minutesBack = 30) {
  const startTime = new Date(Date.now() - minutesBack * 60 * 1000).toISOString();

  try {
    const resp = await fetch(`${SCREENPIPE_API}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content_type: 'ocr',
        start_time: startTime,
        limit: 100,
        min_length: 50,
      }),
    });

    if (!resp.ok) {
      throw new Error(`Screenpipe API returned ${resp.status}`);
    }

    const data = await resp.json();
    return data.data || [];
  } catch (err) {
    if (err.cause?.code === 'ECONNREFUSED') {
      console.log('[Learner] Screenpipe not running on port 3030.');
      return [];
    }
    throw err;
  }
}

/**
 * Filter for business-relevant content
 */
function filterRelevant(entries) {
  return entries.filter(entry => {
    const text = (entry.content?.text || entry.text || '').toLowerCase();

    // Skip noise
    if (NOISE_PATTERNS.some(p => p.test(text))) return false;

    // Check for business keywords
    return BUSINESS_KEYWORDS.some(kw => text.includes(kw.toLowerCase()));
  });
}

/**
 * Extract structured data from screen text
 */
function extractStructured(text) {
  const data = {
    emails: [...new Set(text.match(/[\w.-]+@[\w.-]+\.\w+/g) || [])],
    urls: [...new Set(text.match(/https?:\/\/[^\s<>"]+/g) || [])],
    amounts: [...new Set(text.match(/\$[\d,]+(?:\.\d{2})?/g) || [])],
    dates: [...new Set(text.match(/\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/g) || [])],
    apps: [],
  };

  // Detect which apps/services are visible
  const appPatterns = {
    'GitHub': /github\.com/i,
    'Slack': /slack/i,
    'Notion': /notion\.so/i,
    'VS Code': /visual studio code|vscode/i,
    'Figma': /figma\.com/i,
    'Stripe': /stripe\.com|dashboard\.stripe/i,
    'Vercel': /vercel\.com/i,
    'Gmail': /mail\.google|gmail/i,
  };

  for (const [app, pattern] of Object.entries(appPatterns)) {
    if (pattern.test(text)) data.apps.push(app);
  }

  return data;
}

/**
 * Save observations and add to pending insights
 */
async function saveObservations(observations) {
  if (!existsSync(LEARNING_DIR)) {
    await mkdir(LEARNING_DIR, { recursive: true });
  }

  const today = new Date().toISOString().split('T')[0];
  const outputPath = join(LEARNING_DIR, `${today}.json`);

  let daily = { date: today, scans: [] };
  if (existsSync(outputPath)) {
    try {
      daily = JSON.parse(await readFile(outputPath, 'utf8'));
    } catch {}
  }

  daily.scans.push({
    scannedAt: new Date().toISOString(),
    entries: observations.length,
    structured: observations.map(o => o.structured),
    summaries: observations.map(o => o.summary),
  });

  await writeFile(outputPath, JSON.stringify(daily, null, 2));

  // Add to pending insights
  let pending = { insights: [], lastUpdatedAt: null };
  if (existsSync(PENDING_FILE)) {
    try {
      pending = JSON.parse(await readFile(PENDING_FILE, 'utf8'));
    } catch {}
  }

  if (observations.length > 0) {
    const apps = [...new Set(observations.flatMap(o => o.structured.apps))];
    pending.insights.push({
      type: 'screenpipe-scan',
      summary: `Screen scan: ${observations.length} relevant frames. Apps: ${apps.join(', ') || 'unknown'}`,
      details: {
        entryCount: observations.length,
        apps,
        urls: [...new Set(observations.flatMap(o => o.structured.urls))].slice(0, 10),
        amounts: [...new Set(observations.flatMap(o => o.structured.amounts))],
      },
      createdAt: new Date().toISOString(),
    });
    pending.lastUpdatedAt = new Date().toISOString();
    await writeFile(PENDING_FILE, JSON.stringify(pending, null, 2));
  }
}

/**
 * Single scan run
 */
async function runScan() {
  console.log(`[Learner] Scanning screen content...`);

  const entries = await queryScreenpipe(30);
  if (entries.length === 0) {
    console.log('[Learner] No screen content to analyze.');
    return;
  }

  console.log(`[Learner] Found ${entries.length} OCR entries, filtering...`);
  const relevant = filterRelevant(entries);
  console.log(`[Learner] ${relevant.length} business-relevant entries.`);

  if (relevant.length === 0) return;

  const observations = relevant.map(entry => {
    const text = entry.content?.text || entry.text || '';
    return {
      app: entry.app_name || 'unknown',
      timestamp: entry.timestamp,
      summary: text.slice(0, 200),
      structured: extractStructured(text),
    };
  });

  await saveObservations(observations);
  console.log(`[Learner] Saved ${observations.length} observations.`);
}

/**
 * Main — run once or as a loop
 */
async function main() {
  const mode = process.argv[2] || 'once';

  if (mode === 'once') {
    await runScan();
    return;
  }

  if (mode === 'loop') {
    console.log(`[Learner] Starting loop (every ${RUN_INTERVAL / 60000} min)...`);
    await runScan();
    setInterval(runScan, RUN_INTERVAL);
  }
}

main().catch(err => {
  console.error('[Learner] Error:', err.message);
  process.exit(1);
});
