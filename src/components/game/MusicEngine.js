// ═══════════════════════════════════════════
//  MUSIC ENGINE v4 — Composer Revision
//  Fixes: loop length, percussion, battle
//  strings, MOOD_MAP gaps, trigger guards,
//  tension dissonance, ocean breathing,
//  boss detection, NPC hostile routing.
// ═══════════════════════════════════════════

const N = {
  C2:65.41, D2:73.42, E2:82.41, F2:87.31, G2:98, A2:110, Bb2:116.54, B2:123.47,
  C3:130.81, Cs3:138.59, D3:146.83, Eb3:155.56, E3:164.81,
  F3:174.61, Fs3:185, G3:196, Gs3:207.65, A3:220, Bb3:233.08, B3:246.94,
  C4:261.63, Cs4:277.18, D4:293.66, Eb4:311.13, E4:329.63,
  F4:349.23, Fs4:369.99, G4:392, Gs4:415.3, A4:440, Bb4:466.16, B4:493.88,
  C5:523.25, Cs5:554.37, D5:587.33, Eb5:622.25, E5:659.25,
  F5:698.46, Fs5:739.99, G5:784, A5:880, Bb5:932.33,
  _:0,
};

let ctx = null, rev = null, masterGain = null;
let musicVolume = 0.22, musicMuted = false;
let currentTrackId = null, activeNodes = [], loopTimeout = null;
let preCombatTrack = null, isPlaying = false, fadeTimeout = null;

function getCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = musicVolume;
      masterGain.connect(ctx.destination);
      rev = buildReverb(ctx);
    } catch {}
  }
  if (ctx?.state === 'suspended') ctx.resume();
  return ctx;
}

function buildReverb(c) {
  const rate = c.sampleRate, len = Math.floor(rate * 2.4);
  const buf = c.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++)
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.0);
  }
  const conv = c.createConvolver(); conv.buffer = buf;
  const wet = c.createGain(); wet.gain.value = 0.12;
  const dry = c.createGain(); dry.gain.value = 1.0;
  conv.connect(wet); wet.connect(masterGain); dry.connect(masterGain);
  return { send(node) { node.connect(conv); node.connect(dry); } };
}

// ── Instruments ───────────────────────────

function noteFlute(freq, dur, t, vol) {
  if (!freq || !rev) return [];
  const c = getCtx(); if (!c) return [];
  const g = c.createGain();
  const lfo = c.createOscillator(), lfg = c.createGain();
  lfo.frequency.value = 5.2; lfg.gain.value = freq * 0.005;
  lfo.connect(lfg);
  const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = freq;
  lfg.connect(o.frequency); o.connect(g);
  const atk = Math.min(0.06, dur * 0.12);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + atk);
  g.gain.setValueAtTime(vol, t + dur * 0.72);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.05);
  rev.send(g);
  o.start(t); lfo.start(t); o.stop(t + dur + 0.1); lfo.stop(t + dur + 0.1);
  return [o, lfo];
}

function noteStrings(freq, dur, t, vol, cutoff = 900) {
  if (!freq || !rev) return [];
  const c = getCtx(); if (!c) return [];
  const mix = c.createGain(), lpf = c.createBiquadFilter();
  lpf.type = 'lowpass'; lpf.frequency.value = cutoff; lpf.Q.value = 0.9;
  lpf.connect(mix);
  const oscs = [-10, -4, 0, 4, 10].map(det => {
    const o = c.createOscillator(); o.type = 'sawtooth';
    o.frequency.value = freq; o.detune.value = det;
    o.connect(lpf); return o;
  });
  const atk = Math.min(0.1, dur * 0.18);
  mix.gain.setValueAtTime(0, t);
  mix.gain.linearRampToValueAtTime(vol * 0.17, t + atk);
  mix.gain.setValueAtTime(vol * 0.17, t + dur * 0.7);
  mix.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.12);
  rev.send(mix);
  oscs.forEach(o => { o.start(t); o.stop(t + dur + 0.18); });
  return oscs;
}

function noteBrass(freq, dur, t, vol, bright = false) {
  if (!freq || !rev) return [];
  const c = getCtx(); if (!c) return [];
  const g = c.createGain(), lpf = c.createBiquadFilter();
  lpf.type = 'lowpass'; lpf.Q.value = 2.0;
  lpf.frequency.setValueAtTime(bright ? 2200 : 600, t);
  lpf.frequency.exponentialRampToValueAtTime(bright ? 4800 : 1800, t + 0.04);
  lpf.frequency.exponentialRampToValueAtTime(bright ? 1600 : 1000, t + dur * 0.65);
  const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = freq;
  const sub = c.createOscillator(), sg = c.createGain();
  sub.type = 'sine'; sub.frequency.value = freq * 0.5; sg.gain.value = 0.28;
  o.connect(lpf); lpf.connect(g); sub.connect(sg); sg.connect(g);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.022);
  g.gain.setValueAtTime(vol, t + dur * 0.52);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.1);
  rev.send(g);
  o.start(t); sub.start(t); o.stop(t + dur + 0.15); sub.stop(t + dur + 0.15);
  return [o, sub];
}

function noteBell(freq, dur, t, vol) {
  if (!freq || !rev) return [];
  const c = getCtx(); if (!c) return [];
  const nodes = [];
  [{ r:1, a:1 },{ r:2.756, a:0.45 },{ r:5.404, a:0.2 },{ r:8.933, a:0.08 }]
    .forEach(({ r, a }) => {
      const g = c.createGain(), o = c.createOscillator();
      o.type = 'sine'; o.frequency.value = freq * r;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol * a, t + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.9);
      o.connect(g); rev.send(g);
      o.start(t); o.stop(t + dur + 0.05); nodes.push(o);
    });
  return nodes;
}

function noteHarp(freq, dur, t, vol) {
  if (!freq || !rev) return [];
  const c = getCtx(); if (!c) return [];
  const g = c.createGain(), lpf = c.createBiquadFilter();
  lpf.type = 'lowpass'; lpf.frequency.value = 3800;
  lpf.frequency.exponentialRampToValueAtTime(700, t + 0.3);
  const o1 = c.createOscillator(), o2 = c.createOscillator(), g2 = c.createGain();
  o1.type = 'triangle'; o1.frequency.value = freq;
  o2.type = 'sine'; o2.frequency.value = freq * 2; g2.gain.value = 0.3;
  o1.connect(lpf); o2.connect(g2); g2.connect(lpf); lpf.connect(g);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, t + Math.min(dur, 0.9) + 0.05);
  rev.send(g);
  o1.start(t); o2.start(t); o1.stop(t + 1.0); o2.stop(t + 1.0);
  return [o1, o2];
}

function notePad(freq, dur, t, vol) {
  if (!freq || !rev) return [];
  const c = getCtx(); if (!c) return [];
  const oscs = [];
  [{ d:-16, a:0.5 },{ d:-5, a:0.9 },{ d:0, a:1 },{ d:6, a:0.8 },{ d:16, a:0.5 }]
    .forEach(({ d, a }) => {
      const g = c.createGain(), lfo = c.createOscillator(), lfg = c.createGain();
      lfo.type = 'sine'; lfo.frequency.value = 4.2 + Math.random(); lfg.gain.value = 0.005;
      lfo.connect(lfg);
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = freq;
      o.detune.value = d; lfg.connect(o.detune); o.connect(g);
      const atk = Math.min(0.22, dur * 0.22);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol * a * 0.18, t + atk);
      g.gain.setValueAtTime(vol * a * 0.18, t + dur * 0.6);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.25);
      rev.send(g);
      o.start(t); lfo.start(t); o.stop(t + dur + 0.35); lfo.stop(t + dur + 0.35);
      oscs.push(o, lfo);
    });
  return oscs;
}

function noteBass(freq, dur, t, vol) {
  if (!freq) return [];
  const c = getCtx(); if (!c) return [];
  const g = c.createGain(), lpf = c.createBiquadFilter();
  lpf.type = 'lowpass'; lpf.frequency.value = 300;
  const o1 = c.createOscillator(), o2 = c.createOscillator(), g2 = c.createGain();
  o1.type = 'sine'; o1.frequency.value = freq;
  o2.type = 'triangle'; o2.frequency.value = freq * 2; g2.gain.value = 0.4;
  o1.connect(lpf); o2.connect(g2); g2.connect(lpf); lpf.connect(g);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.04);
  g.gain.setValueAtTime(vol, t + dur * 0.65);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.08);
  g.connect(masterGain);
  o1.start(t); o2.start(t); o1.stop(t + dur + 0.12); o2.stop(t + dur + 0.12);
  return [o1, o2];
}

// 🥁 Percussion — filtered noise bursts with pitch accent
// This is the missing layer — provides rhythmic backbone
function notePerc(type, t, vol) {
  const c = getCtx(); if (!c) return [];
  const bufLen = c.sampleRate * 0.06;
  const buf = c.createBuffer(1, bufLen, c.sampleRate);
  const dat = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++)
    dat[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, type === 'kick' ? 1.2 : 2.5);
  const nb = c.createBufferSource(); nb.buffer = buf;
  const filter = c.createBiquadFilter();
  // kick: low bandpass for thumping feel; snare: high bandpass for crack
  filter.type = type === 'kick' ? 'bandpass' : 'highpass';
  filter.frequency.value = type === 'kick' ? 80 : 2400;
  filter.Q.value = type === 'kick' ? 1.5 : 0.8;
  const g = c.createGain(); g.gain.value = vol * musicVolume * (muted ? 0 : 1);
  // Pitch envelope for kick (makes it sound like a real kick drum)
  if (type === 'kick') {
    const osc = c.createOscillator(); osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.08);
    const og = c.createGain(); og.gain.value = vol * musicVolume * 0.7;
    osc.connect(og); og.connect(masterGain);
    osc.start(t); osc.stop(t + 0.12);
  }
  nb.connect(filter); filter.connect(g); g.connect(masterGain);
  nb.start(t);
  return [nb];
}

