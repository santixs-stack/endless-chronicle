import { useGame } from '../../hooks/useGameState.jsx';
import { RL_LABELS } from '../../data/readingLevels.js';
import { stopMusic, setMusicVol } from '../game/MusicEngine.js';
import styles from './SettingsOverlay.module.css';

const LEVELS = ['4th', '8th', '12th', 'college'];

export default function SettingsOverlay({ onClose }) {
  const { state, set, reset } = useGame();

  function setRL(level) {
    set({ readingLevel: level });
  }

  function confirmNew() {
    if (state.turnCount > 0 && !window.confirm('Start a new game? Make sure to save first!')) return;
    stopMusic();
    reset();
    set({ screen: 'title' });
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.title}>⚙ Settings</span>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        {/* Reading level */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Reading Level</div>
          <div className={styles.rlGrid}>
            {LEVELS.map(lvl => (
              <button
                key={lvl}
                className={`${styles.rlBtn} ${state.readingLevel === lvl ? styles.rlActive : ''}`}
                onClick={() => setRL(lvl)}
              >
                <div className={styles.rlLabel}>{RL_LABELS[lvl].split(' ')[0]}</div>
                <div className={styles.rlSub}>{RL_LABELS[lvl].split('(')[1]?.replace(')', '') || ''}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Music volume */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Music Volume</div>
          <input
            type="range" min="0" max="1" step="0.05"
            defaultValue="0.4"
            className={styles.slider}
            onChange={e => setMusicVol(parseFloat(e.target.value))}
          />
        </div>

        {/* New game */}
        {state.mode && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Game</div>
            <button className={styles.dangerBtn} onClick={confirmNew}>
              ↩ Start New Game
            </button>
          </div>
        )}

        {/* Attribution */}
        <div className={styles.attribution}>
          Game icons by <a href="https://game-icons.net" target="_blank" rel="noreferrer" className={styles.attrLink}>game-icons.net</a> (CC BY 3.0)
        </div>
      </div>
    </div>
  );
}
