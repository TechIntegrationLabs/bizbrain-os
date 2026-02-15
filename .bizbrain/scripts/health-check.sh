#!/bin/bash
# Brain health check
BRAIN_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
echo "BizBrain Health Check"
echo "===================="

# Check Claude Code
if command -v claude &>/dev/null; then echo "✓ Claude Code installed"; else echo "✗ Claude Code not found"; fi

# Check Node.js
if command -v node &>/dev/null; then echo "✓ Node.js $(node --version)"; else echo "✗ Node.js not found"; fi

# Check Git
if command -v git &>/dev/null; then echo "✓ Git $(git --version | cut -d' ' -f3)"; else echo "✗ Git not found"; fi

# Check config
if [ -f "$BRAIN_DIR/config.json" ]; then echo "✓ Config exists"; else echo "✗ config.json missing (run /setup)"; fi

# Check dashboard
if curl -s http://localhost:5555/api/health >/dev/null 2>&1; then echo "✓ Dashboard running"; else echo "○ Dashboard not running"; fi

echo ""
echo "Brain: $BRAIN_DIR"
