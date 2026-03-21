import { useState, useEffect } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import { callAPI } from '../../engine/api.js';
import { STORY_GOALS } from '../../data/quests.js';
import { GAME_ICONS } from '../../data/gameIcons.js';
import GameIcon from '../ui/GameIcon.jsx';
import { SFX } from '../game/SoundEngine.js';
import StepBar from '../ui/StepBar.jsx';
import styles from './QuestGenerateScreen.module.css';

// ═══════════════════════════════════════════
//  QUEST GENERATE SCREEN
//  AI generates 3-4 quest hooks tailored to
//  the specific party + world.
//  Also shows preset quests as fallback.
// ═══════════════════════════════════════════

const LOADING_LINES = [
  (names, world) => `The GM is reading your party…`,
  (names, world) => `Studying ${names}…`,
  (names, world) => `Exploring the world of ${world}…`,
  (names, world) => `Weaving your characters into a story…`,
  (names, world) => `Almost ready…`,
];

// Quest id → game icon path
const QUEST_ICONS = {
  dungeon:      'lorc/dungeon-gate',
  rescue:       'lorc/imprisoned',
  treasure:     'lorc/open-treasure-chest',
  crash:        'lorc/rocket',
  pirates:      'lorc/pirate-skull',
  wildwest:     'delapouite/revolver',
  dreamworld:   'lorc/moon',
  spacemystery: 'lorc/ufo',
  haunted:      'lorc/ghost',
  gladiator:    'lorc/roman-shield',
  wasteland:    'lorc/radioactive',
  cybercity:    'lorc/hacking',
  olympus:      'lorc/zeus-sword',
  fairytale:    'lorc/fairy-wand',
  shogun:       'lorc/torii-gate',
  custom:       'lorc/scroll-quill',
};

