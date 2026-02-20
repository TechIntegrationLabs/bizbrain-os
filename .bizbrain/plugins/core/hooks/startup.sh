#!/bin/bash
# BizBrain OS - Startup Hook
# Runs when Claude Code starts in the Brain folder

BRAIN_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
CONFIG="$BRAIN_DIR/config.json"

# Check if setup has been completed
if [ ! -f "$CONFIG" ]; then
  echo "[BizBrain] First run detected. Run /setup to begin."
  exit 0
fi

# Read business name from config
BUSINESS_NAME=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$CONFIG','utf8')).profile.businessName || 'BizBrain')" 2>/dev/null)

echo "[BizBrain] Welcome back! Brain: $BUSINESS_NAME"

# Check for updates
# (compare local VERSION.json with what git knows)
