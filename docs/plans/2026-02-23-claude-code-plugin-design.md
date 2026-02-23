# BizBrain OS — Claude Code Plugin Design

> **Date:** 2026-02-23
> **Status:** Approved
> **Author:** WJ Welsh + Claude
> **Approach:** Brain-First with hybrid monolithic core + satellite plugins

---

## Vision

BizBrain OS becomes a native Claude Code plugin that makes Claude better at *knowing you*. One install scans your machine, builds a structured knowledge brain, and continuously learns across every conversation. The brain compounds over time — every session deposits context, every future session withdraws it.

**The compound interest of AI context.**

---

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Approach** | Brain-First | The brain IS the product. Workflows operate on it. |
| **Plugin structure** | Monolithic core + satellite plugins | Core has all essential features with toggles. Satellites for niche tools (slides, video, contracts). |
| **Target user** | Universal (profiles), developer-first build | Profile/template system supports any user type. Ship developer profile first. |
| **Brain location** | User-visible folder (`~/bizbrain-os/`) | Users can browse, back up, and understand their data. It's theirs. |
| **Relation to standalone app** | Coexist equally | Shared brain folder. Plugin and GUI are both lenses into the same data. |
| **Install experience** | Plugin handles everything | `claude plugin add bizbrain-os` → onboarding → scan → brain created. |
| **Auto-behavior** | Configurable per-category | Sensible defaults. Users control what's auto vs ask-first vs off. |
| **Session resilience** | Write-through, never depend on SessionEnd | All observations persist immediately. SessionStart recovers stale state. |

---

## Plugin Structure

```
bizbrain-os/
├── .claude-plugin/
│   ├── plugin.json
│   └── marketplace.json
│
├── commands/                         # User-invoked slash commands
│   ├── brain.md                      # /brain — status, scan, configure, profiles
│   ├── entity.md                     # /entity — add/update/search entities
│   ├── gsd.md                        # /gsd — project execution workflow
│   ├── intake.md                     # /intake — process files in intake dump
│   ├── knowledge.md                  # /knowledge — load/search brain knowledge
│   ├── comms.md                      # /comms — unified communications
│   ├── content.md                    # /content — content pipeline management
│   ├── hours.md                      # /hours — time tracking summary
│   ├── todo.md                       # /todo — unified task management
│   ├── outreach.md                   # /outreach — lead pipeline & sequences
│   └── mcp.md                        # /mcp — MCP status, enable, disable, profiles
│
├── agents/                           # Auto-invoked subagents
│   ├── brain-gateway.md              # Full brain access from any repo
│   ├── entity-watchdog.md            # Monitors for entity mentions
│   ├── intake-processor.md           # Processes dropped files
│   ├── gsd-orchestrator.md           # Plans and executes project phases
│   ├── content-factory.md            # Automated content generation
│   └── timesheet-reporter.md         # Time tracking and reporting
│
├── skills/                           # Context-activated skills
│   ├── brain-bootstrap/              # First-run onboarding
│   │   └── SKILL.md
│   ├── entity-management/            # CRUD entities, relationships
│   │   └── SKILL.md
│   ├── project-execution/            # GSD phases, waves, specs
│   │   └── SKILL.md
│   ├── knowledge-management/         # Index, search, link knowledge
│   │   └── SKILL.md
│   ├── intake-processing/            # Route files to brain locations
│   │   └── SKILL.md
│   ├── time-tracking/                # Session logging, timesheets
│   │   └── SKILL.md
│   ├── communications/               # Email, Slack, multi-channel
│   │   └── SKILL.md
│   ├── content-pipeline/             # Blog, social, publishing
│   │   └── SKILL.md
│   ├── outreach-engine/              # Leads, sequences, follow-ups
│   │   └── SKILL.md
│   ├── todo-management/              # Aggregated todos
│   │   └── SKILL.md
│   ├── session-archiving/            # Archive to Obsidian/markdown
│   │   └── SKILL.md
│   ├── credential-management/        # API keys, tokens, project IDs
│   │   └── SKILL.md
│   ├── mcp-management/               # Auto-detect, install, configure MCPs
│   │   └── SKILL.md
│   └── brain-learning/               # Continuous observation system
│       └── SKILL.md
│
├── hooks/
│   ├── hooks.json                    # Hook event configuration
│   └── scripts/
│       ├── run-hook.cmd              # Cross-platform polyglot wrapper
│       ├── session-start.sh          # Load brain, generate CLAUDE.md, inject context
│       ├── post-tool-use.sh          # Entity detection, action items, time tracking
│       ├── session-end.sh            # Finalize (nice-to-have, not required)
│       └── pre-compact.sh            # Preserve brain context before compaction
│
├── profiles/                         # User profile templates
│   ├── developer.json                # GSD, entities, time, knowledge, MCP management
│   ├── content-creator.json          # Content, social, outreach, scheduling
│   ├── consultant.json               # Entities, comms, contracts, time
│   ├── agency.json                   # All features active
│   └── personal.json                 # Knowledge, todos, intake, journaling
│
├── scripts/                          # Shared utilities
│   ├── scanner.sh                    # Machine scanning logic
│   ├── brain-init.sh                 # Brain folder creation
│   └── config-manager.sh             # Profile and feature toggle management
│
└── lib/                              # Shared data
    ├── folder-structure.json         # Brain folder template definitions
    ├── integrations-registry.json    # Known services and setup flows
    └── default-config.json           # Default feature toggles per profile
```

