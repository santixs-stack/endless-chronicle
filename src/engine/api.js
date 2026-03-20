// ═══════════════════════════════════════════
//  ANTHROPIC API
// ═══════════════════════════════════════════

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL   = 'claude-sonnet-4-20250514';

export async function callAPI(messages, systemPrompt) {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!key) throw new Error('Missing VITE_ANTHROPIC_API_KEY');

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
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
