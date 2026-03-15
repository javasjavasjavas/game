import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent, SyntheticEvent } from "react";
import { CHARACTER_BY_ID, STAGE_CHARACTER_ID } from "../game/data";
import { MapOverlay } from "./MapOverlay";
import type { CharacterEmotion, RoomId } from "../game/types";

const STAGE_CHARACTER = CHARACTER_BY_ID[STAGE_CHARACTER_ID];
const CHARACTER_BY_EMOTION: Record<CharacterEmotion, string> = STAGE_CHARACTER.emotions;
const MAP_BACKGROUND_SRC = "/game-assets/map_bg.jpg";
const BACKGROUND_BY_ROOM: Record<RoomId, string> = {
  bar: "/game-assets/background_bar.jpg",
  cab: "/game-assets/background_cab.jpg",
  apartment: "/game-assets/background_apartment.jpg",
  store: "/game-assets/background_bar.jpg",
  alley: "/game-assets/background_bar.jpg",
};

function preloadImage(src: string, cache: Set<string>): Promise<void> {
  if (cache.has(src)) return Promise.resolve();
  return new Promise((resolve) => {
    const image = new Image();
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      cache.add(src);
      resolve();
    };
    image.onload = done;
    image.onerror = done;
    image.src = src;
    if (image.complete) done();
  });
}

interface Props {
  emotion: CharacterEmotion;
  onCharacterClick: () => void;
  onCharacterEnter: () => void;
  onCharacterLeave: () => void;
  mapOpen: boolean;
  currentRoom: RoomId;
  onMapClose: () => void;
  onMapSelect: (roomId: RoomId, walkMinutes: number) => void;
}