// ── Voice player ──────────────────────────
let muted = false; // local alias used by notePerc

function playVoice(instrument, notes, durs, bpm, startTime, vol) {
  const beatSec = 60 / bpm;
  let t = startTime;
  const nodes = [];
  for (let i = 0; i < notes.length; i++) {
    const freq = notes[i], durSec = durs[i] * beatSec;
    if (freq > 0 || instrument === 'kick' || instrument === 'snare') {
      let n;
      switch (instrument) {
        case 'flute':         n = noteFlute(freq, durSec, t, vol); break;
        case 'strings':       n = noteStrings(freq, durSec, t, vol); break;
        case 'strings_bright':n = noteStrings(freq, durSec, t, vol, 1600); break;
        case 'brass':         n = noteBrass(freq, durSec, t, vol); break;
        case 'brass_bright':  n = noteBrass(freq, durSec, t, vol, true); break;
        case 'bell':          n = noteBell(freq, durSec, t, vol); break;
        case 'harp':          n = noteHarp(freq, durSec, t, vol); break;
        case 'pad':           n = notePad(freq, durSec, t, vol); break;
        case 'bass':          n = noteBass(freq, durSec, t, vol); break;
        case 'kick':  if (freq) n = notePerc('kick', t, vol); break;
        case 'snare': if (freq) n = notePerc('snare', t, vol); break;
      }
      if (n) nodes.push(...n);
    }
    t += durSec;
  }
  return nodes;
}

// ═══════════════════════════════════════════
//  TRACK LIBRARY
// ═══════════════════════════════════════════

