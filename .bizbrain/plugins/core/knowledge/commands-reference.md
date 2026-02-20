# BizBrain OS Commands Reference

Complete reference for all slash commands.

## Core Commands

Essential Brain operations.

### /setup
Initialize or reconfigure BizBrain OS.

**Usage:** `/setup`

**Actions:**
- First-time setup: Run interview wizard
- Already configured: Re-run interview, open dashboard, or show config

**Example:**
```
/setup
→ Runs initial setup interview, creates config.json, activates modules
```

### /setup-module
Activate a specific module.

**Usage:** `/setup-module <module-name>`

**Arguments:**
- `<module-name>` - Module to activate (core, development, clients, etc.)

**Example:**
```
/setup-module development
→ Activates GSD system, copies commands, creates .planning/ structure
```

### /status
Show Brain status and health.

**Usage:** `/status`

**Shows:**
- Business info and active modules
- Entity counts (clients, partners, vendors, projects)
- Active todos
- Recent activity
- Integration status
- Health indicators

**Example:**
```
/status
→ Displays complete Brain status dashboard
```

### /help
List all available commands.

**Usage:** `/help [category]`

**Optional:** Filter by category (core, dev, entity, integration, content)

**Example:**
```
/help
→ Shows all commands grouped by category
```

### /knowledge
Load Brain knowledge documentation.

**Usage:** `/knowledge <topic-path>`

**Arguments:**
- `<topic-path>` - Path to knowledge file (e.g., `systems/gsd-system`)

**Example:**
```
/knowledge systems/entity-system
→ Loads entity system documentation
```

### /find
Search across all Brain content.

**Usage:** `/find <search-query>`

**Arguments:**
- `<search-query>` - Text to search for

**Example:**
```
/find "client onboarding"
→ Searches all Brain files for matches
```

### /dashboard
Open configuration dashboard.

**Usage:** `/dashboard [action]`

**Actions:**
- (none) - Start and open dashboard
- `stop` - Stop dashboard server

**Example:**
```
/dashboard
→ Starts server on port 3456, opens in browser
```

## Development Commands

GSD system and development workflows.

### /gsd
Show GSD status and next action.

**Usage:** `/gsd`

**Shows:**
- Current phase and wave
- Progress percentage
- Next action
- Quick action menu

**Example:**
```
/gsd
→ Displays GSD status, suggests /gsd-execute
```

### /gsd-requirements
Define what "done" looks like.

**Usage:** `/gsd-requirements [phase]`

**Arguments:**
- `[phase]` - Optional phase ID (default: current phase)

**Example:**
```
/gsd-requirements
→ Interactive interview, creates requirements.json
```

### /gsd-roadmap
Create or update phase roadmap.

**Usage:** `/gsd-roadmap`

**Creates:**
- Phase structure
- Deliverables per phase
- Timeline estimates
- roadmap.json file

**Example:**
```
/gsd-roadmap
→ Proposes 4-phase roadmap, saves to .planning/roadmap.json
```

### /gsd-plan
Plan current phase into waves.

**Usage:** `/gsd-plan [phase-id]`

**Creates:**
- Wave structure
- Tasks per wave
- Acceptance criteria
- plan.json and status.json

**Example:**
```
/gsd-plan
→ Breaks Phase 2 into 4 waves with 18 total tasks
```

### /gsd-execute
Execute current phase plan.

**Usage:** `/gsd-execute [wave-id]`

**Modes:**
- Guided sequential (default)
- Manual task selection
- Autonomous (auto-execute all)

**Example:**
```
/gsd-execute
→ Executes Wave 2 tasks, updates status.json
```

### /gsd-status
Detailed progress view.

**Usage:** `/gsd-status [phase-id]`

**Shows:**
- All phases and waves
- Task completion
- Time estimated vs. actual
- Blockers and risks
- Recent activity

**Example:**
```
/gsd-status
→ Shows 45% complete (27 of 60 tasks)
```

### /spec
Create feature specification.

**Usage:** `/spec <feature-name>`

