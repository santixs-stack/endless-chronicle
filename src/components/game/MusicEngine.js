// ═══════════════════════════════════════════
//  MIDI-STYLE MUSIC ENGINE
//  Real melodic sequences via Web Audio API
// ═══════════════════════════════════════════

const NOTE = {
  C3:130.81,D3:146.83,E3:164.81,F3:174.61,G3:196,A3:220,B3:246.94,
  C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,B4:493.88,
  C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99,A5:880,
  Bb3:233.08,Eb4:311.13,Ab4:415.3,Bb4:466.16,_:0,
};

const TRACKS = {
  adventure: {
    bpm:108, wave:'triangle', gain:.18, reverb:.3,
    melody:['E4','E4','G4','A4','_','A4','G4','E4','D4','E4','_','G4','A4','B4','_','A4','G4','E4'],
    durs:  [.5,  .5,  .5,  1,  .5, .5,  .5,  .5,  .5,  1,  .5,  .5,  .5,  1,  .5, .5,  .5,  1],
    bass:  ['C3','G3','A3','F3'], bassDurs:[2,2,2,2],
  },
  dungeon: {
    bpm:72, wave:'sawtooth', gain:.12, reverb:.6,
    melody:['A3','_','C4','B3','_','G3','A3','_','F3','G3','A3','_','E3','_','F3','G3'],
    durs:  [1,  .5, .5,  1,  1,  .5,  1,  .5, .5,  .5,  1,  1,  1,  .5, .5,  1],
    bass:  ['A2','E3','A2','G2'], bassDurs:[2,2,2,2],
  },
  mystery: {
    bpm:80, wave:'sine', gain:.15, reverb:.5,
    melody:['E4','G4','F4','E4','_','D4','F4','E4','D4','C4','_','E4','G4','A4','G4','F4','E4'],
    durs:  [.5,  .5,  .5,  1,  .5, .5,  .5,  .5,  .5,  1,  .5, .5,  .5,  .5,  .5,  .5,  1],
    bass:  ['C3','G3','Bb3','F3'], bassDurs:[2,2,2,2],
  },
  battle: {
    bpm:140, wave:'square', gain:.14, reverb:.2,
    melody:['E4','E4','E4','_','E4','G4','_','A4','G4','E4','_','D4','E4','_','E4','E4','G4','A4'],
    durs:  [.25,.25, .5, .25,.25, .5, .25, .5, .25, .5, .25,.25, .5, .25,.25, .25,.25,  .5],
    bass:  ['A3','A3','E3','A3'], bassDurs:[1,1,1,1],
  },
  peaceful: {
    bpm:88, wave:'sine', gain:.16, reverb:.45,
    melody:['C4','E4','G4','E4','C4','D4','F4','A4','F4','D4','E4','G4','B4','G4','E4','C4'],
    durs:  [.5,  .5,  .5,  .5,  1,  .5,  .5,  .5,  .5,  1,  .5,  .5,  .5,  .5,  .5,  1],
    bass:  ['C3','F3','G3','C3'], bassDurs:[2,2,2,2],
  },
  space: {
    bpm:60, wave:'sine', gain:.13, reverb:.7,
    melody:['A3','_','E4','_','D4','_','C4','_','G3','_','A3','_','B3','_','C4','_'],
    durs:  [1,   1,  1,  1,  1,  .5,  1,  1,  1,   1,  1,  .5,  1,  .5,  1,  1],
    bass:  ['A2','_','E3','_'], bassDurs:[4,4,4,4],
  },
};

// Scene type → track mapping
const SCENE_TRACK = {
  dungeon:'dungeon', cave:'dungeon',
  castle:'mystery',  ruins:'mystery', swamp:'mystery',
  forest:'peaceful', plains:'peaceful', village:'peaceful', snow:'peaceful', mountain:'peaceful',
  ocean:'adventure', desert:'adventure', city:'adventure',
  space:'space',
  storm:'battle',
};

let ctx = null, nodes = [], active = null, scheduler = null, masterVol = 0.4;

function initCtx() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
  }
  if (ctx?.state === 'suspended') ctx.resume();
  return ctx;
}

