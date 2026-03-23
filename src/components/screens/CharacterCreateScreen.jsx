import { useState, useRef, useEffect } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import { PLAYER_COLORS } from '../../lib/constants.js';
import { getStartingGear, getSpecial } from '../../data/startingGear.js';
import { GENRES, getGenreArchetypes, detectGenre, ARCHETYPE_ICONS, ARCHETYPES } from '../../data/archetypes.js';
import { CHAR_PRESETS } from '../../data/presets.js';
import { DND_CLASSES } from '../../data/classes.js';
import { callAPI } from '../../engine/api.js';
import GameIcon from '../ui/GameIcon.jsx';
import { SFX } from '../game/SoundEngine.js';

import StepBar from '../ui/StepBar.jsx';
import styles from './CharacterCreateScreen.module.css';

// Default worlds per genre — used when archetype characters skip the world screen
const GENRE_DEFAULT_WORLDS = {
  fantasy:    { world: 'A medieval kingdom of ancient magic, hidden dungeons, and legendary swords', location: 'The cobblestone streets of a bustling castle town', tone: 'Epic & Exciting' },
  space:      { world: 'A distant star system with alien civilizations and uncharted worlds', location: 'The observation deck of a battered starship', tone: 'Mysterious & Wondrous' },
  ocean:      { world: 'The Golden Age of Sail — treacherous seas, hidden islands, legendary treasures', location: 'The deck of a weathered ship, open ocean in every direction', tone: 'Epic & Exciting' },
  horror:     { world: 'A shadowed Victorian city where monsters lurk just beyond the gaslight', location: 'A fog-drenched street at the edge of a haunted district', tone: 'Dark & Mysterious' },
  western:    { world: 'The untamed frontier — dusty towns, railroad money, and frontier justice', location: 'A crossroads saloon where outlaws and lawmen share the same whiskey', tone: 'Epic & Exciting' },
  postapoc:   { world: 'A shattered civilization slowly rebuilding from the ashes of the old world', location: 'A fortified settlement on the edge of the wastes', tone: 'Dark & Mysterious' },
  cyberpunk:  { world: 'A neon-soaked megacity where corporations own the law and data is power', location: 'A rain-slicked back alley in the lowest district', tone: 'Dark & Mysterious' },
  mythology:  { world: 'An age of gods and heroes where myth is living truth', location: 'The base of a mountain sacred to the gods', tone: 'Epic & Exciting' },
  fairytale:  { world: 'An enchanted realm where the old magic still holds and every forest has a secret', location: 'The edge of the Whispering Wood at twilight', tone: 'Mysterious & Wondrous' },
  ninja:      { world: 'Feudal Japan in a time of warring clans, hidden arts, and shadow politics', location: 'The rooftops of a city under curfew, moonlight on black tiles', tone: 'Dark & Mysterious' },
  historical: { world: 'A pivotal era of history where empires rise and individuals change the course of nations', location: 'A crossroads tavern where soldiers, merchants and spies all drink together', tone: 'Epic & Exciting' },
};



// Genre picker icons — confirmed working paths
const GENRE_ICONS = {
  fantasy:    'lorc/broadsword',
  space:      'lorc/rocket',
  ocean:      'lorc/anchor',
  horror:     'lorc/ghost',
  western:    'lorc/law-star',
  postapoc:   'lorc/radioactive',
  cyberpunk:  'lorc/android-mask',
  mythology:  'lorc/zeus-sword',
  fairytale:  'lorc/fairy',
  ninja:      'lorc/plain-dagger',
  historical: 'lorc/crossed-axes',
};


