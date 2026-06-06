import { useState, useCallback, useEffect } from 'react';
import './App.css';
import {
  startAmbientDrone,
  stopAmbientDrone,
  playTargetLock,
  playClick,
  startGeiger,
  stopGeiger,
  playVictory,
  playGameOver,
  toggleMute,
  cleanupAudio,
} from './audio/soundEngine';
import TitleScreen from './components/TitleScreen';
import HUD from './components/HUD';
import WorldMap from './components/WorldMap';
import ConfirmModal from './components/ConfirmModal';
import NukeAnimation from './components/NukeAnimation';
import AftermathPanel from './components/AftermathPanel';
import RetaliationWarning from './components/RetaliationWarning';
import GameOverScreen from './components/GameOverScreen';
import {
  countries,
  type Country,
  type RetaliationResult,
  getRandomDamagePercent,
  getCasualtyEstimate,
  getChaosIncrease,
  calculateRetaliation,
} from './data/countries';

type GamePhase = 'title' | 'map' | 'confirm' | 'launch' | 'aftermath' | 'retaliation' | 'gameover' | 'win';

interface NukeResult {
  country: Country;
  casualties: string;
  damagePercent: number;
}

function App() {
  const [phase, setPhase] = useState<GamePhase>('title');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [nukedCountries, setNukedCountries] = useState<string[]>([]);
  const [chaosLevel, setChaosLevel] = useState(0);
  const [lastResult, setLastResult] = useState<NukeResult | null>(null);
  const [shieldLevel, setShieldLevel] = useState(100);
  const [pendingRetaliation, setPendingRetaliation] = useState<RetaliationResult | null>(null);
  const [shieldBeforeHit, setShieldBeforeHit] = useState(100);
  const [lastAttacker, setLastAttacker] = useState<Country | null>(null);
  const [muted, setMuted] = useState(false);

  // Sound management per phase
  useEffect(() => {
    if (phase === 'title') {
      startAmbientDrone('title');
    } else if (phase === 'map') {
      stopGeiger();
      startAmbientDrone('map');
    } else if (phase === 'aftermath') {
      stopAmbientDrone();
      startGeiger();
    } else if (phase === 'retaliation') {
      stopGeiger();
      stopAmbientDrone();
    } else if (phase === 'gameover') {
      stopGeiger();
      stopAmbientDrone();
      playGameOver();
    } else if (phase === 'win') {
      stopGeiger();
      stopAmbientDrone();
      playVictory();
    }
  }, [phase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanupAudio();
  }, []);

  const handleStart = () => {
    playClick();
    setPhase('map');
  };

  const handleSelectCountry = (country: Country) => {
    playTargetLock();
    setSelectedCountry(country);
    setPhase('confirm');
  };

  const handleConfirmLaunch = useCallback(() => {
    setPhase('launch');
  }, []);

  const handleAbort = () => {
    playClick();
    setSelectedCountry(null);
    setPhase('map');
  };

  const handleAnimationComplete = useCallback(() => {
    if (!selectedCountry) return;

    const casualties = getCasualtyEstimate(selectedCountry.population);
    const damagePercent = getRandomDamagePercent();
    const chaosIncrease = getChaosIncrease();

    const newNukedCountries = [...nukedCountries, selectedCountry.id];
    const newChaosLevel = Math.min(chaosLevel + chaosIncrease, 100);

    setNukedCountries(newNukedCountries);
    setChaosLevel(newChaosLevel);
    setLastResult({ country: selectedCountry, casualties, damagePercent });

    // Check for retaliation
    const retaliation = calculateRetaliation(selectedCountry, newNukedCountries, newChaosLevel);
    if (retaliation) {
      setPendingRetaliation(retaliation);
    } else {
      setPendingRetaliation(null);
    }

    setPhase('aftermath');
  }, [selectedCountry, nukedCountries, chaosLevel]);

  const handleContinue = () => {
    // If there's a pending retaliation, show it before going back to map
    if (pendingRetaliation) {
      setShieldBeforeHit(shieldLevel);
      setPhase('retaliation');
      return;
    }

    setSelectedCountry(null);
    // Check if all countries have been nuked
    if (nukedCountries.length >= countries.length) {
      setPhase('win');
    } else {
      setPhase('map');
    }
  };

  const handleRetaliationComplete = useCallback(() => {
    if (!pendingRetaliation) return;

    const newShield = Math.max(0, shieldLevel - pendingRetaliation.damage);
    setShieldLevel(newShield);
    setLastAttacker(pendingRetaliation.attacker);
    setPendingRetaliation(null);

    if (newShield <= 0) {
      // Game Over!
      setTimeout(() => setPhase('gameover'), 500);
    } else {
      setSelectedCountry(null);
      if (nukedCountries.length >= countries.length) {
        setPhase('win');
      } else {
        setPhase('map');
      }
    }
  }, [pendingRetaliation, shieldLevel, nukedCountries]);

  const handleMuteToggle = () => {
    const newMuted = toggleMute();
    setMuted(newMuted);
  };

  const handleReset = () => {
    playClick();
    stopGeiger();
    stopAmbientDrone();
    setPhase('title');
    setSelectedCountry(null);
    setNukedCountries([]);
    setChaosLevel(0);
    setLastResult(null);
    setShieldLevel(100);
    setPendingRetaliation(null);
    setShieldBeforeHit(100);
    setLastAttacker(null);
  };

  return (
    <div className="scanlines">
      {phase === 'title' && <TitleScreen onStart={handleStart} />}

      {(phase === 'map' || phase === 'confirm') && (
        <>
          <HUD
            nukesLaunched={nukedCountries.length}
            chaosLevel={chaosLevel}
            nukedCountries={nukedCountries}
            shieldLevel={shieldLevel}
          />
          <WorldMap
            nukedCountries={nukedCountries}
            onSelectCountry={handleSelectCountry}
          />
        </>
      )}

      {phase === 'confirm' && selectedCountry && (
        <ConfirmModal
          country={selectedCountry}
          onConfirm={handleConfirmLaunch}
          onAbort={handleAbort}
        />
      )}

      {phase === 'launch' && selectedCountry && (
        <NukeAnimation
          targetName={selectedCountry.name}
          targetCenter={selectedCountry.center}
          nukedCountries={nukedCountries}
          onComplete={handleAnimationComplete}
        />
      )}

      {phase === 'aftermath' && lastResult && (
        <>
          <HUD
            nukesLaunched={nukedCountries.length}
            chaosLevel={chaosLevel}
            nukedCountries={nukedCountries}
            shieldLevel={shieldLevel}
          />
          <AftermathPanel
            country={lastResult.country}
            casualties={lastResult.casualties}
            damagePercent={lastResult.damagePercent}
            chaosLevel={chaosLevel}
            nukedCountries={nukedCountries}
            allCountries={countries}
            onContinue={handleContinue}
            hasRetaliation={!!pendingRetaliation}
          />
        </>
      )}

      {phase === 'retaliation' && pendingRetaliation && (
        <RetaliationWarning
          retaliation={pendingRetaliation}
          shieldBefore={shieldBeforeHit}
          shieldAfter={Math.max(0, shieldBeforeHit - pendingRetaliation.damage)}
          onComplete={handleRetaliationComplete}
        />
      )}

      {phase === 'gameover' && lastAttacker && (
        <GameOverScreen
          nukesLaunched={nukedCountries.length}
          lastAttacker={lastAttacker}
          onReset={handleReset}
        />
      )}

      {phase === 'win' && (
        <div className="win-screen">
          <div className="win-screen__icon">🌍💀</div>
          <h1 className="win-screen__title">TOTAL ANNIHILATION</h1>
          <p className="win-screen__subtitle">
            Congratulations, you destroyed every country. The world is a parking lot.
            <br />Are you proud of yourself?
            <br /><br />
            <span style={{ color: 'var(--accent-green)' }}>
              🛡️ Shields remaining: {shieldLevel}%
            </span>
          </p>
          <button
            id="reset-btn"
            className="win-screen__btn"
            onClick={handleReset}
          >
            ↻ Start Over
          </button>
        </div>
      )}

      {/* Mute Toggle */}
      <button
        id="mute-toggle-btn"
        className="mute-toggle"
        onClick={handleMuteToggle}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}

export default App;
