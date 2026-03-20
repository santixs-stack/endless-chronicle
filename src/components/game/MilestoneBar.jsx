import { useGame } from '../../hooks/useGameState.jsx';
import styles from './MilestoneBar.module.css';

export default function MilestoneBar() {
  const { state } = useGame();
  const goal = state.goal;
  const milestones = state.milestones || 0;
  const total = 5; // standard quest milestone count

  if (!goal) return null;

  const pct = Math.min(100, (milestones / total) * 100);

  return (
    <div className={styles.bar}>
      <div className={styles.header}>
        <span className={styles.icon}>{goal.icon}</span>
        <span className={styles.name}>{goal.name}</span>
        <span className={styles.fraction}>{milestones} / {total}</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`${styles.pip} ${i < milestones ? styles.pipDone : ''}`}
            style={{ left: `${((i + 1) / total) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
