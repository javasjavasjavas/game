import { Camera, Settings } from "lucide-react";
import { DollarSign } from "lucide-react";

interface Props {
  clock: string;
  dateLabel: string;
  money: number;
  moneyDetailsOpen: boolean;
  moneyExpenses: string[];
  onToggleMoneyDetails: () => void;
}

export function TopBar({ clock, dateLabel, money, moneyDetailsOpen, moneyExpenses, onToggleMoneyDetails }: Props) {
  return (
    <header className="topbar">
      <div className="topbar-spacer" />
      <div className="topbar-meta">
        <div className="topbar-clock-block">
          <div className="topbar-clock">{clock}</div>
          <div className="topbar-date">{dateLabel}</div>
        </div>
        <div className="topbar-money-block">
          <div className="topbar-money-value">
            <DollarSign size={14} />
            <span>{money}</span>
          </div>
          <button className="topbar-money-btn" onClick={onToggleMoneyDetails}>
            View details
          </button>
          {moneyDetailsOpen && (
            <ul className="topbar-money-details">
              {moneyExpenses.length === 0 ? <li>No expenses yet.</li> : moneyExpenses.map((expense, idx) => <li key={idx}>{expense}</li>)}
            </ul>
          )}
        </div>
      </div>
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
