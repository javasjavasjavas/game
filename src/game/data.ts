import type { CharacterDefinition, DialogueEntry, HotspotDefinition, Npc, Room, RoomId } from "./types";

export const CHARACTERS: CharacterDefinition[] = [
  {
    id: "bigboss",
    name: "Big Boss",
    description:
      "A feared criminal boss who controls favors, debts, and silence across the district.",
    defaultEmotion: "serious",
    emotions: {
      serious: "/game-assets/character_big_boss_serious.png",
      happy: "/game-assets/character_big_boss_happy.png",
      sad: "/game-assets/character_big_boss_serious.png",
      angry: "/game-assets/character_big_boss_serious.png",
      suspicious: "/game-assets/character_big_boss_serious.png",
    },
  },
  {
    id: "lucy",
    name: "Lucy",
    description:
      "A mysterious woman who appears in your apartment, and somehow you cannot remember ever meeting her.",
    defaultEmotion: "serious",
    emotions: {
      serious: "/game-assets/character_lucy_serious.png",
      happy: "/game-assets/character_lucy_happy.png",
      sad: "/game-assets/character_lucy_sad.png",
      angry: "/game-assets/character_lucy_angry.png",
      suspicious: "/game-assets/character_lucy_serious.png",
    },
  },
  {
    id: "mysteriouskid",
    name: "Mysterious Kid",
    description:
      "A strange kid in the Arcade Room who reads people too quickly and smiles at the wrong moments.",
    defaultEmotion: "happy",
    emotions: {
      serious: "/game-assets/character_mind_reader_happy.png",
      happy: "/game-assets/character_mind_reader_happy.png",
      sad: "/game-assets/character_mind_reader_suspicious.png",
      angry: "/game-assets/character_mind_reader_amgry.png",
      suspicious: "/game-assets/character_mind_reader_suspicious.png",
    },
  },
];

export const CHARACTER_BY_ID: Record<string, CharacterDefinition> = Object.fromEntries(
  CHARACTERS.map((character) => [character.id, character])
);

export const STAGE_CHARACTER_ID = "bigboss";
export const STAGE_CHARACTER_BY_ROOM: Partial<Record<RoomId, string>> = {
  bar: "bigboss",
  apartment: "lucy",
  arcade: "mysteriouskid",
};

export const ROOMS: Record<RoomId, Room> = {
  bar: {
    id: "bar",
    name: "The Bar",
    description: "Neon lights, old jazz, and whispers nobody repeats twice.",
    exits: ["cab", "apartment", "store", "alley", "pharmacy", "arcade", "street"],
  },
  cab: {
    id: "cab",
    name: "Cab",
    description: "Rain on the windshield, city lights stretched into blurred streaks.",
    exits: ["bar", "apartment", "street", "garage"],
  },
  apartment: {
    id: "apartment",
    name: "Apartment",
    description: "A narrow hallway, broken intercom, and sleepless windows.",
    exits: ["bar", "cab", "alley", "pharmacy", "arcade", "street"],
  },
  store: {
    id: "store",
    name: "Store",
    description: "Half-closed shutters, humming fridges, and nervous eyes behind glass.",
    exits: ["bar", "alley", "pharmacy", "arcade", "street"],
  },
  alley: {
    id: "alley",
    name: "Alley",
    description: "Wet concrete, flickering signs, and footsteps that stop when you turn.",
    exits: ["bar", "apartment", "store", "pharmacy", "arcade", "street"],
  },
  pharmacy: {
    id: "pharmacy",
    name: "Pharmacy",
    description: "Cold fluorescent aisles, late-shift silence, and receipts no one keeps.",
    exits: ["bar", "apartment", "store", "alley", "arcade", "street"],
  },
  arcade: {
    id: "arcade",
    name: "Arcade Room",
    description: "Flickering cabinets, token clinks, and static from forgotten high scores.",
    exits: ["bar", "apartment", "store", "alley", "pharmacy", "street"],
  },
  garage: {
    id: "garage",
    name: "Underground Garage",
    description: "Concrete pillars, oil slicks, and engines ticking in the dark.",
    exits: ["street", "cab"],
  },
  restooutside: {
    id: "restooutside",
    name: "Italian Restaurant Outside",
    description: "Warm window light spills onto wet pavement and polished parked cars.",
    exits: ["street", "restoinside"],
  },
  restoinside: {
    id: "restoinside",
    name: "Italian Restaurant Inside",
    description: "Low chandeliers, red velvet booths, and conversations hidden behind wine glasses.",
    exits: ["restooutside"],
  },
  street: {
    id: "street",
    name: "Street",
    description: "Traffic hiss, neon reflections, and strangers moving like static.",
    exits: ["bar", "apartment", "store", "alley", "pharmacy", "arcade", "garage", "restooutside", "cab"],
  },
};

