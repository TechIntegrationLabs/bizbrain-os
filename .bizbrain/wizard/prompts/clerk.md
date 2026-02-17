# Module Setup: Clerk Auth

> User authentication and management from your Brain -- create users, manage organizations, and configure auth flows without leaving Claude Code.

## What This Module Does

Clerk Integration brings authentication management into your Brain:
- View and manage users, organizations, and invitations
- Clerk MCP for direct API access to your auth system from Claude Code
- Quick lookups -- find users by email, check sign-in activity
- Manage user metadata, bans, and session revocation
- Works with any Clerk application (Next.js, React, Remix, etc.)

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | *(none)* |
| **Agents** | *(none)* |
| **Commands** | `clerk-users` |
| **Hooks** | *(none)* |
| **MCPs** | `clerk.json` |
| **Knowledge** | *(none)* |

## Prerequisites

| Module | Why |
|--------|-----|
| `chrome-extension` | Browser-guided key retrieval (optional but recommended) |

You need a Clerk account and at least one Clerk application. The free tier supports up to 10,000 monthly active users.

## Setup Flow

### Step 1: Check Existing Config

Look for existing Clerk keys in `Operations/dev-config-system/services/clerk.json`, environment variables (`CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`), or `.env.local` files in known project directories. If found, offer to reuse.

### Step 2: Confirm Clerk Account

**Q: Do you have a Clerk account?**
- `Yes` - Proceed to authentication
- `No` - Guide to https://dashboard.clerk.com/sign-up (free, generous free tier)

### Step 3: Choose Authentication Method

**Q: How would you like to retrieve your Clerk keys?**
- `Browser guided` - Open the Clerk dashboard in Chrome and read the keys
- `Manual` - You'll copy the keys from the Clerk dashboard yourself

### Step 4: Select Application

**For browser guided:**
Navigate to `https://dashboard.clerk.com` and guide through:
1. Select the application you want to connect (or create a new one)
2. Go to "API Keys" in the left sidebar
3. Copy the **Publishable Key** (starts with `pk_test_` or `pk_live_`)
4. Copy the **Secret Key** (starts with `sk_test_` or `sk_live_`)

**For manual:** Direct the user to `https://dashboard.clerk.com` > select their app > "API Keys" and copy both keys.

### Step 5: Note the Application

Record which Clerk application is being connected. This helps when managing multiple apps.

**Q: What's the name of this Clerk application?**
(Auto-detected from the dashboard if using browser-guided flow)

### Step 6: Store Keys

Save to `Operations/dev-config-system/services/clerk.json`:
```json
{
  "service": "clerk",
  "publishableKey": "pk_test_...",
  "secretKey": "sk_test_...",
  "appName": "my-app",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Step 7: Verify Connection

Run a GET request to `https://api.clerk.com/v1/users?limit=1` with the secret key as a Bearer token. Confirm the response succeeds and display the total user count for the application.

### Step 8: Configure Clerk MCP

Generate the MCP configuration for Clerk, enabling API access to manage users, organizations, invitations, and sessions from Claude Code.

### Step 9: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "clerk": {
      "tokenStored": true,
      "appName": "my-app",
      "mcpEnabled": true,
      "verifiedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 10: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate clerk
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| mcpEnabled | `true` |

Quick mode still requires API keys -- Clerk has no unauthenticated access. It skips the application name question (auto-detected or left blank) and enables MCP immediately.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate clerk
```

## Completion

Clerk is connected to your Brain. You can now manage users and authentication directly from Claude Code.

**Available commands:**
- `/clerk-users` - List, search, and manage users in your Clerk application

**Clerk MCP** is active for full API access -- create users, manage organizations, send invitations, and query session data from Claude Code.

**Tip:** If you have multiple Clerk applications, you can run the setup again with a different app's keys. The config supports switching between applications.
