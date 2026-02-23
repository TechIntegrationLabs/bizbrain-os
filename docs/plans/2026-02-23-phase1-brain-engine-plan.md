# Phase 1: Brain Engine MVP — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the core BizBrain OS Claude Code plugin that bootstraps a brain folder, injects context on every session, and continuously learns from conversations.

**Architecture:** Claude Code plugin with SessionStart hook for context injection, brain-bootstrap skill for onboarding, and PostToolUse prompt hook for continuous learning. All observations are write-through (no dependence on SessionEnd). Cross-platform via polyglot .cmd wrapper.

**Tech Stack:** Claude Code plugin system (markdown, JSON, bash), Node.js for generators (porting existing `base-brain.js`)

**Repo:** `C:\Users\Disruptors\Repos\bizbrain-os-plugin\` (new repo, separate from standalone app)

**Design Doc:** `../2026-02-23-claude-code-plugin-design.md`

---

## Task 1: Create Plugin Skeleton

**Files:**
- Create: `bizbrain-os-plugin/.claude-plugin/plugin.json`
- Create: `bizbrain-os-plugin/.claude-plugin/marketplace.json`
- Create: `bizbrain-os-plugin/.gitignore`

**Step 1: Create repo and directory structure**

```bash
mkdir -p ~/Repos/bizbrain-os-plugin/.claude-plugin
mkdir -p ~/Repos/bizbrain-os-plugin/commands
mkdir -p ~/Repos/bizbrain-os-plugin/agents
mkdir -p ~/Repos/bizbrain-os-plugin/skills
mkdir -p ~/Repos/bizbrain-os-plugin/hooks/scripts
mkdir -p ~/Repos/bizbrain-os-plugin/profiles
mkdir -p ~/Repos/bizbrain-os-plugin/scripts
mkdir -p ~/Repos/bizbrain-os-plugin/lib
cd ~/Repos/bizbrain-os-plugin && git init
```

**Step 2: Write plugin.json**

```json
{
  "name": "bizbrain-os",
  "version": "1.0.0",
  "description": "The AI context layer that teaches Claude your business. Scans your machine, builds a persistent knowledge brain, and compounds context across every session.",
  "author": {
    "name": "Tech Integration Labs",
    "email": "hello@techintegrationlabs.com",
    "url": "https://bizbrain.os"
  },
  "repository": "https://github.com/TechIntegrationLabs/bizbrain-os-plugin",
  "license": "AGPL-3.0",
  "keywords": ["business", "context", "knowledge-management", "productivity", "crm", "project-management"]
}
```

**Step 3: Write marketplace.json**

```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "bizbrain-marketplace",
  "owner": {
    "name": "Tech Integration Labs",
    "email": "hello@techintegrationlabs.com"
  },
  "plugins": [
    {
      "name": "bizbrain-os",
      "description": "The AI context layer that teaches Claude your business",
      "version": "1.0.0",
      "author": { "name": "Tech Integration Labs" },
      "source": "./",
      "category": "productivity"
    }
  ]
}
```

**Step 4: Write .gitignore**

```
node_modules/
.DS_Store
Thumbs.db
*.log
```

**Step 5: Commit**

```bash
cd ~/Repos/bizbrain-os-plugin
git add -A
git commit -m "feat: plugin skeleton with manifest and directory structure"
```

---

## Task 2: Cross-Platform Hook Infrastructure

**Files:**
- Create: `hooks/hooks.json`
- Create: `hooks/run-hook.cmd`

**Step 1: Write run-hook.cmd**

Port the proven polyglot wrapper from superpowers (handles Windows CMD → Git Bash, Unix native):

```cmd
: << 'CMDBLOCK'
@echo off
REM Cross-platform polyglot wrapper for BizBrain OS hook scripts.
REM On Windows: cmd.exe runs the batch portion, which finds and calls bash.
REM On Unix: the shell interprets this as a script (: is a no-op in bash).
REM
REM Hook scripts use extensionless filenames so Claude Code's Windows
REM auto-detection (which prepends "bash" to .sh commands) doesn't interfere.
REM
REM Usage: run-hook.cmd <script-name> [args...]

if "%~1"=="" (
    echo run-hook.cmd: missing script name >&2
    exit /b 1
)

set "HOOK_DIR=%~dp0"

REM Try Git for Windows bash in standard locations
if exist "C:\Program Files\Git\bin\bash.exe" (
    "C:\Program Files\Git\bin\bash.exe" "%HOOK_DIR%%~1" %2 %3 %4 %5 %6 %7 %8 %9
    exit /b %ERRORLEVEL%
)
if exist "C:\Program Files (x86)\Git\bin\bash.exe" (
    "C:\Program Files (x86)\Git\bin\bash.exe" "%HOOK_DIR%%~1" %2 %3 %4 %5 %6 %7 %8 %9
    exit /b %ERRORLEVEL%
)

REM Try bash on PATH
where bash >nul 2>nul
if %ERRORLEVEL% equ 0 (
    bash "%HOOK_DIR%%~1" %2 %3 %4 %5 %6 %7 %8 %9
    exit /b %ERRORLEVEL%
)

REM No bash found — exit silently (plugin still works, just without hook features)
exit /b 0
CMDBLOCK

