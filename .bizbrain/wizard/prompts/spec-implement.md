# Module Setup: Spec & Implement

> Two-phase development workflow: write a detailed spec describing WHAT to build, then hand it to the implement agent to build it exactly to spec. Eliminates ambiguity and scope creep.

## What This Module Does

Spec & Implement separates planning from execution so each phase gets full attention:
- Structured spec documents that define requirements, API contracts, edge cases, and test criteria before any code is written
- Implement agent that reads the approved spec and builds exactly what was specified
- Spec templates that ensure nothing gets missed -- requirements, technical design, acceptance criteria
- Optional auto-generated test cases derived directly from spec acceptance criteria
- Version-controlled specs that serve as living documentation of what was built and why

## What Gets Created

| Type | Items |
|------|-------|
| **Agents** | `spec-writer`, `implement-agent` |
| **Commands** | `spec`, `implement` |
| **Knowledge** | `spec-system.md` |

Specs follow this template structure:
```
.specs/
  [feature-name].md
    # Overview
    # Requirements
    # Technical Design
    # Test Criteria
    # Implementation Notes
```

## Prerequisites

- **GSD Full** module -- Spec & Implement integrates with GSD phases so specs can be linked to project milestones and waves.

## Setup Flow

### Step 1: Explain the Workflow

Spec & Implement is a two-phase workflow that keeps planning and building cleanly separated:

1. **Spec phase** (`/spec <feature>`) -- You describe what you want. The spec-writer agent asks clarifying questions, then produces a structured spec document covering requirements, technical design, edge cases, and acceptance criteria.
2. **Implement phase** (`/implement <spec-file>`) -- The implement agent reads the approved spec and builds it. No guessing, no scope creep. It follows the spec.

This matters because the biggest source of wasted effort is building the wrong thing. A 20-minute spec saves hours of rework.

### Step 2: Spec Detail Level

**Q: How detailed should specs be by default?**
- `Detailed` *(recommended)* -- Comprehensive specs covering edge cases, API contracts, error handling, performance considerations, and detailed test criteria. Best for features that touch multiple systems or involve complex logic.
- `Quick` -- Just the key requirements and acceptance criteria. Good for small features, bug fixes, or when you already have a clear mental model.

You can override this per-spec. This just sets the default.

### Step 3: Auto-Generate Test Cases

**Q: Automatically generate test cases from spec acceptance criteria?**
- `Yes` -- When a spec is finalized, the spec-writer generates a companion test file with test cases derived from the acceptance criteria. Gives the implement agent a clear target.
- `No` -- Write tests manually or skip them. You can always generate tests later.

### Step 4: Default Spec Template

**Q: Here's the default spec template structure. Want to customize it, or is it good as-is?**

```
# [Feature Name]

## Overview
Brief description of what this feature does and why it matters.

## Requirements
- Functional requirements (what it must do)
- Non-functional requirements (performance, security, accessibility)

## Technical Design
- Architecture decisions
- API contracts / interfaces
- Data models
- Dependencies

## Test Criteria
- Acceptance criteria (when is this "done"?)
- Edge cases to handle
- Error scenarios

## Implementation Notes
- Suggested approach
- Known constraints
- Related files / systems
```

- `Good as-is` -- Use the standard template
- `Customize` -- Walk through each section to add, remove, or rename

### Step 5: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "specImplement": {
      "specDepth": "detailed",
      "autoTests": false,
      "configuredAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 6: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate spec-implement
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| specDepth | `"detailed"` |
| autoTests | `false` |
| template | Standard (no customization) |

Quick mode sets up Spec & Implement with detailed specs and no auto-tests. Write your first spec with `/spec <feature>` whenever you're ready.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate spec-implement
```

## Completion

Spec & Implement is configured. Your Brain now supports structured two-phase development -- plan first, build second.

**Available commands:**
- `/spec <feature>` -- Write a detailed spec for a feature
- `/implement <spec-file>` -- Build a feature from an approved spec
