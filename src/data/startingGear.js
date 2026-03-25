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
  pirate: {
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
  'pirate/warrior':        'Boarding Action — lead a charge onto any vessel; enemies rout before you land',
  'pirate/mage':           'Call the Storm — summon or dismiss weather at will; the sea obeys your command',
  'pirate/rogue':          'Phantom Ship — your vessel is invisible at night; no one sees you coming or going',
  'pirate/ranger':         'True North — always know your exact position; never lost at sea, ever',
  'pirate/healer':         'Sea Remedy — the ocean provides; cure any illness with tidal water and ship\'s stores',
  'pirate/bard':           'Captain\'s Charisma — any crew follows you into any storm; morale never breaks',
  'pirate/spaceranger':    'Navigator\'s Gift — plot any course through any danger; arrive exactly on time',
  'pirate/pirate':         'Fearless — challenge anyone to any contest and they always accept',

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

// ── Item descriptions for inventory tooltips ───────────────────────────────
// Key matches item name exactly (case-insensitive match in getItemDesc)
export const ITEM_DESCRIPTIONS = {
  // ── Cyberpunk ────────────────────────────────────────────────
  'Cyberdeck (custom)':   'Your personal hacking rig. Jack in to breach ICE, steal data, or puppet enemy systems.',
  'Neural jack':          'Direct brain-to-machine interface. Lets you control any networked device with a thought.',
  'ICE-breaker program':  'Aggressive intrusion software. Cracks through corporate security walls in seconds.',
  'Data shard':           'Encrypted storage chip. Contains stolen intel — worth fortunes to the right buyer.',
  'Mono-sword':           'Monomolecular edge. Cuts through armor like paper. Maintenance is expensive.',
  'Subdermal armor':      'Kevlar woven under your skin. Reduces blunt trauma and blade damage.',
  'Stim injector':        'Combat stimulant auto-injector. Ignore pain and keep moving for 10 minutes.',
  'Tactical visor':       'AR overlay. Tags threats, highlights weak points, and reads biometrics at a glance.',
  'Smart pistol':         'Auto-tracks targets within 30m. Useless without its licensed ammo — which you have.',
  'ID spoofer':           'Makes any scanner see a different person. Takes 10 seconds to configure.',
  'Hacking gloves':       'Conductive mesh fingertips. Physical contact with any terminal bypasses login screens.',
  'Fake SIN card':        'Cloned System ID. Legal-looking on a quick scan. Won\'t survive deep investigation.',
  'Med-scanner':          'Diagnoses injury and illness in seconds. Tells you what drugs the patient needs.',
  'Nanobot injector':     'Microscopic repair bots. Close wounds, scrub toxins, restore 1d6 HP when injected.',
  'Ripperdoc tools':      'Surgery kit for installing or removing cyberware. Don\'t use it on yourself.',
  'Pain-killers':         '3 doses. Each removes the penalty from one injury for 2 hours. Addictive.',
  'Corporate badge (stolen)': 'Mid-level Arasaka badge. Opens standard secure doors. Probably already flagged.',
  'Voice modulator':      'Scrambles your voice print in real-time. Sounds like whoever you program in.',
  '₩2000 in eurodollars': 'Street cash. No serial numbers, no trail. Enough to bribe a low-level corp goon.',
  'Surveillance drone':   'Thumb-sized flyer. 1hr battery. Streams video to your visor from up to 500m.',
  'Sniper laser':         'Pinpoint energy rifle. Silent. Melts through light cover. Recharge takes 30 seconds.',
  'Thermal goggles':      'Sees heat signatures through walls up to 20cm thick. Works in total darkness.',
  'Earpiece comms':       'Encrypted short-range radio. Lets you coordinate with your crew without speaking.',
  // ── Fantasy ──────────────────────────────────────────────────
  'Iron sword':           'Reliable one-handed blade. Not enchanted — but it doesn\'t need to be.',
  'Shield':               'Battered but solid. Stops sword blows and adds +2 to defense rolls.',
  'Chain mail':           'Heavy but effective. Reduces incoming physical damage by 3.',
  'Healing potion':       'One drink restores 1d8+2 HP. Tastes of copper and wildflowers.',
  'Spellbook':            'Contains 8 known spells and blank pages for 4 more. Written in your own cipher.',
  'Arcane focus (crystal)': 'Channels magical energy more efficiently. Spells cost less effort to cast.',
  'Ink & quill':          'For copying spells and recording lore. The quill never runs dry.',
  'Mana potion':          'Restores the energy for one complex spell. Smells faintly of lightning.',
  'Daggers (×2)':         'Throwing or close-quarters. One for your belt, one hidden in your boot.',
  'Lockpicks':            'A full set. +3 to picking any mechanical lock. Illegal in three kingdoms.',
  'Dark cloak':           '+2 to stealth in dim light. The hood casts deep shadows over your face.',
  'Smoke bomb':           'Fills a 10ft area with thick smoke for 3 rounds. Everyone inside is blinded.',
  'Smoke bombs (×3)':     'Three smoke bombs. Fill 10ft areas with thick smoke for 3 rounds each.',
  'Shortbow':             'Reliable ranged weapon. Effective to 80ft. Silent.',
  'Arrows (×20)':         '20 standard arrows. Enough for most fights without rationing.',
  'Hunting knife':        'Multi-purpose blade. Skinning, climbing, or a last-resort weapon.',
  'Rope (30ft)':          '30 feet of braided hempen rope. Supports 400lbs. Always useful.',
  'Rope (50ft)':          '50 feet of rope. Climbing, binding, rigging — the adventurer\'s best friend.',
  'Holy symbol':          'Your divine focus. Required for channeling divine magic. Glows faintly when evil is near.',
  'Healing herbs':        '5 uses. Each use lets you restore 1d4 HP when applied during a short rest.',
  'Bandages':             '6 uses. Stop bleeding and stabilize a dying character to 1 HP.',
  'Prayer beads':         'Enhances concentration. +1 to all Wisdom checks while held.',
  'Lute':                 'Well-tuned traveling instrument. Useful for performing, bribing, and soothing beasts.',
  'Disguise kit':         '3 uses. Changes apparent age, hair, face. Fools casual observers.',
  // ── Western ──────────────────────────────────────────────────
  'Revolver (×6 shots)':  'Colt Single Action. 6 shots before reload. Accurate to 50ft.',
  'Bowie knife':          'Long-bladed all-purpose frontier knife. Excellent for close work.',
  'Leather duster':       'Long coat. Protects from wind, rain, and glancing blows. Iconic.',
  'Bandana':              'Face cover. Filter dust, hide identity, signal allies.',
  'Medicine bag':         'Traditional healing pouch. 4 uses, each restoring 1d6+1 HP using herbs and ceremony.',
  'Tribal fetish':        'Spirit focus. +2 to any check involving the supernatural or spirit world.',
  'Herbs & tonics':       '3 tonic vials. Each cures one common ailment or grants +1 to Constitution for 1 hour.',
  'Carved bone runes':    'Divination tools. Once per day, ask one yes/no question about the immediate future.',
  'Derringer pistol':     'Tiny 2-shot holdout pistol. Concealable in a sleeve or boot.',
  'Card deck (marked)':   'Subtly marked deck. +3 to any card-based gambling check.',
  'Wanted poster (yours)':'Your own wanted poster. Reminds people you\'re not to be trifled with.',
  'Boot knife':           'Concealed single-edge blade. Never spotted in a pat-down.',
  'Repeating rifle':      'Lever-action. 7 shots before reload. Accurate to 200ft.',
  'Spyglass':             'Extends vision to 600ft. Useful for surveillance and scouting.',
  'Trail rations':        '3 days of jerky, hardtack, and dried fruit. No cooking required.',
  'Lasso':                '40ft braided lasso. Catch animals, trip enemies, or anchor a rope swing.',
  'Frontier doctor\'s bag': 'Full medical kit. Restores 2d6 HP with 10 minutes of treatment.',
  'Whiskey (medicinal)':  'It\'s mostly medicinal. Sterilizes wounds and soothes pain. 4 doses.',
  'Suture kit':           'Needle and thread for closing wounds. Required for serious injuries.',
  'Laudanum':             '3 doses. Kills pain completely for 2 hours. Highly addictive.',
  'Harmonica':            'Small instrument. Doesn\'t take up hands. Soothes animals and lonely cowboys.',
  'Snake oil (×3)':       'You know what it does. So do they. They buy it anyway.',
  '$10 in coin':          'Coin of the realm. Pays for lodging, information, or a bribe.',
  'Sawed-off shotgun':    '2-shot. Devastating at close range. Illegal in most townships.',
  'Dynamite (×2)':        'Two sticks. Fuse lit by match. 30-second delay. Destroys 10ft radius.',
  // ── Space ─────────────────────────────────────────────────────
  'Plasma rifle':         'Standard-issue energy weapon. 20 shots per cell. Burns through light armor.',
  'Combat armor':         'Ablative plates and trauma gel. Reduces incoming damage by 4.',
  'Stim pack':            'Medical auto-injector. Restores 2d6+3 HP instantly in field conditions.',
  'Grenade (×2)':         '2 frag grenades. 15ft blast radius. 4d6 damage. Safety pin included.',
  'Omni-tool':            'Multifunctional wrist device. Hacking, scanning, construction — does it all.',
  'Data pad':             'Tablet computer with access to 3 secured databases. Battery: 8 hours.',
  'EMP device':           'Single-use pulse. Disables all electronics in 20ft radius for 1 minute.',
  'Neural interface':     'Allows direct mental connection to any compatible system.',
  'Stealth suit':         'Light-bending fiber. +4 to stealth. Doesn\'t work while moving fast.',
  'Hacking kit':          'Portable intrusion hardware. Bypasses most electronic locks in 30 seconds.',
  'Vibroknife':           'Vibrating molecular edge. Cuts through most materials. +2 damage.',
  'Fake ID chip':         'Subcutaneous identity chip. Fools basic biometric scanners.',
  'Long-range scanner':   'Detects life signs, energy weapons, and ships at up to 2km.',
  'Sniper module':        'Weapon attachment. Doubles effective range of any ranged weapon.',
  'Jet pack (partial)':   'Working but low on fuel. Good for 3 short bursts or one long flight.',
  'Rations (×3)':         '3 nutrient packs. Tasteless, complete, 2000 calories each.',
  'MedKit':               'Full trauma kit. Stabilizes, diagnoses, and treats. 5 uses.',
  'Stim injector':        'Auto-doses stimulants. Keep fighting past normal limits. Side effects later.',
  'Bone-knitter':         'Ultrasound device. Mends fractures in 10 minutes. Can\'t use while in combat.',
  'Antitox supply':       '4 doses. Neutralizes any poison or venom within 1 round.',
  'Holographic projector':'Projects lifelike 3D images. 10 minute battery. Fools visual sensors.',
  'Universal translator': 'Translates any known language in real-time. 98.7% accuracy.',
  'Bribery fund':         'Untraceable credits loaded onto a disposable chip. No questions asked.',
  'Fake credentials':     'Forged diplomatic or corporate ID. Won\'t survive deep biometric scan.',
  'Multi-tool':           'Swiss army knife for the 27th century. 40+ functions.',
  'Personal shield':      'Belt-mounted energy barrier. Absorbs first 10 damage per encounter.',
  'Comm beacon':          'Emergency distress beacon. Broadcasts your location across 5 star systems.',
  'Warp flare (×2)':      '2 emergency teleport charges. Each jumps you 100m in any direction.',
  // ── Post-Apocalyptic ──────────────────────────────────────────
  'Pipe rifle':           'Scavenged bolt-action. Unreliable (+1 to misfire) but deadly at range.',
  'Metal armor (scavenged)': 'Patchwork plates and leather. Reduces damage by 3. Loud when moving.',
  'Combat knife':         'Military surplus blade. Reliable. Holds an edge.',
  'RadAway':              'IV bag of radiation chelators. Removes 50 rads. One use.',
  'Geiger counter':       'Ticks near radiation. Essential for navigating the Waste.',
  'Mutagen vials':        '2 unstable compounds. Each gives a random mutation for 1 hour. Dangerous.',
  'Technical manual':     'Pre-war engineering text. Gives +2 to any tech repair or construction check.',
  'Scrap parts':          'Useful junk. Required for improvised repairs. Worth trading.',
  'Silenced pistol':      '12 shots. Suppressed — no noise signature. Effective to 40ft.',
  'Wire cutters':         'Cuts chain link, barbed wire, and electrical conduit.',
  'Gas mask':             'Filters radiation, gas, and spores. 8 hours of filters remaining.',
  'Scavenged rations':    '2 days of canned food of questionable origin. Still calories.',
  'Hunting rifle':        'Pre-war scoped rifle. Accurate to 500ft. Ammo is precious.',
  'Binoculars':           'Optical magnification ×8. No batteries required.',
  'Wasteland map':        'Hand-drawn map of nearby safe zones, water sources, and settlements.',
  'Survival kit':         'Compass, flint, wire snares, water purification tabs. Keeps you alive.',
  'Field medic bag':      '3 uses. Each use heals 2d6 HP and treats one condition.',
  'Stimpaks (×3)':        '3 stim packs. Each restores 1d8+2 HP instantly. Slightly irradiated.',
  'Radiation pills':      '4 rad-resistance pills. Each reduces radiation damage by half for 2 hours.',
  'Antibiotics':          '4 doses. Cures infections that would otherwise be fatal in the Waste.',
  'Pre-war radio':        'Plays old-world music. Also receives emergency broadcasts.',
  'Barter goods':         'Pre-war goods: cigarettes, canned food, duct tape. Currency of the Waste.',
  'Energy pistol':        'Clean and reliable energy sidearm. 15 shots per cell.',
  'Power armor (partial)':'Upper torso only. Still provides +6 damage reduction. Heavy.',
  'Toolkit':              'Full mechanical toolkit. Required for complex repairs.',
  'Fusion cell (×2)':     '2 power cells. Each charges one energy weapon to full or runs electronics for 6 hours.',
  'Shotgun':              '5-shot pump action. Devastating at close range. Loud.',
  'Scrap shield':         'Welded car door and rebar. Heavy but stops most bullets.',
  'Raider flag':          'Your crew\'s colors. Other raiders know your name and give distance.',
  'Explosives (×2)':      '2 improvised charges. Unpredictable fuses. Large blast radius.',
  // ── Ninja / Samurai ───────────────────────────────────────────
  'Katana (ancestral)':   'Your family\'s blade. Masterwork steel. +2 to attack. Cannot be replaced.',
  'Wakizashi':            'Short companion blade. For close quarters when the katana is impractical.',
  'Samurai armor (do)':   'Lacquered plates on silk cord. Reduces damage by 3. Honorable to wear.',
  'Honor blade':          'A second katana given to you by your lord. Return it only in victory or death.',
  'Ofuda charms (×5)':    '5 paper talismans. Each can ward one spirit, detect one lie, or seal one ghost.',
  'Spirit scroll':        'Contains 3 rituals: summon minor spirit, ward a location, speak with the dead.',
  'Incense sticks':       'Calms spirits and helps concentration. +1 to all Wisdom checks when burning.',
  'Oracle beads':         '108 carved prayer beads. Allows one question to the spirit world per day.',
  'Shuriken (×8)':        '8 throwing stars. Accurate to 30ft. Silenced.',
  'Shinobi shozoku':      'Black infiltration suit. +3 to stealth in dim light or darkness.',
  'Grappling hook':       'Folding steel hook and 50ft of thin cord. Supports 300lbs.',
  'Yumi bow':             'Asymmetrical war bow. Powerful at range. Requires training to use.',
  'Armor-piercing arrows (×12)': '12 broadhead arrows hardened to pierce light armor.',
  'Rope ladder':          '20ft rope ladder. Deployable in 5 seconds.',
  'Herbal medicine kit':  'Traditional remedies. 4 uses, each healing 1d6 HP or treating one ailment.',
  'Acupuncture needles':  'Restores 1d4 HP and removes fatigue. Takes 10 minutes to apply.',
  'Medicinal sake':       '3 doses. Numbs pain and gives +1 to Constitution for 1 hour.',
  'Shamisen':             'Three-stringed instrument. Required for certain spirit rituals.',
  'Geisha makeup':        'Complete face paint. Grants perfect disguise as a performer. Takes 20 minutes.',
  'Fan (concealed blade)':'Elegant iron fan. Folds open to reveal a razor-sharp edge.',
  '5 silver mon':         'Coin of feudal Japan. Enough for lodging and a simple meal.',
  'Ninjato':              'Straight short sword. Lighter than a katana. Better in tight spaces.',
  'Kusarigama':           'Sickle on a chain. Can disarm, trip, or entangle targets.',
  'Climbing claws':       'Iron spikes for hands and feet. +4 to climbing checks.',
  'Flash powder (×3)':    '3 pouches. Ignite for a blinding flash and loud crack. Distracts guards.',
};

// ── Get description for an inventory item ──────────────────────────────────
export function getItemDesc(itemName) {
  if (!itemName) return null;
  // Exact match first
  if (ITEM_DESCRIPTIONS[itemName]) return ITEM_DESCRIPTIONS[itemName];
  // Case-insensitive match
  const lower = itemName.toLowerCase();
  for (const [k, v] of Object.entries(ITEM_DESCRIPTIONS)) {
    if (k.toLowerCase() === lower) return v;
  }
  // Partial match — item name contained in a key or vice versa
  for (const [k, v] of Object.entries(ITEM_DESCRIPTIONS)) {
    if (lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower)) return v;
  }
  return null;
}
