import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const INTRO_TEXT = `I woke up past midnight with my head full of static and the taste of bad whiskey still clinging to my mouth. The last few hours were a blur.

Outside, the city kept breathing through neon, lies, and dirty deals.

In this town, nobody disappears by accident.`;
const CHAR_DELAY = 30;
const VOICE_TRACK = "/game-assets/audio/chapter_1_voice.mp3";
const APARTMENT_BACKGROUND = "/game-assets/background_apartment.jpg";
const RECOMMENDATION_ART = "/game-assets/icon_sound_recomendation.png";
const RECOMMENDATION_ART_FALLBACK = "/game-assets/icon_sound.png";

interface IntroScreenProps {
  onContinue: () => void;
  onUserInteract?: () => void;
}

export function IntroScreen({ onContinue, onUserInteract }: IntroScreenProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [readyToPlay, setReadyToPlay] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [recommendationArtSrc, setRecommendationArtSrc] = useState(RECOMMENDATION_ART);
  const timerRef = useRef<number | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!readyToPlay) return;

    setDisplayedText("");
    setIsTyping(true);
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
  }, [readyToPlay]);

  useEffect(() => {
    if (!readyToPlay) return;

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
  }, [readyToPlay]);

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

  const handleAcceptRecommendation = () => {
    onUserInteract?.();
    setReadyToPlay(true);
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
          {readyToPlay && isTyping && <span className="chapter-intro-cursor" />}
        </div>

        {readyToPlay && (
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
        )}
      </motion.div>

      {!readyToPlay && (
        <motion.div
          className="chapter-intro-recommendation-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="chapter-intro-recommendation-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="chapter-intro-recommendation-kicker">Recommended Setup</div>
            <div className="chapter-intro-recommendation-title">Best Experienced on Desktop</div>
            <p className="chapter-intro-recommendation-copy">
              This game is designed for desktop, and we recommend using headphones for a more immersive experience.
            </p>

            <div className="chapter-intro-recommendation-art-wrap">
              <img
                className="chapter-intro-recommendation-art"
                src={recommendationArtSrc}
                alt="Desktop plus headphones recommended"
                onError={() => {
                  if (recommendationArtSrc !== RECOMMENDATION_ART_FALLBACK) {
                    setRecommendationArtSrc(RECOMMENDATION_ART_FALLBACK);
                  }
                }}
              />
            </div>

            <div className="popup-pill-row chapter-intro-recommendation-actions">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={handleAcceptRecommendation}
                className="pill-btn popup-pill-btn"
              >
                ACCEPT
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
}
