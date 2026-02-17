<div align="center">

<img src="images/readme-hero.jpg" alt="BizBrain OS - The Context Layer That Teaches AI Your Business" width="800">

<br />

# BizBrain OS

**The context layer that teaches AI your business.**

[![AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://github.com/TechIntegrationLabs/bizbrain-os/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/TechIntegrationLabs/bizbrain-os?style=social)](https://github.com/TechIntegrationLabs/bizbrain-os/stargazers)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)]()
[![Powered by Claude](https://img.shields.io/badge/Powered%20by-Claude%20Code-orange)](https://claude.ai)
[![Works with OpenClaw](https://img.shields.io/badge/Works%20with-OpenClaw-purple)](https://github.com/openclaw)

<br />

**AI is only as useful as what it knows about your business.** Every AI tool has the same limitation: it doesn't know your clients' preferences, your project history, or your workflows. BizBrain OS fixes that permanently.

[Get Started](#quick-install) &bull; [Why Context Matters](#why-context-matters) &bull; [Works with OpenClaw](#works-with-openclaw) &bull; [Modules](#module-catalog) &bull; [Docs](https://github.com/TechIntegrationLabs/bizbrain-os/wiki) &bull; [Discord](https://discord.gg/bizbrain)

</div>

---

## Why Context Matters

Every AI tool you use -- ChatGPT, Claude, OpenClaw, Cursor -- is brilliant at general tasks. But ask about *your* business, and it starts from zero. Every session. Every time.

**The bottleneck isn't AI intelligence. It's AI ignorance about you.**

BizBrain OS solves this by building a structured context layer that captures and compounds your business knowledge:

- **Day 1:** Your AI knows your clients, projects, and basic preferences
- **Month 1:** Historical decisions, resolved issues, and proven approaches are captured
- **Month 6:** AI drafts content in your voice and anticipates client needs
- **Year 2:** A competitor starting now is two years behind. Their context starts from scratch

> Your AI context layer will be the most valuable digital asset your business owns within 5 years. It compounds every day. The businesses that start building now will have an insurmountable advantage.

---

## Quick Install

```bash
git clone https://github.com/TechIntegrationLabs/bizbrain-os.git
cd bizbrain-os
```

**Then, do ONE of the following:**

| Option | How | Best For |
|--------|-----|----------|
| **Double-click `start.html`** | Open the file in your browser from your file explorer | Easiest -- no terminal needed |
| **Run `npm start`** | Type it in your terminal inside the `bizbrain-os` folder | If you already have Node.js installed |

Both options open the same guided setup page. It walks you through everything:

1. **Prerequisite checks** -- Node.js, Git, and Claude Code are verified automatically
2. **Install guides** -- if anything is missing, step-by-step instructions appear instantly
3. **One-click setup prompt** -- a button that copies a comprehensive setup prompt to your clipboard

Paste the prompt into Claude Code and it walks you through a conversational interview to learn your business, configure modules, and launch your personalized Brain.

---

## What is BizBrain OS?

At its core, BizBrain OS is a **structured context layer for AI** -- the knowledge substrate that makes every AI tool smarter about *your* business.

It captures every client interaction, project decision, and business preference into a structured, local-first knowledge system that any AI tool can understand. It replaces the patchwork of Notion databases, spreadsheet trackers, forgotten Slack threads, and scattered docs with a single intelligent system that compounds over time.

**Who it's for:** Solopreneurs, freelancers, agencies, consultancies, and small startups who want AI that actually knows their business context -- not just general knowledge.

**What makes it different:**

1. **Context, not features.** Other tools give you a CRM, a project manager, a content generator. BizBrain OS gives you all of those *and* uses them to build a unified understanding of your business that makes every tool smarter.
2. **It compounds.** Every day you use it, the context layer grows richer. Month 6 is exponentially more valuable than Month 1.
3. **Local-first.** Your business context is your competitive moat. It lives on your machine, not in someone else's cloud.
4. **AI-native.** Not a traditional app with "AI features" bolted on. Every module is built to feed and consume the AI context layer.
5. **Works with OpenClaw.** BizBrain provides the knowledge. OpenClaw provides the hands. Together: an AI employee.

---

## Works with OpenClaw

OpenClaw has taken the AI world by storm -- an autonomous agent that can send messages, execute commands, automate browsers, and take real action. But OpenClaw has a blind spot: **it doesn't know anything about your business.**

BizBrain OS is the missing piece.

<img src="images/ecosystem-diagram.jpg" alt="BizBrain OS + OpenClaw ecosystem: Brain (context) + Hands (action) = AI Employee" width="700">

### Use Cases

| Scenario | BizBrain Knows | OpenClaw Does |
|----------|---------------|---------------|
| **Morning briefing** | Your 3 active projects, deadlines, and client preferences | Drafts priority list, sends status updates, schedules follow-ups |
| **Client onboarding** | Your onboarding workflow, contract templates, intake questions | Sends welcome email, creates project folder, schedules kickoff |
| **Content creation** | Your brand voice, audience, past performance, client stories | Writes blog posts, creates social content, publishes across channels |
| **Invoice follow-up** | Payment history, client communication preferences, overdue amount | Sends personalized reminder via preferred channel, logs interaction |

> BizBrain OS pairs with OpenClaw. It doesn't require it. BizBrain works standalone with Claude Code and any other AI tool.

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

### Context Layer
- **Structured Business Memory** -- Every interaction captured and structured for AI consumption
- **Compounding Knowledge** -- Context grows richer every day, automatically
- **Universal AI Context** -- Feeds context to Claude, OpenClaw, or any LLM
- **Entity Watchdog** -- Mentions in conversation auto-update your records

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
- **Voice-First Setup** -- Speak naturally; AI builds your context layer from conversation
- **Auto-Generated Wiki** -- Personalized knowledge base tailored to your business
- **Conversation Capture** -- Every Claude Code session archived and searchable
- **Content Factory** -- Turn your work into blog posts, social content, presentations

</td>
</tr>
</table>

---

## Module Catalog

BizBrain OS ships with **27 modules** across 7 categories. Core modules activate automatically. Everything else is opt-in. Every module feeds the context layer.

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
 Clone + Start         Copy & Paste          Teach It              Compound
 ─────────────         ────────────          ────────              ────────

  git clone             Dashboard             Claude Code           Context
  npm start     ->      gives you      ->     interviews     ->    grows
                        a setup prompt        your business         richer
                                                                    daily
```

<table>
<tr>
<td align="center" width="25%">
<h3>1. Clone & Open</h3>
<p>Clone the repo and double-click <code>start.html</code> (or run <code>npm start</code>). A guided setup page walks you through everything. No build step, no Docker.</p>
</td>
<td align="center" width="25%">
<h3>2. Copy Setup Prompt</h3>
<p>Click one button on the dashboard to copy a setup prompt. Paste it into Claude Code.</p>
</td>
<td align="center" width="25%">
<h3>3. Teach It Your Business</h3>
<p>Claude interviews you conversationally -- your name, clients, tools, workflows. It configures everything automatically.</p>
</td>
<td align="center" width="25%">
<h3>4. Watch It Compound</h3>
<p>Every interaction, every decision, every conversation gets captured. Your AI context layer grows richer every day -- automatically.</p>
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

# 2. Open the setup page (pick one)
#    OPTION A: Double-click start.html in your file explorer
#    OPTION B: Run "npm start" in your terminal

# 3. The setup page checks your system automatically
#    If anything is missing, it shows you exactly how to install it

# 4. Click "Copy Setup Prompt" on the setup page

# 5. Open Claude Code in the bizbrain-os folder
claude

# 6. Paste the setup prompt into Claude Code
#    It walks you through a conversational interview about your business
#    and configures everything automatically

# 7. Start using your Brain
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

BizBrain OS connects to the tools you already use. Each integration is a module you can activate (or skip). Every integration feeds the context layer.

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
<td align="center" width="12.5%"><b>OpenClaw</b><br/>AI Agent</td>
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
| AI context layer (structured, compounding) | :white_check_mark: | :x: | :x: | :x: | :x: |
| Works with OpenClaw | :white_check_mark: | :x: | :x: | :x: | :x: |
| AI-native (not bolted on) | :white_check_mark: | :x: | :x: | :x: | :x: |
| Compounding context over time | :white_check_mark: | :x: | :x: | :x: | :x: |
| Voice-first onboarding | :white_check_mark: | :x: | :x: | :x: | :x: |
| Local-first (your data, your disk) | :white_check_mark: | :x: | :x: | :x: | :white_check_mark: |
| Zero monthly cost | :white_check_mark: | :x: | :x: | :x: | :white_check_mark: |
| CRM + Project Mgmt + Content + Billing | :white_check_mark: | Partial | Partial | :x: | Manual |
| Auto-captures conversations | :white_check_mark: | :x: | :x: | :x: | :x: |
| Entity auto-detection | :white_check_mark: | :x: | :x: | :x: | :x: |
| Modular (pick only what you need) | :white_check_mark: | :x: | :x: | :x: | :white_check_mark: |
| Updates without breaking config | :white_check_mark: | N/A | N/A | N/A | :x: |
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

If BizBrain OS helps you build your AI context layer, consider giving it a star. It helps others discover the project.

---

## License

[AGPL v3](LICENSE) -- Free and open source. Use it, fork it, build on it. If you modify and distribute it or offer it as a service, share your changes under the same license.

---

<div align="center">

**The context layer that teaches AI your business. Open source. Local-first. Compounding daily.**

**Built by [Tech Integration Labs](https://github.com/TechIntegrationLabs) and the open-source community.**

[Documentation](https://github.com/TechIntegrationLabs/bizbrain-os/wiki) &bull; [Report a Bug](https://github.com/TechIntegrationLabs/bizbrain-os/issues/new?template=bug_report.md) &bull; [Request a Feature](https://github.com/TechIntegrationLabs/bizbrain-os/issues/new?template=feature_request.md) &bull; [Discord](https://discord.gg/bizbrain)

<sub>BizBrain OS is not affiliated with Anthropic. Claude Code is a product of Anthropic, PBC.</sub>

</div>
