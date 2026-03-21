// ═══════════════════════════════════════════
//  CREATURE LIBRARY — Full Bezier Edition
//  Each creature is a function:
//    drawCreature(x, y, scale, faction, status, uid)
//  Returns { defs, svg } strings
//  x,y = foot position center
//  scale = 1.0 for full size
//  uid = unique ID prefix for gradients
// ═══════════════════════════════════════════

import { FACTION, STATUS, CREATURE_ANIM } from './artStyle.js';

// ── Shared helpers ─────────────────────────

function g(id, stops) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${
    stops.map(([o,c,a])=>`<stop offset="${o}%" stop-color="${c}" stop-opacity="${a??1}"/>`).join('')
  }</linearGradient>`;
}

function rg(id, cx, cy, r, stops, units='userSpaceOnUse') {
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" gradientUnits="${units}">${
    stops.map(([o,c,a])=>`<stop offset="${o}%" stop-color="${c}" stop-opacity="${a??1}"/>`).join('')
  }</radialGradient>`;
}

function eye(cx, cy, r, color, glowId, uid) {
  return `
    <circle cx="${cx}" cy="${cy}" r="${r*1.8}" fill="url(#${glowId})" opacity="0.7" class="eyeGlow"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>
    <circle cx="${cx-r*0.3}" cy="${cy-r*0.3}" r="${r*0.35}" fill="white" opacity="0.8"/>
  `;
}

function statusFilter(s) {
  if (s === 'dead') return 'saturate(0) brightness(0.5)';
  if (s === 'critical') return 'saturate(1.5) brightness(1.1)';
  if (s === 'bloodied') return 'saturate(0.7) brightness(0.85)';
  return '';
}

function animClass(type) {
  return CREATURE_ANIM[type] || '';
}

// ── GOBLIN ─────────────────────────────────
export function drawGoblin(x, y, sc, fac, status, uid, variant='dagger') {
  const f = FACTION[fac] || FACTION.enemy;
  const h = 32 * sc, w = 14 * sc;
  const id = `gb_${uid}`;

  const defs = `
    ${g(`${id}_body`, [[0,f.highlight],[50,f.primary],[100,f.shadow]])}
    ${g(`${id}_ear`,  [[0,f.primary],[100,f.shadow]])}
    ${rg(`${id}_eye`, x, y-h*0.82, 6*sc, [[0,f.eye,1],[100,f.eye,0]])}
    ${rg(`${id}_glow`, x, y, 20*sc, [[0,f.underGlow,0.25],[100,f.underGlow,0]])}
  `;

  const anim = animClass('goblin');
  const filt = statusFilter(status);

  const svg = `
    <g class="${anim}" style="transform-origin:${x}px ${y}px;filter:${filt}">
      <!-- Under glow -->
      <ellipse cx="${x}" cy="${y}" rx="${16*sc}" ry="${4*sc}" fill="url(#${id}_glow)"/>
      <!-- Feet -->
      <ellipse cx="${x-5*sc}" cy="${y}" rx="${5*sc}" ry="${2.5*sc}" fill="${f.shadow}"/>
      <ellipse cx="${x+5*sc}" cy="${y}" rx="${5*sc}" ry="${2.5*sc}" fill="${f.shadow}"/>
      <!-- Legs -->
      <path d="M${x-4*sc},${y-10*sc} Q${x-6*sc},${y-5*sc} ${x-5*sc},${y}" fill="${f.primary}" stroke="${f.shadow}" stroke-width="${0.5*sc}"/>
      <path d="M${x+4*sc},${y-10*sc} Q${x+6*sc},${y-5*sc} ${x+5*sc},${y}" fill="${f.primary}" stroke="${f.shadow}" stroke-width="${0.5*sc}"/>
      <!-- Body — hunched forward -->
      <path d="M${x-7*sc},${y-22*sc} Q${x-9*sc},${y-16*sc} ${x-6*sc},${y-10*sc} L${x+6*sc},${y-10*sc} Q${x+8*sc},${y-16*sc} ${x+7*sc},${y-22*sc} Q${x},${y-28*sc} ${x-7*sc},${y-22*sc}Z"
        fill="url(#${id}_body)" stroke="${f.shadow}" stroke-width="${0.5*sc}"/>
      <!-- Left ear -->
      <path d="M${x-7*sc},${y-24*sc} L${x-12*sc},${y-30*sc} L${x-4*sc},${y-22*sc}Z" fill="url(#${id}_ear)"/>
      <!-- Right ear -->
      <path d="M${x+7*sc},${y-24*sc} L${x+12*sc},${y-30*sc} L${x+4*sc},${y-22*sc}Z" fill="url(#${id}_ear)"/>
      <!-- Head -->
      <ellipse cx="${x}" cy="${y-h*0.82}" rx="${7*sc}" ry="${6.5*sc}" fill="url(#${id}_body)" stroke="${f.shadow}" stroke-width="${0.5*sc}"/>
      <!-- Nose -->
      <ellipse cx="${x}" cy="${y-h*0.78}" rx="${2*sc}" ry="${1.5*sc}" fill="${f.shadow}"/>
      <!-- Eyes -->
      ${eye(x-3*sc, y-h*0.86, 1.8*sc, f.eye, `${id}_eye`, uid)}
      ${eye(x+3*sc, y-h*0.86, 1.8*sc, f.eye, `${id}_eye`, uid)}
      <!-- Arms -->
      <path d="M${x-7*sc},${y-20*sc} Q${x-14*sc},${y-17*sc} ${x-12*sc},${y-12*sc}" fill="none" stroke="${f.primary}" stroke-width="${4*sc}" stroke-linecap="round"/>
      <path d="M${x+7*sc},${y-20*sc} Q${x+14*sc},${y-17*sc} ${x+12*sc},${y-12*sc}" fill="none" stroke="${f.primary}" stroke-width="${4*sc}" stroke-linecap="round"/>
      ${variant==='dagger' ? `
        <!-- Dagger -->
        <rect x="${x+11*sc}" y="${y-16*sc}" width="${1.5*sc}" height="${8*sc}" rx="${0.5*sc}" fill="#c0c0c0" transform="rotate(-20,${x+12*sc},${y-12*sc})"/>
        <rect x="${x+10*sc}" y="${y-16.5*sc}" width="${3.5*sc}" height="${1.5*sc}" rx="${0.3*sc}" fill="#a08040"/>
      ` : variant==='archer' ? `
        <!-- Bow -->
        <path d="M${x+10*sc},${y-18*sc} Q${x+16*sc},${y-14*sc} ${x+10*sc},${y-8*sc}" fill="none" stroke="#8B5A00" stroke-width="${1.5*sc}"/>
        <line x1="${x+10*sc}" y1="${y-18*sc}" x2="${x+10*sc}" y2="${y-8*sc}" stroke="#c0a060" stroke-width="${0.8*sc}"/>
      ` : `
        <!-- Staff -->
        <line x1="${x+12*sc}" y1="${y-20*sc}" x2="${x+11*sc}" y2="${y-6*sc}" stroke="#8B5A00" stroke-width="${2*sc}"/>
        <circle cx="${x+12*sc}" cy="${y-21*sc}" r="${2.5*sc}" fill="${f.eye}" opacity="0.9" class="eyeGlow"/>
      `}
      <!-- Highlight rim light -->
      <path d="M${x-6*sc},${y-24*sc} Q${x-9*sc},${y-18*sc} ${x-5*sc},${y-10*sc}" fill="none" stroke="${f.highlight}" stroke-width="${0.8*sc}" opacity="0.5"/>
    </g>
  `;
  return { defs, svg };
}

// ── ORC ────────────────────────────────────
export function drawOrc(x, y, sc, fac, status, uid, variant='warrior') {
  const f = FACTION[fac] || FACTION.enemy;
  const id = `oc_${uid}`;

  const defs = `
    ${g(`${id}_body`, [[0,f.highlight],[40,f.primary],[100,f.shadow]])}
    ${g(`${id}_armor`, [[0,'#606060'],[50,'#404040'],[100,'#202020']])}
    ${rg(`${id}_eye`, x, y-38*sc, 8*sc, [[0,f.eye,1],[100,f.eye,0]])}
    ${rg(`${id}_glow`, x, y, 26*sc, [[0,f.underGlow,0.3],[100,f.underGlow,0]])}
  `;

  const svg = `
    <g class="${animClass('orc')}" style="transform-origin:${x}px ${y}px;filter:${statusFilter(status)}">
      <ellipse cx="${x}" cy="${y}" rx="${20*sc}" ry="${5*sc}" fill="url(#${id}_glow)"/>
      <!-- Feet/boots -->
      <ellipse cx="${x-8*sc}" cy="${y}" rx="${7*sc}" ry="${3*sc}" fill="#303030"/>
      <ellipse cx="${x+8*sc}" cy="${y}" rx="${7*sc}" ry="${3*sc}" fill="#303030"/>
      <!-- Legs -->
      <rect x="${x-13*sc}" y="${y-18*sc}" width="${10*sc}" height="${18*sc}" rx="${4*sc}" fill="url(#${id}_body)"/>
      <rect x="${x+3*sc}"  y="${y-18*sc}" width="${10*sc}" height="${18*sc}" rx="${4*sc}" fill="url(#${id}_body)"/>
      <!-- Body — broad, armored -->
      <path d="M${x-14*sc},${y-40*sc} Q${x-16*sc},${y-25*sc} ${x-12*sc},${y-18*sc} L${x+12*sc},${y-18*sc} Q${x+16*sc},${y-25*sc} ${x+14*sc},${y-40*sc} Q${x+8*sc},${y-48*sc} ${x},${y-48*sc} Q${x-8*sc},${y-48*sc} ${x-14*sc},${y-40*sc}Z"
        fill="url(#${id}_body)" stroke="${f.shadow}" stroke-width="${0.8*sc}"/>
      <!-- Armor chest -->
      <path d="M${x-10*sc},${y-44*sc} L${x+10*sc},${y-44*sc} L${x+12*sc},${y-28*sc} L${x-12*sc},${y-28*sc}Z"
        fill="url(#${id}_armor)" opacity="0.8"/>
      <!-- Shoulder pads -->
      <ellipse cx="${x-15*sc}" cy="${y-40*sc}" rx="${7*sc}" ry="${5*sc}" fill="url(#${id}_armor)"/>
      <ellipse cx="${x+15*sc}" cy="${y-40*sc}" rx="${7*sc}" ry="${5*sc}" fill="url(#${id}_armor)"/>
      <!-- Head -->
      <ellipse cx="${x}" cy="${y-54*sc}" rx="${10*sc}" ry="${9*sc}" fill="url(#${id}_body)" stroke="${f.shadow}" stroke-width="${0.8*sc}"/>
      <!-- Jaw/tusks -->
      <path d="M${x-6*sc},${y-48*sc} Q${x},${y-44*sc} ${x+6*sc},${y-48*sc}" fill="${f.primary}"/>
      <path d="M${x-4*sc},${y-48*sc} L${x-3*sc},${y-44*sc}" stroke="#e8e8c0" stroke-width="${1.5*sc}" stroke-linecap="round"/>
      <path d="M${x+4*sc},${y-48*sc} L${x+3*sc},${y-44*sc}" stroke="#e8e8c0" stroke-width="${1.5*sc}" stroke-linecap="round"/>
      <!-- Brow ridge -->
      <path d="M${x-8*sc},${y-57*sc} Q${x},${y-61*sc} ${x+8*sc},${y-57*sc}" fill="${f.shadow}" stroke="${f.shadow}" stroke-width="${2*sc}"/>
      <!-- Eyes -->
      ${eye(x-4*sc, y-57*sc, 2.2*sc, f.eye, `${id}_eye`, uid)}
      ${eye(x+4*sc, y-57*sc, 2.2*sc, f.eye, `${id}_eye`, uid)}
      <!-- Arms -->
      <path d="M${x-14*sc},${y-40*sc} Q${x-22*sc},${y-30*sc} ${x-20*sc},${y-18*sc}" fill="none" stroke="${f.primary}" stroke-width="${8*sc}" stroke-linecap="round"/>
      <path d="M${x+14*sc},${y-40*sc} Q${x+22*sc},${y-30*sc} ${x+20*sc},${y-18*sc}" fill="none" stroke="${f.primary}" stroke-width="${8*sc}" stroke-linecap="round"/>
      ${variant==='warrior' ? `
        <rect x="${x+18*sc}" y="${y-28*sc}" width="${3*sc}" height="${18*sc}" rx="${1*sc}" fill="#a0a0a0"/>
        <rect x="${x+15*sc}" y="${y-30*sc}" width="${9*sc}" height="${3*sc}" rx="${1*sc}" fill="#808080"/>
        <!-- Shield hint -->
        <path d="M${x-28*sc},${y-38*sc} Q${x-32*sc},${y-28*sc} ${x-28*sc},${y-18*sc} L${x-20*sc},${y-18*sc} L${x-20*sc},${y-38*sc}Z" fill="url(#${id}_armor)" opacity="0.9"/>
      ` : `
        <!-- Two-handed axe -->
        <rect x="${x+18*sc}" y="${y-32*sc}" width="${2.5*sc}" height="${20*sc}" rx="${1*sc}" fill="#8B5A00"/>
        <path d="M${x+20*sc},${y-38*sc} Q${x+28*sc},${y-34*sc} ${x+26*sc},${y-28*sc} Q${x+24*sc},${y-24*sc} ${x+20*sc},${y-26*sc}Z" fill="#808080"/>
        <path d="M${x+20*sc},${y-38*sc} Q${x+14*sc},${y-34*sc} ${x+16*sc},${y-28*sc} Q${x+18*sc},${y-24*sc} ${x+20*sc},${y-26*sc}Z" fill="#606060"/>
      `}
      <!-- Highlight -->
      <path d="M${x-12*sc},${y-46*sc} Q${x-14*sc},${y-35*sc} ${x-10*sc},${y-20*sc}" fill="none" stroke="${f.highlight}" stroke-width="${1*sc}" opacity="0.4"/>
    </g>
  `;
  return { defs, svg };
}

