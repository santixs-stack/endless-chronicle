import { useGame } from '../../hooks/useGameState.jsx';
import { useSaveSlots } from '../../hooks/useSaveSlots.js';
import { PLAYER_COLORS } from '../../lib/constants.js';
import { showNotif } from '../ui/Notification.jsx';
import { SFX } from './SoundEngine.js';
import styles from './GameSidebar.module.css';

export default function GameSidebar({ open, onClose, onSave, onSettings, onJournal, onExport, onRecap, onCloud, onSearch, onCharSheet }) {
  const { state, set, reset } = useGame();
  const { saveToSlot, getAllSlots } = useSaveSlots();
  const curPlayerIdx = state.currentPlayerIdx || 0;
  const healthPct = state.stats?.health ?? 100;

  function quickSave() {
    if (onSave) { onSave(); return; }
    const slots = getAllSlots();
    const emptyIdx = slots.findIndex(s => !s);
    const idx = emptyIdx >= 0 ? emptyIdx : 0;
    const ok = saveToSlot(idx, state);
    showNotif(ok ? `Saved to Slot ${idx + 1}` : 'Save failed', ok ? 'success' : 'error');
    if (ok) SFX.save();
  }

  function confirmNew() {
    if (state.turnCount > 0 && !window.confirm('Start a new game? Save first if you want to keep this!')) return;
    reset(); set({ screen: 'title' });
  }

  return (
    <>
      {/* Mobile overlay backdrop */}
      {open && <div className={styles.backdrop} onClick={onClose} />}

      <div className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        <div className={styles.top}>
          <div className={styles.logo}>Chronicle</div>
          <div className={styles.goalBadge}>{state.goal?.name || '—'}</div>
          {onClose && <button className={styles.closeMobile} onClick={onClose}>✕</button>}
        </div>

        <div className={styles.body}>
          {/* Party */}
          <div className={styles.sectionTitle}>Party</div>
          {(state.players || []).map((p, i) => (
            <div key={i} className={`${styles.partyCard} ${i === curPlayerIdx ? styles.activeCard : ''}`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardDot} style={{ background: PLAYER_COLORS[i] }} />
                <span className={styles.cardName}>{p.name}</span>
                <span className={styles.cardClass}>{p.classIcon} {p.className}</span>
                <span className={styles.cardLevel}>Lv {p.level || 1}</span>
              </div>
              <div className={styles.hpRow}>
                <div className={styles.hpTrack}>
                  <div className={`${styles.hpFill} ${p.hp < p.maxHp * 0.3 ? styles.hpLow : ''}`}
                    style={{ width: `${Math.max(0, (p.hp / p.maxHp) * 100)}%` }} />
                </div>
                <span className={styles.hpVal}>{p.hp}/{p.maxHp}</span>
              </div>
            </div>
          ))}

          {/* Adventure health bar */}
          {state.mode === 'adventure' && (
            <>
              <div className={styles.sectionTitle} style={{ marginTop: '0.6rem' }}>Health</div>
              <div className={styles.statBarWrap}>
                <div className={styles.statBarHeader}>
                  <span className={styles.statLabel}>Party HP</span>
                  <span className={styles.statVal}>{healthPct}</span>
                </div>
                <div className={styles.statTrack}>
                  <div className={styles.statFill} style={{ width: `${healthPct}%`, background: healthPct < 30 ? '#e05555' : '#5595e0' }} />
                </div>
              </div>
            </>
          )}

          {/* Inventory */}
          <div className={styles.sectionTitle} style={{ marginTop: '0.6rem' }}>Inventory</div>
          <div className={styles.inventoryList}>
            {(state.sharedInventory || []).length === 0
              ? <span className={styles.empty}>Nothing yet…</span>
              : (state.sharedInventory || []).slice(0, 12).map((item, i) => (
                <div key={i} className={styles.inventoryItem}>{item}</div>
              ))
            }
          </div>

          {/* Journal preview */}
          {(state.journal || []).length > 0 && (
            <>
              <div className={styles.sectionTitle} style={{ marginTop: '0.6rem', cursor: 'pointer' }} onClick={onJournal}>
                Journal <span style={{ color: 'var(--accent)', fontSize: '0.6rem' }}>→ view all</span>
              </div>
              <div className={styles.journalList}>
                {(state.journal || []).slice(-3).map((entry, i) => (
                  <div key={i} className={styles.journalEntry}>· {entry}</div>
                ))}
              </div>
            </>
          )}

          {/* Gold */}
          {state.gold?.gold > 0 && (
            <>
              <div className={styles.sectionTitle} style={{ marginTop: '0.6rem' }}>Gold</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)' }}>
                ✦ {state.gold.gold}g
              </div>
            </>
          )}
        </div>

        <div className={styles.bottom}>
          <span className={`${styles.modeBadge} ${styles[state.mode]}`}>
            {state.mode === 'creative' ? 'Anything Goes' : 'Try Hard'}
          </span>
          <button className={styles.iconBtn} onClick={onSave}>💾 Save</button>
          <button className={styles.iconBtn} onClick={onCloud}>☁ Cloud Saves</button>
          <button className={styles.iconBtn} onClick={onCharSheet}>🧙 Character Sheet</button>
          <button className={styles.iconBtn} onClick={onJournal}>📖 Journal</button>
          <button className={styles.iconBtn} onClick={onSearch}>🔍 Search Story</button>
          <button className={styles.iconBtn} onClick={onRecap}>📺 Session Recap</button>
          <button className={styles.iconBtn} onClick={onExport}>📄 Export</button>
          <button className={styles.iconBtn} onClick={onSettings}>⚙ Settings</button>
          <button className={styles.iconBtn} onClick={confirmNew}>↩ New Game</button>
        </div>
      </div>
    </>
  );
}
