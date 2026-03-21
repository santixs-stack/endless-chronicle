import { useMemo } from 'react';
import styles from './SceneRenderer.module.css';
import { W as ART_W, H as ART_H } from './artStyle.js';

// ═══════════════════════════════════════════
//  SCENE RENDERER v3 — Rich layered SVG
//  Full depth: sky → background → midground
//  → props → terrain → foreground → FX
// ═══════════════════════════════════════════

const W = ART_W, H = ART_H;

// Seeded deterministic random
function mkRand(seed) {
  let s = (seed | 0) + 1;
  return () => { s = (s * 16807 + 7) % 2147483647; return (s - 1) / 2147483646; };
}

// Sky gradient stops per time
const SKY = {
  day:   [['#2856a8',0],['#4a7fcc',45],['#93c0ee',100]],
  night: [['#020810',0],['#040e1e',50],['#0a1830',100]],
  dawn:  [['#6b1008',0],['#c04020',30],['#f09040',70],['#fad090',100]],
  dusk:  [['#3a0828',0],['#8c1840',35],['#d05040',65],['#e89060',100]],
  cave:  [['#020208',0],['#06040e',50],['#0c0818',100]],
  storm: [['#10121e',0],['#1e2030',50],['#2c2e40',100]],
};

// Color palettes per scene
const PAL = {
  dungeon:  { g:['#181424','#221c30','#2c2440'], light:'#ff8830', accent:'#c4a84f', fog:'.7', stars:false },
  cave:     { g:['#0c0814','#100c1c','#160e24'], light:'#4060ff', accent:'#5595e0', fog:'.85', stars:false },
  forest:   { g:['#0e2a08','#1a4010','#266018'], light:'#c8e890', accent:'#6dbb7c', fog:'.4', stars:false },
  plains:   { g:['#284010','#3a5818','#4c7020'], light:'#ffe080', accent:'#c4a84f', fog:'.2', stars:false },
  castle:   { g:['#1a1630','#22203e','#2a284c'], light:'#a870ff', accent:'#a87ed4', fog:'.5', stars:true  },
  ruins:    { g:['#201a2c','#2a2438','#342e44'], light:'#c080ff', accent:'#a87ed4', fog:'.55', stars:true  },
  ocean:    { g:['#041020','#082040','#0c3060'], light:'#40b0ff', accent:'#5595e0', fog:'.3', stars:false },
  space:    { g:['#04020c','#06040e','#0a0818'], light:'#8060ff', accent:'#5595e0', fog:'.15', stars:true  },
  village:  { g:['#1c2c10','#283c18','#344c20'], light:'#ffa040', accent:'#c4a84f', fog:'.2', stars:true  },
  city:     { g:['#101020','#181828','#202032'], light:'#ff6040', accent:'#e05555', fog:'.4', stars:true  },
  desert:   { g:['#7a5018','#9a6820','#ba8028'], light:'#ffc040', accent:'#e09030', fog:'.25', stars:false },
  mountain: { g:['#202838','#2c3448','#384058'], light:'#80c0ff', accent:'#5595e0', fog:'.35', stars:true  },
  swamp:    { g:['#0e1c0a','#162814','#1e341c'], light:'#60c040', accent:'#6dbb7c', fog:'.7', stars:false },
  snow:     { g:['#a8c0d0','#c0d8e8','#d8eef8'], light:'#c0e0ff', accent:'#5595e0', fog:'.4', stars:true  },
};

