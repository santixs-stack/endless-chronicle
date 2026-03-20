import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import { callAPI } from '../../engine/api.js';
import { buildSystemPrompt } from '../../engine/systemPrompt.js';
import { parseAllTags } from '../../engine/tags.js';
import { pickHiddenArc } from '../../data/hiddenArcs.js';
import { autoTrackFromScene } from './MusicEngine.js';
import { showNotif } from '../ui/Notification.jsx';
import GameSidebar from './GameSidebar.jsx';
import StoryWindow from './StoryWindow.jsx';
import InputArea from './InputArea.jsx';
import MilestoneBar from './MilestoneBar.jsx';
import MusicPlayer from './MusicPlayer.jsx';
import SaveDialog from '../overlays/SaveDialog.jsx';
import SettingsOverlay from '../overlays/SettingsOverlay.jsx';
import styles from './GameScreen.module.css';

export default function GameScreen() {
  const { state, set, addJournal, addNpc, addCodex, updateGold, setPlayer } = useGame();
  const hasOpened = useRef(false);
  const [showSave, setShowSave] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (hasOpened.current || !state.players?.length) return;
    if (state.messages?.length > 0) return;
    hasOpened.current = true;
    const arc = pickHiddenArc();
    set({ hiddenArc: arc });
    const g = state.goal;
    const goalCtx = g ? `Quest: ${g.name}. ${g.start || g.hint}` : 'Begin the story.';
    const partyNames = state.players.map(p => `${p.name} the ${p.className}`).join(' and ');
    const openingPrompt = `${goalCtx}\n\nParty: ${partyNames}.\n\nWrite the opening scene SHORT (2-4 sentences). Drop players straight into action. End with a direct question to ${state.players[0]?.name || 'Player 1'}. Include [SCENE:...] and [ACTIONS:...] tags.`;
    const msgs = [{ role: 'user', content: openingPrompt }];
    set({ isLoading: true });
    callAPI(msgs, buildSystemPrompt({ ...state, hiddenArc: arc }))
      .then(text => {
        const parsed = parseAllTags(text);
        set({ messages: [...msgs, { role: 'assistant', content: text }], isLoading: false, lastScene: parsed.scene || null, currentActions: parsed.actions || [] });
        if (parsed.scene?.type) autoTrackFromScene(parsed.scene.type);
      })
      .catch(err => { console.error(err); showNotif('Could not start the adventure. Check your API key.', 'error'); set({ isLoading: false }); });
  }, []);

  async function handleAction(actionText) {
    if (state.isLoading || !actionText.trim()) return;
    const actingPlayer = state.players[state.currentPlayerIdx];
    const tagged = state.playerCount > 1 ? `[${actingPlayer.name}'s turn]: ${actionText}` : actionText;
    const newMessages = [...(state.messages || []), { role: 'user', content: tagged }];
    set({ messages: newMessages, isLoading: true, currentActions: [] });
    try {
      const text = await callAPI(newMessages, buildSystemPrompt(state));
      const parsed = parseAllTags(text);
      const updates = { messages: [...newMessages, { role: 'assistant', content: text }], isLoading: false, turnCount: (state.turnCount || 0) + 1, currentActions: parsed.actions || [] };
      if (parsed.scene) updates.lastScene = parsed.scene;
      if (parsed.location) updates.location = parsed.location;
      if (parsed.milestone !== null && parsed.milestone !== undefined) updates.milestones = parsed.milestone;
      if (parsed.stats?.health !== undefined) updates.stats = { ...state.stats, health: parsed.stats.health };
      set(updates);
      if (parsed.scene?.type) autoTrackFromScene(parsed.scene.type);
      if (state.playerCount > 1) set({ currentPlayerIdx: (state.currentPlayerIdx + 1) % state.playerCount });
      if (parsed.journal) addJournal(parsed.journal);
      parsed.npcs.forEach(npc => addNpc(npc));
      parsed.codex.forEach(entry => addCodex(entry));
      if (parsed.gold) updateGold(parsed.gold.amount, parsed.gold.reason);
      parsed.hpDeltas.forEach(delta => {
        const pi = state.players.findIndex(p => p.name.toLowerCase() === delta.target?.toLowerCase());
        if (pi >= 0) { const p = state.players[pi]; setPlayer(pi, { hp: Math.max(0, Math.min(p.maxHp, p.hp + (delta.delta || 0))) }); }
      });
      if (parsed.milestone >= 5) setTimeout(() => set({ screen: 'celebrate' }), 2000);
    } catch (err) { console.error(err); showNotif('The story engine stumbled. Try again.', 'error'); set({ isLoading: false }); }
  }

  return (
    <div className={`screen ${styles.gameScreen}`}>
      <GameSidebar onSave={() => setShowSave(true)} onSettings={() => setShowSettings(true)} />
      <div className={styles.main}>
        <MilestoneBar />
        <MusicPlayer />
        <StoryWindow />
        <InputArea onAction={handleAction} />
      </div>
      {showSave     && <SaveDialog     onClose={() => setShowSave(false)} />}
      {showSettings && <SettingsOverlay onClose={() => setShowSettings(false)} />}
    </div>
  );
}
