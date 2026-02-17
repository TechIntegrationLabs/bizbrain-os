# Module Setup: Chrome Extension (Claude in Chrome)

> Browser integration that unlocks web-based setup for other modules.

## What This Module Does

Chrome Extension connects your Brain to a real browser via Claude in Chrome MCP:
- Navigate websites, fill forms, and extract content directly from Claude Code
- Enables browser-guided setup flows for GitHub, Notion, Slack, and more
- Take screenshots for documentation and troubleshooting
- Automate repetitive browser tasks from your terminal

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | *(none)* |
| **Agents** | *(none)* |
| **Commands** | *(none)* |
| **Hooks** | *(none)* |
| **MCPs** | `claude-in-chrome` (verified in settings.json) |

This is a meta-capability module. It doesn't generate files -- it verifies and configures the Chrome Extension connection that other modules depend on.

## Prerequisites

None. This is a foundational setup module.

## Setup Flow

### Step 1: Check Chrome Installation

Verify Chrome is installed by checking common paths:
- **Windows:** `C:\Program Files\Google\Chrome\Application\chrome.exe`
- **macOS:** `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
- **Linux:** `/usr/bin/google-chrome` or `/usr/bin/chromium-browser`

If not found, guide to: https://www.google.com/chrome/

### Step 2: Verify Claude in Chrome MCP

Check `~/.claude/settings.json` for the `claude-in-chrome` MCP entry. If missing, guide the user through installation of the Claude in Chrome extension.

### Step 3: Test Connection

Call `mcp__claude-in-chrome__tabs_context_mcp` to verify the extension is connected and responding.

### Step 4: Verify Full Capability

Navigate to `https://example.com` and read the page title to confirm navigation and page reading work end-to-end.

### Step 5: Configure Preferences

**Q: Auto-open Chrome when a module needs it?**
- `Yes` - Open Chrome automatically when browser actions are needed
- `Ask first` - Prompt before opening Chrome

**Q: Allow screenshots for documentation?**
- `Yes` - Enable screenshot capture for docs and troubleshooting
- `No` - No screenshots

### Step 6: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "chrome": {
      "installed": true,
      "autoOpen": true,
      "screenshots": true,
      "verifiedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 7: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate chrome-extension
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| autoOpen | `true` |
| screenshots | `true` |

Quick mode still verifies Chrome and the extension are working -- it just skips the preference questions.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate chrome-extension
```

## Completion

Chrome Extension is connected and verified. Your Brain can now interact with web pages directly from Claude Code.

This unlocks browser-guided setup for other modules:
- **GitHub** - authenticate via browser, manage repos
- **Notion** - connect workspace, sync pages
- **Slack** - create apps, configure bots
- **Netlify** - manage deployments
- **Voice Input** - browser-based voice recorder

Many modules offer a "Browser guided" auth option that depends on this module.
