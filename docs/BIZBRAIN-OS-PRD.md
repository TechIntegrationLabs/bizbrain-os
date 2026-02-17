# BizBrain OS - Product Requirements Document

> Living PRD for BizBrain OS -- the context layer that teaches AI your business.

---

## Vision

**BizBrain OS is the structured context layer that makes every AI tool smarter about your specific business.**

In a world where AI capabilities are rapidly commoditizing, the differentiator is not the model -- it is the context. The business that has a rich, structured, compounding knowledge layer will extract 10x more value from AI than one starting from scratch every session.

BizBrain OS is the open-source foundation for building that knowledge layer.

---

## Mission

Make it trivially easy for any business -- from a solo freelancer to a 50-person agency -- to build and maintain a structured AI context layer that compounds over time.

---

## Target Users

### Primary: Solo Operators and Small Teams (1-10 people)

| Persona | Description | Key Pain |
|---------|-------------|----------|
| **Solo Freelancer** | Developer, designer, or consultant working alone | Re-explains business context to AI every session |
| **Small Agency Owner** | Runs a 3-10 person service business | Client knowledge scattered across tools |
| **Startup Founder** | Technical founder building a product | No system for capturing decisions and context |
| **Consultancy Principal** | Sells expertise and advice | Cannot leverage past engagement context effectively |

### Secondary: Content Creators and Accountants

| Persona | Description | Key Pain |
|---------|-------------|----------|
| **Content Creator** | YouTuber, blogger, podcaster | Cannot generate content in their voice at scale |
| **Accountant/Bookkeeper** | Manages multiple client accounts | Client financial context fragmented across spreadsheets |
| **CEO/Executive** | Runs a growing company | Wants AI-powered briefings and decision support |

### Why These Users?

1. Small enough that they manage their own tools (no IT department to build custom solutions).
2. Use AI tools daily and feel the "context gap" acutely.
3. Value local-first (their client data is sensitive).
4. Willing to invest 5-10 minutes in setup for compounding returns.

---

## Core Value Proposition

### The Problem

Every AI tool -- ChatGPT, Claude, OpenClaw, Cursor -- starts from zero about your business. Every session. You waste 5-15 minutes per session re-establishing context. Over a year, that is hundreds of hours. Worse, the AI never builds on previous interactions.

### The Solution

A structured, local-first knowledge layer that:

1. **Captures** client interactions, project decisions, and business preferences automatically.
2. **Structures** raw information into AI-consumable context (entities, relationships, history).
3. **Feeds** that context to any AI tool through CLAUDE.md, knowledge files, and conversation capture.
4. **Compounds** daily as every interaction adds to the knowledge base.

### The Moat

Context compounds. A business running BizBrain OS for 6 months has a knowledge layer that a competitor cannot replicate by starting today. This creates an increasing returns dynamic: the more you use it, the more valuable it becomes, the more you want to use it.

---

## Product Architecture

### Design Principles

1. **Local-first.** All data on disk. No cloud dependency. No telemetry.
2. **AI-native.** Every module is built to feed and consume the AI context layer.
3. **Zero-dependency dashboard.** Pure Node.js server, vanilla JS frontend. No frameworks, no build step.
4. **Modular.** Pick what you need. Skip what you do not.
5. **Update-safe.** `git pull` updates system files. User data and config are never touched.
6. **Conversational setup.** No forms. Claude interviews you and builds everything.

### System Boundary

```
bizbrain-os/
|
|-- .bizbrain/              SYSTEM (git-tracked, updatable)
|   |-- modules/            Module definitions (JSON)
|   |-- dashboard/          Web UI
|   |-- wizard/             Setup interview + generators
|   |-- agents/             AI agent definitions
|   |-- commands/           Slash command definitions
|   +-- templates/          Entity and project templates
|
|-- config.json             USER CONFIG (gitignored)
|-- CLAUDE.md               USER CONTEXT (gitignored, AI-generated)
|-- Clients/                USER DATA (gitignored)
|-- Partners/
|-- Vendors/
|-- Projects/
|-- Knowledge/
|-- _intake-dump/           Conversation and file capture
+-- Brand/                  Logo, colors, assets
```

### Module System

Each module is a JSON definition at `.bizbrain/modules/[id].json` with:

- **id** -- Unique identifier
- **category** -- Grouping (core, development, communication, etc.)
- **description** -- What it does
- **dependencies** -- What must be configured first
- **recommendedFor** -- Business types where this module adds value
- **configSchema** -- Settings that need user input
- **generates** -- What gets created (folders, agents, commands, knowledge files)

Modules can be toggled on/off. Each module has a setup prompt at `.bizbrain/wizard/prompts/[id].md` that Claude follows during configuration.

---

## Module Catalog (v1.0)

### Core (3 modules, always active)
- **Brain Core** -- Central configuration, folder structure, CLAUDE.md generation
- **Knowledge Base** -- Organized, searchable documentation
- **Conversation Capture** -- Auto-archive every Claude Code session

### Development & Deployment (6 modules)
- **GitHub** -- Repository management, PR tracking, code workflows
- **Supabase** -- Multi-project database management
- **Stripe** -- Payment processing, subscription management
- **Clerk** -- Authentication and user management
- **Netlify** -- Static site and serverless deployment
- **Vercel** -- Next.js and frontend deployment

### Communication (3 modules)
- **Gmail** -- Email integration with entity linking
- **Slack** -- Channel monitoring, autonomous responses
- **Communications Hub** -- Unified inbox across all channels

