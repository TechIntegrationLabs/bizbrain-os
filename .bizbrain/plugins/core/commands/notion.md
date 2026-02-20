# Notion Command

Notion integration operations - sync, push, pull, status.

## Usage

`/notion [action]`

Actions: `sync`, `push`, `pull`, `status`, `setup`

## Instructions

1. **Parse action**
   - Default (no action): Show status and menu
   - `sync`: Bidirectional sync
   - `push`: Push Brain data to Notion
   - `pull`: Pull Notion data to Brain
   - `status`: Show sync status
   - `setup`: Configure Notion integration

2. **Load Notion config**
   - Read `{{BRAIN_PATH}}/.bizbrain/integrations/notion/config.json`
   - Check for Notion API token in vault
   - Verify workspace connection

3. **Action: Status**

   Display sync status:
   ```
   Notion Integration Status
   ════════════════════════════════════════════════

   Connection: ✓ Connected
   Workspace: {{BUSINESS_NAME}} Workspace
   Last sync: 2 hours ago (2024-01-15 14:30)

   Sync Mappings:
   ────────────────────────────────────────────────
   Clients → Notion Database: "Clients"
     Direction: Bidirectional
     Last sync: 2 hours ago
     Items: 7 clients synced

   Projects → Notion Database: "Projects"
     Direction: Brain → Notion (one-way)
     Last sync: 2 hours ago
     Items: 4 projects synced

   Todos → Notion Database: "Action Items"
     Direction: Bidirectional
     Last sync: 2 hours ago
     Items: 12 todos synced

   Timesheets → Notion Pages: "Time Logs"
     Direction: Brain → Notion (one-way)
     Last sync: 1 day ago
     Items: 5 entries synced

   Next auto-sync: In 1 hour
   ```

4. **Action: Sync**

   Bidirectional synchronization:
   ```
   Starting Notion sync...

   1. Pulling from Notion...
      ✓ Clients: 2 updates received
      ✓ Todos: 3 new items, 1 completed

   2. Pushing to Notion...
      ✓ Clients: 1 new client added
      ✓ Projects: 1 project updated
      ✓ Todos: 2 new todos added

   3. Resolving conflicts...
      ! Client "Acme Corp" modified in both places
        Brain: Changed contact email
        Notion: Changed status
        Resolution: Keep both (merge)

   Sync complete!
   - 7 items pulled
   - 4 items pushed
   - 1 conflict resolved
   - 0 errors

   Last sync: Just now
   ```

5. **Action: Push**

   One-way push to Notion:
   ```
   Pushing Brain data to Notion...

   What to push?
   1. All data (clients, projects, todos)
   2. Clients only
   3. Projects only
   4. Todos only
   5. Timesheets only
   6. Custom selection

   [Choose option]

   Pushing: All data

   ✓ Clients: 7 synced (2 new, 1 updated)
   ✓ Projects: 4 synced (1 updated)
   ✓ Todos: 12 synced (3 new, 2 completed)
   ✓ Timesheets: 5 entries synced

   Push complete! 28 items synced to Notion.
   ```

6. **Action: Pull**

   One-way pull from Notion:
   ```
   Pulling data from Notion...

   What to pull?
   1. All databases
   2. Clients only
   3. Projects only
   4. Todos only
   5. Custom selection

   [Choose option]

   Pulling: Todos only

   ✓ Fetched 15 todos from Notion
   ✓ 3 new todos added to Brain
   ✓ 2 todos marked complete
   ✓ 1 todo updated

   Pull complete! Brain is up to date.
   ```

7. **Action: Setup**

   Configure Notion integration:
   ```
   Notion Integration Setup
   ════════════════════════════════════════════════

   1. Get Notion API token
      → Visit: https://www.notion.so/my-integrations
      → Create internal integration
      → Copy API token

      Paste token: [input]

   2. Connect to workspace
      → Testing connection...
      ✓ Connected to: {{BUSINESS_NAME}} Workspace

   3. Select databases to sync

      Available databases:
      [ ] Clients
      [ ] Projects
      [✓] Action Items
      [ ] Meeting Notes
      [ ] Time Logs

      Which databases to sync? [select]

   4. Configure sync direction

      For each database:
      - Clients: [Bidirectional / Push only / Pull only]
      - Projects: [Bidirectional / Push only / Pull only]
      - Todos: [Bidirectional / Push only / Pull only]

   5. Set sync frequency
      - Manual only
      - Every hour
      - Every 6 hours
      - Daily

   6. Field mapping

      Map Brain fields to Notion properties:
      Client name → Title
      Primary contact → Person
      Status → Select
      Projects → Relation

   7. Save configuration

   ✓ Notion integration configured!

   Run first sync now? [Y/n]
   ```

8. **Sync mappings**

   Store in `config.json`:
   ```json
   {
     "token": "[encrypted]",
     "workspaceId": "workspace-id",
     "databases": {
       "clients": {
         "notionId": "database-id",
         "direction": "bidirectional",
         "mapping": {
           "name": "title",
           "primaryContact": "person",
           "status": "select",
           "projects": "relation"
         }
       },
       "todos": {
         "notionId": "database-id",
         "direction": "bidirectional",
         "mapping": {
           "description": "title",
           "status": "checkbox",
           "priority": "select",
           "entity": "relation"
         }
       }
     },
     "syncFrequency": "hourly",
     "lastSync": "2024-01-15T14:30:00Z"
   }
   ```

9. **Error handling**

   Common errors:
   - Token invalid: Re-authenticate
   - Database not found: Check permissions
   - Conflict: Show both versions, ask resolution
   - Network error: Retry with backoff

## Related Commands

- `/status` - Overall Brain status including Notion
- `/todo` - View synced todos
- `/list-entities` - View synced entities

## MCP Integration

If Notion MCP is available:
- Use MCP for API calls
- Leverage MCP's built-in retry/error handling
- Use MCP's query builder for complex filters
