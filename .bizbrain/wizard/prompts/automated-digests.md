# Module Setup: Automated Digests

> Compile summaries of all your Brain activity -- work completed, client interactions, project progress, time spent. Perfect for weekly reviews, client updates, and team standups.

## What This Module Does

Automated Digests aggregate your Brain's activity into readable summaries:
- Daily and/or weekly digests covering everything you worked on
- Pulls from timesheets, git activity, client interactions, project progress, and conversations
- Action item rollups showing what was completed and what's still open
- Delivered to your dashboard, Notion, or email inbox
- Great for weekly client updates, personal retrospectives, and team standups
- On-demand generation for ad-hoc reports at any time

## What Gets Created

| Type | Items |
|------|-------|
| **Agents** | `digest-generator` |
| **Commands** | `digest`, `digest-weekly`, `digest-daily` |
| **Knowledge** | `digest-system.md` |

Digests are stored as:
```
Operations/
  digests/
    daily/
      2024-01-15.md
    weekly/
      2024-W03.md
```

## Prerequisites

None required. The digest generator works with whatever data sources are available. More modules configured means richer digests -- but even with just conversation capture, you'll get useful summaries.

## Setup Flow

### Step 1: Explain Automated Digests

Automated Digests compile everything your Brain knows about your recent activity into a structured summary. Instead of trying to remember what you did last week for a standup or client update, the digest pulls it all together.

What gets included depends on which modules you have configured:
- **Timesheets** -- Hours worked, broken down by project
- **Git activity** -- Commits, PRs merged, features shipped
- **Client interactions** -- Meetings, emails, follow-ups
- **Project progress** -- GSD phases completed, milestones hit
- **Action items** -- Tasks completed and newly created
- **Conversation highlights** -- Key decisions and outcomes from Claude Code sessions

The more modules you have, the richer the digest. But even a basic setup produces useful summaries.

### Step 2: Digest Frequency

**Q: How often should digests be generated?**
- `Daily` -- Morning summary of the previous day's activity. Good for personal accountability and team standups.
- `Weekly` *(recommended)* -- Monday summary covering the full previous week. Great for client updates, retrospectives, and planning.
- `Both` -- Daily for personal use, weekly for sharing with clients or teams.

### Step 3: Content Sources

**Q: What should digests include?**

Select all that apply:
- `Timesheet/hours data` -- How much time you spent, on what projects
- `Git commit activity` -- Code changes, PRs, deployments
- `Client interactions` -- Meetings, emails, conversations involving clients
- `Project progress` -- GSD milestones, phase completions, status changes
- `Action items completed` -- Tasks you finished during the period
- `Conversation highlights` -- Key decisions and outcomes from Claude Code sessions

Only sources with configured modules will produce data. Selecting a source without its module just means that section will be empty until you configure it.

### Step 4: Delivery Method

**Q: Where should digests be delivered?**
- `Dashboard` *(default)* -- View digests in your BizBrain dashboard. Files stored in `Operations/digests/`.
- `Notion` -- Sync digests to a Notion database. Each digest becomes a page with structured properties.
- `Email` -- Send digests to your inbox as formatted emails.

### Step 5: Email Configuration (if email selected)

**Q: Which email address should digests be sent to?**

Enter the email address. Digests will be sent at the configured frequency.

### Step 6: Notion Configuration (if Notion selected)

Check if the Notion module is configured:
- If yes: "Which Notion database should digests sync to? I can create a new one or connect to an existing database."
- If no: "The Notion module isn't configured yet. You can set it up later and come back to connect digests. For now, digests will also be saved to the dashboard."

### Step 7: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "automatedDigests": {
      "frequency": "weekly",
      "includes": {
        "timesheets": true,
        "git": true,
        "clients": true,
        "projects": true,
        "actions": true,
        "conversations": true
      },
      "deliveryMethod": "dashboard",
      "configuredAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 8: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate automated-digests
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| frequency | `"weekly"` |
| includes | All sources enabled |
| deliveryMethod | `"dashboard"` |

Quick mode configures weekly digests with all available data sources, delivered to the dashboard. Adjust frequency, sources, or delivery method in `config.json` anytime.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate automated-digests
```

## Completion

Automated Digests are configured. Summaries will be generated on your chosen schedule, pulling together activity from across your Brain.

**Available commands:**
- `/digest` -- Generate a digest right now (on-demand)
- `/digest weekly` -- Generate or view the latest weekly digest
- `/digest daily` -- Generate or view the latest daily digest
