# Module Setup: Vercel

> Deploy and manage your web projects on Vercel directly from your Brain -- push builds, check deployment status, and manage domains without leaving Claude Code.

## What This Module Does

Vercel Integration brings deployment management into your Brain:
- Deploy projects to Vercel from your terminal with a single command
- Check deployment status, build logs, and domain configuration
- Vercel MCP for full API access (projects, deployments, domains, env vars)
- Auto-detect framework and project settings for zero-config deploys
- Manage environment variables securely through your Brain

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | *(none)* |
| **Agents** | *(none)* |
| **Commands** | `deploy-vercel` |
| **Hooks** | *(none)* |
| **MCPs** | `vercel.json` |
| **Knowledge** | *(none)* |

## Prerequisites

| Module | Why |
|--------|-----|
| `chrome-extension` | Browser-guided token creation (optional but recommended) |

You need a Vercel account (free Hobby tier works for personal projects). Node.js should be installed for local builds.

## Setup Flow

### Step 1: Check Existing Auth

Look for an existing Vercel token in environment variables (`VERCEL_TOKEN`) or `Operations/dev-config-system/services/vercel.json`. Also check if the Vercel CLI is installed (`vercel --version`) and authenticated. If found, offer to reuse.

### Step 2: Choose Authentication Method

**Q: How would you like to authenticate with Vercel?**
- `Browser guided` - Open Vercel dashboard in Chrome and walk through token creation
- `Manual token` - You'll create the token yourself and paste it

### Step 3: Create Token

**For browser guided:**
Navigate to `https://vercel.com/account/tokens` and guide through:
1. Click "Create"
2. Token name: `BizBrain OS`
3. Scope: Full Account
4. Expiration: choose based on preference (no expiration recommended for automation)
5. Click "Create Token"
6. Copy the token immediately (it won't be shown again)

**For manual:** Direct the user to `https://vercel.com/account/tokens` to create a token with Full Account scope named "BizBrain OS".

### Step 4: Store Token

Save the token to `Operations/dev-config-system/services/vercel.json`:
```json
{
  "service": "vercel",
  "token": "...",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Step 5: Verify Connection

Run a GET request to `https://api.vercel.com/v9/projects` with the token as a Bearer token. Confirm the response succeeds and list any existing projects.

### Step 6: List Projects and Teams

Display the user's existing Vercel projects and teams so they can confirm they're connected to the right account.

### Step 7: Default Team

**Q: Which team should be used for deployments by default?**
- `Personal account` - Deploy to your personal Vercel account
- *(list detected teams)* - Deploy to a specific team

### Step 8: Default Framework

**Q: What's your primary framework?**
- `Next.js` *(most common)*
- `SvelteKit`
- `Astro`
- `Nuxt`
- `Static` (HTML/CSS/JS)
- `Auto-detect` - Let Vercel figure it out per project

### Step 9: Configure Vercel MCP

Generate the MCP configuration for Vercel, enabling API access to manage projects, deployments, domains, and environment variables from Claude Code.

### Step 10: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "vercel": {
      "tokenStored": true,
      "defaultTeam": "personal",
      "defaultFramework": "nextjs",
      "mcpEnabled": true,
      "verifiedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 11: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate vercel
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| defaultTeam | `"personal"` |
| defaultFramework | `"auto-detect"` |
| mcpEnabled | `true` |

Quick mode still requires a token -- Vercel has no passwordless API access. It skips team and framework selection, using personal account and auto-detection.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate vercel
```

## Completion

Vercel is connected to your Brain. You can now deploy and manage projects without leaving Claude Code.

**Available commands:**
- `/deploy-vercel` - Deploy the current project to Vercel

**Vercel MCP** is active for full API access -- list projects, check deployment status, manage domains, and configure environment variables from Claude Code.
