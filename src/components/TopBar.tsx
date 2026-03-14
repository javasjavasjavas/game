import { DollarSign, MapPin, Wifi } from "lucide-react";

interface Props {
  roomName: string;
  roomDescription: string;
  clock: string;
  dateLabel: string;
  money: number;
}

export function TopBar({ roomName, roomDescription, clock, dateLabel, money }: Props) {
  return (
    <header className="topbar">
      <div className="topbar-location-block">
        <div className="topbar-location-row">
          <MapPin size={16} className="topbar-location-icon" />
          <h1 className="topbar-location-title">{roomName}</h1>
        </div>
        <p className="topbar-location-description">{roomDescription}</p>
      </div>

      <div className="topbar-spacer" />

      <div className="topbar-meta">
        <div className="topbar-clock-block topbar-card">
          <div className="topbar-clock-row">
            <Wifi size={14} className="topbar-wifi-icon" />
            <div className="topbar-clock">{clock}</div>
          </div>
          <div className="topbar-date">{dateLabel}</div>
        </div>
        <div className="topbar-money-block topbar-card">
          <div className="topbar-money-value">
            <DollarSign size={18} />
            <span>{money}</span>
          </div>
          <div className="topbar-money-label">Available</div>
        </div>
      </div>
    </header>
  );
}
