import { useGame } from '../../hooks/useGameState.jsx';
import { PLAYER_COLORS } from '../../lib/constants.js';
import styles from './CombatBanner.module.css';

export default function CombatBanner() {
  const { state } = useGame();
  if (!state.inCombat || !state.combatants?.length) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.header}>
        <span className={styles.title}>⚔ COMBAT</span>
        <span className={styles.round}>Round {state.combatRound || 1}</span>
      </div>
      <div className={styles.combatants}>
        {state.combatants.map((c, i) => {
          const isActive = i === (state.combatantIdx || 0);
          const isPlayer = c.isPlayer;
          const hpPct = c.maxHp ? Math.max(0, (c.hp / c.maxHp) * 100) : 100;
          const playerColor = isPlayer
            ? PLAYER_COLORS[state.players?.findIndex(p => p.name === c.name) || 0]
            : '#e05555';

          return (
            <div key={i} className={`${styles.combatant} ${isActive ? styles.active : ''}`}>
              <div className={styles.cName} style={isActive ? { color: playerColor } : {}}>
                {isActive && <span className={styles.arrow}>▶ </span>}
                {c.name}
              </div>
              <div className={styles.hpRow}>
                <div className={styles.hpTrack}>
                  <div
                    className={styles.hpFill}
                    style={{
                      width: `${hpPct}%`,
                      background: isPlayer ? playerColor : '#e05555',
                    }}
                  />
                </div>
                <span className={styles.hpVal}>{c.hp}/{c.maxHp || '?'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
