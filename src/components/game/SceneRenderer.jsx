import { useEffect, useRef } from 'react';
import rough from '../../lib/rough.js';
import styles from './SceneRenderer.module.css';

// ═══════════════════════════════════════════
//  SCENE RENDERER v5 — Children's Book Style
//  Built with rough.js for hand-drawn art.
//  Every shape is sketchy, warm, illustrated.
//  Characters are drawn figures, not badges.
//  Like a picture book — exciting to reveal.
// ═══════════════════════════════════════════

const W = 640, H = 300;

function mkRand(seed) {
  let s = (seed | 0) + 1;
  return () => { s = (s * 16807 + 7) % 2147483647; return (s - 1) / 2147483646; };
}

// ── Children's book color palettes ───────
// Warm, saturated, illustrator-quality
const PALETTE = {
  forest: {
    sky:    ['#7EC8E3','#ADE3F5','#E8F7F0'],
    ground: '#4A7C3F',
    mid:    '#2D5A27',
    far:    '#1A3A18',
    accent: '#F4C430',
    trunk:  '#5C3A1E',
    leaf:   ['#3D8B37','#5aad52','#2d6b28'],
    sun:    '#FFDD57',
  },
  dungeon: {
    sky:    ['#1a0a2e','#2d1050','#1a0a2e'],
    ground: '#3a2d4a',
    mid:    '#2a1e38',
    far:    '#160f22',
    accent: '#FF8C42',
    stone:  ['#4a4060','#3a3050','#2a2040'],
    torch:  '#FF6B35',
    crystal:'#7B6CFF',
  },
  plains: {
    sky:    ['#5BC0F5','#87CEEB','#C5E8F5'],
    ground: '#6B8F3A',
    mid:    '#5a7a30',
    far:    '#486328',
    accent: '#FFD700',
    grass:  ['#7AA83C','#8ab840','#6a9830'],
    road:   '#C4A882',
    sun:    '#FFF176',
  },
  ocean: {
    sky:    ['#1E90FF','#4FACF7','#87CEEB'],
    ground: '#1565C0',
    mid:    '#1976D2',
    far:    '#0D47A1',
    accent: '#FFD700',
    wave:   '#42A5F5',
    foam:   '#E3F2FD',
    sand:   '#F5DEB3',
  },
  castle: {
    sky:    ['#1A237E','#283593','#3949AB'],
    ground: '#4A148C',
    mid:    '#37006E',
    far:    '#1a0040',
    accent: '#FFD700',
    stone:  ['#607D8B','#546E7A','#455A64'],
    torch:  '#FF6B35',
    flag:   '#F44336',
  },
  village: {
    sky:    ['#FF9A3C','#FFB347','#FFCC80'],
    ground: '#558B2F',
    mid:    '#33691E',
    far:    '#1B5E20',
    accent: '#FFE082',
    roof:   '#C62828',
    wall:   '#EFEBE9',
    chimney:'#6D4C41',
  },
  space: {
    sky:    ['#0D0221','#130B2E','#0D0221'],
    ground: '#1A0A2E',
    mid:    '#0f0620',
    far:    '#070314',
    accent: '#7DF9FF',
    star:   '#FFFDE7',
    planet: ['#FF6B6B','#4ECDC4','#95E1D3','#F38181','#A8E063','#6C63FF'],
    glow:   '#7DF9FF',
  },
  cave: {
    sky:    ['#0d0d1a','#111128','#0d0d1a'],
    ground: '#2D2040',
    mid:    '#1E1530',
    far:    '#100C1E',
    accent: '#7B6CFF',
    crystal:['#7B6CFF','#9F92FF','#5a4eff'],
    drip:   '#4444aa',
    glow:   '#6055ff',
  },
  desert: {
    sky:    ['#FF7043','#FF8A65','#FFB74D'],
    ground: '#C4873A',
    mid:    '#A0692A',
    far:    '#7D4F1A',
    accent: '#FFD54F',
    sand:   ['#D4A055','#C49040','#B8802A'],
    cactus: '#4CAF50',
    sun:    '#FFE57F',
  },
  mountain: {
    sky:    ['#1565C0','#1976D2','#42A5F5'],
    ground: '#546E7A',
    mid:    '#37474F',
    far:    '#263238',
    accent: '#80CBC4',
    snow:   '#F5F5F5',
    pine:   '#1B5E20',
    rock:   ['#78909C','#607D8B','#546E7A'],
  },
  swamp: {
    sky:    ['#1B5E20','#2E7D32','#388E3C'],
    ground: '#2E4A1E',
    mid:    '#1E3A12',
    far:    '#122808',
    accent: '#8BC34A',
    water:  '#4CAF50',
    moss:   '#558B2F',
    fog:    'rgba(100,180,80,0.25)',
  },
  snow: {
    sky:    ['#B0C4DE','#C9D8E8','#E8EFF5'],
    ground: '#E8EEF5',
    mid:    '#D0DCE8',
    far:    '#B8CCE0',
    accent: '#5C9ED4',
    tree:   '#2E4A1E',
    snowcap:'#FFFFFF',
    ice:    '#B0E0FF',
  },
  ruins: {
    sky:    ['#4A0E6B','#6B1FA3','#3A0A5A'],
    ground: '#3D2B4A',
    mid:    '#2A1E38',
    far:    '#1A1028',
    accent: '#C06EFF',
    stone:  ['#5A4870','#4A3860','#3A2850'],
    vine:   '#2D5A18',
    glow:   '#9B59FF',
  },
  city: {
    sky:    ['#1A1A2E','#2D2D4A','#1A1A2E'],
    ground: '#1E1E2E',
    mid:    '#141422',
    far:    '#0D0D18',
    accent: '#FF6B35',
    neon:   ['#FF6B35','#FF4CCD','#00FFFF'],
    build:  ['#2D2D4A','#252538','#1A1A2E'],
    window: '#FFEE55',
  },
};

function getPal(type, time) {
  const base = PALETTE[type] || PALETTE.plains;
  // City during day gets a lighter sky
  if (type === 'city' && (time === 'day' || time === 'dawn' || time === 'dusk')) {
    return {
      ...base,
      sky: time === 'dusk'
        ? ['#4A1942','#8B3060','#C05040']
        : time === 'dawn'
          ? ['#3A4060','#6060A0','#9080C0']
          : ['#2A3A6A','#3A4E8C','#5A6EAC'],  // day: deep city blue, still dramatic
    };
  }
  return base;
}

