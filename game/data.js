export const ROOMS = {
  dock: {
    id: "dock",
    name: "Muelle",
    color: 0x355c70,
    description: "Madera húmeda, cuerdas viejas y el mar golpeando en silencio.",
    exits: ["lobby", "beach"],
  },
  lobby: {
    id: "lobby",
    name: "Lobby del Hotel",
    color: 0x705439,
    description: "Recepción vacía, olor a café frío y una campana de bronce.",
    exits: ["dock", "beach", "lighthouse"],
  },
  beach: {
    id: "beach",
    name: "Playa Norte",
    color: 0x5f7a48,
    description: "Arena oscura y un viento que tapa voces lejanas.",
    exits: ["dock", "lobby", "lighthouse"],
  },
  lighthouse: {
    id: "lighthouse",
    name: "Faro",
    color: 0x586069,
    description: "Escaleras metálicas, sal pegada en paredes y vista total de la isla.",
    exits: ["lobby", "beach"],
  },
};

export const NAMES = {
  ana: "Ana Ledesma",
  bruno: "Bruno Varela",
  carlos: "Carlos Mena",
};

export const NPCS = [
  {
    id: "ana",
    name: NAMES.ana,
    schedule: [
      { from: "08:00", to: "11:00", room: "beach" },
      { from: "11:00", to: "14:00", room: "lobby" },
      { from: "14:00", to: "18:00", room: "dock" },
      { from: "18:00", to: "22:00", room: "lobby" },
    ],
  },
  {
    id: "bruno",
    name: NAMES.bruno,
    schedule: [
      { from: "08:00", to: "10:00", room: "dock" },
      { from: "10:00", to: "13:00", room: "lobby" },
      { from: "13:00", to: "16:00", room: "lighthouse" },
      { from: "16:00", to: "22:00", room: "beach" },
    ],
  },
  {
    id: "carlos",
    name: NAMES.carlos,
    schedule: [
      { from: "08:00", to: "12:00", room: "lobby" },
      { from: "12:00", to: "17:00", room: "dock" },
      { from: "17:00", to: "22:00", room: "lighthouse" },
    ],
  },
];

export const CLUES = {
  tornJacket: "Chaqueta rasgada con pintura del faro",
  keyLog: "Registro de llave del faro alterado",
  witness: "Testimonio de Ana: Bruno salió del faro nervioso",
};

export const DIALOGUE = {
  ana: {
    intro: "No quiero problemas, detective. Vi cosas raras hoy.",
    options: [
      {
        id: "ana-witness",
        text: "¿Qué viste cerca del faro?",
        requirement: (state) => state.timeMinutes >= 14 * 60 && !state.hasClue("witness"),
        onPick: (state) => {
          state.addClue("witness");
          return "A las 14:20 vi a Bruno bajar del faro con la chaqueta rota.";
        },
      },
      {
        id: "ana-routine",
        text: "¿Dónde estuviste todo el día?",
        onPick: () =>
          "De mañana en la playa, luego en el lobby. Después fui al muelle a tomar aire.",
      },
    ],
  },
  bruno: {
    intro: "No me gustan los interrogatorios. Tengo trabajo.",
    options: [
      {
        id: "bruno-jacket",
        text: "Tu chaqueta tiene un corte extraño.",
        requirement: (state) => state.timeMinutes >= 13 * 60 && !state.hasClue("tornJacket"),
        onPick: (state) => {
          state.addClue("tornJacket");
          return "Bruno intenta ocultarla, pero se ve pintura gris de la torre del faro.";
        },
      },
      {
        id: "bruno-alibi",
        text: "¿Dónde estabas a las 14:00?",
        onPick: () => "En la playa, seguro. Nadie puede probar lo contrario.",
      },
    ],
  },
  carlos: {
    intro: "El hotel se está hundiendo en chismes. Pregunte rápido.",
    options: [
      {
        id: "carlos-key",
        text: "Necesito saber quién usó la llave del faro.",
        requirement: (state) => state.timeMinutes >= 12 * 60 && !state.hasClue("keyLog"),
        onPick: (state) => {
          state.addClue("keyLog");
          return "El libro marca una firma borrada justo en el turno de Bruno.";
        },
      },
      {
        id: "carlos-mood",
        text: "¿Cómo estaba Bruno hoy?",
        onPick: () => "Tenso desde el almuerzo. Evitaba mirarme.",
      },
    ],
  },
};

export const ENDINGS = {
  solved:
    "Resolviste el caso: Bruno robó el medallón y trató de culpar a Ana.",
  wrong:
    "Acusación incorrecta. El sospechoso se fue en el último bote y el caso queda abierto.",
  late:
    "Demasiado tarde. Son las 22:00 y la isla queda aislada por la noche.",
};
