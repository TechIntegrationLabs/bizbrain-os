# Module Setup: Vendor Tracking

> Track your vendors, suppliers, and service providers with structured records, cost tracking, contract management, and renewal reminders.

## What This Module Does

Vendor Tracking gives your Brain a procurement management layer without the enterprise overhead:
- Structured vendor folders with contacts, contracts, cost history, and status
- Consistent `_meta.json` for quick lookups and automation
- Optional Entity Watchdog that listens for vendor mentions and auto-updates records
- Import from CSV, JSON, or add vendors manually
- Customizable terminology -- call them vendors, suppliers, service providers, contractors, whatever fits
- Track costs, SLAs, renewal dates, and vendor performance

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | `Vendors/` (or your custom label) |
| **Agents** | *(none)* |
| **Commands** | `vendor`, `vendor-list`, `vendor-add` |
| **Hooks** | *(none)* |
| **MCPs** | *(none)* |
| **Knowledge** | *(none)* |
| **Templates** | `vendor` (folder structure for new vendors) |

Each vendor gets this structure:
```
Vendors/[Name]/
  _meta.json           # Machine-readable metadata, aliases, status
  _context/
    contacts.md        # People, emails, phones
    history.md         # Interaction timeline
    contracts.md       # Agreement terms, renewal dates
    notes.md           # Freeform notes
  _pulse/
    STATUS.md          # Current status snapshot
```

## Prerequisites

None. This is a standalone module.

If `client-tracking` or `partner-tracking` is already active, the Entity Watchdog and entity system knowledge are shared -- no duplicate setup needed.

## Setup Flow

### Step 1: Terminology

**Q: What do you call the people/companies you pay for services?**
- Vendors *(default)*
- Suppliers
- Service Providers
- Contractors
- Freelancers
- Other (specify)

This label is used throughout your Brain -- folder names, commands, and documentation.

### Step 2: Fields Per Vendor

**Q: What information do you want to track per vendor?**

Always included: name, company, service provided, status, primary contact, created date, last activity.

Optional fields (select all that apply):
- **Contract details** - Agreement terms, scope of service, termination clauses
- **Cost tracking** - Monthly/annual cost, payment history, rate changes
- **Renewal dates** - Contract renewal reminders, auto-renewal flags
- **SLA monitoring** - Uptime commitments, response time targets, incident tracking
- **Communication log** - Emails, calls, support tickets
- **Action items** - Tasks and follow-ups tied to this vendor
- **Tags** - Categorize vendors (type of service, tier, criticality)

### Step 3: Entity Watchdog

**Q: Enable Entity Watchdog for auto-detecting vendor mentions?**
- `Yes` - When you mention a vendor in conversation, the Brain auto-updates their records (new contact info, cost changes, issues). Also activates the `entity-watchdog` module if not already active.
- `No` - Manual updates only.

If yes and the watchdog is already active from another entity module, it simply extends to cover vendors too.

### Step 4: Import Existing Vendors

**Q: Import existing vendors?**
- `Add a few now` - Interactive: enter vendor details one at a time
- `Start fresh` - Empty Vendors folder, add as you go
- `Import from file` - CSV or JSON with vendor data

### Step 5: Import or Manual Entry

If importing: parse the file, show a preview of the first 3-5 records, confirm field mapping, then create all vendor folders.

If adding now: loop through vendor creation -- ask for name, service they provide, monthly cost (if known), primary contact. Create each folder immediately. Type "done" when finished.

### Step 6: Create Structure

Generate the `Vendors/` directory (or custom label) and one subfolder per vendor with the full template structure. Populate `_meta.json` with provided data.

### Step 7: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "vendorTracking": {
      "label": "vendors",
      "fields": {
        "contracts": true,
        "costTracking": true,
        "renewalDates": true,
        "slaMonitoring": false,
        "commsLog": true,
        "actionItems": true,
        "tags": true
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
node .bizbrain/wizard/generators/module-activator.js activate vendor-tracking
```

If Entity Watchdog was enabled and is not already active:
```bash
node .bizbrain/wizard/generators/module-activator.js activate entity-watchdog
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| label | `"vendors"` |
| contracts | `true` |
| costTracking | `true` |
| renewalDates | `true` |
| slaMonitoring | `true` |
| commsLog | `true` |
| actionItems | `true` |
| tags | `true` |
| entityWatchdog | `true` |
| importSource | `none` (start fresh) |

Quick mode creates the Vendors folder with all optional fields enabled, Entity Watchdog on, and no imports. You can add vendors anytime with `/vendor add`.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate vendor-tracking
```

## Completion

Vendor tracking is ready. Your `Vendors/` folder is set up and ready for use.

**Available commands:**
- `/vendor` - View vendor dashboard
- `/vendor list` - List all vendors with status and costs
- `/vendor add` - Add a new vendor interactively

If Entity Watchdog is active, vendor mentions in conversations will be auto-detected and their records updated in real time.