// ── SKELETON ───────────────────────────────
export function drawSkeleton(x, y, sc, fac, status, uid, variant='warrior') {
  const f = FACTION.undead;
  const id = `sk_${uid}`;

  const defs = `
    ${g(`${id}_bone`, [[0,'#e8e8d8'],[50,'#c8c8b0'],[100,'#888878']])}
    ${rg(`${id}_eye`, x, y-42*sc, 6*sc, [[0,f.eye,1],[100,f.eye,0]])}
    ${rg(`${id}_glow`, x, y, 18*sc, [[0,f.underGlow,0.2],[100,f.underGlow,0]])}
  `;

  const svg = `
    <g class="${animClass('skeleton')}" style="transform-origin:${x}px ${y}px;filter:${statusFilter(status)}">
      <ellipse cx="${x}" cy="${y}" rx="${14*sc}" ry="${3.5*sc}" fill="url(#${id}_glow)"/>
      <!-- Feet bones -->
      <path d="M${x-6*sc},${y-2*sc} L${x-10*sc},${y} L${x-4*sc},${y}Z" fill="url(#${id}_bone)"/>
      <path d="M${x+6*sc},${y-2*sc} L${x+4*sc},${y} L${x+10*sc},${y}Z" fill="url(#${id}_bone)"/>
      <!-- Lower legs -->
      <line x1="${x-6*sc}" y1="${y-2*sc}" x2="${x-5*sc}" y2="${y-14*sc}" stroke="#c8c8b0" stroke-width="${2.5*sc}" stroke-linecap="round"/>
      <line x1="${x+6*sc}" y1="${y-2*sc}" x2="${x+5*sc}" y2="${y-14*sc}" stroke="#c8c8b0" stroke-width="${2.5*sc}" stroke-linecap="round"/>
      <!-- Knee bones -->
      <circle cx="${x-5*sc}" cy="${y-14*sc}" r="${2*sc}" fill="url(#${id}_bone)"/>
      <circle cx="${x+5*sc}" cy="${y-14*sc}" r="${2*sc}" fill="url(#${id}_bone)"/>
      <!-- Upper legs -->
      <line x1="${x-5*sc}" y1="${y-14*sc}" x2="${x-6*sc}" y2="${y-26*sc}" stroke="#c8c8b0" stroke-width="${3*sc}" stroke-linecap="round"/>
      <line x1="${x+5*sc}" y1="${y-14*sc}" x2="${x+6*sc}" y2="${y-26*sc}" stroke="#c8c8b0" stroke-width="${3*sc}" stroke-linecap="round"/>
      <!-- Pelvis -->
      <path d="M${x-8*sc},${y-26*sc} Q${x-6*sc},${y-30*sc} ${x},${y-28*sc} Q${x+6*sc},${y-30*sc} ${x+8*sc},${y-26*sc} Q${x+4*sc},${y-24*sc} ${x-4*sc},${y-24*sc}Z" fill="url(#${id}_bone)"/>
      <!-- Spine -->
      ${[0,1,2,3].map(i=>`<ellipse cx="${x}" cy="${y-(28+i*4)*sc}" rx="${3*sc}" ry="${1.8*sc}" fill="url(#${id}_bone)"/>`).join('')}
      <!-- Ribcage -->
      <path d="M${x-9*sc},${y-40*sc} Q${x-11*sc},${y-34*sc} ${x-8*sc},${y-28*sc} L${x+8*sc},${y-28*sc} Q${x+11*sc},${y-34*sc} ${x+9*sc},${y-40*sc}Z"
        fill="none" stroke="url(#${id}_bone)" stroke-width="${1.5*sc}"/>
      <!-- Ribs -->
      ${[-36,-32,-28].map(yy=>`
        <path d="M${x},${y+yy*sc} Q${x-8*sc},${y+(yy-3)*sc} ${x-9*sc},${y+(yy)*sc}" fill="none" stroke="#c8c8b0" stroke-width="${1.2*sc}"/>
        <path d="M${x},${y+yy*sc} Q${x+8*sc},${y+(yy-3)*sc} ${x+9*sc},${y+(yy)*sc}" fill="none" stroke="#c8c8b0" stroke-width="${1.2*sc}"/>
      `).join('')}
      <!-- Collar bones -->
      <line x1="${x-9*sc}" y1="${y-40*sc}" x2="${x}" y2="${y-42*sc}" stroke="#c8c8b0" stroke-width="${2*sc}"/>
      <line x1="${x+9*sc}" y1="${y-40*sc}" x2="${x}" y2="${y-42*sc}" stroke="#c8c8b0" stroke-width="${2*sc}"/>
      <!-- Arms -->
      <line x1="${x-9*sc}" y1="${y-40*sc}" x2="${x-14*sc}" y2="${y-30*sc}" stroke="#c8c8b0" stroke-width="${2.5*sc}" stroke-linecap="round"/>
      <line x1="${x-14*sc}" y1="${y-30*sc}" x2="${x-12*sc}" y2="${y-18*sc}" stroke="#c8c8b0" stroke-width="${2*sc}" stroke-linecap="round"/>
      <line x1="${x+9*sc}" y1="${y-40*sc}" x2="${x+14*sc}" y2="${y-30*sc}" stroke="#c8c8b0" stroke-width="${2.5*sc}" stroke-linecap="round"/>
      <line x1="${x+14*sc}" y1="${y-30*sc}" x2="${x+12*sc}" y2="${y-18*sc}" stroke="#c8c8b0" stroke-width="${2*sc}" stroke-linecap="round"/>
      <!-- Skull -->
      <ellipse cx="${x}" cy="${y-48*sc}" rx="${8*sc}" ry="${7*sc}" fill="url(#${id}_bone)"/>
      <!-- Jaw -->
      <path d="M${x-6*sc},${y-44*sc} Q${x},${y-40*sc} ${x+6*sc},${y-44*sc} L${x+5*sc},${y-42*sc} Q${x},${y-44*sc} ${x-5*sc},${y-42*sc}Z" fill="url(#${id}_bone)"/>
      <!-- Teeth -->
      ${[-3,-1,1,3].map(tx=>`<rect x="${x+tx*sc-0.6*sc}" y="${y-44*sc}" width="${1.2*sc}" height="${2*sc}" fill="white" opacity="0.8"/>`).join('')}
      <!-- Eye sockets — glowing green -->
      <ellipse cx="${x-3.5*sc}" cy="${y-49*sc}" rx="${2.5*sc}" ry="${2*sc}" fill="#0a1008"/>
      <ellipse cx="${x+3.5*sc}" cy="${y-49*sc}" rx="${2.5*sc}" ry="${2*sc}" fill="#0a1008"/>
      ${eye(x-3.5*sc, y-49*sc, 1.5*sc, f.eye, `${id}_eye`, uid)}
      ${eye(x+3.5*sc, y-49*sc, 1.5*sc, f.eye, `${id}_eye`, uid)}
      <!-- Nose cavity -->
      <path d="M${x-1.5*sc},${y-46*sc} L${x},${y-43*sc} L${x+1.5*sc},${y-46*sc}Z" fill="#0a1008"/>
      ${variant==='warrior' ? `
        <rect x="${x+11*sc}" y="${y-28*sc}" width="${2.5*sc}" height="${16*sc}" rx="${1*sc}" fill="#b0b0a0"/>
        <path d="M${x-20*sc},${y-40*sc} Q${x-22*sc},${y-30*sc} ${x-20*sc},${y-20*sc} L${x-12*sc},${y-20*sc} L${x-12*sc},${y-40*sc}Z" fill="#808070" opacity="0.9"/>
      ` : `
        <!-- Archer bow -->
        <path d="M${x+12*sc},${y-28*sc} Q${x+18*sc},${y-23*sc} ${x+12*sc},${y-14*sc}" fill="none" stroke="#8B5A00" stroke-width="${1.5*sc}"/>
      `}
    </g>
  `;
  return { defs, svg };
}

// ── GHOST ─────────────────────────────────
export function drawGhost(x, y, sc, fac, status, uid) {
  const f = FACTION.magic;
  const id = `gh_${uid}`;

  const defs = `
    ${g(`${id}_body`, [[0,'#d0e8ff',0.9],[50,'#a0c8ff',0.75],[100,'#6090c0',0.4]])}
    ${rg(`${id}_eye`, x, y-30*sc, 8*sc, [[0,f.eye,1],[100,f.eye,0]])}
    ${rg(`${id}_aura`, x, y-20*sc, 30*sc, [[0,'#80c0ff',0.15],[100,'#80c0ff',0]])}
  `;

  const svg = `
    <g class="${animClass('ghost')}" style="transform-origin:${x}px ${y-20*sc}px;filter:${statusFilter(status)}">
      <ellipse cx="${x}" cy="${y-10*sc}" rx="${28*sc}" ry="${8*sc}" fill="url(#${id}_aura)"/>
      <!-- Wispy tail -->
      <path d="M${x-12*sc},${y-5*sc} Q${x-16*sc},${y+2*sc} ${x-10*sc},${y+6*sc} Q${x-4*sc},${y+10*sc} ${x},${y+4*sc} Q${x+4*sc},${y+10*sc} ${x+10*sc},${y+6*sc} Q${x+16*sc},${y+2*sc} ${x+12*sc},${y-5*sc}"
        fill="url(#${id}_body)" stroke="none"/>
      <!-- Body -->
      <path d="M${x-12*sc},${y-20*sc} Q${x-14*sc},${y-12*sc} ${x-12*sc},${y-5*sc} Q${x},${y-2*sc} ${x+12*sc},${y-5*sc} Q${x+14*sc},${y-12*sc} ${x+12*sc},${y-20*sc} Q${x+10*sc},${y-38*sc} ${x},${y-40*sc} Q${x-10*sc},${y-38*sc} ${x-12*sc},${y-20*sc}Z"
        fill="url(#${id}_body)"/>
      <!-- Arms — wispy -->
      <path d="M${x-12*sc},${y-26*sc} Q${x-22*sc},${y-24*sc} ${x-20*sc},${y-18*sc} Q${x-18*sc},${y-14*sc} ${x-14*sc},${y-20*sc}" fill="url(#${id}_body)" opacity="0.7"/>
      <path d="M${x+12*sc},${y-26*sc} Q${x+22*sc},${y-24*sc} ${x+20*sc},${y-18*sc} Q${x+18*sc},${y-14*sc} ${x+14*sc},${y-20*sc}" fill="url(#${id}_body)" opacity="0.7"/>
      <!-- Face -->
      <ellipse cx="${x}" cy="${y-30*sc}" rx="${9*sc}" ry="${8*sc}" fill="url(#${id}_body)" opacity="0.9"/>
      <!-- Hollow eyes -->
      <ellipse cx="${x-3.5*sc}" cy="${y-31*sc}" rx="${2.5*sc}" ry="${3*sc}" fill="#1a2a3a" opacity="0.8"/>
      <ellipse cx="${x+3.5*sc}" cy="${y-31*sc}" rx="${2.5*sc}" ry="${3*sc}" fill="#1a2a3a" opacity="0.8"/>
      ${eye(x-3.5*sc, y-31*sc, 2*sc, '#88ccff', `${id}_eye`, uid)}
      ${eye(x+3.5*sc, y-31*sc, 2*sc, '#88ccff', `${id}_eye`, uid)}
      <!-- Mouth — wailing O -->
      <ellipse cx="${x}" cy="${y-24*sc}" rx="${2.5*sc}" ry="${3*sc}" fill="#0a1a2a" opacity="0.7"/>
      <!-- Inner glow -->
      <ellipse cx="${x}" cy="${y-28*sc}" rx="${6*sc}" ry="${8*sc}" fill="white" opacity="0.08"/>
    </g>
  `;
  return { defs, svg };
}

// ── DRAGON ─────────────────────────────────
export function drawDragon(x, y, sc, fac, status, uid) {
  const f = FACTION.boss;
  const id = `dr_${uid}`;

  const defs = `
    ${g(`${id}_body`, [[0,'#4a1a6a'],[30,'#2a0a4a'],[70,'#1a0030'],[100,'#0a0018']])}
    ${g(`${id}_wing`, [[0,'#3a1050',0.9],[50,'#200840',0.8],[100,'#100020',0.6]])}
    ${g(`${id}_belly`, [[0,'#6a2a20'],[50,'#4a1a10'],[100,'#2a0a08']])}
    ${rg(`${id}_eye`, x+20*sc, y-55*sc, 10*sc, [[0,'#ff4400',1],[80,'#ff2200',0.5],[100,'#ff0000',0]])}
    ${rg(`${id}_fire`, x+30*sc, y-40*sc, 25*sc, [[0,'#ffaa00',0.8],[50,'#ff4400',0.5],[100,'#ff0000',0]])}
    ${rg(`${id}_glow`, x, y, 50*sc, [[0,f.underGlow,0.3],[100,f.underGlow,0]])}
  `;

  const svg = `
    <g class="${animClass('dragon')}" style="transform-origin:${x}px ${y}px;filter:${statusFilter(status)}">
      <ellipse cx="${x}" cy="${y}" rx="${45*sc}" ry="${10*sc}" fill="url(#${id}_glow)"/>
      <!-- Left wing -->
      <path d="M${x-5*sc},${y-50*sc} Q${x-40*sc},${y-90*sc} ${x-70*sc},${y-60*sc} Q${x-60*sc},${y-40*sc} ${x-20*sc},${y-40*sc}Z"
        fill="url(#${id}_wing)" stroke="${f.shadow}" stroke-width="${0.8*sc}"/>
      <!-- Wing membrane lines -->
      <line x1="${x-5*sc}" y1="${y-50*sc}" x2="${x-55*sc}" y2="${y-70*sc}" stroke="#3a0a50" stroke-width="${0.6*sc}" opacity="0.5"/>
      <line x1="${x-5*sc}" y1="${y-50*sc}" x2="${x-45*sc}" y2="${y-55*sc}" stroke="#3a0a50" stroke-width="${0.6*sc}" opacity="0.5"/>
      <!-- Right wing -->
      <path d="M${x+5*sc},${y-50*sc} Q${x+40*sc},${y-90*sc} ${x+70*sc},${y-60*sc} Q${x+60*sc},${y-40*sc} ${x+20*sc},${y-40*sc}Z"
        fill="url(#${id}_wing)" stroke="${f.shadow}" stroke-width="${0.8*sc}"/>
      <line x1="${x+5*sc}" y1="${y-50*sc}" x2="${x+55*sc}" y2="${y-70*sc}" stroke="#3a0a50" stroke-width="${0.6*sc}" opacity="0.5"/>
      <!-- Tail -->
      <path d="M${x-15*sc},${y-10*sc} Q${x-40*sc},${y-5*sc} ${x-60*sc},${y+5*sc} Q${x-70*sc},${y+8*sc} ${x-65*sc},${y+3*sc}" fill="none" stroke="${f.primary}" stroke-width="${8*sc}" stroke-linecap="round"/>
      <path d="M${x-65*sc},${y+3*sc} L${x-72*sc},${y-2*sc} L${x-68*sc},${y+8*sc}Z" fill="${f.primary}"/>
      <!-- Hind legs -->
      <path d="M${x-10*sc},${y-10*sc} Q${x-18*sc},${y-5*sc} ${x-16*sc},${y}" fill="${f.primary}" stroke="${f.shadow}" stroke-width="${1*sc}"/>
      <path d="M${x+10*sc},${y-10*sc} Q${x+18*sc},${y-5*sc} ${x+16*sc},${y}" fill="${f.primary}" stroke="${f.shadow}" stroke-width="${1*sc}"/>
      <!-- Body mass -->
      <ellipse cx="${x}" cy="${y-30*sc}" rx="${22*sc}" ry="${28*sc}" fill="url(#${id}_body)"/>
      <!-- Belly scales -->
      <path d="M${x-8*sc},${y-10*sc} Q${x},${y-8*sc} ${x+8*sc},${y-10*sc} Q${x+6*sc},${y-30*sc} ${x},${y-32*sc} Q${x-6*sc},${y-30*sc} ${x-8*sc},${y-10*sc}Z"
        fill="url(#${id}_belly)" opacity="0.8"/>
      <!-- Scale texture lines -->
      ${[-20,-14,-8].map(yy=>{ const w=(8+Math.abs(yy/3))*sc; return `<path d="M${x-w},${y+yy*sc} Q${x},${y+(yy-2)*sc} ${x+w},${y+yy*sc}" fill="none" stroke="${f.shadow}" stroke-width="${0.6*sc}" opacity="0.4"/>`;}).join('')}
      <!-- Neck -->
      <path d="M${x+5*sc},${y-55*sc} Q${x+10*sc},${y-48*sc} ${x+8*sc},${y-38*sc} Q${x+4*sc},${y-30*sc} ${x},${y-28*sc}" fill="none" stroke="${f.primary}" stroke-width="${12*sc}" stroke-linecap="round"/>
      <!-- Head -->
      <path d="M${x+8*sc},${y-68*sc} Q${x+25*sc},${y-65*sc} ${x+32*sc},${y-58*sc} Q${x+34*sc},${y-50*sc} ${x+26*sc},${y-46*sc} Q${x+14*sc},${y-46*sc} ${x+6*sc},${y-52*sc} Q${x+4*sc},${y-60*sc} ${x+8*sc},${y-68*sc}Z"
        fill="url(#${id}_body)" stroke="${f.shadow}" stroke-width="${0.8*sc}"/>
      <!-- Snout -->
      <path d="M${x+26*sc},${y-58*sc} Q${x+38*sc},${y-56*sc} ${x+40*sc},${y-52*sc} Q${x+38*sc},${y-48*sc} ${x+26*sc},${y-46*sc}Z"
        fill="${f.primary}"/>
      <!-- Nostril -->
      <circle cx="${x+35*sc}" cy="${y-54*sc}" r="${1.5*sc}" fill="${f.shadow}"/>
      <!-- Teeth -->
      ${[-2,0,2].map(tx=>`
        <path d="M${x+26*sc+tx*3*sc},${y-50*sc} L${x+27*sc+tx*3*sc},${y-46*sc} L${x+28*sc+tx*3*sc},${y-50*sc}Z" fill="#e0e0c0"/>
      `).join('')}
      <!-- Eye -->
      ${eye(x+16*sc, y-60*sc, 3.5*sc, '#ff4400', `${id}_eye`, uid)}
      <!-- Horns -->
      <path d="M${x+10*sc},${y-68*sc} Q${x+8*sc},${y-76*sc} ${x+14*sc},${y-72*sc}Z" fill="${f.shadow}"/>
      <path d="M${x+16*sc},${y-68*sc} Q${x+16*sc},${y-78*sc} ${x+22*sc},${y-73*sc}Z" fill="${f.shadow}"/>
      <!-- Forelegs -->
      <path d="M${x-5*sc},${y-20*sc} Q${x-16*sc},${y-12*sc} ${x-18*sc},${y-2*sc}" fill="none" stroke="${f.primary}" stroke-width="${7*sc}" stroke-linecap="round"/>
      <!-- Claws -->
      ${[-3,-1,1].map(cx=>`<path d="M${x-18*sc+cx*2*sc},${y-2*sc} L${x-18*sc+cx*2.5*sc},${y+4*sc}" stroke="${f.shadow}" stroke-width="${1.5*sc}" stroke-linecap="round"/>`).join('')}
      <!-- Breath glow hint -->
      <ellipse cx="${x+40*sc}" cy="${y-50*sc}" rx="${10*sc}" ry="${6*sc}" fill="url(#${id}_fire)" opacity="0.4" class="eyeGlow"/>
      <!-- Highlight rim -->
      <path d="M${x-15*sc},${y-55*sc} Q${x-20*sc},${y-40*sc} ${x-18*sc},${y-20*sc}" fill="none" stroke="#6a2a9a" stroke-width="${1.2*sc}" opacity="0.5"/>
    </g>
  `;
  return { defs, svg };
}

