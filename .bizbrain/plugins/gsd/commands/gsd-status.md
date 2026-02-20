# GSD Status Command

Show detailed progress across all phases and waves.

## Instructions

1. **Load all GSD data**
   - Read `.planning/roadmap.json`
   - Read `.planning/requirements.json`
   - For each phase, read `status.json` and `plan.json`

2. **Calculate statistics**
   - Total phases, completed/in-progress/pending
   - Total waves across all phases
   - Total tasks and completion percentage
   - Time estimated vs. actual
   - Current velocity (tasks per day)

3. **Display comprehensive status**

```
GSD Status - {{PROJECT_NAME}}
════════════════════════════════════════════════

Overall Progress: 45% complete (27 of 60 tasks)

Phase 1: Foundation ✓ COMPLETE
  Duration: Jan 10-12 (3 days)
  Tasks: 12/12 complete
  Time: 18h actual / 20h estimated

Phase 2: Core Features ▶ IN PROGRESS
  Started: Jan 13
  Progress: 15/24 tasks (62%)

  Wave 1: Foundation ✓ Complete (4/4 tasks)
  Wave 2: Implementation ▶ Active (3/5 tasks)
    ✓ 2.1: User CRUD operations
    ✓ 2.2: Authentication flow
    ▶ 2.3: Data validation (in progress)
    - 2.4: Session management
    - 2.5: Error boundaries

  Wave 3: Integration - Pending (0/5 tasks)
  Wave 4: Polish - Pending (0/10 tasks)

Phase 3: Advanced Features - PENDING
  Tasks: 0/15 planned

Phase 4: Launch Prep - PENDING
  Tasks: 0/9 planned

════════════════════════════════════════════════
Velocity: 4.5 tasks/day
Estimated completion: Jan 22 (7 days remaining)
```

4. **Show blockers and risks**

If any exist:
```
⚠ Blockers:
  - Task 2.3 waiting on API key from vendor
  - Test suite failing on Task 2.1 (needs fix)

⚠ Risks:
  - Wave 3 may take longer than estimated
  - Phase 4 not yet planned
```

5. **Recent activity**
   - Last 5 completed tasks with timestamps
   - Recent git commits related to GSD tasks
   - Time logged today

6. **Next actions**

```
Next Actions:
  1. Complete Task 2.3 (data validation)
  2. Address test failures in Task 2.1
  3. Plan Wave 3 tasks in detail

Suggested command: /gsd-execute
```

7. **Export options**

Offer to:
- Export status to markdown report
- Generate chart/visualization
- Send status update to Slack/Notion
- Create timesheet entry

## Status by Phase

If user wants detail on specific phase:
`/gsd-status phase-2`

Shows:
- All waves in that phase
- Each task with full details
- Dependencies between waves
- Files changed per task
- Test coverage
- Documentation status

## Status by Time

If user wants timeline view:
`/gsd-status timeline`

Shows:
- Gantt-style view of phases and waves
- Actual vs. estimated timeline
- Milestone dates
- Projected completion
