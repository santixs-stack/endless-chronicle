import { useMemo } from 'react';
import styles from './SceneRenderer.module.css';

// Color palettes per scene type
const PALETTES = {
  dungeon: { ground: ['#1c1828','#241e30','#2e2840'], light: '#ff8c3a', stars: false, accent: '#c4a84f' },
  cave:    { ground: ['#0e0a18','#140e20','#1a1228'], light: '#4060ff', stars: false, accent: '#5595e0' },
  forest:  { ground: ['#1a3a10','#2a5018','#3a6820'], light: '#c8e890', stars: false, accent: '#6dbb7c' },
  plains:  { ground: ['#3a5a1a','#4a7a24','#5a902c'], light: '#ffe080', stars: false, accent: '#c4a84f' },
  castle:  { ground: ['#2a2440','#322c4c','#3c3458'], light: '#a870ff', stars: true,  accent: '#a87ed4' },
  ruins:   { ground: ['#2a2430','#383040','#443c50'], light: '#c080ff', stars: true,  accent: '#a87ed4' },
  ocean:   { ground: ['#061828','#0a2a48','#0e3a60'], light: '#40b0ff', stars: false, accent: '#5595e0' },
  space:   { ground: ['#0a0820','#100e28','#181630'], light: '#8060ff', stars: true,  accent: '#5595e0' },
  village: { ground: ['#2a3a1a','#3a4e24','#4a622e'], light: '#ffa040', stars: true,  accent: '#c4a84f' },
  city:    { ground: ['#181828','#202030','#282838'], light: '#ff6040', stars: true,  accent: '#e05555' },
  desert:  { ground: ['#8a6020','#a07828','#b89030'], light: '#ffc040', stars: false, accent: '#e09030' },
  mountain:{ ground: ['#2a3040','#383e50','#464c60'], light: '#80c0ff', stars: true,  accent: '#5595e0' },
  swamp:   { ground: ['#1a2a10','#243818','#2e4620'], light: '#60c040', stars: false, accent: '#6dbb7c' },
  snow:    { ground: ['#b0c8d8','#c8dde8','#e0eef8'], light: '#c0e0ff', stars: true,  accent: '#5595e0' },
};

const SKY = {
  day:   ['#2856a8','#4a7fcc','#93c0ee'],
  night: ['#040816','#07101e','#111d38'],
  dawn:  ['#8b2210','#c84010','#f59838','#fac870'],
  dusk:  ['#5a0d3c','#8c2050','#d06045','#e89840'],
  cave:  ['#060410','#0a0818','#100c22'],
  storm: ['#1a1c28','#303248','#4c4e68'],
};

