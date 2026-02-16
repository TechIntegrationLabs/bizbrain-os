/* ============================================================
   BizBrain OS Dashboard - Application Logic
   Vanilla JavaScript, zero dependencies
   ============================================================ */

(function () {
  'use strict';

  // --- State ---
  let config = {};
  let state = {};
  let modules = [];
  let health = {};
  let mode = 'loading'; // loading | setup | operational
  let completedCollapsed = true;
  let forceOperational = false;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // --- Initialization ---
  async function init() {
    renderLoading();
    try {
      const [configRes, stateRes, modulesRes, healthRes] = await Promise.all([
        fetchAPI('/api/config'),
        fetchAPI('/api/state'),
        fetchAPI('/api/modules'),
        fetchAPI('/api/health'),
      ]);
      config = configRes || {};
      state = stateRes || {};
      modules = modulesRes || [];
      health = healthRes || {};

      applyBranding();
      determineMode();
      render();
      connectSSE();
    } catch (err) {
      console.error('Init error:', err);
      renderError('Failed to connect to BizBrain OS server. Is it running on port 5555?');
    }
  }

  // --- Tauri Detection ---
  // withGlobalTauri: true exposes the API at window.__TAURI__
  const IS_TAURI = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

  function getTauriInvoke() {
    if (IS_TAURI && window.__TAURI__?.core?.invoke) {
      return window.__TAURI__.core.invoke;
    }
    return null;
  }

  function getTauriListen() {
    if (IS_TAURI && window.__TAURI__?.event?.listen) {
      return window.__TAURI__.event.listen;
    }
    return null;
  }

  // Map API paths to Tauri command names and argument extractors
  const TAURI_COMMANDS = {
    '/api/config': { cmd: 'get_config' },
    '/api/state': { cmd: 'get_state' },
    '/api/modules': { cmd: 'get_modules' },
    '/api/health': { cmd: 'get_health' },
    '/api/recent-activity': { cmd: 'get_recent_activity' },
    '/api/launch': { cmd: 'get_launch_state' },
    '/api/launch-terminal': { cmd: 'launch_terminal' },
    '/api/launch-voice': { cmd: 'launch_terminal' }, // voice opens in Tauri webview
    '/api/open-folder': { cmd: 'open_brain_folder' },
  };

  // --- API ---
  async function fetchAPI(path, opts = {}) {
    const invoke = getTauriInvoke();
    if (invoke) {
      const mapping = TAURI_COMMANDS[path];
      if (mapping) return invoke(mapping.cmd);
    }
    const res = await fetch(path, opts);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  }

  async function postAPI(path, body = {}) {
    const invoke = getTauriInvoke();
    if (invoke) {
      if (path === '/api/launch-terminal') return invoke('launch_terminal');
      if (path === '/api/launch-module') return invoke('launch_module', { module: body.module });
      if (path === '/api/open-folder') return invoke('open_brain_folder');
      if (path === '/api/voice-buffer') return invoke('write_voice_buffer', { text: body.text });
      if (path === '/api/launch' && body) return invoke('save_launch_state', { data: body });
      if (path === '/api/launch-voice') {
        // In Tauri, open voice.html as a new Tauri window
        if (window.__TAURI__?.webviewWindow?.WebviewWindow) {
          new window.__TAURI__.webviewWindow.WebviewWindow('voice', {
            url: '/voice.html', title: 'Voice Input', width: 600, height: 700, center: true
          });
          return { ok: true };
        }
      }
    }
    return fetchAPI(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  // --- SSE / Tauri Events ---
  function connectSSE() {
    if (IS_TAURI) {
      // Use Tauri event system instead of SSE
      const listen = getTauriListen();
      if (listen) {
        listen('state-changed', (event) => {
          state = event.payload;
          determineMode();
          render();
        });
        console.log('[BizBrain] Connected via Tauri events');
        return;
      }
    }

    // Fallback: HTTP SSE for web mode
    const evtSource = new EventSource('/api/events');
    evtSource.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'state') {
          state = msg.data;
          determineMode();
          render();
        }
      } catch (_) {}
    };
    evtSource.onerror = () => {
      setTimeout(() => connectSSE(), 5000);
      evtSource.close();
    };
  }

  // --- Branding ---
  function applyBranding() {
    const colors = config?.profile?.brandColors;
    if (colors) {
      const root = document.documentElement;
      if (colors.primary) root.style.setProperty('--color-primary', colors.primary);
      if (colors.secondary) root.style.setProperty('--color-secondary', colors.secondary);
      if (colors.accent) root.style.setProperty('--color-accent', colors.accent);
    }
  }

  // --- Mode Detection ---
  function determineMode() {
    if (forceOperational) { mode = 'operational'; return; }

    const moduleStates = state.modules || {};
    const allIds = modules.map(m => m.id || m.name || m._file?.replace('.json', ''));
    const completedIds = state.completedModules || [];

    // If no modules exist, default to operational
    if (allIds.length === 0) { mode = 'operational'; return; }

    const allDone = allIds.every(id => completedIds.includes(id) || moduleStates[id]?.status === 'completed');
    mode = allDone ? 'operational' : 'setup';
  }

  // --- Render Router ---
  function render() {
    const main = $('#main');
    if (!main) return;
    main.innerHTML = '';
    if (mode === 'setup') renderSetup(main);
    else renderOperational(main);
    updateHeader();
  }

  function renderLoading() {
    const main = $('#main');
    if (!main) return;
    main.innerHTML = `
      <div class="loading-container">
        <div class="spinner"></div>
        <span>Loading BizBrain OS...</span>
      </div>`;
  }

  function renderError(message) {
    const main = $('#main');
    if (!main) return;
    main.innerHTML = `
      <div class="loading-container">
        <div style="font-size:2rem;opacity:0.5;">&#9888;</div>
        <span>${escapeHtml(message)}</span>
        <button class="btn btn-primary" onclick="location.reload()">Retry</button>
      </div>`;
  }

  // --- Header ---
  function updateHeader() {
    const name = config?.profile?.businessName || 'BizBrain OS';
    const titleEl = $('#header-title');
    if (titleEl) titleEl.textContent = name;

    const badgeEl = $('#connection-badge');
    if (badgeEl) {
      badgeEl.className = 'header-badge connected';
      badgeEl.innerHTML = '<span class="dot"></span> Live';
    }
  }

  // --- Setup Mode ---
  function renderSetup(container) {
    const moduleStates = state.modules || {};
    const completedIds = state.completedModules || [];

    // Categorize modules
    const ready = [];
    const locked = [];
    const completed = [];
    const inProgress = [];
    const errored = [];

    for (const mod of modules) {
      const id = mod.id || mod.name || mod._file?.replace('.json', '');
      const ms = moduleStates[id] || {};

      if (completedIds.includes(id) || ms.status === 'completed') {
        completed.push({ ...mod, _id: id, _status: 'completed' });
      } else if (ms.status === 'error') {
        errored.push({ ...mod, _id: id, _status: 'error' });
      } else if (ms.status === 'in-progress') {
        inProgress.push({ ...mod, _id: id, _status: 'in-progress' });
      } else if (areDependenciesMet(mod, completedIds)) {
        ready.push({ ...mod, _id: id, _status: 'ready' });
      } else {
        locked.push({ ...mod, _id: id, _status: 'locked' });
      }
    }

    const total = modules.length;
    const done = completed.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    let html = `
      <div class="setup-header fade-in">
        <h1 class="setup-title">Set Up Your Business Brain</h1>
        <p class="setup-subtitle">Configure each module to unlock your AI-powered business system.</p>
        <span class="skip-link" id="skip-link">&#8594; Skip to Dashboard</span>
      </div>

      <div class="progress-container fade-in">
        <div class="progress-label">
          <span><strong>${done}</strong> of <strong>${total}</strong> modules configured</span>
          <span>${pct}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>
      </div>`;

    // Errored
    if (errored.length > 0) {
      html += renderModuleSection('Needs Attention', errored, 'error');
    }

    // In Progress
    if (inProgress.length > 0) {
      html += renderModuleSection('In Progress', inProgress, 'in-progress');
    }

    // Ready
    if (ready.length > 0) {
      html += renderModuleSection('Set Up Next', ready, 'ready');
    }

    // Locked
    if (locked.length > 0) {
      html += renderModuleSection('Waiting on Dependencies', locked, 'locked');
    }

    // Completed
    if (completed.length > 0) {
      html += `
        <div class="section-group">
          <div class="section-title clickable" id="completed-toggle">
            <span class="chevron ${completedCollapsed ? 'collapsed' : ''}">&#9660;</span>
            Completed
            <span class="count">${completed.length}</span>
          </div>
          <div class="module-grid ${completedCollapsed ? 'collapsed' : ''}" id="completed-grid">
            ${completed.map(m => renderModuleCard(m)).join('')}
          </div>
        </div>`;
    }

    container.innerHTML = html;

    // Event listeners
    const skipLink = $('#skip-link');
    if (skipLink) skipLink.addEventListener('click', () => {
      forceOperational = true;
      mode = 'operational';
      render();
    });

    const completedToggle = $('#completed-toggle');
    if (completedToggle) completedToggle.addEventListener('click', () => {
      completedCollapsed = !completedCollapsed;
      const grid = $('#completed-grid');
      const chevron = completedToggle.querySelector('.chevron');
      if (grid) grid.classList.toggle('collapsed', completedCollapsed);
      if (chevron) chevron.classList.toggle('collapsed', completedCollapsed);
    });

    // Module card click handlers
    $$('.module-card.ready').forEach(card => {
      card.addEventListener('click', () => launchModule(card.dataset.moduleId));
    });
  }

  function renderModuleSection(title, mods, statusKey) {
    return `
      <div class="section-group">
        <div class="section-title">
          ${statusKey === 'error' ? '&#9888;' : statusKey === 'ready' ? '&#9679;' : statusKey === 'in-progress' ? '&#9679;' : '&#128274;'}
          ${title}
          <span class="count">${mods.length}</span>
        </div>
        <div class="module-grid">
          ${mods.map(m => renderModuleCard(m)).join('')}
        </div>
      </div>`;
  }

  function renderModuleCard(mod) {
    const status = mod._status;
    const statusIcons = {
      completed: '<span title="Completed" style="color:var(--color-green)">&#10003;</span>',
      ready: '<span title="Ready" class="status-ready" style="color:var(--color-blue)">&#9679;</span>',
      locked: '<span title="Locked" style="color:var(--color-gray)">&#128274;</span>',
      'in-progress': '<span title="In Progress" style="color:var(--color-yellow)">&#9679;</span>',
      error: '<span title="Error" style="color:var(--color-red)">&#10005;</span>',
    };

    const deps = mod.dependencies || mod.requires || [];
    const completedIds = state.completedModules || [];
    const missingDeps = deps.filter(d => !completedIds.includes(d));

    const emoji = mod.icon || mod.emoji || getDefaultEmoji(mod._id);

    return `
      <div class="module-card ${status} fade-in" data-module-id="${escapeAttr(mod._id)}">
        <div class="card-header">
          <div>
            <div class="card-name">${escapeHtml(mod.displayName || mod.name || mod._id)}</div>
          </div>
          <span class="card-status">${statusIcons[status] || ''}</span>
        </div>
        <div class="card-desc">${escapeHtml(mod.description || 'Configure this module to enable its features.')}</div>
        <div class="card-meta">
          ${mod.estimatedTime ? `<span class="card-meta-item">&#128338; ${escapeHtml(mod.estimatedTime)}</span>` : ''}
          ${mod.category ? `<span class="card-meta-item">${escapeHtml(mod.category)}</span>` : ''}
          ${mod._core ? '<span class="card-meta-item">Core</span>' : ''}
        </div>
        ${missingDeps.length > 0 ? `<div class="card-deps">&#128274; Needs: ${missingDeps.map(d => escapeHtml(d)).join(', ')}</div>` : ''}
        ${status === 'ready' ? `<div class="card-action"><button class="btn btn-primary">Start Setup &#8594;</button></div>` : ''}
        ${status === 'error' ? `<div class="card-action"><button class="btn btn-secondary" onclick="event.stopPropagation()">Retry</button></div>` : ''}
      </div>`;
  }

  // --- Operational Mode ---
  function renderOperational(container) {
    let html = '';

    // Action Cards
    html += `
      <div class="action-cards">
        <div class="action-card fade-in" id="action-conversation">
          <div class="action-icon">&#128172;</div>
          <div class="action-title">New Conversation</div>
          <div class="action-subtitle">Launch Claude Code in your Brain</div>
        </div>
        <div class="action-card fade-in" id="action-voice">
          <div class="action-icon">&#127908;</div>
          <div class="action-title">Voice Session</div>
          <div class="action-subtitle">Speak to transcribe and process</div>
        </div>
        <div class="action-card fade-in" id="action-folder">
          <div class="action-icon">&#128193;</div>
          <div class="action-title">Open Brain Folder</div>
          <div class="action-subtitle">Browse files in your OS</div>
        </div>
      </div>`;

    // Quick Actions
    const quickActions = getQuickActions();
    if (quickActions.length > 0) {
      html += `
        <div class="quick-actions fade-in">
          <span class="quick-actions-label">Quick Actions</span>
          ${quickActions.map(a => `
            <button class="quick-btn" data-action="${escapeAttr(a.action)}" data-arg="${escapeAttr(a.arg || '')}">
              ${a.icon || ''} ${escapeHtml(a.label)}
            </button>`).join('')}
        </div>`;
    }

    // Two-column layout
    html += `
      <div class="two-col">
        <div class="panel fade-in" id="panel-projects">
          <div class="panel-header">
            <span class="panel-title">Active Projects</span>
          </div>
          <div class="panel-body" id="projects-body">
            <div class="panel-empty">
              <div class="panel-empty-icon">&#128204;</div>
              <div>No projects yet</div>
              <div style="font-size:0.75rem;margin-top:4px;color:var(--text-tertiary)">Create a project folder in your Brain to see it here</div>
            </div>
          </div>
        </div>
        <div class="panel fade-in" id="panel-activity">
          <div class="panel-header">
            <span class="panel-title">Recent Activity</span>
            <button class="btn btn-ghost" id="refresh-activity">&#8635;</button>
          </div>
          <div class="panel-body" id="activity-body">
            <div class="loading-container" style="min-height:120px">
              <div class="spinner"></div>
            </div>
          </div>
        </div>
      </div>`;

    // Services strip
    html += renderServicesStrip();

    container.innerHTML = html;

    // Event handlers
    $('#action-conversation')?.addEventListener('click', launchTerminal);
    $('#action-voice')?.addEventListener('click', launchVoice);
    $('#action-folder')?.addEventListener('click', openFolder);
    $('#refresh-activity')?.addEventListener('click', loadActivity);

    $$('.quick-btn').forEach(btn => {
      btn.addEventListener('click', () => handleQuickAction(btn.dataset.action, btn.dataset.arg));
    });

    // Load async data
    loadActivity();
    loadProjects();
  }

  // --- Quick Actions ---
  function getQuickActions() {
    const actions = [];
    const configured = state.completedModules || [];
    const integrations = config?.integrations || {};

    // Always available
    actions.push({ label: 'Process Intake', icon: '&#128229;', action: 'module', arg: 'intake' });

    if (configured.includes('github') || integrations.github) {
      actions.push({ label: 'Open GitHub', icon: '&#128025;', action: 'open-url', arg: 'https://github.com' });
    }
    if (configured.includes('clients') || configured.includes('entity')) {
      actions.push({ label: '+ New Client', icon: '&#128100;', action: 'module', arg: 'new-client' });
    }
    if (configured.includes('projects')) {
      actions.push({ label: '+ New Project', icon: '&#128196;', action: 'module', arg: 'new-project' });
    }
    if (configured.includes('time-tracking') || integrations.timeTracking) {
      actions.push({ label: 'View Timesheet', icon: '&#128338;', action: 'module', arg: 'timesheet' });
    }
    if (configured.includes('notion') || integrations.notion) {
      actions.push({ label: 'Open Notion', icon: '&#128221;', action: 'open-url', arg: 'https://notion.so' });
    }
    if (configured.includes('slack') || integrations.slack) {
      actions.push({ label: 'Open Slack', icon: '&#128172;', action: 'open-url', arg: 'https://slack.com' });
    }

    return actions;
  }

  function handleQuickAction(action, arg) {
    switch (action) {
      case 'module': launchModule(arg); break;
      case 'open-url': window.open(arg, '_blank'); break;
      default: toast('Action not yet configured', 'error');
    }
  }

  // --- Services Strip ---
  function renderServicesStrip() {
    const integrations = config?.integrations || {};
    const configured = state.completedModules || [];

    const services = [
      { id: 'github', name: 'GitHub', icon: '&#128025;' },
      { id: 'notion', name: 'Notion', icon: '&#128221;' },
      { id: 'slack', name: 'Slack', icon: '&#128172;' },
      { id: 'google', name: 'Google', icon: '&#9993;' },
      { id: 'stripe', name: 'Stripe', icon: '&#128179;' },
      { id: 'supabase', name: 'Supabase', icon: '&#9931;' },
    ];

    const badges = services.map(s => {
      const active = configured.includes(s.id) || integrations[s.id];
      return `<span class="service-badge ${active ? 'active' : ''}">
        <span class="dot"></span>
        ${s.icon} ${s.name}
      </span>`;
    }).join('');

    return `
      <div class="services-strip fade-in">
        <span class="services-strip-label">Connected Services</span>
        ${badges}
      </div>`;
  }

  // --- Async Loaders ---
  async function loadActivity() {
    try {
      const files = await fetchAPI('/api/recent-activity');
      const body = $('#activity-body');
      if (!body) return;

      if (!files || files.length === 0) {
        body.innerHTML = `
          <div class="panel-empty">
            <div class="panel-empty-icon">&#128203;</div>
            <div>No recent activity</div>
          </div>`;
        return;
      }

      body.innerHTML = files.map(f => `
        <div class="list-item">
          <div class="list-icon">${getFileIcon(f.name)}</div>
          <div class="list-content">
            <div class="list-name" title="${escapeAttr(f.path)}">${escapeHtml(f.name)}</div>
            <div class="list-meta">${escapeHtml(f.path)} &middot; ${relativeTime(f.modified)}</div>
          </div>
        </div>`).join('');
    } catch (_) {
      const body = $('#activity-body');
      if (body) body.innerHTML = '<div class="panel-empty"><div>Could not load activity</div></div>';
    }
  }

  async function loadProjects() {
    // Attempt to find project directories
    const body = $('#projects-body');
    if (!body) return;

    try {
      // The recent activity endpoint scans brain root; look for directories that might be projects
      const files = await fetchAPI('/api/recent-activity');
      // Infer projects from directory paths
      const projectDirs = new Set();
      (files || []).forEach(f => {
        const parts = f.path.replace(/^[\\/]/, '').split(/[\\/]/);
        if (parts.length > 1 && !parts[0].startsWith('.') && !parts[0].startsWith('_')) {
          projectDirs.add(parts[0]);
        }
      });

      if (projectDirs.size === 0) return; // keep empty state

      body.innerHTML = [...projectDirs].slice(0, 10).map(name => `
        <div class="list-item">
          <div class="list-icon">&#128193;</div>
          <div class="list-content">
            <div class="list-name">${escapeHtml(name)}</div>
            <div class="list-meta">Project folder</div>
          </div>
        </div>`).join('');
    } catch (_) {
      // keep empty state
    }
  }

  // --- Actions ---
  async function launchTerminal() {
    try {
      await postAPI('/api/launch-terminal');
      toast('Terminal launched with Claude Code', 'success');
    } catch (err) {
      toast('Failed to launch terminal: ' + err.message, 'error');
    }
  }

  async function launchModule(moduleId) {
    try {
      await postAPI('/api/launch-module', { module: moduleId });
      toast(`Launching ${moduleId} setup...`, 'success');
    } catch (err) {
      toast('Failed to launch module: ' + err.message, 'error');
    }
  }

  async function launchVoice() {
    try {
      await postAPI('/api/launch-voice');
    } catch (_) {
      // Fallback: open directly
      window.open('/voice.html', '_blank');
    }
  }

  async function openFolder() {
    try {
      await postAPI('/api/open-folder');
    } catch (_) {
      toast('Could not open folder', 'error');
    }
  }

  // --- Helpers ---
  function areDependenciesMet(mod, completedIds) {
    const deps = mod.dependencies || mod.requires || [];
    return deps.every(d => completedIds.includes(d));
  }

  function relativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  }

  function getFileIcon(filename) {
    const ext = filename.split('.').pop()?.toLowerCase();
    const icons = {
      json: '&#128203;', md: '&#128196;', txt: '&#128196;', js: '&#9881;',
      ts: '&#9881;', py: '&#128013;', html: '&#127760;', css: '&#127912;',
      yml: '&#9881;', yaml: '&#9881;', toml: '&#9881;', log: '&#128220;',
      png: '&#128247;', jpg: '&#128247;', svg: '&#128247;', gif: '&#128247;',
      pdf: '&#128213;',
    };
    return icons[ext] || '&#128196;';
  }

  function getDefaultEmoji(id) {
    const map = {
      github: '&#128025;', notion: '&#128221;', slack: '&#128172;', google: '&#9993;',
      stripe: '&#128179;', clients: '&#128100;', projects: '&#128204;', time: '&#128338;',
      intake: '&#128229;', voice: '&#127908;', supabase: '&#9931;',
    };
    for (const [key, emoji] of Object.entries(map)) {
      if (id?.toLowerCase().includes(key)) return emoji;
    }
    return '&#9881;';
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return String(str || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // --- Toast Notifications ---
  function toast(message, type = 'info') {
    let toastEl = $('#toast');
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'toast';
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.className = `toast ${type}`;
    toastEl.innerHTML = `${type === 'success' ? '&#10003;' : type === 'error' ? '&#10005;' : '&#8505;'} ${escapeHtml(message)}`;

    // Trigger reflow for animation
    toastEl.offsetHeight;
    toastEl.classList.add('show');

    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => toastEl.classList.remove('show'), 3500);
  }

  // --- Boot ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
