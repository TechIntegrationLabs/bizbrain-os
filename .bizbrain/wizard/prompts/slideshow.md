# Module Setup: Slideshow Generator

> Create professional presentations from markdown, documents, or plain descriptions. Write your content and get polished slides with your brand colors and logo.

## What This Module Does

Slideshow Generator turns your ideas into presentation-ready slides:
- Generate slide decks from markdown files, documents, or freeform descriptions
- Automatic layout and design using your brand colors, fonts, and logo
- Multiple export formats -- PDF, HTML, PowerPoint
- Consistent slide templates for pitches, reports, project updates, and training
- Smart content splitting that knows when to break content across slides
- Speaker notes generated alongside each slide

## What Gets Created

| Type | Items |
|------|-------|
| **Agents** | `slideshow-generator` |
| **Commands** | `slideshow` |
| **Knowledge** | `slideshow-system.md` |

Presentations are organized as:
```
Content/
  slideshows/
    [presentation-name]/
      slides.md          # Source content
      output/            # Rendered files (PDF, HTML, PPTX)
      assets/            # Images and media used
```

## Prerequisites

None. Slideshow Generator is standalone and works with any Brain configuration.

## Setup Flow

### Step 1: Explain Slideshow Generator

Slideshow Generator takes your content -- whether it's a markdown file, a project brief, meeting notes, or just a topic description -- and builds a polished slide deck.

You don't need to worry about layout, design, or formatting. Describe what each slide should cover, and the generator handles structure, visual hierarchy, and branding. Need a client pitch? A project status update? A training deck? Same command, different content.

### Step 2: Brand Colors

**Q: Are your brand colors configured in your Brain profile?**

Check if `profile.json` or `config.json` has brand colors defined.

- If found: "Using your brand colors: primary [color], accent [color]. Look good?"
- If not found: "No brand colors on file. Let's set them up."
  - **Primary color** -- Main brand color (e.g., `#2563EB`, "blue")
  - **Accent color** -- Secondary color for highlights (e.g., `#F59E0B`, "amber")
  - These will be stored in your Brain config for all modules to use.

### Step 3: Slide Format

**Q: Default slide aspect ratio?**
- `16:9 widescreen` *(standard)* -- Modern default, works on most screens and projectors
- `4:3 classic` -- Traditional format, better for older projectors or printed handouts
- `Custom` -- Specify width and height ratio

### Step 4: Export Format

**Q: Default export format?**
- `PDF` *(recommended)* -- Universal, looks the same everywhere, easy to share
- `HTML` -- Interactive, embeddable, supports animations
- `PowerPoint` -- Editable in PowerPoint/Google Slides for further customization
- `All` -- Generate all three formats every time

You can override this per-presentation.

### Step 5: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "slideshow": {
      "format": "16:9",
      "exportFormat": "pdf",
      "configuredAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 6: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate slideshow
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| format | `"16:9"` |
| exportFormat | `"pdf"` |
| brandColors | Use existing profile colors if available |

Quick mode sets up 16:9 widescreen slides with PDF export. Brand colors are pulled from your profile if available, otherwise slides use a clean default theme.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate slideshow
```

## Completion

Slideshow Generator is ready. Create professional presentations from any content source.

**Available commands:**
- `/slideshow "create slides about [topic]"` -- Generate a presentation from a description
- `/slideshow` -- Open the slideshow dashboard to browse and manage presentations
