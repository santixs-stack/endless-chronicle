import { useGame } from '../../hooks/useGameState.jsx';
import { useSaveSlots } from '../../hooks/useSaveSlots.js';
import { PLAYER_COLORS } from '../../lib/constants.js';
import { showNotif } from '../ui/Notification.jsx';
import { SFX } from './SoundEngine.js';
import GameIcon from '../ui/GameIcon.jsx';
import styles from './GameSidebar.module.css';

export default function GameSidebar({ open, onClose, onSave, onSettings, onJournal, onExport, onRecap, onCloud, onSearch, onCharSheet, onDebug }) {
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
          <button className={styles.iconBtn} onClick={onSave}><GameIcon path="lorc/floppy-disk" size={14} tint="muted"/> Save</button>
          <button className={styles.iconBtn} onClick={onCloud}><GameIcon path="lorc/cloud-upload" size={14} tint="muted"/> Cloud Saves</button>
          <button className={styles.iconBtn} onClick={onCharSheet}><GameIcon path="lorc/character-sheet" size={14} tint="muted"/> Character Sheet</button>
          <button className={styles.iconBtn} onClick={onJournal}><GameIcon path="lorc/open-book" size={14} tint="muted"/> Journal</button>
          <button className={styles.iconBtn} onClick={onSearch}><GameIcon path="lorc/magnifying-glass" size={14} tint="muted"/> Search Story</button>
          <button className={styles.iconBtn} onClick={onRecap}><GameIcon path="lorc/film-strip" size={14} tint="muted"/> Session Recap</button>
          <button className={styles.iconBtn} onClick={onExport}><GameIcon path="lorc/paper-arrow" size={14} tint="muted"/> Export</button>
          <button className={styles.iconBtn} onClick={onSettings}><GameIcon path="lorc/cog" size={14} tint="muted"/> Settings</button>
          <button className={styles.iconBtn} onClick={onDebug} style={{ opacity: 0.5, fontSize: '0.75rem' }}><GameIcon path="lorc/bug" size={14} tint="muted"/> Debug Log</button>
          <button className={styles.iconBtn} onClick={confirmNew}><GameIcon path="lorc/clockwork" size={14} tint="muted"/> New Game</button>
        </div>
      </div>
    </>
  );
}
