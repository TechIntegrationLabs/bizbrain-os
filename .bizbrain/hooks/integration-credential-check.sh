#!/usr/bin/env bash
# Hook: integration-credential-check
# Trigger: session-start
# Purpose: Check for pending integration credential requests and notify Claude Code

BIZBRAIN_ROOT="${BIZBRAIN_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"
PENDING_FILE="$BIZBRAIN_ROOT/.bizbrain/credentials/pending.json"

if [ ! -f "$PENDING_FILE" ]; then
  exit 0
fi

# Check if there are any pending items
PENDING_COUNT=$(node -e "
  try {
    const data = JSON.parse(require('fs').readFileSync('$PENDING_FILE', 'utf8'));
    const pending = (data.pending || []).filter(p => !p.completedAt);
    console.log(pending.length);
  } catch { console.log(0); }
" 2>/dev/null)

if [ "$PENDING_COUNT" -gt 0 ]; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  🔑 $PENDING_COUNT integration(s) need credentials"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  # List pending integrations
  node -e "
    try {
      const data = JSON.parse(require('fs').readFileSync('$PENDING_FILE', 'utf8'));
      const pending = (data.pending || []).filter(p => !p.completedAt);
      pending.forEach(p => {
        console.log('  • ' + p.name + ' (' + p.id + ')');
        if (p.envVars) {
          p.envVars.forEach(v => console.log('    Key needed: ' + v.key));
        }
      });
    } catch {}
  " 2>/dev/null

  echo ""
  echo "  Run: Set up these integrations by providing the credentials above."
  echo "  Guide: Each integration has setup steps in the registry."
  echo ""
fi
