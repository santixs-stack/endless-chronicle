// Full implementation in next session
// Placeholder routes to CharacterScreen
import { useGame } from '../../hooks/useGameState.jsx';
import { CHAR_PRESETS } from '../../data/presets.js';
import { PLAYER_COLORS, PLAYER_COLOR_NAMES } from '../../lib/constants.js';
import StepBar from '../ui/StepBar.jsx';
import styles from './PresetsScreen.module.css';

export default function PresetsScreen() {
  const { state, set } = useGame();
  const idx = state.setupIdx || 0;
  const color = PLAYER_COLORS[idx];

  function goCustom() {
    set({ screen: 'character' });
  }

  function selectPreset(preset) {
    set({ activePresetId: preset.id, _presetWorld: preset.world, screen: 'character' });
    // Pre-fill is handled in CharacterScreen
  }

  function goBack() {
    if (idx === 0) set({ screen: 'world' });
    else set({ setupIdx: idx - 1, screen: 'presets' });
  }

  return (
    <div className="screen">
      <div className={styles.header}>
        <StepBar currentScreen="presets" />
        {state.playerCount > 1 && (
          <div className={styles.playerIndicator}>
            <span className={styles.pip} style={{ background: color }} />
            <span>Player {idx + 1} of {state.playerCount}</span>
          </div>
        )}
        <h2 className={styles.title}>Step 2: Choose Your Character</h2>
        <p className={styles.sub}>
          Use a ready-made character, or{' '}
          <span className={styles.buildLink} onClick={goCustom}>build your own ✦</span>
        </p>
      </div>

      <div className={styles.grid}>
        {/* Custom — always first */}
        <div className={`${styles.card} ${styles.customCard}`} onClick={goCustom}>
          <span className={styles.icon}>✦</span>
          <div className={`${styles.name} ${styles.customName}`}>Build My Own</div>
          <div className={styles.tagline}>Start from scratch — name, class, backstory, all yours</div>
          <div className={styles.tags}><span className={`${styles.tag} ${styles.customTag}`}>custom</span></div>
        </div>

        {CHAR_PRESETS.map(p => (
          <div
            key={p.id}
            className={`${styles.card} ${state.activePresetId === p.id ? styles.selected : ''}`}
            onClick={() => selectPreset(p)}
          >
            <span className={styles.icon}>{p.icon}</span>
            <div className={styles.name}>{p.name}</div>
            <div className={styles.tagline}>{p.tagline}</div>
            <div className={styles.tags}>
              {p.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button className="btn-ghost" onClick={goBack}>← Back</button>
      </div>
    </div>
  );
}
