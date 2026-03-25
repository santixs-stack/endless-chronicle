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
  // ── FANTASY ───────────────────────────────────────────────────────────
  dungeon:      ['goblin','kobold','skeleton','rat','zombie','orc','troll'],
  cave:         ['bat','spider','wraith','zombie','rat','crystal_golem','kappa'],
  castle:       ['knight','ghost','vampire','demon','guard','cursed_knight','dark_elf'],
  ruins:        ['skeleton','wraith','cursed_knight','mummy','ghost','zombie','gargoyle'],
  forest:       ['wolf','fairy','bandit','ranger_npc','witch','elder','treant','dire_wolf'],
  plains:       ['bandit','merchant','guard','wolf','elder','knight','goblin'],
  mountain:     ['yeti','guard','witch','wolf','dragon','dwarf_npc','harpy'],
  swamp:        ['witch','zombie','bat','spider','ghost','troll','bog_zombie'],
  snow:         ['yeti','ice_wraith','guard','wolf','dragon','skeleton'],
  desert:       ['mummy','djinn','desert_bandit','sphinx','scorpion','skeleton','manticore'],
  jungle:       ['kobold','lizardfolk','spider','witch','giant_spider','centaur','treant'],
  // ── WATER / OCEAN ─────────────────────────────────────────────────────
  ocean:        ['pirate_npc','ghost_sailor','kraken','sea_captain','mermaid','siren','shark'],
  ship:         ['pirate_npc','sea_captain','ghost_sailor','guard','sailor','smuggler'],
  island:       ['pirate_npc','merchant','elder','siren','deep_one','naval_officer'],
  underwater:   ['mermaid','kraken','deep_one','sea_serpent','siren'],
  // ── URBAN / SOCIAL ────────────────────────────────────────────────────
  village:      ['merchant','elder','guard','witch','bandit','ranger_npc'],
  town:         ['merchant','guard','elder','thief','bandit','investigator'],
  tavern:       ['bandit','merchant','elder','pirate_npc','bard','guard'],
  city:         ['thief','guard','merchant','assassin','elder','detective'],
  market:       ['merchant','elder','thief','guard','traveling_bard'],
  road:         ['bandit','merchant','guard','wolf','kobold','traveler_npc'],
  // ── HORROR ────────────────────────────────────────────────────────────
  haunted:      ['ghost','vampire','zombie','wraith','banshee','poltergeist','revenant'],
  crypt:        ['skeleton','zombie','ghost','vampire','lich','wraith','revenant'],
  asylum:       ['ghost','zombie','shadow_beast','poltergeist','cultist','dark_priest'],
  graveyard:    ['zombie','skeleton','ghost','wraith','vampire','revenant','ghoul'],
  manor:        ['ghost','vampire','cultist','dark_priest','banshee','doppelganger'],
  // ── SPACE / SCI-FI ────────────────────────────────────────────────────
  space:        ['alien_grey','robot_drone','android','space_marine','alien_bug'],
  spaceship:    ['android','robot_drone','space_marine','alien_grey','netrunner'],
  space_station:['guard','android','robot_drone','alien_grey','scientist','netrunner'],
  alien_planet: ['alien_grey','alien_beast','alien_bug','robot_drone','space_marine'],
  laboratory:   ['robot_drone','scientist','android','netrunner','elder'],
  // ── CYBERPUNK ─────────────────────────────────────────────────────────
  neon_city:    ['netrunner','gang_member','android','corpo_agent','ripperdoc','street_thug'],
  nightclub:    ['gang_boss','netrunner','corpo_agent','merchant','assassin'],
  corp_building:['corpo_agent','guard','android','maxtac','netrunner'],
  back_alley:   ['gang_member','bandit','street_thug','ripperdoc','fixer'],
  cyberspace:   ['netrunner','ai_entity','robot_drone','hacker','corrupted_ai'],
  // ── WESTERN ───────────────────────────────────────────────────────────
  saloon:       ['gunslinger','bandit','merchant','elder','outlaw','gambler_npc'],
  frontier_town:['sheriff','deputy','gunslinger','merchant','outlaw','elder'],
  prairie:      ['outlaw','native_warrior','bandit','gunslinger','drifter','wolf'],
  canyon:       ['outlaw','cattle_rustler','native_warrior','wolf','bandit'],
  train:        ['train_robber','guard','merchant','gunslinger','outlaw'],
  // ── POST-APOCALYPTIC ──────────────────────────────────────────────────
  wasteland:    ['raider','mutant','scavenger','zombie','feral_dog','ghoul'],
  bunker:       ['vault_dweller','guard','elder','scavenger','android','tech_priest'],
  ruined_city:  ['raider','ghoul','super_mutant','scavenger','zombie','feral_dog'],
  refugee_camp: ['survivor','merchant','elder','guard','tribesman','tech_priest'],
  // ── NINJA / SAMURAI ───────────────────────────────────────────────────
  shrine:       ['elder','ghost','mage_npc','samurai','onmyoji','river_spirit'],
  dojo:         ['samurai','ronin','elder','monk','clan_warrior','war_monk'],
  village_jp:   ['elder','merchant','samurai','guard','geisha','bandit'],
  fortress_jp:  ['samurai','shogun','knight','guard','assassin','yakuza'],
  forest_jp:    ['ninja','tengu','kitsune','wolf','oni','river_spirit'],
  // ── MYTHOLOGY ─────────────────────────────────────────────────────────
  olympus:      ['olympian','demigod','elder','knight','fury','pegasus'],
  underworld:   ['cerberus','shade','lich','wraith','fury','skeleton','demon'],
  labyrinth:    ['minotaur','skeleton','elder','knight','ghost','cultist'],
  ancient_ruins:['sphinx','mummy','cultist','skeleton','elder','gargoyle'],
  colosseum:    ['gladiator','demigod','centaur','knight','guard','elder'],
  // ── FAIRY TALE ────────────────────────────────────────────────────────
  enchanted_forest:['fairy','pixie','witch','treant','wolf','forest_spirit','talking_animal'],
  fairy_castle: ['knight','enchanted_knight','dark_fairy','evil_queen','guard','princess_npc'],
  magic_village:['elder','merchant','witch','fairy','wood_elf','bard'],
  dark_woods:   ['witch','werewolf','troll','wolf','dark_fairy','cursed_beast'],
  // ── SPACE / SCI-FI ───────────────────────────────────────────────────
  spaceship:    ['android','robot_drone','alien_grey','space_marine','corrupted_ai','scientist_npc'],
  space_station:['guard','android','robot_drone','alien_grey','netrunner','scientist_npc'],
  alien_planet: ['alien_grey','alien_beast','alien_bug','robot_drone','space_marine','corrupted_ai'],
  // ── WESTERN ───────────────────────────────────────────────────────────
  prairie:      ['wolf','native_warrior','outlaw','drifter','gunslinger','dire_wolf'],
  saloon:       ['gunslinger','bandit','merchant','elder','outlaw','gambler_npc','bartender'],
  frontier_town:['sheriff','deputy','gunslinger','merchant','outlaw','elder','preacher'],
  canyon:       ['outlaw','native_warrior','bandit','wolf','cattle_rustler','gunslinger'],
  mine:         ['bandit','zombie','rat','goblin','elder','guard'],
  // ── HORROR ────────────────────────────────────────────────────────────
  graveyard:    ['zombie','skeleton','ghost','wraith','vampire','revenant','ghoul'],
  crypt:        ['skeleton','zombie','ghost','vampire','lich','wraith','revenant'],
  asylum:       ['ghost','zombie','poltergeist','cultist','banshee','doppelganger'],
  // ── CYBERPUNK ─────────────────────────────────────────────────────────
  neon_city:    ['netrunner','gang_member','android','corpo_agent','street_thug','assassin'],
  back_alley:   ['gang_member','bandit','street_thug','assassin','yakuza_cyber','ripperdoc'],
  corp_building:['corpo_agent','guard','android','maxtac_officer','netrunner','security_guard'],
  // ── MYTHOLOGY ─────────────────────────────────────────────────────────
  olympus:      ['olympian','demigod','elder','griffin','satyr','pegasus'],
  underworld:   ['cerberus','shade','lich','wraith','fury','skeleton','demon'],
  // ── NINJA / SAMURAI ───────────────────────────────────────────────────
  dojo:         ['samurai','ronin','elder','monk','war_monk','clan_warrior'],
  bamboo_forest:['ninja','tengu','kitsune','wolf','oni','river_spirit'],
  fortress_jp:  ['samurai','shogun','knight','guard','assassin','daimyo'],
  // ── POST-APOCALYPTIC ──────────────────────────────────────────────────
  bunker:       ['vault_dweller','guard','elder','android','tech_priest','scientist_npc'],
  ruined_city:  ['raider','ghoul_npc','super_mutant','scavenger','zombie','feral_dog'],
  // ── HISTORICAL ────────────────────────────────────────────────────────
  arena:        ['gladiator','guard','knight','elder','orc','bandit'],
  battlefield:  ['knight','guard','bandit','roman_soldier','barbarian','archer_npc'],
  roman_city:   ['roman_soldier','centurion','merchant','elder','senator','gladiator'],
  egypt:        ['pharaoh_guard','mummy','elder','merchant','skeleton','djinn'],
  norse_village:['viking','elder','merchant','berserker','guard','wolf'],
  temple:       ['elder','mage_npc','cultist','mummy','djinn','guardian_npc'],
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
  // Genre expansions — Cyberpunk / Space
  netrunner:     { type: 'static',  color: '#00ffff', size: 1.0, count: 8  },
  robot_drone:   { type: 'spark',   color: '#00ccff', size: 1.2, count: 6  },
  android:       { type: 'spark',   color: '#44aaff', size: 1.0, count: 6  },
  // Japanese / Ninja
  djinn:         { type: 'sparkle', color: '#8888ff', size: 2.0, count: 10 },
  samurai:       { type: 'spark',   color: '#ffd040', size: 0.8, count: 4  },
  samurai_npc:   { type: 'spark',   color: '#ffd040', size: 0.8, count: 4  },
  ronin:         { type: 'spark',   color: '#cc8800', size: 0.8, count: 4  },
  oni:           { type: 'ember',   color: '#ff4400', size: 1.8, count: 8  },
  tengu:         { type: 'spark',   color: '#8888cc', size: 1.2, count: 6  },
  kitsune:       { type: 'sparkle', color: '#ffaa00', size: 1.2, count: 8  },
  onmyoji:       { type: 'wisp',    color: '#cc88ff', size: 1.5, count: 8  },
  // Horror
  witch:         { type: 'wisp',    color: '#44ff44', size: 1.5, count: 8  },
  vampire:       { type: 'wisp',    color: '#cc0020', size: 1.2, count: 6  },
  mummy:         { type: 'dust',    color: '#d4c890', size: 1.5, count: 6  },
  banshee:       { type: 'wisp',    color: '#aaccff', size: 2.5, count: 10 },
  werewolf:      { type: 'wisp',    color: '#668833', size: 1.5, count: 5  },
  revenant:      { type: 'dust',    color: '#886644', size: 1.2, count: 6  },
  poltergeist:   { type: 'spark',   color: '#ffffff', size: 1.8, count: 8  },
  doppelganger:  { type: 'wisp',    color: '#aaaaaa', size: 1.2, count: 6  },
  ghoul:         { type: 'dust',    color: '#88aa44', size: 1.2, count: 5  },
  blood_knight:  { type: 'drip',    color: '#cc0000', size: 1.5, count: 6  },
  // Mythology
  medusa:        { type: 'static',  color: '#44cc44', size: 1.5, count: 8  },
  hydra:         { type: 'drip',    color: '#226622', size: 2.0, count: 8  },
  sphinx:        { type: 'dust',    color: '#ddcc88', size: 1.5, count: 6  },
  satyr:         { type: 'sparkle', color: '#88cc44', size: 1.0, count: 6  },
  cerberus:      { type: 'ember',   color: '#ff4400', size: 1.8, count: 8  },
  griffin:       { type: 'spark',   color: '#ffcc00', size: 1.5, count: 6  },
  // Pirate / Ocean
  siren:         { type: 'sparkle', color: '#44ddff', size: 2.0, count: 10 },
  deep_one:      { type: 'drip',    color: '#225566', size: 1.5, count: 6  },
  sea_serpent:   { type: 'drip',    color: '#226644', size: 2.0, count: 5  },
  // Environment / weather
  yeti:          { type: 'shard',   color: '#bbddff', size: 1.8, count: 5  },
  ice_wraith:    { type: 'shard',   color: '#88ccff', size: 1.5, count: 8  },
  // Fantasy misc
  kobold:        { type: 'dust',    color: '#886622', size: 0.8, count: 4  },
  treant:        { type: 'spark',   color: '#44aa44', size: 1.5, count: 5  },
  gargoyle:      { type: 'dust',    color: '#888888', size: 1.2, count: 5  },
  pixie:         { type: 'sparkle', color: '#ffeeaa', size: 0.8, count: 12 },
  wyvern:        { type: 'ember',   color: '#aa4400', size: 1.5, count: 8  },
};

