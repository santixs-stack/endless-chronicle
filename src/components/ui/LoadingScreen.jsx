import styles from './LoadingScreen.module.css';

// ═══════════════════════════════════════════
//  LOADING SCREEN
//  Shown during:
//  - Initial app boot
//  - Game start (generating opening scene)
//  - Save slot loading
//  - Any async operation > 300ms
// ═══════════════════════════════════════════

const TIPS = [
  'Your choices shape the story.',
  'Try anything — the GM adapts to everything.',
  'Dice rolls determine your fate.',
  'Talk to every NPC you meet.',
  'Journal entries unlock as you play.',
  'The hidden story arc is watching.',
  'Critical hits deal double damage.',
  'Your backstory matters to the world.',
  'Explore every corner of the scene.',
  'Work together — the party is stronger as one.',
];

export function LoadingScreen({ message = 'Loading…', showTip = true }) {
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)];

  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        {/* Animated logo */}
        <div className={styles.logo}>
          <span className={styles.logoText}>The Endless</span>
          <span className={styles.logoAccent}>Chronicle</span>
        </div>

        {/* Spinner */}
        <div className={styles.spinnerWrap}>
          <div className={styles.spinner} />
          <div className={styles.spinnerInner} />
        </div>

        {/* Message */}
        <p className={styles.message}>{message}</p>

        {/* Tip */}
        {showTip && (
          <p className={styles.tip}>
            <span className={styles.tipLabel}>✦ Tip: </span>
            {tip}
          </p>
        )}
      </div>
    </div>
  );
}

// Inline loading state for within-game operations
export function InlineLoader({ message = 'Thinking…' }) {
  return (
    <div className={styles.inline}>
      <div className={styles.inlineDot} />
      <div className={styles.inlineDot} />
      <div className={styles.inlineDot} />
      {message && <span className={styles.inlineMsg}>{message}</span>}
    </div>
  );
}

// Skeleton shimmer for loading content
export function SkeletonBlock({ lines = 3, width = '100%' }) {
  return (
    <div className={styles.skeleton} style={{ width }}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={styles.skeletonLine}
          style={{ width: i === lines - 1 ? '65%' : '100%', animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

export default LoadingScreen;
