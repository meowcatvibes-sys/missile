import { useEffect, useRef, useState } from 'react';
import { playMissileLaunch, playExplosion } from '../audio/soundEngine';
import { countries } from '../data/countries';

interface NukeAnimationProps {
  targetName: string;
  targetCenter: { x: number; y: number };
  nukedCountries: string[];
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'spark' | 'debris' | 'smoke';
}

export default function NukeAnimation({ targetName, targetCenter, nukedCountries, onComplete }: NukeAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState('MISSILE LAUNCHED');
  const [showFlash, setShowFlash] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Map SVG viewBox is 1000x500 — calculate the map rendering area
    // Center the map in the canvas
    const mapAspect = 2; // 1000/500
    const canvasAspect = canvas.width / canvas.height;
    let mapW: number, mapH: number, mapX: number, mapY: number;

    if (canvasAspect > mapAspect) {
      // Canvas is wider — fit to height
      mapH = canvas.height * 0.85;
      mapW = mapH * mapAspect;
    } else {
      // Canvas is taller — fit to width
      mapW = canvas.width * 0.9;
      mapH = mapW / mapAspect;
    }
    mapX = (canvas.width - mapW) / 2;
    mapY = (canvas.height - mapH) / 2;

    // Convert SVG coordinates (0-1000, 0-500) to canvas coordinates
    const svgToCanvas = (sx: number, sy: number) => ({
      x: mapX + (sx / 1000) * mapW,
      y: mapY + (sy / 500) * mapH,
    });

    // Target position in canvas coordinates
    const target = svgToCanvas(targetCenter.x, targetCenter.y);

    // Launch from bottom-left of the map (a "base" position)
    const launchPos = svgToCanvas(200, 460);

    let particles: Particle[] = [];
    let phase: 'missile' | 'explosion' | 'mushroom' | 'done' = 'missile';
    let frame = 0;
    let animId: number;
    let missileProgress = 0;

    const colors = {
      fire: ['#ff4500', '#ff6b00', '#ffa500', '#ffcc00', '#fff200'],
      smoke: ['rgba(80,80,80,0.6)', 'rgba(60,60,60,0.4)', 'rgba(100,100,100,0.3)'],
      spark: ['#ffffff', '#ffffcc', '#ffddaa'],
    };

    const addParticles = (x: number, y: number, count: number, type: Particle['type']) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = type === 'spark' ? Math.random() * 8 + 4 :
                      type === 'debris' ? Math.random() * 6 + 2 :
                      Math.random() * 2 + 0.5;
        const colorArr = type === 'spark' ? colors.spark :
                         type === 'debris' ? colors.fire :
                         colors.smoke;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (type === 'smoke' ? 2 : 0),
          radius: type === 'spark' ? Math.random() * 2 + 1 :
                  type === 'debris' ? Math.random() * 4 + 2 :
                  Math.random() * 15 + 8,
          color: colorArr[Math.floor(Math.random() * colorArr.length)],
          life: 1,
          maxLife: type === 'spark' ? 30 + Math.random() * 20 :
                   type === 'debris' ? 60 + Math.random() * 40 :
                   100 + Math.random() * 60,
          type,
        });
      }
    };

    // Draw the world map background
    const drawMap = () => {
      // Ocean background
      ctx.fillStyle = '#0a0e17';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Map area background
      ctx.save();
      ctx.fillStyle = '#080c14';
      ctx.fillRect(mapX, mapY, mapW, mapH);

      // Grid lines
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 20; i++) {
        const gx = mapX + (i / 20) * mapW;
        ctx.beginPath();
        ctx.moveTo(gx, mapY);
        ctx.lineTo(gx, mapY + mapH);
        ctx.stroke();
      }
      for (let i = 0; i <= 10; i++) {
        const gy = mapY + (i / 10) * mapH;
        ctx.beginPath();
        ctx.moveTo(mapX, gy);
        ctx.lineTo(mapX + mapW, gy);
        ctx.stroke();
      }

      // Draw country paths using Path2D with transform
      ctx.save();
      ctx.translate(mapX, mapY);
      ctx.scale(mapW / 1000, mapH / 500);

      countries.forEach((country) => {
        const path = new Path2D(country.path);
        const isNuked = nukedCountries.includes(country.id);
        const isTarget = country.center.x === targetCenter.x && country.center.y === targetCenter.y;

        if (isTarget) {
          ctx.fillStyle = '#dc2626';
          ctx.strokeStyle = '#ff4444';
          ctx.lineWidth = 2.5;
        } else if (isNuked) {
          ctx.fillStyle = '#7f1d1d';
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 1.2;
        } else {
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 0.8;
        }

        ctx.fill(path);
        ctx.stroke(path);
      });

      // Draw nuked markers
      countries.filter(c => nukedCountries.includes(c.id)).forEach(c => {
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#dc2626';
        ctx.fillText('☢', c.center.x, c.center.y);
      });

      ctx.restore();
      ctx.restore();

      // Target crosshair (pulsing)
      if (phase === 'missile') {
        const pulse = Math.sin(frame * 0.1) * 5 + 20;
        ctx.strokeStyle = `rgba(255, 45, 45, ${0.5 + Math.sin(frame * 0.1) * 0.3})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(target.x, target.y, pulse, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshair lines
        const crossSize = pulse + 8;
        ctx.beginPath();
        ctx.moveTo(target.x - crossSize, target.y);
        ctx.lineTo(target.x - pulse + 5, target.y);
        ctx.moveTo(target.x + pulse - 5, target.y);
        ctx.lineTo(target.x + crossSize, target.y);
        ctx.moveTo(target.x, target.y - crossSize);
        ctx.lineTo(target.x, target.y - pulse + 5);
        ctx.moveTo(target.x, target.y + pulse - 5);
        ctx.lineTo(target.x, target.y + crossSize);
        ctx.stroke();
      }
    };

    const drawMissile = () => {
      missileProgress += 0.012;
      if (missileProgress >= 1) {
        phase = 'explosion';
        setStatus('IMPACT DETECTED');
        setShowFlash(true);
        setShake(true);
        playExplosion();
        setTimeout(() => setShowFlash(false), 800);
        setTimeout(() => setShake(false), 600);
        addParticles(target.x, target.y, 100, 'spark');
        addParticles(target.x, target.y, 60, 'debris');
        addParticles(target.x, target.y, 30, 'smoke');
        return;
      }

      // Bezier curve arc trajectory from launch to target
      const t = missileProgress;
      // Control point high above the midpoint
      const midX = (launchPos.x + target.x) / 2;
      const arcHeight = Math.min(canvas.height * 0.6, 400);
      const controlY = Math.min(launchPos.y, target.y) - arcHeight;

      const mx = launchPos.x * (1 - t) * (1 - t) + midX * 2 * (1 - t) * t + target.x * t * t;
      const my = launchPos.y * (1 - t) * (1 - t) + controlY * 2 * (1 - t) * t + target.y * t * t;

      // Dotted trajectory preview
      ctx.strokeStyle = 'rgba(255, 45, 45, 0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      for (let i = 0; i <= 50; i++) {
        const pt = i / 50;
        const px = launchPos.x * (1 - pt) * (1 - pt) + midX * 2 * (1 - pt) * pt + target.x * pt * pt;
        const py = launchPos.y * (1 - pt) * (1 - pt) + controlY * 2 * (1 - pt) * pt + target.y * pt * pt;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Missile body
      ctx.beginPath();
      ctx.arc(mx, my, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Missile glow
      const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 20);
      grad.addColorStop(0, 'rgba(255, 200, 50, 0.8)');
      grad.addColorStop(1, 'rgba(255, 100, 0, 0)');
      ctx.beginPath();
      ctx.arc(mx, my, 20, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Trail particles
      if (frame % 2 === 0) {
        particles.push({
          x: mx,
          y: my,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 2 + 1,
          radius: Math.random() * 3 + 1,
          color: colors.fire[Math.floor(Math.random() * colors.fire.length)],
          life: 1,
          maxLife: 20,
          type: 'spark',
        });
      }
    };

    let explosionFrame = 0;
    const drawExplosion = () => {
      explosionFrame++;

      // Shockwave ring
      if (explosionFrame < 60) {
        const ringRadius = explosionFrame * 6;
        ctx.beginPath();
        ctx.arc(target.x, target.y, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 200, 50, ${1 - explosionFrame / 60})`;
        ctx.lineWidth = 4 - (explosionFrame / 60) * 3;
        ctx.stroke();
      }

      // Central fireball
      if (explosionFrame < 80) {
        const fireRadius = Math.min(explosionFrame * 3, 120);
        const grad = ctx.createRadialGradient(target.x, target.y, 0, target.x, target.y, fireRadius);
        grad.addColorStop(0, `rgba(255, 255, 200, ${Math.max(0, 0.9 - explosionFrame / 80)})`);
        grad.addColorStop(0.3, `rgba(255, 150, 0, ${Math.max(0, 0.7 - explosionFrame / 80)})`);
        grad.addColorStop(0.7, `rgba(255, 50, 0, ${Math.max(0, 0.4 - explosionFrame / 80)})`);
        grad.addColorStop(1, 'rgba(100, 0, 0, 0)');
        ctx.beginPath();
        ctx.arc(target.x, target.y, fireRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Smoke for mushroom cloud
      if (explosionFrame > 20 && explosionFrame < 100) {
        addParticles(target.x, target.y - explosionFrame * 1.5, 3, 'smoke');
        addParticles(target.x + (Math.random() - 0.5) * 40, target.y, 2, 'debris');
      }

      if (explosionFrame > 30) {
        phase = 'mushroom';
        setStatus('TARGET DESTROYED');
      }
    };

    let mushroomFrame = 0;
    const drawMushroom = () => {
      mushroomFrame++;

      // Mushroom cloud stem
      const stemHeight = Math.min(mushroomFrame * 2, 200);
      const stemGrad = ctx.createLinearGradient(target.x, target.y, target.x, target.y - stemHeight);
      stemGrad.addColorStop(0, `rgba(80, 40, 0, ${Math.max(0, 0.6 - mushroomFrame / 200)})`);
      stemGrad.addColorStop(1, `rgba(120, 80, 40, ${Math.max(0, 0.4 - mushroomFrame / 200)})`);
      ctx.beginPath();
      ctx.moveTo(target.x - 30, target.y);
      ctx.lineTo(target.x - 15, target.y - stemHeight);
      ctx.lineTo(target.x + 15, target.y - stemHeight);
      ctx.lineTo(target.x + 30, target.y);
      ctx.fillStyle = stemGrad;
      ctx.fill();

      // Mushroom cap
      const capRadius = Math.min(mushroomFrame * 1.5, 100);
      const capGrad = ctx.createRadialGradient(target.x, target.y - stemHeight, 0, target.x, target.y - stemHeight, capRadius);
      capGrad.addColorStop(0, `rgba(200, 100, 0, ${Math.max(0, 0.5 - mushroomFrame / 200)})`);
      capGrad.addColorStop(0.5, `rgba(150, 80, 30, ${Math.max(0, 0.4 - mushroomFrame / 200)})`);
      capGrad.addColorStop(1, `rgba(80, 40, 20, 0)`);
      ctx.beginPath();
      ctx.ellipse(target.x, target.y - stemHeight, capRadius, capRadius * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = capGrad;
      ctx.fill();

      if (mushroomFrame > 150) {
        phase = 'done';
        onComplete();
      }
    };

    const animate = () => {
      // Draw the map as background each frame
      drawMap();

      // Update and draw particles
      particles = particles.filter((p) => {
        p.life--;
        if (p.life <= 0) {
          p.maxLife--;
          p.life = 0;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.type === 'smoke' ? -0.02 : 0.05;
        p.vx *= 0.99;

        const alpha = Math.max(0, p.maxLife / (p.type === 'spark' ? 50 : p.type === 'debris' ? 100 : 160));
        if (alpha <= 0) return false;

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
        return alpha > 0;
      });

      if (phase === 'missile') drawMissile();
      else if (phase === 'explosion') drawExplosion();
      else if (phase === 'mushroom') drawMushroom();

      frame++;
      if (phase !== 'done') {
        animId = requestAnimationFrame(animate);
      }
    };

    playMissileLaunch();
    animId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animId);
  }, [onComplete, targetCenter, nukedCountries]);

  return (
    <div className={`nuke-animation ${shake ? 'shake' : ''}`}>
      <canvas ref={canvasRef} />
      <div className="nuke-animation__status">
        🚀 {status}: {targetName.toUpperCase()}
      </div>
      {showFlash && <div className="flash-overlay" />}
    </div>
  );
}
