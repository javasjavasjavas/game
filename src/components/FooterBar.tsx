import type { InventoryItemDefinition } from "../game/types";

interface Props {
  showNav: boolean;
  mapOpen: boolean;
  mapEnabled: boolean;
  inventoryItems: InventoryItemDefinition[];
  selectedInventoryId: string | null;
  onToggleInventory: (id: string) => void;
  onInspect: () => void;
  onMap: () => void;
}

export function FooterBar({ showNav, mapOpen, mapEnabled, inventoryItems, selectedInventoryId, onToggleInventory, onInspect, onMap }: Props) {
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
        {mapEnabled && (
          <button className="pill-btn" onClick={onMap}>
            <img className="pill-icon-image" src="/game-assets/icon_map.png" alt="Map" /> {mapOpen ? "Close City Map" : "Open City Map"}
          </button>
        )}
      </div>
    </div>
  );
}
