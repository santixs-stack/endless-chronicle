import { useState, useEffect } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import StepBar from '../ui/StepBar.jsx';
import styles from './WorldScreen.module.css';

const TONES = ['', 'Epic & Exciting', 'Mysterious & Wondrous', 'Funny & Silly', 'Spooky & Scary', 'Hopeful & Heartfelt', 'Action-Packed', 'Magical & Whimsical'];

export default function WorldScreen() {
  const { state, set } = useGame();
  const goal = state.goal;
  const presetWorld = state._presetWorld;

  // Derive initial values from quest or preset world
  const init = presetWorld || (goal && goal.id !== 'custom' ? {
    world: goal.worldName || '',
    location: goal.worldLocation || '',
    tone: goal.tone || '',
    extra: '',
  } : { world: '', location: '', tone: '', extra: '' });

  const [world, setWorld] = useState(init.world || '');
  const [location, setLocation] = useState(init.location || '');
  const [tone, setTone] = useState(init.tone || '');
  const [extra, setExtra] = useState(init.extra || '');

  // Re-initialize if goal changes
  useEffect(() => {
    const src = presetWorld || (goal && goal.id !== 'custom' ? {
      world: goal.worldName || '', location: goal.worldLocation || '', tone: goal.tone || '', extra: '',
    } : { world: '', location: '', tone: '', extra: '' });
    setWorld(src.world || ''); setLocation(src.location || '');
    setTone(src.tone || ''); setExtra(src.extra || '');
  }, [goal?.id, presetWorld]);

  function start() {
    const worldData = {
      world:    world || (goal?.worldName) || 'An unknown world',
      location: location || (goal?.worldLocation) || 'An unknown place',
      tone:     tone || goal?.tone || '',
      extra,
    };
    set({ world: worldData, location: worldData.location, screen: 'quest' });
  }

  const showBanner = goal && goal.id !== 'custom' && !presetWorld;

  return (
    <div className="screen">
      <div className={styles.header}>
        <StepBar currentScreen="world" />
        <h2 className={styles.title}>Step 4: Your World</h2>
        <p className={styles.sub} id="world-screen-sub">
          {presetWorld
            ? 'This world comes from your character — customize if you like.'
            : showBanner
            ? 'Your quest sets the stage. Tweak anything or just start!'
            : 'Describe the world your characters are stepping into.'}
        </p>
      </div>

      <div className={styles.form}>
        {showBanner && (
          <div className={styles.banner}>
            <div className={styles.bannerTitle}>✦ {goal.icon} {goal.name}</div>
            <div className={styles.bannerDesc}>{goal.tagline}</div>
          </div>
        )}

        <div className="form-group">
          <label>The World You're In</label>
          <input type="text" value={world} onChange={e => setWorld(e.target.value)}
            placeholder="e.g. a magical kingdom, space in the future, a pirate world…" />
        </div>
        <div className="form-group">
          <label>Where the Adventure Starts</label>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)}
            placeholder="e.g. edge of a mysterious forest, a spaceship, a castle gate…" />
        </div>
        <div className="form-group">
          <label>What's the Mood?</label>
          <select value={tone} onChange={e => setTone(e.target.value)}>
            <option value="">— The story decides —</option>
            {TONES.filter(Boolean).map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Anything Special About This World? <span style={{opacity:.5, fontSize:'.6rem'}}>(optional)</span></label>
          <textarea value={extra} onChange={e => setExtra(e.target.value)} rows={3}
            placeholder="e.g. Everyone here can do a little magic. There is a dragon sleeping under the mountain…" />
        </div>
      </div>

      <div className={styles.actions}>
        <button className="btn-ghost" onClick={() => set({ screen: 'character', setupIdx: (state.playerCount || 1) - 1 })}>← Back to Characters</button>
        <button className="btn-primary" onClick={start}>Find Your Quest →</button>
      </div>
    </div>
  );
}
