// ═══════════════════════════════════════════
//  SAVE SLOTS
//  Primary: Supabase (cross-device, per user)
//  Fallback: localStorage (offline / no auth)
//  3 named slots per user.
// ═══════════════════════════════════════════

import { supabase } from '../lib/supabase.js';

const SLOT_KEYS   = ['ec_slot_1', 'ec_slot_2', 'ec_slot_3'];
const TABLE       = 'save_slots';

// ── Build the save snapshot ────────────────
function buildSnap(gameState) {
  return {
    savedAt:         Date.now(),
    players:         gameState.players,
    mode:            gameState.mode,
    goal:            gameState.goal,
    world:           gameState.world,
    messages:        gameState.messages,
    turnCount:       gameState.turnCount,
    readingLevel:    gameState.readingLevel,
    hiddenArc:       gameState.hiddenArc,
    lastScene:       gameState.lastScene,
    npcs:            gameState.npcs,
    journal:         gameState.journal,
    reputation:      gameState.reputation,
    bestiary:        gameState.bestiary,
    milestones:      gameState.milestones,
    codex:           gameState.codex,
    gold:            gameState.gold,
    goldHistory:     gameState.goldHistory,
    sharedInventory: gameState.sharedInventory,
    stats:           gameState.stats,
    worldTime:       gameState.worldTime,
  };
}

// ── localStorage helpers ───────────────────
function lsGet(n) {
  try { return JSON.parse(localStorage.getItem(SLOT_KEYS[n])); } catch { return null; }
}
function lsSet(n, snap) {
  try { localStorage.setItem(SLOT_KEYS[n], JSON.stringify(snap)); return true; }
  catch (e) { console.error('localStorage save failed:', e); return false; }
}
function lsDel(n) { localStorage.removeItem(SLOT_KEYS[n]); }

export function useSaveSlots() {

  // ── Save ────────────────────────────────
  async function saveToSlot(n, gameState) {
    const snap = buildSnap(gameState);

    // Always write to localStorage as backup
    lsSet(n, snap);

    // Write to Supabase if available
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from(TABLE)
            .upsert({
              user_id:    user.id,
              slot_index: n,
              data:       snap,
              saved_at:   new Date(snap.savedAt).toISOString(),
            }, { onConflict: 'user_id,slot_index' });
          if (error) console.error('Supabase save error:', error);
        }
      } catch (e) {
        console.error('Supabase save failed (using localStorage):', e);
      }
    }
    return true;
  }

  // ── Load one slot ───────────────────────
  async function getSlot(n) {
    // Try Supabase first
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from(TABLE)
            .select('data')
            .eq('user_id', user.id)
            .eq('slot_index', n)
            .single();
          if (!error && data?.data) return data.data;
        }
      } catch {}
    }
    // Fall back to localStorage
    return lsGet(n);
  }

  // ── Load all slots ──────────────────────
  async function getAllSlots() {
    // Try Supabase first
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from(TABLE)
            .select('slot_index, data, saved_at')
            .eq('user_id', user.id)
            .order('slot_index');
          if (!error && data) {
            const slots = [null, null, null];
            data.forEach(row => { slots[row.slot_index] = row.data; });
            return slots;
          }
        }
      } catch {}
    }
    // Fall back to localStorage
    return SLOT_KEYS.map((_, i) => lsGet(i));
  }

  // ── Delete ──────────────────────────────
  async function deleteSlot(n) {
    lsDel(n);
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from(TABLE)
            .delete()
            .eq('user_id', user.id)
            .eq('slot_index', n);
        }
      } catch {}
    }
  }

  // ── Latest slot ─────────────────────────
  async function getLatestSlot() {
    const slots = await getAllSlots();
    let latest = null, latestIdx = -1;
    slots.forEach((s, i) => {
      if (s && (!latest || s.savedAt > latest.savedAt)) {
        latest = s; latestIdx = i;
      }
    });
    return { slot: latestIdx, data: latest };
  }

  // ── Sync localStorage → Supabase ────────
  // Call once after login to migrate existing saves
  async function syncLocalToCloud() {
    if (!supabase) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      for (let i = 0; i < 3; i++) {
        const local = lsGet(i);
        if (local) {
          await supabase.from(TABLE).upsert({
            user_id: user.id, slot_index: i, data: local,
            saved_at: new Date(local.savedAt || Date.now()).toISOString(),
          }, { onConflict: 'user_id,slot_index' });
        }
      }
    } catch (e) {
      console.error('Sync failed:', e);
    }
  }

  return { saveToSlot, getSlot, getAllSlots, deleteSlot, getLatestSlot, syncLocalToCloud };
}
