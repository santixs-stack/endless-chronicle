// ═══════════════════════════════════════════
//  API CALLER
//  Calls our Vercel serverless function at /api/chat
//  which proxies to Anthropic server-side.
//  The API key never touches the browser.
// ═══════════════════════════════════════════

const MODEL = 'claude-sonnet-4-20250514';

// Rough token estimate (4 chars ≈ 1 token)
function estimateTokens(str) {
  return Math.ceil((str || '').length / 4);
}

// Context window limit — leave headroom for response
const MAX_INPUT_TOKENS = 160000;
const RESPONSE_HEADROOM = 2000;
const SAFE_LIMIT = MAX_INPUT_TOKENS - RESPONSE_HEADROOM;

// ── Trim messages to fit context window ────
// Always keeps: first user message (scene setup)
// and last N assistant messages for continuity.
// Summarizes older content into a single recap message.
export function trimMessagesForContext(messages, systemPrompt = '') {
  const sysTokens = estimateTokens(systemPrompt);
  const totalMsgTokens = messages.reduce((sum, m) => sum + estimateTokens(m.content), 0);
  const totalTokens = sysTokens + totalMsgTokens;

  // If under limit, return as-is
  if (totalTokens <= SAFE_LIMIT) {
    return { messages, trimmed: false, droppedTurns: 0 };
  }

  // Keep first message (scene/quest setup) + last 20 messages
  const KEEP_RECENT = 20;
  const first = messages.slice(0, 1);
  const recent = messages.slice(-KEEP_RECENT);
  const dropped = messages.slice(1, messages.length - KEEP_RECENT);

  // Build a brief summary of dropped content
  const droppedNarrative = dropped
    .filter(m => m.role === 'assistant')
    .map(m => {
      // Extract first sentence of narrative
      const text = m.content.replace(/\[[A-Z_]+:[^\]]+\]/g, '').trim();
      return text.split(/[.!?]/)[0]?.trim();
    })
    .filter(Boolean)
    .slice(-5)
    .join('. ');

  const summaryMessage = {
    role: 'user',
    content: `[STORY RECAP — earlier events]: ${droppedNarrative || 'The adventure has been ongoing.'} [Continue from current moment]`,
  };

  const trimmedMessages = [...first, summaryMessage, ...recent];

  return {
    messages: trimmedMessages,
    trimmed: true,
    droppedTurns: dropped.filter(m => m.role === 'assistant').length,
  };
}

// ── Check if approaching limit ─────────────
export function getContextStatus(messages, systemPrompt = '') {
  const sysTokens = estimateTokens(systemPrompt);
  const msgTokens = messages.reduce((sum, m) => sum + estimateTokens(m.content), 0);
  const total = sysTokens + msgTokens;
  const pct = total / SAFE_LIMIT;

  if (pct >= 1.0) return 'critical';
  if (pct >= 0.85) return 'warning';
  if (pct >= 0.7)  return 'caution';
  return 'ok';
}

export async function callAPI(messages, systemPrompt) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');
}