export const TRACKS = {

  // ── VILLAGE ──────────────────────────────
  village_day: {
    label: '🏘 Village (Day)', bpm: 92, category: 'explore',
    voices: [
      { instrument: 'flute', vol: 0.29, notes: [
        N.G4,N.A4,N.B4,N.D5, N.B4,N.A4,N.G4,N.E4, N.A4,N.B4,N.D5,N.C5, N.B4,N.A4,N.G4,N._,
        N.D5,N.C5,N.B4,N.A4, N.G4,N.A4,N.B4,N.G4, N.A4,N.G4,N.Fs4,N.E4, N.G4,N._,N._,N._,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,1,1,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 1,1,2,0.5,
      ]},
      // Harmony — thirds below melody
      { instrument: 'strings', vol: 0.28, notes: [
        N.E4,N.Fs4,N.G4,N.B4, N.G4,N.Fs4,N.E4,N.C4, N.Fs4,N.G4,N.B4,N.A4, N.G4,N.Fs4,N.E4,N._,
        N.B3,N.A3,N.G3,N.Fs3, N.E3,N.Fs3,N.G3,N.E3, N.Fs3,N.E3,N.D3,N.C3, N.E3,N._,N._,N._,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,1,1,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 1,1,2,0.5,
      ]},
      // Harp alberti bass — 1 and 3 of chord
      { instrument: 'harp', vol: 0.24, notes: [
        N.G3,N.D4,N.G3,N.D4, N.G3,N.D4,N.G3,N.D4, N.D3,N.A3,N.D3,N.A3, N.D3,N.A3,N.D3,N.A3,
        N.G3,N.D4,N.G3,N.D4, N.C4,N.G3,N.C4,N.G3, N.D3,N.A3,N.D3,N.A3, N.G3,N.D4,N.G3,N.B3,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
      ]},
      { instrument: 'bass', vol: 0.26, notes: [
        N.G2,N._,N.D3,N._, N.G2,N._,N.D3,N._, N.D2,N._,N.A2,N._, N.D2,N._,N.G2,N._,
        N.G2,N._,N.D3,N._, N.C3,N._,N.G2,N._, N.D2,N._,N.A2,N._, N.G2,N._,N.G2,N._,
      ], durs: [
        1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1,
        1,1,1,1, 1,1,1,1, 1,1,1,1, 2,2,2,2,
      ]},
    ],
  },

  village_night: {
    label: '🏘 Village (Night)', bpm: 72, category: 'explore',
    voices: [
      { instrument: 'flute', vol: 0.24, notes: [
        N.F4,N._,N.G4,N.A4, N.Bb4,N.A4,N.G4,N._, N.F4,N.G4,N.A4,N.C5, N.Bb4,N._,N.A4,N._,
        N.G4,N._,N.A4,N.Bb4, N.C5,N.Bb4,N.A4,N.G4, N.F4,N._,N.G4,N._, N.F4,N._,N._,N._,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,1,1, 0.5,0.5,0.5,0.5, 1,0.5,0.5,1,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 1,0.5,0.5,1, 2,2,2,2,
      ]},
      { instrument: 'pad', vol: 0.29, notes: [
        N.F3,N._,N.F3,N._, N.Bb2,N._,N.Bb2,N._, N.F3,N._,N.C4,N._, N.F3,N._,N.F3,N._,
        N.G3,N._,N.G3,N._, N.C4,N._,N.C4,N._, N.F3,N._,N.A3,N._, N.F3,N._,N.F3,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4]},
      { instrument: 'harp', vol: 0.32, notes: [
        N.F3,N.C4,N.F3,N.C4, N.Bb2,N.F3,N.Bb2,N.F3, N.F3,N.C4,N.F3,N.C4, N.F3,N.C4,N.F3,N.C4,
        N.G3,N.D4,N.G3,N.D4, N.C3,N.G3,N.C3,N.G3, N.F3,N.A3,N.F3,N.A3, N.F3,N.C4,N.F3,N.C4,
      ], durs: [
        1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1,
        1,1,1,1, 1,1,1,1, 1,1,1,1, 2,2,2,2,
      ]},
      { instrument: 'bass', vol: 0.28, notes: [
        N.F2,N._,N.F2,N._, N.Bb2,N._,N.F2,N._, N.F2,N._,N.C3,N._, N.F2,N._,N.F2,N._,
        N.G2,N._,N.G2,N._, N.C3,N._,N.G2,N._, N.F2,N._,N.A2,N._, N.F2,N._,N.F2,N._,
      ], durs: [
        1,1,1,1, 1,1,1,1, 1,1,1,1, 2,2,2,2,
        1,1,1,1, 1,1,1,1, 1,1,1,1, 4,4,4,4,
      ]},
    ],
  },

  // ── FOREST ───────────────────────────────
  forest_day: {
    label: '🌲 Forest (Day)', bpm: 76, category: 'explore',
    voices: [
      // Pentatonic melody — E A B D E (Ghibli feel)
      { instrument: 'flute', vol: 0.3, notes: [
        N.E4,N._,N.A4,N.B4, N.D5,N.B4,N.A4,N._, N.E4,N.A4,N.B4,N.D5, N.B4,N._,N.A4,N._,
        N.E4,N.D4,N.A3,N._, N.B3,N.A3,N.E3,N._, N.A3,N.B3,N.D4,N.E4, N.A4,N._,N._,N._,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,1,1, 0.5,0.5,0.5,0.5, 1,0.5,0.5,2,
        0.5,0.5,0.5,0.5, 1,0.5,0.5,1, 0.5,0.5,0.5,0.5, 2,2,2,2,
      ]},
      // Strings — sustained chord tones, contrary motion to melody
      { instrument: 'strings', vol: 0.26, notes: [
        N.A3,N._,N.A3,N._, N.A3,N._,N.G3,N._, N.A3,N._,N.D4,N._, N.B3,N._,N.A3,N._,
        N.A3,N._,N.E3,N._, N.E3,N._,N.A3,N._, N.A3,N._,N.D4,N._, N.E4,N._,N._,N._,
      ], durs: [
        1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1,
        1,1,1,1, 1,1,1,1, 1,1,1,1, 4,4,4,4,
      ]},
      // Bell — sparse, irregular hits for wood/nature feel
      { instrument: 'bell', vol: 0.28, notes: [
        N._,N._,N.B4,N._, N._,N._,N._,N.D5, N._,N.A4,N._,N._, N.B4,N._,N._,N._,
        N._,N._,N._,N.E4, N._,N._,N.A4,N._, N._,N.D5,N._,N.B4, N.A4,N._,N._,N._,
      ], durs: [
        1,1,1,1, 1,1,1,1, 1,1,1,1, 2,2,2,2,
        1,1,1,1, 1,1,1,1, 1,1,1,1, 4,4,4,4,
      ]},
      { instrument: 'bass', vol: 0.26, notes: [
        N.A2,N._,N.A2,N._, N.A2,N._,N.G2,N._, N.D3,N._,N.A2,N._, N.E2,N._,N.A2,N._,
        N.A2,N._,N.E2,N._, N.E2,N._,N.A2,N._, N.D3,N._,N.A2,N._, N.A2,N._,N.A2,N._,
      ], durs: [
        2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2,
        2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4,
      ]},
    ],
  },

  forest_night: {
    label: '🌲 Forest (Night)', bpm: 60, category: 'explore',
    voices: [
      { instrument: 'flute', vol: 0.32, notes: [
        N.D4,N._,N._,N.F4, N.A4,N._,N.G4,N._, N.F4,N._,N.E4,N._, N.D4,N._,N._,N._,
        N.F4,N._,N._,N.A4, N.C5,N._,N.Bb4,N._, N.A4,N._,N.G4,N._, N.F4,N._,N._,N._,
      ], durs: [
        1,1,1,1, 1,1,2,2, 1,1,1,1, 4,4,4,4,
        1,1,1,1, 1,1,2,2, 1,1,1,1, 4,4,4,4,
      ]},
      { instrument: 'pad', vol: 0.32, notes: [
        N.D3,N._,N.D3,N._, N.C3,N._,N.C3,N._, N.Bb2,N._,N.Bb2,N._, N.A2,N._,N.A2,N._,
        N.F3,N._,N.F3,N._, N.Eb3,N._,N.Eb3,N._, N.D3,N._,N.D3,N._, N.A2,N._,N.A2,N._,
      ], durs: [4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4]},
      { instrument: 'bell', vol: 0.18, notes: [
        N.F4,N._,N._,N._, N._,N.A4,N._,N._, N.G4,N._,N._,N._, N._,N._,N.E4,N._,
        N.F4,N._,N.C5,N._, N._,N._,N.Bb4,N._, N.A4,N._,N._,N._, N._,N._,N._,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4, 4,4,4,4]},
      { instrument: 'bass', vol: 0.28, notes: [
        N.D2,N._,N.D2,N._, N.C3,N._,N.C3,N._, N.Bb2,N._,N.Bb2,N._, N.A2,N._,N.A2,N._,
        N.F2,N._,N.F2,N._, N.Eb2,N._,N.Eb2,N._, N.D2,N._,N.D2,N._, N.A2,N._,N.A2,N._,
      ], durs: [4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4]},
    ],
  },

  // ── OCEAN ────────────────────────────────
  ocean_day: {
    label: '🌊 Ocean (Day)', bpm: 98, category: 'explore',
    voices: [
      // BREATHING melody — long notes, silences. Wind Waker reference.
      { instrument: 'flute', vol: 0.29, notes: [
        N.D4,N._,N.Fs4,N._, N.A4,N._,N._,N._, N.B4,N._,N.A4,N._, N.Fs4,N._,N._,N._,
        N.D4,N.E4,N.Fs4,N._, N.A4,N.B4,N._,N._, N.D5,N._,N.A4,N.Fs4, N.D4,N._,N._,N._,
      ], durs: [
        0.5,0.5,1,0.5, 2,0.5,0.5,0.5, 0.5,0.5,1,0.5, 2,2,2,2,
        0.5,0.5,0.5,0.5, 0.5,0.5,1,1, 0.5,0.5,0.5,0.5, 2,2,2,2,
      ]},
      // Harp — wave-like arpeggios, the signature ocean texture
      { instrument: 'harp', vol: 0.28, notes: [
        N.D3,N.Fs3,N.A3,N.D4, N.A3,N.Fs3,N.D3,N.Fs3, N.E3,N.A3,N.Cs4,N.E4, N.A3,N.E3,N.A2,N.E3,
        N.D3,N.A3,N.D4,N.Fs4, N.A3,N.D4,N.Fs4,N.A4, N.B2,N.Fs3,N.B3,N.D4, N.E3,N.A3,N.Cs4,N.E4,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
      ]},
      // Strings — sustained chord pads underneath, like the deep ocean
      { instrument: 'strings', vol: 0.24, notes: [
        N.D3,N._,N.D3,N._, N.A3,N._,N.A3,N._, N.A3,N._,N.E3,N._, N.A3,N._,N.A3,N._,
        N.D3,N._,N.D3,N._, N.Fs3,N._,N.Fs3,N._, N.B2,N._,N.B2,N._, N.E3,N._,N.A3,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2]},
      { instrument: 'bass', vol: 0.25, notes: [
        N.D2,N._,N.D2,N._, N.A2,N._,N.A2,N._, N.A2,N._,N.E2,N._, N.A2,N._,N.A2,N._,
        N.D2,N._,N.D2,N._, N.Fs2,N._,N.Fs2,N._, N.B2,N._,N.B2,N._, N.E2,N._,N.A2,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2]},
    ],
  },

  ocean_night: {
    label: '🌊 Ocean (Night)', bpm: 66, category: 'explore',
    voices: [
      { instrument: 'flute', vol: 0.24, notes: [
        N.Fs4,N._,N._,N.A4, N.B4,N._,N.A4,N.Fs4, N.E4,N._,N._,N._, N.Fs4,N._,N._,N._,
        N.D4,N.Fs4,N.A4,N._, N.B4,N.A4,N.Fs4,N.E4, N.D4,N._,N._,N._, N.Fs4,N._,N._,N._,
      ], durs: [
        1,1,1,1, 0.5,0.5,0.5,0.5, 2,2,2,2, 4,4,4,4,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 4,4,4,4, 4,4,4,4,
      ]},
      { instrument: 'pad', vol: 0.27, notes: [
        N.B3,N._,N.B3,N._, N.Fs3,N._,N.Fs3,N._, N.A3,N._,N.E3,N._, N.B3,N._,N.B3,N._,
        N.D4,N._,N.D4,N._, N.Fs3,N._,N.A3,N._, N.B3,N._,N.B3,N._, N.B3,N._,N.B3,N._,
      ], durs: [4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4]},
      { instrument: 'bell', vol: 0.22, notes: [
        N.B4,N._,N.Fs4,N._, N.E4,N._,N._,N._, N.D4,N._,N.Fs4,N._, N.B4,N._,N._,N._,
        N.A4,N._,N._,N.B4, N.Cs5,N._,N._,N._, N.B4,N._,N.Fs4,N._, N.E4,N._,N._,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4, 2,2,2,2, 4,4,4,4, 2,2,2,2, 4,4,4,4]},
      { instrument: 'bass', vol: 0.26, notes: [
        N.B2,N._,N.B2,N._, N.Fs2,N._,N.Fs2,N._, N.A2,N._,N.E2,N._, N.B2,N._,N.B2,N._,
        N.D3,N._,N.D3,N._, N.Fs3,N._,N.A3,N._, N.B2,N._,N.B2,N._, N.Fs2,N._,N.B2,N._,
      ], durs: [4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4]},
    ],
  },

  // ── DUNGEON ──────────────────────────────
  dungeon: {
    label: '💀 Dungeon', bpm: 64, category: 'explore',
    voices: [
      // Dark Locrian-flavored — A B C E G, sparse
      { instrument: 'strings', vol: 0.29, notes: [
        N.A3,N._,N._,N.C4, N.E4,N._,N.D4,N.C4, N.A3,N._,N._,N._, N.G3,N._,N.A3,N._,
        N.A3,N.C4,N.E4,N._, N.G4,N.E4,N.C4,N.A3, N.Gs3,N._,N.A3,N._, N.A3,N._,N._,N._,
      ], durs: [
        1,1,1,1, 0.5,0.5,0.5,0.5, 2,2,2,2, 1,1,2,2,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 1,1,2,2, 4,4,4,4,
      ]},
      // Pad — sustained dissonant intervals (tritone from bass)
      { instrument: 'pad', vol: 0.25, notes: [
        N.Eb3,N._,N.Eb3,N._, N.D3,N._,N.D3,N._, N.C3,N._,N.C3,N._, N.Eb3,N._,N.Eb3,N._,
        N.Eb3,N._,N.E3,N._, N.G3,N._,N.G3,N._, N.D3,N._,N.Gs3,N._, N.A3,N._,N.A3,N._,
      ], durs: [4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4]},
      // Bell — distant, irregular, like dripping water
      { instrument: 'bell', vol: 0.18, notes: [
        N.A4,N._,N._,N._, N._,N._,N.G4,N._, N._,N.A4,N._,N._, N._,N._,N._,N.C5,
        N._,N._,N.Eb5,N._, N.A4,N._,N._,N._, N._,N._,N._,N.G4, N.A4,N._,N._,N._,
      ], durs: [2,2,4,4, 2,2,4,4, 2,2,2,2, 2,2,2,2, 2,2,4,4, 2,2,4,4, 2,2,2,2, 4,4,4,4]},
      { instrument: 'bass', vol: 0.3, notes: [
        N.A2,N._,N.A2,N._, N.A2,N._,N.A2,N._, N.G2,N._,N.G2,N._, N.A2,N._,N.Eb3,N._,
        N.A2,N._,N.A2,N._, N.A2,N._,N.G2,N._, N.Gs2,N._,N.A2,N._, N.A2,N._,N.A2,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4]},
    ],
  },

  cave: {
    label: '🕳 Cave', bpm: 50, category: 'explore',
    voices: [
      { instrument: 'pad', vol: 0.34, notes: [
        N.Fs3,N._,N.Fs3,N._, N.E3,N._,N.E3,N._, N.Cs3,N._,N.D3,N._, N.Fs3,N._,N.Fs3,N._,
        N.B2,N._,N.Cs3,N._, N.Fs3,N._,N.E3,N._, N.D3,N._,N.D3,N._, N.Fs3,N._,N.Cs3,N._,
      ], durs: [8,8,8,8, 8,8,8,8, 8,8,8,8, 8,8,8,8, 8,8,8,8, 8,8,8,8, 8,8,8,8, 8,8,8,8]},
      { instrument: 'bell', vol: 0.15, notes: [
        N.Cs5,N._,N._,N._, N.B4,N._,N._,N._, N.Fs4,N._,N.A4,N._, N._,N.Cs5,N._,N._,
        N._,N._,N.B4,N._, N._,N.Cs5,N._,N._, N.A4,N._,N._,N._, N.Fs4,N._,N._,N._,
      ], durs: [4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4]},
      { instrument: 'bass', vol: 0.32, notes: [
        N.Fs2,N._,N.Fs2,N._, N.E2,N._,N.E2,N._, N.Cs2,N._,N.D2,N._, N.Fs2,N._,N.Fs2,N._,
        N.B2,N._,N.Cs3,N._, N.Fs2,N._,N.E2,N._, N.D2,N._,N.D2,N._, N.Cs2,N._,N.Fs2,N._,
      ], durs: [8,8,8,8, 8,8,8,8, 8,8,8,8, 8,8,8,8, 8,8,8,8, 8,8,8,8, 8,8,8,8, 8,8,8,8]},
    ],
  },

  // ── CASTLE ───────────────────────────────
  castle_day: {
    label: '🏰 Castle (Day)', bpm: 84, category: 'explore',
    voices: [
      { instrument: 'brass', vol: 0.27, notes: [
        N.D4,N.Fs4,N.A4,N.D5, N.A4,N.Fs4,N.D4,N._, N.E4,N.A4,N.Cs5,N.E5, N.Cs5,N.A4,N.E4,N._,
        N.Fs4,N.A4,N.B4,N.D5, N.B4,N.A4,N.Fs4,N._, N.G4,N.A4,N.B4,N.D5, N.A4,N._,N.D4,N._,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,1,1, 0.5,0.5,0.5,0.5, 0.5,0.5,1,1,
        0.5,0.5,0.5,0.5, 0.5,0.5,1,1, 0.5,0.5,0.5,0.5, 1,0.5,1,0.5,
      ]},
      { instrument: 'strings', vol: 0.28, notes: [
        N.D3,N.A3,N.D4,N.A3, N.D3,N.A3,N.Fs3,N._, N.A2,N.E3,N.A3,N.Cs4, N.A3,N.E3,N.A2,N._,
        N.D3,N.Fs3,N.B3,N.Fs3, N.D3,N.Fs3,N.A3,N._, N.G3,N.B3,N.D4,N.B3, N.A3,N._,N.D3,N._,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,1,1, 0.5,0.5,0.5,0.5, 0.5,0.5,1,1,
        0.5,0.5,0.5,0.5, 0.5,0.5,1,1, 0.5,0.5,0.5,0.5, 1,0.5,1,0.5,
      ]},
      { instrument: 'bass', vol: 0.27, notes: [
        N.D2,N._,N.A2,N._, N.D2,N._,N.Fs2,N._, N.A2,N._,N.E2,N._, N.A2,N._,N.E2,N._,
        N.D2,N._,N.D2,N._, N.D2,N._,N.A2,N._, N.G2,N._,N.D3,N._, N.A2,N._,N.D2,N._,
      ], durs: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 2,2,2,2]},
    ],
  },

  ruins: {
    label: '🏚 Ruins', bpm: 66, category: 'explore',
    voices: [
      { instrument: 'flute', vol: 0.24, notes: [
        N.D4,N.F4,N.A4,N._, N.G4,N.F4,N.Eb4,N._, N.D4,N._,N.C4,N._, N.Bb3,N._,N.A3,N._,
        N.D4,N._,N.F4,N._, N.A4,N.G4,N.F4,N.Eb4, N.D4,N.C4,N._,N._, N.D4,N._,N._,N._,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,1,1, 1,1,1,1, 1,1,2,2,
        1,1,1,1, 0.5,0.5,0.5,0.5, 1,1,2,2, 4,4,4,4,
      ]},
      { instrument: 'pad', vol: 0.27, notes: [
        N.D3,N._,N.F3,N._, N.A3,N._,N.G3,N._, N.Eb3,N._,N.A3,N._, N.D3,N._,N.D3,N._,
        N.D3,N._,N.F3,N._, N.D3,N._,N.Bb2,N._, N.A2,N._,N.C3,N._, N.D3,N._,N.D3,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4, 2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4]},
      { instrument: 'bell', vol: 0.25, notes: [
        N.F4,N._,N.A4,N._, N.G4,N._,N.Eb4,N._, N.D4,N._,N._,N._, N.A3,N._,N._,N._,
        N.F4,N._,N._,N._, N.D4,N._,N.Bb3,N._, N.A3,N._,N.C4,N._, N.D4,N._,N._,N._,
      ], durs: [1,1,1,1, 1,1,1,1, 2,2,4,4, 4,4,4,4, 2,2,2,2, 1,1,1,1, 1,1,1,1, 4,4,4,4]},
      { instrument: 'bass', vol: 0.25, notes: [
        N.D2,N._,N.D2,N._, N.G2,N._,N.A2,N._, N.Eb2,N._,N.A2,N._, N.D2,N._,N.D2,N._,
        N.D2,N._,N.F2,N._, N.D2,N._,N.Bb2,N._, N.A2,N._,N.C3,N._, N.D2,N._,N.D2,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4, 2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4]},
    ],
  },

  // ── LANDSCAPE ────────────────────────────
  desert: {
    label: '🏜 Desert', bpm: 88, category: 'explore',
    voices: [
      // Phrygian dominant E F G# A B C D — authentic Middle Eastern scale
      { instrument: 'flute', vol: 0.27, notes: [
        N.E4,N.F4,N.Gs4,N.A4, N.Gs4,N.F4,N.E4,N._, N.B4,N.A4,N.Gs4,N.F4, N.E4,N._,N._,N._,
        N.E4,N.F4,N.Gs4,N.B4, N.A4,N.Gs4,N.F4,N.E4, N.D4,N.F4,N.A4,N.Gs4, N.E4,N._,N._,N._,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,1,1, 0.5,0.5,0.5,0.5, 2,2,2,2,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 2,2,2,2,
      ]},
      { instrument: 'strings', vol: 0.26, notes: [
        N.E3,N.B3,N.E4,N.B3, N.A3,N.E4,N.A3,N.E3, N.B2,N.Gs3,N.B3,N.E3, N.A2,N.E3,N.A3,N.E2,
        N.E3,N.A3,N.E3,N.A3, N.Gs3,N.E3,N.Gs3,N.E3, N.F3,N.A3,N.F3,N.A3, N.E3,N.E3,N.E3,N.E3,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
      ]},
      { instrument: 'bass', vol: 0.25, notes: [
        N.E2,N._,N.A2,N._, N.E2,N._,N.B2,N._, N.E2,N._,N.A2,N._, N.E2,N._,N.E2,N._,
        N.E2,N._,N.A2,N._, N.E2,N._,N.Gs2,N._, N.A2,N._,N.F2,N._, N.E2,N._,N.E2,N._,
      ], durs: [1,1,1,1, 1,1,1,1, 1,1,1,1, 2,2,2,2, 1,1,1,1, 1,1,1,1, 1,1,1,1, 2,2,2,2]},
    ],
  },

  mountain: {
    label: '⛰ Mountain', bpm: 78, category: 'explore',
    voices: [
      // Big open Em — epic vistas, Skyrim-adjacent
      { instrument: 'brass', vol: 0.26, notes: [
        N.E4,N.G4,N.B4,N._, N.D5,N.B4,N.G4,N.E4, N.Fs4,N.A4,N.D5,N._, N.B4,N.G4,N.E4,N._,
        N.E4,N.B3,N.G4,N.B4, N.E5,N.D5,N.B4,N.G4, N.Fs4,N.E4,N.D4,N.B3, N.E4,N._,N._,N._,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,1,1, 0.5,0.5,1,1,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 2,2,2,2,
      ]},
      { instrument: 'strings', vol: 0.25, notes: [
        N.B3,N._,N.E4,N._, N.G4,N._,N.D4,N.B3, N.D4,N._,N.A3,N.Fs3, N.B3,N._,N.E3,N._,
        N.E3,N._,N.B3,N.G3, N.B4,N._,N.G4,N.E4, N.D4,N._,N.B3,N.Fs3, N.E3,N._,N._,N._,
      ], durs: [
        1,1,1,1, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 1,1,1,1,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 4,4,4,4,
      ]},
      { instrument: 'pad', vol: 0.26, notes: [
        N.E3,N._,N.E3,N._, N.G3,N._,N.D3,N._, N.D3,N._,N.A2,N._, N.B2,N._,N.E3,N._,
        N.E3,N._,N.B2,N._, N.E4,N._,N.G3,N._, N.D3,N._,N.Fs3,N._, N.E3,N._,N.E3,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4]},
      { instrument: 'bass', vol: 0.27, notes: [
        N.E2,N._,N.B2,N._, N.G2,N._,N.D2,N._, N.D2,N._,N.A2,N._, N.B2,N._,N.E2,N._,
        N.E2,N._,N.B2,N._, N.E3,N._,N.G2,N._, N.D2,N._,N.Fs2,N._, N.E2,N._,N.E2,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4]},
    ],
  },

  space: {
    label: '🌌 Space', bpm: 55, category: 'explore',
    voices: [
      // Sparse — long silences, lonely feel
      { instrument: 'bell', vol: 0.24, notes: [
        N.A4,N._,N._,N._, N._,N._,N.E4,N._, N._,N.C5,N._,N._, N.A4,N._,N._,N._,
        N._,N._,N._,N.G4, N.E4,N._,N._,N._, N._,N.A4,N._,N.C5, N._,N._,N._,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4, 2,2,2,2, 4,4,4,4, 2,2,2,2, 8,8,8,8]},
      { instrument: 'pad', vol: 0.26, notes: [
        N.A2,N._,N.A2,N._, N.G2,N._,N.G2,N._, N.A2,N._,N.E3,N._, N.A2,N._,N.A2,N._,
        N.C3,N._,N.C3,N._, N.A2,N._,N.G2,N._, N.E3,N._,N.E3,N._, N.A2,N._,N.A2,N._,
      ], durs: [4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 8,8,8,8]},
      // High flute — like a distant signal
      { instrument: 'flute', vol: 0.22, notes: [
        N.A5,N._,N._,N._, N._,N._,N._,N._, N.G5,N._,N._,N._, N.E5,N._,N._,N._,
        N._,N._,N._,N.A5, N._,N._,N._,N._, N._,N._,N.G5,N._, N._,N._,N._,N._,
      ], durs: [2,2,4,4, 4,4,4,4, 2,2,4,4, 4,4,4,4, 2,2,2,2, 4,4,4,4, 2,2,2,2, 8,8,8,8]},
      { instrument: 'bass', vol: 0.26, notes: [
        N.A2,N._,N.A2,N._, N.G2,N._,N.G2,N._, N.A2,N._,N.E2,N._, N.A2,N._,N.A2,N._,
        N.C3,N._,N.C3,N._, N.A2,N._,N.G2,N._, N.E2,N._,N.A2,N._, N.A2,N._,N.A2,N._,
      ], durs: [4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 8,8,8,8]},
    ],
  },

  plains_day: {
    label: '🌾 Plains (Day)', bpm: 96, category: 'explore',
    voices: [
      { instrument: 'flute', vol: 0.29, notes: [
        N.C4,N.E4,N.G4,N.A4, N.G4,N.E4,N.C4,N.D4, N.E4,N.G4,N.A4,N.C5, N.B4,N.G4,N.E4,N._,
        N.C4,N.D4,N.E4,N.G4, N.A4,N.G4,N.E4,N.C4, N.D4,N.E4,N.Fs4,N.G4, N.A4,N._,N._,N._,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,1,1,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 2,2,2,2,
      ]},
      { instrument: 'strings_bright', vol: 0.26, notes: [
        N.E3,N.G3,N.C4,N.E3, N.F3,N.A3,N.C4,N.F3, N.G3,N.B3,N.D4,N.G3, N.C3,N.G3,N.E4,N.C3,
        N.C3,N.E3,N.G3,N.C4, N.A2,N.E3,N.A3,N.C4, N.D3,N.Fs3,N.A3,N.D4, N.C3,N.E3,N.G3,N.C3,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,1,1,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
      ]},
      { instrument: 'bass', vol: 0.25, notes: [
        N.C2,N._,N.G2,N._, N.F2,N._,N.C3,N._, N.G2,N._,N.D3,N._, N.C2,N._,N.G2,N._,
        N.C2,N._,N.E2,N._, N.A2,N._,N.E3,N._, N.D2,N._,N.A2,N._, N.C2,N._,N.C2,N._,
      ], durs: [1,1,1,1, 1,1,1,1, 1,1,1,1, 2,2,2,2, 1,1,1,1, 1,1,1,1, 1,1,1,1, 2,2,2,2]},
    ],
  },

  swamp: {
    label: '🌿 Swamp', bpm: 56, category: 'explore',
    voices: [
      { instrument: 'pad', vol: 0.31, notes: [
        N.C3,N._,N.C3,N._, N.Bb2,N._,N.Bb2,N._, N.Eb3,N._,N.Eb3,N._, N.C3,N._,N.C3,N._,
        N.Ab2,N._,N.Ab2,N._, N.Bb2,N._,N.Bb2,N._, N.C3,N._,N.Eb3,N._, N.G2,N._,N.C3,N._,
      ], durs: [4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4]},
      { instrument: 'bell', vol: 0.18, notes: [
        N.C5,N._,N._,N._, N.Eb5,N._,N._,N._, N.Bb4,N._,N.C5,N._, N.G4,N._,N._,N._,
        N._,N._,N.Ab4,N._, N.Bb4,N._,N._,N._, N._,N.C5,N._,N._, N.G4,N._,N._,N._,
      ], durs: [2,2,4,4, 2,2,4,4, 2,2,2,4, 4,4,4,4, 2,2,2,4, 2,2,4,4, 2,2,2,4, 4,4,4,4]},
      { instrument: 'bass', vol: 0.29, notes: [
        N.C2,N._,N.C2,N._, N.Bb2,N._,N.Bb2,N._, N.Eb2,N._,N.Eb2,N._, N.C2,N._,N.C2,N._,
        N.Ab2,N._,N.Ab2,N._, N.Bb2,N._,N.Bb2,N._, N.C2,N._,N.Eb2,N._, N.G2,N._,N.C2,N._,
      ], durs: [4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4]},
    ],
  },

  snow: {
    label: '❄ Snow', bpm: 62, category: 'explore',
    voices: [
      // Bell melody first — ice crystal feel
      { instrument: 'bell', vol: 0.35, notes: [
        N.D5,N._,N.A4,N._, N.F4,N._,N.D4,N._, N.E4,N._,N.G4,N._, N.A4,N._,N.F4,N._,
        N.D5,N._,N.C5,N.A4, N.F4,N.E4,N.D4,N._, N.E4,N.G4,N.Bb4,N.A4, N.F4,N._,N.D4,N._,
      ], durs: [
        1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1,
        0.5,0.5,0.5,0.5, 0.5,0.5,1,1, 0.5,0.5,0.5,0.5, 1,0.5,1,0.5,
      ]},
      { instrument: 'flute', vol: 0.35, notes: [
        N._,N._,N.F4,N.A4, N.G4,N.F4,N.E4,N._, N.D4,N.E4,N.F4,N._, N.A4,N.G4,N._,N._,
        N.Bb4,N._,N.A4,N._, N.F4,N._,N.E4,N._, N.G4,N._,N.F4,N.Eb4, N.D4,N._,N._,N._,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,1,1, 0.5,0.5,0.5,0.5, 0.5,0.5,2,2,
        1,1,1,1, 1,1,1,1, 0.5,0.5,0.5,0.5, 2,2,2,2,
      ]},
      { instrument: 'pad', vol: 0.25, notes: [
        N.D3,N._,N.D3,N._, N.C3,N._,N.Bb2,N._, N.A2,N._,N.A2,N._, N.D3,N._,N.D3,N._,
        N.Bb3,N._,N.Bb3,N._, N.F3,N._,N.F3,N._, N.G3,N._,N.G3,N._, N.D3,N._,N.D3,N._,
      ], durs: [4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4]},
      { instrument: 'bass', vol: 0.25, notes: [
        N.D2,N._,N.D2,N._, N.C3,N._,N.Bb2,N._, N.A2,N._,N.A2,N._, N.D2,N._,N.D2,N._,
        N.Bb2,N._,N.Bb2,N._, N.F2,N._,N.F2,N._, N.G2,N._,N.G2,N._, N.D2,N._,N.D2,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4]},
    ],
  },

  // ── BATTLE ───────────────────────────────
  battle: {
    label: '⚔ Battle', bpm: 162, category: 'combat',
    voices: [
      // Em hook: E E G A — B A G F# (the "anime battle" ascending shape)
      { instrument: 'brass_bright', vol: 0.35, notes: [
        N.E4,N.E4,N.G4,N.A4, N.B4,N.A4,N.G4,N.Fs4,
        N.E4,N.Fs4,N.G4,N.A4, N.B4,N._,N.Ds4,N.E4,
        N.E4,N.G4,N.A4,N.B4, N.D5,N.B4,N.A4,N.G4,
        N.Fs4,N.E4,N.Fs4,N.G4, N.A4,N._,N.E4,N._,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 1,0.5,0.25,0.25,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 1,0.5,0.5,1,
      ]},
      // FIX: Strings now alternate chord tones — NOT monotone
      { instrument: 'strings', vol: 0.29, notes: [
        N.E3,N.G3,N.E3,N.G3, N.D3,N.G3,N.D3,N.G3,
        N.A3,N.E3,N.A3,N.E3, N.B3,N.Fs3,N.B3,N.Fs3,
        N.E3,N.B3,N.E3,N.B3, N.D3,N.A3,N.D3,N.A3,
        N.G3,N.D4,N.G3,N.D4, N.E3,N.B3,N.E3,N.B3,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
      ]},
      // Counter-melody bell — 3rds below brass  
      { instrument: 'bell', vol: 0.3, notes: [
        N.G4,N._,N.B4,N._, N.D5,N._,N.B4,N._,
        N.G4,N._,N.A4,N._, N.G4,N._,N.B3,N._,
        N.G4,N._,N.D5,N._, N.B4,N._,N.G4,N._,
        N.D4,N._,N.E4,N._, N.Fs4,N._,N.G4,N._,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
      ]},
      // KICK — on beats 1 and 3 (1 = 1, 3 = 1 beat later since 0.5 dur)
      { instrument: 'kick', vol: 0.36, notes: [
        1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0,
        1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
      ]},
      // SNARE — on beats 2 and 4
      { instrument: 'snare', vol: 0.29, notes: [
        0,0,1,0, 1,0,0,0, 0,0,1,0, 1,0,0,0,
        0,0,1,0, 1,0,0,0, 0,0,1,0, 1,0,0,0,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
      ]},
      { instrument: 'bass', vol: 0.34, notes: [
        N.E2,N.E2,N.G2,N.A2, N.B2,N.B2,N.A2,N.G2,
        N.A2,N.E2,N.A2,N.G2, N.B2,N.B2,N.B2,N.E2,
        N.E2,N.B2,N.E2,N.B2, N.D2,N.A2,N.D2,N.A2,
        N.G2,N.D3,N.G2,N.D3, N.E2,N.B2,N.E2,N.B2,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
      ]},
    ],
  },

  battle_boss: {
    label: '💀 Boss Battle', bpm: 182, category: 'combat',
    voices: [
      // Dm harmonic minor — intense chromatic tension
      { instrument: 'brass_bright', vol: 0.39, notes: [
        N.D4,N._,N.A4,N.Cs5, N.D5,N._,N.A4,N.F4,
        N.D4,N.F4,N.A4,N.Cs4, N.D5,N.Cs5,N.A4,N.F4,
        N.Eb4,N._,N.Bb4,N.D5, N.Cs5,N._,N.Bb4,N.Gs4,
        N.A4,N._,N.F4,N.D4, N.A3,N._,N.Cs4,N._,
      ], durs: [
        0.5,0.5,0.25,0.25, 0.5,0.5,0.25,0.25,
        0.25,0.25,0.25,0.25, 0.25,0.25,0.25,0.25,
        0.5,0.5,0.25,0.25, 0.5,0.5,0.25,0.25,
        0.5,0.5,0.25,0.25, 1,0.5,0.25,0.25,
      ]},
      // Strings — 16th note ostinato with varied pitches (not monotone)
      { instrument: 'strings', vol: 0.32, notes: [
        N.D3,N.F3,N.A3,N.D3, N.F3,N.A3,N.Cs4,N.F3,
        N.D3,N.A3,N.Bb3,N.D3, N.A3,N.E3,N.A3,N.E3,
        N.Eb3,N.Bb3,N.D4,N.Eb3, N.Cs4,N.Gs3,N.Cs4,N.Gs3,
        N.A3,N.F3,N.A3,N.F3, N.E3,N.A3,N.Cs4,N.E3,
      ], durs: [
        0.25,0.25,0.25,0.25, 0.25,0.25,0.25,0.25,
        0.25,0.25,0.25,0.25, 0.25,0.25,0.25,0.25,
        0.25,0.25,0.25,0.25, 0.25,0.25,0.25,0.25,
        0.25,0.25,0.25,0.25, 0.25,0.25,0.25,0.25,
      ]},
      // Kick: every beat (relentless boss feel)
      { instrument: 'kick', vol: 0.39, notes: [
        1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0,
        1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0,
      ], durs: [
        0.25,0.25,0.25,0.25, 0.25,0.25,0.25,0.25,
        0.25,0.25,0.25,0.25, 0.25,0.25,0.25,0.25,
        0.25,0.25,0.25,0.25, 0.25,0.25,0.25,0.25,
        0.25,0.25,0.25,0.25, 0.25,0.25,0.25,0.25,
      ]},
      { instrument: 'snare', vol: 0.34, notes: [
        0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0,
        0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0,
      ], durs: [
        0.25,0.25,0.25,0.25, 0.25,0.25,0.25,0.25,
        0.25,0.25,0.25,0.25, 0.25,0.25,0.25,0.25,
        0.25,0.25,0.25,0.25, 0.25,0.25,0.25,0.25,
        0.25,0.25,0.25,0.25, 0.25,0.25,0.25,0.25,
      ]},
      { instrument: 'bass', vol: 0.37, notes: [
        N.D2,N.D2,N.A2,N.F2, N.D2,N.Cs2,N.D2,N.A2,
        N.Bb2,N.Bb2,N.A2,N.A2, N.D2,N.D2,N.E2,N.E2,
        N.Eb2,N.Bb2,N.D3,N.Eb2, N.Cs3,N.Gs2,N.Cs3,N.Gs2,
        N.A2,N.F2,N.A2,N.F2, N.E2,N.A2,N.Cs3,N.E2,
      ], durs: [
        0.25,0.25,0.25,0.25, 0.25,0.25,0.25,0.25,
        0.25,0.25,0.25,0.25, 0.25,0.25,0.25,0.25,
        0.25,0.25,0.25,0.25, 0.25,0.25,0.25,0.25,
        0.25,0.25,0.25,0.25, 0.25,0.25,0.25,0.25,
      ]},
    ],
  },

  // ── MOOD ─────────────────────────────────

  tension: {
    label: '⚡ Tension', bpm: 80, category: 'mood',
    voices: [
      // FIX: Add tritone dissonance voice — the hallmark of Herrmann-style tension
      // Strings: chromatic rise A→Bb→B→C
      { instrument: 'strings', vol: 0.27, notes: [
        N.A3,N._,N._,N._, N.Bb3,N._,N._,N._, N.B3,N._,N._,N._, N.C4,N._,N.Bb3,N.A3,
        N.A3,N._,N._,N._, N.Bb3,N._,N._,N._, N.B3,N._,N.C4,N._, N.Cs4,N._,N.D4,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 1,1,1,1, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2]},
      // FIX: Tritone voice — Eb above the A (the dissonance that makes it feel tense)
      { instrument: 'pad', vol: 0.28, notes: [
        N.Eb4,N._,N.Eb4,N._, N.E4,N._,N.E4,N._, N.F4,N._,N.F4,N._, N.Fs4,N._,N.Fs4,N._,
        N.Eb4,N._,N.Eb4,N._, N.E4,N._,N.E4,N._, N.F4,N._,N.Fs4,N._, N.G4,N._,N.Gs4,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2]},
      // Kick — subtle, like a heartbeat getting faster
      { instrument: 'kick', vol: 0.35, notes: [
        1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0,
        1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0,
      ], durs: [
        1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1,
        1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1,
      ]},
      { instrument: 'bass', vol: 0.29, notes: [
        N.A2,N._,N.A2,N._, N.Bb2,N._,N.Bb2,N._, N.B2,N._,N.B2,N._, N.C3,N._,N.Bb2,N.A2,
        N.A2,N._,N.A2,N._, N.Bb2,N._,N.Bb2,N._, N.B2,N._,N.C3,N._, N.Cs3,N._,N.D3,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 1,1,1,1, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2]},
    ],
  },

  peaceful: {
    label: '🕊 Peaceful', bpm: 78, category: 'mood',
    voices: [
      { instrument: 'flute', vol: 0.25, notes: [
        N.F4,N.A4,N.C5,N._, N.A4,N.G4,N.F4,N.E4, N.G4,N.Bb4,N.C5,N._, N.A4,N.G4,N.F4,N._,
        N.C4,N.E4,N.G4,N.A4, N.G4,N.F4,N.E4,N.C4, N.F4,N.A4,N.C5,N.A4, N.F4,N._,N._,N._,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,1,1,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 2,2,2,2,
      ]},
      { instrument: 'harp', vol: 0.25, notes: [
        N.F3,N.A3,N.C4,N.F3, N.C3,N.G3,N.C4,N.E3, N.F3,N.Bb3,N.D4,N.F3, N.C3,N.G3,N.C4,N.F3,
        N.A2,N.E3,N.A3,N.C4, N.Bb2,N.F3,N.Bb3,N.D4, N.F3,N.C4,N.F3,N.A3, N.C3,N.G3,N.C4,N.F3,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
      ]},
      { instrument: 'pad', vol: 0.24, notes: [
        N.F3,N._,N.C4,N._, N.F3,N._,N.C3,N._, N.Bb2,N._,N.F3,N._, N.C3,N._,N.F3,N._,
        N.A2,N._,N.E3,N._, N.Bb2,N._,N.F3,N._, N.F3,N._,N.C4,N._, N.F3,N._,N.F3,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4]},
      { instrument: 'bass', vol: 0.26, notes: [
        N.F2,N._,N.C3,N._, N.F2,N._,N.G2,N._, N.Bb2,N._,N.F2,N._, N.C3,N._,N.F2,N._,
        N.A2,N._,N.E3,N._, N.Bb2,N._,N.F2,N._, N.F2,N._,N.C3,N._, N.F2,N._,N.F2,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4]},
    ],
  },

  mysterious: {
    label: '🔮 Mysterious', bpm: 70, category: 'mood',
    voices: [
      // B Locrian — ambiguous, unsettling
      { instrument: 'bell', vol: 0.25, notes: [
        N.B4,N._,N.D5,N.Fs5, N.E5,N._,N.D5,N._, N.B4,N._,N.Gs4,N.B4, N.Cs5,N._,N.A4,N._,
        N.B4,N.D5,N.Fs5,N._, N.E5,N.D5,N.B4,N._, N.A4,N._,N.Gs4,N._, N.B4,N._,N._,N._,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,1,1, 0.5,0.5,0.5,0.5, 0.5,0.5,1.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 1,1,1,1, 2,2,2,2,
      ]},
      { instrument: 'pad', vol: 0.27, notes: [
        N.B3,N._,N.B3,N._, N.Gs3,N._,N.A3,N._, N.B3,N._,N.Cs4,N._, N.A3,N._,N.E3,N._,
        N.B3,N._,N.D4,N._, N.Fs4,N._,N.E4,N._, N.D4,N._,N.A3,N._, N.B3,N._,N.B3,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4]},
      { instrument: 'flute', vol: 0.28, notes: [
        N.Fs5,N._,N._,N._, N.E5,N._,N.D5,N._, N.B4,N.D5,N._,N._, N.Cs5,N._,N._,N._,
        N._,N._,N.Fs5,N._, N.E5,N._,N._,N.B4, N.D5,N._,N.Cs5,N._, N.B4,N._,N._,N._,
      ], durs: [1,1,2,2, 1,1,1,1, 1,1,2,2, 4,4,4,4, 2,2,2,2, 1,1,1,1, 1,1,2,2, 4,4,4,4]},
      { instrument: 'bass', vol: 0.28, notes: [
        N.B2,N._,N.B2,N._, N.Gs2,N._,N.A2,N._, N.B2,N._,N.Cs3,N._, N.A2,N._,N.E2,N._,
        N.B2,N._,N.D3,N._, N.Fs3,N._,N.E3,N._, N.D3,N._,N.A2,N._, N.B2,N._,N.B2,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4]},
    ],
  },

  emotional: {
    label: '💔 Emotional', bpm: 62, category: 'mood',
    voices: [
      // Am — the classic emotional minor
      { instrument: 'strings_bright', vol: 0.32, notes: [
        N.A3,N.C4,N.E4,N._, N.D4,N.C4,N.B3,N.A3, N.G3,N.B3,N.E4,N.D4, N.C4,N.B3,N.A3,N._,
        N.F3,N.A3,N.C4,N._, N.E3,N.G3,N.B3,N._, N.A3,N.C4,N.E4,N.G4, N.A4,N._,N._,N._,
      ], durs: [
        0.5,0.5,1,1, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,1,1.5,
        0.5,0.5,0.5,0.5, 1,1,1,1, 0.5,0.5,0.5,0.5, 2,2,2,2,
      ]},
      { instrument: 'pad', vol: 0.29, notes: [
        N.A3,N._,N.E4,N._, N.F3,N._,N.C4,N._, N.G3,N._,N.D4,N._, N.A3,N._,N.E3,N._,
        N.F3,N._,N.C4,N._, N.E3,N._,N.B3,N._, N.A3,N._,N.E4,N._, N.A3,N._,N.A3,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4]},
      { instrument: 'harp', vol: 0.35, notes: [
        N.A3,N.E4,N.A3,N.E4, N.F3,N.C4,N.F3,N.C4, N.G3,N.D4,N.G3,N.D4, N.A3,N.E4,N.A3,N.E3,
        N.F3,N.C4,N.F3,N.C4, N.E3,N.B3,N.E3,N.B3, N.A3,N.E4,N.A3,N.E4, N.A3,N.E4,N.A3,N.E4,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 1,1,2,2,
      ]},
      { instrument: 'bass', vol: 0.25, notes: [
        N.A2,N._,N.A2,N._, N.F2,N._,N.C3,N._, N.G2,N._,N.D3,N._, N.A2,N._,N.E3,N._,
        N.F2,N._,N.C3,N._, N.E2,N._,N.B2,N._, N.A2,N._,N.E3,N._, N.A2,N._,N.A2,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4]},
    ],
  },

  triumphant: {
    label: '🏆 Triumphant', bpm: 112, category: 'mood',
    voices: [
      { instrument: 'brass_bright', vol: 0.34, notes: [
        N.C4,N.E4,N.G4,N.C5, N.G4,N.E4,N.C4,N.E4, N.G4,N.A4,N.G4,N.F4, N.E4,N.D4,N.C4,N._,
        N.C4,N.E4,N.G4,N.C5, N.A4,N.G4,N.F4,N.E4, N.D4,N.F4,N.A4,N.D5, N.C5,N._,N._,N._,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,1,1,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 2,2,2,2,
      ]},
      { instrument: 'strings_bright', vol: 0.26, notes: [
        N.E3,N.G3,N.C4,N.E3, N.F3,N.A3,N.C4,N.F3, N.G3,N.B3,N.D4,N.G3, N.C3,N.G3,N.E4,N.C3,
        N.E3,N.C4,N.E3,N.C4, N.A3,N.E4,N.A3,N.C4, N.D3,N.A3,N.D4,N.Fs4, N.G3,N.B3,N.D4,N.G3,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,1,1,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
      ]},
      { instrument: 'bell', vol: 0.24, notes: [
        N.G4,N._,N.C5,N._, N.E5,N._,N.D5,N._, N.C5,N._,N.E5,N._, N.G5,N._,N._,N._,
        N.G4,N._,N.C5,N.E5, N.A5,N._,N.G5,N.F5, N.E5,N._,N.D5,N._, N.C5,N._,N._,N._,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 1,1,2,2,
        0.5,0.5,0.25,0.25, 0.25,0.25,0.25,0.25, 0.5,0.5,0.5,0.5, 2,2,2,2,
      ]},
      { instrument: 'kick', vol: 0.29, notes: [
        1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0,
        1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
      ]},
      { instrument: 'bass', vol: 0.29, notes: [
        N.C2,N._,N.G2,N.E2, N.F2,N._,N.C3,N.A2, N.G2,N._,N.D3,N.B2, N.C2,N._,N.G2,N._,
        N.C2,N._,N.E2,N.G2, N.A2,N._,N.E3,N.C3, N.D2,N._,N.A2,N.Fs2, N.G2,N._,N.D3,N.G2,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 1,1,1,1,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
      ]},
    ],
  },

  npc_theme: {
    label: '🧙 NPC', bpm: 82, category: 'mood',
    voices: [
      { instrument: 'flute', vol: 0.25, notes: [
        N.F4,N.A4,N.C5,N.A4, N.G4,N.Bb4,N.A4,N.G4, N.F4,N.G4,N.A4,N.C5, N.Bb4,N.A4,N.G4,N._,
        N.F4,N.A4,N.C5,N.D5, N.C5,N.Bb4,N.A4,N.G4, N.F4,N.A4,N.Bb4,N._, N.F4,N._,N._,N._,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,1,1,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,1,1, 2,2,2,2,
      ]},
      { instrument: 'harp', vol: 0.24, notes: [
        N.F3,N.A3,N.C4,N.F3, N.G3,N.Bb3,N.D4,N.G3, N.A3,N.C4,N.E4,N.A3, N.F3,N.A3,N.C4,N.F3,
        N.F3,N.C4,N.F3,N.A3, N.G3,N.Bb3,N.D4,N.G3, N.F3,N.A3,N.Bb3,N.F3, N.F3,N.C4,N.F3,N.A3,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5,
      ]},
      { instrument: 'pad', vol: 0.24, notes: [
        N.F3,N._,N.A3,N._, N.G3,N._,N.Bb3,N._, N.A3,N._,N.C4,N._, N.F3,N._,N.F3,N._,
        N.F3,N._,N.C4,N._, N.G3,N._,N.D4,N._, N.F3,N._,N.Bb3,N._, N.F3,N._,N.F3,N._,
      ], durs: [1,1,1,1, 1,1,1,1, 1,1,1,1, 2,2,2,2, 1,1,1,1, 1,1,1,1, 1,1,1,1, 4,4,4,4]},
      { instrument: 'bass', vol: 0.26, notes: [
        N.F2,N._,N.F2,N._, N.G2,N._,N.G2,N._, N.A2,N._,N.A2,N._, N.F2,N._,N.F2,N._,
        N.F2,N._,N.C3,N._, N.G2,N._,N.D3,N._, N.F2,N._,N.Bb2,N._, N.F2,N._,N.F2,N._,
      ], durs: [2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 4,4,4,4]},
    ],
  },

  rest: {
    label: '🌙 Rest / Camp', bpm: 60, category: 'mood',
    voices: [
      { instrument: 'flute', vol: 0.3, notes: [
        N.G4,N._,N.B4,N._, N.D5,N._,N.B4,N._, N.A4,N._,N.G4,N._, N.E4,N._,N.D4,N._,
        N.G4,N._,N.A4,N._, N.B4,N._,N.G4,N._, N.A4,N._,N.Fs4,N._, N.G4,N._,N._,N._,
      ], durs: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,2,2, 1,1,1,1, 1,1,1,1, 1,1,1,1, 4,4,4,4]},
      { instrument: 'harp', vol: 0.35, notes: [
        N.G3,N.D4,N.B4,N.G4, N.D3,N.A3,N.D4,N.A3, N.C3,N.G3,N.E4,N.C4, N.G3,N.D4,N.B3,N.G3,
        N.G3,N.B3,N.D4,N.G4, N.E3,N.B3,N.E4,N.B3, N.D3,N.Fs3,N.A3,N.D4, N.G3,N.D4,N.G3,N.D4,
      ], durs: [
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,1,1,
        0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 1,1,2,2,
      ]},
      { instrument: 'pad', vol: 0.26, notes: [
        N.G3,N._,N.G3,N._, N.D3,N._,N.D3,N._, N.C3,N._,N.C3,N._, N.G3,N._,N.G3,N._,
        N.G3,N._,N.E3,N._, N.D3,N._,N.Fs3,N._, N.G3,N._,N.G3,N._, N.G3,N._,N.G3,N._,
      ], durs: [4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4]},
      { instrument: 'bass', vol: 0.24, notes: [
        N.G2,N._,N.G2,N._, N.D2,N._,N.D2,N._, N.C3,N._,N.C3,N._, N.G2,N._,N.G2,N._,
        N.G2,N._,N.E2,N._, N.D2,N._,N.Fs2,N._, N.G2,N._,N.G2,N._, N.G2,N._,N.G2,N._,
      ], durs: [4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4]},
    ],
  },
};

