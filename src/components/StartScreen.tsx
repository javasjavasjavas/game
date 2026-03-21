import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const BG_IMAGE = "/game-assets/background_intro.jpg";
const LOGO_IMAGE = "/game-assets/logo.png";
const SUBTITLE = "After Hours";
const LOGO_DELAY = 900;
const BUTTON_DELAY = 1700;
const EXIT_DURATION_MS = 800;

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [showLogo, setShowLogo] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const logoTimer = window.setTimeout(() => setShowLogo(true), LOGO_DELAY);
    const buttonTimer = window.setTimeout(() => setShowButton(true), BUTTON_DELAY);

    return () => {
      window.clearTimeout(logoTimer);
      window.clearTimeout(buttonTimer);
    };
  }, []);

  const handleStart = () => {
    if (isExiting) return;
    setIsExiting(true);
    window.setTimeout(onStart, EXIT_DURATION_MS);
  };

  return (
    <motion.section
      className="start-screen"
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: EXIT_DURATION_MS / 1000, ease: "easeInOut" }}
    >
      <motion.img
        className="start-screen-bg"
        src={BG_IMAGE}
        alt=""
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.8, ease: "easeOut" }}
      />

      <div className="start-screen-radial" />
      <div className="start-screen-fade" />
      <div className="start-screen-scanlines" />

      <div className="start-screen-content">
        <AnimatePresence>
          {showLogo && (
            <motion.div
              className="start-screen-logo-block"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <motion.img
                className="start-screen-logo"
                src={LOGO_IMAGE}
                alt="Paradox After Hours"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
              />
              <motion.p
                className="start-screen-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.1, delay: 0.4, ease: "easeOut" }}
              >
                {SUBTITLE}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.button
                type="button"
                className="start-screen-button"
                onClick={handleStart}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="start-screen-button-glow" />
                <span className="start-screen-button-body">Start Game</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
