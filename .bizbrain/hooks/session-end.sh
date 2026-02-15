#!/bin/bash
# BizBrain OS - Session End Hook
# Captures conversation summary when Claude Code session ends

BRAIN_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
CONV_DIR="$BRAIN_DIR/_intake-dump/conversations"
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H%M%S)

# Create conversation capture file
# (The actual content comes from Claude Code's session data)
echo "Session ended at $(date)" >> "$CONV_DIR/_live/session-${DATE}-${TIME}.md"
