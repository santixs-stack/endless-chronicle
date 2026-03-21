// ═══════════════════════════════════════════
//  GM TAG PARSERS
//  Each parser is a pure function.
//  parseAllTags() extracts everything at once.
// ═══════════════════════════════════════════

export function parseAllTags(raw) {
  const result = {
    narrative:  raw,
    image:      null,
    scene:      null,
    actions:    [],
    xpAwards:   [],
    npcs:       [],
    journal:    null,
    reputation: [],
    combat:     null,
    combatEnd:  false,
    hpDeltas:   [],
    conditions: [],
    time:       null,
    weather:    null,
    items:      [],
    creatures:  [],
    milestone:  null,
    codex:      [],
    gold:       null,
    floor:      null,
    location:   null,
    stats:      null,
    death:      null,
    clarify:    null,
    rolls:      [],
  };

  let text = raw;

  // Image scene data
  const imageM = text.match(/\[IMAGE:(\{[\s\S]*?\})\]/);
  if (imageM) { try { result.image = JSON.parse(imageM[1]); } catch(e) {
    // Try to extract partial data if JSON is malformed
    try {
      const setting = imageM[1].match(/"setting"\s*:\s*"([^"]+)"/)?.[1];
      const time    = imageM[1].match(/"time"\s*:\s*"([^"]+)"/)?.[1];
      const mood    = imageM[1].match(/"mood"\s*:\s*"([^"]+)"/)?.[1];
      if (setting) result.image = { setting, time: time||'day', mood: mood||'exciting' };
    } catch {}
  }}
  text = text.replace(/\[IMAGE:\{[\s\S]*?\}\]/g, '').trim();

  // Clarify — GM asking for more info before continuing
  const clarifyM = text.match(/\[CLARIFY:([^\]]+)\]/);
  if (clarifyM) {
    result.clarify = clarifyM[1].trim();
    text = text.replace(/\[CLARIFY:[^\]]+\]/g, '').trim();
  }

  // Scene
  const sceneM = text.match(/\[SCENE:\s*(\{[^}]+\})\]/);
  if (sceneM) { try { result.scene = JSON.parse(sceneM[1]); } catch {
    // Try extracting fields manually if JSON malformed
    try {
      const type    = sceneM[1].match(/"type"\s*:\s*"([^"]+)"/)?.[1];
      const time    = sceneM[1].match(/"time"\s*:\s*"([^"]+)"/)?.[1];
      const weather = sceneM[1].match(/"weather"\s*:\s*"([^"]+)"/)?.[1];
      const mood    = sceneM[1].match(/"mood"\s*:\s*"([^"]+)"/)?.[1];
      if (type) result.scene = { type, time: time||'day', weather: weather||'clear', mood: mood||'exciting' };
    } catch {}
  }}
  text = text.replace(/\[SCENE:[^\]]+\]/g, '').trim();

  // Actions
  const actM = text.match(/\[ACTIONS:(\[[^\]]+\])\]/);
  if (actM) { try { result.actions = JSON.parse(actM[1]); } catch {} }
  text = text.replace(/\[ACTIONS:[^\]]*\]/g, '').trim();

  // Stats (adventure mode health)
  const statsM = text.match(/\[STATS:(\{[^}]+\})\]/);
  if (statsM) { try { result.stats = JSON.parse(statsM[1]); } catch {} }
  text = text.replace(/\[STATS:[^\]]+\]/g, '').trim();

  // HP Deltas
  // HP Deltas — [HPDELTA:{"target":"name","delta":-8,"weapon":"sword","roll":14,"crit":false}]
  const hpMatches = [...text.matchAll(/\[HPDELTA:(\{[^}]+\})\]/g)];
  hpMatches.forEach(m => {
    try {
      const delta = JSON.parse(m[1]);
      // roll=20 always means crit even if not flagged
      if (delta.roll === 20) delta.crit = true;
      result.hpDeltas.push(delta);
    } catch {}
  });
  text = text.replace(/\[HPDELTA:[^\]]+\]/g, '').trim();

  // XP Awards
  const xpMatches = [...text.matchAll(/\[XP:(\{[^}]+\})\]/g)];
  xpMatches.forEach(m => { try { result.xpAwards.push(JSON.parse(m[1])); } catch {} });
  text = text.replace(/\[XP:[^\]]+\]/g, '').trim();

  // NPCs
  const npcMatches = [...text.matchAll(/\[NPC:(\{[^}]+\})\]/g)];
  npcMatches.forEach(m => { try { result.npcs.push(JSON.parse(m[1])); } catch {} });
  text = text.replace(/\[NPC:[^\]]+\]/g, '').trim();

  // Journal
  const journalM = text.match(/\[JOURNAL:"([^"]+)"\]/);
  if (journalM) result.journal = journalM[1];
  text = text.replace(/\[JOURNAL:"[^"]+"\]/g, '').trim();

  // Reputation
  const repMatches = [...text.matchAll(/\[REP:(\{[^}]+\})\]/g)];
  repMatches.forEach(m => { try { result.reputation.push(JSON.parse(m[1])); } catch {} });
  text = text.replace(/\[REP:[^\]]+\]/g, '').trim();

  // Combat
  const combatM = text.match(/\[COMBAT:(\[[^\]]+\]|\{[^}]+\})\]/);
  if (combatM) { try { result.combat = JSON.parse(combatM[1]); } catch {} }
  text = text.replace(/\[COMBAT:[^\]]*\]/g, '').trim();

  if (text.includes('[COMBAT_END]')) { result.combatEnd = true; }
  text = text.replace(/\[COMBAT_END\]/g, '').trim();

  // Milestone
  const msM = text.match(/\[MILESTONE:(\d+)\]/);
  if (msM) result.milestone = parseInt(msM[1]);
  text = text.replace(/\[MILESTONE:\d+\]/g, '').trim();

  // Codex
  const codexMatches = [...text.matchAll(/\[CODEX:(\{[^}]+\})\]/g)];
  codexMatches.forEach(m => { try { result.codex.push(JSON.parse(m[1])); } catch {} });
  text = text.replace(/\[CODEX:[^\]]+\]/g, '').trim();

  // Gold
  const goldM = text.match(/\[GOLD:(\{[^}]+\})\]/);
  if (goldM) { try { result.gold = JSON.parse(goldM[1]); } catch {} }
  text = text.replace(/\[GOLD:[^\]]+\]/g, '').trim();

  // Floor
  const floorM = text.match(/\[FLOOR:(\d+)\]/);
  if (floorM) result.floor = parseInt(floorM[1]);
  text = text.replace(/\[FLOOR:\d+\]/g, '').trim();

  // Location
  const locM = text.match(/\[LOCATION:([^\]]+)\]/);
  if (locM) result.location = locM[1].trim();
  text = text.replace(/\[LOCATION:[^\]]+\]/g, '').trim();

  // Death
  const deathM = text.match(/\[DEATH:([^\]]+)\]/);
  if (deathM) result.death = deathM[1].trim();
  text = text.replace(/\[DEATH:[^\]]+\]/g, '').trim();

  // Dice rolls
  const rollMatches = [...text.matchAll(/\[ROLL:([^\]]+)\]/g)];
  rollMatches.forEach(m => result.rolls.push(m[1]));
  text = text.replace(/\[ROLL:[^\]]+\]/g, '').trim();

  // Conditions
  const condM = text.match(/\[CONDITIONS:(\[[^\]]+\])\]/);
  if (condM) { try { result.conditions = JSON.parse(condM[1]); } catch {} }
  text = text.replace(/\[CONDITIONS:[^\]]+\]/g, '').trim();

  // Items
  const itemMatches = [...text.matchAll(/\[ITEM:(\{[^}]+\})\]/g)];
  itemMatches.forEach(m => { try { result.items.push(JSON.parse(m[1])); } catch {} });
  text = text.replace(/\[ITEM:[^\]]+\]/g, '').trim();

  // Creatures
  const creatureMatches = [...text.matchAll(/\[CREATURE:(\{[^}]+\})\]/g)];
  creatureMatches.forEach(m => { try { result.creatures.push(JSON.parse(m[1])); } catch {} });
  text = text.replace(/\[CREATURE:[^\]]+\]/g, '').trim();

  // Strip any leftover tag fragments (stray ] [ characters)
  text = text.replace(/\s*\]\s*$/g, '').replace(/^\s*\[\s*/g, '').trim();

  result.narrative = text;
  return result;
}
