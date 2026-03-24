import { useEffect, useRef, useState } from 'react';
import rough from 'roughjs/bundled/rough.esm.js';
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
const BG_SCENES = ['dungeon','space','ocean','forest','castle','neon_city','ruins','prairie','olympus'];

// ── Seeded random (same as SceneRenderer) ──────────────────────────────
function mkRand(seed) {
  let s = (seed | 0) + 1;
  return () => { s = (s * 16807 + 7) % 2147483647; return (s - 1) / 2147483646; };
}
function shadeHex(hex, pct) {
  const n = parseInt((hex||'#888888').replace('#',''), 16);
  const r = Math.min(255, Math.max(0, (n>>16) + pct));
  const g = Math.min(255, Math.max(0, ((n>>8)&0xff) + pct));
  const b = Math.min(255, Math.max(0, (n&0xff) + pct));
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// ── Draw the title background SVG ──────────────────────────────────────
function drawTitleBg(svgEl2, type, seed) {
  const W = svgEl2.viewBox?.baseVal?.width  || 800;
  const H = svgEl2.viewBox?.baseVal?.height || 420;
  while (svgEl2.firstChild) svgEl2.removeChild(svgEl2.firstChild);
  const rc = rough.svg(svgEl2);
  const sr = mkRand(seed);

  function svE(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k, String(v)));
    return el;
  }

  const CONFIGS = {
    dungeon:  { sky:['#0a0518','#100828','#0a0518'], ground:'#2a1e38', accent:'#FF8C42', torch:'#FF6B35' },
    space:    { sky:['#04020c','#06040e','#04020c'], ground:'#0a0818', accent:'#7DF9FF', star:'#FFFDE7' },
    ocean:    { sky:['#0d2a50','#1a4070','#2a6090'], ground:'#0d47a1', accent:'#FFD700', wave:'#42A5F5' },
    forest:   { sky:['#1a3a0a','#2a5a18','#3a7a28'], ground:'#2d5a27', accent:'#F4C430', leaf:'#3D8B37' },
    castle:   { sky:['#0a0a1e','#141432','#1a1a3e'], ground:'#3a2858', accent:'#FFD700', torch:'#FF6B35' },
    neon_city:{ sky:['#020208','#060418','#020208'], ground:'#1a1428', accent:'#FF00FF', neon:['#FF00FF','#00FFFF','#FF4400'] },
    ruins:    { sky:['#1a0a28','#2a1448','#1a0a28'], ground:'#2a1e38', accent:'#C06EFF', vine:'#2D5A18' },
    prairie:  { sky:['#1a3a60','#2a5a88','#3a7aaa'], ground:'#6a5020', accent:'#D4A840', dust:'#C4A870' },
    olympus:  { sky:['#3a6ab0','#5a8ad0','#8aaae8'], ground:'#e8e0d0', accent:'#FFD700', cloud:'#ffffff' },
  };
  const cfg = CONFIGS[type] || CONFIGS.dungeon;

  // Sky gradient
  const defs = svE('defs', {});
  const grad = svE('linearGradient', { id:'tsg', x1:'0', y1:'0', x2:'0', y2:'1', gradientUnits:'objectBoundingBox' });
  cfg.sky.forEach((c, i) => {
    const stop = svE('stop', { offset:`${i*50}%`, 'stop-color':c });
    grad.appendChild(stop);
  });
  defs.appendChild(grad);
  svgEl2.appendChild(defs);
  svgEl2.appendChild(svE('rect', { x:0, y:0, width:W, height:H, fill:'url(#tsg)' }));

  // ── Scene-specific elements ─────────────────────────────────────────
  if (type === 'dungeon' || type === 'castle') {
    // Stars
    for (let i = 0; i < 80; i++) {
      const star = svE('circle', { cx:sr()*W, cy:sr()*H*0.65, r:0.8+sr()*1.5, fill:'#FFFDE7', opacity:0.3+sr()*0.6 });
      if (i%5===0) { star.setAttribute('class', 'twinkle'); star.style.animationDelay = `${sr()*3}s`; }
      svgEl2.appendChild(star);
    }
    // Crumbling walls / arches
    for (let i = 0; i < 5; i++) {
      const wx = i*(W/4.5), wh = 100+sr()*140, ww = W/5-4;
      svgEl2.appendChild(rc.rectangle(wx, H*0.55-wh, ww, wh, {
        stroke:shadeHex(cfg.ground,-20), fill:cfg.ground, fillStyle:'hachure', roughness:2.5, strokeWidth:1.5
      }));
    }
    // Torches
    [W*0.18, W*0.5, W*0.82].forEach(tx => {
      svgEl2.appendChild(rc.line(tx, H*0.45, tx, H*0.58, { stroke:'#5C3A1E', strokeWidth:4, roughness:1.5 }));
      const flame = rc.ellipse(tx, H*0.43, 16, 20, { stroke:cfg.torch||'#FF6B35', fill:cfg.torch||'#FF8C42', fillStyle:'solid', roughness:2.5 });
      flame.setAttribute('class', 'flicker');
      flame.style.animationDelay = `${sr()*0.5}s`;
      svgEl2.appendChild(flame);
      const glow = svE('ellipse', { cx:tx, cy:H*0.43, rx:30, ry:22, fill:cfg.torch||'#FF6B35', opacity:0.08 });
      glow.setAttribute('class', 'eyeGlow');
      svgEl2.appendChild(glow);
    });
  }

  if (type === 'space') {
    // Dense starfield
    for (let i = 0; i < 200; i++) {
      const star = svE('circle', { cx:sr()*W, cy:sr()*H*0.9, r:0.5+sr()*2.5, fill:'#FFFDE7', opacity:0.2+sr()*0.8 });
      if (i%3===0) { star.setAttribute('class','twinkle'); star.style.animationDelay=`${sr()*4}s`; }
      svgEl2.appendChild(star);
    }
    // Nebula
    ['rgba(107,63,255,0.12)','rgba(255,63,107,0.1)','rgba(63,255,200,0.08)'].forEach((col, i) => {
      const neb = svE('ellipse', { cx:W*(0.2+i*0.3)+sr()*50, cy:H*(0.2+sr()*0.4), rx:80+sr()*100, ry:40+sr()*50, fill:col });
      neb.setAttribute('class','driftCloud');
      neb.style.animationDuration = `${45+sr()*30}s`;
      neb.style.animationDelay = `${sr()*-20}s`;
      svgEl2.appendChild(neb);
    });
    // Planets
    const pc = ['#6a3a8a','#3a6a8a','#8a5a3a'];
    for (let i = 0; i < 3; i++) {
      const px = W*(0.1+i*0.35)+sr()*60, py = H*(0.08+sr()*0.35), pr = 14+sr()*30;
      svgEl2.appendChild(rc.circle(px, py, pr*2, { stroke:shadeHex(pc[i],-20), fill:pc[i], fillStyle:'solid', roughness:0.8 }));
      if (pr > 22) svgEl2.appendChild(rc.ellipse(px, py, pr*2.8, pr*0.5, { stroke:shadeHex(pc[i],20), fill:'none', roughness:1.2, strokeWidth:2 }));
    }
  }

  if (type === 'ocean') {
    // Moon
    svgEl2.appendChild(rc.circle(W*0.78, H*0.14, 36, { stroke:'#f5e68a', fill:'#fdf5b0', fillStyle:'solid', roughness:0.8 }));
    // Distant cliffs / headlands
    svgEl2.appendChild(rc.polygon([[0,H*0.5],[W*0.25,H*0.35],[W*0.4,H*0.45],[W,H*0.4],[W,H*0.55],[0,H*0.55]], {
      stroke:'#0a2a50', fill:'#082040', fillStyle:'hachure', roughness:2.5
    }));
    // Waves (animated)
    for (let i = 0; i < 12; i++) {
      const wy = H*0.48+sr()*0.2*H, wx = sr()*W, wl = 40+sr()*80;
      const wEl = rc.path(`M ${wx} ${wy} Q ${wx+wl/2} ${wy-10} ${wx+wl} ${wy}`, {
        stroke: cfg.wave||'#42A5F5', fill:'none', strokeWidth:1.8, roughness:2
      });
      wEl.setAttribute('class','waveAnim');
      wEl.style.animationDelay = `${sr()*2}s`;
      svgEl2.appendChild(wEl);
    }
    // Ship silhouette
    svgEl2.appendChild(rc.polygon([[W*0.42,H*0.5],[W*0.58,H*0.5],[W*0.56,H*0.44],[W*0.44,H*0.44]], {
      stroke:'#082040', fill:'#051828', fillStyle:'solid', roughness:1.5
    }));
    svgEl2.appendChild(rc.line(W*0.5, H*0.44, W*0.5, H*0.28, { stroke:'#082040', strokeWidth:2.5, roughness:1.5 }));
    svgEl2.appendChild(rc.line(W*0.5, H*0.33, W*0.6, H*0.36, { stroke:'#051828', strokeWidth:1.5, roughness:1.5 }));
  }

  if (type === 'forest') {
    // Moon or sun
    svgEl2.appendChild(rc.circle(W*0.72, H*0.12, 28, { stroke:'#f5e68a', fill:'#fdf5b0', fillStyle:'solid', roughness:0.7 }));
    // Tree layers — back, mid, front
    [[0.18,'#1A3A18',60],[0.22,'#243E22',75],[0.28,'#2D5A27',90]].forEach(([yFrac, col, maxH]) => {
      for (let i = 0; i < 12; i++) {
        const tx = i*(W/11)+sr()*30-15, th = 30+sr()*maxH, tw = th*0.5;
        svgEl2.appendChild(rc.polygon([[tx-tw/2,H*yFrac+th],[tx+tw/2,H*yFrac+th],[tx,H*yFrac]], {
          stroke:shadeHex(col,-15), fill:col, fillStyle:'hachure', roughness:2.2
        }));
      }
    });
    // Fireflies
    for (let i = 0; i < 15; i++) {
      const ff = svE('circle', { cx:sr()*W, cy:H*0.3+sr()*H*0.4, r:2, fill:'#AAFF66', opacity:0.6 });
      ff.setAttribute('class', 'twinkle');
      ff.style.animationDelay = `${sr()*3}s`;
      svgEl2.appendChild(ff);
    }
  }

  if (type === 'neon_city') {
    // Dense dark towers
    for (let i = 0; i < 16; i++) {
      const bx = i*(W/14)+sr()*8-4, bh = 60+sr()*180, bw = 22+sr()*35;
      const col = ['#1A1830','#141228','#221E38'][i%3];
      svgEl2.appendChild(rc.rectangle(bx-bw/2, H*0.65-bh, bw, bh, { stroke:shadeHex(col,-10), fill:col, fillStyle:'hachure', roughness:0.8, strokeWidth:0.8 }));
      // Neon signs
      if (sr()>0.5) {
        const nc = (cfg.neon||['#FF00FF'])[Math.floor(sr()*3)];
        const neonEl = svE('line', { x1:bx-bw/4, y1:H*0.65-bh+8, x2:bx+bw/4, y2:H*0.65-bh+8, stroke:nc, 'stroke-width':2.5, opacity:0.9 });
        svgEl2.appendChild(neonEl);
        const glowEl = svE('line', { x1:bx-bw/4, y1:H*0.65-bh+8, x2:bx+bw/4, y2:H*0.65-bh+8, stroke:nc, 'stroke-width':10, opacity:0.1 });
        svgEl2.appendChild(glowEl);
      }
      // Windows
      for (let r = 1; r < Math.min(Math.floor(bh/14),10); r++) {
        if (sr()>0.45) {
          const nc2 = sr()>0.8?(cfg.neon||['#FF00FF'])[Math.floor(sr()*3)]:'#FFEE55';
          svgEl2.appendChild(rc.rectangle(bx-bw/4, H*0.65-bh+r*14+4, bw*0.3, 7, { stroke:'none', fill:nc2, fillStyle:'solid', roughness:0.3 }));
        }
      }
    }
    // Puddles
    for (let i = 0; i < 6; i++) {
      const nc3 = (cfg.neon||['#FF00FF','#00FFFF'])[i%2];
      const p = svE('ellipse', { cx:sr()*W, cy:H*0.67+sr()*8, rx:25+sr()*35, ry:5, fill:nc3, opacity:0.1 });
      p.setAttribute('class', 'waveAnim'); p.style.animationDelay=`${sr()*2}s`;
      svgEl2.appendChild(p);
    }
  }

  if (type === 'ruins') {
    // Stars
    for (let i = 0; i < 60; i++) {
      const s = svE('circle', { cx:sr()*W, cy:sr()*H*0.6, r:0.8+sr()*1.5, fill:'#FFFDE7', opacity:0.3+sr()*0.5 });
      if (i%4===0) { s.setAttribute('class','twinkle'); s.style.animationDelay=`${sr()*3}s`; }
      svgEl2.appendChild(s);
    }
    // Broken columns and arches
    for (let i = 0; i < 6; i++) {
      const rx = i*(W/5.5)+sr()*20, rh = 50+sr()*100, rw = 18+sr()*20;
      // Jagged broken top
      const pts = [[rx-rw/2,H*0.6],[rx-rw/2,H*0.6-rh],[rx,H*0.6-rh-sr()*20],[rx+rw/2,H*0.6-rh+sr()*15],[rx+rw/2,H*0.6]];
      svgEl2.appendChild(rc.polygon(pts, { stroke:shadeHex(cfg.ground,-20), fill:cfg.ground, fillStyle:'hachure', roughness:2.8, strokeWidth:1.5 }));
      // Glowing rune
      if (sr()>0.5) {
        const runeEl = svE('circle', { cx:rx, cy:H*0.6-rh*0.5, r:8, fill:'none', stroke:cfg.accent||'#C06EFF', 'stroke-width':1.5, opacity:0.7 });
        runeEl.setAttribute('class','eyeGlow');
        svgEl2.appendChild(runeEl);
      }
    }
    // Vines
    for (let i = 0; i < 4; i++) {
      svgEl2.appendChild(rc.path(`M ${sr()*W} ${H*0.35+sr()*0.15*H} Q ${sr()*W} ${H*0.5} ${sr()*W} ${H*0.65}`, {
        stroke:cfg.vine||'#2D5A18', fill:'none', strokeWidth:2, roughness:3
      }));
    }
  }

  if (type === 'prairie') {
    // Dawn sky glow
    svgEl2.appendChild(rc.circle(W*0.5, H*0.12, 40, { stroke:'#FFD060', fill:'#FFF080', fillStyle:'solid', roughness:0.7 }));
    // Rolling hills
    [[0.35,'#7a6030'],[0.42,'#8a7040'],[0.5,'#9a8050']].forEach(([yFrac, col], i) => {
      svgEl2.appendChild(rc.path(
        `M 0 ${H*yFrac} Q ${W*0.25} ${H*(yFrac-0.06+i*0.01)} ${W*0.5} ${H*yFrac} Q ${W*0.75} ${H*(yFrac+0.04-i*0.01)} ${W} ${H*yFrac} L ${W} ${H} L 0 ${H} Z`,
        { stroke:'none', fill:col, fillStyle:'solid', roughness:0 }
      ));
    });
    // Fence
    for (let i = 0; i < 11; i++) {
      svgEl2.appendChild(rc.line(i*(W/10), H*0.5, i*(W/10), H*0.5-18, { stroke:'#6B4220', strokeWidth:2.5, roughness:1.8 }));
    }
    svgEl2.appendChild(rc.line(0, H*0.5-10, W, H*0.5-11, { stroke:'#6B4220', strokeWidth:2, roughness:2.5 }));
    // Tumbleweeds
    for (let i = 0; i < 4; i++) {
      svgEl2.appendChild(rc.circle(sr()*W, H*0.5+sr()*10, 8+sr()*8, { stroke:'#8B6020', fill:'none', roughness:3.5 }));
    }
  }

  if (type === 'olympus') {
    // Brilliant sun
    svgEl2.appendChild(rc.circle(W*0.5, H*0.08, 50, { stroke:'#FFE040', fill:'#FFF380', fillStyle:'solid', roughness:0.6 }));
    for (let i = 0; i < 14; i++) {
      const a = (i/14)*Math.PI*2;
      svgEl2.appendChild(rc.line(W*0.5+Math.cos(a)*30, H*0.08+Math.sin(a)*30, W*0.5+Math.cos(a)*46, H*0.08+Math.sin(a)*46, { stroke:'#FFE040', strokeWidth:2, roughness:1.5 }));
    }
    // Clouds
    for (let i = 0; i < 10; i++) {
      const cEl = rc.ellipse(sr()*W, H*(0.1+sr()*0.45), 60+sr()*100, 18+sr()*14, { stroke:'#e8e8e8', fill:'white', fillStyle:'solid', roughness:2.5 });
      cEl.setAttribute('class','driftCloud');
      cEl.style.animationDuration = `${22+sr()*18}s`;
      cEl.style.animationDelay = `${sr()*-15}s`;
      svgEl2.appendChild(cEl);
    }
    // Marble pillars
    for (let i = 0; i < 6; i++) {
      const px = W*0.06+i*(W/5.5);
      svgEl2.appendChild(rc.rectangle(px-8, H*0.12, 16, H*0.52, { stroke:'#d8d0c0', fill:'#F0E8D8', fillStyle:'hachure', roughness:1.2, strokeWidth:1.5 }));
      svgEl2.appendChild(rc.rectangle(px-12, H*0.12-8, 24, 10, { stroke:'#c8c0b0', fill:'#e8e0d0', fillStyle:'solid', roughness:1.2 }));
    }
    svgEl2.appendChild(rc.line(0, H*0.64, W, H*0.64, { stroke:'#FFD700', strokeWidth:3, roughness:1.5 }));
  }

  // ── Ground ──────────────────────────────────────────────────────────
  const groundPts = [];
  for (let i = 0; i <= 16; i++) {
    const gx = i*(W/16);
    let gy;
    if (type==='ocean') gy = H*0.62+Math.sin(i*0.5)*6;
    else if (type==='dungeon'||type==='castle') gy = H*0.72+sr()*4;
    else if (type==='space'||type==='neon_city') gy = H*0.75+sr()*3;
    else if (type==='olympus') gy = H*0.64+Math.sin(i*0.4)*12;
    else gy = H*0.65+Math.sin(i*0.6)*14+Math.sin(i*1.4)*7;
    groundPts.push([gx, gy]);
  }
  const groundPath = 'M ' + groundPts.map(([x,y])=>`${x} ${y}`).join(' L ') + ` L ${W} ${H} L 0 ${H} Z`;
  svgEl2.appendChild(rc.path(groundPath, { stroke:'none', fill:cfg.ground, fillStyle:'solid', roughness:0 }));
  // Rough ground overlay
  svgEl2.appendChild(rc.path('M ' + groundPts.map(([x,y])=>`${x} ${y}`).join(' L '), {
    stroke:shadeHex(cfg.ground,15), fill:'none', strokeWidth:2.5, roughness:2.8
  }));
  // Mid-ground band
  const midPts = groundPts.map(([x,y]) => [x, y-18]);
  svgEl2.appendChild(rc.path('M ' + midPts.map(([x,y])=>`${x} ${y}`).join(' L ') + ` L ${W} ${H*0.8} L 0 ${H*0.8} Z`, {
    stroke:'none', fill:shadeHex(cfg.ground,-15), fillStyle:'solid', roughness:0
  }));

  // ── Vignette ────────────────────────────────────────────────────────
  const vigDefs = svgEl2.querySelector('defs') || (() => { const d=svE('defs',{}); svgEl2.appendChild(d); return d; })();
  const radGrad = svE('radialGradient', { id:'tvg', cx:'50%', cy:'50%', r:'70%' });
  radGrad.appendChild(Object.assign(svE('stop', { offset:'0%', 'stop-color':'transparent' })));
  radGrad.appendChild(Object.assign(svE('stop', { offset:'100%', 'stop-color':'rgba(4,2,8,0.7)' })));
  vigDefs.appendChild(radGrad);
  svgEl2.appendChild(svE('rect', { x:0, y:0, width:W, height:H, fill:'url(#tvg)' }));
}

// ── Animated Title Background ──────────────────────────────────────────
function AnimatedBackground({ sceneIdx }) {
  const svgRef = useRef(null);
  const type = BG_SCENES[sceneIdx % BG_SCENES.length];

  useEffect(() => {
    if (!svgRef.current) return;
    try { drawTitleBg(svgRef.current, type, sceneIdx * 137); } catch(e) { console.warn('title bg err', e); }
  }, [type, sceneIdx]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 420"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}
    />
  );
}

// Floating particles (kept for sparkle on top of SVG)
function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i, x: Math.random()*100, delay: Math.random()*8,
    duration: 6+Math.random()*10, size: 1+Math.random()*2.5,
    type: Math.random() > 0.5 ? 'ember' : 'star',
  }));
  return (
    <div className={styles.particles}>
      {particles.map(p => (
        <div key={p.id} className={`${styles.particle} ${styles[p.type]}`}
          style={{ left:`${p.x}%`, width:p.size, height:p.size, animationDelay:`${p.delay}s`, animationDuration:`${p.duration}s` }} />
      ))}
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
