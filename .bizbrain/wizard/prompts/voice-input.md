# Module Setup: Voice Input

> Speak your thoughts and let your Brain transcribe them into actionable text.

## What This Module Does

Voice Input turns your microphone into a Brain input channel:
- Push-to-talk or continuous voice recording from the dashboard
- Automatic transcription to text via browser Speech API
- Voice notes feed directly into conversations or buffer files
- Hands-free brainstorming, note-taking, and task capture

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | *(none)* |
| **Agents** | *(none)* |
| **Commands** | *(none)* |
| **Hooks** | *(none)* |
| **MCPs** | *(none)* |
| **Wiki Sections** | `voice-input` |

Voice Input leverages the existing dashboard voice recorder (`voice.html`) and Chrome Extension for browser access.

## Prerequisites

| Module | Why |
|--------|-----|
| `chrome-extension` | Voice recorder runs in the browser |

## Setup Flow

### Step 1: Verify Chrome Extension

Check that `chrome-extension` module is configured and active via module-activator.js. If not, run Chrome Extension setup first.

### Step 2: Open Voice Recorder

Open the voice recorder page in Chrome:
- Local server: `http://localhost:5555/voice.html`
- Direct file: `file:///[brain-path]/voice.html`

### Step 3: Test Microphone

Ask the user to:
1. Click **Start Recording** in the voice recorder
2. Say a test phrase (e.g., "Testing voice input for my Brain")
3. Click **Stop**

Verify the transcription appeared in `voice-buffer.txt`. If the mic doesn't work, check browser permissions.

### Step 4: Configure Voice Mode

**Q: Which voice mode do you prefer?**
- `Push-to-talk` - Click to start, click to stop (most controlled)
- `Continuous` - Always listening, pauses detect sentence boundaries
- `Hotkey` - Keyboard shortcut to toggle recording

### Step 5: Configure Auto-Start

**Q: Auto-start voice recorder when opening your Brain?**
- `Yes` - Voice recorder opens automatically with the dashboard
- `No` - Start it manually when needed

### Step 6: Configure Recording Storage

**Q: Save audio recordings or just the transcription?**
- `Save recordings` - Keep .webm audio files alongside transcriptions
- `Transcription only` - Discard audio after transcription (saves disk space)

### Step 7: Configure Output Destination

**Q: Where should voice transcriptions go?**
- `Direct to conversation` - Paste transcription into the active Claude Code session
- `Buffer file` - Write to `voice-buffer.txt` for later processing
- `Both` - Buffer file AND available for direct paste

### Step 8: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "voice": {
      "enabled": true,
      "mode": "push-to-talk",
      "hotkey": null,
      "autoStart": false,
      "saveRecordings": false,
      "bufferMode": "both",
      "bufferPath": "voice-buffer.txt",
      "verifiedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 9: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate voice-input
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| mode | `push-to-talk` |
| autoStart | `false` |
| saveRecordings | `false` |
| bufferMode | `both` |

Quick mode still requires the microphone test to pass.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate voice-input
```

## Completion

Voice Input is ready. Open the voice recorder from your dashboard, speak your thoughts, and get automatic transcription.

Your voice flows into your Brain through `voice-buffer.txt` -- perfect for capturing ideas, dictating notes, or hands-free task entry during meetings.

Available voice modes: **push-to-talk**, **continuous**, **hotkey**. Change anytime in `config.json` under `integrations.voice.mode`.
