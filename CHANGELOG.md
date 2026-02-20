# BizBrain OS Changelog

## [3.0.0] - 2026-02-20

### Major Architectural Redesign

**Plugin Architecture**
- Replaced flat 27-module system with 15 self-contained plugin packages
- Each plugin is a folder with agents, commands, hooks, knowledge, templates, and GUI components
- Plugin Manager (`plugin-manager.js`) handles activate/deactivate/init/migrate/status
- Dynamic sidebar built from `gui-registry.json` — activating a plugin auto-registers its routes
- Plugin states: inactive → installing → active | error | disabled
- Dependency checking prevents activation of plugins with unmet requirements
- Migration path from legacy modules via `plugin-manager.js migrate`

**Simplified Onboarding**
- Stripped 10-phase, 20-45 minute wizard down to 2 questions (name + business name)
- New URL scraping section — paste website, LinkedIn, socials and BizBrain extracts your profile
- `profile-extractor.js` infers businessType, industry, tools, painPoints, brandColors from content
- Setup prompt now targets `plugin-manager.js init` for automatic starter plugin activation
- `npx create-bizbrain` updated to v3.0.0 on npm

**Integrations Page**
- 35+ service integration registry (`integrations-registry.json`)
- Logo grid with category filters, search, grid/list/spreadsheet views
- Credential drawer with setup steps and password-masked input fields
- Conversational credential flow: GUI queues → Claude Code session picks up → walks user through
- CSV import/export for bulk credential management
- Categories: Communication, Social, Development, Productivity, AI, Publishing, CRM, Research, Email

**Background Learning (3 Tiers)**
- Observer (default): Extracts entities, decisions, tools from session transcripts
- Explorer: Adds clipboard polling (30s) and `_intake-dump/` file watching
- Full Context: Adds Screenpipe OCR integration via local API
- Brain Learning dashboard with InsightCard components
- All data stays local — never leaves your machine

**Central State**
- Unified `state.json` tracking plugins, integrations, learning, and profile
- `gui-registry.json` for dynamic sidebar rendering
- `credentials/pending.json` bridges GUI and Claude Code sessions

### 15 Plugins

| Plugin | Key Features |
|--------|-------------|
| Core | Dashboard, intake, integrations, dev-config, knowledge |
| GSD | Roadmap, waves, spec, implement, bug-crusher, diagnose |
| Communications Hub | Inbox, Gmail, Slack, auto-reactions, approval queue |
| Content Engine | RSS, autopilot, pipeline, brand voice, analytics |
| Outreach | Lead pipeline, sequences, campaigns |
| Entity CRM | Clients, partners, vendors, watchdog |
| Workflows | Visual node-based automation builder |
| Presentations | Slidev, slideshow, NotebookLM, PDF export |
| Video Studio | Remotion, motion graphics, YouTube upload |
| Contracts | Generator, clauses, e-signatures, pricing |
| Time Tracking | Auto logging, timesheets, Notion sync |
| Session Archive | Obsidian archival, conversation intake |
| Voice AI | ElevenLabs TTS, clarification queue |
| Image Generation | AI images, budget caps, brand mode |
| Background Learning | Observer, Explorer, Full Context (Screenpipe) |

---

## [1.0.0] - 2026-02-15

### Initial Release
- Modular onboarding wizard with voice-first discovery
- Social profile scraping via Chrome automation
- Dashboard with setup mode and operational mode
- 27 configurable modules across 7 categories
- Module dependency tracking and auto-unlocking
- Per-module setup wizards with Chrome automation
- Auto-generated personalized wiki/guide
- Cross-platform support (Windows + Mac)
- Git-based update system with migrations
- Zero-dependency Node.js dashboard
- Entity management (clients, partners, vendors)
- GSD project management (full + light)
- Timesheet and billing
- Content factory and video studio
- Integration support: GitHub, Netlify, Notion, Slack, Supabase, Stripe, Clerk, Gmail, Vercel
