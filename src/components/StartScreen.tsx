import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const BG_IMAGE = "/game-assets/background_intro.jpg";
const NEXT_SCENE_BG_IMAGE = "/game-assets/background_apartment.jpg";
const TITLE = "PARADOX";
const SUBTITLE = "After Hours";
const LOGO_DELAY = 900;
const BUTTON_DELAY = 1700;
const EXIT_DURATION_MS = 800;
const CORRUPT_CHARS = "▓░▒█▄▀■□▪▫◊◈⬡⬢⏣⎔";

const PRELOADED_IMAGES = new Set<string>();

function preloadImage(src: string): Promise<void> {
  if (PRELOADED_IMAGES.has(src)) return Promise.resolve();

  return new Promise((resolve) => {
    const image = new Image();
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      PRELOADED_IMAGES.add(src);
      resolve();
    };

    image.onload = done;
    image.onerror = done;
    image.src = src;

    if (image.complete) {
      done();
    }
  });
}

function getCorruptChar(): string {
  return CORRUPT_CHARS[Math.floor(Math.random() * CORRUPT_CHARS.length)];
}

function useCorruptionEffect(text: string, interval = 5000) {
  const [displayChars, setDisplayChars] = useState(text.split(""));
  const [isCorrupting, setIsCorrupting] = useState(false);
  const [skew, setSkew] = useState(0);
  const [chromaOffset, setChromaOffset] = useState(2);
  const [showScanline, setShowScanline] = useState(false);
  const [variantIndex, setVariantIndex] = useState(0);

  useEffect(() => {
    let activeCleanup: (() => void) | undefined;
    let scanlineTimer = 0;

    const runVariant = (variant: number) => {
      activeCleanup?.();
      setIsCorrupting(true);
      setShowScanline(true);
      window.clearTimeout(scanlineTimer);
      scanlineTimer = window.setTimeout(() => setShowScanline(false), 150);

      const original = text.split("");

      if (variant === 0) {
        let frame = 0;
        const totalFrames = 10;
        const scrambleTimer = window.setInterval(() => {
          frame += 1;
          const rate = 1 - frame / totalFrames;
          setDisplayChars(
            original.map((char) =>
              char === " " ? " " : Math.random() < rate * 0.7 ? getCorruptChar() : char,
            ),
          );

          if (frame <= 6) {
            setSkew(frame % 2 === 0 ? -5 : 5);
            setChromaOffset(2 + (frame / 6) * 4);
          } else {
            setSkew(0);
            setChromaOffset(2);
          }

          if (frame >= totalFrames) {
            window.clearInterval(scrambleTimer);
            setDisplayChars(original);
            setSkew(0);
            setChromaOffset(2);
            setIsCorrupting(false);
          }
        }, 30);

        activeCleanup = () => window.clearInterval(scrambleTimer);
        return;
      }

      if (variant === 1) {
        let resolved = 0;
        const scrambleAllTimer = window.setInterval(() => {
          setDisplayChars(
            original.map((char, index) => (char === " " ? " " : index < resolved ? char : getCorruptChar())),
          );
          setChromaOffset(4);
        }, 25);

        const resolveTimer = window.setInterval(() => {
          resolved += 1;
          if (resolved > original.length) {
            window.clearInterval(scrambleAllTimer);
            window.clearInterval(resolveTimer);
            setDisplayChars(original);
            setChromaOffset(2);
            setSkew(0);
            setIsCorrupting(false);
          }
        }, 80);

        let jitterFrame = 0;
        const jitterTimer = window.setInterval(() => {
          jitterFrame += 1;
          setSkew(jitterFrame % 2 === 0 ? 2 : -2);
          if (jitterFrame > 8) {
            window.clearInterval(jitterTimer);
            setSkew(0);
          }
        }, 50);

        activeCleanup = () => {
          window.clearInterval(scrambleAllTimer);
          window.clearInterval(resolveTimer);
          window.clearInterval(jitterTimer);
        };
        return;
      }

      let frame = 0;
      const totalFrames = 14;
      const flickerTimer = window.setInterval(() => {
        frame += 1;

        if (frame % 2 === 0) {
          setChromaOffset(Math.random() * 8 + 2);
          setSkew((Math.random() - 0.5) * 10);
          setDisplayChars(
            original.map((char) => (char === " " ? " " : Math.random() < 0.25 ? getCorruptChar() : char)),
          );
        } else {
          setChromaOffset(2);
          setSkew(0);
          setDisplayChars(original);
        }

        if (frame >= totalFrames) {
          window.clearInterval(flickerTimer);
          setDisplayChars(original);
          setSkew(0);
          setChromaOffset(2);
          setIsCorrupting(false);
        }
      }, 35);

      activeCleanup = () => window.clearInterval(flickerTimer);
    };

    const intervalTimer = window.setInterval(() => {
      setVariantIndex((previous) => {
        runVariant(previous);
        return (previous + 1) % 3;
      });
    }, interval);

    return () => {
      window.clearInterval(intervalTimer);
      window.clearTimeout(scanlineTimer);
      activeCleanup?.();
    };
  }, [text, interval]);

  return { displayChars, isCorrupting, skew, chromaOffset, showScanline, variantIndex };
}

