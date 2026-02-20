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

[Get Started](#quick-install) &bull; [Why Context Matters](#why-context-matters) &bull; [Works with OpenClaw](#works-with-openclaw) &bull; [Plugins](#plugin-catalog) &bull; [Docs](https://github.com/TechIntegrationLabs/bizbrain-os/wiki) &bull; [Discord](https://discord.gg/XZCDttmw)

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

**Option A: One command (recommended)**

```bash
npx create-bizbrain
```

**Option B: Clone directly**

```bash
git clone https://github.com/TechIntegrationLabs/bizbrain-os.git
cd bizbrain-os
```

Then open `start.html` in your browser or run `npm start`.

### What Happens

1. **Two questions** -- Your name and your business name. That's it.
2. **Drop your URLs** -- Website, LinkedIn, socials. BizBrain scrapes them to learn about you.
3. **Drop your docs** -- Drag and drop any files (proposals, pitch decks, etc.)
4. **Choose your privacy tier** -- Observer (sessions only), Explorer (+clipboard/files), or Full Context (+screen OCR via Screenpipe)
5. **Paste into Claude Code** -- One setup prompt activates your starter plugins automatically

Under 3 minutes. No 20-question wizard.

---

## What is BizBrain OS?

At its core, BizBrain OS is a **structured context layer for AI** -- the knowledge substrate that makes every AI tool smarter about *your* business.

It captures every client interaction, project decision, and business preference into a structured, local-first knowledge system that any AI tool can understand. It replaces the patchwork of Notion databases, spreadsheet trackers, forgotten Slack threads, and scattered docs with a single intelligent system that compounds over time.

**Who it's for:** Solopreneurs, freelancers, agencies, consultancies, and small startups who want AI that actually knows their business context -- not just general knowledge.

**What makes it different:**

1. **Context, not features.** Other tools give you a CRM, a project manager, a content generator. BizBrain OS gives you all of those *and* uses them to build a unified understanding of your business that makes every tool smarter.
2. **It compounds.** Every day you use it, the context layer grows richer. Month 6 is exponentially more valuable than Month 1.
3. **Local-first.** Your business context is your competitive moat. It lives on your machine, not in someone else's cloud.
4. **AI-native.** Not a traditional app with "AI features" bolted on. Every plugin is built to feed and consume the AI context layer.
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

<p><i>Dashboard in setup mode -- plugin cards with one-click activation, system health panel, and integrations grid.</i></p>

<br />

<img src=".github/assets/dashboard-operational.png" alt="BizBrain OS Dashboard - Operational mode showing active modules, recent activity, and quick actions" width="720" />

<p><i>Dashboard in operational mode -- active plugins, recent activity feed, and quick-launch actions.</i></p>

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
- **Background Learning** -- 3-tier passive context capture (Observer / Explorer / Full Context)

### Your Data, Your Machine
- **Local-First Architecture** -- All data stays on disk. No cloud lock-in, ever
- **Git-Based Updates** -- `git pull` brings new plugins without touching your config
- **Zero-Dependency Dashboard** -- Pure Node.js server, no frameworks, no build step
- **Cross-Platform** -- Windows, macOS, and Linux

</td>
<td width="50%" valign="top">

### Business Operations
- **15 Self-Contained Plugins** -- From CRM to content generation to time tracking
- **35+ Integrations** -- Toggle-on with guided credential setup
- **Entity Management** -- Clients, partners, and vendors with auto-detection
- **GSD Project Management** -- Phases, waves, parallel execution, specs
- **Time Tracking & Billing** -- Automatic session logging, timesheet export
- **Communications Hub** -- Unified inbox across email, Slack, WhatsApp

### AI-Native
- **2-Question Setup** -- Name and business. Everything else inferred from your URLs and docs
- **Auto-Generated Wiki** -- Personalized knowledge base tailored to your business
- **Conversation Capture** -- Every Claude Code session archived and searchable
- **Content Factory** -- Turn your work into blog posts, social content, presentations

</td>
</tr>
</table>

---

## Plugin Catalog

BizBrain OS v3.0 ships with **15 self-contained plugins**. Core activates automatically. Everything else is opt-in based on your business type. Every plugin feeds the context layer.

| Plugin | Description |
|--------|-------------|
| **Core** | Folder structure, CLAUDE.md, intake processing, dashboard, integrations page |
| **GSD** | Structured execution: requirements, roadmaps, phases, wave parallelism, specs, bug-crusher |
| **Communications Hub** | Unified inbox -- email, Slack, auto-reactions, approval queue, voice profiles |
| **Content Engine** | RSS monitoring, autopilot publishing, brand voice, analytics, AI strategy |
| **Outreach** | Lead pipeline, web research, email sequences, social campaigns |
| **Entity CRM** | Client/partner/vendor tracking, entity watchdog, relationship management |
| **Workflows** | Visual node-based automation builder with AI nodes |
| **Presentations** | Slidev decks, slideshow generator, NotebookLM research, PDF export |
| **Video Studio** | Programmatic video via Remotion -- motion graphics, promos, YouTube upload |
| **Contracts** | Contract generator, clause library, e-signatures, pricing calculator |
| **Time Tracking** | Auto session logging, timesheets, Notion sync, billing, usage sentinel |
| **Session Archive** | Archive Claude Code conversations to Obsidian vault |
| **Voice AI** | ElevenLabs TTS, voice clarification queue, speech-to-text |
| **Image Generation** | AI images with budget caps, brand-consistent mode, multi-provider |
| **Background Learning** | 3-tier passive context: Observer, Explorer, Full Context (Screenpipe OCR) |

### Plugin Manager

```bash
# Activate a plugin
node .bizbrain/scripts/plugin-manager.js activate gsd

# Deactivate (data preserved)
node .bizbrain/scripts/plugin-manager.js deactivate video-studio

# See what's active
node .bizbrain/scripts/plugin-manager.js status

# Auto-activate based on your business type
node .bizbrain/scripts/plugin-manager.js init
```

---

## Integrations

BizBrain OS v3.0 includes a **35+ service integration registry** with a dedicated Integrations page. Toggle services on, and Claude Code walks you through credential setup conversationally.

<table>
<tr>
<td align="center" width="12.5%"><b>GitHub</b><br/>Repos & PRs</td>
<td align="center" width="12.5%"><b>Supabase</b><br/>Database</td>
<td align="center" width="12.5%"><b>Stripe</b><br/>Payments</td>
<td align="center" width="12.5%"><b>Clerk</b><br/>Auth</td>
<td align="center" width="12.5%"><b>Notion</b><br/>Wiki Sync</td>
<td align="center" width="12.5%"><b>Slack</b><br/>Messaging</td>
<td align="center" width="12.5%"><b>Gmail</b><br/>Email</td>
<td align="center" width="12.5%"><b>Discord</b><br/>Community</td>
</tr>
<tr>
<td align="center" width="12.5%"><b>OpenAI</b><br/>AI</td>
<td align="center" width="12.5%"><b>Anthropic</b><br/>AI</td>
<td align="center" width="12.5%"><b>ElevenLabs</b><br/>Voice</td>
<td align="center" width="12.5%"><b>X / Twitter</b><br/>Social</td>
<td align="center" width="12.5%"><b>LinkedIn</b><br/>Social</td>
<td align="center" width="12.5%"><b>Bluesky</b><br/>Social</td>
<td align="center" width="12.5%"><b>YouTube</b><br/>Video</td>
<td align="center" width="12.5%"><b>+ 20 more</b><br/>Extensible</td>
</tr>
</table>

**Credential flow:**
1. Toggle an integration ON in the GUI
2. Next Claude Code session, it asks for your credentials conversationally
3. Credentials stored locally, never leave your machine
4. **Or** use CSV import/export for bulk credential setup

---

## How It Works

```
 npx create-bizbrain    Drop URLs & Docs      Choose Privacy        Compound
 ──────────────────     ──────────────         ──────────────        ────────

  2 questions            BizBrain scrapes       Observer /            Context
  name + biz     ->     your sites &     ->    Explorer /     ->     grows
                        infers your profile    Full Context           richer
                                                                     daily
```

<table>
<tr>
<td align="center" width="25%">
<h3>1. Install</h3>
<p>Run <code>npx create-bizbrain</code> or clone the repo and open <code>start.html</code>. Two questions: your name and your business.</p>
</td>
<td align="center" width="25%">
<h3>2. Feed It</h3>
<p>Paste your URLs (website, LinkedIn, socials) and drag-drop docs. BizBrain scrapes and extracts your business profile automatically.</p>
</td>
<td align="center" width="25%">
<h3>3. Choose Privacy</h3>
<p>Observer (default, sessions only), Explorer (+clipboard/files), or Full Context (+Screenpipe screen OCR). All data stays local.</p>
</td>
<td align="center" width="25%">
<h3>4. Watch It Compound</h3>
<p>Every interaction, decision, and conversation is captured. Your AI context layer grows richer every day -- automatically.</p>
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

### Step-by-Step

```bash
# 1. One command install
npx create-bizbrain

# 2. Answer 2 questions (name + business name)

# 3. Drop your URLs and docs on the ingestion page

# 4. Choose your privacy tier (Observer / Explorer / Full Context)

# 5. Click "Build My Brain" — copies a setup prompt

# 6. Open Claude Code in your new brain folder
claude

# 7. Paste the setup prompt
#    Claude activates starter plugins based on your business type
#    and asks what's most important to you right now

# 8. Start using your Brain
/help          # See all available commands
/status        # View your Brain's current state
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

# Manage plugins
node .bizbrain/scripts/plugin-manager.js status
```

---

## Architecture

BizBrain OS v3.0 uses a **self-contained plugin architecture**. Each plugin is a folder with its own agents, commands, hooks, knowledge, and GUI components.

```
bizbrain-os/
|
|-- .bizbrain/                  # SYSTEM (git-tracked, auto-updated)
|   |-- plugins/                #   15 self-contained plugin packages
|   |   |-- core/               #     Always-on (dashboard, intake, integrations)
|   |   |   |-- plugin.json     #       Manifest with dependencies & provides
|   |   |   |-- agents/         #       AI agent definitions
|   |   |   |-- commands/       #       Slash commands
|   |   |   |-- hooks/          #       Session hooks
|   |   |   |-- knowledge/      #       Documentation
|   |   |   +-- gui/            #       React components
|   |   |-- gsd/                #     Project execution
|   |   |-- comms-hub/          #     Communications
|   |   |-- content-engine/     #     Content & publishing
|   |   |-- screenpipe/         #     Background learning (3 tiers)
|   |   +-- ...                 #     11 more plugins
|   |
|   |-- scripts/                #   Plugin manager & utilities
|   |   |-- plugin-manager.js   #     Activate / deactivate / init / migrate
|   |   +-- init.js             #     Minimal startup
|   |
|   |-- integrations-registry.json  # 35+ service definitions
|   |-- state.json              #   Central state (plugins, integrations, learning)
|   |-- gui-registry.json       #   Dynamic sidebar routes
|   +-- credentials/            #   Local credential storage
|
|-- config.json                 # YOUR CONFIG (gitignored)
|-- CLAUDE.md                   # YOUR CONTEXT (gitignored, AI-generated)
|-- Clients/                    # YOUR DATA (gitignored)
|-- Partners/
|-- Projects/
|-- Knowledge/
|-- _intake-dump/               # File & URL ingestion
+-- start.html                  # Setup page with privacy tier selector
```

**Update without fear:**
```bash
git pull origin main   # System files update. Your data and config are untouched.
```

---

## Background Learning

BizBrain OS passively learns about your business at 3 privacy tiers:

| Tier | What It Watches | Extra Install |
|------|----------------|---------------|
| **Observer** (default) | Claude Code sessions only | None |
| **Explorer** | + clipboard, file changes in Brain | None |
| **Full Context** | + entire screen via Screenpipe OCR | One-click Screenpipe install |

Insights appear on your Brain Learning dashboard:
```
Your Brain noticed:
- "You were researching Firecrawl — add as integration?"
- "New PDF in _intake-dump/ — extract terms?"
[Dismiss All] [Review]
```

---

## Comparison

| Feature | BizBrain OS | Notion | Monday | Trello | DIY Scripts |
|:--------|:----------:|:------:|:------:|:------:|:-----------:|
| AI context layer (structured, compounding) | :white_check_mark: | :x: | :x: | :x: | :x: |
| Plugin architecture (15 self-contained packages) | :white_check_mark: | :x: | :x: | :x: | :x: |
| Background learning (3 privacy tiers) | :white_check_mark: | :x: | :x: | :x: | :x: |
| 35+ integrations with guided credential setup | :white_check_mark: | :x: | :x: | :x: | :x: |
| Works with OpenClaw | :white_check_mark: | :x: | :x: | :x: | :x: |
| 2-question setup (infers everything else) | :white_check_mark: | :x: | :x: | :x: | :x: |
| Local-first (your data, your disk) | :white_check_mark: | :x: | :x: | :x: | :white_check_mark: |
| Zero monthly cost | :white_check_mark: | :x: | :x: | :x: | :white_check_mark: |
| CRM + Project Mgmt + Content + Billing | :white_check_mark: | Partial | Partial | :x: | Manual |
| Auto-captures conversations | :white_check_mark: | :x: | :x: | :x: | :x: |
| Open source | :white_check_mark: | :x: | :x: | :x: | :white_check_mark: |

---

## Contributing

We welcome contributions of all sizes -- from fixing a typo to building an entirely new plugin.

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/bizbrain-os.git
cd bizbrain-os

# Create a branch
git checkout -b feat/my-awesome-plugin
```

**Ways to contribute:**

- **Build a plugin** -- Create a new folder in `.bizbrain/plugins/` with a `plugin.json` manifest and submit a PR.
- **Add an integration** -- Add a service definition to `integrations-registry.json`.
- **Improve onboarding** -- Better URL scraping, new business type templates, profile detection.
- **Documentation** -- Wiki pages, tutorials, guides.
- **Bug reports** -- Open an [issue](https://github.com/TechIntegrationLabs/bizbrain-os/issues) with reproduction steps.

> **New here?** Look for issues labeled [`good first issue`](https://github.com/TechIntegrationLabs/bizbrain-os/labels/good%20first%20issue) -- they're designed for first-time contributors.

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## Community

<table>
<tr>
<td align="center">
<a href="https://discord.gg/XZCDttmw"><b>Discord</b></a><br/>
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

[Documentation](https://github.com/TechIntegrationLabs/bizbrain-os/wiki) &bull; [Report a Bug](https://github.com/TechIntegrationLabs/bizbrain-os/issues/new?template=bug_report.md) &bull; [Request a Feature](https://github.com/TechIntegrationLabs/bizbrain-os/issues/new?template=feature_request.md) &bull; [Discord](https://discord.gg/XZCDttmw)

<sub>BizBrain OS is not affiliated with Anthropic. Claude Code is a product of Anthropic, PBC.</sub>

</div>