function rand(seed) {
  let s = seed | 0;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export default function SceneRenderer({ scene, turnCount = 0 }) {
  const W = 600, H = 200;
  const type  = scene?.type  || 'plains';
  const time  = scene?.time  || 'night';
  const weather = scene?.weather || 'clear';

  const pal  = PALETTES[type] || PALETTES.plains;
  const sky  = SKY[time] || SKY.night;
  const r    = useMemo(() => rand(turnCount * 1000 + (type.charCodeAt(0) || 1)), [turnCount, type]);

  // Stars
  const stars = useMemo(() => {
    if (!pal.stars && time !== 'night') return [];
    const sr = rand(turnCount + 99);
    return Array.from({ length: 70 }, () => ({
      x: sr() * W, y: sr() * H * 0.65,
      r: sr() * 1.4 + 0.3,
      op: sr() * 0.6 + 0.3,
    }));
  }, [pal.stars, time, turnCount]);

  // Terrain silhouette
  const terrain = useMemo(() => {
    const tr = rand(type.charCodeAt(0) * 77 + turnCount);
    const steps = 22;
    const pts = Array.from({ length: steps + 1 }, (_, i) => {
      const x = (i / steps) * W;
      let y;
      if (type === 'mountain') y = H * 0.48 + Math.sin(i * 0.9) * 45 + tr() * 18;
      else if (type === 'dungeon' || type === 'cave') y = H * 0.70 + tr() * 8;
      else if (type === 'ocean') y = H * 0.56 + Math.sin(i * 0.5 + turnCount * 0.2) * 10 + tr() * 4;
      else if (type === 'city') y = H * 0.65 + tr() * 8;
      else y = H * 0.63 + Math.sin(i * 0.7) * 14 + tr() * 12;
      return { x, y };
    });
    const d = `M0,${H} L${pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L')} L${W},${H} Z`;
    return { pts, d };
  }, [type, turnCount]);

  // Buildings for city
  const buildings = useMemo(() => {
    if (type !== 'city') return [];
    const br = rand(turnCount + 44);
    return Array.from({ length: 10 }, (_, i) => ({
      x: i * (W / 9) + br() * 15,
      h: 35 + br() * 90,
      w: 28 + br() * 28,
      windows: Math.floor(br() * 3) + 1,
    }));
  }, [type, turnCount]);

  // Trees for forest/plains
  const trees = useMemo(() => {
    if (type !== 'forest' && type !== 'plains' && type !== 'swamp') return [];
    const tr = rand(turnCount + 55);
    return Array.from({ length: 9 }, () => {
      const x = tr() * W;
      const baseY = terrain.pts[Math.round((x / W) * 22)]?.y || H * 0.63;
      return { x, baseY, h: 35 + tr() * 55, w: 16 + tr() * 18 };
    });
  }, [type, turnCount, terrain.pts]);

  // Torches for dungeon
  const torches = useMemo(() => {
    if (type !== 'dungeon' && type !== 'cave') return [];
    return [W * 0.2, W * 0.5, W * 0.8].map(x => ({ x }));
  }, [type]);

  // Planets for space
  const planets = useMemo(() => {
    if (type !== 'space') return [];
    const pr = rand(turnCount + 77);
    return Array.from({ length: 3 }, () => ({
      x: 60 + pr() * (W - 120), y: 15 + pr() * (H * 0.38),
      r: 8 + pr() * 28, hue: Math.floor(pr() * 360),
    }));
  }, [type, turnCount]);

  // Rain
  const rain = useMemo(() => {
    if (weather !== 'rain' && weather !== 'storm') return [];
    const rr = rand(turnCount * 33);
    return Array.from({ length: 45 }, () => ({
      x: rr() * W, y: rr() * H, len: 9 + rr() * 10, op: 0.25 + rr() * 0.4,
    }));
  }, [weather, turnCount]);

  const fogOp = weather === 'fog' ? 0.65 : weather === 'storm' ? 0.35 : 0.12;

  return (
    <div className={styles.wrapper}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" className={styles.svg}>
        <defs>
          <linearGradient id={`sky_${turnCount}`} x1="0" y1="0" x2="0" y2="1">
            {sky.map((c, i) => <stop key={i} offset={`${(i/(sky.length-1))*100}%`} stopColor={c}/>)}
          </linearGradient>
          <linearGradient id={`gnd_${turnCount}`} x1="0" y1="0" x2="0" y2="1">
            {pal.ground.map((c, i) => <stop key={i} offset={`${(i/(pal.ground.length-1))*100}%`} stopColor={c}/>)}
          </linearGradient>
          <linearGradient id={`fog_${turnCount}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(10,8,20,0)" />
            <stop offset="55%" stopColor={`rgba(10,8,20,${fogOp})`} />
            <stop offset="100%" stopColor={`rgba(10,8,20,${fogOp * 1.8})`} />
          </linearGradient>
          <radialGradient id={`amb_${turnCount}`} cx="50%" cy="100%" r="70%">
            <stop offset="0%" stopColor={pal.light} stopOpacity="0.14"/>
            <stop offset="100%" stopColor={pal.light} stopOpacity="0"/>
          </radialGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="sglow"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        {/* Sky */}
        <rect width={W} height={H} fill={`url(#sky_${turnCount})`}/>

        {/* Stars */}
        {stars.map((s,i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={s.op} className={styles.star} style={{animationDelay:`${(i*0.27)%3}s`}}/>)}

        {/* Celestial body */}
        {(time === 'night' || time === 'cave') && (
          <g filter="url(#sglow)">
            <circle cx={W*0.82} cy={H*0.2} r={16} fill="#e8d870" opacity={0.92}/>
            <circle cx={W*0.82+5} cy={H*0.2-3} r={12} fill={sky[0]} opacity={0.55}/>
          </g>
        )}
        {(time === 'dawn' || time === 'dusk') && (
          <g filter="url(#sglow)"><circle cx={W*0.14} cy={H*0.38} r={20} fill="#ffaa28" opacity={0.88}/></g>
        )}
        {time === 'day' && (
          <g filter="url(#sglow)"><circle cx={W*0.82} cy={H*0.14} r={18} fill="#ffee60" opacity={0.96}/></g>
        )}

        {/* Planets (space) */}
        {planets.map((p,i) => (
          <g key={i} filter="url(#glow)">
            <circle cx={p.x} cy={p.y} r={p.r} fill={`hsl(${p.hue},60%,40%)`} opacity={0.75}/>
            <circle cx={p.x-p.r*0.28} cy={p.y-p.r*0.2} r={p.r*0.55} fill={sky[0]} opacity={0.4}/>
            <ellipse cx={p.x} cy={p.y} rx={p.r*1.6} ry={p.r*0.25} fill="none"
              stroke={`hsl(${p.hue},50%,60%)`} strokeWidth={1.2} opacity={0.35}/>
          </g>
        ))}

        {/* Background buildings (city) */}
        {buildings.map((b,i) => (
          <g key={i}>
            <rect x={b.x} y={H*0.65-b.h} width={b.w} height={b.h} fill={pal.ground[0]} opacity={0.85}/>
            {Array.from({length: b.windows*3}, (_,j) => (
              <rect key={j} x={b.x+4+(j%3)*8} y={H*0.65-b.h+8+Math.floor(j/3)*14}
                width={5} height={6} fill={pal.light} opacity={Math.random()>0.4?0.6:0.1}/>
            ))}
          </g>
        ))}

        {/* Terrain */}
        <path d={terrain.d} fill={`url(#gnd_${turnCount})`}/>

        {/* Trees */}
        {trees.map((t,i) => (
          <g key={i}>
            <rect x={t.x-2.5} y={t.baseY-t.h*0.28} width={5} height={t.h*0.28} fill={pal.ground[0]}/>
            <ellipse cx={t.x} cy={t.baseY-t.h*0.52} rx={t.w*0.5} ry={t.h*0.52} fill={pal.ground[1]} opacity={0.9}/>
            <ellipse cx={t.x} cy={t.baseY-t.h*0.58} rx={t.w*0.32} ry={t.h*0.36} fill={pal.accent} opacity={0.25}/>
          </g>
        ))}

        {/* Torches */}
        {torches.map((t,i) => (
          <g key={i} filter="url(#glow)">
            <rect x={t.x-2} y={H*0.5} width={4} height={12} fill="#7a5020"/>
            <ellipse cx={t.x} cy={H*0.48} rx={5} ry={7} fill={pal.light} opacity={0.9} className={styles.flame} style={{animationDelay:`${i*0.45}s`}}/>
            <ellipse cx={t.x} cy={H*0.48} rx={3} ry={4} fill="#ffeeaa" opacity={0.85}/>
          </g>
        ))}

        {/* Rain */}
        {rain.map((d,i) => (
          <line key={i} x1={d.x} y1={d.y} x2={d.x-2} y2={d.y+d.len}
            stroke="#88aacc" strokeWidth={0.8} opacity={d.op} className={styles.raindrop}
            style={{animationDelay:`${(i*0.04)%1.5}s`}}/>
        ))}

        {/* Ambient light */}
        <rect width={W} height={H} fill={`url(#amb_${turnCount})`}/>
        {/* Fog */}
        <rect width={W} height={H} fill={`url(#fog_${turnCount})`}/>

        {/* Label */}
        <text x={W-6} y={H-6} textAnchor="end" fontFamily="monospace" fontSize={8}
          fill="white" opacity={0.28} letterSpacing={1}>
          {type.toUpperCase()} · {time.toUpperCase()}
        </text>
      </svg>
    </div>
  );
}