function GlitchText({ text }: { text: string }) {
  const { displayChars, isCorrupting, skew, chromaOffset, showScanline, variantIndex } =
    useCorruptionEffect(text, 5000);

  return (
    <div className="start-screen-glitch-wrap">
      {showScanline && <div className="corruption-scanline" />}
      <h1
        className={`start-screen-glitch-title ${isCorrupting ? "is-corrupting" : ""}`}
        data-variant={variantIndex}
        style={{
          transform: `skewX(${skew}deg)`,
          transition: "transform 0.03s linear",
          textShadow: [
            `${-chromaOffset}px 0 0 #c9234e`,
            `${chromaOffset}px 0 0 #0891a8`,
            "0 0 40px rgba(8,145,168,0.3)",
            "0 0 80px rgba(201,35,78,0.15)",
            "0 4px 30px rgba(0,0,0,0.7)",
          ].join(", "),
        }}
      >
        {displayChars.map((char, index) => (
          <span
            key={`${char}-${index}`}
            style={{
              display: "inline-block",
              minWidth: char === " " ? "0.3em" : undefined,
            }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
}

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [showLogo, setShowLogo] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [backgroundReady, setBackgroundReady] = useState(false);
  const nextSceneBackgroundPromiseRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    preloadImage(BG_IMAGE).then(() => setBackgroundReady(true));
  }, []);

  useEffect(() => {
    if (!backgroundReady) return;

    const logoTimer = window.setTimeout(() => setShowLogo(true), LOGO_DELAY);
    const buttonTimer = window.setTimeout(() => setShowButton(true), BUTTON_DELAY);

    return () => {
      window.clearTimeout(logoTimer);
      window.clearTimeout(buttonTimer);
    };
  }, [backgroundReady]);

  useEffect(() => {
    if (!showButton) return;
    nextSceneBackgroundPromiseRef.current = preloadImage(NEXT_SCENE_BG_IMAGE);
  }, [showButton]);

  const handleStart = async () => {
    if (isExiting) return;
    setIsExiting(true);
    const nextSceneBackgroundPromise = preloadImage(NEXT_SCENE_BG_IMAGE);
    nextSceneBackgroundPromiseRef.current = nextSceneBackgroundPromise;

    await Promise.all([
      nextSceneBackgroundPromise,
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, EXIT_DURATION_MS);
      }),
    ]);

    onStart();
  };

  return (
    <motion.section
      className="start-screen"
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
            <span className="start-screen-loading-text">Loading Game</span>
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
              <motion.div
                className="start-screen-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
              >
                <GlitchText text={TITLE} />
              </motion.div>
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}
