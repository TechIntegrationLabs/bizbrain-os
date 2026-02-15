# Contributing to BizBrain OS

Thank you for your interest in contributing! BizBrain OS is built to help people run their businesses more effectively with AI, and contributions of all kinds are welcome.

## Ways to Contribute

- **Report bugs** - Open a [GitHub Issue](https://github.com/TechIntegrationLabs/bizbrain-os/issues)
- **Suggest features** - Open a feature request issue
- **Create modules** - Build new integration modules
- **Improve docs** - Fix typos, add examples, improve clarity
- **Share templates** - Entity templates for specific industries

## Development Setup

```bash
# Clone the repo
git clone https://github.com/TechIntegrationLabs/bizbrain-os.git
cd bizbrain-os

# No dependencies to install! Zero npm packages.
# Just make sure you have Node.js 18+ installed.

# Start the dashboard for testing
npm start
```

## Project Structure

```
bizbrain-os/
├── .bizbrain/           # System core (this is what you'll work on)
│   ├── agents/          # Claude Code agent prompts
│   ├── commands/        # Slash command definitions
│   ├── dashboard/       # Node.js dashboard (zero deps)
│   ├── hooks/           # Automation hooks (.sh + .ps1)
│   ├── knowledge/       # Documentation files
│   ├── lib/             # Reusable patterns
│   ├── modules/         # Module JSON definitions
│   ├── scripts/         # System scripts
│   ├── templates/       # Entity and project templates
│   └── wizard/          # Onboarding system
├── _intake-dump/        # Intake folder structure
├── README.md
├── package.json
└── setup.sh / setup.ps1
```

## Creating a New Module

Modules are the core extension point. To add a new module:

### 1. Create the module definition

Add a JSON file to `.bizbrain/modules/`:

```json
{
  "id": "my-module",
  "name": "My Module",
  "category": "integration",
  "description": "What this module does.",
  "estimatedMinutes": 3,
  "dependencies": [],
  "chromeAutomation": false,
  "manualFallback": true,
  "generates": {
    "agents": ["my-agent"],
    "commands": ["my-command"],
    "knowledge": ["my-docs.md"],
    "wikiSections": ["my-module-guide"]
  },
  "configSchema": {
    "apiKey": { "type": "string", "required": true }
  },
  "recommendedFor": ["small-agency", "startup"]
}
```

### 2. Create the module wizard

Add a markdown file to `.bizbrain/wizard/module-wizards/my-module.md` with the Claude Code prompt that guides users through setup.

### 3. Create supporting files

- Agent prompt in `.bizbrain/agents/`
- Command(s) in `.bizbrain/commands/`
- Knowledge doc in `.bizbrain/knowledge/systems/`

### 4. Test the flow

Run `/setup-module my-module` in Claude Code to test the wizard.

## Code Standards

- **Zero npm dependencies** for the dashboard - use only Node.js built-in modules
- **Cross-platform** - every script needs both `.sh` (bash) and `.ps1` (PowerShell) versions
- **Template variables** - use `{{BUSINESS_NAME}}`, `{{USER_NAME}}`, `{{BRAIN_PATH}}` in agents/commands
- **No hardcoded paths** - everything should be relative or use config values
- **No personal data** in examples - use generic names (Acme Corp, Jane, ProjectAlpha)

## Pull Request Process

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-module`)
3. Make your changes
4. Ensure no personal data or credentials in your code
5. Test on both Windows and Mac if possible
6. Submit a PR with a clear description

### PR Checklist

- [ ] No hardcoded paths or personal information
- [ ] Cross-platform scripts (both .sh and .ps1)
- [ ] Module JSON definition follows the schema
- [ ] Wiki section template included
- [ ] Tested the setup wizard flow

## Questions?

Open a [Discussion](https://github.com/TechIntegrationLabs/bizbrain-os/discussions) on GitHub.
