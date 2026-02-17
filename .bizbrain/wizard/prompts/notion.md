# Module Setup: Notion Integration

> Two-way sync between your Brain and Notion -- timesheets, clients, projects, todos, and knowledge flow seamlessly across both systems.

## What This Module Does

Notion Integration connects your Brain to your Notion workspace:
- Sync timesheet entries, client records, project status, and action items to Notion databases
- Pull Notion content into your Brain's knowledge base
- Full Notion MCP for querying pages, databases, and creating content from Claude Code
- Configurable sync direction -- push, pull, or bidirectional
- Agent that handles sync operations on demand or on a schedule

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | *(none)* |
| **Agents** | `notion-sync` |
| **Commands** | `notion`, `notion-sync` |
| **Hooks** | *(none)* |
| **MCPs** | `notion.json` |
| **Knowledge** | `notion-integration.md` |

## Prerequisites

| Module | Why |
|--------|-----|
| `chrome-extension` | Browser-guided integration creation (optional but recommended) |

You need a Notion account (free tier works) and permission to create integrations in your workspace.

## Setup Flow

### Step 1: Check Existing Config

Look for an existing Notion token in `Operations/dev-config-system/services/notion.json` or environment variables (`NOTION_API_KEY`, `NOTION_TOKEN`). If found, offer to reuse it.

### Step 2: Choose Authentication Method

**Q: How would you like to connect Notion?**
- `Browser guided` - Walk through integration creation in Chrome
- `Manual` - You'll create the integration yourself and paste the token
- `Existing token` - Use a token you already have

### Step 3: Create Integration (Browser Guided)

Navigate to `https://www.notion.so/my-integrations` and guide through:
1. Click "New integration"
2. Name: `BizBrain OS`
3. Associated workspace: select your workspace
4. Capabilities: Read content, Update content, Insert content, Read user information
5. Click "Submit"
6. Copy the Internal Integration Secret (starts with `ntn_` or `secret_`)

**For manual:** Direct the user through the same steps on their own.

### Step 4: Share Pages with Integration

**IMPORTANT:** Notion integrations can only access pages explicitly shared with them.

Remind the user: Go to any page or database you want BizBrain to access, click the `...` menu in the top right, select "Connect to", and choose "BizBrain OS". Repeat for each top-level page -- child pages inherit access automatically.

### Step 5: Store Token

Save the token to `Operations/dev-config-system/services/notion.json`:
```json
{
  "service": "notion",
  "token": "ntn_...",
  "workspaceId": "workspace-id",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Step 6: Verify Connection

Make a POST request to `https://api.notion.com/v1/search` with the token in the `Authorization: Bearer` header and `Notion-Version: 2022-06-28`. Confirm the response includes accessible pages.

### Step 7: Configure Sync Targets

**Q: What would you like to sync with Notion?** (select all that apply)
- **Timesheet entries** - Log hours to a Notion database
- **Client records** - Mirror your Clients/ folder to Notion
- **Project status** - Sync project dashboards and milestones
- **Action items** - Two-way todo sync between Brain and Notion
- **Meeting notes** - Capture meeting notes in both systems
- **Knowledge base** - Sync knowledge files with Notion pages

### Step 8: Map Databases

For each selected sync target, ask:
- **Connect to existing database?** Provide the database URL or ID.
- **Create a new database?** Auto-create with the right schema in a specified parent page.

Store all database IDs for the sync agent to use.

### Step 9: Sync Preferences

**Q: Sync direction?**
- `Push` - Brain to Notion only
- `Pull` - Notion to Brain only
- `Both` - Bidirectional sync (recommended)

**Q: Sync frequency?**
- `Realtime` - Sync on every change (via commands)
- `Daily` - Once per day
- `Manual` - Only when you run `/notion sync`

### Step 10: Configure Notion MCP

Generate the MCP configuration for Notion, enabling rich API access (query databases, create pages, update properties) directly from Claude Code.

### Step 11: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "notion": {
      "workspaceId": "workspace-id",
      "tokenStored": true,
      "sync": {
        "timesheet": true,
        "clients": true,
        "projects": true,
        "todos": true,
        "meetings": false,
        "knowledge": true
      },
      "syncDirection": "both",
      "syncFrequency": "manual",
      "mcpEnabled": true,
      "verifiedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 12: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate notion
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| syncDirection | `"both"` |
| syncFrequency | `"manual"` |
| mcpEnabled | `true` |
| timesheet | `true` |
| clients | `true` |
| projects | `true` |
| todos | `true` |
| meetings | `false` |
| knowledge | `true` |

Quick mode still requires a token -- there is no way around Notion authentication. It skips sync target selection and uses the defaults above.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate notion
```

## Completion

Notion is linked to your Brain. The `notion-sync` agent is deployed and your MCP is configured for direct API access.

**Available commands:**
- `/notion sync` - Run a sync cycle across all configured targets
- `/notion status` - Show sync status, last sync time, and any errors

**Notion MCP** is active for direct queries -- search pages, read databases, create content, and manage properties from Claude Code.
