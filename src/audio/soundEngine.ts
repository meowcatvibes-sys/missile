/**
 * Nuclear Command — Sound Engine
 * All sounds generated programmatically via Web Audio API.
 * No external audio files required.
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let ambientOsc: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;
let isMuted = false;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.6;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function getMaster(): GainNode {
  getCtx();
  return masterGain!;
}

// ========== MUTE TOGGLE ==========

export function toggleMute(): boolean {
  isMuted = !isMuted;
  if (masterGain) {
    masterGain.gain.value = isMuted ? 0 : 0.6;
  }
  return isMuted;
}

export function getMuted(): boolean {
  return isMuted;
}

// ========== UTILITY ==========

function createNoise(ctx: AudioContext, duration: number): AudioBufferSourceNode {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  return source;
}

// ========== AMBIENT DRONE (Title / Map) ==========

export function startAmbientDrone(type: 'title' | 'map' = 'title') {
  stopAmbientDrone();
  const ctx = getCtx();

  ambientGain = ctx.createGain();
  ambientGain.gain.value = 0;
  ambientGain.connect(getMaster());

  // Base drone
  ambientOsc = ctx.createOscillator();
  ambientOsc.type = 'sawtooth';
  ambientOsc.frequency.value = type === 'title' ? 55 : 40;

  // Filter for dark tone
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = type === 'title' ? 200 : 150;
  filter.Q.value = 2;

  ambientOsc.connect(filter);
  filter.connect(ambientGain);

  // Sub bass
  const subOsc = ctx.createOscillator();
  subOsc.type = 'sine';
  subOsc.frequency.value = type === 'title' ? 30 : 25;
  const subGain = ctx.createGain();
  subGain.gain.value = 0.3;
  subOsc.connect(subGain);
  subGain.connect(ambientGain);

  // LFO for pulsing
  const lfo = ctx.createOscillator();
  lfo.frequency.value = type === 'title' ? 0.15 : 0.08;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = type === 'title' ? 80 : 40;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  ambientOsc.start();
  subOsc.start();
  lfo.start();

  // Fade in
  ambientGain.gain.linearRampToValueAtTime(type === 'title' ? 0.12 : 0.06, ctx.currentTime + 2);
}

export function stopAmbientDrone() {
  if (ambientOsc) {
    try { ambientOsc.stop(); } catch { /* already stopped */ }
    ambientOsc = null;
  }
  if (ambientGain) {
    ambientGain.disconnect();
    ambientGain = null;
  }
}

// ========== BUTTON CLICK ==========

export function playClick() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.06);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.connect(gain);
  gain.connect(getMaster());
  osc.start(now);
  osc.stop(now + 0.08);
}

// ========== COUNTDOWN TICK ==========

export function playCountdownTick(number: number) {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // High beep
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = number === 0 ? 1200 : 600 + (3 - number) * 200;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  osc.connect(gain);
  gain.connect(getMaster());
  osc.start(now);
  osc.stop(now + 0.3);

  // Sub click
  const click = ctx.createOscillator();
  click.type = 'square';
  click.frequency.value = 100;
  const clickGain = ctx.createGain();
  clickGain.gain.setValueAtTime(0.1, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  click.connect(clickGain);
  clickGain.connect(getMaster());
  click.start(now);
  click.stop(now + 0.05);
}

// ========== MISSILE LAUNCH ==========

export function playMissileLaunch() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Rising whoosh (filtered noise)
  const noise = createNoise(ctx, 3);
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.001, now);
  noiseGain.gain.linearRampToValueAtTime(0.2, now + 0.3);
  noiseGain.gain.linearRampToValueAtTime(0.15, now + 2);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 3);

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(400, now);
  bandpass.frequency.exponentialRampToValueAtTime(3000, now + 2.5);
  bandpass.Q.value = 1.5;

  noise.connect(bandpass);
  bandpass.connect(noiseGain);
  noiseGain.connect(getMaster());
  noise.start(now);

  // Rocket rumble (low oscillator)
  const rumble = ctx.createOscillator();
  rumble.type = 'sawtooth';
  rumble.frequency.setValueAtTime(60, now);
  rumble.frequency.linearRampToValueAtTime(200, now + 2.5);

  const rumbleFilter = ctx.createBiquadFilter();
  rumbleFilter.type = 'lowpass';
  rumbleFilter.frequency.value = 300;

  const rumbleGain = ctx.createGain();
  rumbleGain.gain.setValueAtTime(0.15, now);
  rumbleGain.gain.linearRampToValueAtTime(0.08, now + 2);
  rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 3);

  rumble.connect(rumbleFilter);
  rumbleFilter.connect(rumbleGain);
  rumbleGain.connect(getMaster());
  rumble.start(now);
  rumble.stop(now + 3);
}

