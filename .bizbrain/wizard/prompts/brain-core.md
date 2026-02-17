# Module Setup: Brain Core

> Core module - auto-configured during base Brain generation. No user interaction needed.

## What This Module Does

Brain Core is the foundation of your Business Brain:
- Central `config.json` configuration file
- Base folder structure (Brand/, Knowledge/, _intake-dump/)
- Personalized `CLAUDE.md` with your business context
- Brain Gateway agent for cross-module access
- Core commands: `/status`, `/help`, `/knowledge`

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | `Brand/`, `Knowledge/`, `_intake-dump/` |
| **Files** | `CLAUDE.md`, `config.json` |
| **Agents** | `brain-gateway` |
| **Commands** | `status`, `help`, `knowledge` |
| **Knowledge** | `folder-structure.md`, `commands-reference.md` |

## Prerequisites

None - this is the root module.

## Setup Flow

This module is **auto-configured** during Phase 6 (Generate Base Brain). No setup prompt is needed.

The base-brain generator handles:
1. Creating `config.json` from template + interview data
2. Creating the folder structure
3. Generating personalized `CLAUDE.md`
4. Writing knowledge files

## Quick Mode Defaults

Always uses defaults - no configuration options.

## Activation

Auto-activated during Phase 6. Status is set to `configured` immediately.

## Completion

Brain Core is the foundation everything else builds on. Once configured, all other modules can be set up on top of it.