// ── Sequencer ─────────────────────────────

function getLoopDuration(track) {
  const beatSec = 60 / track.bpm;
  return Math.max(...track.voices.map(v =>
    v.durs.reduce((s, d) => s + d, 0) * beatSec
  ));
}

function scheduleTrackOnce(track, startTime) {
  const nodes = [];
  track.voices.forEach(v => {
    const n = playVoice(v.instrument, v.notes, v.durs, track.bpm, startTime, v.vol);
    nodes.push(...n);
  });
  return nodes;
}

function stopAllNodes() {
  activeNodes.forEach(n => { try { n.stop(); } catch {} });
  activeNodes = [];
  if (loopTimeout) { clearTimeout(loopTimeout); loopTimeout = null; }
}

function scheduleLoop(trackId, startTime) {
  const track = TRACKS[trackId];
  if (!track || currentTrackId !== trackId) return;
  const nodes = scheduleTrackOnce(track, startTime);
  activeNodes.push(...nodes);
  const dur = getLoopDuration(track);
  const msUntilNext = Math.max(50, (startTime + dur - getCtx().currentTime - 0.15) * 1000);
  loopTimeout = setTimeout(() => {
    if (currentTrackId === trackId) scheduleLoop(trackId, startTime + dur);
  }, msUntilNext);
}

