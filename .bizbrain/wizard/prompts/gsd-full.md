# Module Setup: GSD (Full)

> Full-featured project management with phases, roadmaps, wave execution, and parallel task orchestration. For teams and individuals who run structured projects.

## What This Module Does

GSD Full (Get Shit Done) brings real project management into your Brain:
- Phase-based roadmaps that break large projects into manageable chunks
- Wave execution for parallel task batching within each phase
- Requirements tracking to define what "done" looks like before you start
- Orchestrator + Executor agent pair for autonomous task execution
- Sprint or continuous workflow support
- Project templates that keep every project consistently structured

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | `.planning/` (per project) |
| **Agents** | `gsd-orchestrator`, `gsd-executor` |
| **Commands** | `gsd`, `gsd-plan`, `gsd-execute`, `gsd-status`, `gsd-roadmap`, `gsd-requirements` |
| **Knowledge** | `gsd-system.md` |
| **Templates** | `gsd` (project structure template) |

Each GSD project gets this structure:
```
Projects/[Name]/
  PROJECT.md             # Project overview and status
  .planning/
    ROADMAP.md           # Phase breakdown
    REQUIREMENTS.md      # Done criteria
    phases/
      phase-1.md         # Detailed phase plan with waves
      phase-2.md
  _context/
    notes.md
    decisions.md
```

## Prerequisites

- **GitHub** module -- GSD Full integrates with Git branches and commits for tracking implementation progress.

## Setup Flow

### Step 1: GSD Full vs Light

If the user hasn't explicitly chosen Full, explain the difference:
- **GSD Full** - Phases, roadmaps, wave execution, sprints. For structured projects with multiple milestones.
- **GSD Light** - Simple task lists with priorities. For quick projects or people who prefer minimal process.

Confirm they want Full before proceeding. If they want Light, redirect to the `gsd-light` module prompt.

### Step 2: Project Scale

**Q: What's the typical duration of your projects?**
- `Days` - Quick builds, bug fixes, small features
- `Weeks` - Medium features, integrations, redesigns
- `Months` - Large applications, platform builds, migrations
- `Ongoing` - Continuous development, maintenance, evolving products

This determines default phase lengths and planning depth.

### Step 3: Concurrent Projects

**Q: How many projects do you typically work on at once?**
- `1-2` - Focused, deep work
- `3-5` - Balanced portfolio
- `6+` - High throughput, need strong organization

This affects dashboard layout and status reporting.

### Step 4: Sprint Cadence

**Q: Do you work in sprints?**
- `Yes, 1-week sprints` - Fast iteration cycles
- `Yes, 2-week sprints` - Standard agile cadence
- `No, continuous flow` - Ship when ready, no fixed cycles
- `Sometimes` - Flexible, sprint when it helps

### Step 5: Methodology

**Q: What's your work style?**
- `Agile/Scrum` - Sprints, standups, retrospectives
- `Kanban` - Continuous flow, WIP limits
- `Waterfall` - Sequential phases, formal gates
- `Just vibes` - Whatever works, minimal ceremony

This customizes terminology and workflow suggestions.

### Step 6: Wave Execution

**Q: How aggressive should wave execution be?**

Waves are batches of parallel tasks within a phase. More tasks per wave means faster progress but more cognitive load.

- `Conservative (2-3 tasks)` - Fewer things in flight, less context switching
- `Balanced (3-5 tasks)` - Good mix of speed and focus
- `Aggressive (5-8 tasks)` - Maximum parallelism, for experienced multitaskers

### Step 7: Planning Depth

**Q: How detailed should plans be?**
- `High-level` - Phases and milestones only, figure out details as you go
- `Detailed` - Phases broken into specific tasks with estimates
- `Granular` - Every task has subtasks, acceptance criteria, and dependencies

### Step 8: Review Template

Show the project template structure and ask:

**Q: This is the default project template. Want to customize it, or is it good as-is?**
- `Good as-is` - Use the standard template
- `Customize` - Walk through each section to adjust

### Step 9: First Project (Optional)

**Q: Want to create your first project now?**
- `Yes` - Walk through project creation: name, description, initial phases
- `Not yet` - Skip, create projects later with `/gsd new`

### Step 10: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "gsd": {
      "mode": "full",
      "projectScale": "medium",
      "sprints": { "enabled": true, "length": "2-weeks" },
      "methodology": "agile",
      "waveExecution": "balanced",
      "planningDepth": "detailed",
      "configuredAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 11: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate gsd-full
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| projectScale | `"medium"` |
| sprints | `2-weeks` |
| methodology | `"agile"` |
| waveExecution | `"balanced"` |
| planningDepth | `"detailed"` |

Quick mode sets up GSD Full with sensible defaults for a mid-sized development workflow. You can adjust any setting later in `config.json`.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate gsd-full
```

## Completion

GSD Full is configured. Your Brain is ready for structured project management with phase-based planning and wave execution.

**Available commands:**
- `/gsd` - Show current status and next action
- `/gsd new` - Create a new project
- `/gsd status` - Progress across all projects
- `/gsd roadmap` - Plan or view phase roadmap
- `/gsd plan` - Break a phase into executable waves
- `/gsd execute` - Run the next wave of tasks
- `/gsd requirements` - Define what "done" looks like
