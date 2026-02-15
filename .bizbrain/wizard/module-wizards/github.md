# Module Wizard: GitHub Integration

> This prompt guides Claude Code through setting up the GitHub module.

## What This Module Does

GitHub integration gives your Brain:
- Repository management (clone, create, list)
- Pull request workflows
- Issue tracking integration
- Code review assistance
- Automatic repo registry for all your projects
- CI/CD awareness

## Prerequisites

- Git must be installed (`git --version`)
- A GitHub account

## Setup Flow

### Step 1: Check Git

```bash
git --version
```

If not installed, guide installation:
- Windows: "Install Git from https://git-scm.com/download/win or via `winget install Git.Git`"
- macOS: "`xcode-select --install` or `brew install git`"
- Linux: "`sudo apt install git` or `sudo dnf install git`"

### Step 2: Check Existing GitHub Auth

Check if GitHub CLI is installed and authenticated:
```bash
gh auth status
```

If `gh` is installed and authenticated, skip to Step 5.

Check for existing tokens:
```bash
git config --global credential.helper
```

### Step 3: Determine Auth Method

Ask:
"How would you like to connect to GitHub?

1. **Browser login** (recommended) - I'll open GitHub in Chrome, you log in, and I'll grab the token
2. **GitHub CLI** - Install `gh` and authenticate via terminal
3. **Manual token** - You create a Personal Access Token yourself and paste it here
4. **SSH key** - Use SSH key authentication (for git operations only)"

### Step 4a: Browser-Based Setup (if Chrome Extension available)

Follow the chrome automation instructions in `.bizbrain/wizard/chrome-automations/github-setup.md`:

1. Navigate to https://github.com/settings/tokens/new
2. If not logged in, wait for user to log in
3. Guide them through token creation:
   - Token name: "BizBrain OS"
   - Expiration: 90 days (or custom)
   - Scopes needed: `repo`, `read:org`, `read:user`, `workflow`
4. Read the generated token from the page
5. Save securely

### Step 4b: GitHub CLI Setup

```bash
# Install gh
# Windows: winget install GitHub.cli
# macOS: brew install gh
# Linux: see https://github.com/cli/cli/blob/trunk/docs/install_linux.md

gh auth login
```

Follow the interactive prompts.

### Step 4c: Manual Token

Tell user:
"Go to https://github.com/settings/tokens/new and create a token with these scopes:
- `repo` (full control of private repositories)
- `read:org` (read org membership)
- `read:user` (read user profile)
- `workflow` (update GitHub Action workflows)

Set expiration to 90 days. Copy the token and paste it here."

### Step 5: Save Token

Store the token securely:
```bash
# Save to dev-config-system
mkdir -p Operations/dev-config-system/services
```

Write to `Operations/dev-config-system/services/github.json`:
```json
{
  "service": "github",
  "token": "<token>",
  "username": "<username>",
  "createdAt": "<timestamp>",
  "expiresAt": "<timestamp>",
  "scopes": ["repo", "read:org", "read:user", "workflow"]
}
```

### Step 6: Configure GitHub MCP

If using MCP for GitHub:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<token>"
      }
    }
  }
}
```

### Step 7: Verify Connection

Test the connection:
```bash
gh api user
# or
curl -H "Authorization: token <token>" https://api.github.com/user
```

List repositories:
```bash
gh repo list --limit 10
```

Show the user their repos:
"Connected to GitHub as [username]! Here are your recent repos:
[list repos]"

### Step 8: Configure Preferences

Ask:
- "Where do you keep your code repos?" (default: ~/Repos or C:\Users\<name>\Repos)
- "Should I create a repo registry to track all your projects?" [Yes / No]
- "Auto-detect new repos when you clone?" [Yes / No]
- "Default branch name?" [main / master / other]

### Step 9: Generate Repo Registry

If they opted in, scan for existing repos and create registry:
```json
{
  "repos": [
    {
      "name": "repo-name",
      "path": "C:\\Users\\...\\Repos\\repo-name",
      "github": "https://github.com/user/repo-name",
      "lastAccessed": "<timestamp>"
    }
  ]
}
```

### Step 10: Save Configuration

Update config.json:
```json
{
  "integrations": {
    "github": {
      "username": "<username>",
      "tokenStored": true,
      "reposPath": "<path>",
      "repoRegistry": true,
      "autoDetect": true,
      "defaultBranch": "main",
      "mcpEnabled": true,
      "verifiedAt": "<timestamp>"
    }
  }
}
```

### Step 11: Activate Module

```bash
node .bizbrain/wizard/generators/module-activator.js activate github
```

### Step 12: Completion

"GitHub is connected! I can now:
- List and manage your repositories
- Create and review pull requests
- Track issues across projects
- Clone and create repos from your Brain

Try: 'Show me my recent GitHub activity' or '/project list'"