export function StageView({
  emotion,
  onCharacterClick,
  onCharacterEnter,
  onCharacterLeave,
  mapOpen,
  currentRoom,
  onMapClose,
  onMapSelect,
}: Props) {
  const loadedImagesRef = useRef<Set<string>>(new Set());
  const initialRoomRef = useRef<RoomId>(currentRoom);
  const hitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const hitContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [displayedRoom, setDisplayedRoom] = useState<RoomId>(currentRoom);
  const [fadePhase, setFadePhase] = useState<"idle" | "fadeOut" | "fadeIn">("idle");
  const [initialAssetsReady, setInitialAssetsReady] = useState(false);
  const [activeBackgroundReady, setActiveBackgroundReady] = useState(false);
  const [characterPixelHover, setCharacterPixelHover] = useState(false);
  const showStageCharacter = displayedRoom !== "cab" && displayedRoom !== "apartment";
  const backgroundSrc = BACKGROUND_BY_ROOM[displayedRoom];
  const initialRoom = initialRoomRef.current;
  const initialBackgroundSrc = BACKGROUND_BY_ROOM[initialRoom];
  const defaultSpriteSrc = CHARACTER_BY_EMOTION[STAGE_CHARACTER.defaultEmotion];
  const stageLoading = useMemo(
    () => !activeBackgroundReady || (displayedRoom === initialRoom && !initialAssetsReady),
    [activeBackgroundReady, displayedRoom, initialAssetsReady, initialRoom]
  );

  useEffect(() => {
    if (currentRoom === displayedRoom) return;

    let fadeInTimer: number | null = null;
    setFadePhase("fadeOut");
    const fadeOutTimer = window.setTimeout(() => {
      setDisplayedRoom(currentRoom);
      setActiveBackgroundReady(loadedImagesRef.current.has(BACKGROUND_BY_ROOM[currentRoom]));
      setFadePhase("fadeIn");
      fadeInTimer = window.setTimeout(() => {
        setFadePhase("idle");
      }, 230);
    }, 230);

    return () => {
      window.clearTimeout(fadeOutTimer);
      if (fadeInTimer !== null) window.clearTimeout(fadeInTimer);
    };
  }, [currentRoom, displayedRoom]);

  useEffect(() => {
    let cancelled = false;
    if (loadedImagesRef.current.has(backgroundSrc)) {
      setActiveBackgroundReady(true);
      return () => {
        cancelled = true;
      };
    }
    setActiveBackgroundReady(false);
    preloadImage(backgroundSrc, loadedImagesRef.current).then(() => {
      if (!cancelled) setActiveBackgroundReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [backgroundSrc]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Boot: first scene background + default sprite.
      await preloadImage(initialBackgroundSrc, loadedImagesRef.current);
      await preloadImage(defaultSpriteSrc, loadedImagesRef.current);
      if (cancelled) return;
      setInitialAssetsReady(true);

      // Then load remaining character variants.
      const remainingSprites = Object.values(CHARACTER_BY_EMOTION).filter((src) => src !== defaultSpriteSrc);
      for (const spriteSrc of remainingSprites) {
        await preloadImage(spriteSrc, loadedImagesRef.current);
        if (cancelled) return;
      }

      // Then map background.
      await preloadImage(MAP_BACKGROUND_SRC, loadedImagesRef.current);
      if (cancelled) return;

      // Then all other scene backgrounds in parallel.
      const otherBackgrounds = Array.from(new Set(Object.values(BACKGROUND_BY_ROOM))).filter(
        (src) => src !== initialBackgroundSrc
      );
      await Promise.all(otherBackgrounds.map((src) => preloadImage(src, loadedImagesRef.current)));
    })();
    return () => {
      cancelled = true;
    };
  }, [defaultSpriteSrc, initialBackgroundSrc]);

  useEffect(() => {
    if (showStageCharacter) return;
    setCharacterPixelHover(false);
    onCharacterLeave();
  }, [onCharacterLeave, showStageCharacter]);

  const handleActiveSpriteLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    if (width > 0 && height > 0) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(image, 0, 0);
        hitCanvasRef.current = canvas;
        hitContextRef.current = ctx;
      }
    }
  };

  const setPixelHover = (value: boolean) => {
    setCharacterPixelHover((prev) => {
      if (prev === value) return prev;
      if (value) {
        onCharacterEnter();
      } else {
        onCharacterLeave();
      }
      return value;
    });
  };

  const handleCharacterPointerMove = (event: MouseEvent<HTMLButtonElement>) => {
    const ctx = hitContextRef.current;
    if (!ctx) {
      setPixelHover(true);
      return;
    }

    const buttonRect = event.currentTarget.getBoundingClientRect();
    if (buttonRect.width <= 0 || buttonRect.height <= 0) {
      setPixelHover(false);
      return;
    }

    const xRatio = (event.clientX - buttonRect.left) / buttonRect.width;
    const yRatio = (event.clientY - buttonRect.top) / buttonRect.height;

    const x = Math.max(0, Math.min(ctx.canvas.width - 1, Math.floor(xRatio * ctx.canvas.width)));
    const y = Math.max(0, Math.min(ctx.canvas.height - 1, Math.floor(yRatio * ctx.canvas.height)));
    const alpha = ctx.getImageData(x, y, 1, 1).data[3];
    setPixelHover(alpha > 20);
  };

  const handleCharacterMouseLeave = () => {
    setPixelHover(false);
  };

  const handleCharacterClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!characterPixelHover) {
      event.preventDefault();
      return;
    }
    onCharacterClick();
  };

  return (
    <section className="stage">
      <img
        className="scene-image"
        src={backgroundSrc}
        alt="Night city scene"
        onLoad={() => {
          loadedImagesRef.current.add(backgroundSrc);
          setActiveBackgroundReady(true);
        }}
        onError={() => {
          loadedImagesRef.current.add(backgroundSrc);
          setActiveBackgroundReady(true);
        }}
      />
      <div className="stage-overlay" />
      {stageLoading && (
        <div className="stage-loading">
          <span className="stage-loading-spinner" />
          <span className="stage-loading-text">Loading assets...</span>
        </div>
      )}
      <motion.div
        className="stage-transition-black"
        animate={{ opacity: fadePhase === "fadeOut" ? 1 : fadePhase === "fadeIn" ? 0 : 0 }}
        transition={{ duration: 0.23, ease: "easeInOut" }}
      />

      {showStageCharacter && (
        <div className="character-wrap">
          <button
            className="character-hitbox"
            title="Talk"
            onMouseMove={handleCharacterPointerMove}
            onMouseLeave={handleCharacterMouseLeave}
            onClick={handleCharacterClick}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={emotion}
                className="character-image"
                src={CHARACTER_BY_EMOTION[emotion]}
                alt="Main character portrait"
                initial={{ opacity: 0.1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.05 }}
                onLoad={handleActiveSpriteLoad}
                transition={{ duration: 0.28, ease: "easeOut" }}
              />
            </AnimatePresence>
          </button>
        </div>
      )}

      <MapOverlay open={mapOpen} currentRoom={currentRoom} onClose={onMapClose} onSelectRoom={onMapSelect} />
    </section>
  );
}
