# Module Wizard: GSD (Get Shit Done) Project Management

> This prompt guides Claude Code through setting up the GSD module (full or light).

## What This Module Does

**GSD Full** - Complete project management system:
- Multi-phase project roadmaps
- Wave-based parallel execution
- Requirements definition with checkable criteria
- Sprint/phase planning
- Task decomposition and dependency tracking
- Progress dashboards
- Context preservation across sessions

**GSD Light** - Simplified task tracking:
- Simple todo lists per project
- Basic task status (todo/doing/done)
- No phases, waves, or complex planning
- Perfect for solo work or simple projects

## Prerequisites

- None (core productivity module)

## Setup Flow

### Step 1: Determine GSD Level

If not already determined during interview, ask:

"BizBrain has two project management modes:

**GSD Full** - For teams or complex projects
- Phase-based roadmaps with milestones
- Wave execution (parallel task groups)
- Sprint planning and requirements
- Best for: agencies, multi-person projects, client work

**GSD Light** - For solo or simple projects
- Simple task lists with priorities
- No complex planning overhead
- Quick capture and completion
- Best for: freelancers, personal projects, quick tasks

Which fits your workflow better? [Full / Light / Both]"

If "Both": enable GSD Full (it includes Light functionality).

### Step 2: Project Scale (Full only)

Ask:
"How do your projects typically work?

1. **How long is a typical project?** [Days / Weeks / Months / Ongoing]
2. **How many active projects at once?** [1-2 / 3-5 / 6+]
3. **Do you work in sprints/iterations?** [Yes (how long?) / No / Sometimes]
4. **Do you use any methodology?** [Agile/Scrum / Kanban / Waterfall / Just vibes]"

### Step 3: Wave Execution Preferences (Full only)

Ask:
"When executing a phase, GSD can run tasks in 'waves' - groups of independent tasks that run in parallel. How aggressive should I be?

1. **Conservative** - Small waves (2-3 tasks), more checkpoints
2. **Balanced** - Medium waves (3-5 tasks), reasonable parallelism
3. **Aggressive** - Large waves (5-8 tasks), maximum speed

Recommended for most people: Balanced"

### Step 4: Planning Depth (Full only)

Ask:
"How detailed should project plans be?

1. **High-level** - Just phases and key milestones
2. **Detailed** - Phases with specific tasks and estimates
3. **Granular** - Full breakdown with subtasks, dependencies, and time estimates

For agencies: Detailed is usually best.
For startups: High-level lets you move faster."

### Step 5: GSD Light Configuration

If using GSD Light (or both), ask:
"For quick task management:

1. **Priority levels?** [High/Medium/Low / Numbered 1-5 / None]
2. **Categories/tags?** [Yes / No]
3. **Due dates?** [Yes / No / Optional]"

### Step 6: Project Template

Show the project structure:

**GSD Full project:**
```
Projects/
  [ProjectName]/
    PROJECT.md           # Project overview and goals
    .planning/
      ROADMAP.md         # Phase roadmap
      REQUIREMENTS.md    # Done criteria
      phases/
        phase-01/
          PLAN.md        # Execution plan
          PROGRESS.md    # Phase progress
      codebase/          # Auto-generated code maps
    _context/
      action-items.md    # Project todos
      notes.md           # Meeting notes, decisions
```

**GSD Light project:**
```
Projects/
  [ProjectName]/
    PROJECT.md           # Project overview
    TASKS.md             # Simple task list
    _context/
      notes.md           # Notes
```

Ask: "Want to customize the project template, or is this good?"

### Step 7: Generate Configuration

Update config.json:
```json
{
  "modules": {
    "gsd-full": true/false,
    "gsd-light": true/false
  },
  "integrations": {
    "gsd": {
      "mode": "full|light|both",
      "projectScale": {
        "typicalDuration": "weeks",
        "activeProjects": "3-5",
        "sprints": { "enabled": true, "duration": "2 weeks" },
        "methodology": "agile"
      },
      "waveExecution": "balanced",
      "planningDepth": "detailed",
      "lightConfig": {
        "priorities": "high-medium-low",
        "categories": true,
        "dueDates": "optional"
      },
      "configuredAt": "<timestamp>"
    }
  }
}
```

### Step 8: Offer First Project

Ask:
"Want to create your first project right now? Just tell me the name and a brief description, and I'll set it up with the GSD structure."

If yes:
1. Create the project folder
2. Generate PROJECT.md with their description
3. If Full mode, create the .planning structure
4. "Your project is ready! Run `/gsd status` to see it."

### Step 9: Activate Module

```bash
node .bizbrain/wizard/generators/module-activator.js activate gsd-full
# or
node .bizbrain/wizard/generators/module-activator.js activate gsd-light
```

### Step 10: Completion

"GSD is configured! Here are your commands:

**Core:**
| Command | Purpose |
|---------|---------|
| `/gsd` | Show status and next action |
| `/gsd new <name>` | Create a new project |
| `/gsd status` | Progress across all projects |

**Planning (Full mode):**
| Command | Purpose |
|---------|---------|
| `/gsd roadmap` | Create phase roadmap |
| `/gsd requirements` | Define done criteria |
| `/gsd plan` | Plan current phase |
| `/gsd execute` | Execute with wave parallelization |

**Quick tasks:**
| Command | Purpose |
|---------|---------|
| `/todo add <task>` | Quick task capture |
| `/todo` | View all tasks |

Ready to get shit done!"