function crossfadeTo(trackId) {
  const c = getCtx(); if (!c || !masterGain) return;
  if (fadeTimeout) clearTimeout(fadeTimeout);
  const now = c.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(masterGain.gain.value, now);
  masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.1);
  fadeTimeout = setTimeout(() => {
    stopAllNodes();
    if (!trackId || musicMuted) { masterGain.gain.setValueAtTime(0, c.currentTime); return; }
    currentTrackId = trackId;
    const st = c.currentTime + 0.05;
    masterGain.gain.cancelScheduledValues(c.currentTime);
    masterGain.gain.setValueAtTime(0.0001, c.currentTime);
    masterGain.gain.linearRampToValueAtTime(musicVolume, c.currentTime + 1.4);
    scheduleLoop(trackId, st);
    muted = musicMuted;
  }, 1150);
}

// ── Track selection ────────────────────────

const SCENE_MAP = {
  dungeon: { day:'dungeon', night:'dungeon' },
  cave:    { day:'cave',    night:'cave' },
  forest:  { day:'forest_day', night:'forest_night' },
  plains:  { day:'plains_day', night:'peaceful' },
  ocean:   { day:'ocean_day',  night:'ocean_night' },
  castle:  { day:'castle_day', night:'ruins' },
  ruins:   { day:'ruins',      night:'ruins' },
  village: { day:'village_day', night:'village_night' },
  city:    { day:'village_day', night:'village_night' },
  desert:  { day:'desert',     night:'mysterious' },
  mountain:{ day:'mountain',   night:'mountain' },
  space:   { day:'space',      night:'space' },
  swamp:   { day:'swamp',      night:'swamp' },
  snow:    { day:'snow',       night:'snow' },
  tavern:  { day:'village_day', night:'village_night' },
  road:    { day:'plains_day', night:'peaceful' },
  ship:    { day:'ocean_day',  night:'ocean_night' },
  // New scene types
  tower:          { day:'mysterious',  night:'dungeon' },
  temple:         { day:'mysterious',  night:'ruins' },
  shrine:         { day:'peaceful',    night:'mysterious' },
  manor:          { day:'tension',     night:'dungeon' },
  market:         { day:'village_day', night:'village_night' },
  interior:       { day:'peaceful',    night:'peaceful' },
  arena:          { day:'battle',      night:'battle' },
  jail:           { day:'tension',     night:'dungeon' },
  wasteland:      { day:'desert',      night:'tension' },
  jungle:         { day:'forest_day',  night:'forest_night' },
  // Space
  spaceship:      { day:'space',       night:'space' },
  space_station:  { day:'space',       night:'space' },
  alien_planet:   { day:'mysterious',  night:'space' },
  // Western
  prairie:        { day:'plains_day',  night:'peaceful' },
  saloon:         { day:'village_day', night:'village_night' },
  frontier_town:  { day:'plains_day',  night:'peaceful' },
  canyon:         { day:'desert',      night:'tension' },
  mine:           { day:'dungeon',     night:'dungeon' },
  // Horror
  graveyard:      { day:'tension',     night:'dungeon' },
  crypt:          { day:'dungeon',     night:'dungeon' },
  asylum:         { day:'tension',     night:'dungeon' },
  // Cyberpunk
  neon_city:      { day:'tension',     night:'village_night' },
  back_alley:     { day:'tension',     night:'tension' },
  corp_building:  { day:'tension',     night:'tension' },
  // Mythology
  olympus:        { day:'triumphant',  night:'mysterious' },
  underworld:     { day:'dungeon',     night:'dungeon' },
  // Ninja / Samurai
  dojo:           { day:'peaceful',    night:'peaceful' },
  bamboo_forest:  { day:'forest_day',  night:'forest_night' },
  fortress_jp:    { day:'castle_day',  night:'ruins' },
  // Post-Apocalyptic
  bunker:         { day:'tension',     night:'dungeon' },
  ruined_city:    { day:'tension',     night:'tension' },
};

