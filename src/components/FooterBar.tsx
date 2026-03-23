import { useEffect, useRef, useState } from "react";
import type { InventoryItemDefinition } from "../game/types";

interface SceneActionDefinition {
  id: string;
  label: string;
  icon?: string;
  onClick: () => void;
}

interface Props {
  showNav: boolean;
  mapOpen: boolean;
  mapEnabled: boolean;
  inventoryItems: InventoryItemDefinition[];
  selectedInventoryId: string | null;
  sceneActions: SceneActionDefinition[];
  onToggleInventory: (id: string) => void;
  onInspect: () => void;
  onMap: () => void;
}

export function FooterBar({
  showNav,
  mapOpen,
  mapEnabled,
  inventoryItems,
  selectedInventoryId,
  sceneActions,
  onToggleInventory,
  onInspect,
  onMap,
}: Props) {
  const [showNewMapBadge, setShowNewMapBadge] = useState(false);
  const hasShownMapBadgeRef = useRef(false);
  const previousMapEnabledRef = useRef(mapEnabled);

  useEffect(() => {
    if (!previousMapEnabledRef.current && mapEnabled && !hasShownMapBadgeRef.current) {
      setShowNewMapBadge(true);
    }
    previousMapEnabledRef.current = mapEnabled;
  }, [mapEnabled]);

  const handleMapClick = () => {
    setShowNewMapBadge(false);
    hasShownMapBadgeRef.current = true;
    onMap();
  };

  if (!showNav) return null;

  return (
    <div className="footer-row" id="footer-navigation">
      <div className="inv-wrap">
        <span className="inv-title">INV</span>
        {inventoryItems.map((item) => (
          <button
            key={item.id}
            className={`inv-item ${selectedInventoryId === item.id ? "active" : ""}`}
            data-label={item.label}
            onClick={() => onToggleInventory(item.id)}
          >
            <img className="inv-item-image" src={item.image} alt={item.label} />
          </button>
        ))}
      </div>
      <div className="nav-actions">
        <button className="pill-btn" onClick={onInspect}>
          <img className="pill-icon-image" src="/game-assets/icon_search.png" alt="Search" /> Inspect area
        </button>
        {sceneActions.map((action) => (
          <button key={action.id} className="pill-btn" onClick={action.onClick}>
            {action.icon ? <img className="pill-icon-image" src={action.icon} alt="" /> : null}
            {action.label}
          </button>
        ))}
        {mapEnabled && (
          <div className="map-pill-wrap">
            {showNewMapBadge && (
              <div className="map-new-badge" aria-hidden>
                <span className="map-new-badge-text">New</span>
                <span className="map-new-badge-arrow" />
              </div>
            )}
            <button className="pill-btn" onClick={handleMapClick}>
              <img className="pill-icon-image" src="/game-assets/icon_map.png" alt="Map" /> {mapOpen ? "Close City Map" : "Open City Map"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
