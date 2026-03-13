import { Clock3, MapPin, Zap } from "lucide-react";
import { NPCS } from "../game/data";
import { motion } from "framer-motion";
import type { CharacterMemory } from "../hooks/useGame";

interface Props {
  roomName: string;
  roomDescription: string;
  characters: CharacterMemory[];
  expandedCharacter: CharacterMemory | null;
  onToggleCharacter: (npcId: string) => void;
  onWait: () => void;
  onTakeCab: () => void;
  onSolveClick: () => void;
  onAccuse: (npcId: string) => void;
  showAccuseList: boolean;
  mobileOpen: boolean;
}

export function Sidebar({
  roomName,
  roomDescription,
  characters,
  expandedCharacter,
  onToggleCharacter,
  onWait,
  onTakeCab,
  onSolveClick,
  onAccuse,
  showAccuseList,
  mobileOpen,
}: Props) {
  return (
    <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
      <div className="sidebar-meta">
        <div className="sidebar-room-row">
          <MapPin size={24} className="sidebar-meta-icon" />
          <h1>{roomName.toUpperCase()}</h1>
        </div>
        <p className="sidebar-room-description">{roomDescription}</p>
      </div>

      <section className="panel">
        <h2>Characters</h2>
        <div className="characters-list">
          {characters.length === 0 ? (
            <p>No character records yet.</p>
          ) : (
            characters.map((character) => (
              <div key={character.npcId} className={`character-card ${expandedCharacter?.npcId === character.npcId ? "expanded" : ""}`}>
                <button
                  className={`character-row ${expandedCharacter?.npcId === character.npcId ? "active" : ""}`}
                  onClick={() => onToggleCharacter(character.npcId)}
                >
                  <img className="character-thumb" src={character.portrait} alt={`${character.name} portrait`} />
                  <span className="character-name">{character.name}</span>
                  {character.hasNewClue && <span className="character-tag">New clue</span>}
                </button>
                {expandedCharacter?.npcId === character.npcId && character.clues.length > 0 && (
                  <div className="character-detail">
                    <p className="character-description">{character.description}</p>
                    <h3 className="character-clues-title">Clues</h3>
                    <ul className="character-notes">
                      {character.clues.map((clue, index) => (
                        <li key={`${character.npcId}-${index}`} className="character-clue">{clue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {expandedCharacter?.npcId === character.npcId && character.clues.length === 0 && (
                  <div className="character-detail">
                    <p className="character-description">{character.description}</p>
                    <h3 className="character-clues-title">Clues</h3>
                    <p>No clues yet.</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      <section className="panel" style={{ marginTop: "auto" }}>
        <h2>Actions</h2>
        <button className="action-btn" onClick={onWait}>
          <Clock3 size={14} /> Wait 30 minutes
        </button>
        <button className="action-btn" onClick={onTakeCab}>
          <MapPin size={14} /> Take a cab
        </button>
        <button className="action-btn warn" onClick={onSolveClick}>
          <Zap size={14} /> Submit accusation
        </button>
        {showAccuseList && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="dialogue-choices">
            {NPCS.map((npc) => (
              <button key={npc.id} className="choice-btn" onClick={() => onAccuse(npc.id)}>
                {npc.name}
              </button>
            ))}
          </motion.div>
        )}
      </section>
    </aside>
  );
}