# Unix: run the named script directly
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPT_NAME="$1"
shift
exec bash "${SCRIPT_DIR}/${SCRIPT_NAME}" "$@"
```

**Step 2: Write hooks.json**

```json
{
  "description": "BizBrain OS hooks — brain context injection, continuous learning, session management",
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "'${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd' session-start",
            "async": false
          }
        ]
      }
    ]
  }
}
```

Note: We start with only SessionStart. PostToolUse and other hooks are added in later tasks.

**Step 3: Commit**

```bash
git add hooks/run-hook.cmd hooks/hooks.json
git commit -m "feat: cross-platform hook infrastructure with polyglot wrapper"
```

---

## Task 3: Profile System & Default Configs

**Files:**
- Create: `profiles/developer.json`
- Create: `profiles/content-creator.json`
- Create: `profiles/consultant.json`
- Create: `profiles/agency.json`
- Create: `profiles/personal.json`
- Create: `lib/default-config.json`
- Create: `lib/folder-structure.json`

**Step 1: Write developer profile (fully fleshed out)**

```json
{
  "id": "developer",
  "name": "Developer / Technical Solopreneur",
  "description": "Software developer, indie hacker, or technical founder. Manages code projects, clients, and technical knowledge.",
  "icon": "code",
  "features": {
    "entity_management": true,
    "project_tracking": true,
    "gsd_workflow": true,
    "knowledge_management": true,
    "time_tracking": true,
    "credential_management": true,
    "mcp_management": true,
    "todo_management": true,
    "intake_processing": true,
    "communications": false,
    "content_pipeline": false,
    "outreach_engine": false,
    "session_archiving": true
  },
  "auto_behaviors": {
    "entity_detection": "auto_update",
    "action_item_extraction": "auto_update",
    "project_status_tracking": "auto_update",
    "credential_detection": "ask_first",
    "time_tracking": "auto_update"
  },
  "scan_targets": {
    "code_projects": true,
    "documents": true,
    "git_history": true,
    "package_managers": true,
    "service_configs": true,
    "social_profiles": false,
    "email_exports": false
  },
  "scan_paths": {
    "code": ["~/Repos", "~/Projects", "~/Code", "~/src", "~/dev", "~/workspace"],
    "documents": ["~/Documents"],
    "recent": ["~/Desktop", "~/Downloads"]
  },
  "recommended_integrations": ["github", "supabase", "stripe", "notion", "slack"],
  "recommended_mcps": ["github", "supabase"]
}
```

**Step 2: Write skeleton profiles for other types**

Each of the remaining profiles (content-creator, consultant, agency, personal) follows the same schema but with different `features`, `auto_behaviors`, `scan_targets`, and `recommended_integrations` values. These are placeholders — minimal but valid:

`profiles/content-creator.json`:
```json
{
  "id": "content-creator",
  "name": "Content Creator",
  "description": "Blogger, YouTuber, social media creator, or writer. Manages content pipelines, publishing schedules, and audience engagement.",
  "icon": "pen-tool",
  "features": {
    "entity_management": true,
    "project_tracking": true,
    "gsd_workflow": false,
    "knowledge_management": true,
    "time_tracking": true,
    "credential_management": true,
    "mcp_management": true,
    "todo_management": true,
    "intake_processing": true,
    "communications": true,
    "content_pipeline": true,
    "outreach_engine": true,
    "session_archiving": true
  },
  "auto_behaviors": {
    "entity_detection": "auto_update",
    "action_item_extraction": "auto_update",
    "project_status_tracking": "auto_update",
    "credential_detection": "ask_first",
    "time_tracking": "auto_update"
  },
  "scan_targets": {
    "code_projects": false,
    "documents": true,
    "git_history": false,
    "package_managers": false,
    "service_configs": true,
    "social_profiles": true,
    "email_exports": true
  },
  "scan_paths": {
    "code": [],
    "documents": ["~/Documents", "~/Creative", "~/Content"],
    "recent": ["~/Desktop", "~/Downloads"]
  },
  "recommended_integrations": ["youtube", "twitter", "linkedin", "notion", "slack"],
  "recommended_mcps": ["notion"]
}
```

`profiles/consultant.json`:
```json
{
  "id": "consultant",
  "name": "Consultant / Freelancer",
  "description": "Consultant, freelancer, or service provider. Manages client relationships, proposals, contracts, and timesheets.",
  "icon": "briefcase",
  "features": {
    "entity_management": true,
    "project_tracking": true,
    "gsd_workflow": true,
    "knowledge_management": true,
    "time_tracking": true,
    "credential_management": true,
    "mcp_management": true,
    "todo_management": true,
    "intake_processing": true,
    "communications": true,
    "content_pipeline": false,
    "outreach_engine": false,
    "session_archiving": true
  },
  "auto_behaviors": {
    "entity_detection": "auto_update",
    "action_item_extraction": "auto_update",
    "project_status_tracking": "auto_update",
    "credential_detection": "ask_first",
    "time_tracking": "auto_update"
  },
  "scan_targets": {
    "code_projects": true,
    "documents": true,
    "git_history": true,
    "package_managers": false,
    "service_configs": true,
    "social_profiles": false,
    "email_exports": true
  },
  "scan_paths": {
    "code": ["~/Repos", "~/Projects"],
    "documents": ["~/Documents"],
    "recent": ["~/Desktop", "~/Downloads"]
  },
  "recommended_integrations": ["gmail", "notion", "slack", "stripe", "github"],
  "recommended_mcps": ["notion", "github"]
}
```

`profiles/agency.json`:
```json
{
  "id": "agency",
  "name": "Agency Owner",
  "description": "Agency owner managing multiple clients, projects, team members, and deliverables. All features active.",
  "icon": "building",
  "features": {
    "entity_management": true,
    "project_tracking": true,
    "gsd_workflow": true,
    "knowledge_management": true,
    "time_tracking": true,
    "credential_management": true,
    "mcp_management": true,
    "todo_management": true,
    "intake_processing": true,
    "communications": true,
    "content_pipeline": true,
    "outreach_engine": true,
    "session_archiving": true
  },
  "auto_behaviors": {
    "entity_detection": "auto_update",
    "action_item_extraction": "auto_update",
    "project_status_tracking": "auto_update",
    "credential_detection": "ask_first",
    "time_tracking": "auto_update"
  },
  "scan_targets": {
    "code_projects": true,
    "documents": true,
    "git_history": true,
    "package_managers": true,
    "service_configs": true,
    "social_profiles": true,
    "email_exports": true
  },
  "scan_paths": {
    "code": ["~/Repos", "~/Projects", "~/Code"],
    "documents": ["~/Documents"],
    "recent": ["~/Desktop", "~/Downloads"]
  },
  "recommended_integrations": ["github", "gmail", "slack", "notion", "stripe", "supabase"],
  "recommended_mcps": ["github", "notion", "slack"]
}
```

`profiles/personal.json`:
```json
{
  "id": "personal",
  "name": "Personal / Life Organizer",
  "description": "Anyone who wants to organize their work, knowledge, and tasks with AI assistance. Minimal setup, maximum utility.",
  "icon": "user",
  "features": {
    "entity_management": false,
    "project_tracking": true,
    "gsd_workflow": false,
    "knowledge_management": true,
    "time_tracking": false,
    "credential_management": true,
    "mcp_management": true,
    "todo_management": true,
    "intake_processing": true,
    "communications": false,
    "content_pipeline": false,
    "outreach_engine": false,
    "session_archiving": true
  },
  "auto_behaviors": {
    "entity_detection": "off",
    "action_item_extraction": "auto_update",
    "project_status_tracking": "auto_update",
    "credential_detection": "ask_first",
    "time_tracking": "off"
  },
  "scan_targets": {
    "code_projects": false,
    "documents": true,
    "git_history": false,
    "package_managers": false,
    "service_configs": false,
    "social_profiles": false,
    "email_exports": false
  },
  "scan_paths": {
    "code": [],
    "documents": ["~/Documents"],
    "recent": ["~/Desktop", "~/Downloads"]
  },
  "recommended_integrations": ["notion"],
  "recommended_mcps": ["notion"]
}
```

**Step 3: Write lib/default-config.json**

This is the brain's `config.json` template — generated during bootstrap:

```json
{
  "version": "1.0.0",
  "profile_id": "",
  "profile": {
    "userName": "",
    "businessName": "",
    "businessType": "",
    "industry": "",
    "description": ""
  },
  "preferences": {
    "commStyle": "professional",
    "brainPath": ""
  },
  "features": {},
  "auto_behaviors": {},
  "integrations": {},
  "scan_cache": {
    "lastScanAt": null,
    "projectCount": 0,
    "entityCount": 0,
    "serviceCount": 0
  }
}
```

**Step 4: Write lib/folder-structure.json**

Defines every folder in the brain, which feature requires it, and a description:

```json
{
  "version": "1.0.0",
  "core": [
    { "path": "Knowledge", "description": "Documentation, references, and accumulated knowledge" },
    { "path": "Knowledge/systems", "description": "How your systems and processes work" },
    { "path": "Knowledge/decisions", "description": "Key decisions and their rationale" },
    { "path": "Knowledge/templates", "description": "Reusable templates" },
    { "path": "Knowledge/references", "description": "External references and bookmarks" },
    { "path": "_intake-dump", "description": "Drop zone for files to be processed" },
    { "path": "_intake-dump/conversations", "description": "Auto-captured conversation transcripts" },
    { "path": "_intake-dump/files", "description": "PDFs, docs, images to be processed" },
    { "path": "Operations", "description": "System operations and configuration" },
    { "path": "Operations/credentials", "description": "API keys and secrets (local only)" },
    { "path": "Operations/learning", "description": "Brain observations and patterns" },
    { "path": "Operations/learning/sessions", "description": "Per-session activity logs" },
    { "path": "Operations/integrations", "description": "Connected service configurations" },
    { "path": ".bizbrain", "description": "Plugin state (managed by BizBrain OS)" }
  ],
  "features": {
    "entity_management": [
      { "path": "Entities", "description": "People and organizations" },
      { "path": "Entities/Clients", "description": "Client records" },
      { "path": "Entities/Partners", "description": "Partner records" },
      { "path": "Entities/Vendors", "description": "Vendor records" },
      { "path": "Entities/People", "description": "Individual contacts" }
    ],
    "project_tracking": [
      { "path": "Projects", "description": "Project workspaces" }
    ],
    "todo_management": [
      { "path": "Operations/todos", "description": "Aggregated task tracking" }
    ],
    "time_tracking": [
      { "path": "Operations/timesheets", "description": "Time tracking" },
      { "path": "Operations/timesheets/logs", "description": "Session time logs" }
    ],
    "mcp_management": [
      { "path": "Operations/mcp-configs", "description": "MCP configuration profiles" },
      { "path": "Operations/mcp-configs/profiles", "description": "Named MCP profiles" }
    ],
    "communications": [
      { "path": "Communications", "description": "Communication channels and history" }
    ],
    "content_pipeline": [
      { "path": "Content", "description": "Content pipeline and drafts" }
    ]
  }
}
```

**Step 5: Commit**

```bash
git add profiles/ lib/
git commit -m "feat: profile system with 5 profiles and brain folder structure definitions"
```

---

## Task 4: SessionStart Hook — Brain Detection & Context Injection

**Files:**
- Create: `hooks/scripts/session-start` (extensionless bash script)
- Create: `scripts/generate-context.js` (Node.js CLAUDE.md generator, ported from base-brain.js)

This is the most critical piece — it runs on EVERY session and injects brain context.

**Step 1: Write scripts/generate-context.js**

This Node.js script reads the brain's `config.json` and generates a compressed context string for injection. Ported and adapted from the existing `base-brain.js:generateClaudeMd()`.

```javascript
#!/usr/bin/env node
// BizBrain OS — Context Generator
// Reads brain config.json + state and outputs a context string for SessionStart injection.
// Usage: node generate-context.js <brain-path>

