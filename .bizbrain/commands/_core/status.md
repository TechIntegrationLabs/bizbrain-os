# Status Command

Display current Brain status and health.

## Instructions

1. **Read configuration**
   - Load `{{BRAIN_PATH}}/.bizbrain/config.json`
   - Load `{{BRAIN_PATH}}/.bizbrain/wizard/state.json`

2. **Gather statistics**
   - Count projects: `ls {{BRAIN_PATH}}/Projects/`
   - Count clients: `ls {{BRAIN_PATH}}/Clients/`
   - Count partners: `ls {{BRAIN_PATH}}/Partners/`
   - Count vendors: `ls {{BRAIN_PATH}}/Vendors/`
   - Check active todos: Read `{{BRAIN_PATH}}/Operations/todos/AGGREGATED-VIEW.md`
   - Recent activity: Last 5 entries from `{{BRAIN_PATH}}/_intake-dump/`

3. **Check integrations**
   - Read MCP status from `.bizbrain/mcp-status.json` (if exists)
   - Check for API keys in `.bizbrain/vault/` (don't display values, just presence)
   - Connected services: Notion, Slack, Supabase, GitHub, etc.

4. **Display organized status**

```
{{BUSINESS_NAME}} - Brain Status
════════════════════════════════════════════════

Core Info:
  Location: {{BRAIN_PATH}}
  Version: [from config]
  User: {{USER_NAME}}

Active Modules:
  ✓ core
  ✓ development (GSD)
  ✓ clients
  ✓ content

Entity Counts:
  Projects: 4 active
  Clients: 7 active
  Partners: 3 active
  Vendors: 2 active

Activity:
  Open todos: 12
  Recent intake: 3 items (last 24h)
  Active projects: BuildTrack, GEOViz
  Last sync: 2h ago

Integrations:
  ✓ Notion (synced)
  ✓ Slack (connected)
  ✓ Supabase (3 projects)
  ✓ GitHub (authenticated)
  ✗ Video rendering (not configured)

Health: GOOD
Next suggested action: Process intake queue (/intake)
```

5. **Suggest actions**
   - If intake has items: suggest `/intake`
   - If todos pending: show count
   - If sync needed: suggest `/sync`
