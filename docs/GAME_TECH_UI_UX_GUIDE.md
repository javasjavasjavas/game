# Game Technical + UX/UI Guide

## Purpose
This document is the technical and UX/UI baseline for the current game build.
Use it as the primary context when starting new design, gameplay, or narrative planning chats.

## Stack
- Runtime: React + TypeScript + Vite
- Animation: `framer-motion`
- Icons: `lucide-react` + custom PNG icons
- Global styling: `src/styles/app.css`
- Static assets: `public/game-assets/*`

## Core Architecture
- App entry and screen flow: `src/App.tsx`
- Game state and interaction logic: `src/hooks/useGame.ts`
- Domain data (rooms, hotspots, NPCs, dialogue, item defs): `src/game/data.ts`
- Game engine state model (time, clues, solve flow): `src/game/state.ts`
- Shared domain types: `src/game/types.ts`

## Screen Flow
- `start` -> Intro start screen with logo and start CTA
- `chapter` -> Chapter narrative screen (typewriter text + voice-over)
- `game` -> Main gameplay UI

Flow ownership is in `App.tsx` via:
- `type FlowScreen = "start" | "chapter" | "game"`
- `screen` state

## Main Gameplay Layout
The `game` screen is built from:
- Sidebar: `src/components/Sidebar.tsx`
- Top bar: `src/components/TopBar.tsx`
- Stage (background, character, hotspots, map overlay): `src/components/StageView.tsx`
- Footer nav + inventory strip: `src/components/FooterBar.tsx`
- Conversation panel: `src/components/panels/ConversationPanel.tsx`
- Inspect panel: `src/components/panels/InspectPanel.tsx`
- Cursor overlay: `src/components/CursorOverlay.tsx`
- New item popup: `src/components/NewItemPopup.tsx`

## Audio System
Audio routing is centralized in `App.tsx`.

Tracks:
- Start screen music: `/game-assets/audio/Intro.mp3`
- Scene music map: `SCENE_MUSIC`
  - `bar` -> `/game-assets/audio/the_bar.mp3`
  - `apartment` -> `/game-assets/audio/apartment.mp3`
- Chapter voice-over: `/game-assets/audio/chapter_1_voice.mp3` (inside `IntroScreen.tsx`)

Behavior:
- Browser audio unlock is attempted through first valid interaction events.
- Music uses fade in/out with interval-based volume interpolation.
- Sound toggle exists in sidebar and controls scene music playback.
- Chapter voice is independent from scene music and stops on `skip` or `continue`.

## Time and Simulation
`GameState` (`src/game/state.ts`) controls:
- In-game clock (`timeMinutes`)
- Current room
- Clues set
- Money and expenses
- Finish state and ending resolution

Important defaults:
- Start time: `20:00`
- Initial room from model: `bar` (but screen flow may force `apartment` before gameplay starts)
- Late ending trigger: `22:00`

## Rooms and Navigation
Defined in `src/game/data.ts`:
- `ROOMS`
- `ROOM_ORDER`
- `ROOM_MAP_LAYOUT`

Current room ids:
- `bar`, `cab`, `apartment`, `store`, `alley`, `pharmacy`, `arcade`, `garage`, `restooutside`, `restoinside`, `street`

Map transitions:
- Stage map overlay uses room coordinates and connection rules.
- Travel from map applies walk minutes through `moveRoom(roomId, walkMinutes)`.

## Characters and Dialogue
Defined in `src/game/data.ts`:
- `CHARACTERS`
- `NPCS`
- `DIALOGUE`
- `STAGE_CHARACTER_BY_ROOM`

Current stage character mapping:
- `bar` -> Big Boss
- `apartment` -> Lucy
- `arcade` -> Mysterious Kid

Dialogue pipeline:
- Select NPC -> intro line + options
- Picking option can:
  - change character emotion
  - advance time
  - unlock clues
- Conversation clue highlighting is supported in panel rendering

