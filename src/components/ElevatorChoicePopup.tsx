import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const ELEVATOR_BACKGROUND = "/game-assets/background_elevator.jpg";

interface ElevatorChoicePopupProps {
  visible: boolean;
  onExitBuilding: () => void;
  onRooftop: () => void;
  onCancel: () => void;
}

export function ElevatorChoicePopup({
  visible,
  onExitBuilding,
  onRooftop,
  onCancel,
}: ElevatorChoicePopupProps) {
  const [showInner, setShowInner] = useState(false);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setShowInner(false);
    const timer = window.setTimeout(() => setShowInner(true), 200);
    return () => window.clearTimeout(timer);
  }, [visible]);

  const buttonStyle = (id: string) => ({
    fontSize: "clamp(0.4rem, 0.9vw, 0.55rem)",
    textTransform: "lowercase" as const,
    letterSpacing: "0.18em",
    color: hoveredAction === id ? "rgba(223,245,255,0.85)" : "rgba(180,213,229,0.62)",
    backgroundColor: hoveredAction === id ? "rgba(8,145,168,0.08)" : "transparent",
    border:
      hoveredAction === id
        ? "1px solid rgba(8,145,168,0.5)"
        : "1px solid rgba(136,183,210,0.16)",
    padding: "10px 24px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onCancel}
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
            src={ELEVATOR_BACKGROUND}
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
                "radial-gradient(circle at center, rgba(8,145,168,0.18) 0%, rgba(8,26,36,0.5) 48%, rgba(2,8,12,0.88) 100%), linear-gradient(to bottom, rgba(2,10,16,0.42) 0%, rgba(0,0,0,0.18) 34%, rgba(2,12,18,0.78) 100%)",
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
              maxWidth: 520,
              width: "100%",
              padding: "28px 32px 32px",
              background: "rgba(6, 12, 18, 0.95)",
              border: "1px solid rgba(97, 169, 204, 0.18)",
              margin: "0 24px",
              boxShadow: "0 0 32px rgba(8,145,168,0.1)",
            }}
          >
            <div
              style={{
                fontSize: "0.4rem",
                color: "rgba(144,197,224,0.28)",
                textAlign: "center",
                letterSpacing: "0.15em",
                marginBottom: 28,
                textTransform: "uppercase",
              }}
            >
              Building Transit - Floor Selector
            </div>

            <div
              style={{
                fontSize: "clamp(0.5rem, 1.2vw, 0.65rem)",
                color: "rgba(214,240,255,0.76)",
                letterSpacing: "0.12em",
                marginBottom: 18,
                paddingBottom: 14,
                borderBottom: "1px solid rgba(97,169,204,0.12)",
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              Elevator Destination
            </div>

            {showInner && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                style={{
                  fontSize: "clamp(0.42rem, 1vw, 0.55rem)",
                  color: "rgba(179,209,224,0.56)",
                  letterSpacing: "0.03em",
                  lineHeight: 2.5,
                  textAlign: "center",
                  whiteSpace: "pre-wrap",
                  marginBottom: 18,
                }}
              >
                The button panel buzzes under your thumb. Choose where the building drops you next.
              </motion.div>
            )}

            {showInner && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 12,
                  marginTop: 20,
                  paddingTop: 20,
                  borderTop: "1px solid rgba(97,169,204,0.12)",
                  flexWrap: "wrap",
                }}
              >
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onCancel}
                  onMouseEnter={() => setHoveredAction("cancel")}
                  onMouseLeave={() => setHoveredAction(null)}
                  style={buttonStyle("cancel")}
                >
                  cancel
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onRooftop}
                  onMouseEnter={() => setHoveredAction("rooftop")}
                  onMouseLeave={() => setHoveredAction(null)}
                  style={buttonStyle("rooftop")}
                >
                  rooftop
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onExitBuilding}
                  onMouseEnter={() => setHoveredAction("exit")}
                  onMouseLeave={() => setHoveredAction(null)}
                  style={buttonStyle("exit")}
                >
                  exit building
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
                  "linear-gradient(90deg, transparent, rgba(87,176,220,0.32) 30%, rgba(126,210,244,0.6) 50%, rgba(87,176,220,0.32) 70%, transparent)",
                pointerEvents: "none",
                boxShadow: "0 0 8px 2px rgba(8,145,168,0.16)",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