// ── TROLL ──────────────────────────────────
export function drawTroll(x, y, sc, fac, status, uid) {
  const f = FACTION[fac] || FACTION.enemy;
  const id = `tr_${uid}`;

  const defs = `
    ${g(`${id}_body`, [[0,'#5a6a30'],[40,'#3a4a20'],[100,'#1a2010']])}
    ${g(`${id}_skin`, [[0,'#6a7a3a'],[50,'#4a5a28'],[100,'#2a3018']])}
    ${rg(`${id}_eye`, x, y-60*sc, 8*sc, [[0,f.eye,1],[100,f.eye,0]])}
    ${rg(`${id}_glow`, x, y, 32*sc, [[0,f.underGlow,0.25],[100,f.underGlow,0]])}
  `;

  const svg = `
    <g class="${animClass('troll')}" style="transform-origin:${x}px ${y}px;filter:${statusFilter(status)}">
      <ellipse cx="${x}" cy="${y}" rx="${28*sc}" ry="${7*sc}" fill="url(#${id}_glow)"/>
      <!-- Huge feet -->
      <ellipse cx="${x-10*sc}" cy="${y}" rx="${11*sc}" ry="${4.5*sc}" fill="url(#${id}_body)"/>
      <ellipse cx="${x+10*sc}" cy="${y}" rx="${11*sc}" ry="${4.5*sc}" fill="url(#${id}_body)"/>
      <!-- Thick legs -->
      <rect x="${x-18*sc}" y="${y-22*sc}" width="${14*sc}" height="${22*sc}" rx="${5*sc}" fill="url(#${id}_skin)"/>
      <rect x="${x+4*sc}"  y="${y-22*sc}" width="${14*sc}" height="${22*sc}" rx="${5*sc}" fill="url(#${id}_skin)"/>
      <!-- Massive body -->
      <path d="M${x-20*sc},${y-55*sc} Q${x-24*sc},${y-35*sc} ${x-18*sc},${y-22*sc} L${x+18*sc},${y-22*sc} Q${x+24*sc},${y-35*sc} ${x+20*sc},${y-55*sc} Q${x+10*sc},${y-68*sc} ${x},${y-68*sc} Q${x-10*sc},${y-68*sc} ${x-20*sc},${y-55*sc}Z"
        fill="url(#${id}_skin)" stroke="#1a2010" stroke-width="${1*sc}"/>
      <!-- Belly moss/texture -->
      <path d="M${x-10*sc},${y-30*sc} Q${x},${y-28*sc} ${x+10*sc},${y-30*sc} Q${x+8*sc},${y-50*sc} ${x},${y-52*sc} Q${x-8*sc},${y-50*sc} ${x-10*sc},${y-30*sc}Z"
        fill="#4a5a28" opacity="0.6"/>
      <!-- Shoulders — enormous -->
      <ellipse cx="${x-22*sc}" cy="${y-52*sc}" rx="${9*sc}" ry="${7*sc}" fill="url(#${id}_skin)"/>
      <ellipse cx="${x+22*sc}" cy="${y-52*sc}" rx="${9*sc}" ry="${7*sc}" fill="url(#${id}_skin)"/>
      <!-- Neck -->
      <rect x="${x-8*sc}" y="${y-68*sc}" width="${16*sc}" height="${12*sc}" rx="${4*sc}" fill="url(#${id}_skin)"/>
      <!-- Head — huge and lumpy -->
      <path d="M${x-14*sc},${y-76*sc} Q${x-16*sc},${y-68*sc} ${x-14*sc},${y-62*sc} L${x+14*sc},${y-62*sc} Q${x+16*sc},${y-68*sc} ${x+14*sc},${y-76*sc} Q${x+6*sc},${y-85*sc} ${x},${y-85*sc} Q${x-6*sc},${y-85*sc} ${x-14*sc},${y-76*sc}Z"
        fill="url(#${id}_skin)" stroke="#1a2010" stroke-width="${0.8*sc}"/>
      <!-- Brow lumps -->
      <ellipse cx="${x-5*sc}" cy="${y-82*sc}" rx="${4*sc}" ry="${2.5*sc}" fill="#3a4a20"/>
      <ellipse cx="${x+5*sc}" cy="${y-82*sc}" rx="${4*sc}" ry="${2.5*sc}" fill="#3a4a20"/>
      <!-- Eyes sunken -->
      ${eye(x-5*sc, y-79*sc, 2.5*sc, f.eye, `${id}_eye`, uid)}
      ${eye(x+5*sc, y-79*sc, 2.5*sc, f.eye, `${id}_eye`, uid)}
      <!-- Nose — big warty -->
      <path d="M${x-3*sc},${y-73*sc} Q${x},${y-68*sc} ${x+3*sc},${y-73*sc}" fill="#3a4a20" stroke="#2a3018" stroke-width="${1*sc}"/>
      <circle cx="${x-2*sc}" cy="${y-70*sc}" r="${1.5*sc}" fill="#3a4a20"/>
      <circle cx="${x+2*sc}" cy="${y-70*sc}" r="${1.5*sc}" fill="#3a4a20"/>
      <!-- Mouth — wide grin -->
      <path d="M${x-8*sc},${y-65*sc} Q${x},${y-61*sc} ${x+8*sc},${y-65*sc}" fill="none" stroke="#1a2010" stroke-width="${1.5*sc}"/>
      <!-- Tusks -->
      <path d="M${x-5*sc},${y-65*sc} L${x-4*sc},${y-60*sc}" stroke="#e0dcc0" stroke-width="${2*sc}" stroke-linecap="round"/>
      <path d="M${x+5*sc},${y-65*sc} L${x+4*sc},${y-60*sc}" stroke="#e0dcc0" stroke-width="${2*sc}" stroke-linecap="round"/>
      <!-- Arms — dragging on ground -->
      <path d="M${x-22*sc},${y-52*sc} Q${x-32*sc},${y-40*sc} ${x-30*sc},${y-10*sc}" fill="none" stroke="#4a5a28" stroke-width="${12*sc}" stroke-linecap="round"/>
      <path d="M${x+22*sc},${y-52*sc} Q${x+30*sc},${y-35*sc} ${x+28*sc},${y-10*sc}" fill="none" stroke="#4a5a28" stroke-width="${12*sc}" stroke-linecap="round"/>
      <!-- Club -->
      <rect x="${x+25*sc}" y="${y-18*sc}" width="${6*sc}" height="${20*sc}" rx="${2*sc}" fill="#8B5A00"/>
      <ellipse cx="${x+28*sc}" cy="${y-20*sc}" rx="${7*sc}" ry="${5*sc}" fill="#6a4400"/>
      <!-- Knuckles/claws -->
      ${[-2,0,2].map(cx=>`<circle cx="${x-30*sc+cx*2*sc}" cy="${y-10*sc}" r="${2*sc}" fill="#2a3018"/>`).join('')}
      <!-- Highlight -->
      <path d="M${x-18*sc},${y-62*sc} Q${x-20*sc},${y-45*sc} ${x-16*sc},${y-24*sc}" fill="none" stroke="#8a9a50" stroke-width="${1.2*sc}" opacity="0.35"/>
    </g>
  `;
  return { defs, svg };
}

// ── ZOMBIE ─────────────────────────────────
export function drawZombie(x, y, sc, fac, status, uid) {
  const f = FACTION.undead;
  const id = `zm_${uid}`;

  const defs = `
    ${g(`${id}_body`, [[0,'#5a6a4a'],[50,'#3a4a30'],[100,'#1a2818']])}
    ${g(`${id}_skin`, [[0,'#7a7a5a'],[50,'#5a5a3a'],[100,'#2a2a1a']])}
    ${rg(`${id}_eye`, x, y-35*sc, 6*sc, [[0,f.eye,0.9],[100,f.eye,0]])}
    ${rg(`${id}_glow`, x, y, 18*sc, [[0,f.underGlow,0.2],[100,f.underGlow,0]])}
  `;

  const svg = `
    <g class="${animClass('zombie')}" style="transform-origin:${x}px ${y}px;filter:${statusFilter(status)}">
      <ellipse cx="${x}" cy="${y}" rx="${16*sc}" ry="${4*sc}" fill="url(#${id}_glow)"/>
      <!-- Shambling posture — forward lean -->
      <!-- Feet dragging -->
      <ellipse cx="${x-7*sc}" cy="${y}" rx="${6*sc}" ry="${2.5*sc}" fill="url(#${id}_body)"/>
      <ellipse cx="${x+5*sc}" cy="${y}" rx="${5*sc}" ry="${2.5*sc}" fill="url(#${id}_body)"/>
      <!-- Legs — uneven, shambling -->
      <path d="M${x-8*sc},${y-14*sc} Q${x-10*sc},${y-7*sc} ${x-7*sc},${y}" fill="url(#${id}_skin)" stroke="#1a2818" stroke-width="${0.5*sc}"/>
      <path d="M${x+4*sc},${y-16*sc} Q${x+8*sc},${y-8*sc} ${x+5*sc},${y}" fill="url(#${id}_skin)" stroke="#1a2818" stroke-width="${0.5*sc}"/>
      <!-- Body — hunched, ragged clothes -->
      <path d="M${x-10*sc},${y-30*sc} Q${x-12*sc},${y-20*sc} ${x-8*sc},${y-14*sc} L${x+8*sc},${y-16*sc} Q${x+10*sc},${y-22*sc} ${x+8*sc},${y-30*sc} Q${x+4*sc},${y-36*sc} ${x},${y-36*sc} Q${x-4*sc},${y-36*sc} ${x-10*sc},${y-30*sc}Z"
        fill="url(#${id}_body)" stroke="#1a2818" stroke-width="${0.5*sc}"/>
      <!-- Torn clothing texture -->
      <path d="M${x-8*sc},${y-28*sc} L${x-6*sc},${y-18*sc}" stroke="#1a2818" stroke-width="${0.6*sc}" opacity="0.6"/>
      <path d="M${x+4*sc},${y-26*sc} L${x+6*sc},${y-17*sc}" stroke="#1a2818" stroke-width="${0.6*sc}" opacity="0.6"/>
      <!-- Head — forward drooping -->
      <ellipse cx="${x+2*sc}" cy="${y-42*sc}" rx="${7.5*sc}" ry="${7*sc}" fill="url(#${id}_skin)" stroke="#1a2818" stroke-width="${0.5*sc}" transform="rotate(12,${x+2*sc},${y-42*sc})"/>
      <!-- Wounds/marks -->
      <path d="M${x-2*sc},${y-44*sc} L${x+2*sc},${y-42*sc}" stroke="#aa2020" stroke-width="${0.8*sc}" opacity="0.7"/>
      <!-- Sunken eyes — glowing -->
      <ellipse cx="${x-2*sc}" cy="${y-44*sc}" rx="${2*sc}" ry="${1.8*sc}" fill="#0a1008"/>
      <ellipse cx="${x+5*sc}" cy="${y-43*sc}" rx="${2*sc}" ry="${1.8*sc}" fill="#0a1008"/>
      ${eye(x-2*sc, y-44*sc, 1.3*sc, f.eye, `${id}_eye`, uid)}
      ${eye(x+5*sc, y-43*sc, 1.3*sc, f.eye, `${id}_eye`, uid)}
      <!-- Mouth agape -->
      <path d="M${x-2*sc},${y-38*sc} Q${x+2*sc},${y-36*sc} ${x+5*sc},${y-38*sc}" fill="none" stroke="#1a0808" stroke-width="${1.5*sc}"/>
      <!-- Arms outstretched — classic zombie -->
      <path d="M${x-10*sc},${y-28*sc} Q${x-20*sc},${y-28*sc} ${x-24*sc},${y-24*sc}" fill="none" stroke="${f.primary}" stroke-width="${5*sc}" stroke-linecap="round"/>
      <path d="M${x+8*sc},${y-28*sc} Q${x+18*sc},${y-26*sc} ${x+22*sc},${y-20*sc}" fill="none" stroke="${f.primary}" stroke-width="${5*sc}" stroke-linecap="round"/>
      <!-- Reaching fingers -->
      ${[0,1,2].map(i=>`<line x1="${x+22*sc}" y1="${y-20*sc}" x2="${x+24*sc+i*2*sc}" y2="${y-16*sc+i*1.5*sc}" stroke="#3a3a28" stroke-width="${1.5*sc}" stroke-linecap="round"/>`).join('')}
    </g>
  `;
  return { defs, svg };
}