**Arguments:**
- `<feature-name>` - Feature to spec

**Creates:**
- Detailed spec in `.planning/specs/`
- Technical design
- Implementation plan
- Acceptance criteria

**Example:**
```
/spec user-dashboard
→ Spawns spec-writer, creates user-dashboard.md
```

### /implement
Execute implementation from spec.

**Usage:** `/implement <spec-name>`

**Arguments:**
- `<spec-name>` - Spec file to implement

**Process:**
- TDD approach
- Incremental commits
- Test verification
- Progress tracking

**Example:**
```
/implement user-dashboard
→ Spawns implement-agent, builds feature from spec
```

### /crush
Quick bug fix.

**Usage:** `/crush [bug-description]`

**Arguments:**
- `[bug-description]` - Optional bug description

**Process:**
- Reproduce bug
- Diagnose cause
- Implement fix
- Add test
- Commit

**Example:**
```
/crush null pointer in dashboard
→ Quick diagnosis and fix with test
```

### /diagnose
Systematic issue investigation.

**Usage:** `/diagnose <issue-description>`

**Arguments:**
- `<issue-description>` - Symptom or error

**Creates:**
- Diagnostic report
- Root cause analysis
- Solution options
- Implementation path

**Example:**
```
/diagnose "app crashes on login"
→ Systematic investigation, creates diagnostic report
```

## Entity Commands

Manage clients, partners, and vendors.

### /add-client
Add new client.

**Usage:** `/add-client [client-name]`

**Arguments:**
- `[client-name]` - Optional client name

**Creates:**
- Client folder structure
- _meta.json with metadata
- Contact and history files
- Entity Index entry

**Example:**
```
/add-client "Acme Corp"
→ Interactive setup, creates Clients/Acme-Corp/
```

### /add-partner
Add new partner.

**Usage:** `/add-partner [partner-name]`

**Arguments:**
- `[partner-name]` - Optional partner name

**Creates:**
- Partner folder structure
- Partnership type and terms
- Agreement documentation

**Example:**
```
/add-partner "Integration Co"
→ Creates Partners/Integration-Co/
```

### /add-vendor
Add new vendor.

**Usage:** `/add-vendor [vendor-name]`

**Arguments:**
- `[vendor-name]` - Optional vendor name

**Creates:**
- Vendor folder structure
- Contract details
- Renewal tracking
- Access credentials file

**Example:**
```
/add-vendor "Cloud Services Inc"
→ Creates Vendors/Cloud-Services-Inc/
```

### /list-entities
List all entities.

**Usage:** `/list-entities [type]`

**Arguments:**
- `[type]` - Optional filter: clients, partners, vendors, all

**Shows:**
- Entity name and status
- Primary contact
- Projects (clients)
- Service (vendors)
- Recent activity

**Example:**
```
/list-entities clients
→ Lists 7 active clients with details
```

## Integration Commands

External service integrations.

### /notion
Notion operations.

**Usage:** `/notion [action]`

**Actions:**
- `status` - Show sync status
- `sync` - Bidirectional sync
- `push` - Push to Notion
- `pull` - Pull from Notion
- `setup` - Configure integration

**Example:**
```
/notion sync
→ Syncs clients, projects, todos with Notion
```

### /slack-intake
Pull Slack messages.

**Usage:** `/slack-intake [channel]`

**Arguments:**
- `[channel]` - Optional channel name or ID

**Process:**
- Fetch recent messages
- Process for action items
- Link to entities
- Create todos

**Example:**
```
/slack-intake #general
→ Pulls last 24 hours, extracts 3 action items
```

### /slack-summary
Summarize Slack activity.

**Usage:** `/slack-summary [period]`

**Arguments:**
- `[period]` - today, week, month

**Creates:**
- Activity summary
- Key topics
- Action items
- Entity mentions

**Example:**
```
/slack-summary week
→ Summarizes this week's Slack activity
```

### /supabase
Supabase operations.

**Usage:** `/supabase [action]`

