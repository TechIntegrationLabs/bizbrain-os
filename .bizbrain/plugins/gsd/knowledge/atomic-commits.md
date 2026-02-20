# Atomic Commits Pattern

> Small, focused git commits that each represent one logical change.

## Purpose

Makes code history readable, reviewable, and revertable. Each commit should be a self-contained change that could be reverted without breaking other functionality.

## Rules

### One Logical Change Per Commit
- Add a new function: one commit
- Fix a bug: one commit
- Refactor a module: one commit
- Do NOT combine unrelated changes

### Each Commit Should Build
- The code should compile/build after every commit
- Tests should pass after every commit
- No "WIP" commits in the main branch

### Descriptive Messages
Follow Conventional Commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

## Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add login page` |
| `fix` | Bug fix | `fix(api): handle null response` |
| `refactor` | Code restructuring | `refactor(utils): simplify date parsing` |
| `docs` | Documentation | `docs(readme): add setup instructions` |
| `test` | Tests | `test(auth): add login flow tests` |
| `chore` | Maintenance | `chore(deps): update dependencies` |
| `style` | Formatting | `style(lint): fix eslint warnings` |
| `perf` | Performance | `perf(query): add database index` |

## Commit Timing

### During Wave Execution
- Commit after each task within a wave
- Commit after wave verification passes
- Tag significant milestones

### During Bug Fixing
- Commit the failing test first
- Commit the fix separately
- Never commit test + fix together (makes it harder to verify the test actually catches the bug)

## Anti-Patterns

| Bad | Why | Good |
|-----|-----|------|
| "fix stuff" | Meaningless message | "fix(auth): handle expired token refresh" |
| "WIP" | Incomplete work | Stash instead, or use a branch |
| Huge commit | Can't revert partially | Split into logical changes |
| "fix linting + add feature" | Two unrelated changes | Two separate commits |

## Integration with Waves

After each wave:
1. Stage all changes from the wave
2. Review the diff
3. Split into logical commits if needed
4. Write clear commit messages
5. Push after verification passes

## Message Templates

```
feat(<module>): add <what>

- Implemented <details>
- Added tests for <coverage>
- Updated docs for <what>
```

```
fix(<module>): resolve <issue>

- Root cause: <explanation>
- Fix: <what was changed>
- Verified: <how it was tested>
```
