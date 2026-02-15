# Video Command

Create programmatic videos using Remotion.

## Usage

`/video <video-type> [title]`

Video types: `promo`, `demo`, `tutorial`, `data`, `intro`

## Instructions

1. **Parse video type and title**
   - Extract video type from argument
   - Get title if provided
   - If missing, enter interactive mode

2. **Spawn video-studio agent**

   Use Task tool:
   ```
   subagent_type: "general-purpose"
   prompt: "Read ~/.claude/agents/video-studio.md and create {video-type} video: {title}"
   context: Project context, brand assets, recent content
   ```

3. **Video studio process**

   a. **Interview for video details:**
   ```
   Creating {video-type} video: {title}
   ════════════════════════════════════════════════

   1. Duration?
      - 15 seconds (social short)
      - 30 seconds (promo)
      - 60 seconds (explainer)
      - 2-3 minutes (tutorial)
      - Custom

   2. Visual style?
      - Modern/minimal
      - Bold/energetic
      - Corporate/professional
      - Technical/code-focused
      - Custom

   3. Audio?
      - Background music (select from library)
      - Voiceover (text-to-speech or upload)
      - Sound effects
      - Silent

   4. Branding?
      - Logo: [path or upload]
      - Colors: [brand colors]
      - Fonts: [brand fonts]

   5. Content:
      [Depends on video type - see below]
   ```

   b. **Type-specific content:**

   **Promo video:**
   ```
   Content for promo:
   - Headline: [text]
   - Key features (3-5): [list]
   - Call to action: [text + URL]
   - Screenshots/mockups: [paths]
   ```

   **Demo video:**
   ```
   Content for demo:
   - What to demonstrate: [feature/workflow]
   - Screen recording: [path or record now]
   - Annotations: [highlights, arrows, text]
   - Voiceover script: [text or auto-generate]
   ```

   **Data visualization:**
   ```
   Content for data viz:
   - Data source: [CSV, JSON, or manual input]
   - Chart type: [line, bar, pie, scatter, custom]
   - Animation style: [build, transition, highlight]
   - Labels and annotations: [customize]
   ```

   **Tutorial:**
   ```
   Content for tutorial:
   - Steps: [numbered list]
   - Screen recordings: [paths for each step]
   - Voiceover: [script for each step]
   - Code snippets: [if applicable]
   ```

   c. **Generate Remotion composition:**

   Create in `{{BRAIN_PATH}}/Operations/video-studio/projects/{video-id}/`:
   ```
   src/
   ├── Composition.tsx         (Main video composition)
   ├── scenes/
   │   ├── Intro.tsx
   │   ├── Main.tsx
   │   └── Outro.tsx
   ├── components/
   │   ├── Logo.tsx
   │   ├── Text.tsx
   │   └── Transition.tsx
   ├── assets/
   │   ├── images/
   │   ├── audio/
   │   └── fonts/
   └── remotion.config.ts
   ```

   d. **Preview video:**
   ```
   Starting Remotion Studio...

   → http://localhost:3000

   Preview your video:
   - Adjust timing
   - Modify animations
   - Update text
   - Change colors

   Ready to render? [Y/n]
   ```

   e. **Render video:**
   ```
   Rendering video...

   Format: MP4
   Resolution: 1920x1080
   FPS: 30
   Duration: 30 seconds

   Progress: ████████████████░░░░  80% (frame 720/900)

   Rendering complete!

   Output: Operations/video-studio/projects/{video-id}/out/video.mp4
   Size: 12.5 MB

   Actions:
   1. Preview rendered video
   2. Upload to YouTube (/youtube upload)
   3. Export for social (resize/crop)
   4. Generate thumbnail
   ```

4. **Video templates**

   Offer pre-built templates:
   ```
   Use a template?

   1. Product Launch Promo
   2. Feature Demo (screen recording)
   3. Data Dashboard Flythrough
   4. Code Tutorial
   5. Social Media Teaser
   6. Client Testimonial
   7. Custom (start from scratch)
   ```

5. **Export options**

   After rendering:
   ```
   Export Options:
   ────────────────────────────────────────────────
   [ ] YouTube (1920x1080, high quality)
   [ ] Instagram/TikTok (1080x1920 vertical)
   [ ] Twitter (1280x720, smaller file)
   [ ] LinkedIn (1920x1080, professional)
   [ ] GIF (low res, looping)

   Additional:
   [ ] Generate thumbnail
   [ ] Extract audio
   [ ] Create captions (SRT)
   ```

6. **Track video projects**

   Save to `{{BRAIN_PATH}}/Operations/video-studio/projects.json`:
   ```json
   {
     "video-id": {
       "title": "BuildTrack Promo",
       "type": "promo",
       "duration": 30,
       "created": "2024-01-15T10:00:00Z",
       "rendered": "2024-01-15T10:30:00Z",
       "status": "complete",
       "outputPath": "Operations/video-studio/projects/video-id/out/video.mp4",
       "uploaded": {
         "youtube": "https://youtube.com/watch?v=...",
         "twitter": "https://twitter.com/..."
       }
     }
   }
   ```

7. **Integration with content factory**

   If part of content pipeline:
   - Automatically pull project screenshots
   - Use brand assets from Operations/brand/
   - Generate from product updates
   - Sync with Notion content calendar

## Remotion Features

Leverage Remotion capabilities:
- React components for scenes
- Programmatic animations
- Data-driven content
- Code-based timing
- Reusable templates
- Parametric rendering

## Video Quality

Default settings:
- Resolution: 1920x1080 (Full HD)
- FPS: 30 (or 60 for smooth motion)
- Codec: H.264
- Bitrate: High quality

## Related Commands

- `/youtube` - Upload to YouTube
- `/content` - Content factory integration
- `/slideshow` - Create slide deck instead