export default function QuestGenerateScreen() {
  const { state, set } = useGame();
  const [generatedQuests, setGeneratedQuests] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingLine, setLoadingLine] = useState(0);
  const [customText, setCustomText] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [error, setError] = useState(false);

  const players = state.players || [];
  const world = state.world;
  const names = players.map(p => p.name).join(' and ') || 'the party';
  const worldName = world?.world || 'your world';

  // Rotate loading lines
  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setLoadingLine(l => (l + 1) % LOADING_LINES.length), 1200);
    return () => clearInterval(t);
  }, [loading]);

  // Generate quests on mount
  useEffect(() => {
    generateQuests();
  }, []);

  async function generateQuests() {
    setLoading(true);
    setError(false);

    const partyDesc = players.map(p =>
      `${p.name} (${p.className}, ${p.age || '?'} years old) — ${p.role || p.motivation || 'adventurer'}${p.backstory ? `. Background: ${p.backstory.slice(0, 100)}` : ''}`
    ).join('\n');

    const prompt = `You are a game master creating personalized quest hooks for a specific party of adventurers.

PARTY:
${partyDesc}

WORLD:
${world?.world || 'A fantasy world'}
Location: ${world?.location || 'Unknown'}
Tone: ${world?.tone || 'Epic & Exciting'}
${world?.extra ? `Extra lore: ${world.extra}` : ''}

Generate exactly 4 quest hooks that feel personally tailored to THIS specific party in THIS specific world. Reference the characters by name. Use their backstories and motivations to make the quest personal.

Each quest should have a different tone/style — one action-focused, one mystery, one personal/emotional, one wild card.

Respond ONLY with a JSON array of 4 objects, each with:
{
  "id": "unique_id",
  "icon": "single emoji",
  "name": "quest title (4-6 words)",
  "tagline": "one punchy sentence that hooks the player",
  "hint": "2-3 sentences for the GM: the core conflict, what's at stake, and a tracking mechanic",
  "start": "The opening line the GM reads aloud — vivid, immediate, drops players into action",
  "tone": "one of: Epic & Exciting | Mysterious & Wondrous | Dark & Mysterious | Funny & Silly",
  "sceneType": "one of: dungeon|cave|forest|plains|castle|ruins|ocean|space|village|city|desert|mountain|swamp|snow",
  "sceneTime": "one of: day|night|dawn|dusk|cave|storm"
}`;

    try {
      const response = await callAPI(
        [{ role: 'user', content: prompt }],
        'You are a creative game master. Generate personalized quest hooks. Respond only with valid JSON arrays.'
      );
      const clean = response.replace(/```json|```/g, '').trim();
      const quests = JSON.parse(clean);
      if (Array.isArray(quests) && quests.length > 0) {
        setGeneratedQuests(quests);
      } else {
        setError(true);
      }
    } catch (e) {
      console.warn('Quest generation failed:', e);
      setError(true);
    }
    setLoading(false);
  }

  function selectQuest(quest) {
    SFX.questSelected();
    set({
      goal: {
        id: quest.id,
        name: quest.name,
        icon: quest.icon,
        tagline: quest.tagline,
        hint: quest.hint,
        start: quest.start,
        tone: quest.tone,
        sceneType: quest.sceneType,
        sceneTime: quest.sceneTime,
        worldName: world?.world,
        worldLocation: world?.location,
        genre: quest.genre || 'fantasy',
      },
      screen: 'game',
    });
  }

  function selectPreset(quest) {
    SFX.questSelected();
    set({ goal: quest, screen: 'game' });
  }

  function handleCustomSubmit() {
    if (!customText.trim()) return;
    SFX.questSelected();
    const custom = {
      id: 'custom',
      icon: '✨',
      name: customText.slice(0, 40),
      tagline: customText,
      hint: `Custom quest: ${customText}. Build the story from what the players describe. Let their characters and world guide where it goes.`,
      start: `The adventure begins. ${customText}`,
      tone: world?.tone || 'Epic & Exciting',
      sceneType: 'plains',
      sceneTime: 'day',
      worldName: world?.world,
      worldLocation: world?.location,
      genre: 'fantasy',
    };
    set({ goal: custom, screen: 'game' });
  }

  const currentLoadingLine = LOADING_LINES[loadingLine](names, worldName);

  return (
    <div className="screen">
      <div className={styles.header}>
        <StepBar currentScreen="quest" />
      </div>

      <div className={styles.partyBanner}>
        {players.map((p, i) => (
          <span key={i} className={styles.partyChip}>
            <span className={styles.partyIcon}>{p.classIcon || '⚔'}</span>
            <span className={styles.partyName}>{p.name}</span>
          </span>
        ))}
        <span className={styles.partyWorld}>→ {worldName}</span>
      </div>

      {loading && (
        <div className={styles.loadingSection}>
          <div className={styles.loadingSpinnerWrap}>
            <div className={styles.loadingSpinner} />
            <div className={styles.loadingSpinnerInner} />
          </div>
          <div className={styles.loadingTitle}>The GM is crafting your story…</div>
          <div className={styles.loadingLine}>{currentLoadingLine}</div>
          <div className={styles.loadingParty}>
            {players.map((p, i) => (
              <div key={i} className={styles.loadingCharCard}>
                <span className={styles.loadingCharIcon}>{p.classIcon || '⚔'}</span>
                <span className={styles.loadingCharName}>{p.name}</span>
                <span className={styles.loadingCharClass}>{p.className}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && (error || !generatedQuests) && (
        <div className={styles.errorSection}>
          <p className={styles.errorMsg}>Quest generation stumbled. Choose a preset instead, or try again.</p>
          <div className={styles.errorActions}>
            <button className="btn-primary" onClick={generateQuests}>↻ Try Again</button>
            <button className="btn-ghost" onClick={() => setShowPresets(true)}>Browse Presets →</button>
          </div>
        </div>
      )}

      {!loading && generatedQuests && (
        <>
          <div className={styles.questTitle}>Choose your adventure</div>
          <div className={styles.questGrid}>
            {generatedQuests.map((quest, i) => (
              <button
                key={i}
                className={styles.questCard}
                onClick={() => selectQuest(quest)}
              >
                <div className={styles.questCardHeader}>
                  <span className={styles.questIcon}>
                    {QUEST_ICONS[quest.id]
                      ? <GameIcon path={QUEST_ICONS[quest.id]} size={28} tint="accent" />
                      : quest.icon}
                  </span>
                  <span className={styles.questTone}>{quest.tone}</span>
                </div>
                <div className={styles.questName}>{quest.name}</div>
                <div className={styles.questTagline}>{quest.tagline}</div>
                <div className={styles.questStart}>"{quest.start?.slice(0, 100)}{quest.start?.length > 100 ? '…' : ''}"</div>
              </button>
            ))}
          </div>

          <div className={styles.altOptions}>
            <button className={styles.altBtn} onClick={() => setShowCustom(s => !s)}>
              ✏ Write your own quest
            </button>
            <button className={styles.altBtn} onClick={() => setShowPresets(s => !s)}>
              📚 Browse preset quests
            </button>
            <button className={styles.altBtn} onClick={generateQuests}>
              ↻ Generate new options
            </button>
          </div>

          {showCustom && (
            <div className={styles.customSection}>
              <textarea
                className={styles.customInput}
                placeholder="Describe your quest… e.g. 'We need to stop the ancient dragon from waking before the eclipse'"
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                rows={2}
              />
              <button className="btn-primary" onClick={handleCustomSubmit} disabled={!customText.trim()}>
                Start This Quest →
              </button>
            </div>
          )}
        </>
      )}

      {showPresets && (
        <div className={styles.presetSection}>
          <div className={styles.presetTitle}>Preset Quests</div>
          <div className={styles.presetGrid}>
            {STORY_GOALS.map(quest => (
              <button
                key={quest.id}
                className={styles.presetCard}
                onClick={() => selectPreset(quest)}
              >
                <span className={styles.presetIcon}>
                    {QUEST_ICONS[quest.id]
                      ? <GameIcon path={QUEST_ICONS[quest.id]} size={20} tint="muted" />
                      : quest.icon}
                  </span>
                <div className={styles.presetInfo}>
                  <div className={styles.presetName}>{quest.name}</div>
                  <div className={styles.presetTagline}>{quest.tagline}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <button className="btn-ghost" onClick={() => set({ screen: 'world' })}>
          ← Back to World
        </button>
      </div>
    </div>
  );
}
