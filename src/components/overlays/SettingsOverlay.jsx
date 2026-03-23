import { useState } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import { RL_LABELS } from '../../data/readingLevels.js';
import { playTrack, stopMusic, setMusicVol, getMusicActive, getMusicVol } from '../game/MusicEngine.js';
import { setSfxMuted, setSfxVolume, getSfxMuted, getSfxVolume } from '../game/SoundEngine.js';
import { SFX } from '../game/SoundEngine.js';
import styles from './SettingsOverlay.module.css';

const LEVELS = ['4th', '8th', '12th', 'college'];

const MODES = [
  { id: 'creative',  name: 'Anything Goes', desc: 'No rules — try anything you imagine.',      color: '#a87ed4' },
  { id: 'adventure', name: 'Try Hard Mode',  desc: 'Real danger. Choices have consequences.',   color: '#5595e0' },
];

export default function SettingsOverlay({ onClose }) {
  const { state, set, reset } = useGame();
  const [musicActive, setMusicActive] = useState(getMusicActive());
  const [musicVol,   setMusicVolState] = useState(getMusicVol());
  const [sfxMuted, setSfxMutedState] = useState(getSfxMuted());
  const [sfxVol,   setSfxVolState]   = useState(getSfxVolume());

  function setRL(level) { set({ readingLevel: level }); SFX.modeChange(); }

  function toggleMusic() {
    if (musicActive) {
      stopMusic();
      setMusicActive(null);
    } else {
      playTrack('peaceful');
      setMusicActive('peaceful');
    }
  }

  function handleMusicVol(v) {
    setMusicVolState(v);
    setMusicVol(v);
  }

  function toggleSfx() {
    const next = !sfxMuted;
    setSfxMuted(next);
    setSfxMutedState(next);
    if (!next) SFX.save(); // test sound on unmute
  }

  function changeSfxVol(v) {
    setSfxVolume(v);
    setSfxVolState(v);
  }

  function setMode(id) {
    set({ mode: id });
    SFX.save();
  }

  function confirmNew() {
    if (state.turnCount > 0 && !window.confirm('Start a new game? Make sure to save first!')) return;
    stopMusic();
    reset();
    set({ screen: 'title' });
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.title}>⚙ Settings</span>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        {/* Game Mode */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Game Mode</div>
          <div className={styles.modeRow}>
            {MODES.map(m => (
              <button
                key={m.id}
                className={`${styles.modeBtn} ${state.mode === m.id ? styles.modeBtnActive : ''}`}
                style={state.mode === m.id ? { borderColor: m.color, color: m.color } : undefined}
                onClick={() => { SFX.modeChange(); setMode(m.id); }}
              >
                <div className={styles.modeBtnName}>{m.name}</div>
                <div className={styles.modeBtnDesc}>{m.desc}</div>
              </button>
            ))}
          </div>
          <p className={styles.modeNote}>
            {state.mode === 'adventure'
              ? '⚡ Try Hard: health tracking, real consequences, permadeath risk'
              : '✦ Anything Goes: unlimited creativity, no failure states'}
          </p>
        </div>

        {/* Reading level */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Reading Level</div>
          <div className={styles.rlGrid}>
            {LEVELS.map(lvl => (
              <button
                key={lvl}
                className={`${styles.rlBtn} ${state.readingLevel === lvl ? styles.rlActive : ''}`}
                onClick={() => setRL(lvl)}
              >
                <div className={styles.rlLabel}>{RL_LABELS[lvl].split(' ')[0]}</div>
                <div className={styles.rlSub}>{RL_LABELS[lvl].split('(')[1]?.replace(')', '') || ''}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Music */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Music</div>
          <div className={styles.sfxRow}>
            <div className={styles.sliderRow} style={{ flex: 1, opacity: musicActive ? 1 : 0.4 }}>
              <span className={styles.sliderIcon}>🎵</span>
              <input type="range" min="0" max="1" step="0.05"
                value={musicVol} className={styles.slider}
                disabled={!musicActive}
                onChange={e => handleMusicVol(parseFloat(e.target.value))} />
            </div>
            <button
              className={`${styles.muteBtn} ${musicActive ? styles.muteBtnActive : ''}`}
              onClick={toggleMusic}
            >
              {musicActive ? '🎵 On' : '🎵 Off'}
            </button>
          </div>
        </div>

        {/* Sound Effects */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Sound Effects</div>
          <div className={styles.sfxRow}>
            <div className={styles.sliderRow} style={{ flex: 1, opacity: sfxMuted ? 0.4 : 1 }}>
              <span className={styles.sliderIcon}>🔊</span>
              <input type="range" min="0" max="1" step="0.05"
                value={sfxVol} className={styles.slider}
                disabled={sfxMuted}
                onChange={e => changeSfxVol(parseFloat(e.target.value))} />
            </div>
            <button
              className={`${styles.muteBtn} ${sfxMuted ? styles.muteBtnActive : ''}`}
              onClick={toggleSfx}
            >
              {sfxMuted ? '🔇 Off' : '🔊 On'}
            </button>
          </div>
        </div>

        {/* New game */}
        {state.screen === 'game' && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Game</div>
            <button className={styles.dangerBtn} onClick={confirmNew}>
              ↩ Start New Game
            </button>
          </div>
        )}

        <div className={styles.attribution}>
          Game icons by <a href="https://game-icons.net" target="_blank" rel="noreferrer" className={styles.attrLink}>game-icons.net</a> (CC BY 3.0)
        </div>
      </div>
    </div>
  );
}
