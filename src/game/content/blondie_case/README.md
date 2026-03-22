# Blondie Case Data Pack

Canonical, normalized data pack for the Blondie case.

## Files
- `manifest.json`: entrypoint and file map.
- `characters.json`: characters, sprite mapping, aliases, and missing sprite notes.
- `locations.json`: locations + hotspots (normalized by `locationId`).
- `items_and_unlocks.json`: item chain and main unlock conditions.
- `walkthrough.json`: canonical winning route + optional branches.

## Why this structure
- Fast edits: one concern per file.
- Stable references: all cross-links use canonical snake_case IDs.
- Backward compatibility: aliases are preserved for old/internal names.
- Safe migration: data layer can be integrated incrementally without touching intro flow.

## Current known gaps
- `pepe` sprites are referenced by story docs but not present in `public/game-assets`.
- `motel_neon` hotspot detail is still pending.
- Blue Wing trigger logic is not finalized yet (time/action conditions).
- Elevator screwdriver interaction detail is still optional and partially defined.