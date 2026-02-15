# BizBrain OS Folder Structure

This document explains how {{BUSINESS_NAME}}'s Brain is organized.

## Root Structure

```
{{BRAIN_PATH}}/
├── Clients/              Client/customer entities
├── Partners/             Strategic partner entities
├── Vendors/              Vendor/supplier entities
├── Projects/             All active and archived projects
├── Operations/           Business operations and systems
├── _intake-dump/         Incoming files to process
├── .bizbrain/            Brain configuration and templates
└── .claude/              Claude Code configurations
```

## Entity Folders (Clients, Partners, Vendors)

Each entity has a standardized structure:

```
Clients/{Client-Name}/
├── _meta.json                Entity metadata
├── _context/                 Entity context and history
│   ├── contacts.md          Contact information
│   ├── history.md           Chronological history
│   ├── action-items.md      Todos and action items
│   └── notes.md             General notes
├── _pulse/                   Current status
│   └── STATUS.md            Latest status and health
├── _projects/                Links to related projects
└── _credentials/             Access info (gitignored)
    └── access-info.md
```

### Entity Metadata (_meta.json)

Contains:
- Entity ID and type
- Name and aliases
- Status (active/inactive/archived)
- Primary contact information
- Created date
- Type-specific data (partnership type, service, etc.)
- Tags for categorization

### Context Files

**contacts.md** - Contact information
- Primary contact
- Secondary contacts
- Technical/business/support contacts
- Contact history and notes

**history.md** - Chronological log
- Date-stamped entries
- Major events and milestones
- Meetings and communications
- Contract changes

**action-items.md** - Todos
- Active action items (unchecked)
- Completed items (checked, with dates)
- Blocked items with dependencies
- Future reminders

**notes.md** - General information
- Unstructured notes
- Ideas and observations
- Reference information

### Pulse Folder

**STATUS.md** - Current state
- Overall status
- Recent activity
- Next actions
- Health indicators
- Last updated timestamp

## Project Folders

```
Projects/{Project-Name}/
├── _meta.json                Project metadata
├── _context/                 Project context
│   ├── requirements.md      What "done" looks like
│   ├── client.json          Client link
│   ├── repo-link.json       Code repository link
│   ├── action-items.md      Project todos
│   └── notes.md             Project notes
├── _pulse/
│   └── STATUS.md            Current project status
├── .planning/                GSD planning (if GSD-managed)
│   ├── roadmap.json
│   ├── requirements.json
│   └── phases/
└── docs/                     Project documentation
    ├── architecture.md
    ├── api-reference.md
    └── user-guide.md
```

### Project Metadata

- Project ID
- Name and description
- Client reference
- Repository location
- Status (planning/active/on-hold/complete)
- Start/end dates
- Team members
- Technologies

### GSD Structure (.planning/)

If project uses GSD system:

```
.planning/
├── roadmap.json             Phase roadmap
├── requirements.json        Project requirements
├── phases/
│   ├── phase-1/
│   │   ├── requirements.md
│   │   ├── plan.json
│   │   ├── status.json
│   │   └── waves/
│   ├── phase-2/
│   └── ...
├── specs/                   Feature specifications
│   ├── feature-name.md
│   └── tracking.json
└── diagnostics/             Issue investigations
    ├── issue-id.md
    └── tracking.json
```

## Operations Folder

```
Operations/
├── todos/                    Todo management
│   ├── AGGREGATED-VIEW.md   Human-readable dashboard
│   ├── aggregated-todos.json Machine-readable aggregate
│   ├── ACTIVE-TODOS.md      Operational todos
│   └── SYSTEM-DESIGN.md     Todo system docs
├── timesheet/                Time tracking
│   ├── tracked-time.json    Aggregate timesheet
│   ├── manual-entries.json  Manual time entries
│   └── reports/             Generated reports
├── entity-watchdog/          Entity tracking
│   └── ENTITY-INDEX.md      Master entity index
├── video-studio/             Video generation
│   └── projects/            Video projects
├── content-factory/          Content generation
│   ├── pipeline/            Content pipeline
│   └── published/           Published content
├── communication-hub/        Unified communications
│   ├── channels/            Channel configs
│   └── archives/            Message archives
├── sync/                     Integration sync
│   ├── notion/
│   ├── slack/
│   └── github/
└── brand/                    Brand assets
    ├── logos/
    ├── colors.json
    └── fonts/
```

