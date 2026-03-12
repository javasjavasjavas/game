import { AnimatePresence, motion } from "framer-motion";
import { MapOverlay } from "./MapOverlay";
import type { CharacterEmotion, RoomId } from "../game/types";

const CHARACTER_BY_EMOTION: Record<CharacterEmotion, string> = {
  serious: "/game-assets/character_big_boss_serious.png",
  happy: "/game-assets/character_big_boss_happy.png",
};

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
  return (
    <section className="stage">
      <img className="scene-image" src="/game-assets/background_1.png" alt="Bruma Island scene" />
      <div className="stage-overlay" />

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
              transition={{ duration: 0.28, ease: "easeOut" }}
            />
          </AnimatePresence>
        </button>
      </div>

      <MapOverlay open={mapOpen} currentRoom={currentRoom} onClose={onMapClose} onSelectRoom={onMapSelect} />
    </section>
  );
}
