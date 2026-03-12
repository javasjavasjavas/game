import { CLUES, DIALOGUE, ENDINGS, NPCS } from "./data";
import type { CharacterEmotion, DialogueEntry, Npc, RoomId, SolveResult } from "./types";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function formatTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export class GameState {
  timeMinutes: number;
  currentRoom: RoomId;
  characterEmotion: CharacterEmotion;
  clues: Set<string>;
  finished: boolean;
  lastMessage: string;

  constructor(seed?: Partial<GameState>) {
    this.timeMinutes = seed?.timeMinutes ?? 8 * 60;
    this.currentRoom = seed?.currentRoom ?? "dock";
    this.characterEmotion = seed?.characterEmotion ?? "serious";
    this.clues = new Set(seed?.clues ? [...seed.clues] : []);
    this.finished = seed?.finished ?? false;
    this.lastMessage = seed?.lastMessage ?? "You arrived at Bruma Island. Find who stole the medallion.";
  }

  clone(): GameState {
    return new GameState(this);
  }

  hasClue(clueId: string): boolean {
    return this.clues.has(clueId);
  }

  addClue(clueId: string): void {
    if (!CLUES[clueId]) return;
    this.clues.add(clueId);
  }

  getClueEntries(): Array<{ id: string; text: string }> {
    return [...this.clues].map((id) => ({ id, text: CLUES[id] }));
  }

  advanceTime(minutes = 30): void {
    if (this.finished) return;
    this.timeMinutes = Math.min(this.timeMinutes + minutes, 22 * 60);
    if (this.timeMinutes >= 22 * 60) {
      this.finished = true;
      this.lastMessage = ENDINGS.late;
    }
  }

  roomForNpc(npcId: string) {
    const npc = NPCS.find((n) => n.id === npcId);
    if (!npc) return null;
    const match = npc.schedule.find(
      (slot) => this.timeMinutes >= toMinutes(slot.from) && this.timeMinutes < toMinutes(slot.to)
    );
    return match ? match.room : npc.schedule[npc.schedule.length - 1].room;
  }

  npcsInRoom(roomId: string): Npc[] {
    return NPCS.filter((npc) => this.roomForNpc(npc.id) === roomId);
  }

  getDialogue(npcId: string): DialogueEntry | null {
    const data = DIALOGUE[npcId];
    if (!data) return null;
    const options = data.options.filter((op) => !op.requirement || op.requirement(this));
    return { intro: data.intro, options };
  }

  pickDialogue(npcId: string, optionId: string): string {
    const data = DIALOGUE[npcId];
    if (!data) return "There is nothing else to ask.";
    const option = data.options.find((op) => op.id === optionId);
    if (!option) return "There is nothing else to ask.";
    if (option.requirement && !option.requirement(this)) return "This is not the right moment for that question.";
    this.characterEmotion = option.emotion ?? "serious";
    const text = option.onPick ? option.onPick(this) : "No answer.";
    this.advanceTime(20);
    this.lastMessage = text;
    return text;
  }

  solve(accusedId: string): SolveResult {
    if (this.timeMinutes >= 22 * 60) {
      this.finished = true;
      this.lastMessage = ENDINGS.late;
      return { ok: false, ending: ENDINGS.late };
    }

    const hasAllCoreClues = this.hasClue("tornJacket") && this.hasClue("keyLog") && this.hasClue("witness");

    this.finished = true;
    if (accusedId === "bruno" && hasAllCoreClues) {
      this.lastMessage = ENDINGS.solved;
      return { ok: true, ending: ENDINGS.solved };
    }

    this.lastMessage = ENDINGS.wrong;
    return { ok: false, ending: ENDINGS.wrong };
  }
}
