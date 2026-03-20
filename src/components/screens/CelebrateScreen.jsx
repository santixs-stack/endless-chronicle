import { useGame } from '../../hooks/useGameState.jsx';
import styles from './CelebrateScreen.module.css';

export default function CelebrateScreen() {
  const { state, reset } = useGame();

  const stats = [
    { num: state.turnCount, label: 'Turns Played' },
    { num: (state.bestiary || []).reduce((s, e) => s + (e.kills || 0), 0), label: 'Enemies Defeated' },
    { num: (state.journal || []).length, label: 'Journal Entries' },
  ];

  return (
    <div className={`screen ${styles.celebrate}`}>
      <div className={styles.emoji}>🏆</div>
      <h1 className={styles.title}>You Did It!</h1>
      <p className={styles.sub}>The adventure is complete.</p>
      <div className={styles.stats}>
        {stats.map(s => (
          <div key={s.label} className={styles.stat}>
            <div className={styles.statNum}>{s.num}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        <button className="btn-secondary" onClick={() => reset()}>Play Again!</button>
      </div>
    </div>
  );
}
