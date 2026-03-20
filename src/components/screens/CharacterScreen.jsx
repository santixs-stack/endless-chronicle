import { useState, useEffect } from 'react';
import { useGame } from '../../hooks/useGameState.js';
import { CHAR_PRESETS } from '../../data/presets.js';
import { DND_CLASSES } from '../../data/classes.js';
import { PLAYER_COLORS, PLAYER_COLOR_NAMES } from '../../lib/constants.js';
import { callAPI } from '../../engine/api.js';
import StepBar from '../ui/StepBar.jsx';
import { showNotif } from '../ui/Notification.jsx';
import styles from './CharacterScreen.module.css';

const SUGGESTIONS = {
  name: ['Zara','Finn','Nova','Blaze','Kai','Mira','Rex','Luna','Orion','Pip','Sage','Dash'],
  age:  ['12','14','16','Unknown','Ancient','Ageless','Teen','Adult','Very old','312 (looks 70)'],
  role: ['Village apprentice who discovered a secret','Lost heir to a forgotten throne','Space cadet on their first mission','Retired adventurer pulled back in','Sentient creature figuring out the world','Young thief with a big heart','Wandering scholar chasing a mystery'],
  trait:['Can talk to animals','Never gets lost','Glows faintly in the dark','Always knows when someone is lying','Machines obey them','Moves without making sound','Has survived things that should have been fatal'],
};

