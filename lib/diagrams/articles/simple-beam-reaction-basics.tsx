import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function SimpleBeamReactionBasicsSvg({
  width = 400,
  height = 200,
  maxWidth,
  ariaLabel = '単純梁の支持条件と反力',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={buildArticleDiagramStyle({ maxWidth, framed })}
    >
      <line x1="60" y1="80" x2="340" y2="80" stroke="#111827" strokeWidth="6" />
      <polygon points="60,84 48,104 72,104" fill="#334155" />
      <polygon points="340,84 328,104 352,104" fill="none" stroke="#334155" strokeWidth="2" />
      <circle cx="340" cy="110" r="5" fill="none" stroke="#334155" strokeWidth="2" />
      <line x1="200" y1="30" x2="200" y2="74" stroke="#dc2626" strokeWidth="2.5" />
      <polygon points="200,80 194,70 206,70" fill="#dc2626" />
      <text x="200" y="22" textAnchor="middle" fontSize="12" fill="#dc2626">P</text>
      <line x1="60" y1="140" x2="60" y2="120" stroke="#2563eb" strokeWidth="2" />
      <polygon points="60,118 54,128 66,128" fill="#2563eb" />
      <text x="60" y="155" textAnchor="middle" fontSize="11" fill="#2563eb">R_A</text>
      <line x1="340" y1="140" x2="340" y2="120" stroke="#2563eb" strokeWidth="2" />
      <polygon points="340,118 334,128 346,128" fill="#2563eb" />
      <text x="340" y="155" textAnchor="middle" fontSize="11" fill="#2563eb">R_B</text>
      <text x="60" y="178" textAnchor="middle" fontSize="10" fill="#475569">ピン</text>
      <text x="340" y="178" textAnchor="middle" fontSize="10" fill="#475569">ローラー</text>
      <line x1="60" y1="190" x2="340" y2="190" stroke="#475569" strokeWidth="1" />
      <text x="200" y="200" textAnchor="middle" fontSize="11" fill="#334155">L</text>
    </svg>
  );
}
