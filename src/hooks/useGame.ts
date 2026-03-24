import { useMemo, useState } from "react";
import { CHARACTER_BY_ID, CLUES, HOTSPOT_ITEM_BY_ID, INVENTORY_ITEMS, NPCS, ROOMS, STAGE_HOTSPOTS_BY_ROOM } from "../game/data";
import { getAvailableScriptOptions, getScriptedDialogue, getScriptedDialogueNode } from "../game/dialogues";
import { formatTime, GameState } from "../game/state";
import type {
  DialogueEntry,
  DialogueScriptDefinition,
  DialogueScriptEffects,
  DialogueScriptNode,
  HotspotDefinition,
  HotspotItemDefinition,
  InventoryItemDefinition,
  RoomId,
} from "../game/types";

export type CursorMode = "none" | "talk" | "use" | "inspect";

export interface CharacterMemory {
  npcId: string;
  name: string;
  description: string;
  portrait: string;
  clues: string[];
  hasNewClue: boolean;
}

export interface SceneAction {
  id: string;
  label: string;
  icon?: string;
  onClick: () => void;
}

type ScriptedConversationState =
  | { kind: "node"; conversationId: string; nodeId: string }
  | { kind: "followup"; conversationId: string; followupId: string; text: string }
  | null;

const APARTMENT_HOTSPOT_REQUIREMENTS: Partial<Record<string, string>> = {
  "apartment-jacket-pocket": "lucy_explains_photo_in_jacket",
  "apartment-computer-screen": "lucy_explains_bar_address_in_email",
};

