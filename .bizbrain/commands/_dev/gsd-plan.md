# GSD Plan Command

Plan the current phase into executable waves.

## Instructions

1. **Identify current phase**
   - Read `.planning/roadmap.json`
   - Find the active phase (status: "in-progress" or next "pending")
   - If no active phase, ask user to choose or run `/gsd-roadmap`

2. **Load requirements**
   - Read `.planning/requirements.json`
   - Read `.planning/phases/{phase-id}/requirements.md`
   - Understand what "done" means for this phase

3. **Analyze existing work**
   - Read all source files in the project
   - Check current implementation state
   - Identify what's already done vs. what remains

4. **Create wave plan**

   For each major deliverable in the phase:
   - Break into specific, testable tasks
   - Group tasks into waves (parallel batches)
   - Each wave should have 3-5 tasks
   - Tasks within a wave should be independent (no dependencies)
   - Order waves by dependencies

5. **Generate plan.json**

```json
{
  "phase": "phase-2",
  "phaseName": "Core Features",
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
          "status": "pending"
        },
        {
          "id": "2.2",
          "description": "API route structure",
          "acceptance": "All endpoints defined with types",
          "estimatedHours": 3,
          "status": "pending"
        }
      ]
    },
    {
      "id": "wave-2",
      "name": "Implementation",
      "dependencies": ["wave-1"],
      "tasks": [...]
    }
  ],
  "created": "2024-01-15T10:00:00Z",
  "estimatedTotal": 24
}
```

6. **Write plan files**
   - Save to `.planning/phases/{phase-id}/plan.json`
   - Create `.planning/phases/{phase-id}/status.json` (execution tracking)
   - Create `.planning/phases/{phase-id}/waves/` folder structure

7. **Display plan summary**

```
Phase 2 Plan Created
════════════════════════════════════════════════

4 waves planned with 18 total tasks

Wave 1: Foundation (4 tasks, ~12 hours)
  - Database schema design
  - API route structure
  - Type definitions
  - Error handling setup

Wave 2: Implementation (5 tasks, ~15 hours)
  - User CRUD operations
  - Authentication flow
  - Data validation
  - ... [abbreviated]

Wave 3: Integration (4 tasks, ~10 hours)
Wave 4: Polish (5 tasks, ~8 hours)

Estimated total: 45 hours
Ready to execute: /gsd-execute
```

8. **Ask for confirmation**
   - Review plan with user
   - Adjust if needed
   - Once approved, mark plan as ready

## Planning Principles

- Each task should be completable in one session (2-4 hours)
- Tasks must have clear acceptance criteria
- Wave dependencies should be minimal
- Prefer parallel work over sequential
- Include testing in task descriptions
