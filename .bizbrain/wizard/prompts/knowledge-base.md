# Module Setup: Knowledge Base

> Core module - auto-configured during base Brain generation. No user interaction needed.

## What This Module Does

The Knowledge Base is your Brain's documentation system:
- Organized, on-demand documentation accessible via `/knowledge`
- Searchable index of all Brain knowledge files
- `/find` command for full-text search across all Brain content
- Auto-generated docs for each configured module

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | `Knowledge/` |
| **Commands** | `knowledge`, `find` |
| **Files** | `Knowledge/INDEX.md` |

## Prerequisites

None - this is a core module.

## Setup Flow

This module is **auto-configured** during Phase 6 (Generate Base Brain). No setup prompt is needed.

The base-brain generator handles:
1. Creating the `Knowledge/` directory
2. Writing `Knowledge/INDEX.md` with links to all knowledge files
3. Deploying the `/knowledge` and `/find` commands

As other modules are configured, they add their own knowledge files to this directory and update the index.

## Quick Mode Defaults

Always uses defaults - no configuration options.

## Activation

Auto-activated during Phase 6. Status is set to `configured` immediately.

## Completion

Knowledge Base is ready. As you configure more modules, each one will add its own documentation to `Knowledge/`. Use `/knowledge` to browse or `/find` to search.
