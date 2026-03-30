import { AnimatePresence, motion } from "framer-motion";
import { CompassIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ROOMS } from "../game/data";
import type { RoomId } from "../game/types";

interface Props {
  open: boolean;
  currentRoom: RoomId;
  availableRooms: RoomId[];
  onClose: () => void;
  onSelectRoom: (roomId: RoomId, walkMinutes: number) => void;
}

interface MapLocation {
  roomId: RoomId;
  x: number;
  y: number;
  distance: string;
  walkTime: string;
  walkMinutes: number;
}

const MAP_BG = "/game-assets/map_bg.jpg";
const MAP_WIDTH = 3200;
const MAP_HEIGHT = 1829;

const MAP_LOCATIONS: MapLocation[] = [
  { roomId: "bar", x: 22, y: 35, distance: "0.8 km", walkTime: "10 min", walkMinutes: 10 },
  { roomId: "apartment", x: 48, y: 22, distance: "1.2 km", walkTime: "15 min", walkMinutes: 15 },
  { roomId: "store", x: 72, y: 55, distance: "2.1 km", walkTime: "26 min", walkMinutes: 26 },
  { roomId: "alley", x: 35, y: 72, distance: "0.4 km", walkTime: "5 min", walkMinutes: 5 },
  { roomId: "pharmacy", x: 84, y: 72, distance: "1.5 km", walkTime: "18 min", walkMinutes: 18 },
  { roomId: "arcade", x: 14, y: 66, distance: "1.0 km", walkTime: "12 min", walkMinutes: 12 },
  { roomId: "garage", x: 70, y: 88, distance: "2.6 km", walkTime: "30 min", walkMinutes: 30 },
  { roomId: "restooutside", x: 82, y: 40, distance: "1.7 km", walkTime: "20 min", walkMinutes: 20 },
  { roomId: "street", x: 56, y: 42, distance: "0.6 km", walkTime: "7 min", walkMinutes: 7 },
  { roomId: "motel", x: 91, y: 80, distance: "3.4 km", walkTime: "36 min", walkMinutes: 36 },
  { roomId: "safehouse", x: 18, y: 86, distance: "4.0 km", walkTime: "42 min", walkMinutes: 42 },
];

export function MapOverlay({ open, currentRoom, availableRooms, onClose, onSelectRoom }: Props) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = frameRef.current;
    if (!element) return;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setFrameSize({ width: rect.width, height: rect.height });
    };
    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const adjustedLocations = useMemo(() => {
    const visibleLocations = MAP_LOCATIONS.filter((loc) => availableRooms.includes(loc.roomId));
    if (frameSize.width <= 0 || frameSize.height <= 0) {
      return visibleLocations.map((loc) => ({ ...loc, drawX: loc.x, drawY: loc.y }));
    }

    const scale = Math.max(frameSize.width / MAP_WIDTH, frameSize.height / MAP_HEIGHT);
    const renderedWidth = MAP_WIDTH * scale;
    const renderedHeight = MAP_HEIGHT * scale;
    const offsetX = (frameSize.width - renderedWidth) / 2;
    const offsetY = (frameSize.height - renderedHeight) / 2;

    return visibleLocations.map((loc) => {
      const xPx = (loc.x / 100) * MAP_WIDTH * scale + offsetX;
      const yPx = (loc.y / 100) * MAP_HEIGHT * scale + offsetY;
      return {
        ...loc,
        drawX: (xPx / frameSize.width) * 100,
        drawY: (yPx / frameSize.height) * 100,
      };
    });
  }, [availableRooms, frameSize.height, frameSize.width]);

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
            <div
              className="map-frame"
              ref={frameRef}
              style={{
                backgroundImage: `url(${MAP_BG})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            >
              <div className="map-bg-dark" />
              <div className="map-vignette" />

            {adjustedLocations.map((location, index) => {
              const roomName = ROOMS[location.roomId].name;
              const active = location.roomId === currentRoom;

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
                    left: `${location.drawX}%`,
                    top: `${location.drawY}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <motion.div
                    className="map-pin-pulse"
                    animate={{ scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.4 }}
                  />
                  <span className="map-pin-hover-halo" />

                  <button
                    className={`map-pin-dot ${active ? "active" : ""} reachable`}
                    onClick={() => onSelectRoom(location.roomId, location.walkMinutes)}
                    aria-label={`Go to ${roomName}`}
                  />

                  <button
                    className="map-pin-hit"
                    onClick={() => onSelectRoom(location.roomId, location.walkMinutes)}
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
