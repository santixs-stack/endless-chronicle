// ═══════════════════════════════════════════
//  CHARACTER PRESETS
//  8 ready-made characters with age variety.
//  world: null means use the quest world.
// ═══════════════════════════════════════════

export const CHAR_PRESETS = [
  {
    id: 'brave_squire', icon: '⚔', name: 'The Squire',
    tagline: 'Twelve years old, one rusty sword, and the villain just took your knight. Guess you\'re the hero now.',
    tags: ['fantasy'],
    char: {
      name: 'Finn', age: '12',
      role: 'Knight\'s apprentice — knows the rules, breaks them when it matters',
      trait: 'Can\'t walk away from someone who needs help, even when outnumbered',
      bond: 'My mentor, Sir Aldric, who is now a prisoner',
      flaw: 'Always jumps in before thinking it through',
      motivation: 'Rescue my knight and prove I\'m ready',
    },
    world: null,
  },
  {
    id: 'old_wizard', icon: '✨', name: 'The Old Wizard',
    tagline: 'Lived for three hundred years. Still occasionally sets the wrong thing on fire.',
    tags: ['fantasy'],
    char: {
      name: 'Aldrus', age: '312 (looks 70)',
      role: 'Retired court wizard, wandering because retirement was boring',
      trait: 'Knows a spell for almost everything — whether it works is another matter',
      bond: 'Old apprentices scattered across the world, all in trouble again',
      flaw: 'Overconfident about spells that haven\'t been tested in decades',
      motivation: 'One last great adventure before actually retiring',
    },
    world: null,
  },
  {
    id: 'sneaky_thief', icon: '🗡', name: 'The Pickpocket',
    tagline: 'Grew up on the streets. Knows every alley, every shortcut, and exactly who not to trust.',
    tags: ['fantasy', 'modern'],
    char: {
      name: 'Pip', age: '14',
      role: 'Street thief who survives on speed, luck, and knowing when to run',
      trait: 'Can vanish into any crowd and crack most locks',
      bond: 'A small crew of friends who depend on me',
      flaw: 'Doesn\'t trust authority — at all, ever',
      motivation: 'Find enough treasure to get my friends somewhere safe',
    },
    world: null,
  },
  {
    id: 'forest_ranger', icon: '🏹', name: 'The Young Ranger',
    tagline: 'Raised in the deep woods. Animals trust her more than people do. Honestly, fair.',
    tags: ['fantasy'],
    char: {
      name: 'Skye', age: '16',
      role: 'Wilderness scout who knows plants, animals, and secret paths better than any map',
      trait: 'Animals always seem to appear when she truly needs them',
      bond: 'The ancient forest she grew up protecting',
      flaw: 'Gets overwhelmed in cities — too loud, too many people, too few trees',
      motivation: 'Something is making the forest creatures flee in terror — find out what',
    },
    world: null,
  },
  {
    id: 'space_cadet', icon: '🚀', name: 'The Cadet',
    tagline: 'Youngest crew member on a starship. Also the only one who can fix the engine. No pressure.',
    tags: ['sci-fi'],
    char: {
      name: 'Orion', age: '15',
      role: 'Junior crew member and self-taught mechanic — fixes almost anything with junk parts',
      trait: 'Has an almost supernatural understanding of machines',
      bond: 'The crew who treat me like family',
      flaw: 'Way too confident in untested plans',
      motivation: 'Get everyone home safely, even if it breaks the plan',
    },
    world: null,
  },
  {
    id: 'sea_captain', icon: '⚓', name: 'The Captain',
    tagline: 'Middle-aged, weathered, and in possession of a treasure map that three navies want back.',
    tags: ['pirate', 'historical'],
    char: {
      name: 'Maren', age: '42',
      role: 'Retired pirate captain pulled back into action by a map she should have burned',
      trait: 'Reads weather, people, and danger with uncanny accuracy',
      bond: 'My old crew, who I promised I\'d never call on again',
      flaw: 'Terrible at saying no when the prize is big enough',
      motivation: 'One last score — then I mean it this time',
    },
    world: null,
  },
  {
    id: 'ageless_slime', icon: '🟢', name: 'The Slime',
    tagline: 'No one knows how old it is. It has absorbed seventeen adventurers\' worth of memories. It finds this confusing.',
    tags: ['fantasy', 'weird'],
    char: {
      name: 'Glorp', age: 'Ageless (roughly 847 years of absorbed memories)',
      role: 'Sentient slime who gained consciousness after absorbing too many adventurers — now trying to be one',
      trait: 'Can squeeze through any gap and occasionally speaks in the voices of previous victims',
      bond: 'A small jar it carries — contains the essence of the first person who was ever kind to it',
      flaw: 'Gets distracted by interesting textures. Every. Single. Time.',
      motivation: 'Figure out what it actually wants, now that it wants things',
    },
    world: null,
  },
  {
    id: 'gruff_veteran', icon: '🛡', name: 'The Veteran',
    tagline: 'Forty years of adventuring. Two bad knees. One rule left: never get involved. Oh no.',
    tags: ['fantasy', 'historical'],
    char: {
      name: 'Brynn', age: '58',
      role: 'Retired monster hunter who swore she was done — then someone burned down her tavern',
      trait: 'Has faced almost everything once and remembers exactly what worked',
      bond: 'The tavern she spent twenty years building, now a smouldering ruin',
      flaw: 'Deeply, stubbornly resistant to asking for help',
      motivation: 'Find who destroyed her home and have a very serious conversation with them',
    },
    world: null,
  },
];