// ========== EXPLOSION ==========

export function playExplosion() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // --- BOOM (noise burst) ---
  const noise = createNoise(ctx, 3);
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.5, now);
  noiseGain.gain.setValueAtTime(0.5, now + 0.05);
  noiseGain.gain.exponentialRampToValueAtTime(0.1, now + 0.5);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 3);

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(5000, now);
  lowpass.frequency.exponentialRampToValueAtTime(100, now + 2);

  noise.connect(lowpass);
  lowpass.connect(noiseGain);
  noiseGain.connect(getMaster());
  noise.start(now);

  // --- Sub boom ---
  const subOsc = ctx.createOscillator();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(80, now);
  subOsc.frequency.exponentialRampToValueAtTime(20, now + 1.5);

  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(0.6, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 2);

  subOsc.connect(subGain);
  subGain.connect(getMaster());
  subOsc.start(now);
  subOsc.stop(now + 2);

  // --- Crackle layer ---
  const crackle = createNoise(ctx, 2);
  const crackleGain = ctx.createGain();
  crackleGain.gain.setValueAtTime(0.001, now);
  crackleGain.gain.linearRampToValueAtTime(0.15, now + 0.1);
  crackleGain.gain.exponentialRampToValueAtTime(0.001, now + 2);

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 3000;

  crackle.connect(highpass);
  highpass.connect(crackleGain);
  crackleGain.connect(getMaster());
  crackle.start(now);

  // --- Distant rumble tail ---
  const tailOsc = ctx.createOscillator();
  tailOsc.type = 'sawtooth';
  tailOsc.frequency.value = 35;
  const tailFilter = ctx.createBiquadFilter();
  tailFilter.type = 'lowpass';
  tailFilter.frequency.value = 80;
  const tailGain = ctx.createGain();
  tailGain.gain.setValueAtTime(0.001, now);
  tailGain.gain.linearRampToValueAtTime(0.15, now + 0.3);
  tailGain.gain.exponentialRampToValueAtTime(0.001, now + 4);
  tailOsc.connect(tailFilter);
  tailFilter.connect(tailGain);
  tailGain.connect(getMaster());
  tailOsc.start(now);
  tailOsc.stop(now + 4);
}

// ========== SIREN / ALARM ==========

export function playSiren() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Two-tone siren
  const osc = ctx.createOscillator();
  osc.type = 'square';

  // Alternate between two pitches rapidly
  for (let i = 0; i < 8; i++) {
    const t = now + i * 0.22;
    osc.frequency.setValueAtTime(i % 2 === 0 ? 800 : 600, t);
  }

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 2000;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.setValueAtTime(0.2, now + 1.7);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(getMaster());
  osc.start(now);
  osc.stop(now + 1.8);

  // Underlying alarm buzz
  const buzz = ctx.createOscillator();
  buzz.type = 'sawtooth';
  buzz.frequency.value = 150;
  const buzzGain = ctx.createGain();
  buzzGain.gain.setValueAtTime(0.08, now);
  buzzGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
  const buzzFilter = ctx.createBiquadFilter();
  buzzFilter.type = 'lowpass';
  buzzFilter.frequency.value = 400;
  buzz.connect(buzzFilter);
  buzzFilter.connect(buzzGain);
  buzzGain.connect(getMaster());
  buzz.start(now);
  buzz.stop(now + 1.8);
}

// ========== SHIELD HIT ==========

