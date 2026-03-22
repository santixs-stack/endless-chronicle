// ═══════════════════════════════════════════
//  GAME-ICONS.NET REFERENCE
//  License: CC BY 3.0 — credit: game-icons.net
//  
//  ACTUAL PATH AFTER DOWNLOAD:
//  The zip extracts to nested folders:
//  public/icons/icons/ffffff/transparent/1x1/[author]/[name].svg
//
//  In-app URL:
//  /icons/icons/ffffff/transparent/1x1/lorc/broadsword.svg
//
//  Use getIconPath(category, key) or iconPath('lorc/broadsword')
//  helpers defined at bottom of this file.
// ═══════════════════════════════════════════

// ── HOW TO USE ────────────────────────────
// 
// As inline SVG component:
//   import SwordIcon from '/icons/lorc/broadsword.svg?react'
//
// As img tag:
//   <img src="/icons/lorc/broadsword.svg" />
//
// Colored with CSS filter or currentColor:
//   <img src="..." style={{ filter: 'invert(1)' }} />
//
// ─────────────────────────────────────────

export const GAME_ICONS = {

  // ════════════════════════════════════════
  //  CLASSES / ARCHETYPES
  //  Used on archetype selection cards
  // ════════════════════════════════════════

  classes: {
    // Fantasy
    warrior:      { file: 'lorc/broadsword',         alt: 'lorc/crossed-swords'      },
    mage:         { file: 'lorc/wizard-staff',        alt: 'lorc/magic-swirl'         },
    rogue:        { file: 'lorc/daggers',             alt: 'lorc/hooded-figure'       },
    ranger:       { file: 'lorc/high-shot',           alt: 'lorc/archery-target'      },
    healer:       { file: 'delapouite/caduceus',            alt: 'lorc/hospital-cross'      },
    bard:         { file: 'delapouite/banjo',                alt: 'lorc/musical-notes'       },
    paladin:      { file: 'lorc/holy-grail',          alt: 'lorc/shield-reflect'      },
    druid:        { file: 'lorc/acorn',            alt: 'lorc/wolf-head'           },

    // Space
    marine:       { file: 'lorc/ray-gun',             alt: 'lorc/plasma-bolt'         },
    engineer:     { file: 'lorc/gear-hammer',         alt: 'lorc/spanner'             },
    hacker:       { file: 'lorc/laptop',              alt: 'lorc/circuit-board'       },
    pilot:        { file: 'lorc/rocket',              alt: 'lorc/astronaut-helmet'    },
    spaceMedic:   { file: 'lorc/syringe',             alt: 'lorc/medical-pack'        },
    commander:    { file: 'lorc/rank-3',              alt: 'lorc/medal'               },
    alien:        { file: 'lorc/alien-skull',         alt: 'lorc/alien-skull'            },
    cyborg:       { file: 'lorc/robotic-arm',         alt: 'lorc/android-mask'        },

    // Ocean
    buccaneer:    { file: 'lorc/plain-dagger',             alt: 'lorc/pirate-skull'        },
    seaWitch:     { file: 'lorc/tentacles-skull',     alt: 'lorc/kraken-tentacle'     },
    smuggler:     { file: 'lorc/anonymous',           alt: 'lorc/swap-bag'            },
    navigator:    { file: 'lorc/compass',             alt: 'lorc/spyglass'            },
    captain:      { file: 'lorc/anchor',              alt: 'lorc/ship-wheel'          },
    mermaid:      { file: 'lorc/fish-monster',        alt: 'lorc/anchor'             },

    // Horror
    monsterHunter:{ file: 'lorc/plain-dagger',              alt: 'lorc/silver-bullet'       },
    occultist:    { file: 'lorc/pentagram',           alt: 'lorc/necronomicon'        },
    investigator: { file: 'lorc/magnifying-glass',   alt: 'lorc/domino-mask'    },
    empath:       { file: 'lorc/third-eye',          alt: 'lorc/brainwaves'          },
    creature:     { file: 'lorc/werewolf',           alt: 'lorc/ghost'     },

    // Western
    gunslinger:   { file: 'lorc/revolver',           alt: 'lorc/cowboy-boot'         },
    sheriff:      { file: 'lorc/sheriff',            alt: 'lorc/badge'               },
    outlaw:       { file: 'lorc/wanted-reward',      alt: 'lorc/domino-mask'         },
    bountyHunter: { file: 'lorc/handcuffs',          alt: 'lorc/cowboy-hat'          },
    gambler:      { file: 'lorc/domino-mask',          alt: 'lorc/poker-hand'          },
    drifter:      { file: 'lorc/boot-stomp',         alt: 'lorc/plain-dagger'        },

    // Post-Apoc
    raider:       { file: 'lorc/crossed-axes',         alt: 'lorc/gas-mask'            },
    technoShaman: { file: 'lorc/tesla-coil',         alt: 'lorc/circuit-board'       },
    scavenger:    { file: 'lorc/mine-wagon',         alt: 'lorc/swap-bag'            },
    warlord:      { file: 'lorc/war-axe',            alt: 'lorc/skull-crossed-bones' },
    mutant:       { file: 'lorc/radioactive',        alt: 'lorc/biohazard'           },
    trader:       { file: 'lorc/cauldron',              alt: 'lorc/swap-bag'            },

    // Cyberpunk
    streetSamurai:{ file: 'lorc/broadsword',             alt: 'lorc/laser-blade'         },
    netrunner:    { file: 'lorc/brain-stem',         alt: 'lorc/cybernetic-eye'      },
    fixer:        { file: 'lorc/briefcase',          alt: 'lorc/swap-bag'            },
    droneOp:      { file: 'lorc/drone',              alt: 'lorc/quadcopter'          },
    ripperdoc:    { file: 'lorc/scalpel',            alt: 'lorc/bone-knife'          },
    gangBoss:     { file: 'lorc/crown',              alt: 'lorc/brass-knuckles'      },

    // Mythology
    demigod:      { file: 'lorc/zeus-sword',         alt: 'lorc/muscle-up'           },
    oracle:       { file: 'lorc/crystal-ball',       alt: 'lorc/eye-shield'          },
    tricksterGod: { file: 'lorc/fox-head',           alt: 'delapouite/jester-hat'          },
    huntress:     { file: 'lorc/stag-head',          alt: 'lorc/moon-bow'            },
    priest:       { file: 'lorc/pray',               alt: 'lorc/ankh'                },
    titan:        { file: 'lorc/battle-axe',              alt: 'lorc/stone-tablet'        },
    shapeshifter: { file: 'lorc/fox-head',               alt: 'lorc/transformation'      },
    warChief:     { file: 'lorc/spartacus',          alt: 'lorc/zeus-sword'      },

    // Fairy Tale
    enchanter:    { file: 'lorc/fairy-wand',         alt: 'lorc/magic-wand'          },
    wiseWoman:    { file: 'lorc/potion',             alt: 'lorc/witch-hat'           },
    woodsman:     { file: 'lorc/wood-axe',           alt: 'lorc/pine-tree'           },
    royalty:      { file: 'lorc/crown',              alt: 'lorc/robe'                },
    faerie:       { file: 'lorc/fairy',              alt: 'lorc/butterfly'           },
    jester:       { file: 'delapouite/jester-hat',         alt: 'lorc/juggling-clubs'      },

    // Ninja / Samurai
    samurai:      { file: 'lorc/broadsword',             alt: 'lorc/samurai-helmet'      },
    onmyoji:      { file: 'lorc/spiral-shell',           alt: 'lorc/ghost'               },
    ninja:        { file: 'lorc/plain-dagger',      alt: 'lorc/black-ninja-head'    },
    shinobiScout: { file: 'lorc/snatch',             alt: 'lorc/eye-spy'             },
    herbalist:    { file: 'lorc/cauldron',              alt: 'lorc/leaf-swirl'          },
    shogun:       { file: 'delapouite/asian-lantern',      alt: 'lorc/samurai-helmet'      },
    kabukiActor:  { file: 'lorc/drama-masks',        alt: 'lorc/abstract-049'        },
    ronin:        { file: 'lorc/ronin',              alt: 'lorc/cracked-sword'       },

    // Historical
    soldier:      { file: 'lorc/crossed-axes',       alt: 'lorc/zeus-sword'      },
    alchemist:    { file: 'lorc/crystal-ball',       alt: 'lorc/cauldron'            },
    spy:          { file: 'lorc/spy',                alt: 'lorc/domino-mask'    },
    scout:        { file: 'lorc/horseshoe',          alt: 'lorc/binoculars'          },
    fieldSurgeon: { file: 'lorc/first-aid',          alt: 'lorc/scalpel'             },
    general:      { file: 'lorc/rank-3',             alt: 'lorc/tattered-banner'            },
    shaman:       { file: 'lorc/crowned-skull',        alt: 'lorc/totem-head'          },
  },

  // ════════════════════════════════════════
  //  QUEST TYPES
  //  Used on quest selection cards
  // ════════════════════════════════════════

  quests: {
    dungeon:      { file: 'lorc/crossed-swords',       alt: 'lorc/crystal-ball'       },
    rescue:       { file: 'lorc/imprisoned',         alt: 'lorc/prison'              },
    treasure:     { file: 'lorc/treasure-map',       alt: 'lorc/open-treasure-chest' },
    pirates:      { file: 'lorc/pirate-skull',       alt: 'lorc/pirate-flag'         },
    space:        { file: 'lorc/rocket',             alt: 'lorc/ringed-planet'       },
    spaceMystery: { file: 'lorc/space-suit',         alt: 'lorc/ufo'                 },
    wildwest:     { file: 'lorc/six-shooter',        alt: 'lorc/cowboy-hat'          },
    dreamworld:   { file: 'lorc/moon',               alt: 'lorc/dream-catcher'       },
    haunted:      { file: 'lorc/haunted-house',      alt: 'lorc/ghost'               },
    gladiator:    { file: 'lorc/colosseum',          alt: 'lorc/roman-toga'          },
    wasteland:    { file: 'lorc/nuclear',            alt: 'lorc/radioactive'         },
    cybercity:    { file: 'lorc/hacking',            alt: 'lorc/magnifying-glass'                },
    olympus:      { file: 'lorc/zeus-sword',         alt: 'lorc/olympia'             },
    fairytale:    { file: 'lorc/fairy-tale',         alt: 'lorc/magic-wand'          },
    shogun:       { file: 'lorc/torii-gate',         alt: 'lorc/broadsword'              },
    custom:       { file: 'lorc/pencil',             alt: 'lorc/quill'               },
  },

  // ════════════════════════════════════════
  //  COMBAT & ACTIONS
  //  Used in combat banner, action chips,
  //  and story event cards
  // ════════════════════════════════════════

  combat: {
    attack:       { file: 'lorc/crossed-swords'                                       },
    defend:       { file: 'lorc/shield'                                               },
    magic:        { file: 'lorc/magic-swirl'                                          },
    shoot:        { file: 'lorc/arrow-flights'                                        },
    flee:         { file: 'lorc/sprint'                                               },
    stealth:      { file: 'lorc/domino-mask'                                     },
    heal:         { file: 'lorc/fluffy-trefoil'                                        },
    critHit:      { file: 'lorc/sword-clash'                                          },
    fumble:       { file: 'lorc/broken-sword'                                         },
    assess:       { file: 'lorc/magnifying-glass'                                     },
    diceD20:      { file: 'lorc/crenulated-shield'                             },
    diceD6:       { file: 'lorc/dice-six-faces-six'                                   },
    diceD4:       { file: 'lorc/dice-four-faces-four'                                 },
    nat20:        { file: 'lorc/crenulated-shield'                             },
    nat1:         { file: 'lorc/broken-shield'                                        },
  },

  // ════════════════════════════════════════
  //  STATUS EFFECTS
  //  Used in combat banner HP display
  //  and character sheet
  // ════════════════════════════════════════

  status: {
    healthy:      { file: 'lorc/fluffy-trefoil'                                        },
    bloodied:     { file: 'lorc/health-decrease'                                      },
    critical:     { file: 'lorc/bleeding-heart'                                       },
    dead:         { file: 'lorc/skull'                                                },
    poisoned:     { file: 'lorc/poison'                                               },
    cursed:       { file: 'lorc/black-flag'                                           },
    buffed:       { file: 'lorc/star-struck'                                          },
    shielded:     { file: 'lorc/shield'                                               },
  },

  // ════════════════════════════════════════
  //  STATS / CHARACTER SHEET
  //  Used on character sheet overlay
  // ════════════════════════════════════════

  stats: {
    strength:     { file: 'lorc/muscle-up'                                            },
    dexterity:    { file: 'lorc/sprint'                                               },
    intelligence: { file: 'lorc/brain'                                                },
    wisdom:       { file: 'lorc/eye'                                                  },
    constitution: { file: 'lorc/hearts'                                               },
    hp:           { file: 'lorc/fluffy-trefoil'                                        },
    xp:           { file: 'lorc/upgrade'                                              },
    level:        { file: 'lorc/rank-1'                                               },
    gold:         { file: 'lorc/gold-bar'                                             },
    inventory:    { file: 'lorc/swap-bag'                                             },
  },

  // ════════════════════════════════════════
  //  INVENTORY ITEMS
  //  Used in sidebar inventory list
  // ════════════════════════════════════════

  items: {
    sword:        { file: 'lorc/broadsword'                                           },
    dagger:       { file: 'lorc/plain-dagger'                                         },
    bow:          { file: 'lorc/high-shot'                                            },
    staff:        { file: 'lorc/wizard-staff'                                         },
    shield:       { file: 'lorc/shield'                                               },
    armor:        { file: 'lorc/breastplate'                                          },
    helmet:       { file: 'lorc/barbute'                                              },
    potion:       { file: 'lorc/potion'                                               },
    potionHealth: { file: 'lorc/health-potion'                                        },
    potionMana:   { file: 'lorc/magic-potion'                                         },
    key:          { file: 'lorc/key'                                                  },
    map:          { file: 'lorc/treasure-map'                                         },
    chest:        { file: 'lorc/open-treasure-chest'                                  },
    torch:        { file: 'lorc/torch'                                                },
    rope:         { file: 'lorc/rope-coil'                                            },
    food:         { file: 'lorc/meal'                                                 },
    gold:         { file: 'lorc/gold-bar'                                             },
    scroll:       { file: 'lorc/scroll-unfurled'                                      },
    book:         { file: 'lorc/spell-book'                                           },
    amulet:       { file: 'lorc/necklace'                                             },
    ring:         { file: 'lorc/ring'                                                 },
    cloak:        { file: 'lorc/robe'                                                 },
    bomb:         { file: 'lorc/bomb-explosion'                                       },
    gun:          { file: 'lorc/revolver'                                             },
    // Sci-fi
    blaster:      { file: 'lorc/ray-gun'                                              },
    medKit:       { file: 'lorc/first-aid'                                            },
    dataChip:     { file: 'lorc/computer-fan'                                         },
    spacesuit:    { file: 'lorc/space-suit'                                           },
  },

  // ════════════════════════════════════════
  //  JOURNAL & UI
  //  Used in journal overlay, sidebar,
  //  and action buttons
  // ════════════════════════════════════════

  ui: {
    journal:      { file: 'lorc/open-book'                                            },
    quest:        { file: 'lorc/scroll-quill'                                         },
    npc:          { file: 'lorc/conversation'                                         },
    bestiary:     { file: 'lorc/creature-morph'                                       },
    codex:        { file: 'lorc/bookshelf'                                            },
    save:         { file: 'lorc/swap-bag'                                          },
    settings:     { file: 'lorc/cog'                                                  },
    search:       { file: 'lorc/magnifying-glass'                                     },
    export:       { file: 'lorc/paper-arrow'                                          },
    recap:        { file: 'lorc/magnifying-glass'                                           },
    music:        { file: 'lorc/music-spell'                                          },
    cloud:        { file: 'lorc/anchor'                                         },
    newGame:      { file: 'lorc/clockwork'                                            },
    debug:        { file: 'lorc/bug'                                                  },
    milestone:    { file: 'lorc/progression'                                          },
    levelUp:      { file: 'lorc/upgrade'                                              },
    charSheet:    { file: 'lorc/open-book'                                      },
  },

  // ════════════════════════════════════════
  //  CREATURES / ENEMIES
  //  For future use in scene renderer
  //  when creature system is re-enabled
  // ════════════════════════════════════════

  creatures: {
    goblin:       { file: 'lorc/crossed-swords'                                          },
    orc:          { file: 'lorc/battle-gear'                                             },
    skeleton:     { file: 'lorc/crossed-swords'                                             },
    zombie:       { file: 'lorc/spectre'                                     },
    ghost:        { file: 'lorc/ghost'                                                },
    wraith:       { file: 'lorc/spectre'                                              },
    dragon:       { file: 'lorc/dragon-head'                                          },
    troll:        { file: 'lorc/mountain-cave'                                        },
    demon:        { file: 'lorc/crowned-skull'                                          },
    vampire:      { file: 'lorc/ghost'                                      },
    wolf:         { file: 'lorc/wolf-head'                                            },
    spider:       { file: 'lorc/rock'                                          },
    alien:        { file: 'lorc/alien-skull'                                          },
    robot:        { file: 'lorc/android-mask'                                         },
    kraken:       { file: 'lorc/octoman'                                              },
    rat:          { file: 'lorc/plain-dagger'                                                  },
    bat:          { file: 'lorc/ghost'                                                  },
    slime:        { file: 'lorc/slime'                                                },
    golem:        { file: 'lorc/stone-golem'                                          },
    lich:         { file: 'lorc/lich'                                                 },
    bandit:       { file: 'lorc/hood'                                                 },
    mummy:        { file: 'lorc/mummy-head'                                           },
    yeti:         { file: 'lorc/abominable-snowman'                                   },
    fairy:        { file: 'lorc/fairy'                                                },
    treant:       { file: 'lorc/acorn'                                             },
  },

  // ════════════════════════════════════════
  //  SCENE / ENVIRONMENT
  //  Future use in scene renderer labels
  //  and loading screens
  // ════════════════════════════════════════

  scenes: {
    dungeon:      { file: 'lorc/crossed-swords'                                         },
    cave:         { file: 'lorc/crystal-ball'                                        },
    forest:       { file: 'lorc/pine-tree'                                            },
    plains:       { file: 'lorc/high-shot'                                                },
    castle:       { file: 'lorc/crown'                                        },
    ruins:        { file: 'lorc/crowned-skull'                                                },
    ocean:        { file: 'lorc/anchor'                                        },
    space:        { file: 'lorc/ringed-planet'                                        },
    village:      { file: 'lorc/open-book'                                              },
    city:         { file: 'lorc/magnifying-glass'                                                 },
    desert:       { file: 'lorc/dead-wood'                                            },
    mountain:     { file: 'lorc/mountains'                                            },
    swamp:        { file: 'lorc/cauldron'                                                },
    snow:         { file: 'lorc/fluffy-trefoil'                                            },
    tavern:       { file: 'lorc/wooden-sign'                                          },
    graveyard:    { file: 'lorc/tombstone'                                            },
    volcano:      { file: 'lorc/volcano'                                              },
    underwater:   { file: 'lorc/fish-monster'                                         },
  },
};

// ── Helper to get icon path ────────────────
// The downloaded zip extracts to:
// public/icons/icons/ffffff/transparent/1x1/[author]/[name].svg
//
// Usage: getIconPath('classes', 'warrior')
// Returns: '/icons/icons/ffffff/transparent/1x1/lorc/broadsword.svg'

const ICON_BASE = '/icons/icons/ffffff/transparent/1x1';

export function getIconPath(category, key) {
  const entry = GAME_ICONS[category]?.[key];
  if (!entry) return null;
  return `${ICON_BASE}/${entry.file}.svg`;
}

// Direct path — use when you have author/name already
// e.g. iconPath('lorc/broadsword') → full URL
export function iconPath(authorSlashName) {
  return `${ICON_BASE}/${authorSlashName}.svg`;
}

// ── Credit attribution ─────────────────────
// Must display somewhere visible (CC BY 3.0)
// Recommended: Settings overlay footer
export const ATTRIBUTION = 'Game icons by game-icons.net (CC BY 3.0)';