export function useGame() {
  const [game, setGame] = useState(() => new GameState());
  const [currentTalkNpcId, setCurrentTalkNpcId] = useState<string | null>(null);
  const [conversationText, setConversationText] = useState("");
  const [inspectOpen, setInspectOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(null);
  const [hoverCharacter, setHoverCharacter] = useState(false);
  const [hoverHotspot, setHoverHotspot] = useState(false);
  const [moneyDetailsOpen, setMoneyDetailsOpen] = useState(false);
  const [characterMemoryByNpc, setCharacterMemoryByNpc] = useState<Record<string, CharacterMemory>>({});
  const [expandedCharacterMemoryId, setExpandedCharacterMemoryId] = useState<string | null>(null);
  const [conversationHasClue, setConversationHasClue] = useState(false);
  const [roomBeforeCab, setRoomBeforeCab] = useState<RoomId>("bar");
  const [inspectedHotspotId, setInspectedHotspotId] = useState<string | null>(null);
  const [inspectOverrideText, setInspectOverrideText] = useState<string | null>(null);
  const [elevatorChoiceOpen, setElevatorChoiceOpen] = useState(false);
  const [ownedInventoryIds, setOwnedInventoryIds] = useState<string[]>([]);
  const [collectedHotspotItemIds, setCollectedHotspotItemIds] = useState<string[]>([]);
  const [itemPopup, setItemPopup] = useState<HotspotItemDefinition | null>(null);
  const [scriptedConversationState, setScriptedConversationState] = useState<ScriptedConversationState>(null);
  const [scriptedNodeByConversationId, setScriptedNodeByConversationId] = useState<Record<string, string>>({});
  const [, setScriptedBackStack] = useState<Array<{ conversationId: string; nodeId: string; optionId: string }>>([]);
  const [usedScriptOptionKeysByConversationId, setUsedScriptOptionKeysByConversationId] = useState<Record<string, string[]>>({});

  const room = ROOMS[game.currentRoom];
  const clues = game.getClueEntries();
  const npcsHere = game.npcsInRoom(game.currentRoom);
  const hasRequirement = (requirement: string) =>
    game.hasFlag(requirement) || game.hasClue(requirement) || ownedInventoryIds.includes(requirement);
  const activeScriptedDialogue = currentTalkNpcId ? getScriptedDialogue(currentTalkNpcId, game.currentRoom) : null;
  const getOptionKey = (nodeId: string, optionId: string) => `${nodeId}:${optionId}`;
  const isOptionUsed = (conversationId: string, nodeId: string, optionId: string) =>
    usedScriptOptionKeysByConversationId[conversationId]?.includes(getOptionKey(nodeId, optionId)) ?? false;
  const getRemainingScriptOptions = (dialogue: DialogueScriptDefinition, node: DialogueScriptNode) =>
    getAvailableScriptOptions(node, hasRequirement).filter(
      (option) => !isOptionUsed(dialogue.conversationId, node.id, option.id),
    );
  const getLatestFollowup = (dialogue: DialogueScriptDefinition) =>
    (dialogue.conditionalFollowups ?? []).filter((followup) => followup.requirements.every(hasRequirement)).at(-1) ?? null;
  const getScriptNodeText = (dialogue: DialogueScriptDefinition, node: DialogueScriptNode) => {
    if (dialogue.characterId !== "lucy" || dialogue.scene !== "apartment") {
      return node.text;
    }

    const alreadySharedStartingPoints =
      game.hasFlag("lucy_explains_photo_in_jacket") ||
      game.hasFlag("lucy_explains_bar_address_in_email") ||
      game.hasFlag("player_directed_to_jacket_and_email");

    if (node.id === "lucy_intro_001" && alreadySharedStartingPoints) {
      return "You already have the photo and the Bar lead. If you still need something from me, ask it now.";
    }

    if (node.id === "lucy_starting_points_001" && alreadySharedStartingPoints) {
      return "Like I told you already: Blondie's photo is in your jacket, and the Bar address is in the email on your computer. That is still your best lead.";
    }

    return node.text;
  };
  const applyScriptEffects = (draft: GameState, effects?: DialogueScriptEffects) => {
    if (!effects) return;
    effects.addFlags?.forEach((flag) => draft.addFlag(flag));
    effects.addClues?.forEach((clueId) => draft.addClue(clueId));
  };
  const applyNodeEffects = (draft: GameState, node: DialogueScriptNode | null) => {
    applyScriptEffects(draft, node?.effects);
  };
  const recordCluesForCharacter = (npcId: string, clueIds: string[]) => {
    if (clueIds.length === 0) return;
    const discoveredClueTexts = clueIds.map((clueId) => CLUES[clueId] ?? clueId);
    setCharacterMemoryByNpc((prev) => {
      const current = prev[npcId];
      if (!current) return prev;
      const merged = [...discoveredClueTexts, ...current.clues];
      const unique = merged.filter((item, index) => merged.indexOf(item) === index).slice(0, 8);
      return {
        ...prev,
        [npcId]: {
          ...current,
          clues: unique,
          hasNewClue: true,
        },
      };
    });
  };

  const conversation = useMemo(() => {
    if (!currentTalkNpcId || currentTalkNpcId === "selector") return null;
    const npc = NPCS.find((item) => item.id === currentTalkNpcId);
    let dialogue: DialogueEntry | null = null;
    if (activeScriptedDialogue) {
      if (
        scriptedConversationState?.kind === "node" &&
        scriptedConversationState.conversationId === activeScriptedDialogue.conversationId
      ) {
        const node = getScriptedDialogueNode(activeScriptedDialogue, scriptedConversationState.nodeId);
        dialogue = node
          ? {
              intro: getScriptNodeText(activeScriptedDialogue, node),
              options: getRemainingScriptOptions(activeScriptedDialogue, node).map((option) => ({ id: option.id, text: option.text })),
            }
          : null;
      } else if (
        scriptedConversationState?.kind === "followup" &&
        scriptedConversationState.conversationId === activeScriptedDialogue.conversationId
      ) {
        dialogue = { intro: scriptedConversationState.text, options: [] };
      }
    }
    if (!dialogue) {
      dialogue = game.getDialogue(currentTalkNpcId);
    }
    return { npc, dialogue };
  }, [activeScriptedDialogue, currentTalkNpcId, game, hasRequirement, scriptedConversationState]);

  const selectedItem = INVENTORY_ITEMS.find((item) => item.id === selectedInventoryId) ?? null;
  const ownedInventoryItems = useMemo<InventoryItemDefinition[]>(
    () => INVENTORY_ITEMS.filter((item) => ownedInventoryIds.includes(item.id)),
    [ownedInventoryIds],
  );
  const characterMemories = useMemo(() => Object.values(characterMemoryByNpc), [characterMemoryByNpc]);
  const expandedCharacterMemory = expandedCharacterMemoryId ? characterMemoryByNpc[expandedCharacterMemoryId] ?? null : null;
  const inspectedHotspot: HotspotDefinition | null = useMemo(() => {
    if (!inspectedHotspotId) return null;
    const hotspots = STAGE_HOTSPOTS_BY_ROOM[game.currentRoom] ?? [];
    return hotspots.find((hotspot) => hotspot.id === inspectedHotspotId) ?? null;
  }, [game.currentRoom, inspectedHotspotId]);
  const inspectedHotspotText = inspectOverrideText ?? inspectedHotspot?.inspectText ?? null;
  const visibleHotspots = useMemo(() => {
    const hotspots = STAGE_HOTSPOTS_BY_ROOM[game.currentRoom] ?? [];
    if (game.currentRoom !== "apartment") return hotspots;
    return hotspots.filter((hotspot) => {
      const requiredFlag = APARTMENT_HOTSPOT_REQUIREMENTS[hotspot.id];
      return !requiredFlag || game.hasFlag(requiredFlag);
    });
  }, [game]);
  const canOpenMap = game.hasFlag("entered_city_map");
  const availableMapRooms = canOpenMap ? (["apartment", "bar"] as RoomId[]) : [];
  const canGoBackConversation = Boolean(
    activeScriptedDialogue &&
      scriptedConversationState?.kind === "node" &&
      scriptedConversationState.conversationId === activeScriptedDialogue.conversationId &&
      scriptedConversationState.nodeId !== activeScriptedDialogue.startNode,
  );

  const cursorMode: CursorMode = selectedInventoryId
    ? "use"
    : hoverCharacter && !game.finished
      ? "talk"
      : hoverHotspot && !game.finished
        ? "inspect"
        : "none";

  const mutate = (fn: (draft: GameState) => void) => {
    setGame((prev) => {
      const next = prev.clone();
      fn(next);
      return next;
    });
  };

  const moveRoom = (roomId: RoomId, travelMinutes = 15) => {
    mutate((draft) => {
      if (draft.finished || draft.currentRoom === roomId) return;
      draft.currentRoom = roomId;
      draft.advanceTime(travelMinutes);
      draft.lastMessage = `You moved to ${ROOMS[roomId].name}.`;
    });
    setCurrentTalkNpcId(null);
    setInspectOpen(false);
    setHoverHotspot(false);
    setInspectedHotspotId(null);
    setInspectOverrideText(null);
    setScriptedConversationState(null);
    setScriptedBackStack([]);
  };

  const setCurrentRoomInstant = (roomId: RoomId) => {
    mutate((draft) => {
      if (draft.currentRoom === roomId) return;
      draft.currentRoom = roomId;
      draft.lastMessage = `You arrived at ${ROOMS[roomId].name}.`;
    });
    setCurrentTalkNpcId(null);
    setInspectOpen(false);
    setConversationHasClue(false);
    setHoverHotspot(false);
    setInspectedHotspotId(null);
    setInspectOverrideText(null);
    setScriptedConversationState(null);
    setScriptedBackStack([]);
  };

  const wait = () => {
    mutate((draft) => {
      if (draft.finished) return;
      draft.advanceTime(30);
      draft.lastMessage = "You waited 30 minutes.";
    });
    setCurrentTalkNpcId(null);
    setInspectOpen(false);
    setHoverHotspot(false);
    setInspectedHotspotId(null);
    setInspectOverrideText(null);
    setScriptedConversationState(null);
    setScriptedBackStack([]);
  };

  const talkToNpc = (npcId: string) => {
    setConversationHasClue(false);
    ensureCharacterMemory(npcId);
    setInspectOpen(false);
    setInspectedHotspotId(null);
    setInspectOverrideText(null);
    setCurrentTalkNpcId(npcId);
    const scriptedDialogue = getScriptedDialogue(npcId, game.currentRoom);
    if (scriptedDialogue) {
      const nextGame = game.clone();
      const savedNodeId = scriptedNodeByConversationId[scriptedDialogue.conversationId];
      const savedNode = savedNodeId ? getScriptedDialogueNode(scriptedDialogue, savedNodeId) : null;
      const savedNodeHasOptions = savedNode ? getRemainingScriptOptions(scriptedDialogue, savedNode).length > 0 : false;
      const rootNode = getScriptedDialogueNode(scriptedDialogue, scriptedDialogue.startNode);
      const rootNodeHasOptions = rootNode ? getRemainingScriptOptions(scriptedDialogue, rootNode).length > 0 : false;
      const hasNamedLeads =
        game.hasFlag("lucy_explains_photo_in_jacket") ||
        game.hasFlag("lucy_explains_bar_address_in_email") ||
        game.hasFlag("player_directed_to_jacket_and_email");
      const followup = !savedNodeHasOptions && hasNamedLeads ? getLatestFollowup(scriptedDialogue) : null;

      if (rootNode && rootNodeHasOptions) {
        applyNodeEffects(nextGame, rootNode);
        nextGame.characterEmotion = rootNode.emotion;
        nextGame.lastMessage = getScriptNodeText(scriptedDialogue, rootNode);
        setScriptedConversationState({
          kind: "node",
          conversationId: scriptedDialogue.conversationId,
          nodeId: rootNode.id,
        });
        setScriptedNodeByConversationId((prev) => ({
          ...prev,
          [scriptedDialogue.conversationId]: rootNode.id,
        }));
        setScriptedBackStack([]);
        setGame(nextGame);
        setConversationText(getScriptNodeText(scriptedDialogue, rootNode));
        return;
      }

      if (savedNode && savedNodeHasOptions) {
        applyNodeEffects(nextGame, savedNode);
        nextGame.characterEmotion = savedNode.emotion;
        nextGame.lastMessage = getScriptNodeText(scriptedDialogue, savedNode);
        setScriptedConversationState({
          kind: "node",
          conversationId: scriptedDialogue.conversationId,
          nodeId: savedNode.id,
        });
        setScriptedBackStack([]);
        setGame(nextGame);
        setConversationText(getScriptNodeText(scriptedDialogue, savedNode));
        return;
      }

      if (followup) {
        nextGame.characterEmotion = followup.emotion;
        nextGame.lastMessage = followup.text;
        setScriptedConversationState({
          kind: "followup",
          conversationId: scriptedDialogue.conversationId,
          followupId: followup.id,
          text: followup.text,
        });
        setScriptedBackStack([]);
        setGame(nextGame);
        setConversationText(followup.text);
        return;
      }

      const nextNode =
        (hasNamedLeads
          ? getScriptedDialogueNode(scriptedDialogue, "lucy_check_both_001") ??
            getScriptedDialogueNode(scriptedDialogue, "lucy_starting_points_001")
          : null) ?? getScriptedDialogueNode(scriptedDialogue, scriptedDialogue.startNode);

      if (nextNode) {
        applyNodeEffects(nextGame, nextNode);
        nextGame.characterEmotion = nextNode.emotion;
        nextGame.lastMessage = getScriptNodeText(scriptedDialogue, nextNode);
        setScriptedConversationState({
          kind: "node",
          conversationId: scriptedDialogue.conversationId,
          nodeId: nextNode.id,
        });
        setScriptedNodeByConversationId((prev) => ({
          ...prev,
          [scriptedDialogue.conversationId]: nextNode.id,
        }));
        setScriptedBackStack([]);
        setGame(nextGame);
        setConversationText(getScriptNodeText(scriptedDialogue, nextNode));
        return;
      }
    }
    setScriptedConversationState(null);
    mutate((draft) => {
      draft.characterEmotion = CHARACTER_BY_ID[npcId]?.defaultEmotion ?? "serious";
    });
    const dialogue = game.getDialogue(npcId);
    setConversationText(dialogue?.intro || "They do not seem willing to talk.");
  };

  const openTalkSelector = () => {
    if (npcsHere.length === 0) {
      mutate((draft) => {
        draft.lastMessage = "There is no one here to talk to.";
      });
      return;
    }
    if (npcsHere.length === 1) {
      talkToNpc(npcsHere[0].id);
      return;
    }
    setInspectOpen(false);
    setInspectedHotspotId(null);
    setCurrentTalkNpcId("selector");
    setConversationText("Who do you want to talk to?");
  };

  const closeConversation = () => {
    setCurrentTalkNpcId(null);
    setConversationText("");
    setConversationHasClue(false);
    setScriptedConversationState(null);
    setScriptedBackStack([]);
  };

  const pickDialogueOption = (npcId: string, optionId: string) => {
    const scriptedDialogue = getScriptedDialogue(npcId, game.currentRoom);
    if (
      scriptedDialogue &&
      scriptedConversationState?.kind === "node" &&
      scriptedConversationState.conversationId === scriptedDialogue.conversationId
    ) {
      const currentNode = getScriptedDialogueNode(scriptedDialogue, scriptedConversationState.nodeId);
      const selectedOption = currentNode
        ? getRemainingScriptOptions(scriptedDialogue, currentNode).find((option) => option.id === optionId)
        : null;
      if (selectedOption?.requirements && !selectedOption.requirements.every(hasRequirement)) {
        setConversationText("This is not the right moment for that question.");
        return;
      }
      const nextNode = selectedOption ? getScriptedDialogueNode(scriptedDialogue, selectedOption.next) : null;
      if (!selectedOption || !nextNode) {
        setConversationText("There is nothing else to ask.");
        return;
      }

      const nextGame = game.clone();
      const beforeFlags = new Set(nextGame.flags);
      const beforeClues = new Set(nextGame.clues);
      applyScriptEffects(nextGame, selectedOption.effects);
      applyNodeEffects(nextGame, nextNode);
      nextGame.characterEmotion = nextNode.emotion;
      nextGame.advanceTime(5);
      nextGame.lastMessage = getScriptNodeText(scriptedDialogue, nextNode);
      setGame(nextGame);
      setScriptedConversationState({
        kind: "node",
        conversationId: scriptedDialogue.conversationId,
        nodeId: nextNode.id,
      });
      setScriptedNodeByConversationId((prev) => ({
        ...prev,
        [scriptedDialogue.conversationId]: nextNode.id,
      }));
      if (currentNode) {
        setUsedScriptOptionKeysByConversationId((prev) => {
          const currentKeys = prev[scriptedDialogue.conversationId] ?? [];
          const optionKey = getOptionKey(currentNode.id, selectedOption.id);
          if (currentKeys.includes(optionKey)) return prev;
          return {
            ...prev,
            [scriptedDialogue.conversationId]: [...currentKeys, optionKey],
          };
        });
      }
      if (currentNode) {
        setScriptedBackStack((prev) => [
          ...prev,
          {
            conversationId: scriptedDialogue.conversationId,
            nodeId: currentNode.id,
            optionId: selectedOption.id,
          },
        ]);
      }
      setConversationText(getScriptNodeText(scriptedDialogue, nextNode));
      const discoveredFlags = [...nextGame.flags].filter((flag) => !beforeFlags.has(flag));
      const discoveredClues = [...nextGame.clues].filter((clueId) => !beforeClues.has(clueId));
      setConversationHasClue(discoveredFlags.length > 0 || discoveredClues.length > 0);
      ensureCharacterMemory(npcId);
      recordCluesForCharacter(npcId, discoveredClues);
      return;
    }

    let response = "";
    let discoveredClues: string[] = [];
    const nextGame = game.clone();
    const before = new Set(nextGame.clues);
    response = nextGame.pickDialogue(npcId, optionId);
    discoveredClues = [...nextGame.clues].filter((id) => !before.has(id));
    setGame(nextGame);

    setConversationText(response);
    setConversationHasClue(discoveredClues.length > 0);
    ensureCharacterMemory(npcId);
    recordCluesForCharacter(npcId, discoveredClues);
  };

  const solve = (npcId: string) => {
    mutate((draft) => {
      draft.solve(npcId);
    });
  };

  const openAccusationPrompt = () => {
    mutate((draft) => {
      draft.lastMessage = "Who do you accuse of forging the city logs?";
    });
  };

  const toggleInventoryItem = (id: string) => {
    if (!ownedInventoryIds.includes(id)) return;
    setSelectedInventoryId((prev) => (prev === id ? null : id));
  };

  const clearInventorySelection = () => {
    setSelectedInventoryId(null);
  };

  const closeElevatorChoice = () => {
    setElevatorChoiceOpen(false);
  };

  const openRoomInspect = () => {
    setCurrentTalkNpcId(null);
    setConversationText("");
    setConversationHasClue(false);
    setInspectedHotspotId(null);
    setInspectOverrideText(null);
    setElevatorChoiceOpen(false);
    setScriptedConversationState(null);
    setScriptedBackStack([]);
    setInspectOpen(true);
  };

  const openHotspotInspect = (hotspotId: string) => {
    if (currentTalkNpcId) return;
    if (game.currentRoom === "elevator" && hotspotId === "elevator-call-button") {
      setCurrentTalkNpcId(null);
      setConversationText("");
      setConversationHasClue(false);
      setInspectOpen(false);
      setInspectedHotspotId(null);
      setInspectOverrideText(null);
      setScriptedConversationState(null);
      setScriptedBackStack([]);
      setElevatorChoiceOpen(true);
      return;
    }
    const hotspotItem = HOTSPOT_ITEM_BY_ID[hotspotId];
    if (hotspotItem && !collectedHotspotItemIds.includes(hotspotId)) {
      setCurrentTalkNpcId(null);
      setConversationText("");
      setConversationHasClue(false);
      setInspectOpen(false);
      setInspectedHotspotId(null);
      setInspectOverrideText(null);
      setElevatorChoiceOpen(false);
      setScriptedConversationState(null);
      setScriptedBackStack([]);
      setItemPopup(hotspotItem);
      return;
    }

    let overrideText: string | null = null;
    const nextGame = game.clone();
    if (game.currentRoom === "apartment" && hotspotId === "apartment-computer-screen" && !nextGame.hasFlag("bar_address_known")) {
      nextGame.addFlag("bar_address_known");
      nextGame.addClue("bar_address_known");
      nextGame.addFlag("open_city_map_enabled");
      nextGame.addFlag("bar_marked_on_map");
      nextGame.lastMessage = "You found the Bar address in Lucy's email.";
      overrideText =
        "Lucy left the mail open. The message points to <span style=\"color:#f2cf4a\">The Bar, 14 Mercer Street</span>, written plain enough to feel important and dangerous at the same time.";
    }
    if (game.currentRoom === "elevator" && hotspotId === "elevator-neighbor-note" && !nextGame.hasClue("building_neighbor_note")) {
      nextGame.addClue("building_neighbor_note");
      nextGame.lastMessage = "You pocket the neighbor's warning from the elevator wall.";
    }
    if (overrideText) {
      setGame(nextGame);
      ensureCharacterMemory("lucy");
      recordCluesForCharacter("lucy", ["bar_address_known"]);
    } else if (game.currentRoom === "elevator" && hotspotId === "elevator-neighbor-note" && nextGame.hasClue("building_neighbor_note")) {
      setGame(nextGame);
    }

    setCurrentTalkNpcId(null);
    setConversationText("");
    setConversationHasClue(false);
    setInspectOpen(false);
    setElevatorChoiceOpen(false);
    setScriptedConversationState(null);
    setScriptedBackStack([]);
    setInspectOverrideText(overrideText);
    setInspectedHotspotId(hotspotId);
  };

  const closeInspect = () => {
    setInspectOpen(false);
    setInspectedHotspotId(null);
    setInspectOverrideText(null);
  };

  const discardItemPopup = () => {
    setItemPopup(null);
  };

  const pickUpItemFromPopup = () => {
    if (!itemPopup) return;
    if (!ownedInventoryIds.includes(itemPopup.itemId)) {
      setOwnedInventoryIds((prev) => [...prev, itemPopup.itemId]);
    }
    setCollectedHotspotItemIds((prev) => (prev.includes(itemPopup.hotspotId) ? prev : [...prev, itemPopup.hotspotId]));
    mutate((draft) => {
      draft.lastMessage = `You picked up ${itemPopup.label}.`;
    });
    setItemPopup(null);
  };

  const goToElevator = () => {
    mutate((draft) => {
      if (draft.currentRoom !== "apartment") return;
      draft.currentRoom = "elevator";
      draft.advanceTime(1);
      draft.addFlag("entered_elevator");
      draft.lastMessage = "You step into the elevator, carrying Blondie's photo and the Bar lead with you.";
    });
    setCurrentTalkNpcId(null);
    setConversationText("");
    setConversationHasClue(false);
    setInspectOpen(false);
    setHoverHotspot(false);
    setInspectedHotspotId(null);
    setInspectOverrideText(null);
    setScriptedConversationState(null);
    setScriptedBackStack([]);
  };

  const goToRooftop = () => {
    mutate((draft) => {
      if (draft.currentRoom !== "elevator") return;
      draft.currentRoom = "rooftop";
      draft.advanceTime(1);
      draft.addFlag("entered_rooftop");
      draft.lastMessage = "The elevator groans its way up to the rooftop.";
    });
    setCurrentTalkNpcId(null);
    setConversationText("");
    setConversationHasClue(false);
    setInspectOpen(false);
    setHoverHotspot(false);
    setInspectedHotspotId(null);
    setInspectOverrideText(null);
    setElevatorChoiceOpen(false);
    setScriptedConversationState(null);
    setScriptedBackStack([]);
  };

  const returnToElevator = () => {
    mutate((draft) => {
      if (draft.currentRoom !== "rooftop") return;
      draft.currentRoom = "elevator";
      draft.advanceTime(1);
      draft.lastMessage = "You head back into the elevator before the night talks you into staying.";
    });
    setCurrentTalkNpcId(null);
    setConversationText("");
    setConversationHasClue(false);
    setInspectOpen(false);
    setHoverHotspot(false);
    setInspectedHotspotId(null);
    setInspectOverrideText(null);
    setElevatorChoiceOpen(false);
    setScriptedConversationState(null);
    setScriptedBackStack([]);
  };

  const exitBuilding = () => {
    if (!game.hasClue("bar_address_known") && !game.hasFlag("bar_address_known")) {
      mutate((draft) => {
        draft.lastMessage = "You still need the Bar address before heading into the city.";
      });
      return;
    }

    mutate((draft) => {
      if (draft.currentRoom !== "elevator") return;
      draft.addFlag("entered_city_map");
      draft.addFlag("open_city_map_enabled");
      draft.addFlag("bar_marked_on_map");
      draft.advanceTime(2);
      draft.lastMessage = "You leave the building and unfold the city in your head. The Bar is the first real lead.";
    });
    setCurrentTalkNpcId(null);
    setConversationText("");
    setConversationHasClue(false);
    setInspectOpen(false);
    setHoverHotspot(false);
    setInspectedHotspotId(null);
    setInspectOverrideText(null);
    setElevatorChoiceOpen(false);
    setScriptedConversationState(null);
    setScriptedBackStack([]);
    setMapOpen(true);
  };

  const takeCab = () => {
    const fare = 18;
    if (game.finished) return;
    if (game.currentRoom === "cab") return;
    if (game.currentRoom === "apartment" || game.currentRoom === "elevator" || game.currentRoom === "rooftop") {
      mutate((draft) => {
        draft.lastMessage = "You need to leave the building before looking for a cab.";
      });
      return;
    }
    if (game.money < fare) {
      mutate((draft) => {
        draft.lastMessage = "Not enough cash for a cab ride.";
      });
      return;
    }

    setRoomBeforeCab(game.currentRoom);
    mutate((draft) => {
      draft.money -= fare;
      draft.expenses = [`Cab fare: -$${fare}`, ...draft.expenses].slice(0, 12);
      draft.currentRoom = "cab";
      draft.advanceTime(10);
      draft.lastMessage = `You took a cab for $${fare}.`;
    });
    setCurrentTalkNpcId(null);
    setInspectOpen(false);
    setConversationHasClue(false);
    setHoverHotspot(false);
    setInspectedHotspotId(null);
    setInspectOverrideText(null);
    setScriptedConversationState(null);
    setScriptedBackStack([]);
  };

  const leaveCab = () => {
    mutate((draft) => {
      if (draft.finished) return;
      if (draft.currentRoom !== "cab") return;
      draft.currentRoom = roomBeforeCab;
      draft.advanceTime(10);
      draft.lastMessage = `You left the cab and returned to ${ROOMS[roomBeforeCab].name}.`;
    });
    setCurrentTalkNpcId(null);
    setInspectOpen(false);
    setConversationHasClue(false);
    setHoverHotspot(false);
    setInspectedHotspotId(null);
    setInspectOverrideText(null);
    setScriptedConversationState(null);
    setScriptedBackStack([]);
  };

  const goBackConversation = () => {
    if (!activeScriptedDialogue) return;
    const currentState = scriptedConversationState;
    if (!currentState || currentState.kind !== "node" || currentState.conversationId !== activeScriptedDialogue.conversationId) return;

    const previousNode = getScriptedDialogueNode(activeScriptedDialogue, activeScriptedDialogue.startNode);
    if (!previousNode) return;

    setScriptedBackStack([]);
    setScriptedConversationState({
      kind: "node",
      conversationId: activeScriptedDialogue.conversationId,
      nodeId: previousNode.id,
    });
    setScriptedNodeByConversationId((prev) => ({
      ...prev,
      [activeScriptedDialogue.conversationId]: previousNode.id,
    }));
    setConversationHasClue(false);
    setConversationText(getScriptNodeText(activeScriptedDialogue, previousNode));
  };

  const toggleMap = () => {
    if (!canOpenMap) {
      mutate((draft) => {
        draft.lastMessage =
          draft.currentRoom === "apartment"
            ? "You have the Bar address. Leave the apartment first."
            : "Leave the building first. That is when the city map opens up.";
      });
      return;
    }
    setMapOpen((prev) => !prev);
  };

  const sceneActions = useMemo<SceneAction[]>(() => {
    if (game.currentRoom === "apartment" && (game.hasClue("bar_address_known") || game.hasFlag("bar_address_known"))) {
      return [
        {
          id: "leave-apartment",
          label: "Leave Apartment",
          icon: "/game-assets/icon_map.png",
          onClick: goToElevator,
        },
      ];
    }

    if (game.currentRoom === "elevator") {
      return [];
    }

    if (game.currentRoom === "rooftop") {
      return [
        {
          id: "return-elevator",
          label: "Return to Elevator",
          icon: "/game-assets/icon_map.png",
          onClick: returnToElevator,
        },
      ];
    }

    return [];
  }, [game, goToElevator, returnToElevator]);

  const ensureCharacterMemory = (npcId: string) => {
    const npc = NPCS.find((item) => item.id === npcId);
    if (!npc) return;
    const characterData = CHARACTER_BY_ID[npcId];

    setCharacterMemoryByNpc((prev) => {
      if (prev[npcId]) return prev;
      return {
        ...prev,
        [npcId]: {
          npcId,
          name: npc.name,
          description: characterData?.description ?? `${npc.name} is a person of interest in this district.`,
          portrait: characterData?.emotions[characterData.defaultEmotion] ?? "/game-assets/character_big_boss_serious.png",
          clues: [],
          hasNewClue: false,
        },
      };
    });
  };

  const toggleCharacterMemory = (npcId: string) => {
    setExpandedCharacterMemoryId((prev) => (prev === npcId ? null : npcId));
    setCharacterMemoryByNpc((prev) => {
      const current = prev[npcId];
      if (!current || !current.hasNewClue) return prev;
      return {
        ...prev,
        [npcId]: {
          ...current,
          hasNewClue: false,
        },
      };
    });
  };

  return {
    game,
    room,
    clues,
    npcsHere,
    conversation,
    selectedItem,
    ownedInventoryItems,
    sceneActions,
    cursorMode,
    currentTalkNpcId,
    conversationText,
    inspectOpen,
    elevatorChoiceOpen,
    mapOpen,
    moneyDetailsOpen,
    selectedInventoryId,
    itemPopup,
    canOpenMap,
    availableMapRooms,
    canGoBackConversation,
    setMapOpen,
    setInspectOpen,
    setHoverCharacter,
    setHoverHotspot,
    setCurrentRoomInstant,
    toggleMoneyDetails: () => setMoneyDetailsOpen((prev) => !prev),
    moveRoom,
    wait,
    talkToNpc,
    openTalkSelector,
    closeConversation,
    pickDialogueOption,
    solve,
    openAccusationPrompt,
    takeCab,
    leaveCab,
    goToElevator,
    goToRooftop,
    returnToElevator,
    exitBuilding,
    goBackConversation,
    toggleMap,
    toggleInventoryItem,
    clearInventorySelection,
    openRoomInspect,
    openHotspotInspect,
    closeInspect,
    closeElevatorChoice,
    discardItemPopup,
    pickUpItemFromPopup,
    characterMemories,
    expandedCharacterMemory,
    toggleCharacterMemory,
    conversationHasClue,
    moneyExpenses: game.expenses,
    formattedTime: formatTime(game.timeMinutes),
    inspectedHotspot,
    inspectedHotspotText,
    visibleHotspots,
  };
}
