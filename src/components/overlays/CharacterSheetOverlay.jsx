import { useState } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import { PLAYER_COLORS } from '../../lib/constants.js';
import GameIcon from '../ui/GameIcon.jsx';
import styles from './CharacterSheetOverlay.module.css';

// Base class secondary abilities (2 per class — always available regardless of genre)
const BASE_CLASS_ABILITIES = {
  warrior:     ['🛡 Endure — shrug off a hit that would stop anyone else', '💪 Cleave — hit every enemy in reach with one strike'],
  mage:        ['✨ Improvise — attempt any magical effect once per scene', '🌀 Counter — disrupt an enemy action with opposing magic'],
  rogue:       ['🌑 Vanish — disappear into any shadow or crowd instantly', '🎯 Exploit — find and use one hidden weakness per target'],
  ranger:      ['🐾 Track — follow any trail no matter how old or hidden', '🌿 Bond — one animal nearby will do one thing you ask'],
  healer:      ['💚 Stabilize — stop anyone from dying, right now', '🌟 Cleanse — remove one curse, poison, or condition instantly'],
  bard:        ['🎭 Read the Room — know exactly what anyone wants to hear', '📖 Recall — know one relevant fact about anything you encounter'],
  spaceranger: ['📡 Scan — analyze any object, creature, or system in seconds', '🔧 MacGyver — improvise any device from available parts'],
  pirate:      ['💰 Loot — find something valuable in any situation', '🏴 Intimidate — make one enemy hesitate or back down'],
};

// Build the abilities list for a player from their actual stored data
function getPlayerAbilities(player) {
  const cls = (player.class || 'warrior').toLowerCase();
  const base = BASE_CLASS_ABILITIES[cls] || BASE_CLASS_ABILITIES.warrior;
  // Signature ability comes from player.special (set during char creation, genre-aware)
  const sig = player.special
    ? [`⭐ ${player.archetypeName || 'Signature'}: ${player.special}`]
    : [];
  return [...sig, ...base];
}

const XP_THRESHOLDS = [0, 100, 250, 450, 700, 1000];

