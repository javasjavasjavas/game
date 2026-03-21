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
  onUserInteract?: () => void;
}

export function StartScreen({ onStart, onUserInteract }: StartScreenProps) {
  const [showLogo, setShowLogo] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [backgroundReady, setBackgroundReady] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = BG_IMAGE;
    image.onload = () => setBackgroundReady(true);
    image.onerror = () => setBackgroundReady(true);
    if (image.complete) {
      setBackgroundReady(true);
    }

    if (!backgroundReady) return;

    const logoTimer = window.setTimeout(() => setShowLogo(true), LOGO_DELAY);
    const buttonTimer = window.setTimeout(() => setShowButton(true), BUTTON_DELAY);

    return () => {
      window.clearTimeout(logoTimer);
      window.clearTimeout(buttonTimer);
    };
  }, [backgroundReady]);

  const handleStart = () => {
    if (onUserInteract) onUserInteract();
    if (isExiting) return;
    setIsExiting(true);
    window.setTimeout(onStart, EXIT_DURATION_MS);
  };

  return (
    <motion.section
      className="start-screen"
      onPointerDown={onUserInteract}
      onPointerMove={onUserInteract}
      onClick={onUserInteract}
      onKeyDown={onUserInteract}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: EXIT_DURATION_MS / 1000, ease: "easeInOut" }}
    >
      {backgroundReady && (
        <motion.img
          className="start-screen-bg"
          src={BG_IMAGE}
          alt=""
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.8, ease: "easeOut" }}
        />
      )}

      <div className="start-screen-radial" />
      <div className="start-screen-fade" />
      <div className="start-screen-scanlines" />

      {!backgroundReady && (
        <div className="start-screen-loading">
          <div className="start-screen-loading-inner">
            <span className="start-screen-loading-text">Loading Intro</span>
            <div className="start-screen-loading-bar" aria-hidden>
              <span className="start-screen-loading-segment filled" />
              <span className="start-screen-loading-segment filled" />
              <span className="start-screen-loading-segment filled" />
              <span className="start-screen-loading-segment" />
              <span className="start-screen-loading-segment" />
              <span className="start-screen-loading-segment" />
            </div>
          </div>
        </div>
      )}

      <motion.div
        className="start-screen-content"
        animate={{
          gap: showButton ? 54 : 18,
          y: showButton ? -34 : 0,
        }}
        transition={{
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <AnimatePresence>
          {showLogo && (
            <motion.div
              layout
              className="start-screen-logo-block"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{
                opacity: { duration: 1.2, ease: "easeOut" },
                y: { duration: 1.2, ease: "easeOut" },
                layout: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
              }}
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
              className="start-screen-cta-block"
              layout
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                opacity: { duration: 0.8, ease: "easeOut" },
                y: { duration: 0.8, ease: "easeOut" },
                layout: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              }}
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

              <motion.p
                className="start-screen-audio-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.22, 0.75, 0.22] }}
                transition={{
                  delay: 0.35,
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Click anywhere to activate the music
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}
