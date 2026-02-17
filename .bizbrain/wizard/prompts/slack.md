# Module Setup: Slack

> Monitor channels, capture action items, and automate team communication from your Brain.

## What This Module Does

Slack integration turns your workspace into a Brain input channel:
- Read messages and monitor channels for action items and entity mentions
- Slack intake agent processes conversations into your Brain's knowledge
- Daily digests summarize channel activity
- Slack MCP for full API access (read, write, react, upload)
- Autonomous Slack agent for bug-fixing and task routing

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | *(none)* |
| **Agents** | `slack-intake` |
| **Commands** | `slack-intake`, `slack-summary` |
| **Hooks** | *(none)* |
| **MCPs** | `slack.json` |
| **Knowledge** | `slack-integration.md` |

## Prerequisites

| Module | Why |
|--------|-----|
| `chrome-extension` | Browser-guided app creation (optional but recommended) |

## Setup Flow

### Step 1: Check Existing Token

Look for an existing Slack bot token in:
- `Operations/dev-config-system/services/slack.json`
- Environment variable `SLACK_BOT_TOKEN`

If found, offer to reuse it.

### Step 2: Choose Authentication Method

**Q: How would you like to authenticate with Slack?**
- `Browser guided` - Create a Slack app in Chrome, walk through the full setup
- `Manual` - Follow instructions to create the app yourself
- `Existing token` - Provide a bot token you already have

### Step 3: Create Slack App (Browser Guided or Manual)

Guide through the Slack app creation process at `https://api.slack.com/apps`:

1. **Create New App** - Choose "From scratch", name it `BizBrain OS`, select your workspace
2. **Bot Token Scopes** - Navigate to OAuth & Permissions, add these scopes:
   - `channels:history` - Read public channel messages
   - `channels:read` - List channels and their info
   - `chat:write` - Send messages as the bot
   - `users:read` - Access user profiles
   - `reactions:read` - Read emoji reactions
   - `files:read` - Access shared files
   - *(Optional)* `groups:history`, `groups:read` - Private channels
   - *(Optional)* `im:history`, `im:read` - Direct messages
3. **Install to Workspace** - Click "Install App to Workspace", authorize
4. **Copy Bot Token** - The `xoxb-` token from the OAuth page

Optionally, also set up an **App-Level Token** (`xapp-`) for Socket Mode / Events API.

### Step 4: Store Token

Save token securely to `Operations/dev-config-system/services/slack.json`:
```json
{
  "service": "slack",
  "botToken": "xoxb-...",
  "appToken": null,
  "workspace": "your-workspace",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Step 5: Verify Connection

Call the Slack API to confirm the token works:
- `POST https://slack.com/api/auth.test` with the bot token
- List available channels to verify access

### Step 6: Configure Channels

**Q: Which channels should your Brain monitor?** (comma-separated, or "all public")

For each monitored channel, configure:
- **Monitor for action items?** `Yes / No`
- **Watch for entity mentions?** `Yes / No`
- **Auto-intake conversations?** `Yes / No`

### Step 7: Configure Slack MCP

Generate the MCP configuration to enable rich Slack API access from Claude Code.

### Step 8: Configure Features

**Q: Which Slack features do you want?** (select all that apply)
- `Daily digest` - Morning summary of channel activity
- `Slack agent` - Autonomous agent that responds to mentions and fixes bugs
- `Slack intake` - Process Slack threads into Brain knowledge
- `Notifications` - Send Brain alerts to a Slack channel

### Step 9: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "slack": {
      "workspace": "your-workspace",
      "tokenStored": true,
      "channels": {
        "monitored": ["general", "dev", "projects"],
        "intake": ["dev", "projects"],
        "notifications": "brain-alerts"
      },
      "features": {
        "dailyDigest": false,
        "slackAgent": true,
        "slackIntake": true,
        "notifications": true
      },
      "mcpEnabled": true,
      "verifiedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 10: Invite Bot to Channels

Remind the user to invite the bot to each monitored channel:
```
/invite @BizBrain OS
```

The bot cannot read messages in channels it hasn't been invited to.

### Step 11: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate slack
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| Monitor channels | All channels mentioned during setup |
| slackIntake | `true` |
| dailyDigest | `false` |
| slackAgent | `true` |
| notifications | `true` |
| mcpEnabled | `true` |

Quick mode still requires a Slack bot token -- there is no way to skip authentication.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate slack
```

## Completion

Slack is connected. Your Brain can now read messages, monitor channels, and automate team communication.

**Available commands:**
- `/slack-summary` - Get a summary of recent channel activity
- `/slack-intake` - Process Slack threads into Brain knowledge
- `/slack-agent` - Launch autonomous Slack agent for bug-fixing and task routing

**Slack MCP** is active for full API access -- read messages, post replies, react to threads, and more.

Remember to `/invite @BizBrain OS` in every channel you want the bot to monitor.
