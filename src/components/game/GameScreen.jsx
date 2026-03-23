import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import { useSaveSlots } from '../../hooks/useSaveSlots.js';
import { callAPI, trimMessagesForContext, getContextStatus } from '../../engine/api.js';
import { classifyError, withRetry } from '../../lib/recovery.jsx';
import { logApiError, logFlow, logCombatEvent, updateStateSnapshot, logError } from '../../lib/debugLogger.js';
import { buildSystemPrompt } from '../../engine/systemPrompt.js';
import { parseAllTags } from '../../engine/tags.js';
import { pickHiddenArc } from '../../data/hiddenArcs.js';
import {
  autoTrackFromScene, startCombatMusic, endCombatMusic,
  playVictoryMusic, playNpcMusic, playDiscoveryStinger,
  playEmotionalMusic, playRestMusic, playTensionMusic,
} from './MusicEngine.js';
import { SFX, initAudio } from './SoundEngine.js';
import GameIcon from '../ui/GameIcon.jsx';
import { showNotif } from '../ui/Notification.jsx';
import GameSidebar from './GameSidebar.jsx';
import StoryWindow from './StoryWindow.jsx';
import InputArea from './InputArea.jsx';
import MilestoneBar from './MilestoneBar.jsx';
import MusicPlayer from './MusicPlayer.jsx';
import CombatBanner from './CombatBanner.jsx';
import SaveDialog from '../overlays/SaveDialog.jsx';
import SettingsOverlay from '../overlays/SettingsOverlay.jsx';
import JournalOverlay from '../overlays/JournalOverlay.jsx';
import ExportOverlay from '../overlays/ExportOverlay.jsx';
import SessionRecap from '../overlays/SessionRecap.jsx';
import AuthOverlay from '../overlays/AuthOverlay.jsx';
import SearchOverlay from '../overlays/SearchOverlay.jsx';
import CharacterSheetOverlay from '../overlays/CharacterSheetOverlay.jsx';
import DebugPanel from '../overlays/DebugPanel.jsx';
import styles from './GameScreen.module.css';

// XP thresholds for level up
const XP_LEVELS = [0, 100, 250, 450, 700, 1000];


// ── "GM is crafting the world" screen ─────
// Shown before the very first AI response.
// Animated icon constellation around the title.
const CRAFT_ICONS = [
  'lorc/crystal-ball', 'lorc/open-book', 'lorc/crown',
  'lorc/plain-dagger', 'delapouite/caduceus', 'lorc/anchor',
  'lorc/wizard-staff', 'lorc/ghost', 'lorc/wolf-howl',
  'lorc/crenulated-shield', 'lorc/crossed-axes', 'lorc/fairy-wand',
];

const CRAFT_MESSAGES = [
  'The GM is weaving your world…',
  'Preparing your adventure…',
  'Setting the scene…',
  'Summoning the chronicle…',
  'The story is awakening…',
];

