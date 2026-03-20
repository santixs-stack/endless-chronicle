import { useEffect, useRef } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import { parseAllTags } from '../../engine/tags.js';
import SceneRenderer from './SceneRenderer.jsx';
import styles from './StoryWindow.module.css';

function fmt(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

export default function StoryWindow() {
  const { state } = useGame();
  const lastEntryRef = useRef(null);

  // Scroll new entry into view at top
  useEffect(() => {
    if (lastEntryRef.current) {
      lastEntryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [state.messages?.length]);

  // Extract narrator entries from messages
  const entries = (state.messages || [])
    .filter(m => m.role === 'assistant')
    .map(m => parseAllTags(m.content).narrative)
    .filter(Boolean);

  // Player entries (user turns)
  const playerTurns = (state.messages || [])
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .filter(m => !m.startsWith('Quest:') && !m.startsWith('Party:'));

  // Interleave: player action → narrator response
  const combined = [];
  playerTurns.forEach((action, i) => {
    // Skip the opening prompt
    if (i === 0 && entries.length > 0 && !entries[0]) return;
    const cleanAction = action.replace(/^\[.+?'s turn\]:\s*/, '');
    if (cleanAction && i > 0) {
      combined.push({ type: 'player', text: cleanAction, idx: i });
    }
    if (entries[i + 1]) {
      combined.push({ type: 'narrator', text: entries[i + 1], idx: i });
    }
  });

  return (
    <div className={styles.outer}>
      {/* Scene illustration — updates with each story beat */}
      <SceneRenderer scene={state.lastScene} turnCount={state.turnCount || 0} />

      <div className={styles.window}>
        {/* Loading shimmer */}
        {state.isLoading && (
          <div className={styles.loading}>
            <div className={styles.loadingDot} /><div className={styles.loadingDot} /><div className={styles.loadingDot} />
          </div>
        )}

      {/* Opening entry */}
      {entries[0] && (
        <div className={styles.entry}>
          <p className={styles.narrator} dangerouslySetInnerHTML={{ __html: fmt(entries[0]) }} />
        </div>
      )}

      {/* Interleaved entries */}
      {combined.map((item, i) => {
        const isLast = i === combined.length - 1;
        return (
          <div
            key={i}
            className={styles.entry}
            ref={isLast ? lastEntryRef : null}
          >
            {item.type === 'player' ? (
              <div className={styles.playerEntry}>
                <span className={styles.playerArrow}>▶</span>
                <span className={styles.playerText}>{item.text}</span>
              </div>
            ) : (
              <p className={styles.narrator} dangerouslySetInnerHTML={{ __html: fmt(item.text) }} />
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
}
