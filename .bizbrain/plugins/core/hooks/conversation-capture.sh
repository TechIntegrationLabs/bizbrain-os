#!/bin/bash
# Captures conversation content in real-time
BRAIN_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
LIVE_DIR="$BRAIN_DIR/_intake-dump/conversations/_live"
SESSION_FILE="$LIVE_DIR/session-$(date +%Y-%m-%d-%H%M%S).md"

mkdir -p "$LIVE_DIR"

# Append prompt content
echo "---" >> "$SESSION_FILE"
echo "timestamp: $(date -Iseconds)" >> "$SESSION_FILE"
echo "---" >> "$SESSION_FILE"
echo "" >> "$SESSION_FILE"
