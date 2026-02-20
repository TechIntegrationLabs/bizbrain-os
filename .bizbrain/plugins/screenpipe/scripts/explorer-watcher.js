#!/usr/bin/env node
/**
 * Explorer Watcher — Tier 2
 *
 * Background Node.js process that monitors:
 * - File changes in the Brain folder (_intake-dump/)
 * - Clipboard content (polled every 30s)
 *
 * Only captures business-relevant content: URLs, emails, dollar amounts,
 * names, project references.
 *
 * Managed via PID file. Auto-starts via session-start hook.
 *
 * Usage:
 *   node explorer-watcher.js start   — Start watching (background)
 *   node explorer-watcher.js stop    — Stop watching
 *   node explorer-watcher.js status  — Check if running
 */

const { watch, existsSync, readFileSync } = require('fs');
const { readFile, writeFile, readdir, mkdir, unlink } = require('fs/promises');
const { join, basename, extname } = require('path');
const { execSync } = require('child_process');
const { platform } = require('os');

const BIZBRAIN_ROOT = process.env.BIZBRAIN_ROOT || process.cwd();
const LEARNING_DIR = join(BIZBRAIN_ROOT, '.bizbrain', 'learning', 'explorer');
const PID_FILE = join(BIZBRAIN_ROOT, '.bizbrain', 'learning', 'explorer.pid');
const PENDING_FILE = join(BIZBRAIN_ROOT, '.bizbrain', 'learning', 'pending-insights.json');
const INTAKE_DIR = join(BIZBRAIN_ROOT, '_intake-dump');

const CLIPBOARD_INTERVAL = 30000; // 30 seconds
const RELEVANCE_PATTERNS = [
  /[\w.-]+@[\w.-]+\.\w+/,              // Email
  /\$[\d,]+(?:\.\d{2})?/,              // Dollar amount
  /https?:\/\/[^\s]+/,                  // URL
  /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/, // Phone
  /(?:deadline|due|meeting|call|invoice|proposal|contract)/i,     // Business keywords
];

let clipboardHistory = new Set();
let watchers = [];

/**
 * Check if content is business-relevant
 */
function isRelevant(text) {
  if (!text || text.length < 10 || text.length > 10000) return false;
  return RELEVANCE_PATTERNS.some(p => p.test(text));
}

/**
 * Get clipboard content (platform-specific)
 */
function getClipboard() {
  try {
    const os = platform();
    if (os === 'darwin') {
      return execSync('pbpaste', { encoding: 'utf8', timeout: 5000 });
    } else if (os === 'win32') {
      return execSync('powershell -command "Get-Clipboard"', { encoding: 'utf8', timeout: 5000 });
    } else {
      // Linux — try xclip, then xsel
      try {
        return execSync('xclip -selection clipboard -o', { encoding: 'utf8', timeout: 5000 });
      } catch {
        return execSync('xsel --clipboard --output', { encoding: 'utf8', timeout: 5000 });
      }
    }
  } catch {
    return null;
  }
}

/**
 * Save a captured item
 */
async function saveCapture(type, content, source) {
  if (!existsSync(LEARNING_DIR)) {
    await mkdir(LEARNING_DIR, { recursive: true });
  }

  const today = new Date().toISOString().split('T')[0];
  const logFile = join(LEARNING_DIR, `${today}.json`);

  let log = { date: today, captures: [] };
  if (existsSync(logFile)) {
    try {
      log = JSON.parse(await readFile(logFile, 'utf8'));
    } catch {}
  }

  log.captures.push({
    type,
    source,
    content: content.slice(0, 2000), // Limit stored size
    capturedAt: new Date().toISOString(),
  });

  await writeFile(logFile, JSON.stringify(log, null, 2));

  // Add to pending insights
  await addInsight(type, content, source);
}

async function addInsight(type, content, source) {
  let pending = { insights: [], lastUpdatedAt: null };
  if (existsSync(PENDING_FILE)) {
    try {
      pending = JSON.parse(await readFile(PENDING_FILE, 'utf8'));
    } catch {}
  }

  const summary = type === 'clipboard'
    ? `Clipboard captured: ${content.slice(0, 80)}...`
    : `New file in intake: ${source}`;

  pending.insights.push({
    type: `explorer-${type}`,
    summary,
    source,
    createdAt: new Date().toISOString(),
  });

  pending.lastUpdatedAt = new Date().toISOString();
  await writeFile(PENDING_FILE, JSON.stringify(pending, null, 2));
}

