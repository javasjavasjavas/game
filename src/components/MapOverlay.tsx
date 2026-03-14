import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { ROOM_MAP_LAYOUT, ROOM_ORDER, ROOMS } from "../game/data";
import type { RoomId } from "../game/types";

interface Props {
  open: boolean;
  currentRoom: RoomId;
  onClose: () => void;
  onSelectRoom: (roomId: RoomId) => void;
}

const CONNECTIONS: [RoomId, RoomId][] = ROOM_ORDER.flatMap((roomId) =>
  ROOMS[roomId].exits
    .filter((toId) => roomId < toId)
    .map((toId) => [roomId, toId] as [RoomId, RoomId])
);

export function MapOverlay({ open, currentRoom, onClose, onSelectRoom }: Props) {
  const [hoveredRoom, setHoveredRoom] = useState<RoomId | null>(null);
  const reachableRooms = useMemo(() => new Set([currentRoom, ...ROOMS[currentRoom].exits]), [currentRoom]);

  const handleSelectRoom = (roomId: RoomId) => {
    if (!reachableRooms.has(roomId)) return;
    onSelectRoom(roomId);
  };

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          className="map-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button className="map-close" onClick={onClose} aria-label="Close map">
            <X size={18} />
          </button>

          <div className="map-canvas">
            <svg className="map-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {CONNECTIONS.map(([fromId, toId], index) => (
                <motion.line
                  key={`${fromId}-${toId}`}
                  x1={ROOM_MAP_LAYOUT[fromId].x}
                  y1={ROOM_MAP_LAYOUT[fromId].y}
                  x2={ROOM_MAP_LAYOUT[toId].x}
                  y2={ROOM_MAP_LAYOUT[toId].y}
                  stroke="rgba(8, 145, 168, 0.25)"
                  strokeWidth="0.3"
                  strokeDasharray="1 0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                />
              ))}

              {ROOM_ORDER.map((roomId, index) => {
                const active = roomId === currentRoom;
                const hovered = roomId === hoveredRoom;
                const reachable = reachableRooms.has(roomId);
                const labelColor = active ? "#c9234e" : hovered ? "#a8b4ca" : "#8892a4";

                return (
                  <g key={roomId}>
                    {active && (
                      <motion.circle
                        cx={ROOM_MAP_LAYOUT[roomId].x}
                        cy={ROOM_MAP_LAYOUT[roomId].y}
                        r="3.5"
                        fill="none"
                        stroke="rgba(201, 35, 78, 0.4)"
                        strokeWidth="0.2"
                        animate={{
                          r: [3.5, 4.5, 3.5],
                          opacity: [0.4, 0.8, 0.4],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}

                    <motion.circle
                      cx={ROOM_MAP_LAYOUT[roomId].x}
                      cy={ROOM_MAP_LAYOUT[roomId].y}
                      r="2"
                      fill={active ? "#c9234e" : "#08090f"}
                      stroke={active ? "#c9234e" : "#0891a8"}
                      strokeWidth="0.4"
                      className={reachable && !active ? "map-node-active" : "map-node-disabled"}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={reachable && !active ? { scale: 1.16 } : undefined}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                      onMouseEnter={() => setHoveredRoom(roomId)}
                      onMouseLeave={() => setHoveredRoom((prev) => (prev === roomId ? null : prev))}
                      onClick={() => handleSelectRoom(roomId)}
                    />

                    <motion.text
                      x={ROOM_MAP_LAYOUT[roomId].x}
                      y={ROOM_MAP_LAYOUT[roomId].y - 4}
                      textAnchor="middle"
                      fill={labelColor}
                      fontSize="2.2"
                      fontFamily="Press Start 2P, monospace"
                      fontWeight="700"
                      className="map-node-label"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      {ROOMS[roomId].name}
                    </motion.text>
                  </g>
                );
              })}
            </svg>

            <div className="map-grid-overlay" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
