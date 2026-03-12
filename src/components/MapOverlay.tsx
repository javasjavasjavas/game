import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ROOM_MAP_LAYOUT, ROOM_ORDER, ROOMS } from "../game/data";
import type { RoomId } from "../game/types";

interface Props {
  open: boolean;
  currentRoom: RoomId;
  onClose: () => void;
  onSelectRoom: (roomId: RoomId) => void;
}

export function MapOverlay({ open, currentRoom, onClose, onSelectRoom }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="map-overlay open"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="map-head">
            <span>Mapa de la Isla</span>
            <button className="map-close" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
          <svg className="map-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {ROOM_ORDER.map((roomId) =>
              ROOMS[roomId].exits
                .filter((toId) => roomId < toId)
                .map((toId) => (
                  <line
                    key={`${roomId}-${toId}`}
                    x1={ROOM_MAP_LAYOUT[roomId].x}
                    y1={ROOM_MAP_LAYOUT[roomId].y}
                    x2={ROOM_MAP_LAYOUT[toId].x}
                    y2={ROOM_MAP_LAYOUT[toId].y}
                    stroke="rgba(8,145,168,0.3)"
                    strokeWidth="0.6"
                  />
                ))
            )}
            {ROOM_ORDER.map((roomId) => {
              const active = roomId === currentRoom;
              return (
                <g key={roomId} onClick={() => onSelectRoom(roomId)} className="map-node">
                  <circle
                    cx={ROOM_MAP_LAYOUT[roomId].x}
                    cy={ROOM_MAP_LAYOUT[roomId].y}
                    r={active ? 3.2 : 2.5}
                    fill={active ? "#c9234e" : "#08090f"}
                    stroke={active ? "#c9234e" : "#0891a8"}
                    strokeWidth="0.7"
                  />
                  <text
                    x={ROOM_MAP_LAYOUT[roomId].x}
                    y={ROOM_MAP_LAYOUT[roomId].y - 4}
                    textAnchor="middle"
                    fontSize="2.6"
                    fontFamily="Orbitron, sans-serif"
                    fill={active ? "#c9234e" : "#93a0b8"}
                  >
                    {ROOMS[roomId].name.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
