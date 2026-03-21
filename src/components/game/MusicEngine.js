// ═══════════════════════════════════════════
//  MIDI-STYLE MUSIC ENGINE v2
//  Tracks react to: scene type + time of day
//  + emotional tone of the story.
//  Crossfade between all transitions.
// ═══════════════════════════════════════════

const N = {
  C2:65.41,D2:73.42,E2:82.41,G2:98,A2:110,B2:123.47,
  C3:130.81,D3:146.83,Eb3:155.56,E3:164.81,F3:174.61,G3:196,Ab3:207.65,A3:220,Bb3:233.08,B3:246.94,
  C4:261.63,Db4:277.18,D4:293.66,Eb4:311.13,E4:329.63,F4:349.23,Gb4:369.99,G4:392,Ab4:415.3,A4:440,Bb4:466.16,B4:493.88,
  C5:523.25,D5:587.33,Eb5:622.25,E5:659.25,F5:698.46,G5:783.99,A5:880,Bb5:932.33,
  _:0,
};

// ── Track library ──────────────────────────
// Each track: bpm, wave, gain, reverb, melody[], durs[], bass[], bassDurs[]
export const TRACKS = {

  // ── ADVENTURE ─────────────────────────────
  adventure_day: {
    label:'⚔ Adventure (Day)', bpm:112, wave:'triangle', gain:.18, reverb:.25,
    melody:['E4','E4','G4','A4','_','A4','G4','E4','D4','E4','_','G4','A4','B4','_','A4'],
    durs:  [.5,  .5,  .5,  1,  .5, .5,  .5,  .5,  .5,  1,  .5,  .5,  .5,  1,  .5, 1],
    bass:  ['C3','G3','A3','F3'], bassDurs:[2,2,2,2],
  },
  adventure_night: {
    label:'⚔ Adventure (Night)', bpm:88, wave:'triangle', gain:.15, reverb:.4,
    melody:['A3','_','C4','A3','_','G3','F3','_','G3','A3','_','E3','_','F3','G3','A3'],
    durs:  [1,  .5, .5, .5,  .5, .5,  1,  .5, .5,  1,  1,  1,  .5, .5,  .5,  1],
    bass:  ['A2','E3','F3','C3'], bassDurs:[2,2,2,2],
  },

  // ── DUNGEON ───────────────────────────────
  dungeon_day: {
    label:'💀 Dungeon (Day)', bpm:80, wave:'sawtooth', gain:.13, reverb:.5,
    melody:['A3','_','C4','B3','_','G3','A3','_','F3','G3','A3','_','E3','_','F3','G3'],
    durs:  [1,  .5, .5,  1,  1,  .5,  1,  .5, .5,  .5,  1,  1,  1,  .5, .5,  1],
    bass:  ['A2','E3','A2','G2'], bassDurs:[2,2,2,2],
  },
  dungeon_night: {
    label:'💀 Dungeon (Night)', bpm:60, wave:'sawtooth', gain:.1, reverb:.75,
    melody:['A3','_','_','Eb4','_','D4','_','C4','_','B3','_','_','A3','_','G3','_'],
    durs:  [1,  .5, .5, 1,   .5, 1,  .5, 1,  .5, 1,  .5, .5, 1,  .5, 1,  1],
    bass:  ['A2','_','E3','_'], bassDurs:[2,2,2,2],
  },

  // ── PEACEFUL ──────────────────────────────
  peaceful_day: {
    label:'🌿 Peaceful (Day)', bpm:92, wave:'sine', gain:.18, reverb:.4,
    melody:['C4','E4','G4','E4','C4','D4','F4','A4','F4','D4','E4','G4','B4','G4','E4','C4'],
    durs:  [.5,  .5,  .5,  .5,  1,  .5,  .5,  .5,  .5,  1,  .5,  .5,  .5,  .5,  .5,  1],
    bass:  ['C3','F3','G3','C3'], bassDurs:[2,2,2,2],
  },
  peaceful_night: {
    label:'🌿 Peaceful (Night)', bpm:68, wave:'sine', gain:.14, reverb:.55,
    melody:['G4','E4','_','D4','C4','_','E4','D4','_','C4','B3','_','A3','_','G3','_'],
    durs:  [.5,  .5,  .5, .5,  1,  .5, .5,  .5,  .5, .5,  .5, .5, 1,  .5, 1,  1],
    bass:  ['C3','G2','F3','G3'], bassDurs:[2,2,2,2],
  },

  // ── MYSTERY ───────────────────────────────
  mystery_day: {
    label:'🔮 Mystery (Day)', bpm:84, wave:'sine', gain:.15, reverb:.45,
    melody:['E4','G4','F4','E4','_','D4','F4','E4','D4','C4','_','E4','G4','A4','G4','F4'],
    durs:  [.5,  .5,  .5,  1,  .5, .5,  .5,  .5,  .5,  1,  .5, .5,  .5,  .5,  .5,  .5],
    bass:  ['C3','G3','Bb3','F3'], bassDurs:[2,2,2,2],
  },
  mystery_night: {
    label:'🔮 Mystery (Night)', bpm:65, wave:'sine', gain:.12, reverb:.65,
    melody:['Eb4','_','D4','_','C4','_','Bb3','_','Ab3','_','Bb3','_','C4','_','Eb4','_'],
    durs:  [1,   .5, 1,  .5, 1,  .5, 1,   .5, 1,   .5, .5,  .5, 1,  .5, 1,   1],
    bass:  ['Ab2','Eb3','Bb2','F3'], bassDurs:[2,2,2,2],
  },

  // ── BATTLE ────────────────────────────────
  battle: {
    label:'⚡ Battle', bpm:145, wave:'square', gain:.15, reverb:.18,
    melody:['E4','E4','E4','_','E4','G4','_','A4','G4','E4','_','D4','E4','_','E4','E4','G4','A4'],
    durs:  [.25,.25, .5, .25,.25, .5, .25, .5, .25, .5, .25,.25, .5, .25,.25, .25,.25,  .5],
    bass:  ['A3','A3','E3','A3'], bassDurs:[1,1,1,1],
  },

  // ── TENSE ─────────────────────────────────
  tense: {
    label:'😰 Tense', bpm:98, wave:'sawtooth', gain:.13, reverb:.5,
    melody:['A3','Bb3','A3','_','G3','Ab3','G3','_','F3','Gb3','F3','_','E3','_','F3','A3'],
    durs:  [.25, .25, .5, .5, .25, .25, .5, .5, .25, .25, .5, .5, 1,  .5, .5,  1],
    bass:  ['A2','_','G2','_'], bassDurs:[2,2,2,2],
  },

  // ── TRIUMPHANT ────────────────────────────
  triumphant: {
    label:'🏆 Triumphant', bpm:118, wave:'triangle', gain:.2, reverb:.3,
    melody:['C4','E4','G4','C5','_','B4','A4','G4','E4','G4','A4','_','C5','B4','A4','G4'],
    durs:  [.25, .25, .25, .5, .25, .25, .25, .5, .25, .25, .5, .25, .5, .25, .25, 1],
    bass:  ['C3','G3','F3','G3'], bassDurs:[1,1,1,1],
  },

  // ── SAD ───────────────────────────────────
  sad: {
    label:'😢 Sad', bpm:60, wave:'sine', gain:.14, reverb:.6,
    melody:['A4','G4','F4','E4','_','D4','E4','_','C4','D4','E4','_','A3','_','B3','C4'],
    durs:  [.5,  .5,  .5,  1,  .5, .5,  1,  .5, .5,  .5,  1,  .5, 1,  .5, .5,  1],
    bass:  ['A2','E3','D3','F3'], bassDurs:[2,2,2,2],
  },

  // ── JOYFUL ────────────────────────────────
  joyful: {
    label:'😄 Joyful', bpm:128, wave:'triangle', gain:.19, reverb:.28,
    melody:['C4','D4','E4','G4','E4','D4','C4','_','D4','E4','F4','A4','G4','F4','E4','G4'],
    durs:  [.25, .25, .25, .5, .25, .25, .5, .25, .25, .25, .25, .5, .25, .25, .5,  .5],
    bass:  ['C3','F3','G3','C3'], bassDurs:[1,1,1,1],
  },

  // ── SPACE ─────────────────────────────────
  space: {
    label:'🌌 Space', bpm:58, wave:'sine', gain:.13, reverb:.75,
    melody:['A3','_','E4','_','D4','_','C4','_','G3','_','A3','_','B3','_','C4','_'],
    durs:  [1,   1,  1,  1,  1,  .5,  1,  1,  1,   1,  1,  .5,  1,  .5,  1,  1],
    bass:  ['A2','_','E3','_'], bassDurs:[4,4,4,4],
  },
};

