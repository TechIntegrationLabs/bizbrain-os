# Module Setup: Supabase

> Connect your Brain to Supabase for database management, auth, storage, and real-time features -- all from Claude Code.

## What This Module Does

Supabase integration gives your Brain direct database capabilities:
- Connect one or more Supabase projects with stored credentials
- Auto-detect which project to use based on the repo you're working in
- Dedicated agent for database operations (create tables, query data, manage RLS)
- Optional Supabase MCP for direct SQL access from Claude Code
- Credentials stored securely in your Brain's dev-config-system

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | `Operations/dev-config-system/services/` (if not existing) |
| **MCP Configs** | `supabase.json` (if MCP enabled) |
| **Agents** | `supabase-agent` |
| **Commands** | `supabase`, `supabase-connect`, `supabase-add-table` |
| **Knowledge** | `supabase-workflow.md` |

Project credentials are stored in:
```
Operations/dev-config-system/services/
  supabase-projects.json    # All project configs
```

## Prerequisites

- **Chrome Extension** module -- used for browser-guided credential retrieval from the Supabase dashboard. Manual entry is available as a fallback if Chrome is not configured.

## Setup Flow

### Step 1: Check Existing Config

Look for existing Supabase configuration in:
- `Operations/dev-config-system/services/supabase-projects.json`
- Environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)
- `.env` or `.env.local` files in common project directories

If found, show what's already configured and ask if they want to add more projects or reconfigure.

### Step 2: Account Status

**Q: Do you have a Supabase account?**
- `Yes, with existing projects` - Proceed to credential collection
- `Yes, but no projects yet` - Guide through creating first project at supabase.com
- `No account` - Guide to supabase.com/dashboard (free tier, no credit card needed)

### Step 3: Collect Credentials (Browser-Guided)

If Chrome Extension is available, offer the guided flow:

1. Navigate to `https://supabase.com/dashboard`
2. Confirm they're logged in
3. For each project:
   - Navigate to project Settings > API
   - Read the Project URL, `anon` key, and `service_role` key
   - Navigate to project Settings > General for the project reference ID
   - Confirm each value with the user before saving

**Q: Which project should we set up first?**
Show the list of projects visible in their dashboard and let them pick.

### Step 4: Collect Credentials (Manual Fallback)

If Chrome is not available or user prefers manual entry:

**Q: For each project, provide the following:**
1. Project name (friendly name, e.g., "BuildTrack")
2. Project URL (e.g., `https://abcdefg.supabase.co`)
3. Anon key (public, safe for client-side)
4. Service role key (secret, server-side only)
5. Project reference ID (the `abcdefg` part of the URL)

Repeat for each project they want to connect.

### Step 5: Verify Connections

For each configured project, run a quick health check:
- Test the URL is reachable
- Verify the anon key works (simple REST query)
- Confirm the project ref matches

Report results: "Connected to 3 projects: BuildTrack, ContentEngine, GEOViz. All verified."

### Step 6: Auto-Detection Patterns

**Q: What repo name patterns should map to each project?**

For each project, ask what repo folder names should trigger auto-connection:
```
BuildTrack    -> buildtrack, BuildTrack, bt-*
ContentEngine -> content-engine, metacontent, perdia
GEOViz        -> geoviz, geo-viz, geoviz-app
```

This lets the `/supabase` command auto-detect the right project when you're working in a repo.

### Step 7: Supabase MCP

**Q: Enable Supabase MCP for direct database management from Claude Code?**
- `Yes` - Full SQL access, table management, RLS policy editing. Requires a personal access token.
- `No` - Use the agent for database operations (works via REST API)
- `Later` - Skip for now, enable anytime with `/supabase mcp enable`

If yes:
1. Guide to `https://supabase.com/dashboard/account/tokens` to create a personal access token
2. Save the token securely
3. Generate the MCP configuration file

### Step 8: Save Configuration

Save project data to `Operations/dev-config-system/services/supabase-projects.json`:
```json
{
  "projects": [
    {
      "name": "BuildTrack",
      "ref": "ooptrrxdmhctxnqsiqjs",
      "url": "https://ooptrrxdmhctxnqsiqjs.supabase.co",
      "anonKey": "eyJ...",
      "serviceRoleKey": "eyJ...",
      "repoMatch": ["buildtrack", "BuildTrack"]
    }
  ]
}
```

Save module config to `config.json`:
```json
{
  "integrations": {
    "supabase": {
      "projects": [
        { "name": "BuildTrack", "ref": "ooptrrxdmhctxnqsiqjs", "repoMatch": ["buildtrack"] }
      ],
      "autoDetect": true,
      "mcpEnabled": true,
      "verifiedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 9: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate supabase
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| autoDetect | `true` |
| mcpEnabled | `true` (if token provided) |

Quick mode still requires project credentials -- there's no way around that. But it skips explanations, auto-enables MCP if a token is available, and uses repo name as the default auto-detection pattern.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate supabase
```

## Completion

Supabase is connected. Your Brain can now manage databases, run queries, and auto-detect projects by repo name.

**Available commands:**
- `/supabase` - Auto-detect project and show status
- `/supabase connect [name]` - Connect to a specific project
- `/supabase add table` - Create a new table in the connected project
