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

// ── Combat event card ──────────────────────
function CombatEvent({ event }) {
  if (event.type === 'damage') {
    const isCrit = event.crit || event.roll === 20;
    const isFumble = event.roll === 1;
    const hpPct = Math.max(0, (event.hpAfter / event.maxHp) * 100);

    return (
      <div className={`${styles.combatEvent} ${isCrit ? styles.critEvent : ''}`}>
        {isCrit && <div className={styles.critBanner}>⚡ CRITICAL HIT!</div>}
        {isFumble && <div className={styles.fumbleBanner}>💀 FUMBLE!</div>}
        <div className={styles.combatRow}>
          <span className={styles.combatIcon}>💔</span>
          <span className={styles.combatTarget}>{event.target}</span>
          <span className={styles.combatAction}>
            {event.weapon
              ? `takes ${event.amount} damage from ${event.weapon}`
              : `takes ${event.amount} damage`}
          </span>
          {event.roll != null && (
            <span className={`${styles.diceResult} ${
              isCrit ? styles.nat20 :
              isFumble ? styles.nat1 :
              event.roll >= 15 ? styles.good : ''
            }`}>
              🎲 {event.roll}
              {isCrit ? ' NAT 20!' : isFumble ? ' NAT 1' : ''}
            </span>
          )}
        </div>
        <div className={styles.hpBarRow}>
          <div className={styles.hpBarTrack}>
            <div
              className={`${styles.hpBarFill} ${hpPct < 30 ? styles.hpLow : ''}`}
              style={{ width: `${hpPct}%` }}
            />
          </div>
          <span className={styles.hpNumbers}>
            {event.hpBefore} → <strong>{event.hpAfter}</strong> / {event.maxHp}
          </span>
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
          {event.roll != null && (
            <span className={styles.diceResult}>🎲 {event.roll}</span>
          )}
        </div>
        <div className={styles.hpBarRow}>
          <div className={styles.hpBarTrack}>
            <div className={styles.hpBarFillHeal} style={{ width: `${(event.hpAfter / event.maxHp) * 100}%` }} />
          </div>
          <span className={styles.hpNumbers}>
            {event.hpBefore} → <strong>{event.hpAfter}</strong> / {event.maxHp}
          </span>
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
        {event.reason && <span className={styles.xpReason}>{event.reason}</span>}
      </div>
    );
  }

  return null;
}

export default function StoryWindow() {
  const { state } = useGame();
  // Ref for the player input entry — scroll here after each turn
  const lastPlayerEntryRef = useRef(null);
  const windowRef = useRef(null);

  // After each new message, scroll to the player's input (not the AI response)
  // so the user sees what they did first, then reads down
  useEffect(() => {
    if (lastPlayerEntryRef.current) {
      lastPlayerEntryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      timeline.push({ type: 'player', text: clean, playerIdx: pIdx, isLatest: false });
      playerTurnCount++;
    } else if (msg.role === 'assistant' && msg !== firstAssistant) {
      const narrative = cleanNarrative(parseAllTags(msg.content).narrative);
      if (narrative) {
        const turn = assistantCount;
        timeline.push({ type: 'narrator', text: narrative, turn });
        if (combatByTurn[turn]?.length) {
          timeline.push({ type: 'combat', events: combatByTurn[turn], turn });
        }
        assistantCount++;
      }
    }
  });

  // Mark the last player entry for scrolling
  let lastPlayerIdx = -1;
  timeline.forEach((item, i) => { if (item.type === 'player') lastPlayerIdx = i; });

  return (
    <div className={`${styles.outer} ${state.inCombat ? styles.combatMode : ''}`}>
      <SceneRenderer
        scene={state.lastScene}
        players={state.players}
        turnCount={state.turnCount || 0}
      />

      {/* Combat border indicator */}
      {state.inCombat && (
        <div className={styles.combatBorderTop}>
          ⚔ COMBAT ⚔
        </div>
      )}

      <div className={styles.window} ref={windowRef}>
        {state.isLoading && (
          <div className={styles.loading}>
            <div className={styles.loadingDot} />
            <div className={styles.loadingDot} />
            <div className={styles.loadingDot} />
          </div>
        )}

        {timeline.map((item, i) => {
          const isLastPlayer = i === lastPlayerIdx;
          const playerColor = PLAYER_COLORS[item.playerIdx || 0];
          const playerName = state.players?.[item.playerIdx || 0]?.name || 'Player';

          return (
            <div
              key={i}
              className={styles.entry}
              ref={isLastPlayer ? lastPlayerEntryRef : null}
            >
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

      {/* Bottom combat border */}
      {state.inCombat && <div className={styles.combatBorderBottom} />}
    </div>
  );
}