// ── Animation class map ────────────────────
export const CREATURE_ANIM = {
  // Floaters
  ghost:         'idleFloat',   wraith:        'idleFloat',
  will_o_wisp:   'idleFloat',   fairy:         'idleFloat',
  bat:           'idleFloat',   banshee:       'idleFloat',
  poltergeist:   'idleFloat',   siren:         'idleFloat',
  tengu:         'idleFloat',   pixie:         'idleFloat',
  // Rattlers / twitchers
  skeleton:      'idleRattle',  revenant:      'idleRattle',
  ghoul:         'idleRattle',
  // Bobbers
  goblin:        'idleBob',     rat:           'idleBob',
  slime:         'idleBob',     kobold:        'idleBob',
  kappa:         'idleBob',     satyr:         'idleBob',
  imp:           'idleBob',
  // Breathers (heavy/big)
  dragon:        'idleBreath',  troll:         'idleBreath',
  werewolf:      'idleBreath',  yeti:          'idleBreath',
  cerberus:      'idleBreath',  oni:           'idleBreath',
  hydra:         'idleBreath',  wyvern:        'idleBreath',
  // Swayers
  golem:         'idleSway',    treant:        'idleSway',
  kraken:        'idleSway',    sea_serpent:   'idleSway',
  medusa:        'idleSway',    sphinx:        'idleSway',
};

