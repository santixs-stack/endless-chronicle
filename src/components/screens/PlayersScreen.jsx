import { useState } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import StepBar from '../ui/StepBar.jsx';
import styles from './PlayersScreen.module.css';

const COUNTS = [
  { n: 1, label: 'Solo',  dots: '●' },
  { n: 2, label: 'Duo',   dots: '● ●' },
  { n: 3, label: 'Trio',  dots: '● ● ●' },
  { n: 4, label: 'Party', dots: '● ● ● ●' },
];

export default function PlayersScreen() {
  const { state, set } = useGame();
  const [count, setCount] = useState(state.playerCount || null);

  function confirm() {
    set({ playerCount: count, setupIdx: 0, players: [], screen: 'presets' });
  }

  return (
    <div className="screen">
      <StepBar currentScreen="players" />
      <div className={styles.title}>Step 1: How Many Players?</div>
      <p className={styles.sub}>Choose your party size. Each player creates their own character.</p>

      <div className={styles.grid}>
        {COUNTS.map(({ n, label, dots }) => (
          <button
            key={n}
            className={`${styles.card} ${count === n ? styles.selected : ''}`}
            onClick={() => setCount(n)}
          >
            <div className={styles.num}>{n}</div>
            <div className={styles.label}>{label}</div>
            <div className={styles.dots}>{dots}</div>
          </button>
        ))}
      </div>

      <div className={styles.actions}>
        <button className="btn-ghost" onClick={() => set({ screen: 'title' })}>← Back</button>
        <button className="btn-primary" disabled={!count} onClick={confirm}>
          Create Characters →
        </button>
      </div>
    </div>
  );
}
