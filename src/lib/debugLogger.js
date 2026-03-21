// ═══════════════════════════════════════════
//  DEBUG LOGGER
//  In-app structured error capture.
//  Stores errors, warnings, and context
//  snapshots in memory for the session.
//  No external services — all local.
// ═══════════════════════════════════════════

const MAX_ENTRIES = 100;
const LOG_LEVELS  = { error: 0, warn: 1, info: 2, debug: 3 };

let entries    = [];
let gameStateSnapshot = null;
let sessionId  = `session_${Date.now().toString(36)}`;
let turnCount  = 0;
let enabled    = true;

// ── Core logging ───────────────────────────

export function log(level, category, message, data = {}) {
  if (!enabled) return;
  if (LOG_LEVELS[level] === undefined) level = 'info';

  const entry = {
    id:        entries.length,
    ts:        new Date().toISOString(),
    sessionId,
    level,
    category,  // 'api' | 'tags' | 'combat' | 'render' | 'save' | 'audio' | 'flow' | 'general'
    message,
    data,
    turn:      turnCount,
    stateSnap: level === 'error' ? gameStateSnapshot : undefined,
  };

  entries.push(entry);
  if (entries.length > MAX_ENTRIES) entries.shift();

  // Also forward to browser console with grouping
  const style = {
    error: 'color:#e05555;font-weight:bold',
    warn:  'color:#e09030;font-weight:bold',
    info:  'color:#5595e0',
    debug: 'color:#888',
  }[level];

  console.groupCollapsed(`%c[Chronicle:${category}] ${message}`, style);
  if (Object.keys(data).length) console.log('Data:', data);
  if (level === 'error' && gameStateSnapshot) console.log('State snap:', gameStateSnapshot);
  console.groupEnd();
}

// Convenience wrappers
export const logError = (cat, msg, data) => log('error', cat, msg, data);
export const logWarn  = (cat, msg, data) => log('warn',  cat, msg, data);
export const logInfo  = (cat, msg, data) => log('info',  cat, msg, data);
export const logDebug = (cat, msg, data) => log('debug', cat, msg, data);

// ── State snapshot ─────────────────────────
// Call this each turn with current game state
// so crashes have context

export function updateStateSnapshot(state) {
  if (!state) return;
  turnCount = state.turnCount || 0;
  // Store a lightweight snapshot — not full messages array
  gameStateSnapshot = {
    screen:      state.screen,
    turn:        state.turnCount,
    playerCount: state.playerCount,
    players:     (state.players || []).map(p => ({
      name:  p.name,
      class: p.className,
      hp:    `${p.hp}/${p.maxHp}`,
      level: p.level,
    })),
    inCombat:   state.inCombat,
    goal:       state.goal?.name,
    world:      state.world?.world?.slice(0, 60),
    lastScene:  state.lastScene,
    msgCount:   state.messages?.length,
    lastMsg:    state.messages?.slice(-1)[0]?.content?.slice(0, 200),
    isLoading:  state.isLoading,
  };
}

// ── Tag parse error logging ────────────────
export function logTagParseError(tagName, rawContent, error) {
  logError('tags', `Failed to parse [${tagName}] tag`, {
    tagName,
    rawContent: rawContent?.slice(0, 300),
    error: error?.message || String(error),
  });
}

// ── API error logging ──────────────────────
export function logApiError(error, context = {}) {
  logError('api', `API call failed: ${error?.message || error}`, {
    status:      context.status,
    turnNumber:  turnCount,
    msgCount:    context.msgCount,
    sysPromptLen: context.sysPromptLen,
    lastUserMsg: context.lastUserMsg?.slice(0, 200),
    error:       error?.message || String(error),
    stack:       error?.stack?.split('\n').slice(0, 4).join('\n'),
  });
}

// ── Render error logging ───────────────────
export function logRenderError(componentName, error, props = {}) {
  logError('render', `Render crash in ${componentName}`, {
    component: componentName,
    error:     error?.message || String(error),
    stack:     error?.stack?.split('\n').slice(0, 6).join('\n'),
    props:     JSON.stringify(props).slice(0, 300),
  });
}

// ── Combat event logging ───────────────────
export function logCombatEvent(type, data) {
  logInfo('combat', `Combat: ${type}`, data);
}

// ── Flow logging ───────────────────────────
export function logFlow(from, to, reason = '') {
  logInfo('flow', `Screen: ${from} → ${to}${reason ? ` (${reason})` : ''}`, { from, to });
}

// ── Debug report ──────────────────────────
// Returns a structured string ready to copy/share

export function buildDebugReport() {
  const errors   = entries.filter(e => e.level === 'error');
  const warnings = entries.filter(e => e.level === 'warn');
  const recent   = entries.slice(-20);

  const report = {
    meta: {
      sessionId,
      generatedAt:  new Date().toISOString(),
      totalEntries: entries.length,
      errorCount:   errors.length,
      warnCount:    warnings.length,
    },
    currentState: gameStateSnapshot,
    errors:       errors.slice(-10).map(e => ({
      ts:       e.ts,
      category: e.category,
      message:  e.message,
      turn:     e.turn,
      data:     e.data,
    })),
    warnings: warnings.slice(-5).map(e => ({
      ts:       e.ts,
      category: e.category,
      message:  e.message,
    })),
    recentLog: recent.map(e => `[${e.ts.slice(11,19)}][${e.level.toUpperCase()}][${e.category}] ${e.message}`),
  };

  return JSON.stringify(report, null, 2);
}

// ── Accessors ──────────────────────────────
export function getEntries()     { return [...entries]; }
export function getErrors()      { return entries.filter(e => e.level === 'error'); }
export function clearLog()       { entries = []; }
export function getSessionId()   { return sessionId; }
export function setEnabled(val)  { enabled = val; }
