import { useGame } from '../../hooks/useGameState.jsx';
import { parseAllTags } from '../../engine/tags.js';
import styles from './ExportOverlay.module.css';

export default function ExportOverlay({ onClose }) {
  const { state } = useGame();

  function buildStoryText(fmt) {
    const title = state.goal?.name || 'The Endless Chronicle';
    const party = state.players?.map(p => `${p.name} the ${p.className}`).join(', ') || '';
    const date = new Date().toLocaleDateString();
    const lines = [];

    if (fmt === 'md') {
      lines.push(`# ${title}`);
      lines.push(`*${party} · ${date}*`);
      lines.push('');
      lines.push('---');
      lines.push('');
    } else {
      lines.push(title.toUpperCase());
      lines.push(party);
      lines.push(date);
      lines.push('');
      lines.push('='.repeat(50));
      lines.push('');
    }

    const msgs = state.messages || [];
    let playerIdx = 0;

    msgs.forEach((msg, i) => {
      if (msg.role === 'user') {
        if (i === 0) return; // skip opening prompt
        if (msg.content.startsWith('Quest:') || msg.content.startsWith('Party:')) return;
        const clean = msg.content.replace(/^\[.+?'s turn\]:\s*/, '').trim();
        const pName = state.players?.[playerIdx % (state.playerCount || 1)]?.name || 'Player';
        playerIdx++;
        if (fmt === 'md') {
          lines.push(`**${pName}:** ${clean}`);
        } else {
          lines.push(`[${pName}]: ${clean}`);
        }
        lines.push('');
      } else if (msg.role === 'assistant') {
        const narrative = parseAllTags(msg.content).narrative
          .replace(/^\s*[\]\[]+\s*/g, '')
          .replace(/\s*[\]\[]+\s*$/g, '')
          .trim();
        if (narrative) {
          if (fmt === 'md') {
            lines.push(narrative.replace(/\*\*/g, '**'));
          } else {
            lines.push(narrative.replace(/\*\*/g, '').replace(/\*/g, ''));
          }
          lines.push('');
        }
      }
    });

    if (state.journal?.length > 0) {
      lines.push(fmt === 'md' ? '---\n\n## Journal' : '\n' + '='.repeat(50) + '\nJOURNAL');
      lines.push('');
      state.journal.forEach(entry => lines.push(fmt === 'md' ? `- ${entry}` : `· ${entry}`));
    }

    return lines.join('\n');
  }

  function download(fmt) {
    const content = buildStoryText(fmt);
    const type = fmt === 'md' ? 'text/markdown' : 'text/plain';
    const ext = fmt === 'md' ? 'md' : 'txt';
    const name = `${(state.goal?.name || 'chronicle').toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${ext}`;
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a); }, 200);
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.title}>📄 Export Story</span>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>
        <p className={styles.sub}>Save your adventure as a file to read, share, or keep forever.</p>
        <div className={styles.options}>
          <button className={styles.option} onClick={() => download('txt')}>
            <span className={styles.optIcon}>📄</span>
            <div>
              <div className={styles.optName}>Plain Text</div>
              <div className={styles.optDesc}>Simple text file · opens anywhere · .txt</div>
            </div>
          </button>
          <button className={styles.option} onClick={() => download('md')}>
            <span className={styles.optIcon}>📝</span>
            <div>
              <div className={styles.optName}>Markdown</div>
              <div className={styles.optDesc}>Formatted with bold and headers · .md</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
