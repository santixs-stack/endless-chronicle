import { useState } from 'react';
import { useGame } from '../../hooks/useGameState.jsx';
import { PLAYER_COLORS } from '../../lib/constants.js';
import styles from './CharacterSheetOverlay.module.css';

const CLASS_ABILITIES = {
  warrior:     ['⚔ Power Strike — heavy weapon attack', '🛡 Shield Wall — reduce incoming damage', '💪 Battle Cry — boost party morale'],
  mage:        ['🔮 Arcane Bolt — magical ranged attack', '✨ Spellweave — combine two spells', '🌀 Blink — short-range teleport'],
  rogue:       ['🗡 Backstab — high damage from stealth', '🌑 Shadow Step — move unseen', '🎯 Exploit Weakness — find enemy weak point'],
  ranger:      ['🏹 Precise Shot — long-range accuracy', '🐾 Track — follow any trail', '🌿 Nature Bond — communicate with animals'],
  healer:      ['💚 Mend — restore HP to any ally', '✝ Cleanse — remove curses and poison', '🌟 Revive — bring downed ally back'],
  bard:        ['🎵 Inspire — buff all party members', '📖 Lore Check — recall useful knowledge', '🎭 Disguise — alter appearance briefly'],
  spaceranger: ['🔫 Plasma Shot — ranged energy attack', '🚀 Jetpack Dash — rapid movement', '📡 Scan — analyze any object or creature'],
  pirate:      ['⚓ Boarding Strike — overwhelming attack', '🏴 Intimidate — frighten single enemy', '💰 Loot — find hidden valuables'],
};

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
  const abilities = CLASS_ABILITIES[cls] || CLASS_ABILITIES.warrior;
  const hpPct = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
  const status = hpPct === 0 ? 'Fallen' : hpPct < 30 ? 'Critical' : hpPct < 60 ? 'Bloodied' : 'Healthy';
  const statusColor = hpPct === 0 ? '#e05555' : hpPct < 30 ? '#e05555' : hpPct < 60 ? '#e09030' : '#6dbb7c';

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.sheet}>
        <div className={styles.header} style={{ borderTopColor: color }}>
          <div className={styles.headerLeft}>
            <div className={styles.classIcon}>{player.classIcon || '⚔'}</div>
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
