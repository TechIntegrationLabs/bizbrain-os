# Module Setup: Client Tracking

> Track your clients, customers, or accounts with structured records, contact management, and optional auto-detection of mentions in conversations.

## What This Module Does

Client Tracking gives your Brain a CRM-like layer without the bloat:
- Structured client folders with contacts, history, action items, and status
- Consistent `_meta.json` for quick lookups and automation
- Optional Entity Watchdog that listens for client mentions and auto-updates records
- Import from CSV, JSON, or add clients manually
- Customizable terminology -- call them clients, customers, accounts, patients, whatever fits

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | `Clients/` (or your custom label) |
| **Agents** | `entity-manager` |
| **Commands** | `client`, `client-list`, `client-add` |
| **Knowledge** | `entity-system.md` |
| **Templates** | `client` (folder structure for new clients) |

Each client gets this structure:
```
Clients/[Name]/
  _meta.json           # Machine-readable metadata, aliases, status
  _context/
    contacts.md        # People, emails, phones
    history.md         # Interaction timeline
    action-items.md    # Open and completed tasks
    notes.md           # Freeform notes
  _pulse/
    STATUS.md          # Current status snapshot
```

## Prerequisites

None. This is a standalone module.

## Setup Flow

### Step 1: Terminology

**Q: What do you call the people/organizations that pay you?**
- Clients *(default)*
- Customers
- Accounts
- Patients
- Members
- Other (specify)

This label is used throughout your Brain -- folder names, commands, and documentation.

### Step 2: Fields Per Client

**Q: What information do you want to track per client?**

Always included: name, company, status, primary contact, created date, last activity.

Optional fields (select all that apply):
- **Billing info** - rates, payment terms, invoicing details
- **Project linkage** - connect clients to GSD projects
- **Communication log** - emails, calls, meetings
- **Action items** - tasks tied to this client
- **Tags** - categorize clients (industry, tier, region)
- **Custom fields** - define your own fields

### Step 3: Entity Watchdog

**Q: Enable Entity Watchdog for auto-detecting client mentions?**
- `Yes` - When you mention a client in conversation, the Brain auto-updates their records (new contact info, meetings, action items). Also activates the `entity-watchdog` module.
- `No` - Manual updates only.

If yes, the Entity Watchdog scans every conversation for known entity names and aliases, then updates the relevant files automatically.

### Step 4: Import Existing Clients

**Q: Import existing clients?**
- `CSV file` - Point to a CSV, map columns to fields, preview before import
- `JSON file` - Import structured JSON data
- `From CRM` - Export from your CRM and import (guide provided)
- `Start fresh` - Empty Clients folder, add as you go
- `Add a few now` - Interactive: enter client details one at a time

### Step 5: Import or Manual Entry

If importing: parse the file, show a preview of the first 3-5 records, confirm field mapping, then create all client folders.

If adding now: loop through client creation -- ask for name, company, primary contact, status. Create each folder immediately. Type "done" when finished.

### Step 6: Create Structure

Generate the `Clients/` directory and one subfolder per client with the full template structure. Populate `_meta.json` with provided data.

### Step 7: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "clientTracking": {
      "label": "clients",
      "fields": {
        "billing": true,
        "projects": true,
        "commsLog": true,
        "actionItems": true,
        "tags": true,
        "customFields": false
      },
      "entityWatchdog": true,
      "importedCount": 0,
      "configuredAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 8: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate client-tracking
```

If Entity Watchdog was enabled, also activate that module:
```bash
node .bizbrain/wizard/generators/module-activator.js activate entity-watchdog
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| label | `"clients"` |
| billing | `true` |
| projects | `true` |
| commsLog | `true` |
| actionItems | `true` |
| tags | `true` |
| customFields | `false` |
| entityWatchdog | `true` |
| importSource | `none` (start fresh) |

Quick mode creates the Clients folder with all standard fields enabled, Entity Watchdog on, and no imports. You can add clients anytime with `/client add`.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate client-tracking
```

## Completion

Client tracking is ready. Your `Clients/` folder is set up and the entity manager agent is deployed.

**Available commands:**
- `/client` - View client dashboard
- `/client list` - List all clients with status
- `/client add` - Add a new client interactively