---

## Brain Folder Structure

Created at `~/bizbrain-os/` (or user-configured path):

```
~/bizbrain-os/
├── CLAUDE.md                         # AUTO-GENERATED from brain contents
├── config.json                       # Preferences, active profile, toggles
├── state.json                        # Runtime state
│
├── Entities/
│   ├── Clients/
│   │   └── <name>/ → _meta.json, overview.md, history.md, action-items.md
│   ├── Partners/
│   ├── Vendors/
│   ├── People/
│   └── ENTITY-INDEX.md               # Master cross-reference
│
├── Projects/
│   └── <name>/ → _meta.json, overview.md, action-items.md, .planning/
│
├── Knowledge/
│   ├── INDEX.md
│   ├── systems/
│   ├── decisions/
│   ├── templates/
│   └── references/
│
├── _intake-dump/
│   ├── conversations/
│   ├── voice/
│   └── files/
│
├── Operations/
│   ├── credentials/ → registry.json, vault/
│   ├── mcp-configs/ → active.json, profiles/
│   ├── todos/ → AGGREGATED-VIEW.md, aggregated-todos.json
│   ├── learning/ → patterns.json, preferences.json, sessions/, observations/
│   └── integrations/
│
└── .bizbrain/
    ├── profiles/
    ├── hooks-state.json              # Per-category auto-behavior config
    └── scan-cache.json               # Last scan results (incremental)
```

---

## Initial Scan

### Phase 1: Discovery (automated, ~30-60s)

Scans for:
- **Code projects**: `~/Repos/`, `~/Projects/`, `~/Code/`, `~/src/`
- **Documents**: `~/Documents/`, `~/Desktop/`, `~/Downloads/`
- **Git history**: All discovered repos → activity, collaborators, stacks
- **Package managers**: npm global, pip/pipx, Homebrew/winget/scoop
- **Claude Code config**: `~/.claude/settings.json`, `~/.claude/projects/`, `~/.claude.json`
- **Service configs**: `.env` files, Supabase/Stripe/Clerk configs, CI/CD files

### Phase 2: Profile Selection (interactive)

Plugin recommends a profile based on scan results. User confirms or picks differently.

### Phase 3: Brain Population (automated, ~1-2min)

- Creates folder structure
- Populates Projects/ from discovered repos
- Creates starter entities from collaborators/clients
- Catalogs credentials and services
- Generates first CLAUDE.md
- Sets feature toggles from profile

### Phase 4: MCP Setup (interactive)

- Recommends MCPs based on detected services
- Auto-configures what it can
- Walks through API key setup conversationally

---

## Hook System

### SessionStart

1. Locate brain folder
2. Read config.json for active profile and toggles
3. Generate compressed CLAUDE.md snapshot
4. Inject via `additionalContext` into system prompt
5. Check MCP state for current project
6. **Stale session recovery**: if last session has no end event, process any pending observations

