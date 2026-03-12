import { Coffee, KeyRound, Map, Newspaper, Search } from "lucide-react";
import { INVENTORY_ITEMS } from "../game/data";

interface Props {
  showNav: boolean;
  mapOpen: boolean;
  selectedInventoryId: string | null;
  onToggleInventory: (id: string) => void;
  onInspect: () => void;
  onMap: () => void;
}

export function FooterBar({ showNav, mapOpen, selectedInventoryId, onToggleInventory, onInspect, onMap }: Props) {
  if (!showNav) return null;

  const iconForItem = (id: string) => {
    if (id === "key") return <KeyRound size={16} />;
    if (id === "paper") return <Newspaper size={16} />;
    return <Coffee size={16} />;
  };

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
            {iconForItem(item.id)}
          </button>
        ))}
      </div>
      <div className="nav-actions">
        <button className="pill-btn" onClick={onInspect}>
          <Search size={14} /> Inspect area
        </button>
        <button className="pill-btn" onClick={onMap}>
          <Map size={14} /> {mapOpen ? "Close map" : "Open map"}
        </button>
      </div>
    </div>
  );
}
