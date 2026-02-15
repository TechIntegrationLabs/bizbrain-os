#!/usr/bin/env node
// Module Activator - Enables a module by deploying its assets

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const BIZBRAIN = path.join(ROOT, '.bizbrain');
const MODULES_DIR = path.join(BIZBRAIN, 'modules');
const STATE_PATH = path.join(BIZBRAIN, 'wizard', 'state.json');

function loadModuleDefinition(moduleId) {
  // Check in _core/ first, then root modules/
  const corePath = path.join(MODULES_DIR, '_core', `${moduleId}.json`);
  const mainPath = path.join(MODULES_DIR, `${moduleId}.json`);

  const modPath = fs.existsSync(corePath) ? corePath : mainPath;
  if (!fs.existsSync(modPath)) {
    console.error(`Module not found: ${moduleId}`);
    console.error(`  Checked: ${corePath}`);
    console.error(`  Checked: ${mainPath}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(modPath, 'utf8'));
}

function loadState() {
  if (fs.existsSync(STATE_PATH)) {
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  }
  return { stage: 'modules', modules: {} };
}

function saveState(state) {
  const dir = path.dirname(STATE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), 'utf8');
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function checkDependencies(moduleId) {
  const modDef = loadModuleDefinition(moduleId);
  if (!modDef) return { met: false, missing: ['module-not-found'] };

  const deps = modDef.dependencies || [];
  if (deps.length === 0) return { met: true, missing: [] };

  const state = loadState();
  const missing = deps.filter(dep => {
    const modState = state.modules && state.modules[dep];
    return !modState || modState.status !== 'configured';
  });

  return { met: missing.length === 0, missing };
}

function activateModule(moduleId, moduleConfig) {
  const modDef = loadModuleDefinition(moduleId);
  if (!modDef) return false;

  // Check dependencies
  const depCheck = checkDependencies(moduleId);
  if (!depCheck.met) {
    console.error(`\nCannot activate ${modDef.name}: missing dependencies`);
    console.error(`  Required: ${depCheck.missing.join(', ')}`);
    console.error('  Configure those modules first.');
    return false;
  }

  const generates = modDef.generates || {};

  console.log(`\nActivating module: ${modDef.name}`);
  console.log(`  ${modDef.description}`);
  console.log('-'.repeat(40));

  // Create folders
  if (generates.folders) {
    generates.folders.forEach(folder => {
      const fullPath = path.join(ROOT, folder);
      ensureDir(fullPath);
      console.log(`  Folder: ${folder}`);
    });
  }

  // Deploy agents
  if (generates.agents) {
    generates.agents.forEach(agent => {
      // Look for agent in bizbrain agents directories
      const agentDirs = ['_core', '_dev', '_comms', '_content', '_integrations'];
      let found = false;
      for (const dir of agentDirs) {
        const src = path.join(BIZBRAIN, 'agents', dir, `${agent}.md`);
        if (fs.existsSync(src)) {
          const destDir = path.join(ROOT, '.claude', 'agents');
          ensureDir(destDir);
          fs.copyFileSync(src, path.join(destDir, `${agent}.md`));
          console.log(`  Agent: ${agent}`);
          found = true;
          break;
        }
      }
      if (!found) {
        console.log(`  Agent: ${agent} (source not found, will be created during module setup)`);
      }
    });
  }

  // Deploy commands
  if (generates.commands) {
    generates.commands.forEach(cmd => {
      const cmdDirs = ['_core', '_dev', '_entity', '_integration', '_content'];
      let found = false;
      for (const dir of cmdDirs) {
        const src = path.join(BIZBRAIN, 'commands', dir, `${cmd}.md`);
        if (fs.existsSync(src)) {
          const destDir = path.join(ROOT, '.claude', 'commands');
          ensureDir(destDir);
          fs.copyFileSync(src, path.join(destDir, `${cmd}.md`));
          console.log(`  Command: /${cmd}`);
          found = true;
          break;
        }
      }
      if (!found) {
        console.log(`  Command: /${cmd} (source not found, will be created during module setup)`);
      }
    });
  }

  // Deploy hooks
  if (generates.hooks) {
    generates.hooks.forEach(hook => {
      const hookExts = ['.sh', '.ps1', '.js'];
      hookExts.forEach(ext => {
        const src = path.join(BIZBRAIN, 'hooks', `${hook}${ext}`);
        if (fs.existsSync(src)) {
          const destDir = path.join(ROOT, '.claude', 'hooks');
          ensureDir(destDir);
          fs.copyFileSync(src, path.join(destDir, `${hook}${ext}`));
          console.log(`  Hook: ${hook}${ext}`);
        }
      });
    });
  }

  // Deploy knowledge
  if (generates.knowledge) {
    generates.knowledge.forEach(kb => {
      const kbDirs = ['systems', 'operations', 'reference'];
      let found = false;
      for (const dir of kbDirs) {
        const src = path.join(BIZBRAIN, 'knowledge', dir, kb);
        if (fs.existsSync(src)) {
          const destDir = path.join(ROOT, '.claude', 'knowledge', dir);
          ensureDir(destDir);
          fs.copyFileSync(src, path.join(destDir, kb));
          console.log(`  Knowledge: ${dir}/${kb}`);
          found = true;
          break;
        }
      }
      if (!found) {
        console.log(`  Knowledge: ${kb} (source not found, will be created during module setup)`);
      }
    });
  }

  // Deploy templates
  if (generates.templates) {
    generates.templates.forEach(tmpl => {
      const src = path.join(BIZBRAIN, 'templates', tmpl);
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

  // Note MCP configs (these are merged by the module wizard, not copied directly)
  if (generates.mcpConfigs) {
    generates.mcpConfigs.forEach(mcp => {
      const src = path.join(BIZBRAIN, 'mcp-configs', 'registry', mcp);
      if (fs.existsSync(src)) {
        console.log(`  MCP Config: ${mcp} (will be merged into settings.json)`);
      } else {
        console.log(`  MCP Config: ${mcp} (config will be created during setup)`);
      }
    });
  }

  // Update state
  const state = loadState();
  if (!state.modules) state.modules = {};
  state.modules[moduleId] = {
    status: 'configured',
    completedAt: new Date().toISOString(),
    config: moduleConfig || {}
  };

  // Check if any locked modules can now be unlocked
  const allModules = getAllModuleDefinitions();
  for (const [id, mod] of Object.entries(allModules)) {
    if (state.modules[id] && state.modules[id].status === 'locked') {
      const deps = mod.dependencies || [];
      const allDepsConfigured = deps.every(dep =>
        state.modules[dep] && state.modules[dep].status === 'configured'
      );
      if (allDepsConfigured) {
        state.modules[id].status = 'ready';
        console.log(`  Unlocked: ${mod.name} (dependencies now met)`);
      }
    }
  }

  saveState(state);
  console.log(`\n${modDef.name} activated successfully!`);
  return true;
}

function deactivateModule(moduleId) {
  const state = loadState();
  if (!state.modules || !state.modules[moduleId]) {
    console.error(`Module ${moduleId} is not active.`);
    return false;
  }

  // Check if other modules depend on this one
  const allModules = getAllModuleDefinitions();
  const dependents = [];
  for (const [id, mod] of Object.entries(allModules)) {
    if (state.modules[id] && state.modules[id].status === 'configured') {
      const deps = mod.dependencies || [];
      if (deps.includes(moduleId)) {
        dependents.push(id);
      }
    }
  }

  if (dependents.length > 0) {
    console.error(`\nCannot deactivate ${moduleId}: other modules depend on it`);
    console.error(`  Dependents: ${dependents.join(', ')}`);
    return false;
  }

  state.modules[moduleId].status = 'skipped';
  state.modules[moduleId].deactivatedAt = new Date().toISOString();
  saveState(state);

  console.log(`Module ${moduleId} deactivated.`);
  console.log('Note: Deployed files (agents, commands, etc.) were not removed.');
  console.log('Run with --clean flag to also remove deployed files.');
  return true;
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

function getAllModuleDefinitions() {
  const modules = {};

  // Read _core modules
  const coreDir = path.join(MODULES_DIR, '_core');
  if (fs.existsSync(coreDir)) {
    fs.readdirSync(coreDir).filter(f => f.endsWith('.json')).forEach(f => {
      try {
        const mod = JSON.parse(fs.readFileSync(path.join(coreDir, f), 'utf8'));
        modules[mod.id] = mod;
      } catch (e) {
        console.error(`  Warning: Could not parse ${f}: ${e.message}`);
      }
    });
  }

  // Read optional modules
  if (fs.existsSync(MODULES_DIR)) {
    fs.readdirSync(MODULES_DIR).filter(f => f.endsWith('.json')).forEach(f => {
      try {
        const mod = JSON.parse(fs.readFileSync(path.join(MODULES_DIR, f), 'utf8'));
        modules[mod.id] = mod;
      } catch (e) {
        console.error(`  Warning: Could not parse ${f}: ${e.message}`);
      }
    });
  }

  return modules;
}

function showStatus() {
  const state = loadState();
  const allModules = getAllModuleDefinitions();

  console.log('\nBizBrain Module Status');
  console.log('='.repeat(50));

  const statuses = { configured: [], ready: [], locked: [], skipped: [] };

  for (const [id, mod] of Object.entries(allModules)) {
    const modState = state.modules && state.modules[id];
    const status = modState ? modState.status : 'not-installed';
    if (statuses[status]) {
      statuses[status].push({ id, name: mod.name });
    }
  }

  if (statuses.configured.length > 0) {
    console.log('\nConfigured:');
    statuses.configured.forEach(m => console.log(`  [x] ${m.name} (${m.id})`));
  }
  if (statuses.ready.length > 0) {
    console.log('\nReady to configure:');
    statuses.ready.forEach(m => console.log(`  [ ] ${m.name} (${m.id})`));
  }
  if (statuses.locked.length > 0) {
    console.log('\nLocked (needs dependencies):');
    statuses.locked.forEach(m => {
      const mod = allModules[m.id];
      const deps = (mod.dependencies || []).join(', ');
      console.log(`  [!] ${m.name} (${m.id}) - needs: ${deps}`);
    });
  }
  if (statuses.skipped.length > 0) {
    console.log('\nSkipped:');
    statuses.skipped.forEach(m => console.log(`  [-] ${m.name} (${m.id})`));
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  const moduleId = process.argv[3];

  if (!command || command === '--help') {
    console.log('Module Activator - Enable, disable, and manage BizBrain modules');
    console.log('');
    console.log('Usage:');
    console.log('  node module-activator.js activate <module-id> [config-json]');
    console.log('  node module-activator.js deactivate <module-id>');
    console.log('  node module-activator.js status');
    console.log('  node module-activator.js check <module-id>  (check dependencies)');
    console.log('  node module-activator.js list               (list all modules)');
    console.log('');
    console.log('Legacy usage (backward compatible):');
    console.log('  node module-activator.js <module-id> [config-json]');
    process.exit(0);
  }

  if (command === 'status') {
    showStatus();
  } else if (command === 'list') {
    const modules = getAllModuleDefinitions();
    console.log('\nAvailable modules:');
    Object.entries(modules).forEach(([id, mod]) => {
      const deps = (mod.dependencies || []).length > 0 ? ` (requires: ${mod.dependencies.join(', ')})` : '';
      console.log(`  ${id} - ${mod.name}: ${mod.description}${deps}`);
    });
  } else if (command === 'check') {
    if (!moduleId) {
      console.error('Provide a module ID to check.');
      process.exit(1);
    }
    const result = checkDependencies(moduleId);
    if (result.met) {
      console.log(`All dependencies met for ${moduleId}. Ready to activate.`);
    } else {
      console.log(`Missing dependencies for ${moduleId}: ${result.missing.join(', ')}`);
    }
  } else if (command === 'activate') {
    if (!moduleId) {
      console.error('Provide a module ID to activate.');
      process.exit(1);
    }
    const configArg = process.argv[4];
    const config = configArg ? JSON.parse(configArg) : {};
    activateModule(moduleId, config);
  } else if (command === 'deactivate') {
    if (!moduleId) {
      console.error('Provide a module ID to deactivate.');
      process.exit(1);
    }
    deactivateModule(moduleId);
  } else {
    // Legacy: treat first arg as module ID
    const configArg = process.argv[3];
    const config = configArg ? JSON.parse(configArg) : {};
    activateModule(command, config);
  }
}

module.exports = { activateModule, deactivateModule, loadModuleDefinition, getAllModuleDefinitions, checkDependencies };
