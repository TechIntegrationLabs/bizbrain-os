# Module Setup: Netlify

> Deploy sites, monitor builds, and manage hosting directly from your Brain.

## What This Module Does

Netlify integration brings deployment management into your Brain:
- Deploy sites to Netlify from Claude Code with a single command
- Monitor build status and get notified of failures
- Manage site settings, environment variables, and domains
- Netlify MCP for full API access to your hosting infrastructure

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | *(none)* |
| **Agents** | *(none)* |
| **Commands** | `deploy`, `sites` |
| **Hooks** | *(none)* |
| **MCPs** | `netlify.json` |
| **Knowledge** | *(none)* |

## Prerequisites

| Module | Why |
|--------|-----|
| `chrome-extension` | Browser-guided token creation (optional but recommended) |

## Setup Flow

### Step 1: Check Existing Token

Look for an existing Netlify token in:
- `Operations/dev-config-system/services/netlify.json`
- Environment variable `NETLIFY_AUTH_TOKEN`

If found, offer to reuse it.

### Step 2: Choose Authentication Method

**Q: How would you like to authenticate with Netlify?**
- `Browser guided` - Open Netlify dashboard in Chrome, walk through token creation
- `Netlify CLI` - Run `npx netlify login` to authenticate
- `Manual token` - You'll create a Personal Access Token yourself

### Step 3: Create / Provide Token

**For browser guided:**
Navigate to `https://app.netlify.com/user/applications#personal-access-tokens` and guide through:
- Description: `BizBrain OS`
- Click "New access token"
- Copy the token

**For CLI:** Run `npx netlify login` and follow the browser auth flow.

**For manual:** Direct user to Netlify dashboard > User settings > Applications > Personal access tokens.

### Step 4: Store Token

Save token securely to `Operations/dev-config-system/services/netlify.json`:
```json
{
  "service": "netlify",
  "authToken": "nfp_...",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Step 5: Verify Connection

Call the Netlify API with the token to confirm access:
- `GET https://api.netlify.com/api/v1/sites` with `Authorization: Bearer <token>`
- List existing sites to confirm everything works

### Step 6: Configure Netlify MCP

Generate the MCP configuration to enable rich Netlify API access from Claude Code.

### Step 7: Configure Preferences

**Q: Monitor build status for your sites?**
- `Yes` - Track build status, alert on failures
- `No` - Manual checks only

**Q: Auto-deploy on git push?**
- `Yes` - Enable auto-deploy for all linked sites
- `No` - Manual deploys only
- `Per-project` - Configure auto-deploy individually per site

**Q: Default build command?** (optional, e.g., `npm run build`)

### Step 8: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "netlify": {
      "tokenStored": true,
      "monitorBuilds": true,
      "autoDeploy": "per-project",
      "defaultBuildCommand": null,
      "mcpEnabled": true,
      "verifiedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 9: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate netlify
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| monitorBuilds | `true` |
| autoDeploy | `per-project` |
| mcpEnabled | `true` |

Quick mode still requires a Netlify token -- there is no way to skip authentication.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate netlify
```

## Completion

Netlify is connected. Your Brain can now deploy sites and monitor builds directly from Claude Code.

**Available commands:**
- `/deploy` - Deploy the current project to Netlify
- `/sites` - List all Netlify sites with status

**Netlify MCP** is active for full API access -- manage sites, check deploy logs, configure build settings, and more.