const fs = require('fs');
const path = require('path');

const brainPath = process.argv[2];
if (!brainPath) {
  console.error('Usage: node generate-context.js <brain-path>');
  process.exit(1);
}

const configPath = path.join(brainPath, 'config.json');
if (!fs.existsSync(configPath)) {
  // No brain configured yet — output bootstrap prompt
  const output = [
    '# BizBrain OS',
    '',
    'Brain not yet configured. Run `/brain setup` to scan your machine and create your knowledge brain.',
    '',
    '## Available Commands',
    '| Command | Description |',
    '|---------|-------------|',
    '| `/brain setup` | First-time setup: scan machine, pick profile, create brain |',
    '| `/brain status` | Show brain status and statistics |',
  ].join('\n');
  process.stdout.write(output);
  process.exit(0);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const { profile, features, auto_behaviors, preferences, scan_cache } = config;

// Read state if it exists
const statePath = path.join(brainPath, '.bizbrain', 'state.json');
let state = {};
if (fs.existsSync(statePath)) {
  try { state = JSON.parse(fs.readFileSync(statePath, 'utf8')); } catch(e) {}
}

// Read entity index summary (first 50 lines)
let entitySummary = '';
const entityIndexPath = path.join(brainPath, 'Entities', 'People', 'ENTITY-INDEX.md');
if (fs.existsSync(entityIndexPath)) {
  const content = fs.readFileSync(entityIndexPath, 'utf8');
  const lines = content.split('\n').slice(0, 60);
  entitySummary = lines.join('\n');
}

// Read recent action items (top 10 across all sources)
let actionItems = [];
const todosPath = path.join(brainPath, 'Operations', 'todos', 'aggregated-todos.json');
if (fs.existsSync(todosPath)) {
  try {
    const todos = JSON.parse(fs.readFileSync(todosPath, 'utf8'));
    actionItems = (todos.items || []).filter(t => !t.completed).slice(0, 10);
  } catch(e) {}
}

// Read active projects
let projects = [];
const projectsDir = path.join(brainPath, 'Projects');
if (fs.existsSync(projectsDir)) {
  const entries = fs.readdirSync(projectsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('_')) {
      const metaPath = path.join(projectsDir, entry.name, '_meta.json');
      if (fs.existsSync(metaPath)) {
        try {
          const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
          projects.push({ name: entry.name, ...meta });
        } catch(e) {
          projects.push({ name: entry.name, status: 'unknown' });
        }
      } else {
        projects.push({ name: entry.name, status: 'unknown' });
      }
    }
  }
}

// Build the active features list
const activeFeatures = Object.entries(features || {})
  .filter(([k, v]) => v)
  .map(([k]) => k.replace(/_/g, ' '));

// Build commands table based on active features
const commands = [
  ['`/brain`', 'Brain status, scan, configure, profiles'],
  ['`/knowledge <topic>`', 'Load specific brain knowledge'],
  ['`/todo`', 'View and manage tasks'],
];
if (features?.entity_management) {
  commands.push(['`/entity <name>`', 'Look up or add an entity']);
}
if (features?.gsd_workflow) {
  commands.push(['`/gsd`', 'Project management workflow']);
}
if (features?.time_tracking) {
  commands.push(['`/hours`', 'Time tracking summary']);
}
if (features?.content_pipeline) {
  commands.push(['`/content`', 'Content pipeline management']);
}
if (features?.communications) {
  commands.push(['`/comms`', 'Unified communications']);
}

// Generate context
const lines = [];
lines.push(`# ${profile.businessName || 'My'} Brain — BizBrain OS`);
lines.push('');
lines.push(`> Owner: ${profile.userName || 'Unknown'}`);
if (profile.businessType) lines.push(`> Type: ${profile.businessType}`);
if (profile.industry) lines.push(`> Industry: ${profile.industry}`);
lines.push(`> Brain: ${brainPath}`);
lines.push('');

// Active features
lines.push('## Active Features');
lines.push(activeFeatures.map(f => `- ${f}`).join('\n'));
lines.push('');

// Commands
lines.push('## Commands');
lines.push('| Command | Description |');
lines.push('|---------|-------------|');
commands.forEach(([cmd, desc]) => lines.push(`| ${cmd} | ${desc} |`));
lines.push('');

// Projects
if (projects.length > 0) {
  lines.push('## Active Projects');
  lines.push('| Project | Status | Stack | Repo |');
  lines.push('|---------|--------|-------|------|');
  projects.forEach(p => {
    const status = p.status || 'unknown';
    const stack = p.stack || '';
    const repo = p.repoPath || '';
    lines.push(`| ${p.name} | ${status} | ${stack} | ${repo} |`);
  });
  lines.push('');
}

// Action items
if (actionItems.length > 0) {
  lines.push('## Open Action Items');
  actionItems.forEach(item => {
    lines.push(`- [ ] ${item.id || ''}: ${item.text || item.description || ''}`);
  });
  lines.push('');
}

// Entity index
if (entitySummary && features?.entity_management) {
  lines.push('## Entity Index');
  lines.push(entitySummary);
  lines.push('');
}

// Auto-behaviors
if (auto_behaviors) {
  const active = Object.entries(auto_behaviors)
    .filter(([k, v]) => v !== 'off')
    .map(([k, v]) => `- **${k.replace(/_/g, ' ')}**: ${v}`);
  if (active.length > 0) {
    lines.push('## Active Auto-Behaviors');
    lines.push(active.join('\n'));
    lines.push('');
  }
}

