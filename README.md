<div align="center">

```
 ____  _     ____            _         ___  ____
|  _ \(_)___| __ ) _ __ __ _(_)_ __   / _ \/ ___|
| |_) | |_  /  _ \| '__/ _` | | '_ \ | | | \___ \
|  _ <| |/ /| |_) | | | (_| | | | | || |_| |___) |
|_| \_\_/___|____/|_|  \__,_|_|_| |_| \___/|____/
```

# BizBrain OS

**Your AI-powered business operating system. Clone. Configure. Conquer.**

[![AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://github.com/TechIntegrationLabs/bizbrain-os/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/TechIntegrationLabs/bizbrain-os?style=social)](https://github.com/TechIntegrationLabs/bizbrain-os/stargazers)
[![npm version](https://img.shields.io/npm/v/create-bizbrain?color=blue)](https://www.npmjs.com/package/create-bizbrain)
[![Discord](https://img.shields.io/discord/1234567890?color=5865F2&label=Discord&logo=discord&logoColor=white)](https://discord.gg/bizbrain)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)]()
[![Powered by Claude](https://img.shields.io/badge/Powered%20by-Claude%20Code-orange)](https://claude.ai)

<br />

**Stop juggling 12 tabs, 5 SaaS subscriptions, and a folder called "stuff-FINAL-v3."**<br />
BizBrain OS turns your local machine into an intelligent business hub that<br />
actually understands how you work.

[Get Started](#quick-install) &bull; [Demo](#demo) &bull; [Modules](#module-catalog) &bull; [Docs](https://github.com/TechIntegrationLabs/bizbrain-os/wiki) &bull; [Discord](https://discord.gg/bizbrain)

</div>

---

## Quick Install

```bash
npx create-bizbrain
```

<details>
<summary><b>Alternative installation methods</b></summary>

**Git clone (recommended for contributors):**
```bash
git clone https://github.com/TechIntegrationLabs/bizbrain-os.git
cd bizbrain-os
```

**One-liner with curl:**
```bash
curl -fsSL https://raw.githubusercontent.com/TechIntegrationLabs/bizbrain-os/main/install.sh | bash
```

</details>

Then open Claude Code in the folder and run:
```bash
/setup
```

That's it. A voice-guided interview learns your business, activates the right modules, and launches your personal dashboard at `http://localhost:5555`.

---

## What is BizBrain OS?