function XpBar({ current, level }) {
  const prev = XP_THRESHOLDS[level - 1] || 0;
  const next = XP_THRESHOLDS[level] || XP_THRESHOLDS[XP_THRESHOLDS.length - 1];
  const pct = next > prev ? Math.min(100, ((current - prev) / (next - prev)) * 100) : 100;
  return (
    <div className={styles.xpSection}>
      <div className={styles.xpHeader}>
        <span className={styles.xpLabel}>XP — Level {level}</span>
        <span className={styles.xpVal}>{current} / {next}</span>
      </div>
      <div className={styles.xpTrack}>
        <div className={styles.xpFill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function CharacterSheetOverlay({ onClose }) {
  const { state } = useGame();
  const [activeIdx, setActiveIdx] = useState(0);
  const players = state.players || [];
  const player = players[activeIdx];
  if (!player) return null;

  const color = PLAYER_COLORS[activeIdx] || '#c4a84f';
  const cls = (player.class || player.className || '').toLowerCase();
  const abilities = getPlayerAbilities(player);
  const hpPct = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
  const status = hpPct === 0 ? 'Fallen' : hpPct < 30 ? 'Critical' : hpPct < 60 ? 'Bloodied' : 'Healthy';
  const statusColor = hpPct === 0 ? '#e05555' : hpPct < 30 ? '#e05555' : hpPct < 60 ? '#e09030' : '#6dbb7c';

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.sheet}>
        <div className={styles.header} style={{ borderTopColor: color }}>
          <div className={styles.headerLeft}>
            <div className={styles.classIcon}>
              {player.classIcon && player.classIcon.includes('/')
                ? <GameIcon path={player.classIcon} size={28} tint="accent" />
                : <span style={{ fontSize: '1.6rem' }}>{player.classIcon || '⚔'}</span>
              }
            </div>
            <div>
              <div className={styles.playerName} style={{ color }}>{player.name}</div>
              <div className={styles.playerSub}>{player.className} · Age {player.age || '?'} · Level {player.level || 1}</div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {players.length > 1 && (
          <div className={styles.tabs}>
            {players.map((p, i) => (
              <button key={i}
                className={`${styles.tab} ${i === activeIdx ? styles.tabActive : ''}`}
                style={i === activeIdx ? { borderBottomColor: PLAYER_COLORS[i] } : undefined}
                onClick={() => setActiveIdx(i)}>
                <span className={styles.tabDot} style={{ background: PLAYER_COLORS[i] }} />
                {p.name}
              </button>
            ))}
          </div>
        )}

        <div className={styles.body}>
          <div className={styles.col}>
            <div className={styles.sectionTitle}>Vitals</div>
            <div className={styles.statBlock}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Hit Points</span>
                <span className={styles.statStatus} style={{ color: statusColor }}>{status}</span>
              </div>
              <div className={styles.hpBarTrack}>
                <div className={styles.hpBarFill} style={{ width: `${hpPct}%`, background: statusColor }} />
              </div>
              <div className={styles.hpNumbers}>
                <span style={{ color: statusColor, fontWeight: 700 }}>{player.hp}</span>
                <span className={styles.hpSep}> / </span>
                <span>{player.maxHp}</span>
              </div>
            </div>
            <XpBar current={player.xp || 0} level={player.level || 1} />

            {/* ── Stats grid ── */}
            <div className={styles.sectionTitle} style={{ marginTop: '0.8rem' }}>Attributes</div>
            <div className={styles.statsGrid}>
              {[
                { key: 'str', label: 'STR', desc: 'Strength' },
                { key: 'dex', label: 'DEX', desc: 'Dexterity' },
                { key: 'int', label: 'INT', desc: 'Intelligence' },
                { key: 'wis', label: 'WIS', desc: 'Wisdom' },
                { key: 'con', label: 'CON', desc: 'Constitution' },
              ].map(({ key, label, desc }) => {
                const val = player[key] || 10;
                const mod = Math.floor((val - 10) / 2);
                const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
                const barPct = Math.min(100, (val / 20) * 100);
                return (
                  <div key={key} className={styles.statRow} title={desc}>
                    <span className={styles.statLabelShort}>{label}</span>
                    <div className={styles.statBarTrack}>
                      <div className={styles.statBarFill} style={{ width: `${barPct}%` }} />
                    </div>
                    <span className={styles.statValNum}>{val}</span>
                    <span className={styles.statMod}>{modStr}</span>
                  </div>
                );
              })}
            </div>
            <div className={styles.sectionTitle} style={{ marginTop: '0.8rem' }}>Character</div>
            <div className={styles.statBlock}>
              <div className={styles.statLabel}>Background</div>
              <div className={styles.statValue}>{player.role || '—'}</div>
            </div>
            {player.trait && (
              <div className={styles.statBlock}>
                <div className={styles.statLabel}>Trait</div>
                <div className={styles.statValue}>{player.trait}</div>
              </div>
            )}
            {player.motivation && (
              <div className={styles.statBlock}>
                <div className={styles.statLabel}>Motivation</div>
                <div className={styles.statValue}>{player.motivation}</div>
              </div>
            )}
            {player.bond && (
              <div className={styles.statBlock}>
                <div className={styles.statLabel}>Bond</div>
                <div className={styles.statValue}>{player.bond}</div>
              </div>
            )}
            {player.flaw && (
              <div className={styles.statBlock}>
                <div className={styles.statLabel}>Flaw</div>
                <div className={styles.statValue}>{player.flaw}</div>
              </div>
            )}
            {player.specialty && (
              <div className={styles.statBlock}>
                <div className={styles.statLabel}>Specialty</div>
                <div className={styles.statValue}>{player.specialty}</div>
              </div>
            )}
          </div>

          <div className={styles.col}>
            <div className={styles.sectionTitle}>Class Abilities</div>
            <div className={styles.abilitiesList}>
              {abilities.map((ab, i) => (
                <div key={i} className={styles.ability}>
                  <span className={styles.abilityText}>{ab}</span>
                </div>
              ))}
            </div>
            {player.backstory && (
              <>
                <div className={styles.sectionTitle} style={{ marginTop: '1rem' }}>Backstory</div>
                <div className={styles.backstory}>{player.backstory}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
