// ═══════════════════════════════════════════
//  SAVE SLOTS
//  localStorage for offline, Supabase when
//  connected. 3 named slots.
// ═══════════════════════════════════════════

import { supabase } from '../lib/supabase.js';

const SLOT_KEYS = ['ec_slot_1', 'ec_slot_2', 'ec_slot_3'];

export function useSaveSlots() {

  function getSlot(n) {
    try {
      return JSON.parse(localStorage.getItem(SLOT_KEYS[n]));
    } catch {
      return null;
    }
  }

  function saveToSlot(n, gameState) {
    const snap = {
      savedAt:      Date.now(),
      players:      gameState.players,
      mode:         gameState.mode,
      goal:         gameState.goal,
      world:        gameState.world,
      messages:     gameState.messages,
      turnCount:    gameState.turnCount,
      readingLevel: gameState.readingLevel,
      hiddenArc:    gameState.hiddenArc,
      lastScene:    gameState.lastScene,
      npcs:         gameState.npcs,
      journal:      gameState.journal,
      reputation:   gameState.reputation,
      bestiary:     gameState.bestiary,
      milestones:   gameState.milestones,
      codex:        gameState.codex,
      gold:         gameState.gold,
      goldHistory:  gameState.goldHistory,
      sharedInventory: gameState.sharedInventory,
      stats:        gameState.stats,
      worldTime:    gameState.worldTime,
    };
    try {
      localStorage.setItem(SLOT_KEYS[n], JSON.stringify(snap));
      return true;
    } catch (e) {
      console.error('Save failed:', e);
      return false;
    }
  }

  function deleteSlot(n) {
    localStorage.removeItem(SLOT_KEYS[n]);
  }

  function getAllSlots() {
    return SLOT_KEYS.map((_, i) => getSlot(i));
  }

  function getLatestSlot() {
    let latest = null;
    let latestSlot = -1;
    SLOT_KEYS.forEach((_, i) => {
      const s = getSlot(i);
      if (s && (!latest || s.savedAt > latest.savedAt)) {
        latest = s;
        latestSlot = i;
      }
    });
    return { slot: latestSlot, data: latest };
  }

  return { getSlot, saveToSlot, deleteSlot, getAllSlots, getLatestSlot };
}
