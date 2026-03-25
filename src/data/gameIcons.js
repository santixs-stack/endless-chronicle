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
    rogue:        { file: 'lorc/daggers',             alt: 'lorc/hood'       },
    ranger:       { file: 'lorc/high-shot',           alt: 'lorc/archery-target'      },
    healer:       { file: 'delapouite/caduceus',            alt: 'lorc/hospital-cross'      },
    bard:         { file: 'delapouite/banjo',                alt: 'lorc/music-spell'       },
    paladin:      { file: 'lorc/holy-grail',          alt: 'lorc/shield-reflect'      },
    druid:        { file: 'lorc/acorn',            alt: 'lorc/wolf-head'           },

    // Space
    marine:       { file: 'lorc/ray-gun',             alt: 'lorc/plasma-bolt'         },
    engineer:     { file: 'lorc/gear-hammer',         alt: 'lorc/spanner'             },
    hacker:       { file: 'lorc/circuitry',              alt: 'lorc/circuitry'       },
    pilot:        { file: 'lorc/rocket',              alt: 'lorc/android-mask'    },
    spaceMedic:   { file: 'lorc/syringe',             alt: 'lorc/potion-ball'        },
    commander:    { file: 'lorc/rank-3',              alt: 'lorc/medal'               },
    alien:        { file: 'lorc/alien-skull',         alt: 'lorc/alien-skull'            },
    cyborg:       { file: 'lorc/android-mask',         alt: 'lorc/android-mask'        },

    // Pirate / Ocean
    buccaneer:    { file: 'lorc/plain-dagger',             alt: 'lorc/skull-bolt'        },
    seaWitch:     { file: 'lorc/tentacles-skull',     alt: 'lorc/curled-tentacle'     },
    smuggler:     { file: 'lorc/hood',           alt: 'lorc/swap-bag'            },
    navigator:    { file: 'lorc/compass',             alt: 'lorc/spyglass'            },
    captain:      { file: 'lorc/anchor',              alt: 'lorc/anchor'          },
    mermaid:      { file: 'lorc/angler-fish',        alt: 'lorc/anchor'             },

    // Horror
    monsterHunter:{ file: 'lorc/plain-dagger',              alt: 'lorc/supersonic-bullet'       },
    occultist:    { file: 'lorc/star-prominences',           alt: 'lorc/open-book'        },
    investigator: { file: 'lorc/magnifying-glass',   alt: 'lorc/domino-mask'    },
    empath:       { file: 'lorc/third-eye',          alt: 'lorc/brain'          },
    creature:     { file: 'lorc/werewolf',           alt: 'lorc/ghost'     },

    // Western
    gunslinger:   { file: 'lorc/crossed-pistols',           alt: 'lorc/boot-stomp'         },
    sheriff:      { file: 'lorc/broadsword',            alt: 'lorc/broadsword'               },
    outlaw:       { file: 'lorc/magnifying-glass',      alt: 'lorc/domino-mask'         },
    bountyHunter: { file: 'lorc/handcuffs',          alt: 'lorc/top-hat'          },
    gambler:      { file: 'lorc/domino-mask',          alt: 'lorc/poker-hand'          },
    drifter:      { file: 'lorc/boot-stomp',         alt: 'lorc/plain-dagger'        },

    // Post-Apoc
    raider:       { file: 'lorc/crossed-axes',         alt: 'lorc/gas-mask'            },
    technoShaman: { file: 'lorc/tesla-coil',         alt: 'lorc/circuitry'       },
    scavenger:    { file: 'lorc/land-mine',         alt: 'lorc/swap-bag'            },
    warlord:      { file: 'lorc/battle-axe',            alt: 'lorc/skull-crossed-bones' },
    mutant:       { file: 'lorc/radioactive',        alt: 'lorc/biohazard'           },
    trader:       { file: 'lorc/cauldron',              alt: 'lorc/swap-bag'            },

    // Cyberpunk
    streetSamurai:{ file: 'lorc/broadsword',             alt: 'lorc/fragmented-sword'         },
    netrunner:    { file: 'lorc/brain-stem',         alt: 'lorc/android-mask'      },
    fixer:        { file: 'lorc/swap-bag',          alt: 'lorc/swap-bag'            },
    droneOp:      { file: 'lorc/condor-emblem',              alt: 'lorc/condor-emblem'          },
    ripperdoc:    { file: 'lorc/scalpel',            alt: 'lorc/bone-knife'          },
    gangBoss:     { file: 'lorc/crown',              alt: 'lorc/boxing-glove'      },

    // Mythology
    demigod:      { file: 'lorc/zeus-sword',         alt: 'lorc/muscle-up'           },
    oracle:       { file: 'lorc/crystal-ball',       alt: 'lorc/eye-shield'          },
    tricksterGod: { file: 'lorc/fox-head',           alt: 'delapouite/jester-hat'          },
    huntress:     { file: 'lorc/stag-head',          alt: 'lorc/fairy-wand'            },
    priest:       { file: 'lorc/holy-symbol',               alt: 'lorc/ankh'                },
    titan:        { file: 'lorc/battle-axe',              alt: 'lorc/stone-tablet'        },
    shapeshifter: { file: 'lorc/fox-head',               alt: 'lorc/broadsword'      },
    warChief:     { file: 'lorc/spartan',          alt: 'lorc/zeus-sword'      },

    // Fairy Tale
    enchanter:    { file: 'lorc/fairy-wand',         alt: 'lorc/fairy-wand'          },
    wiseWoman:    { file: 'lorc/potion-ball',             alt: 'lorc/witch-flight'           },
    woodsman:     { file: 'lorc/wood-axe',           alt: 'lorc/pine-tree'           },
    royalty:      { file: 'lorc/crown',              alt: 'lorc/robe'                },
    faerie:       { file: 'lorc/fairy-wand',              alt: 'lorc/butterfly'           },
    jester:       { file: 'delapouite/jester-hat',         alt: 'lorc/juggler'      },

    // Ninja / Samurai
    samurai:      { file: 'lorc/broadsword',             alt: 'lorc/crested-helmet'      },
    onmyoji:      { file: 'lorc/spiral-shell',           alt: 'lorc/ghost'               },
    ninja:        { file: 'lorc/plain-dagger',      alt: 'lorc/ninja-mask'    },
    shinobiScout: { file: 'lorc/snatch',             alt: 'lorc/third-eye'             },
    herbalist:    { file: 'lorc/cauldron',              alt: 'lorc/leaf-swirl'          },
    shogun:       { file: 'delapouite/asian-lantern',      alt: 'lorc/crested-helmet'      },
    kabukiActor:  { file: 'lorc/drama-masks',        alt: 'lorc/abstract-049'        },
    ronin:        { file: 'lorc/ninja-mask',              alt: 'lorc/cracked-saber'       },

    // Historical
    soldier:      { file: 'lorc/crossed-axes',       alt: 'lorc/zeus-sword'      },
    alchemist:    { file: 'lorc/crystal-ball',       alt: 'lorc/cauldron'            },
    spy:          { file: 'lorc/rogue',                alt: 'lorc/domino-mask'    },
    scout:        { file: 'lorc/broadsword',          alt: 'lorc/magnifying-glass'          },
    fieldSurgeon: { file: 'lorc/bandaged',          alt: 'lorc/scalpel'             },
    general:      { file: 'lorc/rank-3',             alt: 'lorc/tattered-banner'            },
    shaman:       { file: 'lorc/crowned-skull',        alt: 'lorc/totem-head'          },
  },

  // ════════════════════════════════════════
  //  QUEST TYPES
  //  Used on quest selection cards
  // ════════════════════════════════════════

  quests: {
    dungeon:      { file: 'lorc/crossed-swords',       alt: 'lorc/crystal-ball'       },
    rescue:       { file: 'lorc/imprisoned',         alt: 'lorc/imprisoned'              },
    treasure:     { file: 'lorc/treasure-map',       alt: 'lorc/locked-chest' },
    pirates:      { file: 'lorc/skull-bolt',       alt: 'lorc/pirate-grave'         },
    space:        { file: 'lorc/rocket',             alt: 'lorc/ringed-planet'       },
    spaceMystery: { file: 'lorc/space-suit',         alt: 'lorc/alien-skull'                 },
    wildwest:     { file: 'lorc/crossed-pistols',        alt: 'lorc/top-hat'          },
    dreamworld:   { file: 'lorc/moon',               alt: 'lorc/spiral-bloom'       },
    haunted:      { file: 'lorc/haunting',      alt: 'lorc/ghost'               },
    gladiator:    { file: 'lorc/spartan',          alt: 'lorc/laurel-crown'          },
    wasteland:    { file: 'lorc/biohazard',            alt: 'lorc/radioactive'         },
    cybercity:    { file: 'lorc/circuitry',            alt: 'lorc/magnifying-glass'                },
    olympus:      { file: 'lorc/zeus-sword',         alt: 'lorc/zeus-sword'             },
    fairytale:    { file: 'lorc/fairy-wand',         alt: 'lorc/fairy-wand'          },
    shogun:       { file: 'lorc/magic-gate',         alt: 'lorc/broadsword'              },
    custom:       { file: 'lorc/quill',             alt: 'lorc/quill'               },
  },

  // ════════════════════════════════════════
  //  COMBAT & ACTIONS
  //  Used in combat banner, action chips,
  //  and story event cards
  // ════════════════════════════════════════

  combat: {
    attack:       { file: 'lorc/crossed-swords'                                       },
    defend:       { file: 'lorc/broadsword'                                               },
    magic:        { file: 'lorc/magic-swirl'                                          },
    shoot:        { file: 'lorc/arrow-flights'                                        },
    flee:         { file: 'lorc/sprint'                                               },
    stealth:      { file: 'lorc/domino-mask'                                     },
    heal:         { file: 'lorc/fluffy-trefoil'                                        },
    critHit:      { file: 'lorc/sword-clash'                                          },
    fumble:       { file: 'lorc/cracked-saber'                                         },
    assess:       { file: 'lorc/magnifying-glass'                                     },
    diceD20:      { file: 'lorc/crenulated-shield'                             },
    diceD6:       { file: 'lorc/broadsword'                                   },
    diceD4:       { file: 'lorc/broadsword'                                 },
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
    bloodied:     { file: 'lorc/drop'                                      },
    critical:     { file: 'lorc/bleeding-heart'                                       },
    dead:         { file: 'lorc/broken-skull'                                                },
    poisoned:     { file: 'lorc/broadsword'                                               },
    cursed:       { file: 'lorc/black-flag'                                           },
    buffed:       { file: 'lorc/flat-star'                                          },
    shielded:     { file: 'lorc/broadsword'                                               },
  },

  // ════════════════════════════════════════
  //  STATS / CHARACTER SHEET
  //  Used on character sheet overlay
  // ════════════════════════════════════════

  stats: {
    strength:     { file: 'lorc/muscle-up'                                            },
    dexterity:    { file: 'lorc/sprint'                                               },
    intelligence: { file: 'lorc/brain'                                                },
    wisdom:       { file: 'lorc/third-eye'                                                  },
    constitution: { file: 'lorc/broadsword'                                               },
    hp:           { file: 'lorc/fluffy-trefoil'                                        },
    xp:           { file: 'lorc/broadsword'                                              },
    level:        { file: 'lorc/rank-1'                                               },
    gold:         { file: 'lorc/gold-shell'                                             },
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
    shield:       { file: 'lorc/broadsword'                                               },
    armor:        { file: 'lorc/breastplate'                                          },
    helmet:       { file: 'lorc/barbute'                                              },
    potion:       { file: 'lorc/potion-ball'                                               },
    potionHealth: { file: 'lorc/potion-ball'                                        },
    potionMana:   { file: 'lorc/potion-ball'                                         },
    key:          { file: 'lorc/key'                                                  },
    map:          { file: 'lorc/treasure-map'                                         },
    chest:        { file: 'lorc/locked-chest'                                  },
    torch:        { file: 'lorc/campfire'                                                },
    rope:         { file: 'lorc/broadsword'                                            },
    food:         { file: 'lorc/food-chain'                                                 },
    gold:         { file: 'lorc/gold-shell'                                             },
    scroll:       { file: 'lorc/scroll-unfurled'                                      },
    book:         { file: 'lorc/open-book'                                           },
    amulet:       { file: 'lorc/gem-pendant'                                             },
    ring:         { file: 'lorc/gem-pendant'                                                 },
    cloak:        { file: 'lorc/robe'                                                 },
    bomb:         { file: 'lorc/mine-explosion'                                       },
    gun:          { file: 'lorc/crossed-pistols'                                             },
    // Sci-fi
    blaster:      { file: 'lorc/ray-gun'                                              },
    medKit:       { file: 'lorc/bandaged'                                            },
    dataChip:     { file: 'lorc/microchip'                                         },
    spacesuit:    { file: 'lorc/space-suit'                                           },
  },

  // ════════════════════════════════════════
  //  JOURNAL & UI
  //  Used in journal overlay, sidebar,
  //  and action buttons
  // ════════════════════════════════════════

  ui: {
    journal:      { file: 'lorc/open-book'                                            },
    quest:        { file: 'lorc/quill'                                         },
    npc:          { file: 'lorc/conversation'                                         },
    bestiary:     { file: 'lorc/werewolf'                                       },
    codex:        { file: 'lorc/open-book'                                            },
    save:         { file: 'lorc/swap-bag'                                          },
    settings:     { file: 'lorc/cog'                                                  },
    search:       { file: 'lorc/magnifying-glass'                                     },
    export:       { file: 'lorc/paper-arrow'                                          },
    recap:        { file: 'lorc/magnifying-glass'                                           },
    music:        { file: 'lorc/music-spell'                                          },
    cloud:        { file: 'lorc/anchor'                                         },
    newGame:      { file: 'lorc/clockwork'                                            },
    debug:        { file: 'lorc/scorpion'                                                  },
    milestone:    { file: 'lorc/broadsword'                                          },
    levelUp:      { file: 'lorc/broadsword'                                              },
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
    troll:        { file: 'lorc/shiny-entrance'                                        },
    demon:        { file: 'lorc/crowned-skull'                                          },
    vampire:      { file: 'lorc/ghost'                                      },
    wolf:         { file: 'lorc/wolf-head'                                            },
    spider:       { file: 'lorc/rock'                                          },
    alien:        { file: 'lorc/alien-skull'                                          },
    robot:        { file: 'lorc/android-mask'                                         },
    kraken:       { file: 'lorc/octoman'                                              },
    rat:          { file: 'lorc/plain-dagger'                                                  },
    bat:          { file: 'lorc/ghost'                                                  },
    slime:        { file: 'lorc/acid-blob'                                                },
    golem:        { file: 'lorc/stone-block'                                          },
    lich:         { file: 'lorc/skull-mask'                                                 },
    bandit:       { file: 'lorc/hood'                                                 },
    mummy:        { file: 'lorc/coffin'                                           },
    yeti:         { file: 'lorc/beast-eye'                                   },
    fairy:        { file: 'lorc/fairy-wand'                                                },
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
    underwater:   { file: 'lorc/angler-fish'                                         },
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
