#!/usr/bin/env node
// Base Brain Generator - Creates the core folder structure from config

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const CONFIG_PATH = path.join(ROOT, 'config.json');
const STATE_PATH = path.join(ROOT, '.bizbrain', 'wizard', 'state.json');

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error('config.json not found. Run /setup first.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`  Created: ${path.relative(ROOT, dirPath)}`);
  }
}

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Wrote: ${path.relative(ROOT, filePath)}`);
}

function generate() {
  const config = loadConfig();
  const { profile, modules, preferences } = config;

  console.log(`\nGenerating BizBrain for: ${profile.businessName}`);
  console.log('='.repeat(50));

  // Core folders (always created)
  const coreFolders = [
    'Brand', 'Brand/assets', 'Brand/guidelines',
    'Knowledge',
    '_intake-dump',
    '_intake-dump/conversations',
    '_intake-dump/conversations/_live',
    '_intake-dump/conversations/_archive',
    '_intake-dump/email',
    '_intake-dump/slack'
  ];

  console.log('\nCore folders:');
  coreFolders.forEach(f => ensureDir(path.join(ROOT, f)));

  // Module-dependent folders
  const moduleConfigs = modules || {};

  if (moduleConfigs['client-tracking']) {
    console.log('\nClient tracking:');
    ensureDir(path.join(ROOT, 'Clients'));
    ensureDir(path.join(ROOT, 'Clients', '_templates'));
    copyTemplate('client', path.join(ROOT, 'Clients', '_templates'));
  }

  if (moduleConfigs['partner-tracking']) {
    console.log('\nPartner tracking:');
    ensureDir(path.join(ROOT, 'Partners'));
    ensureDir(path.join(ROOT, 'Partners', '_templates'));
    copyTemplate('partner', path.join(ROOT, 'Partners', '_templates'));
  }

  if (moduleConfigs['vendor-tracking']) {
    console.log('\nVendor tracking:');
    ensureDir(path.join(ROOT, 'Vendors'));
    ensureDir(path.join(ROOT, 'Vendors', '_templates'));
    copyTemplate('vendor', path.join(ROOT, 'Vendors', '_templates'));
  }

  if (moduleConfigs['gsd-full'] || moduleConfigs['gsd-light']) {
    console.log('\nProject management:');
    ensureDir(path.join(ROOT, 'Projects'));
    ensureDir(path.join(ROOT, 'Projects', '_templates'));
    copyTemplate('project', path.join(ROOT, 'Projects', '_templates'));
  }

  if (moduleConfigs['comms-hub']) {
    console.log('\nCommunications:');
    ['Communications', 'Communications/channels', 'Communications/history',
     'Communications/templates', 'Communications/profiles'].forEach(f =>
      ensureDir(path.join(ROOT, f))
    );
  }

  if (moduleConfigs['content-factory'] || moduleConfigs['video-studio'] || moduleConfigs['slideshow']) {
    console.log('\nContent:');
    ensureDir(path.join(ROOT, 'Assets'));
    ensureDir(path.join(ROOT, 'Assets/images'));
    ensureDir(path.join(ROOT, 'Assets/videos'));
    ensureDir(path.join(ROOT, 'Assets/slideshows'));
  }

  if (moduleConfigs['timesheet']) {
    console.log('\nTimesheet:');
    ensureDir(path.join(ROOT, 'Operations'));
    ensureDir(path.join(ROOT, 'Operations/timesheets'));
    ensureDir(path.join(ROOT, 'Operations/timesheets/logs'));
    ensureDir(path.join(ROOT, 'Operations/timesheets/exports'));
  }

  if (moduleConfigs['entity-watchdog']) {
    console.log('\nEntity Watchdog:');
    ensureDir(path.join(ROOT, 'Operations'));
    ensureDir(path.join(ROOT, 'Operations/entity-watchdog'));
    // Generate initial entity index
    writeFile(
      path.join(ROOT, 'Operations/entity-watchdog/ENTITY-INDEX.md'),
      generateEntityIndex(profile)
    );
  }

  if (moduleConfigs['automated-digests']) {
    console.log('\nAutomated Digests:');
    ensureDir(path.join(ROOT, 'Operations'));
    ensureDir(path.join(ROOT, 'Operations/digests'));
    ensureDir(path.join(ROOT, 'Operations/digests/weekly'));
    ensureDir(path.join(ROOT, 'Operations/digests/monthly'));
  }

  // Operations folder (for dev-config, todos, etc.)
  console.log('\nOperations:');
  ensureDir(path.join(ROOT, 'Operations'));
  ensureDir(path.join(ROOT, 'Operations/dev-config-system'));
  ensureDir(path.join(ROOT, 'Operations/dev-config-system/services'));
  ensureDir(path.join(ROOT, 'Operations/todos'));

  // .claude folders for agents, commands, hooks, knowledge
  console.log('\n.claude structure:');
  ensureDir(path.join(ROOT, '.claude'));
  ensureDir(path.join(ROOT, '.claude', 'agents'));
  ensureDir(path.join(ROOT, '.claude', 'commands'));
  ensureDir(path.join(ROOT, '.claude', 'hooks'));
  ensureDir(path.join(ROOT, '.claude', 'knowledge'));
  ensureDir(path.join(ROOT, '.claude', 'knowledge', 'systems'));
  ensureDir(path.join(ROOT, '.claude', 'knowledge', 'operations'));
  ensureDir(path.join(ROOT, '.claude', 'knowledge', 'reference'));

  // Generate brand-dna.json
  console.log('\nBrand config:');
  const brandDna = {
    name: profile.businessName,
    tagline: profile.description || '',
    colors: profile.brandColors || {
      primary: '#3B82F6',
      secondary: '#1E293B',
      accent: '#10B981'
    },
    logo: profile.logo || null,
    website: profile.website || null,
    owner: profile.userName,
    industry: profile.industry || '',
    type: profile.businessType || '',
    socialProfiles: profile.socialProfiles || {},
    generatedAt: new Date().toISOString()
  };
  writeFile(
    path.join(ROOT, 'Brand', 'brand-dna.json'),
    JSON.stringify(brandDna, null, 2)
  );

  // Generate CLAUDE.md
  console.log('\nCLAUDE.md:');
  const claudeMd = generateClaudeMd(config);
  writeFile(path.join(ROOT, 'CLAUDE.md'), claudeMd);

  // Generate active-todos scaffold
  writeFile(
    path.join(ROOT, 'Operations/todos/ACTIVE-TODOS.md'),
    generateActiveTodos(profile)
  );

  console.log('\n' + '='.repeat(50));
  console.log('Base Brain generated successfully!');
  console.log(`  Folders created for: ${Object.keys(moduleConfigs).filter(k => moduleConfigs[k]).join(', ')}`);
}

function copyTemplate(templateName, destDir) {
  const templateDir = path.join(ROOT, '.bizbrain', 'templates', templateName);
  if (fs.existsSync(templateDir)) {
    copyDirRecursive(templateDir, destDir);
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
      console.log(`  Copied: ${path.relative(ROOT, destPath)}`);
    }
  }
}

function generateClaudeMd(config) {
  const { profile, modules, preferences } = config;
  const activeModules = Object.keys(modules || {}).filter(k => modules[k]);

  const moduleList = activeModules.length > 0
    ? activeModules.map(m => `- ${m}`).join('\n')
    : '- No optional modules configured yet';

  const entitySection = modules['entity-watchdog'] ? `
