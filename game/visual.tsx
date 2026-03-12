import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  createElement,
} from 'react'
/**
 * ISLA BRUMA — Complete Game UI
 *
 * Self-contained component. Dependencies:
 *   npm install framer-motion lucide-react
 *
 * Tailwind config needs these extensions (merge into your tailwind.config):
 *   fontFamily: { orbitron: ['Orbitron', 'sans-serif'], mono: ['JetBrains Mono', 'monospace'] }
 *   colors: { noir: { 900: '#020205', 800: '#08090f', 700: '#0f1019' }, cyber: { pink: '#c9234e', blue: '#0891a8' } }
 *   boxShadow: { 'pink-glow': '0 0 10px rgba(201,35,78,0.15)', 'blue-glow': '0 0 10px rgba(8,145,168,0.15)' }
 *
 * Add this Google Fonts import to your index.html or CSS:
 *   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@400;700;900&display=swap');
 *
 * Add these CSS classes to your global stylesheet (index.css):
 *   (See GLOBAL_STYLES constant below — or call injectStyles() on mount)
 */

import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPinIcon,
  MessageSquareIcon,
  ChevronRightIcon,
  SearchIcon,
  MapIcon,
  XIcon,
  MenuIcon,
  ClockIcon,
  ZapIcon,
} from 'lucide-react'
// ─── ASSETS ──────────────────────────────────────────────
const CHARACTER_IMG =
  'https://cdn.magicpatterns.com/uploads/hESwmt8e3yesyiRAo481EW/freepik__cyberpunk-man-pixel-art-style-head-and-chest-he-we__56625.png'
const SCENE_IMG =
  'https://cdn.magicpatterns.com/uploads/tuXXcARL1gF2hmCRS31GRz/freepik__pixel-art-scene-noir-ultrarealism-a-jazz-trio-play__56623.png'
