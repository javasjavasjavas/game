import { Coffee, KeyRound, Menu, MessageSquareText } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEventHandler } from "react";
import { ConversationPanel } from "./components/panels/ConversationPanel";
import { InspectPanel } from "./components/panels/InspectPanel";
import { CursorOverlay } from "./components/CursorOverlay";
import { FooterBar } from "./components/FooterBar";
import { IntroScreen } from "./components/IntroScreen";
import { NewItemPopup } from "./components/NewItemPopup";
import { Sidebar } from "./components/Sidebar";
import { StartScreen } from "./components/StartScreen";
import { StageView } from "./components/StageView";
import { TopBar } from "./components/TopBar";
import { ROOMS } from "./game/data";
import type { RoomId } from "./game/types";
import { useGame } from "./hooks/useGame";

const SCENE_MUSIC: Partial<Record<RoomId, string>> = {
  bar: "/game-assets/audio/the_bar.mp3",
  apartment: "/game-assets/audio/apartment.mp3",
};
const INTRO_MUSIC = "/game-assets/audio/Intro.mp3";

const MUSIC_VOLUME = 0.45;
const MUSIC_FADE_MS = 650;
const MUSIC_FADE_STEP_MS = 50;
type FlowScreen = "start" | "chapter" | "game";

export default function App() {
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [screen, setScreen] = useState<FlowScreen>("start");
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -9999, y: -9999 });
  const [showAccuseList, setShowAccuseList] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const activeTrackRef = useRef<string | null>(null);

  const game = useGame();
  const gameStarted = screen === "game";
  const getTargetTrack = useCallback(() => {
    if (!soundEnabled) return null;
    if (screen === "start") return INTRO_MUSIC;
    if (screen === "chapter") return SCENE_MUSIC.apartment ?? null;
    return SCENE_MUSIC[game.game.currentRoom] ?? null;
  }, [game.game.currentRoom, screen, soundEnabled]);

  const inspectText = useMemo(() => {
    if (game.inspectedHotspotText) {
      return game.inspectedHotspotText;
    }
    if (game.inspectedHotspot) {
      return game.inspectedHotspot.inspectText;
    }
    const exitNames = game.room.exits.map((id) => ROOMS[id].name).join(", ");
    return `${game.room.description} Visible exits: ${exitNames}. Traffic noise covers whispers; inspect clues and question whoever is present.`;
  }, [game.inspectedHotspot, game.inspectedHotspotText, game.room]);
  const inspectTitle = game.inspectedHotspot?.label ?? "Inspection";

  const conversationOpen = Boolean(game.currentTalkNpcId);
  const selectingNpc = game.currentTalkNpcId === "selector";
  const inspectionVisible = (game.inspectOpen || Boolean(game.inspectedHotspot)) && !conversationOpen;
  const showNavigation = !inspectionVisible && !conversationOpen;

  const cursorIcon =
    game.cursorMode === "talk" ? (
      <MessageSquareText size={26} />
    ) : game.cursorMode === "inspect" ? (
      <img className="cursor-tag-icon-image" src="/game-assets/icon_eye.png" alt="Inspect" />
    ) : game.selectedItem?.image ? (
      <img className="cursor-item-image" src={game.selectedItem.image} alt={game.selectedItem.label} />
    ) : game.selectedInventoryId === "key" ? (
      <KeyRound size={26} />
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

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = "auto";
    audio.playsInline = true;
    audio.volume = 0;
    musicRef.current = audio;
    return () => {
      if (fadeIntervalRef.current !== null) {
        window.clearInterval(fadeIntervalRef.current);
      }
      audio.pause();
      audio.src = "";
      musicRef.current = null;
    };
  }, []);

  const requestAudioUnlock = useCallback(() => {
    setAudioUnlocked(true);
    const audio = musicRef.current;
    if (!audio || !soundEnabled) return;

    const targetTrack = getTargetTrack();
    if (!targetTrack) return;

    if (activeTrackRef.current !== targetTrack || audio.src !== new URL(targetTrack, window.location.origin).href) {
      audio.pause();
      audio.src = targetTrack;
      audio.load();
      activeTrackRef.current = targetTrack;
      audio.volume = 0;
    }

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Browsers can still reject some non-trusted events; the normal effect will retry on the next valid gesture.
      });
    }
  }, [getTargetTrack, soundEnabled]);

  useEffect(() => {
    if (audioUnlocked) return;

    const unlock = () => requestAudioUnlock();

    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("pointermove", unlock, { passive: true });
    window.addEventListener("click", unlock, { passive: true });
    window.addEventListener("keydown", unlock);

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("pointermove", unlock);
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [audioUnlocked, requestAudioUnlock]);

  useEffect(() => {
    const audio = musicRef.current;
    if (!audio) return;
    const targetTrack = getTargetTrack();
    const canPlay = soundEnabled && audioUnlocked;

    const clearFade = () => {
      if (fadeIntervalRef.current !== null) {
        window.clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
    };

    const fadeTo = (targetVolume: number, onDone?: () => void) => {
      clearFade();
      const steps = Math.max(1, Math.round(MUSIC_FADE_MS / MUSIC_FADE_STEP_MS));
      const startVolume = audio.volume;
      let currentStep = 0;

      fadeIntervalRef.current = window.setInterval(() => {
        currentStep += 1;
        const progress = Math.min(currentStep / steps, 1);
        audio.volume = startVolume + (targetVolume - startVolume) * progress;

        if (progress >= 1) {
          clearFade();
          if (onDone) onDone();
        }
      }, MUSIC_FADE_STEP_MS);
    };

    const playCurrentTrack = () => {
      audio.currentTime = 0;
      audio.loop = true;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // Autoplay can be blocked until the first user interaction.
        });
      }
    };

    if (!targetTrack || !canPlay) {
      if (!audio.paused || audio.volume > 0) {
        fadeTo(0, () => {
          audio.pause();
          activeTrackRef.current = null;
        });
      } else {
        activeTrackRef.current = null;
      }
      return () => clearFade();
    }

    if (activeTrackRef.current === targetTrack && !audio.paused) {
      fadeTo(MUSIC_VOLUME);
      return () => clearFade();
    }

    const switchTrack = () => {
      audio.pause();
      audio.src = targetTrack;
      audio.load();
      activeTrackRef.current = targetTrack;
      audio.volume = 0;
      playCurrentTrack();
      fadeTo(MUSIC_VOLUME);
    };

    if (!audio.paused && activeTrackRef.current) {
      fadeTo(0, switchTrack);
    } else {
      switchTrack();
    }

    return () => clearFade();
  }, [audioUnlocked, getTargetTrack, soundEnabled]);

  const handleContextMenu: MouseEventHandler<HTMLElement> = (event) => {
    if (!game.selectedInventoryId) return;
    event.preventDefault();
    game.clearInventorySelection();
  };

  const handleMapSelect = (roomId: RoomId, walkMinutes: number) => {
    game.moveRoom(roomId, walkMinutes);
    game.setMapOpen(false);
  };

  const rootClass = `viewport ${game.cursorMode !== "none" ? "hide-cursor" : ""}`;

  if (screen === "start") {
    return (
      <StartScreen
        onStart={() => {
          game.setCurrentRoomInstant("apartment");
          setScreen("chapter");
        }}
        onUserInteract={requestAudioUnlock}
      />
    );
  }

  if (screen === "chapter") {
    return <IntroScreen onContinue={() => setScreen("game")} onUserInteract={requestAudioUnlock} />;
  }

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
        onToggleCharacter={game.toggleCharacterMemory}
        onWait={() => {
          setShowAccuseList(false);
          game.wait();
        }}
        onTakeCab={() => {
          setShowAccuseList(false);
          if (game.game.currentRoom === "cab") {
            game.leaveCab();
          } else {
            game.takeCab();
          }
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
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onSettingsClick={() => {
          // Placeholder: behavior will be added in a next step.
        }}
        inCab={game.game.currentRoom === "cab"}
      />

      <main className={rootClass} onContextMenu={handleContextMenu}>
        <TopBar roomName={game.room.name} roomDescription={game.room.description} clock={game.formattedTime} dateLabel="Monday, March 15" />

        <StageView
          emotion={game.game.characterEmotion}
          hotspots={conversationOpen ? [] : game.visibleHotspots}
          onCharacterClick={() => {
            setShowAccuseList(false);
            game.openTalkSelector();
          }}
          onCharacterEnter={() => game.setHoverCharacter(true)}
          onCharacterLeave={() => game.setHoverCharacter(false)}
          onHotspotClick={(hotspotId) => {
            setShowAccuseList(false);
            game.openHotspotInspect(hotspotId);
          }}
          onHotspotEnter={() => game.setHoverHotspot(true)}
          onHotspotLeave={() => game.setHoverHotspot(false)}
          mapOpen={game.mapOpen}
          currentRoom={game.game.currentRoom}
          onMapClose={() => game.setMapOpen(false)}
          onMapSelect={handleMapSelect}
        />

        <footer className="footer">
          <FooterBar
            showNav={showNavigation}
            mapOpen={game.mapOpen}
            mapEnabled={game.canOpenMap}
            inventoryItems={game.ownedInventoryItems}
            selectedInventoryId={game.selectedInventoryId}
            onToggleInventory={game.toggleInventoryItem}
            onInspect={() => {
              setShowAccuseList(false);
              game.openRoomInspect();
            }}
            onMap={game.toggleMap}
          />

        </footer>

        <InspectPanel open={inspectionVisible} title={inspectTitle} text={inspectText} onClose={game.closeInspect} />

        <ConversationPanel
          open={conversationOpen}
          npc={game.conversation?.npc ?? null}
          dialogue={game.conversation?.dialogue ?? null}
          text={game.conversationText}
          hasClue={game.conversationHasClue}
          selectingNpc={selectingNpc}
          npcsHere={game.npcsHere}
          onSelectNpc={game.talkToNpc}
          onGoBack={game.goBackConversation}
          onPickOption={(optionId) => {
            if (!game.currentTalkNpcId || game.currentTalkNpcId === "selector") return;
            game.pickDialogueOption(game.currentTalkNpcId, optionId);
          }}
          showGoBack={game.canGoBackConversation}
          onClose={game.closeConversation}
        />

        <NewItemPopup
          icon={game.itemPopup?.image ?? ""}
          label={game.itemPopup?.label ?? ""}
          description={game.itemPopup?.description}
          visible={Boolean(game.itemPopup)}
          onPickUp={game.pickUpItemFromPopup}
          onDiscard={game.discardItemPopup}
        />

        <CursorOverlay mode={game.cursorMode} icon={cursorIcon} x={cursorPos.x} y={cursorPos.y} />
      </main>
    </div>
  );
}
