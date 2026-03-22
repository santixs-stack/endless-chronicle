// ═══════════════════════════════════════════
//  STARTING GEAR
//  Genre × archetype starting inventory.
//  Each entry is an array of item strings.
//  Used to seed sharedInventory at game start.
//  Also defines genre-aware special abilities
//  that override the generic DnD class specials.
// ═══════════════════════════════════════════

// ── Starting inventory by genre × classId ─────────────────────────────────
// Items are simple strings shown in the sidebar.
export const STARTING_GEAR = {
  // ── Fantasy ────────────────────────────────────────────────────────────
  fantasy: {
    warrior:    ['Iron sword', 'Shield', 'Chain mail', 'Healing potion'],
    mage:       ['Spellbook', 'Arcane focus (crystal)', 'Ink & quill', 'Mana potion'],
    rogue:      ['Daggers (×2)', 'Lockpicks', 'Dark cloak', 'Smoke bomb'],
    ranger:     ['Shortbow', 'Arrows (×20)', 'Hunting knife', 'Rope (30ft)'],
    healer:     ['Holy symbol', 'Healing herbs', 'Bandages', 'Prayer beads'],
    bard:       ['Lute', 'Charming smile', 'Disguise kit', '5 gold coins'],
    spaceranger:['Staff', 'Tome of mysteries', 'Compass', 'Tinderbox'],
    pirate:     ['Cutlass', 'Flintlock pistol', 'Compass', 'Rum flask'],
  },
  // ── Space ───────────────────────────────────────────────────────────────
  space: {
    warrior:    ['Plasma rifle', 'Combat armor', 'Stim pack', 'Grenade (×2)'],
    mage:       ['Omni-tool', 'Data pad', 'EMP device', 'Neural interface'],
    rogue:      ['Stealth suit', 'Hacking kit', 'Vibroknife', 'Fake ID chip'],
    ranger:     ['Long-range scanner', 'Sniper module', 'Jet pack (partial)', 'Rations (×3)'],
    healer:     ['MedKit', 'Stim injector', 'Bone-knitter', 'Antitox supply'],
    bard:       ['Holographic projector', 'Universal translator', 'Bribery fund', 'Fake credentials'],
    spaceranger:['Multi-tool', 'Personal shield', 'Comm beacon', 'Warp flare (×2)'],
    pirate:     ['Boarding axe', 'Grappling hook launcher', 'Space compass', 'Stolen ID'],
  },
  // ── Ocean ───────────────────────────────────────────────────────────────
  ocean: {
    warrior:    ['Boarding cutlass', 'Buckler', 'Sailor\'s knife', 'Rope (50ft)'],
    mage:       ['Tide-caller staff', 'Sea charts', 'Bottled storm', 'Compass'],
    rogue:      ['Daggers (×2)', 'Grappling hook', 'Waterproof satchel', 'Fake papers'],
    ranger:     ['Crossbow', 'Bolts (×15)', 'Spyglass', 'Navigation charts'],
    healer:     ['Ship surgeon\'s kit', 'Rum (medicinal)', 'Seaweed poultices', 'Needle & thread'],
    bard:       ['Squeeze box', 'Sea shanty book', 'Charm bracelet', '10 gold doubloons'],
    spaceranger:['Naval compass', 'Signal lantern', 'Star charts', 'Rope ladder'],
    pirate:     ['Flintlock pistol (×2)', 'Treasure map (partial)', 'Pirate flag', 'Rum cask'],
  },
  // ── Horror ──────────────────────────────────────────────────────────────
  horror: {
    warrior:    ['Blessed silver blade', 'Torch', 'Garlic braid', 'Iron crucifix'],
    mage:       ['Occult grimoire', 'Divination cards', 'Salt pouch', 'Black candles (×3)'],
    rogue:      ['Stiletto', 'Lockpicks', 'Dark lantern', 'Smelling salts'],
    ranger:     ['Crossbow', 'Silver-tipped bolts (×10)', 'Hunting trap', 'Monster bestiary'],
    healer:     ['Holy water (×3)', 'Medicinal kit', 'Blessed bandages', 'Antidote vials'],
    bard:       ['Violin (unnerving)', 'Hypnotic pocket watch', 'Stage makeup', 'Newspaper clippings'],
    spaceranger:['Spirit detector', 'Ritual components', 'Gas lamp', 'Notebook of lore'],
    pirate:     ['Cursed cutlass', 'Ghost compass', 'Rum (lots)', 'Haunted map'],
  },
  // ── Western ─────────────────────────────────────────────────────────────
  western: {
    warrior:    ['Revolver (×6 shots)', 'Bowie knife', 'Leather duster', 'Bandana'],
    mage:       ['Medicine bag', 'Tribal fetish', 'Herbs & tonics', 'Carved bone runes'],
    rogue:      ['Derringer pistol', 'Card deck (marked)', 'Wanted poster (yours)', 'Boot knife'],
    ranger:     ['Repeating rifle', 'Spyglass', 'Trail rations', 'Lasso'],
    healer:     ['Frontier doctor\'s bag', 'Whiskey (medicinal)', 'Suture kit', 'Laudanum'],
    bard:       ['Harmonica', 'Snake oil (×3)', 'Silver tongue', '$10 in coin'],
    spaceranger:['Colt Peacemaker', 'Sheriff\'s star', 'Wanted posters', 'Trail map'],
    pirate:     ['Sawed-off shotgun', 'Dynamite (×2)', 'Saddle bags', 'Gold nugget'],
  },
  // ── Post-Apocalyptic ────────────────────────────────────────────────────
  postapoc: {
    warrior:    ['Pipe rifle', 'Metal armor (scavenged)', 'Combat knife', 'RadAway'],
    mage:       ['Geiger counter', 'Mutagen vials', 'Technical manual', 'Scrap parts'],
    rogue:      ['Silenced pistol', 'Wire cutters', 'Gas mask', 'Scavenged rations'],
    ranger:     ['Hunting rifle', 'Binoculars', 'Wasteland map', 'Survival kit'],
    healer:     ['Field medic bag', 'Stimpaks (×3)', 'Radiation pills', 'Antibiotics'],
    bard:       ['Pre-war radio', 'Barter goods', 'Smooth talk', 'Old world currency'],
    spaceranger:['Energy pistol', 'Power armor (partial)', 'Toolkit', 'Fusion cell (×2)'],
    pirate:     ['Shotgun', 'Scrap shield', 'Raider flag', 'Explosives (×2)'],
  },
  // ── Cyberpunk ───────────────────────────────────────────────────────────
  cyberpunk: {
    warrior:    ['Mono-sword', 'Subdermal armor', 'Stim injector', 'Tactical visor'],
    mage:       ['Cyberdeck (custom)', 'Neural jack', 'ICE-breaker program', 'Data shard'],
    rogue:      ['Smart pistol', 'ID spoofer', 'Hacking gloves', 'Fake SIN card'],
    ranger:     ['Surveillance drone', 'Sniper laser', 'Thermal goggles', 'Earpiece comms'],
    healer:     ['Med-scanner', 'Nanobot injector', 'Ripperdoc tools', 'Pain-killers'],
    bard:       ['Corporate badge (stolen)', 'Social engineering notes', 'Voice modulator', '₩2000 in eurodollars'],
    spaceranger:['Assault rifle', 'Combat implant', 'Grapple launcher', 'EMP grenade'],
    pirate:     ['Auto pistol (×2)', 'Armored jacket', 'Stolen corp keycard', 'Holo-mask'],
  },
  // ── Mythology ───────────────────────────────────────────────────────────
  mythology: {
    warrior:    ['Blessed spear', 'Divine shield', 'Hero\'s mantle', 'Ambrosia (×1)'],
    mage:       ['Prophecy scroll', 'Divining bowl', 'Sacred herbs', 'Oracle\'s coin'],
    rogue:      ['Hermes\' sandals', 'Invisibility charm', 'Thieves\' tools', 'Smoke oracle'],
    ranger:     ['Silver bow', 'Enchanted arrows (×12)', 'Sacred hunting horn', 'Trophy pelt'],
    healer:     ['Healing salve (divine)', 'Ichor vial', 'Serpent staff', 'Prayer scroll'],
    bard:       ['Golden lyre', 'Silver tongue', 'Wine skin (divine)', 'Laurel wreath'],
    spaceranger:['Thunder javelin', 'Aegis fragment', 'Titan\'s blood vial', 'Star chart'],
    pirate:     ['Triton\'s trident', 'Sea-god\'s compass', 'Siren\'s shell', 'Storm bottle'],
  },
  // ── Fairy Tale ──────────────────────────────────────────────────────────
  fairytale: {
    warrior:    ['Enchanted sword', 'Knight\'s crest', 'Dragon-scale armor', 'Lucky horseshoe'],
    mage:       ['Magic wand', 'Grimoire of wishes', 'Enchanted mirror', 'Glowing potion'],
    rogue:      ['Magic beans (×3)', 'Invisibility cloak', 'Thief\'s lockpicks', 'Bag of tricks'],
    ranger:     ['Enchanted bow', 'Arrows that never miss', 'Woodland map', 'Wolf whistle'],
    healer:     ['Healing berries', 'Forest elder\'s recipe', 'Glowing salve', 'Blessing charm'],
    bard:       ['Enchanted flute', 'Story book (rewriting itself)', 'Fairy dust', '7 gold coins'],
    spaceranger:['Wishing star fragment', 'Spell compendium', 'Crystal ball', 'Magic rope'],
    pirate:     ['Cursed gold coin', 'Siren\'s locket', 'Treasure map', 'Captain\'s hat'],
  },
  // ── Ninja / Samurai ─────────────────────────────────────────────────────
  ninja: {
    warrior:    ['Katana (ancestral)', 'Wakizashi', 'Samurai armor (do)', 'Honor blade'],
    mage:       ['Ofuda charms (×5)', 'Spirit scroll', 'Incense sticks', 'Oracle beads'],
    rogue:      ['Shuriken (×8)', 'Smoke bombs (×3)', 'Shinobi shozoku', 'Grappling hook'],
    ranger:     ['Yumi bow', 'Armor-piercing arrows (×12)', 'Spyglass', 'Rope ladder'],
    healer:     ['Herbal medicine kit', 'Acupuncture needles', 'Medicinal sake', 'Bandages'],
    bard:       ['Shamisen', 'Geisha makeup', 'Fan (concealed blade)', '5 silver mon'],
    spaceranger:['Ninjato', 'Kusarigama', 'Climbing claws', 'Flash powder (×3)'],
    pirate:     ['Twin wakizashi', 'Pirate flag (rising sun)', 'Sea map', 'Sake barrel'],
  },
  // ── Historical ──────────────────────────────────────────────────────────
  historical: {
    warrior:    ['Gladius sword', 'Scutum shield', 'Lorica segmentata', 'Field rations'],
    mage:       ['Alchemist\'s kit', 'Experimental tinctures (×3)', 'Research notes', 'Scale & mortar'],
    rogue:      ['Stiletto knife', 'Forged documents', 'Disguise materials', 'Bribery fund'],
    ranger:     ['Recurve bow', 'Quiver (×20)', 'Surveying tools', 'Terrain map'],
    healer:     ['Surgeon\'s tools', 'Wound salve', 'Medicinal wine', 'Clean linens'],
    bard:       ['Lute', 'Royal seal (forged)', 'Charm & wit', '15 silver coins'],
    spaceranger:['Engineer\'s tools', 'Blueprint scrolls', 'Measuring instruments', 'Gunpowder (×2)'],
    pirate:     ['Boarding pike', 'Flintlock pistol', 'Treasure map', 'Rum cask'],
  },
};

