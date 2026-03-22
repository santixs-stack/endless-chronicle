import { SFX } from '../game/SoundEngine.js';
import { useState } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import styles from './JournalOverlay.module.css';

const TABS = ['Journal', 'NPCs', 'Codex', 'Bestiary'];

export default function JournalOverlay({ onClose }) {
  const { state } = useGame();
  const [tab, setTab] = useState('Journal');

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.title}>📖 Records</span>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        <div className={styles.tabs}>
          {TABS.map(t => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
              onClick={() => { SFX.tabSwitch(); setTab(t); }}
            >
              {t}
              {t === 'Journal' && state.journal?.length > 0 && (
                <span className={styles.badge}>{state.journal.length}</span>
              )}
              {t === 'NPCs' && state.npcs?.length > 0 && (
                <span className={styles.badge}>{state.npcs.length}</span>
              )}
              {t === 'Codex' && state.codex?.length > 0 && (
                <span className={styles.badge}>{state.codex.length}</span>
              )}
              {t === 'Bestiary' && state.bestiary?.length > 0 && (
                <span className={styles.badge}>{state.bestiary.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {tab === 'Journal' && (
            <div className={styles.list}>
              {(state.journal || []).length === 0
                ? <div className={styles.empty}>No journal entries yet. Keep adventuring!</div>
                : [...(state.journal || [])].reverse().map((entry, i) => (
                  <div key={i} className={styles.journalEntry}>
                    <span className={styles.entryDot}>·</span>
                    <span>{entry}</span>
                  </div>
                ))
              }
            </div>
          )}

          {tab === 'NPCs' && (
            <div className={styles.list}>
              {(state.npcs || []).length === 0
                ? <div className={styles.empty}>No NPCs encountered yet.</div>
                : (state.npcs || []).map((npc, i) => (
                  <div key={i} className={styles.npcCard}>
                    <div className={styles.npcHeader}>
                      <span className={styles.npcName}>{npc.name}</span>
                      <span className={`${styles.npcRel} ${styles[npc.relationship] || ''}`}>
                        {npc.relationship || 'neutral'}
                      </span>
                    </div>
                    {npc.role && <div className={styles.npcRole}>{npc.role}</div>}
                    {npc.note && <div className={styles.npcNote}>{npc.note}</div>}
                  </div>
                ))
              }
            </div>
          )}

          {tab === 'Codex' && (
            <div className={styles.list}>
              {(state.codex || []).length === 0
                ? <div className={styles.empty}>No lore discovered yet.</div>
                : (state.codex || []).map((entry, i) => (
                  <div key={i} className={styles.codexEntry}>
                    <div className={styles.codexHeader}>
                      <span className={styles.codexTitle}>{entry.title}</span>
                      <span className={styles.codexCat}>{entry.category}</span>
                    </div>
                    <div className={styles.codexBody}>{entry.body}</div>
                  </div>
                ))
              }
            </div>
          )}

          {tab === 'Bestiary' && (
            <div className={styles.list}>
              {(state.bestiary || []).length === 0
                ? <div className={styles.empty}>No creatures encountered yet.</div>
                : (state.bestiary || []).map((creature, i) => (
                  <div key={i} className={styles.beastCard}>
                    <div className={styles.beastName}>{creature.name}</div>
                    {creature.description && <div className={styles.beastDesc}>{creature.description}</div>}
                    {creature.kills > 0 && (
                      <div className={styles.beastKills}>Defeated: {creature.kills}×</div>
                    )}
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