// ── Draw a hand-drawn character ───────────
// Each class gets a distinct illustrated silhouette
function drawCharacter(rc, svg, cx, groundY, cls, color, name, r) {
  const R = r; // local seeded random
  const opts = (fill, extra = {}) => ({
    stroke: color, strokeWidth: 2,
    fill, fillStyle: 'solid',
    roughness: 1.4, bowing: 0.8,
    ...extra
  });
  const darkColor = shadeColor(color, -40);
  const hy = groundY; // hip y

  // Ground shadow
  const shadowEl = rc.ellipse(cx, groundY + 2, 28, 6, {
    stroke: 'none', fill: 'rgba(0,0,0,0.25)',
    fillStyle: 'solid', roughness: 1
  });
  svg.appendChild(shadowEl);

  if (cls === 'warrior') {
    // Body — stocky, armored
    svg.appendChild(rc.rectangle(cx - 8, hy - 32, 16, 22, opts(darkColor)));
    // Head with helmet
    svg.appendChild(rc.ellipse(cx, hy - 40, 14, 14, opts(color)));
    svg.appendChild(rc.rectangle(cx - 7, hy - 48, 14, 10, opts(darkColor, { roughness: 0.8 })));
    // Shield (left)
    svg.appendChild(rc.rectangle(cx - 20, hy - 36, 10, 18, opts(color, { roughness: 1.8 })));
    // Sword (right)
    const swordPts = [[cx+12, hy-50],[cx+14, hy-50],[cx+14, hy-18],[cx+12, hy-18]];
    svg.appendChild(rc.polygon(swordPts, { stroke: '#aaa', fill: '#ddd', fillStyle:'solid', roughness: 0.9, strokeWidth: 1.5 }));
    // Legs
    svg.appendChild(rc.rectangle(cx - 7, hy - 10, 6, 12, opts(darkColor)));
    svg.appendChild(rc.rectangle(cx + 1, hy - 10, 6, 12, opts(darkColor)));
  } else if (cls === 'mage' || cls === 'wizard') {
    // Robe — long and flowing
    svg.appendChild(rc.polygon([
      [cx-8,hy-32],[cx+8,hy-32],[cx+10,hy],[cx-10,hy]
    ], opts(color, { roughness: 2.0 })));
    // Head
    svg.appendChild(rc.ellipse(cx, hy - 40, 13, 13, opts(color)));
    // Tall pointy hat
    svg.appendChild(rc.polygon([
      [cx-8,hy-46],[cx+8,hy-46],[cx,hy-66]
    ], opts(darkColor, { roughness: 1.5 })));
    // Staff
    svg.appendChild(rc.line(cx+14, hy-5, cx+14, hy-58, { stroke: '#8B4513', strokeWidth: 2.5, roughness: 1.5 }));
    // Orb on staff
    svg.appendChild(rc.circle(cx+14, hy-62, 10, { stroke: '#fff', fill: '#9B59FF', fillStyle: 'solid', roughness: 0.8 }));
  } else if (cls === 'rogue' || cls === 'thief') {
    // Slim, crouched slightly
    svg.appendChild(rc.polygon([
      [cx-6,hy-30],[cx+6,hy-30],[cx+7,hy],[cx-7,hy]
    ], opts(darkColor, { roughness: 1.8 })));
    // Hooded head
    svg.appendChild(rc.ellipse(cx, hy - 38, 12, 12, opts(color)));
    svg.appendChild(rc.polygon([
      [cx-10,hy-42],[cx+10,hy-42],[cx+6,hy-30],[cx-6,hy-30]
    ], opts(darkColor, { roughness: 2.2 })));
    // Daggers (both hands)
    svg.appendChild(rc.line(cx+10, hy-28, cx+18, hy-40, { stroke: '#ccc', strokeWidth: 2, roughness: 0.8 }));
    svg.appendChild(rc.line(cx-10, hy-28, cx-18, hy-40, { stroke: '#ccc', strokeWidth: 2, roughness: 0.8 }));
    // Legs
    svg.appendChild(rc.line(cx-4, hy, cx-6, hy+10, { stroke: darkColor, strokeWidth: 4, roughness: 1.5 }));
    svg.appendChild(rc.line(cx+4, hy, cx+6, hy+10, { stroke: darkColor, strokeWidth: 4, roughness: 1.5 }));
  } else if (cls === 'ranger' || cls === 'archer') {
    // Lean, bow raised
    svg.appendChild(rc.rectangle(cx - 6, hy - 34, 12, 24, opts(color, { roughness: 1.6 })));
    // Head with hood
    svg.appendChild(rc.ellipse(cx, hy - 42, 13, 13, opts(color)));
    svg.appendChild(rc.polygon([
      [cx-9,hy-46],[cx+9,hy-46],[cx+5,hy-34],[cx-5,hy-34]
    ], opts(shadeColor(color,-20), { roughness: 1.9 })));
    // Bow (arc)
    const bowPath = `M ${cx-16} ${hy-52} Q ${cx-24} ${hy-38} ${cx-16} ${hy-22}`;
    svg.appendChild(rc.path(bowPath, { stroke: '#8B4513', strokeWidth: 2, fill: 'none', roughness: 1.5 }));
    svg.appendChild(rc.line(cx-16, hy-52, cx-16, hy-22, { stroke: '#8B4513', strokeWidth: 1, roughness: 0.5 }));
    // Arrow
    svg.appendChild(rc.line(cx-14, hy-38, cx+8, hy-38, { stroke: '#8B4513', strokeWidth: 1.5, roughness: 0.6 }));
    // Legs
    svg.appendChild(rc.line(cx-3, hy-10, cx-4, hy+10, { stroke: color, strokeWidth: 5, roughness: 1 }));
    svg.appendChild(rc.line(cx+3, hy-10, cx+5, hy+10, { stroke: color, strokeWidth: 5, roughness: 1 }));
  } else if (cls === 'healer' || cls === 'paladin') {
    // Robed, cross emblem
    svg.appendChild(rc.polygon([
      [cx-7,hy-32],[cx+7,hy-32],[cx+8,hy],[cx-8,hy]
    ], opts(color, { roughness: 1.5 })));
    svg.appendChild(rc.ellipse(cx, hy - 40, 13, 13, opts(color)));
    // Halo
    svg.appendChild(rc.ellipse(cx, hy - 50, 20, 6, { stroke: '#FFD700', strokeWidth: 1.5, fill: 'none', roughness: 2.0 }));
    // Staff with cross
    svg.appendChild(rc.line(cx+12, hy, cx+12, hy-55, { stroke: '#FFD700', strokeWidth: 2.5, roughness: 1.2 }));
    svg.appendChild(rc.line(cx+6, hy-45, cx+18, hy-45, { stroke: '#FFD700', strokeWidth: 2.5, roughness: 1.2 }));
  } else if (cls === 'spaceranger' || cls === 'pilot') {
    // Space suit - round helmet, chunky suit
    svg.appendChild(rc.rectangle(cx-9, hy-30, 18, 22, opts(color, { roughness: 0.8 })));
    // Helmet - round
    svg.appendChild(rc.circle(cx, hy-40, 20, { stroke: color, fill: shadeColor(color,-20), fillStyle:'solid', roughness: 0.7 }));
    // Visor
    svg.appendChild(rc.ellipse(cx, hy-40, 12, 9, { stroke:'none', fill:'rgba(100,200,255,0.5)', fillStyle:'solid', roughness: 0.5 }));
    // Thruster pack
    svg.appendChild(rc.rectangle(cx-12, hy-26, 5, 12, opts(darkColor, { roughness: 0.8 })));
    svg.appendChild(rc.rectangle(cx+7, hy-26, 5, 12, opts(darkColor, { roughness: 0.8 })));
    // Legs
    svg.appendChild(rc.rectangle(cx-7, hy-8, 6, 10, opts(darkColor, { roughness: 0.8 })));
    svg.appendChild(rc.rectangle(cx+1, hy-8, 6, 10, opts(darkColor, { roughness: 0.8 })));
  } else if (cls === 'pirate' || cls === 'buccaneer') {
    svg.appendChild(rc.polygon([
      [cx-7,hy-32],[cx+7,hy-32],[cx+8,hy],[cx-8,hy]
    ], opts(darkColor, { roughness: 1.8 })));
    svg.appendChild(rc.ellipse(cx, hy - 40, 13, 13, opts(color)));
    // Tricorn hat
    svg.appendChild(rc.polygon([
      [cx-12,hy-46],[cx+12,hy-46],[cx+8,hy-58],[cx-8,hy-58]
    ], opts('#1a1a1a', { roughness: 1.5 })));
    // Cutlass
    svg.appendChild(rc.line(cx+10, hy-28, cx+22, hy-46, { stroke: '#ddd', strokeWidth: 2.5, roughness: 0.8 }));
    svg.appendChild(rc.ellipse(cx+10, hy-28, 8, 4, { stroke:'#888', fill:'none', roughness: 1 }));
  } else {
    // Default — generic adventurer
    svg.appendChild(rc.polygon([
      [cx-7,hy-30],[cx+7,hy-30],[cx+8,hy],[cx-8,hy]
    ], opts(color, { roughness: 1.8 })));
    svg.appendChild(rc.ellipse(cx, hy - 40, 13, 14, opts(color)));
    svg.appendChild(rc.line(cx-14, hy-28, cx-7, hy-22, { stroke: color, strokeWidth: 3, roughness: 1.5 }));
    svg.appendChild(rc.line(cx+14, hy-28, cx+7, hy-22, { stroke: color, strokeWidth: 3, roughness: 1.5 }));
    svg.appendChild(rc.line(cx-4, hy, cx-5, hy+10, { stroke: color, strokeWidth: 4, roughness: 1.5 }));
    svg.appendChild(rc.line(cx+4, hy, cx+5, hy+10, { stroke: color, strokeWidth: 4, roughness: 1.5 }));
  }

  // Name label
  if (name) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', cx);
    text.setAttribute('y', groundY + 18);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', color);
    text.setAttribute('font-family', 'monospace');
    text.setAttribute('font-size', '8');
    text.setAttribute('letter-spacing', '1');
    text.setAttribute('opacity', '0.9');
    text.textContent = name.toUpperCase().slice(0, 8);
    svg.appendChild(text);
  }
}