// Entity watchdog instructions (if entity management is on)
if (features?.entity_management) {
  const watchdogMode = auto_behaviors?.entity_detection || 'auto_update';
  lines.push('## Entity Watchdog');
  if (watchdogMode === 'auto_update') {
    lines.push('**ACTIVE — Auto-update mode.** Watch every conversation for entity mentions.');
    lines.push('- New info about known entity → update their brain record, briefly notify user');
    lines.push('- Unknown entity mentioned with substance → ask user before creating');
    lines.push(`- Entity Index: \`${brainPath}/Entities/People/ENTITY-INDEX.md\``);
  } else if (watchdogMode === 'ask_first') {
    lines.push('**ACTIVE — Ask-first mode.** Detect entity mentions but confirm before updating.');
  }
  lines.push('');
}

// Communication style
if (preferences?.commStyle) {
  lines.push('## Communication Style');
  lines.push(`Preferred: **${preferences.commStyle}**`);
  lines.push('');
}

// Stats
if (scan_cache?.lastScanAt) {
  lines.push('## Brain Statistics');
  lines.push(`- Last scan: ${scan_cache.lastScanAt}`);
  lines.push(`- Projects: ${scan_cache.projectCount || 0}`);
  lines.push(`- Entities: ${scan_cache.entityCount || 0}`);
  lines.push(`- Services: ${scan_cache.serviceCount || 0}`);
  lines.push('');
}

process.stdout.write(lines.join('\n'));
```

**Step 2: Write hooks/scripts/session-start**

```bash
#!/usr/bin/env bash
# BizBrain OS — SessionStart Hook
# Detects brain folder, generates context, injects into Claude's system prompt.
# Runs on every session start, resume, clear, and compact.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
PLUGIN_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# --- Brain Path Discovery ---
# Priority: BIZBRAIN_PATH env → ~/bizbrain-os → ~/Repos/bizbrain-os
BRAIN_PATH=""
if [ -n "${BIZBRAIN_PATH:-}" ] && [ -d "$BIZBRAIN_PATH" ]; then
  BRAIN_PATH="$BIZBRAIN_PATH"
elif [ -d "${HOME}/bizbrain-os" ]; then
  BRAIN_PATH="${HOME}/bizbrain-os"
elif [ -d "${HOME}/Repos/bizbrain-os" ]; then
  BRAIN_PATH="${HOME}/Repos/bizbrain-os"
fi

# --- Stale Session Recovery ---
# If the brain exists, check for stale session state
if [ -n "$BRAIN_PATH" ] && [ -f "$BRAIN_PATH/.bizbrain/state.json" ]; then
  # Check if last session ended cleanly
  # (Node script handles this — just ensure state file is readable)
  :
fi

# --- Generate Context ---
escape_for_json() {
    local s="$1"
    s="${s//\\/\\\\}"
    s="${s//\"/\\\"}"
    s="${s//$'\n'/\\n}"
    s="${s//$'\r'/\\r}"
    s="${s//$'\t'/\\t}"
    printf '%s' "$s"
}

# Generate brain context via Node.js
if [ -n "$BRAIN_PATH" ]; then
  CONTEXT=$(node "${PLUGIN_ROOT}/scripts/generate-context.js" "$BRAIN_PATH" 2>/dev/null || echo "# BizBrain OS\\n\\nError loading brain context. Run \`/brain status\` to diagnose.")
else
  CONTEXT="# BizBrain OS\\n\\nNo brain folder found. Run \`/brain setup\` to scan your machine and create your knowledge brain.\\n\\n## Available Commands\\n| Command | Description |\\n|---------|-------------|\\n| \`/brain setup\` | First-time setup |\\n| \`/brain status\` | Show brain status |"
fi

ESCAPED_CONTEXT=$(escape_for_json "$CONTEXT")

# --- Update Session State ---
if [ -n "$BRAIN_PATH" ] && [ -d "$BRAIN_PATH/.bizbrain" ]; then
  # Record session start timestamp for time tracking
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date +"%Y-%m-%dT%H:%M:%SZ")
  echo "{\"lastSessionStart\":\"$TIMESTAMP\",\"sessionActive\":true}" > "$BRAIN_PATH/.bizbrain/session-state.json" 2>/dev/null || true
fi

# --- Output Context Injection ---
SESSION_CONTEXT="<bizbrain-os-context>\\n${ESCAPED_CONTEXT}\\n</bizbrain-os-context>"

cat <<EOF
{
  "additional_context": "${SESSION_CONTEXT}",
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "${SESSION_CONTEXT}"
  }
}
EOF

exit 0
```

**Step 3: Verify hook locally**

```bash
# Test the session-start script directly
export BIZBRAIN_PATH=""  # No brain yet — should output setup prompt
cd ~/Repos/bizbrain-os-plugin
bash hooks/scripts/session-start
# Expected: JSON with "No brain folder found" context
```

**Step 4: Commit**

```bash
git add hooks/scripts/session-start scripts/generate-context.js
git commit -m "feat: SessionStart hook with brain detection and context injection"
```

---

## Task 5: Brain Bootstrap Skill

**Files:**
- Create: `skills/brain-bootstrap/SKILL.md`
- Create: `scripts/scanner.sh`

This skill is triggered on first run (or `/brain setup`) and walks through the full onboarding.

**Step 1: Write skills/brain-bootstrap/SKILL.md**

```markdown
---
name: brain-bootstrap
description: |
  Use when setting up BizBrain OS for the first time, when the user runs /brain setup,
  or when no brain folder is detected. Handles machine scanning, profile selection,
  brain folder creation, and initial CLAUDE.md generation.
version: 1.0.0
---

# Brain Bootstrap

You are setting up BizBrain OS — the AI context layer that teaches Claude the user's business.

## Process

### Step 1: Check for Existing Brain

Look for a brain folder in this order:
1. `BIZBRAIN_PATH` environment variable
2. `~/bizbrain-os/`
3. Ask the user where they want it (default: `~/bizbrain-os/`)

If a brain already exists, ask: "Found an existing brain at [path]. Reconfigure it, or start fresh?"

### Step 2: Gather Basic Info

