# Module Wizard: Chrome Extension (Claude in Chrome)

> This prompt guides Claude Code through setting up the Chrome Extension module.

## What This Module Does

Claude in Chrome gives BizBrain the ability to:
- Navigate web pages and extract information
- Fill out forms and interact with web UIs
- Take screenshots for documentation
- Set up other integrations by automating browser-based setup flows
- Record voice input for hands-free operation

This module is a **foundational integration** - many other modules use it for their setup wizards (GitHub, Netlify, Notion, Slack, etc.).

## Pre-flight Check

1. Check if Chrome/Chromium is installed:
   - Windows: check `"C:\Program Files\Google\Chrome\Application\chrome.exe"` or `"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"`
   - macOS: check `/Applications/Google Chrome.app`
   - Linux: `which google-chrome` or `which chromium-browser`

2. Check if Claude in Chrome MCP is already configured:
   - Look in `~/.claude/settings.json` for `claude-in-chrome` in mcpServers

## Setup Flow

### Step 1: Check Chrome Installation

If Chrome is not found:
"I couldn't find Chrome installed. Chrome is needed for browser automation features like:
- Setting up integrations (GitHub, Notion, Slack tokens)
- Extracting business info from your website
- Voice input for hands-free operation

Would you like to:
1. Install Chrome now (I'll open the download page)
2. Skip this module for now (you can set it up later)"

If they want to install, guide them to https://www.google.com/chrome/

### Step 2: Install the Extension

Say:
"The Claude in Chrome extension connects your browser to Claude Code. Here's how to set it up:

1. Open Chrome
2. Navigate to: chrome://extensions/
3. Enable 'Developer mode' (toggle in top right)
4. The extension should be available through the Claude Code installation

Let me check if the extension is already connected..."

Use the MCP connection to test:
- Try calling `mcp__claude-in-chrome__tabs_context_mcp` to see if Chrome responds
- If it works: "Chrome extension is connected and working!"
- If not: Guide through troubleshooting

### Step 3: Verify Connection

Run a simple test:
1. Navigate to a test page (e.g., https://example.com)
2. Read the page title
3. Confirm the round-trip works

Tell the user:
"Chrome extension is working! I just navigated to a test page and confirmed the connection. Here's what I can now do:
- Browse the web to extract business information
- Help set up other integrations by navigating to their setup pages
- Record voice input through the browser
- Take screenshots for documentation"

### Step 4: Configure Preferences

Ask:
- "Should I automatically open Chrome when needed for setup tasks?" [Yes / Ask first]
- "Allow screenshots for documentation?" [Yes / No]

### Step 5: Save Configuration

Update config.json with:
```json
{
  "integrations": {
    "chrome": {
      "installed": true,
      "autoOpen": true/false,
      "screenshots": true/false,
      "verifiedAt": "<timestamp>"
    }
  }
}
```

### Step 6: Activate Module

```bash
node .bizbrain/wizard/generators/module-activator.js activate chrome-extension
```

### Step 7: Completion

"Chrome Extension is configured! This unlocks browser-based setup for other modules. When you set up GitHub, Notion, or other integrations, I can guide you through the process right in your browser."
