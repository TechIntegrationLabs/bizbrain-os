# Crush Command

Quick bug-crushing workflow for rapid fixes.

## Usage

`/crush <bug-description>`

Or just `/crush` to enter interactive mode.

## Instructions

1. **Capture bug details**

   If description provided:
   - Use provided description

   If no description (interactive):
   ```
   Bug Crusher activated.

   Describe the bug:
   1. What's the error/symptom?
   2. When does it happen?
   3. Expected vs. actual behavior?

   (Or paste error message/stack trace)
   ```

2. **Quick triage**

   Categorize:
   - Crash/error (high priority)
   - UI/UX issue (medium priority)
   - Performance (medium priority)
   - Enhancement request (low priority, suggest /spec instead)

3. **Reproduce**

   a. Check if error is reproducible:
   - Look for stack trace
   - Identify affected files
   - Check recent changes (git log)

   b. Try to reproduce:
   - Run relevant code/tests
   - Check browser console
   - Review logs

4. **Diagnose**

   Quick diagnosis:
   - Read error message and stack trace
   - Identify root cause file/function
   - Check related code for issues
   - Look for similar patterns in codebase

5. **Fix**

   a. Implement fix:
   - Make minimal changes to resolve issue
   - Follow existing code patterns
   - Add defensive checks if needed

   b. Verify fix:
   - Re-run code/tests
   - Check if error gone
   - Test edge cases

6. **Test**

   Add test to prevent regression:
   ```typescript
   test('bug: should handle null data gracefully', () => {
     // Test that previously caused the bug
     expect(buggyFunction(null)).not.toThrow()
   })
   ```

7. **Document**

   Add comment in code:
   ```typescript
   // Bug fix: Handle null data (2024-01-15)
   if (!data) {
     return defaultValue
   }
   ```

8. **Commit**

   Create focused commit:
   ```bash
   git add [affected-files]
   git commit -m "fix: handle null data in buggyFunction

   Resolves issue where null data caused crash
   Added null check and test case

   Co-Authored-By: Claude Code <noreply@anthropic.com>"
   ```

9. **Report**

   ```
   ✓ Bug Crushed!

   Issue: Null data crash in buggyFunction
   Root cause: Missing null check
   Fix: Added defensive null check
   Files changed: src/lib/utils.ts, src/lib/utils.test.ts
   Tests: 1 new test added, all passing

   Commit: abc123 "fix: handle null data in buggyFunction"

   Issue resolved. Anything else?
   ```

## Quick vs. Deep

Crush is for quick fixes. For complex issues:
```
This looks complex. Suggest using:
  /diagnose - Systematic investigation
  /spec - Write detailed solution spec

Or continue with quick fix? [Y/n]
```

## Bug Categories

**Crash/Error** - Fix immediately:
- Runtime errors
- Unhandled exceptions
- Build failures

**UI/UX** - Quick fix if simple:
- Visual glitches
- Layout issues
- Minor responsiveness

**Logic** - Fix if isolated:
- Wrong calculations
- Incorrect conditions
- Data handling

**Performance** - Fix if obvious:
- Unnecessary re-renders
- N+1 queries
- Large payload

## Safety Checks

Before fixing:
- Don't break existing functionality
- Don't skip tests
- Don't ignore root cause
- Don't rush without understanding

If uncertain:
- Ask for clarification
- Suggest /diagnose for deeper investigation
- Request user review before committing
