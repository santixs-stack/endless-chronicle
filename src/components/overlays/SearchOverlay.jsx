import { useState, useMemo, useRef, useEffect } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import { parseAllTags } from '../../engine/tags.js';
import styles from './SearchOverlay.module.css';

// ═══════════════════════════════════════════
//  STORY SEARCH OVERLAY
//  Full-text search across all turns.
//  Highlights matching terms.
//  Jump to turn in story.
// ═══════════════════════════════════════════

function highlight(text, query) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((p, i) =>
    p.toLowerCase() === query.toLowerCase()
      ? `<mark class="searchMark">${p}</mark>`
      : p
  ).join('');
}

export default function SearchOverlay({ onClose }) {
  const { state } = useGame();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Build searchable index from messages
  const index = useMemo(() => {
    const msgs = state.messages || [];
    const results = [];
    let turnNum = 0;
    let playerTurnNum = 0;

    msgs.forEach((msg, i) => {
      if (msg.role === 'user' && i === 0) return;
      if (msg.role === 'user' && (msg.content.startsWith('Quest:') || msg.content.startsWith('Party:'))) return;

      if (msg.role === 'user') {
        const clean = msg.content.replace(/^\[.+?'s turn\]:\s*/, '').trim();
        const pIdx = playerTurnNum % (state.playerCount || 1);
        const player = state.players?.[pIdx];
        results.push({
          type: 'player',
          turn: turnNum,
          text: clean,
          speaker: player?.name || `Player ${pIdx + 1}`,
          color: player?.color,
          msgIdx: i,
        });
        playerTurnNum++;
      } else {
        const narrative = parseAllTags(msg.content).narrative
          .replace(/^\s*[\]\[]+\s*/g, '').trim();
        if (narrative) {
          results.push({
            type: 'narrator',
            turn: turnNum,
            text: narrative,
            speaker: 'Narrator',
            msgIdx: i,
          });
          turnNum++;
        }
      }
    });

    return results;
  }, [state.messages, state.players, state.playerCount]);

  // Filter by query
  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    return index.filter(entry =>
      entry.text.toLowerCase().includes(q) ||
      entry.speaker.toLowerCase().includes(q)
    ).slice(0, 40);
  }, [index, query]);

  const hasQuery = query.trim().length >= 2;

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.title}>🔍 Search Story</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            placeholder="Search turns, actions, NPCs…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery('')}>✕</button>
          )}
        </div>

        <div className={styles.results}>
          {!hasQuery && (
            <div className={styles.empty}>
              <p>Type to search through {index.length} entries in this adventure.</p>
              <div className={styles.tips}>
                <span>Try: NPC names, locations, actions</span>
              </div>
            </div>
          )}

          {hasQuery && results.length === 0 && (
            <div className={styles.empty}>
              <p>No matches for <strong>"{query}"</strong></p>
            </div>
          )}

          {results.map((r, i) => (
            <div key={i} className={`${styles.result} ${r.type === 'player' ? styles.playerResult : styles.narratorResult}`}>
              <div className={styles.resultMeta}>
                <span
                  className={styles.resultSpeaker}
                  style={r.color ? { color: r.color } : undefined}
                >
                  {r.type === 'player' ? '▶' : '✦'} {r.speaker}
                </span>
                <span className={styles.resultTurn}>Turn {r.turn + 1}</span>
              </div>
              <p
                className={styles.resultText}
                dangerouslySetInnerHTML={{
                  __html: highlight(
                    r.text.length > 200 ? r.text.slice(0, 200) + '…' : r.text,
                    query
                  )
                }}
              />
            </div>
          ))}

          {results.length > 0 && (
            <div className={styles.countLine}>
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
