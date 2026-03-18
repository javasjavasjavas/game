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
      x: 1460,
      y: 150,
      width: 280,
      height: 430,
    },
    {
      id: "bar-bottle-zone",
      label: "Bottle Zone",
      x: 2410,
      y: 330,
      width: 540,
      height: 500,
    },
    {
      id: "bar-under-table",
      label: "Under Table",
      x: 860,
      y: 980,
      width: 760,
      height: 430,
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
