# Module Setup: GitHub Integration

> Full GitHub access -- manage repos, PRs, issues, and code directly from your Brain.

## What This Module Does

GitHub Integration connects your development workflow to your Brain:
- Clone, create, and manage repositories from Claude Code
- Track repos in a central registry with auto-detection
- GitHub MCP for rich API access (issues, PRs, actions, releases)
- Git hooks for automatic repo tracking in your Brain
- Knowledge file documenting your GitHub workflow

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | `Repos/` (configurable path) |
| **Agents** | *(none)* |
| **Commands** | `repos`, `clone`, `new-repo` |
| **Hooks** | `git-auto-track` (detects new repos) |
| **MCPs** | `github.json` |
| **Knowledge** | `github-workflow.md` |

## Prerequisites

| Module | Why |
|--------|-----|
| `chrome-extension` | Browser-guided token creation (optional but recommended) |

You also need `git` installed and accessible from the terminal.

## Setup Flow

### Step 1: Verify Git

Run `git --version` to confirm git is installed. If missing, guide to https://git-scm.com/downloads.

### Step 2: Check Existing Auth

Run `gh auth status` to check if the GitHub CLI is already authenticated. If so, offer to reuse that auth.

### Step 3: Choose Authentication Method

**Q: How would you like to authenticate with GitHub?**
- `Browser login` - Open github.com/settings/tokens/new in Chrome, walk through token creation
- `GitHub CLI` - Run `gh auth login` interactively
- `Manual token` - You'll create a Personal Access Token yourself
- `SSH key` - Use existing SSH key for git operations (still need token for API)

### Step 4: Create / Provide Token

**For browser login:**
Navigate to `https://github.com/settings/tokens/new` and guide through:
- Token name: `BizBrain OS`
- Expiration: 90 days or no expiration
- Scopes: `repo`, `read:org`, `read:user`, `workflow`

**For CLI:** Run `gh auth login` and follow prompts.

**For manual:** Direct user to create token at github.com/settings/tokens/new with required scopes: `repo`, `read:org`, `read:user`, `workflow`.

### Step 5: Store Token

Save token securely to `Operations/dev-config-system/services/github.json`:
```json
{
  "service": "github",
  "username": "your-username",
  "token": "ghp_...",
  "scopes": ["repo", "read:org", "read:user", "workflow"],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Step 6: Configure GitHub MCP

Generate the MCP configuration at the standard MCP config location, enabling rich GitHub API access from Claude Code.

### Step 7: Verify Connection

Run `gh api user` or equivalent curl with the token. Confirm the username matches and API calls succeed.

### Step 8: Configure Repository Settings

**Q: Where should repos live?** (default: `~/Repos`)

**Q: Create a repo registry to track all repos?**
- `Yes` - Maintain a JSON registry of all repos with metadata
- `No` - Skip registry

**Q: Auto-detect new repos in the repos folder?**
- `Yes` - Periodically scan for new git repos and add them to registry
- `No` - Only track repos you explicitly add

**Q: Default branch name?**
- `main` (modern default)
- `master` (legacy)

### Step 9: Scan Existing Repos

If repo registry is enabled, scan the repos folder for existing git repositories and build the initial registry.

### Step 10: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "github": {
      "username": "your-username",
      "tokenStored": true,
      "reposPath": "~/Repos",
      "repoRegistry": true,
      "autoDetect": true,
      "defaultBranch": "main",
      "mcpEnabled": true,
      "verifiedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 11: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate github
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| reposPath | `~/Repos` |
| repoRegistry | `true` |
| autoDetect | `true` |
| defaultBranch | `main` |
| mcpEnabled | `true` |

Quick mode still requires authentication -- a token must be provided or created.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate github
```

## Completion

GitHub is connected. Your Brain can now manage repos, pull requests, and issues directly from Claude Code.

**Available commands:**
- `/repos` - List tracked repositories
- `/clone <repo>` - Clone a repo into your repos folder
- `/new-repo <name>` - Create a new GitHub repository

**GitHub MCP** is active for rich API access -- query issues, review PRs, check Actions status, and more.
