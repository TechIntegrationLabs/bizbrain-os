#!/bin/bash
echo "=================================="
echo "  BizBrain OS - Quick Setup"
echo "=================================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &>/dev/null; then
  echo "✗ Node.js is required. Install from https://nodejs.org"
  exit 1
fi
echo "✓ Node.js $(node --version)"

if ! command -v git &>/dev/null; then
  echo "✗ Git is required. Install from https://git-scm.com"
  exit 1
fi
echo "✓ Git $(git --version | cut -d' ' -f3)"

if ! command -v claude &>/dev/null; then
  echo "✗ Claude Code is required. Install with: npm install -g @anthropic-ai/claude-code"
  exit 1
fi
echo "✓ Claude Code found"

echo ""
echo "All prerequisites met!"
echo ""
echo "Starting Claude Code for setup..."
echo "Type /setup when Claude Code starts."
echo ""

claude
