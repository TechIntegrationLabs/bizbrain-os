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
  let mode = 'loading'; // loading | welcome | setup | operational
  let completedCollapsed = true;
  let forceOperational = false;
  let promptCopied = false;

  // Welcome flow state
  let welcomePhase = 'checking'; // checking | fixing | ready
  let checkAnim = { step: 0, results: [] }; // tracks animated check sequence
  let welcomeAnimRunning = false;
  let cmdFlags = { yolo: false, chrome: false }; // command flag toggles

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

    // First-run detection: no config.json or empty business name means welcome screen
    const hasProfile = config?.profile?.businessName && config.profile.businessName.trim() !== '';
    const hasCompletedInterview = state?.interview?.completedAt;
    if (!hasProfile && !hasCompletedInterview) {
      mode = 'welcome';
      return;
    }

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
    if (mode === 'welcome') renderWelcome(main);
    else if (mode === 'setup') renderSetup(main);
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

    const subtitleEl = $('#header-subtitle');
    if (subtitleEl) subtitleEl.textContent = mode === 'welcome' ? 'Getting Started' : 'Dashboard';

    const badgeEl = $('#connection-badge');
    if (badgeEl) {
      badgeEl.className = 'header-badge connected';
      badgeEl.innerHTML = '<span class="dot"></span> Live';
    }
  }

  // --- Welcome / First-Run Mode ---
  function getSetupPrompt() {
    return `I just cloned BizBrain OS and I'm ready to set up my Business Brain.

You are now my BizBrain OS setup assistant. Here's what I need you to do:

## Step 1: Find and verify my BizBrain OS installation
Look for the bizbrain-os folder. It should be in my current working directory, or check common locations like ~/bizbrain-os, ~/Repos/bizbrain-os, or ~/Desktop/bizbrain-os. Once found, verify these files exist:
- .bizbrain/wizard/interview.md (your setup guide)
- config.template.json (config template)
- .bizbrain/modules/ (module definitions)

## Step 2: Read the interview guide
Read the file .bizbrain/wizard/interview.md in the bizbrain-os folder. This contains your complete instructions for walking me through setup.

## Step 3: Walk me through the setup interview
Follow the interview.md guide step by step:
1. Check my prerequisites (Node.js 18+, Git, Claude Code)
2. Ask if I want to use voice input or type
3. Have a natural conversation to learn about my business - my name, business name, what I do, my clients, tools I use, pain points
4. Show me what you understood and let me correct anything
5. Recommend modules based on my business type
6. Ask about my preferences (communication style, time tracking, etc.)

## Step 4: Generate my Brain
After the interview:
1. Create config.json from config.template.json with all my info filled in
2. Run: node .bizbrain/wizard/generators/base-brain.js (to create folder structure)
3. Generate the wizard state.json in .bizbrain/wizard/
4. Generate my personalized CLAUDE.md
5. Start the dashboard: node .bizbrain/dashboard/server.js

## Important
- Be conversational and friendly, not robotic
- If I give short answers, use smart defaults - don't over-ask
- If I ramble, that's great - extract everything you can
- This should feel like talking to a smart assistant, not filling out a form
- The whole setup should take about 5 minutes of chatting

Let's begin! Start by verifying my installation, then jump into Step 3 - the interview.`;
  }

  // Prerequisite definitions for animated checks
  const PREREQS = [
    {
      id: 'node',
      name: 'Node.js',
      checkLabel: 'Checking for Node.js...',
      getResult: () => ({
        ok: health.node,
        detail: health.node ? (health.nodeVersion || 'Installed') : 'Not found',
      }),
      guide: {
        title: 'Install Node.js',
        description: 'Node.js runs the BizBrain OS dashboard server. You need version 18 or higher.',
        steps: [
          { text: 'Download the installer from the official website:', link: 'https://nodejs.org', linkText: 'nodejs.org' },
          { text: 'Run the installer and follow the prompts (defaults are fine).' },
          { text: 'Restart your terminal after installation.' },
        ],
        verifyCmd: 'node --version',
      },
    },
    {
      id: 'git',
      name: 'Git',
      checkLabel: 'Checking for Git...',
      getResult: () => ({
        ok: health.git,
        detail: health.git ? (health.gitVersion || 'Installed') : 'Not found',
      }),
      guide: {
        title: 'Install Git',
        description: 'Git keeps BizBrain OS up to date. A simple git pull brings new features without touching your data.',
        steps: [
          { text: 'Download Git from:', link: 'https://git-scm.com', linkText: 'git-scm.com' },
          { text: 'Run the installer (defaults work for most users).' },
          { text: 'Restart your terminal after installation.' },
        ],
        verifyCmd: 'git --version',
      },
    },
    {
      id: 'claude',
      name: 'Claude Code',
      checkLabel: 'Checking for Claude Code...',
      getResult: () => ({
        ok: health.claude,
        detail: health.claude ? (health.claudeVersion || 'Installed') : 'Not found',
      }),
      guide: {
        title: 'Install Claude Code',
        description: 'Claude Code is the AI engine that powers BizBrain OS. It turns natural conversation into structured business context.',
        steps: [
          { text: 'Install globally with npm:', cmd: 'npm install -g @anthropic-ai/claude-code' },
          { text: 'Launch it once to authenticate:', cmd: 'claude' },
          { text: 'Follow the prompts to sign in with your Anthropic account.' },
          { text: 'Once authenticated, come back here and click "Check Again".' },
        ],
        verifyCmd: 'claude --version',
      },
    },
  ];

  function renderWelcome(container) {
    container.innerHTML = `
      <div class="welcome-container">
        <div class="welcome-hero fade-in">
          <div class="welcome-logo">
            <div class="welcome-logo-icon">B</div>
          </div>
          <h1 class="welcome-title">Welcome to BizBrain OS</h1>
          <p class="welcome-tagline">The context layer that teaches AI your business.</p>
        </div>
        <div id="welcome-body"></div>
      </div>`;

    // Start the animated check sequence if not already done
    if (!welcomeAnimRunning && welcomePhase === 'checking') {
      welcomeAnimRunning = true;
      runCheckSequence();
    } else {
      // Re-render current phase (e.g. after re-check)
      renderWelcomePhase();
    }
  }

  async function runCheckSequence() {
    checkAnim = { step: 0, results: [] };
    welcomePhase = 'checking';

    const body = $('#welcome-body');
    if (!body) return;

    // Show the check container
    body.innerHTML = `
      <div class="check-sequence fade-in">
        <div class="check-header">
          <div class="check-spinner"></div>
          <span class="check-status-text">Checking your system...</span>
        </div>
        <div class="check-list" id="check-list"></div>
      </div>`;

    const list = $('#check-list');
    if (!list) return;

    // Animate through each prerequisite
    for (let i = 0; i < PREREQS.length; i++) {
      const prereq = PREREQS[i];

      // Add "checking..." row
      const row = document.createElement('div');
      row.className = 'check-row checking fade-in';
      row.id = `check-row-${prereq.id}`;
      row.innerHTML = `
        <div class="check-row-spinner"></div>
        <span class="check-row-name">${escapeHtml(prereq.name)}</span>
        <span class="check-row-detail">${escapeHtml(prereq.checkLabel)}</span>`;
      list.appendChild(row);

      // Wait for animation beat
      await sleep(600 + Math.random() * 400);

      // Resolve the check
      const result = prereq.getResult();
      checkAnim.results.push({ ...result, id: prereq.id, name: prereq.name });

      row.className = `check-row ${result.ok ? 'pass' : 'fail'} fade-in`;
      row.innerHTML = `
        <span class="check-row-icon ${result.ok ? 'pass' : 'fail'}">${result.ok ? '&#10003;' : '&#10005;'}</span>
        <span class="check-row-name">${escapeHtml(prereq.name)}</span>
        <span class="check-row-detail ${result.ok ? '' : 'fail'}">${escapeHtml(result.detail)}</span>`;

      checkAnim.step = i + 1;
    }

    // Brief pause after all checks
    await sleep(500);

    // Determine outcome
    const allOk = checkAnim.results.every(r => r.ok);
    const headerEl = body.querySelector('.check-header');

    if (allOk) {
      // All good — show success then transition to ready
      if (headerEl) {
        headerEl.innerHTML = `
          <span class="check-done-icon pass">&#10003;</span>
          <span class="check-status-text success">All systems go!</span>`;
      }
      await sleep(800);
      welcomePhase = 'ready';
    } else {
      // Something missing — show failure then transition to fix guide
      const missingCount = checkAnim.results.filter(r => !r.ok).length;
      if (headerEl) {
        headerEl.innerHTML = `
          <span class="check-done-icon fail">&#9888;</span>
          <span class="check-status-text">${missingCount} missing requirement${missingCount > 1 ? 's' : ''}</span>`;
      }
      await sleep(800);
      welcomePhase = 'fixing';
    }

    welcomeAnimRunning = false;
    renderWelcomePhase();
  }

  function renderWelcomePhase() {
    const body = $('#welcome-body');
    if (!body) return;

    if (welcomePhase === 'fixing') {
      renderFixGuide(body);
    } else if (welcomePhase === 'ready') {
      renderReadyScreen(body);
    }
  }

  function renderFixGuide(container) {
    const missing = PREREQS.filter(p => !p.getResult().ok);
    const passed = PREREQS.filter(p => p.getResult().ok);

    let html = `
      <div class="fix-guide fade-in">
        <div class="fix-summary">
          <p>Almost there! Let's get the missing pieces installed.</p>
        </div>`;

    // Show passed items compactly
    if (passed.length > 0) {
      html += `<div class="fix-passed">`;
      for (const p of passed) {
        const r = p.getResult();
        html += `
          <div class="fix-passed-item">
            <span class="check-row-icon pass">&#10003;</span>
            <span>${escapeHtml(p.name)}</span>
            <span class="fix-passed-detail">${escapeHtml(r.detail)}</span>
          </div>`;
      }
      html += `</div>`;
    }

    // Show interactive guide for each missing item
    for (let i = 0; i < missing.length; i++) {
      const prereq = missing[i];
      const guide = prereq.guide;
      const isFirst = i === 0;

      html += `
        <div class="fix-card ${isFirst ? 'active' : ''}" id="fix-${prereq.id}">
          <div class="fix-card-header">
            <div class="fix-card-number">${i + 1}</div>
            <div>
              <h3>${escapeHtml(guide.title)}</h3>
              <p class="fix-card-desc">${escapeHtml(guide.description)}</p>
            </div>
          </div>
          <ol class="fix-steps">`;

      for (const step of guide.steps) {
        html += `<li class="fix-step">`;
        html += `<span>${escapeHtml(step.text)}</span>`;
        if (step.link) {
          html += ` <a href="${escapeAttr(step.link)}" target="_blank" class="fix-link">${escapeHtml(step.linkText || step.link)} &#8599;</a>`;
        }
        if (step.cmd) {
          html += `
            <div class="code-block">
              <code>${escapeHtml(step.cmd)}</code>
              <button class="copy-btn copy-cmd-btn" data-cmd="${escapeAttr(step.cmd)}" title="Copy">&#128203;</button>
            </div>`;
        }
        html += `</li>`;
      }

      html += `
          </ol>
          <div class="fix-verify">
            <span class="fix-verify-label">Verify with:</span>
            <code>${escapeHtml(guide.verifyCmd)}</code>
          </div>
        </div>`;
    }

    html += `
        <div class="fix-actions">
          <button class="btn btn-primary btn-lg" id="recheck-btn">
            <span id="recheck-text">&#8635; Check Again</span>
          </button>
          <button class="btn btn-secondary" id="skip-welcome-fix">Skip to Dashboard &#8594;</button>
        </div>
      </div>`;

    container.innerHTML = html;

    // Event handlers
    $$('.copy-cmd-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.dataset.cmd;
        navigator.clipboard.writeText(cmd).then(() => {
          btn.innerHTML = '&#10003;';
          toast('Copied!', 'success');
          setTimeout(() => { btn.innerHTML = '&#128203;'; }, 2000);
        });
      });
    });

    const recheckBtn = $('#recheck-btn');
    if (recheckBtn) {
      recheckBtn.addEventListener('click', async () => {
        recheckBtn.disabled = true;
        const textEl = $('#recheck-text');
        if (textEl) textEl.innerHTML = '<span class="check-row-spinner" style="display:inline-block;width:16px;height:16px;margin-right:8px"></span> Checking...';

        // Re-fetch health data
        try {
          health = await fetchAPI('/api/health');
        } catch (_) {}

        recheckBtn.disabled = false;

        // Re-run the animated sequence
        welcomePhase = 'checking';
        welcomeAnimRunning = true;
        const body = $('#welcome-body');
        if (body) runCheckSequence();
      });
    }

    const skipBtn = $('#skip-welcome-fix');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        forceOperational = true;
        mode = 'operational';
        render();
      });
    }
  }

  function renderReadyScreen(container) {
    const allPrereqs = health.node && health.git && health.claude;

    let html = `
      <div class="ready-screen fade-in">
        <div class="ready-checks">`;

    for (const prereq of PREREQS) {
      const r = prereq.getResult();
      html += `
          <div class="ready-check-item">
            <span class="check-row-icon pass">&#10003;</span>
            <span class="ready-check-name">${escapeHtml(prereq.name)}</span>
            <span class="ready-check-detail">${escapeHtml(r.detail)}</span>
          </div>`;
    }

    html += `
        </div>

        <div class="ready-divider"></div>

        <div class="ready-steps">
          <div class="welcome-section-title">Get Started</div>

          <div class="welcome-step-card highlight">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Open Claude Code in this folder</h3>
              <p>Open a terminal, navigate to your bizbrain-os folder, and start Claude Code:</p>
              <div class="code-block">
                <code>cd ${escapeHtml(health.platform === 'win32' ? 'bizbrain-os' : '~/bizbrain-os')}</code>
              </div>
              <div class="cmd-builder">
                <div class="cmd-flags">
                  <label class="cmd-flag" id="flag-yolo">
                    <input type="checkbox" ${cmdFlags.yolo ? 'checked' : ''} />
                    <span class="cmd-flag-toggle"></span>
                    <span class="cmd-flag-label">YOLO Mode</span>
                    <span class="cmd-flag-desc">Auto-approve all actions -- no permission prompts. Fast but trusting.</span>
                  </label>
                  <label class="cmd-flag" id="flag-chrome">
                    <input type="checkbox" ${cmdFlags.chrome ? 'checked' : ''} />
                    <span class="cmd-flag-toggle"></span>
                    <span class="cmd-flag-label">Chrome</span>
                    <span class="cmd-flag-desc">Enable browser automation for scraping profiles and setting up credentials.</span>
                  </label>
                </div>
                <div class="code-block cmd-block">
                  <code id="claude-cmd-text">${escapeHtml(buildClaudeCommand())}</code>
                  <button class="copy-btn" id="copy-cmd-btn" title="Copy command">&#128203;</button>
                </div>
              </div>
            </div>
          </div>

          <div class="welcome-step-card highlight">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Paste the setup prompt</h3>
              <p>Click the button below to copy a setup prompt. Paste it into Claude Code and it will walk you through a guided interview to learn about your business and configure everything.</p>
              <button class="btn btn-primary btn-lg welcome-copy-btn" id="copy-prompt-btn">
                <span id="copy-prompt-text">${promptCopied ? '&#10003; Copied! Paste into Claude Code' : '&#128203; Copy Setup Prompt to Clipboard'}</span>
              </button>
              ${promptCopied ? '<p class="step-success">Prompt copied! Open Claude Code and paste it in to begin your guided setup.</p>' : ''}
            </div>
          </div>
        </div>

        <div class="ready-what">
          <div class="welcome-section-title">What happens during setup</div>
          <div class="what-grid">
            <div class="what-item">
              <div class="what-icon">&#128172;</div>
              <h4>5-minute interview</h4>
              <p>Claude learns about your business through natural conversation -- your name, clients, tools, workflows.</p>
            </div>
            <div class="what-item">
              <div class="what-icon">&#9881;</div>
              <h4>Smart module selection</h4>
              <p>Based on your business type, Claude recommends the right modules: CRM, time tracking, content, and more.</p>
            </div>
            <div class="what-item">
              <div class="what-icon">&#128640;</div>
              <h4>Ready to use</h4>
              <p>Your Brain folder structure, personalized config, and dashboard are generated automatically.</p>
            </div>
          </div>
        </div>

        <div class="welcome-alt">
          <p>Already configured BizBrain OS elsewhere?</p>
          <button class="btn btn-secondary" id="skip-welcome-ready">Skip to Dashboard &#8594;</button>
        </div>
      </div>`;

    container.innerHTML = html;

    // Flag toggle handlers
    const flagYolo = $('#flag-yolo input');
    if (flagYolo) {
      flagYolo.addEventListener('change', (e) => {
        cmdFlags.yolo = e.target.checked;
        updateCommandDisplay();
      });
    }

    const flagChrome = $('#flag-chrome input');
    if (flagChrome) {
      flagChrome.addEventListener('change', (e) => {
        cmdFlags.chrome = e.target.checked;
        updateCommandDisplay();
      });
    }

    const copyCmdBtn = $('#copy-cmd-btn');
    if (copyCmdBtn) {
      copyCmdBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(buildClaudeCommand()).then(() => {
          copyCmdBtn.innerHTML = '&#10003;';
          toast('Command copied!', 'success');
          setTimeout(() => { copyCmdBtn.innerHTML = '&#128203;'; }, 2000);
        });
      });
    }

    const copyPromptBtn = $('#copy-prompt-btn');
    if (copyPromptBtn) {
      copyPromptBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(getSetupPrompt());
          promptCopied = true;
          const textEl = $('#copy-prompt-text');
          if (textEl) textEl.innerHTML = '&#10003; Copied! Paste into Claude Code';
          copyPromptBtn.classList.add('copied');
          toast('Setup prompt copied to clipboard!', 'success');
        } catch (err) {
          toast('Could not copy -- try selecting and copying manually', 'error');
        }
      });
    }

    const skipBtn = $('#skip-welcome-ready');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        forceOperational = true;
        mode = 'operational';
        render();
      });
    }
  }

  function buildClaudeCommand() {
    let cmd = 'claude';
    if (cmdFlags.yolo) cmd += ' --dangerously-skip-permissions';
    if (cmdFlags.chrome) cmd += ' --add-tool mcp__claude-in-chrome';
    return cmd;
  }

  function updateCommandDisplay() {
    const cmdEl = $('#claude-cmd-text');
    if (cmdEl) cmdEl.textContent = buildClaudeCommand();
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
