// ═══════════════════════════════════════════
//  GAME STATE  (React Context)
//  Single source of truth for all game data.
//  Replaces the global `S` object.
// ═══════════════════════════════════════════

import { createContext, useContext, useReducer, useCallback } from 'react';
import { pickHiddenArc } from '../data/hiddenArcs.js';

// ── Initial state ─────────────────────────
const INITIAL_STATE = {
  // Setup
  mode:             null,   // 'creative' | 'adventure'
  goal:             null,   // quest object
  world:            null,   // { world, location, tone, extra }
  playerCount:      1,
  setupIdx:         0,
  players:          [],
  _presetWorld:     null,   // temp: world from char preset

  // Game
  currentPlayerIdx: 0,
  messages:         [],
  turnCount:        0,
  isLoading:        false,
  location:         '',
  readingLevel:     '4th',
  hiddenArc:        null,

  // Sidebar data
  sharedInventory:  [],
  combatLog:        [],
  npcs:             [],
  journal:          [],
  reputation:       [],
  bestiary:         [],
  milestones:       0,
  codex:            [],
  gold:             null,
  goldHistory:      [],

  // Combat
  inCombat:         false,
  combatants:       [],
  combatantIdx:     0,
  combatRound:      1,

  // Adventure mode
  stats:            { health: 100 },

  // Misc
  selectedClass:    'warrior',
  lastScene:        null,
  worldTime:        null,
  pendingAction:    null,
  activePresetId:   null,
};

// ── Reducer ───────────────────────────────
function gameReducer(state, action) {
  switch (action.type) {
    case 'SET':
      return { ...state, ...action.payload };
    case 'SET_PLAYER':
      const players = [...state.players];
      players[action.idx] = { ...players[action.idx], ...action.payload };
      return { ...state, players };
    case 'PUSH_MESSAGE':
      return { ...state, messages: [...state.messages, action.message] };
    case 'ADD_JOURNAL':
      return { ...state, journal: [...state.journal, action.entry] };
    case 'ADD_NPC': {
      const existing = state.npcs.findIndex(n => n.name === action.npc.name);
      const npcs = existing >= 0
        ? state.npcs.map((n, i) => i === existing ? { ...n, ...action.npc } : n)
        : [...state.npcs, action.npc];
      return { ...state, npcs };
    }
    case 'ADD_CODEX':
      return { ...state, codex: [...state.codex, action.entry] };
    case 'UPDATE_GOLD': {
      const current = state.gold || {};
      const newGold = { ...current, gold: (current.gold || 0) + (action.amount || 0) };
      return {
        ...state,
        gold: newGold,
        goldHistory: [...(state.goldHistory || []), { ...action }],
      };
    }
    case 'ADD_COMBAT_EVENT':
      return { ...state, combatLog: [...(state.combatLog || []), action.event] };
    case 'RESET':
      return {
        ...INITIAL_STATE,
        readingLevel: state.readingLevel, // persist reading level across resets
      };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────
const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  const set = useCallback((payload) => dispatch({ type: 'SET', payload }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const setPlayer = useCallback((idx, payload) => dispatch({ type: 'SET_PLAYER', idx, payload }), []);
  const pushMessage = useCallback((message) => dispatch({ type: 'PUSH_MESSAGE', message }), []);
  const addJournal = useCallback((entry) => dispatch({ type: 'ADD_JOURNAL', entry }), []);
  const addNpc = useCallback((npc) => dispatch({ type: 'ADD_NPC', npc }), []);
  const addCodex = useCallback((entry) => dispatch({ type: 'ADD_CODEX', entry }), []);
  const addCombatEvent = useCallback((event) => dispatch({ type: 'ADD_COMBAT_EVENT', event }), []);
  const updateGold = useCallback((amount, reason) => dispatch({ type: 'UPDATE_GOLD', amount, reason }), []);

  const initGame = useCallback(() => {
    dispatch({ type: 'SET', payload: { hiddenArc: pickHiddenArc() } });
  }, []);

  return (
    <GameContext.Provider value={{
      state, set, reset, setPlayer, pushMessage,
      addJournal, addNpc, addCodex, updateGold, addCombatEvent, initGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