// ── Smart track selector ───────────────────
// Picks the best track from scene type + time + mood
export function selectTrack(sceneType, timeOfDay, mood) {
  const type  = (sceneType  || 'plains').toLowerCase();
  const time  = (timeOfDay  || 'day').toLowerCase();
  const emotion = (mood || '').toLowerCase();

  // Emotion overrides take highest priority
  if (emotion.includes('battle') || emotion.includes('combat') || emotion.includes('fight'))
    return 'battle';
  if (emotion.includes('tense') || emotion.includes('danger') || emotion.includes('fear') || emotion.includes('nervous'))
    return 'tense';
  if (emotion.includes('triumph') || emotion.includes('victory') || emotion.includes('celebrat'))
    return 'triumphant';
  if (emotion.includes('sad') || emotion.includes('grief') || emotion.includes('mourn') || emotion.includes('sorrow'))
    return 'sad';
  if (emotion.includes('joy') || emotion.includes('happy') || emotion.includes('excit') || emotion.includes('cheer'))
    return 'joyful';
  if (emotion.includes('mysteri') || emotion.includes('strange') || emotion.includes('eerie') || emotion.includes('uncanny'))
    return time.includes('night') ? 'mystery_night' : 'mystery_day';

  // Scene type + time of day
  const isNight = time === 'night' || time === 'cave' || time === 'dusk';

  const sceneMap = {
    dungeon:  isNight ? 'dungeon_night' : 'dungeon_day',
    cave:     isNight ? 'dungeon_night' : 'dungeon_day',
    castle:   isNight ? 'mystery_night' : 'mystery_day',
    ruins:    isNight ? 'mystery_night' : 'mystery_day',
    swamp:    isNight ? 'mystery_night' : 'mystery_day',
    forest:   isNight ? 'peaceful_night' : 'peaceful_day',
    plains:   isNight ? 'peaceful_night' : 'peaceful_day',
    village:  isNight ? 'peaceful_night' : 'peaceful_day',
    snow:     isNight ? 'peaceful_night' : 'peaceful_day',
    mountain: isNight ? 'adventure_night' : 'adventure_day',
    ocean:    isNight ? 'adventure_night' : 'adventure_day',
    desert:   isNight ? 'adventure_night' : 'adventure_day',
    city:     isNight ? 'adventure_night' : 'adventure_day',
    space:    'space',
    storm:    'battle',
  };

  return sceneMap[type] || (isNight ? 'adventure_night' : 'adventure_day');
}

