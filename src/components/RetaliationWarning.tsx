import { useEffect, useRef, useState } from 'react';
import type { RetaliationResult } from '../data/countries';
import { playSiren, playMissileLaunch, playExplosion, playShieldHit } from '../audio/soundEngine';

interface RetaliationWarningProps {
  retaliation: RetaliationResult;
  shieldBefore: number;
  shieldAfter: number;
  onComplete: () => void;
}

export default function RetaliationWarning({
  retaliation,
  shieldBefore,
  shieldAfter,
  onComplete,
}: RetaliationWarningProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'warning' | 'incoming' | 'impact' | 'damage'>('warning');
  const [showFlash, setShowFlash] = useState(false);
  const [shake, setShake] = useState(false);
  const [displayShield, setDisplayShield] = useState(shieldBefore);

  // Warning siren phase
  useEffect(() => {
    playSiren();
    const t1 = setTimeout(() => setPhase('incoming'), 1800);
    return () => clearTimeout(t1);
  }, []);

  // Canvas animation for incoming missile
  useEffect(() => {
    if (phase !== 'incoming') return;

    playMissileLaunch();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Missile comes from top-right to center
    const startX = canvas.width * 0.85;
    const startY = -50;
    let progress = 0;
    let animId: number;
    let impacted = false;

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 14, 23, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      progress += 0.02;
      if (progress >= 1 && !impacted) {
        impacted = true;
        setPhase('impact');
        setShowFlash(true);
        setShake(true);
        playExplosion();
        playShieldHit();
        setTimeout(() => setShowFlash(false), 600);
        setTimeout(() => setShake(false), 500);
        setTimeout(() => setPhase('damage'), 1200);
        return;
      }

      // Missile position (arc from top-right to center)
      const t = Math.min(progress, 1);
      const mx = startX + (cx - startX) * t;
      const controlY = -canvas.height * 0.2;
      const my = startY * (1 - t) * (1 - t) + controlY * 2 * (1 - t) * t + cy * t * t;

      // Missile body — red glow
      ctx.beginPath();
      ctx.arc(mx, my, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ff2d2d';
      ctx.fill();

      // Glow
      const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 25);
      grad.addColorStop(0, 'rgba(255, 45, 45, 0.8)');
      grad.addColorStop(1, 'rgba(255, 45, 45, 0)');
      ctx.beginPath();
      ctx.arc(mx, my, 25, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Trail sparks
      for (let i = 0; i < 3; i++) {
        const tx = mx + (Math.random() - 0.5) * 10 + (startX - cx) * 0.03;
        const ty = my + (Math.random() - 0.5) * 10 - 5;
        ctx.beginPath();
        ctx.arc(tx, ty, Math.random() * 2 + 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, ${100 + Math.random() * 155}, 50, ${0.5 + Math.random() * 0.5})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    };

    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    animId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animId);
  }, [phase]);

  // Animate shield counter down
  useEffect(() => {
    if (phase !== 'damage') return;
    const steps = 20;
    const diff = shieldBefore - shieldAfter;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setDisplayShield(Math.round(shieldBefore - (diff * step) / steps));
      if (step >= steps) {
        clearInterval(interval);
        setTimeout(onComplete, 1800);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [phase, shieldBefore, shieldAfter, onComplete]);

  return (
    <div className={`retaliation-warning ${shake ? 'shake' : ''}`}>
      {/* Canvas for missile animation */}
      {phase === 'incoming' && <canvas ref={canvasRef} className="retaliation-warning__canvas" />}

      {/* Red flash on impact */}
      {showFlash && <div className="retaliation-flash" />}

      {/* WARNING phase — siren alert */}
      {phase === 'warning' && (
        <div className="retaliation-warning__siren">
          <div className="retaliation-warning__siren-icon">🚨</div>
          <h1 className="retaliation-warning__siren-text">INCOMING MISSILE</h1>
          <p className="retaliation-warning__siren-from">
            ⚠ {retaliation.attacker.name} is retaliating!
          </p>
        </div>
      )}

      {/* INCOMING phase — just the canvas */}
      {phase === 'incoming' && (
        <div className="retaliation-warning__status">
          🚀 INCOMING FROM: {retaliation.attacker.name.toUpperCase()}
        </div>
      )}

      {/* IMPACT / DAMAGE phase — show damage report */}
      {(phase === 'impact' || phase === 'damage') && (
        <div className="retaliation-warning__damage-report">
          <div className="retaliation-warning__damage-icon">💥</div>
          <h2 className="retaliation-warning__damage-title">SHIELD HIT</h2>
          <p className="retaliation-warning__damage-message">{retaliation.message}</p>

          <div className="retaliation-warning__shield-display">
            <div className="retaliation-warning__shield-label">Shield Integrity</div>
            <div className={`retaliation-warning__shield-value ${displayShield <= 25 ? 'critical' : displayShield <= 50 ? 'warning' : ''}`}>
              {Math.max(0, displayShield)}%
            </div>
            <div className="retaliation-warning__shield-bar">
              <div
                className="retaliation-warning__shield-fill"
                style={{ width: `${Math.max(0, displayShield)}%` }}
              />
            </div>
            <div className="retaliation-warning__damage-amount">
              -{retaliation.damage} shield damage
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
