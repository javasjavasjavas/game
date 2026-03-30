import lucyDialogueData from "./dialogue_Lucy.json";
import gamblerDialogueData from "./dialogue_Gambler.json";
import doctorDialogueData from "./dialogue_Doctor.json";
import mysteriousKidDialogueData from "./dialogue_MysteriousKid.json";
import jennyDialogueData from "./dialogue_Jenny.json";
import roseDialogueData from "./dialogue_Rose.json";
import pepeDialogueData from "./dialogue_Pepe.json";
import streetRacerDialogueData from "./dialogue_StreetRacer.json";
import bodyGuardDialogueData from "./dialogue_BodyGuard.json";
import bigBossDialogueData from "./dialogue_BigBoss.json";
import nailsDialogueData from "./dialogue_Nails.json";
import type { DialogueScriptDefinition, DialogueScriptNode, DialogueScriptOption, RoomId } from "../types";

const SCRIPTED_DIALOGUES: DialogueScriptDefinition[] = [
  lucyDialogueData as DialogueScriptDefinition,
  gamblerDialogueData as DialogueScriptDefinition,
  doctorDialogueData as DialogueScriptDefinition,
  mysteriousKidDialogueData as DialogueScriptDefinition,
  jennyDialogueData as DialogueScriptDefinition,
  roseDialogueData as DialogueScriptDefinition,
  pepeDialogueData as DialogueScriptDefinition,
  streetRacerDialogueData as DialogueScriptDefinition,
  bodyGuardDialogueData as DialogueScriptDefinition,
  bigBossDialogueData as DialogueScriptDefinition,
  nailsDialogueData as DialogueScriptDefinition,
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
