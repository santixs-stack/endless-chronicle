// ═══════════════════════════════════════════
//  PARTICLE SYSTEM + POSITIONING
//  Handles creature placement in 3D depth
//  planes, status-driven aura, particles.
// ═══════════════════════════════════════════

import { W, H, SIZE, DEPTH, SCENE_CREATURES, CREATURE_PARTICLES, FACTION } from './artStyle.js';
import { roleToCreature } from './artStyle.js';
import { drawCreature } from './creatures.js';

// ── Seeded random ──────────────────────────
function mkRand(seed) {
  let s = (seed | 0) + 1;
  return () => { s = (s * 16807 + 7) % 2147483647; return (s - 1) / 2147483646; };
}

// ── Map NPC relationship → faction ────────
function relToFaction(rel) {
  if (!rel) return 'neutral';
  const r = rel.toLowerCase();
  if (r.includes('enemy') || r.includes('hostile') || r.includes('attack')) return 'enemy';
  if (r.includes('friend') || r.includes('ally') || r.includes('helpful')) return 'friendly';
  if (r.includes('boss') || r.includes('villain') || r.includes('leader')) return 'boss';
  return 'neutral';
}

// ── Map NPC to size category ───────────────
function creatureSize(type) {
  if (!type) return SIZE.medium;
  const t = type.toLowerCase();
  if (['dragon','demon','kraken','boss_creature','troll','golem'].some(k=>t.includes(k))) return SIZE.large;
  if (['goblin','rat','bat','spider','fairy','imp'].some(k=>t.includes(k))) return SIZE.small;
  if (['child_npc'].some(k=>t.includes(k))) return SIZE.small;
  return SIZE.medium;
}

// ── Build scene population ─────────────────
// Given NPCs from game state, build a list of
// positioned creatures for the scene renderer.
export function buildScenePopulation(npcs, inCombat, combatants, sceneType, turnCount, terrainPts) {
  try {
  const r = mkRand(turnCount * 991 + (sceneType?.charCodeAt(0) || 1) * 37);
  const population = [];

  // ── Player characters (already handled externally, skip) ──

  // ── NPCs from game state ───────────────────
  const activeNpcs = (npcs || []).slice(0, 6); // max 6 NPCs visible
  const combatActive = inCombat && combatants?.length > 0;

  activeNpcs.forEach((npc, i) => {
    const creatureType = npc.creatureType || roleToCreature(npc.role) || 'bandit';
    const faction = relToFaction(npc.relationship);
    const sz = creatureSize(creatureType);

    // Determine depth plane based on relationship
    // Enemies go further back, friendlies come closer
    let plane;
    if (faction === 'enemy' || faction === 'boss') {
      plane = i < 2 ? 'mid' : 'far';
    } else if (faction === 'friendly') {
      plane = i === 0 ? 'near' : 'mid';
    } else {
      plane = 'mid';
    }

    const dep = DEPTH[plane];

    // X position — enemies spread across back, friendlies to sides
    let xPos;
    if (faction === 'enemy' || faction === 'boss') {
      // Spread enemies across back half of scene
      const totalEnemies = activeNpcs.filter(n => relToFaction(n.relationship) === 'enemy' || relToFaction(n.relationship) === 'boss').length;
      const enemyIdx = activeNpcs.filter((n,j) => j < i && (relToFaction(n.relationship) === 'enemy' || relToFaction(n.relationship) === 'boss')).length;
      const spread = Math.min(totalEnemies - 1, 3);
      xPos = W * 0.35 + (spread > 0 ? (enemyIdx / spread) * W * 0.35 : W * 0.175);
      // Slight randomness
      xPos += (r() - 0.5) * 30;
    } else if (faction === 'friendly') {
      // Friendly NPCs to the right of party
      xPos = W * 0.68 + i * 28 + (r() - 0.5) * 15;
    } else {
      // Neutrals scattered
      xPos = W * 0.2 + r() * W * 0.6;
    }

    // Y position from terrain
    const terrainY = getTerrainY(xPos, terrainPts);
    const yPos = terrainY + dep.yOffset * H;

    // Scale from depth plane + size class.
    // Creatures are designed at sc=1.0 to be ~62px tall on a 300px canvas.
    // dep.scale (0.55/0.78/1.0) handles depth, size ratio handles small/large variation.
    const sizeRatio = sz / SIZE.medium; // small=0.65, medium=1.0, large=1.35
    const scale = dep.scale * sizeRatio;

    // Status from combat
    let status = 'healthy';
    if (combatActive) {
      const combatant = combatants?.find(c => c.name === npc.name);
      if (combatant) {
        const pct = combatant.hp / (combatant.maxHp || 1);
        if (pct <= 0) status = 'dead';
        else if (pct <= 0.25) status = 'critical';
        else if (pct <= 0.5) status = 'bloodied';
        else if (combatants?.indexOf(combatant) === 0) status = 'active';
      }
    }

    population.push({
      type: creatureType,
      x: xPos,
      y: yPos,
      scale,
      faction,
      status,
      plane,
      depth: dep,
      name: npc.name,
      uid: `npc${i}_t${turnCount}`,
    });
  });

  // ── Ambient background creatures ──────────
  // If scene has no NPCs, populate with ambient creatures
  if (population.length === 0 && sceneType) {
    const ambientTypes = SCENE_CREATURES[sceneType] || [];
    const count = 1 + Math.floor(r() * 2); // 1-2 ambient creatures
    for (let i = 0; i < count && i < ambientTypes.length; i++) {
      const type = ambientTypes[Math.floor(r() * ambientTypes.length)];
      const sz = creatureSize(type);
      const xPos = W * 0.25 + r() * W * 0.5;
      const terrainY = getTerrainY(xPos, terrainPts);

      population.push({
        type,
        x: xPos,
        y: terrainY + DEPTH.far.yOffset * H,
        scale: DEPTH.far.scale * (sz / SIZE.medium) * 0.8,
        faction: 'enemy',
        status: 'healthy',
        plane: 'far',
        depth: DEPTH.far,
        name: null,
        uid: `amb${i}_t${turnCount}`,
        ambient: true,
      });
    }
  }

  return population;
  } catch(e) {
    console.warn('buildScenePopulation error:', e.message);
    return [];
  }
}