// ── Engine state ───────────────────────────
let ctx = null;
let masterGain = null;
let nodes = [];
let active = null;
let preCombatTrack = null;
let scheduler = null;
let masterVol = 0.4;
const CROSSFADE = 0.9;

function initCtx() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
  }
  if (ctx?.state === 'suspended') ctx.resume();
  return ctx;
}

function makeReverb(audioCtx, mix) {
  const conv = audioCtx.createConvolver();
  const len = audioCtx.sampleRate * 2.5;
  const buf = audioCtx.createBuffer(2, len, audioCtx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
  }
  conv.buffer = buf;
  const dry = audioCtx.createGain(); dry.gain.value = 1 - mix;
  const wet = audioCtx.createGain(); wet.gain.value = mix;
  const out = audioCtx.createGain();
  dry.connect(out); conv.connect(wet); wet.connect(out);
  conv._dry = dry; conv._out = out;
  return conv;
}

function resolveNote(n) {
  if (!n || n === '_') return 0;
  const freq = N[n];
  if (freq) return freq;
  // Try resolving the note name dynamically
  return 0;
}

function startTrackInternal(trackId, fadeIn = false) {
  const audioCtx = initCtx();
  if (!audioCtx) return;
  const track = TRACKS[trackId];
  if (!track) return;

  const newMaster = audioCtx.createGain();
  newMaster.gain.value = fadeIn ? 0 : masterVol * track.gain;
  newMaster.connect(audioCtx.destination);

  if (fadeIn) {
    newMaster.gain.setValueAtTime(0, audioCtx.currentTime);
    newMaster.gain.linearRampToValueAtTime(masterVol * track.gain, audioCtx.currentTime + CROSSFADE);
  }

  masterGain = newMaster;
  nodes.push(newMaster);

  const reverb = makeReverb(audioCtx, track.reverb);
  reverb._dry.connect(newMaster);
  reverb._out.connect(newMaster);
  nodes.push(reverb, reverb._dry, reverb._out);

  const spb = 60 / track.bpm;
  const mel  = track.melody.map(n => resolveNote(n));
  const mDur = track.durs;
  const bas  = track.bass.map(n => resolveNote(n));
  const bDur = track.bassDurs;

  let mIdx = 0, bIdx = 0;
  let mTime = audioCtx.currentTime + (fadeIn ? CROSSFADE * 0.4 : 0.05);
  let bTime = audioCtx.currentTime + (fadeIn ? CROSSFADE * 0.4 : 0.05);
  const AHEAD = 3;
  const myId = trackId;

  function schedule() {
    if (!active || active !== myId) return;
    while (mTime < audioCtx.currentTime + AHEAD) {
      const freq = mel[mIdx % mel.length];
      const dur  = mDur[mIdx % mDur.length] * spb;
      if (freq > 0) {
        const osc = audioCtx.createOscillator();
        const env = audioCtx.createGain();
        osc.type = track.wave;
        osc.frequency.value = freq;
        env.gain.setValueAtTime(0, mTime);
        env.gain.linearRampToValueAtTime(0.7, mTime + 0.015);
        env.gain.exponentialRampToValueAtTime(0.001, mTime + dur * 0.88);
        osc.connect(env); env.connect(reverb._dry);
        osc.start(mTime); osc.stop(mTime + dur);
        nodes.push(osc, env);
      }
      mTime += dur;
      mIdx = (mIdx + 1) % mel.length;
    }
    while (bTime < audioCtx.currentTime + AHEAD) {
      const freq = bas[bIdx % bas.length];
      const dur  = bDur[bIdx % bDur.length] * spb;
      if (freq > 0) {
        const osc = audioCtx.createOscillator();
        const env = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        env.gain.setValueAtTime(0, bTime);
        env.gain.linearRampToValueAtTime(0.45, bTime + 0.025);
        env.gain.exponentialRampToValueAtTime(0.001, bTime + dur * 0.72);
        osc.connect(env); env.connect(newMaster);
        osc.start(bTime); osc.stop(bTime + dur);
        nodes.push(osc, env);
      }
      bTime += dur;
      bIdx = (bIdx + 1) % bas.length;
    }
    if (nodes.length > 300) nodes = nodes.filter(n => n === newMaster || n === reverb);
  }

  schedule();
  scheduler = setInterval(schedule, 400);
}

