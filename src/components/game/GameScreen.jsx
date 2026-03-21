import { useEffect, useRef, useState, useCallback } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import { useSaveSlots } from '../../hooks/useSaveSlots.js';
import { callAPI, trimMessagesForContext, getContextStatus } from '../../engine/api.js';
import { classifyError, withRetry } from '../../lib/recovery.jsx';
import { logApiError, logFlow, logCombatEvent, updateStateSnapshot, logError } from '../../lib/debugLogger.js';
import { buildSystemPrompt } from '../../engine/systemPrompt.js';
import { parseAllTags } from '../../engine/tags.js';
import { pickHiddenArc } from '../../data/hiddenArcs.js';
import { autoTrackFromScene, startCombatMusic, endCombatMusic } from './MusicEngine.js';
import { SFX, initAudio } from './SoundEngine.js';
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

  // ── Keyboard shortcut: Ctrl+Shift+D opens debug panel ──
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
    set({ hiddenArc: arc });
    const g = state.goal;
    const goalCtx = g ? `Quest: ${g.name}. ${g.start || g.hint}` : 'Begin the story.';
    const partyNames = state.players.map(p => `${p.name} the ${p.className}`).join(' and ');
    const prompt = `${goalCtx}\n\nParty: ${partyNames}.\n\nWrite the opening scene SHORT (2-4 sentences). Drop players straight into action. End with a direct question to ${state.players[0]?.name || 'Player 1'}. Include [SCENE:...] and [ACTIONS:...] tags.`;
    const msgs = [{ role: 'user', content: prompt }];
    set({ isLoading: true });
    setApiError(null);
    const sysPrompt = buildSystemPrompt({ ...state, hiddenArc: arc });
    withRetry(() => callAPI(msgs, sysPrompt), 2)
      .then(text => {
        const parsed = parseAllTags(text);
        set({ messages: [...msgs, { role: 'assistant', content: text }], isLoading: false, lastScene: parsed.scene || null, currentActions: parsed.actions || [] });
        if (parsed.scene) autoTrackFromScene(parsed.scene.type, parsed.scene.time, parsed.scene.mood);
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
        setPlayer(target, { xp: newXP, level: actualLevel });
        showNotif(`⬆ ${player.name} reached Level ${actualLevel}!`, 'success');
        addJournal(`${player.name} leveled up to Level ${actualLevel}!`);
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

      if (parsed.scene)           updates.lastScene   = parsed.scene;
      if (parsed.location)        updates.location    = parsed.location;
      if (parsed.milestone != null) updates.milestones = parsed.milestone;
      if (parsed.stats?.health != null) updates.stats = { ...state.stats, health: parsed.stats.health };
      if (parsed.combat)    { updates.inCombat  = true;  startCombatMusic(); SFX.combatStart(); }
      if (parsed.combatEnd) { updates.inCombat  = false; updates.combatants = []; endCombatMusic(parsed.scene?.type || state.lastScene?.type, parsed.scene?.time || state.lastScene?.time, parsed.scene?.mood || state.lastScene?.mood); SFX.combatEnd(); }

      set(updates);

      // Auto-switch music on scene change
      if (parsed.scene?.type && !updates.inCombat) autoTrackFromScene(parsed.scene.type, parsed.scene.time, parsed.scene.mood);

      // Multiplayer turn advance
      if (state.playerCount > 1) set({ currentPlayerIdx: (state.currentPlayerIdx + 1) % state.playerCount });

      // Side effects
      if (parsed.journal) { addJournal(parsed.journal); SFX.journal(); }
      parsed.npcs.forEach(npc => addNpc(npc));
      parsed.codex.forEach(entry => addCodex(entry));
      if (parsed.gold) updateGold(parsed.gold.amount, parsed.gold.reason);

      // XP and level ups
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
        <div className={styles.initLoadOverlay}>
          <div className={styles.initLoadInner}>
            <div className={styles.initSpinnerWrap}>
              <div className={styles.initSpinner} />
              <div className={styles.initSpinnerInner} />
            </div>
            <p className={styles.initLoadMsg}>The GM is setting the scene…</p>
            <p className={styles.initLoadSub}>Preparing your adventure</p>
          </div>
        </div>
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
