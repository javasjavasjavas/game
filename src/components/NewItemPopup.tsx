import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const APARTMENT_BACKGROUND = "/game-assets/background_apartment.jpg";

interface NewItemPopupProps {
  icon: string;
  label: string;
  description?: string;
  visible: boolean;
  onPickUp: () => void;
  onDiscard: () => void;
}

export function NewItemPopup({
  icon,
  label,
  description,
  visible,
  onPickUp,
  onDiscard,
}: NewItemPopupProps) {
  const [showInner, setShowInner] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setShowInner(false);
    const timer = window.setTimeout(() => setShowInner(true), 200);
    return () => window.clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onDiscard}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "default",
            overflow: "hidden",
          }}
        >
          <motion.img
            src={APARTMENT_BACKGROUND}
            alt=""
            initial={{ opacity: 0, scale: 1.03, filter: "blur(16px)" }}
            animate={{ opacity: 1, scale: 1.015, filter: "blur(12px)" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(circle at center, rgba(8,10,18,0.18) 0%, rgba(8,10,18,0.5) 48%, rgba(4,4,8,0.84) 100%), linear-gradient(to bottom, rgba(0,0,0,0.54) 0%, rgba(0,0,0,0.16) 34%, rgba(0,0,0,0.72) 100%)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: 0.08,
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.3) 100%)",
              backgroundSize: "100% 4px",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            onClick={(event) => event.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: 480,
              width: "100%",
              padding: "28px 32px 32px",
              background: "rgba(10, 10, 15, 0.95)",
              border: "1px solid rgba(255,255,255,0.06)",
              margin: "0 24px",
            }}
          >
            <div
              style={{
                fontSize: "0.4rem",
                color: "rgba(255,255,255,0.2)",
                textAlign: "center",
                letterSpacing: "0.15em",
                marginBottom: 28,
                textTransform: "uppercase",
              }}
            >
              Evidence Log - Item Acquired
            </div>

            <div
              style={{
                fontSize: "clamp(0.5rem, 1.2vw, 0.65rem)",
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.12em",
                marginBottom: 24,
                paddingBottom: 14,
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                textAlign: "center",
              }}
            >
              You found an Item!
            </div>

            {showInner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{
                  lineHeight: 1,
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                <img
                  src={icon}
                  alt={label}
                  style={{
                    width: "clamp(64px, 12vw, 104px)",
                    height: "clamp(64px, 12vw, 104px)",
                    objectFit: "contain",
                    display: "inline-block",
                  }}
                />
              </motion.div>
            )}

            {showInner && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                style={{
                  fontSize: "clamp(0.45rem, 1.1vw, 0.6rem)",
                  color: "rgba(255,255,255,0.42)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  marginBottom: 12,
                }}
              >
                {label}
              </motion.div>
            )}

            {showInner && description && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                style={{
                  fontSize: "clamp(0.42rem, 1vw, 0.55rem)",
                  color: "rgba(255,255,255,0.42)",
                  letterSpacing: "0.02em",
                  lineHeight: 2.6,
                  textAlign: "center",
                  minHeight: 40,
                  whiteSpace: "pre-wrap",
                  marginBottom: 8,
                }}
              >
                {description}
              </motion.div>
            )}

            {showInner && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                style={{
                  marginTop: 20,
                  paddingTop: 20,
                  borderTop: "1px solid rgba(255,255,255,0.04)",
                }}
                className="popup-pill-row"
              >
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={(event) => {
                    event.stopPropagation();
                    onDiscard();
                  }}
                  className="pill-btn popup-pill-btn"
                >
                  DISCARD
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={(event) => {
                    event.stopPropagation();
                    onPickUp();
                  }}
                  className="pill-btn popup-pill-btn"
                >
                  PICK UP
                </motion.button>
              </motion.div>
            )}

            <motion.div
              initial={{ top: "-4px", opacity: 0 }}
              animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.4, delay: 0.05 }}
              style={{
                position: "absolute",
                left: 0,
                width: "100%",
                height: 2,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 70%, transparent)",
                pointerEvents: "none",
                boxShadow: "0 0 8px 2px rgba(255,255,255,0.1)",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
