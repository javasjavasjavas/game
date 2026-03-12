import { AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import { useMemo, useState } from "react";
import type { MouseEventHandler } from "react";
import { ConversationPanel } from "./components/panels/ConversationPanel";
import { InspectPanel } from "./components/panels/InspectPanel";
import { CursorOverlay } from "./components/CursorOverlay";
import { FooterBar } from "./components/FooterBar";
import { MapOverlay } from "./components/MapOverlay";
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
    return `${game.room.description} Salidas visibles: ${exitNames}. El viento tapa algunas voces; revisa pistas e interroga a los presentes.`;
  }, [game.room]);

  const conversationOpen = Boolean(game.currentTalkNpcId);
  const selectingNpc = game.currentTalkNpcId === "selector";
  const showNavigation = !game.inspectOpen && !conversationOpen;

  const cursorIcon = game.cursorMode === "use" ? game.selectedItem?.icon ?? "??" : "??";

  const handleViewportMouseMove: MouseEventHandler<HTMLElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setCursorPos({ x: event.clientX - rect.left + 14, y: event.clientY - rect.top + 14 });
  };

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
        message={game.game.lastMessage}
        clues={game.clues}
        onWait={() => {
          setShowAccuseList(false);
          game.wait();
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

      <main className={rootClass} onMouseMove={handleViewportMouseMove} onContextMenu={handleContextMenu}>
        <TopBar roomName={game.room.name} roomDescription={game.room.description} clock={game.formattedTime} />

        <StageView
          npcsHere={game.npcsHere}
          onNpcClick={(npcId) => {
            setShowAccuseList(false);
            game.talkToNpc(npcId);
          }}
          onCharacterClick={() => {
            setShowAccuseList(false);
            game.openTalkSelector();
          }}
          onCharacterEnter={() => game.setHoverCharacter(true)}
          onCharacterLeave={() => game.setHoverCharacter(false)}
        />

        <MapOverlay
          open={game.mapOpen}
          currentRoom={game.game.currentRoom}
          onClose={() => game.setMapOpen(false)}
          onSelectRoom={handleMapSelect}
        />

        <footer className="footer">
          <FooterBar
            showNav={showNavigation}
            selectedInventoryId={game.selectedInventoryId}
            onToggleInventory={game.toggleInventoryItem}
            onInspect={() => {
              setShowAccuseList(false);
              game.setInspectOpen(true);
            }}
            onMap={() => game.setMapOpen(true)}
          />

          <InspectPanel open={game.inspectOpen && !conversationOpen} text={inspectText} onClose={() => game.setInspectOpen(false)} />

          <ConversationPanel
            open={conversationOpen}
            npc={game.conversation?.npc ?? null}
            dialogue={game.conversation?.dialogue ?? null}
            selectingNpc={selectingNpc}
            npcsHere={game.npcsHere}
            onSelectNpc={game.talkToNpc}
            onPickOption={(optionId) => {
              if (!game.currentTalkNpcId || game.currentTalkNpcId === "selector") return;
              game.pickDialogueOption(game.currentTalkNpcId, optionId);
            }}
            onClose={game.closeConversation}
          />
        </footer>

        <AnimatePresence>
          <CursorOverlay mode={game.cursorMode} icon={cursorIcon} x={cursorPos.x} y={cursorPos.y} />
        </AnimatePresence>
      </main>
    </div>
  );
}