// Class silhouette shapes
const CLASS_SILHOUETTES = {
  warrior:    (x,y,c) => `<g fill="${c}" opacity=".85"><rect x="${x-3}" y="${y-28}" width="6" height="20" rx="2"/><circle cx="${x}" cy="${y-32}" r="5"/><rect x="${x+4}" y="${y-30}" width="2" height="18" rx="1"/><rect x="${x-8}" y="${y-24}" width="6" height="2" rx="1"/></g>`,
  mage:       (x,y,c) => `<g fill="${c}" opacity=".85"><rect x="${x-2.5}" y="${y-28}" width="5" height="20" rx="2"/><circle cx="${x}" cy="${y-32}" r="5"/><line x1="${x}" y1="${y-38}" x2="${x}" y2="${y-34}" stroke="${c}" stroke-width="1.5"/><circle cx="${x}" cy="${y-39}" r="2" fill="${c}" opacity=".9"/></g>`,
  rogue:      (x,y,c) => `<g fill="${c}" opacity=".85"><rect x="${x-2}" y="${y-26}" width="4" height="18" rx="2"/><circle cx="${x}" cy="${y-30}" r="4.5"/><path d="M${x-6},${y-20} L${x-2},${y-26} L${x-2},${y-16} Z" opacity=".7"/></g>`,
  ranger:     (x,y,c) => `<g fill="${c}" opacity=".85"><rect x="${x-2}" y="${y-28}" width="4" height="20" rx="2"/><circle cx="${x}" cy="${y-32}" r="4.5"/><line x1="${x-10}" y1="${y-28}" x2="${x+10}" y2="${y-28}" stroke="${c}" stroke-width="1.5"/><line x1="${x+2}" y1="${y-35}" x2="${x+10}" y2="${y-28}" stroke="${c}" stroke-width="1"/></g>`,
  healer:     (x,y,c) => `<g fill="${c}" opacity=".85"><rect x="${x-2.5}" y="${y-28}" width="5" height="20" rx="2"/><circle cx="${x}" cy="${y-32}" r="5"/><line x1="${x-4}" y1="${y-32}" x2="${x+4}" y2="${y-32}" stroke="${c}" stroke-width="1.5"/><line x1="${x}" y1="${y-36}" x2="${x}" y2="${y-28}" stroke="${c}" stroke-width="1.5"/></g>`,
  bard:       (x,y,c) => `<g fill="${c}" opacity=".85"><rect x="${x-2}" y="${y-26}" width="4" height="18" rx="2"/><circle cx="${x}" cy="${y-30}" r="4.5"/><ellipse cx="${x+5}" cy="${y-24}" rx="4" ry="6" opacity=".6"/></g>`,
  spaceranger:(x,y,c) => `<g fill="${c}" opacity=".85"><rect x="${x-3}" y="${y-28}" width="6" height="20" rx="1"/><rect x="${x-4}" y="${y-32}" width="8" height="8" rx="3"/><rect x="${x-5}" y="${y-24}" width="3" height="8" rx="1" opacity=".7"/><rect x="${x+2}" y="${y-24}" width="3" height="8" rx="1" opacity=".7"/></g>`,
  pirate:     (x,y,c) => `<g fill="${c}" opacity=".85"><rect x="${x-2.5}" y="${y-28}" width="5" height="20" rx="2"/><circle cx="${x}" cy="${y-32}" r="5"/><path d="M${x-5},${y-37} L${x+5},${y-37} L${x+3},${y-32} L${x-3},${y-32} Z" opacity=".8"/><line x1="${x+5}" y1="${y-28}" x2="${x+12}" y2="${y-22}" stroke="${c}" stroke-width="1.5"/></g>`,
};

function getCharSvg(cls, x, y, color) {
  const fn = CLASS_SILHOUETTES[cls] || CLASS_SILHOUETTES.warrior;
  return fn(x, y, color);
}

