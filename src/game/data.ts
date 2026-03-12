import type { DialogueEntry, Npc, Room, RoomId } from "./types";

export const ROOMS: Record<RoomId, Room> = {
  dock: {
    id: "dock",
    name: "Muelle",
    description: "Madera humeda, cuerdas viejas y el mar golpeando en silencio.",
    exits: ["lobby", "beach"],
  },
  lobby: {
    id: "lobby",
    name: "Lobby del Hotel",
    description: "Recepcion vacia, olor a cafe frio y una campana de bronce.",
    exits: ["dock", "beach", "lighthouse"],
  },
  beach: {
    id: "beach",
    name: "Playa Norte",
    description: "Arena oscura y un viento que tapa voces lejanas.",
    exits: ["dock", "lobby", "lighthouse"],
  },
  lighthouse: {
    id: "lighthouse",
    name: "Faro",
    description: "Escaleras metalicas, sal pegada en paredes y vista total de la isla.",
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
  tornJacket: "Chaqueta rasgada con pintura del faro",
  keyLog: "Registro de llave del faro alterado",
  witness: "Testimonio de Ana: Bruno salio del faro nervioso",
};

export const DIALOGUE: Record<string, DialogueEntry> = {
  ana: {
    intro: "No quiero problemas, detective. Vi cosas raras hoy.",
    options: [
      {
        id: "ana-witness",
        text: "Que viste cerca del faro?",
        requirement: (state) => state.timeMinutes >= 14 * 60 && !state.hasClue("witness"),
        onPick: (state) => {
          state.addClue("witness");
          return "A las 14:20 vi a Bruno bajar del faro con la chaqueta rota.";
        },
      },
      {
        id: "ana-routine",
        text: "Donde estuviste todo el dia?",
        onPick: () => "De manana en la playa, luego en el lobby. Despues fui al muelle a tomar aire.",
      },
    ],
  },
  bruno: {
    intro: "No me gustan los interrogatorios. Tengo trabajo.",
    options: [
      {
        id: "bruno-jacket",
        text: "Tu chaqueta tiene un corte extrano.",
        requirement: (state) => state.timeMinutes >= 13 * 60 && !state.hasClue("tornJacket"),
        onPick: (state) => {
          state.addClue("tornJacket");
          return "Bruno intenta ocultarla, pero se ve pintura gris de la torre del faro.";
        },
      },
      {
        id: "bruno-alibi",
        text: "Donde estabas a las 14:00?",
        onPick: () => "En la playa, seguro. Nadie puede probar lo contrario.",
      },
    ],
  },
  carlos: {
    intro: "El hotel se esta hundiendo en chismes. Pregunte rapido.",
    options: [
      {
        id: "carlos-key",
        text: "Necesito saber quien uso la llave del faro.",
        requirement: (state) => state.timeMinutes >= 12 * 60 && !state.hasClue("keyLog"),
        onPick: (state) => {
          state.addClue("keyLog");
          return "El libro marca una firma borrada justo en el turno de Bruno.";
        },
      },
      {
        id: "carlos-mood",
        text: "Como estaba Bruno hoy?",
        onPick: () => "Tenso desde el almuerzo. Evitaba mirarme.",
      },
    ],
  },
};

export const ENDINGS = {
  solved: "Resolviste el caso: Bruno robo el medallon y trato de culpar a Ana.",
  wrong: "Acusacion incorrecta. El sospechoso se fue en el ultimo bote y el caso queda abierto.",
  late: "Demasiado tarde. Son las 22:00 y la isla queda aislada por la noche.",
};

export const INVENTORY_ITEMS = [
  { id: "key", label: "Llave oxidada", icon: "??" },
  { id: "paper", label: "Periodico viejo", icon: "??" },
  { id: "cup", label: "Taza de cafe", icon: "?" },
];