## Intake Folder

```
_intake-dump/
├── conversations/            Captured conversations
│   ├── _live/               Active conversations
│   ├── {date}-{topic}.md    Completed conversations
│   └── _archive/            Old conversations
├── voice-notes/              Audio recordings
├── emails/                   Email captures
├── documents/                Document scans
├── screenshots/              Screen captures
└── processed/                Successfully processed items
```

## Configuration Folders

```
.bizbrain/
├── config.json              Brain configuration
├── capabilities.json        Feature capabilities
├── commands/                Slash commands
│   ├── _core/
│   ├── _dev/
│   ├── _entity/
│   ├── _integration/
│   └── _content/
├── knowledge/               Knowledge base
│   ├── systems/
│   ├── operations/
│   └── reference/
├── templates/               Entity/project templates
│   ├── entity/
│   │   ├── client/
│   │   ├── partner/
│   │   └── vendor/
│   └── project/
├── integrations/            Integration configs
│   ├── notion/
│   ├── slack/
│   ├── supabase/
│   └── github/
├── wizard/                  Setup wizards
│   ├── interview.md
│   ├── module-wizards/
│   ├── generators/
│   └── state.json
├── dashboard/               Web dashboard
│   ├── server.js
│   └── public/
└── vault/                   Encrypted credentials
```

## File Naming Conventions

### Folders
- `PascalCase` for entity names: `Acme-Corp/`
- `kebab-case` for projects: `build-track-app/`
- `_underscore` for system folders: `_context/`, `_pulse/`
- `.dot` for config folders: `.bizbrain/`, `.planning/`

### Files
- `kebab-case.md` for documents: `action-items.md`
- `kebab-case.json` for data: `repo-link.json`
- `UPPERCASE.md` for important docs: `STATUS.md`, `README.md`

### Dates
- ISO format in filenames: `2024-01-15-meeting-notes.md`
- ISO timestamps in JSON: `"2024-01-15T10:30:00Z"`

## Ignored Files (.gitignore)

Never commit:
- `_credentials/` folders (sensitive data)
- `.env` files
- `vault/` contents (encrypted, managed separately)
- `_live/` folders (temporary)
- Large binary files (videos, high-res images)

## Path References

When linking between entities:
- Use relative paths within Brain: `../../Clients/Acme-Corp/`
- Use JSON references for relationships: `{"clientId": "client-123"}`
- Store absolute paths in config: `repo-link.json`

## Best Practices

1. **Keep it flat** - No deep nesting beyond standard structure
2. **Use templates** - Copy from `.bizbrain/templates/`
3. **Update metadata** - Keep `_meta.json` and `STATUS.md` current
4. **Link entities** - Use references, not duplicates
5. **Archive old data** - Move to `_archive/` subfolders
6. **Follow conventions** - Consistent naming and structure
7. **Document changes** - Add to `history.md` files

## Template Variables

When creating from templates:
- `{{BUSINESS_NAME}}` → Your business name
- `{{USER_NAME}}` → Your name
- `{{BRAIN_PATH}}` → Absolute path to Brain
- `{{ENTITY_NAME}}` → Entity being created
- `{{PROJECT_NAME}}` → Project being created
- `{{CREATED_DATE}}` → ISO date string
- `{{CLIENT_NAME}}` → Client name
- `{{CONTACT_NAME}}` → Primary contact name
