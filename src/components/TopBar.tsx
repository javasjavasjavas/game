import { Camera, Settings } from "lucide-react";

export function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar-spacer" />
      <div className="topbar-icons">
        <button className="top-icon-btn" aria-label="Settings">
          <Settings size={16} />
        </button>
        <button className="top-icon-btn" aria-label="Capture">
          <Camera size={16} />
        </button>
      </div>
    </header>
  );
}
