// ═══════════════════════════════════════════
//  STORY QUESTS
//  Each quest has a genre field for archetype
//  matching during character creation.
// ═══════════════════════════════════════════

export const STORY_GOALS = [
  {
    id: 'dungeon', icon: '⚔', name: 'Dungeon Adventure', genre: 'fantasy',
    tagline: 'Explore a mysterious dungeon full of monsters, traps, and treasure!',
    tags: ['fantasy', 'combat', 'exploration'],
    tone: 'Epic & Exciting', sceneType: 'dungeon', sceneTime: 'cave',
    worldName: 'A fantasy kingdom with a cursed dungeon beneath it',
    worldLocation: 'The stone entrance to the Dungeon of Shadows',
    hint: `5-floor dungeon with a STORY SPINE:
HOOK: A child from the village ran in three days ago chasing a glowing stone. She hasn't come back. The party must find her.
COMPLICATION: Floor 2 reveals the glowing stones are dragon eggs — the "monsters" are parents protecting them.
DARK MOMENT: Floor 4 — the child is found, but she's made friends with the baby dragon. Taking her home means separating them forever.
TWIST: The dungeon boss is not evil — it's the dragon GRANDMOTHER who sealed the child in to keep her safe from something worse outside.
RESOLUTION: The real threat (poachers after the eggs) must be defeated. The child and baby dragon bond becomes the key.
Track floor [FLOOR:1-5]. Each floor has a unique creature with a NAME and PERSONALITY, not just "monster". Poachers appear on floor 3 as the true villains.`,
    start: 'Three days ago, little Mira chased a glowing light into this dungeon and never came out. Her family is desperate. At the entrance, you find her small muddy boot — and claw marks going DOWN, not up.',
  },
  {
    id: 'rescue', icon: '👑', name: 'Rescue Mission', genre: 'fantasy',
    tagline: 'Someone important has been captured! Race to save them before time runs out.',
    tags: ['fantasy', 'rescue', 'adventure'],
    tone: 'Epic & Exciting', sceneType: 'castle', sceneTime: 'night',
    worldName: 'A magical medieval kingdom under a dark spell',
    worldLocation: 'Outside the villain\'s towering fortress at night',
    hint: `Rescue with real emotional stakes:
HOOK: The captured person is someone the player loves — their mentor, sibling, or best friend. But ALSO: the villain kidnapped them to force a terrible choice, not just for ransom.
COMPLICATION: Turn 2 — the rescue path is blocked in a way that requires creativity. And the captive has learned something in captivity that changes what "rescue" means.
DARK MOMENT: The players reach the captive only to find they're refusing to leave — because the villain told them a truth that changes everything.
TWIST: The villain's reason is partially RIGHT. The players must reckon with it, not just fight.
RESOLUTION: The answer isn't just escaping — it's resolving the underlying truth. The captive and villain both have to make a choice.
Track obstacles cleared 0/3. Guards have names and personalities. The villain speaks to the party — give them one speech that makes the player genuinely think.`,
    start: 'The letter arrived at dawn: "I have them. Come alone. Tell no one. You have until midnight to choose — come to the fortress, or I start asking them questions." You came anyway. You brought friends. That was already the first defiance.',
  },
  {
    id: 'treasure', icon: '🗺', name: 'Treasure Hunt', genre: 'pirate',
    tagline: 'A map to the greatest treasure ever hidden — and three other teams want it too!',
    tags: ['pirate', 'adventure', 'exploration'],
    tone: 'Funny & Silly', sceneType: 'ocean', sceneTime: 'day',
    worldName: 'A world of pirates, ocean islands, and hidden treasure',
    worldLocation: 'A busy harbor town where adventurers gather',
    hint: `Treasure hunt with a twist that makes it memorable:
HOOK: The map is real — but someone WANTS you to find the treasure first. You don't know why yet.
COMPLICATION: Clue 2 reveals the "treasure" was hidden to keep it away from someone. Clue 3 reveals that someone is one of the rival teams — and they need it for a reason that seems justified.
DARK MOMENT: The party reaches the treasure first, but learns what it actually IS — not gold, but something that could hurt or heal. Now they have to decide who gets it.
TWIST: The person who hid the treasure left one final message explaining why. It completely reframes who the real villain is.
RESOLUTION: The decision of what to DO with the treasure is the real quest. There's no perfect answer.
Track clues 0/4. Give each rival team a NAME, a LEADER with personality, and a REASON for wanting the treasure. One rival should become an unexpected ally.`,
    start: `The map is in your hands. Three teams saw you find it. They're already running. But the old sailor who gave you the map whispered one thing before she walked away: "Don't open the chest. Not until you know WHY it was hidden."`,
  },
  {
    id: 'crash', icon: '🚀', name: 'Lost in Space', genre: 'space',
    tagline: 'Spaceship crashed on an alien planet. Survive, explore, and find a way home!',
    tags: ['sci-fi', 'adventure', 'exploration'],
    tone: 'Mysterious & Wondrous', sceneType: 'plains', sceneTime: 'dawn',
    worldName: 'An uncharted alien planet with purple plants and glowing creatures',
    worldLocation: 'A crash landing site — ship in two pieces, alien sky above',
    hint: `Sci-fi survival with an emotional core:
HOOK: Ship crashed. One crew member is MISSING. The ship can be repaired — but only if the party splits up, and splitting up is dangerous.
COMPLICATION: The planet's creatures aren\'t hostile — they're AFRAID of something else. Something big drove them all to the same hiding spots. The party walks right into the creatures' panicked migration.
DARK MOMENT: The missing crew member is found — inside the creature's nest, unharmed but unable to leave safely. The big threat is getting closer.
TWIST: The "big threat" is actually the crashed ship's leaking engine — it\'s poisoning the creatures' water. The party caused the crisis.
RESOLUTION: Fix the ship AND fix the leak to save the creatures. The creatures help in return.
Track repairs 0-5 parts. The missing crew member has been BEFRIENDING the creatures. Name them. The big creature that "hunts" is actually just trying to warn everyone.`,
    start: 'CRASH. Green sky. Ship in pieces. Your crewmate Zara is not here — her seat is empty, harness unclipped from the inside. Outside, something small and glowing watches you from behind a rock. It looks scared. Everything on this planet looks scared.',
  },
  {
    id: 'pirates', icon: '🏴‍☠️', name: 'Pirate Adventure', genre: 'pirate',
    tagline: 'Sail the seven seas, find legendary treasure, and become the greatest pirates ever!',
    tags: ['pirate', 'adventure', 'ocean'],
    tone: 'Epic & Exciting', sceneType: 'ocean', sceneTime: 'dawn',
    worldName: 'The Golden Age of Piracy — a world of ships, treasure, and adventure',
    worldLocation: 'The deck of your pirate ship, open ocean ahead',
    hint: `Pirate adventure with real heart:
HOOK: The Golden Dragon's Hoard isn\'t just treasure — it's a dragon EGG that a pirate captain stole fifty years ago. The dragon mother is still searching for it. Ships that get too close disappear.
COMPLICATION: The rival pirate hunting the same treasure turns out to be a CHILD whose parent disappeared on the last expedition to find it.
DARK MOMENT: The party finds the hoard — and the dragon mother arrives. She's not attacking. She's GRIEVING. The egg is cold.
TWIST: The egg can still hatch — but only with warmth from someone who genuinely wants to protect it. Greed won't work.
RESOLUTION: Return the egg with good intentions. The dragon mother becomes an ally. The "treasure" was the living egg all along.
Track crew happiness 0-100%. Each crew member has a name and specialty. The rival child pirate should join the crew by act 2. The dragon mother appears first as a shadow under the water.`,
    start: `The wind fills your sails and the crew is singing. Then the lookout goes quiet. There's a shadow under the water, longer than your ship, moving the same direction you're heading. The old map marks this exact spot with two words: "SHE WATCHES."`,
  },
  {
    id: 'wildwest', icon: '🤠', name: 'Wild West', genre: 'western',
    tagline: 'A small town needs heroes. The bandits are coming. Will you stand and fight?',
    tags: ['western', 'adventure'],
    tone: 'Epic & Exciting', sceneType: 'plains', sceneTime: 'dawn',
    worldName: 'The Wild West — dusty towns, horses, and frontier justice',
    worldLocation: 'Riding into the town of Dusty Creek at sunset',
    hint: `Western with a moral backbone:
HOOK: The bandits aren't coming for the bank — they're coming for ONE SPECIFIC PERSON in town. Someone who did something. The town is divided on whether to protect them.
COMPLICATION: That person turns out to be the bandit leader's FAMILY MEMBER. The "crime" was refusing to help with the gang's last job. This is personal, not just criminal.
DARK MOMENT: The party has 24 hours. They've earned the town\'s trust — but some townspeople want to hand over the person to save themselves. The party must decide if they'll defend someone the town has abandoned.
TWIST: The bandit leader sends a private message: "I just want to talk. One hour. No guns." Is it a trap or is there a real way to resolve this without a showdown?
RESOLUTION: True heroism is the choice — fight, negotiate, or find a third option that nobody expected.
Track town trust 0-100%. Each townsperson has a name, a job, and an opinion. The bandit leader has a reason. The protected person has been keeping a secret.`,
    start: `You ride into Dusty Creek at sunset. The streets are empty. A note on your saddle says: GET OUT WHILE YOU STILL CAN. Every window has a face in it, watching. Then an old woman opens her door and waves you inside quickly. "You're the help," she says. "Good. Sit down. There's something you need to know about this town before you go getting anybody shot."`,
  },
  {
    id: 'dreamworld', icon: '🌙', name: 'Dream World', genre: 'fantasy',
    tagline: 'Everyone had the same dream last night. Tonight you\'re going in to find out why.',
    tags: ['weird', 'mystery'],
    tone: 'Mysterious & Wondrous', sceneType: 'cave', sceneTime: 'night',
    worldName: 'A shared dream world built from everyone\'s imagination',
    worldLocation: 'The mysterious place you all keep dreaming about',
    hint: `Dream world with emotional truth:
HOOK: Everyone had the same dream — but each person dreamed a DIFFERENT piece of it. Together they form a map to a child who got lost in the dream and can't wake up.
COMPLICATION: The dream world reshapes around the players' fears. Every door tests something real about who they are. The lost child has been there so long they\'ve forgotten they're dreaming.
DARK MOMENT: The players find the child — but the child doesn't want to wake up. The dream world gave them everything the real world didn't.
TWIST: The dream world is ALIVE and it loves the child. It won't let them go easily. But it can be reasoned with — if the players understand what it\'s giving the child that reality isn't.
RESOLUTION: The real fix isn't forcing the child to wake up — it's promising that the real world can have what they found here, too. Someone has to make that promise and mean it.
Track dream keys 0/3. Each key is found by facing something real about one of the players' characters. The lost child has a name, a backstory, and a reason the dream felt better than home.`,
    start: `Three nights. Same dream. A door. A light. A voice saying your name. Tonight you all fell asleep holding hands. The door is in front of you now — real enough to touch. On the other side, a child is crying. They sound like they've been crying for a long time.`,
  },
  {
    id: 'spacemystery', icon: '🌌', name: 'Space Station Mystery', genre: 'space',
    tagline: 'Something strange is happening on the space station. Only you can figure it out!',
    tags: ['sci-fi', 'mystery'],
    tone: 'Mysterious & Wondrous', sceneType: 'space', sceneTime: 'night',
    worldName: 'A space station orbiting a distant planet in the future',
    worldLocation: 'The docking bay of Space Station Horizon',
    hint: `Space mystery with a twist ending:
HOOK: Everyone on the station fell asleep at the same moment. Only the party, who arrived late via shuttle, is awake. The station's AI says everything is "normal."
COMPLICATION: Clue 2 reveals the AI is hiding something — not maliciously, but because it made a PROMISE to a crew member. Clue 3 shows the sleeping isn't dangerous — it\'s the crew's way of keeping SOMETHING ELSE asleep too.
DARK MOMENT: The party wakes one crew member to get answers — and something else stirs. Now the clock is ticking before it fully wakes.
TWIST: The "something else" isn't an enemy — it's an alien that came aboard sick and frightened, and the crew has been singing it to sleep in shifts for six months. The crew just forgot to warn anyone.
RESOLUTION: The party must find a way to help the alien so it doesn't need the lullaby anymore — and decide what to do about a first contact situation nobody planned for.
Track clues 0/4. The AI has a name and a personality. The alien communicates through temperature and color. The crew member who made the promise has left notes everywhere.`,
    start: 'The station is yours. Everyone else is asleep — perfectly, quietly, suspiciously asleep. The coffee is still hot. A sandwich is half-eaten. The AI says: "Welcome aboard. Everything is normal. Please do not go to Section 7." You immediately want to go to Section 7.',
  },
  {
    id: 'haunted', icon: '👻', name: 'The Haunting', genre: 'horror',
    tagline: 'Something evil lives in the old manor. Investigate — if you dare.',
    tags: ['horror', 'mystery'],
    tone: 'Dark & Mysterious', sceneType: 'castle', sceneTime: 'night',
    worldName: 'A fog-shrouded gothic countryside with a cursed manor at its heart',
    worldLocation: 'The iron gates of Blackthorn Manor, candles flickering inside',
    hint: `Gothic mystery with emotional depth:
HOOK: The manor was abandoned after one person disappeared inside it twenty years ago. The party arrives because someone received a LETTER in that person's handwriting — postmarked today.
COMPLICATION: The entity in the manor IS the missing person — or what remains of them. They're not haunting the place; they're TRAPPED in it. Each "haunting" is a cry for help.
DARK MOMENT: The party learns the entity has been protecting the manor from something worse — a second presence that actually IS dangerous. The good entity is weakening.
TWIST: The dangerous presence is grief — the entity's own grief, given form. The person couldn\'t leave because they couldn't let go of something. The party must find what it was.
RESOLUTION: Help the entity complete their unfinished business and they can finally pass on. The dangerous presence dissolves with the grief.
Track secrets 0/5. Each secret reveals one layer of who this person was. Include an object that holds an emotional memory. The entity should feel like a PERSON, not a monster.`,
    start: `The letter arrived this morning. Twenty-year-old handwriting. Your aunt's handwriting. She has been dead for twenty years. The letter says three words: "I'm still here." The gates of Blackthorn Manor stand open. The candle in the top window is lit.`,
  },
  {
    id: 'gladiator', icon: '🏛', name: 'Arena of Glory', genre: 'historical',
    tagline: 'Ancient Rome. The crowd is roaring. Fight your way to freedom.',
    tags: ['historical', 'combat'],
    tone: 'Epic & Exciting', sceneType: 'ruins', sceneTime: 'day',
    worldName: 'Ancient Rome at the height of its power — colosseum, senators, and intrigue',
    worldLocation: 'The gladiator holding cells beneath the great Colosseum',
    hint: '5 arena fights. Track: Crowd favor (0-100%), Fights won (0/5). Between fights, political intrigue. Freedom is the ultimate prize.',
    start: 'The roar of fifty thousand Romans shakes the stones above you. The gate mechanism grinds. Your name is being chanted — today it means survive.',
  },
  {
    id: 'wasteland', icon: '☢', name: 'Wasteland Survival', genre: 'postapoc',
    tagline: 'The world ended forty years ago. Something has changed. A signal is calling your name.',
    tags: ['post-apocalyptic', 'survival'],
    tone: 'Dark & Mysterious', sceneType: 'desert', sceneTime: 'dawn',
    worldName: 'A nuclear wasteland — ash plains, ruined cities, scattered survivor settlements',
    worldLocation: 'The edge of your settlement, facing the open Badlands',
    hint: `Post-apocalyptic story with hope at its core:
HOOK: The signal is a child's voice reading names — hundreds of them. Your name is on the list. You don't know why. Neither does the child.
COMPLICATION: The child has been broadcasting from a sealed pre-war facility. They found the list and don't know what it means — but desperate people are converging on the signal for their own reasons.
DARK MOMENT: The party arrives to find rival factions already there. One will destroy the facility for its resources. One wants to weaponize whatever the list represents. The child is in danger.
TWIST: The list is a record of "genetic donors" — the child is the result of a pre-war project to preserve humanity's best traits. They are, in a literal sense, made from hundreds of people including the party's ancestors.
RESOLUTION: Protect the child and decide what happens to the project — destroy it, expand it, or let the child simply be a child and choose their own future.
Track supplies and days. The rival faction leaders have names and past trauma. The child has been alone for two years and has opinions about everything.`,
    start: `The signal is a child's voice. It reads names — one every ten seconds, all day, all night. Yesterday it said YOUR name. Today, looking out from your settlement, you can see three other groups also packing up, also heading toward Old City. Whoever gets there first gets to decide what happens to whoever's broadcasting.`,
  },
  {
    id: 'cybercity', icon: '🤖', name: 'Neon City Heist', genre: 'cyberpunk',
    tagline: 'One corporation controls everything. Steal the evidence that brings them down.',
    tags: ['cyberpunk', 'heist'],
    tone: 'Dark & Mysterious', sceneType: 'city', sceneTime: 'night',
    worldName: 'Neo-Chrome City — neon towers, corporate zones, and underground resistance',
    worldLocation: 'A back-alley safehouse, rain hammering the windows',
    hint: 'Cyberpunk heist. 4 stages: Recon, Infiltrate, Extract, Escape. Track: Heat level (0-5). The corporation knows someone is coming.',
    start: 'The plan is on the table. Three hours. Somewhere in the 94th floor of OmegaCorp tower is a file that will expose everything. This is your way out.',
  },
  {
    id: 'olympus', icon: '⚡', name: 'Wrath of the Gods', genre: 'mythology',
    tagline: 'The gods are angry. Only mortals — and one demigod — can stop the war.',
    tags: ['mythology', 'adventure', 'epic'],
    tone: 'Epic & Exciting', sceneType: 'mountain', sceneTime: 'storm',
    worldName: 'Ancient Greece — gods walk the earth and heroes are forged in fire',
    worldLocation: 'The base of Mount Olympus, lightning splitting the sky above',
    hint: `Mythological epic with moral weight:
HOOK: The gods are arguing over a mortal decision — one choice a hero's ancestor made that set events in motion. The party is descended from that ancestor. They have to answer for it.
COMPLICATION: Trial 2 reveals the argument between gods has divided Olympus into two sides. Mortals who help one side face punishment from the other. There's no safe path.
DARK MOMENT: Trial 3 — the party must choose between saving someone they love and maintaining divine favor. The gods watch to see what mortals value most.
TWIST: The ancestor's choice wasn\'t wrong — it was just incomplete. The party's task isn't to apologize but to FINISH what was started.
RESOLUTION: The answer that ends the divine argument isn't power or sacrifice — it's wisdom. The party demonstrates that mortals can understand something the gods, in their eternal conflict, cannot.
Track divine favor 0-100%. Each god the party meets has a personality and an argument. The ancestor's ghost appears in trial 2. The choice in trial 3 has real consequences.`,
    start: `The earth shook at dawn. The oracle spoke three words: GO. TO. OLYMPUS. Then she handed you a clay tablet and said, "Your great-great-grandmother left this unfinished. The gods have been arguing about it for two hundred years. They want YOU to settle it." The tablet has your family's name on it. And something that looks like a debt.`,
  },
  {
    id: 'fairytale', icon: '📖', name: 'Once Upon a Curse', genre: 'fairytale',
    tagline: 'A kingdom cursed. A villain with a reason. A prophecy pointing the wrong direction.',
    tags: ['storybook', 'magic', 'curse'],
    tone: 'Mysterious & Wondrous', sceneType: 'forest', sceneTime: 'dawn',
    worldName: 'The Enchanted Realm — talking animals, cursed royalty, and magic that always has a cost',
    worldLocation: 'The edge of the Whispering Wood, eleven days after the prophecy said heroes would arrive',
    hint: `Fairy tale with real emotional stakes and subverted expectations:
HOOK: The curse is spreading faster than it should — the prophecy said heroes would arrive "just in time" but by the time the party arrives, the kingdom is half-frozen. Someone sped up the curse on purpose.
COMPLICATION: The "villain" who cast the curse is a child who lost someone to the kingdom's carelessness and cast the spell out of grief, not malice. The curse won't break unless the kingdom acknowledges what it did wrong.
DARK MOMENT: Breaking piece 2 requires the king to admit fault — and he refuses. The curse worsens. The party is stuck between justice and mercy.
TWIST: The "chosen one" prophecy is about the villain, not the heroes. The party's job is to help the villain choose healing over revenge.
RESOLUTION: The curse breaks when the child CHOOSES to forgive — not because they're forced to, but because the party helped them see a path forward that the grief had hidden.
Track enchantment broken 0/3. The talking animals know the real history of the kingdom. The villain child has a name and a best friend who was lost. The king has a secret he's been hiding.`,
    start: 'The bluebird lands on your shoulder and clears its tiny throat. "I have been waiting for you. The kingdom is cursed. You are meant to help." It pauses. "Although — I should mention — the prophecy says the heroes arrive just in time, and you are eleven days late. So." It looks at the spreading frost. "We may need to move quickly."',
  },
  {
    id: 'shogun', icon: '⛩', name: 'Honor and Shadow', genre: 'ninja',
    tagline: 'A warlord has broken the peace. The clan sends its best. Honor demands nothing less.',
    tags: ['ninja', 'samurai'],
    tone: 'Epic & Exciting', sceneType: 'mountain', sceneTime: 'dawn',
    worldName: 'Feudal Japan — cherry blossoms, honor codes, and shadows that move with purpose',
    worldLocation: 'The mountain pass above the Valley of Morning Mist',
    hint: `Samurai story about what honor truly means:
HOOK: The contact who didn't show was the party\'s most trusted friend. The warlord's forces didn't take them — they CHOSE to join the warlord. The party must discover why.
COMPLICATION: Mission 3 reveals the warlord is doing something genuinely good alongside the conquest — feeding the villages the old lord starved. The friend saw this and made a choice. Was it wrong?
DARK MOMENT: The party must face the friend in combat. To refuse destroys their honor. To fight means hurting someone they love. There may be a third option — but finding it risks everything.
TWIST: The legendary warrior protecting the warlord is the party's own sensei — in disguise, monitoring the situation for the emperor, waiting to see if the warlord truly has good intentions.
RESOLUTION: Honor is not following the rule — it's knowing WHEN the rule is right. The party must make a judgment call that the code of bushido cannot make for them.
Track honor 0-100%. Honor gained by choosing mercy when violence is easier. Honor lost by cruelty or cowardice. The friend must get a conversation before any combat.`,
    start: `The morning mist hides everything. Your contact's sandals are here. Their blade is here. A fresh bowl of tea, still warm. They are not here. Below in the valley, the warlord\'s banners have just been raised over the old lord's gate. A child comes running up the path — not afraid, just fast — and hands you a folded note. It is in your friend's handwriting: "Wait. Watch. Then decide."`,
  },
];

export function getQuest(id) {
  return STORY_GOALS.find(q => q.id === id);
}

export function getQuestsByGenre(genreId) {
  return STORY_GOALS.filter(q => q.genre === genreId);
}
