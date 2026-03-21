import { Component } from 'react';
import styles from './ErrorBoundary.module.css';

// ═══════════════════════════════════════════
//  ERROR BOUNDARY
//  Catches React component crashes and shows
//  a recovery UI instead of a blank screen.
//  Works at both app level and game level.
// ═══════════════════════════════════════════

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null, recovered: false };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset() {
    this.setState({ error: null, errorInfo: null, recovered: true });
  }

  handleReload() {
    window.location.reload();
  }

  handleClearAndReload() {
    try { localStorage.clear(); } catch {}
    window.location.reload();
  }

  render() {
    if (!this.state.error) return this.props.children;

    const { level = 'app', onReset } = this.props;
    const isGameLevel = level === 'game';

    return (
      <div className={`${styles.boundary} ${isGameLevel ? styles.gameLevel : styles.appLevel}`}>
        <div className={styles.card}>
          <div className={styles.icon}>{isGameLevel ? '⚠' : '💥'}</div>
          <h2 className={styles.title}>
            {isGameLevel ? 'Something went wrong in the scene' : 'The Chronicle has stumbled'}
          </h2>
          <p className={styles.message}>
            {isGameLevel
              ? 'A rendering error occurred. Your progress is safe — try continuing the adventure.'
              : 'An unexpected error crashed the app. Your saves are stored locally.'}
          </p>

          {/* Error detail (collapsible) */}
          <details className={styles.detail}>
            <summary>Technical details</summary>
            <pre className={styles.errorText}>
              {this.state.error?.message || String(this.state.error)}
            </pre>
          </details>

          <div className={styles.actions}>
            {isGameLevel ? (
              <>
                <button
                  className={styles.primaryBtn}
                  onClick={() => {
                    this.handleReset();
                    if (onReset) onReset();
                  }}
                >
                  ↻ Try Again
                </button>
                <button className={styles.ghostBtn} onClick={this.handleReload.bind(this)}>
                  ⟳ Reload Page
                </button>
              </>
            ) : (
              <>
                <button className={styles.primaryBtn} onClick={this.handleReload.bind(this)}>
                  ⟳ Reload App
                </button>
                <button className={styles.ghostBtn} onClick={this.handleClearAndReload.bind(this)}>
                  🗑 Clear Data & Reload
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

// Convenience wrappers
export function AppErrorBoundary({ children }) {
  return <ErrorBoundary level="app">{children}</ErrorBoundary>;
}

export function GameErrorBoundary({ children, onReset }) {
  return (
    <ErrorBoundary level="game" onReset={onReset}>
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
