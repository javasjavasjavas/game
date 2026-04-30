import type { CharacterMemory } from "../hooks/useGame";

interface Props {
  characters: CharacterMemory[];
  expandedCharacter: CharacterMemory | null;
  score: number;
  money: number;
  onToggleCharacter: (npcId: string) => void;
  mobileOpen: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSettingsClick: () => void;
}

export function Sidebar({
  characters,
  expandedCharacter,
  score,
  money,
  onToggleCharacter,
  mobileOpen,
  soundEnabled,
  onToggleSound,
  onSettingsClick,
}: Props) {
  return (
    <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
      <section className="sidebar-score">
        <div className="sidebar-score-row">
          <div className="sidebar-tools">
            <button className="sidebar-settings-btn" onClick={onSettingsClick} aria-label="Open settings">
              <img className="sidebar-logo" src="/game-assets/icon_settings.png" alt="Settings icon" />
            </button>
            <button className="sidebar-sound-btn" onClick={onToggleSound} aria-label={soundEnabled ? "Disable sound" : "Enable sound"}>
              <img
                className="sidebar-logo"
                src={soundEnabled ? "/game-assets/icon_sound.png" : "/game-assets/icon_no_sound.png"}
                alt={soundEnabled ? "Sound on" : "Sound off"}
              />
            </button>
          </div>
          <p className="sidebar-score-value">Score: {score}</p>
        </div>
      </section>

      <section className="panel blue">
        <h2>Money</h2>
        <p className="sidebar-money-value">
          <img className="sidebar-wallet-icon" src="/game-assets/item_wallet.png" alt="Wallet" />
          ${money}
        </p>
      </section>

      <section className="panel">
        <h2>Characters</h2>
        <div className="characters-list">
          {characters.length === 0 ? (
            <p>No character records yet.</p>
          ) : (
            characters.map((character) => (
              <div key={character.npcId} className={`character-card ${expandedCharacter?.npcId === character.npcId ? "expanded" : ""}`}>
                <button
                  className={`character-row ${expandedCharacter?.npcId === character.npcId ? "active" : ""}`}
                  onClick={() => onToggleCharacter(character.npcId)}
                >
                  <img className="character-thumb" src={character.portrait} alt={`${character.name} portrait`} />
                  <span className="character-name">{character.name}</span>
                  {character.hasNewClue && <span className="character-tag">New clue</span>}
                </button>
                {expandedCharacter?.npcId === character.npcId && character.clues.length > 0 && (
                  <div className="character-detail">
                    <p className="character-description">{character.description}</p>
                    <h3 className="character-clues-title">Clues</h3>
                    <ul className="character-notes">
                      {character.clues.map((clue, index) => (
                        <li key={`${character.npcId}-${index}`} className="character-clue">{clue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {expandedCharacter?.npcId === character.npcId && character.clues.length === 0 && (
                  <div className="character-detail">
                    <p className="character-description">{character.description}</p>
                    <h3 className="character-clues-title">Clues</h3>
                    <p>No clues yet.</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

    </aside>
  );
}
