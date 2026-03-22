// ═══════════════════════════════════════════
//  GAME ICON COMPONENT
//  Renders icons from game-icons.net
//  White SVGs with CSS tinting support.
//  Falls back to emoji if icon not found.
// ═══════════════════════════════════════════

const ICON_BASE = '/icons/icons/ffffff/transparent/1x1';

// CSS filter presets for common tints
export const ICON_TINTS = {
  accent:   'brightness(0) saturate(100%) invert(75%) sepia(40%) saturate(600%) hue-rotate(5deg) brightness(0.95)',
  gold:     'brightness(0) saturate(100%) invert(80%) sepia(50%) saturate(500%) hue-rotate(5deg)',
  red:      'brightness(0) saturate(100%) invert(30%) sepia(90%) saturate(500%) hue-rotate(320deg)',
  green:    'brightness(0) saturate(100%) invert(60%) sepia(50%) saturate(400%) hue-rotate(90deg)',
  blue:     'brightness(0) saturate(100%) invert(50%) sepia(60%) saturate(400%) hue-rotate(190deg)',
  purple:   'brightness(0) saturate(100%) invert(40%) sepia(60%) saturate(400%) hue-rotate(250deg)',
  white:    'brightness(0) invert(1)',
  muted:    'brightness(0) invert(1) opacity(0.4)',
  dim:      'brightness(0) invert(1) opacity(0.2)',
};

export default function GameIcon({
  path,           // e.g. 'lorc/broadsword'
  size = 24,      // px
  tint = 'white', // preset name or raw CSS filter string
  opacity,        // override opacity
  className,
  style,
  alt = '',
}) {
  const filter = ICON_TINTS[tint] || tint;
  const src = `${ICON_BASE}/${path}.svg`;

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={alt}
      className={className}
      style={{
        filter,
        opacity,
        flexShrink: 0,
        display: 'inline-block',
        verticalAlign: 'middle',
        ...style,
      }}
      onError={e => {
        // Replace missing icon with a neutral diamond placeholder
        // so blank spaces are visible rather than silent
        e.target.style.display = 'none';
        const span = document.createElement('span');
        span.style.cssText = `width:${size}px;height:${size}px;display:inline-flex;align-items:center;justify-content:center;opacity:0.25;font-size:${Math.round(size*0.7)}px;flex-shrink:0;vertical-align:middle;`;
        span.textContent = '◆';
        e.target.parentNode?.insertBefore(span, e.target);
      }}
    />
  );
}

// Convenience — icon by author/name string
export function GIcon({ name, size, tint, ...rest }) {
  return <GameIcon path={name} size={size} tint={tint} {...rest} />;
}
