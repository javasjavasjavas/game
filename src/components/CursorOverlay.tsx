import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { CursorMode } from "../hooks/useGame";

interface Props {
  mode: CursorMode;
  icon: ReactNode;
  x: number;
  y: number;
}

export function CursorOverlay({ mode, icon, x, y }: Props) {
  if (mode === "none") return null;

  const label = mode === "talk" ? "TALK" : "USAR CON";

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.12 }}
      className="cursor-overlay"
      style={{ left: x, top: y }}
    >
      {mode === "talk" ? (
        <span className="cursor-tag cursor-tag-talk">
          <span className="cursor-tag-icon">{icon}</span>
          <span>{label}</span>
        </span>
      ) : (
        <>
          <span className="cursor-icon">{icon}</span>
          <span className="cursor-tag">{label}</span>
        </>
      )}
    </motion.div>
  );
}
