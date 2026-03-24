import lucyDialogueData from "./dialogue_Lucy.json";
import gamblerDialogueData from "./dialogue_Gambler.json";
import type { DialogueScriptDefinition, DialogueScriptNode, DialogueScriptOption, RoomId } from "../types";

const SCRIPTED_DIALOGUES: DialogueScriptDefinition[] = [
  lucyDialogueData as DialogueScriptDefinition,
  gamblerDialogueData as DialogueScriptDefinition,
];

export function getScriptedDialogue(npcId: string, roomId: RoomId): DialogueScriptDefinition | null {
  return SCRIPTED_DIALOGUES.find((dialogue) => dialogue.characterId === npcId && dialogue.scene === roomId) ?? null;
}

export function getScriptedDialogueNode(
  dialogue: DialogueScriptDefinition,
  nodeId: string,
): DialogueScriptNode | null {
  return dialogue.nodes.find((node) => node.id === nodeId) ?? null;
}

export function getAvailableScriptOptions(
  node: DialogueScriptNode,
  hasRequirement: (requirement: string) => boolean,
): DialogueScriptOption[] {
  return node.options.filter((option) => !option.requirements || option.requirements.every(hasRequirement));
}
