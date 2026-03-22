// ═══════════════════════════════════════════
//  SOUND EFFECTS ENGINE v2 — Full Redesign
//  Every interaction. Every moment.
//  Orchestral instruments + UI sounds.
//  Critique-driven: clicks are tactile,
//  transitions are motion, saves are quiet,
//  and every new event has its own voice.
// ═══════════════════════════════════════════

let ctx = null;
let muted = false;
let sfxVolume = 0.4;
let reverbNode = null;

export function initAudio() {
  if (ctx) return;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    reverbNode = buildReverb(ctx);
  } catch {}
}

function getCtx() {
  if (!ctx) initAudio();
  if (ctx?.state === 'suspended') ctx.resume();
  return ctx;
}

function buildReverb(c) {
  const rate = c.sampleRate;
  const len  = Math.floor(rate * 2.2);
  const buf  = c.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++)
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
  }
  const conv = c.createConvolver(); conv.buffer = buf;
  const wet  = c.createGain(); wet.gain.value = 0.2;
  conv.connect(wet); wet.connect(c.destination);
  return { send(node) { node.connect(conv); node.connect(c.destination); } };
}

function getRev() {
  const c = getCtx(); if (!c) return null;
  if (!reverbNode) reverbNode = buildReverb(c);
  return reverbNode;
}

function v(amplitude) { return muted ? 0 : sfxVolume * amplitude; }

// ── ADSR ──────────────────────────────────
function adsr(g, now, atk, hold, rel, peak) {
  g.gain.setValueAtTime(0.0001, now);
  g.gain.linearRampToValueAtTime(peak, now + atk);
  g.gain.setValueAtTime(peak, now + atk + hold);
  g.gain.exponentialRampToValueAtTime(0.0001, now + atk + hold + rel);
}

// ── Primitive builders ────────────────────

// FIX: Removed Bell's `useReverb` param — always use rev for consistency
function Bell(freq, amp, dur, delay = 0) {
  const c = getCtx(); if (!c) return;
  const rev = getRev(), now = c.currentTime + delay, vv = v(amp);
  if (vv <= 0) return;
  [{ r:1, a:1 }, { r:2.756, a:0.45 }, { r:5.404, a:0.2 }, { r:8.933, a:0.08 }]
    .forEach(({ r, a }) => {
      const g = c.createGain(), o = c.createOscillator();
      o.type = 'sine'; o.frequency.setValueAtTime(freq * r, now);
      adsr(g, now, 0.003, 0.001, dur * 0.9, vv * a);
      o.connect(g); rev ? rev.send(g) : g.connect(c.destination);
      o.start(now); o.stop(now + dur + 0.15);
    });
}

function Strings(freq, amp, dur, delay = 0, cutoff = 900) {
  const c = getCtx(); if (!c) return;
  const rev = getRev(), now = c.currentTime + delay, vv = v(amp);
  if (vv <= 0) return;
  const mix = c.createGain(), lpf = c.createBiquadFilter();
  lpf.type = 'lowpass'; lpf.frequency.value = cutoff; lpf.Q.value = 0.8;
  lpf.connect(mix);
  [-9, -4, 0, 4, 9].forEach(det => {
    const o = c.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(freq, now); o.detune.setValueAtTime(det, now);
    o.connect(lpf);
    o.start(now); o.stop(now + dur + 0.5);
  });
  adsr(mix, now, 0.09, dur * 0.55, dur * 0.45, vv * 0.16);
  rev ? rev.send(mix) : mix.connect(c.destination);
}

function Choir(freq, amp, dur, delay = 0) {
  const c = getCtx(); if (!c) return;
  const rev = getRev(), now = c.currentTime + delay, vv = v(amp);
  if (vv <= 0) return;
  [{ d:-14, a:0.55 }, { d:-5, a:0.9 }, { d:0, a:1 }, { d:6, a:0.8 }, { d:14, a:0.55 }]
    .forEach(({ d, a }) => {
      const g = c.createGain(), lfo = c.createOscillator(), lfg = c.createGain();
      lfo.type = 'sine'; lfo.frequency.value = 4.5 + Math.random() * 1.5; lfg.gain.value = 0.004;
      lfo.connect(lfg);
      const o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(freq, now); o.detune.setValueAtTime(d, now);
      lfg.connect(o.detune); o.connect(g);
      adsr(g, now, 0.2, dur * 0.45, dur * 0.45, vv * a * 0.18);
      rev ? rev.send(g) : g.connect(c.destination);
      o.start(now); lfo.start(now); o.stop(now + dur + 0.6); lfo.stop(now + dur + 0.6);
    });
}

