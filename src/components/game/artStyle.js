// ═══════════════════════════════════════════
//  ART STYLE SPEC
//  Single source of truth for all visual
//  decisions in the scene renderer.
//  Lock this before building any creatures.
// ═══════════════════════════════════════════

export const W = 640, H = 300;

// ── Unit system ────────────────────────────
// All creature heights are expressed as
// fractions of H so they scale perfectly.
export const SIZE = {
  tiny:   H * 0.08,   // rats, imps, familiars
  small:  H * 0.13,   // goblins, kobolds, sprites
  medium: H * 0.19,   // humans, orcs, zombies
  large:  H * 0.27,   // trolls, golems, ogres
  boss:   H * 0.40,   // dragons, demons, krakens
};

// ── Depth staging ──────────────────────────
// Three planes. Each plane has a Y anchor
// (where feet touch ground), a scale factor,
// and a desaturation amount.
// Foreground is fullest, background is ghost.
export const DEPTH = {
  far:  { yOffset: -0.08, scale: 0.55, opacity: 0.55, desat: 0.6 },
  mid:  { yOffset:  0.00, scale: 0.78, opacity: 0.80, desat: 0.2 },
  near: { yOffset:  0.08, scale: 1.00, opacity: 1.00, desat: 0.0 },
};

// ── Global light source ────────────────────
// Angle 0 = top, PI/4 = top-right, PI/2 = right
// All shading decisions reference this.
export const LIGHT_ANGLE = Math.PI * 1.75; // top-left
export const LIGHT_X = Math.cos(LIGHT_ANGLE);
export const LIGHT_Y = Math.sin(LIGHT_ANGLE);

// ── Faction color system ───────────────────
// Enemy: warm reds/sickly greens — instant threat read
// Friendly: cool blues/golds — safe
// Neutral: muted greys/browns — ambiguous
// Boss: deep purples/blacks with glow — unique threat
export const FACTION = {
  enemy: {
    primary:   '#8B1A1A',
    highlight: '#C43030',
    shadow:    '#4A0A0A',
    eye:       '#FF4400',
    glow:      'rgba(255,60,0,0.4)',
    underGlow: '#FF3300',
  },
  friendly: {
    primary:   '#1A4A6B',
    highlight: '#3A8AB0',
    shadow:    '#0A1E30',
    eye:       '#40AAFF',
    glow:      'rgba(60,160,255,0.4)',
    underGlow: '#3399FF',
  },
  neutral: {
    primary:   '#4A3E2E',
    highlight: '#7A6A50',
    shadow:    '#1E1810',
    eye:       '#AA8844',
    glow:      'rgba(180,140,80,0.3)',
    underGlow: '#AA8800',
  },
  boss: {
    primary:   '#2A0A3A',
    highlight: '#6A2A8A',
    shadow:    '#0A0014',
    eye:       '#CC00FF',
    glow:      'rgba(180,0,255,0.6)',
    underGlow: '#AA00FF',
  },
  undead: {
    primary:   '#2A3A20',
    highlight: '#4A6A38',
    shadow:    '#0A1008',
    eye:       '#88FF44',
    glow:      'rgba(100,255,50,0.4)',
    underGlow: '#66FF22',
  },
  magic: {
    primary:   '#1A1A4A',
    highlight: '#4040AA',
    shadow:    '#080820',
    eye:       '#8888FF',
    glow:      'rgba(120,120,255,0.5)',
    underGlow: '#6666EE',
  },
  beast: {
    primary:   '#3A2A10',
    highlight: '#6A4A20',
    shadow:    '#18100A',
    eye:       '#FFAA00',
    glow:      'rgba(255,160,0,0.4)',
    underGlow: '#FF8800',
  },
  alien: {
    primary:   '#0A2A1A',
    highlight: '#1A6A3A',
    shadow:    '#040E08',
    eye:       '#00FFAA',
    glow:      'rgba(0,255,160,0.5)',
    underGlow: '#00EE88',
  },
};

// ── Status visual states ───────────────────
export const STATUS = {
  healthy:  { tint: null,      opacity: 1.0,  scale: 1.0  },
  bloodied: { tint: '#8B0000', opacity: 0.9,  scale: 0.97 },
  critical: { tint: '#CC0000', opacity: 0.85, scale: 0.94 },
  dead:     { tint: '#888888', opacity: 0.5,  scale: 0.88 },
  active:   { tint: null,      opacity: 1.0,  scale: 1.02 },
};

// ── Scene focal points ─────────────────────
// Each scene type has a dominant centerpiece.
export const FOCAL_POINTS = {
  dungeon:  'door',
  cave:     'crystalCluster',
  castle:   'throne',
  ruins:    'altar',
  forest:   'ancientTree',
  plains:   'signpost',
  ocean:    'wreck',
  space:    'artifact',
  village:  'well',
  city:     'fountain',
  desert:   'obelisk',
  mountain: 'shrine',
  swamp:    'cauldron',
  snow:     'iceMonolith',
};

