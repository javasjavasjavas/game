import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent, SyntheticEvent } from "react";
import { CHARACTER_BY_ID, CHARACTERS, STAGE_CHARACTER_BY_ROOM, STAGE_HOTSPOTS_BY_ROOM } from "../game/data";
import { MapOverlay } from "./MapOverlay";
import type { CharacterEmotion, RoomId } from "../game/types";

const ALL_CHARACTER_SPRITES = CHARACTERS.flatMap((character) => Object.values(character.emotions));
const MAP_BACKGROUND_SRC = "/game-assets/map_bg.jpg";
const BACKGROUND_BY_ROOM: Record<RoomId, string> = {
  bar: "/game-assets/background_bar.jpg",
  cab: "/game-assets/background_cab.jpg",
  apartment: "/game-assets/background_apartment.jpg",
  store: "/game-assets/background_store.jpg",
  alley: "/game-assets/background_bar.jpg",
  pharmacy: "/game-assets/background_pharmacy.jpg",
  arcade: "/game-assets/background_arcades.jpg",
  garage: "/game-assets/background_garage.jpg",
  restooutside: "/game-assets/background_resto_outside.jpg",
  restoinside: "/game-assets/background_resto_inside.jpg",
  street: "/game-assets/background_street.jpg",
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
  onHotspotClick: (hotspotId: string) => void;
  onHotspotEnter: () => void;
  onHotspotLeave: () => void;
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
  onHotspotClick,
  onHotspotEnter,
  onHotspotLeave,
  mapOpen,
  currentRoom,
  onMapClose,
  onMapSelect,
}: Props) {
  const loadedImagesRef = useRef<Set<string>>(new Set());
  const stageRef = useRef<HTMLElement | null>(null);
  const characterWrapRef = useRef<HTMLDivElement | null>(null);
  const characterImageRef = useRef<HTMLImageElement | null>(null);
  const wasMapOpenRef = useRef(mapOpen);
  const hitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const hitContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [displayedRoom, setDisplayedRoom] = useState<RoomId>(currentRoom);
  const [fadePhase, setFadePhase] = useState<"idle" | "fadeOut" | "fadeIn">("idle");
  const [bootLoading, setBootLoading] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [playBootSceneFade, setPlayBootSceneFade] = useState(false);
  const [holdCharacterIntro, setHoldCharacterIntro] = useState(false);
  const [activeBackgroundReady, setActiveBackgroundReady] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [backgroundNaturalSize, setBackgroundNaturalSize] = useState({ width: 0, height: 0 });
  const [characterImageBox, setCharacterImageBox] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [characterPixelHover, setCharacterPixelHover] = useState(false);
  const stageCharacterId = STAGE_CHARACTER_BY_ROOM[displayedRoom] ?? null;
  const stageCharacter = stageCharacterId ? CHARACTER_BY_ID[stageCharacterId] : null;
  const activeCharacterEmotion: CharacterEmotion = stageCharacter
    ? stageCharacter.emotions[emotion]
      ? emotion
      : stageCharacter.defaultEmotion
    : "serious";
  const activeCharacterSrc = stageCharacter
    ? stageCharacter.emotions[activeCharacterEmotion] ?? stageCharacter.emotions[stageCharacter.defaultEmotion]
    : null;
  const showStageCharacter = Boolean(stageCharacter && activeCharacterSrc);
  const backgroundSrc = BACKGROUND_BY_ROOM[displayedRoom];
  const roomHotspots = STAGE_HOTSPOTS_BY_ROOM[displayedRoom] ?? [];
  const stageLoading = useMemo(() => bootLoading || !activeBackgroundReady, [activeBackgroundReady, bootLoading]);
  const loadingLabel = "Loading Scene";
  const bootSegments = 14;

  const syncCharacterBox = () => {
    const wrap = characterWrapRef.current;
    const image = characterImageRef.current;
    if (!wrap || !image) {
      setCharacterImageBox({ left: 0, top: 0, width: 0, height: 0 });
      return;
    }

    const wrapRect = wrap.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    const width = imageRect.width;
    const height = imageRect.height;

    if (width <= 0 || height <= 0) {
      setCharacterImageBox({ left: 0, top: 0, width: 0, height: 0 });
      return;
    }

    setCharacterImageBox({
      left: imageRect.left - wrapRect.left,
      top: imageRect.top - wrapRect.top,
      width,
      height,
    });
  };

  const syncCharacterMetrics = (image: HTMLImageElement) => {
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    if (width <= 0 || height <= 0) return;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0);
    hitCanvasRef.current = canvas;
    hitContextRef.current = ctx;
  };

  const characterHitboxStyle = useMemo(() => {
    if (characterImageBox.width <= 0 || characterImageBox.height <= 0) return undefined;

    return {
      left: `${characterImageBox.left}px`,
      top: `${characterImageBox.top}px`,
      width: `${characterImageBox.width}px`,
      height: `${characterImageBox.height}px`,
    };
  }, [characterImageBox.height, characterImageBox.left, characterImageBox.top, characterImageBox.width]);
  const renderedHotspots = useMemo(() => {
    if (
      roomHotspots.length === 0 ||
      stageSize.width <= 0 ||
      stageSize.height <= 0 ||
      backgroundNaturalSize.width <= 0 ||
      backgroundNaturalSize.height <= 0
    ) {
      return [];
    }

    const scale = Math.max(
      stageSize.width / backgroundNaturalSize.width,
      stageSize.height / backgroundNaturalSize.height
    );
    const renderedWidth = backgroundNaturalSize.width * scale;
    const renderedHeight = backgroundNaturalSize.height * scale;
    const offsetX = (stageSize.width - renderedWidth) / 2;
    const offsetY = (stageSize.height - renderedHeight) / 2;

    return roomHotspots.map((hotspot) => ({
      ...hotspot,
      left: offsetX + hotspot.x * scale,
      top: offsetY + hotspot.y * scale,
      widthPx: hotspot.width * scale,
      heightPx: hotspot.height * scale,
    }));
  }, [backgroundNaturalSize.height, backgroundNaturalSize.width, roomHotspots, stageSize.height, stageSize.width]);

  useEffect(() => {
    const element = stageRef.current;
    if (!element) return;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setStageSize({ width: rect.width, height: rect.height });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!showStageCharacter || holdCharacterIntro) return;
    const image = characterImageRef.current;
    if (!image) return;
    if (image.complete && image.naturalWidth > 0 && image.naturalHeight > 0) {
      syncCharacterMetrics(image);
      window.requestAnimationFrame(syncCharacterBox);
    }
  }, [activeCharacterSrc, holdCharacterIntro, showStageCharacter]);

  useEffect(() => {
    if (!showStageCharacter || holdCharacterIntro) {
      setCharacterImageBox({ left: 0, top: 0, width: 0, height: 0 });
      return;
    }

    const wrap = characterWrapRef.current;
    const image = characterImageRef.current;
    if (!wrap || !image) return;

    const updateBox = () => {
      window.requestAnimationFrame(syncCharacterBox);
    };

    updateBox();
    const wrapObserver = new ResizeObserver(updateBox);
    const imageObserver = new ResizeObserver(updateBox);
    wrapObserver.observe(wrap);
    imageObserver.observe(image);
    window.addEventListener("resize", updateBox);

    return () => {
      wrapObserver.disconnect();
      imageObserver.disconnect();
      window.removeEventListener("resize", updateBox);
    };
  }, [holdCharacterIntro, showStageCharacter]);

  useEffect(() => {
    if (!activeCharacterSrc) {
      setCharacterImageBox({ left: 0, top: 0, width: 0, height: 0 });
      hitCanvasRef.current = null;
      hitContextRef.current = null;
    }
  }, [activeCharacterSrc]);

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
          ...ALL_CHARACTER_SPRITES,
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
    if (!bootLoading) {
      setPlayBootSceneFade(true);
    }
  }, [bootLoading]);

  useEffect(() => {
    setHoldCharacterIntro(showStageCharacter);
  }, [displayedRoom, showStageCharacter]);

  useEffect(() => {
    if (!showStageCharacter) {
      setHoldCharacterIntro(false);
      return;
    }
    if (!activeBackgroundReady) return;
    const timer = window.setTimeout(() => {
      setHoldCharacterIntro(false);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [activeBackgroundReady, displayedRoom, showStageCharacter]);

  useEffect(() => {
    if (showStageCharacter) return;
    setCharacterPixelHover(false);
    onCharacterLeave();
  }, [onCharacterLeave, showStageCharacter]);

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
    const buttonRect = event.currentTarget.getBoundingClientRect();
    if (buttonRect.width <= 0 || buttonRect.height <= 0) {
      setPixelHover(false);
      return;
    }

    const ctx = hitContextRef.current;
    if (!ctx) {
      setPixelHover(true);
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

  const handleBackgroundLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    loadedImagesRef.current.add(backgroundSrc);
    setBackgroundNaturalSize({
      width: image.naturalWidth,
      height: image.naturalHeight,
    });
    setActiveBackgroundReady(true);
  };

  return (
    <section className="stage scanlines" ref={stageRef}>
      <img
        className="scene-image"
        src={backgroundSrc}
        alt="Night city scene"
        onLoad={handleBackgroundLoad}
        onError={() => {
          loadedImagesRef.current.add(backgroundSrc);
          setActiveBackgroundReady(true);
        }}
      />
      <div className="stage-overlay" />
      {renderedHotspots.length > 0 && (
        <div className="hotspot-layer">
          {renderedHotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              type="button"
              className="stage-hotspot-debug"
              style={{
                left: `${hotspot.left}px`,
                top: `${hotspot.top}px`,
                width: `${hotspot.widthPx}px`,
                height: `${hotspot.heightPx}px`,
              }}
              aria-label={`Inspect ${hotspot.label}`}
              title={hotspot.label}
              onMouseEnter={onHotspotEnter}
              onMouseLeave={onHotspotLeave}
              onClick={() => onHotspotClick(hotspot.id)}
            />
          ))}
        </div>
      )}
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

      {showStageCharacter && !holdCharacterIntro && (
        <div className="character-wrap" ref={characterWrapRef}>
          <button
            className="character-hitbox"
            title="Talk"
            style={characterHitboxStyle}
            onMouseEnter={handleCharacterPointerMove}
            onMouseMove={handleCharacterPointerMove}
            onMouseLeave={handleCharacterMouseLeave}
            onClick={handleCharacterClick}
          />
          <AnimatePresence mode="wait">
            <motion.img
              ref={characterImageRef}
              key={`${stageCharacterId}-${activeCharacterEmotion}`}
              className={`character-image ${stageCharacterId === "lucy" ? "character-image-lucy" : ""}`.trim()}
              src={activeCharacterSrc ?? ""}
              alt={stageCharacter ? `${stageCharacter.name} portrait` : "Character portrait"}
              initial={{ opacity: 0.1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.05 }}
              onLoad={(event) => {
                syncCharacterMetrics(event.currentTarget);
                window.requestAnimationFrame(syncCharacterBox);
              }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            />
          </AnimatePresence>
        </div>
      )}

      {playBootSceneFade && (
        <motion.div
          className="stage-boot-fade"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          onAnimationComplete={() => setPlayBootSceneFade(false)}
        />
      )}

      <MapOverlay open={mapOpen} currentRoom={currentRoom} onClose={onMapClose} onSelectRoom={onMapSelect} />
    </section>
  );
}