// ── Genre-aware special abilities ──────────────────────────────────────────
// Overrides the generic DnD class special for genre-specific archetypes.
// Key: `${genre}/${classId}` or just `${classId}` for universal override.
// Falls back to classes.js special if not found.
export const ARCHETYPE_SPECIALS = {
  // ── Cyberpunk ─────────────────────────────────────────────────────────
  'cyberpunk/mage':       'Jack In — breach any system, device, or mind; once per scene extract or plant any data',
  'cyberpunk/warrior':    'Reflex Boost — chrome-enhanced speed; dodge one attack completely or land a guaranteed hit',
  'cyberpunk/rogue':      'Ghost Protocol — vanish from all cameras and sensors for one scene',
  'cyberpunk/spaceranger':'Drone Strike — deploy surveillance or attack drone anywhere in range',
  'cyberpunk/healer':     'Emergency Rig — instantly stabilize anyone; can install a temporary implant mid-combat',
  'cyberpunk/bard':       'Social Hack — impersonate anyone convincingly; access any secure area once',
  'cyberpunk/ranger':     'Overwatch — your drone spots everything; allies get +5 to one action you call out',
  'cyberpunk/pirate':     'Corporate Raid — steal any corp asset; no system can lock you out twice',

  // ── Western ───────────────────────────────────────────────────────────
  'western/warrior':      'Quick Draw — always act first; draw and fire before anyone can react',
  'western/mage':         'Spirit Vision — commune with ancestors for guidance; see one truth hidden from others',
  'western/rogue':        'Cheat the House — always find a hidden advantage; nothing is ever as stacked as it looks',
  'western/ranger':       'Dead Eye — one guaranteed perfect shot, any range, any conditions',
  'western/healer':       'Field Stitch — patch any wound with what\'s on hand; remove one negative condition instantly',
  'western/bard':         'Silver Tongue — talk anyone out of a fight before it starts; make any deal sound fair',
  'western/spaceranger':  'Lawman\'s Authority — flash the badge; any lawful person stands down once',
  'western/pirate':       'Dynamite Bluff — make any threat credible; enemies always believe you\'ll do it',

  // ── Ninja / Samurai ───────────────────────────────────────────────────
  'ninja/warrior':        'Iaijutsu — one perfect sword strike that ends a conflict; draw, cut, sheath in one breath',
  'ninja/mage':           'Spirit Communion — bind or banish any supernatural entity; speak with the dead once per rest',
  'ninja/rogue':          'Phantom Step — move through any obstacle unseen; once per scene appear behind any target',
  'ninja/ranger':         'Shadow Infiltration — infiltrate any location without triggering any alarm or guard',
  'ninja/healer':         'Ki Restoration — channel life force to fully restore one ally or cure any poison/curse',
  'ninja/bard':           'Thousand Faces — wear any identity perfectly; never broken even under interrogation',
  'ninja/spaceranger':    'Pressure Point — disable any creature instantly with one precise strike',
  'ninja/pirate':         'Tide Strike — attack all enemies at once; your blade is everywhere in the same moment',

  // ── Post-Apocalyptic ─────────────────────────────────────────────────
  'postapoc/warrior':     'Rampage — push through any damage and keep fighting at full strength for one scene',
  'postapoc/mage':        'Mutation Surge — your radiation gift activates fully; gain one impossible ability for a scene',
  'postapoc/rogue':       'Wasteland Ghost — disappear completely into the ruins; no one can track you',
  'postapoc/ranger':      'Survivor\'s Instinct — always sense ambushes; never caught off guard or surprised',
  'postapoc/healer':      'Cobbled Cure — improvise medicine from anything; no materials needed, one miracle per scene',
  'postapoc/bard':        'Pre-War Charm — any faction trusts you at first meeting; broker peace between enemies once',
  'postapoc/spaceranger': 'Power Cell — recharge or repair any tech device; bring dead machines back to life once',
  'postapoc/pirate':      'Warlord\'s Claim — take over any situation through sheer force of presence; crew size doubles',

  // ── Space ─────────────────────────────────────────────────────────────
  'space/warrior':        'Combat Protocol — activate battle mode; for one scene nothing can stop you reaching your target',
  'space/mage':           'System Override — hack any ship, station, or network in seconds; no ICE can stop you',
  'space/rogue':          'Ghost Ship — your signal disappears from all sensors; pursue or flee anything in space',
  'space/ranger':         'Long Shot — your scanner locks on across any distance; the shot never misses',
  'space/healer':         'Emergency Nanobots — stabilize anyone from death\'s door; restore full function in seconds',
  'space/bard':           'Galactic Rep — your name opens doors across six systems; any faction gives you one favor',
  'space/spaceranger':    'Gadget — pull out exactly the right piece of tech for any impossible situation',
  'space/pirate':         'Pirate Broadcast — commandeer any ship\'s systems; fly anything, anywhere, any time',

  // ── Ocean ─────────────────────────────────────────────────────────────
  'ocean/warrior':        'Boarding Action — lead a charge onto any vessel; enemies rout before you land',
  'ocean/mage':           'Call the Storm — summon or dismiss weather at will; the sea obeys your command',
  'ocean/rogue':          'Phantom Ship — your vessel is invisible at night; no one sees you coming or going',
  'ocean/ranger':         'True North — always know your exact position; never lost at sea, ever',
  'ocean/healer':         'Sea Remedy — the ocean provides; cure any illness with tidal water and ship\'s stores',
  'ocean/bard':           'Captain\'s Charisma — any crew follows you into any storm; morale never breaks',
  'ocean/spaceranger':    'Navigator\'s Gift — plot any course through any danger; arrive exactly on time',
  'ocean/pirate':         'Fearless — challenge anyone to any contest and they always accept',

  // ── Horror ────────────────────────────────────────────────────────────
  'horror/warrior':       'Monster Hunter — you know the weakness of every creature; one guaranteed vulnerable strike',
  'horror/mage':          'Dark Pact — call on forbidden power; the cost comes later; the result is now',
  'horror/rogue':         'Shadow Meld — the darkness hides you completely; even supernatural senses lose your trail',
  'horror/ranger':        'Sense Evil — detect any supernatural presence, its nature, and its weakness',
  'horror/healer':        'Last Rites — bring back anyone who died in this scene once; they owe you something',
  'horror/bard':          'False Calm — make any horror hesitate with performance; buy your party time to escape',
  'horror/spaceranger':   'Occult Analysis — identify any curse, spirit, or dark artifact and how to destroy it',
  'horror/pirate':        'Death\'s Gamble — cheat fate itself once; reroll any catastrophic outcome',

  // ── Mythology ─────────────────────────────────────────────────────────
  'mythology/warrior':    'Divine Blood — call on divine heritage; perform one feat no mortal could manage',
  'mythology/mage':       'True Prophecy — see one event as it will certainly happen; change it if you dare',
  'mythology/rogue':      'Trickster\'s Escape — you can never be truly trapped; fate bends to let you out',
  'mythology/ranger':     'Sacred Hunt — your quarry can never hide; you will find what you seek',
  'mythology/healer':     'Divine Mercy — restore the dead to life once; the gods notice',
  'mythology/bard':       'Orphic Song — your music affects gods and monsters alike; all must pause and listen',
  'mythology/spaceranger':'Titan\'s Strength — briefly channel ancient power; feats of impossible strength',
  'mythology/pirate':     'Sea God\'s Favor — the ocean protects you; survive any nautical disaster',

  // ── Fairy Tale ────────────────────────────────────────────────────────
  'fairytale/warrior':    'True Knight\'s Vow — swear to protect someone; nothing can harm them while you stand',
  'fairytale/mage':       'Wish — grant one true wish; the world bends; consequences follow',
  'fairytale/rogue':      'Magic Beans — trade anything for something magical; the bargain always surprises you',
  'fairytale/ranger':     'Animal Parliament — every creature in the forest helps you with one task',
  'fairytale/healer':     'True Love\'s Cure — heal any curse, illness, or broken heart with pure intent',
  'fairytale/bard':       'Enchanting Tale — tell a story so compelling everyone forgets to be your enemy',
  'fairytale/spaceranger':'Fairy Godmother — once per story, transform something hopeless into something perfect',
  'fairytale/pirate':     'Cursed Gold — any treasure you claim comes with a twist; sometimes that twist helps',

  // ── Historical ────────────────────────────────────────────────────────
  'historical/warrior':   'Shield Wall — rally allies into formation; your unit is immovable for one engagement',
  'historical/mage':      'Eureka — have a breakthrough insight about any problem; invent the solution on the spot',
  'historical/rogue':     'Double Agent — you\'re trusted by both sides; use that trust once to change history',
  'historical/ranger':    'Terrain Master — turn any landscape into an advantage; choose the perfect ground',
  'historical/healer':    'Triage — keep the entire party functional through a battle; no one dies on your watch',
  'historical/bard':      'Rhetoric — your speech moves armies; once per session, change someone\'s deeply held belief',
  'historical/spaceranger':'Engineer\'s Genius — improvise any siege weapon, bridge, or fortification from local materials',
  'historical/pirate':    'Boarding Veteran — any nautical combat; you\'ve seen every trick and counter every one',
};

// ── Get starting gear for a player ─────────────────────────────────────────
export function getStartingGear(genre, classId) {
  const genreGear = STARTING_GEAR[genre] || STARTING_GEAR.fantasy;
  return [...(genreGear[classId] || genreGear.warrior || [])];
}

// ── Get special ability for a player ───────────────────────────────────────
export function getSpecial(genre, classId, fallback) {
  return ARCHETYPE_SPECIALS[`${genre}/${classId}`] || fallback;
}
