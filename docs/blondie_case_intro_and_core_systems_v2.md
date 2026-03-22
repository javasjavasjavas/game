# Blondie Case — Intro, Core Systems, and Case Setup

## High Concept
A web-based point-and-click graphic adventure set in a corrupt nocturnal city with a noir mood and a slight retro-cyberpunk flavor. The player controls a private detective who must find Blondie, a missing woman, before dawn.

The game is built around:
- static scenes with a small number of meaningful hotspots
- dialogue-driven investigation
- emotional portrait changes during conversations
- time and money as limited resources
- route optimization through a city map
- optional score and collectibles
- semi-linear progression through clues, object use, and unlocked locations

---

## Intro Text / Opening Mood
The protagonist wakes up late at night, disoriented, with fragmented memory of the past few hours. The city outside feels alive in the worst possible way: neon reflections, wet pavement, quiet corruption, and old violence hiding behind ordinary places.

A fitting opening line for the game is:

> I woke up past midnight with my head full of static and the taste of bad whiskey still clinging to my mouth. The last few hours were a blur. Outside, the city kept breathing through neon, lies, and dirty deals. In this town, nobody disappears by accident.

---

## Core Fantasy
The player should feel like a private detective moving through a dangerous city at night, reading people, following physical clues, managing time and money, and uncovering the truth before it is too late.

---

## Tone and Setting
- Nighttime only
- Noir atmosphere
- Corrupt urban environment
- Slight cyberpunk feel, but not futuristic sci-fi
- Wet streets, neon reflections, taxis, alleys, bars, rooftops, underground spaces
- Dry humor is allowed, but the overall tone remains grounded and moody

---

## Main Story Premise
The game starts at **22:00**.

Blondie has disappeared.

Lucy contacts the detective and tells him two concrete things:
1. she left a **photo of Blondie** in the pocket of his jacket
2. she sent him an **email with the Bar address**, where Blondie was last seen

As the detective investigates, he discovers that Blondie had learned too much about a corruption network linking **Big Boss** and **Dirty Cop**. She tried to use that knowledge to protect herself or escape, and was moved through the city during the night.

Blondie is alive, but hidden.

The detective must find her before **05:00**.

---

## Main Objective
Find Blondie before dawn.

### Deadline
- Start time: **22:00**
- Final deadline: **05:00**

If the player reaches Blondie in time, they can get a good or partial resolution depending on what they learned.
If the player arrives too late, the ending becomes worse, more ambiguous, or tragic.

---

## Story Structure
The mystery has a fixed truth, but the investigation path is semi-linear.

### Act 1 — Confirm the disappearance
- Meet Lucy
- Learn about the photo and the email
- Unlock the city map through the Bar address
- Begin the first investigation loop

### Act 2 — Reconstruct Blondie’s route
- Visit the Bar, Pharmacy, Arcade Room, Store, Red Light Block, and Dark Alley
- Speak to witnesses
- Find items and physical evidence
- Discover that Blondie was frightened and likely controlled or moved

### Act 3 — Track the transport chain
- Use Mysterious Kid’s clue to unlock Underground Garage
- Match Rose’s handwritten license plate note with a car in the Garage
- Ask Street Racer whose car it is
- Learn it belongs to Nails

### Act 4 — Reach the criminal core
- Bribe or appease BodyGuard
- Enter the Italian Restaurant
- Speak with Big Boss
- Confirm the criminal connection and identify Nails as the weak link

### Act 5 — Find Nails and locate the Safehouse
- Track Nails to Motel Neon
- Pressure or deceive him
- Get the Safehouse location

### Act 6 — Force entry and reach Blondie
- Travel to The Safehouse
- Use the steel bar on the metal door
- Find Blondie before dawn

---

## Truth of the Case
Blondie discovered evidence of corruption involving Big Boss and Dirty Cop.
She knew about hidden payments, cover-ups, movements through the city, and illegal protection networks.
She tried to use that information to survive or negotiate her way out.

That made her dangerous.

She was not killed at the start of the game. She is alive, hidden in **The Safehouse**.

---

## Main Characters

### The Detective
The protagonist. A private investigator with dry humor, patience, and a morally gray but still functional code.

### Blondie
The missing woman at the center of the case. Smart, charismatic, and more dangerous than people assume.

### Lucy
The one who starts the case. Emotionally tied to Blondie and hiding part of the truth.

### Big Boss
Local crime boss. Only appears in **Italian Restaurant Interior**.

### Dirty Cop
Corrupt police officer tied to the cover-up.

### The Doctor
Technical source of truth: injuries, sedatives, timeline clues.

### Pepe
Knows the city’s real routes and hidden movement patterns.

