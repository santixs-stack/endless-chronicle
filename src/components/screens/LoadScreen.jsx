import { useState, useEffect } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import { useSaveSlots } from '../../hooks/useSaveSlots.js';
import { supabase } from '../../lib/supabase.js';
import AuthOverlay from '../overlays/AuthOverlay.jsx';
import styles from './LoadScreen.module.css';

export default function LoadScreen() {
  const { set } = useGame();
  const { getAllSlots, deleteSlot, syncLocalToCloud } = useSaveSlots();
  const [slots, setSlots] = useState([null, null, null]);
  const [loading, setLoading] = useState(true);
  const [isCloud, setIsCloud] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    loadSlots();
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => setIsCloud(!!user));
    }
  }, []);

  async function loadSlots() {
    setLoading(true);
    const loaded = await getAllSlots();
    setSlots(loaded);
    setLoading(false);
  }

  async function load(data) {
    set({ ...data, isLoading: false, screen: 'game' });
  }

  async function handleDelete(i) {
    if (!window.confirm(`Delete Slot ${i + 1}?`)) return;
    await deleteSlot(i);
    loadSlots();
  }

  async function handleAuthSuccess() {
    setIsCloud(true);
    setShowAuth(false);
    await syncLocalToCloud();
    loadSlots();
  }

  const hasAnySave = slots.some(Boolean);

  if (showAuth) {
    return <AuthOverlay onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="screen">
      <h2 className={styles.title}>Load a Saved Game</h2>

      {/* Cloud status */}
      <div className={`${styles.cloudBar} ${isCloud ? styles.cloudOn : styles.cloudOff}`}>
        {isCloud ? (
          <><span className={styles.cloudDot}/> Cloud saves synced</>
        ) : (
          <>
            <span>Local saves only</span>
            {supabase && (
              <button className={styles.cloudBtn} onClick={() => setShowAuth(true)}>
                Sign in for cloud saves →
              </button>
            )}
          </>
        )}
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.dot}/><div className={styles.dot}/><div className={styles.dot}/>
        </div>
      ) : !hasAnySave ? (
        <div className={styles.empty}>No saves found. Start a new adventure!</div>
      ) : (
        <div className={styles.slots}>
          {slots.map((slot, i) => (
            <div key={i} className={`${styles.slot} ${!slot ? styles.slotEmpty : ''}`}>
              <div className={styles.slotInfo}>
                <div className={styles.slotNum}>Slot {i + 1}</div>
                {slot ? (
                  <>
                    <div className={styles.slotDetail}>
                      {slot.players?.map(p => `${p.name} (${p.className})`).join(' & ')}
                    </div>
                    <div className={styles.slotMeta}>
                      {slot.goal?.name} · Turn {slot.turnCount} · {new Date(slot.savedAt).toLocaleDateString()}
                    </div>
                  </>
                ) : (
                  <div className={styles.slotEmptyLabel}>Empty</div>
                )}
              </div>
              {slot && (
                <div className={styles.slotActions}>
                  <button className="btn-primary" onClick={() => load(slot)} style={{ fontSize: '.72rem', padding: '.4rem 1rem' }}>
                    Load
                  </button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(i)} title="Delete save">
                    🗑
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <button className="btn-ghost" style={{ marginTop: '1rem' }} onClick={() => set({ screen: 'title' })}>← Back</button>
    </div>
  );
}
