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

export type CharacterEmotion =
  | "serious"
  | "happy"
  | "sad"
  | "angry"
  | "suspicious"
  | "laughing"
  | "tired"
  | "thinking"
  | "worried"
  | "sensual"
  | "winner";

export interface CharacterDefinition {
  id: string;
  name: string;
  description: string;
  defaultEmotion: CharacterEmotion;
  emotions: Partial<Record<CharacterEmotion, string>>;
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

export interface InventoryItemDefinition {
  id: string;
  label: string;
  image: string;
}

export interface HotspotItemDefinition {
  hotspotId: string;
  itemId: string;
  label: string;
  image: string;
  description: string;
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

export interface DialogueScriptOption {
  id: string;
  text: string;
  type: string;
  requirements?: string[];
  effects?: DialogueScriptEffects;
  next: string;
}

export interface DialogueScriptEffects {
  addFlags?: string[];
  addClues?: string[];
}

export interface DialogueScriptNode {
  id: string;
  speaker: string;
  emotion: CharacterEmotion;
  text: string;
  effects?: DialogueScriptEffects;
  options: DialogueScriptOption[];
}

export interface DialogueConditionalFollowup {
  id: string;
  requirements: string[];
  speaker: string;
  emotion: CharacterEmotion;
  text: string;
}

export interface DialogueScriptDefinition {
  scene: string;
  characterId: string;
  conversationId: string;
  description: string;
  startNode: string;
  nodes: DialogueScriptNode[];
  conditionalFollowups?: DialogueConditionalFollowup[];
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
  flags: Set<string>;
  finished: boolean;
  lastMessage: string;
  hasClue(clueId: string): boolean;
  addClue(clueId: string): void;
  hasFlag(flagId: string): boolean;
  addFlag(flagId: string): void;
}
