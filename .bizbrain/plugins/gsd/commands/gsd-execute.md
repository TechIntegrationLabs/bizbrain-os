# GSD Execute Command

Execute the current phase plan with wave parallelization.

## Instructions

1. **Load execution context**
   - Read `.planning/phases/{current-phase}/plan.json`
   - Read `.planning/phases/{current-phase}/status.json`
   - Identify current wave and pending tasks

2. **Check prerequisites**
   - Verify previous wave is complete (if dependencies exist)
   - Check for blocking issues
   - Ensure all required files/dependencies are available

3. **Present current wave**

```
Executing Wave 2: Implementation
════════════════════════════════════════════════

Tasks in this wave:
  [ ] 2.1: User CRUD operations
  [ ] 2.2: Authentication flow
  [ ] 2.3: Data validation
  [ ] 2.4: Session management
  [ ] 2.5: Error boundaries

All tasks can run in parallel. Choose approach:
  1. Execute all tasks sequentially (guided)
  2. Work on specific task (manual selection)
  3. Auto-execute entire wave (autonomous)
```

4. **Execution modes**

   **Guided Sequential:**
   - Work through each task one by one
   - Show acceptance criteria
   - Implement task
   - Mark complete and move to next

   **Manual Selection:**
   - User picks a task ID
   - Load task requirements
   - Implement that specific task
   - Return to wave status

   **Autonomous:**
   - Execute all wave tasks automatically
   - Use parallel thinking where possible
   - Create git commits per task
   - Report progress after each task

5. **For each task execution**

   a. Show task details:
   ```
   Task 2.1: User CRUD operations

   Acceptance Criteria:
   - Create user endpoint with validation
   - Read user with auth check
   - Update user with RLS
   - Delete user (soft delete)
   - All endpoints tested

   Estimated: 4 hours
   Files likely affected:
   - src/app/api/users/route.ts
   - src/lib/database/users.ts
   - src/types/user.ts
   ```

   b. Implement the task:
   - Read relevant files
   - Make necessary changes
   - Run tests if available
   - Update documentation

   c. Mark complete:
   - Update status.json
   - Create git commit with task ID
   - Log time spent

6. **Track progress**

   Update `.planning/phases/{phase-id}/status.json`:
   ```json
   {
     "phase": "phase-2",
     "currentWave": "wave-2",
     "waves": {
       "wave-1": {
         "status": "complete",
         "completedAt": "2024-01-14T16:30:00Z",
         "tasks": {...}
       },
       "wave-2": {
         "status": "in-progress",
         "startedAt": "2024-01-15T09:00:00Z",
         "tasks": {
           "2.1": { "status": "complete", "completedAt": "..." },
           "2.2": { "status": "in-progress", "startedAt": "..." },
           "2.3": { "status": "pending" }
         }
       }
     }
   }
   ```

7. **Wave completion**

   When all tasks in wave complete:
   ```
   ✓ Wave 2 Complete!

   Completed:
   ✓ 2.1: User CRUD operations
   ✓ 2.2: Authentication flow
   ✓ 2.3: Data validation
   ✓ 2.4: Session management
   ✓ 2.5: Error boundaries

   Time: 14 hours (est. 15)
   Commits: 5

   Next: Wave 3 - Integration (4 tasks)
   Continue? [Y/n]
   ```

8. **Phase completion**

   When all waves complete:
   - Mark phase as complete in roadmap.json
   - Generate phase summary
   - Suggest next phase planning
