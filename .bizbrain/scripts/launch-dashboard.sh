#!/bin/bash
BRAIN_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
echo "Starting BizBrain Dashboard..."
node "$BRAIN_DIR/.bizbrain/dashboard/server.js" &
sleep 1
# Open in browser
if command -v xdg-open &>/dev/null; then xdg-open "http://localhost:5555"
elif command -v open &>/dev/null; then open "http://localhost:5555"
else echo "Open http://localhost:5555 in your browser"
fi