export default function CharacterScreen() {
  const { state, set } = useGame();
  const idx = state.setupIdx || 0;
  const color = PLAYER_COLORS[idx];
  const colorName = PLAYER_COLOR_NAMES[idx];

  // Find preset if one was selected
  const activePreset = CHAR_PRESETS.find(p => p.id === state.activePresetId);
  const prefill = activePreset?.char || {};

  const [name, setName]           = useState(prefill.name || '');
  const [age, setAge]             = useState(prefill.age || '');
  const [role, setRole]           = useState(prefill.role || '');
  const [trait, setTrait]         = useState(prefill.trait || '');
  const [selectedClass, setClass] = useState('warrior');
  const [specialty, setSpecialty] = useState('');
  const [showOptional, setShowOptional] = useState(false);
  const [bond, setBond]           = useState(prefill.bond || '');
  const [flaw, setFlaw]           = useState(prefill.flaw || '');
  const [motivation, setMotivation] = useState(prefill.motivation || '');
  const [backstory, setBackstory] = useState('');
  const [generatingBackstory, setGeneratingBackstory] = useState(false);

  // Re-fill when preset changes
  useEffect(() => {
    if (activePreset?.char) {
      const c = activePreset.char;
      setName(c.name || ''); setAge(c.age || ''); setRole(c.role || '');
      setTrait(c.trait || ''); setBond(c.bond || ''); setFlaw(c.flaw || '');
      setMotivation(c.motivation || '');
    }
  }, [state.activePresetId]);

  function suggest(setter, key) {
    const list = SUGGESTIONS[key] || [];
    setter(list[Math.floor(Math.random() * list.length)] || '');
  }

  async function generateBackstory() {
    if (!name && !role) { showNotif('Add a name and background first', 'error'); return; }
    setGeneratingBackstory(true);
    try {
      const cls = DND_CLASSES.find(c => c.id === selectedClass);
      const prompt = `Write a vivid, specific 3-sentence backstory for this character. Make it feel personal and create immediate story hooks.\n\nName: ${name || 'Unknown'}\nAge: ${age || 'Unknown'}\nBackground: ${role}\nClass: ${cls?.name}\nTrait: ${trait}\n\nWrite only the backstory, no labels.`;
      const text = await callAPI([{ role: 'user', content: prompt }], 'You are a character backstory writer for a tabletop RPG. Write vivid, short backstories.');
      setBackstory(text.trim());
    } catch (e) {
      showNotif('Backstory generation failed', 'error');
    } finally {
      setGeneratingBackstory(false);
    }
  }

  function save() {
    const cls = DND_CLASSES.find(c => c.id === selectedClass) || DND_CLASSES[0];
    const player = {
      name: name || `Player ${idx + 1}`,
      age: age || 'Unknown',
      role: role || 'Adventurer',
      trait, bond, flaw, motivation, specialty,
      backstory,
      class: cls.id, classIcon: cls.icon, className: cls.name,
      special: cls.special || '',
      hp: cls.hp, maxHp: cls.hp,
      str: cls.str, dex: cls.dex, int: cls.int, wis: cls.wis, con: cls.con,
      color, colorName,
      inventory: [], status: 'active',
      level: 1, xp: 0,
    };

    const players = [...(state.players || [])];
    players[idx] = player;

    if (idx < state.playerCount - 1) {
      // More players to create
      set({ players, setupIdx: idx + 1, activePresetId: null, _presetWorld: null, screen: 'presets' });
    } else {
      // All players done — go to quest
      set({ players, activePresetId: null, screen: 'quest' });
    }
  }

  const cls = DND_CLASSES.find(c => c.id === selectedClass);

  return (
    <div className="screen">
      <div className={styles.form}>
        <StepBar currentScreen="character" />

        {/* Player header */}
        <div className={styles.playerHeader}>
          <span className={styles.playerDot} style={{ background: color }} />
          <span className={styles.playerText}>
            {state.playerCount > 1 ? `Player ${idx + 1}: Who Are You?` : 'Who Are You?'}
          </span>
          {state.playerCount > 1 && (
            <span className={styles.playerSub}>{idx + 1} of {state.playerCount}</span>
          )}
        </div>

        {/* Identity */}
        <div className={styles.sectionTitle}>Identity</div>
        <div className="form-row">
          <div className="form-group">
            <label>Your Name <button className={styles.sugBtn} onClick={() => suggest(setName, 'name')}>↻</button></label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Zara, Finn, Glorp…" />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input type="text" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 12, Ancient, Unknown" />
          </div>
        </div>
        <div className="form-group">
          <label>Background / Who You Are <button className={styles.sugBtn} onClick={() => suggest(setRole, 'role')}>↻</button></label>
          <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. young apprentice, retired pirate, sentient slime…" />
        </div>
        <div className="form-group">
          <label>One Special Thing About You <span className={styles.opt}>(optional)</span> <button className={styles.sugBtn} onClick={() => suggest(setTrait, 'trait')}>↻</button></label>
          <input type="text" value={trait} onChange={e => setTrait(e.target.value)} placeholder="e.g. can talk to animals, never gets lost…" />
        </div>

        {/* Optional toggle */}
        <button
          className={styles.optionalToggle}
          style={showOptional ? { borderStyle: 'solid', color: 'var(--accent)', borderColor: 'var(--accent)' } : {}}
          onClick={() => setShowOptional(o => !o)}
        >
          {showOptional ? '－ Hide extra details' : '＋ Add more character details (optional)'}
        </button>

        {showOptional && (
          <div className={styles.optionalFields}>
            <div className="form-row">
              <div className="form-group">
                <label>Who do you love? <span className={styles.opt}>(bond)</span></label>
                <input type="text" value={bond} onChange={e => setBond(e.target.value)} placeholder="e.g. my little sibling, my crew…" />
              </div>
              <div className="form-group">
                <label>What gets you in trouble? <span className={styles.opt}>(flaw)</span></label>
                <input type="text" value={flaw} onChange={e => setFlaw(e.target.value)} placeholder="e.g. too curious, never asks for help…" />
              </div>
            </div>
            <div className="form-group">
              <label>Why are you on this adventure? <span className={styles.opt}>(motivation)</span></label>
              <input type="text" value={motivation} onChange={e => setMotivation(e.target.value)} placeholder="e.g. find my missing family, prove I'm brave…" />
            </div>
          </div>
        )}

        {/* Backstory generator */}
        <button
          className={styles.backstoryBtn}
          onClick={generateBackstory}
          disabled={generatingBackstory}
        >
          {generatingBackstory ? '✦ Generating…' : '✦ Generate Backstory from these fields →'}
        </button>
        {backstory && <div className={styles.backstoryPreview}>{backstory}</div>}

        {/* Class picker */}
        <div className={styles.divider} />
        <div className={styles.sectionTitle}>Choose Your Class</div>
        <div className={styles.classSub}>What kind of adventurer are you?</div>
        <div className={styles.classGrid}>
          {DND_CLASSES.map(c => (
            <button
              key={c.id}
              className={`${styles.classPill} ${selectedClass === c.id ? styles.classSelected : ''}`}
              onClick={() => setClass(c.id)}
            >
              <span className={styles.classIcon}>{c.icon}</span>
              <div className={styles.className}>{c.name}</div>
              <div className={styles.classDesc}>{c.desc}</div>
            </button>
          ))}
        </div>

        {cls && (
          <div className={styles.abilityBadge}>
            <span className={styles.abilityIcon}>⚡</span>
            <span>{cls.special}</span>
          </div>
        )}

        <div className="form-group" style={{ marginTop: '0.6rem' }}>
          <label>Your Superpower <span className={styles.opt}>(optional — one amazing thing you can do)</span></label>
          <input type="text" value={specialty} onChange={e => setSpecialty(e.target.value)} placeholder="e.g. can climb anything, always finds hidden doors…" />
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className="btn-ghost" onClick={() => set({ screen: 'presets', activePresetId: null })}>← Back</button>
          <button className="btn-primary" onClick={save}>
            {idx === state.playerCount - 1 ? 'Done — Choose Quest →' : `Next: Player ${idx + 2} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
