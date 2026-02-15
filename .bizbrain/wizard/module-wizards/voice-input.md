# Module Wizard: Voice Input

> This prompt guides Claude Code through setting up the Voice Input module.

## What This Module Does

Voice Input lets you speak to your Brain instead of typing. Perfect for:
- Rambling about ideas while they're fresh
- Dictating meeting notes and action items
- Hands-free operation while multitasking
- Faster input for long-form content

## Prerequisites

- Chrome Extension module must be configured (dependency)
- A working microphone

## Setup Flow

### Step 1: Check Prerequisites

Verify Chrome Extension is configured:
```bash
node .bizbrain/wizard/generators/module-activator.js check voice-input
```

If Chrome Extension is not configured:
"Voice Input needs the Chrome Extension first. Would you like to set that up now?"
If yes, run the chrome-extension wizard first.

### Step 2: Open Voice Recorder

1. Open the voice recorder page in Chrome:
   ```
   Navigate to: file://<brain-root>/.bizbrain/dashboard/public/voice.html
   ```
   Or if the dashboard is running: `http://localhost:5555/voice.html`

2. Tell the user:
   "I've opened the voice recorder in Chrome. You should see a microphone button."

### Step 3: Test Microphone

Guide the user:
"Let's test your microphone:
1. Click the 'Start Recording' button in Chrome
2. Say something like 'Testing, one two three'
3. Click 'Stop Recording'

I'll check if the transcription came through..."

Watch for content appearing in `.bizbrain/wizard/voice-buffer.txt`

If it works: "I can hear you! Your voice was transcribed as: '[text]'"
If not:
- Check browser microphone permissions
- Suggest checking system audio settings
- Offer to use manual typing as fallback

### Step 4: Configure Voice Mode

Ask:
"How would you like voice input to work?

1. **Push-to-talk** - Click to start/stop recording (more control)
2. **Continuous** - Always listening, auto-detects when you pause (hands-free)
3. **Hotkey** - Use a keyboard shortcut to toggle (best of both)

Which mode?"

Also ask:
- "Should voice input auto-start when you open your Brain?" [Yes / No]
- "Should I save voice recordings for reference, or just the transcription?" [Save recordings / Transcription only]

### Step 5: Configure Buffer Settings

Ask:
"Where should voice input go?

1. **Direct to conversation** - Your words appear as if you typed them
2. **Buffer file** - Collected in a file that gets processed (good for brainstorming)
3. **Both** - Direct input + saved to buffer

Recommended: Both"

### Step 6: Save Configuration

Update config.json:
```json
{
  "integrations": {
    "voice": {
      "enabled": true,
      "mode": "push-to-talk|continuous|hotkey",
      "hotkey": "ctrl+shift+v",
      "autoStart": false,
      "saveRecordings": false,
      "bufferMode": "both",
      "bufferPath": ".bizbrain/wizard/voice-buffer.txt",
      "verifiedAt": "<timestamp>"
    }
  }
}
```

### Step 7: Activate Module

```bash
node .bizbrain/wizard/generators/module-activator.js activate voice-input
```

### Step 8: Completion

"Voice input is ready! You can now:
- Use the voice recorder at http://localhost:5555/voice.html
- Speak your thoughts and I'll transcribe them automatically
- Use voice during any BizBrain conversation

Try it out: say 'Hey Brain, what's on my todo list?' and I'll respond!"