function Brass(freq, amp, dur, delay = 0, bright = false) {
  const c = getCtx(); if (!c) return;
  const rev = getRev(), now = c.currentTime + delay, vv = v(amp);
  if (vv <= 0) return;
  const g = c.createGain(), lpf = c.createBiquadFilter();
  lpf.type = 'lowpass'; lpf.Q.value = 1.8;
  lpf.frequency.setValueAtTime(bright ? 2500 : 700, now);
  lpf.frequency.exponentialRampToValueAtTime(bright ? 5000 : 2000, now + 0.05);
  lpf.frequency.exponentialRampToValueAtTime(bright ? 1800 : 1100, now + dur * 0.6);
  const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(freq, now);
  adsr(g, now, 0.022, dur * 0.5, dur * 0.5, vv);
  o.connect(lpf); lpf.connect(g); rev ? rev.send(g) : g.connect(c.destination);
  o.start(now); o.stop(now + dur + 0.25);
  const sg = c.createGain(), so = c.createOscillator();
  so.type = 'sine'; so.frequency.setValueAtTime(freq * 0.5, now);
  adsr(sg, now, 0.04, dur * 0.4, dur * 0.35, vv * 0.3);
  so.connect(sg); rev ? rev.send(sg) : sg.connect(c.destination);
  so.start(now); so.stop(now + dur + 0.2);
}

function Timpani(freq, amp, delay = 0) {
  const c = getCtx(); if (!c) return;
  const rev = getRev(), now = c.currentTime + delay, vv = v(amp);
  if (vv <= 0) return;
  const g = c.createGain(), o = c.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(freq * 1.35, now);
  o.frequency.exponentialRampToValueAtTime(freq * 0.88, now + 0.055);
  o.frequency.exponentialRampToValueAtTime(freq * 0.62, now + 0.38);
  adsr(g, now, 0.002, 0, 0.52, vv * 1.1);
  o.connect(g); rev ? rev.send(g) : g.connect(c.destination);
  o.start(now); o.stop(now + 0.62);
  const bufLen = Math.floor(c.sampleRate * 0.035);
  const buf = c.createBuffer(1, bufLen, c.sampleRate);
  const dat = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) dat[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 1.8);
  const nb = c.createBufferSource(); nb.buffer = buf;
  const lpf = c.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 280;
  const ng = c.createGain(); ng.gain.value = vv * 0.65;
  nb.connect(lpf); lpf.connect(ng); rev ? rev.send(ng) : ng.connect(c.destination);
  nb.start(now);
}

function Harp(freq, amp, delay = 0) {
  const c = getCtx(); if (!c) return;
  const rev = getRev(), now = c.currentTime + delay, vv = v(amp);
  if (vv <= 0) return;
  const g = c.createGain(), lpf = c.createBiquadFilter();
  lpf.type = 'lowpass';
  lpf.frequency.setValueAtTime(4200, now);
  lpf.frequency.exponentialRampToValueAtTime(900, now + 0.35);
  const o1 = c.createOscillator(), o2 = c.createOscillator();
  o1.type = 'triangle'; o1.frequency.value = freq;
  o2.type = 'sine'; o2.frequency.value = freq * 2;
  adsr(g, now, 0.002, 0, 0.75, vv);
  o1.connect(lpf); o2.connect(lpf); lpf.connect(g);
  rev ? rev.send(g) : g.connect(c.destination);
  o1.start(now); o2.start(now); o1.stop(now + 0.95); o2.stop(now + 0.95);
}

// ── New primitives ────────────────────────

