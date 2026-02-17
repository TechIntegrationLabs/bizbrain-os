# Module Setup: Entity Watchdog

> Silently monitors every conversation for mentions of your clients, partners, vendors, and projects. When it detects new information, it auto-updates their records. A background CRM that keeps itself current.

## What This Module Does

Entity Watchdog keeps your entity records accurate without manual effort:
- Scans every conversation for mentions of known entities (clients, partners, vendors, people, projects)
- Auto-detects new information -- email addresses, title changes, meeting references, action items
- Updates the right files immediately: contacts, history, action items, status
- Builds and maintains an entity index for fast cross-referencing
- Configurable sensitivity to balance thoroughness against false positives
- Asks before creating new entities or making significant changes

## What Gets Created

| Type | Items |
|------|-------|
| **Knowledge** | `entity-watchdog.md` |

The watchdog operates on existing entity folders:
```
Clients/[Name]/_meta.json            # Aliases, status, metadata
Clients/[Name]/_context/contacts.md  # Contact details
Clients/[Name]/_context/history.md   # Interaction timeline
Clients/[Name]/_context/action-items.md  # Tasks
Clients/[Name]/_pulse/STATUS.md      # Current status

Operations/entity-watchdog/
  ENTITY-INDEX.md                    # Master index of all entities
```

## Prerequisites

- **Client Tracking** module -- Entity Watchdog monitors entity folders created by the client tracking system. Without it, there are no entities to watch.

## Setup Flow

### Step 1: Explain Entity Watchdog

Entity Watchdog is a background process that listens to every conversation and watches for entity mentions. Think of it as a silent assistant that keeps your CRM current without you doing anything.

Here's what it catches:
- You mention a client's new email address in passing -- updated in their contacts.
- You talk about a meeting with a partner -- logged in their interaction history.
- You assign an action item related to a vendor -- added to their action items.
- Someone gets a new title or role -- updated in their record.

It doesn't interrupt your work. It just quietly keeps records accurate and mentions what it updated at the end of a response.

### Step 2: Detection Sensitivity

**Q: How aggressively should the watchdog look for entity mentions?**

- `High` -- Catches subtle references, partial name matches, and implied mentions. May occasionally flag coincidental matches. Best if you have a small number of distinctly-named entities.
- `Medium` *(recommended)* -- Balanced detection. Catches direct name mentions, known aliases, and clear contextual references. Ignores ambiguous matches.
- `Low` -- Only catches exact name matches and explicit mentions. Best if entity names overlap with common words or if you prefer minimal background activity.

### Step 3: Auto-Update Behavior

**Q: When new information is detected about a KNOWN entity, what should happen?**

- `Auto-update and notify` *(recommended)* -- Update the entity's files immediately, then briefly tell you what changed. Example: "Updated Acme Corp's primary contact email in BB1."
- `Ask before updating` -- Show you the detected information and ask for confirmation before changing any files. Safer but more interruptions.
- `Just notify, don't update` -- Tell you what was detected but don't change any files. You handle updates manually.

### Step 4: New Entity Behavior

**Q: When an UNKNOWN entity is mentioned in conversation, what should happen?**

- `Ask before creating` *(recommended)* -- "I noticed you mentioned 'Apex Solutions.' Should I create a client/partner/vendor record?" Prevents accidental records but catches new relationships.
- `Auto-create and notify` -- Automatically create a new entity record and tell you. Fast but may create records for entities you don't want to track.
- `Ignore unknown entities` -- Only monitor entities that already have records. New ones must be added manually with `/client add` or similar commands.

### Step 5: Build Entity Index

Scan existing entity folders (Clients/, Partners/, Vendors/) and build the master entity index:

- Parse every `_meta.json` for names, aliases, and keywords
- Parse every `contacts.md` for people names and contact details
- Generate `Operations/entity-watchdog/ENTITY-INDEX.md`

Show the user a summary: "Found X clients, Y partners, Z vendors. Entity index built with N total aliases and keywords."

If no entity folders exist yet, create an empty index and explain it will populate as entities are added.

### Step 6: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "entityWatchdog": {
      "sensitivity": "medium",
      "autoUpdate": true,
      "askBeforeCreate": true,
      "indexBuiltAt": "2024-01-15T10:30:00Z",
      "configuredAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 7: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate entity-watchdog
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| sensitivity | `"medium"` |
| autoUpdate | `true` |
| askBeforeCreate | `true` |

Quick mode activates the watchdog with balanced sensitivity, auto-updates for known entities, and confirmation prompts for new ones. The entity index is built automatically from existing folders.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate entity-watchdog
```

## Completion

Entity Watchdog is active. It silently monitors every conversation and keeps your entity records current. No commands needed -- it works automatically in the background.

When it updates something, you'll see a brief note like: "Updated [entity]'s [field] in your Brain."
