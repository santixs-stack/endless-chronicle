import { useGame } from '../../hooks/useGameState.jsx';
import { useSaveSlots } from '../../hooks/useSaveSlots.js';
import { showNotif } from '../ui/Notification.jsx';
import styles from './SaveDialog.module.css';

export default function SaveDialog({ onClose }) {
  const { state } = useGame();
  const { getAllSlots, saveToSlot } = useSaveSlots();
  const slots = getAllSlots();

  function save(idx) {
    const ok = saveToSlot(idx, state);
    showNotif(ok ? `Saved to Slot ${idx + 1}` : 'Save failed', ok ? 'success' : 'error');
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.title}>💾 Save Game</span>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>
        <div className={styles.slots}>
          {slots.map((slot, i) => (
            <button key={i} className={styles.slot} onClick={() => save(i)}>
              <span className={styles.slotNum}>Slot {i + 1}</span>
              <span className={styles.slotInfo}>
                {slot
                  ? `${slot.players?.map(p => p.name).join(' & ')} · Turn ${slot.turnCount} · ${new Date(slot.savedAt).toLocaleDateString()}`
                  : 'Empty — save here'}
              </span>
              <span className={styles.slotAction}>{slot ? 'Overwrite' : 'Save'}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
