import { MapPin } from "lucide-react";

interface Props {
  roomName: string;
  roomDescription: string;
  clock: string;
}

export function TopBar({ roomName, roomDescription, clock }: Props) {
  return (
    <header className="topbar">
      <div className="loc-wrap">
        <div className="room-heading">
          <MapPin className="room-icon" />
          <h2>{roomName.toUpperCase()}</h2>
        </div>
        <p>{roomDescription}</p>
      </div>
      <div className="clock-box">
        <div id="clock">{clock}</div>
        <div id="date-label">Lunes, 15 de Marzo</div>
      </div>
    </header>
  );
}
