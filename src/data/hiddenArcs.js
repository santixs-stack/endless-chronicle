// ═══════════════════════════════════════════
//  HIDDEN STORY ARCS
//  One is picked randomly at game start.
//  Injected into the system prompt as sealed
//  GM instructions — players never see them.
// ═══════════════════════════════════════════

export const HIDDEN_ARCS = [
  {
    id: 'traitor',
    name: 'The Traitor',
    gmSecret: 'One NPC the party trusts is secretly working against them. Do not reveal this directly — show it through small inconsistencies, information that leaks at the wrong moment, and moments where the NPC\'s advice leads the party into trouble. Let the players discover it.',
  },
  {
    id: 'prophecy',
    name: 'The Prophecy',
    gmSecret: 'An ancient prophecy references the party by name or description. Fragments of it should surface — carved in stone, whispered by an old NPC, written in a found document. The prophecy is real and ominous but also open to interpretation.',
  },
  {
    id: 'god_disguise',
    name: 'God in Disguise',
    gmSecret: 'One NPC the party meets early is actually a deity in mortal form, testing the party. They will offer seemingly ordinary help. Do not reveal this — only hint at it through moments of inexplicable knowledge or impossible calm in danger.',
  },
  {
    id: 'crack_reality',
    name: 'Crack in Reality',
    gmSecret: 'Something is slightly wrong with this world. Small impossible details — a shadow that falls the wrong direction, a word in a dead language on a modern sign, a person who appears twice. The party may or may not notice. Do not explain it. Let it accumulate.',
  },
  {
    id: 'doppelganger',
    name: 'The Doppelganger',
    gmSecret: 'Someone is impersonating one of the party members in the outside world, doing things the real character would never do. News of this should reach the party indirectly — strangers who recognize them for something they did not do.',
  },
  {
    id: 'countdown',
    name: 'The Countdown',
    gmSecret: 'Something terrible is approaching — an eclipse, a ship arrival, an awakening. The party does not know this yet. Drop time references: the sun is in a particular position, someone mentions a date, a calendar on a wall. The deadline should create quiet urgency.',
  },
];

export function pickHiddenArc() {
  return HIDDEN_ARCS[Math.floor(Math.random() * HIDDEN_ARCS.length)];
}