// ─── DATA ────────────────────────────────────────────────
const LOCATIONS = [
  {
    name: 'Lobby del Hotel',
    x: 50,
    y: 45,
    active: true,
  },
  {
    name: 'Muelle',
    x: 15,
    y: 70,
  },
  {
    name: 'Playa Norte',
    x: 80,
    y: 75,
  },
  {
    name: 'Faro',
    x: 75,
    y: 20,
  },
  {
    name: 'Plaza Central',
    x: 35,
    y: 25,
  },
  {
    name: 'Callejón Oscuro',
    x: 20,
    y: 35,
  },
]
const CONNECTIONS = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [4, 5],
  [1, 5],
]
const INVENTORY_ITEMS = [
  {
    icon: '🔑',
    label: 'Llave oxidada',
  },
  {
    icon: '📰',
    label: 'Periódico viejo',
  },
  {
    icon: '☕',
    label: 'Taza de café',
  },
]
// ─── GLOBAL STYLES (inject once) ─────────────────────────
const GLOBAL_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@400;700;900&display=swap');
:root{--noir-bg:#000;--noir-surface:#08090f;--cyber-pink:#c9234e;--cyber-blue:#0891a8}
.scanlines{position:relative}
.scanlines::before{content:" ";display:block;position:absolute;inset:0;background:linear-gradient(to bottom,rgba(255,255,255,0),rgba(255,255,255,0) 50%,rgba(0,0,0,.15) 50%,rgba(0,0,0,.15));background-size:100% 4px;z-index:50;pointer-events:none;opacity:.3}
.chromatic-aberration{text-shadow:-1px 0 0 var(--cyber-pink),1px 0 0 var(--cyber-blue)}
.perspective-grid-container{position:absolute;bottom:0;left:0;width:100%;height:50%;perspective:600px;overflow:hidden;z-index:0}
.perspective-grid{position:absolute;width:200%;height:200%;bottom:-50%;left:-50%;transform-origin:bottom center;transform:rotateX(75deg);background-image:linear-gradient(to right,rgba(201,35,78,.15) 1px,transparent 1px),linear-gradient(to bottom,rgba(8,145,168,.15) 1px,transparent 1px);background-size:50px 50px;animation:grid-scroll 3s linear infinite;mask-image:linear-gradient(to top,rgba(0,0,0,1) 0%,rgba(0,0,0,0) 50%);-webkit-mask-image:linear-gradient(to top,rgba(0,0,0,1) 0%,rgba(0,0,0,0) 50%)}
@keyframes grid-scroll{0%{transform:rotateX(75deg) translateY(0)}100%{transform:rotateX(75deg) translateY(50px)}}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#000}::-webkit-scrollbar-thumb{background:#0f1019;border-radius:0}::-webkit-scrollbar-thumb:hover{background:var(--cyber-pink)}
`
let stylesInjected = false
function injectStyles() {
  if (stylesInjected) return
  stylesInjected = true
  const style = document.createElement('style')
  style.textContent = GLOBAL_STYLES
  document.head.appendChild(style)
}
// ─── SUB-COMPONENTS (all inlined) ────────────────────────
function NavigationButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        y: -2,
      }}
      whileTap={{
        scale: 0.95,
      }}
      className="relative rounded-full p-[1px] bg-gradient-to-r from-cyber-pink/40 to-cyber-blue/40 group cursor-pointer shadow-sm hover:shadow-blue-glow transition-shadow"
      onClick={onClick}
    >
      <div className="px-4 py-2 sm:px-6 sm:py-3 bg-noir-900 rounded-full text-[#8892a4] font-orbitron tracking-wider uppercase text-xs sm:text-sm font-bold flex items-center gap-2 h-full w-full group-hover:bg-noir-800 group-hover:text-[#c8cdd6] transition-colors">
        {children}
        <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:text-cyber-blue transition-all" />
      </div>
    </motion.div>
  )
}
function ActionButton({
  children,
  variant = 'default',
  onClick,
}: {
  children: React.ReactNode
  variant?: 'default' | 'warning'
  onClick?: () => void
}) {
  const isWarning = variant === 'warning'
  return (
    <motion.button
      whileHover={{
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={onClick}
      className={`w-full py-2.5 px-4 rounded-none border text-sm font-bold font-orbitron tracking-wider transition-all relative overflow-hidden ${isWarning ? 'bg-cyber-pink/5 border-cyber-pink/30 text-cyber-pink hover:bg-cyber-pink/10 hover:border-cyber-pink/60 hover:shadow-pink-glow' : 'bg-cyber-blue/5 border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/10 hover:border-cyber-blue/60 hover:shadow-blue-glow'}`}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
function SidebarPanel({
  title,
  children,
  delay = 0,
  className = '',
  accent = 'pink' as 'pink' | 'blue',
}: {
  title?: string
  children: React.ReactNode
  delay?: number
  className?: string
  accent?: 'pink' | 'blue'
}) {
  const isPink = accent === 'pink'
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.5,
        delay,
        ease: 'easeOut',
      }}
      className={`bg-noir-800/90 backdrop-blur-md border-y border-r border-slate-800/30 border-l-[2px] ${isPink ? 'border-l-cyber-pink/80' : 'border-l-cyber-blue/80'} rounded-none p-4 relative group ${className}`}
    >
      {title && (
        <h3
          className={`font-orbitron uppercase tracking-[0.2em] text-sm font-bold mb-3 flex items-center gap-2 ${isPink ? 'text-cyber-pink/90' : 'text-cyber-blue/90'}`}
        >
          {title}
        </h3>
      )}
      <div className="text-[#8892a4] text-sm leading-relaxed">{children}</div>
    </motion.div>
  )
}
function Sidebar() {
  return (
    <div className="h-full flex flex-col gap-4 lg:gap-6 p-4 lg:p-6 overflow-y-auto border-r border-slate-800/30 bg-noir-900/95">
      <motion.div
        initial={{
          opacity: 0,
          x: -20,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="mb-2 lg:mb-4"
      >
        <h1 className="font-orbitron text-2xl lg:text-4xl font-black tracking-wider mb-2 chromatic-aberration text-cyber-pink">
          ISLA BRUMA
        </h1>
        <p className="text-xs text-cyber-blue/60 leading-tight uppercase tracking-widest">
          Aventura detectivesca inspirada en clásicos noventeros.
        </p>
      </motion.div>
      <SidebarPanel title="DIÁLOGO" delay={0.1} accent="pink">
        <div className="flex gap-3">
          <MessageSquareIcon className="w-4 h-4 text-cyber-pink/80 shrink-0 mt-0.5" />
          <p className="text-[#8892a4] italic font-light">
            "Te moviste a Lobby del Hotel."
          </p>
        </div>
      </SidebarPanel>
      <SidebarPanel title="PISTAS" delay={0.2} accent="blue">
        <ul className="space-y-2">
          <li className="flex gap-3 items-start">
            <SearchIcon className="w-4 h-4 text-cyber-blue/80 shrink-0 mt-0.5" />
            <span className="text-[#8892a4]">Sin pistas todavía.</span>
          </li>
        </ul>
      </SidebarPanel>
      <SidebarPanel
        title="ACCIONES"
        delay={0.3}
        accent="pink"
        className="mt-auto"
      >
        <div className="flex flex-col gap-3 lg:gap-4">
          <ActionButton variant="default">
            <div className="flex items-center justify-center gap-2">
              <ClockIcon className="w-4 h-4" />
              Esperar 30 minutos
            </div>
          </ActionButton>
          <ActionButton variant="warning">
            <div className="flex items-center justify-center gap-2">
              <ZapIcon className="w-4 h-4" />
              Presentar acusación
            </div>
          </ActionButton>
          <div className="mt-3 lg:mt-4 pt-3 border-t border-slate-800/50 text-xs text-cyber-blue/40 font-mono">
            &gt; Te moviste a Lobby del Hotel.
          </div>
        </div>
      </SidebarPanel>
    </div>
  )
}
// ─── GAME VIEWPORT ───────────────────────────────────────
function GameViewport() {
  const [isTalking, setIsTalking] = useState(false)
  const [isInspecting, setIsInspecting] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [isHoveringChar, setIsHoveringChar] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{
    icon: string
    label: string
  } | null>(null)
  const [cursorPos, setCursorPos] = useState({
    x: 0,
    y: 0,
  })
  const charRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const handleViewportMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = viewportRef.current?.getBoundingClientRect()
    if (rect)
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
  }, [])
  const handleCharMouseMove = (e: React.MouseEvent) => {
    const rect = charRef.current?.closest('.scanlines')?.getBoundingClientRect()
    if (rect)
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
  }
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const handler = (e: MouseEvent) => {
      if (selectedItem) {
        e.preventDefault()
        setSelectedItem(null)
      }
    }
    el.addEventListener('contextmenu', handler)
    return () => el.removeEventListener('contextmenu', handler)
  }, [selectedItem])
  const footerMode = isTalking
    ? 'conversation'
    : isInspecting
      ? 'inspect'
      : 'navigation'
  return (
    <div
      ref={viewportRef}
      onMouseMove={selectedItem ? handleViewportMouseMove : undefined}
      className={`relative h-full w-full flex flex-col scanlines bg-noir-900 overflow-hidden ${selectedItem ? 'cursor-none' : 'cursor-crosshair'}`}
    >
      <div className="perspective-grid-container">
        <div className="perspective-grid" />
      </div>

      {/* Cursor-following tooltips */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
            }}
            transition={{
              duration: 0.1,
            }}
            className="z-[100] pointer-events-none flex items-center gap-2"
            style={{
              position: 'absolute',
              left: cursorPos.x + 8,
              top: cursorPos.y + 8,
            }}
          >
            <span className="text-2xl drop-shadow-[0_0_8px_rgba(8,145,168,0.6)]">
              {selectedItem.icon}
            </span>
            <span className="bg-noir-900/95 border border-cyber-pink/50 px-2 py-1 rounded text-cyber-pink font-orbitron text-[10px] tracking-widest uppercase backdrop-blur-sm whitespace-nowrap">
              Usar con
            </span>
          </motion.div>
        )}
        {isHoveringChar && !isTalking && !showMap && !selectedItem && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
            }}
            transition={{
              duration: 0.15,
            }}
            className="z-[100] bg-noir-900/95 border border-cyber-blue/60 px-3 py-1.5 rounded text-cyber-blue font-orbitron text-xs tracking-widest uppercase backdrop-blur-sm pointer-events-none flex items-center gap-2"
            style={{
              position: 'absolute',
              left: cursorPos.x + 16,
              top: cursorPos.y - 12,
            }}
          >
            <MessageSquareIcon className="w-3 h-3" />
            Hablar
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start p-4 sm:p-6 lg:p-8 z-20 pointer-events-none gap-4">
        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
          }}
          className="max-w-xl"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-cyber-pink drop-shadow-[0_0_5px_rgba(201,35,78,0.4)]" />
            <h2 className="font-orbitron text-2xl sm:text-3xl lg:text-5xl font-black text-[#c8cdd6] tracking-wide drop-shadow-[0_0_8px_rgba(8,145,168,0.3)]">
              {showMap ? 'MAPA DE LA ISLA' : 'LOBBY DEL HOTEL'}
            </h2>
          </div>
          {!showMap && (
            <p className="text-[#8892a4] text-sm sm:text-base lg:text-lg font-light border-l-2 border-cyber-blue/50 pl-3 sm:pl-4 ml-2 sm:ml-4 bg-noir-900/60 backdrop-blur-sm py-1">
              Recepción vacía, olor a café frío y una campana de bronce.
            </p>
          )}
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1,
          }}
          className="text-left sm:text-right"
        >
          <motion.div
            animate={{
              textShadow: [
                '0 0 5px rgba(201,35,78,0.4), 0 0 10px rgba(8,145,168,0.3)',
                '0 0 8px rgba(201,35,78,0.6), 0 0 15px rgba(8,145,168,0.4)',
                '0 0 5px rgba(201,35,78,0.4), 0 0 10px rgba(8,145,168,0.3)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="font-mono text-4xl sm:text-5xl lg:text-7xl font-bold text-[#c8cdd6] tracking-tighter leading-none"
          >
            08:55
          </motion.div>
          <div className="font-orbitron text-cyber-blue/80 text-xs sm:text-sm tracking-widest uppercase mt-1 sm:mt-2 font-bold">
            Lunes, 15 de Marzo
          </div>
        </motion.div>
      </div>

      {/* Main Stage */}
      <div className="flex-1 z-10 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {showMap ? (
            <motion.div
              key="map"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.4,
              }}
              className="absolute inset-0 bg-noir-900 flex items-center justify-center"
            >
              <button
                onClick={() => setShowMap(false)}
                className="absolute top-4 right-4 z-30 bg-noir-800/90 border border-slate-700/50 p-2 rounded text-[#8892a4] hover:text-cyber-pink hover:border-cyber-pink/50 transition-colors cursor-pointer"
              >
                <XIcon className="w-5 h-5" />
              </button>
              <div className="relative w-full h-full max-w-4xl max-h-[600px] mx-auto p-8">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {CONNECTIONS.map(([a, b], i) => (
                    <motion.line
                      key={i}
                      x1={LOCATIONS[a].x}
                      y1={LOCATIONS[a].y}
                      x2={LOCATIONS[b].x}
                      y2={LOCATIONS[b].y}
                      stroke="rgba(8,145,168,0.25)"
                      strokeWidth="0.3"
                      strokeDasharray="1 0.5"
                      initial={{
                        pathLength: 0,
                      }}
                      animate={{
                        pathLength: 1,
                      }}
                      transition={{
                        duration: 1,
                        delay: 0.2 + i * 0.1,
                      }}
                    />
                  ))}
                  {LOCATIONS.map((loc, i) => (
                    <g key={i}>
                      {loc.active && (
                        <motion.circle
                          cx={loc.x}
                          cy={loc.y}
                          r="3.5"
                          fill="none"
                          stroke="rgba(201,35,78,0.4)"
                          strokeWidth="0.2"
                          animate={{
                            r: [3.5, 4.5, 3.5],
                            opacity: [0.4, 0.8, 0.4],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      )}
                      <motion.circle
                        cx={loc.x}
                        cy={loc.y}
                        r="2"
                        fill={loc.active ? '#c9234e' : '#08090f'}
                        stroke={loc.active ? '#c9234e' : '#0891a8'}
                        strokeWidth="0.4"
                        className={loc.active ? '' : 'cursor-pointer'}
                        initial={{
                          scale: 0,
                        }}
                        animate={{
                          scale: 1,
                        }}
                        transition={{
                          delay: 0.3 + i * 0.1,
                          type: 'spring',
                        }}
                      />
                      <motion.text
                        x={loc.x}
                        y={loc.y - 4}
                        textAnchor="middle"
                        fill={loc.active ? '#c9234e' : '#8892a4'}
                        fontSize="2.2"
                        fontFamily="Orbitron, sans-serif"
                        fontWeight="bold"
                        className="uppercase"
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        transition={{
                          delay: 0.5 + i * 0.1,
                        }}
                      >
                        {loc.name}
                      </motion.text>
                    </g>
                  ))}
                </svg>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(8,145,168,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,168,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="scene"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.4,
              }}
              className="absolute inset-0"
            >
              <img
                src={SCENE_IMG}
                alt="Lobby del Hotel"
                className="w-full h-full object-cover object-center absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir-900 via-transparent to-noir-900/60 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-noir-900/30 via-transparent to-noir-900/30 pointer-events-none" />
              <div
                ref={charRef}
                className="absolute bottom-0 right-[4%] sm:right-[6%] lg:right-[8%] w-[240px] h-[320px] sm:w-[400px] sm:h-[530px] md:w-[500px] md:h-[660px] lg:w-[640px] lg:h-[840px] flex flex-col items-center justify-end z-20"
              >
                <motion.div
                  animate={{
                    y: isHoveringChar ? [0, -8, 0] : 0,
                  }}
                  transition={
                    isHoveringChar
                      ? {
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }
                      : {
                          duration: 0.3,
                        }
                  }
                  className={`relative w-full h-full group ${isHoveringChar ? 'cursor-none' : 'cursor-crosshair'}`}
                  onMouseEnter={() => setIsHoveringChar(true)}
                  onMouseLeave={() => setIsHoveringChar(false)}
                  onMouseMove={handleCharMouseMove}
                  onClick={() => setIsTalking(true)}
                >
                  <img
                    src={CHARACTER_IMG}
                    alt="Carlos"
                    className="w-full h-full object-contain object-bottom transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(8,145,168,0.6)]"
                    style={{
                      WebkitMaskImage:
                        'linear-gradient(to bottom, black 85%, transparent 100%)',
                      maskImage:
                        'linear-gradient(to bottom, black 85%, transparent 100%)',
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="z-30 relative bg-gradient-to-t from-noir-900 via-noir-900/95 to-transparent flex flex-col justify-end px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {footerMode === 'navigation' && (
            <motion.div
              key="navigation"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 20,
              }}
              transition={{
                duration: 0.3,
              }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 w-full"
            >
              <div className="flex items-center gap-3">
                <h4 className="font-orbitron text-cyber-blue/70 text-[10px] sm:text-xs tracking-widest uppercase font-bold shrink-0">
                  INV
                </h4>
                <div className="flex gap-2">
                  {INVENTORY_ITEMS.map((item, i) => {
                    const isSelected = selectedItem?.label === item.label
                    return (
                      <div
                        key={i}
                        onClick={() =>
                          setSelectedItem(isSelected ? null : item)
                        }
                        className={`group relative w-9 h-9 sm:w-10 sm:h-10 bg-noir-800/80 border rounded-sm flex items-center justify-center text-base sm:text-lg cursor-pointer transition-all ${isSelected ? 'border-cyber-pink shadow-pink-glow scale-110' : 'border-slate-700/40 hover:border-cyber-blue/50'}`}
                      >
                        {item.icon}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-noir-900/95 border border-slate-700/50 px-2 py-0.5 rounded text-[10px] text-[#c8cdd6] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {isSelected ? 'Soltar (clic der.)' : item.label}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <NavigationButton onClick={() => setIsInspecting(true)}>
                  <span className="flex items-center gap-2">
                    <SearchIcon className="w-4 h-4" />
                    Inspeccionar el lugar
                  </span>
                </NavigationButton>
                <NavigationButton onClick={() => setShowMap(true)}>
                  <span className="flex items-center gap-2">
                    <MapIcon className="w-4 h-4" />
                    Ir al mapa
                  </span>
                </NavigationButton>
              </div>
            </motion.div>
          )}
          {footerMode === 'inspect' && (
            <motion.div
              key="inspect"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 20,
              }}
              transition={{
                duration: 0.3,
              }}
              className="w-full bg-noir-800/80 border border-slate-800/50 rounded-sm px-4 sm:px-6 py-4 backdrop-blur-md"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-orbitron text-cyber-pink text-xs sm:text-sm font-bold tracking-wider mb-2 uppercase flex items-center gap-2">
                    <SearchIcon className="w-4 h-4" />
                    Inspección
                  </h4>
                  <p className="text-[#c8cdd6] font-light text-sm sm:text-base leading-relaxed">
                    El lobby está vacío. Una fina capa de polvo cubre el
                    mostrador de recepción. Hay una campana de bronce junto al
                    registro — parece que nadie la ha tocado en días. Un
                    periódico viejo descansa sobre una silla: la fecha es de
                    hace tres semanas. El olor a café frío viene de una taza
                    abandonada detrás del mostrador.
                  </p>
                </div>
                <button
                  onClick={() => setIsInspecting(false)}
                  className="shrink-0 bg-noir-900/80 border border-slate-700/50 p-1.5 rounded text-[#8892a4] hover:text-cyber-pink hover:border-cyber-pink/50 transition-colors cursor-pointer"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
          {footerMode === 'conversation' && (
            <motion.div
              key="conversation"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 20,
              }}
              transition={{
                duration: 0.3,
              }}
              className="w-full bg-noir-800/80 border border-slate-800/50 rounded-sm px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-md"
            >
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                <div className="flex-1 min-w-0">
                  <h4 className="font-orbitron text-cyber-blue text-xs sm:text-sm font-bold tracking-wider mb-1">
                    CARLOS
                  </h4>
                  <p className="text-[#c8cdd6] italic font-light text-sm sm:text-base">
                    "¿Qué te trae por aquí, forastero? Este lugar no es lo que
                    parece..."
                  </p>
                </div>
                <div className="hidden md:block w-px bg-slate-700/50 self-stretch shrink-0" />
                <div className="md:hidden w-full h-px bg-slate-700/50" />
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  {[
                    '¿Quién eres tú?',
                    '¿Has visto algo sospechoso?',
                    'Cuéntame sobre este lugar.',
                  ].map((text, i) => (
                    <button
                      key={i}
                      className="text-left text-[#8892a4] hover:text-cyber-pink font-mono text-xs sm:text-sm py-1.5 px-3 rounded hover:bg-cyber-pink/5 transition-colors flex items-center gap-2 group cursor-pointer"
                    >
                      <ChevronRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      {text}
                    </button>
                  ))}
                  <button
                    onClick={() => setIsTalking(false)}
                    className="text-left text-cyber-blue/70 hover:text-cyber-blue font-mono text-xs sm:text-sm py-1.5 px-3 rounded hover:bg-cyber-blue/5 transition-colors flex items-center gap-2 group mt-1 cursor-pointer"
                  >
                    <ChevronRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    [Terminar conversación]
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
// ─── MAIN EXPORT ─────────────────────────────────────────
export function IslaBrumaUI() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  useEffect(() => {
    injectStyles()
  }, [])
  return (
    <div
      className="h-screen w-screen bg-black flex flex-col md:flex-row overflow-hidden relative"
      style={{
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] bg-noir-800/90 border border-slate-700/50 p-2 rounded backdrop-blur-sm text-cyber-blue"
      >
        {sidebarOpen ? (
          <XIcon className="w-5 h-5" />
        ) : (
          <MenuIcon className="w-5 h-5" />
        )}
      </button>

      {/* Desktop sidebar */}
      <div className="hidden md:block w-[320px] lg:w-[350px] min-w-[300px] h-full z-20 shadow-[10px_0_30px_rgba(0,0,0,0.8)]">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{
                x: -300,
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: -300,
              }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 250,
              }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-[300px] z-50 shadow-[10px_0_30px_rgba(0,0,0,0.8)]"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Viewport */}
      <div className="flex-1 h-full relative">
        <GameViewport />
      </div>
    </div>
  )
}
