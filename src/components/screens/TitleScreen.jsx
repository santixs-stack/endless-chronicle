import { useGame } from '../../hooks/useGameState.jsx';
import { useSaveSlots } from '../../hooks/useSaveSlots.js';
import styles from './TitleScreen.module.css';

const MODES = [
  {
    id: 'creative',
    icon: '✦',
    name: 'Anything Goes',
    desc: 'Magic, mayhem, no rules — do literally anything you imagine.',
    cls: styles.creative,
  },
  {
    id: 'adventure',
    icon: '⚡',
    name: 'Try Hard Mode',
    desc: 'Real danger! Watch your health. Choices have consequences.',
    cls: styles.adventure,
  },
];

export default function TitleScreen() {
  const { state, set } = useGame();
  const { getLatestSlot } = useSaveSlots();
  const { data: latestSave } = getLatestSlot();

  function selectMode(id) {
    set({ mode: id });
  }

  function begin() {
    set({ screen: 'players' });
  }

  function loadGame() {
    set({ screen: 'load' });
  }

  function quickContinue() {
    const { data } = getLatestSlot();
    if (!data) return;
    // Restore full state from save
    set({
      ...data,
      isLoading: false,
      screen: 'game',
    });
  }

  return (
    <div className={`screen ${styles.title}`}>
      <div className={styles.ornament}>A Text Adventure Without Limits</div>
      <h1 className={styles.heading}>The Endless<br />Chronicle</h1>
      <p className={styles.sub}>Your story. Your rules. Your world.</p>

      {latestSave && (
        <div className={styles.continueBanner}>
          <div className={styles.continueInfo}>
            <div className={styles.continueLabel}>Last Saved</div>
            <div className={styles.continueDetail}>
              {latestSave.players?.map(p => p.name).join(' & ')} · Turn {latestSave.turnCount}
            </div>
          </div>
          <button className={styles.continueBtn} onClick={quickContinue}>Continue →</button>
        </div>
      )}

      <div className={styles.modeGrid}>
        {MODES.map(m => (
          <button
            key={m.id}
            className={`${styles.modeCard} ${m.cls} ${state.mode === m.id ? styles.selected : ''}`}
            onClick={() => selectMode(m.id)}
          >
            <span className={styles.modeIcon}>{m.icon}</span>
            <div className={styles.modeName}>{m.name}</div>
            <div className={styles.modeDesc}>{m.desc}</div>
          </button>
        ))}
      </div>

      <div className={styles.btnRow}>
        <button className="btn-secondary" onClick={loadGame}>⏏ Load Game</button>
        <button className="btn-primary" disabled={!state.mode} onClick={begin}>
          Let's Go! →
        </button>
      </div>
    </div>
  );
}
