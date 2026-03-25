// ═══════════════════════════════════════════
//  GENRE ARCHETYPES
//  8 roles × 12 genres
//  Each archetype maps to an underlying class
//  for game mechanics (HP, abilities, etc.)
// ═══════════════════════════════════════════

// 8 role slots — same across every genre
export const ROLES = [
  { id: 'warrior',   icon: '⚔',  label: 'Warrior'   },
  { id: 'mage',      icon: '✨',  label: 'Mage'      },
  { id: 'rogue',     icon: '🗡',  label: 'Rogue'     },
  { id: 'ranger',    icon: '🏹',  label: 'Ranger'    },
  { id: 'healer',    icon: '💚',  label: 'Healer'    },
  { id: 'leader',    icon: '👑',  label: 'Leader'    },
  { id: 'trickster', icon: '🎭',  label: 'Trickster' },
  { id: 'wildcard',  icon: '🌀',  label: 'Wild Card' },
];

// Genre definitions with keyword triggers for auto-detection
export const GENRES = [
  {
    id: 'fantasy',
    label: 'Fantasy',
    icon: '⚔',
    keywords: ['fantasy', 'magic', 'dragon', 'wizard', 'dungeon', 'kingdom', 'elf', 'dwarf', 'knight', 'sword', 'castle'],
  },
  {
    id: 'space',
    label: 'Space',
    icon: '🚀',
    keywords: ['space', 'galaxy', 'planet', 'starship', 'alien', 'sci-fi', 'science fiction', 'orbit', 'nasa', 'spaceship', 'future', 'robot'],
  },
  {
    id: 'pirate',
    label: 'Pirate',
    icon: '🏴‍☠️',
    keywords: ['pirate', 'ocean', 'sea', 'ship', 'island', 'sailor', 'harbor', 'naval', 'underwater', 'mermaid', 'voyage', 'treasure', 'buccaneer', 'swashbuckler'],
  },
  {
    id: 'horror',
    label: 'Horror',
    icon: '👻',
    keywords: ['horror', 'haunted', 'ghost', 'vampire', 'zombie', 'curse', 'dark', 'demon', 'monster', 'evil', 'nightmare', 'fear', 'terror'],
  },
  {
    id: 'western',
    label: 'Western',
    icon: '🤠',
    keywords: ['western', 'cowboy', 'frontier', 'saloon', 'gunslinger', 'outlaw', 'sheriff', 'wild west', 'ranch', 'bandit', 'bounty'],
  },
  {
    id: 'postapoc',
    label: 'Wasteland',
    icon: '☢',
    keywords: ['apocalypse', 'post-apocalyptic', 'wasteland', 'survival', 'radiation', 'ruins', 'collapse', 'end of world', 'nuclear', 'dystopia', 'fallout'],
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    icon: '🤖',
    keywords: ['cyberpunk', 'cyber', 'neon', 'hacker', 'corporation', 'implant', 'android', 'megacity', 'noir', 'tech', 'digital', 'virtual', 'matrix'],
  },
  {
    id: 'mythology',
    label: 'Mythology',
    icon: '⚡',
    keywords: ['myth', 'mythology', 'greek', 'roman', 'norse', 'god', 'goddess', 'titan', 'olympus', 'legend', 'hero', 'demigod', 'ancient'],
  },
  {
    id: 'fairytale',
    label: 'Storybook',
    icon: '📖',
    keywords: ['fairy tale', 'fairytale', 'storybook', 'enchanted', 'princess', 'prince', 'witch', 'curse', 'spell', 'magical forest', 'fairy', 'ogre', 'once upon', 'talking animal', 'true love'],
  },
  {
    id: 'ninja',
    label: 'Ninja / Samurai',
    icon: '⛩',
    keywords: ['ninja', 'samurai', 'shogun', 'feudal', 'japan', 'katana', 'shinobi', 'ronin', 'dojo', 'bushido', 'clan', 'edo'],
  },
  {
    id: 'historical',
    label: 'Historical',
    icon: '🏛',
    keywords: ['historical', 'ancient', 'rome', 'egypt', 'medieval', 'war', 'revolution', 'empire', 'renaissance', 'viking', 'aztec'],
  },
];

// Priority order for genre detection (most specific first)
export const GENRE_PRIORITY = [
  'horror', 'cyberpunk', 'postapoc', 'ninja', 'space', 'pirate',
  'western', 'mythology', 'fairytale', 'historical', 'fantasy',
];

// Detect genre from text
export function detectGenre(text) {
  if (!text) return 'fantasy';
  const lower = text.toLowerCase();
  for (const id of GENRE_PRIORITY) {
    const genre = GENRES.find(g => g.id === id);
    if (genre?.keywords.some(k => lower.includes(k))) return id;
  }
  return 'fantasy';
}

