const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

const PORT = 5555;
const ROOT = path.resolve(__dirname);
const PUBLIC = path.join(ROOT, 'public');
const BRAIN = path.resolve(ROOT, '..', '..');
const BIZBRAIN = path.resolve(ROOT, '..');
const STATE_FILE = path.join(BIZBRAIN, 'wizard', 'state.json');
const CONFIG_FILE = path.join(BRAIN, 'config.json');
const CONFIG_TEMPLATE = path.join(BRAIN, 'config.template.json');
const VOICE_BUFFER = path.join(BIZBRAIN, 'wizard', 'voice-buffer.txt');

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
};

const sseClients = new Set();

// Watch state.json for changes and push SSE
function watchState() {
  const dir = path.dirname(STATE_FILE);
  if (!fs.existsSync(dir)) return;
  try {
    fs.watch(dir, (eventType, filename) => {
      if (filename === 'state.json') {
        const data = readJSON(STATE_FILE);
        if (data) broadcast({ type: 'state', data });
      }
    });
  } catch (_) { /* ignore watch errors */ }
}

function broadcast(msg) {
  const payload = `data: ${JSON.stringify(msg)}\n\n`;
  for (const res of sseClients) {
    try { res.write(payload); } catch (_) { sseClients.delete(res); }
  }
}

function readJSON(filepath) {
  try { return JSON.parse(fs.readFileSync(filepath, 'utf-8')); } catch (_) { return null; }
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch (_) { resolve({}); } });
  });
}

function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

function getModules() {
  const modules = [];
  const dirs = [
    path.join(BIZBRAIN, 'modules'),
    path.join(BIZBRAIN, 'modules', '_core'),
  ];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('.json')) {
        const data = readJSON(path.join(dir, f));
        if (data) modules.push({ ...data, _file: f, _core: dir.endsWith('_core') });
      }
    }
  }
  return modules;
}

function checkCommand(cmd) {
  return new Promise((resolve) => {
    exec(`${cmd} --version`, (err, stdout) => resolve(err ? null : stdout.trim()));
  });
}