export function playShieldHit() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Metallic impact
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

  osc.connect(gain);
  gain.connect(getMaster());
  osc.start(now);
  osc.stop(now + 0.5);

  // Electric crackle
  const noise = createNoise(ctx, 0.4);
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.2, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 4000;
  bp.Q.value = 3;
  noise.connect(bp);
  bp.connect(noiseGain);
  noiseGain.connect(getMaster());
  noise.start(now);

  // Descending tone (shields weakening)
  const desc = ctx.createOscillator();
  desc.type = 'sine';
  desc.frequency.setValueAtTime(600, now + 0.1);
  desc.frequency.exponentialRampToValueAtTime(100, now + 0.8);
  const descGain = ctx.createGain();
  descGain.gain.setValueAtTime(0.15, now + 0.1);
  descGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
  desc.connect(descGain);
  descGain.connect(getMaster());
  desc.start(now + 0.1);
  desc.stop(now + 0.8);
}

// ========== GAME OVER ==========

export function playGameOver() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Descending doom tone
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(30, now + 3);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2000, now);
  filter.frequency.exponentialRampToValueAtTime(60, now + 3);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(getMaster());
  osc.start(now);
  osc.stop(now + 3.5);

  // Static / distortion
  const noise = createNoise(ctx, 2);
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.08, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 2);
  noise.connect(noiseGain);
  noiseGain.connect(getMaster());
  noise.start(now);

  // Low doom chord
  [55, 65.4, 82.4].forEach((freq) => {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.15, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 4);
    o.connect(g);
    g.connect(getMaster());
    o.start(now);
    o.stop(now + 4);
  });
}

// ========== GEIGER COUNTER (Aftermath) ==========

let geigerInterval: ReturnType<typeof setInterval> | null = null;

export function startGeiger() {
  stopGeiger();
  const ctx = getCtx();

  geigerInterval = setInterval(() => {
    if (isMuted) return;
    const now = ctx.currentTime;
    // Random clicks at varying intervals
    const numClicks = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numClicks; i++) {
      const delay = Math.random() * 0.15;
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = 4000 + Math.random() * 2000;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.01);
      osc.connect(gain);
      gain.connect(getMaster());
      osc.start(now + delay);
      osc.stop(now + delay + 0.015);
    }
  }, 200);
}

export function stopGeiger() {
  if (geigerInterval) {
    clearInterval(geigerInterval);
    geigerInterval = null;
  }
}

// ========== VICTORY FANFARE ==========

export function playVictory() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Ominous "victory" — it's not a happy win
  const notes = [220, 277.2, 329.6, 220, 164.8, 130.8];
  notes.forEach((freq, i) => {
    const t = now + i * 0.4;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
    osc.connect(gain);
    gain.connect(getMaster());
    osc.start(t);
    osc.stop(t + 0.4);
  });

  // Reverb-like tail
  const reverb = ctx.createOscillator();
  reverb.type = 'sine';
  reverb.frequency.value = 110;
  const reverbGain = ctx.createGain();
  reverbGain.gain.setValueAtTime(0.001, now);
  reverbGain.gain.linearRampToValueAtTime(0.15, now + 1);
  reverbGain.gain.exponentialRampToValueAtTime(0.001, now + 4);
  reverb.connect(reverbGain);
  reverbGain.connect(getMaster());
  reverb.start(now);
  reverb.stop(now + 4);
}

// ========== TARGET SELECT (hover confirm) ==========

export function playTargetLock() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Two quick ascending tones
  [500, 700].forEach((freq, i) => {
    const t = now + i * 0.08;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(gain);
    gain.connect(getMaster());
    osc.start(t);
    osc.stop(t + 0.1);
  });
}

// ========== TACTICAL NUKE INCOMING (Real audio file) ==========

export function playTacticalNukeIncoming() {
  if (isMuted) return;

  const audio = new Audio('/tactical_nuke.mp3.mp3');
  audio.volume = 1;
  audio.play().catch(() => {
    // Autoplay may be blocked — ignore silently
  });
}

// ========== CLEANUP ==========

export function cleanupAudio() {
  stopAmbientDrone();
  stopGeiger();
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
    masterGain = null;
  }
}
