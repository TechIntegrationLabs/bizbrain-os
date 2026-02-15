#!/bin/bash
# Auto-tracks time when Claude Code is active
BRAIN_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
LOG_DIR="$BRAIN_DIR/.bizbrain/logs/timesheet"
DATE=$(date +%Y-%m-%d)
LOG_FILE="$LOG_DIR/$DATE.jsonl"

mkdir -p "$LOG_DIR"

# Log session activity
echo "{\"timestamp\":\"$(date -Iseconds)\",\"event\":\"prompt\",\"project\":\"$(basename $BRAIN_DIR)\"}" >> "$LOG_FILE"
