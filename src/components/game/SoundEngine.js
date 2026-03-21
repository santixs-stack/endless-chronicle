// ═══════════════════════════════════════════
//  SOUND EFFECTS ENGINE
//  Pure Web Audio API — no audio files.
//  All sounds are synthesized procedurally.
//  Respects mute state and volume.
// ═══════════════════════════════════════════

let ctx = null;
let muted = false;
let sfxVolume = 0.4;

function getCtx() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
  }
  if (ctx?.state === 'suspended') ctx.resume();
  return ctx;
}

function master(gain = 1.0) {
  const c = getCtx();
  if (!c) return null;
  const g = c.createGain();
  g.gain.value = sfxVolume * gain * (muted ? 0 : 1);
  g.connect(c.destination);
  return { c, g };
}

// ── Core synthesizer primitives ────────────

function playTone(freq, type, duration, gainVal, startDelay = 0, fadeOut = true) {
  const m = master(gainVal);
  if (!m) return;
  const { c, g } = m;
  const now = c.currentTime + startDelay;

  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  osc.connect(g);
  osc.start(now);
  if (fadeOut) g.gain.setTargetAtTime(0, now + duration * 0.6, duration * 0.15);
  osc.stop(now + duration);
}

function playNoise(duration, gainVal, filterFreq = 2000) {
  const m = master(gainVal);
  if (!m) return;
  const { c, g } = m;
  const now = c.currentTime;

  const bufSize = c.sampleRate * duration;
  const buf = c.createBuffer(1, bufSize, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

  const src = c.createBufferSource();
  src.buffer = buf;

  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = filterFreq;

  src.connect(filter);
  filter.connect(g);
  g.gain.setTargetAtTime(0, now + duration * 0.3, duration * 0.2);
  src.start(now);
  src.stop(now + duration);
}

// ── Sound definitions ──────────────────────

export const SFX = {

  // ⚔ Sword swing / attack
  attack() {
    const m = master(0.5);
    if (!m) return;
    const { c, g } = m;
    const now = c.currentTime;
    const osc = c.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
    osc.connect(g);
    g.gain.setValueAtTime(0.5, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.22);
    playNoise(0.1, 0.3, 1500);
  },

  // 💔 Damage / hit impact
  hit() {
    const m = master(0.6);
    if (!m) return;
    const { c, g } = m;
    const now = c.currentTime;
    // Thud
    const osc = c.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
    osc.connect(g);
    g.gain.setValueAtTime(0.7, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.18);
    // Noise burst
    playNoise(0.08, 0.4, 3000);
  },

  // ⚡ CRITICAL HIT
  critHit() {
    const m = master(0.7);
    if (!m) return;
    const { c, g } = m;
    const now = c.currentTime;

    // Rising pitch sweep
    const osc1 = c.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(200, now);
    osc1.frequency.exponentialRampToValueAtTime(800, now + 0.08);
    osc1.connect(g);
    g.gain.setValueAtTime(0.6, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.start(now);
    osc1.stop(now + 0.28);

    // Power chord
    [220, 330, 440].forEach((freq, i) => {
      playTone(freq, 'square', 0.3, 0.15, 0.05 + i * 0.02);
    });

    // Metal clang
    playNoise(0.12, 0.5, 5000);
  },

  // 💚 Heal
  heal() {
    // Gentle rising arpeggio
    [523, 659, 784, 1047].forEach((freq, i) => {
      playTone(freq, 'sine', 0.25, 0.2, i * 0.06);
    });
  },

  // ⭐ XP gain
  xpGain() {
    [440, 554, 659].forEach((freq, i) => {
      playTone(freq, 'triangle', 0.15, 0.15, i * 0.05);
    });
  },

  // 🏆 Level up
  levelUp() {
    // Fanfare arpeggio
    const notes = [523, 659, 784, 1047, 1319, 1047, 1319, 1568];
    notes.forEach((freq, i) => {
      playTone(freq, 'triangle', 0.18, 0.25, i * 0.07);
    });
    // Shimmer
    playNoise(0.8, 0.1, 8000);
  },

  // 💀 FUMBLE / nat 1
  fumble() {
    const m = master(0.5);
    if (!m) return;
    const { c, g } = m;
    const now = c.currentTime;
    const osc = c.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);
    osc.connect(g);
    g.gain.setValueAtTime(0.5, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.start(now);
    osc.stop(now + 0.5);
  },

  // 🎲 Dice roll
  diceRoll() {
    // Rapid noise bursts
    for (let i = 0; i < 4; i++) {
      playNoise(0.04, 0.25, 4000 + i * 500);
      setTimeout(() => {}, i * 30);
    }
    // Final clack
    playNoise(0.06, 0.4, 6000);
  },

  // 🗺 Quest milestone
  milestone() {
    // Triumphant chord progression
    const chords = [
      [261, 329, 392],
      [293, 369, 440],
      [329, 415, 494],
      [392, 494, 587],
    ];
    chords.forEach((chord, ci) => {
      chord.forEach(freq => {
        playTone(freq, 'triangle', 0.4, 0.15, ci * 0.18);
      });
    });
  },

  // 🏆 Quest complete
  questComplete() {
    // Full fanfare
    const melody = [523, 523, 784, 784, 880, 784, 659, 523, 659, 784];
    melody.forEach((freq, i) => {
      playTone(freq, 'triangle', 0.22, 0.3, i * 0.1);
    });
    // Bass
    [130, 165, 196, 261].forEach((freq, i) => {
      playTone(freq, 'sine', 0.4, 0.2, i * 0.2);
    });
    playNoise(1.5, 0.1, 10000);
  },

  // 💾 Save
  save() {
    [440, 880].forEach((freq, i) => {
      playTone(freq, 'sine', 0.1, 0.15, i * 0.06);
    });
  },

  // 📖 Journal entry
  journal() {
    [330, 415].forEach((freq, i) => {
      playTone(freq, 'sine', 0.12, 0.12, i * 0.05);
    });
  },

  // ⚔ Combat start
  combatStart() {
    const m = master(0.6);
    if (!m) return;
    const { c, g } = m;
    const now = c.currentTime;
    // Dramatic tension hit
    [55, 73, 98].forEach((freq, i) => {
      const o = c.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = freq;
      o.connect(g);
      g.gain.setValueAtTime(0.5, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      o.start(now + i * 0.02);
      o.stop(now + 0.85);
    });
    playNoise(0.3, 0.4, 2000);
  },

  // ✅ Combat end / victory
  combatEnd() {
    [392, 494, 587, 784].forEach((freq, i) => {
      playTone(freq, 'triangle', 0.3, 0.2, i * 0.08);
    });
  },

  // 🖱 Button click — subtle UI feedback
  click() {
    playTone(800, 'sine', 0.06, 0.12);
    playNoise(0.03, 0.08, 8000);
  },

  // 🔀 Screen transition — soft whoosh
  transition() {
    const m = master(0.25);
    if (!m) return;
    const { c, g } = m;
    const now = c.currentTime;
    const osc = c.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
    osc.connect(g);
    g.gain.setValueAtTime(0.3, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.22);
  },

  // 🧙 Archetype / character confirmed
  characterConfirm() {
    [523, 784, 1047].forEach((freq, i) => {
      playTone(freq, 'triangle', 0.2, 0.25, i * 0.07);
    });
    playNoise(0.15, 0.1, 6000);
  },

  // 📜 Quest selected — dramatic sting
  questSelected() {
    const m = master(0.5);
    if (!m) return;
    const { c, g } = m;
    const now = c.currentTime;
    // Low rumble + rising tone
    [110, 165, 220].forEach((freq, i) => {
      const o = c.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = freq;
      o.connect(g);
      g.gain.setValueAtTime(0.4, now + i * 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      o.start(now + i * 0.05);
      o.stop(now + 0.55);
    });
    // High shimmer
    playTone(880, 'triangle', 0.3, 0.2, 0.15);
    playNoise(0.2, 0.15, 4000);
  },

  // ⏳ AI thinking — subtle shimmer tick
  thinkingTick() {
    playTone(1200, 'sine', 0.08, 0.05);
  },

  // 🔔 Notification success — soft ping
  notifSuccess() {
    [659, 880].forEach((freq, i) => {
      playTone(freq, 'sine', 0.12, 0.12, i * 0.06);
    });
  },

  // ❌ Notification error — low thud
  notifError() {
    playTone(180, 'sawtooth', 0.15, 0.2);
    playNoise(0.08, 0.15, 1000);
  },

  // 📢 NPC introduced — character appearance sting
  npcIntroduced() {
    [440, 554, 440].forEach((freq, i) => {
      playTone(freq, 'triangle', 0.14, 0.15, i * 0.08);
    });
  },

  // ✨ New game started — opening fanfare
  newGame() {
    const notes = [261, 329, 392, 523, 659, 523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      playTone(freq, 'triangle', 0.22, 0.22, i * 0.08);
    });
    [130, 196, 261].forEach((freq, i) => {
      playTone(freq, 'sine', 0.5, 0.18, i * 0.1);
    });
    playNoise(1.2, 0.08, 8000);
  },
};

// ── Settings ───────────────────────────────
export function setSfxMuted(m) { muted = m; }
export function setSfxVolume(v) { sfxVolume = Math.max(0, Math.min(1, v)); }
export function getSfxMuted() { return muted; }
export function getSfxVolume() { return sfxVolume; }

// Resume audio context on first user interaction
export function initAudio() {
  if (ctx?.state === 'suspended') ctx.resume();
  if (!ctx) getCtx();
}