Ask the user (one question at a time, use AskUserQuestion):
1. "What's your name?" (for the brain's owner field)
2. "What's your business or project name?" (or "What should we call your brain?")
3. Profile selection — present the 5 profiles with descriptions:
   - Developer / Technical Solopreneur
   - Content Creator
   - Consultant / Freelancer
   - Agency Owner
   - Personal / Life Organizer

### Step 3: Scan the Machine

Run the scanner script to discover:
- Code repositories (look in scan_paths.code from the selected profile)
- Documents and recent files
- Git history and collaborators
- Installed tools and package managers
- Claude Code configuration (existing MCPs, project contexts)
- Service configs (.env files, API keys)

Present a summary: "I found X projects, Y documents, Z services. Here's what I'll add to your brain:"

### Step 4: Create the Brain Folder

1. Create `~/bizbrain-os/` (or chosen path)
2. Read `${CLAUDE_PLUGIN_ROOT}/lib/folder-structure.json`
3. Create all `core` folders
4. Create `features` folders based on selected profile
5. Write `config.json` from `${CLAUDE_PLUGIN_ROOT}/lib/default-config.json` template, filled with user info + profile settings
6. Write `.bizbrain/state.json` with initial state
7. Write `.bizbrain/hooks-state.json` with auto_behaviors from profile

### Step 5: Populate from Scan Results

For each discovered project:
- Create `Projects/<name>/_meta.json` with repo path, stack, last activity
- Create `Projects/<name>/overview.md` with basic info

For each discovered service/credential:
- Add to `Operations/credentials/registry.json` (catalog only — don't copy secrets)

For each discovered entity (from git history collaborators):
- Queue for user confirmation: "Found these collaborators: [list]. Add any as entities?"

### Step 6: Generate CLAUDE.md

The brain's `CLAUDE.md` will be auto-generated by the SessionStart hook on next session.
Tell the user: "Brain created! Restart Claude Code to activate. Every session will now start with your full business context."

### Step 7: MCP Recommendations

Based on detected services (GitHub authenticated? Notion docs found?), recommend MCPs:
"I detected you use GitHub and Notion. Want me to configure their MCP servers?"

If yes, help set up each one conversationally.

## Important Notes

- Always use `${CLAUDE_PLUGIN_ROOT}` to reference plugin files
- Never copy credential values — only catalog what exists
- Write all brain data to the brain folder, never to the plugin directory
- The brain folder should be gitignored by default (add a .gitignore)
- Set `BIZBRAIN_PATH` environment variable for future sessions
```

**Step 2: Write scripts/scanner.sh**

```bash
#!/usr/bin/env bash
# BizBrain OS — Machine Scanner
# Discovers projects, documents, services, and tools on the machine.
# Output: JSON to stdout
# Usage: scanner.sh [scan_paths_json]

set -euo pipefail

# Default scan paths (overridden by profile)
CODE_PATHS=("$HOME/Repos" "$HOME/Projects" "$HOME/Code" "$HOME/src")
DOC_PATHS=("$HOME/Documents")
RECENT_PATHS=("$HOME/Desktop" "$HOME/Downloads")

# --- Discover Code Projects ---
discover_projects() {
  local projects="[]"
  for dir in "${CODE_PATHS[@]}"; do
    if [ -d "$dir" ]; then
      # Find directories containing .git, package.json, Cargo.toml, go.mod, etc.
      while IFS= read -r -d '' project_dir; do
        local name=$(basename "$project_dir")
        local git_dir="$project_dir/.git"
        local has_git=false
        local last_commit=""
        local stack=""

        if [ -d "$git_dir" ]; then
          has_git=true
          last_commit=$(git -C "$project_dir" log -1 --format="%ai" 2>/dev/null || echo "")
        fi

        # Detect stack
        if [ -f "$project_dir/package.json" ]; then
          stack="node"
          # Check for frameworks
          if grep -q "next" "$project_dir/package.json" 2>/dev/null; then stack="nextjs"; fi
          if grep -q "react" "$project_dir/package.json" 2>/dev/null; then stack="react"; fi
          if grep -q "vue" "$project_dir/package.json" 2>/dev/null; then stack="vue"; fi
        elif [ -f "$project_dir/Cargo.toml" ]; then stack="rust"
        elif [ -f "$project_dir/go.mod" ]; then stack="go"
        elif [ -f "$project_dir/requirements.txt" ] || [ -f "$project_dir/pyproject.toml" ]; then stack="python"
        fi

        echo "{\"name\":\"$name\",\"path\":\"$project_dir\",\"hasGit\":$has_git,\"lastCommit\":\"$last_commit\",\"stack\":\"$stack\"}"
      done < <(find "$dir" -maxdepth 2 -type d \( -name ".git" -o -name "package.json" -o -name "Cargo.toml" -o -name "go.mod" \) -exec dirname {} \; 2>/dev/null | sort -u | tr '\n' '\0')
    fi
  done
}

# --- Discover Services ---
discover_services() {
  # Check Claude Code config
  local claude_json="$HOME/.claude.json"
  local claude_settings="$HOME/.claude/settings.json"

  if [ -f "$claude_json" ]; then
    echo "{\"type\":\"claude-config\",\"path\":\"$claude_json\"}"
  fi
  if [ -f "$claude_settings" ]; then
    echo "{\"type\":\"claude-settings\",\"path\":\"$claude_settings\"}"
  fi

  # Check for common tools
  command -v gh &>/dev/null && echo "{\"type\":\"tool\",\"name\":\"gh\",\"authenticated\":$(gh auth status &>/dev/null && echo true || echo false)}"
  command -v node &>/dev/null && echo "{\"type\":\"tool\",\"name\":\"node\",\"version\":\"$(node -v 2>/dev/null || echo unknown)\"}"
  command -v git &>/dev/null && echo "{\"type\":\"tool\",\"name\":\"git\",\"version\":\"$(git --version 2>/dev/null | head -1 || echo unknown)\"}"
  command -v python3 &>/dev/null && echo "{\"type\":\"tool\",\"name\":\"python\",\"version\":\"$(python3 --version 2>/dev/null || echo unknown)\"}"
}

# --- Output ---
echo "=== PROJECTS ==="
discover_projects
echo "=== SERVICES ==="
discover_services
echo "=== DONE ==="
```

**Step 3: Commit**

```bash
git add skills/brain-bootstrap/ scripts/scanner.sh
chmod +x scripts/scanner.sh
git commit -m "feat: brain-bootstrap skill and machine scanner for first-run onboarding"
```

---

## Task 6: The `/brain` Command

**Files:**
- Create: `commands/brain.md`

**Step 1: Write commands/brain.md**

```markdown
---
name: brain
description: BizBrain OS brain management — status, setup, scan, configure, profiles
argument-hint: [setup|status|scan|configure|profile]
---

You are managing the user's BizBrain OS brain.

**Available subcommands:**

- `/brain` or `/brain status` — Show brain status (path, profile, stats, active features, last scan)
- `/brain setup` — First-time setup. Invoke the `bizbrain-os:brain-bootstrap` skill and follow it exactly.
- `/brain scan` — Re-scan the machine and update the brain with new discoveries
- `/brain configure` — Edit brain settings (auto-behaviors, feature toggles, communication style)
- `/brain profile` — Switch profile or customize feature set

**Arguments:** $ARGUMENTS

**If no argument or "status":**
1. Check for brain folder (BIZBRAIN_PATH env → ~/bizbrain-os/)
2. If no brain: tell user to run `/brain setup`
3. If brain exists: read config.json, state.json, and display:
   - Brain path
   - Profile name
   - Active features (with on/off toggles shown)
   - Auto-behaviors (with current modes)
   - Scan statistics (projects, entities, services, last scan date)
   - Recent activity (last 5 sessions from Operations/learning/sessions/)

**If "setup":**
Invoke the `bizbrain-os:brain-bootstrap` skill.

**If "scan":**
Run the scanner script at `${CLAUDE_PLUGIN_ROOT}/scripts/scanner.sh`, compare results to existing brain state, and update Projects/ and Operations/ with new discoveries. Report what changed.

**If "configure":**
Read current config.json and present settings as an interactive menu using AskUserQuestion. Allow toggling features and auto-behaviors.

**If "profile":**
Show current profile and allow switching. Read profiles from `${CLAUDE_PLUGIN_ROOT}/profiles/`.
```

**Step 2: Commit**

```bash
git add commands/brain.md
git commit -m "feat: /brain command for brain management (status, setup, scan, configure)"
```

---

## Task 7: Credential Management Skill

**Files:**
- Create: `skills/credential-management/SKILL.md`

**Step 1: Write skills/credential-management/SKILL.md**

```markdown
---
name: credential-management
description: |
  Use when managing API keys, tokens, project IDs, or service credentials.
  Handles cataloging discovered credentials, securely storing new ones,
  and retrieving them for use in integrations and MCP configurations.
  Triggers on: credential setup, API key management, integration configuration,
  .env file operations, secret management.
version: 1.0.0
---

# Credential Management

You manage the user's API keys, tokens, and service credentials within their BizBrain OS brain.

## Storage Location

All credentials are stored in the brain folder at:
`<BRAIN_PATH>/Operations/credentials/`

### File Structure

```
Operations/credentials/
├── registry.json          # Catalog of all known credentials
└── vault/                 # Individual service credential files
    ├── github.json
    ├── stripe.json
    └── ...
```

### registry.json Format

```json
{
  "version": "1.0.0",
  "services": {
    "github": {
      "status": "configured",
      "envVars": ["GITHUB_PERSONAL_ACCESS_TOKEN"],
      "configuredAt": "2026-02-23T...",
      "source": "scan"
    },
    "stripe": {
      "status": "detected",
      "envVars": ["STRIPE_SECRET_KEY", "STRIPE_PUBLISHABLE_KEY"],
      "detectedAt": "2026-02-23T...",
      "detectedIn": "/path/to/.env",
      "source": "scan"
    }
  }
}
```

### Vault File Format

```json
{
  "service": "github",
  "credentials": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
  },
  "configuredAt": "2026-02-23T...",
  "notes": "Personal access token with repo + workflow scopes"
}
```

## Operations

### Catalog (during scan)
When the scanner finds .env files or service configs:
1. Read the file, identify known service keys (match against integrations-registry)
2. Add to registry.json with status "detected" and source location
3. Do NOT copy the actual credential values automatically
4. Inform user: "Found GitHub token in ~/Repos/my-app/.env. Store in brain vault?"

### Store (user-initiated)
When user provides a credential:
1. Write to `vault/<service>.json`
2. Update registry.json status to "configured"
3. If the service has an MCP server definition, offer to configure it

### Retrieve (by other skills/commands)
When another skill needs a credential:
1. Check `vault/<service>.json`
2. If not found, check registry.json for "detected" entries and offer to import
3. If completely unknown, walk user through setup using the integrations-registry

### Security Rules
- NEVER display full credential values in output (mask: `ghp_...abc`)
- NEVER commit credentials to git
- NEVER copy credentials to the plugin directory
- Vault files should only be readable by the current user
- When listing credentials, show service name + status, not values
```

**Step 2: Commit**

```bash
git add skills/credential-management/
git commit -m "feat: credential management skill for API keys and service tokens"
```

---

## Task 8: MCP Management Skill

**Files:**
- Create: `skills/mcp-management/SKILL.md`
- Create: `commands/mcp.md`
- Copy: `lib/integrations-registry.json` (from existing bizbrain-os repo)

**Step 1: Copy integrations-registry.json**

```bash
cp ~/Repos/bizbrain-os/.bizbrain/integrations-registry.json ~/Repos/bizbrain-os-plugin/lib/integrations-registry.json
```

**Step 2: Write skills/mcp-management/SKILL.md**

```markdown
---
name: mcp-management
description: |
  Use when managing MCP (Model Context Protocol) servers. Handles detecting which MCPs
  the user needs, installing and configuring them, enabling/disabling per-project,
  and managing MCP profiles. Triggers on: MCP setup, MCP configuration, integration
  setup, tool configuration, "connect to service".
version: 1.0.0
---

# MCP Management

You manage the user's MCP server configurations within BizBrain OS.

## How MCPs Work in Claude Code

MCP servers are configured in:
- `~/.claude.json` — user-level MCPs (available everywhere)
- `.claude/settings.json` — project-level MCPs

Each MCP entry:
```json
{
  "mcpServers": {
    "service-name": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "..." }
    }
  }
}
```

## Available Integrations

Read `${CLAUDE_PLUGIN_ROOT}/lib/integrations-registry.json` for the full catalog of 34+ services.
Services with MCP servers: GitHub, Slack, Supabase, Stripe, Notion, Firecrawl, Screenpipe.

## Operations

### Auto-Detect (during scan and session start)
1. Check which services the user has credentials for (from brain vault)
2. Check which MCPs are already configured in `~/.claude.json`
3. Identify gaps: "You have GitHub credentials but no GitHub MCP configured"
4. Recommend missing MCPs

### Configure (user-initiated)
When user wants to add an MCP:
1. Look up service in integrations-registry.json
2. Check if credentials exist in brain vault
3. If yes: offer to auto-configure
4. If no: walk through credential setup first (use credential-management skill)
5. Write MCP config to `~/.claude.json` (Windows: use `cmd /c` wrapper for npx)
6. Inform user they need to restart Claude Code for MCP to take effect

### Windows-Specific
On Windows, npx MCPs need the `cmd /c` wrapper pattern:
```json
{
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-github"],
  "env": { ... }
}
```

### MCP Profiles
Profiles are stored in `<BRAIN_PATH>/Operations/mcp-configs/profiles/`:
- `dev.json` — Development MCPs (GitHub, Supabase)
- `full.json` — All available MCPs
- `minimal.json` — No MCPs (for fast sessions)

Switching profiles rewrites `~/.claude.json` mcpServers section.

### Subprocess Delegation
For one-off MCP tasks without restarting:
1. Temporarily write MCP config
2. Spawn `claude` subprocess with the task
3. Capture output
4. Restore original config
5. Return result in current conversation
```

**Step 3: Write commands/mcp.md**

```markdown
---
name: mcp
description: MCP server management — status, enable, disable, profiles
argument-hint: [status|enable|disable|profile] [service-name]
---

You are managing MCP server configurations for the user.

Invoke the `bizbrain-os:mcp-management` skill and follow it.

**Available subcommands:**
- `/mcp` or `/mcp status` — Show which MCPs are configured, which are recommended
- `/mcp enable <service>` — Configure and enable an MCP server
- `/mcp disable <service>` — Remove an MCP server
- `/mcp profile <name>` — Switch to a named MCP profile (dev, full, minimal)

**Arguments:** $ARGUMENTS
```

**Step 4: Commit**

```bash
git add skills/mcp-management/ commands/mcp.md lib/integrations-registry.json
git commit -m "feat: MCP management skill and /mcp command with integrations registry"
```

---

## Task 9: PostToolUse Hook — Continuous Learning

**Files:**
- Modify: `hooks/hooks.json` (add PostToolUse entry)
- Create: `hooks/scripts/post-tool-use` (extensionless bash script)

**Step 1: Update hooks/hooks.json**

Add PostToolUse with a prompt hook for entity detection and action item extraction:

```json
{
  "description": "BizBrain OS hooks — brain context injection, continuous learning, session management",
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "'${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd' session-start",
            "async": false
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Read|Write|Edit|Bash|WebFetch",
        "hooks": [
          {
            "type": "command",
            "command": "'${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd' post-tool-use",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

**Step 2: Write hooks/scripts/post-tool-use**

```bash
#!/usr/bin/env bash
# BizBrain OS — PostToolUse Hook
# Write-through observation: timestamps activity for time tracking.
# Entity detection and action item extraction are handled by prompt hooks
# (added in a future task) — this command hook handles only deterministic operations.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
PLUGIN_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# --- Brain Path Discovery ---
BRAIN_PATH=""
if [ -n "${BIZBRAIN_PATH:-}" ] && [ -d "$BIZBRAIN_PATH" ]; then
  BRAIN_PATH="$BIZBRAIN_PATH"
elif [ -d "${HOME}/bizbrain-os" ]; then
  BRAIN_PATH="${HOME}/bizbrain-os"
elif [ -d "${HOME}/Repos/bizbrain-os" ]; then
  BRAIN_PATH="${HOME}/Repos/bizbrain-os"
fi

# No brain? Exit silently.
if [ -z "$BRAIN_PATH" ]; then
  echo '{"continue": true, "suppressOutput": true}'
  exit 0
fi

# --- Read Hook Input ---
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try{console.log(JSON.parse(d).tool_name||'')}
    catch(e){console.log('')}
  })
" 2>/dev/null || echo "")

# --- Time Tracking: Write heartbeat ---
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date +"%Y-%m-%dT%H:%M:%SZ")
SESSION_LOG_DIR="$BRAIN_PATH/Operations/learning/sessions"
mkdir -p "$SESSION_LOG_DIR" 2>/dev/null || true

# Append timestamp + tool name to today's session log
TODAY=$(date +"%Y-%m-%d" 2>/dev/null || date +"%Y-%m-%d")
echo "$TIMESTAMP $TOOL_NAME" >> "$SESSION_LOG_DIR/$TODAY.log" 2>/dev/null || true

# --- Output ---
echo '{"continue": true, "suppressOutput": true}'
exit 0
```

**Step 3: Commit**

```bash
git add hooks/hooks.json hooks/scripts/post-tool-use
git commit -m "feat: PostToolUse hook for write-through time tracking heartbeats"
```

---

## Task 10: Entity Watchdog Agent

**Files:**
- Create: `agents/entity-watchdog.md`

**Step 1: Write agents/entity-watchdog.md**

```markdown
---
name: entity-watchdog
description: |
  Use this agent to monitor conversations for entity mentions and automatically
  maintain BizBrain OS entity records. This agent should be invoked proactively
  when entities (clients, partners, vendors, people, projects) are mentioned with
  new information.
  <example>
  Context: User mentions a client with new contact info
  user: "Tim from Disruptors Media just called, his new email is tim@dm.com"
  assistant: "I'll use the entity-watchdog agent to update Tim's record."
  <commentary>
  New contact info for a known entity triggers the watchdog to update records.
  </commentary>
  </example>
  <example>
  Context: User mentions an unknown company with substance
  user: "I'm starting a project with Spark Digital, they're a web design agency"
  assistant: "I'll use the entity-watchdog agent to check if Spark Digital should be added."
  <commentary>
  Unknown entity with substantive info — watchdog asks user before creating.
  </commentary>
  </example>
model: haiku
color: cyan
tools: Read, Write, Edit, Glob, Grep
---

You are the BizBrain OS Entity Watchdog. Your job is to maintain entity records in the user's brain folder.

## Brain Location

Check these paths in order:
1. `BIZBRAIN_PATH` environment variable
2. `~/bizbrain-os/`

## Entity Index

Read `<BRAIN_PATH>/Entities/People/ENTITY-INDEX.md` to cross-reference mentions.

## Rules

### Auto-Update (do immediately, briefly notify)
When you detect NEW information about a KNOWN entity:
- New contact details → update entity's `_meta.json`
- Title/role change → update `_meta.json`
- New interaction/meeting → append to `history.md`
- Action items → add to `action-items.md`
- New alias → update `_meta.json` aliases + ENTITY-INDEX.md

After updating, output: "Updated [entity]'s [field] in brain."

### Ask First (return recommendation)
- New entity → "I noticed [Name]. Should I create a [client/partner/vendor] record?"
- Type reclassification → confirm with user
- Status change (active → inactive) → confirm with user

### Don't Trigger On
- Casual mentions with no new information
- Names in quoted documents or web content
- Technical terms that match entity keywords by coincidence

## Entity File Structure

Each entity lives at `<BRAIN_PATH>/Entities/<Type>/<Name>/`:
```
_meta.json      # name, type, status, aliases, contacts, tags
overview.md     # What they do, relationship summary
history.md      # Interaction timeline
action-items.md # Open tasks related to them
```
```

**Step 2: Commit**

```bash
git add agents/entity-watchdog.md
git commit -m "feat: entity watchdog agent for automatic entity record maintenance"
```

---

## Task 11: Brain Gateway Agent

**Files:**
- Create: `agents/brain-gateway.md`

**Step 1: Write agents/brain-gateway.md**

```markdown
---
name: brain-gateway
description: |
  Use this agent for full BizBrain OS brain access from any repository or working
  directory. Provides entity management, project tracking, knowledge lookup,
  intake processing, and brain operations. Invoke when the user needs to interact
  with their brain from outside the brain folder.
  <example>
  Context: User is in a code repo and wants to check client info
  user: "What's the status of my work with Acme Corp?"
  assistant: "I'll use the brain-gateway agent to look up Acme Corp."
  <commentary>
  User is in a different repo but needs brain data — gateway provides access.
  </commentary>
  </example>
  <example>
  Context: User wants to add a todo from a project repo
  user: "Add a todo: deploy the auth fix by Friday"
  assistant: "I'll use the brain-gateway agent to add this to the brain's todo list."
  <commentary>
  Cross-repo todo management through the gateway.
  </commentary>
  </example>
model: sonnet
color: blue
tools: Read, Write, Edit, Glob, Grep, Bash
---

You are the BizBrain OS Brain Gateway. You provide full access to the user's business brain from any working directory.

## Brain Location

Check these paths in order:
1. `BIZBRAIN_PATH` environment variable
2. `~/bizbrain-os/`

## Capabilities

1. **Entity Operations** — Look up, create, update entities (Clients, Partners, Vendors, People)
2. **Project Operations** — Check project status, update action items, view history
3. **Knowledge Operations** — Search knowledge base, add new knowledge
4. **Todo Operations** — View, add, complete tasks across all sources
5. **Intake Operations** — Process files in _intake-dump/
6. **Brain Operations** — Show brain stats, recent activity, health

## File Structure

Read the brain's `config.json` for active features and profile info.
Read `Entities/People/ENTITY-INDEX.md` for entity cross-reference.
Read `Operations/todos/AGGREGATED-VIEW.md` for unified task list.

## Response Style

When returning information from the brain, be concise and structured.
Use tables for lists. Reference file paths so the user can navigate.
```

**Step 2: Commit**

```bash
git add agents/brain-gateway.md
git commit -m "feat: brain gateway agent for cross-repo brain access"
```

---

## Task 12: Additional Core Commands

**Files:**
- Create: `commands/todo.md`
- Create: `commands/knowledge.md`
- Create: `commands/entity.md`
- Create: `commands/hours.md`

**Step 1: Write commands/todo.md**

```markdown
---
name: todo
description: Unified task management across all brain sources
argument-hint: [add|done|sync] [task-text|task-id]
---

Manage todos in the user's BizBrain OS brain.

- `/todo` — Show aggregated todo dashboard from `<BRAIN_PATH>/Operations/todos/AGGREGATED-VIEW.md`
- `/todo add <task>` — Add a new todo to `Operations/todos/ACTIVE-TODOS.md`
- `/todo done <id>` — Mark a todo as complete
- `/todo sync` — Regenerate aggregated view from all action-items.md files across the brain

**Brain path:** Check BIZBRAIN_PATH env → ~/bizbrain-os/
**Arguments:** $ARGUMENTS
```

**Step 2: Write commands/knowledge.md**

```markdown
---
name: knowledge
description: Load and search brain knowledge
argument-hint: <topic|path>
---

Load specific knowledge from the user's BizBrain OS brain.

- `/knowledge <topic>` — Search for and display knowledge on a topic
- `/knowledge <path>` — Load a specific knowledge file

Search in `<BRAIN_PATH>/Knowledge/` directory. Use Grep to find relevant files.

**Brain path:** Check BIZBRAIN_PATH env → ~/bizbrain-os/
**Arguments:** $ARGUMENTS
```

**Step 3: Write commands/entity.md**

```markdown
---
name: entity
description: Look up or add entities (clients, partners, vendors, people)
argument-hint: [add|search] <name>
---

Manage entities in the user's BizBrain OS brain.

- `/entity <name>` — Look up an entity by name or alias
- `/entity add <name>` — Add a new entity (asks for type: client/partner/vendor/person)
- `/entity search <query>` — Search across all entities

Read `<BRAIN_PATH>/Entities/People/ENTITY-INDEX.md` for the master cross-reference.
Entity folders: `Entities/Clients/`, `Entities/Partners/`, `Entities/Vendors/`, `Entities/People/`

**Brain path:** Check BIZBRAIN_PATH env → ~/bizbrain-os/
**Arguments:** $ARGUMENTS
```

**Step 4: Write commands/hours.md**

```markdown
---
name: hours
description: Time tracking summary from session heartbeats
argument-hint: [today|week|month]
---

Show time tracking summary from BizBrain OS session logs.

Read session heartbeat logs from `<BRAIN_PATH>/Operations/learning/sessions/`.
Each log file is named `YYYY-MM-DD.log` with lines like: `2026-02-23T14:30:00Z Write`

Calculate:
- Active time = periods with < 5 minute gaps between heartbeats
- Total time per day
- Breakdown by tool usage

- `/hours` or `/hours today` — Today's hours
- `/hours week` — This week's summary
- `/hours month` — This month's summary

**Brain path:** Check BIZBRAIN_PATH env → ~/bizbrain-os/
**Arguments:** $ARGUMENTS
```

**Step 5: Commit**

```bash
git add commands/
git commit -m "feat: core commands — /todo, /knowledge, /entity, /hours"
```

---

## Task 13: Knowledge Management Skill

**Files:**
- Create: `skills/knowledge-management/SKILL.md`

**Step 1: Write skills/knowledge-management/SKILL.md**

```markdown
---
name: knowledge-management
description: |
  Use when managing the user's knowledge base — adding knowledge, searching for information,
  creating decision records, or organizing references. Triggers on: knowledge lookup,
  "remember this", decision recording, reference management, documentation.
version: 1.0.0
---

# Knowledge Management

You manage the user's knowledge base in their BizBrain OS brain.

## Knowledge Structure

```
<BRAIN_PATH>/Knowledge/
├── INDEX.md           # Searchable index of all knowledge
├── systems/           # How systems and processes work
├── decisions/         # Key decisions with rationale
├── templates/         # Reusable templates
└── references/        # External references and bookmarks
```

## Operations

### Search
1. Read `Knowledge/INDEX.md` for the searchable index
2. Use Grep to search across all knowledge files
3. Return relevant excerpts with file paths

### Add Knowledge
When the user says "remember this" or wants to save knowledge:
1. Determine the category (systems, decisions, templates, references)
2. Create a markdown file with clear title and content
3. Update `Knowledge/INDEX.md` with a new entry

### Decision Records
When the user makes a significant decision:
1. Create `Knowledge/decisions/YYYY-MM-DD-<topic>.md`
2. Include: context, options considered, decision made, rationale
3. Update INDEX.md

### Index Format
```markdown
# Knowledge Index

## Systems
- [System Name](systems/system-name.md) — Brief description

## Decisions
- [2026-02-23: Chose React over Vue](decisions/2026-02-23-framework-choice.md)

## Templates
- [Project README](templates/project-readme.md)

## References
- [API Documentation](references/api-docs.md)
```
```

**Step 2: Commit**

```bash
git add skills/knowledge-management/
git commit -m "feat: knowledge management skill for brain knowledge base"
```

---

## Task 14: Initial Test & Dev Marketplace Setup

**Files:**
- Modify: `.claude-plugin/marketplace.json` (already created)

**Step 1: Ensure all files have correct permissions**

```bash
cd ~/Repos/bizbrain-os-plugin
chmod +x hooks/run-hook.cmd hooks/scripts/* scripts/*.sh scripts/*.js
```

**Step 2: Test plugin installation locally**

```bash
# Register the local directory as a marketplace
claude plugin marketplace add ~/Repos/bizbrain-os-plugin

# Install the plugin
claude plugin install bizbrain-os@bizbrain-marketplace

# Restart Claude Code to load the plugin
```

**Step 3: Verify**

After restarting Claude Code:
1. Check that the SessionStart hook fires (should see "No brain folder found" context)
2. Run `/brain` — should display setup prompt
3. Run `/brain setup` — should trigger the brain-bootstrap skill
4. After setup, restart Claude Code — should see full brain context injected

**Step 4: Fix any issues found during testing**

Iterate on hook scripts and skills based on test results.

**Step 5: Commit fixes**

```bash
git add -A
git commit -m "fix: adjustments from local testing"
```

---

## Task 15: Create GitHub Repo & Push

**Step 1: Create the GitHub repo**

```bash
cd ~/Repos/bizbrain-os-plugin
gh repo create TechIntegrationLabs/bizbrain-os-plugin --public --description "BizBrain OS — Claude Code plugin. The AI context layer that teaches Claude your business." --source . --push
```

**Step 2: Verify the repo is accessible**

```bash
gh repo view TechIntegrationLabs/bizbrain-os-plugin
```

**Step 3: Tag initial release**

```bash
git tag v1.0.0-alpha.1
git push origin v1.0.0-alpha.1
```

---

## Summary

| Task | What It Creates | Files |
|------|----------------|-------|
| 1 | Plugin skeleton | `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.gitignore` |
| 2 | Hook infrastructure | `hooks/hooks.json`, `hooks/run-hook.cmd` |
| 3 | Profile system | `profiles/*.json`, `lib/default-config.json`, `lib/folder-structure.json` |
| 4 | SessionStart hook | `hooks/scripts/session-start`, `scripts/generate-context.js` |
| 5 | Brain bootstrap skill | `skills/brain-bootstrap/SKILL.md`, `scripts/scanner.sh` |
| 6 | /brain command | `commands/brain.md` |
| 7 | Credential management | `skills/credential-management/SKILL.md` |
| 8 | MCP management | `skills/mcp-management/SKILL.md`, `commands/mcp.md`, `lib/integrations-registry.json` |
| 9 | PostToolUse hook | `hooks/scripts/post-tool-use` (time tracking heartbeats) |
| 10 | Entity watchdog agent | `agents/entity-watchdog.md` |
| 11 | Brain gateway agent | `agents/brain-gateway.md` |
| 12 | Core commands | `commands/todo.md`, `commands/knowledge.md`, `commands/entity.md`, `commands/hours.md` |
| 13 | Knowledge management | `skills/knowledge-management/SKILL.md` |
| 14 | Local testing | Permission fixes, dev marketplace install, verification |
| 15 | GitHub release | Repo creation, push, alpha tag |

**Total: 15 tasks, ~25 files, estimated 15 commits**

After this phase, the plugin will:
- Detect or create a brain folder on first run
- Inject full business context on every session start
- Track time via write-through heartbeats (no SessionEnd dependency)
- Provide commands: `/brain`, `/mcp`, `/todo`, `/knowledge`, `/entity`, `/hours`
- Auto-detect entities via the watchdog agent
- Manage credentials and MCP servers
- Support 5 user profiles with feature toggles