// ── Draw enemy creature ────────────────────
function drawEnemy(rc, svg, cx, groundY, creatureType) {
  const opts = (fill, extra = {}) => ({
    stroke: '#cc2222', strokeWidth: 2.5,
    fill, fillStyle: 'solid',
    roughness: 2.2, bowing: 1.2,
    ...extra
  });

  // Glow aura
  const glow = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  glow.setAttribute('cx', cx); glow.setAttribute('cy', groundY - 20);
  glow.setAttribute('rx', 28); glow.setAttribute('ry', 32);
  glow.setAttribute('fill', 'rgba(200,30,30,0.12)');
  svg.appendChild(glow);

  // Shadow
  svg.appendChild(rc.ellipse(cx, groundY + 2, 36, 8, {
    stroke:'none', fill:'rgba(0,0,0,0.3)', fillStyle:'solid', roughness: 1
  }));

  const type = creatureType || 'goblin';

  if (type === 'goblin' || type === 'goblin_archer') {
    // Goblin — short, hunched, big ears
    svg.appendChild(rc.polygon([[cx-8,groundY-10],[cx+8,groundY-10],[cx+9,groundY],[cx-9,groundY]], opts('#2d5e1e')));
    svg.appendChild(rc.ellipse(cx, groundY-22, 16, 15, opts('#3a7a25')));
    // Big ears
    svg.appendChild(rc.ellipse(cx-12, groundY-22, 8, 11, opts('#4a9a30', {roughness:2.5})));
    svg.appendChild(rc.ellipse(cx+12, groundY-22, 8, 11, opts('#4a9a30', {roughness:2.5})));
    // Eyes — red glowing
    svg.appendChild(rc.circle(cx-4, groundY-23, 4, {stroke:'none', fill:'#ff3300', fillStyle:'solid', roughness:0.5}));
    svg.appendChild(rc.circle(cx+4, groundY-23, 4, {stroke:'none', fill:'#ff3300', fillStyle:'solid', roughness:0.5}));
    // Weapon
    svg.appendChild(rc.line(cx+10, groundY-5, cx+20, groundY-35, {stroke:'#8B4513', strokeWidth:3, roughness:1.8}));
  } else if (type === 'dragon') {
    // Dragon — big, intimidating
    svg.appendChild(rc.polygon([[cx-20,groundY],[cx+20,groundY],[cx+15,groundY-50],[cx-15,groundY-50]], opts('#8B0000', {roughness:2.5})));
    svg.appendChild(rc.ellipse(cx, groundY-55, 30, 22, opts('#A00000')));
    // Wings
    svg.appendChild(rc.polygon([[cx-15,groundY-40],[cx-50,groundY-60],[cx-40,groundY-30]], opts('#660000', {roughness:3})));
    svg.appendChild(rc.polygon([[cx+15,groundY-40],[cx+50,groundY-60],[cx+40,groundY-30]], opts('#660000', {roughness:3})));
    // Eyes
    svg.appendChild(rc.circle(cx-8, groundY-57, 5, {stroke:'none', fill:'#ff8800', fillStyle:'solid', roughness:0.5}));
    svg.appendChild(rc.circle(cx+8, groundY-57, 5, {stroke:'none', fill:'#ff8800', fillStyle:'solid', roughness:0.5}));
    // Fire breath line
    svg.appendChild(rc.line(cx+20, groundY-55, cx+55, groundY-40, {stroke:'#FF6600', strokeWidth:4, roughness:2}));
    svg.appendChild(rc.line(cx+20, groundY-55, cx+58, groundY-50, {stroke:'#FF3300', strokeWidth:2, roughness:2.5}));
  } else if (type === 'skeleton') {
    // Skeleton — bony, thin, intimidating
    svg.appendChild(rc.line(cx, groundY, cx, groundY-30, {stroke:'#e8dcc8', strokeWidth:4, roughness:2}));
    svg.appendChild(rc.ellipse(cx, groundY-38, 14, 16, {stroke:'#e8dcc8', fill:'#d4c8a8', fillStyle:'solid', roughness:2.2}));
    svg.appendChild(rc.line(cx-12, groundY-26, cx-2, groundY-22, {stroke:'#e8dcc8', strokeWidth:3, roughness:2}));
    svg.appendChild(rc.line(cx+12, groundY-26, cx+2, groundY-22, {stroke:'#e8dcc8', strokeWidth:3, roughness:2}));
    svg.appendChild(rc.line(cx-5, groundY, cx-7, groundY+12, {stroke:'#e8dcc8', strokeWidth:3, roughness:2}));
    svg.appendChild(rc.line(cx+5, groundY, cx+7, groundY+12, {stroke:'#e8dcc8', strokeWidth:3, roughness:2}));
    // Eye sockets
    svg.appendChild(rc.circle(cx-4, groundY-39, 3, {stroke:'none', fill:'#000', fillStyle:'solid', roughness:0.5}));
    svg.appendChild(rc.circle(cx+4, groundY-39, 3, {stroke:'none', fill:'#000', fillStyle:'solid', roughness:0.5}));
  } else if (type === 'wolf') {
    // Wolf — four-legged, low to ground
    svg.appendChild(rc.polygon([[cx-20,groundY-8],[cx+18,groundY-8],[cx+20,groundY],[cx-22,groundY]], opts('#4a4040', {roughness:2.5})));
    // Head
    svg.appendChild(rc.ellipse(cx+22, groundY-14, 18, 14, opts('#5a5050')));
    // Ears
    svg.appendChild(rc.polygon([[cx+18,groundY-20],[cx+22,groundY-32],[cx+26,groundY-20]], opts('#3a3030', {roughness:2.5})));
    svg.appendChild(rc.polygon([[cx+28,groundY-20],[cx+32,groundY-30],[cx+35,groundY-18]], opts('#3a3030', {roughness:2.5})));
    // Tail (curled up)
    const tailPath = `M ${cx-20} ${groundY-10} Q ${cx-35} ${groundY-30} ${cx-25} ${groundY-32}`;
    svg.appendChild(rc.path(tailPath, {stroke:'#5a5050', strokeWidth:4, fill:'none', roughness:2}));
    // Eye
    svg.appendChild(rc.circle(cx+28, groundY-14, 3, {stroke:'none', fill:'#ff4400', fillStyle:'solid', roughness:0.5}));
  } else if (type === 'ghost' || type === 'wraith') {
    // Ghost — wispy, floating
    const ghostPath = `M ${cx-14} ${groundY} Q ${cx-18} ${groundY-20} ${cx-12} ${groundY-30} Q ${cx-14} ${groundY-48} ${cx} ${groundY-50} Q ${cx+14} ${groundY-48} ${cx+12} ${groundY-30} Q ${cx+18} ${groundY-20} ${cx+14} ${groundY} Q ${cx+10} ${groundY+8} ${cx+5} ${groundY+4} Q ${cx} ${groundY+10} ${cx-5} ${groundY+4} Q ${cx-10} ${groundY+8} ${cx-14} ${groundY}`;
    svg.appendChild(rc.path(ghostPath, {stroke:'rgba(180,180,255,0.8)', fill:'rgba(150,150,255,0.35)', fillStyle:'solid', roughness:3.0, strokeWidth:2}));
    svg.appendChild(rc.circle(cx-5, groundY-38, 5, {stroke:'none', fill:'#000', fillStyle:'solid', roughness:0.5}));
    svg.appendChild(rc.circle(cx+5, groundY-38, 5, {stroke:'none', fill:'#000', fillStyle:'solid', roughness:0.5}));
  } else {
    // Generic enemy — menacing shape
    svg.appendChild(rc.polygon([[cx-12,groundY],[cx+12,groundY],[cx+10,groundY-38],[cx-10,groundY-38]], opts('#660000', {roughness:2.5})));
    svg.appendChild(rc.ellipse(cx, groundY-46, 18, 16, opts('#880000')));
    svg.appendChild(rc.circle(cx-5, groundY-47, 4, {stroke:'none', fill:'#ff2200', fillStyle:'solid', roughness:0.5}));
    svg.appendChild(rc.circle(cx+5, groundY-47, 4, {stroke:'none', fill:'#ff2200', fillStyle:'solid', roughness:0.5}));
  }

  // Enemy name label
  if (creatureType) {
    const label = creatureType.replace(/_/g,' ').toUpperCase().slice(0,12);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', cx); text.setAttribute('y', groundY + 20);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#ff4444');
    text.setAttribute('font-family', 'monospace');
    text.setAttribute('font-size', '8');
    text.setAttribute('letter-spacing', '1');
    text.textContent = label;
    svg.appendChild(text);
  }
}

