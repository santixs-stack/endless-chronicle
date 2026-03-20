import { useEffect, useRef } from 'react';
import { useGame } from '../../hooks/useGameState.js';
import { callAPI } from '../../engine/api.js';
import { buildSystemPrompt } from '../../engine/systemPrompt.js';
import { parseAllTags } from '../../engine/tags.js';
import { pickHiddenArc } from '../../data/hiddenArcs.js';
import { showNotif } from '../ui/Notification.jsx';
import GameSidebar from './GameSidebar.jsx';
import StoryWindow from './StoryWindow.jsx';
import InputArea from './InputArea.jsx';
import styles from './GameScreen.module.css';

export default function GameScreen() {
  const { state, set, pushMessage, addJournal, addNpc, addCodex, updateGold, setPlayer } = useGame();
  const hasOpened = useRef(false);

  // Generate opening scene once when game starts
  useEffect(() => {
    if (hasOpened.current || !state.players?.length) return;
    if (state.messages?.length > 0) return; // loaded save — skip
    hasOpened.current = true;

    const arc = pickHiddenArc();
    set({ hiddenArc: arc });

    const g = state.goal;
    const goalCtx = g
      ? `Quest: ${g.name}. ${g.start || g.hint}`
      : 'Begin the story.';
    const partyNames = state.players.map(p => `${p.name} the ${p.className}`).join(' and ');
    const openingPrompt = `${goalCtx}\n\nParty: ${partyNames}.\n\nWrite the opening scene. Keep it SHORT (2–4 sentences). Drop players straight into action. End with a direct question to ${state.players[0]?.name || 'Player 1'}. Include [SCENE:...] and [ACTIONS:...] tags.`;

    const msgs = [{ role: 'user', content: openingPrompt }];
    set({ isLoading: true });

    callAPI(msgs, buildSystemPrompt({ ...state, hiddenArc: arc }))
      .then(text => {
        const parsed = parseAllTags(text);
        const fullMessages = [...msgs, { role: 'assistant', content: text }];
        set({
          messages: fullMessages,
          isLoading: false,
          lastScene: parsed.scene || state.lastScene,
        });
        if (parsed.actions?.length) set({ currentActions: parsed.actions });
      })
      .catch(err => {
        console.error(err);
        showNotif('Could not start the adventure. Check your API key.', 'error');
        set({ isLoading: false });
      });
  }, []);

  async function handleAction(actionText) {
    if (state.isLoading || !actionText.trim()) return;

    const actingPlayer = state.players[state.currentPlayerIdx];
    const tagged = state.playerCount > 1
      ? `[${actingPlayer.name}'s turn]: ${actionText}`
      : actionText;

    const newMessages = [...(state.messages || []), { role: 'user', content: tagged }];
    set({ messages: newMessages, isLoading: true, currentActions: [] });

    try {
      const text = await callAPI(newMessages, buildSystemPrompt(state));
      const parsed = parseAllTags(text);

      const updatedMessages = [...newMessages, { role: 'assistant', content: text }];

      // Apply all tag side-effects
      const updates = {
        messages: updatedMessages,
        isLoading: false,
        turnCount: (state.turnCount || 0) + 1,
        currentActions: parsed.actions || [],
      };

      if (parsed.scene) updates.lastScene = parsed.scene;
      if (parsed.location) updates.location = parsed.location;
      if (parsed.stats?.health !== undefined) {
        updates.stats = { ...state.stats, health: parsed.stats.health };
      }
      if (parsed.milestone !== null) updates.milestones = parsed.milestone;
      if (parsed.floor !== null) updates.currentFloor = parsed.floor;

      set(updates);

      // Advance turn in multiplayer
      if (state.playerCount > 1) {
        set({ currentPlayerIdx: (state.currentPlayerIdx + 1) % state.playerCount });
      }

      // Journal
      if (parsed.journal) addJournal(parsed.journal);

      // NPCs
      parsed.npcs.forEach(npc => addNpc(npc));

      // Codex
      parsed.codex.forEach(entry => addCodex(entry));

      // Gold
      if (parsed.gold) updateGold(parsed.gold.amount, parsed.gold.reason);

      // HP deltas
      parsed.hpDeltas.forEach(delta => {
        const pi = state.players.findIndex(
          p => p.name.toLowerCase() === delta.target?.toLowerCase()
        );
        if (pi >= 0) {
          const p = state.players[pi];
          const newHp = Math.max(0, Math.min(p.maxHp, p.hp + delta.delta));
          setPlayer(pi, { hp: newHp });
        }
      });

      // Celebration on milestone completion
      if (parsed.milestone >= 5) {
        setTimeout(() => set({ screen: 'celebrate' }), 2000);
      }

    } catch (err) {
      console.error(err);
      showNotif('The story engine stumbled. Try again.', 'error');
      set({ isLoading: false });
    }
  }

  return (
    <div className={`screen ${styles.gameScreen}`}>
      <GameSidebar />
      <div className={styles.main}>
        <StoryWindow />
        <InputArea onAction={handleAction} />
      </div>
    </div>
  );
}
