# Module Setup: Content Factory

> Auto-generate blog posts, social media content, case studies, and documentation from your work. Ship a feature, get a draft announcement. Finish a project, get a case study.

## What This Module Does

Content Factory turns your development work into publishable content:
- Generate blog posts, social media updates, case studies, and newsletters from completed work
- Platform-specific formatting for LinkedIn, Twitter/X, Medium, and custom blogs
- Configurable tone that matches your brand voice
- Optional auto-generation that drafts content when projects complete or features ship
- Content categories and templates for consistent output
- Drafts land in your Brain for review -- nothing publishes without your approval

## What Gets Created

| Type | Items |
|------|-------|
| **Agents** | `content-factory` |
| **Commands** | `content`, `blog-post`, `social-post` |
| **Knowledge** | `content-factory.md` |

Content is organized by type:
```
Content/
  drafts/          # Work in progress
  published/       # Finalized content
  templates/       # Reusable content templates
```

## Prerequisites

None. Content Factory is standalone and works with any project structure.

## Setup Flow

### Step 1: Explain Content Factory

Content Factory watches what you build and helps you talk about it. Finished a client project? It can draft a case study. Shipped a new feature? It can write the release announcement. Published an integration? It can create a LinkedIn post.

Everything starts as a draft. You review, edit, and decide what to publish. The factory handles the first draft so you don't start from a blank page.

### Step 2: Target Platforms

**Q: Which platforms do you publish to?**

Select all that apply:
- `LinkedIn` -- Professional updates, thought leadership, case studies
- `Twitter/X` -- Short-form updates, announcements, threads
- `Medium` -- Long-form articles and tutorials
- `Blog` -- Your own blog or website
- `Newsletter` -- Email newsletters
- `Other` -- Specify custom platforms

Each platform gets optimized formatting -- character limits, hashtag conventions, tone adjustments.

### Step 3: Default Content Tone

**Q: What's your default content tone?**
- `Professional` -- Polished, authoritative, business-appropriate. Good for B2B, consulting, enterprise.
- `Casual` -- Conversational, approachable, personality-forward. Good for personal brands, startups, community.
- `Technical` -- Detailed, precise, code-heavy. Good for developer audiences, open source, tutorials.

This is the default. Individual pieces can use a different tone.

### Step 4: Auto-Generation

**Q: Auto-generate content drafts from completed work?**
- `Yes` -- When a GSD project completes a phase or a feature ships, the factory automatically drafts relevant content (blog post, social update, etc.). Drafts appear in `Content/drafts/` for your review.
- `No` *(recommended to start)* -- Generate content on demand only. Use `/content`, `/blog-post`, or `/social-post` when you're ready to write something.

Auto-generation is powerful but can be noisy. Starting manual lets you get a feel for the output quality before turning it on.

### Step 5: Content Categories

**Q: What types of content do you want to create?**

Defaults (select all that apply, or customize):
- `Blog posts` -- Long-form articles, tutorials, how-tos
- `Social media` -- Short-form updates and announcements
- `Case studies` -- Client success stories and project retrospectives
- `Newsletters` -- Periodic email digests
- `Documentation` -- Technical docs, guides, READMEs
- `Release notes` -- Feature announcements and changelogs

Add custom categories or remove ones you don't need.

### Step 6: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "contentFactory": {
      "platforms": ["linkedin", "blog"],
      "tone": "professional",
      "autoGenerate": false,
      "categories": ["blog-posts", "social-media", "case-studies"],
      "configuredAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 7: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate content-factory
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| platforms | `[]` (none selected) |
| tone | `"professional"` |
| autoGenerate | `false` |
| categories | `["blog-posts", "social-media", "case-studies", "documentation"]` |

Quick mode sets up the factory with professional tone, no auto-generation, and standard content categories. Add platforms and customize categories later in `config.json`.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate content-factory
```

## Completion

Content Factory is ready. Turn your work into publishable content without starting from scratch.

**Available commands:**
- `/content` -- Content dashboard, browse drafts and published pieces
- `/blog-post` -- Generate a blog post from a topic or completed work
- `/social-post` -- Generate a social media update for your connected platforms
