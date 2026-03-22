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
    { label: 'Towns & Villages', ids: ['village_day','village_night'] },
    { label: 'Wilderness',       ids: ['forest_day','forest_night','plains_day','mountain','snow','swamp'] },
    { label: 'Water & Sky',      ids: ['ocean_day','ocean_night','space'] },
    { label: 'Dark Places',      ids: ['dungeon','cave','ruins','castle_day'] },
    { label: 'Exotic',           ids: ['desert'] },
    { label: 'Combat',           ids: ['battle','battle_boss'] },
    { label: 'Mood',             ids: ['tension','peaceful','mysterious','emotional','triumphant','npc_theme','rest'] },
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