async function handleAPI(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const route = url.pathname;

  if (route === '/api/events' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache',
      'Connection': 'keep-alive', 'Access-Control-Allow-Origin': '*',
    });
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  if (route === '/api/state' && req.method === 'GET') {
    const state = readJSON(STATE_FILE) || { phase: 'init', modules: {}, completedModules: [], currentModule: null };
    return json(res, state);
  }

  if (route === '/api/config' && req.method === 'GET') {
    const config = readJSON(CONFIG_FILE) || readJSON(CONFIG_TEMPLATE) || {};
    return json(res, config);
  }

  if (route === '/api/modules' && req.method === 'GET') {
    return json(res, getModules());
  }

  if (route === '/api/health' && req.method === 'GET') {
    const [claude, node, git] = await Promise.all([
      checkCommand('claude'), checkCommand('node'), checkCommand('git'),
    ]);
    return json(res, {
      claude: !!claude, claudeVersion: claude,
      node: !!node, nodeVersion: node,
      git: !!git, gitVersion: git,
      platform: os.platform(), arch: os.arch(),
      uptime: os.uptime(), freeMemory: os.freemem(),
    });
  }

  if (route === '/api/launch-terminal' && req.method === 'POST') {
    const platform = os.platform();
    let cmd;
    if (platform === 'win32') {
      cmd = `start wt -d "${BRAIN}" cmd /k claude 2>nul || start cmd /k "cd /d "${BRAIN}" && claude"`;
    } else if (platform === 'darwin') {
      cmd = `osascript -e 'tell app "Terminal" to do script "cd \\"${BRAIN}\\" && claude"'`;
    } else {
      cmd = `x-terminal-emulator -e "cd '${BRAIN}' && claude" || gnome-terminal -- bash -c "cd '${BRAIN}' && claude; exec bash"`;
    }
    exec(cmd, (err) => {
      if (err) return json(res, { ok: false, error: err.message }, 500);
      json(res, { ok: true });
    });
    return;
  }

  if (route === '/api/launch-module' && req.method === 'POST') {
    const { module: mod } = await readBody(req);
    if (!mod) return json(res, { error: 'module required' }, 400);
    const platform = os.platform();
    const prompt = `Run /setup-module ${mod}`;
    let cmd;
    if (platform === 'win32') {
      cmd = `start wt -d "${BRAIN}" cmd /k claude --prompt "${prompt}" 2>nul || start cmd /k "cd /d "${BRAIN}" && claude --prompt "${prompt}"`;
    } else if (platform === 'darwin') {
      cmd = `osascript -e 'tell app "Terminal" to do script "cd \\"${BRAIN}\\" && claude --prompt \\"${prompt}\\""'`;
    } else {
      cmd = `x-terminal-emulator -e "cd '${BRAIN}' && claude --prompt '${prompt}'" || gnome-terminal -- bash -c "cd '${BRAIN}' && claude --prompt '${prompt}'; exec bash"`;
    }
    exec(cmd, (err) => {
      if (err) return json(res, { ok: false, error: err.message }, 500);
      json(res, { ok: true, module: mod });
    });
    return;
  }

  if (route === '/api/launch-voice' && req.method === 'POST') {
    const voiceUrl = `http://localhost:${PORT}/voice.html`;
    const platform = os.platform();
    const cmd = platform === 'win32' ? `start "" "${voiceUrl}"` :
      platform === 'darwin' ? `open "${voiceUrl}"` : `xdg-open "${voiceUrl}"`;
    exec(cmd);
    return json(res, { ok: true, url: voiceUrl });
  }

  if (route === '/api/voice-buffer' && req.method === 'POST') {
    const { text } = await readBody(req);
    if (!text) return json(res, { error: 'text required' }, 400);
    const dir = path.dirname(VOICE_BUFFER);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const entry = `[${new Date().toISOString()}] ${text}\n`;
    fs.appendFileSync(VOICE_BUFFER, entry);
    return json(res, { ok: true });
  }

  if (route === '/api/open-folder' && req.method === 'POST') {
    const platform = os.platform();
    const cmd = platform === 'win32' ? `explorer "${BRAIN.replace(/\//g, '\\')}"` :
      platform === 'darwin' ? `open "${BRAIN}"` : `xdg-open "${BRAIN}"`;
    exec(cmd);
    return json(res, { ok: true });
  }

  if (route === '/api/recent-activity' && req.method === 'GET') {
    const files = [];
    function scan(dir, depth = 0) {
      if (depth > 2 || !fs.existsSync(dir)) return;
      try {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
          const full = path.join(dir, entry.name);
          if (entry.isFile()) {
            const stat = fs.statSync(full);
            files.push({ name: entry.name, path: full.replace(BRAIN, ''), modified: stat.mtimeMs, size: stat.size });
          } else if (entry.isDirectory()) {
            scan(full, depth + 1);
          }
        }
      } catch (_) { /* skip inaccessible */ }
    }
    scan(BRAIN);
    files.sort((a, b) => b.modified - a.modified);
    return json(res, files.slice(0, 20));
  }

  return json(res, { error: 'Not found' }, 404);
}

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // API routes
  if (url.pathname.startsWith('/api/')) return handleAPI(req, res);

  // Static files
  let filepath = path.join(PUBLIC, url.pathname === '/' ? 'index.html' : url.pathname);
  filepath = path.normalize(filepath);
  if (!filepath.startsWith(PUBLIC)) { res.writeHead(403); return res.end('Forbidden'); }

  if (!fs.existsSync(filepath)) { res.writeHead(404); return res.end('Not Found'); }

  const ext = path.extname(filepath);
  const mime = MIME[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(filepath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`\n  BizBrain OS Dashboard running at http://localhost:${PORT}\n`);
  watchState();
  // Auto-open in default browser
  const platform = os.platform();
  const openCmd = platform === 'win32' ? 'start' : platform === 'darwin' ? 'open' : 'xdg-open';
  exec(`${openCmd} http://localhost:${PORT}`);
});
