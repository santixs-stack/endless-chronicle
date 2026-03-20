import { useState } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import { callAPI } from '../../engine/api.js';
import { parseAllTags } from '../../engine/tags.js';
import styles from './SessionRecap.module.css';

export default function SessionRecap({ onClose }) {
  const { state } = useGame();
  const [recap, setRecap] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  async function generateRecap() {
    setLoading(true);
    try {
      // Build a concise summary from journal, npcs, and last few story beats
      const journal = state.journal?.slice(-8).join('\n') || 'No journal entries.';
      const npcs = state.npcs?.map(n => `${n.name} (${n.relationship})`).join(', ') || 'None';
      const recentStory = (state.messages || [])
        .filter(m => m.role === 'assistant')
        .slice(-3)
        .map(m => parseAllTags(m.content).narrative.slice(0, 200))
        .join('\n');
      const party = state.players?.map(p => `${p.name} the ${p.className} (HP: ${p.hp}/${p.maxHp})`).join(', ');

      const prompt = `Write a short "previously on..." recap for this adventure session. 3-5 sentences, exciting and engaging, like the start of a TV episode recap. Use vivid language.

Party: ${party}
Quest: ${state.goal?.name || 'Unknown'}
Turn count: ${state.turnCount || 0}
Journal highlights:
${journal}
NPCs met: ${npcs}
Recent story:
${recentStory}

Write only the recap, no labels or headers.`;

      const text = await callAPI(
        [{ role: 'user', content: prompt }],
        'You write exciting adventure recap summaries. Keep it punchy and fun.'
      );
      setRecap(text.trim());
      setGenerated(true);
    } catch (e) {
      setRecap('Could not generate recap. Try again.');
    } finally {
      setLoading(false);
    }
  }

  // Auto-generate on open
  if (!generated && !loading && recap === '') {
    generateRecap();
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.title}>📺 Previously On…</span>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}><span className={styles.statVal}>{state.turnCount || 0}</span><span className={styles.statLabel}>Turns</span></div>
          <div className={styles.stat}><span className={styles.statVal}>{state.journal?.length || 0}</span><span className={styles.statLabel}>Journal</span></div>
          <div className={styles.stat}><span className={styles.statVal}>{state.npcs?.length || 0}</span><span className={styles.statLabel}>NPCs</span></div>
          <div className={styles.stat}><span className={styles.statVal}>{state.milestones || 0}/5</span><span className={styles.statLabel}>Milestones</span></div>
        </div>
        <div className={styles.recapBox}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.dot}/><div className={styles.dot}/><div className={styles.dot}/>
            </div>
          ) : (
            <p className={styles.recapText}>{recap}</p>
          )}
        </div>
        <div className={styles.actions}>
          <button className={styles.regenBtn} onClick={generateRecap} disabled={loading}>
            ↻ Regenerate
          </button>
          <button className="btn-primary" onClick={onClose}>Continue Adventure →</button>
        </div>
      </div>
    </div>
  );
}
