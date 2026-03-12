import { useMemo, useState } from "react";
import { INVENTORY_ITEMS, NPCS, ROOMS } from "../game/data";
import { formatTime, GameState } from "../game/state";
import type { RoomId } from "../game/types";

export type CursorMode = "none" | "talk" | "use";

export function useGame() {
  const [game, setGame] = useState(() => new GameState());
  const [currentTalkNpcId, setCurrentTalkNpcId] = useState<string | null>(null);
  const [inspectOpen, setInspectOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(null);
  const [hoverCharacter, setHoverCharacter] = useState(false);

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
      draft.lastMessage = `Te moviste a ${ROOMS[roomId].name}.`;
    });
    setCurrentTalkNpcId(null);
    setInspectOpen(false);
  };

  const wait = () => {
    mutate((draft) => {
      if (draft.finished) return;
      draft.advanceTime(30);
      draft.lastMessage = "Esperaste 30 minutos.";
    });
    setCurrentTalkNpcId(null);
    setInspectOpen(false);
  };

  const talkToNpc = (npcId: string) => {
    setInspectOpen(false);
    setCurrentTalkNpcId(npcId);
  };

  const openTalkSelector = () => {
    if (npcsHere.length === 0) {
      mutate((draft) => {
        draft.lastMessage = "No hay nadie para hablar aqui.";
      });
      return;
    }
    if (npcsHere.length === 1) {
      talkToNpc(npcsHere[0].id);
      return;
    }
    setInspectOpen(false);
    setCurrentTalkNpcId("selector");
  };

  const closeConversation = () => setCurrentTalkNpcId(null);

  const pickDialogueOption = (npcId: string, optionId: string) => {
    mutate((draft) => {
      draft.pickDialogue(npcId, optionId);
    });
  };

  const solve = (npcId: string) => {
    mutate((draft) => {
      draft.solve(npcId);
    });
  };

  const openAccusationPrompt = () => {
    mutate((draft) => {
      draft.lastMessage = "A quien acusas por el robo del medallon?";
    });
  };

  const toggleInventoryItem = (id: string) => {
    setSelectedInventoryId((prev) => (prev === id ? null : id));
    const selected = INVENTORY_ITEMS.find((item) => item.id === id);
    mutate((draft) => {
      draft.lastMessage = selected ? `Seleccionaste: ${selected.label}.` : "Inventario sin seleccion.";
    });
  };

  const clearInventorySelection = () => {
    setSelectedInventoryId(null);
    mutate((draft) => {
      draft.lastMessage = "Inventario sin seleccion.";
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
    toggleInventoryItem,
    clearInventorySelection,
    formattedTime: formatTime(game.timeMinutes),
  };
}
