import { Camera, Settings } from "lucide-react";

export function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar-spacer" />
      <div className="topbar-icons">
        <button className="top-icon-btn" aria-label="Ajustes">
          <Settings size={16} />
        </button>
        <button className="top-icon-btn" aria-label="Captura">
          <Camera size={16} />
        </button>
      </div>
    </header>
  );
}
