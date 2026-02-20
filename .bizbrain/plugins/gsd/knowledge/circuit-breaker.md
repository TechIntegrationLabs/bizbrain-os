# Circuit Breaker Pattern

> Safety pattern for autonomous execution with limits.

## Purpose

Prevents runaway loops and cascading failures when Claude Code is executing tasks autonomously. Provides graceful degradation instead of hard crashes.

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `maxRetries` | 3 | Maximum retry attempts per task |
| `maxConsecutiveErrors` | 5 | Errors before circuit opens |
| `cooldownPeriod` | 60s | Wait time after circuit opens |
| `halfOpenAttempts` | 1 | Test attempts in half-open state |
| `timeoutPerTask` | 120s | Max time per individual task |
| `maxTotalTime` | 30m | Max time for entire operation |

## States

### Closed (Normal)
- Tasks execute normally
- Errors are counted
- If `maxConsecutiveErrors` reached, transition to **Open**

### Open (Stopped)
- All tasks are rejected immediately
- Wait for `cooldownPeriod`
- Then transition to **Half-Open**

### Half-Open (Testing)
- Allow `halfOpenAttempts` tasks through
- If they succeed, transition to **Closed**
- If they fail, transition back to **Open**

## Implementation

```
When executing autonomous loops:

1. Before each task:
   - Check circuit state
   - Check total elapsed time vs maxTotalTime
   - Check retry count vs maxRetries

2. On task failure:
   - Increment error counter
   - Log error with context
   - If recoverable, retry (up to maxRetries)
   - If not recoverable, increment consecutive errors

3. On circuit open:
   - Stop all execution
   - Report current progress
   - List remaining tasks
   - Suggest manual intervention points
```

## Error Classification

| Type | Recoverable | Action |
|------|------------|--------|
| Syntax error | Yes | Fix and retry |
| Test failure | Yes | Analyze and fix |
| Build error | Yes | Check dependencies |
| Permission denied | No | Stop, report |
| Missing dependency | No | Stop, report |
| Infinite loop detected | No | Stop, report |

## Usage in GSD

The circuit breaker wraps wave execution:

1. Each wave has its own circuit breaker
2. If a wave's circuit opens, skip to the next wave
3. Track which tasks were skipped for manual review
4. At the end, report all skipped tasks together

## Best Practices

- Always set `maxTotalTime` to prevent runaway sessions
- Log every state transition
- Report progress before stopping
- Prefer stopping early over corrupting state
- Save partial progress so work is not lost