// ── Color helper ───────────────────────────
function shadeColor(hex, pct) {
  const n = parseInt(hex.replace('#',''), 16);
  const r = Math.min(255, Math.max(0, (n>>16) + pct));
  const g = Math.min(255, Math.max(0, ((n>>8)&0xff) + pct));
  const b = Math.min(255, Math.max(0, (n&0xff) + pct));
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// ── SVG helper ─────────────────────────────
function svgEl(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

// ── Map creature type to a drawable character class ──────────────────────
function creatureTypeToClass(creatureType) {
  const map = {
    merchant:   'healer',   elder:    'mage',
    mage_npc:   'mage',     knight:   'warrior',
    guard:      'warrior',  assassin: 'rogue',
    thief:      'rogue',    bandit:   'rogue',
    ghost:      'mage',     wraith:   'mage',
    goblin:     'rogue',    orc:      'warrior',
    vampire:    'rogue',    wolf:     'ranger',
    dragon:     'warrior',  troll:    'warrior',
  };
  return map[creatureType] || 'healer';
}

// ── Draw full scene ────────────────────────
function drawScene(svgEl2, scene, players, turnCount) {
  // Clear
  while (svgEl2.firstChild) svgEl2.removeChild(svgEl2.firstChild);

  const rc = rough.svg(svgEl2);
  const type = scene?.type || 'plains';
  const time = scene?.time || 'day';
  const weather = scene?.weather || 'clear';
  const inCombat = scene?.inCombat || false;
  const enemyName = scene?.enemy;
  const pal = getPal(type, time);
  const sr = mkRand(type.charCodeAt(0) * 1337);
  const tr = mkRand(turnCount * 997 + type.charCodeAt(0) * 31);

  // ── Defs (gradients, filters, paper texture) ──
  const defs = svgEl('defs', {});

  // Sky gradient
  const skyGrad = svgEl('linearGradient', { id:'skyG', x1:'0', y1:'0', x2:'0', y2:'1' });
  const [s1, s2, s3] = pal.sky;
  skyGrad.appendChild(Object.assign(svgEl('stop', {}), {}).setAttribute ? (() => {
    const s = svgEl('stop', { offset:'0%', 'stop-color': s1 }); return s;
  })() : null);
  [s1, s2, s3 || s2].forEach((c, i) => {
    const stop = svgEl('stop', { offset:`${i*50}%`, 'stop-color': c });
    skyGrad.appendChild(stop);
  });
  defs.appendChild(skyGrad);

  // Paper texture filter — the key to the book feel
  const filt = svgEl('filter', { id:'paper', x:'0', y:'0', width:'100%', height:'100%' });
  const turb = svgEl('feTurbulence', { type:'fractalNoise', baseFrequency:'0.65', numOctaves:'3', stitchTiles:'stitch', result:'noise' });
  const disp = svgEl('feDisplacementMap', { in:'SourceGraphic', in2:'noise', scale:'3', xChannelSelector:'R', yChannelSelector:'G' });
  filt.appendChild(turb); filt.appendChild(disp);
  defs.appendChild(filt);

  // Warm vignette gradient
  const vig = svgEl('radialGradient', { id:'vig', cx:'50%', cy:'50%', r:'70%' });
  const vs1 = svgEl('stop', { offset:'0%', 'stop-color':'transparent' });
  const vs2 = svgEl('stop', { offset:'100%', 'stop-color':'rgba(20,5,0,0.45)' });
  vig.appendChild(vs1); vig.appendChild(vs2);
  defs.appendChild(vig);

  svgEl2.appendChild(defs);

  // ── Sky ──
  const sky = svgEl('rect', { x:0, y:0, width:W, height:H, fill:'url(#skyG)' });
  svgEl2.appendChild(sky);

  // ── Scene-specific background elements ──
  drawBackground(rc, svgEl2, type, time, pal, sr, tr, turnCount);

  // ── Ground ──
  drawGround(rc, svgEl2, type, pal, sr, tr, W, H);

  // ── Weather ──
  if (weather === 'rain' || weather === 'storm') drawRain(svgEl2, tr);
  if (weather === 'snow' || type === 'snow') drawSnowfall(svgEl2, tr);

  // ── Characters ──
  const groundY = H - 65;
  if (players?.length > 0) {
    const PLAYER_COLORS = ['#c4a84f','#5595e0','#6dbb7c','#e05555','#a87ed4','#e09030'];
    const spacing = Math.min(80, W / (players.length + 2));
    const startX = W / 2 - (spacing * (players.length - 1)) / 2;
    // In combat — shift party left to face enemy
    const offsetX = inCombat ? -60 : 0;
    players.forEach((p, i) => {
      const cx = startX + i * spacing + offsetX;
      drawCharacter(rc, svgEl2, cx, groundY, p.class || 'warrior',
        p.color || PLAYER_COLORS[i % PLAYER_COLORS.length],
        p.name || '', sr);
    });
  }

  // ── Scene NPCs (friendly/neutral — not combat enemies) ──
  const sceneNpcs = (mergedScene?.npcs || []).filter(n =>
    n.relationship !== 'enemy' && n.relationship !== 'hostile'
  ).slice(0, 2); // max 2 NPCs in scene at once to avoid clutter

  if (sceneNpcs.length > 0) {
    const npcSpacing = 55;
    const npcStartX = W * 0.68;
    sceneNpcs.forEach((npc, i) => {
      const nx = npcStartX + i * npcSpacing;
      // Map NPC role to a drawable class
      const npcClass = npc.creatureType
        ? creatureTypeToClass(npc.creatureType)
        : 'healer';
      // Friendly NPCs: muted warm color, slightly smaller
      const npcColor = npc.relationship === 'ally' ? '#88BBFF' : '#C8B090';
      drawCharacter(rc, svgEl2, nx, groundY, npcClass, npcColor, npc.name || '', sr);
    });
  }

  // ── Enemy (in combat) ──
  if (inCombat && enemyName) {
    const creatureType = enemyName.toLowerCase().replace(/\s+/g, '_');
    drawEnemy(rc, svgEl2, W * 0.78, groundY, creatureType);
    // VS flash
    const vs = svgEl('text', {
      x: W * 0.58, y: groundY - 25,
      'text-anchor':'middle', fill:'#FFD700',
      'font-family':'serif', 'font-size':'14',
      'font-weight':'bold', 'letter-spacing':'4',
      opacity:'0.8',
    });
    vs.textContent = 'VS';
    svgEl2.appendChild(vs);
  }

  // ── Foreground grass/rocks ──
  drawForeground(rc, svgEl2, type, pal, tr, W, H);

  // ── Paper texture overlay ──
  const paper = svgEl('rect', {
    x:0, y:0, width:W, height:H,
    fill:'rgba(255,240,210,0.04)',
    filter:'url(#paper)',
  });
  svgEl2.appendChild(paper);

  // ── Warm vignette ──
  const vignette = svgEl('rect', { x:0, y:0, width:W, height:H, fill:'url(#vig)' });
  svgEl2.appendChild(vignette);

  // ── Scene label ──
  const label = svgEl('text', {
    x: W-8, y: H-8,
    'text-anchor':'end', fill:'rgba(255,255,255,0.3)',
    'font-family':'monospace', 'font-size':'8', 'letter-spacing':'2',
  });
  label.textContent = `${type.toUpperCase()} · ${time.toUpperCase()}`;
  svgEl2.appendChild(label);
}

// ── Background elements per scene type ────
function drawBackground(rc, svg, type, time, pal, sr, tr, turnCount) {
  if (type === 'forest' || type === 'plains' || type === 'swamp') {
    // Sky sun/moon
    if (time === 'night') {
      svg.appendChild(rc.circle(W*0.74, H*0.14, 30, {
        stroke:'#f5e68a', fill:'#fdf5b0', fillStyle:'solid', roughness:0.6
      }));
    } else if (time === 'day' || !time) {
      svg.appendChild(rc.circle(W*0.74, H*0.11, 35, {
        stroke:'#ffee44', fill: pal.sun || '#FFDD57', fillStyle:'solid', roughness:0.8
      }));
      // Sun rays
      for (let i = 0; i < 8; i++) {
        const a = (i/8)*Math.PI*2;
        svg.appendChild(rc.line(
          W*0.74 + Math.cos(a)*20, H*0.11 + Math.sin(a)*20,
          W*0.74 + Math.cos(a)*30, H*0.11 + Math.sin(a)*30,
          { stroke: pal.sun || '#FFDD57', strokeWidth: 2.5, roughness: 1.5 }
        ));
      }
    }

    // Background trees (far, lighter)
    for (let i = 0; i < 14; i++) {
      const x = sr() * W;
      const h = 40 + sr() * 50;
      const shade = pal.leaf ? pal.leaf[Math.floor(sr() * pal.leaf.length)] : '#2D5A27';
      svg.appendChild(rc.ellipse(x, H*0.55 - h*0.4, h*0.6, h*0.7, {
        stroke: shadeColor(shade, -20), fill: shadeColor(shade, 10),
        fillStyle: 'solid', roughness: 2.5, bowing: 0.5, strokeWidth: 1
      }));
    }
  }

  if (type === 'dungeon' || type === 'cave') {
    // Stone wall blocks
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 12; col++) {
        const stoneColor = pal.stone ? pal.stone[Math.floor(sr() * pal.stone.length)] : '#4a4060';
        svg.appendChild(rc.rectangle(
          col * (W/11) + sr()*4-2, row * 40 + sr()*3-1,
          W/11 - 3, 40 - 3,
          { stroke: shadeColor(stoneColor, -30), fill: stoneColor, fillStyle:'hachure', roughness:1.8, strokeWidth:1.5 }
        ));
      }
    }
    // Stalactites
    for (let i = 0; i < 10; i++) {
      const x = sr() * W;
      const len = 15 + sr() * 45;
      svg.appendChild(rc.polygon([[x-6,0],[x+6,0],[x,len]], {
        stroke: pal.stone ? pal.stone[0] : '#4a4060',
        fill: pal.stone ? shadeColor(pal.stone[0], 10) : '#5a5070',
        fillStyle: 'hachure', roughness: 1.8, strokeWidth: 1.5
      }));
    }
    // Torches
    [W*0.2, W*0.5, W*0.8].forEach(tx => {
      svg.appendChild(rc.rectangle(tx-3, H*0.45, 6, 16, { stroke:'#5C3A1E', fill:'#6B4423', fillStyle:'solid', roughness:1 }));
      svg.appendChild(rc.ellipse(tx, H*0.43, 12, 16, { stroke:pal.torch, fill:pal.torch, fillStyle:'solid', roughness:2.5 }));
      svg.appendChild(rc.ellipse(tx, H*0.42, 7, 10, { stroke:'#ffe080', fill:'#ffe080', fillStyle:'solid', roughness:2 }));
    });
  }

  if (type === 'castle' || type === 'ruins') {
    // Moon or sun — castle sky is always dark so use time to pick
    if (time === 'night' || time === 'dusk' || !time || time === 'cave') {
      // Moon — glowing behind the towers
      svg.appendChild(rc.circle(W*0.68, H*0.14, 28, {
        stroke:'#f5e68a', fill:'#fdf5b0', fillStyle:'solid', roughness:0.7
      }));
      // Crater texture
      svg.appendChild(rc.circle(W*0.68-5, H*0.14+3, 8, {
        stroke:'#d4c050', fill:'none', roughness:1.2, strokeWidth:1
      }));
      // Stars above the towers
      for (let i = 0; i < 40; i++) {
        const stx = sr()*W, sty = sr()*H*0.5;
        const stz = sr()*1.5 + 0.3;
        const starEl2 = svgEl('circle', { cx:stx, cy:sty, r:stz, fill:'#FFFDE7', opacity:String(0.3+sr()*0.5) });
        svg.appendChild(starEl2);
      }
    } else {
      // Day — a dim sun through the overcast sky
      svg.appendChild(rc.circle(W*0.68, H*0.14, 22, {
        stroke:'#9999cc', fill:'rgba(200,200,255,0.6)', fillStyle:'solid', roughness:0.8
      }));
    }
    // Distant towers
    for (let i = 0; i < 4; i++) {
      const tx = 60 + i * (W/4) + sr()*30-15;
      const th = 60 + sr() * 70;
      const tw = 28 + sr() * 16;
      const stone = pal.stone ? pal.stone[i%pal.stone.length] : '#607D8B';
      svg.appendChild(rc.rectangle(tx-tw/2, H*0.65-th, tw, th, {
        stroke: shadeColor(stone,-20), fill: stone, fillStyle:'hachure', roughness:2.0, strokeWidth:1.5
      }));
      // Battlements
      for (let b = 0; b < 4; b++) {
        svg.appendChild(rc.rectangle(tx-tw/2+b*(tw/4), H*0.65-th-10, tw/4-2, 10, {
          stroke: shadeColor(stone,-20), fill: stone, fillStyle:'solid', roughness:1.5
        }));
      }
      // Lit windows
      if (sr() > 0.3) {
        svg.appendChild(rc.ellipse(tx, H*0.65-th+15, 8, 12, {
          stroke:'none', fill:'rgba(255,200,80,0.8)', fillStyle:'solid', roughness:0.8
        }));
      }
    }
  }

  if (type === 'space') {
    // Stars - lots of them, different sizes
    for (let i = 0; i < 120; i++) {
      const sx = sr() * W, sy = sr() * H * 0.75;
      const sz = sr() * 2.5 + 0.3;
      const starEl = svgEl('circle', { cx: sx, cy: sy, r: sz, fill: '#FFFDE7', opacity: String(0.4 + sr()*0.6) });
      svg.appendChild(starEl);
    }
    // Nebula cloud
    for (let i = 0; i < 4; i++) {
      const nx = sr()*W, ny = sr()*H*0.6;
      const colors = ['rgba(107,63,255,0.15)','rgba(255,63,107,0.12)','rgba(63,255,200,0.1)'];
      const nebulaEl = svgEl('ellipse', {
        cx: nx, cy: ny, rx: 60+sr()*80, ry: 30+sr()*40,
        fill: colors[i%colors.length]
      });
      svg.appendChild(nebulaEl);
    }
    // Planets — sketchy and colorful
    const planetColors = pal.planet || ['#FF6B6B','#4ECDC4','#A8E063'];
    for (let i = 0; i < 4; i++) {
      const px = 50 + sr()*(W-100), py = 20 + sr()*(H*0.5);
      const pr2 = 12 + sr()*35;
      const pc = planetColors[i%planetColors.length];
      svg.appendChild(rc.circle(px, py, pr2*2, {
        stroke: shadeColor(pc,-30), fill: pc, fillStyle:'solid', roughness:1.2
      }));
      // Planet ring sometimes
      if (sr() > 0.5) {
        svg.appendChild(rc.ellipse(px, py, pr2*3.2, pr2*0.6, {
          stroke: shadeColor(pc,-20), fill:'none', roughness:1.5, strokeWidth:2
        }));
      }
      // Crater marks
      if (sr() > 0.4) {
        svg.appendChild(rc.circle(px + pr2*0.3, py - pr2*0.2, (pr2*0.25)*2, {
          stroke: shadeColor(pc,-40), fill:'none', roughness:1, strokeWidth:1
        }));
      }
    }
    // Spaceship silhouette
    const sx2 = W*0.75, sy2 = H*0.18;
    svg.appendChild(rc.ellipse(sx2, sy2, 55, 18, { stroke:'#aaa', fill:'#555', fillStyle:'solid', roughness:1.2 }));
    svg.appendChild(rc.ellipse(sx2, sy2-8, 25, 14, { stroke:'#aaa', fill:'#888', fillStyle:'solid', roughness:1 }));
    svg.appendChild(rc.ellipse(sx2+10, sy2+2, 10, 4, { stroke:'none', fill:'rgba(100,200,255,0.6)', fillStyle:'solid', roughness:0.8 }));
  }

  if (type === 'ocean') {
    // Horizon and sun
    if (time === 'day') {
      svg.appendChild(rc.circle(W*0.75, H*0.25, 40, {
        stroke:'#FFD700', fill:'#FFEE55', fillStyle:'solid', roughness:0.8
      }));
    }
    // Distant ship
    const shipX = W*0.65 + sr()*60-30, shipY = H*0.48;
    svg.appendChild(rc.polygon([[shipX-22,shipY],[shipX+22,shipY],[shipX+18,shipY+10],[shipX-18,shipY+10]], {
      stroke:'#4a3020', fill:'#5a4028', fillStyle:'solid', roughness:1.8
    }));
    svg.appendChild(rc.line(shipX, shipY, shipX, shipY-32, { stroke:'#4a3020', strokeWidth:2, roughness:1.5 }));
    svg.appendChild(rc.polygon([[shipX,shipY-32],[shipX+20,shipY-20],[shipX,shipY-18]], {
      stroke:'#8a7060', fill:'rgba(200,180,150,0.5)', fillStyle:'solid', roughness:1.5
    }));
    // Waves
    for (let i = 0; i < 8; i++) {
      const wy = H*0.52 + sr()*30, wx = sr()*W;
      const wl = 30 + sr()*60;
      const wavePath = `M ${wx} ${wy} Q ${wx+wl/2} ${wy-8} ${wx+wl} ${wy}`;
      svg.appendChild(rc.path(wavePath, {
        stroke: pal.wave || '#42A5F5', fill:'none', strokeWidth:2, roughness:2.0
      }));
    }
  }

  if (type === 'village') {
    // Sunset/sunrise color sky base
    // Cottages in background
    for (let i = 0; i < 5; i++) {
      const hx = 50 + i*(W/5) + sr()*20-10;
      const hy2 = H*0.55 - sr()*15;
      const lit = sr() > 0.35;
      // Wall
      svg.appendChild(rc.rectangle(hx-20, hy2-25, 40, 28, {
        stroke: shadeColor(pal.wall||'#EFEBE9', -20), fill: pal.wall||'#EFEBE9',
        fillStyle:'solid', roughness:1.8
      }));
      // Roof
      svg.appendChild(rc.polygon([[hx-24,hy2-25],[hx+24,hy2-25],[hx,hy2-48]], {
        stroke: shadeColor(pal.roof||'#C62828', -20), fill: pal.roof||'#C62828',
        fillStyle:'hachure', roughness:2.0
      }));
      // Window
      if (lit) {
        svg.appendChild(rc.rectangle(hx-6, hy2-20, 10, 8, {
          stroke:'#aaa', fill:'rgba(255,200,80,0.85)', fillStyle:'solid', roughness:0.8
        }));
      }
      // Chimney
      svg.appendChild(rc.rectangle(hx+10, hy2-52, 7, 18, {
        stroke:'#5C3A1E', fill: pal.chimney||'#6D4C41', fillStyle:'solid', roughness:1.5
      }));
    }
  }

  if (type === 'desert') {
    // Hot sun
    svg.appendChild(rc.circle(W*0.8, H*0.12, 38, {
      stroke:pal.sun||'#FFE57F', fill:pal.sun||'#FFE57F', fillStyle:'solid', roughness:0.7
    }));
    // Heat haze ellipses
    for (let i = 0; i < 3; i++) {
      svg.appendChild(svgEl('ellipse', {
        cx: sr()*W, cy: String(H*0.55), rx: String(60+sr()*80), ry: '8',
        fill: 'rgba(255,200,100,0.08)'
      }));
    }
    // Pyramids
    const px = W*0.6 + sr()*50-25;
    svg.appendChild(rc.polygon([[px-50,H*0.62],[px+50,H*0.62],[px,H*0.32]], {
      stroke: shadeColor(pal.sand?pal.sand[0]:'#D4A055', -30),
      fill: pal.sand?pal.sand[0]:'#D4A055',
      fillStyle:'hachure', roughness:2.0
    }));
  }

  if (type === 'mountain') {
    // Multiple peaks
    const peaks = [
      { x: W*0.15, h: 100 },
      { x: W*0.4, h: 140 },
      { x: W*0.65, h: 110 },
      { x: W*0.88, h: 90 },
    ];
    peaks.forEach(({ x, h }) => {
      const rk = pal.rock ? pal.rock[Math.floor(sr()*pal.rock.length)] : '#78909C';
      svg.appendChild(rc.polygon([[x-h*0.55, H*0.68],[x+h*0.55, H*0.68],[x, H*0.68-h]], {
        stroke: shadeColor(rk,-20), fill: rk, fillStyle:'hachure', roughness:2.5
      }));
      // Snow cap
      svg.appendChild(rc.polygon([
        [x-h*0.15, H*0.68-h*0.62],[x+h*0.15, H*0.68-h*0.62],[x, H*0.68-h]
      ], { stroke:'#ddd', fill:'#EFEFEF', fillStyle:'solid', roughness:2.0 }));
    });
  }
}

