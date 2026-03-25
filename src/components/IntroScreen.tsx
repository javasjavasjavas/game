import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const INTRO_TEXT = `I woke up past midnight with my head full of static and the taste of bad whiskey still clinging to my mouth. The last few hours were a blur.

Outside, the city kept breathing through neon, lies, and dirty deals.

In this town, nobody disappears by accident.`;
const CHAR_DELAY = 30;
const VOICE_TRACK = "/game-assets/audio/chapter_1_voice.mp3";
const APARTMENT_BACKGROUND = "/game-assets/background_apartment.jpg";

interface IntroScreenProps {
  onContinue: () => void;
}

export function IntroScreen({ onContinue }: IntroScreenProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<number | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let index = 0;
    timerRef.current = window.setInterval(() => {
      index += 1;
      setDisplayedText(INTRO_TEXT.slice(0, index));
      if (index >= INTRO_TEXT.length) {
        if (timerRef.current !== null) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsTyping(false);
      }
    }, CHAR_DELAY);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const voice = new Audio(VOICE_TRACK);
    voice.preload = "auto";
    voice.volume = 1;
    voiceRef.current = voice;
    const playPromise = voice.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Browser autoplay can still reject until audio is unlocked by a user gesture.
      });
    }

    return () => {
      voice.pause();
      voice.currentTime = 0;
      voiceRef.current = null;
    };
  }, []);

  const handleSkip = useCallback(() => {
    if (!isTyping) return;
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setDisplayedText(INTRO_TEXT);
    setIsTyping(false);
    if (voiceRef.current) {
      voiceRef.current.pause();
    }
  }, [isTyping]);

  const handleContinue = () => {
    setIsExiting(true);
    if (voiceRef.current) {
      voiceRef.current.pause();
    }
    window.setTimeout(onContinue, 600);
  };

  return (
    <motion.section
      className="chapter-intro-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.img
        className="chapter-intro-bg"
        src={APARTMENT_BACKGROUND}
        alt=""
        initial={{ opacity: 0, scale: 1.03, filter: "blur(16px)" }}
        animate={{
          opacity: isExiting ? 0.92 : 1,
          scale: isExiting ? 1 : 1.015,
          filter: isExiting ? "blur(6px)" : "blur(12px)",
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <div className="chapter-intro-bg-fade" />
      <div className="chapter-intro-scanlines" />

      <motion.div
        className="chapter-intro-box"
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: isExiting ? 0 : 1,
          y: isExiting ? -10 : 0,
          scale: isExiting ? 0.985 : 1,
        }}
        transition={{ duration: 0.55, delay: 0.3 }}
      >
        <div className="chapter-intro-classification">Document #P-2087 - Eyes Only</div>

        <div className="chapter-intro-header">Chapter One: Blondie</div>

        <div className="chapter-intro-text">
          {displayedText}
          {isTyping && <span className="chapter-intro-cursor" />}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: isTyping ? 2.5 : 0, duration: 0.6 }}
          className="chapter-intro-actions"
        >
          <motion.button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (isTyping) {
                handleSkip();
                return;
              }
              handleContinue();
            }}
            whileTap={{ scale: 0.97 }}
            className="pill-btn chapter-intro-pill-btn"
          >
            {isTyping ? "SKIP" : "CONTINUE"}
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
