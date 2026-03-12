import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  text: string;
  onClose: () => void;
}

export function InspectPanel({ open, text, onClose }: Props) {
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
          <button className="detail-close" onClick={onClose}>
            <X size={12} />
          </button>
          <h3 className="detail-title">Inspeccion</h3>
          <p className="detail-text">{text}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