/**
 * Watch _intake-dump/ for new files
 */
function watchIntake() {
  if (!existsSync(INTAKE_DIR)) return;

  const watcher = watch(INTAKE_DIR, { recursive: true }, async (eventType, filename) => {
    if (eventType !== 'rename' || !filename) return;

    const filePath = join(INTAKE_DIR, filename);
    if (!existsSync(filePath)) return;

    const ext = extname(filename).toLowerCase();
    if (!['.txt', '.md', '.json', '.csv', '.pdf'].includes(ext)) return;

    console.log(`[Explorer] New file detected: ${filename}`);

    try {
      if (ext === '.pdf') {
        await saveCapture('file', `New PDF: ${filename}`, filename);
      } else {
        const content = await readFile(filePath, 'utf8');
        if (isRelevant(content)) {
          await saveCapture('file', content.slice(0, 2000), filename);
        }
      }
    } catch (err) {
      console.error(`[Explorer] Error processing ${filename}:`, err.message);
    }
  });

  watchers.push(watcher);
  console.log(`[Explorer] Watching: ${INTAKE_DIR}`);
}

/**
 * Poll clipboard for business-relevant content
 */
function startClipboardPolling() {
  const interval = setInterval(() => {
    const content = getClipboard();
    if (!content) return;

    // Skip if we've seen this content before
    const hash = content.slice(0, 200);
    if (clipboardHistory.has(hash)) return;
    clipboardHistory.add(hash);

    // Keep history manageable
    if (clipboardHistory.size > 100) {
      const arr = [...clipboardHistory];
      clipboardHistory = new Set(arr.slice(-50));
    }

    if (isRelevant(content)) {
      console.log(`[Explorer] Relevant clipboard captured (${content.length} chars)`);
      saveCapture('clipboard', content, 'clipboard').catch(() => {});
    }
  }, CLIPBOARD_INTERVAL);

  return interval;
}

/**
 * Write PID file
 */
async function writePid() {
  if (!existsSync(join(BIZBRAIN_ROOT, '.bizbrain', 'learning'))) {
    await mkdir(join(BIZBRAIN_ROOT, '.bizbrain', 'learning'), { recursive: true });
  }
  await writeFile(PID_FILE, String(process.pid));
}

/**
 * Check if already running
 */
function isRunning() {
  if (!existsSync(PID_FILE)) return false;
  try {
    const pid = parseInt(readFileSync(PID_FILE, 'utf8').trim());
    process.kill(pid, 0); // Check if process exists
    return true;
  } catch {
    return false;
  }
}

/**
 * Stop the watcher
 */
async function stop() {
  if (!existsSync(PID_FILE)) {
    console.log('[Explorer] Not running.');
    return;
  }

  try {
    const pid = parseInt(await readFile(PID_FILE, 'utf8'));
    process.kill(pid, 'SIGTERM');
    await unlink(PID_FILE);
    console.log(`[Explorer] Stopped (PID ${pid}).`);
  } catch (err) {
    console.log('[Explorer] Already stopped.');
    if (existsSync(PID_FILE)) await unlink(PID_FILE);
  }
}

/**
 * Main
 */
async function main() {
  const command = process.argv[2] || 'start';

  if (command === 'stop') {
    await stop();
    return;
  }

  if (command === 'status') {
    console.log(isRunning() ? '[Explorer] Running.' : '[Explorer] Not running.');
    return;
  }

  if (command === 'start') {
    if (isRunning()) {
      console.log('[Explorer] Already running.');
      return;
    }

    await writePid();
    console.log(`[Explorer] Starting (PID ${process.pid})...`);

    watchIntake();
    const clipboardInterval = startClipboardPolling();

    // Graceful shutdown
    const cleanup = async () => {
      console.log('\n[Explorer] Shutting down...');
      clearInterval(clipboardInterval);
      watchers.forEach(w => w.close());
      if (existsSync(PID_FILE)) await unlink(PID_FILE);
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    console.log('[Explorer] Watching for business-relevant content...');
    console.log('[Explorer] Press Ctrl+C to stop.');
  }
}

main().catch(err => {
  console.error('[Explorer] Error:', err.message);
  process.exit(1);
});
