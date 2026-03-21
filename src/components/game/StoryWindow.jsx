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

// ── Inline combat event card ────────────────
function CombatEvent({ event }) {
  if (event.type === 'damage') {
    const pct = Math.round((event.hpAfter / event.hpMax) * 100);
    return (
      <div className={styles.combatEvent}>
        <div className={styles.combatRow}>
          <span className={styles.combatIcon}>💔</span>
          <span className={styles.combatTarget}>{event.target}</span>
          <span className={styles.combatAction}>
            {event.weapon ? `takes ${event.amount} damage from ${event.weapon}` : `takes ${event.amount} damage`}
          </span>
          {event.roll && (
            <span className={`${styles.diceResult} ${event.roll === 20 ? styles.nat20 : event.roll === 1 ? styles.nat1 : event.roll >= 15 ? styles.good : ''}`}>
              🎲 {event.roll}{event.roll === 20 ? ' NAT 20!' : event.roll === 1 ? ' NAT 1' : ''}
            </span>
          )}
        </div>
        <div className={styles.hpBarRow}>
          <div className={styles.hpBarTrack}>
            <div
              className={`${styles.hpBarFill} ${event.hpAfter < event.maxHp * 0.3 ? styles.hpLow : ''}`}
              style={{ width: `${Math.max(0, (event.hpAfter / event.maxHp) * 100)}%` }}
            />
          </div>
          <span className={styles.hpNumbers}>{event.hpBefore} → {event.hpAfter} / {event.maxHp}</span>
        </div>
      </div>
    );
  }

  if (event.type === 'heal') {
    return (
      <div className={`${styles.combatEvent} ${styles.healEvent}`}>
        <div className={styles.combatRow}>
          <span className={styles.combatIcon}>💚</span>
          <span className={styles.combatTarget}>{event.target}</span>
          <span className={styles.combatAction}>heals {event.amount} HP</span>
          {event.roll && <span className={styles.diceResult}>🎲 {event.roll}</span>}
        </div>
        <div className={styles.hpBarRow}>
          <div className={styles.hpBarTrack}>
            <div className={styles.hpBarFillHeal} style={{ width: `${(event.hpAfter / event.maxHp) * 100}%` }} />
          </div>
          <span className={styles.hpNumbers}>{event.hpBefore} → {event.hpAfter} / {event.maxHp}</span>
        </div>
      </div>
    );
  }

  if (event.type === 'xp') {
    return (
      <div className={`${styles.combatEvent} ${styles.xpEvent}`}>
        <span className={styles.combatIcon}>⭐</span>
        <span className={styles.combatTarget}>{event.player}</span>
        <span className={styles.combatAction}>gained {event.amount} XP</span>
      </div>
    );
  }

  return null;
}

export default function StoryWindow() {
  const { state } = useGame();
  const lastEntryRef = useRef(null);

  useEffect(() => {
    if (lastEntryRef.current) {
      lastEntryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [state.messages?.length]);

  // Build combat events map: turn → events[]
  const combatByTurn = {};
  (state.combatLog || []).forEach(ev => {
    if (!combatByTurn[ev.turn]) combatByTurn[ev.turn] = [];
    combatByTurn[ev.turn].push(ev);
  });

  // Build interleaved timeline
  const timeline = [];
  const msgs = state.messages || [];
  let assistantCount = 0;
  let playerTurnCount = 0;

  const firstAssistant = msgs.find(m => m.role === 'assistant');
  if (firstAssistant) {
    const narrative = cleanNarrative(parseAllTags(firstAssistant.content).narrative);
    if (narrative) {
      timeline.push({ type: 'narrator', text: narrative, turn: 0 });
      // Combat events for turn 0
      if (combatByTurn[0]?.length) {
        timeline.push({ type: 'combat', events: combatByTurn[0], turn: 0 });
      }
    }
    assistantCount = 1;
  }

  msgs.forEach((msg, i) => {
    if (msg.role === 'user' && i === 0) return;
    if (msg.role === 'user' && (msg.content.startsWith('Quest:') || msg.content.startsWith('Party:'))) return;

    if (msg.role === 'user') {
      const clean = msg.content.replace(/^\[.+?'s turn\]:\s*/, '').trim();
      const pIdx = playerTurnCount % (state.playerCount || 1);
      timeline.push({ type: 'player', text: clean, playerIdx: pIdx });
      playerTurnCount++;
    } else if (msg.role === 'assistant' && msg !== firstAssistant) {
      const narrative = cleanNarrative(parseAllTags(msg.content).narrative);
      if (narrative) {
        const turn = assistantCount;
        timeline.push({ type: 'narrator', text: narrative, turn });
        // Attach combat events for this turn
        if (combatByTurn[turn]?.length) {
          timeline.push({ type: 'combat', events: combatByTurn[turn], turn });
        }
        assistantCount++;
      }
    }
  });

  return (
    <div className={styles.outer}>
      <SceneRenderer scene={state.lastScene} players={state.players} turnCount={state.turnCount || 0} />

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
            <div key={i} className={styles.entry} ref={isLast ? lastEntryRef : null}>
              {item.type === 'player' && (
                <div className={styles.playerEntry} style={{ borderLeftColor: playerColor }}>
                  <div className={styles.playerHeader} style={{ color: playerColor }}>
                    <span className={styles.playerArrow}>▶</span>
                    <span className={styles.playerName}>{playerName}</span>
                  </div>
                  <div className={styles.playerText}>{item.text}</div>
                </div>
              )}
              {item.type === 'narrator' && (
                <div className={styles.narratorBlock}>
                  <p className={styles.narrator} dangerouslySetInnerHTML={{ __html: fmt(item.text) }} />
                </div>
              )}
              {item.type === 'combat' && (
                <div className={styles.combatBlock}>
                  {item.events.map((ev, j) => <CombatEvent key={j} event={ev} />)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
