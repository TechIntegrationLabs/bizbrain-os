# GSD Requirements Command

Define what "done" looks like for the project or current phase.

## Instructions

1. **Determine scope**
   - If in project root: project-level requirements
   - If user specifies phase: phase-level requirements
   - Default to current active phase

2. **Check for existing requirements**
   - Read `.planning/requirements.json` (project-level)
   - Read `.planning/phases/{phase-id}/requirements.md` (phase-level)
   - If exists, offer to view, update, or recreate

3. **Interview for requirements**

   **Project-level questions:**
   ```
   Let's define what "done" means for this project.

   1. What must work for this to be production-ready?
   2. What are the critical user flows?
   3. What performance standards must be met?
   4. What quality standards (tests, docs, etc.)?
   5. What deployment/infrastructure requirements?
   ```

   **Phase-level questions:**
   ```
   Requirements for Phase 2: Core Features

   1. What features must be complete?
   2. What defines success for each feature?
   3. What can be tested?
   4. What documentation is needed?
   5. What's out of scope for this phase?
   ```

4. **Structure requirements**

   **Project-level (requirements.json):**
   ```json
   {
     "projectName": "ProjectAlpha",
     "version": "1.0.0",
     "functional": [
       {
         "category": "Authentication",
         "requirements": [
           "Users can sign up with email",
           "Users can log in with OAuth",
           "Session persists across page loads",
           "Password reset flow works"
         ]
       },
       {
         "category": "Dashboard",
         "requirements": [
           "Displays user's projects",
           "Real-time updates",
           "Export to CSV/PDF"
         ]
       }
     ],
     "nonFunctional": [
       {
         "category": "Performance",
         "requirements": [
           "Page load < 2 seconds",
           "API response < 500ms",
           "Lighthouse score > 90"
         ]
       },
       {
         "category": "Quality",
         "requirements": [
           "Test coverage > 80%",
           "All public APIs documented",
           "Zero TypeScript errors"
         ]
       }
     ],
     "acceptance": [
       "All functional requirements met",
       "All tests passing",
       "Deployed to production",
       "Monitoring in place"
     ]
   }
   ```

   **Phase-level (requirements.md):**
   ```markdown
   # Phase 2: Core Features - Requirements

   ## Must Have
   - [ ] User CRUD operations with validation
   - [ ] Dashboard displays all user data
   - [ ] Export functionality (CSV, PDF)
   - [ ] Real-time updates via subscriptions

   ## Should Have
   - [ ] Search and filter
   - [ ] Pagination
   - [ ] Sorting options

   ## Nice to Have
   - [ ] Bulk operations
   - [ ] Advanced filters

   ## Acceptance Criteria
   1. All "Must Have" items complete
   2. All tests passing
   3. API documented
   4. UI responsive on mobile

   ## Out of Scope
   - Analytics (Phase 3)
   - Notifications (Phase 3)
   - Team features (Phase 3)
   ```

5. **Generate test checklist**

   From requirements, create testable checklist:
   ```markdown
   # Test Checklist - Phase 2

   ## User Management
   - [ ] Create user with valid data succeeds
   - [ ] Create user with invalid data fails
   - [ ] Update user updates database
   - [ ] Delete user soft deletes record

   ## Dashboard
   - [ ] Dashboard loads within 2 seconds
   - [ ] All user projects displayed
   - [ ] Real-time updates work
   - [ ] Export generates correct file
   ```

6. **Display requirements summary**

```
Requirements Defined - Phase 2
════════════════════════════════════════════════

Must Have: 12 requirements
Should Have: 6 requirements
Nice to Have: 3 requirements

Acceptance Criteria:
  ✓ All Must Have features
  ✓ All tests passing
  ✓ API documented
  ✓ Mobile responsive

Test Checklist: 24 test cases created

Next: /gsd-plan (plan this phase)
```

7. **Link to planning**
   - Requirements inform wave planning
   - Each requirement should map to tasks
   - Track requirement → task → completion

## Requirement Quality

Good requirements are:
- Specific (not vague)
- Testable (can verify done)
- Measurable (quantifiable when possible)
- Achievable (within phase scope)
- Relevant (supports project goals)
