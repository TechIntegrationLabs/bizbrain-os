# Module Setup: Gmail

> Read, send, and auto-process emails from your Brain -- inbox monitoring, email intake, follow-up reminders, and entity-linked communication all from Claude Code.

## What This Module Does

Gmail Integration connects your email workflow to your Brain:
- Read your inbox and search for specific emails without leaving the terminal
- Send emails directly from Claude Code with full formatting support
- Email intake agent that auto-processes important messages into your Brain
- Follow-up reminders for emails that need a response
- Entity linking -- emails from known clients, partners, or vendors are automatically associated with their Brain records
- Gmail MCP for full API access to your mailbox

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | *(none)* |
| **Agents** | `email-intake` |
| **Commands** | `email`, `email-check` |
| **Hooks** | *(none)* |
| **MCPs** | `gmail.json` |
| **Knowledge** | `email-integration.md` |

## Prerequisites

| Module | Why |
|--------|-----|
| `chrome-extension` | Browser-guided OAuth flow (recommended) |

You need a Gmail account (personal or Google Workspace). OAuth authentication requires a Google Cloud project, which adds a few extra steps compared to simpler API key-based integrations.

## Setup Flow

### Step 1: Check Existing Config

Look for existing Gmail credentials in `Operations/dev-config-system/services/gmail.json` or environment variables (`GMAIL_OAUTH_TOKEN`, `GOOGLE_APPLICATION_CREDENTIALS`). If found, offer to reuse.

### Step 2: Gmail Account

**Q: Which Gmail account do you want to connect?**

Enter the full email address (e.g., `you@gmail.com` or `you@company.com` for Workspace).

### Step 3: Choose Authentication Method

**Q: How would you like to authenticate with Gmail?**
- `Browser guided (OAuth)` - Walk through the Google Cloud setup in Chrome (recommended)
- `Manual token` - You'll set up OAuth credentials yourself and provide the token

### Step 4: OAuth Setup (Browser Guided)

Gmail OAuth requires a Google Cloud project. This is more involved than a simple API key but is the only way Google allows programmatic email access.

Guide through these steps:
1. Navigate to `https://console.cloud.google.com/`
2. Create a new project (or select existing): name it "BizBrain OS"
3. Enable the Gmail API: APIs & Services > Library > search "Gmail API" > Enable
4. Configure OAuth consent screen: APIs & Services > OAuth consent screen
   - User type: External (or Internal for Workspace)
   - App name: "BizBrain OS"
   - Scopes: `gmail.readonly`, `gmail.send`, `gmail.modify`
5. Create credentials: APIs & Services > Credentials > Create Credentials > OAuth client ID
   - Application type: Desktop app
   - Name: "BizBrain OS"
6. Download the client credentials JSON
7. Run the OAuth flow to get a refresh token

**For manual:** Direct the user through the same steps or ask them to provide existing OAuth credentials (client ID, client secret, refresh token).

### Step 5: Note on OAuth Complexity

Gmail authentication is intentionally more complex than services like GitHub or Stripe. Google requires OAuth consent screens, project setup, and scope approvals. This is normal and a one-time setup. Once configured, the refresh token handles re-authentication automatically.

### Step 6: Store Credentials

Save to `Operations/dev-config-system/services/gmail.json`:
```json
{
  "service": "gmail",
  "account": "you@gmail.com",
  "clientId": "...",
  "clientSecret": "...",
  "refreshToken": "...",
  "scopes": ["gmail.readonly", "gmail.send", "gmail.modify"],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Step 7: Verify Connection

Test API access by fetching the most recent email subject line. Confirm the connection works and the correct account is linked.

### Step 8: Email Features

**Q: Which email features do you want?** (select all that apply)
- **Read inbox** - Browse and search your inbox from Claude Code
- **Send email** - Compose and send emails from the terminal
- **Email intake** - Auto-process important emails into your Brain (extracts action items, links to entities)
- **Follow-up reminders** - Track emails that need a response

### Step 9: Intake Rules

If email intake was selected:

**Q: Set up auto-intake rules?**

These rules determine which emails get automatically processed into your Brain:
- **From clients** - Emails from addresses matching known client contacts
- **From partners** - Emails from addresses matching known partner contacts
- **Subject keywords** - Emails containing specific words (e.g., "action", "urgent", "invoice", "proposal")
- **Starred emails** - Emails you star in Gmail
- **Custom rules** - Define your own filters

Select the rules you want, or start with none and add them later.

### Step 10: Configure Gmail MCP

Generate the MCP configuration for Gmail, enabling API access to read, search, send, and manage emails from Claude Code.

### Step 11: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "gmail": {
      "account": "you@gmail.com",
      "tokenStored": true,
      "features": {
        "readInbox": true,
        "sendEmail": true,
        "emailIntake": true,
        "followUpReminders": false
      },
      "intakeRules": {
        "fromClients": true,
        "fromPartners": true,
        "subjectKeywords": ["action", "urgent"],
        "starred": true,
        "custom": []
      },
      "mcpEnabled": true,
      "verifiedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 12: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate gmail
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| readInbox | `true` |
| sendEmail | `false` |
| emailIntake | `true` |
| followUpReminders | `false` |
| intakeRules | `fromClients`, `starred` |
| mcpEnabled | `true` |

Quick mode still requires OAuth credentials -- there is no way around Gmail authentication. It enables inbox reading and intake with basic rules, but disables sending (a safety measure for quick setup).

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate gmail
```

## Completion

Gmail is connected to your Brain. The `email-intake` agent is deployed and your MCP is configured for direct mailbox access.

**Available commands:**
- `/email` - Read inbox, search messages, compose and send
- `/email-check` - Quick inbox summary with unread count and highlights
- `/comms email` - Access via the unified communication hub (if enabled)

**Gmail MCP** is active for full API access -- search emails, read threads, send messages, and manage labels from Claude Code.

**Note:** If you enabled email intake, the `email-intake` agent will process matching emails into your Brain on each `/email-check` run. Emails from known entities are automatically linked to their records.
