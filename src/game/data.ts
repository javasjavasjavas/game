import type { CharacterDefinition, DialogueEntry, Npc, Room, RoomId } from "./types";

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
    },
  },
  {
    id: "lucy",
    name: "Lucy",
    description:
      "A sharp-eyed tenant who notices more than she admits and never speaks without purpose.",
    defaultEmotion: "serious",
    emotions: {
      serious: "/game-assets/character_lucy_serious.png",
      happy: "/game-assets/character_lucy_happy.png",
      sad: "/game-assets/character_lucy_sad.png",
      angry: "/game-assets/character_lucy_angry.png",
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
};

export const ROOMS: Record<RoomId, Room> = {
  bar: {
    id: "bar",
    name: "The Bar",
    description: "Neon lights, old jazz, and whispers nobody repeats twice.",
    exits: ["cab", "apartment", "store", "alley"],
  },
  cab: {
    id: "cab",
    name: "Cab",
    description: "Rain on the windshield, city lights stretched into blurred streaks.",
    exits: ["bar", "apartment"],
  },
  apartment: {
    id: "apartment",
    name: "Apartment",
    description: "A narrow hallway, broken intercom, and sleepless windows.",
    exits: ["bar", "cab", "alley"],
  },
  store: {
    id: "store",
    name: "Store",
    description: "Half-closed shutters, humming fridges, and nervous eyes behind glass.",
    exits: ["bar", "alley"],
  },
  alley: {
    id: "alley",
    name: "Alley",
    description: "Wet concrete, flickering signs, and footsteps that stop when you turn.",
    exits: ["bar", "apartment", "store"],
  },
};

export const ROOM_ORDER: RoomId[] = ["bar", "cab", "apartment", "store", "alley"];

export const ROOM_MAP_LAYOUT: Record<RoomId, { x: number; y: number }> = {
  bar: { x: 48, y: 48 },
  cab: { x: 50, y: 92 },
  apartment: { x: 22, y: 24 },
  store: { x: 78, y: 26 },
  alley: { x: 52, y: 78 },
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
    intro: "\"You look lost. That's dangerous around here.\"",
    options: [
      {
        id: "lucy-who",
        text: "Who are you?",
        emotion: "serious",
        onPick: () => "\"Lucy. I keep records and avoid trouble.\"",
      },
      {
        id: "lucy-suit",
        text: "I like your suit",
        emotion: "happy",
        onPick: () => "\"Thanks, detective. Someone has to look alive at this hour.\"",
      },
      {
        id: "lucy-rumour",
        text: "Any new rumour?",
        emotion: "serious",
        onPick: (state) => {
          if (!state.hasClue("witness")) {
            state.addClue("witness");
            return "\"I saw Big Boss leaving the alley at 21:10. He looked nervous.\"";
          }
          return "\"Only old stories and bad alibis.\"";
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
