import { useEffect, useRef } from 'react';
import rough from '../../lib/rough.js';
import styles from './SceneRenderer.module.css';
import { buildScenePopulation, renderPopulation, renderParticles, renderStatusAuras, renderNpcLabels } from './scenePopulation.js';

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
  // ── existing palettes ──────────────────────────────────────────────────
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
    sky:    ['#4A90C8','#6AAEE0','#A8D4F0'],
    ground: '#8B7355',
    mid:    '#6B5540',
    far:    '#4A3828',
    accent: '#FF8C42',
    neon:   ['#FF6B35','#FF4CCD','#00FFFF'],
    build:  ['#8C7B6A','#7A6A5A','#5A4A38'],
    stone:  ['#9E8E7A','#8A7A68','#7A6A56'],
    window: '#FFEE55',
    roof:   '#A0522D',
    flag:   '#CC2222',
    sun:    '#FFE066',
  },
  // ── new scene types ────────────────────────────────────────────────────
  tower: {
    sky:    ['#1C1030','#2E1C4A','#4A2A6A'],
    ground: '#3A2840',
    mid:    '#2A1E32',
    far:    '#1A1228',
    accent: '#9B6FFF',
    stone:  ['#5A4870','#4A3860','#6A5880'],
    torch:  '#FF8C42',
    glow:   '#7B4FFF',
    window: '#AAFFCC',
  },
  temple: {
    sky:    ['#D4A843','#C4882A','#8A5A18'],
    ground: '#A07838',
    mid:    '#806028',
    far:    '#5A4018',
    accent: '#FFD700',
    stone:  ['#C8A870','#B89058','#A07840'],
    pillar: '#D4B880',
    glow:   '#FFD700',
    torch:  '#FF6030',
  },
  shrine: {
    sky:    ['#2A1A3A','#3A2A50','#4A3A68'],
    ground: '#2A2038',
    mid:    '#1E1830',
    far:    '#141028',
    accent: '#FF8CA0',
    stone:  ['#5A4870','#4A3862','#6A5882'],
    lantern:'#FFD080',
    glow:   '#FF70A0',
    petal:  '#FF90B0',
  },
  tavern: {
    sky:    ['#2A1A0A','#3A2810','#4A3818'],
    ground: '#5A3818',
    mid:    '#4A2E12',
    far:    '#38220A',
    accent: '#FFB830',
    wood:   ['#6B4423','#8B5A2A','#5A3818'],
    fire:   '#FF6B35',
    mug:    '#D4A840',
    candle: '#FFD080',
  },
  ship: {
    sky:    ['#1E4080','#2850A0','#3A6ABE'],
    ground: '#1565C0',
    mid:    '#0D47A1',
    far:    '#0A3080',
    accent: '#F5DEB3',
    wood:   ['#8B4513','#A0522D','#6B3410'],
    sail:   '#F5F5DC',
    wave:   '#1E90FF',
    rope:   '#C4A040',
  },
  manor: {
    sky:    ['#1A0A18','#280E24','#380E30'],
    ground: '#2A1828',
    mid:    '#1E1020',
    far:    '#120A18',
    accent: '#8866AA',
    stone:  ['#3A2840','#2E2038','#4A3850'],
    window: '#FF4488',
    vine:   '#2A4A20',
    fog:    'rgba(80,40,80,0.3)',
  },
  interior: {
    sky:    ['#1A1008','#241810','#301E14'],
    ground: '#5A3A18',
    mid:    '#4A2E12',
    far:    '#38220A',
    accent: '#FFD080',
    wood:   ['#6B4423','#8B5A2A','#5A3818'],
    fire:   '#FF8C42',
    candle: '#FFD080',
    stone:  ['#7A6858','#6A5848','#8A7868'],
  },
  market: {
    sky:    ['#FF9A3C','#FFAD50','#FFC870'],
    ground: '#8B7355',
    mid:    '#7A6248',
    far:    '#6A5238',
    accent: '#FF6B35',
    awning: ['#CC2222','#2244CC','#22AA44'],
    stone:  ['#9E8E7A','#8A7A68'],
    sun:    '#FFE066',
    crowd:  '#C4A880',
  },
  arena: {
    sky:    ['#1A237E','#283593','#3949AB'],
    ground: '#C4A040',
    mid:    '#A08030',
    far:    '#806020',
    accent: '#FFD700',
    sand:   ['#D4B058','#C09040','#B07830'],
    stone:  ['#607D8B','#546E7A','#455A64'],
    crowd:  '#8B6A50',
    blood:  '#CC2222',
  },
  jail: {
    sky:    ['#0A0A14','#101018','#0A0A14'],
    ground: '#2A2430',
    mid:    '#1E1A28',
    far:    '#141020',
    accent: '#6B6B7A',
    stone:  ['#3A3448','#2E2838','#4A4458'],
    rust:   '#8B4513',
    torch:  '#FF6B35',
    bar:    '#5A5A6A',
  },
  wasteland: {
    sky:    ['#3A2810','#4A3418','#5A4020'],
    ground: '#6A4820',
    mid:    '#5A3A18',
    far:    '#402A10',
    accent: '#D4A840',
    dust:   ['#8B6030','#A07040','#7A5028'],
    ruin:   ['#5A4030','#4A3020'],
    smog:   'rgba(100,80,40,0.3)',
    rust:   '#8B3A20',
  },
  jungle: {
    sky:    ['#1B5E20','#2E7D32','#43A047'],
    ground: '#2E4A1E',
    mid:    '#1E3A12',
    far:    '#122808',
    accent: '#F9A825',
    leaf:   ['#2E7D32','#388E3C','#1B5E20'],
    vine:   '#558B2F',
    flower: '#FF6F00',
    fog:    'rgba(80,140,60,0.2)',
  },
  // ── SPACE / SCI-FI ──────────────────────────────────────────────────
  spaceship: {
    sky:    ['#050510','#0A0A20','#050510'],
    ground: '#1A1A2E', mid: '#10102A', far: '#080818',
    accent: '#00FFCC', metal: ['#2A3A4A','#1E2E3E','#3A4A5A'],
    panel: '#1A3A5A', alert: '#FF4444', glow: '#00CCFF', window: '#004466',
  },
  space_station: {
    sky:    ['#020212','#060620','#020212'],
    ground: '#1E1E30', mid: '#141428', far: '#0A0A1A',
    accent: '#44FFCC', metal: ['#303848','#242E3C','#3C4858'],
    strut: '#2A3A4A', glow: '#00FFAA', alert: '#FF6600', window: '#003355',
  },
  alien_planet: {
    sky:    ['#1A0A30','#2E1050','#4A1A70'],
    ground: '#3A1A50', mid: '#2A1240', far: '#1A0A30',
    accent: '#AAFFAA', crystal: ['#8844FF','#AA66FF','#6622DD'],
    glow: '#88FF44', fog: 'rgba(100,40,180,0.25)', spore: '#44FFAA',
  },
  // ── WESTERN ─────────────────────────────────────────────────────────
  prairie: {
    sky:    ['#4A8ABE','#6AA8D8','#A0CCE8'],
    ground: '#8A7040', mid: '#7A6030', far: '#6A5020',
    accent: '#D4A840', grass: ['#A09040','#B0A050','#907830'],
    dust: '#C4A870', horizon: '#D4B880', sun: '#FFE566',
  },
  saloon: {
    sky:    ['#1A0E08','#281810','#381E14'],
    ground: '#5A3818', mid: '#4A2E12', far: '#38220A',
    accent: '#D4A840', wood: ['#7B4A23','#9B6A33','#6B3A18'],
    lamp: '#FFD060', baize: '#2A6A2A', piano: '#4A3020',
  },
  frontier_town: {
    sky:    ['#CC7A30','#E89050','#F0A860'],
    ground: '#A07840', mid: '#886030', far: '#6A4820',
    accent: '#FFD060', wood: ['#8B5A2A','#7A4A1A','#9B6A3A'],
    dust: '#C4A060', sign: '#D4B870', sun: '#FFE566',
  },
  canyon: {
    sky:    ['#CC5A20','#E07030','#F08848'],
    ground: '#C06030', mid: '#A04A20', far: '#803818',
    accent: '#FFD060', rock: ['#C07040','#A85A30','#D08050'],
    shadow: '#602010', dust: '#D4A060', sun: '#FFE080',
  },
  mine: {
    sky:    ['#080808','#101010','#080808'],
    ground: '#2A2020', mid: '#1E1818', far: '#141010',
    accent: '#D4A840', wood: ['#5A3A18','#4A2E12','#6A4A28'],
    ore: '#8A7040', torch: '#FF8030', cart: '#4A3828',
  },
  // ── HORROR ──────────────────────────────────────────────────────────
  graveyard: {
    sky:    ['#0A0A14','#14141E','#0A0A14'],
    ground: '#1E2018', mid: '#181A14', far: '#101210',
    accent: '#8899AA', stone: ['#4A4A50','#3A3A40','#5A5A60'],
    fog: 'rgba(80,90,100,0.35)', moon: '#AABBCC', dead: '#2A2E28',
  },
  crypt: {
    sky:    ['#050510','#0A0A18','#050510'],
    ground: '#1A1820', mid: '#12101A', far: '#0A0812',
    accent: '#6644AA', stone: ['#2A283A','#1E1C30','#3A3848'],
    bone: '#C8C0A8', glow: '#4422AA', damp: '#141830',
  },
  asylum: {
    sky:    ['#0A0A10','#101018','#0A0A10'],
    ground: '#1E1E28', mid: '#16161E', far: '#0E0E18',
    accent: '#AAAACC', wall: ['#2A2A38','#222230','#323240'],
    flicker: '#FFDD88', crack: '#1A1A28', blood: '#4A1010',
  },
  // ── CYBERPUNK ───────────────────────────────────────────────────────
  neon_city: {
    sky:    ['#050510','#0A0820','#050510'],
    ground: '#1A1428', mid: '#120E20', far: '#0A0818',
    accent: '#FF00FF', neon: ['#FF00FF','#00FFFF','#FF4400','#00FF88'],
    build: ['#1A1830','#141228','#221E38'], puddle: '#0A0818',
    smog: 'rgba(20,10,40,0.4)', window: '#001133',
  },
  back_alley: {
    sky:    ['#030308','#06060E','#030308'],
    ground: '#1A1418', mid: '#120E10', far: '#0A080C',
    accent: '#FF3366', brick: ['#2A1E22','#1E1618','#32262A'],
    neon: ['#FF2266','#0088FF','#00FFAA'], trash: '#2A2018', puddle: '#0A0A18',
  },
  corp_building: {
    sky:    ['#080818','#101028','#080818'],
    ground: '#1E1E30', mid: '#161626', far: '#0E0E1E',
    accent: '#0088FF', glass: ['#102030','#0A1828','#182838'],
    light: '#0066CC', logo: '#FF4400', floor: '#1A1A2E',
  },
  // ── MYTHOLOGY ───────────────────────────────────────────────────────
  olympus: {
    sky:    ['#87CEEB','#AADDF5','#E8F7FF'],
    ground: '#F5F0E8', mid: '#E8E0D0', far: '#D8D0C0',
    accent: '#FFD700', cloud: '#FFFFFF', marble: ['#F8F4EC','#EEE8DC','#E4DCC8'],
    gold: '#FFD700', glow: '#FFFAAA', pillar: '#F0E8D8',
  },
  underworld: {
    sky:    ['#1A0000','#300808','#1A0000'],
    ground: '#2A0808', mid: '#200606', far: '#140404',
    accent: '#FF4400', lava: ['#FF4400','#FF6600','#DD2200'],
    bone: '#C8B898', smoke: 'rgba(60,10,10,0.4)', glow: '#FF2200', river: '#440000',
  },
  // ── NINJA / SAMURAI ─────────────────────────────────────────────────
  dojo: {
    sky:    ['#1A1008','#241810','#301E14'],
    ground: '#5A3818', mid: '#4A2E12', far: '#38220A',
    accent: '#D4A840', wood: ['#6B4423','#8B5A2A','#5A3818'],
    mat: '#8A7040', paper: '#F0E8D0', lacquer: '#AA2222',
  },
  bamboo_forest: {
    sky:    ['#2E5A1E','#3A7028','#4A8A38'],
    ground: '#2A4818', mid: '#1E3A12', far: '#142A0A',
    accent: '#C8E840', bamboo: ['#6A9A30','#8AB840','#5A8A28'],
    leaf: '#A8D840', mist: 'rgba(80,140,50,0.3)', light: '#E8FF88',
  },
  fortress_jp: {
    sky:    ['#0A0A18','#141428','#0A0A18'],
    ground: '#2A2838', mid: '#1E1C2E', far: '#141228',
    accent: '#CC2222', stone: ['#3A3848','#2E2C40','#464458'],
    wood: ['#4A3018','#3A2210','#5A4020'], banner: '#CC2222', torch: '#FF8030',
  },
  // ── POST-APOCALYPTIC ────────────────────────────────────────────────
  bunker: {
    sky:    ['#080808','#101010','#080808'],
    ground: '#282828', mid: '#202020', far: '#181818',
    accent: '#88AA44', metal: ['#3A3A3A','#2E2E2E','#464646'],
    light: '#88AA44', rust: '#6A3018', pipe: '#4A4A4A',
  },
  ruined_city: {
    sky:    ['#2A2010','#382818','#4A3420'],
    ground: '#5A4428', mid: '#4A3420', far: '#382818',
    accent: '#C4A840', rubble: ['#5A4A38','#4A3A28','#6A5A48'],
    rebar: '#5A5050', smoke: 'rgba(80,60,40,0.35)', fire: '#FF6030', glass: '#5A7A6A',
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
    // Left arm extended holding bow
    svg.appendChild(rc.line(cx-6, hy-32, cx-16, hy-42, { stroke: color, strokeWidth: 4, roughness: 1.5, strokeLinecap:'round' }));
    // Right arm drawn back pulling arrow
    svg.appendChild(rc.line(cx+6, hy-32, cx+10, hy-38, { stroke: color, strokeWidth: 4, roughness: 1.5, strokeLinecap:'round' }));
    // Bow (arc)
    const bowPath = `M ${cx-16} ${hy-52} Q ${cx-24} ${hy-38} ${cx-16} ${hy-22}`;
    svg.appendChild(rc.path(bowPath, { stroke: '#8B4513', strokeWidth: 2, fill: 'none', roughness: 1.5 }));
    svg.appendChild(rc.line(cx-16, hy-52, cx-16, hy-22, { stroke: '#8B4513', strokeWidth: 1, roughness: 0.5 }));
    // Arrow nocked and drawn
    svg.appendChild(rc.line(cx-14, hy-38, cx+10, hy-38, { stroke: '#8B4513', strokeWidth: 1.5, roughness: 0.6 }));
    // Arrow tip
    svg.appendChild(rc.polygon([[cx-14,hy-40],[cx-14,hy-36],[cx-18,hy-38]], { stroke:'#888', fill:'#aaa', fillStyle:'solid', roughness:0.6 }));
    // Quiver on back
    svg.appendChild(rc.rectangle(cx+4, hy-34, 5, 18, opts(shadeColor(color,-30), {roughness:1.5})));
    svg.appendChild(rc.line(cx+5, hy-34, cx+7, hy-40, { stroke: '#8B4513', strokeWidth: 1.5, roughness: 1 }));
    svg.appendChild(rc.line(cx+7, hy-34, cx+7, hy-40, { stroke: '#8B4513', strokeWidth: 1.5, roughness: 1 }));
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
    // Arms — left arm outstretched (healing gesture), right holds staff
    svg.appendChild(rc.line(cx-7, hy-30, cx-16, hy-20, { stroke: color, strokeWidth: 5, roughness: 1.5, strokeLinecap:'round' }));
    svg.appendChild(rc.line(cx-16, hy-20, cx-20, hy-14, { stroke: color, strokeWidth: 4, roughness: 1.5, strokeLinecap:'round' }));
    svg.appendChild(rc.line(cx+7, hy-30, cx+13, hy-20, { stroke: color, strokeWidth: 5, roughness: 1.5, strokeLinecap:'round' }));
    // Staff with cross
    svg.appendChild(rc.line(cx+12, hy, cx+12, hy-55, { stroke: '#FFD700', strokeWidth: 2.5, roughness: 1.2 }));
    svg.appendChild(rc.line(cx+6, hy-45, cx+18, hy-45, { stroke: '#FFD700', strokeWidth: 2.5, roughness: 1.2 }));
    // Healing glow on outstretched hand
    svg.appendChild(rc.circle(cx-20, hy-14, 5, { stroke: '#FFD700', fill: 'rgba(255,220,50,0.4)', fillStyle:'solid', roughness: 1.5 }));
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
  } else if (cls === 'netrunner') {
    // Cyberpunk netrunner — sleek bodysuit, tactical visor, neon accents
    // Legs - slim tactical
    svg.appendChild(rc.rectangle(cx-7, hy-16, 6, 16, opts(shadeColor(color,-50), {roughness:0.8})));
    svg.appendChild(rc.rectangle(cx+1,  hy-16, 6, 16, opts(shadeColor(color,-50), {roughness:0.8})));
    // Body - form-fitting suit
    svg.appendChild(rc.polygon([
      [cx-8,hy-38],[cx+8,hy-38],[cx+7,hy-16],[cx-7,hy-16]
    ], opts(shadeColor(color,-40), { roughness: 0.9 })));
    // Neon strip lines on suit (use player color)
    svg.appendChild(rc.line(cx-6, hy-36, cx-6, hy-20, { stroke: color, strokeWidth: 1.5, roughness: 1.2 }));
    svg.appendChild(rc.line(cx+6, hy-36, cx+6, hy-20, { stroke: color, strokeWidth: 1.5, roughness: 1.2 }));
    // Head
    svg.appendChild(rc.ellipse(cx, hy-46, 13, 13, opts(shadeColor(color,-30))));
    // Tactical visor strip
    svg.appendChild(rc.rectangle(cx-6, hy-49, 12, 4, opts(shadeColor(color,-60), {roughness:0.5})));
    svg.appendChild(rc.rectangle(cx-6, hy-49, 12, 4, { stroke:'none', fill: color, fillStyle:'solid', roughness:0.4 }));
    // Neural implant dot
    svg.appendChild(rc.circle(cx+4, hy-52, 3, { stroke: color, fill: color, fillStyle:'solid', roughness:0.5 }));
    // Arms
    svg.appendChild(rc.line(cx-8, hy-36, cx-14, hy-24, { stroke: shadeColor(color,-40), strokeWidth: 5, roughness: 1.2, strokeLinecap:'round' }));
    svg.appendChild(rc.line(cx+8, hy-36, cx+14, hy-22, { stroke: shadeColor(color,-40), strokeWidth: 5, roughness: 1.2, strokeLinecap:'round' }));
    // Data jack cable from hand
    svg.appendChild(rc.path(`M ${cx-14} ${hy-24} Q ${cx-22} ${hy-22} ${cx-24} ${hy-16}`, { stroke: color, strokeWidth: 1, fill: 'none', roughness: 2 }));

  } else if (cls === 'gunslinger') {
    // Western gunslinger — duster coat, cowboy hat, revolver
    // Legs with trouser stripe
    svg.appendChild(rc.rectangle(cx-8, hy-18, 6, 18, opts(shadeColor(color,-40), {roughness:1.5})));
    svg.appendChild(rc.rectangle(cx+2,  hy-18, 6, 18, opts(shadeColor(color,-40), {roughness:1.5})));
    // Boot spurs
    svg.appendChild(rc.line(cx-8, hy, cx-12, hy+2, { stroke: '#888', strokeWidth: 1.5, roughness: 1 }));
    // Duster coat
    svg.appendChild(rc.polygon([
      [cx-9,hy-36],[cx+9,hy-36],[cx+11,hy-10],[cx+15,hy-6],[cx+14,hy],[cx+8,hy-8],
      [cx-8,hy-8],[cx-14,hy],[cx-15,hy-6],[cx-11,hy-10]
    ], opts(shadeColor(color,-30), { roughness: 2.2 })));
    // Vest/shirt
    svg.appendChild(rc.rectangle(cx-5, hy-34, 10, 14, opts(shadeColor(color,-10), {roughness:1})));
    // Head
    svg.appendChild(rc.ellipse(cx, hy-44, 14, 14, opts(shadeColor(color,-10))));
    // Stubble/face
    svg.appendChild(rc.line(cx-4, hy-39, cx+4, hy-39, { stroke: shadeColor(color,-30), strokeWidth: 1.5, roughness: 2 }));
    // Cowboy hat - brim + crown
    svg.appendChild(rc.ellipse(cx, hy-50, 22, 5, opts(shadeColor(color,-50), {roughness:1.5})));
    svg.appendChild(rc.rectangle(cx-7, hy-62, 14, 12, opts(shadeColor(color,-50), {roughness:1.5})));
    // Hat crease
    svg.appendChild(rc.line(cx-6, hy-62, cx+6, hy-62, { stroke: shadeColor(color,-60), strokeWidth: 1, roughness: 2 }));
    // Arms
    svg.appendChild(rc.line(cx-9, hy-34, cx-14, hy-22, { stroke: shadeColor(color,-30), strokeWidth: 5, roughness: 1.5, strokeLinecap:'round' }));
    svg.appendChild(rc.line(cx+9, hy-34, cx+16, hy-20, { stroke: shadeColor(color,-30), strokeWidth: 5, roughness: 1.5, strokeLinecap:'round' }));
    // Revolver
    svg.appendChild(rc.rectangle(cx+16, hy-22, 7, 3, opts('#666', {roughness:0.8})));
    svg.appendChild(rc.circle(cx+17, hy-20, 4, { stroke:'#444', fill:'#333', fillStyle:'solid', roughness:0.8 }));

  } else if (cls === 'samurai') {
    // Samurai — armored do, kabuto helmet, katana
    // Legs - hakama wide pants
    svg.appendChild(rc.polygon([[cx-9,hy-18],[cx+9,hy-18],[cx+13,hy],[cx-13,hy]], opts(shadeColor(color,-20), {roughness:2.0})));
    // Body armor plates
    svg.appendChild(rc.polygon([
      [cx-9,hy-38],[cx+9,hy-38],[cx+10,hy-18],[cx-10,hy-18]
    ], opts(shadeColor(color,-40), { roughness: 1.2 })));
    // Armor lacing lines
    svg.appendChild(rc.line(cx-8, hy-36, cx+8, hy-36, { stroke: color, strokeWidth: 1.2, roughness: 1.5 }));
    svg.appendChild(rc.line(cx-8, hy-30, cx+8, hy-30, { stroke: color, strokeWidth: 1.2, roughness: 1.5 }));
    svg.appendChild(rc.line(cx-8, hy-24, cx+8, hy-24, { stroke: color, strokeWidth: 1.2, roughness: 1.5 }));
    // Shoulder guards (sode)
    svg.appendChild(rc.rectangle(cx-16, hy-40, 8, 12, opts(shadeColor(color,-40), {roughness:1.5})));
    svg.appendChild(rc.rectangle(cx+8,  hy-40, 8, 12, opts(shadeColor(color,-40), {roughness:1.5})));
    // Arms
    svg.appendChild(rc.line(cx-12, hy-38, cx-16, hy-22, { stroke: shadeColor(color,-40), strokeWidth: 5, roughness: 1.5, strokeLinecap:'round' }));
    svg.appendChild(rc.line(cx+12, hy-38, cx+18, hy-20, { stroke: shadeColor(color,-40), strokeWidth: 5, roughness: 1.5, strokeLinecap:'round' }));
    // Head
    svg.appendChild(rc.ellipse(cx, hy-46, 13, 13, opts(shadeColor(color,-20))));
    // Kabuto helmet
    svg.appendChild(rc.polygon([
      [cx-8,hy-50],[cx+8,hy-50],[cx+7,hy-46],[cx-7,hy-46]
    ], opts(shadeColor(color,-50), {roughness:1.2})));
    svg.appendChild(rc.path(`M ${cx-8} ${hy-50} Q ${cx} ${hy-60} ${cx+8} ${hy-50}`, opts(shadeColor(color,-50), {roughness:1.5})));
    // Face guard (menpo) — lower face
    svg.appendChild(rc.rectangle(cx-5, hy-46, 10, 4, opts(shadeColor(color,-40), {roughness:0.8})));
    // Katana
    svg.appendChild(rc.line(cx+18, hy-20, cx+28, hy-42, { stroke: '#e8e8d0', strokeWidth: 2, roughness: 0.6 }));
    svg.appendChild(rc.ellipse(cx+21, hy-26, 5, 2, { stroke:'#a08020', fill:'none', roughness:1, strokeWidth:1.5 }));

  } else if (cls === 'bard') {
    // Bard / Performer — colorful tunic, lute, feathered cap
    // Flowing tunic
    svg.appendChild(rc.polygon([
      [cx-7,hy-34],[cx+7,hy-34],[cx+9,hy],[cx-9,hy]
    ], opts(color, { roughness: 2.0 })));
    // Contrast trim on tunic
    svg.appendChild(rc.line(cx-7, hy-24, cx+7, hy-24, { stroke: darkColor, strokeWidth: 1.5, roughness: 1.5 }));
    // Head
    svg.appendChild(rc.ellipse(cx, hy-42, 13, 13, opts(shadeColor(color,-10))));
    // Feathered cap (wide brim, feather)
    svg.appendChild(rc.ellipse(cx, hy-48, 18, 4, opts(darkColor, {roughness:1.5})));
    svg.appendChild(rc.rectangle(cx-6, hy-56, 12, 9, opts(darkColor, {roughness:1.5})));
    svg.appendChild(rc.path(`M ${cx+6} ${hy-56} Q ${cx+14} ${hy-62} ${cx+12} ${hy-68} Q ${cx+8} ${hy-60} ${cx+6} ${hy-56}`,
      { stroke: shadeColor(color,30), fill: shadeColor(color,20), fillStyle:'solid', roughness:2.5 }));
    // Arms
    svg.appendChild(rc.line(cx-7, hy-32, cx-13, hy-20, { stroke: color, strokeWidth: 5, roughness: 1.5, strokeLinecap:'round' }));
    svg.appendChild(rc.line(cx+7, hy-32, cx+14, hy-18, { stroke: color, strokeWidth: 5, roughness: 1.5, strokeLinecap:'round' }));
    // Lute body (right hand)
    svg.appendChild(rc.ellipse(cx+17, hy-14, 10, 12, opts(shadeColor(color,-20), {roughness:1.2})));
    // Lute neck
    svg.appendChild(rc.line(cx+14, hy-18, cx+10, hy-30, { stroke: shadeColor(color,-30), strokeWidth: 2.5, roughness:1.5 }));
    // Lute strings
    svg.appendChild(rc.line(cx+14, hy-18, cx+11, hy-30, { stroke: '#ddd', strokeWidth: 0.8, roughness:0.8 }));
    svg.appendChild(rc.line(cx+15.5, hy-17, cx+12, hy-30, { stroke: '#ddd', strokeWidth: 0.8, roughness:0.8 }));
  } else if (cls === 'pirate' || cls === 'buccaneer') {
    // Legs — wide stance, one boot
    svg.appendChild(rc.rectangle(cx-8, hy-14, 7, 14, opts(shadeColor(color,-40), {roughness:1.5})));
    svg.appendChild(rc.rectangle(cx+1, hy-14, 7, 14, opts(shadeColor(color,-40), {roughness:1.5})));
    // Right boot
    svg.appendChild(rc.ellipse(cx+4, hy+1, 10, 5, opts(shadeColor(color,-60), {roughness:1.2})));
    // Left boot (cuffed)
    svg.appendChild(rc.ellipse(cx-4, hy+1, 10, 5, opts(shadeColor(color,-60), {roughness:1.2})));
    svg.appendChild(rc.line(cx-9, hy-5, cx+1, hy-5, { stroke: shadeColor(color,-20), strokeWidth: 2, roughness: 1.5 }));
    // Long coat
    svg.appendChild(rc.polygon([
      [cx-9,hy-34],[cx+9,hy-34],[cx+11,hy-6],[cx+16,hy],[cx+12,hy+2],[cx+8,hy-4],
      [cx-8,hy-4],[cx-12,hy+2],[cx-16,hy],[cx-11,hy-6]
    ], opts(shadeColor(color,-30), { roughness: 2.0 })));
    // Shirt / vest beneath
    svg.appendChild(rc.rectangle(cx-5, hy-32, 10, 16, opts(shadeColor(color,20), {roughness:1.2})));
    // Head
    svg.appendChild(rc.ellipse(cx, hy-42, 13, 13, opts(color)));
    // Eye patch
    svg.appendChild(rc.ellipse(cx+3, hy-43, 6, 4, { stroke:'#111', fill:'#111', fillStyle:'solid', roughness:0.8 }));
    svg.appendChild(rc.line(cx, hy-43, cx+6, hy-43, { stroke:'#333', strokeWidth: 1, roughness: 1 }));
    // Stubble / beard
    svg.appendChild(rc.line(cx-4, hy-38, cx+4, hy-38, { stroke: shadeColor(color,-20), strokeWidth: 1.5, roughness: 2.5 }));
    svg.appendChild(rc.line(cx-3, hy-36, cx+3, hy-36, { stroke: shadeColor(color,-20), strokeWidth: 1, roughness: 2.5 }));
    // Tricorn hat — proper brim and crown
    svg.appendChild(rc.ellipse(cx, hy-49, 24, 5, opts('#1a1a1a', {roughness:1.5})));
    svg.appendChild(rc.polygon([
      [cx-8,hy-49],[cx+8,hy-49],[cx+7,hy-62],[cx-7,hy-62]
    ], opts('#1a1a1a', { roughness: 1.5 })));
    // Hat feather
    svg.appendChild(rc.path(`M ${cx+7} ${hy-62} Q ${cx+16} ${hy-70} ${cx+14} ${hy-76} Q ${cx+10} ${hy-68} ${cx+7} ${hy-62}`,
      { stroke: shadeColor(color,20), fill: shadeColor(color,10), fillStyle:'solid', roughness:2.5 }));
    // Left arm — hand on hip
    svg.appendChild(rc.line(cx-9, hy-32, cx-16, hy-20, { stroke: color, strokeWidth: 5, roughness: 1.5, strokeLinecap:'round' }));
    svg.appendChild(rc.line(cx-16, hy-20, cx-14, hy-12, { stroke: color, strokeWidth: 4, roughness: 1.5, strokeLinecap:'round' }));
    // Right arm raised with cutlass
    svg.appendChild(rc.line(cx+9, hy-32, cx+16, hy-22, { stroke: color, strokeWidth: 5, roughness: 1.5, strokeLinecap:'round' }));
    // Cutlass
    svg.appendChild(rc.line(cx+16, hy-22, cx+28, hy-44, { stroke: '#ddd', strokeWidth: 2.5, roughness: 0.8 }));
    svg.appendChild(rc.ellipse(cx+16, hy-22, 8, 4, { stroke:'#888', fill:'#666', fillStyle:'solid', roughness: 1 }));
    // Belt
    svg.appendChild(rc.line(cx-9, hy-16, cx+9, hy-16, { stroke: shadeColor(color,-50), strokeWidth: 2, roughness: 1.2 }));
    svg.appendChild(rc.rectangle(cx-2, hy-18, 4, 4, { stroke:'#888', fill:'#aaa', fillStyle:'solid', roughness:0.8 }));
  } else if (cls === 'slime') {
    // Slime — wobbly blob, cute face, jelly drips
    const slimeColor = color || '#4caf50';
    const innerColor = shadeColor(slimeColor, 30);
    svg.appendChild(rc.ellipse(cx, hy + 3, 38, 9, { stroke: 'none', fill: 'rgba(0,0,0,0.2)', fillStyle: 'solid', roughness: 1 }));
    svg.appendChild(rc.ellipse(cx, hy - 14, 42, 30, { stroke: slimeColor, strokeWidth: 2, fill: innerColor, fillStyle: 'solid', roughness: 3.5, bowing: 2.5 }));
    svg.appendChild(rc.ellipse(cx - 4, hy - 20, 14, 10, { stroke: 'none', fill: shadeColor(slimeColor, 60), fillStyle: 'solid', roughness: 1.5 }));
    svg.appendChild(rc.ellipse(cx - 15, hy - 2, 8, 12, { stroke: slimeColor, strokeWidth: 1.5, fill: innerColor, fillStyle: 'solid', roughness: 3 }));
    svg.appendChild(rc.ellipse(cx + 12, hy - 1, 7, 10, { stroke: slimeColor, strokeWidth: 1.5, fill: innerColor, fillStyle: 'solid', roughness: 3 }));
    svg.appendChild(rc.circle(cx - 7, hy - 17, 6, { stroke: 'none', fill: '#1a2a10', fillStyle: 'solid', roughness: 0.5 }));
    svg.appendChild(rc.circle(cx + 7, hy - 17, 6, { stroke: 'none', fill: '#1a2a10', fillStyle: 'solid', roughness: 0.5 }));
    svg.appendChild(rc.circle(cx - 5, hy - 19, 2, { stroke: 'none', fill: '#fff', fillStyle: 'solid', roughness: 0.3 }));
    svg.appendChild(rc.circle(cx + 9, hy - 19, 2, { stroke: 'none', fill: '#fff', fillStyle: 'solid', roughness: 0.3 }));
    const mouthPath = `M ${cx - 5} ${hy - 10} Q ${cx} ${hy - 5} ${cx + 5} ${hy - 10}`;
    svg.appendChild(rc.path(mouthPath, { stroke: '#1a2a10', strokeWidth: 1.5, fill: 'none', roughness: 1.2 }));
    svg.appendChild(rc.ellipse(cx + 5, hy - 30, 6, 8, { stroke: slimeColor, strokeWidth: 1.5, fill: innerColor, fillStyle: 'solid', roughness: 2.5 }));
  } else if (cls === 'golem') {
    // Stone golem — blocky, rune-etched
    svg.appendChild(rc.rectangle(cx - 11, hy - 36, 22, 26, opts(shadeColor(color, -30), { roughness: 0.7 })));
    svg.appendChild(rc.rectangle(cx - 8, hy - 52, 16, 18, opts(color, { roughness: 0.8 })));
    svg.appendChild(rc.rectangle(cx - 20, hy - 32, 9, 9, opts(shadeColor(color, -20), { roughness: 0.9 })));
    svg.appendChild(rc.rectangle(cx + 11, hy - 32, 9, 9, opts(shadeColor(color, -20), { roughness: 0.9 })));
    svg.appendChild(rc.circle(cx - 4, hy - 46, 4, { stroke: 'none', fill: '#00eeff', fillStyle: 'solid', roughness: 0.4 }));
    svg.appendChild(rc.circle(cx + 4, hy - 46, 4, { stroke: 'none', fill: '#00eeff', fillStyle: 'solid', roughness: 0.4 }));
    svg.appendChild(rc.line(cx - 6, hy - 28, cx + 6, hy - 28, { stroke: '#00eeff', strokeWidth: 1, roughness: 0.8 }));
    svg.appendChild(rc.line(cx, hy - 32, cx, hy - 22, { stroke: '#00eeff', strokeWidth: 1, roughness: 0.8 }));
    svg.appendChild(rc.rectangle(cx - 9, hy - 10, 8, 12, opts(shadeColor(color, -40), { roughness: 0.7 })));
    svg.appendChild(rc.rectangle(cx + 1, hy - 10, 8, 12, opts(shadeColor(color, -40), { roughness: 0.7 })));
  } else if (cls === 'mermaid') {
    // Mermaid — human upper body, fish tail lower half
    const tailColor = shadeColor(color, -20);
    const scaleColor = shadeColor(color, 10);
    // Fish tail (replaces legs) — wide sweeping fin
    svg.appendChild(rc.polygon([
      [cx-10,hy-8],[cx+10,hy-8],[cx+8,hy+8],[cx+16,hy+14],[cx+6,hy+12],
      [cx,hy+18],[cx-6,hy+12],[cx-16,hy+14],[cx-8,hy+8]
    ], opts(tailColor, { roughness: 2.5, bowing: 1.5 })));
    // Tail scales (pattern lines)
    svg.appendChild(rc.line(cx-8, hy-2, cx+8, hy-2, { stroke: scaleColor, strokeWidth: 1, roughness: 1.5 }));
    svg.appendChild(rc.line(cx-7, hy+4, cx+7, hy+4, { stroke: scaleColor, strokeWidth: 1, roughness: 1.5 }));
    // Upper body
    svg.appendChild(rc.polygon([
      [cx-8,hy-30],[cx+8,hy-30],[cx+9,hy-8],[cx-9,hy-8]
    ], opts(color, { roughness: 1.5 })));
    // Shell or wrap accent across chest
    svg.appendChild(rc.line(cx-8, hy-22, cx+8, hy-22, { stroke: shadeColor(color,-30), strokeWidth: 2, roughness: 2 }));
    // Head
    svg.appendChild(rc.ellipse(cx, hy-40, 13, 13, opts(color)));
    // Long flowing hair
    svg.appendChild(rc.path(`M ${cx-6} ${hy-46} Q ${cx-18} ${hy-38} ${cx-16} ${hy-20}`,
      { stroke: shadeColor(color,-10), strokeWidth: 4, fill:'none', roughness: 2.5 }));
    svg.appendChild(rc.path(`M ${cx+4} ${hy-46} Q ${cx+16} ${hy-36} ${cx+15} ${hy-22}`,
      { stroke: shadeColor(color,-10), strokeWidth: 3, fill:'none', roughness: 2.5 }));
    // Arms — one raised, one at side
    svg.appendChild(rc.line(cx-8, hy-28, cx-18, hy-18, { stroke: color, strokeWidth: 5, roughness: 1.5, strokeLinecap:'round' }));
    svg.appendChild(rc.line(cx+8, hy-28, cx+16, hy-20, { stroke: color, strokeWidth: 5, roughness: 1.5, strokeLinecap:'round' }));
    // Trident in right hand
    svg.appendChild(rc.line(cx+16, hy-20, cx+20, hy-48, { stroke: '#7aaccc', strokeWidth: 2, roughness: 1.2 }));
    svg.appendChild(rc.line(cx+18, hy-46, cx+18, hy-50, { stroke: '#7aaccc', strokeWidth: 1.5, roughness: 0.8 }));
    svg.appendChild(rc.line(cx+20, hy-46, cx+20, hy-50, { stroke: '#7aaccc', strokeWidth: 1.5, roughness: 0.8 }));
    svg.appendChild(rc.line(cx+22, hy-46, cx+22, hy-50, { stroke: '#7aaccc', strokeWidth: 1.5, roughness: 0.8 }));
    // Shimmer gloss on tail
    svg.appendChild(rc.ellipse(cx-2, hy, 6, 10, { stroke:'none', fill: 'rgba(255,255,255,0.18)', fillStyle:'solid', roughness: 1.5 }));
  } else if (cls === 'druid') {
    // Druid — earthy robe, antler staff, leaf crown
    // Robe — wide and flowing, earth tones
    svg.appendChild(rc.polygon([
      [cx-9,hy-32],[cx+9,hy-32],[cx+14,hy],[cx-14,hy]
    ], opts(shadeColor(color,-20), { roughness: 2.5, bowing: 1.5 })));
    // Inner robe detail line
    svg.appendChild(rc.line(cx, hy-32, cx, hy-6, { stroke: shadeColor(color,20), strokeWidth: 1.5, roughness: 2 }));
    // Head
    svg.appendChild(rc.ellipse(cx, hy-42, 13, 13, opts(color)));
    // Leaf/twig crown
    svg.appendChild(rc.path(`M ${cx-8} ${hy-48} Q ${cx-12} ${hy-56} ${cx-6} ${hy-54}`,
      { stroke: '#4a8a20', strokeWidth: 2, fill: 'none', roughness: 2.5 }));
    svg.appendChild(rc.path(`M ${cx} ${hy-48} Q ${cx} ${hy-58} ${cx+2} ${hy-55}`,
      { stroke: '#4a8a20', strokeWidth: 2, fill: 'none', roughness: 2.5 }));
    svg.appendChild(rc.path(`M ${cx+8} ${hy-48} Q ${cx+12} ${hy-56} ${cx+6} ${hy-54}`,
      { stroke: '#4a8a20', strokeWidth: 2, fill: 'none', roughness: 2.5 }));
    // Arms — wide, open gesture (nature communion)
    svg.appendChild(rc.line(cx-9, hy-30, cx-18, hy-18, { stroke: shadeColor(color,-20), strokeWidth: 5, roughness: 1.8, strokeLinecap:'round' }));
    svg.appendChild(rc.line(cx+9, hy-30, cx+16, hy-22, { stroke: shadeColor(color,-20), strokeWidth: 5, roughness: 1.8, strokeLinecap:'round' }));
    // Gnarled wooden staff (antler-topped)
    svg.appendChild(rc.line(cx-18, hy-18, cx-20, hy-52, { stroke: '#6B3A1F', strokeWidth: 3, roughness: 2.5 }));
    svg.appendChild(rc.path(`M ${cx-20} ${hy-52} Q ${cx-28} ${hy-60} ${cx-24} ${hy-62}`,
      { stroke: '#6B3A1F', strokeWidth: 2, fill: 'none', roughness: 3 }));
    svg.appendChild(rc.path(`M ${cx-20} ${hy-52} Q ${cx-14} ${hy-60} ${cx-16} ${hy-64}`,
      { stroke: '#6B3A1F', strokeWidth: 2, fill: 'none', roughness: 3 }));
    // Floating leaf orb at staff tip
    svg.appendChild(rc.circle(cx-20, hy-56, 6, { stroke: '#4a8a20', fill: 'rgba(100,200,50,0.5)', fillStyle:'solid', roughness: 2 }));
    // Belt pouch with herbs
    svg.appendChild(rc.ellipse(cx+4, hy-10, 8, 6, opts(shadeColor(color,-40), {roughness:1.5})));
  } else if (cls === 'skeleton_pc') {
    // Skeleton player character — bony, dressed, wielding a weapon
    // Legs — bone thin
    svg.appendChild(rc.line(cx-4, hy-8, cx-5, hy+10, { stroke: '#e8dcc8', strokeWidth: 3, roughness: 2 }));
    svg.appendChild(rc.line(cx+4, hy-8, cx+5, hy+10, { stroke: '#e8dcc8', strokeWidth: 3, roughness: 2 }));
    // Rib cage body
    svg.appendChild(rc.rectangle(cx-7, hy-30, 14, 22, { stroke: '#e8dcc8', fill: 'none', roughness: 2.2 }));
    // Ribs (3 pairs)
    for (let i = 0; i < 3; i++) {
      const ry = hy-26 + i*6;
      svg.appendChild(rc.line(cx-6, ry, cx-1, ry+2, { stroke: '#e8dcc8', strokeWidth: 1.5, roughness: 1.5 }));
      svg.appendChild(rc.line(cx+6, ry, cx+1, ry+2, { stroke: '#e8dcc8', strokeWidth: 1.5, roughness: 1.5 }));
    }
    // Skull
    svg.appendChild(rc.ellipse(cx, hy-40, 14, 14, { stroke: '#e8dcc8', fill: '#d4c8a8', fillStyle:'solid', roughness: 2 }));
    // Eye sockets — glowing with player color
    svg.appendChild(rc.circle(cx-4, hy-42, 4, { stroke: 'none', fill: color, fillStyle:'solid', roughness: 0.5 }));
    svg.appendChild(rc.circle(cx+4, hy-42, 4, { stroke: 'none', fill: color, fillStyle:'solid', roughness: 0.5 }));
    // Nasal cavity
    svg.appendChild(rc.polygon([[cx-1,hy-37],[cx+1,hy-37],[cx,hy-35]], { stroke:'#999', fill:'#888', fillStyle:'solid', roughness:0.8 }));
    // Grinning jaw teeth
    svg.appendChild(rc.line(cx-4, hy-34, cx+4, hy-34, { stroke: '#e8dcc8', strokeWidth: 1, roughness: 1.5 }));
    // Bone arms
    svg.appendChild(rc.line(cx-7, hy-28, cx-16, hy-18, { stroke: '#e8dcc8', strokeWidth: 3, roughness: 2 }));
    svg.appendChild(rc.line(cx+7, hy-28, cx+18, hy-16, { stroke: '#e8dcc8', strokeWidth: 3, roughness: 2 }));
    // Weapon — bone club or sword
    svg.appendChild(rc.line(cx+18, hy-16, cx+24, hy-40, { stroke: color, strokeWidth: 2, roughness: 1.5 }));
    // Tattered cloak (player color) — suggests personality
    svg.appendChild(rc.polygon([
      [cx-7,hy-28],[cx+7,hy-28],[cx+10,hy-4],[cx+6,hy],[cx,hy-6],[cx-6,hy],[cx-10,hy-4]
    ], { stroke: color, fill: `${color}55`, fillStyle:'solid', roughness: 2.5 }));
  } else if (cls === 'ghost_pc') {
    // Ghost player character — translucent, floating, retains personality
    const ghostBody = `M ${cx-12} ${hy} Q ${cx-16} ${hy-18} ${cx-10} ${hy-28} Q ${cx-12} ${hy-44} ${cx} ${hy-46} Q ${cx+12} ${hy-44} ${cx+10} ${hy-28} Q ${cx+16} ${hy-18} ${cx+12} ${hy} Q ${cx+8} ${hy+6} ${cx+4} ${hy+2} Q ${cx} ${hy+8} ${cx-4} ${hy+2} Q ${cx-8} ${hy+6} ${cx-12} ${hy}`;
    // Ghost body in player color (translucent)
    svg.appendChild(rc.path(ghostBody, { stroke: color, fill: `${color}55`, fillStyle:'solid', roughness: 3.0, strokeWidth: 2 }));
    // Inner glow
    svg.appendChild(rc.ellipse(cx, hy-28, 14, 20, { stroke:'none', fill: `${color}33`, fillStyle:'solid', roughness: 1.5 }));
    // Eyes — player color glowing
    svg.appendChild(rc.circle(cx-5, hy-36, 5, { stroke: 'none', fill: color, fillStyle:'solid', roughness: 0.5 }));
    svg.appendChild(rc.circle(cx+5, hy-36, 5, { stroke: 'none', fill: color, fillStyle:'solid', roughness: 0.5 }));
    svg.appendChild(rc.circle(cx-5, hy-36, 2, { stroke: 'none', fill: '#fff', fillStyle:'solid', roughness: 0.3 }));
    svg.appendChild(rc.circle(cx+5, hy-36, 2, { stroke: 'none', fill: '#fff', fillStyle:'solid', roughness: 0.3 }));
    // Wispy arms
    svg.appendChild(rc.path(`M ${cx-10} ${hy-24} Q ${cx-22} ${hy-20} ${cx-24} ${hy-12}`,
      { stroke: color, strokeWidth: 4, fill: 'none', roughness: 2.5 }));
    svg.appendChild(rc.path(`M ${cx+10} ${hy-24} Q ${cx+22} ${hy-18} ${cx+22} ${hy-10}`,
      { stroke: color, strokeWidth: 4, fill: 'none', roughness: 2.5 }));
    // Floating (no ground shadow overriding — ghost floats above)
    svg.appendChild(rc.ellipse(cx, hy+4, 20, 4, { stroke:'none', fill:'rgba(0,0,0,0.1)', fillStyle:'solid', roughness:1 }));
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
// ── Animated group wrapper ──────────────────
function animG(cls, children) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  if (cls) g.setAttribute('class', cls);
  if (Array.isArray(children)) children.forEach(c => c && g.appendChild(c));
  return g;
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


// ── Resolve character class to visual type ───────────────────────────────
// Maps archetype display names (Netrunner, Samurai, Gunslinger) and DnD
// class ids to the closest visual representation in drawCharacter.
function resolveCharacterClass(classId, className, role) {
  const nameMap = {
    // Space / Sci-fi
    'alien': 'spaceranger', 'extraterrestrial': 'spaceranger',
    // Cyberpunk
    'netrunner': 'netrunner', 'hacker': 'netrunner', 'cyber': 'netrunner',
    'street samurai': 'warrior', 'cyber soldier': 'warrior',
    'fixer': 'rogue', 'corpo agent': 'rogue',
    'tech': 'mage', 'techie': 'mage',
    'medtech': 'healer', 'ripper doc': 'healer',
    'face': 'bard',
    // Western
    'gunslinger': 'gunslinger', 'sheriff': 'gunslinger', 'cowboy': 'gunslinger',
    'outlaw': 'rogue', 'desperado': 'rogue',
    'bounty hunter': 'ranger', 'trapper': 'ranger',
    'frontier doctor': 'healer', 'snake oil': 'healer',
    // Ninja / Samurai
    'samurai': 'samurai', 'ronin': 'samurai', 'shogun': 'samurai',
    'ninja': 'rogue', 'shinobi': 'rogue', 'kunoichi': 'rogue',
    'onmyoji': 'mage', 'yamabushi': 'healer',
    // Performers / Social
    'bard': 'bard', 'jester': 'bard', 'charlatan': 'bard',
    'con artist': 'bard', 'gambler': 'bard', 'merchant': 'bard',
    'trader': 'bard', 'kabuki actor': 'bard', 'cult leader': 'bard',
    // Post-Apocalyptic
    'raider': 'warrior', 'scavenger': 'rogue',
    'wasteland doc': 'healer', 'mechanic': 'mage',
    'mutant': 'warrior',
    // Mythology
    'demigod': 'warrior', 'hero': 'warrior', 'titan': 'warrior',
    'oracle': 'mage', 'seer': 'mage',
    'champion': 'warrior', 'trickster god': 'rogue',
    // Creature / monster player types
    'slime': 'slime', 'ooze': 'slime', 'blob': 'slime', 'gelatinous': 'slime',
    'golem': 'golem', 'construct': 'golem', 'automaton': 'golem',
    'skeleton': 'skeleton_pc', 'undead': 'skeleton_pc', 'bones': 'skeleton_pc',
    'ghost': 'ghost_pc', 'spirit': 'ghost_pc', 'wraith_pc': 'ghost_pc',
    'shapeshifter': 'slime',
    // Fairy tale
    'faerie': 'bard', 'creature': 'rogue', 'enchanter': 'bard',
    'knight errant': 'warrior', 'prince': 'warrior', 'princess': 'healer',
    'witch': 'mage', 'fairy godmother': 'mage',
    'rogue prince': 'rogue', 'shapeshifter': 'rogue',
    // Historical
    'gladiator': 'warrior', 'legionary': 'warrior', 'centurion': 'warrior',
    'viking': 'warrior', 'berserker': 'warrior',
    'court mage': 'mage', 'alchemist': 'mage',
    // Ocean
    'pirate': 'pirate', 'buccaneer': 'pirate', 'corsair': 'pirate',
    'sea captain': 'pirate', 'privateer': 'pirate',
    'navigator': 'ranger', 'harpooner': 'ranger',
    // Space
    'space ranger': 'spaceranger', 'pilot': 'spaceranger',
    'android': 'spaceranger', 'cyborg': 'spaceranger',
    'xenobiologist': 'mage', 'engineer': 'spaceranger', 'drone operator': 'spaceranger',
    // Ocean — unique visuals
    'mermaid': 'mermaid', 'merfolk': 'mermaid', 'siren': 'mermaid',
    // Nature / Druid
    'druid': 'druid', 'shaman': 'druid', 'nature priest': 'druid', 'herbalist': 'druid',
    // Creature PCs — remap to real branches
    'skeleton': 'skeleton_pc', 'undead': 'skeleton_pc', 'lich pc': 'skeleton_pc',
    'ghost pc': 'ghost_pc', 'spirit': 'ghost_pc', 'phantom': 'ghost_pc',
    // Horror investigator
    'investigator': 'rogue', 'detective': 'rogue', 'monster hunter': 'warrior',
    'occultist': 'mage', 'empath': 'healer',
  };

  // Check display name first (className like "Netrunner")
  if (className) {
    const key = className.toLowerCase();
    if (nameMap[key]) return nameMap[key];
    // Partial match
    for (const [k, v] of Object.entries(nameMap)) {
      if (key.includes(k) || k.includes(key)) return v;
    }
  }
  // Check role for creature keywords (e.g. role = "Sentient slime who gained consciousness")
  if (role) {
    const roleKey = role.toLowerCase();
    for (const [k, v] of Object.entries(nameMap)) {
      if (roleKey.includes(k)) return v;
    }
  }
  // Check classId itself against nameMap (catches 'slime', 'golem' etc set as class id)
  if (classId && nameMap[classId.toLowerCase()]) return nameMap[classId.toLowerCase()];
  // Fall back to DnD class id
  return classId || 'warrior';
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
      // Resolve archetype name to visual class
      // p.class is the DnD class id (mage/warrior/rogue etc)
      // but we want genre-flavored visuals
      const pClass = resolveCharacterClass(p.class, p.className, p.role);
      drawCharacter(rc, svgEl2, cx, groundY, pClass,
        p.color || PLAYER_COLORS[i % PLAYER_COLORS.length],
        p.name || '', sr);
    });
  }

  // ── Creature population (NPCs + enemies via creatures.js) ──
  // Build terrain points array for Y positioning
  const terrainPts = [];
  for (let i = 0; i <= 20; i++) {
    const tx = (i / 20) * W;
    let ty;
    if (type === 'mountain')     ty = H*0.55 + Math.sin(i*0.9)*30 + tr()*10;
    else if (type === 'ocean')   ty = H*0.62 + Math.sin(i*0.5)*8 + tr()*5;
    else if (type === 'desert')  ty = H*0.63 + Math.sin(i*0.4)*12 + tr()*8;
    else if (type === 'dungeon' || type === 'cave' || type === 'crypt') ty = H*0.75 + tr()*3;
    else if (type === 'castle' || type === 'ruins') ty = H*0.66 + Math.sin(i*0.3)*6 + tr()*5;
    else if (type === 'tower' || type === 'temple' || type === 'shrine') ty = H*0.70 + tr()*3;
    else if (type === 'interior' || type === 'tavern' || type === 'jail' || type === 'dojo' || type === 'bunker') ty = H*0.78 + tr()*2;
    else if (type === 'saloon' || type === 'mine' || type === 'asylum') ty = H*0.76 + tr()*3;
    else if (type === 'manor' || type === 'fortress_jp') ty = H*0.68 + Math.sin(i*0.2)*4 + tr()*4;
    else if (type === 'arena' || type === 'colosseum') ty = H*0.72 + Math.sin(i*0.3)*5 + tr()*4;
    else if (type === 'jungle' || type === 'bamboo_forest') ty = H*0.64 + Math.sin(i*0.8)*10 + tr()*8;
    else if (type === 'wasteland' || type === 'ruined_city') ty = H*0.65 + Math.sin(i*0.5)*8 + tr()*10;
    else if (type === 'market' || type === 'ship') ty = H*0.67 + Math.sin(i*0.4)*6 + tr()*5;
    else if (type === 'graveyard') ty = H*0.67 + Math.sin(i*0.3)*8 + tr()*5;
    else if (type === 'prairie' || type === 'canyon') ty = H*0.63 + Math.sin(i*0.4)*14 + tr()*8;
    else if (type === 'frontier_town') ty = H*0.66 + Math.sin(i*0.3)*6 + tr()*5;
    else if (type === 'spaceship' || type === 'space_station' || type === 'corp_building') ty = H*0.80 + tr()*2;
    else if (type === 'alien_planet') ty = H*0.62 + Math.sin(i*0.7)*15 + tr()*12;
    else if (type === 'neon_city' || type === 'back_alley') ty = H*0.70 + tr()*4;
    else if (type === 'olympus') ty = H*0.58 + Math.sin(i*0.4)*18 + tr()*8;
    else if (type === 'underworld') ty = H*0.68 + Math.sin(i*0.5)*10 + tr()*6;
    else                         ty = H*0.65 + Math.sin(i*0.6)*12 + Math.sin(i*1.3)*6 + tr()*8;
    terrainPts.push({ x: tx, y: ty });
  }

  const allNpcs = mergedScene?.npcs || [];
  const combatants = inCombat && enemyName
    ? [{ name: enemyName, relationship: 'enemy', creatureType: enemyName.toLowerCase().replace(/\s+/g,'_'), hp: 1, maxHp: 1 }]
    : [];

  const population = buildScenePopulation(
    allNpcs, inCombat, combatants, type, turnCount, terrainPts
  );

  const popResult = renderPopulation(population);
  const particles  = renderParticles(population, turnCount);
  const auras      = renderStatusAuras(population, `sc${turnCount}${type}`);
  const npcLabels  = renderNpcLabels(population);

  // Inject creature defs into SVG defs
  if (popResult.defs) {
    const extraDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    extraDefs.innerHTML = popResult.defs;
    svgEl2.appendChild(extraDefs);
  }

  // Inject status auras (under feet — before far layer)
  if (auras) {
    const auraG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    auraG.innerHTML = auras;
    svgEl2.appendChild(auraG);
  }

  // Far depth plane creatures (deep background — behind terrain midground)
  if (popResult.far) {
    const farG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    farG.innerHTML = popResult.far;
    svgEl2.appendChild(farG);
  }

  // Mid depth plane creatures (midground — same level as players)
  if (popResult.mid) {
    const midG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    midG.innerHTML = popResult.mid;
    svgEl2.appendChild(midG);
  }

  // ── Foreground grass/rocks (drawn before near-plane so NPCs stand in front) ──
  drawForeground(rc, svgEl2, type, pal, tr, W, H);

  // Near depth plane creatures (foreground — closest to viewer, on top of everything)
  if (popResult.near) {
    const nearG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nearG.innerHTML = popResult.near;
    svgEl2.appendChild(nearG);
  }

  // Particles (on top of all creatures)
  if (particles) {
    const partG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    partG.innerHTML = particles;
    svgEl2.appendChild(partG);
  }

  // NPC name labels on top
  if (npcLabels) {
    const labG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    labG.innerHTML = npcLabels;
    svgEl2.appendChild(labG);
  }

  // VS indicator in combat
  if (inCombat && enemyName && allNpcs.length === 0) {
    const vs = svgEl('text', {
      x: W * 0.58, y: groundY - 28,
      'text-anchor':'middle', fill:'#FFD700',
      'font-family':'serif', 'font-size':'14',
      'font-weight':'bold', 'letter-spacing':'4',
      opacity:'0.75',
    });
    vs.textContent = 'VS';
    svgEl2.appendChild(vs);
  }

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
    // Torches with flicker animation
    [W*0.2, W*0.5, W*0.8].forEach(tx => {
      svg.appendChild(rc.rectangle(tx-3, H*0.45, 6, 16, { stroke:'#5C3A1E', fill:'#6B4423', fillStyle:'solid', roughness:1 }));
      svg.appendChild(animG('flicker', [
        rc.ellipse(tx, H*0.43, 12, 16, { stroke:pal.torch, fill:pal.torch, fillStyle:'solid', roughness:2.5 }),
        rc.ellipse(tx, H*0.42, 7, 10, { stroke:'#ffe080', fill:'#ffe080', fillStyle:'solid', roughness:2 }),
      ]));
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
      nebulaEl.setAttribute('class', 'driftCloud');
      nebulaEl.style.animationDuration = `${40+sr()*30}s`;
      nebulaEl.style.animationDelay = `${sr()*-20}s`;
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
    // Waves (animated)
    for (let i = 0; i < 8; i++) {
      const wy = H*0.52 + sr()*30, wx = sr()*W;
      const wl = 30 + sr()*60;
      const wavePath = `M ${wx} ${wy} Q ${wx+wl/2} ${wy-8} ${wx+wl} ${wy}`;
      const waveEl = rc.path(wavePath, { stroke: pal.wave || '#42A5F5', fill:'none', strokeWidth:2, roughness:2.0 });
      waveEl.setAttribute('class', 'waveAnim');
      waveEl.style.animationDelay = `${sr()*2}s`;
      svg.appendChild(waveEl);
    }
  }

  if (type === 'village' || type === 'tavern') {
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
      // Window (candle flicker)
      if (lit) {
        const winEl = rc.rectangle(hx-6, hy2-20, 10, 8, {
          stroke:'#aaa', fill:'rgba(255,200,80,0.85)', fillStyle:'solid', roughness:0.8
        });
        winEl.setAttribute('class', 'flicker2');
        winEl.style.animationDelay = `${sr()*1.5}s`;
        svg.appendChild(winEl);
      }
      // Chimney with smoke
      svg.appendChild(rc.rectangle(hx+10, hy2-52, 7, 18, {
        stroke:'#5C3A1E', fill: pal.chimney||'#6D4C41', fillStyle:'solid', roughness:1.5
      }));
      const smokeEl = svgEl('ellipse', { cx:String(hx+14), cy:String(hy2-58), rx:'5', ry:'7', fill:'rgba(100,80,60,0.35)' });
      smokeEl.setAttribute('class', 'smokeRise');
      smokeEl.style.animationDelay = `${sr()*2}s`;
      svg.appendChild(smokeEl);
    }
  }

  if (type === 'city') {
    // Daytime city — stone buildings with varied heights, market stalls
    if (time === 'day' || !time) {
      // Bright sun
      svg.appendChild(rc.circle(W*0.8, H*0.13, 32, {
        stroke: pal.sun || '#FFE066', fill: pal.sun || '#FFE066',
        fillStyle: 'solid', roughness: 0.8
      }));
    } else {
      // Night city — moon + neon glow on horizon
      svg.appendChild(rc.circle(W*0.82, H*0.14, 24, {
        stroke: '#f5e68a', fill: '#fdf5b0', fillStyle: 'solid', roughness: 0.7
      }));
      // Neon horizon glow
      const neonColors = pal.neon || ['#FF6B35'];
      for (let i = 0; i < 3; i++) {
        const glowEl = svgEl('ellipse', {
          cx: String(W * (0.25 + i * 0.25)), cy: String(H * 0.62),
          rx: String(60 + sr() * 40), ry: '15',
          fill: neonColors[i % neonColors.length],
          opacity: '0.15',
        });
        svg.appendChild(glowEl);
      }
    }

    // Background skyline — large distant buildings
    for (let i = 0; i < 16; i++) {
      const bx = i * (W / 14) + sr() * 15 - 7;
      const bh = 35 + sr() * 90;
      const bw = 22 + sr() * 28;
      const stoneColor = pal.stone
        ? pal.stone[Math.floor(sr() * pal.stone.length)]
        : '#8C7B6A';
      svg.appendChild(rc.rectangle(bx - bw/2, H * 0.65 - bh, bw, bh, {
        stroke: shadeColor(stoneColor, -25),
        fill: stoneColor,
        fillStyle: 'hachure', roughness: 1.8, strokeWidth: 1.2
      }));
      // Windows grid
      const floors = Math.floor(bh / 14);
      const cols = Math.floor(bw / 10);
      for (let row = 0; row < floors - 1; row++) {
        for (let col = 0; col < cols; col++) {
          const lit = time === 'night' ? sr() > 0.35 : sr() > 0.7;
          if (lit) {
            svg.appendChild(rc.rectangle(
              bx - bw/2 + 3 + col * 10,
              H * 0.65 - bh + 5 + row * 14,
              6, 7,
              { stroke: 'none', fill: pal.window || '#FFEE55',
                fillStyle: 'solid', roughness: 0.4 }
            ));
          }
        }
      }
      // Roof detail — flat or pointed
      if (sr() > 0.5) {
        svg.appendChild(rc.rectangle(bx - bw/2 - 2, H * 0.65 - bh - 5, bw + 4, 6, {
          stroke: shadeColor(stoneColor, -40),
          fill: pal.roof || '#8B5E3C',
          fillStyle: 'solid', roughness: 1.5
        }));
      }
    }

    // Market stalls / street level detail (foreground)
    for (let i = 0; i < 4; i++) {
      const mx = 60 + i * (W / 4.5) + sr() * 20 - 10;
      const my = H * 0.65 - sr() * 5;
      // Awning
      svg.appendChild(rc.polygon([
        [mx - 18, my - 22], [mx + 18, my - 22],
        [mx + 22, my - 14], [mx - 22, my - 14]
      ], {
        stroke: shadeColor(pal.roof || '#8B5E3C', -10),
        fill: [pal.roof, '#7A3A3A', '#3A5A7A', '#5A7A3A'][i % 4],
        fillStyle: 'solid', roughness: 2.0
      }));
      // Stall body
      svg.appendChild(rc.rectangle(mx - 16, my - 14, 32, 16, {
        stroke: shadeColor(pal.ground, -20),
        fill: shadeColor(pal.ground, 10),
        fillStyle: 'solid', roughness: 1.5
      }));
    }
  }

  // ── Wasteland (Post-Apocalyptic) ──────────────────────────────────────
  if (type === 'wasteland') {
    // Harsh orange sun through dust
    svg.appendChild(rc.circle(W*0.75, H*0.13, 30, {
      stroke:pal.sun||'#FF9A3C', fill:pal.sun||'#FF9A3C', fillStyle:'solid', roughness:0.9
    }));
    // Dust haze
    for (let i = 0; i < 4; i++) {
      svg.appendChild(svgEl('ellipse', {
        cx: String(sr()*W), cy: String(H*0.52), rx: String(80+sr()*100), ry: '12',
        fill: 'rgba(180,120,50,0.07)'
      }));
    }
    // Ruined buildings silhouettes
    for (let i = 0; i < 5; i++) {
      const bx = sr()*W; const bh = 20+sr()*55; const bw = 18+sr()*30;
      const rust = pal.rust || '#884418';
      // Main ruin
      svg.appendChild(rc.rectangle(bx-bw/2, H*0.62-bh, bw, bh, {
        stroke:shadeColor(rust,-20), fill:rust, fillStyle:'hachure', roughness:3.0, strokeWidth:1.5
      }));
      // Broken top
      svg.appendChild(rc.polygon([[bx-bw/2,H*0.62-bh],[bx-bw/3,H*0.62-bh-8],[bx,H*0.62-bh-4],[bx+bw/3,H*0.62-bh-12],[bx+bw/2,H*0.62-bh]], {
        stroke:shadeColor(rust,-30), fill:shadeColor(rust,-10), fillStyle:'solid', roughness:3.5
      }));
      // Broken windows
      if (sr() > 0.4) svg.appendChild(rc.rectangle(bx-4, H*0.62-bh+8, 8, 6, {
        stroke:'#1a1008', fill:'#0a0804', fillStyle:'solid', roughness:2
      }));
    }
    // Radioactive barrel / wreckage hint
    const ex = W*0.3 + sr()*W*0.4;
    svg.appendChild(rc.rectangle(ex-5, H*0.65-16, 10, 16, {
      stroke:'#604020', fill:'#804428', fillStyle:'solid', roughness:2
    }));
    svg.appendChild(svgEl('text', Object.assign(document.createElementNS('http://www.w3.org/2000/svg','text'), {})));
    const hazardEl = svgEl('text', {'x':String(ex-2),'y':String(H*0.65-20),'fill':'#88ff44','font-size':'8','font-family':'monospace','opacity':'0.6'});
    hazardEl.textContent = '☢';
    svg.appendChild(hazardEl);
  }

  // ── Shrine / Temple (Ninja/Mythology) ──────────────────────────────────
  if (type === 'shrine' || type === 'temple') {
    // Moon always (sacred night setting)
    svg.appendChild(rc.circle(W*0.68, H*0.14, 24, {
      stroke:'#f5e68a', fill:'#fdf5b0', fillStyle:'solid', roughness:0.7
    }));
    // Stars
    for (let i = 0; i < 30; i++) {
      const stx=sr()*W, sty=sr()*H*0.45;
      const starEl = svgEl('circle', {cx:stx, cy:sty, r:String(sr()*1.5+0.3), fill:'#FFFDE7', opacity:String(0.3+sr()*0.5)});
      svg.appendChild(starEl);
    }
    // Torii gate or temple columns
    const torii = type === 'shrine';
    if (torii) {
      // Torii gate pillars
      const gc = pal.gold || '#C8A020';
      svg.appendChild(rc.rectangle(W*0.35-4, H*0.35, 8, H*0.3, {stroke:shadeColor(gc,-20), fill:gc, fillStyle:'solid', roughness:1.5}));
      svg.appendChild(rc.rectangle(W*0.65-4, H*0.35, 8, H*0.3, {stroke:shadeColor(gc,-20), fill:gc, fillStyle:'solid', roughness:1.5}));
      // Crossbeam
      svg.appendChild(rc.rectangle(W*0.3, H*0.35, W*0.4, 10, {stroke:shadeColor(gc,-30), fill:gc, fillStyle:'solid', roughness:1.5}));
      svg.appendChild(rc.rectangle(W*0.32, H*0.28, W*0.36, 7, {stroke:shadeColor(gc,-30), fill:gc, fillStyle:'solid', roughness:1.5}));
      // Hanging lanterns
      [0.38, 0.62].forEach(lx => {
        svg.appendChild(rc.ellipse(lx*W, H*0.42, 12, 16, {stroke:'#a06020', fill:pal.lantern||'#FF8040', fillStyle:'solid', roughness:1.5}));
        svg.appendChild(rc.ellipse(lx*W, H*0.42, 6, 8, {stroke:'none', fill:'#ffcc80', fillStyle:'solid', roughness:0.8, opacity:0.7}));
      });
    } else {
      // Temple columns — Greek/Egyptian
      const col = pal.stone ? pal.stone[0] : '#6A5030';
      [0.2, 0.38, 0.56, 0.74].forEach(cx => {
        svg.appendChild(rc.rectangle(cx*W-7, H*0.28, 14, H*0.37, {stroke:shadeColor(col,-20), fill:col, fillStyle:'hachure', roughness:1.8}));
        svg.appendChild(rc.rectangle(cx*W-10, H*0.28, 20, 8, {stroke:shadeColor(col,-30), fill:shadeColor(col,-10), fillStyle:'solid', roughness:1.5}));
      });
      // Entablature (top beam)
      svg.appendChild(rc.rectangle(W*0.14, H*0.24, W*0.7, 16, {stroke:shadeColor(col,-20), fill:col, fillStyle:'hachure', roughness:1.6}));
      // Pediment
      svg.appendChild(rc.polygon([[W*0.14,H*0.24],[W*0.84,H*0.24],[W*0.49,H*0.08]], {stroke:shadeColor(col,-20), fill:col, fillStyle:'hachure', roughness:2.0}));
    }
    // Mist at ground
    for (let i = 0; i < 4; i++) {
      svg.appendChild(svgEl('ellipse', {
        cx: String(sr()*W), cy: String(H*0.66),
        rx: String(70+sr()*90), ry: '10',
        fill: 'rgba(200,220,200,0.08)'
      }));
    }
  }

  // ── Saloon / Tavern Interior (Western) ─────────────────────────────────
  if (type === 'saloon' || type === 'tavern') {
    // Warm interior light from windows
    svg.appendChild(rc.circle(W*0.8, H*0.12, 28, {
      stroke:pal.sun||'#FFB84C', fill:pal.sun||'#FFB84C', fillStyle:'solid', roughness:0.8
    }));
    // Background building facades
    for (let i = 0; i < 4; i++) {
      const bx = 60 + i*(W/4) + sr()*15-8;
      const bh = 40 + sr()*30;
      const wood = pal.wood ? pal.wood[i%pal.wood.length] : '#6B4218';
      svg.appendChild(rc.rectangle(bx-20, H*0.55-bh, 40, bh, {
        stroke:shadeColor(wood,-20), fill:wood, fillStyle:'hachure', roughness:2.0, strokeWidth:1.5
      }));
      // False front (Western style raised facade)
      svg.appendChild(rc.rectangle(bx-22, H*0.55-bh-12, 44, 14, {
        stroke:shadeColor(wood,-30), fill:shadeColor(wood,-10), fillStyle:'solid', roughness:1.8
      }));
      // Sign board
      if (sr() > 0.3) {
        svg.appendChild(rc.rectangle(bx-12, H*0.55-bh-8, 24, 8, {
          stroke:'#4a2808', fill:'#8B5A2B', fillStyle:'solid', roughness:1.5
        }));
      }
      // Lit window
      if (sr() > 0.4) {
        svg.appendChild(rc.rectangle(bx-6, H*0.55-bh+8, 12, 10, {
          stroke:'#a07030', fill:'rgba(255,180,80,0.8)', fillStyle:'solid', roughness:0.8
        }));
      }
      // Hitching post
      svg.appendChild(rc.line(bx-20, H*0.55, bx+20, H*0.55, {stroke:'#5C3A1E', strokeWidth:3, roughness:2}));
      svg.appendChild(rc.line(bx-20, H*0.55, bx-20, H*0.55-12, {stroke:'#5C3A1E', strokeWidth:2.5, roughness:1.5}));
      svg.appendChild(rc.line(bx+20, H*0.55, bx+20, H*0.55-12, {stroke:'#5C3A1E', strokeWidth:2.5, roughness:1.5}));
    }
    // Dirt road
    svg.appendChild(rc.rectangle(0, H*0.62, W, H*0.1, {
      stroke:'none', fill:pal.dust||'#C09050', fillStyle:'solid', roughness:2
    }));
    // Wagon wheel ruts
    svg.appendChild(rc.line(0, H*0.65, W, H*0.65, {stroke:shadeColor(pal.dust||'#C09050',-20), strokeWidth:1, roughness:2, opacity:0.4}));
    svg.appendChild(rc.line(0, H*0.68, W, H*0.68, {stroke:shadeColor(pal.dust||'#C09050',-20), strokeWidth:1, roughness:2, opacity:0.4}));
    // Tumbleweed hint
    const tw = W*0.15 + sr()*W*0.7;
    svg.appendChild(rc.ellipse(tw, H*0.66, 10, 10, {stroke:'#8B5A2B', fill:'none', roughness:3.5, strokeWidth:1}));
  }

  // ── Ship deck (Ocean) ─────────────────────────────────────────────────
  if (type === 'ship') {
    // Sea on horizon
    svg.appendChild(rc.rectangle(0, H*0.42, W, H*0.28, {
      stroke:'none', fill: pal.wave || '#2A6090', fillStyle:'solid', roughness:1
    }));
    // Wave lines
    for (let i = 0; i < 5; i++) {
      const wy = H*0.45 + i*8;
      svg.appendChild(rc.line(0, wy, W, wy+sr()*4-2, {
        stroke:'#42A5F5', strokeWidth:1.5, roughness:2.5, opacity:0.4
      }));
    }
    // Moon or sun
    if (time === 'night') {
      svg.appendChild(rc.circle(W*0.7, H*0.12, 22, {stroke:'#f5e68a', fill:'#fdf5b0', fillStyle:'solid', roughness:0.7}));
    } else {
      svg.appendChild(rc.circle(W*0.75, H*0.1, 28, {stroke:'#FFD700', fill:'#FFEE55', fillStyle:'solid', roughness:0.8}));
    }
    // Ship mast
    svg.appendChild(rc.line(W*0.45, H*0.65, W*0.47, H*0.05, {stroke:pal.wood?pal.wood[0]:'#8B5A2B', strokeWidth:5, roughness:1.5}));
    // Sail
    svg.appendChild(rc.polygon([[W*0.47,H*0.08],[W*0.47,H*0.35],[W*0.7,H*0.32],[W*0.68,H*0.08]], {
      stroke:'#c0b0a0', fill:pal.sail||'#E8E0D0', fillStyle:'solid', roughness:2.0
    }));
    // Rigging lines
    svg.appendChild(rc.line(W*0.47, H*0.08, W*0.72, H*0.35, {stroke:'#8B5A2B', strokeWidth:1, roughness:1}));
    svg.appendChild(rc.line(W*0.47, H*0.22, W*0.7, H*0.38, {stroke:'#8B5A2B', strokeWidth:1, roughness:1}));
    // Crow's nest
    svg.appendChild(rc.rectangle(W*0.44, H*0.16, 7, 6, {stroke:'#5C3A1E', fill:'#8B5A2B', fillStyle:'solid', roughness:1.5}));
    // Ship hull (deck edge)
    svg.appendChild(rc.rectangle(0, H*0.72, W, 18, {
      stroke:shadeColor(pal.wood?pal.wood[0]:'#8B5A2B',-20),
      fill:pal.wood?pal.wood[0]:'#8B5A2B', fillStyle:'hachure', roughness:2
    }));
    // Cannon ports
    for (let i = 0; i < 4; i++) {
      const cx2 = W*0.1 + i*(W*0.22);
      svg.appendChild(rc.rectangle(cx2-4, H*0.72+2, 8, 6, {stroke:'#1a1008', fill:'#0a0804', fillStyle:'solid', roughness:1.5}));
    }
  }

  // ── Road (travel scene) ────────────────────────────────────────────────
  if (type === 'road') {
    // Time-appropriate sun/moon
    if (time === 'night') {
      svg.appendChild(rc.circle(W*0.74, H*0.14, 24, {stroke:'#f5e68a', fill:'#fdf5b0', fillStyle:'solid', roughness:0.7}));
    } else {
      svg.appendChild(rc.circle(W*0.74, H*0.11, 30, {stroke:'#FFD080', fill:pal.sun||'#FFD080', fillStyle:'solid', roughness:0.8}));
    }
    // Rolling hills background
    for (let i = 0; i < 3; i++) {
      const hx = i*(W/3); const hr = 80+sr()*60;
      svg.appendChild(rc.ellipse(hx+hr/2, H*0.55, hr*1.4, hr*0.4, {
        stroke:'none', fill:shadeColor('#4A5A30',i*-8), fillStyle:'solid', roughness:1
      }));
    }
    // Trees along road
    for (let i = 0; i < 6; i++) {
      const tx = i*(W/5.5) + sr()*15;
      const th = 35 + sr()*25;
      svg.appendChild(rc.line(tx, H*0.65, tx, H*0.65-th, {stroke:'#5C3A1E', strokeWidth:4, roughness:2}));
      svg.appendChild(rc.ellipse(tx, H*0.65-th-10, th*0.6, th*0.7, {
        stroke:'#1B5E20', fill:'#2D8B37', fillStyle:'solid', roughness:2.5
      }));
    }
    // Road path
    svg.appendChild(rc.path(`M ${W*0.35} ${H*0.65} Q ${W*0.5} ${H*0.55} ${W*0.65} ${H*0.65}`, {
      stroke:pal.road||'#8A7050', strokeWidth:20, fill:'none', roughness:1.5
    }));
    // Road edges
    svg.appendChild(rc.line(W*0.36, H*0.65, W*0.51, H*0.555, {stroke:shadeColor(pal.road||'#8A7050',-20), strokeWidth:1.5, roughness:2, opacity:0.5}));
    svg.appendChild(rc.line(W*0.64, H*0.65, W*0.49, H*0.555, {stroke:shadeColor(pal.road||'#8A7050',-20), strokeWidth:1.5, roughness:2, opacity:0.5}));
    // Milestone post
    svg.appendChild(rc.rectangle(W*0.52, H*0.58, 5, 12, {stroke:'#5C3A1E', fill:'#8B6230', fillStyle:'solid', roughness:2}));
    svg.appendChild(rc.rectangle(W*0.5, H*0.56, 10, 5, {stroke:'#5C3A1E', fill:'#A07040', fillStyle:'solid', roughness:1.5}));
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
    else if (type === 'city' || type === 'tavern') y = H*0.65 + tr()*2; // mostly flat paved ground
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

  // ── Market / Town Square ────────────────────────────────────────────────
  if (type === 'market') {
    // Sun or moon
    if (time === 'night') {
      svg.appendChild(rc.circle(W*0.82, H*0.13, 22, { stroke:'#f5e68a', fill:'#fdf5b0', fillStyle:'solid', roughness:0.7 }));
    } else {
      svg.appendChild(rc.circle(W*0.82, H*0.12, 30, { stroke: pal.sun||'#FFE066', fill: pal.sun||'#FFE066', fillStyle:'solid', roughness:0.8 }));
    }
    // Background buildings
    for (let i = 0; i < 8; i++) {
      const bx = i*(W/7) + sr()*10-5;
      const bh = 30 + sr()*50;
      const bw = 28 + sr()*20;
      const stone = pal.stone ? pal.stone[i%2] : '#9E8E7A';
      svg.appendChild(rc.rectangle(bx-bw/2, H*0.66-bh, bw, bh, { stroke:shadeColor(stone,-20), fill:stone, fillStyle:'hachure', roughness:1.8, strokeWidth:1.2 }));
      svg.appendChild(rc.rectangle(bx-bw/2-2, H*0.66-bh-6, bw+4, 8, { stroke:shadeColor(stone,-30), fill:pal.roof||'#A0522D', fillStyle:'solid', roughness:1.5 }));
    }
    // Market stalls — colourful awnings
    const awningColors = pal.awning || ['#CC2222','#2244CC','#22AA44'];
    for (let i = 0; i < 5; i++) {
      const sx = W*0.08 + i*(W/5.2);
      const sy = H*0.62;
      const aw = awningColors[i%awningColors.length];
      // Stall frame
      svg.appendChild(rc.line(sx, sy, sx, sy-22, { stroke:'#6B4423', strokeWidth:3, roughness:1.5 }));
      svg.appendChild(rc.line(sx+32, sy, sx+32, sy-22, { stroke:'#6B4423', strokeWidth:3, roughness:1.5 }));
      // Awning
      svg.appendChild(rc.polygon([[sx-4,sy-18],[sx+36,sy-18],[sx+32,sy-8],[sx,sy-8]], { stroke:shadeColor(aw,-20), fill:aw, fillStyle:'solid', roughness:1.8 }));
      // Awning stripes
      for (let s = 0; s < 3; s++) {
        svg.appendChild(rc.line(sx+4+s*10, sy-18, sx+2+s*10, sy-8, { stroke:shadeColor(aw,30), strokeWidth:2, roughness:1.2 }));
      }
      // Counter / goods
      svg.appendChild(rc.rectangle(sx-2, sy-8, 36, 5, { stroke:'#6B4423', fill:'#8B5A2A', fillStyle:'solid', roughness:1.5 }));
    }
    // Cobblestone ground hint
    for (let i = 0; i < 12; i++) {
      svg.appendChild(rc.ellipse(sr()*W, H*0.66+sr()*8, 14+sr()*10, 5, { stroke:shadeColor(pal.ground||'#8B7355',-10), fill:'none', roughness:2.0 }));
    }
  }

  // ── Tower (Wizard / Watch Tower) ─────────────────────────────────────────
  if (type === 'tower') {
    // Night sky with moon
    svg.appendChild(rc.circle(W*0.78, H*0.12, 22, { stroke:'#c8c0a0', fill:'#f5eecc', fillStyle:'solid', roughness:0.8 }));
    // Stars
    for (let i = 0; i < 30; i++) {
      const sx = sr()*W, sy = sr()*H*0.5;
      svg.appendChild(rc.circle(sx, sy, 1.2+sr()*1.5, { stroke:'none', fill:'#FFFDE7', fillStyle:'solid', roughness:0.3 }));
    }
    // Distant landscape — dark hills
    svg.appendChild(rc.polygon([[0,H*0.72],[W*0.3,H*0.55],[W*0.6,H*0.62],[W,H*0.58],[W,H],[0,H]], { stroke:'none', fill:pal.far||'#1A1228', fillStyle:'solid', roughness:3 }));
    // Tower structure — central
    const tw = 60, tx = W*0.5;
    const tBase = H*0.78, tTop = H*0.08;
    svg.appendChild(rc.rectangle(tx-tw/2, tTop, tw, tBase-tTop, { stroke:pal.stone?pal.stone[0]:'#5A4870', fill:pal.stone?pal.stone[1]:'#4A3860', fillStyle:'hachure', roughness:1.5, strokeWidth:2 }));
    // Battlements at top
    for (let i = 0; i < 5; i++) {
      svg.appendChild(rc.rectangle(tx-tw/2+i*14, tTop-10, 10, 12, { stroke:pal.stone?pal.stone[0]:'#5A4870', fill:pal.stone?pal.stone[1]:'#4A3860', fillStyle:'solid', roughness:1.5 }));
    }
    // Glowing windows
    const winColor = pal.window || '#AAFFCC';
    for (let i = 0; i < 4; i++) {
      const wy = tTop + 20 + i*((tBase-tTop-40)/4);
      svg.appendChild(rc.ellipse(tx, wy, 12, 16, { stroke:winColor, fill:winColor+'88', fillStyle:'solid', roughness:0.8 }));
      // Glow
      const glowEl = svgEl('ellipse', { cx:String(tx), cy:String(wy), rx:'20', ry:'22', fill:winColor, opacity:'0.12' });
      svg.appendChild(glowEl);
    }
    // Tower door arch
    svg.appendChild(rc.path(`M ${tx-10} ${tBase} Q ${tx} ${tBase-18} ${tx+10} ${tBase}`, { stroke:'#2A1828', fill:'#110814', fillStyle:'solid', roughness:1.2, strokeWidth:2 }));
    // Flanking trees
    for (let side of [-1,1]) {
      const treex = tx + side*(tw/2+30);
      svg.appendChild(rc.line(treex, H*0.78, treex, H*0.45, { stroke:pal.trunk||'#3A2018', strokeWidth:5, roughness:2 }));
      svg.appendChild(rc.ellipse(treex, H*0.42, 25, 30, { stroke:'#1A3010', fill:'#1E3A14', fillStyle:'hachure', roughness:2.5 }));
    }
  }

  // ── Prairie (Western open landscape) ─────────────────────────────────────
  if (type === 'prairie') {
    // Big sky sun
    svg.appendChild(rc.circle(W*0.72, H*0.14, 38, { stroke:pal.sun||'#FFE566', fill:pal.sun||'#FFE566', fillStyle:'solid', roughness:0.7 }));
    // Distant mesa/butte shapes
    for (let i = 0; i < 4; i++) {
      const mx = W*(0.1+i*0.22) + sr()*20;
      const mh = 20 + sr()*35;
      const mw = 40 + sr()*60;
      svg.appendChild(rc.polygon([[mx-mw/2,H*0.64],[mx-mw/2+8,H*0.64-mh],[mx+mw/2-8,H*0.64-mh],[mx+mw/2,H*0.64]], {
        stroke:shadeColor(pal.rock||'#A07840',-20), fill:pal.rock||'#A07840', fillStyle:'hachure', roughness:2.5
      }));
    }
    // Fence posts
    for (let i = 0; i < 9; i++) {
      const px = i*(W/8);
      svg.appendChild(rc.line(px, H*0.63, px, H*0.63-16, { stroke:'#6B4220', strokeWidth:3, roughness:2 }));
    }
    svg.appendChild(rc.line(0, H*0.63-8, W, H*0.63-9, { stroke:'#6B4220', strokeWidth:2, roughness:3 }));
    svg.appendChild(rc.line(0, H*0.63-13, W, H*0.63-12, { stroke:'#6B4220', strokeWidth:1.5, roughness:3 }));
    // Tumbleweeds
    for (let i = 0; i < 3; i++) {
      const tx2 = sr()*W, ty2 = H*0.63 + sr()*6;
      svg.appendChild(rc.circle(tx2, ty2, 8+sr()*6, { stroke:'#8B6020', fill:'none', roughness:3.5 }));
    }
    // Grass tufts
    for (let i = 0; i < 15; i++) {
      const gx = sr()*W, gy = H*0.63 + sr()*8;
      svg.appendChild(rc.line(gx, gy, gx+sr()*6-3, gy-8-sr()*6, { stroke:pal.grass?pal.grass[0]:'#A09040', strokeWidth:1.5, roughness:2 }));
    }
  }

  // ── Frontier Town ─────────────────────────────────────────────────────────
  if (type === 'frontier_town') {
    // Sunset sky glow
    svg.appendChild(rc.circle(W*0.7, H*0.15, 34, { stroke:pal.sun||'#FFE566', fill:pal.sun||'#FFE566', fillStyle:'solid', roughness:0.8 }));
    // Western buildings — wooden facades
    const woodColors = pal.wood || ['#8B5A2A','#7A4A1A','#9B6A3A'];
    const buildingWidths = [70,55,80,65,75,60,70];
    let bxPos = -10;
    for (let i = 0; i < 7; i++) {
      const bw2 = buildingWidths[i];
      const bh2 = 35 + sr()*40;
      const wood2 = woodColors[i%woodColors.length];
      // Main wall
      svg.appendChild(rc.rectangle(bxPos, H*0.65-bh2, bw2, bh2, { stroke:shadeColor(wood2,-25), fill:wood2, fillStyle:'hachure', roughness:2.2, strokeWidth:1.5 }));
      // False front (raised facade)
      svg.appendChild(rc.rectangle(bxPos-3, H*0.65-bh2-14, bw2+6, 16, { stroke:shadeColor(wood2,-30), fill:shadeColor(wood2,-10), fillStyle:'solid', roughness:1.8 }));
      // Sign
      if (i%2===0) {
        svg.appendChild(rc.rectangle(bxPos+bw2*0.2, H*0.65-bh2+5, bw2*0.6, 10, { stroke:'#4A2808', fill:'#C4901A', fillStyle:'solid', roughness:1.5 }));
      }
      // Window
      svg.appendChild(rc.rectangle(bxPos+bw2*0.25, H*0.65-bh2+18, bw2*0.2, bw2*0.18, { stroke:'#3A2010', fill:time==='night'?'#FFD060':'#A8C4D8', fillStyle:'solid', roughness:1.2 }));
      bxPos += bw2 + 2;
    }
    // Dirt road markings
    for (let i = 0; i < 5; i++) {
      svg.appendChild(rc.line(sr()*W, H*0.66, sr()*W, H*0.68, { stroke:pal.dust||'#C4A060', strokeWidth:1, roughness:2.5 }));
    }
  }

  // ── Canyon ─────────────────────────────────────────────────────────────────
  if (type === 'canyon') {
    // Hot sun
    svg.appendChild(rc.circle(W*0.75, H*0.1, 32, { stroke:'#FFD060', fill:'#FFE080', fillStyle:'solid', roughness:0.7 }));
    // Canyon walls — left and right towering rock faces
    const rockColors = pal.rock || ['#C07040','#A85A30','#D08050'];
    // Left wall
    svg.appendChild(rc.polygon([[0,0],[W*0.28,0],[W*0.32,H*0.55],[W*0.18,H*0.65],[0,H*0.65]], {
      stroke:shadeColor(rockColors[0],-20), fill:rockColors[0], fillStyle:'hachure', roughness:2.5, strokeWidth:1.5
    }));
    // Left wall strata lines
    for (let i = 0; i < 5; i++) {
      svg.appendChild(rc.line(0, H*(0.1+i*0.08), W*0.28-i*4, H*(0.12+i*0.08), { stroke:shadeColor(rockColors[0],-30), strokeWidth:1.5, roughness:2.5 }));
    }
    // Right wall
    svg.appendChild(rc.polygon([[W,0],[W*0.72,0],[W*0.68,H*0.55],[W*0.82,H*0.65],[W,H*0.65]], {
      stroke:shadeColor(rockColors[1],-20), fill:rockColors[1], fillStyle:'hachure', roughness:2.5, strokeWidth:1.5
    }));
    // Right wall strata
    for (let i = 0; i < 5; i++) {
      svg.appendChild(rc.line(W, H*(0.1+i*0.08), W*0.72+i*4, H*(0.12+i*0.08), { stroke:shadeColor(rockColors[1],-30), strokeWidth:1.5, roughness:2.5 }));
    }
    // Canyon floor shadow
    svg.appendChild(rc.polygon([[W*0.18,H*0.65],[W*0.82,H*0.65],[W*0.85,H*0.72],[W*0.15,H*0.72]], {
      stroke:'none', fill:pal.shadow||'#602010', fillStyle:'solid', roughness:1
    }));
    // Distant arch/rock formation
    svg.appendChild(rc.path(`M ${W*0.4} ${H*0.45} Q ${W*0.5} ${H*0.28} ${W*0.6} ${H*0.45}`, { stroke:rockColors[2], fill:'none', roughness:2.5, strokeWidth:3 }));
  }

  // ── Graveyard ─────────────────────────────────────────────────────────────
  if (type === 'graveyard') {
    // Full moon
    svg.appendChild(rc.circle(W*0.76, H*0.13, 28, { stroke:'#BBCCDD', fill:'#CCD8E8', fillStyle:'solid', roughness:0.8 }));
    // Clouds over moon
    svg.appendChild(rc.ellipse(W*0.76+20, H*0.13-5, 50, 18, { stroke:'none', fill:'rgba(40,50,60,0.7)', fillStyle:'solid', roughness:2 }));
    // Dead trees
    for (let i = 0; i < 4; i++) {
      const dtx = sr()*W*0.9 + W*0.05;
      const dty = H*0.67;
      const dth = 35 + sr()*30;
      svg.appendChild(rc.line(dtx, dty, dtx, dty-dth, { stroke:'#2A2820', strokeWidth:4, roughness:2.5 }));
      // Branches
      svg.appendChild(rc.line(dtx, dty-dth*0.6, dtx-15-sr()*10, dty-dth*0.8, { stroke:'#2A2820', strokeWidth:2, roughness:2 }));
      svg.appendChild(rc.line(dtx, dty-dth*0.5, dtx+12+sr()*8, dty-dth*0.7, { stroke:'#2A2820', strokeWidth:2, roughness:2 }));
    }
    // Gravestones
    for (let i = 0; i < 8; i++) {
      const gsx = W*0.06 + sr()*(W*0.88);
      const gsy = H*0.62 + sr()*8;
      const gsw = 10 + sr()*8, gsh = 14 + sr()*10;
      const stone2 = pal.stone ? pal.stone[i%pal.stone.length] : '#4A4A50';
      // Stone body
      svg.appendChild(rc.rectangle(gsx-gsw/2, gsy-gsh, gsw, gsh, { stroke:shadeColor(stone2,-20), fill:stone2, fillStyle:'solid', roughness:2 }));
      // Rounded top
      svg.appendChild(rc.ellipse(gsx, gsy-gsh, gsw, 7, { stroke:shadeColor(stone2,-20), fill:stone2, fillStyle:'solid', roughness:1.5 }));
    }
    // Ground fog
    const fogEl = svgEl('rect', { x:'0', y:String(H*0.60), width:String(W), height:String(H*0.1), fill:'url(#fogGrad)', opacity:'0.5' });
    svg.appendChild(fogEl);
  }

  // ── Crypt / Dungeon variant ──────────────────────────────────────────────
  if (type === 'crypt') {
    // Deep underground — stalactites replaced by stone arches
    for (let i = 0; i < 5; i++) {
      const ax = W*0.1 + i*(W*0.2);
      // Stone arch pillars
      svg.appendChild(rc.rectangle(ax-8, H*0.1, 16, H*0.65, { stroke:pal.stone?pal.stone[0]:'#2A283A', fill:pal.stone?pal.stone[1]:'#1E1C30', fillStyle:'hachure', roughness:1.8, strokeWidth:1.5 }));
    }
    // Bone details on floor
    for (let i = 0; i < 6; i++) {
      const bx2 = sr()*W, by2 = H*0.72 + sr()*8;
      svg.appendChild(rc.line(bx2, by2, bx2+12, by2+3, { stroke:pal.bone||'#C8C0A8', strokeWidth:2.5, roughness:2 }));
    }
    // Glowing runes on walls
    for (let i = 0; i < 4; i++) {
      const rx2 = W*0.15 + i*(W*0.22);
      const ry2 = H*0.25 + sr()*20;
      svg.appendChild(rc.circle(rx2, ry2, 8, { stroke:pal.glow||'#4422AA', fill:'none', roughness:1.5 }));
      svg.appendChild(rc.line(rx2-5, ry2, rx2+5, ry2, { stroke:pal.glow||'#4422AA', strokeWidth:1.5, roughness:1 }));
    }
    // Torches
    for (let i = 0; i < 3; i++) {
      const torchX = W*0.2 + i*(W*0.3);
      svg.appendChild(rc.line(torchX, H*0.3, torchX, H*0.42, { stroke:'#5A3010', strokeWidth:3, roughness:1.5 }));
      svg.appendChild(animG('flicker', [
        rc.circle(torchX, H*0.28, 7, { stroke:'#FF8030', fill:'#FF6020', fillStyle:'solid', roughness:1.2 }),
      ]));
      const glowEl2 = svgEl('ellipse', { cx:String(torchX), cy:String(H*0.28), rx:'18', ry:'14', fill:'#FF6020', opacity:'0.12' });
      glowEl2.setAttribute('class', 'eyeGlow');
      svg.appendChild(glowEl2);
    }
  }

  // ── Spaceship interior ────────────────────────────────────────────────────
  if (type === 'spaceship' || type === 'space_station') {
    // Black void outside windows
    // Hull walls — metal panels
    for (let i = 0; i < 6; i++) {
      const px2 = i*(W/5.5);
      const ph = H*0.55 + sr()*20;
      const metal = pal.metal ? pal.metal[i%pal.metal.length] : '#2A3A4A';
      svg.appendChild(rc.rectangle(px2, H*0.12, W/5.5-2, ph, { stroke:shadeColor(metal,-15), fill:metal, fillStyle:'hachure', roughness:0.8, strokeWidth:1 }));
      // Panel rivets
      svg.appendChild(rc.circle(px2+8, H*0.16, 3, { stroke:shadeColor(metal,-30), fill:shadeColor(metal,10), fillStyle:'solid', roughness:0.5 }));
      svg.appendChild(rc.circle(px2+8, H*0.16+12, 3, { stroke:shadeColor(metal,-30), fill:shadeColor(metal,10), fillStyle:'solid', roughness:0.5 }));
    }
    // Viewport windows showing stars
    for (let i = 0; i < 3; i++) {
      const vx = W*0.12 + i*(W*0.3);
      const vy = H*0.18;
      svg.appendChild(rc.rectangle(vx, vy, 60, 38, { stroke:pal.glow||'#00CCFF', fill:pal.window||'#004466', fillStyle:'solid', roughness:0.5, strokeWidth:2 }));
      // Stars in viewport
      for (let s = 0; s < 8; s++) {
        svg.appendChild(rc.circle(vx+5+sr()*50, vy+3+sr()*30, 1+sr()*1.5, { stroke:'none', fill:'#FFFDE7', fillStyle:'solid', roughness:0.3 }));
      }
      // Planet visible
      if (i===1) {
        svg.appendChild(rc.circle(vx+30, vy+20, 12, { stroke:'#44AAFF', fill:'#226688', fillStyle:'solid', roughness:0.6 }));
      }
    }
    // Alert lights
    if (type === 'space_station') {
      for (let i = 0; i < 4; i++) {
        const alertEl = svgEl('circle', { cx:String(W*0.05+i*(W*0.3)), cy:String(H*0.08), r:'5', fill:pal.alert||'#FF4444', opacity:'0.8' });
        alertEl.setAttribute('class', 'eyeGlow');
        alertEl.style.animationDelay = `${i*0.5}s`;
        svg.appendChild(alertEl);
      }
    }
    // Floor grating lines
    for (let i = 0; i < 8; i++) {
      svg.appendChild(rc.line(i*(W/7), H*0.70, i*(W/7)+W/10, H*0.82, { stroke:shadeColor(pal.metal?pal.metal[0]:'#2A3A4A',-10), strokeWidth:1, roughness:0.6 }));
    }
  }

  // ── Alien Planet ─────────────────────────────────────────────────────────
  if (type === 'alien_planet') {
    // Alien sun — wrong color
    svg.appendChild(rc.circle(W*0.7, H*0.1, 30, { stroke:'#AA44FF', fill:'#CC66FF', fillStyle:'solid', roughness:0.8 }));
    // Twin moons
    svg.appendChild(rc.circle(W*0.2, H*0.15, 14, { stroke:'#44AAFF', fill:'#226688', fillStyle:'solid', roughness:1.2 }));
    // Crystal formations
    const crystalColors = pal.crystal || ['#8844FF','#AA66FF','#6622DD'];
    for (let i = 0; i < 8; i++) {
      const cx2 = sr()*W;
      const cy2 = H*0.62 - sr()*20;
      const ch = 20 + sr()*40;
      const cw2 = 8 + sr()*10;
      const cc = crystalColors[i%crystalColors.length];
      svg.appendChild(rc.polygon([[cx2-cw2/2,cy2],[cx2+cw2/2,cy2],[cx2+cw2/4,cy2-ch],[cx2-cw2/4,cy2-ch]], {
        stroke:shadeColor(cc,-20), fill:cc+'88', fillStyle:'solid', roughness:1.5, strokeWidth:1.5
      }));
    }
    // Spore particles (floating)
    for (let i = 0; i < 12; i++) {
      const spEl = svgEl('circle', { cx:String(sr()*W), cy:String(H*0.3+sr()*0.3*H), r:String(2+sr()*3), fill:pal.spore||'#44FFAA', opacity:String(0.3+sr()*0.4) });
      spEl.setAttribute('class', 'emberFloat');
      spEl.style.animationDelay = `${sr()*4}s`;
      spEl.style.animationDuration = `${3+sr()*3}s`;
      svg.appendChild(spEl);
    }
    // Alien vegetation
    for (let i = 0; i < 5; i++) {
      const vx2 = sr()*W;
      const vy2 = H*0.62;
      svg.appendChild(rc.line(vx2, vy2, vx2+sr()*10-5, vy2-15-sr()*20, { stroke:pal.glow||'#88FF44', strokeWidth:3, roughness:2.5 }));
      svg.appendChild(rc.ellipse(vx2, vy2-15-sr()*15, 10+sr()*8, 6, { stroke:pal.glow||'#88FF44', fill:pal.glow||'#44FF88'+'66', fillStyle:'solid', roughness:2 }));
    }
  }

  // ── Neon City (Cyberpunk) ─────────────────────────────────────────────────
  if (type === 'neon_city' || type === 'back_alley') {
    // Deep night sky — no stars, smog
    const smogEl = svgEl('rect', { x:'0', y:'0', width:String(W), height:String(H*0.55), fill:pal.smog||'rgba(20,10,40,0.4)' });
    svg.appendChild(smogEl);
    // Towering dark buildings
    for (let i = 0; i < 14; i++) {
      const bx3 = i*(W/12) + sr()*8-4;
      const bh3 = 50 + sr()*120;
      const bw3 = 20 + sr()*32;
      const build = pal.build ? pal.build[i%pal.build.length] : '#1A1830';
      svg.appendChild(rc.rectangle(bx3-bw3/2, H*0.68-bh3, bw3, bh3, { stroke:shadeColor(build,-15), fill:build, fillStyle:'hachure', roughness:0.9, strokeWidth:1 }));
      // Neon sign glow
      const neonColors2 = pal.neon || ['#FF00FF','#00FFFF','#FF4400','#00FF88'];
      if (sr() > 0.4) {
        const nc = neonColors2[Math.floor(sr()*neonColors2.length)];
        svg.appendChild(rc.line(bx3-bw3/4, H*0.68-bh3+12, bx3+bw3/4, H*0.68-bh3+12, { stroke:nc, strokeWidth:2.5, roughness:1.2 }));
        const neonGlow = svgEl('line', { x1:String(bx3-bw3/4), y1:String(H*0.68-bh3+12), x2:String(bx3+bw3/4), y2:String(H*0.68-bh3+12), stroke:nc, 'stroke-width':'8', opacity:'0.15' });
        svg.appendChild(neonGlow);
      }
      // Lit windows
      const floors2 = Math.floor(bh3/12);
      for (let row = 1; row < Math.min(floors2,8); row++) {
        if (sr() > 0.5) {
          const winC = sr() > 0.8 ? neonColors2[Math.floor(sr()*neonColors2.length)] : '#FFEE55';
          svg.appendChild(rc.rectangle(bx3-bw3/4, H*0.68-bh3+row*12+5, bw3*0.35, 6, { stroke:'none', fill:winC, fillStyle:'solid', roughness:0.4 }));
        }
      }
    }
    // Ground neon reflections — puddles (shimmer)
    for (let i = 0; i < 5; i++) {
      const nc2 = (pal.neon||['#FF00FF','#00FFFF'])[i%2];
      const puddleEl = svgEl('ellipse', { cx:String(sr()*W), cy:String(H*0.70+sr()*6), rx:String(20+sr()*30), ry:'4', fill:nc2, opacity:'0.12' });
      puddleEl.setAttribute('class', 'waveAnim');
      puddleEl.style.animationDelay = `${sr()*2}s`;
      svg.appendChild(puddleEl);
    }
    // Rain effect for cyberpunk
    for (let i = 0; i < 30; i++) {
      const rainEl = svgEl('line', { x1:String(sr()*W), y1:String(sr()*H*0.7), x2:String(sr()*W-2), y2:String(sr()*H*0.7+10), stroke:'rgba(100,150,255,0.25)', 'stroke-width':'1' });
      svg.appendChild(rainEl);
    }
  }

  // ── Corp Building (Cyberpunk office tower) ───────────────────────────────
  if (type === 'corp_building') {
    // Glass tower facade — massive and imposing
    const glassColors = pal.glass || ['#102030','#0A1828','#182838'];
    for (let i = 0; i < 5; i++) {
      const gx = i*(W/4.5);
      const gh = 80 + sr()*60;
      const gw = W/4.5 - 4;
      svg.appendChild(rc.rectangle(gx, H*0.68-gh, gw, gh, { stroke:shadeColor(glassColors[0],-10), fill:glassColors[i%glassColors.length], fillStyle:'hachure', roughness:0.6, strokeWidth:1.5 }));
      // Floor divider lines
      for (let f = 0; f < Math.floor(gh/15); f++) {
        svg.appendChild(rc.line(gx, H*0.68-gh+f*15, gx+gw, H*0.68-gh+f*15, { stroke:shadeColor(glassColors[0],10), strokeWidth:0.7, roughness:0.5 }));
      }
    }
    // Logo on top of central building
    svg.appendChild(rc.circle(W/2, H*0.1, 15, { stroke:pal.logo||'#FF4400', fill:'none', roughness:1.2, strokeWidth:2.5 }));
    // Corporate light beams
    for (let i = 0; i < 2; i++) {
      const beamEl = svgEl('line', { x1:String(W*(0.35+i*0.3)), y1:String(H*0.08), x2:String(W*(0.1+i*0.6)), y2:String(0), stroke:pal.light||'#0066CC', 'stroke-width':'4', opacity:'0.2' });
      svg.appendChild(beamEl);
    }
    // Security lights — sweeping
    const sec1 = rc.circle(W*0.1, H*0.5, 5, { stroke:pal.light||'#0066CC', fill:pal.light||'#0066CC', fillStyle:'solid', roughness:0.5 });
    sec1.setAttribute('class', 'eyeGlow'); sec1.style.animationDelay = '0s';
    svg.appendChild(sec1);
    const sec2 = rc.circle(W*0.9, H*0.5, 5, { stroke:pal.light||'#0066CC', fill:pal.light||'#0066CC', fillStyle:'solid', roughness:0.5 });
    sec2.setAttribute('class', 'eyeGlow'); sec2.style.animationDelay = '1s';
    svg.appendChild(sec2);
  }

  // ── Olympus (bright clouds, marble) ──────────────────────────────────────
  if (type === 'olympus') {
    // Brilliant sun
    svg.appendChild(rc.circle(W*0.75, H*0.1, 40, { stroke:'#FFE040', fill:'#FFF380', fillStyle:'solid', roughness:0.6 }));
    // Sun rays
    for (let i = 0; i < 12; i++) {
      const a2 = (i/12)*Math.PI*2;
      svg.appendChild(rc.line(W*0.75+Math.cos(a2)*24, H*0.1+Math.sin(a2)*24, W*0.75+Math.cos(a2)*38, H*0.1+Math.sin(a2)*38, { stroke:'#FFE040', strokeWidth:2, roughness:1.5 }));
    }
    // Cloud layers (drifting)
    for (let c = 0; c < 8; c++) {
      const cx3 = sr()*W, cy3 = H*(0.1+sr()*0.45);
      const cw3 = 50+sr()*80;
      const cloudEl = rc.ellipse(cx3, cy3, cw3, 18+sr()*12, { stroke:'#e8e8e8', fill:'white', fillStyle:'solid', roughness:2.5 });
      cloudEl.setAttribute('class', 'driftCloud');
      cloudEl.style.animationDuration = `${20+sr()*20}s`;
      cloudEl.style.animationDelay = `${sr()*-15}s`;
      svg.appendChild(cloudEl);
    }
    // Marble pillars
    for (let i = 0; i < 5; i++) {
      const pillarX = W*0.08 + i*(W/5);
      const pillarColor = pal.pillar || '#F0E8D8';
      svg.appendChild(rc.rectangle(pillarX-7, H*0.15, 14, H*0.5, { stroke:shadeColor(pillarColor,-15), fill:pillarColor, fillStyle:'hachure', roughness:1.2, strokeWidth:1.5 }));
      // Capital
      svg.appendChild(rc.rectangle(pillarX-11, H*0.15-8, 22, 10, { stroke:shadeColor(pillarColor,-20), fill:pillarColor, fillStyle:'solid', roughness:1.2 }));
      // Base
      svg.appendChild(rc.rectangle(pillarX-10, H*0.65-2, 20, 8, { stroke:shadeColor(pillarColor,-20), fill:pillarColor, fillStyle:'solid', roughness:1.2 }));
    }
    // Golden trim on ground
    svg.appendChild(rc.line(0, H*0.65, W, H*0.65, { stroke:pal.gold||'#FFD700', strokeWidth:3, roughness:2 }));
  }

  // ── Underworld (fire, lava, darkness) ────────────────────────────────────
  if (type === 'underworld') {
    // Lava glow from below — permeates everything
    const lavaGlowEl = svgEl('rect', { x:'0', y:String(H*0.5), width:String(W), height:String(H*0.5), fill:'rgba(180,40,0,0.25)', opacity:'1' });
    svg.appendChild(lavaGlowEl);
    // Distant lava river
    svg.appendChild(rc.path(`M 0 ${H*0.68} Q ${W*0.3} ${H*0.64} ${W*0.5} ${H*0.67} Q ${W*0.7} ${H*0.70} ${W} ${H*0.66}`, {
      stroke:(pal.lava||['#FF4400'])[0], fill:(pal.lava||['#FF6600'])[1]||'#FF6600', fillStyle:'solid', roughness:2, strokeWidth:2
    }));
    // Lava glow
    const lavaEl = svgEl('ellipse', { cx:String(W*0.5), cy:String(H*0.67), rx:String(W*0.45), ry:'18', fill:'#FF4400', opacity:'0.2' });
    lavaEl.setAttribute('class', 'eyeGlow');
    svg.appendChild(lavaEl);
    // Bone columns
    for (let i = 0; i < 4; i++) {
      const colX = W*0.1 + i*(W*0.25);
      svg.appendChild(rc.rectangle(colX-8, H*0.12, 16, H*0.56, { stroke:shadeColor(pal.bone||'#C8B898',-20), fill:pal.bone||'#C8B898', fillStyle:'hachure', roughness:2, strokeWidth:1.5 }));
    }
    // Skull motifs
    for (let i = 0; i < 5; i++) {
      const skx = sr()*W, sky2 = H*0.15+sr()*0.35*H;
      svg.appendChild(rc.circle(skx, sky2, 7, { stroke:'#CC4400', fill:'none', roughness:1.5 }));
      svg.appendChild(rc.circle(skx-3, sky2-1, 2, { stroke:'none', fill:'#FF4400', fillStyle:'solid', roughness:0.5 }));
      svg.appendChild(rc.circle(skx+3, sky2-1, 2, { stroke:'none', fill:'#FF4400', fillStyle:'solid', roughness:0.5 }));
    }
    // Smoke columns (rising)
    for (let i = 0; i < 4; i++) {
      const smokeEl = svgEl('ellipse', { cx:String(W*0.15+i*(W*0.25)), cy:String(H*0.4), rx:'12', ry:'30', fill:pal.smoke||'rgba(60,10,10,0.4)', opacity:'0.6' });
      smokeEl.setAttribute('class', 'smokeRise');
      smokeEl.style.animationDelay = `${i*0.8}s`;
      svg.appendChild(smokeEl);
    }
  }

  // ── Dojo (Japanese training hall) ────────────────────────────────────────
  if (type === 'dojo') {
    // Warm lantern light
    for (let i = 0; i < 4; i++) {
      const lx = W*0.12 + i*(W*0.26);
      svg.appendChild(animG('flicker2', [
        rc.ellipse(lx, H*0.18, 14, 20, { stroke:pal.lacquer||'#AA2222', fill:pal.lamp||'#FFD060', fillStyle:'solid', roughness:1.2 }),
      ]));
      const lanternGlow = svgEl('ellipse', { cx:String(lx), cy:String(H*0.18), rx:'28', ry:'22', fill:pal.lamp||'#FFD060', opacity:'0.1' });
      lanternGlow.setAttribute('class', 'eyeGlow');
      svg.appendChild(lanternGlow);
      svg.appendChild(rc.line(lx, H*0.08, lx, H*0.18-10, { stroke:'#4A2810', strokeWidth:2, roughness:1.5 }));
    }
    // Wooden wall panels
    const woodPanels = pal.wood ? pal.wood : ['#6B4423','#8B5A2A'];
    for (let i = 0; i < 5; i++) {
      const px3 = i*(W/4.8);
      svg.appendChild(rc.rectangle(px3, H*0.08, W/5-3, H*0.57, { stroke:shadeColor(woodPanels[i%2],-15), fill:woodPanels[i%2], fillStyle:'hachure', roughness:1.5, strokeWidth:1.2 }));
    }
    // Tatami mat floor hint
    for (let i = 0; i < 4; i++) {
      svg.appendChild(rc.rectangle(i*(W/4), H*0.67, W/4-2, H*0.12, { stroke:shadeColor(pal.mat||'#8A7040',-15), fill:pal.mat||'#8A7040', fillStyle:'hachure', roughness:1.5 }));
    }
    // Calligraphy scroll on wall
    svg.appendChild(rc.rectangle(W*0.44, H*0.14, 20, 38, { stroke:'#2A1808', fill:pal.paper||'#F0E8D0', fillStyle:'solid', roughness:1.2 }));
    svg.appendChild(rc.line(W*0.454, H*0.17, W*0.454, H*0.14+30, { stroke:'#2A1808', strokeWidth:1.5, roughness:2 }));
    // Weapon rack
    svg.appendChild(rc.line(W*0.88, H*0.3, W*0.88, H*0.65, { stroke:'#4A2810', strokeWidth:4, roughness:1.5 }));
    for (let i = 0; i < 3; i++) {
      svg.appendChild(rc.line(W*0.82, H*0.35+i*10, W*0.94, H*0.35+i*10, { stroke:'#8B6020', strokeWidth:2.5, roughness:1.2 }));
    }
  }

  // ── Bamboo Forest ─────────────────────────────────────────────────────────
  if (type === 'bamboo_forest') {
    // Filtered light through canopy
    if (time === 'day' || !time) {
      svg.appendChild(rc.circle(W*0.5, H*0.05, 25, { stroke:'#E8FF88', fill:'#F0FF99', fillStyle:'solid', roughness:0.8 }));
    }
    // Bamboo stalks — dense forest
    const bambooColors = pal.bamboo || ['#6A9A30','#8AB840','#5A8A28'];
    for (let i = 0; i < 20; i++) {
      const bstX = sr()*W;
      const bstColor = bambooColors[i%bambooColors.length];
      const bstH = H*0.6 + sr()*0.2*H;
      const bambooEl = rc.line(bstX, H*0.75, bstX, H*0.75-bstH, { stroke:bstColor, strokeWidth:5+sr()*4, roughness:0.6 });
      bambooEl.setAttribute('class', 'idleSway');
      bambooEl.style.transformOrigin = `${bstX}px ${H*0.75}px`;
      bambooEl.style.animationDelay = `${sr()*2}s`;
      bambooEl.style.animationDuration = `${2+sr()*2}s`;
      svg.appendChild(bambooEl);
      // Node segments
      for (let n = 0; n < 5; n++) {
        const ny = H*0.75 - (n+1)*(bstH/6);
        if (ny > H*0.1) {
          svg.appendChild(rc.line(bstX-4, ny, bstX+4, ny, { stroke:shadeColor(bstColor,-20), strokeWidth:2, roughness:1 }));
        }
      }
      // Leaves at top
      if (sr() > 0.3) {
        svg.appendChild(rc.ellipse(bstX + sr()*20-10, H*0.75-bstH+5, 18+sr()*10, 6, { stroke:pal.leaf||'#A8D840', fill:pal.leaf||'#A8D840'+'88', fillStyle:'solid', roughness:2 }));
      }
    }
    // Mist layer
    const mistEl = svgEl('rect', { x:'0', y:String(H*0.4), width:String(W), height:String(H*0.2), fill:pal.mist||'rgba(80,140,50,0.3)', opacity:'0.8' });
    svg.appendChild(mistEl);
    // Stone lantern
    svg.appendChild(rc.rectangle(W*0.45, H*0.58, 18, 10, { stroke:'#4A4040', fill:'#5A5050', fillStyle:'solid', roughness:1.5 }));
    svg.appendChild(rc.rectangle(W*0.43, H*0.68, 22, 6, { stroke:'#4A4040', fill:'#5A5050', fillStyle:'solid', roughness:1.5 }));
    svg.appendChild(rc.ellipse(W*0.454, H*0.55, 14, 14, { stroke:'#4A4040', fill:pal.lantern||'#FFD080'+'88', fillStyle:'solid', roughness:1.5 }));
  }

  // ── Japanese Fortress ─────────────────────────────────────────────────────
  if (type === 'fortress_jp') {
    // Night sky, stars
    for (let i = 0; i < 25; i++) {
      svg.appendChild(rc.circle(sr()*W, sr()*H*0.45, 1+sr()*1.5, { stroke:'none', fill:'#FFFDE7', fillStyle:'solid', roughness:0.3 }));
    }
    // Fortress walls — dark stone
    const stoneF = pal.stone ? pal.stone[0] : '#3A3848';
    svg.appendChild(rc.rectangle(0, H*0.42, W, H*0.28, { stroke:shadeColor(stoneF,-15), fill:stoneF, fillStyle:'hachure', roughness:1.8, strokeWidth:1.5 }));
    // Battlements
    for (let i = 0; i < 16; i++) {
      svg.appendChild(rc.rectangle(i*(W/15)-2, H*0.38, W/16, 6, { stroke:shadeColor(stoneF,-20), fill:stoneF, fillStyle:'solid', roughness:1.5 }));
    }
    // Central tower gate
    svg.appendChild(rc.rectangle(W*0.38, H*0.18, W*0.24, H*0.25, { stroke:shadeColor(stoneF,-10), fill:pal.stone?pal.stone[1]:stoneF, fillStyle:'hachure', roughness:1.5 }));
    // Pagoda-style roof on gate
    svg.appendChild(rc.polygon([[W*0.32,H*0.22],[W*0.68,H*0.22],[W*0.6,H*0.12],[W*0.4,H*0.12]], { stroke:shadeColor(pal.wood?pal.wood[0]:'#4A3018',-20), fill:pal.wood?pal.wood[0]:'#4A3018', fillStyle:'solid', roughness:1.8 }));
    svg.appendChild(rc.polygon([[W*0.36,H*0.18],[W*0.64,H*0.18],[W*0.57,H*0.10],[W*0.43,H*0.10]], { stroke:shadeColor(pal.lacquer||'#CC2222',-20), fill:pal.lacquer||'#CC2222', fillStyle:'solid', roughness:1.5 }));
    // Banners
    for (let b = 0; b < 4; b++) {
      const banX = W*0.1 + b*(W*0.25);
      svg.appendChild(rc.line(banX, H*0.30, banX, H*0.42, { stroke:'#3A2010', strokeWidth:2.5, roughness:1.5 }));
      svg.appendChild(rc.rectangle(banX-1, H*0.30, 12, 18, { stroke:pal.banner||'#CC2222', fill:pal.banner||'#CC2222', fillStyle:'solid', roughness:1.8 }));
    }
    // Torches on walls
    for (let t = 0; t < 3; t++) {
      const tx3 = W*0.2 + t*(W*0.3);
      svg.appendChild(animG('flicker', [
        rc.circle(tx3, H*0.40, 6, { stroke:pal.torch||'#FF8030', fill:pal.torch||'#FF6020', fillStyle:'solid', roughness:1 }),
      ]));
      const torchGlow = svgEl('ellipse', { cx:String(tx3), cy:String(H*0.40), rx:'16', ry:'12', fill:pal.torch||'#FF8030', opacity:'0.15' });
      torchGlow.setAttribute('class', 'eyeGlow');
      svg.appendChild(torchGlow);
    }
  }

  // ── Bunker (Post-Apoc interior) ───────────────────────────────────────────
  if (type === 'bunker') {
    // Concrete walls — industrial grey
    const metalB = pal.metal ? pal.metal[0] : '#3A3A3A';
    for (let i = 0; i < 4; i++) {
      const bpX = i*(W/3.5);
      svg.appendChild(rc.rectangle(bpX, H*0.08, W/3.8, H*0.60, { stroke:shadeColor(metalB,-15), fill:pal.metal?pal.metal[i%pal.metal.length]:metalB, fillStyle:'hachure', roughness:0.8, strokeWidth:1.2 }));
    }
    // Emergency lighting — green strips
    for (let i = 0; i < 5; i++) {
      const lightEl = svgEl('rect', { x:String(i*(W/5)), y:String(H*0.68), width:String(W/5.5), height:'4', fill:pal.light||'#88AA44', opacity:'0.7' });
      lightEl.setAttribute('class', 'eyeGlow'); lightEl.style.animationDelay = `${i*0.4}s`;
      svg.appendChild(lightEl);
      const glowEl3 = svgEl('rect', { x:String(i*(W/5)-4), y:String(H*0.65), width:String(W/5.5+8), height:'10', fill:pal.light||'#88AA44', opacity:'0.1' });
      glowEl3.setAttribute('class', 'eyeGlow'); glowEl3.style.animationDelay = `${i*0.4}s`;
      svg.appendChild(glowEl3);
    }
    // Pipes on ceiling
    for (let i = 0; i < 3; i++) {
      svg.appendChild(rc.line(0, H*(0.12+i*0.05), W, H*(0.12+i*0.05), { stroke:pal.pipe||'#4A4A4A', strokeWidth:4+i*2, roughness:0.8 }));
    }
    // Vault door in background
    svg.appendChild(rc.circle(W*0.5, H*0.38, 38, { stroke:pal.metal?pal.metal[1]:'#2E2E2E', fill:pal.metal?pal.metal[0]:'#3A3A3A', fillStyle:'solid', roughness:0.6, strokeWidth:4 }));
    // Vault handle
    svg.appendChild(rc.line(W*0.5-18, H*0.38, W*0.5+18, H*0.38, { stroke:pal.rust||'#6A3018', strokeWidth:6, roughness:0.5 }));
    // Rust stains
    for (let i = 0; i < 6; i++) {
      const rEl = svgEl('ellipse', { cx:String(sr()*W), cy:String(H*0.2+sr()*0.4*H), rx:String(4+sr()*8), ry:String(2+sr()*4), fill:pal.rust||'#6A3018', opacity:String(0.2+sr()*0.3) });
      svg.appendChild(rEl);
    }
  }

  // ── Ruined City (Post-Apoc exterior) ────────────────────────────────────
  if (type === 'ruined_city') {
    // Hazy smog sky — no visible sun
    const smogEl2 = svgEl('rect', { x:'0', y:'0', width:String(W), height:String(H*0.6), fill:pal.smoke||'rgba(80,60,40,0.35)' });
    svg.appendChild(smogEl2);
    // Crumbled skyscrapers
    for (let i = 0; i < 10; i++) {
      const rx3 = i*(W/9) + sr()*12-6;
      const rh = 30 + sr()*100;
      const rw = 20 + sr()*35;
      const rubble = pal.rubble ? pal.rubble[i%pal.rubble.length] : '#5A4A38';
      // Jagged top — ruined
      const jaggedTop = [
        [rx3-rw/2, H*0.65-rh],
        [rx3-rw/2+sr()*8, H*0.65-rh+sr()*15],
        [rx3, H*0.65-rh-sr()*10],
        [rx3+rw/3, H*0.65-rh+sr()*12],
        [rx3+rw/2, H*0.65-rh],
        [rx3+rw/2, H*0.65],
        [rx3-rw/2, H*0.65],
      ];
      svg.appendChild(rc.polygon(jaggedTop, { stroke:shadeColor(rubble,-20), fill:rubble, fillStyle:'hachure', roughness:2.8, strokeWidth:1.5 }));
      // Broken windows — dark holes
      for (let w2 = 0; w2 < 3; w2++) {
        if (sr() > 0.4) {
          svg.appendChild(rc.rectangle(rx3-rw/2+4+w2*10, H*0.65-rh+8+sr()*10, 7, 8, { stroke:'none', fill:'#1A1410', fillStyle:'solid', roughness:1.5 }));
        }
      }
    }
    // Fire glow on horizon (animated)
    for (let f = 0; f < 3; f++) {
      const fireEl = svgEl('ellipse', { cx:String(W*(0.2+f*0.3)), cy:String(H*0.65), rx:String(25+sr()*20), ry:'12', fill:pal.fire||'#FF6030', opacity:String(0.15+sr()*0.1) });
      fireEl.setAttribute('class', 'eyeGlow');
      svg.appendChild(fireEl);
    }
    // Rubble mounds on ground
    for (let i = 0; i < 8; i++) {
      const rmX = sr()*W, rmY = H*0.64+sr()*8;
      svg.appendChild(rc.ellipse(rmX, rmY, 20+sr()*30, 8, { stroke:shadeColor(pal.rubble?pal.rubble[0]:'#5A4A38',-10), fill:pal.rubble?pal.rubble[1]:'#4A3A28', fillStyle:'solid', roughness:2.5 }));
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

  // Stable serialized key for NPC list — forces redraw when NPCs change
  const npcsKey = npcs ? npcs.map(n => `${n.name}:${n.relationship}:${n.creatureType || n.role}`).join('|') : '';
  // Stable key for players
  const playersKey = players ? players.map(p => `${p.name}:${p.class}:${p.hp}`).join('|') : '';

  useEffect(() => {
    if (!svgRef.current) return;
    try {
      drawScene(svgRef.current, mergedScene, players, turnCount);
    } catch(e) {
      console.warn('SceneRenderer error:', e);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene?.type, scene?.time, scene?.weather, scene?.mood, scene?.inCombat, scene?.enemy, playersKey, turnCount, inCombat, enemy, npcsKey]);

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
