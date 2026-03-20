// ═══════════════════════════════════════════
//  CHARACTER CLASSES / ARCHETYPES
// ═══════════════════════════════════════════

export const DND_CLASSES = [
  {
    id: 'warrior', icon: '⚔', name: 'Fighter',
    desc: 'Strong and brave in battle',
    hp: 26, str: 17, dex: 10, int: 8, wis: 10, con: 16,
    special: 'Battle Surge — once per fight, do something amazing that turns the tide'
  },
  {
    id: 'mage', icon: '✨', name: 'Wizard',
    desc: 'Spells for every situation',
    hp: 10, str: 6, dex: 12, int: 18, wis: 14, con: 8,
    special: 'Any Spell — you can attempt any magic, even spells you just invented'
  },
  {
    id: 'rogue', icon: '🗡', name: 'Rogue',
    desc: 'Sneaky and super fast',
    hp: 14, str: 10, dex: 19, int: 13, wis: 10, con: 10,
    special: 'Shadow Step — once per scene, vanish and reappear somewhere unexpected'
  },
  {
    id: 'ranger', icon: '🏹', name: 'Ranger',
    desc: 'Expert archer and nature guide',
    hp: 17, str: 13, dex: 17, int: 10, wis: 15, con: 13,
    special: 'Animal Friend — any creature will trust you; you can track anything anywhere'
  },
  {
    id: 'healer', icon: '💚', name: 'Healer',
    desc: 'Keeps the whole party alive',
    hp: 20, str: 11, dex: 10, int: 12, wis: 18, con: 14,
    special: 'Emergency Heal — fully restore one teammate at a critical moment, once per scene'
  },
  {
    id: 'bard', icon: '🎵', name: 'Bard',
    desc: 'Talks their way out of anything',
    hp: 13, str: 8, dex: 14, int: 15, wis: 10, con: 10,
    special: 'Smooth Talker — any person will give you one extra chance, no matter what'
  },
  {
    id: 'spaceranger', icon: '🚀', name: 'Space Ranger',
    desc: 'Tech genius from the stars',
    hp: 19, str: 13, dex: 16, int: 15, wis: 14, con: 15,
    special: 'Gadget — pull out exactly the right futuristic tool for any situation'
  },
  {
    id: 'pirate', icon: '⚓', name: 'Pirate',
    desc: 'Bold adventurer of the high seas',
    hp: 18, str: 14, dex: 17, int: 11, wis: 10, con: 13,
    special: 'Fearless — can challenge anyone to anything and they always accept'
  },
];

export const LEVEL_STAT_BUMPS = {
  warrior:    { str: 2, con: 1, hp: 5 },
  mage:       { int: 2, wis: 1, hp: 2 },
  rogue:      { dex: 2, int: 1, hp: 3 },
  ranger:     { dex: 1, wis: 2, hp: 3 },
  healer:     { wis: 2, con: 1, hp: 4 },
  bard:       { int: 1, dex: 1, hp: 2 },
  spaceranger:{ dex: 1, con: 1, hp: 4 },
  pirate:     { dex: 2, str: 1, hp: 4 },
};

export const XP_PER_LEVEL = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200];

export const CLASS_IDEAS = {
  warrior:    ['Attack the enemy!', 'Block and push them back', 'Challenge them to fight me', 'Smash the obstacle', 'Protect a teammate'],
  mage:       ['Cast a spell at it!', 'Create a magical barrier', 'Use magic to lift something heavy', 'Make myself invisible', 'Conjure something helpful'],
  rogue:      ['Sneak up behind them', 'Pick the lock', 'Steal something useful', 'Hide in the shadows', 'Distract them so we can escape'],
  ranger:     ['Shoot from far away', 'Call an animal for help', 'Track their footprints', 'Find a safe path through', 'Set a trap'],
  healer:     ['Heal my teammate!', 'Create a protective shield', 'Remove a curse or condition', 'Find herbs or supplies', 'Calm the situation down'],
  bard:       ['Talk my way through it', 'Perform to distract them', 'Make them laugh or relax', 'Convince them to help us', 'Find out information by chatting'],
  spaceranger:['Use my gadget on it', 'Scan the area for danger', 'Hack into the system', 'Call for backup', 'Boost our shields'],
  pirate:     ['Swing on a rope!', 'Make a dramatic challenge', 'Navigate toward escape', 'Trade or make a deal', 'Find the treasure or shortcut'],
};
