import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function TubeSectionWeightComparisonSvg({
  width = 560,
  height = 200,
  maxWidth,
  ariaLabel = '角形と丸形の比較図',
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
      <rect x="120" y="60" width="100" height="100" fill="none" stroke="#1d4ed8" strokeWidth="8" />
      <circle cx="380" cy="110" r="50" fill="none" stroke="#dc2626" strokeWidth="8" />
      <text x="170" y="40" textAnchor="middle" fontSize="12">角形鋼管</text>
      <text x="380" y="40" textAnchor="middle" fontSize="12">丸形鋼管</text>
    </svg>
  );
}
