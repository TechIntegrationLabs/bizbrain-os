#!/usr/bin/env bash
# Hook: session-end-learn
# Trigger: session-end
# Purpose: Run observer extraction after each Claude Code session
#
# Privacy Tiers:
#   Observer (default): Extracts from session transcript only
#   Explorer: Also starts the file/clipboard watcher if not running
#   Full Context: Also triggers a Screenpipe scan

BIZBRAIN_ROOT="${BIZBRAIN_ROOT:-$(cd "$(dirname "$0")/../../.." && pwd)}"
SCREENPIPE_DIR="$(dirname "$0")/.."
STATE_FILE="$BIZBRAIN_ROOT/.bizbrain/state.json"

# Get current privacy tier
TIER="observer"
if [ -f "$STATE_FILE" ]; then
  TIER=$(node -e "
    try {
      const s = JSON.parse(require('fs').readFileSync('$STATE_FILE', 'utf8'));
      console.log(s.privacyTier || s.learning?.tier || 'observer');
    } catch { console.log('observer'); }
  " 2>/dev/null)
fi

echo "[Brain Learning] Running tier: $TIER"

# Tier 1: Observer — Extract from session transcript
node "$SCREENPIPE_DIR/scripts/observer-extract.js" 2>/dev/null &

# Tier 2: Explorer — Ensure watcher is running
if [ "$TIER" = "explorer" ] || [ "$TIER" = "full" ]; then
  WATCHER_STATUS=$(node "$SCREENPIPE_DIR/scripts/explorer-watcher.js" status 2>/dev/null)
  if echo "$WATCHER_STATUS" | grep -q "Not running"; then
    echo "[Brain Learning] Starting explorer watcher..."
    nohup node "$SCREENPIPE_DIR/scripts/explorer-watcher.js" start > /dev/null 2>&1 &
  fi
fi

# Tier 3: Full Context — Trigger Screenpipe scan
if [ "$TIER" = "full" ]; then
  echo "[Brain Learning] Running Screenpipe scan..."
  node "$SCREENPIPE_DIR/pipes/bizbrain-learner/pipe.js" once 2>/dev/null &
fi

echo "[Brain Learning] Done."
