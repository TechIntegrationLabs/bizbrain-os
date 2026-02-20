# Implement Command

Execute implementation from an approved specification.

## Usage

`/implement <spec-name>`

## Instructions

1. **Load specification**
   - Read `.planning/specs/{spec-name}.md`
   - Verify status is "Approved"
   - If not approved, ask for approval first

2. **Check for existing implementation**
   - Look for related code files
   - Check git history for previous attempts
   - Review current project state

3. **Spawn implement-agent**

   Use Task tool:
   ```
   subagent_type: "general-purpose"
   prompt: "Read ~/.claude/agents/implement-agent.md and implement spec: {spec-name}"
   context: Spec file, current codebase, project standards
   ```

4. **Implement-agent process**

   The agent follows TDD approach:

   a. **Parse specification:**
   - Extract all requirements
   - Identify acceptance criteria
   - List all components/files needed
   - Note dependencies and integration points

   b. **Plan implementation:**
   ```
   Implementation Plan for {Feature}
   ════════════════════════════════════════════════

   Files to create/modify:
   - src/app/api/feature/route.ts (new)
   - src/components/FeaturePanel.tsx (new)
   - src/lib/database/feature.ts (new)
   - src/types/feature.ts (new)

   Order of implementation:
   1. Database schema & types
   2. API endpoints
   3. Business logic
   4. Frontend components
   5. Tests
   6. Documentation

   Proceed? [Y/n]
   ```

   c. **Write tests first (TDD):**
   - Create test file for each component
   - Write tests based on acceptance criteria
   - Tests should fail initially (no implementation yet)

   d. **Implement feature:**

   For each component:
   1. Write minimal code to pass tests
   2. Refactor for quality
   3. Verify tests pass
   4. Move to next component

   e. **Integration:**
   - Connect components
   - Test integration points
   - Verify end-to-end flows

   f. **Polish:**
   - Error handling
   - Loading states
   - Edge cases
   - Performance optimization

5. **Track progress**

   Update `.planning/specs/tracking.json`:
   ```json
   {
     "feature-name": {
       "spec": ".planning/specs/feature-name.md",
       "status": "implementing",
       "startedAt": "2024-01-15T10:00:00Z",
       "progress": {
         "database": "complete",
         "api": "in-progress",
         "frontend": "pending",
         "tests": "in-progress"
       },
       "commits": [
         "abc123: Add database schema for feature",
         "def456: Implement API endpoints"
       ]
     }
   }
   ```

6. **Verification checklist**

   Before marking complete:
   ```
   Implementation Verification
   ════════════════════════════════════════════════

   Acceptance Criteria:
   ✓ Users can create feature
   ✓ Data validates correctly
   ✓ Error handling works
   ✓ Mobile responsive

   Code Quality:
   ✓ All tests passing (24/24)
   ✓ TypeScript checks pass
   ✓ No console errors
   ✓ Lighthouse score > 90

   Documentation:
   ✓ API documented
   ✓ Components documented
   ✓ Usage examples added

   Git:
   ✓ Commits follow convention
   ✓ Branch up to date
   ✓ Ready for PR

   All checks passed! Feature complete.
   ```

7. **Mark complete**
   - Update spec status to "Implemented"
   - Add implementation date
   - Link to relevant commits
   - Create summary

8. **Create PR (optional)**

   If user wants:
   ```
   Create pull request for this feature?

   Title: [Feature Name]
   Branch: feature/[feature-name]
   Commits: 8
   Files changed: 12

   [Y/n]
   ```

## Implementation Principles

- **TDD:** Write tests first, then implementation
- **Incremental:** Small commits, frequent verification
- **Quality:** Follow project code standards
- **Documentation:** Document as you go
- **Testing:** Test each component thoroughly
- **Integration:** Verify connections between parts

## Error Handling

If implementation blocked:
- Identify blocker (missing dependency, unclear requirement, technical issue)
- Report to user with context
- Suggest solutions or spec revision
- Update tracking status

## Success Criteria

Implementation is complete when:
1. All acceptance criteria met
2. All tests passing
3. No TypeScript/lint errors
4. Documentation complete
5. Code reviewed (by user or automated)
6. Deployed to test environment
