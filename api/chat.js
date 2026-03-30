// Vercel serverless function — proxies requests to Anthropic
// The API key lives here on the server, never exposed to the browser

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function callAnthropic(apiKey, body) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });
  return response;
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Retry up to 4 times on 529 overload with exponential backoff
  const MAX_RETRIES = 4;
  const RETRY_DELAYS = [1000, 3000, 6000, 12000]; // ms between retries

  let lastStatus = 500;
  let lastData = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await callAnthropic(apiKey, req.body);
      const data = await response.json();

      if (response.ok) {
        return res.status(200).json(data);
      }

      lastStatus = response.status;
      lastData = data;

      // Only retry on 529 (overloaded) or 503 (service unavailable)
      if (response.status !== 529 && response.status !== 503) {
        return res.status(response.status).json(data);
      }

      // Don't sleep after last attempt
      if (attempt < MAX_RETRIES - 1) {
        const delay = RETRY_DELAYS[attempt] + Math.random() * 1000;
        console.log(\`Anthropic \${response.status} on attempt \${attempt + 1}, retrying in \${Math.round(delay)}ms\`);
        await sleep(delay);
      }

    } catch (error) {
      console.error('Anthropic API fetch error:', error);
      lastData = { error: 'Failed to reach Anthropic API' };
      if (attempt < MAX_RETRIES - 1) {
        await sleep(RETRY_DELAYS[attempt]);
      }
    }
  }

  // All retries exhausted
  console.error(\`Anthropic API failed after \${MAX_RETRIES} attempts, last status: \${lastStatus}\`);
  return res.status(lastStatus).json(lastData || { error: 'API unavailable after retries' });
}
