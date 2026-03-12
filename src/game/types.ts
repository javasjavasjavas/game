export type RoomId = "dock" | "lobby" | "beach" | "lighthouse";

export interface Room {
  id: RoomId;
  name: string;
  description: string;
  exits: RoomId[];
}

export interface NpcScheduleSlot {
  from: string;
  to: string;
  room: RoomId;
}

export interface Npc {
  id: string;
  name: string;
  schedule: NpcScheduleSlot[];
}

export interface DialogueOption {
  id: string;
  text: string;
  requirement?: (state: GameState) => boolean;
  onPick?: (state: GameState) => string;
}

export interface DialogueEntry {
  intro: string;
  options: DialogueOption[];
}

export interface SolveResult {
  ok: boolean;
  ending: string;
}

// Forward declaration pattern for function signatures.
export interface GameState {
  timeMinutes: number;
  currentRoom: RoomId;
  clues: Set<string>;
  finished: boolean;
  lastMessage: string;
  hasClue(clueId: string): boolean;
  addClue(clueId: string): void;
}
