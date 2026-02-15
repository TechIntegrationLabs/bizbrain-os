# Setup Module Command

Activate and configure a specific BizBrain module.

## Usage

`/setup-module <module-name>`

## Instructions

1. **Validate module name**
   - Check if `{{BRAIN_PATH}}/.bizbrain/wizard/module-wizards/{argument}.md` exists
   - If not found, list available modules from `.bizbrain/modules/` and ask user to choose

2. **Check if already active**
   - Read `{{BRAIN_PATH}}/.bizbrain/config.json`
   - If module already in `activeModules[]`, offer to:
     - Reconfigure (re-run wizard)
     - Skip (already active)
     - Deactivate

3. **Execute module wizard**
   - Read `.bizbrain/wizard/module-wizards/{module-name}.md`
   - Follow the wizard's interview questions exactly
   - Collect required configuration for this module

4. **Activate the module**
   - Run: `node {{BRAIN_PATH}}/.bizbrain/wizard/generators/module-activator.js {module-name}`
   - This copies module files to appropriate locations
   - Updates `config.json` with module configuration

5. **Update dashboard state**
   - Read current `{{BRAIN_PATH}}/.bizbrain/wizard/state.json`
   - Add module activation timestamp
   - Mark module as active
   - Write updated state back

6. **Confirm activation**
   - List what was installed:
     - Slash commands added
     - Knowledge files available
     - Integrations enabled
     - Folder templates created

## Available Modules

Read from `.bizbrain/capabilities.json` to show current module list.

Common modules:
- `core` - Essential Brain functionality
- `development` - GSD system, specs, bug crushing
- `clients` - Client management
- `partners` - Partner relationships
- `content` - Content factory
- `integrations` - Notion, Slack, Supabase
- `communication` - Communication hub
- `video` - Video generation with Remotion

## Example Output

```
Setting up module: development

✓ Copied 7 commands to .claude/commands/
✓ Copied 4 knowledge files to .claude/knowledge/
✓ Created .planning/ folder structure
✓ Updated config.json

Module active! Try:
  /gsd           - Start GSD workflow
  /spec feature  - Write a feature spec
  /crush bug     - Quick bug fix
```
