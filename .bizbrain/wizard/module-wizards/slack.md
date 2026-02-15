# Module Wizard: Slack Integration

> This prompt guides Claude Code through setting up the Slack module.

## What This Module Does

Slack integration enables:
- Read and send messages from Claude Code
- Channel monitoring for action items and mentions
- Slack-to-Brain intake (capture important messages)
- Team communication summaries
- Autonomous bug-fixing from Slack issues
- Entity detection in Slack messages

## Prerequisites

- A Slack workspace where you have admin rights (or can create apps)
- Chrome Extension recommended (for guided setup)

## Setup Flow

### Step 1: Check Existing Setup

Check for existing Slack configuration:
- Look in `Operations/dev-config-system/services/slack.json`
- Check for `SLACK_BOT_TOKEN` or `SLACK_TOKEN` in environment

If found and valid, skip to Step 5.

### Step 2: Determine Setup Method

Ask:
"How would you like to connect to Slack?

1. **Browser guided** (recommended) - I'll walk you through creating the Slack app in Chrome
2. **Manual** - You create the app yourself and give me the token
3. **Existing token** - You already have a Slack bot token"

### Step 3a: Browser-Based Setup (if Chrome Extension available)

1. Navigate to https://api.slack.com/apps
2. If not logged in, wait for authentication
3. Guide the user through app creation:

**Create App:**
- Click "Create New App"
- Choose "From scratch"
- App Name: "BizBrain OS"
- Pick the workspace
- Click "Create App"

**Set Permissions:**
- Navigate to "OAuth & Permissions" in the sidebar
- Scroll to "Bot Token Scopes"
- Add these scopes:
  - `channels:history` - Read messages in public channels
  - `channels:read` - List public channels
  - `chat:write` - Send messages
  - `groups:history` - Read messages in private channels (optional)
  - `groups:read` - List private channels (optional)
  - `im:history` - Read DMs (optional)
  - `im:read` - List DMs (optional)
  - `users:read` - List workspace users
  - `reactions:read` - Read reactions
  - `files:read` - Read shared files

**Install to Workspace:**
- Click "Install to Workspace" at the top of OAuth & Permissions
- Review permissions and click "Allow"
- Copy the "Bot User OAuth Token" (starts with `xoxb-`)

4. Read the bot token from the page

### Step 3b: Manual Setup

Tell user:
"To connect Slack:

1. Go to https://api.slack.com/apps
2. Click 'Create New App' > 'From scratch'
3. Name: 'BizBrain OS', select your workspace
4. Go to 'OAuth & Permissions'
5. Under 'Bot Token Scopes', add:
   - channels:history, channels:read, chat:write, users:read
   - Optional: groups:history, groups:read (for private channels)
6. Click 'Install to Workspace' and authorize
7. Copy the 'Bot User OAuth Token' (xoxb-...) and paste it here"

### Step 4: Save Token

Store securely:
```json
// Operations/dev-config-system/services/slack.json
{
  "service": "slack",
  "botToken": "xoxb-...",
  "workspace": "<workspace-name>",
  "appId": "<app-id>",
  "createdAt": "<timestamp>"
}
```

### Step 5: Verify Connection

Test the token:
```bash
curl -X POST https://slack.com/api/auth.test \
  -H "Authorization: Bearer xoxb-..." \
  -H "Content-Type: application/json"
```

List channels:
```bash
curl -X GET "https://slack.com/api/conversations.list?types=public_channel&limit=10" \
  -H "Authorization: Bearer xoxb-..."
```

Show results:
"Connected to Slack workspace '[workspace]'! I can see [N] channels."

### Step 6: Channel Configuration

Ask:
"Which Slack channels should I monitor?

I'll watch these channels for:
- Action items and tasks
- Entity mentions (client/project names)
- Bug reports and issues

List the channels you want me to watch (comma-separated), or say 'all public channels'."

For each channel, confirm:
- Monitor for action items? [Yes/No]
- Monitor for entity mentions? [Yes/No]
- Auto-intake messages? [Yes/No]

### Step 7: Configure MCP

Set up Slack MCP:
```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@anthropic/slack-mcp-server"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-..."
      }
    }
  }
}
```

### Step 8: Configure Features

Ask:
"Additional Slack features:

- [ ] **Daily digest** - Summary of important messages each morning
- [ ] **Slack agent** - Auto-respond to bug reports and fix them
- [ ] **Slack intake** - Pull important messages into Brain for processing
- [ ] **Notification** - Send Brain notifications to a Slack channel

Which features interest you?"

### Step 9: Save Configuration

Update config.json:
```json
{
  "integrations": {
    "slack": {
      "workspace": "<workspace-name>",
      "tokenStored": true,
      "channels": {
        "monitored": ["general", "dev", "bugs"],
        "intake": ["important"],
        "notifications": "brain-notifications"
      },
      "features": {
        "dailyDigest": true/false,
        "slackAgent": true/false,
        "slackIntake": true/false,
        "notifications": true/false
      },
      "mcpEnabled": true,
      "verifiedAt": "<timestamp>"
    }
  }
}
```

### Step 10: Invite Bot to Channels

Remind:
"Don't forget to invite the BizBrain bot to the channels you want me to monitor:
1. Go to each channel in Slack
2. Type `/invite @BizBrain OS`
3. The bot will appear as a member

I need to be in a channel to read its messages."

### Step 11: Activate Module

```bash
node .bizbrain/wizard/generators/module-activator.js activate slack
```

### Step 12: Completion

"Slack is connected! Here's what's ready:

- **Workspace:** [name]
- **Monitoring:** [N] channels
- **Features:** [list enabled features]

**Commands:**
| Command | Purpose |
|---------|---------|
| `/slack-summary` | Summarize recent channel activity |
| `/slack-intake` | Pull important messages into Brain |
| `/slack-agent` | Start autonomous bug-fixing from Slack |
| `/comms slack` | Read/send Slack messages |

Your Brain now has ears in Slack!"