// ── Random preset name pools ───────────────
const RANDOM_NAMES = {
  fantasy:    ['Eryn','Cael','Thora','Brin','Oskar','Lyra','Dex','Mira','Flynn','Zara'],
  space:      ['Nova','Hex','Dax','Lyra','Zephyr','Orion','Vega','Axel','Cass','Juno'],
  ocean:      ['Reef','Coral','Drake','Maren','Salty','Wren','Cove','Finn','Pearl','Tide'],
  horror:     ['Mira','Cain','Vesper','Ash','Raven','Cole','Nyx','Victor','Dusk','Wren'],
  western:    ['Buck','Mae','Colt','Dusty','June','Hank','Willa','Jesse','Ada','Clint'],
  postapoc:   ['Rust','Gravel','Nova','Grit','Wren','Ash','Cinder','Raze','Sable','Zinc'],
  cyberpunk:  ['Nyx','Flux','Cipher','Vex','Chrome','Glitch','Dax','Vero','Haze','Byte'],
  mythology:  ['Ares','Lyra','Castor','Thea','Zeno','Clio','Atlas','Iris','Ajax','Phoebe'],
  fairytale:  ['Elara','Bram','Sable','Pip','Wren','Crispin','Mira','Theo','Fern','Lark'],
  ninja:      ['Ryo','Hana','Kenji','Yuki','Shin','Aoi','Takeru','Saya','Ren','Nami'],
  historical: ['Marcus','Ada','Gaius','Lyra','Cassius','Thea','Brutus','Vera','Felix','Julia'],
};

