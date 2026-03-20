import { useEffect, useRef } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import { parseAllTags } from '../../engine/tags.js';
import { PLAYER_COLORS } from '../../lib/constants.js';
import SceneRenderer from './SceneRenderer.jsx';
import styles from './StoryWindow.module.css';

function fmt(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="highlight">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p class="narratorPara">')
    .replace(/\n/g, '<br/>');
}

function cleanNarrative(text) {
  return text
    .replace(/^\s*[\]\[]+\s*/g, '')
    .replace(/\s*[\]\[]+\s*$/g, '')
    .trim();
}

export default function StoryWindow() {
  const { state } = useGame();
  const lastEntryRef = useRef(null);

  useEffect(() => {
    if (lastEntryRef.current) {
      lastEntryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [state.messages?.length]);

  // Build interleaved timeline from messages
  const timeline = [];
  const msgs = state.messages || [];

  // Find the opening AI response (first assistant message)
  const firstAssistant = msgs.find(m => m.role === 'assistant');
  if (firstAssistant) {
    const narrative = cleanNarrative(parseAllTags(firstAssistant.content).narrative);
    if (narrative) timeline.push({ type: 'narrator', text: narrative });
  }

  // All subsequent user+assistant pairs
  let playerIdx = 0;
  msgs.forEach((msg, i) => {
    // Skip the opening prompt (first user message)
    if (msg.role === 'user' && i === 0) return;
    // Skip any other user messages that are prompts
    if (msg.role === 'user' && (msg.content.startsWith('Quest:') || msg.content.startsWith('Party:'))) return;

    if (msg.role === 'user') {
      // Clean the player tag prefix e.g. "[Finn's turn]: "
      const clean = msg.content.replace(/^\[.+?'s turn\]:\s*/, '').trim();
      // Figure out which player index sent this (cycle through players)
      const pIdx = playerIdx % (state.playerCount || 1);
      timeline.push({ type: 'player', text: clean, playerIdx: pIdx });
      playerIdx++;
    } else if (msg.role === 'assistant') {
      // Skip the first assistant message (already added above)
      if (msg === firstAssistant) return;
      const narrative = cleanNarrative(parseAllTags(msg.content).narrative);
      if (narrative) timeline.push({ type: 'narrator', text: narrative });
    }
  });

  return (
    <div className={styles.outer}>
      <SceneRenderer scene={state.lastScene} turnCount={state.turnCount || 0} />

      <div className={styles.window}>
        {state.isLoading && (
          <div className={styles.loading}>
            <div className={styles.loadingDot} />
            <div className={styles.loadingDot} />
            <div className={styles.loadingDot} />
          </div>
        )}

        {timeline.map((item, i) => {
          const isLast = i === timeline.length - 1;
          const playerColor = PLAYER_COLORS[item.playerIdx || 0];
          const playerName = state.players?.[item.playerIdx || 0]?.name || 'Player';

          return (
            <div
              key={i}
              className={styles.entry}
              ref={isLast ? lastEntryRef : null}
            >
              {item.type === 'player' ? (
                <div className={styles.playerEntry} style={{ borderLeftColor: playerColor }}>
                  <div className={styles.playerHeader} style={{ color: playerColor }}>
                    <span className={styles.playerArrow}>▶</span>
                    <span className={styles.playerName}>{playerName}</span>
                  </div>
                  <div className={styles.playerText}>{item.text}</div>
                </div>
              ) : (
                <div className={styles.narratorBlock}>
                  <p
                    className={styles.narrator}
                    dangerouslySetInnerHTML={{ __html: fmt(item.text) }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
