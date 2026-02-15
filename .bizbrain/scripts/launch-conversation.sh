#!/bin/bash
# Launch Claude Code in the conversations folder
BRAIN_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
CONV_DIR="$BRAIN_DIR/../BizBrain-Conversations"

if [ ! -d "$CONV_DIR" ]; then
  mkdir -p "$CONV_DIR"
  # Generate minimal CLAUDE.md for conversations folder
  BUSINESS_NAME=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$BRAIN_DIR/config.json','utf8')).profile.businessName||'BizBrain')")
  cat > "$CONV_DIR/CLAUDE.md" << EOFCLAUDE
# $BUSINESS_NAME - Conversations

> Lightweight entry point for Brain conversations.
> Full Brain location: $BRAIN_DIR

## Quick Commands
- /help - See available commands
- /status - Brain status
- /knowledge <topic> - Load specific knowledge
- /dashboard - Open the dashboard
EOFCLAUDE
fi

# Open terminal with claude
if command -v wt &>/dev/null; then
  wt -d "$CONV_DIR" -- claude
elif command -v open &>/dev/null; then
  osascript -e "tell application \"Terminal\" to do script \"cd '$CONV_DIR' && claude\""
else
  echo "Open a terminal in $CONV_DIR and run: claude"
fi