// ── Get Y position from terrain ───────────
function getTerrainY(x, terrainPts) {
  if (!terrainPts?.length) return H * 0.65;
  const idx = Math.round((x / W) * (terrainPts.length - 1));
  return terrainPts[Math.max(0, Math.min(terrainPts.length - 1, idx))]?.y || H * 0.65;
}

// ── Render all creatures to SVG strings ────
export function renderPopulation(population) {
  const allDefs = [];
  const farSvg  = [];
  const midSvg  = [];
  const nearSvg = [];

  population.forEach(creature => {
    const result = drawCreature(
      creature.type,
      creature.x,
      creature.y,
      creature.scale,
      creature.faction,
      creature.status,
      creature.uid,
    );
    if (!result.svg) return;

    allDefs.push(result.defs);

    // Sort into depth planes
    const layer = creature.plane === 'far' ? farSvg : creature.plane === 'mid' ? midSvg : nearSvg;
    layer.push(`<g opacity="${creature.depth.opacity}">${result.svg}</g>`);
  });

  return {
    defs: allDefs.join('\n'),
    far:  farSvg.join('\n'),
    mid:  midSvg.join('\n'),
    near: nearSvg.join('\n'),
  };
}

// ── Particle system ────────────────────────
// Returns SVG string of particles for a creature
export function renderParticles(population, turnCount) {
  const r = mkRand(turnCount * 113);
  const parts = [];

  population.forEach(creature => {
    const preset = CREATURE_PARTICLES[creature.type];
    if (!preset) return;

    const count = preset.count;
    const cx = creature.x;
    const cy = creature.y - (creatureSize(creature.type) * creature.scale * H * 0.5);

    Array.from({ length: count }, (_, i) => {
      const px = cx + (r() - 0.5) * 30 * creature.scale;
      const py = cy - r() * 20 * creature.scale;
      const pr = preset.size * creature.scale * (0.5 + r() * 0.8);
      const op = 0.3 + r() * 0.5;
      const delay = r() * 3;

      if (preset.type === 'wisp' || preset.type === 'dust') {
        parts.push(`<circle cx="${px}" cy="${py}" r="${pr}" fill="${preset.color}" opacity="${op}" class="emberFloat" style="animation-delay:${delay}s"/>`);
      } else if (preset.type === 'ember') {
        parts.push(`<circle cx="${px}" cy="${py}" r="${pr}" fill="${preset.color}" opacity="${op}" class="emberFloat" style="animation-delay:${delay}s"/>`);
        // Glow
        parts.push(`<circle cx="${px}" cy="${py}" r="${pr*2}" fill="${preset.color}" opacity="${op*0.3}" class="eyeGlow"/>`);
      } else if (preset.type === 'spark') {
        const ex = px + (r()-0.5)*6*creature.scale;
        const ey = py - r()*8*creature.scale;
        parts.push(`<line x1="${px}" y1="${py}" x2="${ex}" y2="${ey}" stroke="${preset.color}" stroke-width="${pr}" opacity="${op}" class="emberFloat" style="animation-delay:${delay}s"/>`);
      } else if (preset.type === 'sparkle') {
        parts.push(`<path d="M${px},${py-pr*2} L${px+pr*0.5},${py} L${px},${py+pr*2} L${px-pr*0.5},${py}Z" fill="${preset.color}" opacity="${op}" class="twinkle" style="animation-delay:${delay}s"/>`);
      } else if (preset.type === 'drip') {
        const dy = py + r() * 15 * creature.scale;
        parts.push(`<path d="M${px},${py} Q${px+pr},${(py+dy)/2} ${px},${dy}" fill="none" stroke="${preset.color}" stroke-width="${pr}" opacity="${op}" class="bubbleRise" style="animation-delay:${delay}s"/>`);
      } else if (preset.type === 'static') {
        const ex = px + (r()-0.5)*10*creature.scale;
        const ey = py + (r()-0.5)*8*creature.scale;
        parts.push(`<line x1="${px}" y1="${py}" x2="${ex}" y2="${ey}" stroke="${preset.color}" stroke-width="${pr*0.6}" opacity="${op*0.7}" class="eyeGlow"/>`);
      } else if (preset.type === 'shard') {
        parts.push(`<polygon points="${px},${py-pr*2} ${px+pr},${py} ${px},${py+pr} ${px-pr},${py}" fill="${preset.color}" opacity="${op}" class="twinkle" style="animation-delay:${delay}s"/>`);
      }
    });
  });

  return parts.join('\n');
}

