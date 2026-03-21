import { useState, useEffect } from 'react';
import { playTrack, stopMusic, setMusicVol, getMusicActive, TRACKS } from './MusicEngine.js';
import styles from './MusicPlayer.module.css';

export default function MusicPlayer() {
  const [active, setActive] = useState(getMusicActive());
  const [open, setOpen] = useState(false);

  // Poll for auto-track changes every 500ms
  useEffect(() => {
    const t = setInterval(() => {
      const cur = getMusicActive();
      setActive(prev => prev !== cur ? cur : prev);
    }, 500);
    return () => clearInterval(t);
  }, []);

  function handleTrack(id) {
    if (id === 'off') {
      stopMusic();
      setActive(null);
      return;
    }
    playTrack(id);
    setActive(id);
  }

  const label = active ? (TRACKS[active]?.label || active) : 'Music off';

  if (!open) {
    return (
      <button
        className={`${styles.toggleBtn} ${active ? styles.toggleActive : ''}`}
        onClick={() => setOpen(true)}
        title="Music controls"
      >
        🎵 <span className={styles.trackLabel}>{label}</span>
        {active && <span className={styles.liveDot} />}
      </button>
    );
  }

  // Group tracks by category for display
  const groups = [
    { label: 'By Scene', ids: ['adventure_day','adventure_night','dungeon_day','dungeon_night','peaceful_day','peaceful_night','mystery_day','mystery_night','space'] },
    { label: 'By Mood',  ids: ['battle','tense','triumphant','sad','joyful'] },
  ];

  return (
    <div className={styles.bar}>
      <span className={styles.barLabel}>🎵</span>
      <div className={styles.groups}>
        {groups.map(g => (
          <div key={g.label} className={styles.group}>
            <span className={styles.groupLabel}>{g.label}</span>
            <div className={styles.trackRow}>
              {g.ids.map(id => (
                <button
                  key={id}
                  className={`${styles.btn} ${active === id ? styles.active : ''}`}
                  onClick={() => handleTrack(id)}
                  title={TRACKS[id]?.label}
                >
                  {TRACKS[id]?.label || id}
                  {active === id && <span className={styles.playingDot} />}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button className={`${styles.btn} ${!active ? styles.active : ''}`} onClick={() => handleTrack('off')}>
          ⏹ Off
        </button>
      </div>
      <div className={styles.right}>
        <div className={styles.volWrap}>
          <span className={styles.volLabel}>Vol</span>
          <input type="range" min="0" max="1" step="0.05" defaultValue="0.4"
            className={styles.vol} onChange={e => setMusicVol(parseFloat(e.target.value))} />
        </div>
        <button className={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
      </div>
    </div>
  );
}
