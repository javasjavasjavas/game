import { CLUES, DIALOGUE, ENDINGS, NPCS } from "./data.js";

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function formatTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export class GameState {
  constructor() {
    this.timeMinutes = 8 * 60;
    this.currentRoom = "dock";
    this.clues = new Set();
    this.finished = false;
    this.lastMessage = "Llegaste a Isla Bruma. Encuentra quién robó el medallón.";
  }

  hasClue(clueId) {
    return this.clues.has(clueId);
  }

  addClue(clueId) {
    if (!CLUES[clueId]) return;
    this.clues.add(clueId);
  }

  getClueEntries() {
    return [...this.clues].map((id) => ({ id, text: CLUES[id] }));
  }

  advanceTime(minutes = 30) {
    if (this.finished) return;
    this.timeMinutes = Math.min(this.timeMinutes + minutes, 22 * 60);
    if (this.timeMinutes >= 22 * 60) {
      this.finished = true;
      this.lastMessage = ENDINGS.late;
    }
  }

  roomForNpc(npcId) {
    const npc = NPCS.find((n) => n.id === npcId);
    if (!npc) return null;
    const match = npc.schedule.find(
      (slot) => this.timeMinutes >= toMinutes(slot.from) && this.timeMinutes < toMinutes(slot.to)
    );
    return match ? match.room : npc.schedule[npc.schedule.length - 1].room;
  }

  npcsInRoom(roomId) {
    return NPCS.filter((npc) => this.roomForNpc(npc.id) === roomId);
  }

  getDialogue(npcId) {
    const data = DIALOGUE[npcId];
    if (!data) return null;
    const options = data.options.filter((op) => !op.requirement || op.requirement(this));
    return {
      intro: data.intro,
      options,
    };
  }

  pickDialogue(npcId, optionId) {
    const data = DIALOGUE[npcId];
    if (!data) return "No hay nada más para preguntar.";
    const option = data.options.find((op) => op.id === optionId);
    if (!option) return "No hay nada más para preguntar.";
    if (option.requirement && !option.requirement(this)) return "No parece buen momento para esa pregunta.";
    const text = option.onPick ? option.onPick(this) : "Sin respuesta.";
    this.advanceTime(20);
    this.lastMessage = text;
    return text;
  }

  solve(accusedId) {
    if (this.timeMinutes >= 22 * 60) {
      this.finished = true;
      this.lastMessage = ENDINGS.late;
      return { ok: false, ending: ENDINGS.late };
    }

    const hasAllCoreClues =
      this.hasClue("tornJacket") && this.hasClue("keyLog") && this.hasClue("witness");

    this.finished = true;
    if (accusedId === "bruno" && hasAllCoreClues) {
      this.lastMessage = ENDINGS.solved;
      return { ok: true, ending: ENDINGS.solved };
    }

    this.lastMessage = ENDINGS.wrong;
    return { ok: false, ending: ENDINGS.wrong };
  }
}
