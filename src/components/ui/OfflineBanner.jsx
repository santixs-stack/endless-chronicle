import { useState, useEffect } from 'react';
import styles from './OfflineBanner.module.css';

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Set initial state inside effect to avoid SSR/init issues
    setIsOnline(navigator.onLine);
    const goOnline  = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online',  goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online',  goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className={styles.banner}>
      <span className={styles.icon}>📵</span>
      <span className={styles.text}>No internet — reconnect to continue the adventure</span>
    </div>
  );
}
