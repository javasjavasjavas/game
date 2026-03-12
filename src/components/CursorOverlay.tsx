import { motion } from "framer-motion";
import type { CursorMode } from "../hooks/useGame";

interface Props {
  mode: CursorMode;
  icon: string;
  x: number;
  y: number;
}

export function CursorOverlay({ mode, icon, x, y }: Props) {
  if (mode === "none") return null;

  const label = mode === "talk" ? "HABLAR" : "USAR CON";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, x, y }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.12 }}
      className="cursor-overlay"
    >
      <span className="cursor-icon">{icon}</span>
      <span className="cursor-tag">{label}</span>
    </motion.div>
  );
}
