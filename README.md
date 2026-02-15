# BizBrain OS

```
 ____  _     ____            _         ___  ____
|  _ \(_)___| __ ) _ __ __ _(_)_ __   / _ \/ ___|
| |_) | |_  /  _ \| '__/ _` | | '_ \ | | | \___ \
|  _ <| |/ /| |_) | | | (_| | | | | || |_| |___) |
|_| \_\_/___|____/|_|  \__,_|_|_| |_| \___/|____/
```

**Your AI-Powered Business Brain - Clone, Configure, Conquer**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/TechIntegrationLabs/bizbrain-os/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/TechIntegrationLabs/bizbrain-os?style=social)](https://github.com/TechIntegrationLabs/bizbrain-os)

---

## Table of Contents

- [What is BizBrain OS?](#what-is-bizbrain-os)
- [Key Features](#key-features)
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [How It Works](#how-it-works)
- [Module Categories](#module-categories)
- [Dashboard Screenshots](#dashboard-screenshots)
- [Updating](#updating)
- [Contributing](#contributing)
- [License](#license)

---

## What is BizBrain OS?

BizBrain OS is a self-configuring business management system powered by Claude Code. It transforms your local machine into an intelligent business operations hub that learns your workflow, captures conversations, manages clients and projects, and automates repetitive tasks.

Unlike traditional business software, BizBrain OS adapts to you. Clone the repo, run a guided setup wizard, and get a personalized dashboard with exactly the modules you need - nothing more, nothing less.

## Key Features

- **Modular Setup** - Choose only the capabilities you need through an intuitive card-based interface
- **Voice-First Onboarding** - Speak naturally to configure your system (optional keyboard input)
- **Chrome Automation** - Seamless account connections via Claude in Chrome extension
- **Auto-Updating** - Pull latest features and modules without reconfiguring
- **Local Dashboard** - Web-based control center running on localhost
- **Customized Wiki** - AI-generated knowledge base tailored to your business context
- **Zero Cloud Lock-In** - All data lives on your machine, integrates with your existing tools

## Quick Start

1. **Clone the repo**
   ```bash
   git clone https://github.com/TechIntegrationLabs/bizbrain-os.git
   cd bizbrain-os
   ```

2. **Run setup**
   ```bash
   # Open Claude Code in this folder
   /setup
   ```

3. **Configure modules**
   - Launch the dashboard (auto-opens at http://localhost:5555)
   - Browse module cards organized by category
   - Enable modules with one click
   - Follow guided setup for integrations

That's it. Your Business Brain is ready.

## Prerequisites

- **Claude Code** - The AI-powered CLI from Anthropic
- **Node.js 18+** - For running the local dashboard
- **Git** - For cloning and updating
- **Chrome** - With Claude in Chrome extension (for automated account connections)

## How It Works

### 1. Initial Interview

The `/setup` wizard asks about your business through natural conversation:
- Business name, type, and industry
- Your role and communication style
- Tools and services you already use
- How you work (time tracking, project management, etc.)

Speak your answers or type them - your choice.

### 2. Dashboard Generation

Based on your answers, BizBrain OS generates:
- Personalized folder structure
- Customized CLAUDE.md with business context
- Module registry filtered to relevant categories
- Local web dashboard themed with your brand colors

### 3. Module Cards

The dashboard presents modules as interactive cards:

**Core Modules**
- Conversation Capture
- Entity Watchdog
- Session Archiver

**Development Modules**
- GitHub Integration
- MCP Management
- Supabase Projects
- Environment Variables

**Entity Management**
- Client Management
- Partner Management
- Vendor Management

**Project Management**
- GSD (Get Shit Done) System
- Todo Aggregator
- Time Tracking

**Communication**
- Email Inbox
- Slack Integration
- WhatsApp Gateway

**Content**
- Content Factory
- Slideshow Generator
- PDF Creator
- NotebookLM Research

Each card shows:
- What the module does
- Setup requirements
- Current status (not configured, ready, active)
- Quick setup button

### 4. Guided Integration Setup

When you enable a module requiring external accounts:
1. Dashboard shows required credentials
2. Claude in Chrome opens the service's dashboard
3. AI guides you through finding API keys/tokens
4. Credentials stored securely in local vault
5. Module activates automatically

## Module Categories

### Core
- **Conversation Capture** - Auto-archive Claude Code sessions to searchable vault
- **Entity Watchdog** - Track clients, partners, vendors with automatic updates
- **Session Archiver** - Export conversations to Obsidian or Markdown
- **Knowledge Architect** - Manage and index knowledge files

### Development
- **GitHub Integration** - Repo registry, automated workflows, PR management
- **MCP Management** - Profile switching, subprocess delegation
- **Supabase Projects** - Multi-project database management
- **Environment Variables** - Secure credential storage and access
- **Clerk Auth** - User management and authentication

### Entity Management
- **Client Management** - Client profiles, contracts, action items, history
- **Partner Management** - Strategic partnerships and collaboration tracking
- **Vendor Management** - Supplier relationships and payment tracking

### Project Management
- **GSD System** - Structured project execution with phases and waves
- **Todo Aggregator** - Unified task tracking across all sources
- **Time Tracking** - Automatic session logging and timesheet generation
- **Spec Writer** - Detailed feature specifications
- **Bug Crusher** - Automated bug-fixing workflows

### Communication
- **Email Integration** - Gmail inbox with entity linking
- **Slack Integration** - Channel monitoring and autonomous responses
- **WhatsApp Gateway** - Multi-channel AI communication hub
- **Communication Hub** - Unified comms with voice profiles

### Content
- **Content Factory** - Auto-generate content from development activity
- **Slideshow Generator** - AI-powered presentation creation
- **PDF Creator** - Document generation and templating
- **NotebookLM Research** - Research automation and synthesis
- **Remotion Studio** - Programmatic video creation

## Dashboard Screenshots

> Screenshots and demo video coming with v1.1. Run `/setup` to see the dashboard live!

## Updating

Pull the latest features without losing your configuration:

```bash
git pull origin main
```

Your `config.json`, `CLAUDE.md`, and all data folders are gitignored. Updates only affect:
- Module definitions (`.bizbrain/modules/`)
- Dashboard UI (`.bizbrain/dashboard/`)
- Wizard logic (`.bizbrain/wizard/`)
- Documentation

After pulling, restart the dashboard to see new modules.

## Contributing

Contributions welcome! BizBrain OS is designed to be extensible.

**Adding a Module:**
1. Create module definition in `.bizbrain/modules/[category]/`
2. Follow the module schema (see `.bizbrain/modules/README.md`)
3. Add setup automation if it requires integrations
4. Submit PR with module card screenshot

**Improving the Wizard:**
- Voice recognition refinements
- Additional business type templates
- Chrome automation scripts for new services

## License

MIT License - see LICENSE file for details

---

**Built with Claude Code** | [Documentation](https://github.com/TechIntegrationLabs/bizbrain-os/wiki) | [Issues](https://github.com/TechIntegrationLabs/bizbrain-os/issues) | [Discussions](https://github.com/TechIntegrationLabs/bizbrain-os/discussions)