**Target: < 2 seconds.** File reads only, no network calls.

### PostToolUse (The Learning Engine)

Configurable per-category via `hooks-state.json`:

| Category | Default Mode | Triggers |
|----------|-------------|----------|
| Entity detection | `auto_update` | Read, Write, Edit, Bash, WebFetch |
| Action item extraction | `auto_update` | * |
| Project status tracking | `auto_update` | Bash, Write, Edit |
| Credential detection | `ask_first` | Read, Bash |
| Time tracking | `auto_update` | * (heartbeat timestamps) |

Modes: `auto_update` (do it, briefly notify) | `ask_first` (detect, ask user) | `off`

Uses **prompt hooks** for semantic detection (entity matching, action item extraction). Uses **command hooks** for deterministic operations (time stamping, file writes).

**Write-through**: All observations persist immediately to brain folder. No buffering.

### SessionEnd (nice-to-have)

Logs session summary, updates state. If it never fires, nothing is lost — PostToolUse already wrote everything.

### PreCompact

Preserves critical brain context (entity names, active project, open items) before context compaction.

### Time Tracking

Heartbeat-based, not bookend-based. Every tool call gets timestamped. Time is reconstructed from activity gaps, not session start/end events. Works even when sessions are never formally closed.

---

## Profile System

Profiles are JSON configs that toggle features and set defaults:

```json
{
  "name": "developer",
  "description": "Software developer or technical solopreneur",
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
    "service_configs": true
  }
}
```

Users can override any setting. The profile is a starting point, not a cage.

---

## Satellite Plugins

Separate Claude Code plugins that extend the core:

| Plugin | Purpose | Audience |
|--------|---------|----------|
| `bizbrain-slides` | Slidev presentations, export | Presenters, educators |
| `bizbrain-video` | Remotion video creation, YouTube | Content creators |
| `bizbrain-contracts` | Documents, e-signatures | Consultants, agencies |
| `bizbrain-voice` | ElevenLabs TTS, voice notes | Voice workflow users |
| `bizbrain-social` | Social scheduling, campaigns | Marketers |
| `bizbrain-image` | AI image generation | Designers |

Satellites read/write the brain folder. They inherit entity context, credentials, and project awareness from the core.

---

## Distribution

```bash
# Core install
claude plugin add TechIntegrationLabs/bizbrain-os

# Optional satellites
claude plugin add TechIntegrationLabs/bizbrain-slides
claude plugin add TechIntegrationLabs/bizbrain-video

# Marketplace (bundles all)
claude plugin marketplace add TechIntegrationLabs/bizbrain-marketplace
```

---

## Build Phases

### Phase 1 — The Brain Engine (MVP)

- Plugin skeleton with plugin.json
- SessionStart hook: brain detection, CLAUDE.md generation, context injection
- Brain-bootstrap skill: initial scan, profile selection, folder creation
- `/brain` command: status, scan, configure
- Credential management skill
- MCP management skill
- Write-through PostToolUse hooks
- SessionStart stale-session recovery
- Profiles: developer (fully built), others (skeleton)

### Phase 2 — Core Skills

- Entity management (CRUD, watchdog, auto-detection)
- Project tracking (link repos, status, action items)
- Todo management (aggregation across sources)
- Knowledge management (index, search, link)
- Intake processing (drop files, auto-route)
- Time tracking (heartbeat-based)

### Phase 3 — Workflows

- GSD (phases, waves, specs, implementation)
- Communications hub
- Content pipeline
- Outreach engine

### Phase 4 — Satellites

- Ship satellite plugins as demand warrants

---

## Relationship to Existing BizBrain OS

The plugin and the standalone app (Tauri GUI + Node server) **coexist equally**:

- **Shared brain folder**: Both read/write `~/bizbrain-os/`
- **Plugin**: Terminal-first, always-on background intelligence
- **GUI**: Visual dashboard, workflow builder, at-a-glance status
- **Neither required**: Each works independently
- **Better together**: GUI shows what the plugin built; plugin acts on what the user configured in the GUI

The `create-bizbrain` CLI remains for users who want the GUI without Claude Code. For Claude Code users, the plugin handles everything.
