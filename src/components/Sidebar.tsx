import { Clock3, MapPin, Search, Zap } from "lucide-react";
import { NPCS } from "../game/data";
import { motion } from "framer-motion";
import type { CharacterMemory } from "../hooks/useGame";

interface Props {
  roomName: string;
  roomDescription: string;
  clock: string;
  dateLabel: string;
  message: string;
  clues: Array<{ id: string; text: string }>;
  characters: CharacterMemory[];
  selectedCharacter: CharacterMemory | null;
  onSelectCharacter: (npcId: string) => void;
  onWait: () => void;
  onSolveClick: () => void;
  onAccuse: (npcId: string) => void;
  showAccuseList: boolean;
  mobileOpen: boolean;
}

export function Sidebar({
  roomName,
  roomDescription,
  clock,
  dateLabel,
  message,
  clues,
  characters,
  selectedCharacter,
  onSelectCharacter,
  onWait,
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
        <div className="sidebar-clock-frame">
          <div className="sidebar-clock">{clock}</div>
          <div className="sidebar-date">{dateLabel}</div>
        </div>
      </div>

      <section className="panel">
        <h2>Characters</h2>
        <div className="characters-list">
          {characters.length === 0 ? (
            <p>No character records yet.</p>
          ) : (
            characters.map((character) => (
              <button
                key={character.npcId}
                className={`character-row ${selectedCharacter?.npcId === character.npcId ? "active" : ""}`}
                onClick={() => onSelectCharacter(character.npcId)}
              >
                <img className="character-thumb" src={character.portrait} alt={`${character.name} portrait`} />
                <span className="character-name">{character.name}</span>
              </button>
            ))
          )}
        </div>

        {selectedCharacter && (
          <div className="character-memory">
            <h3>{selectedCharacter.name}</h3>
            {selectedCharacter.notes.length === 0 ? (
              <p>No valuable conversation data stored yet.</p>
            ) : (
              <ul className="character-notes">
                {selectedCharacter.notes.map((note, index) => (
                  <li key={`${selectedCharacter.npcId}-${index}`}>{note}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      <section className="panel blue">
        <h2>Clues</h2>
        <ul className="clues">
          {clues.length === 0 ? (
            <li><Search size={14} className="inline-icon" /> No clues yet.</li>
          ) : (
            clues.map((clue) => <li key={clue.id}>{clue.text}</li>)
          )}
        </ul>
      </section>

      <section className="panel" style={{ marginTop: "auto" }}>
        <h2>Actions</h2>
        <button className="action-btn" onClick={onWait}>
          <Clock3 size={14} /> Wait 30 minutes
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
        <div className="status">{message}</div>
      </section>
    </aside>
  );
}
