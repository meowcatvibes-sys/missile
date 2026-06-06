import { useEffect, useState } from 'react';

interface TitleScreenProps {
  onStart: () => void;
}

export default function TitleScreen({ onStart }: TitleScreenProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="title-screen scanlines">
      <div className="title-screen__grid" />

      <div className="title-screen__nuke-icon">☢️</div>

      <p className="title-screen__subtitle">⚠ Classification: Top Secret</p>

      <h1 className="title-screen__title">
        NUCLEAR<br />COMMAND
      </h1>

      <p className="title-screen__tagline">
        Select a country. Launch the nuke. Watch the world burn.
      </p>

      {ready && (
        <button
          id="launch-sequence-btn"
          className="title-screen__launch-btn"
          onClick={onStart}
        >
          🔑 Initiate Launch Sequence
        </button>
      )}

      <p className="title-screen__warning">
        ⚠ This is a satirical game. No actual countries were harmed in the making.
      </p>
    </div>
  );
}
