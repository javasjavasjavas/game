import type { DialogueEntry, Npc, Room, RoomId } from "./types";

export const ROOMS: Record<RoomId, Room> = {
  dock: {
    id: "dock",
    name: "Dock",
    description: "Wet wood, old ropes, and waves breaking in silence.",
    exits: ["lobby", "beach"],
  },
  lobby: {
    id: "lobby",
    name: "Hotel Lobby",
    description: "An empty desk, cold coffee smell, and a brass bell.",
    exits: ["dock", "beach", "lighthouse"],
  },
  beach: {
    id: "beach",
    name: "North Beach",
    description: "Dark sand and wind that swallows distant voices.",
    exits: ["dock", "lobby", "lighthouse"],
  },
  lighthouse: {
    id: "lighthouse",
    name: "Lighthouse",
    description: "Metal stairs, salt-stained walls, and a full island view.",
    exits: ["lobby", "beach"],
  },
};

export const ROOM_ORDER: RoomId[] = ["dock", "lobby", "beach", "lighthouse"];

export const ROOM_MAP_LAYOUT: Record<RoomId, { x: number; y: number }> = {
  dock: { x: 20, y: 70 },
  lobby: { x: 45, y: 48 },
  beach: { x: 76, y: 70 },
  lighthouse: { x: 74, y: 20 },
};

export const NPCS: Npc[] = [
  {
    id: "ana",
    name: "Ana Ledesma",
    schedule: [
      { from: "08:00", to: "11:00", room: "beach" },
      { from: "11:00", to: "14:00", room: "lobby" },
      { from: "14:00", to: "18:00", room: "dock" },
      { from: "18:00", to: "22:00", room: "lobby" },
    ],
  },
  {
    id: "bruno",
    name: "Bruno Varela",
    schedule: [
      { from: "08:00", to: "10:00", room: "dock" },
      { from: "10:00", to: "13:00", room: "lobby" },
      { from: "13:00", to: "16:00", room: "lighthouse" },
      { from: "16:00", to: "22:00", room: "beach" },
    ],
  },
  {
    id: "carlos",
    name: "Carlos Mena",
    schedule: [
      { from: "08:00", to: "12:00", room: "lobby" },
      { from: "12:00", to: "17:00", room: "dock" },
      { from: "17:00", to: "22:00", room: "lighthouse" },
    ],
  },
];

export const CLUES: Record<string, string> = {
  tornJacket: "Torn jacket with lighthouse paint.",
  keyLog: "Lighthouse key register was altered.",
  witness: "Ana's statement: Bruno came down nervous from the lighthouse.",
};

export const DIALOGUE: Record<string, DialogueEntry> = {
  ana: {
    intro: "\"People ask too much on this island. Keep your questions short.\"",
    options: [
      {
        id: "ana-who",
        text: "Who are you?",
        emotion: "serious",
        onPick: () => "\"Ana Ledesma. Morning shift, no drama, no mistakes.\"",
      },
      {
        id: "ana-suit",
        text: "I like your suit",
        emotion: "happy",
        onPick: () => "\"Thanks. In this weather, style is armor.\"",
      },
      {
        id: "ana-rumour",
        text: "Any new rumour?",
        emotion: "serious",
        onPick: (state) => {
          if (!state.hasClue("witness")) {
            state.addClue("witness");
            return "\"At 14:20 I saw Bruno coming down from the lighthouse. He looked shaken.\"";
          }
          return "\"No fresh rumor. Just the same fear in different voices.\"";
        },
      },
    ],
  },
  bruno: {
    intro: "\"I don't like interviews. Make it quick.\"",
    options: [
      {
        id: "bruno-who",
        text: "Who are you?",
        emotion: "serious",
        onPick: () => "\"Bruno Varela. Maintenance. I fix what people break.\"",
      },
      {
        id: "bruno-suit",
        text: "I like your suit",
        emotion: "happy",
        onPick: () => "\"You have taste. Not many people notice details.\"",
      },
      {
        id: "bruno-rumour",
        text: "Any new rumour?",
        emotion: "serious",
        onPick: (state) => {
          if (!state.hasClue("tornJacket")) {
            state.addClue("tornJacket");
            return "\"People talk too much. They say someone ripped a jacket near the lighthouse stairs.\"";
          }
          return "\"Only old noise. Nothing you can trust.\"";
        },
      },
    ],
  },
  carlos: {
    intro: "\"What brings you here, outsider? This place is not what it seems...\"",
    options: [
      {
        id: "carlos-who",
        text: "Who are you?",
        emotion: "serious",
        onPick: () => "\"Carlos. I run this lobby and watch everyone who crosses it.\"",
      },
      {
        id: "carlos-suit",
        text: "I like your suit",
        emotion: "happy",
        onPick: () => "\"Sharp eye. Noir never dies, detective.\"",
      },
      {
        id: "carlos-rumour",
        text: "Any new rumour?",
        emotion: "serious",
        onPick: (state) => {
          if (!state.hasClue("keyLog")) {
            state.addClue("keyLog");
            return "\"A fresh one: someone edited the lighthouse key log during Bruno's shift.\"";
          }
          return "\"Same old storm, same old lies.\"";
        },
      },
    ],
  },
};

export const ENDINGS = {
  solved: "Case solved: Bruno stole the medallion and tried to frame Ana.",
  wrong: "Wrong accusation. The suspect escaped on the last boat.",
  late: "Too late. It is 22:00 and the island is sealed for the night.",
};

export const INVENTORY_ITEMS = [
  { id: "key", label: "Rusty key" },
  { id: "paper", label: "Old newspaper" },
  { id: "cup", label: "Coffee cup" },
];
