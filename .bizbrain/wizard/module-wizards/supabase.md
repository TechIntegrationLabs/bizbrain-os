# Module Wizard: Supabase Integration

> This prompt guides Claude Code through setting up the Supabase module.

## What This Module Does

Supabase integration provides:
- Database backend for Brain data
- Real-time data sync across devices
- User authentication (if building SaaS)
- File storage for assets
- Edge functions for automation
- Multi-project support with auto-detection

## Prerequisites

- A Supabase account (free tier works)
- Chrome Extension recommended (for guided setup)

## Setup Flow

### Step 1: Check Existing Setup

Check for existing Supabase configuration:
- Look in `Operations/dev-config-system/services/supabase-projects.json`
- Check for `SUPABASE_URL` and `SUPABASE_ANON_KEY` in environment

If found and valid, skip to Step 5.

### Step 2: Account Check

Ask:
"Do you have a Supabase account?

1. **Yes, with existing projects** - I'll connect to your projects
2. **Yes, but no projects yet** - I'll help create your first project
3. **No** - I'll help you create an account (it's free)"

If no account:
"Let's create one! Go to https://supabase.com and sign up. It's free for up to 2 projects. Come back when you're logged in."

### Step 3: Browser-Based Setup (if Chrome Extension available)

1. Navigate to https://supabase.com/dashboard
2. If not logged in, wait for authentication
3. List existing projects from the dashboard
4. For each project or new project:
   - Navigate to Settings > API
   - Read the Project URL (SUPABASE_URL)
   - Read the anon/public key (SUPABASE_ANON_KEY)
   - Read the service_role key (SUPABASE_SERVICE_ROLE_KEY) - warn about security
   - Read the Project Ref ID

### Step 3b: Manual Setup

Tell user:
"For each Supabase project you want to connect:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings > API
4. Copy these values:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon/public key** (safe for client-side)
   - **service_role key** (server-side only - keep secret!)
   - **Project Ref** (the xxxx part of your URL)

Paste them here, one project at a time."

### Step 4: Save Credentials

For each project, store in dev-config-system:
```json
// Operations/dev-config-system/services/supabase-projects.json
{
  "projects": [
    {
      "name": "ProjectName",
      "ref": "xxxx",
      "url": "https://xxxx.supabase.co",
      "anonKey": "<key>",
      "serviceRoleKey": "<key>",
      "repoMatch": ["project-name", "projectname"],
      "addedAt": "<timestamp>"
    }
  ]
}
```

### Step 5: Verify Connection

Test each project:
```bash
curl "<url>/rest/v1/" \
  -H "apikey: <anon-key>" \
  -H "Authorization: Bearer <anon-key>"
```

Show results:
"Connected to Supabase project '[name]'! Database is accessible."

### Step 6: Configure Auto-Detection

Ask:
"BizBrain can auto-detect which Supabase project to use based on the repo you're working in. I do this by matching repo names to project names.

For each project, what repo name patterns should match?
- Project '[name]': match repos containing [suggested patterns]

Want to customize these patterns, or are the defaults good?"

### Step 7: Configure MCP

Set up Supabase MCP:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--access-token", "<access-token>"],
      "env": {}
    }
  }
}
```

Note: The Supabase MCP server requires an access token from supabase.com/dashboard/account/tokens.

Ask:
"Would you like to enable the Supabase MCP for database management from Claude Code? This lets me:
- Query and modify your database directly
- Manage tables and schemas
- Run migrations

[Yes / No / Later]"

If yes, guide them to create an access token at https://supabase.com/dashboard/account/tokens.

### Step 8: Save Configuration

Update config.json:
```json
{
  "integrations": {
    "supabase": {
      "projects": [
        {
          "name": "ProjectName",
          "ref": "xxxx",
          "repoMatch": ["pattern1", "pattern2"]
        }
      ],
      "autoDetect": true,
      "mcpEnabled": true/false,
      "verifiedAt": "<timestamp>"
    }
  }
}
```

### Step 9: Activate Module

```bash
node .bizbrain/wizard/generators/module-activator.js activate supabase
```

### Step 10: Completion

"Supabase is connected! Here's what's ready:

- **Projects:** [list with names and refs]
- **Auto-detection:** [Active/Inactive]
- **MCP:** [Active/Inactive]

**Commands:**
| Command | Purpose |
|---------|---------|
| `/supabase` | Auto-detect and connect to project |
| `/supabase connect <name>` | Connect to specific project |
| `/supabase add table` | Create a new table |
| `/supabase status` | Check connection status |

When you're in a repo that matches a project pattern, I'll automatically connect to the right Supabase project!"