---

## Entity Watchdog (ACTIVE)

**You MUST proactively watch every conversation for entity mentions and automatically maintain records.**

### Auto-Update (Do Immediately, Mention Briefly)
- New contact details -> update _context/contacts.md + _meta.json
- Title/role change -> update _context/contacts.md + _meta.json
- New interaction/meeting -> append to _context/history.md
- Action items mentioned -> add to _context/action-items.md
- New alias -> add to _meta.json aliases + update ENTITY-INDEX.md

### Ask First (Confirm Before Acting)
- New entity -> "I noticed [Name]. Should I create a record?"
- Type reclassification -> "Should I reclassify [entity]?"
- Status change -> "Should I mark [entity] as inactive?"

### Entity Index
\`Operations/entity-watchdog/ENTITY-INDEX.md\`
` : '';

  const timesheetSection = modules['timesheet'] ? `
---

## Time Tracking

Sessions are tracked via hooks.
- Logs: \`Operations/timesheets/logs/\`
- Use \`/hours\` for quick summary
- Use \`/timesheet\` for detailed breakdown
` : '';

  const gsdSection = (modules['gsd-full'] || modules['gsd-light']) ? `
---

## Project Management (GSD)

| Command | Purpose |
|---------|---------|
| \`/gsd\` | Show status and next action |
| \`/gsd new <project>\` | Initialize new project |
| \`/gsd plan\` | Plan current phase |
| \`/gsd execute\` | Execute with wave parallelization |
| \`/gsd status\` | Show progress |
` : '';

  return `# ${profile.businessName} - Business Brain

> Powered by BizBrain OS
> Owner: ${profile.userName}${profile.userRole ? ` (${profile.userRole})` : ''}
> Type: ${profile.businessType || 'Business'}
> Industry: ${profile.industry || 'General'}

---

## Quick Reference

| Item | Details |
|------|---------|
| **Business** | ${profile.businessName} |
| **Brain Location** | This folder |
| **Dashboard** | http://localhost:5555 |
| **Conversations** | Use the BizBrain-Conversations folder |

---

## Active Modules

${moduleList}

---

## Communication Style

Preferred style: **${preferences?.commStyle || 'professional'}**

${preferences?.commStyle === 'casual' ? 'Use relaxed language, contractions, and a friendly tone.' : ''}
${preferences?.commStyle === 'technical' ? 'Use precise technical language, include code snippets and implementation details.' : ''}
${preferences?.commStyle === 'professional' ? 'Use clear, professional language with appropriate detail.' : ''}

---

## Commands

| Command | Description |
|---------|-------------|
| \`/help\` | See all available commands |
| \`/knowledge <topic>\` | Load specific documentation |
| \`/status\` | Business status dashboard |
| \`/setup <module>\` | Configure a module |
${modules['client-tracking'] ? '| `/client <name>` | Look up or add a client |\n' : ''}${modules['timesheet'] ? '| `/hours` | Quick time summary |\n' : ''}${modules['gsd-full'] || modules['gsd-light'] ? '| `/gsd` | Project management |\n' : ''}${modules['entity-watchdog'] ? '| `/entity <name>` | Look up any entity |\n' : ''}
---

## Folder Structure

\`\`\`
${profile.businessName}/
  .bizbrain/          # BizBrain OS system (don't edit)
  .claude/            # Claude Code configuration
  Brand/              # Brand assets and guidelines
  Knowledge/          # Documentation and reference
  _intake-dump/       # Incoming content processing
  Operations/         # Operational systems
${modules['client-tracking'] ? '  Clients/            # Client records\n' : ''}${modules['partner-tracking'] ? '  Partners/           # Partner records\n' : ''}${modules['vendor-tracking'] ? '  Vendors/            # Vendor records\n' : ''}${modules['gsd-full'] || modules['gsd-light'] ? '  Projects/           # Project workspaces\n' : ''}${modules['comms-hub'] ? '  Communications/     # Communication channels\n' : ''}${modules['content-factory'] || modules['video-studio'] || modules['slideshow'] ? '  Assets/             # Generated content\n' : ''}\`\`\`
${entitySection}${timesheetSection}${gsdSection}
---

## Updating

Run \`git pull\` in the .bizbrain folder to get the latest BizBrain OS updates.
Your personal data (clients, projects, etc.) is never affected by updates.

---

*Generated by BizBrain OS Setup Wizard*
*Last updated: ${new Date().toISOString()}*
`;
}