// Noise burst — for whooshes, swooshes, rattles
function Noise(dur, amp, lpFreq, hpFreq, delay = 0) {
  const c = getCtx(); if (!c) return;
  const now = c.currentTime + delay, vv = v(amp);
  if (vv <= 0) return;
  const bufLen = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, bufLen, c.sampleRate);
  const dat = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) dat[i] = Math.random() * 2 - 1;
  const nb = c.createBufferSource(); nb.buffer = buf;
  const g = c.createGain();
  adsr(g, now, 0.005, dur * 0.3, dur * 0.65, vv);
  if (lpFreq) {
    const lpf = c.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = lpFreq;
    nb.connect(lpf); lpf.connect(g);
  } else if (hpFreq) {
    const hpf = c.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.value = hpFreq;
    nb.connect(hpf); hpf.connect(g);
  } else {
    nb.connect(g);
  }
  g.connect(c.destination);
  nb.start(now);
}

// Pure sine tone — clean, non-resonant
function Sine(freq, amp, dur, delay = 0, freqEnd = 0) {
  const c = getCtx(); if (!c) return;
  const rev = getRev(), now = c.currentTime + delay, vv = v(amp);
  if (vv <= 0) return;
  const g = c.createGain(), o = c.createOscillator();
  o.type = 'sine'; o.frequency.setValueAtTime(freq, now);
  if (freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, now + dur);
  adsr(g, now, 0.005, dur * 0.5, dur * 0.45, vv);
  o.connect(g); rev ? rev.send(g) : g.connect(c.destination);
  o.start(now); o.stop(now + dur + 0.1);
}

