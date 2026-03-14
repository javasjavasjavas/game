import { Coffee, KeyRound, Menu, MessageSquareText, Newspaper } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { MouseEventHandler } from "react";
import { ConversationPanel } from "./components/panels/ConversationPanel";
import { InspectPanel } from "./components/panels/InspectPanel";
import { CursorOverlay } from "./components/CursorOverlay";
import { FooterBar } from "./components/FooterBar";
import { Sidebar } from "./components/Sidebar";
import { StageView } from "./components/StageView";
import { TopBar } from "./components/TopBar";
import { ROOMS } from "./game/data";
import type { RoomId } from "./game/types";
import { useGame } from "./hooks/useGame";

export default function App() {
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -9999, y: -9999 });
  const [showAccuseList, setShowAccuseList] = useState(false);

  const game = useGame();

  const inspectText = useMemo(() => {
    const exitNames = game.room.exits.map((id) => ROOMS[id].name).join(", ");
    return `${game.room.description} Visible exits: ${exitNames}. Traffic noise covers whispers; inspect clues and question whoever is present.`;
  }, [game.room]);

  const conversationOpen = Boolean(game.currentTalkNpcId);
  const selectingNpc = game.currentTalkNpcId === "selector";
  const showNavigation = !game.inspectOpen && !conversationOpen;

  const cursorIcon =
    game.cursorMode === "talk" ? (
      <MessageSquareText size={26} />
    ) : game.selectedItem?.image ? (
      <img className="cursor-item-image" src={game.selectedItem.image} alt={game.selectedItem.label} />
    ) : game.selectedInventoryId === "key" ? (
      <KeyRound size={26} />
    ) : game.selectedInventoryId === "paper" ? (
      <Newspaper size={26} />
    ) : (
      <Coffee size={26} />
    );

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      setCursorPos({ x: event.clientX + 14, y: event.clientY + 14 });
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const handleContextMenu: MouseEventHandler<HTMLElement> = (event) => {
    if (!game.selectedInventoryId) return;
    event.preventDefault();
    game.clearInventorySelection();
  };

  const handleMapSelect = (roomId: RoomId) => {
    const canGo = game.game.currentRoom === roomId || game.room.exits.includes(roomId);
    if (!canGo) {
      return;
    }
    game.moveRoom(roomId);
    game.setMapOpen(false);
  };

  const rootClass = `viewport ${game.cursorMode !== "none" ? "hide-cursor" : ""}`;

  return (
    <div className="app">
      <button className="sidebar-toggle" onClick={() => setMobileSidebar((prev) => !prev)}>
        <Menu size={18} />
      </button>

      <Sidebar
        characters={game.characterMemories}
        expandedCharacter={game.expandedCharacterMemory}
        score={game.clues.length * 100}
        money={game.game.money}
        clock={game.formattedTime}
        dateLabel="Monday, March 15"
        onToggleCharacter={game.toggleCharacterMemory}
        onWait={() => {
          setShowAccuseList(false);
          game.wait();
        }}
        onTakeCab={() => {
          setShowAccuseList(false);
          game.takeCab();
        }}
        onSolveClick={() => {
          game.openAccusationPrompt();
          setShowAccuseList((prev) => !prev);
        }}
        onAccuse={(npcId) => {
          game.solve(npcId);
          setShowAccuseList(false);
        }}
        showAccuseList={showAccuseList}
        mobileOpen={mobileSidebar}
      />

      <main className={rootClass} onContextMenu={handleContextMenu}>
        <TopBar roomName={game.room.name} roomDescription={game.room.description} />

        <StageView
          emotion={game.game.characterEmotion}
          onCharacterClick={() => {
            setShowAccuseList(false);
            game.openTalkSelector();
          }}
          onCharacterEnter={() => game.setHoverCharacter(true)}
          onCharacterLeave={() => game.setHoverCharacter(false)}
          mapOpen={game.mapOpen}
          currentRoom={game.game.currentRoom}
          onMapClose={() => game.setMapOpen(false)}
          onMapSelect={handleMapSelect}
        />

        <footer className="footer">
          <FooterBar
            showNav={showNavigation}
            mapOpen={game.mapOpen}
            selectedInventoryId={game.selectedInventoryId}
            onToggleInventory={game.toggleInventoryItem}
            onInspect={() => {
              setShowAccuseList(false);
              game.setInspectOpen(true);
            }}
            onMap={() => game.setMapOpen((prev) => !prev)}
          />

        </footer>

        <InspectPanel open={game.inspectOpen && !conversationOpen} text={inspectText} onClose={() => game.setInspectOpen(false)} />

        <ConversationPanel
          open={conversationOpen}
          npc={game.conversation?.npc ?? null}
          dialogue={game.conversation?.dialogue ?? null}
          text={game.conversationText}
          hasClue={game.conversationHasClue}
          selectingNpc={selectingNpc}
          npcsHere={game.npcsHere}
          onSelectNpc={game.talkToNpc}
          onPickOption={(optionId) => {
            if (!game.currentTalkNpcId || game.currentTalkNpcId === "selector") return;
            game.pickDialogueOption(game.currentTalkNpcId, optionId);
          }}
          onClose={game.closeConversation}
        />

        <CursorOverlay mode={game.cursorMode} icon={cursorIcon} x={cursorPos.x} y={cursorPos.y} />
      </main>
    </div>
  );
}
