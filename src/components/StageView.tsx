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
  const wasMapOpenRef = useRef(mapOpen);
  const hitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const hitContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [displayedRoom, setDisplayedRoom] = useState<RoomId>(currentRoom);
  const [fadePhase, setFadePhase] = useState<"idle" | "fadeOut" | "fadeIn">("idle");
  const [bootLoading, setBootLoading] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [activeBackgroundReady, setActiveBackgroundReady] = useState(false);
  const [characterPixelHover, setCharacterPixelHover] = useState(false);
  const showStageCharacter = displayedRoom !== "cab" && displayedRoom !== "apartment";
  const backgroundSrc = BACKGROUND_BY_ROOM[displayedRoom];
  const stageLoading = useMemo(() => bootLoading || !activeBackgroundReady, [activeBackgroundReady, bootLoading]);
  const loadingLabel = bootLoading ? "Loading Game" : "Loading Scene";
  const bootSegments = 14;

  useEffect(() => {
    if (currentRoom === displayedRoom) return;
    const targetBackgroundSrc = BACKGROUND_BY_ROOM[currentRoom];
    const changedFromMap = mapOpen || wasMapOpenRef.current;

    if (changedFromMap) {
      setDisplayedRoom(currentRoom);
      setFadePhase("idle");
      setActiveBackgroundReady(loadedImagesRef.current.has(targetBackgroundSrc));
      if (!loadedImagesRef.current.has(targetBackgroundSrc)) {
        preloadImage(targetBackgroundSrc, loadedImagesRef.current).then(() => {
          setActiveBackgroundReady(true);
        });
      }
      return;
    }

    let fadeInTimer: number | null = null;
    setFadePhase("fadeOut");
    const fadeOutTimer = window.setTimeout(() => {
      setDisplayedRoom(currentRoom);
      setActiveBackgroundReady(loadedImagesRef.current.has(targetBackgroundSrc));
      setFadePhase("fadeIn");
      fadeInTimer = window.setTimeout(() => {
        setFadePhase("idle");
      }, 230);
    }, 230);

    return () => {
      window.clearTimeout(fadeOutTimer);
      if (fadeInTimer !== null) window.clearTimeout(fadeInTimer);
    };
  }, [currentRoom, displayedRoom, mapOpen]);

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
    let ticker: number | null = null;
    const startedAt = performance.now();
    const minBootMs = 5000;
    (async () => {
      const allAssets = Array.from(
        new Set([
          ...Object.values(BACKGROUND_BY_ROOM),
          MAP_BACKGROUND_SRC,
          ...Object.values(CHARACTER_BY_EMOTION),
        ])
      );
      let loadedCount = 0;
      const totalCount = Math.max(1, allAssets.length);

      const updateProgress = () => {
        const elapsed = performance.now() - startedAt;
        const timeProgress = Math.min(elapsed / minBootMs, 1);
        const assetProgress = loadedCount / totalCount;
        const combined = Math.max(timeProgress * 0.9, assetProgress * 0.95);
        if (!cancelled) {
          setBootProgress(Math.min(combined, 0.98));
        }
      };

      ticker = window.setInterval(updateProgress, 80);
      const minBootDelay = new Promise<void>((resolve) => {
        window.setTimeout(resolve, minBootMs);
      });
      const preloadAll = Promise.all(
        allAssets.map(async (src) => {
          await preloadImage(src, loadedImagesRef.current);
          loadedCount += 1;
          updateProgress();
        })
      );
      await Promise.all([preloadAll, minBootDelay]);
      if (cancelled) return;
      if (ticker !== null) window.clearInterval(ticker);
      setBootProgress(1);
      await new Promise<void>((resolve) => window.setTimeout(resolve, 140));
      if (cancelled) return;
      setBootLoading(false);
      setActiveBackgroundReady(true);
    })();
    return () => {
      cancelled = true;
      if (ticker !== null) window.clearInterval(ticker);
    };
  }, []);

  useEffect(() => {
    wasMapOpenRef.current = mapOpen;
  }, [mapOpen]);

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
    <section className="stage scanlines">
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
          <div className="stage-loading-inner">
            <span className="stage-loading-text">{loadingLabel}</span>
            {bootLoading && (
              <div className="stage-loading-bar" aria-hidden>
                {Array.from({ length: bootSegments }).map((_, index) => {
                  const filled = index < Math.round(bootProgress * bootSegments);
                  return <span key={`boot-seg-${index}`} className={`stage-loading-segment ${filled ? "filled" : ""}`} />;
                })}
              </div>
            )}
          </div>
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