function makeReverb(audioCtx, mix) {
  const conv = audioCtx.createConvolver();
  const len = audioCtx.sampleRate * 2;
  const buf = audioCtx.createBuffer(2, len, audioCtx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
  }
  conv.buffer = buf;
  const dry = audioCtx.createGain(); dry.gain.value = 1 - mix;
  const wet = audioCtx.createGain(); wet.gain.value = mix;
  const out = audioCtx.createGain();
  dry.connect(out); conv.connect(wet); wet.connect(out);
  conv._dry = dry; conv._out = out;
  return conv;
}

export function playTrack(trackId) {
  const audioCtx = initCtx();
  if (!audioCtx) return;
  stopMusic(false);
  const track = TRACKS[trackId];
  if (!track) return;
  active = trackId;

  const master = audioCtx.createGain();
  master.gain.value = masterVol * track.gain;
  master.connect(audioCtx.destination);
  nodes.push(master);

  const reverb = makeReverb(audioCtx, track.reverb);
  reverb._dry.connect(master);
  reverb._out.connect(master);
  nodes.push(reverb, reverb._dry, reverb._out);

  const spb = 60 / track.bpm;
  const mel = track.melody.map(n => NOTE[n] || 0);
  const mDur = track.durs;
  const bas = track.bass.map(n => NOTE[n] || 0);
  const bDur = track.bassDurs;

  let mIdx = 0, bIdx = 0;
  let mTime = audioCtx.currentTime + 0.05;
  let bTime = audioCtx.currentTime + 0.05;
  const AHEAD = 3;

  function schedule() {
    if (!active || active !== trackId) return;
    while (mTime < audioCtx.currentTime + AHEAD) {
      const freq = mel[mIdx % mel.length];
      const dur = mDur[mIdx % mDur.length] * spb;
      if (freq > 0) {
        const osc = audioCtx.createOscillator();
        const env = audioCtx.createGain();
        osc.type = track.wave;
        osc.frequency.value = freq;
        env.gain.setValueAtTime(0, mTime);
        env.gain.linearRampToValueAtTime(0.7, mTime + 0.02);
        env.gain.exponentialRampToValueAtTime(0.001, mTime + dur * 0.85);
        osc.connect(env); env.connect(reverb._dry);
        osc.start(mTime); osc.stop(mTime + dur);
        nodes.push(osc, env);
      }
      mTime += dur;
      mIdx = (mIdx + 1) % mel.length;
    }
    while (bTime < audioCtx.currentTime + AHEAD) {
      const freq = bas[bIdx % bas.length];
      const dur = bDur[bIdx % bDur.length] * spb;
      if (freq > 0) {
        const osc = audioCtx.createOscillator();
        const env = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        env.gain.setValueAtTime(0, bTime);
        env.gain.linearRampToValueAtTime(0.4, bTime + 0.03);
        env.gain.exponentialRampToValueAtTime(0.001, bTime + dur * 0.7);
        osc.connect(env); env.connect(master);
        osc.start(bTime); osc.stop(bTime + dur);
        nodes.push(osc, env);
      }
      bTime += dur;
      bIdx = (bIdx + 1) % bas.length;
    }
    if (nodes.length > 200) nodes = nodes.filter(n => n === master || n === reverb);
  }

  schedule();
  scheduler = setInterval(schedule, 500);
}

export function stopMusic(resetUI = true) {
  if (scheduler) { clearInterval(scheduler); scheduler = null; }
  nodes.forEach(n => { try { if (n.stop) n.stop(); if (n.disconnect) n.disconnect(); } catch {} });
  nodes = []; active = null;
}

export function setMusicVol(v) {
  masterVol = v;
  const mg = nodes.find(n => n.gain);
  if (mg && ctx) mg.gain.setValueAtTime(v * (TRACKS[active]?.gain || 0.15), ctx.currentTime);
}

export function autoTrackFromScene(sceneType) {
  const suggested = SCENE_TRACK[sceneType];
  if (suggested && suggested !== active) playTrack(suggested);
}

export function getMusicActive() { return active; }
export { TRACKS };
