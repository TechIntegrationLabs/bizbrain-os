# Module Setup: GSD (Light)

> Simple task management without the overhead. Priorities, categories, due dates -- and nothing more.

## What This Module Does

GSD Light is task management stripped to the essentials:
- Flat task lists with optional priorities, categories, and due dates
- No phases, no waves, no complex planning machinery
- Quick add/complete workflow for staying on top of things
- Simple project template with just a task file and notes
- Perfect for solo operators, quick projects, or people who prefer minimal process

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | *(none -- uses existing Projects/ if present)* |
| **Agents** | *(none)* |
| **Commands** | `tasks`, `task-add`, `task-done` |
| **Knowledge** | *(none)* |
| **Templates** | `gsd-light` (minimal project structure) |

Each GSD Light project uses this minimal structure:
```
Projects/[Name]/
  PROJECT.md        # Overview and status
  TASKS.md          # All tasks in one file
  _context/
    notes.md        # Freeform notes
```

## Prerequisites

None. GSD Light has zero dependencies.

**Note:** GSD Light and GSD Full are mutually exclusive. If GSD Full is already configured, switching to Light will deactivate it (and vice versa). You can switch between them at any time.

## Setup Flow

### Step 1: Confirm GSD Light

Explain the difference briefly:
- **GSD Light** - Simple task lists. Add tasks, check them off, move on. No phases, waves, or orchestration.
- **GSD Full** - Structured project management with roadmaps, phases, wave execution, and autonomous agents.

If they want Full, redirect to the `gsd-full` module prompt.

### Step 2: Priority Levels

**Q: How do you want to prioritize tasks?**
- `High / Medium / Low` - Classic three-tier *(default)*
- `Numbered 1-5` - Granular priority scale
- `None` - No priorities, just a list

### Step 3: Categories

**Q: Want to categorize tasks with tags?**
- `Yes` - Add tags like `#dev`, `#design`, `#admin`, `#client` to tasks
- `No` - Keep it simple, no categories

### Step 4: Due Dates

**Q: Track due dates on tasks?**
- `Yes` - Every task gets a due date
- `Optional` - Due dates available but not required *(default)*
- `No` - No due dates, just ordered lists

### Step 5: Review Template

Show the simple project template:

```markdown
# PROJECT.md
Project: [Name]
Status: Active
Created: [Date]

## Description
[Brief description]

---
See TASKS.md for current task list.
```

```markdown
# TASKS.md
## Active
- [ ] Task description @high #dev (due: 2024-02-01)

## Completed
- [x] Finished task @medium #admin (done: 2024-01-15)
```

**Q: This is the template. Good as-is, or want to tweak it?**

### Step 6: First Project (Optional)

**Q: Want to create a project now?**
- `Yes` - Ask for project name and a few initial tasks
- `Not yet` - Skip, use `/tasks` later

If yes, create the project folder and populate TASKS.md with any tasks they provide.

### Step 7: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "gsd": {
      "mode": "light",
      "priorities": "high-medium-low",
      "categories": true,
      "dueDates": "optional",
      "configuredAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 8: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate gsd-light
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| priorities | `"high-medium-low"` |
| categories | `true` |
| dueDates | `"optional"` |

Quick mode gives you a sensible task system with zero decisions. Start adding tasks right away.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate gsd-light
```

## Completion

GSD Light is ready. Simple task management, no ceremony.

**Available commands:**
- `/tasks` - View all tasks across projects
- `/task-add` - Add a new task
- `/task-done` - Mark a task as complete
- `/todo` - Quick view of what's next
