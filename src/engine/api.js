const MODEL = 'claude-sonnet-4-20250514';
export async function callAPI(messages, systemPrompt) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, max_tokens: 1024, system: systemPrompt, messages }),
  });
  if (!response.ok) { const err = await response.text(); throw new Error(`API ${response.status}: ${err}`); }
  const data = await response.json();
  return data.content.filter(b => b.type === 'text').map(b => b.text).join('');
}
