import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function CantileverBeamBasicsSvg({
  width = 560,
  height = 200,
  maxWidth,
  ariaLabel = '片持ち梁の模式図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg
      viewBox="0 0 560 200"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={buildArticleDiagramStyle({ maxWidth, framed })}
    >
      <rect x="60" y="40" width="20" height="120" fill="#d1d5db" stroke="#374151" strokeWidth="1.5" />
      <line x1="60" y1="40" x2="80" y2="60" stroke="#9ca3af" strokeWidth="1" />
      <line x1="60" y1="60" x2="80" y2="80" stroke="#9ca3af" strokeWidth="1" />
      <line x1="60" y1="80" x2="80" y2="100" stroke="#9ca3af" strokeWidth="1" />
      <line x1="60" y1="100" x2="80" y2="120" stroke="#9ca3af" strokeWidth="1" />
      <line x1="60" y1="120" x2="80" y2="140" stroke="#9ca3af" strokeWidth="1" />
      <line x1="60" y1="140" x2="80" y2="160" stroke="#9ca3af" strokeWidth="1" />
      <rect x="80" y="93" width="340" height="14" fill="#2563eb" rx="2" />
      <line x1="420" y1="40" x2="420" y2="90" stroke="#dc2626" strokeWidth="2.5" />
      <polygon points="420,92 414,80 426,80" fill="#dc2626" />
      <text x="420" y="32" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#dc2626">P</text>
      <line x1="80" y1="130" x2="420" y2="130" stroke="#374151" strokeWidth="1" />
      <line x1="80" y1="125" x2="80" y2="135" stroke="#374151" strokeWidth="1" />
      <line x1="420" y1="125" x2="420" y2="135" stroke="#374151" strokeWidth="1" />
      <text x="250" y="148" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#374151">L</text>
      <text x="52" y="105" textAnchor="middle" fontSize="10" fill="#555">固定端</text>
      <text x="420" y="115" textAnchor="middle" fontSize="10" fill="#555">自由端</text>
      <text x="100" y="180" fontSize="10" fill="#374151">M_fix = P×L（固定端モーメント）</text>
      <text x="100" y="195" fontSize="10" fill="#374151">δ_max（自由端たわみ）</text>
    </svg>
  );
}
