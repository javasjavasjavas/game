import type { Npc } from "../game/types";

interface Props {
  npcsHere: Npc[];
  onNpcClick: (npcId: string) => void;
  onCharacterClick: () => void;
  onCharacterEnter: () => void;
  onCharacterLeave: () => void;
}

export function StageView({ npcsHere, onNpcClick, onCharacterClick, onCharacterEnter, onCharacterLeave }: Props) {
  return (
    <section className="stage">
      <img className="scene-image" src="/game-assets/background_1.png" alt="Escena de Isla Bruma" />
      <div className="stage-overlay" />

      <div className="npc-strip">
        {npcsHere.map((npc) => (
          <button className="npc-chip" key={npc.id} onClick={() => onNpcClick(npc.id)}>
            {npc.name}
          </button>
        ))}
      </div>

      <div className="character-wrap" onMouseEnter={onCharacterEnter} onMouseLeave={onCharacterLeave}>
        <button className="character-hitbox" title="Hablar" onClick={onCharacterClick}>
          <img className="character-image" src="/game-assets/character_masked.png" alt="Personaje" />
        </button>
      </div>
    </section>
  );
}
