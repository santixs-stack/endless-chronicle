import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import { PLAYER_COLORS } from '../../lib/constants.js';
import { SFX } from './SoundEngine.js';
import styles from './InputArea.module.css';

// ═══════════════════════════════════════════
//  INPUT AREA
//  Cleaned up — no manual dice roller, no
//  static ideas button. Dice roll happens
//  automatically when AI is resolving your
//  action (cosmetic animation only).
// ═══════════════════════════════════════════

const HINTS = [
  'What do you do?',
  'e.g. I run toward the mysterious door!',
  'e.g. I try to befriend the creature.',
  'e.g. I search the room for hidden clues.',
  'e.g. I use my special ability!',
  'e.g. I climb up to get a better look.',
  'e.g. I ask the old wizard for help.',
  'e.g. I make a really loud distraction!',
  'e.g. I attempt something unexpected…',
];

// ── Auto d20 roll animation ────────────────
// Shows while AI is thinking — gives the
// feeling that your action is being resolved
function DiceAnimation({ active }) {
  const [face, setFace] = useState(20);
  const [finalRoll, setFinalRoll] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!active) {
      setFinalRoll(null);
      setShowResult(false);
      return;
    }

    // Rapidly cycle through numbers
    const interval = setInterval(() => {
      setFace(Math.floor(Math.random() * 20) + 1);
    }, 80);

    // After 1.2s settle on a final number
    const settle = setTimeout(() => {
      clearInterval(interval);
      const result = Math.floor(Math.random() * 20) + 1;
      setFace(result);
      setFinalRoll(result);
      setShowResult(true);
    }, 1200);

    return () => { clearInterval(interval); clearTimeout(settle); };
  }, [active]);

  if (!active && !showResult) return null;

  const isNat20  = finalRoll === 20;
  const isNat1   = finalRoll === 1;
  const isGood   = finalRoll >= 15;

  return (
    <div className={`${styles.diceAnim} ${showResult ? styles.diceSettled : styles.diceRolling}`}>
      <div className={`${styles.diceFace}
        ${isNat20 ? styles.diceNat20 : ''}
        ${isNat1  ? styles.diceNat1  : ''}
        ${isGood && !isNat20 ? styles.diceGood : ''}
      `}>
        <span className={styles.diceNum}>{face}</span>
      </div>
      {showResult && (
        <span className={styles.diceLabel}>
          {isNat20 ? '⚡ NAT 20' : isNat1 ? '💀 NAT 1' : isGood ? 'GREAT' : 'd20'}
        </span>
      )}
    </div>
  );
}

export default function InputArea({ onAction }) {
  const { state } = useGame();
  const [text, setText] = useState('');
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
    SFX.click();
    onAction(text.trim());
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  }

  function handleTextChange(e) {
    setText(e.target.value);
    const ta = textareaRef.current;
    if (ta) { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 110) + 'px'; }
  }

  function useChip(chip) {
    setText(chip);
    textareaRef.current?.focus();
  }

  const actions     = state.currentActions || [];
  const combatChips = state.inCombat ? ['🔍 Assess the enemy'] : [];

  return (
    <div className={styles.inputSection}>

      {/* Action suggestion chips (AI-generated) */}
      {(actions.length > 0 || combatChips.length > 0) && !state.isLoading && (
        <div className={styles.chips}>
          <span className={styles.chipsLabel}>Try:</span>
          {combatChips.map((a, i) => (
            <button key={`combat-${i}`} className={`${styles.chip} ${styles.assessChip}`}
              onClick={() => useChip(a)}>{a}</button>
          ))}
          {actions.slice(0, 4).map((a, i) => (
            <button key={i} className={styles.chip} onClick={() => useChip(a)}>{a}</button>
          ))}
        </div>
      )}

      {/* Turn indicator + dice animation */}
      <div className={styles.turnRow}>
        <span className={styles.turnDot} style={{ background: color }} />
        <span className={styles.turnName} style={{ color }}>
          {curPlayer ? `${curPlayer.name} (${curPlayer.className})` : ''}
        </span>
        <DiceAnimation active={state.isLoading} />
      </div>

      {/* Text input */}
      <div className={styles.inputRow}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKey}
          placeholder={state.isLoading ? 'The GM is resolving your action…' : HINTS[hintIdx]}
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
