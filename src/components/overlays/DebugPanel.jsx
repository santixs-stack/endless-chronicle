import { useState, useEffect } from 'react';
import { getEntries, getErrors, buildDebugReport, clearLog, getSessionId } from '../../lib/debugLogger.js';
import styles from './DebugPanel.module.css';

// ═══════════════════════════════════════════
//  DEBUG PANEL
//  In-app error log viewer.
//  Access: Settings → Debug Log
//  or via keyboard shortcut: Ctrl+Shift+D
// ═══════════════════════════════════════════

const LEVEL_COLORS = {
  error: '#e05555',
  warn:  '#e09030',
  info:  '#5595e0',
  debug: '#666',
};

const CATEGORY_ICONS = {
  api:     '🌐',
  tags:    '🏷',
  combat:  '⚔',
  render:  '🖼',
  save:    '💾',
  audio:   '🎵',
  flow:    '🔀',
  general: '📋',
};

export default function DebugPanel({ onClose }) {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState('all'); // all | error | warn | info
  const [catFilter, setCatFilter] = useState('all');
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 2000);
    return () => clearInterval(t);
  }, []);

  function refresh() {
    setEntries([...getEntries()].reverse()); // newest first
  }

  function copyReport() {
    const report = buildDebugReport();
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback for browsers without clipboard API
      const ta = document.createElement('textarea');
      ta.value = report;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleClear() {
    clearLog();
    refresh();
  }

  const filtered = entries.filter(e => {
    if (filter !== 'all' && e.level !== filter) return false;
    if (catFilter !== 'all' && e.category !== catFilter) return false;
    return true;
  });

  const errorCount = entries.filter(e => e.level === 'error').length;
  const warnCount  = entries.filter(e => e.level === 'warn').length;
  const categories = [...new Set(entries.map(e => e.category))];

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.title}>🐛 Debug Log</span>
            <span className={styles.sessionId}>Session: {getSessionId()}</span>
          </div>
          <div className={styles.headerRight}>
            {errorCount > 0 && <span className={styles.badge} style={{ background: '#e05555' }}>{errorCount} error{errorCount !== 1 ? 's' : ''}</span>}
            {warnCount  > 0 && <span className={styles.badge} style={{ background: '#e09030' }}>{warnCount} warn{warnCount  !== 1 ? 's' : ''}</span>}
            <button className={styles.copyBtn} onClick={copyReport}>
              {copied ? '✓ Copied!' : '📋 Copy Report'}
            </button>
            <button className={styles.clearBtn} onClick={handleClear}>Clear</button>
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            {['all', 'error', 'warn', 'info', 'debug'].map(l => (
              <button
                key={l}
                className={`${styles.filterBtn} ${filter === l ? styles.filterActive : ''}`}
                style={filter === l && l !== 'all' ? { borderColor: LEVEL_COLORS[l], color: LEVEL_COLORS[l] } : undefined}
                onClick={() => setFilter(l)}
              >
                {l}
              </button>
            ))}
          </div>
          <div className={styles.filterGroup}>
            <button
              className={`${styles.filterBtn} ${catFilter === 'all' ? styles.filterActive : ''}`}
              onClick={() => setCatFilter('all')}
            >
              all categories
            </button>
            {categories.map(c => (
              <button
                key={c}
                className={`${styles.filterBtn} ${catFilter === c ? styles.filterActive : ''}`}
                onClick={() => setCatFilter(c)}
              >
                {CATEGORY_ICONS[c] || '📋'} {c}
              </button>
            ))}
          </div>
        </div>

        {/* Log entries */}
        <div className={styles.logList}>
          {filtered.length === 0 && (
            <div className={styles.empty}>
              {entries.length === 0 ? 'No log entries yet.' : 'No entries match the current filter.'}
            </div>
          )}

          {filtered.map((entry, i) => (
            <div
              key={entry.id}
              className={`${styles.entry} ${styles[`entry_${entry.level}`]}`}
              onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
            >
              <div className={styles.entryMain}>
                <span className={styles.entryLevel} style={{ color: LEVEL_COLORS[entry.level] }}>
                  {entry.level.toUpperCase()}
                </span>
                <span className={styles.entryCat}>
                  {CATEGORY_ICONS[entry.category] || '📋'} {entry.category}
                </span>
                <span className={styles.entryMsg}>{entry.message}</span>
                <span className={styles.entryMeta}>
                  T{entry.turn} · {entry.ts.slice(11, 19)}
                </span>
                {Object.keys(entry.data || {}).length > 0 && (
                  <span className={styles.expandHint}>{expanded === entry.id ? '▲' : '▼'}</span>
                )}
              </div>

              {expanded === entry.id && (
                <div className={styles.entryDetail}>
                  {Object.entries(entry.data || {}).map(([k, v]) => (
                    <div key={k} className={styles.detailRow}>
                      <span className={styles.detailKey}>{k}</span>
                      <span className={styles.detailVal}>
                        {typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v)}
                      </span>
                    </div>
                  ))}
                  {entry.stateSnap && (
                    <div className={styles.snapSection}>
                      <div className={styles.snapTitle}>Game State at Crash</div>
                      <pre className={styles.snapJson}>
                        {JSON.stringify(entry.stateSnap, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          {filtered.length} of {entries.length} entries
        </div>
      </div>
    </div>
  );
}
