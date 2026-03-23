import React, { useEffect, useRef } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import { parseAllTags } from '../../engine/tags.js';
import { PLAYER_COLORS } from '../../lib/constants.js';
import { ARCHETYPE_ICONS } from '../../data/archetypes.js';
import SceneRenderer from './SceneRenderer.jsx';
import GameIcon from '../ui/GameIcon.jsx';
import styles from './StoryWindow.module.css';

// ── Text formatting ────────────────────────
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

// ── Creature type → icon path ──────────────
const CREATURE_ICONS = {
  goblin:       'lorc/crossed-swords',
  goblin_archer:'lorc/crossed-swords',
  orc:          'lorc/battle-gear',
  skeleton:     'lorc/crossed-swords',
  ghost:        'lorc/ghost',
  wraith:       'lorc/spectre',
  zombie:       'lorc/spectre',
  dragon:       'lorc/dragon-head',
  troll:        'lorc/battle-axe',
  demon:        'lorc/crowned-skull',
  vampire:      'lorc/ghost',
  wolf:         'lorc/wolf-head',
  spider:       'lorc/rock',
  alien_grey:   'lorc/alien-skull',
  robot_drone:  'lorc/android-mask',
  kraken:       'lorc/octoman',
  bandit:       'lorc/hood',
  thief:        'lorc/hood',
  assassin:     'lorc/hood',
  merchant:     'lorc/cauldron',
  mage_npc:     'lorc/wizard-staff',
  elder:        'lorc/open-book',
  knight:       'lorc/broadsword',
  guard:        'lorc/broadsword',
  rat:          'lorc/plain-dagger',
  bat:          'lorc/ghost',
};

const RELATIONSHIP_TINT = {
  enemy:   'red',
  hostile: 'red',
  friendly:'green',
  neutral: 'muted',
  ally:    'accent',
};

// ── NPC introduction card ──────────────────
function NpcCard({ npc }) {
  const icon = CREATURE_ICONS[npc.creatureType] || 'lorc/conversation';
  const tint = RELATIONSHIP_TINT[npc.relationship] || 'muted';
  const isEnemy = npc.relationship === 'enemy' || npc.relationship === 'hostile';

  return (
    <div className={`${styles.npcCard} ${isEnemy ? styles.npcEnemy : styles.npcFriendly}`}>
      <div className={styles.npcIcon}>
        <GameIcon path={icon} size={28} tint={tint} />
      </div>
      <div className={styles.npcInfo}>
        <span className={styles.npcName}>{npc.name}</span>
        <span className={styles.npcRole}>{npc.role}</span>
        {npc.note && <span className={styles.npcNote}>{npc.note}</span>}
      </div>
      <div className={styles.npcRelBadge} data-rel={npc.relationship}>
        {npc.relationship || 'unknown'}
      </div>
    </div>
  );
}

// ── Scene change card ──────────────────────
const SCENE_ICONS = {
  dungeon:  'lorc/crossed-swords',  cave:    'lorc/crystal-ball',
  forest:   'lorc/pine-tree',     plains:  'lorc/high-shot',
  castle:   'lorc/crown', ruins:   'lorc/crowned-skull',
  ocean:    'lorc/anchor',        space:   'lorc/alien-skull',
  village:  'lorc/open-book',     city:    'lorc/magnifying-glass',
  desert:   'lorc/plain-dagger',  mountain:'lorc/crossed-axes',
  swamp:    'lorc/cauldron',      snow:    'lorc/fluffy-trefoil',
  tavern:   'lorc/open-book',     road:    'lorc/plain-dagger',
  ship:     'lorc/anchor',
};

function SceneCard({ scene }) {
  if (!scene?.type) return null;
  const icon = SCENE_ICONS[scene.type] || 'lorc/magnifying-glass';
  const label = scene.type.charAt(0).toUpperCase() + scene.type.slice(1);
  const time = scene.time ? ` · ${scene.time}` : '';
  const weather = scene.weather && scene.weather !== 'clear' ? ` · ${scene.weather}` : '';

  return (
    <div className={styles.sceneCard}>
      <GameIcon path={icon} size={13} tint="dim" />
      <span className={styles.sceneLabel}>{label}{time}{weather}</span>
    </div>
  );
}