// ── Keyword → creature type mapping ───────
export const ROLE_TO_CREATURE = {
  // ── FANTASY ──────────────────────────────────────────────────────────────
  goblin:          'goblin',        gremlin:         'goblin',
  kobold:          'kobold',        kobolds:         'kobold',
  lizardfolk:      'lizardfolk',    lizardman:       'lizardfolk',
  gnoll:           'gnoll',         gnolls:          'gnoll',
  bugbear:         'bugbear',       bugbears:        'bugbear',
  hobgoblin:       'hobgoblin',     hobgoblins:      'hobgoblin',
  imp:             'imp',           impling:         'imp',
  pixie:           'pixie',         sprite_npc:      'pixie',
  cultist:         'cultist',       fanatic:         'cultist',
  dark_elf:        'dark_elf',      drow:            'dark_elf',
  high_elf:        'high_elf',      elf:             'high_elf',
  dire_wolf:       'dire_wolf',     direwolf:        'dire_wolf',
  owlbear:         'owlbear',       owlbears:        'owlbear',
  orc:             'orc',           ork:             'orc',
  skeleton:        'skeleton',      bones:           'skeleton',
  zombie:          'zombie',        undead:          'zombie',
  troll:           'troll',         ogre:            'troll',
  dragon:          'dragon',        drake:           'dragon',
  demon:           'demon',         devil:           'demon',
  ghost:           'ghost',         spirit:          'ghost',
  wraith:          'wraith',        specter:         'wraith',
  witch:           'witch',         hag:             'witch',
  vampire:         'vampire',       count:           'vampire',
  wolf:            'wolf',          werewolf:        'werewolf',
  bandit:          'bandit',        thief:           'thief',
  assassin:        'assassin',      rogue:           'bandit',
  pirate:          'pirate_npc',    buccaneer:       'pirate_npc',
  knight:          'knight',        guard:           'guard',
  rat:             'rat',           rodent:          'rat',
  bat:             'bat',           vampire_bat:     'bat',
  spider:          'spider',        arachnid:        'spider',
  slime:           'slime',         ooze:            'slime',
  golem:           'golem',         construct:       'golem',
  mummy:           'mummy',         pharaoh:         'elder',
  yeti:            'yeti',          abominable:      'yeti',
  kraken:          'kraken',        octopus:         'kraken',
  serpent:         'sea_serpent',   sea_serpent:     'sea_serpent',
  djinn:           'djinn',         genie:           'djinn',
  lich:            'lich',          necromancer:     'lich',
  gargoyle:        'gargoyle',      grotesque:       'gargoyle',
  fairy:           'fairy',         faerie:          'fairy',
  treant:          'treant',        ent:             'treant',
  centaur:         'centaur',       half_horse:      'centaur',
  harpy:           'harpy',         harpies:         'harpy',
  manticore:       'manticore',     chimera:         'chimera',
  wyvern:          'wyvern',        wyverns:         'wyvern',
  giant_spider:    'spider',        giant_rat:       'rat',
  will_o_wisp:     'will_o_wisp',   wisp:            'will_o_wisp',
  dwarf:           'dwarf_npc',     halfling:        'dwarf_npc',
  merchant:        'merchant',      trader:          'merchant',
  elder:           'elder',         sage:            'elder',
  bard:            'traveling_bard',minstrel:        'traveling_bard',
  mage:            'mage_npc',      wizard:          'mage_npc',
  ranger:          'ranger_npc',    scout:           'ranger_npc',
  // ── SPACE / SCI-FI ────────────────────────────────────────────────────────
  alien:           'alien_grey',    extraterrestrial:'alien_grey',
  robot:           'robot_drone',   android:         'android',
  xeno:            'alien_grey',    xenomorph:       'alien_grey',
  alien_bug:       'alien_grey',    alien_beast:     'alien_grey',
  space_marine:    'android',       space_soldier:   'android',
  bounty_hunter:   'bounty_hunter', mercenary:       'mercenary',
  security_drone:  'robot_drone',   corrupted_ai:    'robot_drone',
  rebel_soldier:   'guard',         freedom_fighter: 'guard',
  scientist:       'scientist_npc', researcher:      'scientist_npc',
  alien_ambassador:'alien_grey',    alien_leader:    'alien_grey',
  space_pirate:    'raider',        space_corsair:   'raider',
  pilot:           'pilot_npc',     co_pilot:        'pilot_npc',
  mechanic:        'mechanic_npc',  engineer:        'mechanic_npc',
  // ── OCEAN / PIRATE ────────────────────────────────────────────────────────
  sailor:          'pirate_npc',    corsair:         'pirate_npc',
  navigator:       'pirate_npc',    helmsman:        'pirate_npc',
  ship_doctor:     'merchant',      ship_cook:       'merchant',
  mermaid:         'mermaid',       merfolk:         'mermaid',
  sea_serpent:     'sea_serpent',   kraken_spawn:    'kraken',
  ghost_sailor:    'ghost_sailor',  undead_sailor:   'skeleton',
  shark:           'shark',         deep_one:        'deep_one',
  naval_officer:   'knight',        admiral:         'knight',
  harbormaster:    'elder',         dockworker:      'merchant',
  siren:           'siren',         sea_witch:       'witch',
  leviathan:       'dragon',        kraken_spawn:    'kraken',
  smuggler:        'bandit',        privateer:       'pirate_npc',
  navy_soldier:    'guard',         marine:          'guard',
  // ── HORROR ───────────────────────────────────────────────────────────────
  werewolf:        'werewolf',      lycanthrope:     'werewolf',
  banshee:         'banshee',       wailing_spirit:  'banshee',
  poltergeist:     'poltergeist',   haunting:        'poltergeist',
  revenant:        'revenant',      returned_dead:   'revenant',
  flesh_golem:     'zombie',        stitched:        'zombie',
  doppelganger:    'doppelganger',  mimic_creature:  'doppelganger',
  blood_knight:    'blood_knight',  dark_paladin:    'blood_knight',
  dark_priest:     'mage_npc',      occultist:       'mage_npc',
  investigator:    'investigator',  detective:       'investigator',
  shadow_beast:    'wraith',        darkness:        'wraith',
  eldritch_horror: 'demon',         abomination:     'demon',
  mad_scientist:   'mage_npc',      doctor_evil:     'mage_npc',
  possessed:       'zombie',        ghoul:           'ghoul',
  // ── WESTERN ──────────────────────────────────────────────────────────────
  cowboy:          'gunslinger',    gunfighter:      'gunslinger',
  sheriff:         'sheriff',       deputy:          'guard',
  outlaw:          'outlaw',        desperado:       'outlaw',
  bartender:       'merchant',      saloon_keeper:   'merchant',
  preacher:        'elder',         frontier_doc:    'elder',
  prospector:      'elder',         old_timer:       'elder',
  cattle_rustler:  'outlaw',        train_robber:    'outlaw',
  native_warrior:  'ranger_npc',    tribal_warrior:  'ranger_npc',
  stagecoach:      'merchant',      gambler_npc:     'merchant',
  drifter:         'gunslinger',    bounty_target:   'outlaw',
  // ── POST-APOCALYPTIC ─────────────────────────────────────────────────────
  raider:          'raider',        mutant:          'mutant',
  scavenger:       'scavenger',     wasteland:       'bandit',
  super_mutant:    'troll',         ghoul_raider:    'zombie',
  feral_dog:       'dire_wolf',     wasteland_beast: 'dire_wolf',
  vault_dweller:   'guard',         wastelander:     'guard',
  tribesman:       'bandit',        tribal:          'bandit',
  tech_priest:     'mage_npc',      warlord:         'troll',
  survivor:        'guard',         wasteland_trader:'merchant',
  ghoul_npc:       'ghoul',         irradiated:      'mutant',
  // ── CYBERPUNK ────────────────────────────────────────────────────────────
  netrunner:       'netrunner',     hacker:          'netrunner',
  cyber:           'netrunner',     runner:          'netrunner',
  street_samurai:  'samurai',       cyber_soldier:   'android',
  fixer:           'rogue',         corpo:           'guard',
  corpo_agent:     'guard',         security_guard:  'guard',
  gang_member:     'bandit',        street_thug:     'bandit',
  fixer_npc:       'merchant',      black_market:    'bandit',
  ripperdoc:       'elder',         megacorp:        'elder',
  maxtac:          'knight',        tech_cop:        'knight',
  ai_entity:       'robot_drone',   drone:           'robot_drone',
  cyborg:          'android',       chrome:          'android',
  yakuza_cyber:    'bandit',        gang_boss:       'bandit',
  // ── NINJA / SAMURAI ──────────────────────────────────────────────────────
  samurai:         'samurai',       ronin:           'ronin',
  shogun:          'shogun',        ninja:           'assassin',
  shinobi:         'assassin',      daimyo:          'samurai',
  kunoichi:        'assassin',      onmyoji:         'onmyoji',
  tengu:           'tengu',         kappa:           'kappa',
  oni:             'oni',           yokai:           'oni',
  fox_spirit:      'kitsune',       kitsune:         'kitsune',
  river_spirit:    'ghost',         mountain_spirit: 'elder',
  war_monk:        'samurai',       temple_guardian: 'knight',
  yakuza:          'bandit',        clan_warrior:    'samurai',
  monk:            'elder',         geisha:          'merchant',
  // ── MYTHOLOGY ────────────────────────────────────────────────────────────
  medusa:          'medusa',        gorgon:          'medusa',
  hydra:           'hydra',         lernaean:        'hydra',
  sphinx:          'sphinx',        riddler:         'sphinx',
  satyr:           'satyr',         faun:            'satyr',
  nymph:           'elder',         naiad:           'elder',
  fury:            'demon',         erinye:          'demon',
  cerberus:        'cerberus',      hellhound:       'cerberus',
  olympian:        'elder',         god_npc:         'elder',
  minotaur:        'troll',         cyclops:         'troll',
  pegasus:         'dire_wolf',     griffin:         'griffin',
  titan_npc:       'troll',         titan:           'troll',
  demigod:         'knight',        hero:            'knight',
  // ── STORYBOOK / FAIRY TALE ──────────────────────────────────────────────
  enchanted_knight:'knight',        cursed_knight:   'knight',
  dark_fairy:      'witch',         forest_spirit:   'elder',
  evil_queen:      'witch',         wicked:          'witch',
  woodcutter:      'merchant',      peasant:         'merchant',
  princess_npc:    'elder',         prince_npc:      'knight',
  talking_animal:  'wolf',          helpful_animal:  'wolf',
  beanstalk_giant: 'troll',         cursed_beast:    'troll',
  helpful_mouse:   'rat',           enchanted:       'elder',
  wood_elf:        'ranger_npc',    forest_elf:      'ranger_npc',
  // New Storybook archetypes
  cursed_hero:     'knight',        lost_royalty:    'elder',
  wise_witch:      'witch',         trickster_fox:   'wolf',
  fairy_godmother: 'fairy',         enchanted_beast: 'troll',
  royalty:         'elder',         lost_prince:     'knight',
  woodcutters_child:'merchant',     talking_creature:'wolf',
  // ── HISTORICAL ───────────────────────────────────────────────────────────
  gladiator:       'knight',        legionary:       'guard',
  centurion:       'knight',        spartan:         'knight',
  roman_soldier:   'guard',         greek_hoplite:   'knight',
  crusader:        'knight',        templar:         'knight',
  viking:          'orc',           berserker:       'orc',
  barbarian:       'orc',           mongol:          'bandit',
  aztec_warrior:   'knight',        inca_warrior:    'knight',
  egyptian_priest: 'elder',         pharaoh_guard:   'guard',
  medieval_soldier:'guard',         feudal_lord:     'elder',
  mercenary_hist:  'bandit',        condottiere:     'knight',
  senator:         'elder',         nobleman:        'elder',
  // ── UNIVERSAL FALLBACKS ───────────────────────────────────────────────────
  child:           'child_npc',     kid:             'child_npc',
  pirate_npc:      'pirate_npc',    sea_captain:     'sea_captain',
  gunslinger:      'gunslinger',    android:         'android',
};

export function roleToCreature(roleStr) {
  if (!roleStr) return null;
  const lower = roleStr.toLowerCase();
  for (const [key, val] of Object.entries(ROLE_TO_CREATURE)) {
    if (lower.includes(key)) return val;
  }
  return null;
}
