import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import { CLASS_IDEAS } from '../../data/classes.js';
import { PLAYER_COLORS } from '../../lib/constants.js';
import DiceRoller from './DiceRoller.jsx';
import styles from './InputArea.module.css';

const GENERIC_IDEAS = [
  'Run toward the action!', 'Look for a hidden door or lever',
  'Talk to whoever is here', 'Search the area carefully',
  'Try something creative!', 'Use the environment — throw something!',
  'Ask for help', 'Make a distraction',
];

const HINTS = [
  'What do you do? (try anything!)',
  'e.g. I run toward the mysterious door!',
  'e.g. I try to befriend the creature.',
  'e.g. I search the room for hidden clues.',
  'e.g. I use my special ability!',
  'e.g. I climb up to get a better look.',
  'e.g. I ask the old wizard for help.',
  'e.g. I make a really loud distraction!',
];

export default function InputArea({ onAction }) {
  const { state } = useGame();
  const [text, setText] = useState('');
  const [showIdeas, setShowIdeas] = useState(false);
  const [hintIdx, setHintIdx] = useState(0);
  const textareaRef = useRef(null);

  const curPlayer = state.players?.[state.currentPlayerIdx];
  const color = curPlayer ? PLAYER_COLORS[state.currentPlayerIdx] : 'var(--accent)';

  // Rotate placeholder hints
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.activeElement !== textareaRef.current) {
        setHintIdx(i => (i + 1) % HINTS.length);
      }
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  function submit() {
    if (!text.trim() || state.isLoading) return;
    onAction(text.trim());
    setText('');
    setShowIdeas(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  }

  function handleTextChange(e) {
    setText(e.target.value);
    const ta = textareaRef.current;
    if (ta) { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 110) + 'px'; }
  }

  function useIdea(idea) {
    setText(idea);
    setShowIdeas(false);
    textareaRef.current?.focus();
  }

  // Build ideas list for current player's class
  const ideas = [
    ...(CLASS_IDEAS[curPlayer?.class] || []),
    ...GENERIC_IDEAS,
  ].slice(0, 8);

  // Current actions from story response
  const actions = state.currentActions || [];

  // Combat-specific actions to inject
  const combatChips = state.inCombat ? ['🔍 Assess the enemy'] : [];

  return (
    <div className={styles.inputSection}>
      {/* Action suggestion chips */}
      {(actions.length > 0 || combatChips.length > 0) && (
        <div className={styles.chips}>
          <span className={styles.chipsLabel}>Try:</span>
          {combatChips.map((a, i) => (
            <button key={`combat-${i}`} className={`${styles.chip} ${styles.assessChip}`} onClick={() => useIdea(a)}>{a}</button>
          ))}
          {actions.slice(0, 4).map((a, i) => (
            <button key={i} className={styles.chip} onClick={() => useIdea(a)}>{a}</button>
          ))}
        </div>
      )}

      {/* Ideas panel */}
      {showIdeas && (
        <div className={styles.ideasPanel}>
          <div className={styles.ideasTitle}>💡 Ideas — click one to use it:</div>
          <div className={styles.ideasChips}>
            {ideas.map((idea, i) => (
              <span key={i} className={styles.ideaChip} onClick={() => useIdea(idea)}>
                💡 {idea}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Turn indicator */}
      <div className={styles.turnRow}>
        <span className={styles.turnDot} style={{ background: color }} />
        <span className={styles.turnName} style={{ color }}>
          {curPlayer ? `${curPlayer.name} (${curPlayer.className})` : ''}
        </span>
        <button
          className={styles.ideasBtn}
          onClick={() => setShowIdeas(s => !s)}
          title="Need ideas?"
        >
          💡 Ideas
        </button>
        <DiceRoller onResult={result => { setText(result); textareaRef.current?.focus(); }} />
      </div>

      {/* Text input */}
      <div className={styles.inputRow}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKey}
          placeholder={HINTS[hintIdx]}
          rows={1}
          disabled={state.isLoading}
        />
        <button
          className={styles.sendBtn}
          onClick={submit}
          disabled={state.isLoading || !text.trim()}
          aria-label="Send"
        >
          ▶
        </button>
      </div>
      <div className={styles.hint}>
        Enter to send · Shift+Enter for new line
      </div>
    </div>
  );
}