export default function SceneRenderer({ scene, players, turnCount = 0 }) {
  const type  = scene?.type  || 'plains';
  const time  = scene?.time  || 'night';
  const weather = scene?.weather || 'clear';
  const mood  = scene?.mood  || '';

  const pal   = PAL[type] || PAL.plains;
  const sky   = SKY[time] || SKY.night;
  const r     = useMemo(() => mkRand(turnCount * 997 + type.charCodeAt(0) * 31), [turnCount, type]);
  const rStatic = useMemo(() => mkRand(type.charCodeAt(0) * 1337), [type]);

  // ── Stars ─────────────────────────────────
  const stars = useMemo(() => {
    if (!pal.stars && time !== 'night') return [];
    const sr = mkRand(turnCount * 7 + 99);
    return Array.from({ length: 80 }, (_, i) => ({
      x: sr() * W, y: sr() * H * 0.55,
      r: sr() * 1.6 + 0.2,
      op: sr() * 0.6 + 0.25,
      twinkle: sr() > 0.6,
    }));
  }, [pal.stars, time, turnCount]);

  // ── Clouds ────────────────────────────────
  const clouds = useMemo(() => {
    if (type === 'dungeon' || type === 'cave' || type === 'space') return [];
    const cr = mkRand(turnCount * 13 + 77);
    const count = weather === 'storm' ? 6 : weather === 'cloudy' ? 4 : 2;
    return Array.from({ length: count }, (_, i) => ({
      x: cr() * W * 1.4 - W * 0.2,
      y: cr() * H * 0.3 + 5,
      w: 60 + cr() * 100,
      h: 18 + cr() * 22,
      op: weather === 'storm' ? 0.5 + cr() * 0.3 : 0.12 + cr() * 0.15,
      speed: 20 + cr() * 40,
    }));
  }, [type, weather, turnCount]);

  // ── Background elements ───────────────────
  const bgElements = useMemo(() => {
    const br = mkRand(type.charCodeAt(0) * 77 + turnCount);
    const els = [];

    if (type === 'castle' || type === 'ruins') {
      // Distant towers + walls
      for (let i = 0; i < 4; i++) {
        const x = 60 + i * (W / 4) + br() * 40 - 20;
        const h = 55 + br() * 70;
        const w = 22 + br() * 18;
        els.push({ type:'tower', x, h, w, windows: Math.floor(br()*3)+1 });
      }
      // Connecting wall
      els.push({ type:'wall', y: H * 0.48 });
    }

    if (type === 'city') {
      for (let i = 0; i < 14; i++) {
        const x = i * (W / 12) + br() * 20 - 10;
        const h = 30 + br() * 110;
        const w = 24 + br() * 32;
        const floors = Math.floor(h / 14);
        els.push({ type:'building', x, h, w, floors });
      }
    }

    if (type === 'space') {
      // Planets + moons
      for (let i = 0; i < 4; i++) {
        els.push({
          type:'planet', x: 40 + br() * (W-80), y: 10 + br() * (H*0.45),
          r: 8 + br() * 35, hue: Math.floor(br()*360),
          rings: br() > 0.5,
        });
      }
      // Space station silhouette
      els.push({ type:'station', x: W*0.7, y: H*0.18 });
    }

    if (type === 'ocean') {
      // Distant ship
      els.push({ type:'ship', x: W*0.7 + br()*100-50, y: H*0.48 });
      // Lighthouse
      els.push({ type:'lighthouse', x: W*0.15 + br()*40 });
    }

    if (type === 'desert') {
      // Pyramid
      els.push({ type:'pyramid', x: W*0.65 + br()*60-30, y: H*0.52 });
      // Distant dunes
      for (let i = 0; i < 3; i++) {
        els.push({ type:'dune', x: br()*W, y: H*0.4 + br()*20, w: 80+br()*120, h: 25+br()*30 });
      }
    }

    if (type === 'mountain') {
      // Snow-capped peaks
      for (let i = 0; i < 5; i++) {
        const x = br()*W;
        const h = 60 + br()*90;
        els.push({ type:'peak', x, h });
      }
    }

    if (type === 'village') {
      // Cottages
      for (let i = 0; i < 5; i++) {
        els.push({ type:'cottage', x: 40 + i*(W/5) + br()*30-15, y: H*0.58 - br()*15, lit: br() > 0.4 });
      }
      // Windmill
      els.push({ type:'windmill', x: W*0.8, y: H*0.52 });
    }

    return els;
  }, [type, turnCount]);

  // ── Terrain silhouette ────────────────────
  const terrain = useMemo(() => {
    const tr = mkRand(type.charCodeAt(0) * 77 + Math.floor(turnCount / 3));
    const steps = 28;
    const pts = Array.from({ length: steps + 1 }, (_, i) => {
      const x = (i / steps) * W;
      let y;
      if (type === 'mountain') y = H * 0.5 + Math.sin(i * 0.85) * 48 + Math.sin(i*1.7)*18 + tr()*14;
      else if (type === 'dungeon' || type === 'cave') y = H * 0.72 + tr() * 6;
      else if (type === 'ocean') y = H * 0.54 + Math.sin(i * 0.55 + turnCount * 0.15) * 9 + tr() * 4;
      else if (type === 'desert') y = H * 0.6 + Math.sin(i * 0.4) * 18 + tr() * 10;
      else if (type === 'snow') y = H * 0.62 + Math.sin(i * 0.5) * 10 + tr() * 8;
      else y = H * 0.63 + Math.sin(i * 0.65) * 16 + Math.sin(i * 1.3) * 8 + tr() * 10;
      return { x, y };
    });
    const d = `M0,${H} L${pts.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L')} L${W},${H} Z`;
    return { pts, d };
  }, [type, turnCount]);

  // ── Scene props (midground) ───────────────
  const props = useMemo(() => {
    const pr = mkRand(turnCount * 53 + type.charCodeAt(0) * 19);
    const list = [];

    if (type === 'forest' || type === 'plains' || type === 'swamp') {
      for (let i = 0; i < 12; i++) {
        const x = pr() * W;
        const baseY = terrain.pts[Math.round((x/W)*28)]?.y || H*0.63;
        const h = 32 + pr() * 65;
        const fat = type === 'swamp';
        list.push({ type:'tree', x, y:baseY, h, w:14+pr()*22, fat, dead: type==='swamp' && pr()>0.6 });
      }
    }

    if (type === 'dungeon' || type === 'cave') {
      // Stalactites + stalagmites
      for (let i = 0; i < 8; i++) {
        const x = 20 + pr() * (W-40);
        list.push({ type:'stalactite', x, len:15+pr()*45 });
        list.push({ type:'stalagmite', x:x+pr()*20-10, y:H*0.72, len:8+pr()*25 });
      }
      // Crystal formations
      for (let i = 0; i < 4; i++) {
        list.push({ type:'crystal', x:pr()*W, y:H*0.65+pr()*20, h:10+pr()*25 });
      }
      // Torches
      [W*0.15, W*0.45, W*0.75].forEach(x => list.push({ type:'torch', x }));
    }

    if (type === 'ocean') {
      // Waves at different depths
      for (let i = 0; i < 6; i++) {
        list.push({ type:'wave', x:pr()*W, y:H*0.5+pr()*20, len:30+pr()*50, phase:pr()*Math.PI*2 });
      }
      // Rocks
      for (let i = 0; i < 3; i++) {
        list.push({ type:'rock', x:pr()*W, y:H*0.55+pr()*15 });
      }
    }

    if (type === 'space') {
      // Asteroid field
      for (let i = 0; i < 12; i++) {
        list.push({ type:'asteroid', x:pr()*W, y:pr()*H*0.7, r:2+pr()*8 });
      }
      // Nebula wisps
      for (let i = 0; i < 3; i++) {
        list.push({ type:'nebula', x:pr()*W, y:pr()*H*0.6, r:20+pr()*50, hue:pr()*360 });
      }
    }

    if (type === 'desert') {
      // Cacti
      for (let i = 0; i < 5; i++) {
        const x = pr()*W;
        list.push({ type:'cactus', x, y:terrain.pts[Math.round((x/W)*28)]?.y||H*0.6 });
      }
    }

    if (type === 'snow') {
      // Bare trees + snow piles
      for (let i = 0; i < 8; i++) {
        const x = pr()*W;
        const baseY = terrain.pts[Math.round((x/W)*28)]?.y||H*0.62;
        list.push({ type:'snowtree', x, y:baseY, h:20+pr()*45 });
      }
    }

    // Dungeon: treasure chest occasionally
    if ((type==='dungeon'||type==='ruins') && pr()>0.5) {
      list.push({ type:'chest', x:W*0.3+pr()*W*0.4, y:H*0.7 });
    }

    // Portal / arcane circle for magic scenes
    if ((type==='castle'||type==='ruins') && pr()>0.6) {
      list.push({ type:'portal', x:W*0.5+pr()*100-50, y:H*0.6 });
    }

    return list;
  }, [type, turnCount, terrain.pts]);

  // ── Foreground elements ───────────────────
  const fgElements = useMemo(() => {
    const fr = mkRand(turnCount * 29 + type.charCodeAt(0) * 7);
    const list = [];
    // Foreground grass tufts / rocks
    for (let i = 0; i < 8; i++) {
      const x = fr() * W;
      if (type === 'forest' || type === 'plains' || type === 'village') {
        list.push({ type:'tuft', x, y:H - 8 - fr()*12 });
      } else if (type === 'dungeon' || type === 'cave') {
        list.push({ type:'pebble', x, y:H - 4 - fr()*6 });
      }
    }
    return list;
  }, [type, turnCount]);

  // ── Character silhouettes ─────────────────
  const charPositions = useMemo(() => {
    if (!players?.length) return [];
    const baseY = terrain.pts[14]?.y || H * 0.65;
    const spacing = Math.min(60, W / (players.length + 1));
    const startX = W / 2 - (spacing * (players.length - 1)) / 2;
    return players.map((p, i) => ({
      x: startX + i * spacing,
      y: baseY,
      cls: p.class || 'warrior',
      color: p.color || '#c4a84f',
    }));
  }, [players, terrain.pts]);

  // ── Weather particles ─────────────────────
  const weatherParticles = useMemo(() => {
    if (weather === 'rain' || weather === 'storm') {
      const wr = mkRand(turnCount * 41);
      return { type:'rain', drops: Array.from({length:50}, () => ({
        x:wr()*W, y:wr()*H, len:8+wr()*12, op:0.2+wr()*0.4
      }))};
    }
    if (weather === 'snow') {
      const sr = mkRand(turnCount * 37);
      return { type:'snow', flakes: Array.from({length:40}, () => ({
        x:sr()*W, y:sr()*H, r:1+sr()*2.5, op:0.4+sr()*0.5
      }))};
    }
    if (type === 'dungeon' || type === 'cave') {
      const er = mkRand(turnCount * 23);
      return { type:'embers', sparks: Array.from({length:15}, () => ({
        x:er()*W, y:H*0.3+er()*H*0.4, r:0.8+er()*1.5, op:0.3+er()*0.5
      }))};
    }
    if (type === 'swamp') {
      const br = mkRand(turnCount * 19);
      return { type:'bubbles', list: Array.from({length:10}, () => ({
        x:br()*W, y:H*0.6+br()*0.3*H, r:2+br()*5, op:0.2+br()*0.4
      }))};
    }
    return null;
  }, [weather, type, turnCount]);

  const fogOp = weather==='fog' ? 0.7 : weather==='storm' ? 0.4 : parseFloat(pal.fog) * 0.6;
  const uid = `s${turnCount}${type.slice(0,2)}`;

  return (
    <div className={styles.wrapper}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" className={styles.svg}>
        <defs>
          {/* Sky */}
          <linearGradient id={`sky${uid}`} x1="0" y1="0" x2="0" y2="1">
            {sky.map(([c,o],i) => <stop key={i} offset={`${o}%`} stopColor={c}/>)}
          </linearGradient>
          {/* Ground */}
          <linearGradient id={`gnd${uid}`} x1="0" y1="0" x2="0" y2="1">
            {pal.g.map((c,i) => <stop key={i} offset={`${(i/(pal.g.length-1))*100}%`} stopColor={c}/>)}
          </linearGradient>
          {/* Fog */}
          <linearGradient id={`fog${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#080610" stopOpacity="0"/>
            <stop offset="50%" stopColor="#080610" stopOpacity={fogOp * 0.5}/>
            <stop offset="100%" stopColor="#080610" stopOpacity={fogOp}/>
          </linearGradient>
          {/* Ambient */}
          <radialGradient id={`amb${uid}`} cx="50%" cy="100%" r="65%">
            <stop offset="0%" stopColor={pal.light} stopOpacity=".16"/>
            <stop offset="100%" stopColor={pal.light} stopOpacity="0"/>
          </radialGradient>
          {/* Torch glow */}
          <radialGradient id={`torch${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={pal.light} stopOpacity=".35"/>
            <stop offset="100%" stopColor={pal.light} stopOpacity="0"/>
          </radialGradient>
          {/* God rays filter */}
          <filter id={`glow${uid}`}><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id={`sglow${uid}`}><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id={`softblur${uid}`}><feGaussianBlur stdDeviation="2"/></filter>
        </defs>

        {/* ── Sky ── */}
        <rect width={W} height={H} fill={`url(#sky${uid})`}/>

        {/* ── Stars ── */}
        {stars.map((s,i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={s.op}
            className={s.twinkle ? styles.twinkle : undefined}
            style={s.twinkle ? {animationDelay:`${(i*0.31)%4}s`} : undefined}/>
        ))}

        {/* ── Aurora / Nebula bg for space/night ── */}
        {type === 'space' && (
          <g opacity=".25">
            <ellipse cx={W*0.3} cy={H*0.2} rx={120} ry={40} fill="#6040ff" filter={`url(#softblur${uid})`}/>
            <ellipse cx={W*0.75} cy={H*0.35} rx={90} ry={35} fill="#ff4080" filter={`url(#softblur${uid})`}/>
          </g>
        )}

        {/* ── Moon / Sun ── */}
        {(time==='night'||time==='cave') && (
          <g filter={`url(#sglow${uid})`}>
            <circle cx={W*0.84} cy={H*0.18} r={18} fill="#e8d870" opacity=".92"/>
            <circle cx={W*0.84+6} cy={H*0.18-4} r={13} fill={sky[0][0]} opacity=".55"/>
            {/* Moon craters */}
            <circle cx={W*0.84-4} cy={H*0.18+3} r={3} fill="#d0c050" opacity=".4"/>
            <circle cx={W*0.84+5} cy={H*0.18+6} r={2} fill="#d0c050" opacity=".3"/>
          </g>
        )}
        {(time==='dawn'||time==='dusk') && (
          <g filter={`url(#sglow${uid})`}>
            <circle cx={W*0.15} cy={H*0.38} r={22} fill={time==='dawn'?'#ffaa28':'#ff8030'} opacity=".9"/>
            {/* Sun rays */}
            {Array.from({length:8},(_,i)=>{
              const a=(i/8)*Math.PI*2; const r1=25; const r2=35;
              return <line key={i} x1={W*0.15+Math.cos(a)*r1} y1={H*0.38+Math.sin(a)*r1}
                x2={W*0.15+Math.cos(a)*r2} y2={H*0.38+Math.sin(a)*r2}
                stroke={time==='dawn'?'#ffaa28':'#ff8030'} strokeWidth="1.5" opacity=".5"/>;
            })}
          </g>
        )}
        {time==='day' && (
          <g filter={`url(#sglow${uid})`}>
            <circle cx={W*0.82} cy={H*0.13} r={20} fill="#ffee60" opacity=".96"/>
            {Array.from({length:8},(_,i)=>{
              const a=(i/8)*Math.PI*2;
              return <line key={i} x1={W*0.82+Math.cos(a)*23} y1={H*0.13+Math.sin(a)*23}
                x2={W*0.82+Math.cos(a)*33} y2={H*0.13+Math.sin(a)*33}
                stroke="#ffee60" strokeWidth="2" opacity=".4"/>;
            })}
          </g>
        )}

        {/* ── Clouds ── */}
        {clouds.map((cl,i) => (
          <g key={i} className={styles.driftCloud} style={{animationDuration:`${cl.speed}s`,animationDelay:`${i*-8}s`}}>
            <ellipse cx={cl.x} cy={cl.y} rx={cl.w*0.5} ry={cl.h*0.5} fill="white" opacity={cl.op}/>
            <ellipse cx={cl.x+cl.w*0.18} cy={cl.y-cl.h*0.25} rx={cl.w*0.3} ry={cl.h*0.4} fill="white" opacity={cl.op}/>
            <ellipse cx={cl.x-cl.w*0.18} cy={cl.y-cl.h*0.15} rx={cl.w*0.25} ry={cl.h*0.35} fill="white" opacity={cl.op*0.8}/>
          </g>
        ))}

        {/* ── Background elements ── */}
        {bgElements.map((el,i) => {
          if (el.type==='tower') return (
            <g key={i}>
              <rect x={el.x-el.w/2} y={H*0.6-el.h} width={el.w} height={el.h} fill={pal.g[0]} opacity=".85"/>
              {/* Battlements */}
              {Array.from({length:Math.floor(el.w/7)},(_,j)=>(
                <rect key={j} x={el.x-el.w/2+j*7} y={H*0.6-el.h-8} width={4} height={8} fill={pal.g[0]} opacity=".85"/>
              ))}
              {/* Windows */}
              {Array.from({length:el.windows},(_,j)=>(
                <rect key={j} x={el.x-3} y={H*0.6-el.h+10+j*20} width={6} height={8} rx={3}
                  fill={pal.light} opacity={time==='night'||time==='dusk'?0.7:0.15}/>
              ))}
            </g>
          );
          if (el.type==='wall') return (
            <rect key={i} x={0} y={el.y} width={W} height={6} fill={pal.g[0]} opacity=".6"/>
          );
          if (el.type==='building') return (
            <g key={i}>
              <rect x={el.x} y={H*0.65-el.h} width={el.w} height={el.h} fill={pal.g[1]} opacity=".8"/>
              {/* Windows grid */}
              {Array.from({length:el.floors},(_,row)=>
                Array.from({length:Math.floor(el.w/10)},(_,col)=>(
                  <rect key={`${row}-${col}`} x={el.x+3+col*10} y={H*0.65-el.h+6+row*14} width={5} height={6}
                    fill={pal.light} opacity={Math.random()>0.4?0.6:0.05}/>
                ))
              )}
            </g>
          );
          if (el.type==='planet') return (
            <g key={i} filter={`url(#glow${uid})`}>
              <circle cx={el.x} cy={el.y} r={el.r} fill={`hsl(${el.hue},55%,38%)`} opacity=".75"/>
              <circle cx={el.x-el.r*0.28} cy={el.y-el.r*0.22} r={el.r*0.55} fill={sky[0][0]} opacity=".35"/>
              {el.rings && <ellipse cx={el.x} cy={el.y} rx={el.r*1.7} ry={el.r*0.28}
                fill="none" stroke={`hsl(${el.hue},40%,55%)`} strokeWidth="2" opacity=".4"/>}
            </g>
          );
          if (el.type==='station') return (
            <g key={i} fill={pal.g[1]} opacity=".6">
              <rect x={el.x-20} y={el.y-6} width={40} height={12} rx={3}/>
              <rect x={el.x-35} y={el.y-3} width={15} height={6} rx={1}/>
              <rect x={el.x+20} y={el.y-3} width={15} height={6} rx={1}/>
              <circle cx={el.x} cy={el.y} r={4} fill={pal.light} opacity=".5"/>
            </g>
          );
          if (el.type==='ship') return (
            <g key={i} fill={pal.g[0]} opacity=".7">
              <path d={`M${el.x-25},${el.y} L${el.x+25},${el.y} L${el.x+20},${el.y+10} L${el.x-20},${el.y+10} Z`}/>
              <line x1={el.x} y1={el.y} x2={el.x} y2={el.y-35} stroke={pal.g[0]} strokeWidth="2"/>
              <path d={`M${el.x},${el.y-35} L${el.x+18},${el.y-20} L${el.x},${el.y-18} Z`} opacity=".5"/>
            </g>
          );
          if (el.type==='lighthouse') return (
            <g key={i} fill={pal.g[1]} opacity=".8">
              <rect x={el.x-5} y={H*0.35} width={10} height={H*0.25} rx={2}/>
              <ellipse cx={el.x} cy={H*0.35} rx={7} ry={5} fill={pal.g[0]}/>
              <circle cx={el.x} cy={H*0.35} r={4} fill={pal.light} opacity=".7" filter={`url(#glow${uid})`}/>
            </g>
          );
          if (el.type==='pyramid') return (
            <polygon key={i} points={`${el.x},${el.y-50} ${el.x-40},${el.y} ${el.x+40},${el.y}`}
              fill={pal.g[1]} opacity=".75"/>
          );
          if (el.type==='dune') return (
            <ellipse key={i} cx={el.x} cy={el.y} rx={el.w/2} ry={el.h/2} fill={pal.g[1]} opacity=".5"/>
          );
          if (el.type==='peak') return (
            <g key={i}>
              <polygon points={`${el.x},${H*0.62-el.h} ${el.x-el.h*0.5},${H*0.62} ${el.x+el.h*0.5},${H*0.62}`}
                fill={pal.g[0]} opacity=".8"/>
              {/* Snow cap */}
              <polygon points={`${el.x},${H*0.62-el.h} ${el.x-el.h*0.15},${H*0.62-el.h*0.6} ${el.x+el.h*0.15},${H*0.62-el.h*0.6}`}
                fill="white" opacity=".6"/>
            </g>
          );
          if (el.type==='cottage') return (
            <g key={i}>
              <rect x={el.x-15} y={el.y-20} width={30} height={20} fill={pal.g[1]} opacity=".85"/>
              <polygon points={`${el.x-18},${el.y-20} ${el.x+18},${el.y-20} ${el.x},${el.y-36}`}
                fill={pal.g[0]} opacity=".9"/>
              {el.lit && <rect x={el.x-5} y={el.y-17} width={8} height={7} rx={1}
                fill={pal.light} opacity=".75"/>}
              {/* Chimney smoke */}
              {el.lit && <g className={styles.smokeRise} opacity=".4">
                <circle cx={el.x+8} cy={el.y-40} r={3} fill="#888"/>
                <circle cx={el.x+10} cy={el.y-47} r={4} fill="#888"/>
              </g>}
            </g>
          );
          if (el.type==='windmill') return (
            <g key={i} fill={pal.g[1]} opacity=".75">
              <rect x={el.x-6} y={el.y-45} width={12} height={45} rx={2}/>
              <g className={styles.windmillSpin} style={{transformOrigin:`${el.x}px ${el.y-45}px`}}>
                {[[0,-25],[18,18],[-18,18]].map(([dx,dy],j)=>(
                  <line key={j} x1={el.x} y1={el.y-45} x2={el.x+dx} y2={el.y-45+dy}
                    stroke={pal.g[1]} strokeWidth="3" opacity=".8"/>
                ))}
              </g>
            </g>
          );
          return null;
        })}

        {/* ── Terrain ── */}
        <path d={terrain.d} fill={`url(#gnd${uid})`}/>

        {/* ── Props (trees, crystals, waves etc) ── */}
        {props.map((el,i) => {
          if (el.type==='tree') return (
            <g key={i}>
              <rect x={el.x-2.5} y={el.y-el.h*0.3} width={5} height={el.h*0.3+2}
                fill={el.dead ? '#3a2a1a' : pal.g[0]}/>
              <ellipse cx={el.x} cy={el.y-el.h*0.55} rx={el.w*0.52} ry={el.h*0.55}
                fill={el.dead ? '#2a1a0a' : pal.g[1]} opacity=".9"/>
              {!el.dead && <ellipse cx={el.x} cy={el.y-el.h*0.6} rx={el.w*0.34} ry={el.h*0.38}
                fill={pal.accent} opacity=".2"/>}
            </g>
          );
          if (el.type==='snowtree') return (
            <g key={i}>
              <rect x={el.x-2} y={el.y-el.h*0.3} width={4} height={el.h*0.3} fill="#4a3828"/>
              <polygon points={`${el.x},${el.y-el.h} ${el.x-el.h*0.4},${el.y} ${el.x+el.h*0.4},${el.y}`}
                fill="#1a2830" opacity=".8"/>
              <polygon points={`${el.x},${el.y-el.h} ${el.x-el.h*0.35},${el.y-el.h*0.25} ${el.x+el.h*0.35},${el.y-el.h*0.25}`}
                fill="white" opacity=".5"/>
            </g>
          );
          if (el.type==='stalactite') return (
            <polygon key={i} points={`${el.x-7},0 ${el.x+7},0 ${el.x},${el.len}`}
              fill={pal.g[1]} opacity=".85"/>
          );
          if (el.type==='stalagmite') return (
            <polygon key={i} points={`${el.x-5},${el.y} ${el.x+5},${el.y} ${el.x},${el.y-el.len}`}
              fill={pal.g[1]} opacity=".75"/>
          );
          if (el.type==='crystal') return (
            <g key={i} filter={`url(#glow${uid})`}>
              <polygon points={`${el.x},${el.y-el.h} ${el.x-5},${el.y} ${el.x+5},${el.y}`}
                fill={pal.accent} opacity=".55"/>
              <polygon points={`${el.x+4},${el.y-el.h*0.7} ${el.x+1},${el.y} ${el.x+9},${el.y}`}
                fill={pal.accent} opacity=".35"/>
            </g>
          );
          if (el.type==='torch') return (
            <g key={i} filter={`url(#glow${uid})`}>
              {/* Torch glow pool */}
              <ellipse cx={el.x} cy={H*0.68} rx={28} ry={8} fill={pal.light} opacity=".12"/>
              <rect x={el.x-2} y={H*0.52} width={4} height={14} fill="#7a5020" rx={1}/>
              <ellipse cx={el.x} cy={H*0.51} rx={5} ry={8} fill={pal.light} opacity=".9"
                className={styles.flicker}/>
              <ellipse cx={el.x} cy={H*0.51} rx={3} ry={5} fill="#ffeeaa" opacity=".85"
                className={styles.flicker2}/>
            </g>
          );
          if (el.type==='wave') return (
            <path key={i} d={`M${el.x},${el.y} Q${el.x+el.len/2},${el.y-8} ${el.x+el.len},${el.y}`}
              fill="none" stroke={pal.accent} strokeWidth={1.5} opacity=".35"
              className={styles.waveAnim}/>
          );
          if (el.type==='rock') return (
            <ellipse key={i} cx={el.x} cy={el.y} rx={8+Math.random()*10} ry={5+Math.random()*6}
              fill={pal.g[0]} opacity=".7"/>
          );
          if (el.type==='asteroid') return (
            <ellipse key={i} cx={el.x} cy={el.y} rx={el.r} ry={el.r*0.7} fill={pal.g[1]}
              opacity=".65" transform={`rotate(${el.r*15},${el.x},${el.y})`}/>
          );
          if (el.type==='nebula') return (
            <ellipse key={i} cx={el.x} cy={el.y} rx={el.r} ry={el.r*0.5}
              fill={`hsl(${el.hue},60%,40%)`} opacity=".12" filter={`url(#softblur${uid})`}/>
          );
          if (el.type==='cactus') return (
            <g key={i} fill="#2a5a1a">
              <rect x={el.x-3} y={el.y-28} width={6} height={28} rx={3}/>
              <rect x={el.x-10} y={el.y-20} width={8} height={4} rx={2}/>
              <rect x={el.x+2} y={el.y-16} width={8} height={4} rx={2}/>
            </g>
          );
          if (el.type==='chest') return (
            <g key={i} fill={pal.g[1]} opacity=".8">
              <rect x={el.x-8} y={el.y-10} width={16} height={10} rx={2}/>
              <rect x={el.x-8} y={el.y-14} width={16} height={6} rx={2}/>
              <rect x={el.x-2} y={el.y-12} width={4} height={4} rx={1} fill={pal.accent} opacity=".8"/>
            </g>
          );
          if (el.type==='portal') return (
            <g key={i} filter={`url(#glow${uid})`}>
              <ellipse cx={el.x} cy={el.y} rx={18} ry={26} fill="none"
                stroke={pal.accent} strokeWidth="3" opacity=".7" className={styles.portalSpin}/>
              <ellipse cx={el.x} cy={el.y} rx={13} ry={20} fill={pal.accent} opacity=".12"/>
              <ellipse cx={el.x} cy={el.y} rx={8} ry={14} fill={pal.accent} opacity=".08"
                className={styles.portalPulse}/>
            </g>
          );
          if (el.type==='tuft') return (
            <g key={i} fill={pal.g[1]} opacity=".7">
              <rect x={el.x-1} y={el.y-6} width={2} height={6} rx={1}/>
              <rect x={el.x+3} y={el.y-4} width={2} height={4} rx={1}/>
              <rect x={el.x-4} y={el.y-5} width={2} height={5} rx={1}/>
            </g>
          );
          return null;
        })}

        {/* ── Character silhouettes ── */}
        {charPositions.map((cp,i) => (
          <g key={i} dangerouslySetInnerHTML={{__html: getCharSvg(cp.cls, cp.x, cp.y, cp.color)}}/>
        ))}

        {/* ── Weather ── */}
        {weatherParticles?.type==='rain' && weatherParticles.drops.map((d,i)=>(
          <line key={i} x1={d.x} y1={d.y} x2={d.x-2} y2={d.y+d.len}
            stroke="#88aacc" strokeWidth=".8" opacity={d.op}
            className={styles.rainFall} style={{animationDelay:`${(i*0.04)%1.5}s`}}/>
        ))}
        {weatherParticles?.type==='snow' && weatherParticles.flakes.map((f,i)=>(
          <circle key={i} cx={f.x} cy={f.y} r={f.r} fill="white" opacity={f.op}
            className={styles.snowFall} style={{animationDelay:`${(i*0.15)%3}s`}}/>
        ))}
        {weatherParticles?.type==='embers' && weatherParticles.sparks.map((s,i)=>(
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={pal.light} opacity={s.op}
            className={styles.emberFloat} style={{animationDelay:`${(i*0.3)%4}s`}}/>
        ))}
        {weatherParticles?.type==='bubbles' && weatherParticles.list.map((b,i)=>(
          <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="none"
            stroke={pal.accent} strokeWidth=".8" opacity={b.op}
            className={styles.bubbleRise} style={{animationDelay:`${(i*0.5)%5}s`}}/>
        ))}

        {/* ── Ambient light cone ── */}
        <rect width={W} height={H} fill={`url(#amb${uid})`}/>

        {/* ── Fog ── */}
        <rect width={W} height={H} fill={`url(#fog${uid})`}/>

        {/* ── Lightning flash (storm) ── */}
        {weather==='storm' && (
          <rect width={W} height={H} fill="white" opacity=".04" className={styles.lightning}/>
        )}

        {/* ── Label ── */}
        <text x={W-6} y={H-6} textAnchor="end" fontFamily="monospace" fontSize={8}
          fill="white" opacity=".25" letterSpacing={1}>
          {type.toUpperCase()} · {time.toUpperCase()}
        </text>
      </svg>
    </div>
  );
}
