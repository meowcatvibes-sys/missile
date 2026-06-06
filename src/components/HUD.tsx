interface HUDProps {
  nukesLaunched: number;
  chaosLevel: number;
  nukedCountries: string[];
  shieldLevel: number;
}

export default function HUD({ nukesLaunched, chaosLevel, nukedCountries, shieldLevel }: HUDProps) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour12: false });

  const shieldColor = shieldLevel > 50 ? 'hud__stat-value--green'
    : shieldLevel > 25 ? 'hud__stat-value--amber'
    : 'hud__stat-value--red';

  return (
    <header className="hud">
      <div className="hud__logo">☢ NUCLEAR COMMAND</div>
      <div className="hud__stats">
        <div className="hud__stat">
          <span className="hud__stat-label">Nukes</span>
          <span className="hud__stat-value hud__stat-value--red">{nukesLaunched}</span>
        </div>
        <div className="hud__stat">
          <span className="hud__stat-label">Chaos</span>
          <span className="hud__stat-value">{Math.min(chaosLevel, 100)}%</span>
        </div>
        <div className="hud__stat">
          <span className="hud__stat-label">Shields</span>
          <span className={`hud__stat-value ${shieldColor}`}>
            🛡️ {Math.max(0, shieldLevel)}%
          </span>
        </div>
        <div className="hud__stat">
          <span className="hud__stat-label">Remaining</span>
          <span className="hud__stat-value hud__stat-value--green">{30 - nukedCountries.length}</span>
        </div>
        <div className="hud__stat">
          <span className="hud__stat-label">Time</span>
          <span className="hud__stat-value">{timeStr}</span>
        </div>
      </div>
    </header>
  );
}

