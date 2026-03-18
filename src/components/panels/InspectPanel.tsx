import { AnimatePresence, motion } from "framer-motion";

interface Props {
  open: boolean;
  title?: string;
  text: string;
  onClose: () => void;
}

export function InspectPanel({ open, title = "Inspection", text, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="detail-box inspect-box open"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.2 }}
        >
          <button className="detail-close" onClick={onClose}>
            <img className="detail-close-icon" src="/game-assets/icon_cross.png" alt="Close" />
          </button>
          <h3 className="detail-title">{title}</h3>
          <p className="detail-text">{text}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
