import { useState, useEffect } from 'react';
import { playTrack, stopMusic, setMusicVol, getMusicActive, getMusicVol } from './MusicEngine.js';
import styles from './MusicPlayer.module.css';

// ── Simple music control — on/off + volume only ──
// Track selection is fully automatic based on scene/mood.
// Users don't need to know what's playing — it just works.

export default function MusicPlayer() {
  const [active, setActive]   = useState(getMusicActive());
  const [vol, setVol]         = useState(getMusicVol());

  // Sync active state when engine auto-switches tracks
  useEffect(() => {
    const t = setInterval(() => {
      setActive(getMusicActive());
    }, 600);
    return () => clearInterval(t);
  }, []);

  function toggle() {
    if (active) {
      stopMusic();
      setActive(null);
    } else {
      // Resume — engine will pick the right track from scene state
      // If no scene yet, start with peaceful ambient
      playTrack('peaceful');
      setActive('peaceful');
    }
  }

  function handleVol(e) {
    const v = parseFloat(e.target.value);
    setVol(v);
    setMusicVol(v);
  }

  return (
    <div className={styles.wrap}>
      <button
        className={`${styles.btn} ${active ? styles.on : ''}`}
        onClick={toggle}
        title={active ? 'Music on — click to turn off' : 'Music off — click to turn on'}
      >
        <span className={styles.icon}>{active ? '♪' : '♪'}</span>
        <span className={styles.label}>{active ? 'ON' : 'OFF'}</span>
        {active && <span className={styles.dot} />}
      </button>
      <input
        type="range" min="0" max="1" step="0.05"
        value={vol}
        className={styles.vol}
        onChange={handleVol}
        title="Music volume"
      />
    </div>
  );
}
