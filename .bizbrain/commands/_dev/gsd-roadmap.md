# GSD Roadmap Command

Create or update the project phase roadmap.

## Instructions

1. **Check for existing roadmap**
   - Look for `.planning/roadmap.json`
   - If exists, offer to view, update, or recreate

2. **If creating new roadmap:**

   a. Analyze project:
   - Read README, package.json, existing code
   - Understand project scope and goals
   - Identify major deliverables

   b. Interview user:
   ```
   Let's create your GSD roadmap.

   1. What is the project's main goal?
   2. What are the major milestones?
   3. What needs to be done first (foundation)?
   4. What can wait until later (polish)?
   5. What defines "done" for this project?
   ```

   c. Propose phase structure:
   ```
   Proposed Roadmap:

   Phase 1: Foundation (Week 1)
   - Project setup
   - Database schema
   - Authentication
   - Basic routing

   Phase 2: Core Features (Weeks 2-3)
   - User management
   - Main workflows
   - Data operations
   - Integration points

   Phase 3: Advanced Features (Week 4)
   - Advanced UI
   - Analytics
   - Notifications
   - Optimization

   Phase 4: Launch Prep (Week 5)
   - Testing
   - Documentation
   - Deployment
   - Monitoring

   Does this structure work? [Y/n/adjust]
   ```

3. **Generate roadmap.json**

```json
{
  "projectName": "ProjectAlpha",
  "created": "2024-01-10T09:00:00Z",
  "updated": "2024-01-10T09:00:00Z",
  "phases": [
    {
      "id": "phase-1",
      "name": "Foundation",
      "description": "Core infrastructure and setup",
      "status": "complete",
      "startDate": "2024-01-10",
      "endDate": "2024-01-12",
      "deliverables": [
        "Database schema with RLS",
        "Authentication system",
        "Basic API structure",
        "Type definitions"
      ]
    },
    {
      "id": "phase-2",
      "name": "Core Features",
      "description": "Primary user-facing functionality",
      "status": "in-progress",
      "startDate": "2024-01-13",
      "estimatedEndDate": "2024-01-20",
      "deliverables": [
        "User CRUD operations",
        "Main dashboard",
        "Data visualization",
        "Export functionality"
      ]
    },
    {
      "id": "phase-3",
      "name": "Advanced Features",
      "status": "pending",
      "deliverables": [...]
    },
    {
      "id": "phase-4",
      "name": "Launch Prep",
      "status": "pending",
      "deliverables": [...]
    }
  ],
  "milestones": [
    {
      "name": "MVP Ready",
      "targetDate": "2024-01-20",
      "phase": "phase-2"
    },
    {
      "name": "Beta Launch",
      "targetDate": "2024-01-25",
      "phase": "phase-3"
    },
    {
      "name": "Production Ready",
      "targetDate": "2024-01-31",
      "phase": "phase-4"
    }
  ]
}
```

4. **Create phase folders**
   - `.planning/phases/phase-1/`
   - `.planning/phases/phase-2/`
   - etc.
   - Each with `requirements.md` template

5. **Display roadmap**

```
Roadmap Created - {{PROJECT_NAME}}
════════════════════════════════════════════════

4 phases planned over 5 weeks

Phase 1: Foundation (3 days)
  ✓ Complete

Phase 2: Core Features (7 days) ← You are here
  ▶ In Progress

Phase 3: Advanced Features (7 days)
  - Pending

Phase 4: Launch Prep (7 days)
  - Pending

Next Steps:
  1. Define requirements: /gsd-requirements
  2. Plan current phase: /gsd-plan
  3. Start execution: /gsd-execute
```

6. **If updating existing roadmap:**
   - Show current roadmap
   - Ask what to change:
     - Add/remove phase
     - Adjust timeline
     - Update deliverables
     - Change phase status
   - Update roadmap.json
   - Regenerate any affected plans

## Roadmap Principles

- Start with foundation (infrastructure, setup)
- Build core features next (main value)
- Add advanced features third (enhancements)
- Finish with polish and launch (deployment)
- Each phase should be 1-2 weeks
- Keep deliverables specific and measurable
