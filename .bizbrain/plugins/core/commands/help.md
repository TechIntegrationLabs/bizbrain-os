# Help Command

List all available BizBrain commands and their usage.

## Instructions

1. **Read capabilities**
   - Load `{{BRAIN_PATH}}/.bizbrain/capabilities.json`
   - Get list of active modules from `config.json`

2. **Group commands by category**
   - Core commands (always available)
   - Module-specific commands (based on active modules)

3. **Display formatted help**

```
BizBrain OS - Available Commands
════════════════════════════════════════════════

CORE COMMANDS
  /setup              Initialize or reconfigure Brain
  /setup-module <name> Activate a specific module
  /status             Show Brain status and health
  /help               Show this help message
  /knowledge <topic>  Load knowledge documentation
  /find <query>       Search across all Brain content
  /dashboard          Open configuration dashboard

DEVELOPMENT (GSD System)
  /gsd                Show GSD status and next action
  /gsd-plan           Plan current phase into waves
  /gsd-execute        Execute current phase plan
  /gsd-status         Show progress across all phases
  /gsd-roadmap        Create phase roadmap
  /gsd-requirements   Define done criteria
  /spec <feature>     Write feature specification
  /implement <spec>   Execute implementation from spec
  /crush <bug>        Quick bug fix
  /diagnose <issue>   Systematic investigation

ENTITY MANAGEMENT
  /add-client         Add new client/customer
  /add-partner        Add new strategic partner
  /add-vendor         Add new vendor
  /list-entities      List all entities with status

INTEGRATIONS
  /notion             Notion sync operations
  /slack-intake       Pull and process Slack messages
  /slack-summary      Summarize recent Slack activity
  /supabase           Supabase database operations
  /deploy [site]      Deploy to Netlify
  /repos              List and manage repositories

CONTENT
  /content            Content factory entry point
  /slideshow          Create slideshow presentation
  /video              Create video with Remotion
  /digest             Generate activity digest
  /hours              Quick timesheet summary
  /timesheet          Detailed timesheet report

For detailed documentation on any topic:
  /knowledge <topic>  (e.g., /knowledge systems/gsd-system)

For search:
  /find <query>       (e.g., /find "client onboarding")
```

4. **Show module-specific help**
   - If user has inactive modules, list them with activation instructions
   - Show recently added commands (if tracked in state.json)

5. **Context-aware suggestions**
   - If in a project folder, highlight project-relevant commands
   - If entities mentioned recently, highlight entity commands
