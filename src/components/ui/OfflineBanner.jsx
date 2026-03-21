import { useOnlineStatus } from '../../lib/recovery.jsx';
import styles from './OfflineBanner.module.css';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div className={styles.banner}>
      <span className={styles.icon}>📵</span>
      <span className={styles.text}>No internet — reconnect to continue the adventure</span>
    </div>
  );
}
