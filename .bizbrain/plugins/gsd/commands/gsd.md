# GSD Command

Entry point for the Get Shit Done project execution system.

## Instructions

1. **Check for GSD context**
   - Look for `.planning/` folder in current directory
   - If not found, this is not a GSD-managed project

2. **If no GSD project:**
   - Ask: "Initialize GSD for this project?"
   - If yes, run `/gsd-roadmap` to start
   - If no, explain GSD and suggest `/knowledge systems/gsd-system`

3. **If GSD project exists:**
   - Read `.planning/roadmap.json` for current phase
   - Read `.planning/phases/{current-phase}/plan.json` for current plan
   - Read `.planning/phases/{current-phase}/status.json` for execution state

4. **Display current status**

```
GSD Status - {{PROJECT_NAME}}
════════════════════════════════════════════════

Current Phase: Phase 2 - Core Features
Status: In Progress (Wave 2 of 4)

Progress:
  Phase 1: ✓ Complete
  Phase 2: ▶ 45% (Wave 1: ✓, Wave 2: ▶, Wave 3-4: -)
  Phase 3: - Pending
  Phase 4: - Pending

Current Wave (Wave 2):
  ✓ Task 2.1: Database schema design
  ▶ Task 2.2: API endpoints (in progress)
  - Task 2.3: Authentication flow

Next Action: Continue Wave 2 tasks
```

5. **Suggest next step**
   - If no plan for current phase: `/gsd-plan`
   - If plan exists but not executing: `/gsd-execute`
   - If wave complete: Move to next wave
   - If phase complete: Move to next phase
   - If stuck: `/diagnose` or `/gsd-requirements`

6. **Quick actions**

Present options:
```
What would you like to do?

  1. Execute current wave      (/gsd-execute)
  2. View detailed status      (/gsd-status)
  3. Plan next phase           (/gsd-plan)
  4. Review requirements       (/gsd-requirements)
  5. Update roadmap            (/gsd-roadmap)

Or describe what you want to work on.
```

7. **Context awareness**
   - If git branch name matches wave ID, note that
   - If recent commits relate to current tasks, show progress
   - If tests failing, suggest `/diagnose` before continuing

## Related Commands

- `/gsd-plan` - Plan the current phase
- `/gsd-execute` - Execute the plan
- `/gsd-status` - Detailed progress view
- `/gsd-roadmap` - Update project roadmap
- `/gsd-requirements` - Define done criteria

## GSD Principles

Brief reminder:
- Work in phases (major milestones)
- Break phases into waves (parallel work batches)
- Each wave has 3-5 tasks that can run in parallel
- Define "done" criteria before starting
- Track execution state continuously
