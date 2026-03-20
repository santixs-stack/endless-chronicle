import { useState, useEffect } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import { useSaveSlots } from '../../hooks/useSaveSlots.js';
import { supabase } from '../../lib/supabase.js';
import { showNotif } from '../ui/Notification.jsx';
import AuthOverlay from './AuthOverlay.jsx';
import styles from './SaveDialog.module.css';

export default function SaveDialog({ onClose }) {
  const { state } = useGame();
  const { saveToSlot, getAllSlots } = useSaveSlots();
  const [slots, setSlots] = useState([null, null, null]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [isCloud, setIsCloud] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const loaded = await getAllSlots();
      setSlots(loaded);
      setLoading(false);
    }
    load();

    // Check if user is signed in
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => setIsCloud(!!user));
    }
  }, []);

  async function save(idx) {
    setSaving(idx);
    const ok = await saveToSlot(idx, state);
    showNotif(ok ? `Saved to Slot ${idx + 1} ${isCloud ? '☁' : ''}` : 'Save failed', ok ? 'success' : 'error');
    // Refresh slots
    const loaded = await getAllSlots();
    setSlots(loaded);
    setSaving(null);
    onClose();
  }

  if (showAuth) {
    return <AuthOverlay
      onClose={() => setShowAuth(false)}
      onSuccess={() => { setIsCloud(true); setShowAuth(false); }}
    />;
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.title}>💾 Save Game</span>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        {/* Cloud status bar */}
        <div className={`${styles.cloudBar} ${isCloud ? styles.cloudOn : styles.cloudOff}`}>
          {isCloud ? (
            <>
              <span className={styles.cloudDot} />
              <span>Cloud saves on — syncs across devices</span>
            </>
          ) : (
            <>
              <span>💾 Saving locally only</span>
              {supabase && (
                <button className={styles.cloudBtn} onClick={() => setShowAuth(true)}>
                  Sign in for cloud saves →
                </button>
              )}
            </>
          )}
        </div>

        {loading ? (
          <div className={styles.loadingRow}>
            <div className={styles.dot}/><div className={styles.dot}/><div className={styles.dot}/>
          </div>
        ) : (
          <div className={styles.slots}>
            {slots.map((slot, i) => (
              <button
                key={i}
                className={styles.slot}
                onClick={() => save(i)}
                disabled={saving !== null}
              >
                <span className={styles.slotNum}>Slot {i + 1}</span>
                <span className={styles.slotInfo}>
                  {slot
                    ? `${slot.players?.map(p => p.name).join(' & ')} · Turn ${slot.turnCount} · ${new Date(slot.savedAt).toLocaleDateString()}`
                    : 'Empty — save here'}
                </span>
                <span className={styles.slotAction}>
                  {saving === i ? '…' : slot ? 'Overwrite' : 'Save'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