BizBrain OS is a **local-first, AI-native business operating system** powered by [Claude Code](https://claude.ai). It replaces the patchwork of Notion databases, spreadsheet trackers, forgotten Slack threads, and scattered docs with a single, intelligent system that lives on your machine.

**Who it's for:** Solopreneurs, freelancers, agencies, consultancies, and small startups who are tired of paying for 10 different tools that don't talk to each other -- and who want AI that actually knows their business context.

**What makes it different:** BizBrain OS doesn't force you into someone else's workflow. A 5-minute voice interview maps your real business, then activates only the modules you need from a catalog of 27+. Your data never leaves your machine. Updates arrive via `git pull` without breaking your configuration. And because it runs on Claude Code, every module is AI-native from day one -- not a traditional app with "AI features" bolted on.

---

## Demo

<div align="center">

<img src=".github/assets/dashboard-setup.png" alt="BizBrain OS Dashboard - Setup Mode showing module cards, voice onboarding, and system health" width="720" />

<p><i>Dashboard in setup mode -- module cards with one-click activation, system health panel, and voice onboarding.</i></p>

<br />

<img src=".github/assets/dashboard-operational.png" alt="BizBrain OS Dashboard - Operational mode showing active modules, recent activity, and quick actions" width="720" />

<p><i>Dashboard in operational mode -- active modules, recent activity feed, and quick-launch actions.</i></p>

</div>

> **Don't have screenshots yet?** Run `/setup` and see it live. The dashboard launches automatically at [localhost:5555](http://localhost:5555).

---

## Features

<table>
<tr>
<td width="50%" valign="top">

### Setup & Onboarding
- **Voice-First Interview** -- Speak naturally about your business; AI extracts everything
- **Social Profile Scraping** -- Drop a LinkedIn/website URL and auto-import brand colors, logo, bio
- **Smart Module Pre-selection** -- Recommends modules based on your business type
- **Chrome Automation** -- AI-guided credential setup through your browser

### Your Data, Your Machine
- **Local-First Architecture** -- All data stays on disk. No cloud lock-in, ever
- **Git-Based Updates** -- `git pull` brings new modules without touching your config
- **Zero-Dependency Dashboard** -- Pure Node.js server, no frameworks, no build step
- **Cross-Platform** -- Windows, macOS, and Linux

</td>
<td width="50%" valign="top">

### Business Operations
- **27+ Configurable Modules** -- From CRM to content generation to time tracking
- **Entity Management** -- Clients, partners, and vendors with auto-detection
- **GSD Project Management** -- Phases, waves, parallel execution, specs
- **Time Tracking & Billing** -- Automatic session logging, timesheet export
- **Communications Hub** -- Unified inbox across email, Slack, WhatsApp

### AI-Native
- **Auto-Generated Wiki** -- Personalized knowledge base tailored to your business
- **Conversation Capture** -- Every Claude Code session archived and searchable
- **Entity Watchdog** -- Mentions in conversation auto-update your records
- **Content Factory** -- Turn your work into blog posts, social content, presentations

</td>
</tr>
</table>

---

## Module Catalog

BizBrain OS ships with **27 modules** across 7 categories. Core modules activate automatically. Everything else is opt-in.

### Core (Always Active)

| Module | Description |
|--------|-------------|
| **Brain Core** | Central configuration, folder structure, CLAUDE.md generation |
| **Knowledge Base** | Organized, searchable documentation and wiki |
| **Conversation Capture** | Auto-archive every Claude Code session |

### Development & Deployment

| Module | Description |
|--------|-------------|
| **GitHub** | Repo registry, PR management, automated workflows |
| **Supabase** | Multi-project database management and migrations |
| **Stripe** | Payment processing, subscription management |
| **Clerk** | Authentication and user management |
| **Netlify** | Static site and serverless deployment |
| **Vercel** | Next.js and frontend deployment |

### Communication

| Module | Description |
|--------|-------------|
| **Gmail** | Email integration with entity linking |
| **Slack** | Channel monitoring, autonomous responses |
| **Communications Hub** | Unified inbox across all channels with voice profiles |

### Content & Media

| Module | Description |
|--------|-------------|
| **Content Factory** | Auto-generate blogs, social posts, and docs from your work |
| **Slideshow Generator** | AI-powered presentation creation |
| **Video Studio** | Programmatic video creation with Remotion |
| **Automated Digests** | Weekly summaries from all activity sources |

### Business & CRM

| Module | Description |
|--------|-------------|
| **Client Tracking** | Full CRM -- profiles, contracts, action items, history |
| **Partner Tracking** | Strategic partnership and collaboration management |
| **Vendor Tracking** | Supplier relationships and cost tracking |
| **Entity Watchdog** | Auto-detect mentions and update records in real time |

### Project Management

| Module | Description |
|--------|-------------|
| **GSD (Full)** | Structured execution: requirements, roadmaps, phases, wave parallelism |
| **GSD (Light)** | Lightweight task tracking for smaller projects |
| **Timesheet** | Hour tracking, billing, CSV/PDF/Notion export |
| **Spec & Implement** | Feature specification and guided implementation workflow |

### Setup & Automation

| Module | Description |
|--------|-------------|
| **Chrome Extension** | Browser automation for credential setup and scraping |
| **Voice Input** | Speech-to-text for hands-free interaction |
| **Notion Sync** | Bidirectional sync with Notion workspaces |

---

## How It Works

```
 Install              Interview             Configure             Run
 ───────              ─────────             ─────────             ───

  npx                  "Tell me              Pick your             Your AI
  create-              about your     ->     modules       ->     business
  bizbrain     ->      business..."          from the              brain is
                                             dashboard              live
  30 seconds           5 minutes             2 minutes             Forever
```

<table>
<tr>
<td align="center" width="25%">
<h3>1. Install</h3>
<p>One command. Clone the repo, or <code>npx create-bizbrain</code>. No build step, no Docker, no config files to create.</p>
</td>
<td align="center" width="25%">
<h3>2. Voice Interview</h3>
<p>Speak (or type) about your business. AI extracts your name, company, tools, pain points, and brand identity.</p>
</td>
<td align="center" width="25%">
<h3>3. Configure Modules</h3>
<p>A local dashboard shows smart-recommended module cards. Enable what you need with one click. Chrome automation handles credentials.</p>
</td>
<td align="center" width="25%">
<h3>4. Run Your Business</h3>
<p>Your Brain is live. Track clients, manage projects, capture conversations, generate content -- all from Claude Code.</p>
</td>
</tr>
</table>

---

## Quick Start Guide

### Prerequisites

| Requirement | Version | Why |
|-------------|---------|-----|
| [Claude Code](https://claude.ai) | Latest | The AI engine that powers everything |
| [Node.js](https://nodejs.org) | 18+ | Runs the local dashboard server |
| [Git](https://git-scm.com) | Any | For cloning and pulling updates |
| [Chrome](https://google.com/chrome) | Latest | *Optional* -- for voice input and automated credential setup |

### Step-by-Step

```bash
# 1. Clone the repo
git clone https://github.com/TechIntegrationLabs/bizbrain-os.git
cd bizbrain-os

# 2. Open Claude Code in this directory and run:
/setup

# 3. Complete the voice (or text) interview
#    The wizard asks about your business and recommends modules

# 4. Open the dashboard
#    Auto-launches at http://localhost:5555
#    Or manually: node .bizbrain/dashboard/server.js

# 5. Activate modules from the dashboard
#    Click any module card -> follow the guided setup

# 6. Start using your Brain
/help          # See all available commands
/status        # View your Brain's current state
/dashboard     # Reopen the dashboard
```

### After Setup

```bash
# Manage clients
/bb1 entity add-client "Acme Corp"

# Track time
/hours

# Plan a project
/gsd new my-project

# Generate content
/content blog-post "This week's wins"

# Check everything
/status
```

---

## Architecture

BizBrain OS cleanly separates **system files** (updatable) from **your data** (never touched by updates).

```
bizbrain-os/
|
|-- .bizbrain/                  # SYSTEM (git-tracked, auto-updated)
|   |-- modules/                #   Module definitions (27 JSON configs)
|   |   |-- _core/              #     Always-on modules
|   |   |-- github.json         #     Optional modules
|   |   |-- slack.json
|   |   +-- ...
|   |-- dashboard/              #   Local web UI (Node.js + vanilla JS)
|   |-- wizard/                 #   Setup interview & generators
|   |   |-- interview.md        #     Conversation script
|   |   +-- generators/         #     Profile builder, social scraper
|   |-- agents/                 #   AI agent definitions
|   |-- commands/               #   Slash command definitions
|   +-- templates/              #   Entity & project templates
|
|-- config.json                 # YOUR CONFIG (gitignored)
|-- CLAUDE.md                   # YOUR CONTEXT (gitignored, AI-generated)
|-- Clients/                    # YOUR DATA (gitignored)
|-- Partners/
|-- Vendors/
|-- Projects/
|-- Knowledge/
|-- _intake-dump/               # Conversation & file capture
+-- Brand/                      # Logo, colors, assets
```

**Update without fear:**
```bash
git pull origin main   # System files update. Your data and config are untouched.
```

---

## Integrations

BizBrain OS connects to the tools you already use. Each integration is a module you can activate (or skip).

<table>
<tr>
<td align="center" width="12.5%"><b>GitHub</b><br/>Repos & PRs</td>
<td align="center" width="12.5%"><b>Supabase</b><br/>Database</td>
<td align="center" width="12.5%"><b>Stripe</b><br/>Payments</td>
<td align="center" width="12.5%"><b>Clerk</b><br/>Auth</td>
<td align="center" width="12.5%"><b>Notion</b><br/>Wiki Sync</td>
<td align="center" width="12.5%"><b>Slack</b><br/>Messaging</td>
<td align="center" width="12.5%"><b>Gmail</b><br/>Email</td>
<td align="center" width="12.5%"><b>Chrome</b><br/>Automation</td>
</tr>
<tr>
<td align="center" width="12.5%"><b>Netlify</b><br/>Deploy</td>
<td align="center" width="12.5%"><b>Vercel</b><br/>Deploy</td>
<td align="center" width="12.5%"><b>Obsidian</b><br/>Archive</td>
<td align="center" width="12.5%"><b>Remotion</b><br/>Video</td>
<td align="center" width="12.5%"><b>LinkedIn</b><br/>Scraping</td>
<td align="center" width="12.5%"><b>WhatsApp</b><br/>Gateway</td>
<td align="center" width="12.5%"><b>X / Twitter</b><br/>Scraping</td>
<td align="center" width="12.5%"><b>+ More</b><br/>Extensible</td>
</tr>
</table>

> Integrations are credential-aware. Chrome automation walks you through finding API keys so you never have to dig through settings pages yourself.

---

## Comparison

| Feature | BizBrain OS | Notion | Monday | Trello | DIY Scripts |
|:--------|:----------:|:------:|:------:|:------:|:-----------:|
| AI-native (not bolted on) | :white_check_mark: | :x: | :x: | :x: | :x: |
| Voice-first onboarding | :white_check_mark: | :x: | :x: | :x: | :x: |
| Local-first (your data, your disk) | :white_check_mark: | :x: | :x: | :x: | :white_check_mark: |
| Zero monthly cost | :white_check_mark: | :x: | :x: | :x: | :white_check_mark: |
| CRM + Project Mgmt + Content + Billing | :white_check_mark: | Partial | Partial | :x: | Manual |
| Auto-captures conversations | :white_check_mark: | :x: | :x: | :x: | :x: |
| Entity auto-detection | :white_check_mark: | :x: | :x: | :x: | :x: |
| Modular (pick only what you need) | :white_check_mark: | :x: | :x: | :x: | :white_check_mark: |
| Updates without breaking config | :white_check_mark: | N/A | N/A | N/A | :x: |
| Personalized AI wiki | :white_check_mark: | :x: | :x: | :x: | :x: |
| Social profile scraping onboard | :white_check_mark: | :x: | :x: | :x: | :x: |
| Open source | :white_check_mark: | :x: | :x: | :x: | :white_check_mark: |

---

## Contributing

We welcome contributions of all sizes -- from fixing a typo to building an entirely new module.

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/bizbrain-os.git
cd bizbrain-os

# Create a branch
git checkout -b feat/my-awesome-module

# Make changes and submit a PR
```

**Ways to contribute:**

- **Build a module** -- Create a new `.json` definition in `.bizbrain/modules/` and submit a PR. See [Module Schema](.bizbrain/modules/README.md).
- **Improve the wizard** -- Better voice recognition, new business type templates, refined interview flow.
- **Chrome automations** -- Add scraping/setup scripts for new services.
- **Documentation** -- Wiki pages, tutorials, guides.
- **Bug reports** -- Open an [issue](https://github.com/TechIntegrationLabs/bizbrain-os/issues) with reproduction steps.

> **New here?** Look for issues labeled [`good first issue`](https://github.com/TechIntegrationLabs/bizbrain-os/labels/good%20first%20issue) -- they're designed for first-time contributors.

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## Community

<table>
<tr>
<td align="center">
<a href="https://discord.gg/bizbrain"><b>Discord</b></a><br/>
Chat, get help, share setups
</td>
<td align="center">
<a href="https://github.com/TechIntegrationLabs/bizbrain-os/discussions"><b>GitHub Discussions</b></a><br/>
Feature requests, ideas, Q&A
</td>
<td align="center">
<a href="https://x.com/bizbrain_os"><b>X / Twitter</b></a><br/>
Updates and releases
</td>
<td align="center">
<a href="https://github.com/TechIntegrationLabs/bizbrain-os/issues"><b>Issues</b></a><br/>
Bug reports and tracking
</td>
</tr>
</table>

---

## Star History

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=TechIntegrationLabs/bizbrain-os&type=Date)](https://star-history.com/#TechIntegrationLabs/bizbrain-os&Date)

</div>

If BizBrain OS helps you run your business better, consider giving it a star. It helps others discover the project.

---

## License

[AGPL v3](LICENSE) -- Free and open source. Use it, fork it, build on it. If you modify and distribute it or offer it as a service, share your changes under the same license.

---

<div align="center">

**Built by [Tech Integration Labs](https://github.com/TechIntegrationLabs) and the open-source community.**

[Documentation](https://github.com/TechIntegrationLabs/bizbrain-os/wiki) &bull; [Report a Bug](https://github.com/TechIntegrationLabs/bizbrain-os/issues/new?template=bug_report.md) &bull; [Request a Feature](https://github.com/TechIntegrationLabs/bizbrain-os/issues/new?template=feature_request.md) &bull; [Discord](https://discord.gg/bizbrain)

<sub>BizBrain OS is not affiliated with Anthropic. Claude Code is a product of Anthropic, PBC.</sub>

</div>