// FIX: Complete MOOD_MAP — covers all values AI can output
const MOOD_MAP = {
  tense:      'tension',   ominous:   'tension',
  horror:     'dungeon',   dark:      'dungeon',
  mysterious: 'mysterious', wonder:   'mysterious', wondrous: 'mysterious',
  peaceful:   'peaceful',  calm:      'peaceful',   romantic: 'peaceful',
  sad:        'emotional', emotional: 'emotional',
  triumphant: 'triumphant', victory:  'triumphant', exciting: 'triumphant',
  joyful:     'triumphant',
  battle:     null, // handled by startCombatMusic, not autoTrack
  funny:      'npc_theme', // light and bouncy
  scary:      'tension',
};

function selectTrack(sceneType, time, mood) {
  if (mood && MOOD_MAP[mood] !== undefined) {
    if (MOOD_MAP[mood] === null) return currentTrackId; // preserve current (e.g. battle)
    return MOOD_MAP[mood];
  }
  const slot = (time === 'night' || time === 'cave') ? 'night' : 'day';
  return SCENE_MAP[sceneType]?.[slot] || (slot === 'night' ? 'peaceful' : 'plains_day');
}

// ── Public API ────────────────────────────

export function playTrack(trackId) {
  if (!TRACKS[trackId]) return;
  if (currentTrackId === trackId && isPlaying) return;
  isPlaying = true;
  crossfadeTo(trackId);
}

