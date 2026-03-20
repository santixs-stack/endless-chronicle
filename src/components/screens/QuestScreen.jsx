import { useState } from 'react';
import { useGame } from '../../hooks/useGameState.js';
import { STORY_GOALS } from '../../data/quests.js';
import StepBar from '../ui/StepBar.jsx';
import styles from './QuestScreen.module.css';

export default function QuestScreen() {
  const { state, set } = useGame();
  const [selected, setSelected] = useState(state.goal?.id || null);
  const [customText, setCustomText] = useState('');
  const [customOpen, setCustomOpen] = useState(state.goal?.id === 'custom');

  function selectPreset(quest) {
    setSelected(quest.id);
    setCustomOpen(false);
    set({ goal: quest });
  }

  function toggleCustom() {
    setCustomOpen(o => !o);
    if (!customOpen) setSelected('custom');
    else if (selected === 'custom') { setSelected(null); set({ goal: null }); }
  }

  function confirmCustom() {
    if (!customText.trim()) return;
    const goal = {
      id: 'custom', icon: '✍', name: 'Custom Quest',
      tagline: customText.length > 80 ? customText.slice(0, 80) + '…' : customText,
      tags: ['custom'],
      hint: `The players wrote their own quest: "${customText}". Honor it faithfully. Build a world and story around it.`,
      start: customText,
      tone: '', sceneType: 'plains', sceneTime: 'day',
      worldName: '', worldLocation: '',
    };
    set({ goal });
    setSelected('custom');
  }

  const canProceed = selected && (selected !== 'custom' || state.goal?.id === 'custom');

  return (
    <div className="screen">
      <div className={styles.header}>
        <StepBar currentScreen="quest" />
        <h2 className={styles.title}>Step 3: Choose Your Quest</h2>
        <p className={styles.sub}>Your characters are ready — now give them a mission!</p>
      </div>

      <div className={styles.grid}>
        {/* Custom card — always first */}
        <div
          className={`${styles.card} ${styles.customCard} ${selected === 'custom' ? styles.selected : ''}`}
          onClick={toggleCustom}
        >
          <span className={styles.icon}>✍</span>
          <div className={`${styles.name} ${styles.customName}`}>Make Your Own!</div>
          <div className={styles.tagline}>Describe any adventure you can imagine. Any world, any story!</div>
          <div className={styles.tags}><span className={`${styles.tag} ${styles.customTag}`}>your idea</span></div>
          {customOpen && (
            <div className={styles.customExpand} onClick={e => e.stopPropagation()}>
              <label className={styles.customLabel}>What's your adventure?</label>
              <textarea
                className={styles.customTextarea}
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="e.g. We're kids who found a portal to a dinosaur world and now we need to get home before dark…"
                rows={3}
                autoFocus
              />
              <button className={styles.customConfirm} onClick={confirmCustom}>
                Start This Adventure! →
              </button>
            </div>
          )}
        </div>

        {/* Preset quests */}
        {STORY_GOALS.map(q => (
          <div
            key={q.id}
            className={`${styles.card} ${selected === q.id ? styles.selected : ''}`}
            onClick={() => selectPreset(q)}
          >
            <span className={styles.icon}>{q.icon}</span>
            <div className={styles.name}>{q.name}</div>
            <div className={styles.tagline}>{q.tagline}</div>
            <div className={styles.tags}>
              {q.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button className="btn-ghost" onClick={() => set({ screen: 'character', setupIdx: state.playerCount - 1 })}>
          ← Back to Characters
        </button>
        <button className="btn-primary" disabled={!canProceed} onClick={() => set({ screen: 'world' })}>
          Set Up World →
        </button>
      </div>
    </div>
  );
}