// Click transient — for UI button press feel
// A very short low-mid sine burst + noise impulse = tactile "press"
function ClickTransient(amp, delay = 0) {
  const c = getCtx(); if (!c) return;
  const now = c.currentTime + delay, vv = v(amp);
  if (vv <= 0) return;
  // Sine click body
  const g = c.createGain(), o = c.createOscillator();
  o.type = 'sine'; o.frequency.setValueAtTime(640, now);
  o.frequency.exponentialRampToValueAtTime(220, now + 0.04);
  g.gain.setValueAtTime(vv, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
  o.connect(g); g.connect(c.destination);
  o.start(now); o.stop(now + 0.05);
  // Noise impulse for physicality
  const bufLen = Math.floor(c.sampleRate * 0.008);
  const buf = c.createBuffer(1, bufLen, c.sampleRate);
  const dat = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) dat[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
  const nb = c.createBufferSource(); nb.buffer = buf;
  const ng = c.createGain(); ng.gain.value = vv * 0.35;
  nb.connect(ng); ng.connect(c.destination);
  nb.start(now);
}

// ═══════════════════════════════════════════
//  SFX LIBRARY
// ═══════════════════════════════════════════

export const SFX = {

  // ══ UI / NAVIGATION ══════════════════════

  // FIX: Replaced bell with tactile click transient
  // The bell read as "notification" — this feels like pressing a button
  click() {
    ClickTransient(0.55);
  },

  // FIX: Replaced melodic sine sweep with light neutral whoosh
  // Transition should feel like motion, not music
  transition() {
    const c = getCtx(); if (!c || muted) return;
    const rev = getRev(), now = c.currentTime;
    // High airy sweep
    const g = c.createGain(), o = c.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(300, now);
    o.frequency.exponentialRampToValueAtTime(1400, now + 0.14);
    g.gain.setValueAtTime(v(0.18), now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    o.connect(g); rev ? rev.send(g) : g.connect(c.destination);
    o.start(now); o.stop(now + 0.2);
    // White noise breath underneath
    Noise(0.12, 0.06, 3000, 0);
  },

  // NEW: Back button — short descending tone, opposite feel to transition
  backButton() {
    const c = getCtx(); if (!c || muted) return;
    const now = c.currentTime;
    const g = c.createGain(), o = c.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(800, now);
    o.frequency.exponentialRampToValueAtTime(280, now + 0.1);
    g.gain.setValueAtTime(v(0.2), now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    o.connect(g); g.connect(c.destination);
    o.start(now); o.stop(now + 0.16);
  },

  // NEW: Overlay open — soft curtain drawing up
  overlayOpen() {
    const c = getCtx(); if (!c || muted) return;
    const rev = getRev(), now = c.currentTime;
    // Low rising sine pad
    const g = c.createGain(), o = c.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(180, now);
    o.frequency.exponentialRampToValueAtTime(440, now + 0.18);
    adsr(g, now, 0.01, 0.1, 0.1, v(0.22));
    o.connect(g); rev ? rev.send(g) : g.connect(c.destination);
    o.start(now); o.stop(now + 0.24);
    // Subtle hiss
    Noise(0.15, 0.04, 2000, 0);
  },

  // NEW: Overlay close — reverse curtain
  overlayClose() {
    const c = getCtx(); if (!c || muted) return;
    const now = c.currentTime;
    const g = c.createGain(), o = c.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(440, now);
    o.frequency.exponentialRampToValueAtTime(160, now + 0.14);
    adsr(g, now, 0.005, 0.06, 0.09, v(0.18));
    o.connect(g); g.connect(c.destination);
    o.start(now); o.stop(now + 0.18);
  },

  // NEW: Tab switch — ultra-short micro-click, softer than click()
  tabSwitch() {
    ClickTransient(0.28);
    Bell(1800, 0.06, 0.1, 0.01);
  },

  // NEW: Settings mode change — distinct from save, signals a toggle
  modeChange() {
    Sine(440, 0.2, 0.08, 0);
    Sine(660, 0.18, 0.07, 0.06);
  },

  // ══ GAME FLOW ═════════════════════════════

  // FIX: Simplified — 2 notes max. Save is mundane, not musical.
  save() {
    Bell(880,  0.18, 0.3, 0);
    Bell(1320, 0.14, 0.25, 0.07);
  },

  // FIX: Same soft ascending, but with a page-turn noise feel
  journal() {
    Noise(0.08, 0.1, 0, 1200);
    [392, 494, 587].forEach((f, i) => Harp(f, 0.25, i * 0.07));
  },

  // FIX: More audible — players need to know the AI is working
  // Soft sine pulse at 2s intervals, gentle not annoying
  thinkingTick() {
    Sine(1047, 0.09, 0.12, 0);
    Bell(1320, 0.04, 0.15, 0.05);
  },

  // FIX: Replaced harsh notifError with a softer descending pair
  notifSuccess() {
    Bell(880,  0.22, 0.38, 0);
    Bell(1320, 0.18, 0.28, 0.08);
  },

  notifError() {
    Sine(440, 0.2, 0.12, 0);
    Sine(330, 0.18, 0.14, 0.1);
  },

  // ══ CHARACTER CREATION ════════════════════

  characterConfirm() {
    Brass(392, 0.32, 0.32, 0, false);
    Brass(494, 0.25, 0.28, 0.07, false);
    Bell(1318, 0.32, 0.6, 0.12);
    Harp(523, 0.32, 0.09);
    Harp(659, 0.28, 0.15);
  },

  // NEW: Player count selected — light affirmation, not transition yet
  playerSelect() {
    ClickTransient(0.35);
    Bell(660, 0.14, 0.2, 0.02);
  },

  // ══ QUEST ════════════════════════════════

  questSelected() {
    Timpani(65, 0.38, 0);
    Choir(196, 0.48, 1.0, 0.06);
    Choir(294, 0.38, 0.8, 0.12);
    Brass(196, 0.32, 0.38, 0.09, false);
    Brass(247, 0.28, 0.32, 0.16, false);
    Bell(784, 0.38, 0.8, 0.2);
    Bell(987, 0.28, 0.6, 0.25);
  },

  questComplete() {
    [[130,0],[196,0.05],[261,0.1],[329,0.15],[392,0.2]].forEach(([f,d]) => Brass(f, 0.38, 0.8, d, false));
    [[261,0.1],[392,0.16],[523,0.22]].forEach(([f,d]) => Choir(f, 0.52, 1.8, d));
    [523,659,784,1047,1318,1760].forEach((f,i) => Bell(f, 0.38, 1.0, 0.32 + i * 0.065));
    [261,329,392,523].forEach((f,i) => Harp(f, 0.38, 0.28 + i * 0.07));
    Timpani(65, 0.52, 0);
    Timpani(80, 0.38, 0.2);
    Strings(261, 0.32, 2.0, 0.18, 1700);
  },

  // ══ COMBAT ═══════════════════════════════

  combatStart() {
    Timpani(65, 0.52, 0);
    Timpani(80, 0.42, 0.13);
    Timpani(65, 0.35, 0.26);
    Brass(196, 0.42, 0.22, 0, true);
    Brass(247, 0.36, 0.2, 0.09, true);
    Strings(196, 0.32, 0.4, 0.06, 2200);
    // Metallic sword ring on top
    Bell(2800, 0.25, 0.3, 0.02);
  },

  combatEnd() {
    Strings(261, 0.32, 1.2, 0, 1300);
    Strings(392, 0.28, 1.0, 0.09, 1100);
    [784, 1047, 1318].forEach((f, i) => Bell(f, 0.28, 0.8, 0.12 + i * 0.09));
    Choir(261, 0.32, 1.4, 0.18);
  },

  // FIX: Shorter attack (was 200ms) — stacks better during multi-attack turns
  attack() {
    Brass(220, 0.38, 0.12, 0, true);
    Timpani(90, 0.28, 0);
    // Sharp metallic sting
    const c = getCtx(); if (!c || muted) return;
    const now = c.currentTime;
    const g = c.createGain(), o = c.createOscillator();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(800, now);
    o.frequency.exponentialRampToValueAtTime(400, now + 0.06);
    g.gain.setValueAtTime(v(0.15), now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    o.connect(g); g.connect(c.destination);
    o.start(now); o.stop(now + 0.08);
  },

  hit() {
    Timpani(100, 0.38, 0);
    Brass(294, 0.28, 0.18, 0.02, true);
    Strings(294, 0.22, 0.2, 0.02, 1100);
  },

  critHit() {
    Timpani(65, 0.6, 0);
    Timpani(80, 0.45, 0.1);
    Brass(440, 0.52, 0.35, 0, true);
    Brass(554, 0.38, 0.3, 0.06, true);
    Brass(659, 0.28, 0.28, 0.12, true);
    Bell(1320, 0.5, 0.9, 0.1);
    Bell(1760, 0.38, 0.7, 0.15);
    Strings(220, 0.38, 0.55, 0.0, 2200);
  },

  fumble() {
    [0, 0.07, 0.14].forEach((d, i) => Brass(350 - i * 45, 0.32, 0.26, d, false));
    Timpani(55, 0.48, 0.05);
    Strings(196, 0.28, 0.4, 0.05, 700);
  },

  // NEW: Dodge/evade — light airy whoosh, movement feel
  dodge() {
    Noise(0.1, 0.18, 0, 4000);
    Sine(880, 0.14, 0.08, 0, 440);
  },

  // NEW: Spell cast — ascending magical shimmer
  spellCast() {
    const c = getCtx(); if (!c || muted) return;
    const rev = getRev(), now = c.currentTime;
    // Sine sweep up
    const g = c.createGain(), o = c.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(330, now);
    o.frequency.exponentialRampToValueAtTime(1320, now + 0.28);
    adsr(g, now, 0.01, 0.18, 0.12, v(0.25));
    o.connect(g); rev ? rev.send(g) : g.connect(c.destination);
    o.start(now); o.stop(now + 0.32);
    // Bell sparkle cascade
    [660, 880, 1047, 1318].forEach((f, i) => Bell(f, 0.18, 0.35, 0.05 + i * 0.06));
    // Shimmer noise
    Noise(0.25, 0.08, 0, 3000);
  },

  // ══ PROGRESSION ══════════════════════════

  heal() {
    [261, 329, 415, 523, 659, 784].forEach((f, i) => Harp(f, 0.42, i * 0.065));
    Choir(261, 0.48, 1.2, 0.12);
    Choir(392, 0.38, 1.0, 0.22);
    Bell(1047, 0.32, 0.9, 0.32);
    Bell(1318, 0.24, 0.7, 0.42);
  },

  xpGain() {
    [330, 415, 523].forEach((f, i) => Harp(f, 0.38, i * 0.07));
    Bell(1047, 0.28, 0.6, 0.16);
  },

  levelUp() {
    [[261,0],[329,0.07],[392,0.14],[523,0.2]].forEach(([f,d]) => Brass(f, 0.38, 0.5, d, true));
    [261,329,392,523,659,784,1047].forEach((f,i) => Harp(f, 0.38, 0.16 + i * 0.055));
    Bell(1318, 0.48, 1.0, 0.38);
    Bell(1760, 0.36, 0.8, 0.44);
    Strings(261, 0.32, 1.2, 0.12, 1500);
    Timpani(80, 0.48, 0);
    Timpani(100, 0.36, 0.24);
  },

  milestone() {
    Choir(261, 0.58, 1.5, 0);
    Choir(392, 0.48, 1.3, 0.06);
    Choir(523, 0.38, 1.1, 0.12);
    Brass(261, 0.33, 0.7, 0.12, true);
    Brass(392, 0.28, 0.6, 0.18, true);
    [784, 1047, 1318].forEach((f, i) => Bell(f, 0.33, 0.9, 0.22 + i * 0.09));
    Timpani(65, 0.38, 0);
  },

  // ══ ECONOMY ══════════════════════════════

  // NEW: Gold gained — bright coin-like jingle
  goldGain() {
    [1047, 1318, 1568, 2093].forEach((f, i) => Bell(f, 0.28, 0.5, i * 0.055));
    Harp(523, 0.25, 0.08);
  },

  // NEW: Gold lost/spent — descending sad tones
  goldLose() {
    Sine(523, 0.2, 0.12, 0);
    Sine(392, 0.18, 0.14, 0.1);
    Sine(330, 0.15, 0.16, 0.2);
  },

  // ══ NARRATIVE ════════════════════════════

  npcIntroduced() {
    Choir(330, 0.32, 0.7, 0);
    Bell(987, 0.25, 0.5, 0.14);
  },

  // NEW: Codex entry discovered — knowledge/lore feel
  codexDiscover() {
    const c = getCtx(); if (!c || muted) return;
    const rev = getRev(), now = c.currentTime;
    // Rising soft mystery tone
    const g = c.createGain(), o = c.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(220, now);
    o.frequency.exponentialRampToValueAtTime(660, now + 0.22);
    adsr(g, now, 0.015, 0.12, 0.18, v(0.2));
    o.connect(g); rev ? rev.send(g) : g.connect(c.destination);
    o.start(now); o.stop(now + 0.35);
    Bell(880,  0.18, 0.5, 0.14);
    Bell(1047, 0.14, 0.4, 0.2);
  },

  // FIX: Improved diceRoll — builds up then settles, more satisfying
  diceRoll() {
    const c = getCtx(); if (!c || muted) return;
    const now = c.currentTime;
    // Rattle: 6 fast clicks that slow down (like dice losing momentum)
    const delays = [0, 0.03, 0.07, 0.12, 0.18, 0.25];
    delays.forEach((d, i) => {
      const nb  = c.createBufferSource();
      const len = Math.floor(c.sampleRate * 0.025);
      const buf = c.createBuffer(1, len, c.sampleRate);
      const dat = buf.getChannelData(0);
      for (let j = 0; j < len; j++) dat[j] = (Math.random()*2-1) * Math.pow(1-j/len, 2.2);
      nb.buffer = buf;
      const hpf = c.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.value = 1800;
      const g   = c.createGain(); g.gain.value = v(0.14) * (1 - i * 0.1);
      nb.connect(hpf); hpf.connect(g); g.connect(c.destination);
      nb.start(now + d);
    });
    // Final settle — short low thud when dice stop
    const nb2 = c.createBufferSource();
    const len2 = Math.floor(c.sampleRate * 0.04);
    const buf2 = c.createBuffer(1, len2, c.sampleRate);
    const dat2 = buf2.getChannelData(0);
    for (let j = 0; j < len2; j++) dat2[j] = (Math.random()*2-1) * Math.pow(1-j/len2, 1.5);
    nb2.buffer = buf2;
    const lpf2 = c.createBiquadFilter(); lpf2.type = 'lowpass'; lpf2.frequency.value = 400;
    const g2   = c.createGain(); g2.gain.value = v(0.2);
    nb2.connect(lpf2); lpf2.connect(g2); g2.connect(c.destination);
    nb2.start(now + 0.28);
  },

  // NEW: Near death warning — low pulse, like a heartbeat slowing
  nearDeath() {
    const c = getCtx(); if (!c || muted) return;
    const now = c.currentTime;
    [0, 0.5, 0.9].forEach((d, i) => {
      const g = c.createGain(), o = c.createOscillator();
      o.type = 'sine'; o.frequency.setValueAtTime(80, now + d);
      o.frequency.exponentialRampToValueAtTime(55, now + d + 0.18);
      adsr(g, now + d, 0.01, 0.08, 0.14, v(0.35) * (1 - i * 0.15));
      o.connect(g); g.connect(c.destination);
      o.start(now + d); o.stop(now + d + 0.25);
    });
    // Distant string swell
    Strings(110, 0.28, 1.0, 0.1, 500);
  },

  // NEW: Player death — mournful descending brass
  playerDeath() {
    const c = getCtx(); if (!c || muted) return;
    [0, 0.12, 0.28, 0.5].forEach((d, i) => {
      Brass(294 - i * 30, 0.35, 0.4, d, false);
    });
    Timpani(55, 0.5, 0.05);
    Strings(196, 0.35, 1.5, 0.1, 500);
    Choir(147, 0.4, 2.0, 0.3);
  },

  // ══ TITLE / ONBOARDING ═══════════════════

  newGame() {
    const c = getCtx(); if (!c || muted) return;
    const rev = getRev(), now = c.currentTime;
    const hg = c.createGain(), ho = c.createOscillator(); ho.type = 'sine';
    ho.frequency.setValueAtTime(55, now);
    ho.frequency.exponentialRampToValueAtTime(110, now + 1.6);
    adsr(hg, now, 0.4, 0.6, 1.0, v(0.24));
    ho.connect(hg); rev ? rev.send(hg) : hg.connect(c.destination);
    ho.start(now); ho.stop(now + 2.2);
    Choir(110, 0.38, 1.2, 0.1);
    Choir(165, 0.32, 1.0, 0.22);
    Choir(220, 0.28, 0.9, 0.34);
    [165, 220, 277, 330, 415, 523, 659, 880].forEach((f, i) => Harp(f, 0.32, 0.14 + i * 0.1));
    [1047, 1318, 1760, 2093].forEach((f, i) => Bell(f, 0.2, 0.7, 0.52 + i * 0.13));
    Strings(110, 0.28, 1.6, 0.22, 1300);
    Strings(165, 0.22, 1.4, 0.34, 1100);
  },
};

// ── Settings ───────────────────────────────
export function setSfxMuted(m) { muted = m; }
export function setSfxVolume(v2) { sfxVolume = Math.max(0, Math.min(1, v2)); }
export function getSfxMuted()  { return muted; }
export function getSfxVolume() { return sfxVolume; }

// ── Late additions (appended) ──────────────

// Extend SFX with worldCraft
Object.assign(SFX, {

  // NEW: World crafting — plays during "GM is crafting the world" screen
  // Slower and more contemplative than newGame().
  // Deep drone → slow harp ascent → distant bell cascade → choir resolve.
  worldCraft() {
    const c = getCtx(); if (!c || muted) return;
    const rev = getRev(), now = c.currentTime;

    // Low drone — earth rumbling awake
    const dg = c.createGain(), do_ = c.createOscillator();
    do_.type = 'sine'; do_.frequency.setValueAtTime(40, now);
    do_.frequency.exponentialRampToValueAtTime(65, now + 3.0);
    adsr(dg, now, 0.8, 1.5, 1.2, v(0.22));
    do_.connect(dg); rev ? rev.send(dg) : dg.connect(c.destination);
    do_.start(now); do_.stop(now + 4.0);

    // Second drone — fifth above, phase offset
    const dg2 = c.createGain(), do2 = c.createOscillator();
    do2.type = 'sine'; do2.frequency.setValueAtTime(60, now + 0.3);
    do2.frequency.exponentialRampToValueAtTime(98, now + 3.0);
    adsr(dg2, now + 0.3, 0.9, 1.2, 1.0, v(0.14));
    do2.connect(dg2); rev ? rev.send(dg2) : dg2.connect(c.destination);
    do2.start(now + 0.3); do2.stop(now + 4.0);

    // Harp ascent — slow, deliberate, like pages turning
    [130, 165, 196, 247, 294, 370, 440, 523].forEach((f, i) => {
      Harp(f, 0.30, 0.55 + i * 0.22);
    });

    // Choir swells in — the GM "waking up"
    Choir(130, 0.42, 2.2, 1.0);
    Choir(196, 0.32, 1.8, 1.4);
    Choir(261, 0.24, 1.5, 1.8);

    // Bell cascade at the peak — world materialising
    [523, 659, 784, 1047, 1318].forEach((f, i) => {
      Bell(f, 0.22, 0.9, 1.8 + i * 0.18);
    });

    // String warmth — settling into the world
    Strings(130, 0.24, 2.5, 1.2, 1200);
    Strings(196, 0.18, 2.0, 1.6, 1000);
  },
});