// ── Status aura under creature feet ────────
export function renderStatusAuras(population, uid) {
  const auras = [];

  population.forEach((creature, i) => {
    if (creature.status === 'dead') return;

    const auraUid = `aura_${uid}_${i}`;
    const sz = creatureSize(creature.type) * creature.scale;
    const rx = sz * 0.8;
    const ry = rx * 0.3;
    const cx = creature.x;
    const cy = creature.y;

    let color, opacity, cssClass;

    if (creature.status === 'active') {
      color = '#ffd040'; opacity = 0.5; cssClass = 'eyeGlow';
    } else if (creature.status === 'critical') {
      color = '#ff2020'; opacity = 0.6; cssClass = 'eyeGlow';
    } else if (creature.status === 'bloodied') {
      color = '#cc1010'; opacity = 0.35; cssClass = '';
    } else if (creature.faction === 'friendly') {
      color = '#40cc40'; opacity = 0.2; cssClass = '';
    } else if (creature.faction === 'boss') {
      color = '#cc00ff'; opacity = 0.35; cssClass = 'eyeGlow';
    } else {
      return; // no aura for regular neutrals/enemies
    }

    auras.push(`
      <radialGradient id="${auraUid}" cx="50%" cy="50%" r="50%" gradientUnits="userSpaceOnUse" gradientTransform="translate(${cx},${cy}) scale(${rx},${ry}) translate(-1,-1)">
        <stop offset="0%" stop-color="${color}" stop-opacity="${opacity}"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
      </radialGradient>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${auraUid})" class="${cssClass}"/>
    `);
  });

  return auras.join('\n');
}

// ── Name labels for key NPCs ───────────────
export function renderNpcLabels(population) {
  return population
    .filter(c => c.name && !c.ambient && c.plane !== 'far')
    .map(c => {
      const sz = creatureSize(c.type) * c.scale;
      const labelY = c.y - sz - 4;
      const fac = FACTION[c.faction] || FACTION.neutral;
      return `
        <text x="${c.x}" y="${labelY}" text-anchor="middle"
          font-family="monospace" font-size="${7 * c.depth.scale}"
          fill="${fac.eye}" opacity="0.75" letter-spacing="0.5">
          ${c.name}
        </text>
      `;
    })
    .join('\n');
}
