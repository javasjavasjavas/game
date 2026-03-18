import { useMemo, useState } from "react";
import { CHARACTER_BY_ID, CLUES, INVENTORY_ITEMS, NPCS, ROOMS, STAGE_HOTSPOTS_BY_ROOM } from "../game/data";
import { formatTime, GameState } from "../game/state";
import type { HotspotDefinition, RoomId } from "../game/types";

export type CursorMode = "none" | "talk" | "use" | "inspect";

export interface CharacterMemory {
  npcId: string;
  name: string;
  description: string;
  portrait: string;
  clues: string[];
  hasNewClue: boolean;
}

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

  const room = ROOMS[game.currentRoom];
  const clues = game.getClueEntries();
  const npcsHere = game.npcsInRoom(game.currentRoom);

  const conversation = useMemo(() => {
    if (!currentTalkNpcId || currentTalkNpcId === "selector") return null;
    const npc = NPCS.find((item) => item.id === currentTalkNpcId);
    const dialogue = game.getDialogue(currentTalkNpcId);
    return { npc, dialogue };
  }, [currentTalkNpcId, game]);

  const selectedItem = INVENTORY_ITEMS.find((item) => item.id === selectedInventoryId) ?? null;
  const characterMemories = useMemo(() => Object.values(characterMemoryByNpc), [characterMemoryByNpc]);
  const expandedCharacterMemory = expandedCharacterMemoryId ? characterMemoryByNpc[expandedCharacterMemoryId] ?? null : null;
  const inspectedHotspot: HotspotDefinition | null = useMemo(() => {
    if (!inspectedHotspotId) return null;
    const hotspots = STAGE_HOTSPOTS_BY_ROOM[game.currentRoom] ?? [];
    return hotspots.find((hotspot) => hotspot.id === inspectedHotspotId) ?? null;
  }, [game.currentRoom, inspectedHotspotId]);

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
  };

  const talkToNpc = (npcId: string) => {
    mutate((draft) => {
      draft.characterEmotion = CHARACTER_BY_ID[npcId]?.defaultEmotion ?? "serious";
    });
    setConversationHasClue(false);
    ensureCharacterMemory(npcId);
    setInspectOpen(false);
    setInspectedHotspotId(null);
    setCurrentTalkNpcId(npcId);
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
  };

  const pickDialogueOption = (npcId: string, optionId: string) => {
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
    setInspectOpen(true);
  };

  const openHotspotInspect = (hotspotId: string) => {
    setCurrentTalkNpcId(null);
    setConversationText("");
    setConversationHasClue(false);
    setInspectOpen(false);
    setInspectedHotspotId(hotspotId);
  };

  const closeInspect = () => {
    setInspectOpen(false);
    setInspectedHotspotId(null);
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
    cursorMode,
    currentTalkNpcId,
    conversationText,
    inspectOpen,
    mapOpen,
    moneyDetailsOpen,
    selectedInventoryId,
    setMapOpen,
    setInspectOpen,
    setHoverCharacter,
    setHoverHotspot,
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
    toggleInventoryItem,
    clearInventorySelection,
    openRoomInspect,
    openHotspotInspect,
    closeInspect,
    characterMemories,
    expandedCharacterMemory,
    toggleCharacterMemory,
    conversationHasClue,
    moneyExpenses: game.expenses,
    formattedTime: formatTime(game.timeMinutes),
    inspectedHotspot,
  };
}