## Hotspots and Inspection
Hotspots are defined per room in `STAGE_HOTSPOTS_BY_ROOM`.

Rendering model:
- Hotspot coordinates are authored against source image pixel space.
- `StageView` scales and reprojects to rendered viewport (`object-fit: cover` aware).
- Hotspot rectangles are currently invisible but interactive.

Inspect behavior:
- Clicking a normal hotspot opens `InspectPanel` with hotspot text.
- Generic inspect action opens room-level inspection text.

## Item Pickup UX (Current)
The first implementation of item pickup is active.

Data:
- Inventory catalog: `INVENTORY_ITEMS`
- Hotspot item mapping: `HOTSPOT_ITEMS`, `HOTSPOT_ITEM_BY_ID`

Current test item:
- Hotspot: `apartment-videogame-screen`
- Item: `Beer Can` (`itemId: "paper"`, image `/game-assets/item_beer.png`)

Flow:
- Inspect hotspot with uncollected item -> `NewItemPopup`
- `Pick up`:
  - adds item to owned inventory
  - marks hotspot item as collected
  - closes popup
- `Discard`:
  - closes popup
  - item remains available on that hotspot
- After item is collected, re-inspecting same hotspot opens normal inspect text.

## Inventory Model (Current)
Owned inventory is now dynamic in `useGame`.

State:
- `ownedInventoryIds`
- `selectedInventoryId`
- `ownedInventoryItems` (derived)

Current default owned items:
- `key`
- `cup`

Item cursor mode:
- Selecting an owned item switches cursor to `USE WITH` mode.

## UX/UI Language and Direction
Language policy:
- Chat can be Spanish.
- Game text and code should stay in English.

Visual direction currently in project:
- Noir/cyberpunk night palette
- Pixel-art typography (`Press Start 2P`)
- Strong cinematic overlays (vignette, scanlines, blur)
- High-contrast neon accents (pink/cyan)

Interaction style:
- Point-and-click crosshair baseline
- Context cursor tags (`TALK`, `INSPECT`, `USE WITH`)
- Fade-driven transitions over abrupt swaps

## Loading UX
Current labels:
- Start loading screen: `Loading Game`
- In-stage loading: `Loading Scene`

Intro/chapter transitions use opacity-based motion transitions.

## Assets Conventions
Use `public/game-assets/` for runtime-referenced assets.

Recommended organization:
- Backgrounds: `public/game-assets/background_*.jpg|png`
- Character sprites: `public/game-assets/character_*.png`
- UI icons: `public/game-assets/icon_*.png`
- Items: `public/game-assets/item_*.png`
- Audio: `public/game-assets/audio/*.mp3|wav`

## Current Technical Risks / Notes
- Audio autoplay is browser-restricted and still depends on trusted user interaction.
- Some `StartScreen` glitch characters are currently mojibake due to encoding mismatch in source text constant.
- The game state model still starts at `bar`, while screen flow forces `apartment` during start/chapter transition.
- Item pickup persistence is in-memory only (no save/load yet).

## Suggested Next Engineering Steps
1. Add a save system for room state, collected hotspot items, clues, and inventory.
2. Normalize item IDs (`paper` -> semantic id like `beer_can`) to avoid confusion.
3. Move popup visual styles to shared tokens or CSS module for consistency with intro/chapter boxes.
4. Add SFX hooks for `item_found`, `pickup`, `discard`, and `inspect`.
5. Define a reusable event system for hotspot outcomes (inspect, pickup, trigger dialogue, unlock exit).

## Quick File Map
- `src/App.tsx`
- `src/hooks/useGame.ts`
- `src/game/data.ts`
- `src/game/state.ts`
- `src/game/types.ts`
- `src/components/StageView.tsx`
- `src/components/NewItemPopup.tsx`
- `src/components/StartScreen.tsx`
- `src/components/IntroScreen.tsx`
- `src/styles/app.css`