export function playTrack(trackId) {
  if (!trackId || trackId === active) return;
  const audioCtx = initCtx();
  if (!audioCtx) return;

  // Fade out current
  if (masterGain && active) {
    const old = masterGain;
    old.gain.setValueAtTime(old.gain.value, audioCtx.currentTime);
    old.gain.linearRampToValueAtTime(0, audioCtx.currentTime + CROSSFADE);
  }

  if (scheduler) { clearInterval(scheduler); scheduler = null; }

  const oldNodes = [...nodes];
  setTimeout(() => {
    oldNodes.forEach(n => { try { if (n.stop) n.stop(); if (n.disconnect) n.disconnect(); } catch {} });
  }, (CROSSFADE + 0.3) * 1000);
  nodes = [];

  active = trackId;
  startTrackInternal(trackId, true);
}

export function stopMusic() {
  if (scheduler) { clearInterval(scheduler); scheduler = null; }
  if (masterGain && ctx) {
    masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + CROSSFADE);
    const old = [...nodes];
    setTimeout(() => { old.forEach(n => { try { if (n.stop) n.stop(); if (n.disconnect) n.disconnect(); } catch {} }); }, (CROSSFADE + 0.3) * 1000);
  } else {
    nodes.forEach(n => { try { if (n.stop) n.stop(); if (n.disconnect) n.disconnect(); } catch {} });
  }
  nodes = []; active = null; masterGain = null; preCombatTrack = null;
}

export function setMusicVol(v) {
  masterVol = v;
  if (masterGain && ctx) {
    masterGain.gain.setValueAtTime(v * (TRACKS[active]?.gain || 0.15), ctx.currentTime);
  }
}

// Called on each scene update — uses all three signals
export function autoTrackFromScene(sceneType, timeOfDay, mood) {
  if (active === 'battle') return; // don't interrupt combat
  const suggested = selectTrack(sceneType, timeOfDay, mood);
  if (suggested !== active) playTrack(suggested);
}

export function startCombatMusic() {
  if (active !== 'battle') { preCombatTrack = active; playTrack('battle'); }
}

export function endCombatMusic(sceneType, timeOfDay, mood) {
  const returnTo = preCombatTrack || selectTrack(sceneType, timeOfDay, mood);
  preCombatTrack = null;
  playTrack(returnTo);
}

export function getMusicActive() { return active; }