export function stopMusic() {
  isPlaying = false;
  crossfadeTo(null);
  currentTrackId = null;
}

// FIX: autoTrackFromScene now guards against overriding combat music
export function autoTrackFromScene(sceneType, time, mood) {
  if (!isPlaying) return;
  if (['battle','battle_boss'].includes(currentTrackId)) return;
  const suggested = selectTrack(sceneType, time, mood);
  if (suggested && suggested !== currentTrackId) playTrack(suggested);
}

export function startCombatMusic(isBoss = false) {
  preCombatTrack = currentTrackId;
  playTrack(isBoss ? 'battle_boss' : 'battle');
}

export function endCombatMusic(sceneType, time, mood) {
  const returnTo = preCombatTrack || selectTrack(sceneType, time, mood) || 'peaceful';
  preCombatTrack = null;
  playTrack(returnTo);
}

export function playVictoryMusic() {
  if (!isPlaying) return;
  const prev = currentTrackId;
  playTrack('triumphant');
  setTimeout(() => { if (currentTrackId === 'triumphant') playTrack(prev || 'peaceful'); }, 13000);
}

// FIX: NPC music — only change if friendly, never override combat
export function playNpcMusic(relationship = 'friendly') {
  if (['battle','battle_boss'].includes(currentTrackId)) return;
  if (!isPlaying) return;
  if (relationship === 'friendly' || relationship === 'neutral') {
    // Only switch to NPC theme if currently on a scene track — preserve mood tracks
    const current = TRACKS[currentTrackId];
    if (current?.category === 'explore') playTrack('npc_theme');
  } else if (relationship === 'enemy') {
    // Hostile NPC appearance — build tension before combat starts
    if (TRACKS[currentTrackId]?.category === 'explore') playTensionMusic();
  }
}

