# Setup Command

Initialize BizBrain OS for the first time or reconfigure existing installation.

## Instructions

1. **Check for existing configuration**
   - Read `{{BRAIN_PATH}}/.bizbrain/config.json`
   - If exists, the Brain is already set up

2. **If already configured:**
   - Present three options:
     1. **Re-run full interview** - Start setup wizard from scratch
     2. **Open dashboard** - Launch the configuration dashboard
     3. **Show current configuration** - Display current settings
   - Wait for user choice

3. **If not configured (first-time setup):**
   - Read `{{BRAIN_PATH}}/.bizbrain/wizard/interview.md`
   - Execute the initial setup interview exactly as written
   - Collect all required information:
     - Business name
     - User name
     - Brain location preference
     - Initial modules to activate
   - Generate `config.json` with collected data
   - Run activation for selected modules
   - Show welcome message with next steps

4. **Post-setup actions:**
   - Create necessary folders from templates
   - Copy activated module files to `.claude/` directories
   - Display quick start guide
   - Suggest running `/status` to verify setup

## Template Variables

- `{{BRAIN_PATH}}` - Absolute path to Brain folder
- `{{BUSINESS_NAME}}` - Business name from config
- `{{USER_NAME}}` - User's name from config

## Example Output

```
✓ BizBrain OS configured successfully!

Business: Acme Corp
Location: ~/Documents/AcmeBrain
Active modules: core, development, clients

Next steps:
  /status     - View Brain status
  /dashboard  - Open configuration dashboard
  /help       - List all available commands
```
