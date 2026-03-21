import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import { useSaveSlots } from '../../hooks/useSaveSlots.js';
import { SFX, initAudio } from '../game/SoundEngine.js';
import GameIcon from '../ui/GameIcon.jsx';
import styles from './TitleScreen.module.css';

// ═══════════════════════════════════════════
//  TITLE SCREEN
//  Animated SVG background cycling through
//  scene types. Mode moved to Settings.
//  Default mode: 'creative' (Anything Goes).
// ═══════════════════════════════════════════

// Scene types to cycle through in background
const BG_SCENES = ['dungeon', 'space', 'ocean', 'forest', 'castle', 'ruins'];

// Floating particles
function Particles() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 10,
    size: 1 + Math.random() * 3,
    type: Math.random() > 0.5 ? 'ember' : 'star',
  }));

  return (
    <div className={styles.particles}>
      {particles.map(p => (
        <div
          key={p.id}
          className={`${styles.particle} ${styles[p.type]}`}
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

// Animated scene background using SceneRenderer concepts inline
function AnimatedBackground({ sceneIdx }) {
  const type = BG_SCENES[sceneIdx % BG_SCENES.length];

  const skies = {
    dungeon: 'linear-gradient(180deg, #020208 0%, #06040e 50%, #0c0818 100%)',
    space:   'linear-gradient(180deg, #04020c 0%, #06040e 50%, #0a0818 100%)',
    ocean:   'linear-gradient(180deg, #041020 0%, #082040 50%, #0c3060 100%)',
    forest:  'linear-gradient(180deg, #0e2a08 0%, #1a4010 50%, #266018 100%)',
    castle:  'linear-gradient(180deg, #1a1630 0%, #22203e 50%, #2a284c 100%)',
    ruins:   'linear-gradient(180deg, #201a2c 0%, #2a2438 50%, #342e44 100%)',
  };

  return (
    <div className={styles.bgScene} style={{ background: skies[type] || skies.dungeon }}>
      {/* Stars for dark scenes */}
      {['dungeon','space','castle','ruins'].includes(type) && (
        <div className={styles.stars}>
          {Array.from({length:60},(_,i) => (
            <div key={i} className={styles.star} style={{
              left:`${(i*37+13)%100}%`,
              top:`${(i*53+7)%60}%`,
              width: i%5===0?2:1,
              height: i%5===0?2:1,
              animationDelay:`${(i*0.31)%4}s`,
              opacity: 0.2 + (i%3)*0.2,
            }}/>
          ))}
        </div>
      )}

      {/* Scene-specific accent elements */}
      {type === 'space' && (
        <>
          <div className={styles.planet} style={{top:'12%',right:'18%',width:60,height:60,background:'radial-gradient(circle at 35% 35%,#6a3a8a,#2a0a4a)',borderRadius:'50%'}}/>
          <div className={styles.planet} style={{top:'25%',left:'12%',width:30,height:30,background:'radial-gradient(circle at 35% 35%,#3a6a8a,#0a2a4a)',borderRadius:'50%'}}/>
        </>
      )}
      {type === 'ocean' && (
        <div className={styles.waves}/>
      )}
      {type === 'forest' && (
        <div className={styles.treeLine}/>
      )}

      {/* Horizon glow */}
      <div className={styles.horizonGlow} style={{
        background: {
          dungeon: 'radial-gradient(ellipse at 50% 80%, rgba(196,168,79,0.08), transparent 60%)',
          space:   'radial-gradient(ellipse at 50% 80%, rgba(128,96,255,0.1), transparent 60%)',
          ocean:   'radial-gradient(ellipse at 50% 80%, rgba(64,176,255,0.1), transparent 60%)',
          forest:  'radial-gradient(ellipse at 50% 80%, rgba(109,187,124,0.1), transparent 60%)',
          castle:  'radial-gradient(ellipse at 50% 80%, rgba(168,126,212,0.1), transparent 60%)',
          ruins:   'radial-gradient(ellipse at 50% 80%, rgba(168,126,212,0.08), transparent 60%)',
        }[type],
      }}/>

      {/* Bottom terrain silhouette */}
      <div className={styles.terrain} style={{
        background: {
          dungeon: 'linear-gradient(180deg,#181424,#221c30)',
          space:   'linear-gradient(180deg,#04020c,#0a0818)',
          ocean:   'linear-gradient(180deg,#041020,#082040)',
          forest:  'linear-gradient(180deg,#0e2a08,#1a4010)',
          castle:  'linear-gradient(180deg,#181424,#1a1630)',
          ruins:   'linear-gradient(180deg,#201a2c,#16101e)',
        }[type],
      }}/>
    </div>
  );
}

export default function TitleScreen() {
  const { state, set } = useGame();
  const { getLatestSlot } = useSaveSlots();
  const { data: latestSave } = getLatestSlot();
  const [sceneIdx, setSceneIdx] = useState(0);
  const [fading, setFading] = useState(false);

  // Default mode to creative if not set
  useEffect(() => {
    if (!state.mode) set({ mode: 'creative' });
  }, []);

  // Cycle background scenes
  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setSceneIdx(i => i + 1);
        setFading(false);
      }, 800);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  function begin() {
    initAudio();
    SFX.newGame();
    SFX.transition();
    set({ screen: 'players' });
  }

  function loadGame() {
    SFX.click();
    set({ screen: 'load' });
  }

  function quickContinue() {
    const { data } = getLatestSlot();
    if (!data) return;
    SFX.transition();
    set({ ...data, isLoading: false, screen: 'game' });
  }

  return (
    <div className={styles.title}>
      {/* Animated background */}
      <div className={`${styles.bgWrap} ${fading ? styles.bgFading : ''}`}>
        <AnimatedBackground sceneIdx={sceneIdx} />
      </div>

      {/* Particles */}
      <Particles />

      {/* Overlay gradient — fades bg into content area */}
      <div className={styles.overlay} />

      {/* Content */}
      <div className={styles.content}>
        {/* Decorative icons around title */}
        <div className={styles.iconRow}>
          <GameIcon path="lorc/broadsword"    size={22} tint="dim" />
          <GameIcon path="lorc/wizard-staff"  size={22} tint="dim" />
          <GameIcon path="lorc/compass"       size={22} tint="dim" />
          <GameIcon path="lorc/rocket"        size={22} tint="dim" />
          <GameIcon path="lorc/throwing-star" size={22} tint="dim" />
        </div>

        <div className={styles.ornament}>A Text Adventure Without Limits</div>

        <h1 className={styles.heading}>
          <span className={styles.headingLine1}>The Endless</span>
          <span className={styles.headingLine2}>Chronicle</span>
        </h1>

        <p className={styles.sub}>Your story. Your rules. Your world.</p>

        {/* Genre tags */}
        <div className={styles.genreTags}>
          {['Fantasy','Space','Horror','Western','Cyberpunk','Mythology','Ninja'].map(g => (
            <span key={g} className={styles.genreTag}>{g}</span>
          ))}
        </div>

        {/* Continue banner */}
        {latestSave && (
          <div className={styles.continueBanner}>
            <div className={styles.continueInfo}>
              <div className={styles.continueLabel}>Continue Adventure</div>
              <div className={styles.continueDetail}>
                {latestSave.players?.map(p => p.name).join(' & ')} · Turn {latestSave.turnCount}
                {latestSave.goal?.name ? ` · ${latestSave.goal.name}` : ''}
              </div>
            </div>
            <button className={styles.continueBtn} onClick={quickContinue}>
              Continue →
            </button>
          </div>
        )}

        {/* Main CTA */}
        <div className={styles.btnRow}>
          <button className={styles.loadBtn} onClick={loadGame}>
            <GameIcon path="lorc/open-treasure-chest" size={16} tint="muted" />
            Load Game
          </button>
          <button className={styles.startBtn} onClick={begin}>
            <GameIcon path="lorc/dungeon-gate" size={18} tint="gold" />
            Begin Adventure
          </button>
        </div>

        {/* Mode hint */}
        <div className={styles.modeHint}>
          Mode: <strong>{state.mode === 'adventure' ? '⚡ Try Hard' : '✦ Anything Goes'}</strong>
          {' · '}
          <span className={styles.modeChange} onClick={() => {}}>
            change after starting
          </span>
        </div>

        <div className={styles.iconRowBottom}>
          <GameIcon path="lorc/skull"       size={16} tint="dim" />
          <GameIcon path="lorc/dragon-head" size={16} tint="dim" />
          <GameIcon path="lorc/ghost"       size={16} tint="dim" />
          <GameIcon path="lorc/crown"       size={16} tint="dim" />
          <GameIcon path="lorc/anchor"      size={16} tint="dim" />
        </div>
      </div>
    </div>
  );
}
