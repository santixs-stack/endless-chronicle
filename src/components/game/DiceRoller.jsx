import { useState } from 'react';
import styles from './DiceRoller.module.css';

const DICE = [
  { sides: 4,  icon: '▲', color: '#e05555' },
  { sides: 6,  icon: '⬡', color: '#c4a84f' },
  { sides: 8,  icon: '◆', color: '#6dbb7c' },
  { sides: 10, icon: '●', color: '#5595e0' },
  { sides: 12, icon: '⬟', color: '#a87ed4' },
  { sides: 20, icon: '★', color: '#ff8c3a' },
];

function roll(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function getLabel(result, sides) {
  if (sides === 20) {
    if (result === 20) return { text: 'NAT 20! 🎉', cls: 'nat20' };
    if (result === 1)  return { text: 'NAT 1 💀', cls: 'nat1' };
    if (result >= 15)  return { text: 'Great!', cls: 'great' };
    if (result <= 5)   return { text: 'Oof…', cls: 'bad' };
  }
  return null;
}

export default function DiceRoller({ onResult }) {
  const [results, setResults] = useState([]);
  const [rolling, setRolling] = useState(null);
  const [open, setOpen] = useState(false);

  function handleRoll(die) {
    setRolling(die.sides);
    setTimeout(() => {
      const result = roll(die.sides);
      const label = getLabel(result, die.sides);
      const entry = { sides: die.sides, result, label, color: die.color, id: Date.now() };
      setResults(prev => [entry, ...prev].slice(0, 5));
      setRolling(null);
      if (onResult) onResult(`🎲 Rolled a d${die.sides}: **${result}**${label ? ` (${label.text})` : ''}`);
    }, 400);
  }

  if (!open) {
    return (
      <button className={styles.toggleBtn} onClick={() => setOpen(true)} title="Dice roller">
        🎲
      </button>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>🎲 Dice</span>
        <button className={styles.close} onClick={() => setOpen(false)}>✕</button>
      </div>
      <div className={styles.diceRow}>
        {DICE.map(die => (
          <button
            key={die.sides}
            className={`${styles.die} ${rolling === die.sides ? styles.rolling : ''}`}
            style={{ '--die-color': die.color }}
            onClick={() => handleRoll(die)}
            title={`Roll d${die.sides}`}
          >
            <span className={styles.dieIcon}>{die.icon}</span>
            <span className={styles.dieName}>d{die.sides}</span>
          </button>
        ))}
      </div>
      {results.length > 0 && (
        <div className={styles.results}>
          {results.map(r => (
            <div key={r.id} className={styles.result}>
              <span className={styles.resultDie} style={{ color: r.color }}>d{r.sides}</span>
              <span className={styles.resultNum} style={{ color: r.color }}>{r.result}</span>
              {r.label && (
                <span className={`${styles.resultLabel} ${styles[r.label.cls] || ''}`}>
                  {r.label.text}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
