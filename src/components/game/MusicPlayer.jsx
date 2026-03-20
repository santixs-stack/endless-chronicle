import { useState, useEffect } from 'react';
import { playTrack, stopMusic, setMusicVol, getMusicActive, TRACKS } from './MusicEngine.js';
import styles from './MusicPlayer.module.css';

const TRACK_LABELS = {
  adventure: '⚔ Adventure',
  dungeon:   '💀 Dungeon',
  mystery:   '🔮 Mystery',
  battle:    '⚡ Battle',
  peaceful:  '🌿 Peaceful',
  space:     '🌌 Space',
};

export default function MusicPlayer() {
  const [active, setActive] = useState(getMusicActive());
  const [open, setOpen] = useState(false);

  // Poll for auto-track changes (scene transitions, combat)
  useEffect(() => {
    const interval = setInterval(() => {
      const current = getMusicActive();
      setActive(prev => prev !== current ? current : prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  function handleTrack(id) {
    if (id === 'off') { stopMusic(); setActive(null); return; }
    playTrack(id);
    setActive(id);
  }

  function handleVol(v) { setMusicVol(parseFloat(v)); }

  if (!open) {
    return (
      <button
        className={`${styles.toggleBtn} ${active ? styles.toggleActive : ''}`}
        onClick={() => setOpen(true)}
        title="Music controls"
      >
        🎵 {active ? TRACK_LABELS[active] || active : 'Music off'}
      </button>
    );
  }

  return (
    <div className={styles.bar}>
      <span className={styles.label}>🎵</span>
      <div className={styles.tracks}>
        {Object.keys(TRACKS).map(id => (
          <button
            key={id}
            className={`${styles.btn} ${active === id ? styles.active : ''}`}
            onClick={() => handleTrack(id)}
            title={TRACK_LABELS[id]}
          >
            {TRACK_LABELS[id]}
            {active === id && <span className={styles.playing}>▶</span>}
          </button>
        ))}
        <button className={`${styles.btn} ${!active ? styles.active : ''}`} onClick={() => handleTrack('off')}>
          ⏹ Off
        </button>
      </div>
      <div className={styles.volWrap}>
        <span className={styles.volLabel}>Vol</span>
        <input type="range" min="0" max="1" step="0.05" defaultValue="0.4"
          className={styles.vol} onChange={e => handleVol(e.target.value)} />
      </div>
      <button className={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
    </div>
  );
}