export const ROOM_ORDER: RoomId[] = [
  "bar",
  "cab",
  "apartment",
  "store",
  "alley",
  "pharmacy",
  "arcade",
  "garage",
  "restooutside",
  "restoinside",
  "street",
];

export const ROOM_MAP_LAYOUT: Record<RoomId, { x: number; y: number }> = {
  bar: { x: 48, y: 48 },
  cab: { x: 50, y: 92 },
  apartment: { x: 22, y: 24 },
  store: { x: 78, y: 26 },
  alley: { x: 52, y: 78 },
  pharmacy: { x: 84, y: 72 },
  arcade: { x: 14, y: 66 },
  garage: { x: 72, y: 88 },
  restooutside: { x: 85, y: 40 },
  restoinside: { x: 92, y: 22 },
  street: { x: 56, y: 42 },
};

export const STAGE_HOTSPOTS_BY_ROOM: Partial<Record<RoomId, HotspotDefinition[]>> = {
  bar: [
    {
      id: "bar-poster-wall",
      label: "Wall Poster",
      x: 1860,
      y: 340,
      width: 260,
      height: 400,
      inspectText:
        "A faded poster clings to the brick wall. The corners are water-warped and someone scratched a small symbol into the lower edge.",
    },
    {
      id: "bar-bottle-zone",
      label: "Bottle Zone",
      x: 2356,
      y: 330,
      width: 594,
      height: 250,
      inspectText:
        "Rows of bottles line the back bar. Some labels are turned inward on purpose, as if someone hid a specific brand or a missing bottle.",
    },
    {
      id: "bar-under-table",
      label: "Under Table",
      x: 360,
      y: 1066,
      width: 490,
      height: 344,
      inspectText:
        "The dark space beneath the table is packed with shadow. Dust is broken in one corner, like something was dragged or hastily shoved underneath.",
    },
  ],
  apartment: [
    {
      id: "apartment-jacket-pocket",
      label: "Jacket on Chair",
      x: 1660,
      y: 1135,
      width: 330,
      height: 505,
      inspectText:
        "A jacket hangs over the chair back, one sleeve nearly touching the floor. The inside pocket looks heavy, like it is hiding paper or a small metal object.",
    },
    {
      id: "apartment-videogame-screen",
      label: "Videogame Screen",
      x: 545,
      y: 910,
      width: 335,
      height: 485,
      inspectText:
        "The game screen is frozen mid-scene. Someone left it running, but the image glows like the machine was abandoned in a hurry.",
    },
    {
      id: "apartment-computer-screen",
      label: "Computer Screen",
      x: 225,
      y: 875,
      width: 265,
      height: 600,
      inspectText:
        "The computer monitor throws a cold light across the room. A window is open on the desktop, but from here you can only make out blurred blocks of text.",
    },
    {
      id: "apartment-window-city",
      label: "Window and City",
      x: 1730,
      y: 175,
      width: 1300,
      height: 790,
      inspectText:
        "Beyond the glass, the city is all neon haze and distant sirens. The skyline feels close enough to touch, but the room still feels sealed off.",
    },
  ],
  arcade: [
    {
      id: "arcade-counter-computer",
      label: "Counter Computer",
      x: 360,
      y: 340,
      width: 520,
      height: 360,
      inspectText:
        "An old computer hums behind the counter. The casing is scratched, but the screen still throws out a stubborn blue glow.",
    },
    {
      id: "arcade-machine-one",
      label: "Arcade Machine",
      x: 1080,
      y: 250,
      width: 460,
      height: 980,
      inspectText:
        "The cabinet art is faded under years of fingerprints. One of the side buttons looks newer than the others.",
    },
    {
      id: "arcade-machine-two",
      label: "Arcade Machine 2",
      x: 1770,
      y: 240,
      width: 500,
      height: 1010,
      inspectText:
        "Another arcade machine stands beside it, louder and brighter. Somebody wedged a token into the return slot and left it there.",
    },
  ],
  store: [
    {
      id: "store-left-fridge",
      label: "Left Fridge",
      x: 120,
      y: 250,
      width: 620,
      height: 1180,
      inspectText:
        "The fridge on the left rattles under weak fluorescent light. Condensation hides the glass, but a few silhouettes of bottles still show through.",
    },
    {
      id: "store-counter",
      label: "Counter",
      x: 1240,
      y: 760,
      width: 920,
      height: 560,
      inspectText:
        "The counter is cluttered with receipts, wrappers, and a register that has been opened too many times tonight.",
    },
    {
      id: "store-middle-ice-cream-fridge",
      label: "Ice Cream Fridge",
      x: 1040,
      y: 470,
      width: 660,
      height: 500,
      inspectText:
        "The ice cream freezer in the middle gives off a tired mechanical buzz. Frost clings to the lid as if it has not closed properly in days.",
    },
  ],
  garage: [
    {
      id: "garage-license-plate-pile",
      label: "License Plate Pile",
      x: 220,
      y: 1120,
      width: 660,
      height: 400,
      inspectText:
        "A pile of old license plates leans against the wall. Some are bent clean through, and a few numbers have been scratched away on purpose.",
    },
    {
      id: "garage-tool-bench",
      label: "Tool Bench",
      x: 1160,
      y: 420,
      width: 760,
      height: 500,
      inspectText:
        "The tool bench is crowded with wrenches, oil rags, and half-finished repairs. One drawer sits slightly open, like someone stopped mid-search.",
    },
    {
      id: "garage-car",
      label: "Car",
      x: 1840,
      y: 600,
      width: 1180,
      height: 760,
      inspectText:
        "The car takes up most of the bay, polished in places and filthy in others. It looks ready to leave fast, if it has not already been waiting too long.",
    },
  ],
};

