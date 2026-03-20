import styles from './StepBar.module.css';

const STEPS = [
  { label: 'Players',    screens: ['players'] },
  { label: 'Characters', screens: ['presets', 'character'] },
  { label: 'Quest',      screens: ['quest'] },
  { label: 'World',      screens: ['world'] },
];

export default function StepBar({ currentScreen }) {
  const activeIdx = STEPS.findIndex(s => s.screens.includes(currentScreen));

  return (
    <div className={styles.bar}>
      {STEPS.map((step, i) => {
        const isDone   = i < activeIdx;
        const isActive = i === activeIdx;
        return (
          <div key={step.label} className={styles.item}>
            <div className={styles.bubble}>
              <div className={`${styles.dot} ${isActive ? styles.active : ''} ${isDone ? styles.done : ''}`}>
                {isDone ? '✓' : i + 1}
              </div>
              <div className={`${styles.label} ${isActive ? styles.activeLabel : ''}`}>
                {step.label}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`${styles.line} ${isDone ? styles.lineDone : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
