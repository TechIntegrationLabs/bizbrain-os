#!/bin/bash
# Runs after git pull to handle migrations
BRAIN_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
BIZBRAIN="$BRAIN_DIR/.bizbrain"

# Read current and new versions
OLD_VERSION=$(node -e "try{console.log(JSON.parse(require('fs').readFileSync('$BRAIN_DIR/config.json','utf8')).version||'0.0.0')}catch(e){console.log('0.0.0')}")
NEW_VERSION=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$BIZBRAIN/VERSION.json','utf8')).version)")

if [ "$OLD_VERSION" = "$NEW_VERSION" ]; then
  echo "[BizBrain] Already up to date (v$NEW_VERSION)"
  exit 0
fi

echo "[BizBrain] Updating from v$OLD_VERSION to v$NEW_VERSION..."

# Run migrations
MIGRATIONS_DIR="$BIZBRAIN/migrations"
if [ -d "$MIGRATIONS_DIR" ]; then
  for migration in $(ls "$MIGRATIONS_DIR"/*.js 2>/dev/null | sort); do
    MIGRATION_VER=$(basename "$migration" .js)
    if [ "$(printf '%s\n' "$OLD_VERSION" "$MIGRATION_VER" | sort -V | head -1)" = "$OLD_VERSION" ] && [ "$OLD_VERSION" != "$MIGRATION_VER" ]; then
      echo "  Running migration: $MIGRATION_VER"
      node "$migration"
    fi
  done
fi

# Update version in config
node -e "
const fs=require('fs');
const cfg=JSON.parse(fs.readFileSync('$BRAIN_DIR/config.json','utf8'));
cfg.version='$NEW_VERSION';
fs.writeFileSync('$BRAIN_DIR/config.json',JSON.stringify(cfg,null,2));
"

echo "[BizBrain] Updated to v$NEW_VERSION"
