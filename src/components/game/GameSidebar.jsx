import { useGame } from '../../hooks/useGameState.jsx';
import { useSaveSlots } from '../../hooks/useSaveSlots.js';
import { PLAYER_COLORS } from '../../lib/constants.js';
import { showNotif } from '../ui/Notification.jsx';
import styles from './GameSidebar.module.css';

export default function GameSidebar() {
  const { state, set, reset } = useGame();
  const { saveToSlot, getAllSlots } = useSaveSlots();

  function quickSave() {
    // Save to first available slot, or slot 0
    const slots = getAllSlots();
    const emptyIdx = slots.findIndex(s => !s);
    const idx = emptyIdx >= 0 ? emptyIdx : 0;
    const ok = saveToSlot(idx, state);
    showNotif(ok ? `Saved to Slot ${idx + 1}` : 'Save failed', ok ? 'success' : 'error');
  }

  function confirmNew() {
    if (state.turnCount > 0 && !window.confirm('Start a new game? Save first if you want to keep this one.')) return;
    reset();
    set({ screen: 'title' });
  }

  const curPlayerIdx = state.currentPlayerIdx || 0;
  const healthPct = state.stats?.health ?? 100;

  return (
    <div className={styles.sidebar}>
      <div className={styles.top}>
        <div className={styles.logo}>Chronicle</div>
        <div className={styles.goalBadge}>{state.goal?.name || '—'}</div>
      </div>

      <div className={styles.body}>
        {/* Party cards */}
        <div className={styles.sectionTitle}>Party</div>
        {(state.players || []).map((p, i) => (
          <div
            key={i}
            className={`${styles.partyCard} ${i === curPlayerIdx ? styles.activeCard : ''}`}
          >
            <div className={styles.cardHeader}>
              <span className={styles.cardDot} style={{ background: PLAYER_COLORS[i] }} />
              <span className={styles.cardName}>{p.name}</span>
              <span className={styles.cardClass}>{p.classIcon} {p.className}</span>
              <span className={styles.cardLevel}>Lv {p.level || 1}</span>
            </div>
            <div className={styles.hpRow}>
              <div className={styles.hpTrack}>
                <div
                  className={`${styles.hpFill} ${p.hp < p.maxHp * 0.3 ? styles.hpLow : ''}`}
                  style={{ width: `${Math.max(0, (p.hp / p.maxHp) * 100)}%` }}
                />
              </div>
              <span className={styles.hpVal}>{p.hp}/{p.maxHp}</span>
            </div>
          </div>
        ))}

        {/* Adventure mode health */}
        {(state.mode === 'adventure') && (
          <div className={styles.survivalSection}>
            <div className={styles.sectionTitle}>Health</div>
            <div className={styles.statBarWrap}>
              <div className={styles.statBarHeader}>
                <span className={styles.statLabel}>Party HP</span>
                <span className={styles.statVal}>{healthPct}</span>
              </div>
              <div className={styles.statTrack}>
                <div className={styles.statFill} style={{ width: `${healthPct}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Inventory */}
        <div className={styles.sectionTitle}>Inventory</div>
        <div className={styles.inventoryList}>
          {(state.sharedInventory || []).length === 0
            ? <span className={styles.empty}>Nothing yet…</span>
            : (state.sharedInventory || []).slice(0, 12).map((item, i) => (
              <div key={i} className={styles.inventoryItem}>{item}</div>
            ))
          }
        </div>

        {/* Journal */}
        {(state.journal || []).length > 0 && (
          <>
            <div className={styles.sectionTitle}>Journal</div>
            <div className={styles.journalList}>
              {(state.journal || []).slice(-4).map((entry, i) => (
                <div key={i} className={styles.journalEntry}>· {entry}</div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className={styles.bottom}>
        <span className={`${styles.modeBadge} ${styles[state.mode]}`}>
          {state.mode === 'creative' ? 'Anything Goes' : 'Try Hard'}
        </span>
        <button className={styles.iconBtn} onClick={quickSave}>💾 Save</button>
        <button className={styles.iconBtn} onClick={confirmNew}>↩ New Game</button>
      </div>
    </div>
  );
}
