import { useState } from 'react';
import { playTrack, stopMusic, setMusicVol, getMusicActive, TRACKS } from './MusicEngine.js';
import styles from './MusicPlayer.module.css';

export default function MusicPlayer() {
  const [active, setActive] = useState(null);
  const [open, setOpen] = useState(false);

  function handleTrack(id) {
    if (id === 'off') { stopMusic(); setActive(null); return; }
    playTrack(id);
    setActive(id);
  }

  function handleVol(v) { setMusicVol(parseFloat(v)); }

  if (!open) {
    return (
      <button className={styles.toggleBtn} onClick={() => setOpen(true)} title="Music">
        🎵 {active ? active : 'Music'}
      </button>
    );
  }

  return (
    <div className={styles.bar}>
      <span className={styles.label}>🎵</span>
      {Object.keys(TRACKS).map(id => (
        <button
          key={id}
          className={`${styles.btn} ${active === id ? styles.active : ''}`}
          onClick={() => handleTrack(id)}
        >
          {id.charAt(0).toUpperCase() + id.slice(1)}
        </button>
      ))}
      <button className={styles.btn} onClick={() => handleTrack('off')}>⏹</button>
      <input type="range" min="0" max="1" step="0.05" defaultValue="0.4"
        className={styles.vol} onChange={e => handleVol(e.target.value)} title="Volume" />
      <button className={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
    </div>
  );
}