// ── ALIEN GREY ─────────────────────────────
export function drawAlienGrey(x, y, sc, fac, status, uid) {
  const f = FACTION.alien;
  const id = `ag_${uid}`;

  const defs = `
    ${g(`${id}_body`, [[0,'#2a4a3a'],[40,'#1a3028'],[100,'#0a1814']])}
    ${g(`${id}_head`, [[0,'#3a5a4a'],[50,'#2a4038'],[100,'#141e1a']])}
    ${rg(`${id}_eye`, x-4*sc, y-32*sc, 8*sc, [[0,f.eye,1],[60,f.eye,0.6],[100,f.eye,0]])}
    ${rg(`${id}_scan`, x, y-20*sc, 30*sc, [[0,f.underGlow,0.15],[100,f.underGlow,0]])}
    ${rg(`${id}_glow`, x, y, 20*sc, [[0,f.underGlow,0.2],[100,f.underGlow,0]])}
  `;

  const svg = `
    <g class="${animClass('alien_grey')}" style="transform-origin:${x}px ${y}px;filter:${statusFilter(status)}">
      <!-- Scan aura -->
      <ellipse cx="${x}" cy="${y-20*sc}" rx="${28*sc}" ry="${20*sc}" fill="url(#${id}_scan)" class="eyeGlow"/>
      <ellipse cx="${x}" cy="${y}" rx="${18*sc}" ry="${5*sc}" fill="url(#${id}_glow)"/>
      <!-- Spindly legs -->
      <line x1="${x-3*sc}" y1="${y-10*sc}" x2="${x-5*sc}" y2="${y}" stroke="${f.primary}" stroke-width="${1.8*sc}" stroke-linecap="round"/>
      <line x1="${x+3*sc}" y1="${y-10*sc}" x2="${x+5*sc}" y2="${y}" stroke="${f.primary}" stroke-width="${1.8*sc}" stroke-linecap="round"/>
      <!-- 3-toed feet -->
      ${[-1,0,1].map(t=>`<line x1="${x-5*sc}" y1="${y}" x2="${x-5*sc+t*3*sc}" y2="${y+3*sc}" stroke="${f.primary}" stroke-width="${1.2*sc}" stroke-linecap="round"/>`).join('')}
      ${[-1,0,1].map(t=>`<line x1="${x+5*sc}" y1="${y}" x2="${x+5*sc+t*3*sc}" y2="${y+3*sc}" stroke="${f.primary}" stroke-width="${1.2*sc}" stroke-linecap="round"/>`).join('')}
      <!-- Body — thin, elongated -->
      <path d="M${x-5*sc},${y-22*sc} Q${x-6*sc},${y-16*sc} ${x-3*sc},${y-10*sc} L${x+3*sc},${y-10*sc} Q${x+6*sc},${y-16*sc} ${x+5*sc},${y-22*sc} Q${x+4*sc},${y-28*sc} ${x},${y-28*sc} Q${x-4*sc},${y-28*sc} ${x-5*sc},${y-22*sc}Z"
        fill="url(#${id}_body)"/>
      <!-- Neck — very thin -->
      <line x1="${x}" y1="${y-28*sc}" x2="${x}" y2="${y-31*sc}" stroke="${f.primary}" stroke-width="${2.5*sc}"/>
      <!-- Head — large teardrop cranium -->
      <path d="M${x-12*sc},${y-38*sc} Q${x-14*sc},${y-32*sc} ${x-10*sc},${y-31*sc} L${x+10*sc},${y-31*sc} Q${x+14*sc},${y-32*sc} ${x+12*sc},${y-38*sc} Q${x+8*sc},${y-52*sc} ${x},${y-52*sc} Q${x-8*sc},${y-52*sc} ${x-12*sc},${y-38*sc}Z"
        fill="url(#${id}_head)"/>
      <!-- Large almond eyes -->
      <path d="M${x-10*sc},${y-38*sc} Q${x-4*sc},${y-43*sc} ${x-1*sc},${y-38*sc} Q${x-4*sc},${y-34*sc} ${x-10*sc},${y-38*sc}Z"
        fill="#000a06"/>
      <path d="M${x+1*sc},${y-38*sc} Q${x+4*sc},${y-43*sc} ${x+10*sc},${y-38*sc} Q${x+4*sc},${y-34*sc} ${x+1*sc},${y-38*sc}Z"
        fill="#000a06"/>
      <!-- Eye glow -->
      <path d="M${x-10*sc},${y-38*sc} Q${x-4*sc},${y-43*sc} ${x-1*sc},${y-38*sc} Q${x-4*sc},${y-34*sc} ${x-10*sc},${y-38*sc}Z"
        fill="${f.eye}" opacity="0.7" class="eyeGlow"/>
      <path d="M${x+1*sc},${y-38*sc} Q${x+4*sc},${y-43*sc} ${x+10*sc},${y-38*sc} Q${x+4*sc},${y-34*sc} ${x+1*sc},${y-38*sc}Z"
        fill="${f.eye}" opacity="0.7" class="eyeGlow"/>
      <!-- Tiny nose slits -->
      <line x1="${x-1*sc}" y1="${y-34*sc}" x2="${x-1*sc}" y2="${y-32*sc}" stroke="${f.shadow}" stroke-width="${0.8*sc}"/>
      <line x1="${x+1*sc}" y1="${y-34*sc}" x2="${x+1*sc}" y2="${y-32*sc}" stroke="${f.shadow}" stroke-width="${0.8*sc}"/>
      <!-- Thin mouth line -->
      <path d="M${x-4*sc},${y-31.5*sc} Q${x},${y-30*sc} ${x+4*sc},${y-31.5*sc}" fill="none" stroke="${f.shadow}" stroke-width="${0.8*sc}"/>
      <!-- Spindly arms -->
      <path d="M${x-5*sc},${y-22*sc} Q${x-14*sc},${y-20*sc} ${x-16*sc},${y-14*sc}" fill="none" stroke="${f.primary}" stroke-width="${1.8*sc}" stroke-linecap="round"/>
      <path d="M${x+5*sc},${y-22*sc} Q${x+14*sc},${y-20*sc} ${x+16*sc},${y-14*sc}" fill="none" stroke="${f.primary}" stroke-width="${1.8*sc}" stroke-linecap="round"/>
      <!-- Long fingers — 4 per hand -->
      ${[-2,-0.5,0.5,2].map(f2=>`<line x1="${x-16*sc}" y1="${y-14*sc}" x2="${x-16*sc+f2*2.5*sc}" y2="${y-9*sc}" stroke="${f.primary}" stroke-width="${1*sc}" stroke-linecap="round"/>`).join('')}
      ${[-2,-0.5,0.5,2].map(f2=>`<line x1="${x+16*sc}" y1="${y-14*sc}" x2="${x+16*sc+f2*2.5*sc}" y2="${y-9*sc}" stroke="${f.primary}" stroke-width="${1*sc}" stroke-linecap="round"/>`).join('')}
      <!-- Static electricity hint -->
      <path d="M${x+4*sc},${y-28*sc} L${x+8*sc},${y-24*sc} L${x+5*sc},${y-22*sc} L${x+9*sc},${y-18*sc}" fill="none" stroke="${f.eye}" stroke-width="${0.6*sc}" opacity="0.5" class="eyeGlow"/>
      <!-- Head highlight -->
      <path d="M${x-8*sc},${y-48*sc} Q${x-10*sc},${y-42*sc} ${x-8*sc},${y-34*sc}" fill="none" stroke="${f.highlight}" stroke-width="${1*sc}" opacity="0.4"/>
    </g>
  `;
  return { defs, svg };
}

// ── BANDIT / THIEF ─────────────────────────
export function drawBandit(x, y, sc, fac, status, uid, variant='bandit') {
  const f = FACTION[fac] || FACTION.neutral;
  const id = `bn_${uid}`;

  const defs = `
    ${g(`${id}_body`, [[0,'#3a2a1a'],[50,'#2a1a0e'],[100,'#140c06']])}
    ${g(`${id}_cloak`, [[0,'#4a3a2a',0.9],[50,'#2a2018',0.85],[100,'#141008',0.8]])}
    ${rg(`${id}_eye`, x, y-30*sc, 5*sc, [[0,f.eye,1],[100,f.eye,0]])}
    ${rg(`${id}_glow`, x, y, 16*sc, [[0,f.underGlow,0.18],[100,f.underGlow,0]])}
  `;

  const svg = `
    <g style="transform-origin:${x}px ${y}px;filter:${statusFilter(status)}">
      <ellipse cx="${x}" cy="${y}" rx="${13*sc}" ry="${3.5*sc}" fill="url(#${id}_glow)"/>
      <!-- Boots -->
      <path d="M${x-7*sc},${y-4*sc} Q${x-9*sc},${y-2*sc} ${x-11*sc},${y} L${x-3*sc},${y} L${x-4*sc},${y-4*sc}Z" fill="#1a1008"/>
      <path d="M${x+3*sc},${y-4*sc} Q${x+5*sc},${y-2*sc} ${x+7*sc},${y} L${x+11*sc},${y} Q${x+9*sc},${y-2*sc} ${x+7*sc},${y-4*sc}Z" fill="#1a1008"/>
      <!-- Legs -->
      <rect x="${x-8*sc}" y="${y-16*sc}" width="${6*sc}" height="${12*sc}" rx="${2*sc}" fill="url(#${id}_body)"/>
      <rect x="${x+2*sc}"  y="${y-16*sc}" width="${6*sc}" height="${12*sc}" rx="${2*sc}" fill="url(#${id}_body)"/>
      <!-- Body -->
      <path d="M${x-8*sc},${y-30*sc} Q${x-9*sc},${y-22*sc} ${x-7*sc},${y-16*sc} L${x+7*sc},${y-16*sc} Q${x+9*sc},${y-22*sc} ${x+8*sc},${y-30*sc} Q${x+5*sc},${y-36*sc} ${x},${y-36*sc} Q${x-5*sc},${y-36*sc} ${x-8*sc},${y-30*sc}Z"
        fill="url(#${id}_body)"/>
      <!-- Hooded cloak -->
      <path d="M${x-12*sc},${y-30*sc} Q${x-14*sc},${y-20*sc} ${x-10*sc},${y-14*sc} L${x-7*sc},${y-14*sc} Q${x-9*sc},${y-20*sc} ${x-8*sc},${y-30*sc}Z" fill="url(#${id}_cloak)"/>
      <path d="M${x+12*sc},${y-30*sc} Q${x+14*sc},${y-20*sc} ${x+10*sc},${y-14*sc} L${x+7*sc},${y-14*sc} Q${x+9*sc},${y-20*sc} ${x+8*sc},${y-30*sc}Z" fill="url(#${id}_cloak)"/>
      <!-- Hood -->
      <path d="M${x-10*sc},${y-34*sc} Q${x-12*sc},${y-28*sc} ${x-10*sc},${y-24*sc} Q${x-6*sc},${y-22*sc} ${x},${y-22*sc} Q${x+6*sc},${y-22*sc} ${x+10*sc},${y-24*sc} Q${x+12*sc},${y-28*sc} ${x+10*sc},${y-34*sc} Q${x+6*sc},${y-42*sc} ${x},${y-42*sc} Q${x-6*sc},${y-42*sc} ${x-10*sc},${y-34*sc}Z"
        fill="url(#${id}_cloak)"/>
      <!-- Face in shadow — just eyes visible -->
      <ellipse cx="${x}" cy="${y-31*sc}" rx="${5*sc}" ry="${4*sc}" fill="#0a0806" opacity="0.9"/>
      ${eye(x-2*sc, y-32*sc, 1.4*sc, f.eye, `${id}_eye`, uid)}
      ${eye(x+2*sc, y-32*sc, 1.4*sc, f.eye, `${id}_eye`, uid)}
      <!-- Mask/bandana lower face -->
      <rect x="${x-4*sc}" y="${y-30*sc}" width="${8*sc}" height="${4*sc}" rx="${1*sc}" fill="#2a1810" opacity="0.8"/>
      <!-- Arms -->
      <path d="M${x-8*sc},${y-28*sc} Q${x-16*sc},${y-24*sc} ${x-14*sc},${y-16*sc}" fill="none" stroke="#2a1a0e" stroke-width="${4*sc}" stroke-linecap="round"/>
      <path d="M${x+8*sc},${y-28*sc} Q${x+16*sc},${y-24*sc} ${x+14*sc},${y-16*sc}" fill="none" stroke="#2a1a0e" stroke-width="${4*sc}" stroke-linecap="round"/>
      ${variant==='bandit' ? `
        <!-- Short sword -->
        <rect x="${x+13*sc}" y="${y-22*sc}" width="${2*sc}" height="${12*sc}" rx="${0.5*sc}" fill="#c0c0c0" transform="rotate(-15,${x+14*sc},${y-16*sc})"/>
        <rect x="${x+11*sc}" y="${y-23*sc}" width="${5*sc}" height="${1.5*sc}" rx="${0.5*sc}" fill="#a08040"/>
      ` : `
        <!-- Poison dagger pair -->
        <rect x="${x+12*sc}" y="${y-22*sc}" width="${1.5*sc}" height="${9*sc}" rx="${0.5*sc}" fill="#c0c0c0" transform="rotate(-20,${x+13*sc},${y-18*sc})"/>
        <rect x="${x-13*sc}" y="${y-20*sc}" width="${1.5*sc}" height="${9*sc}" rx="${0.5*sc}" fill="#c0c0c0" transform="rotate(20,${x-12*sc},${y-16*sc})"/>
        <!-- Poison green tint on blades -->
        <rect x="${x+12*sc}" y="${y-22*sc}" width="${1.5*sc}" height="${4*sc}" rx="${0.5*sc}" fill="#40aa20" opacity="0.6" transform="rotate(-20,${x+13*sc},${y-18*sc})"/>
      `}
    </g>
  `;
  return { defs, svg };
}

// ── MERCHANT (FRIENDLY) ───────────────────
export function drawMerchant(x, y, sc, fac, status, uid) {
  const f = FACTION.friendly;
  const id = `mc_${uid}`;

  const defs = `
    ${g(`${id}_body`, [[0,'#8a6030'],[50,'#6a4820'],[100,'#3a2810']])}
    ${g(`${id}_cloak`, [[0,'#7a5040'],[50,'#5a3828'],[100,'#2a1810']])}
    ${g(`${id}_gold`, [[0,'#ffd040'],[50,'#d0a020'],[100,'#906010']])}
    ${rg(`${id}_eye`, x, y-28*sc, 5*sc, [[0,f.eye,0.8],[100,f.eye,0]])}
    ${rg(`${id}_glow`, x, y, 16*sc, [[0,f.underGlow,0.15],[100,f.underGlow,0]])}
  `;

  const svg = `
    <g style="transform-origin:${x}px ${y}px;filter:${statusFilter(status)}">
      <ellipse cx="${x}" cy="${y}" rx="${13*sc}" ry="${3.5*sc}" fill="url(#${id}_glow)"/>
      <!-- Boots -->
      <ellipse cx="${x-5*sc}" cy="${y}" rx="${5.5*sc}" ry="${2.5*sc}" fill="#2a1808"/>
      <ellipse cx="${x+5*sc}" cy="${y}" rx="${5.5*sc}" ry="${2.5*sc}" fill="#2a1808"/>
      <!-- Legs -->
      <rect x="${x-7*sc}" y="${y-14*sc}" width="${5*sc}" height="${14*sc}" rx="${2*sc}" fill="url(#${id}_body)"/>
      <rect x="${x+2*sc}"  y="${y-14*sc}" width="${5*sc}" height="${14*sc}" rx="${2*sc}" fill="url(#${id}_body)"/>
      <!-- Round belly body -->
      <path d="M${x-9*sc},${y-28*sc} Q${x-11*sc},${y-20*sc} ${x-7*sc},${y-14*sc} L${x+7*sc},${y-14*sc} Q${x+11*sc},${y-20*sc} ${x+9*sc},${y-28*sc} Q${x+5*sc},${y-34*sc} ${x},${y-34*sc} Q${x-5*sc},${y-34*sc} ${x-9*sc},${y-28*sc}Z"
        fill="url(#${id}_cloak)"/>
      <!-- Vest with gold trim -->
      <path d="M${x-6*sc},${y-30*sc} L${x-2*sc},${y-30*sc} L${x-2*sc},${y-16*sc} L${x-6*sc},${y-16*sc}Z" fill="url(#${id}_gold)" opacity="0.6"/>
      <!-- Gold buttons -->
      ${[-26,-21,-16].map(yy=>`<circle cx="${x}" cy="${y+yy*sc}" r="${1.5*sc}" fill="url(#${id}_gold)"/>`).join('')}
      <!-- Head — round, happy merchant -->
      <circle cx="${x}" cy="${y-40*sc}" r="${9*sc}" fill="url(#${id}_body)"/>
      <!-- Smile -->
      <path d="M${x-4*sc},${y-36*sc} Q${x},${y-33*sc} ${x+4*sc},${y-36*sc}" fill="none" stroke="#2a1808" stroke-width="${1.2*sc}"/>
      <!-- Rosy cheeks -->
      <circle cx="${x-5*sc}" cy="${y-38*sc}" r="${2.5*sc}" fill="#c06050" opacity="0.35"/>
      <circle cx="${x+5*sc}" cy="${y-38*sc}" r="${2.5*sc}" fill="#c06050" opacity="0.35"/>
      <!-- Eyes — friendly squint -->
      <path d="M${x-5*sc},${y-42*sc} Q${x-3*sc},${y-44*sc} ${x-1*sc},${y-42*sc}" fill="none" stroke="#2a1808" stroke-width="${1.5*sc}"/>
      <path d="M${x+1*sc},${y-42*sc} Q${x+3*sc},${y-44*sc} ${x+5*sc},${y-42*sc}" fill="none" stroke="#2a1808" stroke-width="${1.5*sc}"/>
      <!-- Hat -->
      <ellipse cx="${x}" cy="${y-48*sc}" rx="${10*sc}" ry="${2.5*sc}" fill="#3a2810"/>
      <rect x="${x-7*sc}" y="${y-62*sc}" width="${14*sc}" height="${14*sc}" rx="${3*sc}" fill="#3a2810"/>
      <path d="M${x-2*sc},${y-58*sc} Q${x},${y-56*sc} ${x+2*sc},${y-58*sc}" fill="none" stroke="url(#${id}_gold)" stroke-width="${1*sc}"/>
      <!-- Arms carrying pack -->
      <path d="M${x-9*sc},${y-26*sc} Q${x-16*sc},${y-20*sc} ${x-14*sc},${y-12*sc}" fill="none" stroke="#6a4820" stroke-width="${5*sc}" stroke-linecap="round"/>
      <path d="M${x+9*sc},${y-26*sc} Q${x+18*sc},${y-22*sc} ${x+20*sc},${y-14*sc}" fill="none" stroke="#6a4820" stroke-width="${5*sc}" stroke-linecap="round"/>
      <!-- Pack/bag on back -->
      <path d="M${x-14*sc},${y-22*sc} Q${x-20*sc},${y-20*sc} ${x-20*sc},${y-12*sc} Q${x-18*sc},${y-6*sc} ${x-12*sc},${y-8*sc} Q${x-8*sc},${y-10*sc} ${x-10*sc},${y-20*sc}Z"
        fill="#8a6030" opacity="0.85"/>
      <!-- Pack buckle -->
      <rect x="${x-17*sc}" y="${y-17*sc}" width="${4*sc}" height="${3*sc}" rx="${0.5*sc}" fill="url(#${id}_gold)"/>
      <!-- Walking stick -->
      <line x1="${x+20*sc}" y1="${y-14*sc}" x2="${x+22*sc}" y2="${y}" stroke="#8B5A00" stroke-width="${2*sc}" stroke-linecap="round"/>
    </g>
  `;
  return { defs, svg };
}