// ── Archetype table: role × genre ─────────
// Each entry: { name, desc, classId, icon }
// classId maps to DND_CLASSES for game mechanics

export const ARCHETYPES = {
  fantasy: {
    warrior:   { name: 'Knight',       icon: '⚔',  desc: 'Honor-bound warrior in shining armor',       classId: 'warrior'     },
    mage:      { name: 'Wizard',        icon: '✨',  desc: 'Master of ancient spells and arcane lore',   classId: 'mage'        },
    rogue:     { name: 'Thief',         icon: '🗡',  desc: 'Quick fingers and quicker escape routes',    classId: 'rogue'       },
    ranger:    { name: 'Ranger',        icon: '🏹',  desc: 'Tracker and archer of the wilderness',       classId: 'ranger'      },
    healer:    { name: 'Cleric',        icon: '💚',  desc: 'Divine healer blessed by the gods',          classId: 'healer'      },
    leader:    { name: 'Paladin',       icon: '👑',  desc: 'Holy warrior who leads with faith and steel',classId: 'warrior'     },
    trickster: { name: 'Bard',          icon: '🎵',  desc: 'Silver-tongued performer with hidden skills',classId: 'bard'        },
    wildcard:  { name: 'Druid',         icon: '🌿',  desc: 'Shape-shifter bonded with nature itself',    classId: 'ranger'      },
  },
  space: {
    warrior:   { name: 'Marine',        icon: '🔫',  desc: 'Hardened space combat veteran',              classId: 'warrior'     },
    mage:      { name: 'Engineer',      icon: '⚙',   desc: 'Genius who bends technology to their will',  classId: 'spaceranger' },
    rogue:     { name: 'Hacker',        icon: '💻',  desc: 'Cracks any system, leaves no trace',         classId: 'rogue'       },
    ranger:    { name: 'Pilot',         icon: '🚀',  desc: 'Ace pilot who can fly anything, anywhere',   classId: 'spaceranger' },
    healer:    { name: 'Medic',         icon: '🏥',  desc: 'Field surgeon who keeps the crew alive',     classId: 'healer'      },
    leader:    { name: 'Commander',     icon: '🎖',  desc: 'Tactical leader who never loses composure',  classId: 'warrior'     },
    trickster: { name: 'Con Artist',    icon: '🎭',  desc: 'Smooth operator who deals in information',   classId: 'bard'        },
    wildcard:  { name: 'Alien',         icon: '👽',  desc: 'Extraterrestrial with abilities no one expects', classId: 'mage'   },
  },
  pirate: {
    warrior:   { name: 'Buccaneer',     icon: '⚔',  desc: 'Fearless pirate fighter, boarding cutlass ready', classId: 'warrior' },
    mage:      { name: 'Sea Witch',     icon: '🌊',  desc: 'Commands storms, tides, and sea creatures',  classId: 'mage'        },
    rogue:     { name: 'Smuggler',      icon: '🗡',  desc: 'Moves cargo no one else dares to carry',     classId: 'rogue'       },
    ranger:    { name: 'Navigator',     icon: '🧭',  desc: 'Reads stars and currents better than any map', classId: 'ranger'    },
    healer:    { name: 'Ship Doctor',   icon: '💚',  desc: 'Keeps the crew sailing through anything',    classId: 'healer'      },
    leader:    { name: 'Captain',       icon: '⚓',  desc: 'Commands loyalty through respect and daring', classId: 'pirate'     },
    trickster: { name: 'Merchant',      icon: '💰',  desc: 'Trades information and favors as freely as gold', classId: 'bard'   },
    wildcard:  { name: 'Mermaid',       icon: '🧜',  desc: 'Half ocean, half legend — fully dangerous',  classId: 'ranger'      },
  },
  horror: {
    warrior:   { name: 'Monster Hunter',icon: '🗡',  desc: 'Has faced every nightmare — and lived',      classId: 'warrior'     },
    mage:      { name: 'Occultist',     icon: '🔮',  desc: 'Studies dark forces in order to fight them', classId: 'mage'        },
    rogue:     { name: 'Investigator',  icon: '🔍',  desc: 'Uncovers secrets others are too scared to find', classId: 'rogue'  },
    ranger:    { name: 'Tracker',       icon: '🏹',  desc: 'Hunts what hunts others through dark places',classId: 'ranger'      },
    healer:    { name: 'Empath',        icon: '💚',  desc: 'Senses fear and pain — and can soothe both', classId: 'healer'      },
    leader:    { name: 'Cult Leader',   icon: '👁',  desc: 'Knows the darkness from the inside',         classId: 'bard'        },
    trickster: { name: 'Charlatan',     icon: '🎭',  desc: 'Fakes power until the faking makes it real', classId: 'bard'        },
    wildcard:  { name: 'Creature',      icon: '👻',  desc: 'Not quite human — and that is useful here',  classId: 'mage'        },
  },
  western: {
    warrior:   { name: 'Gunslinger',    icon: '🔫',  desc: 'Fastest draw in three territories',          classId: 'warrior'     },
    mage:      { name: 'Medicine Man',  icon: '🌿',  desc: 'Ancient wisdom and stranger cures',          classId: 'healer'      },
    rogue:     { name: 'Outlaw',        icon: '🗡',  desc: 'Wanted poster in six counties',              classId: 'rogue'       },
    ranger:    { name: 'Bounty Hunter', icon: '🤠',  desc: 'Always gets who they go after',              classId: 'ranger'      },
    healer:    { name: 'Doc',           icon: '💚',  desc: 'One bag, one horse, saves lives either way',  classId: 'healer'      },
    leader:    { name: 'Sheriff',       icon: '⭐',  desc: 'Last law between order and chaos',           classId: 'warrior'     },
    trickster: { name: 'Gambler',       icon: '🃏',  desc: 'Reads people better than any poker hand',    classId: 'bard'        },
    wildcard:  { name: 'Drifter',       icon: '🌵',  desc: 'No name, no past, no limits',               classId: 'rogue'       },
  },
  postapoc: {
    warrior:   { name: 'Raider',        icon: '⚔',  desc: 'Survives by being harder than everyone else',classId: 'warrior'     },
    mage:      { name: 'Techno Shaman', icon: '⚡',  desc: 'Speaks to machines like they are spirits',  classId: 'mage'        },
    rogue:     { name: 'Scavenger',     icon: '🗡',  desc: 'Finds value in what others throw away',     classId: 'rogue'       },
    ranger:    { name: 'Wasteland Scout',icon: '🏹', desc: 'Knows every safe route through the ruins',  classId: 'ranger'      },
    healer:    { name: 'Medic',         icon: '💚',  desc: 'Makes medicine from whatever is left',       classId: 'healer'      },
    leader:    { name: 'Warlord',       icon: '👑',  desc: 'People follow them because the alternative is worse', classId: 'warrior' },
    trickster: { name: 'Trader',        icon: '💰',  desc: 'Information and water are the real currency',classId: 'bard'        },
    wildcard:  { name: 'Mutant',        icon: '☢',  desc: 'Changed by the fallout in ways no one expected', classId: 'mage'    },
  },
  cyberpunk: {
    warrior:   { name: 'Street Samurai',icon: '⚔',  desc: 'Augmented fighter for hire in the neon dark',classId: 'warrior'     },
    mage:      { name: 'Netrunner',     icon: '💻',  desc: 'Dives into cyberspace where others fear to go', classId: 'mage'    },
    rogue:     { name: 'Fixer',         icon: '🗡',  desc: 'Connects people, solves problems, disappears',classId: 'rogue'      },
    ranger:    { name: 'Drone Operator',icon: '🚁',  desc: 'Eyes everywhere, reach beyond any wall',     classId: 'spaceranger' },
    healer:    { name: 'Ripperdoc',     icon: '💚',  desc: 'Installs chrome, patches wounds, asks nothing', classId: 'healer'  },
    leader:    { name: 'Gang Boss',     icon: '👑',  desc: 'Runs a crew in a city that eats the weak',   classId: 'warrior'     },
    trickster: { name: 'Con Artist',    icon: '🎭',  desc: 'Wears different faces in different districts',classId: 'bard'        },
    wildcard:  { name: 'Cyborg',        icon: '🤖',  desc: 'More machine than human — and proud of it',  classId: 'spaceranger' },
  },
  mythology: {
    warrior:   { name: 'Demigod',       icon: '⚡',  desc: 'Divine blood runs hot in mortal veins',      classId: 'warrior'     },
    mage:      { name: 'Oracle',        icon: '🔮',  desc: 'Sees what was, is, and might yet be',         classId: 'mage'        },
    rogue:     { name: 'Trickster God', icon: '🎭',  desc: 'Deceives fate itself — mostly for fun',       classId: 'rogue'       },
    ranger:    { name: 'Huntress',      icon: '🏹',  desc: 'No quarry has ever escaped — mortal or divine', classId: 'ranger'   },
    healer:    { name: 'Priest',        icon: '💚',  desc: 'Channels divine favor to heal and protect',   classId: 'healer'      },
    leader:    { name: 'War Chief',     icon: '👑',  desc: 'Commands armies blessed by the gods',        classId: 'warrior'     },
    trickster: { name: 'Shapeshifter',  icon: '🌀',  desc: 'Takes any form, plays any side',             classId: 'bard'        },
    wildcard:  { name: 'Titan',         icon: '🌋',  desc: 'Ancient power not fully understood by anyone', classId: 'mage'      },
  },
  fairytale: {
    warrior:   { name: 'Cursed Hero',   icon: '🌹',  desc: 'Under a spell — only true deeds can break it', classId: 'warrior'   },
    mage:      { name: 'Fairy Godmother',icon: '✨',  desc: 'Grants wishes, but the magic always has a catch', classId: 'mage'   },
    rogue:     { name: 'Trickster',     icon: '🦊',  desc: 'Cleverness beats power every time — watch and see', classId: 'rogue'  },
    ranger:    { name: 'Woodcutter\'s Child', icon: '🪓', desc: 'Youngest of three — the one the prophecy forgot', classId: 'ranger' },
    healer:    { name: 'Wise Witch',    icon: '🍄',  desc: 'Lives alone for good reason — power requires distance', classId: 'healer' },
    leader:    { name: 'Lost Royalty',  icon: '👑',  desc: 'The true heir in disguise, waiting for the right moment', classId: 'warrior' },
    trickster: { name: 'Talking Animal',icon: '🐾',  desc: 'Not what they appear — far more dangerous than they look', classId: 'bard' },
    wildcard:  { name: 'Enchanted Beast',icon: '🐻', desc: 'Something terrible happened — beauty may yet return', classId: 'mage'  },
  },
  ninja: {
    warrior:   { name: 'Samurai',       icon: '⚔',  desc: 'Bushido incarnate — honor is not optional',  classId: 'warrior'     },
    mage:      { name: 'Onmyoji',       icon: '🌸',  desc: 'Spirit medium who commands supernatural forces', classId: 'mage'   },
    rogue:     { name: 'Ninja',         icon: '🌑',  desc: 'Shadow, silence, and a blade no one saw coming', classId: 'rogue'  },
    ranger:    { name: 'Shinobi Scout', icon: '🏹',  desc: 'Infiltrates, observes, and vanishes without trace', classId: 'ranger' },
    healer:    { name: 'Herbalist',     icon: '💚',  desc: 'Ancient remedies for wounds of body and spirit', classId: 'healer' },
    leader:    { name: 'Shogun',        icon: '👑',  desc: 'Commands absolute loyalty through absolute strength', classId: 'warrior' },
    trickster: { name: 'Kabuki Actor',  icon: '🎭',  desc: 'Every face a performance, every word a weapon', classId: 'bard'   },
    wildcard:  { name: 'Ronin',         icon: '🗡',  desc: 'Masterless and dangerous — loyalty for hire', classId: 'rogue'       },
  },
  historical: {
    warrior:   { name: 'Soldier',       icon: '⚔',  desc: 'Forged in real war with real stakes',         classId: 'warrior'     },
    mage:      { name: 'Alchemist',     icon: '⚗',  desc: 'Turns knowledge into power through experiment', classId: 'mage'     },
    rogue:     { name: 'Spy',           icon: '🗡',  desc: 'Lives two lives simultaneously — poorly',     classId: 'rogue'       },
    ranger:    { name: 'Scout',         icon: '🏹',  desc: 'Reads terrain and troop movements like text', classId: 'ranger'      },
    healer:    { name: 'Field Surgeon', icon: '💚',  desc: 'Keeps fighters alive long enough to win',    classId: 'healer'       },
    leader:    { name: 'General',       icon: '👑',  desc: 'History remembers the names of the bold',    classId: 'warrior'      },
    trickster: { name: 'Jester',        icon: '🃏',  desc: 'The only one at court allowed to tell the truth', classId: 'bard'  },
    wildcard:  { name: 'Shaman',        icon: '🔥',  desc: 'Bridges the world of the living and the dead',classId: 'mage'        },
  },
};

