import { useMemo, useState } from "react";
import lucyDialogueData from "../game/dialogues/dialogue_Lucy.json";
import { CHARACTER_BY_ID, CLUES, HOTSPOT_ITEM_BY_ID, INVENTORY_ITEMS, NPCS, ROOMS, STAGE_HOTSPOTS_BY_ROOM } from "../game/data";
import { formatTime, GameState } from "../game/state";
import type {
  DialogueEntry,
  DialogueScriptDefinition,
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

type ScriptedConversationState =
  | { kind: "lucy_node"; nodeId: string }
  | { kind: "lucy_followup"; followupId: string }
  | null;

const LUCY_DIALOGUE = lucyDialogueData as DialogueScriptDefinition;
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
  const [ownedInventoryIds, setOwnedInventoryIds] = useState<string[]>(["key", "cup"]);
  const [collectedHotspotItemIds, setCollectedHotspotItemIds] = useState<string[]>([]);
  const [itemPopup, setItemPopup] = useState<HotspotItemDefinition | null>(null);
  const [scriptedConversationState, setScriptedConversationState] = useState<ScriptedConversationState>(null);

  const room = ROOMS[game.currentRoom];
  const clues = game.getClueEntries();
  const npcsHere = game.npcsInRoom(game.currentRoom);
  const hasRequirement = (requirement: string) =>
    game.hasFlag(requirement) || game.hasClue(requirement) || ownedInventoryIds.includes(requirement);
  const getLucyNode = (nodeId: string) => LUCY_DIALOGUE.nodes.find((node) => node.id === nodeId) ?? null;
  const getLatestLucyFollowup = () =>
    (LUCY_DIALOGUE.conditionalFollowups ?? []).filter((followup) => followup.requirements.every(hasRequirement)).at(-1) ?? null;
  const applyNodeEffects = (draft: GameState, node: DialogueScriptNode | null) => {
    if (!node?.effects?.addFlags) return;
    node.effects.addFlags.forEach((flag) => draft.addFlag(flag));
  };

  const conversation = useMemo(() => {
    if (!currentTalkNpcId || currentTalkNpcId === "selector") return null;
    const npc = NPCS.find((item) => item.id === currentTalkNpcId);
    let dialogue: DialogueEntry | null = null;
    if (currentTalkNpcId === "lucy" && game.currentRoom === "apartment") {
      if (scriptedConversationState?.kind === "lucy_node") {
        const node = getLucyNode(scriptedConversationState.nodeId);
        dialogue = node
          ? {
              intro: node.text,
              options: node.options.map((option) => ({ id: option.id, text: option.text })),
            }
          : null;
      } else if (scriptedConversationState?.kind === "lucy_followup") {
        dialogue = { intro: conversationText, options: [] };
      }
    }
    if (!dialogue) {
      dialogue = game.getDialogue(currentTalkNpcId);
    }
    return { npc, dialogue };
  }, [conversationText, currentTalkNpcId, game, scriptedConversationState]);

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
  const canOpenMap = game.hasFlag("bar_address_known");

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
  };

  const talkToNpc = (npcId: string) => {
    setConversationHasClue(false);
    ensureCharacterMemory(npcId);
    setInspectOpen(false);
    setInspectedHotspotId(null);
    setInspectOverrideText(null);
    setCurrentTalkNpcId(npcId);
    if (npcId === "lucy" && game.currentRoom === "apartment") {
      const lucyHasNamedLeads =
        game.hasFlag("lucy_explains_photo_in_jacket") ||
        game.hasFlag("lucy_explains_bar_address_in_email") ||
        game.hasFlag("player_directed_to_jacket_and_email");
      const followup = lucyHasNamedLeads ? getLatestLucyFollowup() : null;
      const startNode = lucyHasNamedLeads
        ? getLucyNode("lucy_check_both_001") ?? getLucyNode("lucy_starting_points_001") ?? getLucyNode(LUCY_DIALOGUE.startNode)
        : getLucyNode(LUCY_DIALOGUE.startNode);
      const nextGame = game.clone();
      if (followup) {
        nextGame.characterEmotion = followup.emotion;
        nextGame.lastMessage = followup.text;
        setScriptedConversationState({ kind: "lucy_followup", followupId: followup.id });
        setGame(nextGame);
        setConversationText(followup.text);
        return;
      }
      if (startNode) {
        applyNodeEffects(nextGame, startNode);
        nextGame.characterEmotion = startNode.emotion;
        nextGame.lastMessage = startNode.text;
        setScriptedConversationState({ kind: "lucy_node", nodeId: startNode.id });
        setGame(nextGame);
        setConversationText(startNode.text);
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
  };

  const pickDialogueOption = (npcId: string, optionId: string) => {
    if (npcId === "lucy" && game.currentRoom === "apartment" && scriptedConversationState?.kind === "lucy_node") {
      const currentNode = getLucyNode(scriptedConversationState.nodeId);
      const selectedOption = currentNode?.options.find((option) => option.id === optionId);
      const nextNode = selectedOption ? getLucyNode(selectedOption.next) : null;
      if (!selectedOption || !nextNode) {
        setConversationText("There is nothing else to ask.");
        return;
      }

      const nextGame = game.clone();
      const beforeFlags = new Set(nextGame.flags);
      applyNodeEffects(nextGame, nextNode);
      nextGame.characterEmotion = nextNode.emotion;
      nextGame.advanceTime(5);
      nextGame.lastMessage = nextNode.text;
      setGame(nextGame);
      setScriptedConversationState({ kind: "lucy_node", nodeId: nextNode.id });
      setConversationText(nextNode.text);
      const discoveredFlags = [...nextGame.flags].filter((flag) => !beforeFlags.has(flag));
      setConversationHasClue(discoveredFlags.length > 0);
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
    if (discoveredClues.length > 0) {
      const discoveredClueTexts = discoveredClues.map((clueId) => CLUES[clueId] ?? clueId);
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
    }
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

  const openRoomInspect = () => {
    setCurrentTalkNpcId(null);
    setConversationText("");
    setConversationHasClue(false);
    setInspectedHotspotId(null);
    setInspectOverrideText(null);
    setScriptedConversationState(null);
    setInspectOpen(true);
  };

  const openHotspotInspect = (hotspotId: string) => {
    const hotspotItem = HOTSPOT_ITEM_BY_ID[hotspotId];
    if (hotspotItem && !collectedHotspotItemIds.includes(hotspotId)) {
      setCurrentTalkNpcId(null);
      setConversationText("");
      setConversationHasClue(false);
      setInspectOpen(false);
      setInspectedHotspotId(null);
      setInspectOverrideText(null);
      setScriptedConversationState(null);
      setItemPopup(hotspotItem);
      return;
    }

    let overrideText: string | null = null;
    const nextGame = game.clone();
    if (game.currentRoom === "apartment" && hotspotId === "apartment-jacket-pocket" && !nextGame.hasFlag("blondie_photo")) {
      nextGame.addFlag("blondie_photo");
      nextGame.lastMessage = "You found Blondie's photo in the jacket pocket.";
      overrideText =
        "Inside the pocket, there is a photo of Blondie. The edges are bent from being handled too often, like somebody kept checking she was still real.";
    }
    if (game.currentRoom === "apartment" && hotspotId === "apartment-computer-screen" && !nextGame.hasFlag("bar_address_known")) {
      nextGame.addFlag("bar_address_known");
      nextGame.addFlag("open_city_map_enabled");
      nextGame.addFlag("bar_marked_on_map");
      nextGame.lastMessage = "You found Lucy's email with the Bar address.";
      overrideText =
        "The email is still open. Lucy sent the Bar address hours ago, with just enough detail to make it feel urgent and not nearly enough to make it feel safe.";
    }
    if (overrideText) {
      setGame(nextGame);
    }

    setCurrentTalkNpcId(null);
    setConversationText("");
    setConversationHasClue(false);
    setInspectOpen(false);
    setScriptedConversationState(null);
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

  const takeCab = () => {
    const fare = 18;
    if (game.finished) return;
    if (game.currentRoom === "cab") return;
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
  };

  const toggleMap = () => {
    if (!canOpenMap) {
      mutate((draft) => {
        draft.lastMessage = "Lucy mentioned an email with the Bar address. Check the computer first.";
      });
      return;
    }
    setMapOpen((prev) => !prev);
  };

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
    cursorMode,
    currentTalkNpcId,
    conversationText,
    inspectOpen,
    mapOpen,
    moneyDetailsOpen,
    selectedInventoryId,
    itemPopup,
    canOpenMap,
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
    toggleMap,
    toggleInventoryItem,
    clearInventorySelection,
    openRoomInspect,
    openHotspotInspect,
    closeInspect,
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
