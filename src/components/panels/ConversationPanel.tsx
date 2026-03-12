import { AnimatePresence, motion } from "framer-motion";
import type { DialogueEntry, Npc } from "../../game/types";

interface Props {
  open: boolean;
  npc: Npc | null;
  dialogue: DialogueEntry | null;
  selectingNpc: boolean;
  npcsHere: Npc[];
  onSelectNpc: (npcId: string) => void;
  onPickOption: (optionId: string) => void;
  onClose: () => void;
}

export function ConversationPanel({
  open,
  npc,
  dialogue,
  selectingNpc,
  npcsHere,
  onSelectNpc,
  onPickOption,
  onClose,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="detail-box open"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.2 }}
        >
          <div className="conversation-layout">
            <div>
              <h3 className="conversation-speaker">
                {selectingNpc ? "QUIEN" : npc?.name.split(" ")[0].toUpperCase() || "NADIE"}
              </h3>
              <p className="conversation-quote">
                {selectingNpc ? "Con quien quieres hablar?" : dialogue?.intro || "No parece querer hablar."}
              </p>
            </div>
            <div className="conversation-divider" />
            <div className="detail-choices">
              {selectingNpc
                ? npcsHere.map((item) => (
                    <button className="talk-option" key={item.id} onClick={() => onSelectNpc(item.id)}>
                      {item.name}
                    </button>
                  ))
                : dialogue?.options.map((option) => (
                    <button className="talk-option" key={option.id} onClick={() => onPickOption(option.id)}>
                      {option.text}
                    </button>
                  ))}
              <button className="talk-option end" onClick={onClose}>
                [Terminar conversacion]
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
