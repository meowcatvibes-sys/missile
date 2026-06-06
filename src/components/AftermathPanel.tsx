import type { Country } from '../data/countries';

interface AftermathPanelProps {
  country: Country;
  casualties: string;
  damagePercent: number;
  chaosLevel: number;
  nukedCountries: string[];
  allCountries: Country[];
  onContinue: () => void;
  hasRetaliation?: boolean;
}

export default function AftermathPanel({
  country,
  casualties,
  damagePercent,
  chaosLevel,
  nukedCountries,
  allCountries,
  onContinue,
  hasRetaliation = false,
}: AftermathPanelProps) {
  const nukedNames = allCountries
    .filter((c) => nukedCountries.includes(c.id))
    .map((c) => c.name);

  return (
    <div className="aftermath-screen">
      <div className="aftermath-panel">
        <div className="aftermath-panel__header">
          <div className="aftermath-panel__icon">💀</div>
          <div className="aftermath-panel__title">Target Destroyed</div>
          <div className="aftermath-panel__country">{country.name}</div>
        </div>

        <div className="aftermath-panel__description">
          {country.damageDescription}
        </div>

        <div className="aftermath-panel__stats">
          <div className="aftermath-stat">
            <div className="aftermath-stat__label">Casualties</div>
            <div className="aftermath-stat__value">{casualties}</div>
          </div>
          <div className="aftermath-stat">
            <div className="aftermath-stat__label">Damage</div>
            <div className="aftermath-stat__value">{damagePercent}%</div>
          </div>
          <div className="aftermath-stat">
            <div className="aftermath-stat__label">Infrastructure</div>
            <div className="aftermath-stat__value aftermath-stat__value--amber">OBLITERATED</div>
          </div>
          <div className="aftermath-stat">
            <div className="aftermath-stat__label">Rebuilding ETA</div>
            <div className="aftermath-stat__value aftermath-stat__value--amber">∞ years</div>
          </div>
        </div>

        <div className="chaos-meter">
          <div className="chaos-meter__label">
            <span>World Chaos Level</span>
            <span className="chaos-meter__value">{Math.min(chaosLevel, 100)}%</span>
          </div>
          <div className="chaos-meter__bar">
            <div
              className="chaos-meter__fill"
              style={{ width: `${Math.min(chaosLevel, 100)}%` }}
            />
          </div>
        </div>

        {nukedNames.length > 0 && (
          <div className="aftermath-panel__history">
            <div className="history__title">☢ Destruction Log</div>
            <div className="history__list">
              {nukedNames.map((name) => (
                <span key={name} className="history__tag">
                  ☢ {name}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          id="next-target-btn"
          className={`aftermath-panel__btn ${hasRetaliation ? 'aftermath-panel__btn--danger' : ''}`}
          onClick={onContinue}
        >
          {hasRetaliation ? '⚠️ Brace for Retaliation...' : '🎯 Select Next Target'}
        </button>
      </div>
    </div>
  );
}