### Content & Media (4 modules)
- **Content Factory** -- Auto-generate blogs, social posts, docs from work
- **Slideshow Generator** -- AI-powered presentation creation
- **Video Studio** -- Programmatic video creation with Remotion
- **Automated Digests** -- Weekly/daily activity summaries

### Business & CRM (4 modules)
- **Client Tracking** -- Full CRM with profiles, contracts, action items, history
- **Partner Tracking** -- Strategic partnership management
- **Vendor Tracking** -- Supplier relationship and cost tracking
- **Entity Watchdog** -- Auto-detect mentions, update records in real time

### Project Management (4 modules)
- **GSD (Full)** -- Structured execution with phases, waves, parallel execution
- **GSD (Light)** -- Lightweight task tracking
- **Timesheet** -- Hour tracking, billing, export
- **Spec & Implement** -- Feature specification and guided implementation

### Setup & Automation (3 modules)
- **Chrome Extension** -- Browser automation for credential setup and scraping
- **Voice Input** -- Speech-to-text for hands-free interaction
- **Notion Sync** -- Bidirectional sync with Notion workspaces

**Total: 27 modules across 7 categories.**

---

## Business Type Presets

Different business types get different default module selections during setup:

| Business Type | Default Modules |
|---------------|----------------|
| Solo Freelancer | Client Tracking, Timesheet, GSD Light, Chrome Extension |
| Small Agency | Client Tracking, Partner Tracking, Timesheet, GSD Full, Comms Hub, Entity Watchdog, Chrome Extension |
| Startup | GSD Full, Supabase, GitHub, Stripe, Clerk, Chrome Extension |
| Consultancy | Client Tracking, Timesheet, GSD Light, Comms Hub, Content Factory, Chrome Extension |
| Content Creator | Content Factory, Video Studio, Slideshow, Chrome Extension, Client Tracking |
| Accountant | Client Tracking, Timesheet, Vendor Tracking, Entity Watchdog |
| CEO/Executive | Client Tracking, Partner Tracking, Vendor Tracking, Comms Hub, Automated Digests, Entity Watchdog |

---

## OpenClaw/ClawdBot Integration

### The Model

```
BizBrain OS (Brain)  +  OpenClaw (Hands)  =  AI Employee (Result)
   Knows your              Takes real            Autonomous agent
   business context         action                with context
```

### How It Works

1. BizBrain OS generates a CLAUDE.md context file at the Brain root.
2. When OpenClaw operates within the Brain folder, it automatically inherits all context.
3. Entity tracking ensures OpenClaw knows client preferences before sending messages.
4. Conversation capture ensures every OpenClaw interaction enriches the context layer.

### BizBrain does NOT require OpenClaw. It works standalone with:
- Claude Code (primary)
- Any LLM that can read file context
- The dashboard web UI

---

## Success Metrics

### Adoption (Month 1-3)
- GitHub stars: 500+
- Forks: 50+
- Active installations (npm start telemetry-free, measured by Discord members): 100+

### Engagement (Month 3-6)
- Average modules configured per user: 5+
- Community PRs merged: 10+
- New modules contributed by community: 3+

### Compounding Value (Month 6+)
- Users reporting "cannot go back" to working without it
- Case studies of businesses with 6+ months of context
- Derivative projects building on BizBrain OS

---

## Roadmap

### v1.0 (Launch)
- [x] 27 module definitions with configSchema
- [x] 10-phase setup wizard (master-prompt.md)
- [x] Dashboard with welcome/setup/operational modes
- [x] start.html standalone onboarding
- [x] Tauri v2 desktop app
- [x] All entity templates
- [x] GSD project management system
- [x] Voice input page
- [x] Chrome automation scripts

### v1.1 (Post-Launch)
- [ ] Module Store UI in dashboard (browse, toggle, configure)
- [ ] Module settings panel with per-module configuration
- [ ] Business type presets with one-click module bundles
- [ ] Dashboard analytics (context growth over time)
- [ ] Backup/restore functionality

### v1.2
- [ ] Plugin system for community modules
- [ ] Marketplace for sharing module configurations
- [ ] Team mode (shared Brain with role-based access)
- [ ] Mobile companion app (read-only dashboard)
- [ ] Webhook support for external integrations

### v2.0
- [ ] Multi-Brain support (separate Brains for different businesses)
- [ ] Brain-to-Brain sync (agency shares context with client)
- [ ] AI-powered Brain health score ("your context layer is X% complete")
- [ ] Automated context enrichment (AI periodically improves existing context)

---

## Non-Goals (Explicitly Out of Scope)

- **Cloud hosting.** BizBrain OS is local-first by design. We will not offer a hosted version.
- **Custom LLM.** We leverage existing AI tools (Claude Code, OpenClaw). We do not train models.
- **Enterprise features.** No SSO, no SAML, no SOC 2. This is for small teams.
- **Monetization in v1.** The project is AGPL v3 open source. Revenue comes later (premium modules, support).

---

## Competitive Landscape

| Competitor | What They Do | BizBrain Advantage |
|-----------|-------------|-------------------|
| Notion | Note-taking and databases | BizBrain is structured for AI consumption, not human note-taking |
| Obsidian | Markdown knowledge base | BizBrain includes modules, wizards, entity tracking -- not just files |
| Claude Projects | Document context for Claude | BizBrain is a full system with 27 modules, compounding context, cross-tool support |
| Custom scripts | DIY knowledge management | BizBrain is turnkey -- 5-minute setup vs. weeks of scripting |
| Monday/Trello | Project management | BizBrain is AI-native -- every module feeds the context layer |

**BizBrain OS is uniquely positioned as the only open-source, local-first, AI-native context layer for business.** Nothing else combines structured context, modular business operations, and AI-native architecture in a single system.
