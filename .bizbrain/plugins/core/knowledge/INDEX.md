# BizBrain OS Knowledge Index

Complete index of all knowledge documentation.

## Systems

Core system documentation explaining how BizBrain works.

### Folder Structure
**File:** `systems/folder-structure.md`
**When to load:** Setting up Brain, understanding organization, creating entities/projects
**Topics:** Root structure, entity folders, project folders, operations, intake, config

### Entity System
**File:** `systems/entity-system.md`
**When to load:** Working with clients, partners, vendors, understanding relationships
**Topics:** Entity types, lifecycle, metadata schema, relationships, action items, status tracking

### Entity Watchdog
**File:** `systems/entity-watchdog.md`
**When to load:** Auto-detection of entity mentions, updating entity records
**Topics:** Auto-update rules, detection patterns, when to ask first, Entity Index

### GSD System
**File:** `systems/gsd-system.md`
**When to load:** Project execution, planning phases, creating roadmaps, tracking progress
**Topics:** Requirements, roadmap, phases, waves, tasks, workflow, commands

### Intake System
**File:** `systems/intake-system.md`
**When to load:** Processing incoming files, voice notes, emails, conversation captures
**Topics:** File types, processing pipeline, routing rules, conversation capture

### Timesheet System
**File:** `systems/timesheet-system.md`
**When to load:** Time tracking, generating reports, billing
**Topics:** Session hooks, log format, report generation, export, Notion sync

### Content Factory
**File:** `systems/content-factory.md`
**When to load:** Generating content, slideshows, videos, automated publishing
**Topics:** Detection, generation pipeline, templates, publishing workflow

### Communication Hub
**File:** `systems/communication-hub.md`
**When to load:** Unified communications, Slack, email, voice profiles
**Topics:** Channels, entity linking, follow-ups, voice profiles

### Spec System
**File:** `systems/spec-system.md`
**When to load:** Writing feature specs, spec-driven development
**Topics:** Spec structure, approval flow, implementation linking, lifecycle

### GitHub Workflow
**File:** `systems/github-workflow.md`
**When to load:** Repository management, PRs, branches, GitHub integration
**Topics:** Repo registry, cloning, PR creation, token management, gh CLI

### Supabase Workflow
**File:** `systems/supabase-workflow.md`
**When to load:** Database operations, Supabase projects, schema management
**Topics:** Project detection, schema, RLS, Edge Functions, migrations

### Notion Integration
**File:** `systems/notion-integration.md`
**When to load:** Notion sync, database mapping, bidirectional sync
**Topics:** Setup, mapping, sync direction, conflict resolution

### Slack Integration
**File:** `systems/slack-integration.md`
**When to load:** Slack bot setup, message intake, summaries
**Topics:** Bot configuration, channels, intake processing, entity mentions

### Video Generation
**File:** `systems/video-generation.md`
**When to load:** Creating videos with Remotion, programmatic video
**Topics:** Remotion concepts, templates, rendering, video types

### Slideshow System
**File:** `systems/slideshow-system.md`
**When to load:** Creating presentations, slide decks
**Topics:** Formats, themes, content extraction, export options

## Operations

Documentation for operational tools and processes.

### MCP Configurations
**File:** `operations/mcp-configs.md`
**When to load:** Managing MCPs, enabling/disabling, profiles, subprocess delegation
**Topics:** MCP registry, profiles, enabling, subprocess, token usage

### Dev Config System
**File:** `operations/dev-config-system.md`
**When to load:** Credential management, API keys, secure storage
**Topics:** Vault structure, encryption, retrieval, project mappings

## Reference

Quick reference and command documentation.

### Commands Reference
**File:** `reference/commands-reference.md`
**When to load:** Learning available commands, command usage
**Topics:** All slash commands organized by category with examples

### Knowledge Index
**File:** `reference/INDEX.md` (this file)
**When to load:** Finding relevant knowledge to load
**Topics:** All knowledge files with descriptions and when to use them

## Loading Knowledge

Use the `/knowledge` command:

```
/knowledge systems/gsd-system       Load GSD documentation
/knowledge systems/entity-system    Load entity system docs
/knowledge operations/mcp-configs   Load MCP configuration docs
/knowledge reference/commands       Load command reference
```

Or by topic keyword:

```
/knowledge gsd          → systems/gsd-system.md
/knowledge entities     → systems/entity-system.md
/knowledge folder       → systems/folder-structure.md
/knowledge mcp          → operations/mcp-configs.md
```

## Knowledge Organization

```
.bizbrain/knowledge/
├── systems/              Core system documentation
│   ├── folder-structure.md
│   ├── entity-system.md
│   ├── entity-watchdog.md
│   ├── gsd-system.md
│   ├── intake-system.md
│   ├── timesheet-system.md
│   ├── content-factory.md
│   ├── communication-hub.md
│   ├── spec-system.md
│   ├── github-workflow.md
│   ├── supabase-workflow.md
│   ├── notion-integration.md
│   ├── slack-integration.md
│   ├── video-generation.md
│   └── slideshow-system.md
├── operations/           Operational procedures
│   ├── mcp-configs.md
│   └── dev-config-system.md
└── reference/            Quick reference
    ├── commands-reference.md
    └── INDEX.md
```

## Context-Aware Loading

Claude Code should proactively load relevant knowledge based on context:

**When user mentions...**
- "client" or "customer" → Load `entity-system.md`
- "project phases" or "roadmap" → Load `gsd-system.md`
- "sync to Notion" → Load `notion-integration.md`
- "database" or "Supabase" → Load `supabase-workflow.md`
- "time tracking" or "hours" → Load `timesheet-system.md`
- "video" or "Remotion" → Load `video-generation.md`
- "folder structure" or "where does X go" → Load `folder-structure.md`
- "MCP" or "enable integration" → Load `mcp-configs.md`
- "credentials" or "API key" → Load `dev-config-system.md`

## Template Variables in Knowledge Files

All knowledge files support these variables:
- `{{BUSINESS_NAME}}` - Business name from config
- `{{USER_NAME}}` - User's name from config
- `{{BRAIN_PATH}}` - Absolute path to Brain folder
- `{{PROJECT_NAME}}` - Current project name
- `{{ENTITY_NAME}}` - Entity being worked on
- `{{CLIENT_NAME}}` - Client name

Variables are replaced when knowledge is loaded and displayed.

## Keeping Knowledge Current

Knowledge files should be:
1. **Updated** when systems change
2. **Versioned** in git
3. **Referenced** from commands
4. **Linked** to related topics
5. **Examples-heavy** with real use cases
6. **Concise** but complete

## Contributing Knowledge

When adding new knowledge:
1. Place in appropriate category (systems/operations/reference)
2. Update this INDEX.md
3. Add template variables
4. Include examples
5. Link from related files
6. Test loading command
