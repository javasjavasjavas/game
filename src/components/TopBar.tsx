import { MapPin } from "lucide-react";

interface Props {
  roomName: string;
  roomDescription: string;
}

export function TopBar({ roomName, roomDescription }: Props) {
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
    </header>
  );
}
