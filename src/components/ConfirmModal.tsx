import { useEffect, useState, useCallback } from 'react';
import type { Country } from '../data/countries';
import { playCountdownTick, playClick, playTacticalNukeIncoming } from '../audio/soundEngine';

interface ConfirmModalProps {
  country: Country;
  onConfirm: () => void;
  onAbort: () => void;
}

export default function ConfirmModal({ country, onConfirm, onAbort }: ConfirmModalProps) {
  const [countdown, setCountdown] = useState<number | null>(null);

  const startCountdown = useCallback(() => {
    playClick();
    playTacticalNukeIncoming();
    setCountdown(3);
  }, []);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      onConfirm();
      return;
    }
    playCountdownTick(countdown);
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, onConfirm]);

  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <div className="confirm-modal__icon">🎯</div>
        <p className="confirm-modal__label">⚠ Target Acquired ⚠</p>
        <h2 className="confirm-modal__country">{country.name}</h2>
        <p className="confirm-modal__pop">
          Population: {country.population} • GDP: {country.gdp}
        </p>

        {countdown !== null ? (
          <div className="confirm-modal__countdown">
            <span key={countdown}>{countdown === 0 ? '🔥' : countdown}</span>
          </div>
        ) : (
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '24px' }}>
            "{country.funFact}"
          </p>
        )}

        {countdown === null && (
          <div className="confirm-modal__buttons">
            <button
              id="confirm-launch-btn"
              className="confirm-modal__btn confirm-modal__btn--launch"
              onClick={startCountdown}
            >
              🚀 Launch
            </button>
            <button
              id="abort-btn"
              className="confirm-modal__btn confirm-modal__btn--abort"
              onClick={onAbort}
            >
              ✕ Abort
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