const RANDOM_BACKGROUNDS = [
  'grew up with nothing and learned to make do',
  'lost everything once and rebuilt from scratch',
  'was the last person anyone expected to be a hero',
  'carries a secret they have never told anyone',
  'was trained by someone who then betrayed them',
  'spent years running before deciding to stop',
  'has a reputation in three towns for very different reasons',
  'once made a promise they are still trying to keep',
  'survived something that should have killed them',
  'is looking for one specific person',
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomizeName(genreId) {
  const pool = RANDOM_NAMES[genreId] || RANDOM_NAMES.fantasy;
  return randomFrom(pool);
}

// ── Archetype Card ─────────────────────────
function ArchetypeCard({ archetype, onSelect }) {
  return (
    <button className={styles.archetypeCard} onClick={() => onSelect(archetype)}>
      <div className={styles.archetypeIcon}>
        {archetype.gameIcon
          ? <GameIcon path={archetype.gameIcon} size={36} tint="accent" />
          : <span style={{ fontSize: '1.8rem' }}>{archetype.icon}</span>
        }
      </div>
      <div className={styles.archetypeName}>{archetype.name}</div>
      <div className={styles.archetypeDesc}>{archetype.desc}</div>
    </button>
  );
}

// ── AI Chat for free-form ──────────────────
function AiChat({ description, genre, playerIdx, playerCount, onGenerated, onBack }) {
  const { state } = useGame();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState('questioning'); // questioning | generating
  const inputRef = useRef(null);
  const chatRef = useRef(null);

  // Start the conversation
  useEffect(() => {
    startChat();
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  async function startChat() {
    setLoading(true);
    const isSparse = description.trim().length < 20 || description.trim().split(' ').length < 4;
    const questName = state.goal?.name || 'an adventure';
    const worldDesc = state.world?.world || '';

    const prompt = isSparse
      ? `A player wants to create a character for a ${genre} adventure called "${questName}". Their description was very brief: "${description}". Ask them 1-2 short multiple-choice questions to help build their character. Make the choices vivid and specific. Format as a short friendly message followed by the questions. Keep it to under 80 words total.`
      : `A player wants to create a character for a ${genre} adventure called "${questName}". Their description: "${description}". Ask them 2 short focused questions to bring this character to life — one about their past, one about what drives them. Keep it conversational, under 80 words.`;

    try {
      const response = await callAPI(
        [{ role: 'user', content: prompt }],
        'You are a friendly game master helping players create vivid RPG characters. Ask short, exciting questions. Never use bullet points or numbered lists — write naturally. Keep responses under 80 words.'
      );
      setMessages([{ role: 'gm', text: response }]);
    } catch {
      setMessages([{ role: 'gm', text: "Tell me one thing about where your character came from, and one thing they want more than anything." }]);
    }
    setLoading(false);
  }

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    const newMsgs = [...messages, { role: 'player', text: userMsg }];
    setMessages(newMsgs);
    setLoading(true);

    // After player answers, generate the character
    setPhase('generating');
    await generateCharacter(newMsgs);
  }

  async function generateCharacter(chatHistory) {
    const questName = state.goal?.name || 'an adventure';
    const worldDesc = state.world?.world || '';
    const partyContext = (state.players || []).slice(0, playerIdx).filter(p => p?.name)
      .map(p => `${p.name} the ${p.className}`).join(', ');

    const chatSummary = chatHistory.map(m => `${m.role === 'gm' ? 'GM' : 'Player'}: ${m.text}`).join('\n');

    const prompt = `Generate a character for a ${genre} RPG adventure.

Quest: ${questName}
World: ${worldDesc}
${partyContext ? `Party members already created: ${partyContext}` : ''}
Player's description: ${description}
Chat context:
${chatSummary}

Generate a complete character as JSON with these exact fields:
{
  "name": "character name fitting the genre",
  "age": "age as string",
  "role": "background/occupation in 8 words or less",
  "trait": "defining personality trait in one sentence",
  "bond": "what or who they care about most",
  "flaw": "their main weakness or blind spot",
  "motivation": "what drives them on this quest",
  "backstory": "2-3 vivid sentences. Reference the quest and world. ${partyContext ? 'Weave in a connection to the party.' : ''}",
  "className": "one of: warrior, mage, rogue, ranger, healer, bard, spaceranger, pirate — best fit for this character"
}

Respond with ONLY the JSON object, no other text.`;

    try {
      const response = await callAPI(
        [{ role: 'user', content: prompt }],
        'You are a character generator for an RPG. Respond only with valid JSON.'
      );
      const clean = response.replace(/```json|```/g, '').trim();
      const char = JSON.parse(clean);
      onGenerated(char);
    } catch (e) {
      // Fallback character
      onGenerated({
        name: randomizeName(genre),
        age: '25',
        role: description || 'Adventurer',
        trait: 'Determined and resourceful',
        bond: 'The people counting on me',
        flaw: 'Sometimes acts before thinking',
        motivation: 'To see this quest through',
        backstory: `${description || 'An adventurer'} who found themselves drawn into this quest by fate.`,
        className: 'warrior',
      });
    }
    setLoading(false);
  }

  return (
    <div className={styles.chatPanel}>
      <div className={styles.chatHeader}>
        <span className={styles.chatGmIcon}>🎲</span>
        <span className={styles.chatTitle}>The GM has some questions…</span>
      </div>

      <div className={styles.chatMessages} ref={chatRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`${styles.chatMsg} ${msg.role === 'gm' ? styles.gmMsg : styles.playerMsg}`}>
            {msg.role === 'gm' && <span className={styles.chatLabel}>GM</span>}
            <div className={styles.chatText}>{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div className={styles.chatTyping}>
            <span />
            <span />
            <span />
          </div>
        )}
        {phase === 'generating' && loading && (
          <div className={styles.generatingMsg}>✨ Building your character…</div>
        )}
      </div>

      {!loading && phase === 'questioning' && messages.length > 0 && (
        <div className={styles.chatInput}>
          <textarea
            ref={inputRef}
            className={styles.chatTextarea}
            placeholder="Your answer…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            rows={2}
            autoFocus
          />
          <button className={styles.chatSend} onClick={send} disabled={!input.trim()}>
            Send →
          </button>
        </div>
      )}

      <button className={styles.chatBack} onClick={onBack}>← Back</button>
    </div>
  );
}

// ── Confirmation screen ────────────────────
function ConfirmCharacter({ char, playerIdx, playerCount, onConfirm, onBack }) {
  const [name, setName] = useState(char.name || '');
  const [age, setAge] = useState(char.age || '');
  const [gender, setGender] = useState(char.gender || 'unspecified');
  const color = PLAYER_COLORS[playerIdx] || '#c4a84f';

  return (
    <div className={styles.confirmPanel}>
      <div className={styles.confirmHeader} style={{ borderTopColor: color }}>
        <div className={styles.confirmTitle} style={{ color }}>
          {playerCount > 1 ? `Player ${playerIdx + 1} — ` : ''}Your Character
        </div>
        <div className={styles.confirmSub}>Quick edits below — everything else was generated for you</div>
      </div>

      <div className={styles.confirmFields}>
        <div className={styles.confirmField}>
          <label className={styles.confirmLabel}>Name</label>
          <input
            className={styles.confirmInput}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Character name"
          />
        </div>
        <div className={styles.confirmField}>
          <label className={styles.confirmLabel}>Age</label>
          <input
            className={styles.confirmInput}
            value={age}
            onChange={e => setAge(e.target.value)}
            placeholder="Age"
            style={{ width: '80px' }}
          />
        </div>
      </div>

      {/* Gender selector */}
      <div className={styles.genderRow}>
        <span className={styles.confirmLabel}>Pronouns</span>
        <div className={styles.genderBtns}>
          {[
            { id: 'male',       label: 'He / Him'   },
            { id: 'female',     label: 'She / Her'  },
            { id: 'nonbinary',  label: 'They / Them'},
            { id: 'unspecified',label: 'Any'        },
          ].map(g => (
            <button
              key={g.id}
              className={`${styles.genderBtn} ${gender === g.id ? styles.genderBtnActive : ''}`}
              style={gender === g.id ? { borderColor: color, color } : undefined}
              onClick={() => setGender(g.id)}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.confirmDetails}>
        {char.role && <div className={styles.confirmRow}><span className={styles.confirmKey}>Background</span><span className={styles.confirmVal}>{char.role}</span></div>}
        {char.trait && <div className={styles.confirmRow}><span className={styles.confirmKey}>Trait</span><span className={styles.confirmVal}>{char.trait}</span></div>}
        {char.motivation && <div className={styles.confirmRow}><span className={styles.confirmKey}>Motivation</span><span className={styles.confirmVal}>{char.motivation}</span></div>}
        {char.flaw && <div className={styles.confirmRow}><span className={styles.confirmKey}>Flaw</span><span className={styles.confirmVal}>{char.flaw}</span></div>}
        {char.backstory && (
          <div className={styles.confirmBackstory}>{char.backstory}</div>
        )}
        <div className={styles.confirmClass}>
          Class: <strong>{char.className || 'warrior'}</strong>
        </div>
      </div>

      <div className={styles.confirmActions}>
        <button className="btn-ghost" onClick={onBack}>← Regenerate</button>
        <button
          className="btn-primary"
          onClick={() => onConfirm({ ...char, name: name || char.name, age: age || char.age, gender })}
        >
          {playerCount > 1 && playerIdx < playerCount - 1
            ? `Confirm — Next Player →`
            : char.fromArchetype
              ? 'Confirm — Begin the Quest →'
              : 'Confirm — Build the World →'}
        </button>
      </div>
    </div>
  );
}

// ── MAIN SCREEN ────────────────────────────
export default function CharacterCreateScreen() {
  const { state, set } = useGame();
  const idx = state.setupIdx || 0;
  const playerCount = state.playerCount || 1;
  const color = PLAYER_COLORS[idx] || '#c4a84f';

  // Detect genre from world + quest
  const worldText = `${state.world?.world || ''} ${state.goal?.name || ''} ${state.world?.tone || ''}`;
  const detectedGenre = detectGenre(worldText);
  const [genre, setGenre] = useState(detectedGenre);
  const [showGenrePicker, setShowGenrePicker] = useState(false);

  // Sub-flow state
  const [subFlow, setSubFlow] = useState(null); // null | 'archetypes' | 'freeform' | 'chat' | 'confirm'
  const [freeformText, setFreeformText] = useState('');
  const [pendingChar, setPendingChar] = useState(null);

  const archetypes = getGenreArchetypes(genre);
  const genreLabel = GENRES.find(g => g.id === genre)?.label || 'Fantasy';
  const genreIcon  = GENRES.find(g => g.id === genre)?.icon  || '⚔';

  function handleArchetypeSelect(archetype) {
    SFX.click();
    SFX.characterConfirm();
    // Generate character from archetype immediately
    const cls = archetype.classId || 'warrior';
    const name = randomizeName(genre);
    const char = {
      name,
      age: String(Math.floor(Math.random() * 20) + 18),
      role: archetype.desc,
      trait: `A true ${archetype.name} — ${archetype.desc.toLowerCase()}`,
      bond: 'The people who depend on my skills',
      flaw: 'Sometimes my archetype gets in the way of my humanity',
      motivation: `To prove what a ${archetype.name} can accomplish`,
      backstory: `${name} has built a reputation as a ${archetype.name}. ${randomFrom(RANDOM_BACKGROUNDS).charAt(0).toUpperCase() + randomFrom(RANDOM_BACKGROUNDS).slice(1)}.`,
      className: cls,
      archetypeName: archetype.name,   // e.g. "Netrunner", "Samurai", "Gunslinger"
      classIcon: archetype.icon,       // emoji — replaced with game icon in handleConfirm
    };
    setPendingChar({ ...char, fromArchetype: true });
    setSubFlow('confirm');
  }

  function handleFreeformSubmit() {
    if (!freeformText.trim()) return;
    setSubFlow('chat');
  }

  function handleChatGenerated(char) {
    setPendingChar(char);
    setSubFlow('confirm');
  }

  function handleConfirm(char) {
    
    const cls = DND_CLASSES.find(c => c.id === char.className) || DND_CLASSES[0];
    // Use genre-aware game icon path for classIcon (used in scene renderer + story window)
    const genreIconMap = ARCHETYPE_ICONS[genre] || ARCHETYPE_ICONS.fantasy || {};
    const gameIconPath = genreIconMap[cls.id] || 'lorc/broadsword';
    // Resolve archetype display name: archetype path sets it; freeform/chat path needs lookup
    const resolvedArchetypeName = char.archetypeName ||
      (ARCHETYPES[genre] || ARCHETYPES.fantasy)?.[char.roleId || 'mage']?.name ||
      null;
    const newPlayer = {
      name: char.name,
      age: char.age,
      role: char.role,
      trait: char.trait,
      bond: char.bond,
      flaw: char.flaw,
      motivation: char.motivation,
      backstory: char.backstory,
      class: cls.id,
      gender: char.gender || 'unspecified',
      // Display name: use archetypeName if set (e.g. "Netrunner"), else DnD class name
      className: resolvedArchetypeName || cls.name,
      archetypeName: resolvedArchetypeName || null,  // keep for scene renderer lookup
      classIcon: gameIconPath,
      hp: cls.hp, maxHp: cls.hp,
      str: cls.str || 10,
      dex: cls.dex || 10,
      int: cls.int || 10,
      wis: cls.wis || 10,
      con: cls.con || 10,
      xp: 0, level: 1,
      color: PLAYER_COLORS[idx],
      // Genre-aware starting gear and special
      startingGear: getStartingGear(genre, cls.id),
      special: getSpecial(genre, cls.id, cls.special),
    };

    const players = [...(state.players || [])];
    players[idx] = newPlayer;

    if (idx < playerCount - 1) {
      // More players — stay on character screen, flag if this was custom
      const isCustom = !char.fromArchetype;
      set({ players, setupIdx: idx + 1, ...(isCustom ? { hasCustomPlayer: true } : {}) });
      setSubFlow(null);
      setFreeformText('');
      setPendingChar(null);
    } else {
      // Last player
      if (char.fromArchetype) {
        // Archetype character — auto-fill world from genre, skip world screen
        const defaultWorld = GENRE_DEFAULT_WORLDS[genre] || GENRE_DEFAULT_WORLDS.fantasy;
        SFX.transition();
        set({
          players,
          world: { world: defaultWorld.world, location: defaultWorld.location, tone: defaultWorld.tone, extra: '' },
          location: defaultWorld.location,
          screen: 'quest',
        });
      } else {
        // Custom/freeform character — let them define the world
        SFX.transition();
        set({ players, hasCustomPlayer: true, screen: 'world' });
      }
    }
  }

  function handlePresetSelect(preset) {
    const presetClassMap = {
      brave_squire: 'warrior', old_wizard: 'mage', sneaky_thief: 'rogue',
      forest_ranger: 'ranger', space_cadet: 'spaceranger', sea_captain: 'pirate',
      ageless_slime: 'mage', gruff_veteran: 'warrior',
    };

    // Default world per preset genre — skips world screen entirely
    const presetWorlds = {
      brave_squire:  { world: 'A medieval fantasy kingdom with dark dungeons and ancient magic', location: 'The cobblestone streets of a bustling castle town', tone: 'Epic & Exciting',    genre: 'fantasy'  },
      old_wizard:    { world: 'A realm of ancient magic where spells shape reality itself',       location: 'A crumbling wizard tower at the edge of civilization',   tone: 'Mysterious & Wondrous', genre: 'fantasy' },
      sneaky_thief:  { world: 'A sprawling city of merchants, guilds, and shadowy back alleys',  location: 'The rooftops of the merchant quarter at dusk',            tone: 'Epic & Exciting',    genre: 'fantasy'  },
      forest_ranger: { world: 'An ancient wilderness where nature holds secrets and danger',      location: 'The edge of the Whispering Forest at dawn',              tone: 'Mysterious & Wondrous', genre: 'fantasy' },
      space_cadet:   { world: 'A distant star system with alien worlds and uncharted space',      location: 'The observation deck of a battered starship',            tone: 'Mysterious & Wondrous', genre: 'space'   },
      sea_captain:   { world: 'The Golden Age of Piracy — treacherous seas, hidden islands',      location: 'The deck of a weathered ship, open ocean in every direction', tone: 'Epic & Exciting', genre: 'ocean'  },
      ageless_slime: { world: 'A strange world where the impossible is merely improbable',        location: 'A dungeon that seems oddly familiar to a slime',         tone: 'Funny & Silly',      genre: 'fantasy'  },
      gruff_veteran: { world: 'A war-scarred land rebuilding itself after a great conflict',       location: 'A crossroads tavern where old soldiers gather',          tone: 'Dark & Mysterious',  genre: 'historical' },
    };

    const classId = presetClassMap[preset.id] || 'warrior';
    const cls = DND_CLASSES.find(c => c.id === classId) || DND_CLASSES[0];
    const randName = randomizeName(detectedGenre);
    const randBg = randomFrom(RANDOM_BACKGROUNDS);
    const defaultWorld = presetWorlds[preset.id] || presetWorlds.brave_squire;

    const player = {
      ...preset.char,
      name: randName,
      role: preset.char.role + ` — ${randBg}`,
      class: cls.id,
      className: preset.char.className || cls.name,   // use preset's display name if set
      archetypeName: preset.char.className || null,
      classIcon: preset.icon,
      hp: cls.hp, maxHp: cls.hp,
      str: cls.str || 10,
      dex: cls.dex || 10,
      int: cls.int || 10,
      wis: cls.wis || 10,
      con: cls.con || 10,
      xp: 0, level: 1,
      color: PLAYER_COLORS[idx],
      startingGear: getStartingGear(defaultWorld.genre || genre, cls.id),
      special: getSpecial(defaultWorld.genre || genre, cls.id, cls.special),
    };

    const players = [...(state.players || [])];
    players[idx] = player;

    if (idx < playerCount - 1) {
      // More players — stay on character screen
      set({ players, setupIdx: idx + 1 });
    } else {
      // Last player is a preset — always skip world screen.
      // World is auto-filled from the preset's genre. Custom players
      // in a mixed party share this world context.
      SFX.transition();
      set({
        players,
        world: { world: defaultWorld.world, location: defaultWorld.location, tone: defaultWorld.tone, extra: '' },
        location: defaultWorld.location,
        screen: 'quest',
      });
    }
  }

  // ── Genre picker overlay ──
  if (showGenrePicker) {
    return (
      <div className="screen">
        <div className={styles.genrePickerScreen}>
          <div className={styles.genrePickerTitle}>Choose your adventure's genre</div>
          <div className={styles.genreGrid}>
            {GENRES.map(g => (
              <button
                key={g.id}
                className={`${styles.genreBtn} ${g.id === genre ? styles.genreBtnActive : ''}`}
                onClick={() => { setGenre(g.id); setShowGenrePicker(false); }}
              >
                <span className={styles.genreBtnIcon}><GameIcon path={GENRE_ICONS[g.id] || 'lorc/broadsword'} size={28} tint={g.id === genre ? 'accent' : 'muted'} /></span>
                <span className={styles.genreBtnLabel}>{g.label}</span>
              </button>
            ))}
          </div>
          <button className="btn-ghost" style={{ marginTop: '1.5rem' }} onClick={() => setShowGenrePicker(false)}>
            ← Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className={styles.header}>
        <StepBar currentScreen="character" />
      </div>

      <div className={styles.playerBadge} style={{ color }}>
        <span className={styles.playerDot} style={{ background: color }} />
        {playerCount > 1 ? `Player ${idx + 1} of ${playerCount} — ` : ''}Who are you?
      </div>

      {/* Genre detection banner */}
      <div className={styles.genreBanner}>
        <span className={styles.genreDetected}>
          <GameIcon path={GENRE_ICONS[genre] || 'lorc/broadsword'} size={14} tint="accent" style={{marginRight:'0.3rem'}}/> Detected genre: <strong>{genreLabel}</strong>
        </span>
        <button className={styles.changeGenre} onClick={() => setShowGenrePicker(true)}>
          Change genre →
        </button>
      </div>

      {/* Sub-flows */}
      {subFlow === 'chat' && (
        <AiChat
          description={freeformText}
          genre={genreLabel.toLowerCase()}
          playerIdx={idx}
          playerCount={playerCount}
          onGenerated={handleChatGenerated}
          onBack={() => setSubFlow('freeform')}
        />
      )}

      {subFlow === 'confirm' && pendingChar && (
        <ConfirmCharacter
          char={pendingChar}
          playerIdx={idx}
          playerCount={playerCount}
          onConfirm={handleConfirm}
          onBack={() => { setSubFlow(subFlow === 'confirm' && pendingChar?.fromArchetype ? null : 'freeform'); setPendingChar(null); }}
        />
      )}

      {!subFlow && (
        <div className={styles.body}>

          {/* ── CUSTOM — 3 columns wide ── */}
          <div className={styles.customSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>✨ Create Your Character</span>
              <span className={styles.sectionSub}>Recommended — every character is unique to your adventure</span>
            </div>

            {/* Archetype grid */}
            <div className={styles.archetypeGrid}>
              {archetypes.map(a => (
                <ArchetypeCard key={a.roleId} archetype={a} onSelect={handleArchetypeSelect} />
              ))}
            </div>

            {/* Freeform divider */}
            <div className={styles.orDivider}>
              <span className={styles.orLine} />
              <span className={styles.orText}>or describe your own</span>
              <span className={styles.orLine} />
            </div>

            {/* Free-form input */}
            <div className={styles.freeformRow}>
              <textarea
                className={styles.freeformInput}
                placeholder={`Describe your character… e.g. "a scarred bounty hunter who only works for the right cause" or just "mysterious mage"`}
                value={freeformText}
                onChange={e => setFreeformText(e.target.value)}
                rows={2}
              />
              <button
                className={styles.freeformBtn}
                onClick={handleFreeformSubmit}
                disabled={!freeformText.trim()}
              >
                Build Character →
              </button>
            </div>
          </div>

          {/* ── QUICK START — below, smaller ── */}
          <div className={styles.quickSection}>
            <div className={styles.quickHeader}>
              <span className={styles.quickTitle}>⚡ Quick Start</span>
              <span className={styles.quickSub}>Jump straight in — randomized each time</span>
            </div>
            <div className={styles.presetGrid}>
              {CHAR_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  className={styles.presetCard}
                  onClick={() => handlePresetSelect(preset)}
                >
                  <span className={styles.presetIcon}>{preset.icon}</span>
                  <div className={styles.presetInfo}>
                    <div className={styles.presetName}>{preset.name}</div>
                    <div className={styles.presetTagline}>{preset.tagline}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Back nav */}
      {!subFlow && (
        <div className={styles.footer}>
          <button className="btn-ghost" onClick={() => {
            if (idx > 0) set({ setupIdx: idx - 1 });
            else set({ screen: 'players', hasCustomPlayer: false, players: [] });
          }}>
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
