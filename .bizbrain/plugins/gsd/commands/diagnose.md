# Diagnose Command

Systematic investigation of complex issues.

## Usage

`/diagnose <issue-description>`

## Instructions

1. **Spawn diagnose-investigator agent**

   Use Task tool:
   ```
   subagent_type: "general-purpose"
   prompt: "Read ~/.claude/agents/diagnose-investigator.md and investigate: {issue}"
   context: Project files, recent changes, error logs
   ```

2. **Investigator process**

   a. **Define symptom:**
   ```
   Issue Investigation: {Issue}
   ════════════════════════════════════════════════

   Symptom: [user's description]
   Severity: [critical/high/medium/low]
   Frequency: [always/intermittent/once]
   Impact: [who/what is affected]
   ```

   b. **Gather evidence:**
   - Recent git commits
   - Error logs/stack traces
   - Console output
   - Network requests (if web app)
   - Database queries
   - Environment variables
   - Dependency versions

   c. **Reproduce:**
   - Identify steps to reproduce
   - Try to trigger the issue
   - Document reproduction steps
   - Note any variations

   d. **Hypothesis formation:**
   ```
   Possible Causes:

   1. Hypothesis A: [description]
      Likelihood: High
      Evidence: [supporting evidence]
      Test: [how to verify]

   2. Hypothesis B: [description]
      Likelihood: Medium
      Evidence: [supporting evidence]
      Test: [how to verify]

   3. Hypothesis C: [description]
      Likelihood: Low
      Evidence: [supporting evidence]
      Test: [how to verify]
   ```

   e. **Systematic testing:**

   For each hypothesis:
   1. Design test to confirm/reject
   2. Execute test
   3. Document results
   4. Update hypothesis likelihood

   f. **Root cause identification:**
   ```
   Root Cause Analysis
   ════════════════════════════════════════════════

   Root Cause: [identified cause]

   Why did this happen?
   - Immediate cause: [trigger]
   - Underlying cause: [systemic issue]
   - Contributing factors: [other factors]

   Why wasn't it caught earlier?
   - Testing gap: [what tests were missing]
   - Code review miss: [what was overlooked]
   - Deployment issue: [environment difference]
   ```

3. **Solution design**

   a. **Propose solutions:**
   ```
   Solution Options:

   Option A: [Quick Fix]
   - Description: [what to do]
   - Pros: Fast, minimal risk
   - Cons: Doesn't address root cause
   - Effort: 1 hour

   Option B: [Proper Fix]
   - Description: [what to do]
   - Pros: Addresses root cause, prevents recurrence
   - Cons: More time, wider impact
   - Effort: 4 hours

   Option C: [Comprehensive]
   - Description: [what to do]
   - Pros: Fixes issue + improves system
   - Cons: Significant refactor
   - Effort: 2 days

   Recommendation: Option B
   ```

   b. **Impact assessment:**
   - Files affected
   - Tests needed
   - Deployment risk
   - Rollback plan
   - Breaking changes

4. **Implementation path**

   Present options:
   ```
   Next Steps:

   1. Write detailed spec: /spec {solution-name}
   2. Implement directly: /implement {solution-name}
   3. Quick fix for now: /crush {issue}
   4. More investigation needed

   What would you like to do?
   ```

5. **Generate diagnostic report**

   Create `.planning/diagnostics/{issue-id}.md`:
   ```markdown
   # Diagnostic Report: {Issue}

   **Date:** 2024-01-15
   **Investigator:** Claude Code
   **Status:** Root Cause Identified

   ## Symptom
   [Description]

   ## Evidence Gathered
   - [Item 1]
   - [Item 2]

   ## Reproduction Steps
   1. Step 1
   2. Step 2
   3. Observe [error]

   ## Hypotheses Tested
   | Hypothesis | Result | Notes |
   |------------|--------|-------|
   | A | Rejected | Evidence contradicts |
   | B | Confirmed | Root cause |
   | C | Rejected | Not applicable |

   ## Root Cause
   [Detailed explanation]

   ## Proposed Solution
   [Selected option with rationale]

   ## Implementation Plan
   [Steps to fix]

   ## Prevention
   - Tests to add: [list]
   - Code review checklist: [items]
   - Monitoring: [what to watch]

   ## References
   - Related issues: [links]
   - Stack Overflow: [links]
   - Documentation: [links]
   ```

6. **Track resolution**

   Add to `.planning/diagnostics/tracking.json`:
   ```json
   {
     "issue-id": {
       "description": "...",
       "reportedAt": "2024-01-15T10:00:00Z",
       "diagnosedAt": "2024-01-15T11:30:00Z",
       "status": "diagnosed",
       "rootCause": "...",
       "solution": "...",
       "implementedAt": null
     }
   }
   ```

## Investigation Techniques

**Code Analysis:**
- Static analysis (types, lints)
- Control flow tracing
- Data flow analysis
- Dependency graph

**Runtime Analysis:**
- Logging/debugging
- Profiling
- Memory analysis
- Network inspection

**Comparative:**
- Working vs. broken versions
- Different environments
- Similar features

**Systematic:**
- Binary search (narrow down)
- Divide and conquer
- Process of elimination

## When to Diagnose vs. Crush

Use `/diagnose` when:
- Issue is complex or unclear
- Multiple potential causes
- Recurring problem
- High impact
- Need to understand root cause

Use `/crush` when:
- Issue is obvious
- Quick fix available
- One-off occurrence
- Low impact
- Root cause is clear
