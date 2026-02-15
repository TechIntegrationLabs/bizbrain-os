# Module Wizard: Notion Integration

> This prompt guides Claude Code through setting up the Notion module.

## What This Module Does

Notion integration enables:
- Sync Brain data to Notion databases
- Timesheet entries to Notion
- Client/project dashboards in Notion
- Knowledge base sync
- Two-way data flow (Notion changes reflected in Brain)
- Notion as a shared team interface

## Prerequisites

- A Notion account
- Chrome Extension recommended (for guided setup)

## Setup Flow

### Step 1: Check Existing Setup

Check for existing Notion configuration:
- Look in `Operations/dev-config-system/services/notion.json`
- Check environment for `NOTION_API_KEY` or `NOTION_TOKEN`

If found and valid, skip to Step 5.

### Step 2: Determine Setup Method

Ask:
"How would you like to connect to Notion?

1. **Browser guided** (recommended) - I'll walk you through creating the integration in Chrome
2. **Manual** - You create the integration yourself and paste the token
3. **Existing token** - You already have a Notion API token"

### Step 3a: Browser-Based Setup (if Chrome Extension available)

Follow `.bizbrain/wizard/chrome-automations/notion-setup.md` (if it exists, otherwise use inline instructions):

1. Navigate to https://www.notion.so/my-integrations
2. If not logged in, wait for user to authenticate
3. Guide them:
   - Click "New integration"
   - Name: "BizBrain OS"
   - Select the workspace
   - Capabilities: Read content, Update content, Insert content, Read user info
   - Click "Submit"
4. Read the "Internal Integration Secret" from the page
5. Save the token

Important: Remind user they also need to share specific pages/databases with the integration:
"After creating the integration, you need to share the Notion pages you want BizBrain to access:
1. Open a Notion page or database
2. Click '...' menu in the top right
3. Click 'Connect to' or 'Add connections'
4. Select 'BizBrain OS'
5. Click 'Confirm'"

### Step 3b: Manual Setup

Tell user:
"To connect Notion:

1. Go to https://www.notion.so/my-integrations
2. Click 'New integration'
3. Name: 'BizBrain OS'
4. Select your workspace
5. Under Capabilities, enable: Read content, Update content, Insert content
6. Click 'Submit'
7. Copy the 'Internal Integration Secret' and paste it here

Then share your pages with the integration:
1. Open pages you want BizBrain to access
2. Click '...' > 'Connect to' > 'BizBrain OS'"

### Step 4: Save Token

Store securely:
```json
// Operations/dev-config-system/services/notion.json
{
  "service": "notion",
  "token": "<token>",
  "workspace": "<workspace-name>",
  "createdAt": "<timestamp>"
}
```

### Step 5: Verify Connection

Test the token:
```bash
curl -X POST https://api.notion.com/v1/search \
  -H "Authorization: Bearer <token>" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{"page_size": 5}'
```

Show results:
"Connected to Notion workspace '[workspace]'! I can see [N] pages/databases."

### Step 6: Configure Sync Preferences

Ask:
"What would you like to sync between your Brain and Notion?

- [ ] **Timesheet entries** - Daily time logs as Notion database entries
- [ ] **Client records** - Client info mirrored in a Notion database
- [ ] **Project status** - Project dashboards in Notion
- [ ] **Action items/Todos** - Tasks synced both ways
- [ ] **Meeting notes** - Conversation summaries to Notion
- [ ] **Knowledge base** - Key documents synced

Select what matters to you. You can always add more later."

### Step 7: Database Setup

For each selected sync target, either:
1. Connect to an existing Notion database: "Do you have an existing [timesheet/client/etc.] database in Notion?"
2. Create a new one: "I'll create a [Timesheet/Clients/etc.] database in Notion for you."

Store database IDs for each connection.

### Step 8: Configure MCP

Set up Notion MCP:
```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_API_KEY": "<token>"
      }
    }
  }
}
```

### Step 9: Save Configuration

Update config.json:
```json
{
  "integrations": {
    "notion": {
      "workspace": "<workspace-name>",
      "tokenStored": true,
      "sync": {
        "timesheet": { "enabled": true, "databaseId": "<id>" },
        "clients": { "enabled": false, "databaseId": null },
        "projects": { "enabled": false, "databaseId": null },
        "todos": { "enabled": false, "databaseId": null },
        "meetings": { "enabled": false, "databaseId": null },
        "knowledge": { "enabled": false, "databaseId": null }
      },
      "mcpEnabled": true,
      "verifiedAt": "<timestamp>"
    }
  }
}
```

### Step 10: Activate Module

```bash
node .bizbrain/wizard/generators/module-activator.js activate notion
```

### Step 11: Completion

"Notion is connected! Here's what's ready:

- **Workspace:** [name]
- **Syncing:** [list of enabled syncs]
- **MCP:** [Active/Inactive]

**Commands:**
| Command | Purpose |
|---------|---------|
| `/notion sync` | Trigger a sync now |
| `/notion status` | Check sync status |
| `/notion <page>` | Open/read a Notion page |

Your Brain and Notion are now linked. Changes in either place stay in sync!"
