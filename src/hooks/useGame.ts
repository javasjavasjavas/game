import { useMemo, useState } from "react";
import { CHARACTER_BY_ID, CLUES, INVENTORY_ITEMS, NPCS, ROOMS } from "../game/data";
import { formatTime, GameState } from "../game/state";
import type { RoomId } from "../game/types";

export type CursorMode = "none" | "talk" | "use";

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
  const [characterMemoryByNpc, setCharacterMemoryByNpc] = useState<Record<string, CharacterMemory>>({});
  const [expandedCharacterMemoryId, setExpandedCharacterMemoryId] = useState<string | null>(null);
  const [conversationHasClue, setConversationHasClue] = useState(false);

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

  const cursorMode: CursorMode = selectedInventoryId ? "use" : hoverCharacter && !game.finished ? "talk" : "none";

  const mutate = (fn: (draft: GameState) => void) => {
    setGame((prev) => {
      const next = prev.clone();
      fn(next);
      return next;
    });
  };

  const moveRoom = (roomId: RoomId) => {
    mutate((draft) => {
      if (draft.finished || draft.currentRoom === roomId) return;
      draft.currentRoom = roomId;
      draft.advanceTime(15);
      draft.lastMessage = `You moved to ${ROOMS[roomId].name}.`;
    });
    setCurrentTalkNpcId(null);
    setInspectOpen(false);
  };

  const wait = () => {
    mutate((draft) => {
      if (draft.finished) return;
      draft.advanceTime(30);
      draft.lastMessage = "You waited 30 minutes.";
    });
    setCurrentTalkNpcId(null);
    setInspectOpen(false);
  };

  const talkToNpc = (npcId: string) => {
    mutate((draft) => {
      draft.characterEmotion = CHARACTER_BY_ID[npcId]?.defaultEmotion ?? "serious";
    });
    setConversationHasClue(false);
    ensureCharacterMemory(npcId);
    setInspectOpen(false);
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

  const takeCab = () => {
    const fare = 18;
    mutate((draft) => {
      if (draft.finished) return;
      if (draft.currentRoom === "cab") {
        draft.lastMessage = "You are already in the cab.";
        return;
      }
      if (draft.money < fare) {
        draft.lastMessage = "Not enough cash for a cab ride.";
        return;
      }
      draft.money -= fare;
      draft.currentRoom = "cab";
      draft.advanceTime(10);
      draft.lastMessage = `You took a cab for $${fare}.`;
    });
    setCurrentTalkNpcId(null);
    setInspectOpen(false);
    setConversationHasClue(false);
  };

  const ensureCharacterMemory = (npcId: string) => {
    const npc = NPCS.find((item) => item.id === npcId);
    if (!npc) return;

    setCharacterMemoryByNpc((prev) => {
      if (prev[npcId]) return prev;
      return {
        ...prev,
        [npcId]: {
          npcId,
          name: npc.name,
          description: CHARACTER_BY_ID[npcId]?.description ?? `${npc.name} is a person of interest in this district.`,
          portrait: CHARACTER_BY_ID[npcId]?.emotions.serious ?? "/game-assets/character_big_boss_serious.png",
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
    selectedInventoryId,
    setMapOpen,
    setInspectOpen,
    setHoverCharacter,
    moveRoom,
    wait,
    talkToNpc,
    openTalkSelector,
    closeConversation,
    pickDialogueOption,
    solve,
    openAccusationPrompt,
    takeCab,
    toggleInventoryItem,
    clearInventorySelection,
    characterMemories,
    expandedCharacterMemory,
    toggleCharacterMemory,
    conversationHasClue,
    formattedTime: formatTime(game.timeMinutes),
  };
}
