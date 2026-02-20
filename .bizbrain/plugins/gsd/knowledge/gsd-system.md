# GSD (Get Shit Done) System

Structured project execution system for BizBrain OS.

## Overview

GSD breaks projects into phases, phases into waves, and waves into parallelizable tasks. It emphasizes:
- Clear requirements and "done" criteria
- Wave-based parallel execution
- Continuous progress tracking
- Test-driven implementation

## Core Concepts

### Requirements
What "done" looks like for the entire project.

**File:** `.planning/requirements.json`

Includes:
- Functional requirements (features that must work)
- Non-functional requirements (performance, quality)
- Acceptance criteria (how to verify done)

### Roadmap
High-level phases from start to launch.

**File:** `.planning/roadmap.json`

Typical phases:
1. **Foundation** - Infrastructure, setup, core architecture
2. **Core Features** - Primary user-facing functionality
3. **Advanced Features** - Enhancements, integrations
4. **Launch Prep** - Testing, docs, deployment, monitoring

### Phases
Major milestones with clear deliverables.

**Folder:** `.planning/phases/phase-{n}/`

Each phase has:
- `requirements.md` - What needs to be done
- `plan.json` - Execution plan (waves and tasks)
- `status.json` - Execution state
- `waves/` - Wave-specific files

### Waves
Batches of parallel, independent tasks.

Tasks within a wave:
- Can run simultaneously
- Have no dependencies on each other
- Are independently testable
- Take 2-4 hours each

### Tasks
Specific, completable work items.

Each task has:
- ID (e.g., `2.3` = Phase 2, Task 3)
- Description (what to do)
- Acceptance criteria (how to verify)
- Estimated hours
- Status (pending/in-progress/complete)

## GSD Workflow

### 1. Initialize Project

Command: `/gsd new <project-name>`

Creates:
- `.planning/` folder structure
- Initial `PROJECT.md` with context
- Placeholder for roadmap

### 2. Define Requirements

Command: `/gsd requirements`

Process:
1. Interview to understand project goals
2. Define functional requirements
3. Define non-functional requirements (performance, quality)
4. Set acceptance criteria
5. Write to `requirements.json`

Example:
```json
{
  "functional": [
    {
      "category": "Authentication",
      "requirements": [
        "Users can sign up with email",
        "Users can log in with OAuth",
        "Session persists across page loads"
      ]
    }
  ],
  "nonFunctional": [
    {
      "category": "Performance",
      "requirements": [
        "Page load < 2 seconds",
        "API response < 500ms"
      ]
    }
  ],
  "acceptance": [
    "All functional requirements met",
    "All tests passing",
    "Deployed to production"
  ]
}
```

### 3. Create Roadmap

Command: `/gsd roadmap`

Process:
1. Analyze requirements
2. Propose phase structure
3. Define deliverables per phase
4. Estimate timeline
5. Write to `roadmap.json`

Example:
```json
{
  "projectName": "ProjectAlpha",
  "phases": [
    {
      "id": "phase-1",
      "name": "Foundation",
      "description": "Core infrastructure and setup",
      "status": "complete",
      "deliverables": [
        "Database schema with RLS",
        "Authentication system",
        "Basic API structure"
      ]
    },
    {
      "id": "phase-2",
      "name": "Core Features",
      "status": "in-progress",
      "deliverables": [
        "User CRUD operations",
        "Main dashboard",
        "Data visualization"
      ]
    }
  ]
}
```

### 4. Plan Phase

Command: `/gsd plan`

For current phase:
1. Read phase requirements
2. Analyze existing code
3. Break deliverables into tasks
4. Group tasks into waves (parallel batches)
5. Order waves by dependencies
6. Write to `phases/phase-{n}/plan.json`

Example:
```json
{
  "phase": "phase-2",
  "waves": [
    {
      "id": "wave-1",
      "name": "Foundation",
      "tasks": [
        {
          "id": "2.1",
          "description": "Database schema design",
          "acceptance": "All tables created with RLS policies",
          "estimatedHours": 4,
          "status": "complete"
        },
        {
          "id": "2.2",
          "description": "API route structure",
          "acceptance": "All endpoints defined with types",
          "estimatedHours": 3,
          "status": "complete"
        }
      ]
    },
    {
      "id": "wave-2",
      "name": "Implementation",
      "dependencies": ["wave-1"],
      "tasks": [
        {
          "id": "2.3",
          "description": "User CRUD operations",
          "acceptance": "Create, read, update, delete with validation",
          "estimatedHours": 5,
          "status": "in-progress"
        },
        {
          "id": "2.4",
          "description": "Authentication flow",
          "acceptance": "Login, logout, session management working",
          "estimatedHours": 4,
          "status": "pending"
        }
      ]
    }
  ]
}
```

