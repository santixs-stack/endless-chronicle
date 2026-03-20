import { useGame } from '../../hooks/useGameState.js';
import { useSaveSlots } from '../../hooks/useSaveSlots.js';
import styles from './LoadScreen.module.css';

export default function LoadScreen() {
  const { set } = useGame();
  const { getAllSlots } = useSaveSlots();
  const slots = getAllSlots();

  function load(data) {
    set({ ...data, isLoading: false, screen: 'game' });
  }

  return (
    <div className="screen">
      <h2 className={styles.title}>Load a Saved Game</h2>
      <p className={styles.sub}>Choose a save slot to resume your adventure.</p>
      <div className={styles.slots}>
        {slots.map((slot, i) => (
          <div key={i} className={styles.slot}>
            <div className={styles.slotInfo}>
              <div className={styles.slotNum}>Slot {i + 1}</div>
              {slot
                ? <div className={styles.slotDetail}>{slot.players?.map(p => p.name).join(' & ')} · Turn {slot.turnCount} · {new Date(slot.savedAt).toLocaleDateString()}</div>
                : <div className={styles.slotEmpty}>Empty</div>
              }
            </div>
            {slot && <button className="btn-primary" onClick={() => load(slot)} style={{fontSize:'.72rem',padding:'.4rem 1rem'}}>Load</button>}
          </div>
        ))}
      </div>
      <button className="btn-ghost" onClick={() => set({ screen: 'title' })}>← Back</button>
    </div>
  );
}