// ── Creature → scene affinity ──────────────
// Which creatures appear naturally in each scene
export const SCENE_CREATURES = {
  // ── Core fantasy scenes ────────────────────────────────────────────────
  dungeon:   ['goblin','skeleton','rat','zombie','troll','orc'],
  cave:      ['bat','spider','wraith','zombie','rat','crystal_golem'],
  castle:    ['knight','ghost','vampire','demon','guard','cursed_knight'],
  ruins:     ['skeleton','wraith','cursed_knight','mummy','ghost','zombie'],
  forest:    ['wolf','fairy','bandit','ranger_npc','witch','elder'],
  plains:    ['bandit','merchant','guard','wolf','gunslinger','elder'],
  // ── Water / ocean scenes ───────────────────────────────────────────────
  ocean:     ['pirate_npc','ghost_sailor','kraken','sea_captain','mermaid'],
  ship:      ['pirate_npc','sea_captain','ghost_sailor','guard'],
  // ── Urban scenes — genre-blended ──────────────────────────────────────
  village:   ['merchant','elder','guard','witch','samurai_npc','gunslinger'],
  tavern:    ['bandit','merchant','elder','pirate_npc','gunslinger','guard'],
  city:      ['thief','guard','merchant','assassin','netrunner','gunslinger'],
  road:      ['bandit','merchant','guard','gunslinger','samurai_npc'],
  // ── Space / sci-fi ─────────────────────────────────────────────────────
  space:     ['alien_grey','robot_drone','netrunner','android','alien_grey'],
  // ── Harsh environments ─────────────────────────────────────────────────
  desert:    ['mummy','djinn','desert_bandit','gunslinger','scorpion'],
  mountain:  ['yeti','samurai_npc','guard','witch','wolf'],
  swamp:     ['witch','zombie','bat','spider','ghost'],
  snow:      ['yeti','ice_wraith','guard','witch','wolf'],
  // ── Atmospheric scenes ─────────────────────────────────────────────────
  wasteland: ['raider','mutant','scavenger','robot_drone','zombie'],
  shrine:    ['samurai_npc','elder','witch','mage_npc','ghost'],
  temple:    ['mummy','djinn','elder','mage_npc','skeleton'],
  saloon:    ['gunslinger','bandit','merchant','elder','outlaw'],
};

// ── Particle presets per creature ─────────
export const CREATURE_PARTICLES = {
  skeleton:      { type: 'dust',    color: '#c8d8a0', size: 1.2, count: 6  },
  ghost:         { type: 'wisp',    color: '#a0c8ff', size: 2.0, count: 8  },
  wraith:        { type: 'wisp',    color: '#6040a0', size: 1.8, count: 10 },
  dragon:        { type: 'ember',   color: '#ff6020', size: 2.5, count: 12 },
  demon:         { type: 'ember',   color: '#ff0040', size: 2.0, count: 10 },
  mage_npc:      { type: 'spark',   color: '#8080ff', size: 1.5, count: 6  },
  lich:          { type: 'spark',   color: '#40ff40', size: 1.8, count: 8  },
  fairy:         { type: 'sparkle', color: '#ffffa0', size: 1.0, count: 10 },
  will_o_wisp:   { type: 'wisp',    color: '#40ffaa', size: 3.0, count: 6  },
  alien_grey:    { type: 'static',  color: '#00ffaa', size: 1.2, count: 8  },
  crystal_golem: { type: 'shard',   color: '#80c0ff', size: 1.5, count: 6  },
  slime:         { type: 'drip',    color: '#60aa40', size: 2.0, count: 5  },
  // Genre expansions
  netrunner:     { type: 'static',  color: '#00ffff', size: 1.0, count: 8  },
  robot_drone:   { type: 'spark',   color: '#00ccff', size: 1.2, count: 6  },
  djinn:         { type: 'sparkle', color: '#8888ff', size: 2.0, count: 10 },
  witch:         { type: 'wisp',    color: '#44ff44', size: 1.5, count: 8  },
  mummy:         { type: 'dust',    color: '#d4c890', size: 1.5, count: 6  },
  vampire:       { type: 'wisp',    color: '#cc0020', size: 1.2, count: 6  },
  yeti:          { type: 'shard',   color: '#bbddff', size: 1.8, count: 5  },
  ice_wraith:    { type: 'shard',   color: '#88ccff', size: 1.5, count: 8  },
  samurai:       { type: 'spark',   color: '#ffd040', size: 0.8, count: 4  },
  samurai_npc:   { type: 'spark',   color: '#ffd040', size: 0.8, count: 4  },
};

