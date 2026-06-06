import { useEffect, useState } from 'react';
import type { Country } from '../data/countries';

interface GameOverScreenProps {
  nukesLaunched: number;
  lastAttacker: Country;
  onReset: () => void;
}

export default function GameOverScreen({ nukesLaunched, lastAttacker, onReset }: GameOverScreenProps) {
  const [visible, setVisible] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 300);
    const t2 = setTimeout(() => setShowStats(true), 1200);
    const t3 = setTimeout(() => setShowButton(true), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const getRating = () => {
    if (nukesLaunched <= 2) return { label: 'Rookie Warmonger', emoji: '🐣' };
    if (nukesLaunched <= 5) return { label: 'Regional Menace', emoji: '😈' };
    if (nukesLaunched <= 10) return { label: 'Global Threat', emoji: '💀' };
    if (nukesLaunched <= 20) return { label: 'Harbinger of Doom', emoji: '☠️' };
    return { label: 'Almost Got Away With It', emoji: '🏆' };
  };

  const rating = getRating();

  return (
    <div className="gameover-screen">
      {/* Static/glitch background */}
      <div className="gameover-screen__static" />

      <div className={`gameover-screen__content ${visible ? 'gameover-screen__content--visible' : ''}`}>
        <div className="gameover-screen__icon">🛡️💥</div>
        <h1 className="gameover-screen__title">SHIELDS DESTROYED</h1>
        <p className="gameover-screen__subtitle">
          The world fought back — and won.
        </p>

        <div className="gameover-screen__attacker">
          <span className="gameover-screen__attacker-label">Final blow delivered by:</span>
          <span className="gameover-screen__attacker-name">🚀 {lastAttacker.name}</span>
        </div>

        {showStats && (
          <div className="gameover-screen__stats">
            <div className="gameover-stat">
              <div className="gameover-stat__label">Countries Destroyed</div>
              <div className="gameover-stat__value">{nukesLaunched}</div>
            </div>
            <div className="gameover-stat">
              <div className="gameover-stat__label">Villain Rating</div>
              <div className="gameover-stat__value">
                {rating.emoji} {rating.label}
              </div>
            </div>
          </div>
        )}

        {showButton && (
          <button
            id="gameover-restart-btn"
            className="gameover-screen__btn"
            onClick={onReset}
          >
            ↻ Try Again (The world dares you)
          </button>
        )}
      </div>
    </div>
  );
}