// ── WRAITH ─────────────────────────────────
export function drawWraith(x, y, sc, fac, status, uid) {
  const f = FACTION.magic;
  const id = `wr_${uid}`;

  const defs = `
    ${g(`${id}_body`, [[0,'#4a3060',0.9],[40,'#2a1840',0.8],[100,'#100820',0.3]])}
    ${rg(`${id}_eye`, x, y-30*sc, 8*sc, [[0,'#cc00ff',1],[60,'#8800cc',0.6],[100,'#8800cc',0]])}
    ${rg(`${id}_aura`, x, y-20*sc, 35*sc, [[0,'#6600aa',0.2],[100,'#6600aa',0]])}
  `;

  const svg = `
    <g class="${animClass('wraith')}" style="transform-origin:${x}px ${y-20*sc}px;filter:${statusFilter(status)}">
      <ellipse cx="${x}" cy="${y-15*sc}" rx="${32*sc}" ry="${22*sc}" fill="url(#${id}_aura)" class="eyeGlow"/>
      <!-- Tattered cloak wisps -->
      <path d="M${x-14*sc},${y-8*sc} Q${x-20*sc},${y-2*sc} ${x-16*sc},${y+6*sc} Q${x-8*sc},${y+4*sc} ${x-10*sc},${y-4*sc}Z" fill="url(#${id}_body)" opacity="0.7"/>
      <path d="M${x},${y-5*sc} Q${x-4*sc},${y+3*sc} ${x},${y+8*sc} Q${x+4*sc},${y+3*sc} ${x+2*sc},${y-4*sc}Z" fill="url(#${id}_body)" opacity="0.6"/>
      <path d="M${x+14*sc},${y-8*sc} Q${x+20*sc},${y-2*sc} ${x+16*sc},${y+6*sc} Q${x+8*sc},${y+4*sc} ${x+10*sc},${y-4*sc}Z" fill="url(#${id}_body)" opacity="0.7"/>
      <!-- Main robe body -->
      <path d="M${x-14*sc},${y-25*sc} Q${x-16*sc},${y-15*sc} ${x-14*sc},${y-8*sc} Q${x},${y-5*sc} ${x+14*sc},${y-8*sc} Q${x+16*sc},${y-15*sc} ${x+14*sc},${y-25*sc} Q${x+8*sc},${y-40*sc} ${x},${y-42*sc} Q${x-8*sc},${y-40*sc} ${x-14*sc},${y-25*sc}Z"
        fill="url(#${id}_body)" stroke="#3a1050" stroke-width="${0.8*sc}"/>
      <!-- Skeletal hands emerging -->
      <path d="M${x-14*sc},${y-22*sc} Q${x-24*sc},${y-20*sc} ${x-26*sc},${y-14*sc}" fill="none" stroke="#2a1840" stroke-width="${3*sc}" stroke-linecap="round" opacity="0.8"/>
      <path d="M${x+14*sc},${y-22*sc} Q${x+24*sc},${y-20*sc} ${x+26*sc},${y-14*sc}" fill="none" stroke="#2a1840" stroke-width="${3*sc}" stroke-linecap="round" opacity="0.8"/>
      ${[-2,0,2].map(fx=>`
        <line x1="${x-26*sc}" y1="${y-14*sc}" x2="${x-26*sc+fx*2*sc}" y2="${y-9*sc}" stroke="#4a3060" stroke-width="${1*sc}" stroke-linecap="round" opacity="0.7"/>
        <line x1="${x+26*sc}" y1="${y-14*sc}" x2="${x+26*sc+fx*2*sc}" y2="${y-9*sc}" stroke="#4a3060" stroke-width="${1*sc}" stroke-linecap="round" opacity="0.7"/>
      `).join('')}
      <!-- Cowl/hood -->
      <path d="M${x-10*sc},${y-38*sc} Q${x-12*sc},${y-32*sc} ${x-10*sc},${y-28*sc} Q${x-6*sc},${y-26*sc} ${x},${y-26*sc} Q${x+6*sc},${y-26*sc} ${x+10*sc},${y-28*sc} Q${x+12*sc},${y-32*sc} ${x+10*sc},${y-38*sc} Q${x+5*sc},${y-48*sc} ${x},${y-48*sc} Q${x-5*sc},${y-48*sc} ${x-10*sc},${y-38*sc}Z"
        fill="#1a0828" opacity="0.95"/>
      <!-- Deep void face — just glowing eyes in darkness -->
      <ellipse cx="${x}" cy="${y-36*sc}" rx="${7*sc}" ry="${6*sc}" fill="#060010" opacity="0.9"/>
      ${eye(x-3*sc, y-36*sc, 2.5*sc, '#cc00ff', `${id}_eye`, uid)}
      ${eye(x+3*sc, y-36*sc, 2.5*sc, '#cc00ff', `${id}_eye`, uid)}
      <!-- Purple energy tendrils -->
      <path d="M${x-5*sc},${y-20*sc} Q${x-10*sc},${y-15*sc} ${x-8*sc},${y-10*sc}" fill="none" stroke="#8800cc" stroke-width="${0.8*sc}" opacity="0.5" class="eyeGlow"/>
      <path d="M${x+5*sc},${y-20*sc} Q${x+10*sc},${y-15*sc} ${x+8*sc},${y-10*sc}" fill="none" stroke="#8800cc" stroke-width="${0.8*sc}" opacity="0.5" class="eyeGlow"/>
    </g>
  `;
  return { defs, svg };
}

// ── VAMPIRE ────────────────────────────────
export function drawVampire(x, y, sc, fac, status, uid) {
  const f = FACTION.boss;
  const id = `vp_${uid}`;

  const defs = `
    ${g(`${id}_skin`, [[0,'#c8b8d8'],[50,'#a898b8'],[100,'#706080']])}
    ${g(`${id}_cloak`, [[0,'#2a0820'],[50,'#1a0418'],[100,'#080008']])}
    ${g(`${id}_blood`, [[0,'#cc1010'],[50,'#8a0808'],[100,'#400404']])}
    ${rg(`${id}_eye`, x, y-38*sc, 6*sc, [[0,'#cc0020',1],[100,'#cc0020',0]])}
    ${rg(`${id}_glow`, x, y, 20*sc, [[0,'#880020',0.25],[100,'#880020',0]])}
  `;

  const svg = `
    <g style="transform-origin:${x}px ${y}px;filter:${statusFilter(status)}">
      <ellipse cx="${x}" cy="${y}" rx="${16*sc}" ry="${4*sc}" fill="url(#${id}_glow)"/>
      <!-- Cloak sweeping ground -->
      <path d="M${x-14*sc},${y-10*sc} Q${x-20*sc},${y-5*sc} ${x-22*sc},${y} L${x+22*sc},${y} Q${x+20*sc},${y-5*sc} ${x+14*sc},${y-10*sc}Z"
        fill="url(#${id}_cloak)" opacity="0.95"/>
      <!-- Boots -->
      <ellipse cx="${x-7*sc}" cy="${y}" rx="${6*sc}" ry="${2.5*sc}" fill="#0a0010"/>
      <ellipse cx="${x+7*sc}" cy="${y}" rx="${6*sc}" ry="${2.5*sc}" fill="#0a0010"/>
      <!-- Legs formal trousers -->
      <rect x="${x-10*sc}" y="${y-18*sc}" width="${7*sc}" height="${18*sc}" rx="${2*sc}" fill="#1a0418"/>
      <rect x="${x+3*sc}"  y="${y-18*sc}" width="${7*sc}" height="${18*sc}" rx="${2*sc}" fill="#1a0418"/>
      <!-- Body — aristocratic, tall -->
      <path d="M${x-9*sc},${y-38*sc} Q${x-10*sc},${y-28*sc} ${x-8*sc},${y-18*sc} L${x+8*sc},${y-18*sc} Q${x+10*sc},${y-28*sc} ${x+9*sc},${y-38*sc} Q${x+5*sc},${y-44*sc} ${x},${y-44*sc} Q${x-5*sc},${y-44*sc} ${x-9*sc},${y-38*sc}Z"
        fill="url(#${id}_cloak)"/>
      <!-- White shirt front -->
      <path d="M${x-4*sc},${y-40*sc} L${x+4*sc},${y-40*sc} L${x+3*sc},${y-22*sc} L${x-3*sc},${y-22*sc}Z" fill="#d0c8e0" opacity="0.9"/>
      <!-- Ruffled collar -->
      <path d="M${x-6*sc},${y-40*sc} Q${x-3*sc},${y-42*sc} ${x},${y-40*sc} Q${x+3*sc},${y-42*sc} ${x+6*sc},${y-40*sc}" fill="white" stroke="white" stroke-width="${0.5*sc}"/>
      <!-- Cape wings spread -->
      <path d="M${x-9*sc},${y-38*sc} Q${x-25*sc},${y-42*sc} ${x-28*sc},${y-20*sc} Q${x-26*sc},${y-12*sc} ${x-14*sc},${y-12*sc}Z"
        fill="url(#${id}_cloak)" stroke="#2a0820" stroke-width="${0.5*sc}"/>
      <path d="M${x+9*sc},${y-38*sc} Q${x+25*sc},${y-42*sc} ${x+28*sc},${y-20*sc} Q${x+26*sc},${y-12*sc} ${x+14*sc},${y-12*sc}Z"
        fill="url(#${id}_cloak)" stroke="#2a0820" stroke-width="${0.5*sc}"/>
      <!-- Cape interior red lining -->
      <path d="M${x-9*sc},${y-38*sc} Q${x-22*sc},${y-40*sc} ${x-25*sc},${y-22*sc} Q${x-22*sc},${y-14*sc} ${x-14*sc},${y-12*sc}Z"
        fill="url(#${id}_blood)" opacity="0.6"/>
      <path d="M${x+9*sc},${y-38*sc} Q${x+22*sc},${y-40*sc} ${x+25*sc},${y-22*sc} Q${x+22*sc},${y-14*sc} ${x+14*sc},${y-12*sc}Z"
        fill="url(#${id}_blood)" opacity="0.6"/>
      <!-- Arms elegant -->
      <path d="M${x-9*sc},${y-36*sc} Q${x-18*sc},${y-30*sc} ${x-16*sc},${y-20*sc}" fill="none" stroke="#1a0418" stroke-width="${5*sc}" stroke-linecap="round"/>
      <path d="M${x+9*sc},${y-36*sc} Q${x+18*sc},${y-30*sc} ${x+16*sc},${y-20*sc}" fill="none" stroke="#1a0418" stroke-width="${5*sc}" stroke-linecap="round"/>
      <!-- Pale hands -->
      <ellipse cx="${x-16*sc}" cy="${y-18*sc}" rx="${3.5*sc}" ry="${2.5*sc}" fill="url(#${id}_skin)"/>
      <ellipse cx="${x+16*sc}" cy="${y-18*sc}" rx="${3.5*sc}" ry="${2.5*sc}" fill="url(#${id}_skin)"/>
      <!-- Head — aristocratic pale -->
      <ellipse cx="${x}" cy="${y-50*sc}" rx="${8*sc}" ry="${9*sc}" fill="url(#${id}_skin)"/>
      <!-- Widow's peak hair -->
      <path d="M${x-8*sc},${y-56*sc} Q${x-4*sc},${y-62*sc} ${x},${y-59*sc} Q${x+4*sc},${y-62*sc} ${x+8*sc},${y-56*sc} Q${x+4*sc},${y-58*sc} ${x},${y-56*sc} Q${x-4*sc},${y-58*sc} ${x-8*sc},${y-56*sc}Z"
        fill="#0a0010"/>
      <!-- High cheekbones shadow -->
      <path d="M${x-7*sc},${y-48*sc} Q${x-5*sc},${y-46*sc} ${x-2*sc},${y-47*sc}" fill="none" stroke="#706080" stroke-width="${0.8*sc}" opacity="0.5"/>
      <path d="M${x+7*sc},${y-48*sc} Q${x+5*sc},${y-46*sc} ${x+2*sc},${y-47*sc}" fill="none" stroke="#706080" stroke-width="${0.8*sc}" opacity="0.5"/>
      <!-- Eyes — piercing red -->
      ${eye(x-3*sc, y-51*sc, 2*sc, '#cc0020', `${id}_eye`, uid)}
      ${eye(x+3*sc, y-51*sc, 2*sc, '#cc0020', `${id}_eye`, uid)}
      <!-- Sharp nose -->
      <path d="M${x-1.5*sc},${y-47*sc} L${x},${y-44*sc} L${x+1.5*sc},${y-47*sc}" fill="none" stroke="#9898a8" stroke-width="${0.8*sc}"/>
      <!-- Slight smile — fangs visible -->
      <path d="M${x-3.5*sc},${y-43.5*sc} Q${x},${y-41.5*sc} ${x+3.5*sc},${y-43.5*sc}" fill="none" stroke="#9898a8" stroke-width="${0.8*sc}"/>
      <line x1="${x-1.5*sc}" y1="${y-43.5*sc}" x2="${x-1.5*sc}" y2="${y-41.5*sc}" stroke="white" stroke-width="${1.2*sc}" stroke-linecap="round"/>
      <line x1="${x+1.5*sc}" y1="${y-43.5*sc}" x2="${x+1.5*sc}" y2="${y-41.5*sc}" stroke="white" stroke-width="${1.2*sc}" stroke-linecap="round"/>
      <!-- Blood droplet on chin -->
      <path d="M${x},${y-42*sc} Q${x+0.5*sc},${y-40*sc} ${x},${y-39*sc} Q${x-0.5*sc},${y-40*sc} ${x},${y-42*sc}Z" fill="url(#${id}_blood)"/>
    </g>
  `;
  return { defs, svg };
}

