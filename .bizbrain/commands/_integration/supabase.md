# Supabase Command

Supabase database operations for projects.

## Usage

`/supabase [action]`

Actions: `connect`, `schema`, `query`, `migrate`, `status`, `setup`

## Instructions

1. **Auto-detect project**

   Look for project indicators:
   - `.env` or `.env.local` with `SUPABASE_URL`
   - `supabase/` folder
   - Package.json with `@supabase/supabase-js`

   If found, load project config from:
   `{{BRAIN_PATH}}/.bizbrain/integrations/supabase/projects.json`

2. **Parse action**

   Default (no action): Show status and menu

3. **Action: Status**

   ```
   Supabase Status - {{PROJECT_NAME}}
   ════════════════════════════════════════════════

   Project: ProjectAlpha
   Ref: your-project-ref
   URL: https://your-project-ref.supabase.co

   Connection: ✓ Connected
   Status: Active

   Database:
   - Tables: 20
   - Functions: 8
   - Row-level security: Enabled
   - Realtime: Enabled (5 tables)

   Storage:
   - Buckets: 2
   - Files: 145

   Edge Functions:
   - Deployed: 3
   - Last deployment: 2 days ago

   Recent Activity:
   - 2024-01-15 14:30: Migration applied (add_analytics)
   - 2024-01-14 09:15: New table created (user_sessions)
   - 2024-01-13 16:45: RLS policy updated
   ```

4. **Action: Connect**

   ```
   Connecting to Supabase project...

   1. Select project:
      [ ] ProjectAlpha (your-project-ref)
      [ ] AppBeta (your-project-ref-2)
      [ ] New project

   2. Enter credentials:
      Project URL: https://[ref].supabase.co
      Anon key: [paste key]
      Service key: [paste key]

   3. Test connection:
      ✓ Connected successfully
      ✓ Database accessible
      ✓ Storage accessible

   4. Save configuration?
      Location: {{BRAIN_PATH}}/.bizbrain/integrations/supabase/
      [Y/n]

   ✓ Connected to ProjectAlpha project
   ```

5. **Action: Schema**

   View or modify database schema:
   ```
   Database Schema - ProjectAlpha
   ════════════════════════════════════════════════

   Tables (20):
   ────────────────────────────────────────────────
   1. users
      Columns: id, email, name, created_at
      RLS: Enabled (2 policies)
      Realtime: Enabled

   2. projects
      Columns: id, name, owner_id, status, created_at
      RLS: Enabled (3 policies)
      Relationships: owner_id → users.id

   3. tasks
      Columns: id, project_id, title, status, assigned_to
      RLS: Enabled (4 policies)
      Relationships: project_id → projects.id, assigned_to → users.id

   [... more tables ...]

   Actions:
   1. Export schema (SQL)
   2. Generate types (TypeScript)
   3. Create new table
   4. Modify table
   5. View RLS policies
   ```

6. **Action: Query**

   Interactive SQL query:
   ```
   Supabase Query Console
   ════════════════════════════════════════════════

   Project: ProjectAlpha

   Enter SQL query (or select a template):
   Templates:
   1. Count users
   2. Recent projects
   3. Active tasks
   4. User activity

   > SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days'

   Executing...

   Result:
   ┌───────┐
   │ count │
   ├───────┤
   │    12 │
   └───────┘

   1 row returned in 45ms

   Export results? [csv/json/table]
   ```

7. **Action: Migrate**

   Create or apply migrations:
   ```
   Supabase Migrations
   ════════════════════════════════════════════════

   Options:
   1. Apply pending migrations
   2. Create new migration
   3. View migration history
   4. Rollback migration

   [Choose option: 2]

   Creating new migration...

   Migration name: add_analytics_table

   Generated: supabase/migrations/20240115_add_analytics_table.sql

   Edit migration? [Y/n]

   [SQL editor opens with template]

   Ready to apply? [Y/n]

   Applying migration...
   ✓ Migration applied successfully

   Migration log:
   - Created table: analytics_events
   - Added RLS policies
   - Created indexes
   ```

8. **Action: Setup**

   Full project setup:
   ```
   Supabase Setup for {{PROJECT_NAME}}
   ════════════════════════════════════════════════

   1. Initialize Supabase in project
      → Creating supabase/ folder
      → Initializing config

   2. Link to existing project or create new?
      [ ] Link to existing (select from list)
      [✓] Create new project

   3. Create Supabase project
      Project name: {{PROJECT_NAME}}
      Region: [select]
      Database password: [generate secure]

      → Creating project...
      ✓ Project created!
      Ref: new-project-ref

   4. Generate client code
      → Installing @supabase/supabase-js
      → Creating lib/supabase.ts
      → Adding types

   5. Setup authentication
      Providers:
      [✓] Email
      [✓] OAuth (Google, GitHub)
      [ ] Phone

   6. Create initial schema
      → Running migrations
      → Setting up RLS
      → Creating storage buckets

   ✓ Supabase setup complete!

   Project: {{PROJECT_NAME}}
   URL: https://new-project-ref.supabase.co
   Dashboard: https://app.supabase.com/project/new-project-ref

   Next steps:
   - Add SUPABASE_URL to .env.local
   - Add SUPABASE_ANON_KEY to .env.local
   - Test connection: /supabase status
   ```

9. **Project detection**

   Auto-detect from repo patterns:
   ```json
   {
     "projectalpha": "your-project-ref",
     "appbeta": "your-project-ref-2",
     "content-app": "your-project-ref-3"
   }
   ```

10. **MCP integration**

    If Supabase MCP available:
    - Use MCP for all queries
    - Leverage MCP's type generation
    - Use MCP's migration tools

## Quick Actions

From any action, offer:
- View in dashboard (opens Supabase web UI)
- Generate types
- Export data
- Backup database

## Related Commands

- `/saas` - Full SaaS setup (includes Supabase)
- `/status` - Check Supabase in overall status
