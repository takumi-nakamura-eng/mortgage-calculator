import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function DeflectionLimitLOverNSvg({
  width = 560,
  height = 210,
  maxWidth,
  ariaLabel = '許容たわみL/nの見方',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg
      viewBox="0 0 560 210"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={buildArticleDiagramStyle({ maxWidth, framed })}
    >
      <line x1="60" y1="118" x2="500" y2="118" stroke="#111827" strokeWidth="8" />
      <line x1="60" y1="160" x2="500" y2="160" stroke="#9ca3af" strokeWidth="1" strokeDasharray="5 5" />
      <path d="M60 118 Q280 72 500 118" fill="none" stroke="#2563eb" strokeWidth="3" />
      <line x1="280" y1="118" x2="280" y2="160" stroke="#dc2626" strokeWidth="2" />
      <text x="280" y="182" textAnchor="middle" fontSize="12">δ_allow = L / n</text>
      <text x="280" y="198" textAnchor="middle" fontSize="12">
        nが大きいほど許容たわみは小さい（厳しい）
      </text>
    </svg>
  );
}
