import { MapPin, Moon } from "lucide-react";

interface Props {
  roomName: string;
  roomDescription: string;
  clock: string;
  dateLabel: string;
}

export function TopBar({ roomName, roomDescription, clock, dateLabel }: Props) {
  return (
    <header className="topbar">
      <div className="topbar-location-block">
        <div className="topbar-location-row">
          <MapPin size={30} className="topbar-location-icon" />
          <h1 className="topbar-location-title">{roomName}</h1>
        </div>
        <p className="topbar-location-description">{roomDescription}</p>
      </div>

      <div className="topbar-spacer" />

      <div className="topbar-meta">
        <div className="topbar-clock-block">
          <div className="topbar-clock-row">
            <Moon size={18} className="topbar-wifi-icon" />
            <div className="topbar-clock">{clock}</div>
          </div>
          <div className="topbar-date">{dateLabel}</div>
        </div>
      </div>
    </header>
  );
}
