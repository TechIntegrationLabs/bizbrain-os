# Wave Execution Pattern

> Parallel task execution in ordered waves.

## Purpose

Groups independent tasks into waves that can execute in parallel, while respecting dependencies between waves. Maximizes throughput while maintaining correctness.

## Concept

```
Wave 1: [Task A] [Task B] [Task C]  -- all independent, run in parallel
         ↓         ↓         ↓
Wave 2: [Task D] [Task E]           -- depend on Wave 1, run in parallel
         ↓         ↓
Wave 3: [Task F]                    -- depends on Wave 2
```

## Wave Planning Rules

1. **Independence:** Tasks within a wave must have NO dependencies on each other
2. **Ordering:** Each wave depends on ALL tasks in the previous wave
3. **Granularity:** Prefer more waves with fewer tasks over fewer waves with many tasks
4. **Verification:** Each wave ends with a verification step before proceeding

## Planning Process

### Step 1: List All Tasks
Enumerate every task needed for the phase.

### Step 2: Map Dependencies
For each task, identify what it depends on.

### Step 3: Group into Waves
- Wave 1: Tasks with no dependencies
- Wave 2: Tasks that depend only on Wave 1 tasks
- Wave 3: Tasks that depend on Wave 1 or Wave 2 tasks
- Continue until all tasks are assigned

### Step 4: Verify Wave Independence
Within each wave, confirm no task depends on another task in the same wave.

## Execution Process

```
For each wave:
  1. Start all tasks in the wave (in parallel if possible)
  2. Wait for all tasks to complete
  3. Run wave verification checks
  4. If any task failed:
     a. Attempt retry (see circuit-breaker.md)
     b. If still failing, mark as blocked
     c. Continue to next wave (skip dependent tasks)
  5. Report wave completion status
  6. Proceed to next wave
```

## Wave Verification

After each wave completes:
- [ ] All task outputs exist
- [ ] No regressions in previous waves
- [ ] Build still passes (if applicable)
- [ ] Tests still pass (if applicable)

## Handling Failures

| Scenario | Action |
|----------|--------|
| One task fails in wave | Retry task, continue others |
| Multiple tasks fail | Check for common cause |
| All tasks fail | Stop, investigate, report |
| Dependent task blocked | Skip it, mark as blocked |

## Best Practices

- Keep waves small (3-5 tasks max)
- Always verify between waves
- Make atomic commits after each wave
- Log progress for resume capability
- Never skip verification to "save time"
