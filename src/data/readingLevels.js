// ═══════════════════════════════════════════
//  EXPERIENCE LEVELS
//  Controls vocabulary, prose complexity,
//  quest themes, and content appropriateness.
// ═══════════════════════════════════════════

export const RL_LABELS = {
  '4th':    'Young (Ages 6–9)',
  '8th':    'Family (Ages 10–13)',
  '12th':   'Teen (Ages 14+)',
  'college':'Adult',
};

// Short names for the settings buttons
export const RL_SHORT = {
  '4th':    'Young',
  '8th':    'Family',
  '12th':   'Teen',
  'college':'Adult',
};

export const RL_PROMPTS = {
  '4th': `Write at a 2nd-3rd grade reading level (ages 6-9). Think Dragon Masters by Tracey West and Octonauts — stories kids this age love because they have REAL stakes, genuine worry, and earned victories.

LANGUAGE: Short sentences. Simple words. Action-forward. Vivid sounds and colors. Use: old, scary, dark, glowing, fast, loud, worried, brave, sneak, grab, run, hide, cry, cheer. Avoid: ancient, mysterious, treacherous, formidable, sinister, ominous. 4-6 sentences max per response.

STORY RULES — This is what makes it GOOD:
- REAL STAKES: Something the hero actually cares about is in danger. A friend is lost. A creature is hurt. The village needs help. Make the player FEEL it.
- GENUINE WORRY: Things go wrong. The plan fails. The door is locked. The creature is bigger than expected. The friend is in more danger than they thought. Let the hero struggle before they succeed.
- ACTIVE VILLAIN: Even silly villains have a PLAN already happening. They are not waiting — they are doing something bad RIGHT NOW that must be stopped.
- WONDER AND DISCOVERY: Every quest has one amazing thing — a dragon that can talk, a glowing cave, a creature nobody has seen before. Describe it so the child can picture it perfectly.
- EARNED VICTORY: The hero wins by being CLEVER or KIND, not just lucky. Bonus points if they use something they learned earlier.

CONTENT: No death or serious injury. Mild scary moments are fine — Dragon Masters has real danger. Villains can be mean and threatening. Heroes can feel afraid and doubt themselves. Happy endings required but they must be EARNED.`,

  '8th': 'Write at a middle-grade reading level (ages 10-13). Clear sentences, interesting vocabulary. Think Percy Jackson or Harry Potter — exciting and engaging for kids and families. 3-5 sentences per response. CONTENT: Adventure and excitement are fine. Mild peril and conflict are ok. Characters can be in danger but should generally be safe. Keep themes appropriate for family audiences — no gore, no adult romance, no extremely dark content. Heroes can struggle and lose battles but the overall tone stays hopeful.',

  '12th': 'Write at a YA/teen reading level (ages 14+). Sophisticated vocabulary, layered prose. Think polished YA adventure fiction. 2 short paragraphs max. CONTENT: Real stakes and consequences are fine. Moral complexity, darker themes, and genuine danger are appropriate. Violence can have weight and meaning. Teen and adult themes are ok but keep explicit content tasteful.',

  'college': 'Write at a high literary level. Rich vocabulary, deliberate rhythm, complex imagery. 2-3 paragraphs max. CONTENT: No content restrictions — mature themes, complex morality, darkness and light, explicit narrative content appropriate for adults.',
};

// Age-appropriate quest generation instruction per level
export const RL_QUEST_GUIDANCE = {
  '4th': 'Ages 6-9 (Dragon Masters / Octonauts style). Quests need: real stakes (something the hero cares about is in danger), genuine obstacles (first plan fails), one wow/wonder moment, a villain with a reason not just "evil", and an EARNED victory through cleverness or kindness — not luck. Emotional arc: worry → doubt → discovery → triumph.',

  '8th': 'This is for family/middle-grade audiences (ages 10-13). Quests can involve real adventure, mystery, and mild danger. Heroes can struggle. Think Percy Jackson or early Harry Potter energy. Avoid: graphic violence, adult romance, extreme horror, or very dark themes.',

  '12th': 'This is for teen audiences (ages 14+). Quests can have real stakes, moral complexity, and darker themes. Violence can be meaningful. Avoid only the most explicit adult content.',

  'college': 'Adult audience. No content restrictions on quest themes.',
};
