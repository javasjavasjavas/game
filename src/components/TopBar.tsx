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
          <img className="topbar-location-icon" src="/game-assets/icon_location.png" alt="Location" />
          <h1 className="topbar-location-title">{roomName}</h1>
        </div>
        <p className="topbar-location-description">{roomDescription}</p>
      </div>

      <div className="topbar-spacer" />

      <div className="topbar-time-plain">
        <p className="topbar-time-value">{clock}</p>
        <p className="topbar-time-date">{dateLabel}</p>
      </div>
    </header>
  );
}
