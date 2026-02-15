# Spec Command

Create a detailed feature specification before implementation.

## Usage

`/spec <feature-name>`

## Instructions

1. **Parse feature name**
   - Extract feature identifier
   - Create spec filename: `specs/{feature-name}.md`

2. **Check for existing spec**
   - Look in `.planning/specs/`
   - If exists, offer to view, update, or recreate

3. **Spawn spec-writer agent**

   Use Task tool to spawn dedicated spec-writer:
   ```
   subagent_type: "general-purpose"
   prompt: "Read ~/.claude/agents/spec-writer.md and create spec for: {feature-name}"
   context: Current project files, requirements, existing specs
   ```

4. **Spec-writer process**

   The agent will:

   a. **Gather context:**
   - Read project README, architecture docs
   - Review existing code for patterns
   - Check requirements.json for related items
   - Look at similar features already implemented

   b. **Interview user:**
   ```
   Creating spec for: {feature-name}

   1. What problem does this feature solve?
   2. Who are the users of this feature?
   3. What are the main use cases?
   4. What are edge cases or error scenarios?
   5. What existing features does this interact with?
   6. What are the performance/scale requirements?
   ```

   c. **Draft specification:**
   ```markdown
   # Feature Spec: {Feature Name}

   **Status:** Draft | Review | Approved | Implemented
   **Author:** Claude Code
   **Date:** 2024-01-15
   **Phase:** Phase 2

   ## Overview
   Brief description of the feature and its value.

   ## Problem Statement
   What problem are we solving? Why is this needed?

   ## User Stories
   - As a [user type], I want to [action] so that [benefit]
   - As a [user type], I want to [action] so that [benefit]

   ## Functional Requirements
   1. System must [requirement]
   2. System must [requirement]
   3. System should [optional requirement]

   ## Technical Design

   ### Architecture
   - Component structure
   - Data flow
   - Integration points

   ### Database Schema
   ```sql
   -- New tables or modifications
   ```

   ### API Endpoints
   ```
   POST /api/feature
   GET /api/feature/:id
   ```

   ### Frontend Components
   - Component hierarchy
   - State management
   - Routing

   ## Implementation Plan

   ### Phase 1: Foundation
   - Task 1: [description]
   - Task 2: [description]

   ### Phase 2: Core Functionality
   - Task 3: [description]
   - Task 4: [description]

   ### Phase 3: Polish
   - Task 5: [description]

   ## Testing Strategy
   - Unit tests for [components]
   - Integration tests for [flows]
   - E2E tests for [scenarios]

   ## Acceptance Criteria
   - [ ] Criterion 1
   - [ ] Criterion 2
   - [ ] All tests passing
   - [ ] Documentation complete

   ## Edge Cases & Error Handling
   - Scenario 1: [handling]
   - Scenario 2: [handling]

   ## Security Considerations
   - Authentication/authorization
   - Data validation
   - Rate limiting

   ## Performance Requirements
   - Response time: < 500ms
   - Concurrent users: 1000+
   - Data limits: [limits]

   ## Dependencies
   - Existing features: [list]
   - External services: [list]
   - New libraries needed: [list]

   ## Risks & Mitigations
   - Risk 1: [description] → Mitigation: [approach]
   - Risk 2: [description] → Mitigation: [approach]

   ## Open Questions
   - [ ] Question 1?
   - [ ] Question 2?

   ## References
   - Related specs: [links]
   - Design docs: [links]
   - External docs: [links]
   ```

5. **Review and approval**

   Present spec to user:
   ```
   Spec created: .planning/specs/{feature-name}.md

   Review the specification and confirm:
   1. Does this capture the requirements?
   2. Is anything missing?
   3. Are there concerns about the approach?

   Actions:
   - /approve - Mark as approved, ready for implementation
   - /revise - Make changes to the spec
   - /implement - Proceed with implementation
   ```

6. **Once approved:**
   - Update spec status to "Approved"
   - Add to project backlog or current phase plan
   - Link spec to GSD tasks if relevant
   - Create tracking issue in `.planning/specs/tracking.json`

7. **Link to implementation**
   - When ready: `/implement {feature-name}`
   - This spawns implement-agent with the approved spec

## Spec Quality Standards

Specs must have:
- Clear problem statement
- Specific acceptance criteria
- Technical design details
- Testing strategy
- Error handling approach
- Performance requirements
- Security considerations

## Spec Lifecycle

1. Draft → Write initial spec
2. Review → User reviews and approves
3. Approved → Ready for implementation
4. Implemented → Code complete
5. Verified → Tests passing, deployed
