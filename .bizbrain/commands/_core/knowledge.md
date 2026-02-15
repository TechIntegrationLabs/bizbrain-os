# Knowledge Command

Load Brain knowledge documentation on a specific topic.

## Usage

`/knowledge <topic-path>`

## Instructions

1. **Parse topic path**
   - Format: `category/filename` (e.g., `systems/gsd-system`)
   - Or just filename: `gsd-system`

2. **Search for knowledge file**
   - First check: `{{BRAIN_PATH}}/.bizbrain/knowledge/{topic-path}.md`
   - Then check: `~/.claude/knowledge/{topic-path}.md`
   - If not found, search all knowledge files for partial match

3. **If found:**
   - Read the complete file
   - Display it to context
   - Confirm what was loaded
   - Suggest related topics (if links present in file)

4. **If not found:**
   - List available knowledge files from:
     - `.bizbrain/knowledge/systems/`
     - `.bizbrain/knowledge/operations/`
     - `.bizbrain/knowledge/reference/`
   - Ask user to choose or refine search

5. **Smart suggestions**
   - If user context suggests a topic, proactively offer to load it
   - Example: User mentions "clients" → suggest `/knowledge systems/entity-system`
   - Example: User asks about GSD → suggest `/knowledge systems/gsd-system`

## Common Topics

**Systems:**
- `systems/folder-structure` - Brain organization
- `systems/entity-system` - Clients, partners, vendors
- `systems/entity-watchdog` - Auto-detection rules
- `systems/gsd-system` - Get Shit Done workflow
- `systems/intake-system` - File processing pipeline
- `systems/timesheet-system` - Time tracking
- `systems/content-factory` - Content generation
- `systems/communication-hub` - Unified communications
- `systems/spec-system` - Spec-driven development

**Operations:**
- `operations/mcp-configs` - MCP management
- `operations/dev-config-system` - Credential vault

**Reference:**
- `reference/commands-reference` - All commands
- `reference/INDEX` - Knowledge index

## Example Output

```
Loaded: systems/gsd-system

GSD (Get Shit Done) System
===========================
[Full documentation content displayed]

Related topics:
  /knowledge systems/spec-system
  /knowledge reference/commands-reference
```

## Template Variables

- `{{BRAIN_PATH}}` - Brain folder location
- `{{BUSINESS_NAME}}` - Used in knowledge files
- `{{USER_NAME}}` - Used in knowledge files
