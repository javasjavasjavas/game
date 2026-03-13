import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { CHARACTER_BY_ID, STAGE_CHARACTER_ID } from "../game/data";
import { MapOverlay } from "./MapOverlay";
import type { CharacterEmotion, RoomId } from "../game/types";

const STAGE_CHARACTER = CHARACTER_BY_ID[STAGE_CHARACTER_ID];
const CHARACTER_BY_EMOTION: Record<CharacterEmotion, string> = STAGE_CHARACTER.emotions;

interface Props {
  emotion: CharacterEmotion;
  onCharacterClick: () => void;
  onCharacterEnter: () => void;
  onCharacterLeave: () => void;
  mapOpen: boolean;
  currentRoom: RoomId;
  onMapClose: () => void;
  onMapSelect: (roomId: RoomId) => void;
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
  const hasPreloadedOtherSprite = useRef(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [firstSpriteLoaded, setFirstSpriteLoaded] = useState(false);
  const stageLoading = useMemo(() => !(backgroundLoaded && firstSpriteLoaded), [backgroundLoaded, firstSpriteLoaded]);

  const handleActiveSpriteLoad = () => {
    setFirstSpriteLoaded(true);

    if (hasPreloadedOtherSprite.current) return;
    hasPreloadedOtherSprite.current = true;

    const activeSrc = CHARACTER_BY_EMOTION[emotion];
    const alternateSrc = Object.values(CHARACTER_BY_EMOTION).find((src) => src !== activeSrc);
    if (!alternateSrc) return;

    const preloadImage = new Image();
    preloadImage.src = alternateSrc;
  };

  return (
    <section className="stage">
      <img
        className="scene-image"
        src="/game-assets/background_1.png"
        alt="Night city scene"
        onLoad={() => setBackgroundLoaded(true)}
        onError={() => setBackgroundLoaded(true)}
      />
      <div className="stage-overlay" />
      {stageLoading && (
        <div className="stage-loading">
          <span className="stage-loading-spinner" />
          <span className="stage-loading-text">Loading assets...</span>
        </div>
      )}

      <div className="character-wrap" onMouseEnter={onCharacterEnter} onMouseLeave={onCharacterLeave}>
        <button className="character-hitbox" title="Talk" onClick={onCharacterClick}>
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
              onError={() => setFirstSpriteLoaded(true)}
              transition={{ duration: 0.28, ease: "easeOut" }}
            />
          </AnimatePresence>
        </button>
      </div>

      <MapOverlay open={mapOpen} currentRoom={currentRoom} onClose={onMapClose} onSelectRoom={onMapSelect} />
    </section>
  );
}