### Rose
Knows the street-level truth of the night and gives the player a handwritten note with the license plate number of the car Blondie entered.

### BodyGuard
Blocks or allows access to Big Boss.

### Mysterious Kid
Unusual witness. At first he speaks vaguely, but after receiving an energy drink he gives the clue that unlocks Underground Garage.

### The Gambler
Bar regular and informant. Also offers a short optional card game to win or lose money.

### Street Racer
Confirms vehicle movement and identifies the car linked to Nails.

### Jenny
Gives a small but useful detail early in the case.

### Nails
A weak link in Big Boss’s chain. He is tracked through the car clue and later confronted at **Motel Neon**.

### Blue Wing
Optional vigilante. Appears later, depending on action/time, on Rooftop or in Dark Alley.

### The Creator
Rare hidden character, completely optional.

---

## Main Locations

### Building scenes available from the start
These are all part of the detective’s building:
- Apartment
- Elevator
- Rooftop

### Main city investigation locations
- The Bar
- Pharmacy
- Arcade Room
- The Store
- Red Light Block
- Dark Alley
- Underground Garage
- Italian Restaurant Exterior
- Italian Restaurant Interior
- Motel Neon
- The Safehouse

### Optional / secret side location
- Fire Escape Landing

---

## Building Navigation
Apartment, Elevator, and Rooftop are not separate city-map nodes. They are scenes inside the same building.

### Flow
- From **Apartment**, the player can use **Leave Apartment**
- That takes them to **Elevator**
- From **Elevator**, the player can:
  - go to **Rooftop**
  - or choose **Exit Building**, which opens the city map

These scenes are available from the start of the game.

---

## Map Unlock Logic
The city map is not immediately open.

### Initial unlock
After:
- speaking with Lucy
- checking the Computer Screen
- obtaining the Bar address from the email

The button **Open City Map** becomes available.

The map then marks:
- **The Bar**

### Later unlock example
A location like **Underground Garage** is not visible from the beginning. It is unlocked when the player gives the energy drink to Mysterious Kid and receives the relevant clue.

### Another unlock example
**Motel Neon** is unlocked only after:
- Rose gives the player the handwritten license plate note
- the player confirms the same plate in Underground Garage
- the player asks Street Racer whose car it is
- Street Racer says it belongs to Nails and gives the Motel Neon address

---

## Core Gameplay Loop
1. Talk to an NPC
2. Learn a lead
3. Inspect hotspots
4. Pick up an item or clue
5. Use that item in another scene or with another character
6. Unlock a new dialogue, location, or transition
7. Move through the city
8. Repeat until The Safehouse is revealed and reachable

---

## Hotspot Philosophy
Each scene should remain compact and readable.
Hotspots should fall into these broad categories:
- story / clue
- pickup / usable object
- transition
- humor / flavor
- collectible

The game favors **conversations first**, with a few focused hotspots per scene.

---

## Movement System
Every city location has a fixed position on the map.
Distance between locations is shown in **KM**.

### Walking
- Travel time depends on distance
- Recommended rule: **1 km = 10 minutes**
- Time rounds to readable gameplay values

### Taxi
- Taxi travel takes **25% of walking time**
- Taxi costs money
- Taxi is faster but drains resources

This creates meaningful decisions:
- walk and save money
- or take a taxi and save time

---

## Time System
Time is one of the two major resources.

### Time is consumed by:
- moving between city locations
- meaningful conversations
- important inspections
- some item uses
- repeated visits when chasing leads

The game is built around clock pressure.
Exploring more is rewarding, but risky.

---

## Money System
Money is the second major resource.

It is mainly used for:
- taxi rides
- purchases in The Store
- optional gambling
- possible favors or exchanges

### Card game with The Gambler
The player can optionally play a short card game with The Gambler.
This minigame:
- is not required for progression
- can make the player win or lose money
- reinforces the Bar atmosphere
- gives an alternate way to manage the night’s economy

---

## Dialogue System
Dialogue is not cosmetic. It is a major gameplay system.

### Player option types include:
- Question
- Comment
- Joke
- Pressure
- Accusation
- Show Item
- Offer Item

### Dialogue design goals
- some options advance the case
- some reveal personality or lore
- some are humorous and optional
- some only appear if the player already knows something
- many become more specific once the player has an item or a clue

### Example
The email clue is not just flavor.
The player must use the email-derived Bar information in the conversation with The Gambler to get the stronger version of his testimony.

---

## Emotional Portrait System
Important dialogue choices trigger character emotions and swap portrait sprites.

Current emotion set:
- Serious
- Happy
- Sad
- Angry
- Mysterious
- Thinking
- Laughing

