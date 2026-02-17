# Module Setup: Video Studio

> Create programmatic videos using Remotion -- motion graphics, promos, data visualizations, social content, and animated intros. Describe what you want in natural language and it builds the video.

## What This Module Does

Video Studio brings programmatic video creation into your Brain:
- Create videos by describing them in natural language -- no video editing software needed
- Remotion-powered rendering for pixel-perfect motion graphics and animations
- Promo videos, data visualizations, social content, tutorial demos, and animated intros
- Consistent branding with your colors, fonts, and logo across all videos
- Render to MP4 at 1080p or 4K resolution
- Template library that grows as you create -- reuse and remix previous videos

## What Gets Created

| Type | Items |
|------|-------|
| **Agents** | `remotion-studio` |
| **Commands** | `video` |
| **Knowledge** | `video-generation.md` |

Video projects are organized as:
```
videos/
  [project-name]/
    src/              # Remotion composition source
    public/           # Assets (images, fonts, data)
    out/              # Rendered output
```

## Prerequisites

- **Node.js 18+** -- Required for Remotion's rendering engine. The setup flow will verify this.

## Setup Flow

### Step 1: Explain Video Studio

Video Studio lets you create professional videos by describing what you want. Instead of learning After Effects or Premiere, you tell the remotion-studio agent what to build and it generates a Remotion composition.

Want a promo video for a client project? Describe the key features, pick a style, and render. Need a data visualization that animates your metrics? Feed it the data and describe the look. Social media content with your branding? One command.

Everything renders programmatically, so videos are reproducible and version-controlled.

### Step 2: Check Node.js

Verify that Node.js 18+ is available on the system. Remotion requires it for rendering.

If not found, explain:
- Node.js 18 or higher is required for video rendering
- Install from https://nodejs.org or via a version manager like nvm
- Video Studio can be configured now and will work once Node.js is installed

### Step 3: Output Directory

**Q: Where should rendered videos be saved?**
- `./videos` *(default)* -- A `videos/` folder in your Brain directory
- `Custom path` -- Specify a different location (e.g., a shared drive, project folder)

### Step 4: Default Resolution

**Q: Default video resolution?**
- `1080p` *(recommended)* -- 1920x1080, standard HD. Fast renders, good for most uses.
- `4K` -- 3840x2160, ultra HD. Slower renders, best for presentation screens and high-quality output.

You can override this per-video at render time.

### Step 5: Video Types

**Q: What kinds of videos interest you most?**

Select all that apply (this helps suggest relevant templates):
- `Promo/marketing` -- Product demos, feature highlights, client showcases
- `Data visualizations` -- Animated charts, metrics dashboards, progress reports
- `Social content` -- Short-form clips for LinkedIn, Twitter/X, Instagram
- `Tutorial/demo` -- Walkthroughs, how-to videos, screen recordings with overlays
- `Animated intros` -- Logo animations, channel intros, presentation openers

### Step 6: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "videoStudio": {
      "outputDir": "./videos",
      "defaultResolution": "1080p",
      "videoTypes": ["promo", "social-content"],
      "configuredAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 7: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate video-studio
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| outputDir | `"./videos"` |
| defaultResolution | `"1080p"` |
| videoTypes | All types available |

Quick mode sets up Video Studio with standard output location and 1080p rendering. Create your first video with `/video` whenever you're ready.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate video-studio
```

## Completion

Video Studio is ready. Create professional videos with natural language -- no video editing experience required.

**Available commands:**
- `/video "create a promo for [project]"` -- Generate a video from a description
- `/video` -- Open the video studio dashboard to browse projects and templates