**Actions:**
- `status` - Show project status
- `connect` - Connect to project
- `schema` - View/modify schema
- `query` - Run SQL query
- `migrate` - Create/apply migrations
- `setup` - Initialize Supabase

**Example:**
```
/supabase schema
→ Shows all tables, RLS policies, relationships
```

### /deploy
Deploy to Netlify.

**Usage:** `/deploy [site] [directory]`

**Arguments:**
- `[site]` - Optional site name
- `[directory]` - Optional build directory

**Example:**
```
/deploy my-app ./dist
→ Deploys dist/ to my-app.netlify.app
```

### /repos
List and manage repositories.

**Usage:** `/repos [action]`

**Actions:**
- (none) - List all repos
- `sync` - Sync repo registry
- `clone <url>` - Clone repo

**Example:**
```
/repos
→ Lists all GitHub repos with local status
```

## Content Commands

Content generation and management.

### /content
Content factory entry point.

**Usage:** `/content [action]`

**Shows:**
- Content pipeline
- Recent content
- Generation options

**Example:**
```
/content
→ Shows content dashboard, generation menu
```

### /slideshow
Create slideshow presentation.

**Usage:** `/slideshow [title]`

**Arguments:**
- `[title]` - Optional slideshow title

**Creates:**
- Slide deck from content
- Auto-generated slides
- Export in multiple formats

**Example:**
```
/slideshow "Q1 Review"
→ Generates presentation from Q1 data
```

### /video
Create video with Remotion.

**Usage:** `/video <type> [title]`

**Arguments:**
- `<type>` - promo, demo, tutorial, data, intro
- `[title]` - Optional video title

**Creates:**
- Remotion composition
- Programmatic video
- Renders to MP4

**Example:**
```
/video promo "ProjectAlpha Launch"
→ Creates 30-second promo video
```

### /digest
Generate activity digest.

**Usage:** `/digest [period]`

**Arguments:**
- `[period]` - week, month, quarter

**Creates:**
- Summary of activity
- Key accomplishments
- Metrics and stats

**Example:**
```
/digest week
→ Generates weekly digest from all sources
```

### /hours
Quick timesheet summary.

**Usage:** `/hours [period]`

**Arguments:**
- `[period]` - today, week, month, or date range

**Shows:**
- Total hours
- By project/client
- Billable breakdown
- Current session

**Example:**
```
/hours week
→ Shows 32.5 hours this week across 3 projects
```

### /timesheet
Detailed timesheet report.

**Usage:** `/timesheet [period] [format]`

**Arguments:**
- `[period]` - Date range
- `[format]` - markdown, csv, json, pdf

**Creates:**
- Hourly breakdown
- Activity details
- Export in specified format

**Example:**
```
/timesheet month csv
→ Generates January timesheet as CSV
```

## Command Patterns

### Argument Conventions

- `<required>` - Must provide
- `[optional]` - Can omit
- `[action]` - Choose from menu
- `[type]` - Specific value from list

### Interactive vs. Direct

**Interactive:**
```
/add-client
→ Asks for name, contact, details
```

**Direct:**
```
/add-client "Acme Corp"
→ Skips name prompt, goes to contact details
```

### Confirmation Prompts

Commands that modify data ask for confirmation:
```
/gsd-execute
→ "Ready to execute Wave 2? [Y/n]"
```

### Error Handling

If arguments invalid:
```
/setup-module invalid-name
→ "Module 'invalid-name' not found. Available: core, development, ..."
```

## Module-Specific Commands

Some commands only available when modules active:

**Core module:** (always active)
- /setup, /status, /help, /knowledge, /find, /dashboard

**Development module:**
- /gsd*, /spec, /implement, /crush, /diagnose

**Clients module:**
- /add-client, /list-entities

**Partners module:**
- /add-partner

**Vendors module:**
- /add-vendor

**Integrations module:**
- /notion, /slack-intake, /slack-summary, /supabase, /deploy, /repos

**Content module:**
- /content, /slideshow, /video, /digest, /hours, /timesheet

Activate modules with `/setup-module <module-name>`
