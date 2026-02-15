# Module Wizard: Client Tracking

> This prompt guides Claude Code through setting up the Client Tracking module.

## What This Module Does

Client Tracking is your CRM inside the Brain:
- Structured client records with contacts, history, and action items
- Auto-detection of client mentions in conversations (with Entity Watchdog)
- Client-specific todo lists and project linkage
- Communication history tracking
- Status dashboards and pulse monitoring

## Prerequisites

- None (core business module)

## Setup Flow

### Step 1: Understand Their Client Model

Ask:
"Let's set up client tracking for your Brain. A few quick questions:

1. **What do you call your clients?** (clients, customers, accounts, patients, students, etc.)
   - This affects labels throughout the Brain

2. **What info do you typically track for each client?**
   - Contact details (name, email, phone)
   - Company info
   - Project history
   - Billing info
   - Custom fields?

3. **About how many active clients do you have?** (rough number is fine)"

### Step 2: Configure Tracking Fields

Based on their answers, present the default fields and let them customize:

"Here's what I'll track for each client by default:

**Always tracked:**
- Name, company, status (active/inactive)
- Primary contact (name, email, phone)
- Creation date, last interaction

**Optional (toggle on/off):**
- [ ] Billing info (rate, currency, payment terms)
- [ ] Project linkage (connect to Projects/ folder)
- [ ] Communication log (auto-log interactions)
- [ ] Action items (per-client todo lists)
- [ ] Tags and categories
- [ ] Custom fields (you define)

Which optional fields do you want?"

### Step 3: Entity Watchdog Integration

Ask:
"Would you like the **Entity Watchdog** to automatically detect when clients are mentioned in conversations?

When enabled, if you say something like 'I talked to Sarah from Acme today about the new project,' I'll automatically:
- Log the interaction in Acme's history
- Note the project reference
- Update the last-interaction date

This works across all Brain conversations. [Yes / No]"

If yes, also enable the entity-watchdog module.

### Step 4: Import Existing Clients

Ask:
"Do you have existing client data to import?

1. **CSV/spreadsheet** - I'll parse and import
2. **JSON file** - Direct import
3. **From a CRM** (HubSpot, Salesforce, etc.) - I'll help export then import
4. **Start fresh** - We'll add clients as we go
5. **Add a few now** - Let's add your top clients right now"

If they choose to import:
- Guide them to provide the file
- Parse and preview: "I found [N] clients. Here are the first 5: [preview]. Import all?"
- Create client folders for each

If they want to add a few now:
- "Great! Tell me about your first client. Name, company, and how to contact them."
- Repeat for each client they want to add
- Create the folder structure for each

### Step 5: Client Folder Structure

For each client, create:
```
Clients/
  [ClientName]/
    _meta.json          # Machine-readable metadata
    _context/
      contacts.md       # Contact details
      history.md        # Interaction history
      action-items.md   # Client-specific todos
      notes.md          # General notes
    _pulse/
      STATUS.md         # Current status and health
```

### Step 6: Configure Client Template

Show the template that will be used for new clients:
```
_meta.json:
{
  "name": "",
  "company": "",
  "type": "client",
  "status": "active",
  "aliases": [],
  "primaryContact": { "name": "", "email": "", "phone": "" },
  "tags": [],
  "createdAt": "",
  "lastInteraction": ""
}
```

Ask: "Want to add any custom fields to the client template?"

### Step 7: Generate Commands

The module will deploy these commands:
- `/client <name>` - Look up or create a client
- `/client list` - List all clients
- `/client add <name>` - Add a new client
- `/client <name> log` - Log an interaction
- `/client <name> todos` - Show client action items

### Step 8: Save Configuration

Update config.json:
```json
{
  "modules": {
    "client-tracking": true,
    "entity-watchdog": true  // if opted in
  },
  "integrations": {
    "clientTracking": {
      "label": "clients",
      "fields": {
        "billing": true/false,
        "projects": true/false,
        "commsLog": true/false,
        "actionItems": true/false,
        "tags": true/false,
        "customFields": []
      },
      "entityWatchdog": true/false,
      "importedCount": 0,
      "configuredAt": "<timestamp>"
    }
  }
}
```

### Step 9: Activate Module

```bash
node .bizbrain/wizard/generators/module-activator.js activate client-tracking
```

If Entity Watchdog was also selected:
```bash
node .bizbrain/wizard/generators/module-activator.js activate entity-watchdog
```

### Step 10: Completion

"Client tracking is set up! Here's what's ready:

- **Client folder:** Clients/ (with [N] clients imported)
- **Commands:** /client, /client list, /client add
- **Entity Watchdog:** [Active/Inactive] - I'll [auto-detect/not auto-detect] client mentions
- **Template:** New clients will be created with your configured fields

Try: '/client list' or 'Add a new client called [name]'"