export function playDiscoveryStinger() {
  if (!isPlaying) return;
  if (['battle','battle_boss'].includes(currentTrackId)) return;
  const prev = currentTrackId;
  playTrack('mysterious');
  setTimeout(() => { if (currentTrackId === 'mysterious') playTrack(prev || 'peaceful'); }, 16000);
}

export function playEmotionalMusic() {
  if (!isPlaying) return;
  if (['battle','battle_boss'].includes(currentTrackId)) return;
  playTrack('emotional');
}

export function playRestMusic() {
  if (!isPlaying) return;
  playTrack('rest');
}

export function playTensionMusic() {
  if (!isPlaying) return;
  if (['battle','battle_boss'].includes(currentTrackId)) return;
  playTrack('tension');
}

export function setMusicVol(v) {
  musicVolume = Math.max(0, Math.min(1, v));
  if (masterGain && isPlaying) masterGain.gain.value = musicVolume;
}

export function getMusicVol()    { return musicVolume; }
export function getMusicActive() { return isPlaying ? currentTrackId : null; }

export function setMusicMuted(m) {
  musicMuted = m; muted = m;
  if (masterGain) masterGain.gain.value = m ? 0 : (isPlaying ? musicVolume : 0);
}

export function getMusicMuted() { return musicMuted; }
