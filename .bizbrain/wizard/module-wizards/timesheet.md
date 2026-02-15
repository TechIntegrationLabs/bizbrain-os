# Module Wizard: Timesheet & Time Tracking

> This prompt guides Claude Code through setting up the Timesheet module.

## What This Module Does

The Timesheet module provides:
- Automatic session time tracking via hooks
- Hourly billing calculation
- Export to CSV, JSON, or Notion
- Period-based reporting (daily, weekly, monthly)
- Per-client and per-project time allocation
- Quick summaries with `/hours`

## Prerequisites

- None (core productivity module)

## Setup Flow

### Step 1: Billing Model

Ask:
"How do you handle billing and time tracking?

1. **Hourly billing** - Track hours, calculate billable amounts
2. **Fixed price** - Track hours for personal insight, no billing calculation
3. **Just tracking** - Know where your time goes, no billing at all
4. **Retainer** - Monthly retainer with hourly tracking against it

Which describes you best?"

### Step 2: Rate Configuration (if hourly or retainer)

If hourly:
"What's your hourly rate?"
- Rate amount (e.g., 150)
- Currency (USD, EUR, GBP, etc.)
- "Do you have different rates for different clients?" [Yes / No]

If yes to different rates:
"We'll set per-client rates when you add clients. What's your default rate?"

If retainer:
"What's the typical monthly retainer amount?"
- Amount
- Hours included per month

### Step 3: Auto-Tracking

Ask:
"BizBrain can automatically track time when you're working in Claude Code sessions. This uses lightweight hooks that log session start/end times.

**Auto-tracking options:**
1. **Always on** - Every Claude Code session is tracked
2. **Brain folder only** - Only track when working in your Brain
3. **Manual** - You start/stop tracking yourself

Recommended: Always on (you can always exclude entries later)"

### Step 4: Tracking Granularity

Ask:
"How detailed should time logs be?

1. **Simple** - Just start/end time and project name
2. **Standard** - Time, project, and activity summary
3. **Detailed** - Time, project, activity, tags, and auto-generated descriptions

Recommended: Standard"

### Step 5: Export Format

Ask:
"How do you want to export timesheets?

- [ ] **CSV** - For spreadsheets and accounting software
- [ ] **JSON** - For custom integrations
- [ ] **Notion** - Sync to a Notion database
- [ ] **Markdown** - Human-readable reports

Select all that apply."

### Step 6: Reporting Period

Ask:
"What's your billing/reporting cycle?

1. **Weekly** (Monday-Sunday)
2. **Bi-weekly** (every 2 weeks)
3. **Monthly** (1st to last day)
4. **Custom** (you specify)"

### Step 7: Generate Hooks

Create the auto-tracking hooks:

**Session start hook** (`.claude/hooks/session-start.sh`):
```bash
#!/bin/bash
# Log session start for timesheet tracking
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
LOG_DIR="Operations/timesheets/logs"
LOG_FILE="$LOG_DIR/$(date +%Y-%m-%d).jsonl"
mkdir -p "$LOG_DIR"
echo "{\"event\":\"start\",\"timestamp\":\"$TIMESTAMP\",\"cwd\":\"$(pwd)\"}" >> "$LOG_FILE"
```

**Session end hook** (`.claude/hooks/session-end.sh`):
```bash
#!/bin/bash
# Log session end for timesheet tracking
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
LOG_DIR="Operations/timesheets/logs"
LOG_FILE="$LOG_DIR/$(date +%Y-%m-%d).jsonl"
mkdir -p "$LOG_DIR"
echo "{\"event\":\"end\",\"timestamp\":\"$TIMESTAMP\",\"cwd\":\"$(pwd)\"}" >> "$LOG_FILE"
```

### Step 8: Save Configuration

Update config.json:
```json
{
  "modules": {
    "timesheet": true
  },
  "integrations": {
    "timesheet": {
      "billingModel": "hourly|fixed|tracking|retainer",
      "rate": {
        "default": 150,
        "currency": "USD",
        "perClient": false
      },
      "retainer": {
        "amount": null,
        "hoursIncluded": null
      },
      "autoTracking": "always|brain-only|manual",
      "granularity": "simple|standard|detailed",
      "exportFormats": ["csv", "markdown"],
      "reportingPeriod": "monthly",
      "configuredAt": "<timestamp>"
    }
  }
}
```

### Step 9: Activate Module

```bash
node .bizbrain/wizard/generators/module-activator.js activate timesheet
```

### Step 10: Completion

"Timesheet tracking is ready! Here's what's configured:

- **Billing:** [model] at [rate/description]
- **Auto-tracking:** [mode]
- **Export:** [formats]
- **Period:** [period]

**Commands:**
| Command | Purpose |
|---------|---------|
| `/hours` | Quick summary of today/this week |
| `/timesheet` | Detailed breakdown |
| `/timesheet export` | Export in your chosen format(s) |
| `/timesheet [client]` | Time for a specific client |

Time tracking starts automatically from your next session!"