// ── Animation class map ────────────────────
export const CREATURE_ANIM = {
  ghost:         'idleFloat',
  wraith:        'idleFloat',
  will_o_wisp:   'idleFloat',
  fairy:         'idleFloat',
  skeleton:      'idleRattle',
  goblin:        'idleBob',
  rat:           'idleBob',
  bat:           'idleFloat',
  slime:         'idleBob',
  dragon:        'idleBreath',
  troll:         'idleBreath',
  golem:         'idleSway',
  treant:        'idleSway',
  kraken:        'idleSway',
};

// ── Keyword → creature type mapping ───────
export const ROLE_TO_CREATURE = {
  // Enemies
  goblin:       'goblin',       gremlin:  'goblin',
  orc:          'orc',          ork:      'orc',
  skeleton:     'skeleton',     bones:    'skeleton',
  zombie:       'zombie',       undead:   'zombie',
  troll:        'troll',        ogre:     'troll',
  dragon:       'dragon',       drake:    'dragon',
  demon:        'demon',        devil:    'demon',
  ghost:        'ghost',        spirit:   'ghost',
  wraith:       'wraith',       specter:  'wraith',
  witch:        'witch',        hag:      'witch',
  vampire:      'vampire',      count:    'vampire',
  wolf:         'wolf',         werewolf: 'wolf',
  bandit:       'bandit',       thief:    'thief',
  assassin:     'assassin',     rogue:    'bandit',
  pirate:       'pirate_npc',   buccaneer:'pirate_npc',
  knight:       'knight',       guard:    'guard',
  rat:          'rat',          rodent:   'rat',
  bat:          'bat',          vampire_bat:'bat',
  spider:       'spider',       arachnid: 'spider',
  slime:        'slime',        ooze:     'slime',
  golem:        'golem',        construct:'golem',
  alien:        'alien_grey',   extraterrestrial:'alien_grey',
  robot:        'robot_drone',  android:  'android',
  mummy:        'mummy',        pharaoh:  'mummy',
  yeti:         'yeti',         abominable:'yeti',
  kraken:       'kraken',       octopus:  'kraken',
  serpent:      'sea_serpent',  serpent_sea:'sea_serpent',
  djinn:        'djinn',        genie:    'djinn',
  lich:         'lich',         necromancer:'lich',
  gargoyle:     'gargoyle',     grotesque:'gargoyle',
  fairy:        'fairy',        sprite:   'fairy',
  treant:       'treant',       ent:      'treant',
  // Friendlies
  merchant:     'merchant',     trader:   'merchant',
  elder:        'elder',        sage:     'elder',
  child:        'child_npc',    kid:      'child_npc',
  bard:         'traveling_bard', minstrel:'traveling_bard',
  mage:         'mage_npc',     wizard:   'mage_npc',
  ranger:       'ranger_npc',   scout:    'ranger_npc',
  dwarf:        'dwarf_npc',    halfling: 'dwarf_npc',
  // Western
  cowboy:       'gunslinger',   sheriff:  'sheriff',
  outlaw:       'outlaw',       deputy:   'guard',
  gunfighter:   'gunslinger',   drifter:  'gunslinger',
  // Cyberpunk
  hacker:       'netrunner',    runner:   'netrunner',
  netrunner:    'netrunner',    cyber:    'netrunner',
  android:      'android',      corp:     'guard',
  // Ninja / Samurai
  samurai:      'samurai',      ronin:    'ronin',
  shogun:       'shogun',       ninja:    'assassin',
  shinobi:      'assassin',     daimyo:   'samurai',
  // Post-Apoc
  raider:       'raider',       mutant:   'mutant',
  scavenger:    'scavenger',    wasteland:'bandit',
  // Mythology
  titan:        'demon',        cyclops:  'troll',
  centaur:      'wolf',         harpy:    'ghost',
  minotaur:     'troll',        gorgon:   'demon',
  demigod:      'knight',       // Maps to knight silhouette
  // Fairy tale
  ogre:         'troll',        giant:    'troll',
  enchanted:    'elder',        prince:   'guard',
  // Historical
  gladiator:    'knight',       legionary:'guard',
  viking:       'orc',          pharaoh:  'elder',
  centurion:    'guard',        barbarian:'orc',
  // Ocean
  pirate:       'pirate_npc',   buccaneer:'pirate_npc',
  sailor:       'pirate_npc',   captain:  'sea_captain',
  mermaid:      'mermaid',
};

export function roleToCreature(roleStr) {
  if (!roleStr) return null;
  const lower = roleStr.toLowerCase();
  for (const [key, val] of Object.entries(ROLE_TO_CREATURE)) {
    if (lower.includes(key)) return val;
  }
  return null;
}