export const NPCS: Npc[] = [
  {
    id: "bigboss",
    name: "Big Boss",
    schedule: [
      { from: "20:00", to: "21:00", room: "bar" },
      { from: "21:00", to: "22:00", room: "alley" },
    ],
  },
  {
    id: "lucy",
    name: "Lucy",
    schedule: [
      { from: "20:00", to: "21:00", room: "apartment" },
      { from: "21:00", to: "22:00", room: "bar" },
    ],
  },
  {
    id: "clerk",
    name: "Milo Trent",
    schedule: [
      { from: "20:00", to: "21:00", room: "store" },
      { from: "21:00", to: "22:00", room: "bar" },
    ],
  },
  {
    id: "mysteriouskid",
    name: "Mysterious Kid",
    schedule: [
      { from: "20:00", to: "21:00", room: "arcade" },
      { from: "21:00", to: "22:00", room: "arcade" },
    ],
  },
];

export const CLUES: Record<string, string> = {
  tornJacket: "Torn jacket with neon paint from the alley wall.",
  keyLog: "Store shutter log was edited during the blackout window.",
  witness: "Lucy's statement: Big Boss rushed out of the alley at 21:10.",
};

export const DIALOGUE: Record<string, DialogueEntry> = {
  bigboss: {
    intro: "\"Ask fast. Night is expensive in this city.\"",
    options: [
      {
        id: "bigboss-who",
        text: "Who are you?",
        emotion: "serious",
        onPick: () => "\"People call me Big Boss. I own nothing, but I hear everything.\"",
      },
      {
        id: "bigboss-suit",
        text: "I like your suit",
        emotion: "happy",
        onPick: () => "\"Finally, someone with taste.\"",
      },
      {
        id: "bigboss-rumour",
        text: "Any new rumour?",
        emotion: "serious",
        onPick: (state) => {
          if (!state.hasClue("tornJacket")) {
            state.addClue("tornJacket");
            return "\"Rumor says someone scraped a jacket on fresh neon paint in the alley.\"";
          }
          return "\"Same noise, different mouths.\"";
        },
      },
    ],
  },
  lucy: {
    intro: "\"You looked right through me, like we never met. That's interesting.\"",
    options: [
      {
        id: "lucy-who",
        text: "Who are you and what are you doing in my apartment??",
        emotion: "angry",
        onPick: () => "\"Keep your voice down. I'm Lucy. I came to make sure you were still breathing.\"",
      },
      {
        id: "lucy-undressed",
        text: "Why are you naked?",
        emotion: "happy",
        onPick: () => "\"Comfort beats fashion tonight. Relax, detective, you're too tense.\"",
      },
      {
        id: "lucy-alone",
        text: "I need to be alone.",
        emotion: "sad",
        onPick: (state) => {
          if (!state.hasClue("witness")) {
            state.addClue("witness");
            return "\"Then remember this before I go: Big Boss left the alley at 21:10, and he was shaking.\"";
          }
          return "\"Alone won't help if your memory keeps bleeding.\"";
        },
      },
    ],
  },
  clerk: {
    intro: "\"If you're buying answers, pay in trust.\"",
    options: [
      {
        id: "clerk-who",
        text: "Who are you?",
        emotion: "serious",
        onPick: () => "\"Milo Trent. I close the store and remember every lock.\"",
      },
      {
        id: "clerk-suit",
        text: "I like your suit",
        emotion: "happy",
        onPick: () => "\"Not bad. You notice details.\"",
      },
      {
        id: "clerk-rumour",
        text: "Any new rumour?",
        emotion: "serious",
        onPick: (state) => {
          if (!state.hasClue("keyLog")) {
            state.addClue("keyLog");
            return "\"Someone altered the store shutter log right after the blackout.\"";
          }
          return "\"Rumors are cheap, facts are expensive.\"";
        },
      },
    ],
  },
  mysteriouskid: {
    intro: "\"You look older than yesterday, detective.\"",
    options: [
      {
        id: "kid-who",
        text: "Who are you?",
        emotion: "suspicious",
        onPick: () => "\"People call me the mind reader. I call myself bored.\"",
      },
      {
        id: "kid-why-here",
        text: "What are you doing in this arcade?",
        emotion: "happy",
        onPick: () => "\"Listening to machine noise. It hides true thoughts.\"",
      },
      {
        id: "kid-stop",
        text: "Stop playing games with me.",
        emotion: "angry",
        onPick: () => "\"Then stop asking questions you fear the answers to.\"",
      },
    ],
  },
};

export const ENDINGS = {
  solved: "Case solved: Big Boss staged the theft and forged the city logs.",
  wrong: "Wrong accusation. The suspect slipped into the night crowd.",
  late: "Too late. At 22:00 the district locks down and all leads go cold.",
};

export const INVENTORY_ITEMS = [
  { id: "key", label: "Key", image: "/game-assets/item_key.png" },
  { id: "paper", label: "Beer can", image: "/game-assets/item_beer.png" },
  { id: "cup", label: "Cassette", image: "/game-assets/item_cassete.png" },
];