Portrait filenames follow the format:

`character_[character_name]_[emotion].png`

Examples:
- `character_big_boss_happy.png`
- `character_mysterious_kid_angry.png`

---

## Core Clue and Item Chain
This is the backbone of the current walkthrough.

### From Lucy / Apartment
- `blondie_photo`
- Bar address via email
- map unlock

### From The Bar
- stronger clue from The Gambler using the email lead
- `crumpled_receipt`

### From Pharmacy
- `sedative_box`
- medical confirmation from The Doctor

### From Arcade Room
- `arcade_token`
- timeline clue
- Mysterious Kid setup

### From Red Light Block
- Rose gives `license_plate_note`
- Vending Machine exchanges `arcade_token` for `energizing_drink`
- Alley Entrance leads to Dark Alley

### From Dark Alley
- `steel_bar`
- access to optional Fire Escape Landing with a Trading Card
- territorial insight from Pepe

### Return to Arcade Room
- give `energizing_drink` to Mysterious Kid
- unlock Underground Garage

### From Underground Garage
- inspect the car plate
- confirm it matches Rose’s note
- ask Street Racer whose car it is
- learn it belongs to Nails
- unlock Motel Neon
- also obtain `screwdriver`

### From Italian Restaurant
- give `cigarette_pack` to BodyGuard
- speak to Big Boss
- confirm the conspiracy
- identify Nails as the weak link

### From Motel Neon
- confront / deceive Nails
- get the Safehouse location

### Final
- use `steel_bar` on the Safehouse metal door
- find Blondie

---

## Item Use Examples
This game should include several clear old-school adventure object uses.

### `blondie_photo`
Used in conversations with multiple NPCs to unlock recognition and specific dialogue.

### `license_plate_note`
Given by Rose. Used implicitly when comparing the plate at Underground Garage.

### `arcade_token`
Used on the Vending Machine in Red Light Block.

### `energizing_drink`
Given to Mysterious Kid. Unlocks Underground Garage.

### `cigarette_pack`
Given to BodyGuard. Grants entry to the restaurant.

### `steel_bar`
Used on the Metal Door at The Safehouse. Forces the final entry.

### `screwdriver`
Current recommended use:
- in Elevator
- to open a loose panel or hidden note area
- this should provide contextual information, not the final solution

---

## The Doctor’s Role
The Doctor adds a technical layer to the case.

He can help confirm:
- whether someone was sedated
- whether Blondie or a related person passed through the Pharmacy
- whether the physical evidence suggests panic, force, or chemical control

He does not know the full conspiracy, but he makes the case feel more real and dangerous.

---

## Blue Wing Appearance Logic
Blue Wing should not appear immediately.

### Rooftop appearance
He can appear on Rooftop only after a certain action or hour.
Recommended condition:
- after speaking with Big Boss
- and after a certain time, such as 01:00 or later

### Dark Alley appearance
He can also appear in Dark Alley under a later-game condition, such as:
- after the player knows Nails is important
- or after a return visit late in the night

Blue Wing gives atmosphere, suspicion, and direction, but should not solve the case for the player.

---

## Collectibles and Score
The game includes optional rare collectibles called **Trading Cards**.

### Trading Cards
- not required to solve the case
- increase final score
- reward exploration and replayability
- may be hidden in early scenes or optional vertical side spaces

Examples:
- Rooftop Flower Pot
- Fire Escape Landing
- other optional exploration hotspots

### Score rewards
The score can reward:
- first-time location visits
- useful conversations
- item discovery
- optional exploration
- collectibles
- secret encounters
- finding Blondie
- solving the case

---

## Replayability
The core truth of the mystery stays fixed, but some elements can vary:
- which NPC is most cooperative first
- exact optional dialogue lines
- some appearance windows for side content
- collectible timing or placement details
- Blue Wing timing

This keeps the story coherent while making repeat runs feel less rigid.

---

## Immediate Production Priorities
1. Rebuild the master walkthrough with the updated unlock chain
2. Finalize all hotspot data scene by scene
3. Define all item IDs and their exact uses
4. Build dialogue trees per character
5. Implement map unlock logic
6. Define Blue Wing appearance conditions
7. Define the short card minigame rules
8. Define Motel Neon visually and narratively
9. Define the Elevator screwdriver interaction

---

## Short Summary
A private detective wakes into a corrupt city night and is pulled into Blondie’s disappearance. Lucy points him to a photo and an email with the Bar address, which unlocks the map and starts the investigation. Through dialogue, object use, and location unlocks, the player follows Blondie’s trail across bars, pharmacies, alleys, garages, restaurants, and motels until they locate The Safehouse and force entry before dawn.
