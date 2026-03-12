import { Map, Search } from "lucide-react";
import { INVENTORY_ITEMS } from "../game/data";

interface Props {
  showNav: boolean;
  selectedInventoryId: string | null;
  onToggleInventory: (id: string) => void;
  onInspect: () => void;
  onMap: () => void;
}

export function FooterBar({ showNav, selectedInventoryId, onToggleInventory, onInspect, onMap }: Props) {
  if (!showNav) return null;

  return (
    <div className="footer-row" id="footer-navigation">
      <div className="inv-wrap">
        <span className="inv-title">INV</span>
        {INVENTORY_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`inv-item ${selectedInventoryId === item.id ? "active" : ""}`}
            data-label={item.label}
            onClick={() => onToggleInventory(item.id)}
          >
            {item.icon}
          </button>
        ))}
      </div>
      <div className="nav-actions">
        <button className="pill-btn" onClick={onInspect}>
          <Search size={14} /> Inspeccionar el lugar
        </button>
        <button className="pill-btn" onClick={onMap}>
          <Map size={14} /> Ir al mapa
        </button>
      </div>
    </div>
  );
}