// ── ROBOT DRONE ────────────────────────────
export function drawRobotDrone(x, y, sc, fac, status, uid) {
  const f = FACTION.alien;
  const id = `rd_${uid}`;

  const defs = `
    ${g(`${id}_metal`, [[0,'#6a7a8a'],[40,'#4a5a6a'],[100,'#2a3a4a']])}
    ${g(`${id}_dark`, [[0,'#3a4a5a'],[50,'#1a2a3a'],[100,'#0a1a2a']])}
    ${g(`${id}_panel`, [[0,'#2a3a4a'],[50,'#1a2a3a'],[100,'#0a1020']])}
    ${rg(`${id}_eye`, x, y-30*sc, 6*sc, [[0,f.eye,1],[100,f.eye,0]])}
    ${rg(`${id}_scan`, x, y-25*sc, 25*sc, [[0,f.eye,0.1],[100,f.eye,0]])}
    ${rg(`${id}_glow`, x, y, 18*sc, [[0,f.underGlow,0.2],[100,f.underGlow,0]])}
  `;

  const svg = `
    <g style="transform-origin:${x}px ${y}px;filter:${statusFilter(status)}">
      <ellipse cx="${x}" cy="${y}" rx="${16*sc}" ry="${4*sc}" fill="url(#${id}_glow)"/>
      <!-- Hovering feet — no legs, floating -->
      <ellipse cx="${x}" cy="${y-3*sc}" rx="${10*sc}" ry="${3*sc}" fill="${f.eye}" opacity="0.15" class="eyeGlow"/>
      <!-- Thruster ports -->
      <circle cx="${x-7*sc}" cy="${y-2*sc}" r="${2.5*sc}" fill="url(#${id}_dark)"/>
      <circle cx="${x+7*sc}" cy="${y-2*sc}" r="${2.5*sc}" fill="url(#${id}_dark)"/>
      <circle cx="${x-7*sc}" cy="${y-2*sc}" r="${1.2*sc}" fill="${f.eye}" opacity="0.6" class="eyeGlow"/>
      <circle cx="${x+7*sc}" cy="${y-2*sc}" r="${1.2*sc}" fill="${f.eye}" opacity="0.6" class="eyeGlow"/>
      <!-- Body — boxy torso -->
      <rect x="${x-10*sc}" y="${y-28*sc}" width="${20*sc}" height="${25*sc}" rx="${3*sc}" fill="url(#${id}_metal)" stroke="#3a4a5a" stroke-width="${0.8*sc}"/>
      <!-- Panel lines -->
      <rect x="${x-8*sc}" y="${y-26*sc}" width="${16*sc}" height="${10*sc}" rx="${2*sc}" fill="url(#${id}_panel)" opacity="0.7"/>
      <!-- Status lights row -->
      ${[-4,-1.5,1,3.5].map((lx,i)=>`<circle cx="${x+lx*sc}" cy="${y-22*sc}" r="${1.2*sc}" fill="${['#ff4040','#ffaa00','#40ff40','#4040ff'][i]}" opacity="0.8"/>`).join('')}
      <!-- Vent grilles -->
      ${[-2,-1,0,1,2].map(i=>`<line x1="${x-7*sc}" y1="${y-18*sc+i*1.5*sc}" x2="${x-4*sc}" y2="${y-18*sc+i*1.5*sc}" stroke="#3a4a5a" stroke-width="${0.6*sc}"/>`).join('')}
      <!-- Shoulder mounts -->
      <rect x="${x-16*sc}" y="${y-26*sc}" width="${7*sc}" height="${9*sc}" rx="${2*sc}" fill="url(#${id}_metal)"/>
      <rect x="${x+9*sc}"  y="${y-26*sc}" width="${7*sc}" height="${9*sc}" rx="${2*sc}" fill="url(#${id}_metal)"/>
      <!-- Weapon arm right -->
      <rect x="${x+16*sc}" y="${y-24*sc}" width="${3*sc}" height="${14*sc}" rx="${1.5*sc}" fill="url(#${id}_dark)"/>
      <path d="M${x+17.5*sc},${y-10*sc} L${x+22*sc},${y-10*sc} L${x+23*sc},${y-8*sc} L${x+16*sc},${y-8*sc}Z" fill="url(#${id}_dark)"/>
      <circle cx="${x+22*sc}" cy="${y-9*sc}" r="${1.5*sc}" fill="${f.eye}" opacity="0.7" class="eyeGlow"/>
      <!-- Sensor arm left -->
      <rect x="${x-19*sc}" y="${y-24*sc}" width="${3*sc}" height="${12*sc}" rx="${1.5*sc}" fill="url(#${id}_dark)"/>
      <circle cx="${x-17.5*sc}" cy="${y-12*sc}" r="${3*sc}" fill="url(#${id}_panel)"/>
      <circle cx="${x-17.5*sc}" cy="${y-12*sc}" r="${1.5*sc}" fill="${f.eye}" opacity="0.5"/>
      <!-- Head — cubic with visor -->
      <rect x="${x-9*sc}" y="${y-42*sc}" width="${18*sc}" height="${14*sc}" rx="${3*sc}" fill="url(#${id}_metal)" stroke="#3a4a5a" stroke-width="${0.8*sc}"/>
      <!-- Visor — glowing -->
      <rect x="${x-7*sc}" y="${y-40*sc}" width="${14*sc}" height="${6*sc}" rx="${1.5*sc}" fill="#000a14"/>
      <rect x="${x-7*sc}" y="${y-40*sc}" width="${14*sc}" height="${6*sc}" rx="${1.5*sc}" fill="${f.eye}" opacity="0.25" class="eyeGlow"/>
      <!-- Eye sensors on visor -->
      <rect x="${x-5*sc}" y="${y-38.5*sc}" width="${3.5*sc}" height="${3*sc}" rx="${1*sc}" fill="${f.eye}" opacity="0.7" class="eyeGlow"/>
      <rect x="${x+1.5*sc}" y="${y-38.5*sc}" width="${3.5*sc}" height="${3*sc}" rx="${1*sc}" fill="${f.eye}" opacity="0.7" class="eyeGlow"/>
      <!-- Antenna -->
      <line x1="${x}" y1="${y-42*sc}" x2="${x}" y2="${y-48*sc}" stroke="#6a7a8a" stroke-width="${1.5*sc}"/>
      <circle cx="${x}" cy="${y-48*sc}" r="${2*sc}" fill="${f.eye}" opacity="0.8" class="eyeGlow"/>
      <!-- Metallic highlight -->
      <rect x="${x-9*sc}" y="${y-42*sc}" width="${18*sc}" height="${3*sc}" rx="${3*sc}" fill="white" opacity="0.1"/>
      <rect x="${x-10*sc}" y="${y-28*sc}" width="${5*sc}" height="${3*sc}" rx="${1.5*sc}" fill="white" opacity="0.08"/>
    </g>
  `;
  return { defs, svg };
}

// ── DEMON ──────────────────────────────────
export function drawDemon(x, y, sc, fac, status, uid) {
  const f = FACTION.boss;
  const id = `dm_${uid}`;

  const defs = `
    ${g(`${id}_body`, [[0,'#5a1a2a'],[40,'#3a0a18'],[100,'#150408']])}
    ${g(`${id}_wing`, [[0,'#4a0a18',0.9],[50,'#2a0610',0.85],[100,'#100208',0.7]])}
    ${g(`${id}_fire`, [[0,'#ff6600'],[50,'#cc2200'],[100,'#880000']])}
    ${rg(`${id}_eye`, x, y-48*sc, 8*sc, [[0,'#ff2200',1],[100,'#ff0000',0]])}
    ${rg(`${id}_glow`, x, y, 30*sc, [[0,'#cc1100',0.3],[100,'#cc1100',0]])}
  `;

  const svg = `
    <g class="${animClass('demon')}" style="transform-origin:${x}px ${y}px;filter:${statusFilter(status)}">
      <ellipse cx="${x}" cy="${y}" rx="${28*sc}" ry="${7*sc}" fill="url(#${id}_glow)"/>
      <!-- Hoofed feet -->
      <path d="M${x-10*sc},${y-4*sc} Q${x-8*sc},${y-1*sc} ${x-5*sc},${y} Q${x-12*sc},${y} ${x-14*sc},${y-2*sc}Z" fill="#1a0408"/>
      <path d="M${x+5*sc},${y-4*sc} Q${x+8*sc},${y-1*sc} ${x+14*sc},${y-2*sc} Q${x+12*sc},${y} ${x+5*sc},${y}Z" fill="#1a0408"/>
      <!-- Muscular legs -->
      <path d="M${x-10*sc},${y-20*sc} Q${x-14*sc},${y-10*sc} ${x-10*sc},${y-4*sc}" fill="url(#${id}_body)" stroke="#150408" stroke-width="${1*sc}"/>
      <path d="M${x+10*sc},${y-20*sc} Q${x+14*sc},${y-10*sc} ${x+10*sc},${y-4*sc}" fill="url(#${id}_body)" stroke="#150408" stroke-width="${1*sc}"/>
      <!-- Massive body -->
      <path d="M${x-16*sc},${y-44*sc} Q${x-20*sc},${y-32*sc} ${x-14*sc},${y-20*sc} L${x+14*sc},${y-20*sc} Q${x+20*sc},${y-32*sc} ${x+16*sc},${y-44*sc} Q${x+10*sc},${y-54*sc} ${x},${y-54*sc} Q${x-10*sc},${y-54*sc} ${x-16*sc},${y-44*sc}Z"
        fill="url(#${id}_body)" stroke="#150408" stroke-width="${1*sc}"/>
      <!-- Scale texture -->
      ${[-40,-34,-28,-22].map(yy=>{ const w=(12+Math.abs((yy+35)/3))*sc; return `<path d="M${x-w},${y+yy*sc} Q${x},${y+(yy-2)*sc} ${x+w},${y+yy*sc}" fill="none" stroke="#150408" stroke-width="${0.5*sc}" opacity="0.4"/>`;}).join('')}
      <!-- Left wing -->
      <path d="M${x-8*sc},${y-44*sc} Q${x-40*sc},${y-80*sc} ${x-55*sc},${y-55*sc} Q${x-50*sc},${y-40*sc} ${x-20*sc},${y-36*sc}Z"
        fill="url(#${id}_wing)"/>
      <!-- Wing membrane ribs -->
      <line x1="${x-8*sc}" y1="${y-44*sc}" x2="${x-50*sc}" y2="${y-68*sc}" stroke="#2a0610" stroke-width="${1*sc}" opacity="0.5"/>
      <line x1="${x-8*sc}" y1="${y-44*sc}" x2="${x-42*sc}" y2="${y-56*sc}" stroke="#2a0610" stroke-width="${1*sc}" opacity="0.5"/>
      <!-- Right wing -->
      <path d="M${x+8*sc},${y-44*sc} Q${x+40*sc},${y-80*sc} ${x+55*sc},${y-55*sc} Q${x+50*sc},${y-40*sc} ${x+20*sc},${y-36*sc}Z"
        fill="url(#${id}_wing)"/>
      <line x1="${x+8*sc}" y1="${y-44*sc}" x2="${x+50*sc}" y2="${y-68*sc}" stroke="#2a0610" stroke-width="${1*sc}" opacity="0.5"/>
      <!-- Tail -->
      <path d="M${x-8*sc},${y-8*sc} Q${x-30*sc},${y-6*sc} ${x-38*sc},${y+2*sc}" fill="none" stroke="#3a0a18" stroke-width="${6*sc}" stroke-linecap="round"/>
      <path d="M${x-38*sc},${y+2*sc} L${x-44*sc},${y-4*sc} L${x-40*sc},${y+6*sc}Z" fill="#3a0a18"/>
      <!-- Arms — clawed -->
      <path d="M${x-16*sc},${y-40*sc} Q${x-26*sc},${y-30*sc} ${x-24*sc},${y-18*sc}" fill="none" stroke="#3a0a18" stroke-width="${8*sc}" stroke-linecap="round"/>
      <path d="M${x+16*sc},${y-40*sc} Q${x+26*sc},${y-30*sc} ${x+24*sc},${y-18*sc}" fill="none" stroke="#3a0a18" stroke-width="${8*sc}" stroke-linecap="round"/>
      <!-- Claws -->
      ${[-3,-1,1,3].map(cx=>`<path d="M${x-24*sc+cx*2*sc},${y-18*sc} L${x-24*sc+cx*2.5*sc},${y-10*sc}" stroke="#4a1020" stroke-width="${1.5*sc}" stroke-linecap="round"/>`).join('')}
      ${[-3,-1,1,3].map(cx=>`<path d="M${x+24*sc+cx*2*sc},${y-18*sc} L${x+24*sc+cx*2.5*sc},${y-10*sc}" stroke="#4a1020" stroke-width="${1.5*sc}" stroke-linecap="round"/>`).join('')}
      <!-- Head — horned, fierce -->
      <path d="M${x-12*sc},${y-58*sc} Q${x-14*sc},${y-52*sc} ${x-12*sc},${y-48*sc} L${x+12*sc},${y-48*sc} Q${x+14*sc},${y-52*sc} ${x+12*sc},${y-58*sc} Q${x+7*sc},${y-68*sc} ${x},${y-68*sc} Q${x-7*sc},${y-68*sc} ${x-12*sc},${y-58*sc}Z"
        fill="url(#${id}_body)" stroke="#150408" stroke-width="${0.8*sc}"/>
      <!-- Horns -->
      <path d="M${x-8*sc},${y-66*sc} Q${x-12*sc},${y-80*sc} ${x-6*sc},${y-76*sc}Z" fill="#0a0208"/>
      <path d="M${x+8*sc},${y-66*sc} Q${x+12*sc},${y-80*sc} ${x+6*sc},${y-76*sc}Z" fill="#0a0208"/>
      <!-- Small inner horns -->
      <path d="M${x-4*sc},${y-67*sc} Q${x-5*sc},${y-73*sc} ${x-1*sc},${y-70*sc}Z" fill="#150408"/>
      <path d="M${x+4*sc},${y-67*sc} Q${x+5*sc},${y-73*sc} ${x+1*sc},${y-70*sc}Z" fill="#150408"/>
      <!-- Brow ridge -->
      <path d="M${x-10*sc},${y-62*sc} Q${x},${y-66*sc} ${x+10*sc},${y-62*sc}" fill="#150408" stroke="#150408" stroke-width="${2.5*sc}"/>
      <!-- Eyes — fiery -->
      ${eye(x-4*sc, y-62*sc, 2.8*sc, '#ff2200', `${id}_eye`, uid)}
      ${eye(x+4*sc, y-62*sc, 2.8*sc, '#ff2200', `${id}_eye`, uid)}
      <!-- Fanged mouth -->
      <path d="M${x-6*sc},${y-52*sc} Q${x},${y-48*sc} ${x+6*sc},${y-52*sc}" fill="#150408"/>
      ${[-4,-2,0,2,4].map(tx=>`<path d="M${x+tx*sc},${y-52*sc} L${x+tx*sc},${y-48.5*sc} L${x+tx*sc+1.2*sc},${y-52*sc}Z" fill="#f0e0c0"/>`).join('')}
      <!-- Fire breath hint -->
      <path d="M${x+6*sc},${y-50*sc} Q${x+16*sc},${y-48*sc} ${x+22*sc},${y-44*sc}" fill="none" stroke="url(#${id}_fire)" stroke-width="${2*sc}" opacity="0.5" class="eyeGlow"/>
      <!-- Chest glyph -->
      <path d="M${x},${y-42*sc} L${x-4*sc},${y-36*sc} L${x+4*sc},${y-36*sc}Z" fill="#cc1100" opacity="0.4"/>
      <path d="M${x-4*sc},${y-40*sc} L${x+4*sc},${y-40*sc}" stroke="#cc1100" stroke-width="${0.8*sc}" opacity="0.4"/>
      <!-- Highlight -->
      <path d="M${x-14*sc},${y-52*sc} Q${x-16*sc},${y-40*sc} ${x-14*sc},${y-22*sc}" fill="none" stroke="#7a2a3a" stroke-width="${1*sc}" opacity="0.35"/>
    </g>
  `;
  return { defs, svg };
}

