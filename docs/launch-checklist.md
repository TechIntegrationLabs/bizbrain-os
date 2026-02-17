# BizBrain OS - Launch Checklist

> Pre-launch, launch day, and post-launch tasks.

---

## Pre-Launch (Before Announcement)

### Repository
- [x] Clean git history (no personal data, API keys, or secrets)
- [x] AGPL v3 license in place
- [x] README polished with context layer positioning and OpenClaw companion angle
- [x] CONTRIBUTING.md with clear guidelines
- [x] SECURITY.md with vulnerability reporting process
- [x] Issue templates (bug report, feature request)
- [x] Pull request template
- [x] CLA (Contributor License Agreement) in place
- [x] .gitignore covers user data (config.json, Clients/, Projects/, etc.)
- [x] config.template.json as example (not real config)

### Product
- [x] Setup wizard (master-prompt.md) -- 10-phase guided interview
- [x] All 27 module JSON definitions with configSchema
- [x] All 27 module setup prompts in wizard/prompts/
- [x] start.html standalone onboarding with prerequisite checks
- [x] Dashboard (index.html + app.js + style.css) with welcome/setup/operational modes
- [x] Voice input page (voice.html)
- [x] Wiki page (wiki.html)
- [x] Server (server.js) with all API endpoints
- [x] Tauri v2 desktop app build configuration
- [x] Chrome automation scripts for service setup
- [x] Entity templates (client, partner, vendor, project)
- [x] Agent definitions (13 agents across core, dev, content, comms, integrations)
- [x] Command definitions (setup, help, dashboard, GSD, spec, etc.)
- [x] GSD system (orchestrator, executor, plan, roadmap, requirements)
- [x] Base brain generator and module activator scripts
- [ ] Demo screenshots for README (.github/assets/)
- [ ] Demo GIF or video for social media

### Content
- [x] Launch content document (bizbrain-launch-content.md)
- [x] Twitter/X thread copy
- [x] LinkedIn post copy
- [x] Reddit post copy
- [x] 90-second video script
- [x] Landing page headline variants
- [ ] Blog post: "Why Your AI Context Layer is Your Most Valuable Asset"
- [ ] Blog post: "BizBrain OS + OpenClaw: Building Your First AI Employee"

### Community
- [ ] Discord server created with channels (#general, #setup-help, #module-ideas, #showcase)
- [ ] X/Twitter account (@bizbrain_os) set up
- [ ] FUNDING.yml configured (GitHub Sponsors)
- [ ] "good first issue" labels on 3-5 starter issues

---

## Launch Day

### Morning
- [ ] Final `git push` with all polished content
- [ ] Create GitHub Release v1.0.0 with changelog
- [ ] Post Twitter/X launch thread
- [ ] Post LinkedIn announcement
- [ ] Post to r/ClaudeAI
- [ ] Post to r/SideProject
- [ ] Post to r/Entrepreneur
- [ ] Post to Hacker News (Show HN)

### Afternoon
- [ ] Monitor GitHub issues and discussions
- [ ] Respond to comments on all platforms
- [ ] Share in relevant Discord communities (Claude Code, OpenClaw)
- [ ] Cross-post to relevant Slack communities

### Evening
- [ ] Review first-day metrics (stars, clones, forks, issues)
- [ ] Thank early contributors and star-givers
- [ ] Note any common setup issues for FAQ

---

## Launch Week

### Day 2
- [ ] Follow-up tweet with demo GIF/video
- [ ] Respond to all GitHub issues opened on Day 1
- [ ] Write "Lessons from Launch Day" thread if relevant

### Day 3
- [ ] Post "How it works" deep-dive thread
- [ ] Publish blog post #1 ("Why Your AI Context Layer...")
- [ ] Engage with any blog/newsletter mentions

### Day 4
- [ ] Post OpenClaw companion angle content
- [ ] Reach out to AI YouTubers/creators for potential reviews

### Day 5
- [ ] Share user testimonials/screenshots (if available)
- [ ] Post "Module spotlight" content (highlight 1-2 interesting modules)

### Day 6-7
- [ ] Compile week 1 metrics
- [ ] Plan week 2 content based on what resonated
- [ ] Publish blog post #2 ("BizBrain + OpenClaw...")
- [ ] Create first "good first issue" tasks from community feedback

---

## Post-Launch (Ongoing)

### Weekly
- [ ] Respond to all issues within 24 hours
- [ ] Merge community PRs with review
- [ ] Share 1-2 social posts per week
- [ ] Monitor Discord for common questions -> add to FAQ/wiki

### Monthly
- [ ] Release changelog with new features
- [ ] Module spotlight post
- [ ] User story/showcase (if available)
- [ ] Review and update positioning based on user feedback

### Quarterly
- [ ] Major feature release
- [ ] Review competitive landscape
- [ ] Community survey for roadmap input
