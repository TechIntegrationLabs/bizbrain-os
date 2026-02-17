# Module Setup: Partner Tracking

> Track your strategic partners, collaborators, and affiliates with structured records, contact management, and interaction history.

## What This Module Does

Partner Tracking gives your Brain a relationship management layer for strategic partnerships:
- Structured partner folders with contacts, history, action items, and status
- Consistent `_meta.json` for quick lookups and automation
- Optional Entity Watchdog that listens for partner mentions and auto-updates records
- Import from CSV, JSON, or add partners manually
- Customizable terminology -- call them partners, collaborators, allies, affiliates, whatever fits
- Track shared projects, revenue sharing, and partnership health

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | `Partners/` (or your custom label) |
| **Agents** | *(none)* |
| **Commands** | `partner`, `partner-list`, `partner-add` |
| **Hooks** | *(none)* |
| **MCPs** | *(none)* |
| **Knowledge** | *(none)* |
| **Templates** | `partner` (folder structure for new partners) |

Each partner gets this structure:
```
Partners/[Name]/
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

If `client-tracking` is already active, the Entity Watchdog and entity system knowledge are shared -- no duplicate setup needed.

## Setup Flow

### Step 1: Terminology

**Q: What do you call your strategic collaborators?**
- Partners *(default)*
- Collaborators
- Allies
- Affiliates
- Associates
- Other (specify)

This label is used throughout your Brain -- folder names, commands, and documentation.

### Step 2: Fields Per Partner

**Q: What information do you want to track per partner?**

Always included: name, company, status, primary contact, relationship type, created date, last activity.

Optional fields (select all that apply):
- **Shared projects** - Joint ventures, co-developed products, shared initiatives
- **Revenue sharing** - Commission splits, referral fees, profit sharing terms
- **Contract details** - Agreement terms, renewal dates, scope of partnership
- **Communication log** - Emails, calls, meetings, touchpoints
- **Action items** - Tasks and follow-ups tied to this partner
- **Tags** - Categorize partners (industry, tier, region, partnership type)

### Step 3: Entity Watchdog

**Q: Enable Entity Watchdog for auto-detecting partner mentions?**
- `Yes` - When you mention a partner in conversation, the Brain auto-updates their records (new contact info, meetings, action items). Also activates the `entity-watchdog` module if not already active.
- `No` - Manual updates only.

If yes and the watchdog is already active from client-tracking, it simply extends to cover partners too.

### Step 4: Import Existing Partners

**Q: Import existing partners?**
- `Add a few now` - Interactive: enter partner details one at a time
- `Start fresh` - Empty Partners folder, add as you go
- `Import from file` - CSV or JSON with partner data

### Step 5: Import or Manual Entry

If importing: parse the file, show a preview of the first 3-5 records, confirm field mapping, then create all partner folders.

If adding now: loop through partner creation -- ask for name, company, relationship type, primary contact. Create each folder immediately. Type "done" when finished.

### Step 6: Create Structure

Generate the `Partners/` directory (or custom label) and one subfolder per partner with the full template structure. Populate `_meta.json` with provided data.

### Step 7: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "partnerTracking": {
      "label": "partners",
      "fields": {
        "sharedProjects": true,
        "revenueSharing": false,
        "contracts": true,
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
node .bizbrain/wizard/generators/module-activator.js activate partner-tracking
```

If Entity Watchdog was enabled and is not already active:
```bash
node .bizbrain/wizard/generators/module-activator.js activate entity-watchdog
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| label | `"partners"` |
| sharedProjects | `true` |
| revenueSharing | `true` |
| contracts | `true` |
| commsLog | `true` |
| actionItems | `true` |
| tags | `true` |
| entityWatchdog | `true` |
| importSource | `none` (start fresh) |

Quick mode creates the Partners folder with all optional fields enabled, Entity Watchdog on, and no imports. You can add partners anytime with `/partner add`.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate partner-tracking
```

## Completion

Partner tracking is ready. Your `Partners/` folder is set up and ready for use.

**Available commands:**
- `/partner` - View partner dashboard
- `/partner list` - List all partners with status
- `/partner add` - Add a new partner interactively

If Entity Watchdog is active, partner mentions in conversations will be auto-detected and their records updated in real time.
