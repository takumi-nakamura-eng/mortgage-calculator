import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function BoltStrengthClassSelectionSvg({
  width = 400,
  height = 200,
  maxWidth,
  ariaLabel = 'ボルト強度区分の読み方',
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
      <rect x="40" y="30" width="320" height="140" rx="12" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="200" y="60" textAnchor="middle" fontSize="28" fontWeight="700" fill="#1d4ed8">8 . 8</text>
      <line x1="160" y1="72" x2="160" y2="100" stroke="#334155" strokeWidth="1.5" />
      <line x1="230" y1="72" x2="230" y2="100" stroke="#334155" strokeWidth="1.5" />
      <text x="160" y="118" textAnchor="middle" fontSize="11" fill="#334155">引張強さ ×100</text>
      <text x="160" y="133" textAnchor="middle" fontSize="11" fill="#64748b">= 800 MPa</text>
      <text x="230" y="118" textAnchor="middle" fontSize="11" fill="#334155">降伏比 ×10</text>
      <text x="230" y="133" textAnchor="middle" fontSize="11" fill="#64748b">= 0.8</text>
      <text x="200" y="160" textAnchor="middle" fontSize="12" fontWeight="600" fill="#dc2626">
        降伏点 = 800 × 0.8 = 640 MPa
      </text>
    </svg>
  );
}