// ── WOLF ───────────────────────────────────
export function drawWolf(x, y, sc, fac, status, uid) {
  const f = FACTION.beast;
  const id = `wf_${uid}`;

  const defs = `
    ${g(`${id}_fur`, [[0,'#6a6060'],[40,'#4a4040'],[100,'#2a2020']])}
    ${g(`${id}_belly`, [[0,'#8a8070'],[50,'#6a6050'],[100,'#3a3028']])}
    ${rg(`${id}_eye`, x+10*sc, y-20*sc, 5*sc, [[0,f.eye,1],[100,f.eye,0]])}
    ${rg(`${id}_glow`, x, y, 18*sc, [[0,f.underGlow,0.18],[100,f.underGlow,0]])}
  `;

  const svg = `
    <g style="transform-origin:${x}px ${y}px;filter:${statusFilter(status)}">
      <ellipse cx="${x}" cy="${y}" rx="${22*sc}" ry="${4*sc}" fill="url(#${id}_glow)"/>
      <!-- Tail curved up -->
      <path d="M${x-15*sc},${y-10*sc} Q${x-28*sc},${y-8*sc} ${x-30*sc},${y-20*sc} Q${x-28*sc},${y-28*sc} ${x-22*sc},${y-24*sc}" fill="none" stroke="#6a6060" stroke-width="${5*sc}" stroke-linecap="round"/>
      <!-- Hind legs -->
      <path d="M${x-10*sc},${y-12*sc} Q${x-12*sc},${y-6*sc} ${x-14*sc},${y}" fill="url(#${id}_fur)" stroke="#2a2020" stroke-width="${0.5*sc}"/>
      <path d="M${x-5*sc},${y-14*sc} Q${x-6*sc},${y-7*sc} ${x-8*sc},${y}" fill="url(#${id}_fur)" stroke="#2a2020" stroke-width="${0.5*sc}"/>
      <!-- Body — hunched quadruped -->
      <path d="M${x-14*sc},${y-20*sc} Q${x-16*sc},${y-14*sc} ${x-10*sc},${y-12*sc} L${x+10*sc},${y-14*sc} Q${x+18*sc},${y-16*sc} ${x+18*sc},${y-22*sc} Q${x+16*sc},${y-30*sc} ${x+8*sc},${y-32*sc} Q${x},${y-34*sc} ${x-8*sc},${y-30*sc} Q${x-16*sc},${y-28*sc} ${x-14*sc},${y-20*sc}Z"
        fill="url(#${id}_fur)" stroke="#2a2020" stroke-width="${0.5*sc}"/>
      <!-- Belly lighter -->
      <path d="M${x-8*sc},${y-18*sc} Q${x},${y-16*sc} ${x+8*sc},${y-18*sc} Q${x+6*sc},${y-28*sc} ${x},${y-30*sc} Q${x-6*sc},${y-28*sc} ${x-8*sc},${y-18*sc}Z"
        fill="url(#${id}_belly)" opacity="0.5"/>
      <!-- Front legs -->
      <path d="M${x+8*sc},${y-18*sc} Q${x+14*sc},${y-10*sc} ${x+16*sc},${y}" fill="url(#${id}_fur)" stroke="#2a2020" stroke-width="${0.5*sc}"/>
      <path d="M${x+12*sc},${y-20*sc} Q${x+18*sc},${y-12*sc} ${x+20*sc},${y}" fill="url(#${id}_fur)" stroke="#2a2020" stroke-width="${0.5*sc}"/>
      <!-- Paws -->
      <ellipse cx="${x-12*sc}" cy="${y}" rx="${4*sc}" ry="${2*sc}" fill="url(#${id}_fur)"/>
      <ellipse cx="${x-7*sc}"  cy="${y}" rx="${3.5*sc}" ry="${2*sc}" fill="url(#${id}_fur)"/>
      <ellipse cx="${x+17*sc}" cy="${y}" rx="${4*sc}" ry="${2*sc}" fill="url(#${id}_fur)"/>
      <ellipse cx="${x+21*sc}" cy="${y}" rx="${3.5*sc}" ry="${2*sc}" fill="url(#${id}_fur)"/>
      <!-- Neck -->
      <path d="M${x+10*sc},${y-30*sc} Q${x+14*sc},${y-26*sc} ${x+16*sc},${y-20*sc}" fill="none" stroke="#4a4040" stroke-width="${8*sc}" stroke-linecap="round"/>
      <!-- Head — forward facing snarl -->
      <path d="M${x+12*sc},${y-36*sc} Q${x+20*sc},${y-34*sc} ${x+26*sc},${y-28*sc} Q${x+28*sc},${y-22*sc} ${x+24*sc},${y-18*sc} Q${x+16*sc},${y-16*sc} ${x+10*sc},${y-20*sc} Q${x+8*sc},${y-28*sc} ${x+12*sc},${y-36*sc}Z"
        fill="url(#${id}_fur)"/>
      <!-- Muzzle -->
      <path d="M${x+24*sc},${y-28*sc} Q${x+32*sc},${y-26*sc} ${x+32*sc},${y-22*sc} Q${x+30*sc},${y-18*sc} ${x+24*sc},${y-18*sc}Z"
        fill="url(#${id}_belly)" opacity="0.8"/>
      <!-- Nose wet -->
      <ellipse cx="${x+30*sc}" cy="${y-24*sc}" rx="${2*sc}" ry="${1.5*sc}" fill="#1a1010"/>
      <!-- Fangs/snarl -->
      <path d="M${x+24*sc},${y-22*sc} Q${x+28*sc},${y-20*sc} ${x+24*sc},${y-18*sc}" fill="none" stroke="#1a1010" stroke-width="${1*sc}"/>
      <path d="M${x+24*sc},${y-22.5*sc} L${x+25.5*sc},${y-19*sc}" stroke="#f0e8d0" stroke-width="${1.2*sc}" stroke-linecap="round"/>
      <path d="M${x+26.5*sc},${y-22.5*sc} L${x+27*sc},${y-19*sc}" stroke="#f0e8d0" stroke-width="${1.2*sc}" stroke-linecap="round"/>
      <!-- Eyes — amber -->
      ${eye(x+15*sc, y-30*sc, 2*sc, f.eye, `${id}_eye`, uid)}
      <!-- Ears perked -->
      <path d="M${x+14*sc},${y-36*sc} L${x+12*sc},${y-44*sc} L${x+18*sc},${y-38*sc}Z" fill="#4a4040"/>
      <path d="M${x+14*sc},${y-36*sc} L${x+13*sc},${y-42*sc} L${x+17*sc},${y-38*sc}Z" fill="#7a5050"/>
      <!-- Hackle fur raised (alert) -->
      ${[0,1,2,3,4].map(i=>`<line x1="${x-8*sc+i*4*sc}" y1="${y-32*sc}" x2="${x-6*sc+i*4*sc}" y2="${y-38*sc}" stroke="#6a6060" stroke-width="${1.2*sc}" stroke-linecap="round"/>`).join('')}
    </g>
  `;
  return { defs, svg };
}

// ── MAGE NPC (FRIENDLY) ───────────────────
export function drawMageNpc(x, y, sc, fac, status, uid) {
  const f = FACTION.friendly;
  const id = `mn_${uid}`;

  const defs = `
    ${g(`${id}_robe`, [[0,'#2a2060'],[50,'#1a1448'],[100,'#0c0a28']])}
    ${g(`${id}_skin`, [[0,'#e8d8b8'],[50,'#c8b898'],[100,'#887858']])}
    ${g(`${id}_gold`, [[0,'#ffd040'],[50,'#c0900a'],[100,'#805000']])}
    ${rg(`${id}_orb`, x+12*sc, y-20*sc, 10*sc, [[0,'#a0a0ff',0.9],[50,'#6060dd',0.7],[100,'#3030aa',0]])}
    ${rg(`${id}_eye`, x, y-35*sc, 5*sc, [[0,'#8888ff',0.8],[100,'#8888ff',0]])}
    ${rg(`${id}_glow`, x, y, 18*sc, [[0,f.underGlow,0.15],[100,f.underGlow,0]])}
  `;

  const svg = `
    <g style="transform-origin:${x}px ${y}px;filter:${statusFilter(status)}">
      <ellipse cx="${x}" cy="${y}" rx="${14*sc}" ry="${3.5*sc}" fill="url(#${id}_glow)"/>
      <!-- Robe hem with star pattern -->
      <path d="M${x-12*sc},${y-4*sc} Q${x-14*sc},${y-2*sc} ${x-16*sc},${y} L${x+16*sc},${y} Q${x+14*sc},${y-2*sc} ${x+12*sc},${y-4*sc}Z" fill="url(#${id}_robe)" opacity="0.9"/>
      <!-- Robe body -->
      <path d="M${x-10*sc},${y-36*sc} Q${x-12*sc},${y-24*sc} ${x-12*sc},${y-8*sc} L${x+12*sc},${y-8*sc} Q${x+12*sc},${y-24*sc} ${x+10*sc},${y-36*sc} Q${x+5*sc},${y-42*sc} ${x},${y-42*sc} Q${x-5*sc},${y-42*sc} ${x-10*sc},${y-36*sc}Z"
        fill="url(#${id}_robe)"/>
      <!-- Gold trim bottom -->
      <path d="M${x-12*sc},${y-8*sc} L${x+12*sc},${y-8*sc}" stroke="url(#${id}_gold)" stroke-width="${1.5*sc}"/>
      <!-- Belt -->
      <rect x="${x-10*sc}" y="${y-22*sc}" width="${20*sc}" height="${3*sc}" rx="${1*sc}" fill="url(#${id}_gold)" opacity="0.8"/>
      <!-- Belt pouch -->
      <rect x="${x+5*sc}" y="${y-24*sc}" width="${5*sc}" height="${4*sc}" rx="${1*sc}" fill="#6a4820"/>
      <!-- Arms with wide sleeves -->
      <path d="M${x-10*sc},${y-34*sc} Q${x-18*sc},${y-28*sc} ${x-16*sc},${y-18*sc}" fill="none" stroke="#1a1448" stroke-width="${6*sc}" stroke-linecap="round"/>
      <path d="M${x+10*sc},${y-34*sc} Q${x+18*sc},${y-28*sc} ${x+16*sc},${y-18*sc}" fill="none" stroke="#1a1448" stroke-width="${6*sc}" stroke-linecap="round"/>
      <!-- Hands -->
      <ellipse cx="${x-15*sc}" cy="${y-16*sc}" rx="${3.5*sc}" ry="${2.5*sc}" fill="url(#${id}_skin)"/>
      <ellipse cx="${x+16*sc}" cy="${y-16*sc}" rx="${3.5*sc}" ry="${2.5*sc}" fill="url(#${id}_skin)"/>
      <!-- Staff -->
      <line x1="${x+16*sc}" y1="${y-16*sc}" x2="${x+14*sc}" y2="${y}" stroke="#8B5A00" stroke-width="${2.5*sc}" stroke-linecap="round"/>
      <line x1="${x+15.5*sc}" y1="${y-14*sc}" x2="${x+15*sc}" y2="${y-36*sc}" stroke="#7a5020" stroke-width="${2*sc}"/>
      <!-- Staff orb glowing -->
      <circle cx="${x+15*sc}" cy="${y-37*sc}" r="${4.5*sc}" fill="url(#${id}_orb)" class="eyeGlow"/>
      <circle cx="${x+15*sc}" cy="${y-37*sc}" r="${3*sc}" fill="#8888ff" opacity="0.5"/>
      <circle cx="${x+13.5*sc}" cy="${y-38.5*sc}" r="${1.5*sc}" fill="white" opacity="0.6"/>
      <!-- Orbiting sparkles -->
      ${[0,120,240].map(deg=>{
        const rad = deg * Math.PI / 180;
        const ox = Math.cos(rad) * 7*sc;
        const oy = Math.sin(rad) * 7*sc;
        return `<circle cx="${x+15*sc+ox}" cy="${y-37*sc+oy}" r="${1*sc}" fill="#c0c0ff" opacity="0.6" class="eyeGlow"/>`;
      }).join('')}
      <!-- Head -->
      <ellipse cx="${x}" cy="${y-48*sc}" rx="${7.5*sc}" ry="${7*sc}" fill="url(#${id}_skin)"/>
      <!-- Eyes — wise -->
      ${eye(x-3*sc, y-50*sc, 1.5*sc, '#8888ff', `${id}_eye`, uid)}
      ${eye(x+3*sc, y-50*sc, 1.5*sc, '#8888ff', `${id}_eye`, uid)}
      <!-- Wise beard -->
      <path d="M${x-4*sc},${y-44*sc} Q${x},${y-40*sc} ${x+4*sc},${y-44*sc} Q${x+3*sc},${y-38*sc} ${x},${y-36*sc} Q${x-3*sc},${y-38*sc} ${x-4*sc},${y-44*sc}Z"
        fill="#e8e8e0" opacity="0.9"/>
      <!-- Pointed hat -->
      <path d="M${x-8*sc},${y-54*sc} Q${x-10*sc},${y-56*sc} ${x-8*sc},${y-56*sc} L${x},${y-76*sc} L${x+8*sc},${y-56*sc} Q${x+10*sc},${y-56*sc} ${x+8*sc},${y-54*sc}Z"
        fill="#1a1448"/>
      <ellipse cx="${x}" cy="${y-54*sc}" rx="${9*sc}" ry="${2.5*sc}" fill="#1a1448"/>
      <!-- Hat band gold -->
      <ellipse cx="${x}" cy="${y-55.5*sc}" rx="${8*sc}" ry="${1.2*sc}" fill="url(#${id}_gold)" opacity="0.7"/>
      <!-- Stars on hat -->
      <circle cx="${x-3*sc}" cy="${y-64*sc}" r="${1*sc}" fill="#8888ff" opacity="0.6"/>
      <circle cx="${x+2*sc}" cy="${y-60*sc}" r="${0.8*sc}" fill="#ffd040" opacity="0.7"/>
    </g>
  `;
  return { defs, svg };
}

