import { Clock3, MapPin, Search, Zap } from "lucide-react";
import { NPCS } from "../game/data";
import { motion } from "framer-motion";

interface Props {
  roomName: string;
  roomDescription: string;
  clock: string;
  dateLabel: string;
  message: string;
  clues: Array<{ id: string; text: string }>;
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
        <h2>Dialogo</h2>
        <p>{message}</p>
      </section>

      <section className="panel blue">
        <h2>Pistas</h2>
        <ul className="clues">
          {clues.length === 0 ? (
            <li><Search size={14} className="inline-icon" /> Sin pistas todavia.</li>
          ) : (
            clues.map((clue) => <li key={clue.id}>{clue.text}</li>)
          )}
        </ul>
      </section>

      <section className="panel" style={{ marginTop: "auto" }}>
        <h2>Acciones</h2>
        <button className="action-btn" onClick={onWait}>
          <Clock3 size={14} /> Esperar 30 minutos
        </button>
        <button className="action-btn warn" onClick={onSolveClick}>
          <Zap size={14} /> Presentar acusacion
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