// ── Combat event card ──────────────────────
function CombatEvent({ event }) {
  if (event.type === 'damage') {
    const isCrit   = event.crit || event.roll === 20;
    const isFumble = event.roll === 1;
    const hpPct    = Math.max(0, (event.hpAfter / event.maxHp) * 100);

    return (
      <div className={`${styles.combatEvent} ${isCrit ? styles.critEvent : ''}`}>
        {isCrit   && <div className={styles.critBanner}>⚡ CRITICAL HIT!</div>}
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
              isCrit ? styles.nat20 : isFumble ? styles.nat1 : event.roll >= 15 ? styles.good : ''
            }`}>
              <GameIcon
                path="lorc/crenulated-shield"
                size={12}
                tint={isCrit ? 'gold' : isFumble ? 'red' : event.roll >= 15 ? 'green' : 'muted'}
              />
              {' '}{event.roll}
              {isCrit ? ' CRIT!' : isFumble ? ' FUMBLE' : ''}
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
            <span className={styles.diceResult}>
              <GameIcon path="lorc/crenulated-shield" size={12} tint="green" />
              {' '}{event.roll}
            </span>
          )}
        </div>
        <div className={styles.hpBarRow}>
          <div className={styles.hpBarTrack}>
            <div className={styles.hpBarFillHeal}
              style={{ width: `${(event.hpAfter / event.maxHp) * 100}%` }} />
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

// ── Thinking / in-turn loader ──────────────
// Shows animated icons while AI is generating a response mid-game
function ThinkingIndicator({ players }) {
  const icons = (players || []).map((p, i) => {
    const genreIconMap = ARCHETYPE_ICONS;
    // Try to get the player's archetype icon
    const role = p.class;
    // Find genre from player or default to fantasy
    const genre = 'fantasy';
    const iconPath = (genreIconMap[genre] || {})[role] || 'lorc/plain-dagger';
    return { icon: iconPath, color: PLAYER_COLORS[i] || '#c4a84f' };
  });

  return (
    <div className={styles.thinkingWrap}>
      <div className={styles.thinkingOrbit}>
        {/* Central d20 */}
        <div className={styles.thinkingCenter}>
          <GameIcon path="lorc/crenulated-shield" size={22} tint="accent" />
        </div>
        {/* Orbiting player icons */}
        {icons.slice(0, 4).map((p, i) => (
          <div
            key={i}
            className={styles.thinkingPlanet}
            style={{
              '--orbit-angle': `${i * (360 / Math.max(icons.length, 1))}deg`,
              '--orbit-delay': `${i * 0.4}s`,
            }}
          >
            <GameIcon path={p.icon} size={14} tint="muted" />
          </div>
        ))}
      </div>
      <span className={styles.thinkingLabel}>The GM is writing…</span>
    </div>
  );
}


// ── Turn handoff card ──────────────────────
// Shown between narrator blocks in multiplayer.
// Tells the next player it's their turn without
// the AI having to write it into the narrative.
function TurnHandoff({ playerName, playerColor, playerIcon }) {
  return (
    <div className={styles.turnHandoff} style={{ '--player-color': playerColor }}>
      <div className={styles.turnHandoffIcon}>
        <GameIcon path={playerIcon || 'lorc/plain-dagger'} size={14} tint="muted" />
      </div>
      <span className={styles.turnHandoffName} style={{ color: playerColor }}>
        {playerName}
      </span>
      <span className={styles.turnHandoffLabel}>— your turn</span>
    </div>
  );
}


// ── Roll Strip — full-width banner between player action and GM response ──
function RollStrip({ roll, playerColor }) {
  const [phase, setPhase] = React.useState('rolling'); // rolling → landing → settled

  React.useEffect(() => {
    const t1 = setTimeout(() => setPhase('landing'), 700);
    const t2 = setTimeout(() => setPhase('settled'), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const isCrit   = roll === 20;
  const isFumble = roll === 1;
  const isGreat  = roll >= 15;
  const isWeak   = roll <= 5;

  const outcome = isCrit ? 'NAT 20' : isFumble ? 'NAT 1' : isGreat ? 'SUCCESS' : isWeak ? 'MISS' : 'PARTIAL';
  const outcomeColor = isCrit ? '#f0c040' : isFumble ? '#e05555' : isGreat ? '#6dbb7c' : isWeak ? '#e09030' : '#9090b0';
  const bgColor = isCrit ? 'rgba(240,192,64,0.06)' : isFumble ? 'rgba(224,85,85,0.06)' : 'rgba(255,255,255,0.025)';

  return (
    <div className={`${styles.rollStrip} ${styles[`rollPhase_${phase}`]}`}
      style={{ borderColor: outcomeColor + '33', background: bgColor }}>

      {/* Animated d20 SVG */}
      <div className={`${styles.rollDiceWrap} ${styles[`diceAnim_${phase}`]}`}>
        <svg viewBox="0 0 60 60" width="48" height="48" className={styles.rollDiceSvg}>
          {/* d20 pentagon/icosahedron outline */}
          <polygon points="30,3 55,20 55,44 30,57 5,44 5,20"
            fill="none" stroke={outcomeColor} strokeWidth="1.5" opacity="0.6"/>
          <polygon points="30,3 55,20 30,25" fill={outcomeColor} opacity="0.08"/>
          <polygon points="30,3 5,20 30,25"  fill={outcomeColor} opacity="0.05"/>
          <polygon points="30,25 55,20 55,44 30,57 5,44 5,20"
            fill={outcomeColor} opacity="0.04"/>
          {/* Inner lines */}
          <line x1="30" y1="3"  x2="30" y2="25" stroke={outcomeColor} strokeWidth="0.8" opacity="0.3"/>
          <line x1="55" y1="20" x2="30" y2="25" stroke={outcomeColor} strokeWidth="0.8" opacity="0.3"/>
          <line x1="5"  y1="20" x2="30" y2="25" stroke={outcomeColor} strokeWidth="0.8" opacity="0.3"/>
          {/* Number */}
          {phase !== 'rolling' && (
            <text x="30" y="40" textAnchor="middle" dominantBaseline="middle"
              fill={outcomeColor} fontSize={roll >= 10 ? "15" : "17"} fontFamily="monospace" fontWeight="700"
              className={styles.rollNumberReveal}>
              {roll}
            </text>
          )}
        </svg>
      </div>

      {/* Roll info */}
      <div className={styles.rollInfo}>
        <span className={styles.rollDieLabel}>d20</span>
        {phase === 'settled' && (
          <span className={styles.rollOutcome} style={{ color: outcomeColor }}>
            {outcome}
          </span>
        )}
      </div>

      {/* Crit/fumble flavor text */}
      {phase === 'settled' && (isCrit || isFumble) && (
        <div className={styles.rollFlavor} style={{ color: outcomeColor }}>
          {isCrit ? '✦ Fortune favors the bold' : '✦ The dice are cruel tonight'}
        </div>
      )}
    </div>
  );
}

// ── Main StoryWindow ───────────────────────
export default function StoryWindow() {
  const { state } = useGame();
  const lastPlayerEntryRef = useRef(null);
  const windowRef = useRef(null);

  useEffect(() => {
    if (lastPlayerEntryRef.current) {
      lastPlayerEntryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [state.messages?.length]);

  // Build combat events map
  const combatByTurn = {};
  (state.combatLog || []).forEach(ev => {
    if (!combatByTurn[ev.turn]) combatByTurn[ev.turn] = [];
    combatByTurn[ev.turn].push(ev);
  });

  // Build NPC introduction map — which turn each NPC was introduced
  const npcByTurn = {};
  (state.npcs || []).forEach(npc => {
    const turn = npc.introTurn ?? 0;
    if (!npcByTurn[turn]) npcByTurn[turn] = [];
    // Avoid duplicates
    if (!npcByTurn[turn].find(n => n.name === npc.name)) {
      npcByTurn[turn].push(npc);
    }
  });

  // Build interleaved timeline
  const timeline = [];
  const msgs = state.messages || [];
  let assistantCount = 0;
  let playerTurnCount = 0;
  let lastScene = null;

  const firstAssistant = msgs.find(m => m.role === 'assistant');
  if (firstAssistant) {
    const parsed    = parseAllTags(firstAssistant.content);
    const narrative = cleanNarrative(parsed.narrative);
    if (parsed.scene) lastScene = parsed.scene;
    if (narrative) {
      if (parsed.scene) timeline.push({ type: 'scene', scene: parsed.scene });
      timeline.push({ type: 'narrator', text: narrative, turn: 0 });
      if (npcByTurn[0]?.length)   timeline.push({ type: 'npcs', npcs: npcByTurn[0], turn: 0 });
      if (combatByTurn[0]?.length) timeline.push({ type: 'combat', events: combatByTurn[0], turn: 0 });
    }
    assistantCount = 1;
  }

  msgs.forEach((msg, i) => {
    if (msg.role === 'user' && i === 0) return;
    if (msg.role === 'user' && (msg.content.startsWith('Quest:') || msg.content.startsWith('Party:'))) return;

    if (msg.role === 'user') {
      const clean = msg.content.replace(/^\[.+?'s turn\]:\s*/, '').trim();
      const pIdx  = playerTurnCount % (state.playerCount || 1);
      // Look ahead to next assistant message for roll result
      const nextMsg = msgs[i + 1];
      let rollResult = null;
      if (nextMsg?.role === 'assistant') {
        const nextParsed = parseAllTags(nextMsg.content);
        if (nextParsed.rolls?.length) {
          // e.g. 'd20=17' → extract number
          const m = nextParsed.rolls[0].match(/=(\d+)/);
          if (m) rollResult = parseInt(m[1]);
        }
        // Also check HPDELTA roll
        if (!rollResult && nextParsed.hpDeltas?.length) {
          rollResult = nextParsed.hpDeltas[0].roll || null;
        }
      }
      timeline.push({ type: 'player', text: clean, playerIdx: pIdx });
      if (rollResult != null) {
        timeline.push({ type: 'roll', roll: rollResult, playerIdx: pIdx });
      }
      playerTurnCount++;
    } else if (msg.role === 'assistant' && msg !== firstAssistant) {
      const parsed    = parseAllTags(msg.content);
      const narrative = cleanNarrative(parsed.narrative);
      if (narrative) {
        const turn = assistantCount;
        // Show scene card if scene changed
        if (parsed.scene && parsed.scene.type !== lastScene?.type) {
          timeline.push({ type: 'scene', scene: parsed.scene });
          lastScene = parsed.scene;
        }
        timeline.push({ type: 'narrator', text: narrative, turn });
        if (npcByTurn[turn]?.length)    timeline.push({ type: 'npcs', npcs: npcByTurn[turn], turn });
        if (combatByTurn[turn]?.length) timeline.push({ type: 'combat', events: combatByTurn[turn], turn });

        // In multiplayer: add a turn handoff card after each GM response
        // showing which player acts next — so the AI doesn't need to say it
        if ((state.playerCount || 1) > 1) {
          const nextPIdx = playerTurnCount % state.playerCount;
          const nextPlayer = state.players?.[nextPIdx];
          if (nextPlayer) {
            const genreIcons = ARCHETYPE_ICONS['fantasy'] || {};
            const nextIcon = genreIcons[nextPlayer.class] || 'lorc/plain-dagger';
            timeline.push({
              type: 'turnHandoff',
              playerName: nextPlayer.name,
              playerColor: nextPlayer.color || '#c4a84f',
              playerIcon: nextIcon,
            });
          }
        }

        assistantCount++;
      }
    }
  });

  // Mark last player entry for scroll
  let lastPlayerIdx = -1;
  timeline.forEach((item, i) => { if (item.type === 'player') lastPlayerIdx = i; });

  return (
    <div className={`${styles.outer} ${state.inCombat ? styles.combatMode : ''}`}>
      {state.lastScene && (
        <SceneRenderer
          scene={state.lastScene}
          players={state.players}
          turnCount={state.turnCount || 0}
          inCombat={state.inCombat || false}
          enemy={state.combatants?.find(c => c.relationship === 'enemy' || c.relationship === 'hostile')?.name || null}
          npcs={state.npcs || []}
        />
      )}

      {state.inCombat && (
        <div className={styles.combatBorderTop}>⚔ COMBAT ⚔</div>
      )}

      <div className={styles.window} ref={windowRef}>

        {/* Mid-game thinking indicator */}
        {state.isLoading && state.messages?.length > 0 && (
          <ThinkingIndicator players={state.players} />
        )}

        {timeline.map((item, i) => {
          const isLastPlayer  = i === lastPlayerIdx;
          const playerColor   = PLAYER_COLORS[item.playerIdx || 0];
          const player        = state.players?.[item.playerIdx || 0];
          const playerName    = player?.name || 'Player';

          // Use player's stored classIcon (already a game-icons path set during char creation)
          // Falls back to archetype lookup, then plain-dagger
          const genreIcons = ARCHETYPE_ICONS['fantasy'] || {};
          const playerIcon = (player?.classIcon && player.classIcon.includes('/'))
            ? player.classIcon
            : (genreIcons[player?.class] || 'lorc/plain-dagger');

          return (
            <div
              key={i}
              className={styles.entry}
              ref={isLastPlayer ? lastPlayerEntryRef : null}
            >
              {/* ── Player action ── */}
              {item.type === 'player' && (
                <div className={styles.playerEntry} style={{ borderLeftColor: playerColor }}>
                  <div className={styles.playerHeader} style={{ color: playerColor }}>
                    <div className={styles.playerIconWrap} style={{ borderColor: playerColor + '44' }}>
                      <GameIcon path={playerIcon} size={14} tint="muted" />
                    </div>
                    <span className={styles.playerName}>{playerName}</span>
                    <span className={styles.playerArrow}>▶</span>
                  </div>
                  <div className={styles.playerText}>{item.text}</div>
                </div>
              )}

              {/* ── Dice roll strip ── */}
              {item.type === 'roll' && (
                <RollStrip roll={item.roll} playerColor={PLAYER_COLORS[item.playerIdx || 0]} />
              )}

              {/* ── Narrator block ── */}
              {item.type === 'narrator' && (
                <div className={styles.narratorBlock}>
                  <p className={styles.narrator}
                    dangerouslySetInnerHTML={{ __html: fmt(item.text) }} />
                </div>
              )}

              {/* ── Scene change card ── */}
              {item.type === 'scene' && (
                <SceneCard scene={item.scene} />
              )}

              {/* ── Turn handoff card ── */}
              {item.type === 'turnHandoff' && (
                <TurnHandoff
                  playerName={item.playerName}
                  playerColor={item.playerColor}
                  playerIcon={item.playerIcon}
                />
              )}

              {/* ── NPC introduction cards ── */}
              {item.type === 'npcs' && (
                <div className={styles.npcGroup}>
                  {item.npcs.map((npc, j) => <NpcCard key={j} npc={npc} />)}
                </div>
              )}

              {/* ── Combat events ── */}
              {item.type === 'combat' && (
                <div className={styles.combatBlock}>
                  {item.events.map((ev, j) => <CombatEvent key={j} event={ev} />)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {state.inCombat && <div className={styles.combatBorderBottom} />}
    </div>
  );
}
