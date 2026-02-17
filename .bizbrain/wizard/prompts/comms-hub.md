# Module Setup: Communications Hub

> Unified communication layer that pulls together email, Slack, and other channels into one place. Entity-aware routing auto-links messages to client and partner records.

## What This Module Does

Communications Hub brings all your conversations into a single, organized view:
- Unified inbox across email, Slack, and other connected channels
- Entity-aware routing -- messages mentioning clients, partners, or vendors automatically link to their records
- Voice/tone profiles for writing in different styles (professional for clients, casual for team)
- Follow-up reminders when someone hasn't replied within a configurable window
- Communication history that feeds into client records and digest reports
- Draft assistance with context from entity records and past conversations

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | `Communications/` |
| **Agents** | `communication-hub` |
| **Commands** | `comms`, `inbox` |
| **Knowledge** | `communication-hub.md` |

## Prerequisites

- None required. Gmail and Slack modules are soft dependencies -- if configured, their channels are automatically included. Without them, the hub still works for organizing and drafting communications.

## Setup Flow

### Step 1: Explain the Hub

Comms Hub unifies all your communication channels into one place. Instead of checking email, then Slack, then remembering who you need to follow up with, you get a single `/inbox` that shows everything.

The real power is entity awareness. When a message mentions "Acme Corp" and Acme is one of your clients, the hub automatically links that conversation to their record. Meeting notes, action items, and context flow into the right places without manual filing.

### Step 2: Connected Channels

**Q: Which communication channels are you connecting?**

Auto-detect from other configured modules:
- Gmail (if gmail module is active)
- Slack (if slack module is active)
- Manual/draft only (always available)

Show which channels were auto-detected and confirm. If none are detected, explain that the hub still works for drafting and organizing communications -- channels can be added later.

### Step 3: Voice Profiles

**Q: Set up voice/tone profiles?**

Voice profiles let you write differently depending on the context. Instead of manually adjusting your tone, you pick a profile and the hub adapts.

- `Yes, let's create some` -- Define profiles interactively
- `No, use one style` -- Skip profiles, write naturally every time

If yes, for each profile ask:
1. **Profile name** (e.g., "Client Comms", "Team Chat", "Technical")
2. **Description** (e.g., "Professional, warm, and concise. No jargon unless the client is technical.")
3. **When to use** (e.g., "Client emails and proposals")

Suggest common starting profiles:
- **Professional** -- Polished, warm, concise. For clients and external contacts.
- **Casual** -- Friendly, direct. For team communication and internal Slack.
- **Technical** -- Precise, detailed. For developer discussions and documentation.

Create as many as needed. Type "done" when finished.

### Step 4: Follow-Up Reminders

**Q: Enable follow-up reminders?**

When you send a message and don't get a reply, the hub can nudge you after a configurable period. Useful for client outreach, proposals, and important requests.

- `Yes` -- Enable follow-up tracking
- `No` -- No reminders, manage follow-ups manually

### Step 5: Follow-Up Period (if enabled)

**Q: Default follow-up period?**
- `3 days` -- Aggressive follow-up, good for time-sensitive items
- `5 days` *(recommended)* -- Balanced, gives people a business week
- `7 days` -- Relaxed, for non-urgent communications
- `Custom` -- Specify your own number of days

You can override this per-message when sending.

### Step 6: Create Structure

Create the `Communications/` folder for storing drafts, templates, and communication logs.

### Step 7: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "commsHub": {
      "channels": ["gmail", "slack"],
      "voiceProfiles": [
        { "name": "Professional", "description": "Polished, warm, concise" },
        { "name": "Casual", "description": "Friendly and direct" }
      ],
      "followUpReminders": true,
      "followUpDays": 5,
      "configuredAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 8: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate comms-hub
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| channels | Auto-detected from configured modules |
| voiceProfiles | `[]` (none) |
| followUpReminders | `false` |
| followUpDays | `5` |

Quick mode connects whatever channels are available, skips voice profiles and follow-up reminders. Add them later in `config.json` or re-run setup.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate comms-hub
```

## Completion

Communications Hub is ready. All your connected channels feed into a unified inbox with entity-aware routing.

**Available commands:**
- `/comms` -- Communication dashboard and drafting
- `/inbox` -- Unified inbox across all channels
