import { Clock3, Search, Zap } from "lucide-react";
import { NPCS } from "../game/data";
import { motion } from "framer-motion";

interface Props {
  message: string;
  clues: Array<{ id: string; text: string }>;
  onWait: () => void;
  onSolveClick: () => void;
  onAccuse: (npcId: string) => void;
  showAccuseList: boolean;
  mobileOpen: boolean;
}

export function Sidebar({ message, clues, onWait, onSolveClick, onAccuse, showAccuseList, mobileOpen }: Props) {
  return (
    <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
      <div className="brand">
        <h1>ISLA BRUMA</h1>
        <p>Aventura detectivesca inspirada en clasicos noventeros.</p>
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
