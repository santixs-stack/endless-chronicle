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
  '4th': 'Write at a 2nd-3rd grade reading level (ages 6-9). Use ONLY simple everyday words a young child knows. NEVER use words like: ancient, mysterious, treacherous, catastrophic, formidable, sinister, ominous, looming, descended, emerged, shimmered, revealed, concealed, lurking, peculiar, extraordinary, tremendous, magnificent. Instead use: old, scary, dangerous, big, bad, glowing, hiding, near, strange, huge, great. Short sentences, 8 words or less. No big words. Clear exciting action. 4-6 punchy sentences. CONTENT: Keep everything fun and safe for young children. No death, no dark themes, no scary violence. Heroes always succeed or learn something. Villains are silly or misguided, not evil. Quests involve helping, finding, befriending, or fixing things.',

  '8th': 'Write at a middle-grade reading level (ages 10-13). Clear sentences, interesting vocabulary. Think Percy Jackson or Harry Potter — exciting and engaging for kids and families. 3-5 sentences per response. CONTENT: Adventure and excitement are fine. Mild peril and conflict are ok. Characters can be in danger but should generally be safe. Keep themes appropriate for family audiences — no gore, no adult romance, no extremely dark content. Heroes can struggle and lose battles but the overall tone stays hopeful.',

  '12th': 'Write at a YA/teen reading level (ages 14+). Sophisticated vocabulary, layered prose. Think polished YA adventure fiction. 2 short paragraphs max. CONTENT: Real stakes and consequences are fine. Moral complexity, darker themes, and genuine danger are appropriate. Violence can have weight and meaning. Teen and adult themes are ok but keep explicit content tasteful.',

  'college': 'Write at a high literary level. Rich vocabulary, deliberate rhythm, complex imagery. 2-3 paragraphs max. CONTENT: No content restrictions — mature themes, complex morality, darkness and light, explicit narrative content appropriate for adults.',
};

// Age-appropriate quest generation instruction per level
export const RL_QUEST_GUIDANCE = {
  '4th': 'IMPORTANT: This is for young children (ages 6-9). Quests must be fun, safe, and age-appropriate. Focus on: helping others, finding lost things, making new friends, fixing problems, going on treasure hunts, defeating silly villains. NO: death, serious injury, horror, dark magic, adult themes, scary villains. Keep everything lighthearted and optimistic.',

  '8th': 'This is for family/middle-grade audiences (ages 10-13). Quests can involve real adventure, mystery, and mild danger. Heroes can struggle. Think Percy Jackson or early Harry Potter energy. Avoid: graphic violence, adult romance, extreme horror, or very dark themes.',

  '12th': 'This is for teen audiences (ages 14+). Quests can have real stakes, moral complexity, and darker themes. Violence can be meaningful. Avoid only the most explicit adult content.',

  'college': 'Adult audience. No content restrictions on quest themes.',
};
