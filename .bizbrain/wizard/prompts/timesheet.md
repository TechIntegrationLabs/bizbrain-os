# Module Setup: Timesheet

> Automatic time tracking for every Claude Code session. Know where your hours go, generate reports, and optionally bill clients.

## What This Module Does

Timesheet turns your Brain into a time-tracking system:
- Auto-tracks session duration tied to projects and clients
- Generates timesheets for billing, reporting, or personal awareness
- Configurable billing models (hourly, fixed, retainer, or just tracking)
- Export to CSV, Markdown, Notion, or JSON
- Session hooks capture start/end automatically -- no manual timers needed

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | `Operations/timesheet/`, `Operations/timesheet/logs/`, `Operations/timesheet/reports/` |
| **Hooks** | `timesheet-tracker` (session start/end) |
| **Commands** | `hours`, `timesheet`, `timesheet-export` |
| **Knowledge** | `timesheet-system.md` |

Time entries are stored as JSON logs:
```
Operations/timesheet/
  logs/
    2024-01-15.json     # Daily log files
    2024-01-16.json
  reports/
    week-2024-03.md     # Generated reports
  config.json           # Timesheet-specific settings
```

## Prerequisites

None. Timesheet works standalone.

## Setup Flow

### Step 1: Billing Model

**Q: How do you bill for your time?**
- `Hourly` - Bill by the hour with defined rates
- `Fixed price` - Projects have flat fees, but you still want to track hours for internal awareness
- `Retainer` - Monthly fee with included hours
- `Just tracking` - No billing, just want to know where time goes *(default)*

### Step 2: Rates (If Hourly)

If hourly billing:

**Q: What's your default hourly rate?**
Enter a number (e.g., `150`).

**Q: What currency?**
- `USD` *(default)*
- `EUR`, `GBP`, `AUD`, `CAD`, or type your own

**Q: Different rates for different clients?**
- `Yes` - Set per-client rates (can be configured later per client)
- `No` - Same rate for everyone

### Step 3: Retainer Details (If Retainer)

If retainer billing:

**Q: What's the monthly retainer amount?**
**Q: How many hours are included?**
**Q: What happens with overage?** [Bill extra / Roll over / Cap at included hours]

### Step 4: Auto-Tracking

**Q: When should time tracking run?**
- `Always on` - Track every Claude Code session, everywhere *(default)*
- `Brain folder only` - Only track when working inside your Brain directory
- `Manual` - Only track when you explicitly start a timer

### Step 5: Granularity

**Q: How much detail per time entry?**
- `Simple` - Just time and project name
- `Standard` - Time, project, and activity summary *(default)*
- `Detailed` - Time, project, activity, tags, and full descriptions

### Step 6: Export Formats

**Q: What formats do you need for reports?** (Select all that apply)
- `CSV` - Spreadsheet-friendly, works with Excel/Google Sheets
- `Markdown` - Human-readable, stores well in your Brain
- `JSON` - Machine-readable, good for automation
- `Notion` - Push directly to a Notion database (requires Notion module)

### Step 7: Reporting Period

**Q: How often do you want reports generated?**
- `Weekly` - Every Monday, summarize the previous week *(default)*
- `Bi-weekly` - Every two weeks
- `Monthly` - First of each month
- `Custom` - Define your own schedule

### Step 8: Generate Tracking Hooks

Create the session hooks that automatically log:
- Session start time and working directory
- Project name (detected from folder or config)
- Session end time and duration
- Activity summary (generated from session content)

### Step 9: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "timesheet": {
      "billingModel": "tracking-only",
      "rate": {
        "default": null,
        "currency": "USD",
        "perClient": false
      },
      "autoTracking": "always",
      "granularity": "standard",
      "exportFormats": ["csv", "markdown"],
      "reportingPeriod": "weekly",
      "configuredAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 10: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate timesheet
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| billingModel | `"tracking-only"` |
| autoTracking | `"always"` |
| granularity | `"standard"` |
| exportFormats | `["csv", "markdown"]` |
| reportingPeriod | `"weekly"` |

Quick mode sets up time tracking with no billing -- purely for knowing where your hours go. Runs automatically every session.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate timesheet
```

## Completion

Time tracking is ready. It starts automatically next session -- no action needed on your part. Session hooks will log start/end times and generate activity summaries.

**Available commands:**
- `/hours` - Quick summary of recent hours
- `/timesheet` - Detailed timesheet view
- `/timesheet export` - Export report in your configured formats
