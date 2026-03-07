import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function MomentOfInertiaBasicsSvg({
  width = 320,
  height = 220,
  maxWidth,
  ariaLabel = '断面二次モーメントIとたわみの関係',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg
      viewBox="0 0 320 220"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={buildArticleDiagramStyle({ maxWidth, framed })}
    >
      <line x1="70" y1="88" x2="250" y2="88" stroke="#111827" strokeWidth="8" />
      <path d="M70 88 Q160 48 250 88" fill="none" stroke="#ef4444" strokeWidth="3" />
      <line x1="70" y1="164" x2="250" y2="164" stroke="#111827" strokeWidth="8" />
      <path d="M70 164 Q160 142 250 164" fill="none" stroke="#2563eb" strokeWidth="3" />
      <text x="160" y="34" textAnchor="middle" fontSize="12">Iが小さい: たわみ大</text>
      <text x="160" y="204" textAnchor="middle" fontSize="12">Iが大きい: たわみ小</text>
    </svg>
  );
}