// ── KRAKEN ARM ─────────────────────────────
export function drawKraken(x, y, sc, fac, status, uid) {
  const f = FACTION.boss;
  const id = `kr_${uid}`;

  const defs = `
    ${g(`${id}_tent`, [[0,'#1a2a4a'],[50,'#0e1c34'],[100,'#060e1a']])}
    ${g(`${id}_sucker`, [[0,'#c04040'],[50,'#802020'],[100,'#400000']])}
    ${rg(`${id}_eye`, x+10*sc, y-35*sc, 10*sc, [[0,'#ff8800',1],[100,'#ff4400',0]])}
    ${rg(`${id}_glow`, x, y, 35*sc, [[0,'#000844',0.3],[100,'#000844',0]])}
  `;

  const svg = `
    <g class="${animClass('kraken')}" style="transform-origin:${x}px ${y}px;filter:${statusFilter(status)}">
      <ellipse cx="${x}" cy="${y}" rx="${40*sc}" ry="${8*sc}" fill="url(#${id}_glow)"/>
      <!-- Multiple tentacles emerging from water -->
      <!-- Main central tentacle -->
      <path d="M${x},${y} Q${x+5*sc},${y-25*sc} ${x+10*sc},${y-45*sc} Q${x+15*sc},${y-60*sc} ${x+8*sc},${y-70*sc}"
        fill="none" stroke="${f.primary}" stroke-width="${14*sc}" stroke-linecap="round"/>
      <!-- Tentacle highlight -->
      <path d="M${x+2*sc},${y-5*sc} Q${x+7*sc},${y-28*sc} ${x+12*sc},${y-47*sc}" fill="none" stroke="#2a3a5a" stroke-width="${2*sc}" opacity="0.4"/>
      <!-- Left secondary tentacle -->
      <path d="M${x-10*sc},${y} Q${x-18*sc},${y-20*sc} ${x-20*sc},${y-38*sc} Q${x-22*sc},${y-50*sc} ${x-14*sc},${y-52*sc}"
        fill="none" stroke="${f.primary}" stroke-width="${10*sc}" stroke-linecap="round"/>
      <!-- Right secondary tentacle -->
      <path d="M${x+15*sc},${y} Q${x+28*sc},${y-15*sc} ${x+30*sc},${y-30*sc} Q${x+32*sc},${y-42*sc} ${x+26*sc},${y-46*sc}"
        fill="none" stroke="${f.primary}" stroke-width="${10*sc}" stroke-linecap="round"/>
      <!-- Small tentacle far left -->
      <path d="M${x-22*sc},${y} Q${x-30*sc},${y-10*sc} ${x-32*sc},${y-22*sc}"
        fill="none" stroke="${f.primary}" stroke-width="${7*sc}" stroke-linecap="round"/>
      <!-- Suckers on main tentacle -->
      ${[0,1,2,3,4].map(i=>{
        const t = i/4;
        const cx2 = x + 5*sc + t*5*sc;
        const cy2 = y - 10*sc - t*35*sc;
        const sr = (3-t*1.5)*sc;
        return `
          <circle cx="${cx2}" cy="${cy2}" r="${sr}" fill="url(#${id}_sucker)"/>
          <circle cx="${cx2}" cy="${cy2}" r="${sr*0.5}" fill="#600000" opacity="0.8"/>
        `;
      }).join('')}
      <!-- Eye emerging from water -->
      <ellipse cx="${x-5*sc}" cy="${y-12*sc}" rx="${12*sc}" ry="${8*sc}" fill="#0e1c34"/>
      <ellipse cx="${x-5*sc}" cy="${y-12*sc}" rx="${8*sc}" ry="${5.5*sc}" fill="#060e1a"/>
      ${eye(x-5*sc, y-12*sc, 4*sc, '#ff8800', `${id}_eye`, uid)}
      <!-- Pupil slit -->
      <rect x="${x-5.8*sc}" y="${y-16*sc}" width="${1.6*sc}" height="${8*sc}" rx="${0.8*sc}" fill="#0a0808" transform="rotate(0,${x-5*sc},${y-12*sc})"/>
      <!-- Water splash at base -->
      ${[-20,-10,0,10,20].map(ox=>`
        <path d="M${x+ox*sc},${y} Q${x+ox*sc-3*sc},${y-5*sc} ${x+ox*sc-6*sc},${y-3*sc}" fill="none" stroke="#3a5a7a" stroke-width="${1*sc}" opacity="0.4"/>
      `).join('')}
    </g>
  `;
  return { defs, svg };
}

// ── SPIDER ─────────────────────────────────
export function drawSpider(x, y, sc, fac, status, uid) {
  const f = FACTION[fac] || FACTION.enemy;
  const id = `sp_${uid}`;

  const defs = `
    ${g(`${id}_body`, [[0,'#2a1a0a'],[50,'#1a1008'],[100,'#080604']])}
    ${rg(`${id}_eye`, x, y-10*sc, 4*sc, [[0,f.eye,0.9],[100,f.eye,0]])}
    ${rg(`${id}_glow`, x, y, 16*sc, [[0,f.underGlow,0.15],[100,f.underGlow,0]])}
  `;

  const svg = `
    <g class="${animClass('spider')}" style="transform-origin:${x}px ${y}px;filter:${statusFilter(status)}">
      <ellipse cx="${x}" cy="${y}" rx="${20*sc}" ry="${4*sc}" fill="url(#${id}_glow)"/>
      <!-- 8 legs -->
      ${[[-1,-2],[-1,-1],[-1,0],[-1,1],[1,-2],[1,-1],[1,0],[1,1]].map(([side,row],i) => {
        const startX = x + side*6*sc;
        const startY = y - 8*sc;
        const midX = x + side*(12+Math.abs(row)*2)*sc;
        const midY = y - (12+row*2)*sc;
        const endX = x + side*(16+Math.abs(row)*1.5)*sc;
        const endY = y + (row < 0 ? 2 : -2)*sc;
        return `<path d="M${startX},${startY} Q${midX},${midY} ${endX},${endY}" fill="none" stroke="#1a1008" stroke-width="${2*sc}" stroke-linecap="round"/>`;
      }).join('')}
      <!-- Abdomen -->
      <ellipse cx="${x}" cy="${y-6*sc}" rx="${8*sc}" ry="${6*sc}" fill="url(#${id}_body)"/>
      <!-- Abdomen markings -->
      <ellipse cx="${x}" cy="${y-6*sc}" rx="${3*sc}" ry="${4*sc}" fill="#3a2a18" opacity="0.6"/>
      <!-- Cephalothorax -->
      <ellipse cx="${x}" cy="${y-14*sc}" rx="${6*sc}" ry="${5*sc}" fill="url(#${id}_body)"/>
      <!-- Mandibles -->
      <path d="M${x-4*sc},${y-10*sc} Q${x-6*sc},${y-8*sc} ${x-5*sc},${y-6*sc}" fill="none" stroke="#2a1808" stroke-width="${1.5*sc}" stroke-linecap="round"/>
      <path d="M${x+4*sc},${y-10*sc} Q${x+6*sc},${y-8*sc} ${x+5*sc},${y-6*sc}" fill="none" stroke="#2a1808" stroke-width="${1.5*sc}" stroke-linecap="round"/>
      <!-- 8 eyes in arc -->
      ${[-3,-1.5,0,1.5,3].map(ex => `<circle cx="${x+ex*sc}" cy="${y-16*sc}" r="${1.2*sc}" fill="${f.eye}" opacity="0.8" class="eyeGlow"/>`).join('')}
      ${[-1.5,1.5].map(ex => `<circle cx="${x+ex*sc}" cy="${y-18*sc}" r="${1.2*sc}" fill="${f.eye}" opacity="0.8" class="eyeGlow"/>`).join('')}
      <!-- Fangs -->
      <path d="M${x-2*sc},${y-10*sc} L${x-2*sc},${y-7*sc}" stroke="#c04020" stroke-width="${1.2*sc}" stroke-linecap="round"/>
      <path d="M${x+2*sc},${y-10*sc} L${x+2*sc},${y-7*sc}" stroke="#c04020" stroke-width="${1.2*sc}" stroke-linecap="round"/>
    </g>
  `;
  return { defs, svg };
}

// ── ELDER NPC (FRIENDLY) ──────────────────
export function drawElder(x, y, sc, fac, status, uid) {
  const f = FACTION.friendly;
  const id = `el_${uid}`;

  const defs = `
    ${g(`${id}_robe`, [[0,'#c8b880'],[50,'#a89860'],[100,'#687040']])}
    ${g(`${id}_skin`, [[0,'#d8c8b0'],[50,'#b8a890'],[100,'#787060']])}
    ${rg(`${id}_eye`, x, y-34*sc, 4*sc, [[0,f.eye,0.6],[100,f.eye,0]])}
    ${rg(`${id}_glow`, x, y, 14*sc, [[0,f.underGlow,0.12],[100,f.underGlow,0]])}
  `;

  const svg = `
    <g style="transform-origin:${x}px ${y}px;filter:${statusFilter(status)}">
      <ellipse cx="${x}" cy="${y}" rx="${12*sc}" ry="${3*sc}" fill="url(#${id}_glow)"/>
      <!-- Sandals -->
      <ellipse cx="${x-4*sc}" cy="${y}" rx="${4*sc}" ry="${2*sc}" fill="#8a6830"/>
      <ellipse cx="${x+4*sc}" cy="${y}" rx="${4*sc}" ry="${2*sc}" fill="#8a6830"/>
      <!-- Robe — flowing, stooped -->
      <path d="M${x-8*sc},${y-30*sc} Q${x-9*sc},${y-20*sc} ${x-7*sc},${y-8*sc} L${x+7*sc},${y-8*sc} Q${x+9*sc},${y-20*sc} ${x+8*sc},${y-30*sc} Q${x+4*sc},${y-36*sc} ${x},${y-36*sc} Q${x-4*sc},${y-36*sc} ${x-8*sc},${y-30*sc}Z"
        fill="url(#${id}_robe)"/>
      <!-- Robe pattern lines -->
      ${[-28,-22,-16,-10].map(yy=>{ const w=(7+Math.abs(yy/4))*sc; return `<path d="M${x-w},${y+yy*sc} Q${x},${y+(yy-1)*sc} ${x+w},${y+yy*sc}" fill="none" stroke="#887850" stroke-width="${0.5*sc}" opacity="0.4"/>`;}).join('')}
      <!-- Arms — one raised with walking stick -->
      <path d="M${x-8*sc},${y-28*sc} Q${x-14*sc},${y-22*sc} ${x-14*sc},${y-12*sc}" fill="none" stroke="#a89060" stroke-width="${4*sc}" stroke-linecap="round"/>
      <path d="M${x+8*sc},${y-28*sc} Q${x+16*sc},${y-22*sc} ${x+16*sc},${y-8*sc}" fill="none" stroke="#a89060" stroke-width="${4*sc}" stroke-linecap="round"/>
      <!-- Walking staff -->
      <line x1="${x+16*sc}" y1="${y-8*sc}" x2="${x+18*sc}" y2="${y}" stroke="#8B5A00" stroke-width="${2.5*sc}" stroke-linecap="round"/>
      <line x1="${x+16.5*sc}" y1="${y-6*sc}" x2="${x+15*sc}" y2="${y-30*sc}" stroke="#7a5020" stroke-width="${2*sc}"/>
      <!-- Gnarled top -->
      <path d="M${x+15*sc},${y-30*sc} Q${x+13*sc},${y-34*sc} ${x+17*sc},${y-34*sc} Q${x+16*sc},${y-30*sc}" fill="#7a5020"/>
      <!-- Head — slightly hunched -->
      <ellipse cx="${x-2*sc}" cy="${y-42*sc}" rx="${7*sc}" ry="${6.5*sc}" fill="url(#${id}_skin)" transform="rotate(8,${x-2*sc},${y-42*sc})"/>
      <!-- Wrinkle lines -->
      <path d="M${x-5*sc},${y-44*sc} Q${x-4*sc},${y-43*sc} ${x-2*sc},${y-44*sc}" fill="none" stroke="#a89880" stroke-width="${0.7*sc}" opacity="0.6"/>
      <path d="M${x-4*sc},${y-41*sc} Q${x-2*sc},${y-40.5*sc} ${x},${y-41*sc}" fill="none" stroke="#a89880" stroke-width="${0.7*sc}" opacity="0.5"/>
      <!-- Bushy white eyebrows -->
      <path d="M${x-6*sc},${y-46*sc} Q${x-4*sc},${y-47.5*sc} ${x-2*sc},${y-46*sc}" fill="none" stroke="#e8e8e0" stroke-width="${1.5*sc}"/>
      <path d="M${x-1*sc},${y-46*sc} Q${x+1*sc},${y-47.5*sc} ${x+3*sc},${y-46*sc}" fill="none" stroke="#e8e8e0" stroke-width="${1.5*sc}"/>
      <!-- Kind eyes squinted -->
      <path d="M${x-5.5*sc},${y-44.5*sc} Q${x-3.5*sc},${y-46*sc} ${x-1.5*sc},${y-44.5*sc}" fill="none" stroke="#4a3828" stroke-width="${1.2*sc}"/>
      <circle cx="${x-3.5*sc}" cy="${y-44.5*sc}" r="${1.2*sc}" fill="#5a4838"/>
      <path d="M${x+0*sc},${y-44.5*sc} Q${x+1.5*sc},${y-46*sc} ${x+3*sc},${y-44.5*sc}" fill="none" stroke="#4a3828" stroke-width="${1.2*sc}"/>
      <circle cx="${x+1.5*sc}" cy="${y-44.5*sc}" r="${1.2*sc}" fill="#5a4838"/>
      <!-- White beard flowing -->
      <path d="M${x-5*sc},${y-39*sc} Q${x-4*sc},${y-36*sc} ${x-3*sc},${y-32*sc} Q${x-1*sc},${y-28*sc} ${x},${y-26*sc} Q${x+1*sc},${y-28*sc} ${x+2*sc},${y-32*sc} Q${x+3*sc},${y-36*sc} ${x+4*sc},${y-39*sc} Q${x+2*sc},${y-38*sc} ${x},${y-37*sc} Q${x-2*sc},${y-38*sc} ${x-5*sc},${y-39*sc}Z"
        fill="#e8e8e0" opacity="0.95"/>
      <!-- White wisps of hair -->
      <path d="M${x-7*sc},${y-46*sc} Q${x-10*sc},${y-50*sc} ${x-8*sc},${y-48*sc}" fill="none" stroke="#e8e8e0" stroke-width="${1*sc}" opacity="0.7"/>
      <path d="M${x+3*sc},${y-46*sc} Q${x+8*sc},${y-50*sc} ${x+6*sc},${y-48*sc}" fill="none" stroke="#e8e8e0" stroke-width="${1*sc}" opacity="0.7"/>
    </g>
  `;
  return { defs, svg };
}

// ── MAIN REGISTRY ──────────────────────────
// Maps creature type string → draw function

export const CREATURE_REGISTRY = {
  goblin:         (x,y,sc,fac,st,uid) => drawGoblin(x,y,sc,fac,st,uid,'dagger'),
  goblin_archer:  (x,y,sc,fac,st,uid) => drawGoblin(x,y,sc,fac,st,uid,'archer'),
  goblin_shaman:  (x,y,sc,fac,st,uid) => drawGoblin(x,y,sc,fac,st,uid,'shaman'),
  orc:            (x,y,sc,fac,st,uid) => drawOrc(x,y,sc,fac,st,uid,'warrior'),
  orc_berserker:  (x,y,sc,fac,st,uid) => drawOrc(x,y,sc,fac,st,uid,'berserker'),
  skeleton:       (x,y,sc,fac,st,uid) => drawSkeleton(x,y,sc,fac,st,uid,'warrior'),
  skeleton_archer:(x,y,sc,fac,st,uid) => drawSkeleton(x,y,sc,fac,st,uid,'archer'),
  ghost:          drawGhost,
  wraith:         drawWraith,
  zombie:         drawZombie,
  dragon:         drawDragon,
  troll:          drawTroll,
  demon:          drawDemon,
  vampire:        drawVampire,
  wolf:           drawWolf,
  spider:         drawSpider,
  alien_grey:     drawAlienGrey,
  robot_drone:    drawRobotDrone,
  kraken:         drawKraken,
  bandit:         (x,y,sc,fac,st,uid) => drawBandit(x,y,sc,fac,st,uid,'bandit'),
  thief:          (x,y,sc,fac,st,uid) => drawBandit(x,y,sc,fac,st,uid,'thief'),
  assassin:       (x,y,sc,fac,st,uid) => drawBandit(x,y,sc,fac,st,uid,'thief'),
  merchant:       drawMerchant,
  mage_npc:       drawMageNpc,
  elder:          drawElder,
};

export function drawCreature(type, x, y, scale, faction, status, uid) {
  const fn = CREATURE_REGISTRY[type];
  if (!fn) return { defs:'', svg:'' };
  try {
    return fn(x, y, scale, faction, status, uid);
  } catch(e) {
    console.warn('Creature draw error:', type, e);
    return { defs:'', svg:'' };
  }
}