function WorldCraftingScreen({ players }) {
  const [msgIdx, setMsgIdx] = React.useState(0);

  React.useEffect(() => {
    // Play the world-crafting SFX on mount
    SFX.worldCraft?.();
    const t = setInterval(() => {
      setMsgIdx(i => (i + 1) % CRAFT_MESSAGES.length);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  // Build ring of icons — mix genre-specific player icons with world icons
  const ringIcons = [...CRAFT_ICONS];
  (players || []).forEach((p, i) => {
    // inject player class icon into the ring
  });

  return (
    <div className={styles.worldCraftOverlay}>
      <div className={styles.worldCraftInner}>

        {/* Rotating icon ring */}
        <div className={styles.worldCraftRing}>
          {ringIcons.slice(0, 8).map((icon, i) => (
            <div
              key={i}
              className={styles.worldCraftOrbitIcon}
              style={{
                '--angle': `${i * 45}deg`,
                '--delay': `${i * 0.18}s`,
              }}
            >
              <GameIcon path={icon} size={18} tint="dim" />
            </div>
          ))}

          {/* Inner ring — rotates opposite */}
          {ringIcons.slice(8, 12).map((icon, i) => (
            <div
              key={i + 8}
              className={styles.worldCraftInnerOrbit}
              style={{
                '--angle': `${i * 90 + 22}deg`,
                '--delay': `${i * 0.25 + 0.1}s`,
              }}
            >
              <GameIcon path={icon} size={13} tint="dim" />
            </div>
          ))}

          {/* Center */}
          <div className={styles.worldCraftCenter}>
            <div className={styles.worldCraftPulse} />
            <GameIcon path="lorc/crenulated-shield" size={32} tint="accent" />
          </div>
        </div>

        {/* Title */}
        <div className={styles.worldCraftTitle}>The Endless</div>
        <div className={styles.worldCraftTitleAccent}>Chronicle</div>

        {/* Animated message */}
        <p className={styles.worldCraftMsg} key={msgIdx}>
          {CRAFT_MESSAGES[msgIdx]}
        </p>

        {/* Player silhouettes if available */}
        {players?.length > 0 && (
          <div className={styles.worldCraftParty}>
            {players.map((p, i) => (
              <div
                key={i}
                className={styles.worldCraftPlayer}
                style={{ '--player-color': p.color || '#c4a84f' }}
                title={p.name}
              >
                <span className={styles.worldCraftPlayerName}>{p.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GameScreen() {
  const { state, set, addJournal, addNpc, addCodex, updateGold, addCombatEvent, setPlayer } = useGame();
  const { saveToSlot } = useSaveSlots();
  const hasOpened = useRef(false);
  const lastAutoSave = useRef(0);

  const [showSave,     setShowSave]     = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showJournal,  setShowJournal]  = useState(false);
  const [showExport,   setShowExport]   = useState(false);
  const [showRecap,    setShowRecap]    = useState(false);
  const [showCloud,    setShowCloud]    = useState(false);
  const [showSearch,   setShowSearch]   = useState(false);
  const [showCharSheet,setShowCharSheet]= useState(false);
  const [showDebug,    setShowDebug]    = useState(false);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [apiError,     setApiError]     = useState(null); // {title, message, retryable}

  // ── Auto-save every 5 turns to slot 0 ──
  // ── Update debug snapshot on every state change ──
  useEffect(() => {
    updateStateSnapshot(state);
  }, [state.turnCount, state.screen, state.inCombat, state.isLoading]);

  // ── Thinking tick while AI is generating ──
  useEffect(() => {
    if (!state.isLoading) return;
    const t = setInterval(() => SFX.thinkingTick(), 1800);
    return () => clearInterval(t);
  }, [state.isLoading]);
  useEffect(() => {
    function onKey(e) {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setShowDebug(d => !d);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!state.messages?.length || state.screen !== 'game') return;
    const now = state.turnCount || 0;
    if (now > 0 && now % 5 === 0 && now !== lastAutoSave.current) {
      lastAutoSave.current = now;
      const ok = saveToSlot(0, state);
      if (ok) showNotif('Auto-saved ✓', 'success');
    }
  }, [state.turnCount]);

  // ── Opening scene ──
  useEffect(() => {
    if (hasOpened.current || !state.players?.length) return;
    if (state.messages?.length > 0) return;
    hasOpened.current = true;
    const arc = pickHiddenArc();
    // Seed shared inventory from all players' starting gear (deduplicated)
    const seedInventory = [
      ...new Set(
        (state.players || []).flatMap(p => p.startingGear || [])
      )
    ];
    set({ hiddenArc: arc, sharedInventory: seedInventory });
    const g = state.goal;
    const goalCtx = g ? `Quest: "${g.name}". Hook: ${g.start || g.hint}` : 'Begin the story.';
    const world = state.world;
    const worldCtx = world ? `World: ${world.world}. Starting location: ${world.location}. Tone: ${world.tone}.` : '';
    const partyLines = state.players.map(p =>
      `- ${p.name} (${p.className}): ${p.role || p.trait || p.backstory || ''}`
    ).join('\n');

    const prompt = `${goalCtx}

${worldCtx}

Party members:
${partyLines}

Write a rich OPENING SCENE for this adventure. Structure it in three clear beats:

1. ATMOSPHERE (2-3 sentences): Paint the setting with sensory detail — sights, sounds, smells. Make the world feel real and specific. Reference the location and tone.

2. PARTY INTRODUCTION (1-2 sentences per character): Briefly establish each character in this world — what they look like here, what they're doing, why they're here. Ground each character in the scene.

3. THE HOOK (2-3 sentences): Something is happening RIGHT NOW that demands attention. Create immediate dramatic tension that ties directly to the quest. End by asking ${state.players[0]?.name || 'the first player'} what they do.

Keep the total to 3-4 short paragraphs. No exposition dumps — show don't tell. Make it vivid and immediate.

Include [SCENE:...] and [ACTIONS:...] tags.`;
    const msgs = [{ role: 'user', content: prompt }];
    set({ isLoading: true });
    setApiError(null);
    const sysPrompt = buildSystemPrompt({ ...state, hiddenArc: arc });
    withRetry(() => callAPI(msgs, sysPrompt), 2)
      .then(text => {
        const parsed = parseAllTags(text);
        set({ messages: [...msgs, { role: 'assistant', content: text }], isLoading: false, lastScene: parsed.scene || null, currentActions: parsed.actions || [] });
        // Music handled in main handler below to respect combat/mood priority
      })
      .catch(err => {
        const classified = classifyError(err);
        logApiError(err, { msgCount: msgs.length, sysPromptLen: sysPrompt.length });
        setApiError(classified);
        set({ isLoading: false });
      });
  }, []);

  // ── Process XP awards and level ups ──
  function processXP(xpAwards) {
    if (!xpAwards?.length) return;
    xpAwards.forEach(award => {
      const pi = state.players.findIndex(
        p => p.name.toLowerCase() === (award.player || '').toLowerCase()
      );
      const target = pi >= 0 ? pi : 0; // default to first player
      const player = state.players[target];
      if (!player) return;

      const newXP = (player.xp || 0) + (award.amount || 10);
      const oldLevel = player.level || 1;
      const newLevel = XP_LEVELS.findIndex(t => t > newXP);
      const actualLevel = newLevel === -1 ? XP_LEVELS.length : newLevel;

      if (actualLevel > oldLevel) {
        // Apply stat bumps for each level gained
        const bumps = LEVEL_STAT_BUMPS[player.class || 'warrior'] || {};
        const levelsGained = actualLevel - oldLevel;
        const statUpdates = {
          xp: newXP,
          level: actualLevel,
          str: (player.str || 10) + (bumps.str || 0) * levelsGained,
          dex: (player.dex || 10) + (bumps.dex || 0) * levelsGained,
          int: (player.int || 10) + (bumps.int || 0) * levelsGained,
          wis: (player.wis || 10) + (bumps.wis || 0) * levelsGained,
          con: (player.con || 10) + (bumps.con || 0) * levelsGained,
          hp: Math.min((player.hp || player.maxHp), (player.maxHp || 10) + (bumps.hp || 0) * levelsGained),
          maxHp: (player.maxHp || 10) + (bumps.hp || 0) * levelsGained,
        };
        setPlayer(target, statUpdates);
        const bumpDesc = Object.entries(bumps)
          .filter(([,v]) => v > 0)
          .map(([k,v]) => `+${v*levelsGained} ${k.toUpperCase()}`)
          .join(', ');
        showNotif(`⬆ ${player.name} reached Level ${actualLevel}! ${bumpDesc}`, 'success');
        addJournal(`${player.name} leveled up to Level ${actualLevel}! Gained: ${bumpDesc}`);
        SFX.levelUp();
      } else {
        setPlayer(target, { xp: newXP });
      }
    });
  }

  // ── Main action handler ──
  async function handleAction(actionText) {
    initAudio(); // wake up audio context on first interaction
    if (state.isLoading || !actionText.trim()) return;
    const actingPlayer = state.players[state.currentPlayerIdx];
    const tagged = state.playerCount > 1 ? `[${actingPlayer.name}'s turn]: ${actionText}` : actionText;
    const newMessages = [...(state.messages || []), { role: 'user', content: tagged }];
    set({ messages: newMessages, isLoading: true, currentActions: [] });

    try {
      const sysPrompt = buildSystemPrompt(state);

      // Trim context if approaching limit
      const { messages: trimmedMsgs, trimmed, droppedTurns } = trimMessagesForContext(newMessages, sysPrompt);
      if (trimmed) {
        showNotif(`📜 Story compressed — ${droppedTurns} early turns summarized to save space`, 'info');
      }

      // Warn if still getting long
      const ctxStatus = getContextStatus(trimmedMsgs, sysPrompt);
      if (ctxStatus === 'warning') {
        showNotif('📜 This adventure is getting very long — consider starting a new chapter', 'info');
      }

      const text = await withRetry(() => callAPI(trimmedMsgs, sysPrompt), 2);
      const parsed = parseAllTags(text);
      const newTurn = (state.turnCount || 0) + 1;

      const updates = {
        messages: [...trimmedMsgs, { role: 'assistant', content: text }],
        isLoading: false,
        turnCount: newTurn,
        currentActions: parsed.actions || [],
      };
      // Add any new items the AI granted (via [ITEM:{...}] tags)
      if (parsed.items?.length > 0) {
        const newItemNames = parsed.items.map(it => it.name || it).filter(Boolean);
        const existing = state.sharedInventory || [];
        const merged = [...new Set([...existing, ...newItemNames])];
        updates.sharedInventory = merged;
      }

      if (parsed.rolls?.length)   updates.lastRoll    = parsed.rolls[0];   // e.g. 'd20=17'
      if (parsed.scene)           updates.lastScene   = parsed.scene;
      if (parsed.location)        updates.location    = parsed.location;
      if (parsed.milestone != null) updates.milestones = parsed.milestone;
      if (parsed.stats?.health != null) updates.stats = { ...state.stats, health: parsed.stats.health };
      if (parsed.combat)    {
        updates.inCombat = true;
        const isBoss = (parsed.combatants || []).some(c => c.isBoss);
        startCombatMusic(isBoss);
        SFX.combatStart();
      }
      if (parsed.combatEnd) {
        updates.inCombat = false; updates.combatants = [];
        endCombatMusic(
          parsed.scene?.type || state.lastScene?.type,
          parsed.scene?.time || state.lastScene?.time,
          parsed.scene?.mood || state.lastScene?.mood
        );
        SFX.combatEnd();
      }

      set(updates);

      // Auto-switch music on scene change
      if (parsed.scene?.type && !updates.inCombat) {
        const mood = parsed.scene.mood || '';
        if (mood === 'sad' || mood === 'emotional')   playEmotionalMusic();
        else if (mood === 'tense' || mood === 'ominous') playTensionMusic();
        else if (mood === 'wonder' || mood === 'discovery') playDiscoveryStinger();
        else if (mood === 'rest' || mood === 'camp')  playRestMusic();
        else autoTrackFromScene(parsed.scene.type, parsed.scene.time, parsed.scene.mood);
      }
      // Victory on major milestone
      if (parsed.milestone >= 5 && !updates.inCombat) playVictoryMusic();

      // Multiplayer turn advance
      if (state.playerCount > 1) set({ currentPlayerIdx: (state.currentPlayerIdx + 1) % state.playerCount });

      // Side effects
      if (parsed.journal) { addJournal(parsed.journal); SFX.journal(); }
      parsed.npcs.forEach(npc => {
        addNpc({ ...npc, introTurn: state.turnCount || 0 });
        SFX.npcIntroduced();
        playNpcMusic(npc.type || 'friendly');
      });
      parsed.codex.forEach(entry => { addCodex(entry); SFX.codexDiscover(); });
      if (parsed.gold) {
        updateGold(parsed.gold.amount, parsed.gold.reason);
        if (parsed.gold.amount > 0) SFX.goldGain();
        else if (parsed.gold.amount < 0) SFX.goldLose();
      }

      // XP and level ups
      // Near death warning — fire if any player below 20% health
      if (parsed.stats?.health != null && parsed.stats.health <= 20 && parsed.stats.health > 0) {
        SFX.nearDeath();
      }
      processXP(parsed.xpAwards);
      parsed.xpAwards.forEach(award => {
        addCombatEvent({ turn: newTurn, type: 'xp', player: award.player, amount: award.amount });
        SFX.xpGain();
      });

      // HP deltas — inline combat events + update HP
      parsed.hpDeltas.forEach(delta => {
        const pi = state.players.findIndex(p => p.name.toLowerCase() === delta.target?.toLowerCase());
        if (pi >= 0) {
          const p = state.players[pi];
          const newHp = Math.max(0, Math.min(p.maxHp, p.hp + (delta.delta || 0)));
          setPlayer(pi, { hp: newHp });
          // Log inline combat event
          addCombatEvent({
            turn: newTurn,
            type: delta.delta < 0 ? 'damage' : 'heal',
            target: p.name,
            amount: Math.abs(delta.delta || 0),
            hpBefore: p.hp,
            hpAfter: newHp,
            maxHp: p.maxHp,
            weapon: delta.weapon || null,
            roll: delta.roll || null,
            crit: delta.crit || delta.roll === 20 || false,
          });
          if (delta.delta < 0) {
            showNotif(`💔 ${p.name} took ${Math.abs(delta.delta)} damage`, 'error');
            if (delta.crit || delta.roll === 20) SFX.critHit();
            else if (delta.roll === 1) SFX.fumble();
            else SFX.hit();
          }
          if (delta.delta > 0) {
            showNotif(`💚 ${p.name} healed ${delta.delta} HP`, 'success');
            SFX.heal();
          }
        }
      });

      // Quest complete
      if (parsed.milestone >= 5) {
        SFX.questComplete();
        setTimeout(() => set({ screen: 'celebrate' }), 2000);
      } else if (parsed.milestone > 0) {
        SFX.milestone();
      }

    } catch (err) {
      const classified = classifyError(err);
      logApiError(err, {
        msgCount:     newMessages.length,
        sysPromptLen: buildSystemPrompt(state).length,
        lastUserMsg:  actionText,
        turn:         (state.turnCount || 0) + 1,
      });
      setApiError(classified);
      set({ isLoading: false });
    }
  }

  return (
    <div className={`screen ${styles.gameScreen}`}>
      <button className={styles.mobileMenuBtn} onClick={() => setSidebarOpen(o => !o)}>☰</button>

      {/* ── API Error Recovery UI ── */}
      {apiError && (
        <div className={styles.errorOverlay}>
          <div className={styles.errorCard}>
            <span className={styles.errorIcon}>
              {apiError.type === 'offline' ? '📵' :
               apiError.type === 'ratelimit' ? '⏳' :
               apiError.type === 'auth' ? '🔑' : '⚠'}
            </span>
            <h3 className={styles.errorTitle}>{apiError.title}</h3>
            <p className={styles.errorMsg}>{apiError.message}</p>
            <div className={styles.errorActions}>
              {apiError.retryable && (
                <button className={styles.retryBtn} onClick={() => { setApiError(null); sendTurn(state.messages[state.messages.length - 2]?.content || ''); }}>
                  ↻ Retry
                </button>
              )}
              <button className={styles.dismissBtn} onClick={() => setApiError(null)}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Initial loading screen (before first AI response) ── */}
      {state.isLoading && !state.messages?.length && (
        <WorldCraftingScreen players={state.players} />
      )}

      <GameSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSave={() => setShowSave(true)}
        onSettings={() => setShowSettings(true)}
        onJournal={() => setShowJournal(true)}
        onExport={() => setShowExport(true)}
        onRecap={() => setShowRecap(true)}
        onCloud={() => setShowCloud(true)}
        onSearch={() => setShowSearch(true)}
        onCharSheet={() => setShowCharSheet(true)}
        onDebug={() => setShowDebug(true)}
      />

      <div className={styles.main}>
        <CombatBanner />
        <MilestoneBar />
        <MusicPlayer />
        <StoryWindow />
        <InputArea onAction={handleAction} />
      </div>

      {showSave     && <SaveDialog            onClose={() => setShowSave(false)} />}
      {showSettings && <SettingsOverlay       onClose={() => setShowSettings(false)} />}
      {showJournal  && <JournalOverlay        onClose={() => setShowJournal(false)} />}
      {showExport   && <ExportOverlay         onClose={() => setShowExport(false)} />}
      {showRecap    && <SessionRecap          onClose={() => setShowRecap(false)} />}
      {showSearch   && <SearchOverlay         onClose={() => setShowSearch(false)} />}
      {showCharSheet&& <CharacterSheetOverlay onClose={() => setShowCharSheet(false)} />}
      {showDebug    && <DebugPanel            onClose={() => setShowDebug(false)} />}
    </div>
  );
}
