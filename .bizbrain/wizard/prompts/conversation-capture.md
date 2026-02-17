# Module Setup: Conversation Capture

> Core module - auto-configured during base Brain generation. No user interaction needed.

## What This Module Does

Conversation Capture automatically records your Claude Code sessions:
- Real-time capture of every prompt and response
- Auto-detected topics, projects, and action items
- Conversations stored for reference and intake processing
- Sweeper catches abandoned sessions (>30 min idle)

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | `_intake-dump/conversations/`, `_intake-dump/conversations/_live/`, `_intake-dump/conversations/_archive/` |
| **Hooks** | `conversation-capture` (real-time capture on every prompt) |
| **Agents** | `conversation-intake` |
| **Commands** | `conversation-intake` |

## Prerequisites

None - this is a core module.

## Setup Flow

This module is **auto-configured** during Phase 6 based on the user's conversation capture preference from Phase 5:

- **Always** - capture every Claude Code session everywhere
- **Brain folder only** - only capture when working inside the Brain directory
- **Off** - don't install capture hooks

The base-brain generator handles:
1. Creating the conversation directories
2. Installing the capture hook (if enabled)
3. Deploying the conversation-intake agent and command

## Quick Mode Defaults

- Capture mode: `always`

## Activation

Auto-activated during Phase 6. Status is set to `configured` immediately.

## Completion

Conversation Capture is active. Every Claude Code session will be automatically recorded in `_intake-dump/conversations/`. Use `/conversation-intake` to process and route captured conversations.
