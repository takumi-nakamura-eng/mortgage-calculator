import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function SectionModulusBasicsSvg({
  width = 560,
  height = 200,
  maxWidth,
  ariaLabel = '断面係数の図',
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
      <rect x="80" y="40" width="120" height="120" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
      <line x1="80" y1="100" x2="200" y2="100" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 4" />
      <line x1="300" y1="120" x2="460" y2="120" stroke="#111827" strokeWidth="8" />
      <line x1="380" y1="120" x2="380" y2="70" stroke="#ef4444" strokeWidth="3" />
      <text x="140" y="95" textAnchor="middle" fontSize="12">中立軸</text>
      <text x="380" y="60" textAnchor="middle" fontSize="12">σ = M / Z</text>
    </svg>
  );
}