### 5. Execute Phase

Command: `/gsd execute`

For each wave:
1. Check wave dependencies met
2. Present tasks in wave
3. Execute tasks (sequential, manual selection, or autonomous)
4. Update `status.json` after each task
5. Mark wave complete when all tasks done
6. Move to next wave

Task execution:
- Show acceptance criteria
- Implement feature/fix
- Run tests
- Create git commit
- Mark task complete

### 6. Track Progress

Command: `/gsd status`

Shows:
- Overall completion percentage
- Phase breakdown
- Current wave and task
- Time estimated vs. actual
- Blockers or risks
- Next actions

### 7. Complete Phase

When all waves in phase complete:
1. Mark phase as complete in `roadmap.json`
2. Update phase `status.json`
3. Generate phase summary
4. Move to next phase or complete project

## File Structure

```
.planning/
├── roadmap.json                   Phase roadmap
├── requirements.json              Project requirements
├── phases/
│   ├── phase-1/
│   │   ├── requirements.md       Phase-specific requirements
│   │   ├── plan.json             Wave plan
│   │   ├── status.json           Execution state
│   │   └── waves/
│   │       ├── wave-1/
│   │       └── wave-2/
│   ├── phase-2/
│   └── ...
├── specs/                         Feature specs (from /spec)
│   ├── feature-name.md
│   └── tracking.json
└── diagnostics/                   Issue investigations (from /diagnose)
    ├── issue-id.md
    └── tracking.json
```

## Status Tracking

**status.json** per phase:
```json
{
  "phase": "phase-2",
  "status": "in-progress",
  "startedAt": "2024-01-13T09:00:00Z",
  "currentWave": "wave-2",
  "progress": {
    "totalTasks": 18,
    "completedTasks": 10,
    "percentage": 55
  },
  "waves": {
    "wave-1": {
      "status": "complete",
      "completedAt": "2024-01-14T16:30:00Z",
      "tasks": {
        "2.1": {
          "status": "complete",
          "completedAt": "2024-01-13T12:00:00Z",
          "actualHours": 4.5,
          "commits": ["abc123"]
        }
      }
    },
    "wave-2": {
      "status": "in-progress",
      "startedAt": "2024-01-15T09:00:00Z",
      "tasks": {
        "2.3": {
          "status": "in-progress",
          "startedAt": "2024-01-15T09:00:00Z"
        },
        "2.4": {
          "status": "pending"
        }
      }
    }
  }
}
```

## Integration with Other Systems

### Specs (/spec command)
- Create detailed feature specifications
- Link specs to GSD tasks
- Implement from approved specs

### Diagnostics (/diagnose command)
- Investigate complex issues
- Create diagnostic reports
- Plan fixes as GSD tasks

### Implementation (/implement command)
- Execute specs with TDD approach
- Track implementation progress
- Link to GSD tasks

### Todos
- GSD tasks can create action items
- Track blockers and dependencies
- Link to entity action items

## Best Practices

1. **Clear requirements first** - Don't start without knowing "done"
2. **Plan in waves** - Group independent tasks for parallel work
3. **Small tasks** - 2-4 hours max, clearly testable
4. **Update status** - Track progress after each task
5. **Commit frequently** - One commit per task minimum
6. **Test as you go** - Don't accumulate untested code
7. **Document decisions** - Add notes to phase requirements
8. **Adjust plans** - Revise estimates based on actual time
9. **Review phase** - Before moving to next, verify all deliverables
10. **Celebrate milestones** - Acknowledge phase completions

## GSD Commands Reference

| Command | Purpose |
|---------|---------|
| `/gsd` | Show status and next action |
| `/gsd-requirements` | Define project requirements |
| `/gsd-roadmap` | Create phase roadmap |
| `/gsd-plan` | Plan current phase into waves |
| `/gsd-execute` | Execute current phase plan |
| `/gsd-status` | Detailed progress view |
| `/spec <feature>` | Create feature specification |
| `/implement <spec>` | Execute implementation |
| `/diagnose <issue>` | Investigate complex issue |
| `/crush <bug>` | Quick bug fix |

## Example Flow

1. Start new project: `/gsd new MyApp`
2. Define what done looks like: `/gsd requirements`
3. Create phase roadmap: `/gsd roadmap`
4. Plan first phase: `/gsd plan`
5. Execute first wave: `/gsd execute`
6. Check progress: `/gsd status`
7. Complete phase, move to next: `/gsd plan` (for next phase)
8. Repeat until project complete

## Measuring Success

GSD is working when:
- Tasks are consistently completable in one session
- Waves finish in 1-2 days
- Phases finish on estimated timeline
- No tasks blocked by other in-progress tasks
- Acceptance criteria clearly verifiable
- Progress visible and trackable
