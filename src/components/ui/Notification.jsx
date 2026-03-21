import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Notification.module.css';
import { SFX } from '../game/SoundEngine.js';

let _show = null;
export function showNotif(message, type = 'info') {
  if (_show) _show(message, type);
  if (type === 'success') SFX.notifSuccess?.();
  else if (type === 'error') SFX.notifError?.();
}

export default function Notification() {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const timerRef = useRef(null);

  const show = useCallback((message, type) => {
    const item = { message, type, id: Date.now() + Math.random() };
    setQueue(q => [...q, item]);
  }, []);

  useEffect(() => { _show = show; return () => { _show = null; }; }, [show]);

  // Process queue
  useEffect(() => {
    if (current || queue.length === 0) return;
    const next = queue[0];
    setCurrent(next);
    setQueue(q => q.slice(1));
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCurrent(null), 2800);
  }, [queue, current]);

  if (!current) return null;

  const icons = { success: '✓', error: '✕', info: 'ℹ' };

  return (
    <div className={`${styles.notif} ${styles[current.type] || styles.info} ${styles.visible}`}>
      <span className={styles.icon}>{icons[current.type] || icons.info}</span>
      <span>{current.message}</span>
    </div>
  );
}
