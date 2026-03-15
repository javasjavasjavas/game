import { AnimatePresence, motion } from "framer-motion";
import { CompassIcon } from "lucide-react";
import { useMemo } from "react";
import { ROOMS } from "../game/data";
import type { RoomId } from "../game/types";

interface Props {
  open: boolean;
  currentRoom: RoomId;
  onClose: () => void;
  onSelectRoom: (roomId: RoomId) => void;
}

interface MapLocation {
  roomId: RoomId;
  x: number;
  y: number;
  distance: string;
  walkTime: string;
}

const MAP_BG = "/game-assets/map_bg.jpg";

const MAP_LOCATIONS: MapLocation[] = [
  { roomId: "bar", x: 22, y: 35, distance: "0.8 km", walkTime: "10 min" },
  { roomId: "apartment", x: 48, y: 22, distance: "1.2 km", walkTime: "15 min" },
  { roomId: "store", x: 72, y: 55, distance: "2.1 km", walkTime: "26 min" },
  { roomId: "alley", x: 35, y: 72, distance: "0.4 km", walkTime: "5 min" },
];

export function MapOverlay({ open, currentRoom, onClose, onSelectRoom }: Props) {
  const reachableRooms = useMemo(() => new Set([currentRoom, ...ROOMS[currentRoom].exits]), [currentRoom]);

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
            <img className="map-close-icon" src="/game-assets/icon_cross.png" alt="Close" />
          </button>

          <img className="map-bg-image" src={MAP_BG} alt="City Map" />
          <div className="map-bg-dark" />
          <div className="map-vignette" />

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="map-title-badge"
          >
            <div className="map-title-badge-inner">
              <CompassIcon className="map-title-icon" />
              <span className="map-title-text">City Map</span>
            </div>
          </motion.div>

          <div className="map-canvas">
            {MAP_LOCATIONS.map((location, index) => {
              const roomName = ROOMS[location.roomId].name;
              const active = location.roomId === currentRoom;
              const reachable = reachableRooms.has(location.roomId);

              return (
                <motion.div
                  key={location.roomId}
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: 0.3 + index * 0.12,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="map-pin group"
                  style={{
                    left: `${location.x}%`,
                    top: `${location.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <motion.div
                    className="map-pin-pulse"
                    animate={{ scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.4 }}
                  />

                  <button
                    className={`map-pin-dot ${active ? "active" : ""} ${reachable ? "reachable" : "disabled"}`}
                    onClick={() => reachable && onSelectRoom(location.roomId)}
                    aria-label={`Go to ${roomName}`}
                  />

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + index * 0.12 }} className="map-pin-label">
                    <span>{roomName}</span>
                  </motion.div>

                  <div className="map-tooltip">
                    <div className="map-tooltip-panel">
                      <div className="map-tooltip-title">{roomName}</div>
                      <div className="map-tooltip-grid">
                        <div className="map-tooltip-item">
                          <span className="map-tooltip-k">Distance</span>
                          <span className="map-tooltip-v">{location.distance}</span>
                        </div>
                        <div className="map-tooltip-divider" />
                        <div className="map-tooltip-item">
                          <span className="map-tooltip-k">Walking</span>
                          <span className="map-tooltip-v">{location.walkTime}</span>
                        </div>
                      </div>
                      <div className="map-tooltip-arrow" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div className="map-grid-overlay" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