function generateEntityIndex(profile) {
  return `# Entity Index

> Auto-maintained by Entity Watchdog
> Last updated: ${new Date().toISOString()}

---

## Clients

| Name | Aliases | Type | Status | Primary Contact |
|------|---------|------|--------|-----------------|
| (none yet) | | | | |

## Partners

| Name | Aliases | Type | Status | Primary Contact |
|------|---------|------|--------|-----------------|
| (none yet) | | | | |

## Vendors

| Name | Aliases | Type | Status | Primary Contact |
|------|---------|------|--------|-----------------|
| (none yet) | | | | |

## People

| Name | Aliases | Entity | Role | Contact |
|------|---------|--------|------|---------|
| ${profile.userName} | | (owner) | ${profile.userRole || 'Owner'} | |

---

*Entity Watchdog monitors all conversations for new entity information.*
*See \`Operations/entity-watchdog/\` for watchdog configuration.*
`;
}

function generateActiveTodos(profile) {
  return `# Active Todos - ${profile.businessName}

> Unified task tracker
> Last synced: ${new Date().toISOString()}

---

## High Priority


## Normal Priority

- [ ] OP-001: Complete BizBrain module setup (run /setup for remaining modules)

## Low Priority


---

*Use \`/todo add <task>\` to add items. Use \`/todo done <id>\` to complete.*
`;
}

// Run
generate();
