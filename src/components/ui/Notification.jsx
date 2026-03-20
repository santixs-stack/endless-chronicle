import { useState, useEffect, useCallback } from 'react';
import styles from './Notification.module.css';

let _show = null;
export function showNotif(message, type = 'info') {
  if (_show) _show(message, type);
}

export default function Notification() {
  const [state, setState] = useState({ message: '', type: 'info', visible: false });
  const timerRef = { current: null };

  const show = useCallback((message, type) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState({ message, type, visible: true });
    timerRef.current = setTimeout(() => setState(s => ({ ...s, visible: false })), 3000);
  }, []);

  useEffect(() => { _show = show; return () => { _show = null; }; }, [show]);

  return (
    <div className={`${styles.notif} ${state.visible ? styles.visible : ''} ${styles[state.type] || ''}`}>
      {state.message}
    </div>
  );
}
