#!/usr/bin/env node
// Plugin Manager - Replaces module-activator.js
// Manages self-contained plugin packages in .bizbrain/plugins/

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const BIZBRAIN = path.join(ROOT, '.bizbrain');
const PLUGINS_DIR = path.join(BIZBRAIN, 'plugins');
const STATE_PATH = path.join(BIZBRAIN, 'state.json');
const GUI_REGISTRY_PATH = path.join(BIZBRAIN, 'gui-registry.json');

// ─── State Management ───────────────────────────────────────

function loadState() {
  if (fs.existsSync(STATE_PATH)) {
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  }
  return {
    version: '3.0.0',
    setupComplete: false,
    privacyTier: 'observer',
    profile: {},
    plugins: {},
    integrations: {},
    learning: { tier: 'observer', pendingInsights: 0, totalObservations: 0 }
  };
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), 'utf8');
}

function loadGuiRegistry() {
  if (fs.existsSync(GUI_REGISTRY_PATH)) {
    return JSON.parse(fs.readFileSync(GUI_REGISTRY_PATH, 'utf8'));
  }
  return { routes: [], sidebar: [], updatedAt: null };
}

function saveGuiRegistry(registry) {
  registry.updatedAt = new Date().toISOString();
  fs.writeFileSync(GUI_REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf8');
}

// ─── Plugin Discovery ───────────────────────────────────────

function loadPluginManifest(pluginId) {
  const manifestPath = path.join(PLUGINS_DIR, pluginId, 'plugin.json');
  if (!fs.existsSync(manifestPath)) {
    console.error(`Plugin not found: ${pluginId}`);
    console.error(`  Expected: ${manifestPath}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function getAllPlugins() {
  const plugins = {};
  if (!fs.existsSync(PLUGINS_DIR)) return plugins;

  const entries = fs.readdirSync(PLUGINS_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const manifestPath = path.join(PLUGINS_DIR, entry.name, 'plugin.json');
    if (fs.existsSync(manifestPath)) {
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        plugins[manifest.id] = manifest;
      } catch (e) {
        console.error(`  Warning: Could not parse ${entry.name}/plugin.json: ${e.message}`);
      }
    }
  }
  return plugins;
}

// ─── Dependency Checking ────────────────────────────────────

function checkDependencies(pluginId) {
  const manifest = loadPluginManifest(pluginId);
  if (!manifest) return { met: false, missing: ['plugin-not-found'] };

  const deps = manifest.dependencies || [];
  if (deps.length === 0) return { met: true, missing: [] };

  const state = loadState();
  const missing = deps.filter(dep => {
    const pluginState = state.plugins && state.plugins[dep];
    return !pluginState || pluginState.state !== 'active';
  });

  return { met: missing.length === 0, missing };
}

// ─── File Operations ────────────────────────────────────────

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyDirRecursive(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function removeDirRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

// ─── Plugin Activation ──────────────────────────────────────

function activatePlugin(pluginId, config) {
  const manifest = loadPluginManifest(pluginId);
  if (!manifest) return false;

  // Check dependencies
  const depCheck = checkDependencies(pluginId);
  if (!depCheck.met) {
    console.error(`\nCannot activate ${manifest.name}: missing dependencies`);
    console.error(`  Required: ${depCheck.missing.join(', ')}`);
    return false;
  }

  const state = loadState();

  // Check if already active
  if (state.plugins[pluginId] && state.plugins[pluginId].state === 'active') {
    console.log(`Plugin ${manifest.name} is already active.`);
    return true;
  }

  // Set installing state
  if (!state.plugins[pluginId]) state.plugins[pluginId] = {};
  state.plugins[pluginId].state = 'installing';
  saveState(state);

  const pluginDir = path.join(PLUGINS_DIR, pluginId);
  const provides = manifest.provides || {};

  console.log(`\nActivating plugin: ${manifest.name}`);
  console.log(`  ${manifest.description}`);
  console.log('-'.repeat(50));

  try {
    // Create folders
    if (provides.folders) {
      provides.folders.forEach(folder => {
        const fullPath = path.join(ROOT, folder);
        ensureDir(fullPath);
        console.log(`  Folder: ${folder}`);
      });
    }

    // Deploy agents from plugin's agents/ directory
    const agentsDir = path.join(pluginDir, 'agents');
    if (provides.agents && fs.existsSync(agentsDir)) {
      const destDir = path.join(ROOT, '.claude', 'agents');
      ensureDir(destDir);
      provides.agents.forEach(agent => {
        const src = path.join(agentsDir, `${agent}.md`);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, path.join(destDir, `${agent}.md`));
          console.log(`  Agent: ${agent}`);
        } else {
          console.log(`  Agent: ${agent} (source pending — will be created during setup)`);
        }
      });
    }

    // Deploy commands from plugin's commands/ directory
    const commandsDir = path.join(pluginDir, 'commands');
    if (provides.commands && fs.existsSync(commandsDir)) {
      const destDir = path.join(ROOT, '.claude', 'commands');
      ensureDir(destDir);
      provides.commands.forEach(cmd => {
        const src = path.join(commandsDir, `${cmd}.md`);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, path.join(destDir, `${cmd}.md`));
          console.log(`  Command: /${cmd}`);
        } else {
          console.log(`  Command: /${cmd} (source pending)`);
        }
      });
    }

    // Deploy hooks from plugin's hooks/ directory
    const hooksDir = path.join(pluginDir, 'hooks');
    if (provides.hooks && fs.existsSync(hooksDir)) {
      provides.hooks.forEach(hook => {
        ['.sh', '.ps1', '.js'].forEach(ext => {
          const src = path.join(hooksDir, `${hook}${ext}`);
          if (fs.existsSync(src)) {
            const destDir = path.join(ROOT, '.claude', 'hooks');
            ensureDir(destDir);
            fs.copyFileSync(src, path.join(destDir, `${hook}${ext}`));
            console.log(`  Hook: ${hook}${ext}`);
          }
        });
      });
    }

    // Deploy knowledge from plugin's knowledge/ directory
    const knowledgeDir = path.join(pluginDir, 'knowledge');
    if (fs.existsSync(knowledgeDir)) {
      const knowledgeDest = path.join(ROOT, '.claude', 'knowledge');
      // Copy preserving subdirectory structure (systems/, operations/, reference/)
      const kbEntries = fs.readdirSync(knowledgeDir, { withFileTypes: true });
      for (const entry of kbEntries) {
        const src = path.join(knowledgeDir, entry.name);
        if (entry.isDirectory()) {
          copyDirRecursive(src, path.join(knowledgeDest, entry.name));
          console.log(`  Knowledge: ${entry.name}/`);
        } else {
          ensureDir(knowledgeDest);
          fs.copyFileSync(src, path.join(knowledgeDest, entry.name));
          console.log(`  Knowledge: ${entry.name}`);
        }
      }
    }

    // Deploy templates from plugin's templates/ directory
    if (provides.templates) {
      const templatesDir = path.join(pluginDir, 'templates');
      if (fs.existsSync(templatesDir)) {
        provides.templates.forEach(tmpl => {
          const src = path.join(templatesDir, tmpl);
          if (fs.existsSync(src)) {
            const destDir = path.join(ROOT, '.claude', 'templates');
            ensureDir(destDir);
            if (fs.statSync(src).isDirectory()) {
              copyDirRecursive(src, path.join(destDir, tmpl));
            } else {
              fs.copyFileSync(src, path.join(destDir, tmpl));
            }
            console.log(`  Template: ${tmpl}`);
          }
        });
      }
    }

    // Register GUI routes
    if (provides.guiRoutes && provides.guiRoutes.length > 0) {
      const registry = loadGuiRegistry();
      provides.guiRoutes.forEach(route => {
        if (!registry.routes.find(r => r.path === route)) {
          registry.routes.push({
            path: route,
            pluginId: pluginId,
            label: manifest.name,
            icon: manifest.icon
          });
        }
      });
      // Rebuild sidebar from all active routes
      rebuildSidebar(registry);
      saveGuiRegistry(registry);
      console.log(`  GUI Routes: ${provides.guiRoutes.join(', ')}`);
    }

    // Update state to active
    state.plugins[pluginId] = {
      state: 'active',
      activatedAt: new Date().toISOString(),
      version: manifest.version,
      config: config || {}
    };

    // Check if any plugins waiting on this dependency can now activate
    const allPlugins = getAllPlugins();
    for (const [id, plugin] of Object.entries(allPlugins)) {
      const plugState = state.plugins[id];
      if (plugState && plugState.state === 'waiting') {
        const deps = plugin.dependencies || [];
        const allDepsActive = deps.every(dep =>
          state.plugins[dep] && state.plugins[dep].state === 'active'
        );
        if (allDepsActive) {
          console.log(`  Unlocked: ${plugin.name} (dependencies now met)`);
        }
      }
    }

    saveState(state);
    console.log(`\n${manifest.name} activated successfully!`);
    return true;

  } catch (err) {
    // Set error state
    state.plugins[pluginId].state = 'error';
    state.plugins[pluginId].error = err.message;
    saveState(state);
    console.error(`\nFailed to activate ${manifest.name}: ${err.message}`);
    return false;
  }
}

// ─── Plugin Deactivation ────────────────────────────────────

function deactivatePlugin(pluginId, options = {}) {
  const manifest = loadPluginManifest(pluginId);
  if (!manifest) return false;

  if (manifest.core) {
    console.error(`Cannot deactivate core plugin: ${manifest.name}`);
    return false;
  }

  const state = loadState();
  if (!state.plugins[pluginId] || state.plugins[pluginId].state !== 'active') {
    console.error(`Plugin ${pluginId} is not active.`);
    return false;
  }

  // Check if other active plugins depend on this one
  const allPlugins = getAllPlugins();
  const dependents = [];
  for (const [id, plugin] of Object.entries(allPlugins)) {
    if (state.plugins[id] && state.plugins[id].state === 'active') {
      const deps = plugin.dependencies || [];
      if (deps.includes(pluginId)) {
        dependents.push(id);
      }
    }
  }

  if (dependents.length > 0) {
    console.error(`\nCannot deactivate ${manifest.name}: other plugins depend on it`);
    console.error(`  Dependents: ${dependents.join(', ')}`);
    return false;
  }

  const provides = manifest.provides || {};

  console.log(`\nDeactivating plugin: ${manifest.name}`);

  // Remove deployed agents
  if (provides.agents && options.clean) {
    const agentsDir = path.join(ROOT, '.claude', 'agents');
    provides.agents.forEach(agent => {
      const dest = path.join(agentsDir, `${agent}.md`);
      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest);
        console.log(`  Removed agent: ${agent}`);
      }
    });
  }

  // Remove deployed commands
  if (provides.commands && options.clean) {
    const commandsDir = path.join(ROOT, '.claude', 'commands');
    provides.commands.forEach(cmd => {
      const dest = path.join(commandsDir, `${cmd}.md`);
      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest);
        console.log(`  Removed command: /${cmd}`);
      }
    });
  }

  // Remove deployed hooks
  if (provides.hooks && options.clean) {
    provides.hooks.forEach(hook => {
      ['.sh', '.ps1', '.js'].forEach(ext => {
        const dest = path.join(ROOT, '.claude', 'hooks', `${hook}${ext}`);
        if (fs.existsSync(dest)) {
          fs.unlinkSync(dest);
          console.log(`  Removed hook: ${hook}${ext}`);
        }
      });
    });
  }

  // Remove GUI routes
  if (provides.guiRoutes && provides.guiRoutes.length > 0) {
    const registry = loadGuiRegistry();
    registry.routes = registry.routes.filter(r => r.pluginId !== pluginId);
    rebuildSidebar(registry);
    saveGuiRegistry(registry);
    console.log(`  Removed GUI routes: ${provides.guiRoutes.join(', ')}`);
  }

  // Note: data folders are NEVER removed (preserve user data)
  if (provides.folders && provides.folders.length > 0) {
    console.log(`  Data folders preserved: ${provides.folders.join(', ')}`);
  }

  // Update state
  state.plugins[pluginId].state = 'disabled';
  state.plugins[pluginId].disabledAt = new Date().toISOString();
  saveState(state);

  console.log(`\n${manifest.name} deactivated.`);
  if (!options.clean) {
    console.log('  Note: Deployed files preserved. Use --clean to remove them.');
  }
  return true;
}

// ─── Init (from profile) ────────────────────────────────────

function initFromProfile() {
  const contextPath = path.join(ROOT, 'onboarding-context.json');
  let profile = {};

  if (fs.existsSync(contextPath)) {
    try {
      const context = JSON.parse(fs.readFileSync(contextPath, 'utf8'));
      profile = context.user || context.profile || {};
    } catch (e) {
      console.warn('Could not read onboarding-context.json, using defaults.');
    }
  }

  const businessType = profile.type || profile.businessType || 'startup';

  console.log('\nInitializing BizBrain OS plugins...');
  console.log(`  Business type: ${businessType}`);
  console.log('');

  // Core is always activated
  activatePlugin('core');

  // Starter plugins based on business type
  const starterPlugins = {
    'solo-freelancer': ['entity-crm', 'time-tracking', 'contracts'],
    'small-agency': ['entity-crm', 'gsd', 'comms-hub', 'content-engine', 'time-tracking'],
    'startup': ['gsd', 'content-engine', 'outreach'],
    'consultancy': ['entity-crm', 'comms-hub', 'contracts', 'time-tracking']
  };

  const toActivate = starterPlugins[businessType] || starterPlugins['startup'];

  console.log(`\nStarter plugins for "${businessType}":`);
  toActivate.forEach(id => console.log(`  - ${id}`));
  console.log('');

  toActivate.forEach(id => activatePlugin(id));

  console.log('\nInitialization complete!');
  console.log('Run `node .bizbrain/scripts/plugin-manager.js list` to see all available plugins.');
}

// ─── Migration (old modules → plugins) ──────────────────────

function migrateFromModules() {
  const oldStatePath = path.join(BIZBRAIN, 'wizard', 'state.json');
  if (!fs.existsSync(oldStatePath)) {
    console.log('No legacy module state found. Nothing to migrate.');
    return;
  }

  const oldState = JSON.parse(fs.readFileSync(oldStatePath, 'utf8'));
  const state = loadState();

  // Module ID → Plugin ID mapping
  const moduleToPlugin = {
    'brain-core': 'core',
    'conversation-capture': 'core',
    'knowledge-base': 'core',
    'gsd-full': 'gsd',
    'gsd-light': 'gsd',
    'spec-implement': 'gsd',
    'comms-hub': 'comms-hub',
    'gmail': 'comms-hub',
    'slack': 'comms-hub',
    'content-factory': 'content-engine',
    'entity-watchdog': 'entity-crm',
    'client-tracking': 'entity-crm',
    'partner-tracking': 'entity-crm',
    'vendor-tracking': 'entity-crm',
    'slideshow': 'presentations',
    'video-studio': 'video-studio',
    'timesheet': 'time-tracking',
    'voice-input': 'voice-ai',
    'notion': 'core',
    'supabase': 'core',
    'github': 'core',
    'stripe': 'core',
    'clerk': 'core',
    'netlify': 'core',
    'vercel': 'core',
    'automated-digests': 'content-engine',
    'chrome-extension': 'core'
  };

  console.log('\nMigrating legacy modules to plugins...');

  const migratedPlugins = new Set();
  for (const [moduleId, moduleState] of Object.entries(oldState.modules || {})) {
    if (moduleState.status === 'configured') {
      const pluginId = moduleToPlugin[moduleId];
      if (pluginId && !migratedPlugins.has(pluginId)) {
        migratedPlugins.add(pluginId);
        state.plugins[pluginId] = {
          state: 'active',
          activatedAt: moduleState.completedAt || new Date().toISOString(),
          migratedFrom: moduleId
        };
        console.log(`  ${moduleId} → ${pluginId}`);
      }
    }
  }

  saveState(state);
  console.log(`\nMigrated ${migratedPlugins.size} plugins from legacy modules.`);
}

// ─── Sidebar Builder ────────────────────────────────────────

const SIDEBAR_ORDER = [
  { id: 'core', route: '/', label: 'Dashboard', icon: 'layout-dashboard' },
  { id: 'comms-hub', route: '/comms', label: 'Communications', icon: 'inbox' },
  { id: 'content-engine', route: '/content-pipeline', label: 'Content', icon: 'pen-tool' },
  { id: 'content-engine', route: '/autopilot', label: 'Autopilot', icon: 'bot' },
  { id: 'outreach', route: '/outreach', label: 'Outreach', icon: 'send' },
  { id: 'entity-crm', route: '/entities', label: 'Entities', icon: 'users' },
  { id: 'gsd', route: '/gsd', label: 'GSD', icon: 'target' },
  { id: 'workflows', route: '/workflows', label: 'Workflows', icon: 'git-branch' },
  { id: 'presentations', route: '/presentations', label: 'Presentations', icon: 'presentation' },
  { id: 'video-studio', route: '/video-studio', label: 'Video', icon: 'film' },
  { id: 'contracts', route: '/contracts', label: 'Contracts', icon: 'file-signature' },
  { id: 'time-tracking', route: '/time-tracking', label: 'Time', icon: 'clock' },
  { id: 'screenpipe', route: '/brain-learning', label: 'Brain Learning', icon: 'eye' },
  { id: 'voice-ai', route: '/voice', label: 'Voice', icon: 'mic' },
  { id: 'core', route: '/integrations', label: 'Integrations', icon: 'plug' }
];

function rebuildSidebar(registry) {
  const activeRoutes = new Set(registry.routes.map(r => r.path));
  registry.sidebar = SIDEBAR_ORDER.filter(item => activeRoutes.has(item.route));
}

// ─── Status Display ─────────────────────────────────────────

function showStatus() {
  const state = loadState();
  const allPlugins = getAllPlugins();

  console.log('\nBizBrain OS Plugin Status');
  console.log('='.repeat(50));

  const groups = { active: [], inactive: [], disabled: [], error: [] };

  for (const [id, manifest] of Object.entries(allPlugins)) {
    const plugState = state.plugins && state.plugins[id];
    const status = plugState ? plugState.state : 'inactive';
    const group = groups[status] || groups.inactive;
    group.push({ id, name: manifest.name, icon: manifest.icon, category: manifest.category });
  }

  if (groups.active.length > 0) {
    console.log('\nActive:');
    groups.active.forEach(p => console.log(`  [x] ${p.name} (${p.id})`));
  }
  if (groups.inactive.length > 0) {
    console.log('\nAvailable:');
    groups.inactive.forEach(p => console.log(`  [ ] ${p.name} (${p.id}) — ${p.category}`));
  }
  if (groups.disabled.length > 0) {
    console.log('\nDisabled:');
    groups.disabled.forEach(p => console.log(`  [-] ${p.name} (${p.id})`));
  }
  if (groups.error.length > 0) {
    console.log('\nError:');
    groups.error.forEach(p => console.log(`  [!] ${p.name} (${p.id})`));
  }
}

function listPlugins() {
  const allPlugins = getAllPlugins();
  console.log('\nAvailable plugins:');
  for (const [id, manifest] of Object.entries(allPlugins)) {
    const deps = (manifest.dependencies || []).length > 0
      ? ` (requires: ${manifest.dependencies.join(', ')})`
      : '';
    const core = manifest.core ? ' [CORE]' : '';
    console.log(`  ${id}${core} — ${manifest.name}: ${manifest.description}${deps}`);
  }
}

// ─── CLI Interface ──────────────────────────────────────────

if (require.main === module) {
  const command = process.argv[2];
  const pluginId = process.argv[3];
  const flags = process.argv.slice(4);
  const hasClean = flags.includes('--clean');

  if (!command || command === '--help' || command === '-h') {
    console.log('BizBrain OS Plugin Manager');
    console.log('');
    console.log('Usage:');
    console.log('  node plugin-manager.js init                          Initialize starter plugins');
    console.log('  node plugin-manager.js activate <plugin-id>          Activate a plugin');
    console.log('  node plugin-manager.js deactivate <plugin-id>        Deactivate a plugin');
    console.log('  node plugin-manager.js deactivate <plugin-id> --clean Remove deployed files too');
    console.log('  node plugin-manager.js status                        Show plugin status');
    console.log('  node plugin-manager.js list                          List all plugins');
    console.log('  node plugin-manager.js check <plugin-id>             Check dependencies');
    console.log('  node plugin-manager.js migrate                       Migrate from legacy modules');
    process.exit(0);
  }

  switch (command) {
    case 'init':
      initFromProfile();
      break;
    case 'activate':
      if (!pluginId) { console.error('Provide a plugin ID.'); process.exit(1); }
      const configArg = flags.find(f => !f.startsWith('--'));
      activatePlugin(pluginId, configArg ? JSON.parse(configArg) : {});
      break;
    case 'deactivate':
      if (!pluginId) { console.error('Provide a plugin ID.'); process.exit(1); }
      deactivatePlugin(pluginId, { clean: hasClean });
      break;
    case 'status':
      showStatus();
      break;
    case 'list':
      listPlugins();
      break;
    case 'check':
      if (!pluginId) { console.error('Provide a plugin ID.'); process.exit(1); }
      const result = checkDependencies(pluginId);
      if (result.met) {
        console.log(`All dependencies met for ${pluginId}. Ready to activate.`);
      } else {
        console.log(`Missing dependencies for ${pluginId}: ${result.missing.join(', ')}`);
      }
      break;
    case 'migrate':
      migrateFromModules();
      break;
    default:
      console.error(`Unknown command: ${command}. Run with --help for usage.`);
      process.exit(1);
  }
}

module.exports = {
  activatePlugin,
  deactivatePlugin,
  loadPluginManifest,
  getAllPlugins,
  checkDependencies,
  initFromProfile,
  migrateFromModules,
  showStatus
};
