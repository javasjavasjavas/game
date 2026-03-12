import { MapOverlay } from "./MapOverlay";
import type { RoomId } from "../game/types";

interface Props {
  onCharacterClick: () => void;
  onCharacterEnter: () => void;
  onCharacterLeave: () => void;
  mapOpen: boolean;
  currentRoom: RoomId;
  onMapClose: () => void;
  onMapSelect: (roomId: RoomId) => void;
}

export function StageView({
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
      <img className="scene-image" src="/game-assets/background_1.png" alt="Escena de Isla Bruma" />
      <div className="stage-overlay" />

      <div className="character-wrap" onMouseEnter={onCharacterEnter} onMouseLeave={onCharacterLeave}>
        <button className="character-hitbox" title="Hablar" onClick={onCharacterClick}>
          <img className="character-image" src="/game-assets/character_masked.png" alt="Personaje" />
        </button>
      </div>

      <MapOverlay open={mapOpen} currentRoom={currentRoom} onClose={onMapClose} onSelectRoom={onMapSelect} />
    </section>
  );
}