// Get archetype for a role in a genre
export function getArchetype(genreId, roleId) {
  return ARCHETYPES[genreId]?.[roleId] || ARCHETYPES.fantasy[roleId];
}

// Get all 8 archetypes for a genre as array
export function getGenreArchetypes(genreId) {
  const genre = ARCHETYPES[genreId] || ARCHETYPES.fantasy;
  const icons = ARCHETYPE_ICONS[genreId] || ARCHETYPE_ICONS.fantasy;
  return ROLES.map(role => ({
    ...role,
    ...genre[role.id],
    roleId:   role.id,
    genreId,
    gameIcon: icons[role.id] || null,
  }));
}

// Get genre label
export function getGenreLabel(genreId) {
  return GENRES.find(g => g.id === genreId)?.label || 'Fantasy';
}

// ── Game icon paths per role per genre ────
// Maps roleId → game-icons.net path per genre
// Used by CharacterCreateScreen archetype cards

export const ARCHETYPE_ICONS = {
  fantasy: {
    warrior:   'lorc/broadsword',
    mage:      'lorc/wizard-staff',
    rogue:     'lorc/plain-dagger',
    ranger:    'lorc/high-shot',
    healer:    'delapouite/caduceus',
    leader:    'lorc/holy-grail',
    trickster: 'delapouite/banjo',
    wildcard:  'lorc/fluffy-trefoil',
  },
  space: {
    warrior:   'lorc/ray-gun',
    mage:      'lorc/gear-hammer',
    rogue:     'delapouite/laptop',
    ranger:    'lorc/rocket',
    healer:    'delapouite/caduceus',
    leader:    'lorc/crowned-skull',
    trickster: 'lorc/domino-mask',
    wildcard:  'lorc/alien-skull',
  },
  pirate: {
    warrior:   'lorc/plain-dagger',
    mage:      'lorc/alien-skull',
    rogue:     'lorc/swap-bag',
    ranger:    'lorc/compass',
    healer:    'delapouite/caduceus',
    leader:    'lorc/anchor',
    trickster: 'delapouite/coins',
    wildcard:  'lorc/anchor',
  },
  horror: {
    warrior:   'lorc/plain-dagger',
    mage:      'lorc/third-eye',
    rogue:     'lorc/magnifying-glass',
    ranger:    'delapouite/binoculars',
    healer:    'lorc/third-eye',
    leader:    'delapouite/all-seeing-eye',
    trickster: 'lorc/domino-mask',
    wildcard:  'lorc/werewolf',
  },
  western: {
    warrior:   'delapouite/revolver',
    mage:      'lorc/cauldron',
    rogue:     'lorc/domino-mask',
    ranger:    'lorc/law-star',
    healer:    'delapouite/caduceus',
    leader:    'lorc/law-star',
    trickster: 'lorc/domino-mask',
    wildcard:  'lorc/boot-stomp',
  },
  postapoc: {
    warrior:   'lorc/crossed-axes',
    mage:      'lorc/tesla-coil',
    rogue:     'lorc/swap-bag',
    ranger:    'delapouite/binoculars',
    healer:    'delapouite/caduceus',
    leader:    'lorc/crossed-axes',
    trickster: 'lorc/domino-mask',
    wildcard:  'lorc/radioactive',
  },
  cyberpunk: {
    warrior:   'lorc/broadsword',
    mage:      'lorc/brain-stem',
    rogue:     'delapouite/briefcase',
    ranger:    'delapouite/delivery-drone',
    healer:    'lorc/scalpel',
    leader:    'lorc/crowned-skull',
    trickster: 'lorc/domino-mask',
    wildcard:  'lorc/android-mask',
  },
  mythology: {
    warrior:   'lorc/zeus-sword',
    mage:      'lorc/crystal-ball',
    rogue:     'lorc/fox-head',
    ranger:    'lorc/wolf-howl',
    healer:    'lorc/ankh',
    leader:    'lorc/zeus-sword',
    trickster: 'lorc/fox-head',
    wildcard:  'lorc/battle-axe',
  },
  fairytale: {
    warrior:   'lorc/thorny-vine',
    mage:      'lorc/fairy-wand',
    rogue:     'lorc/fox-head',
    ranger:    'lorc/wood-axe',
    healer:    'lorc/cauldron',
    leader:    'lorc/crown',
    trickster: 'lorc/paw',
    wildcard:  'lorc/bear-head',
  },
  ninja: {
    warrior:   'lorc/broadsword',
    mage:      'lorc/concentration-orb',
    rogue:     'lorc/plain-dagger',
    ranger:    'lorc/snatch',
    healer:    'lorc/cauldron',
    leader:    'delapouite/asian-lantern',
    trickster: 'lorc/drama-masks',
    wildcard:  'lorc/domino-mask',
  },
  historical: {
    warrior:   'lorc/crossed-axes',
    mage:      'lorc/crystal-ball',
    rogue:     'lorc/domino-mask',
    ranger:    'delapouite/binoculars',
    healer:    'delapouite/caduceus',
    leader:    'lorc/battle-axe',
    trickster: 'lorc/domino-mask',
    wildcard:  'lorc/crowned-skull',
  },
};