// ── Ground drawing ─────────────────────────
function drawGround(rc, svg, type, pal, sr, tr, W, H) {
  // Terrain silhouette
  const pts = [];
  for (let i = 0; i <= 20; i++) {
    const x = (i/20) * W;
    let y;
    if (type === 'mountain')     y = H*0.55 + Math.sin(i*0.9)*30 + tr()*10;
    else if (type === 'ocean')   y = H*0.62 + Math.sin(i*0.5)*8 + tr()*5;
    else if (type === 'desert')  y = H*0.63 + Math.sin(i*0.4)*12 + tr()*8;
    else if (type === 'dungeon' || type === 'cave') y = H*0.75 + tr()*3;
    else if (type === 'castle' || type === 'ruins') y = H*0.66 + Math.sin(i*0.3)*6 + tr()*5;
    else                         y = H*0.65 + Math.sin(i*0.6)*12 + Math.sin(i*1.3)*6 + tr()*8;
    pts.push([x, y]);
  }
  const groundPath = `M 0 ${H} L ${pts.map(p=>`${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ')} L ${W} ${H} Z`;
  // Stroke off for flat scenes (castle/ruins) to avoid razor line
  const flatTerrain = type==='castle'||type==='ruins'||type==='dungeon'||type==='cave';
  svg.appendChild(rc.path(groundPath, {
    stroke: flatTerrain ? 'none' : shadeColor(pal.ground,-20),
    fill: pal.ground,
    fillStyle: (type==='desert'||type==='snow'||type==='plains') ? 'solid' : 'hachure',
    roughness: flatTerrain ? 1.0 : 1.8, strokeWidth: flatTerrain ? 0 : 1.2
  }));

  // Ground detail layer (lighter, midground)
  const pts2 = pts.map(([x,y]) => [x, y + 15 + tr()*5]);
  const mid2 = `M 0 ${H} L ${pts2.map(p=>`${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ')} L ${W} ${H} Z`;
  svg.appendChild(rc.path(mid2, {
    stroke: flatTerrain ? 'none' : shadeColor(pal.mid || pal.ground, 10),
    fill: pal.mid || pal.ground,
    fillStyle: 'solid', roughness: flatTerrain ? 0.8 : 1.2, strokeWidth: flatTerrain ? 0 : 0.8
  }));

  // Foreground dark strip
  svg.appendChild(rc.rectangle(0, H-45, W, 50, {
    stroke: shadeColor(pal.far || pal.ground, -20),
    fill: pal.far || shadeColor(pal.ground, -30),
    fillStyle:'solid', roughness:1.0, strokeWidth:0
  }));

  // Mid-scene trees/props
  if (type === 'forest' || type === 'plains') {
    for (let i = 0; i < 8; i++) {
      const tx = tr() * W;
      const baseY = pts[Math.round((tx/W)*20)]?.[1] || H*0.65;
      const th = 45 + tr()*60;
      const leafColor = pal.leaf ? pal.leaf[i%pal.leaf.length] : '#3D8B37';
      // Trunk
      svg.appendChild(rc.rectangle(tx-3, baseY-th*0.35, 6, th*0.4, {
        stroke: pal.trunk||'#5C3A1E', fill: shadeColor(pal.trunk||'#5C3A1E',10),
        fillStyle:'solid', roughness:2.0
      }));
      // Canopy — multiple overlapping circles for lush look
      [[0,-th*0.7,th*0.5],[-12,-th*0.55,th*0.38],[12,-th*0.55,th*0.38]].forEach(([dx,dy,r]) => {
        svg.appendChild(rc.circle(tx+dx, baseY+dy, r*2, {
          stroke: shadeColor(leafColor,-15), fill: leafColor,
          fillStyle:'solid', roughness:2.8, bowing:0.5
        }));
      });
      // Highlight on top of canopy
      svg.appendChild(rc.ellipse(tx, baseY-th*0.75, th*0.35, th*0.22, {
        stroke:'none', fill: shadeColor(leafColor, 20),
        fillStyle:'solid', roughness:2.5, opacity:0.6
      }));
    }
  }

  if (type === 'dungeon' || type === 'cave') {
    // Stalagmites
    for (let i = 0; i < 6; i++) {
      const sx = tr() * W;
      const sy = pts[Math.round((sx/W)*20)]?.[1] || H*0.72;
      const sl = 10 + tr()*22;
      const stone = pal.stone ? pal.stone[i%pal.stone.length] : '#4a4060';
      svg.appendChild(rc.polygon([[sx-5,sy],[sx+5,sy],[sx,sy-sl]], {
        stroke: shadeColor(stone,-20), fill: stone,
        fillStyle:'hachure', roughness:2.0
      }));
    }
    if (type === 'cave') {
      // Crystal formations
      for (let i = 0; i < 5; i++) {
        const cx = tr()*W, cy = pts[Math.round((cx/W)*20)]?.[1] || H*0.7;
        const ch = 15 + tr()*30;
        const cc = pal.crystal ? pal.crystal[i%pal.crystal.length] : '#7B6CFF';
        [[0,ch],[-8,ch*0.7],[8,ch*0.75]].forEach(([dx,h]) => {
          svg.appendChild(rc.polygon([[cx+dx-4,cy],[cx+dx+4,cy],[cx+dx,cy-h]], {
            stroke: shadeColor(cc,-20), fill: cc,
            fillStyle:'solid', roughness:1.0, strokeWidth:1.5
          }));
        });
      }
    }
  }

  if (type === 'desert') {
    // Cacti
    for (let i = 0; i < 5; i++) {
      const cx = tr() * W;
      const cy = pts[Math.round((cx/W)*20)]?.[1] || H*0.63;
      svg.appendChild(rc.rectangle(cx-4, cy-30, 8, 32, {stroke:'#2E7D32', fill: pal.cactus||'#4CAF50', fillStyle:'solid', roughness:1.8}));
      svg.appendChild(rc.rectangle(cx-14, cy-22, 10, 4, {stroke:'#2E7D32', fill: pal.cactus||'#4CAF50', fillStyle:'solid', roughness:1.5}));
      svg.appendChild(rc.rectangle(cx+4, cy-18, 10, 4, {stroke:'#2E7D32', fill: pal.cactus||'#4CAF50', fillStyle:'solid', roughness:1.5}));
    }
  }

  if (type === 'snow') {
    // Snow-laden pine trees
    for (let i = 0; i < 7; i++) {
      const tx = tr()*W, baseY = pts[Math.round((tx/W)*20)]?.[1] || H*0.62;
      const th = 30 + tr()*50;
      svg.appendChild(rc.polygon([[tx-th*0.5,baseY],[tx+th*0.5,baseY],[tx,baseY-th]], {
        stroke:'#1B3A1E', fill: pal.tree||'#2E4A1E', fillStyle:'solid', roughness:2.2
      }));
      // Snow on tree
      svg.appendChild(rc.polygon([[tx-th*0.4,baseY-th*0.3],[tx+th*0.4,baseY-th*0.3],[tx,baseY-th]], {
        stroke:'#ddd', fill:'white', fillStyle:'solid', roughness:2.5
      }));
    }
    // Snowdrift mounds
    for (let i = 0; i < 6; i++) {
      const sx = tr()*W, sy = pts[Math.round((sx/W)*20)]?.[1] || H*0.62;
      svg.appendChild(rc.ellipse(sx, sy+5, 40+tr()*30, 14, {
        stroke:'#ddd', fill:'#F0F4F8', fillStyle:'solid', roughness:2.0
      }));
    }
  }
}

// ── Foreground elements ────────────────────
function drawForeground(rc, svg, type, pal, tr, W, H) {
  for (let i = 0; i < 5; i++) {
    const fx = tr() * W;
    if (type === 'forest' || type === 'plains' || type === 'village') {
      // Grass tufts
      const gc = pal.leaf ? pal.leaf[0] : '#3D8B37';
      for (let j = 0; j < 3; j++) {
        svg.appendChild(rc.line(fx+j*4-4, H-8, fx+j*4-4+tr()*4-2, H-18-tr()*8, {
          stroke: gc, strokeWidth: 2, roughness: 2.0
        }));
      }
    } else if (type === 'dungeon' || type === 'cave') {
      svg.appendChild(rc.circle(fx, H-8, 5, {
        stroke: pal.stone?pal.stone[0]:'#4a4060',
        fill: pal.stone?shadeColor(pal.stone[0],15):'#6a6080',
        fillStyle:'solid', roughness:2.5
      }));
    }
  }
}

// ── Weather ────────────────────────────────
function drawRain(svg, tr) {
  for (let i = 0; i < 60; i++) {
    const rx = tr()*W, ry = tr()*H;
    const line = svgEl('line', {
      x1: rx, y1: ry, x2: String(rx-3), y2: String(ry+12),
      stroke:'rgba(150,190,255,0.4)', 'stroke-width':'1'
    });
    svg.appendChild(line);
  }
}

function drawSnowfall(svg, tr) {
  for (let i = 0; i < 40; i++) {
    const sx = tr()*W, sy = tr()*H;
    const sf = svgEl('circle', {
      cx: sx, cy: sy, r: String(1.5 + tr()*2),
      fill:'rgba(255,255,255,0.7)'
    });
    svg.appendChild(sf);
  }
}

// ═══════════════════════════════════════════
//  REACT COMPONENT
// ═══════════════════════════════════════════

export default function SceneRenderer({ scene, players, turnCount = 0, inCombat, enemy, npcs }) {
  const svgRef = useRef(null);

  // Merge enemy/combat into scene object for drawScene
  const mergedScene = {
    ...scene,
    inCombat: inCombat || scene?.inCombat || false,
    enemy: enemy || scene?.enemy || null,
    npcs: npcs || [],
  };

  useEffect(() => {
    if (!svgRef.current) return;
    try {
      drawScene(svgRef.current, mergedScene, players, turnCount);
    } catch(e) {
      console.warn('SceneRenderer error:', e);
    }
  }, [scene?.type, scene?.time, scene?.weather, scene?.inCombat, scene?.enemy, players, turnCount, inCombat, enemy, npcs]);

  return (
    <div className={styles.wrapper}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="100%"
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
      />
    </div>
  );
}
