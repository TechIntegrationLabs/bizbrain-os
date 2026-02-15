# Module Wizard: Netlify Integration

> This prompt guides Claude Code through setting up the Netlify module.

## What This Module Does

Netlify integration enables:
- Deploy site management (list, create, update)
- Build status monitoring
- Environment variable management
- Deploy previews for pull requests
- DNS and domain management
- Serverless function deployment

## Prerequisites

- A Netlify account (free tier works)

## Setup Flow

### Step 1: Check Existing Setup

Look for existing Netlify configuration:
```bash
# Check for netlify CLI
npx netlify --version 2>/dev/null

# Check for existing token in environment
echo $NETLIFY_AUTH_TOKEN
```

Check dev-config-system for stored token:
- Look in `Operations/dev-config-system/services/netlify.json`

If token exists and is valid, skip to Step 5.

### Step 2: Determine Auth Method

Ask:
"How would you like to connect to Netlify?

1. **Browser login** (recommended) - I'll open Netlify in Chrome and walk you through getting a token
2. **Netlify CLI** - Authenticate via the terminal
3. **Manual token** - You create a Personal Access Token and paste it here"

### Step 3a: Browser-Based Setup (if Chrome Extension available)

Follow `.bizbrain/wizard/chrome-automations/netlify-setup.md`:

1. Navigate to https://app.netlify.com/user/applications#personal-access-tokens
2. If not logged in, wait for user to authenticate
3. Guide them:
   - Click "New access token"
   - Description: "BizBrain OS"
   - Click "Generate token"
4. Read the token from the page
5. Warn: "Copy this token now - Netlify won't show it again!"

### Step 3b: CLI Setup

```bash
npx netlify login
```

Then extract the token:
```bash
npx netlify api getCurrentUser
```

### Step 3c: Manual Token

Tell user:
"Go to https://app.netlify.com/user/applications#personal-access-tokens
1. Click 'New access token'
2. Description: 'BizBrain OS'
3. Click 'Generate token'
4. Copy and paste the token here

Important: Save this token - Netlify only shows it once!"

### Step 4: Save Token

Store securely:
```json
// Operations/dev-config-system/services/netlify.json
{
  "service": "netlify",
  "token": "<token>",
  "createdAt": "<timestamp>"
}
```

### Step 5: Verify Connection

Test the token:
```bash
curl -H "Authorization: Bearer <token>" https://api.netlify.com/api/v1/accounts
```

List their sites:
```bash
curl -H "Authorization: Bearer <token>" https://api.netlify.com/api/v1/sites?per_page=10
```

Show results:
"Connected to Netlify! Here are your sites:
[list sites with URLs]"

### Step 6: Configure MCP

Set up Netlify MCP if desired:
```json
{
  "mcpServers": {
    "netlify": {
      "command": "npx",
      "args": ["-y", "netlify-mcp"],
      "env": {
        "NETLIFY_AUTH_TOKEN": "<token>"
      }
    }
  }
}
```

### Step 7: Configure Preferences

Ask:
- "Should I monitor build status for your sites?" [Yes / No]
- "Auto-deploy on push to main?" [Yes / No / Per-project]
- "Default build command?" (e.g., `npm run build`, `next build`)

### Step 8: Save Configuration

Update config.json:
```json
{
  "integrations": {
    "netlify": {
      "tokenStored": true,
      "monitorBuilds": true,
      "autoDeploy": "per-project",
      "mcpEnabled": true,
      "verifiedAt": "<timestamp>"
    }
  }
}
```

### Step 9: Activate Module

```bash
node .bizbrain/wizard/generators/module-activator.js activate netlify
```

### Step 10: Completion

"Netlify is connected! I can now:
- List and manage your deployed sites
- Monitor build status
- Manage environment variables
- Trigger deploys

Try: 'Show me my Netlify sites' or 'Deploy [project] to Netlify'"

### Manual Fallback

If Chrome automation fails or user prefers manual:

1. Go to https://app.netlify.com/user/applications#personal-access-tokens
2. Click "New access token"
3. Enter description: "BizBrain OS"
4. Click "Generate token"
5. Copy the token immediately (it won't be shown again)
6. Come back here and paste it

Then continue from Step 4.
