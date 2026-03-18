export type RoomId =
  | "bar"
  | "cab"
  | "apartment"
  | "store"
  | "alley"
  | "pharmacy"
  | "arcade"
  | "garage"
  | "restooutside"
  | "restoinside"
  | "street";

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

export type CharacterEmotion = "serious" | "happy" | "sad" | "angry" | "suspicious";

export interface CharacterDefinition {
  id: string;
  name: string;
  description: string;
  defaultEmotion: CharacterEmotion;
  emotions: Record<CharacterEmotion, string>;
}

export interface HotspotDefinition {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  inspectText: string;
}

export interface DialogueOption {
  id: string;
  text: string;
  emotion?: CharacterEmotion;
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
  characterEmotion: CharacterEmotion;
  money: number;
  expenses: string[];
  clues: Set<string>;
  finished: boolean;
  lastMessage: string;
  hasClue(clueId: string): boolean;
  addClue(clueId: string): void;
}
