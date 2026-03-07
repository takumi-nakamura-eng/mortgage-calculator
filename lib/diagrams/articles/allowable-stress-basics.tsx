import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function AllowableStressBasicsSvg({
  width = 560,
  height = 200,
  maxWidth,
  ariaLabel = '許容応力の図',
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
      <rect x="80" y="60" width="400" height="24" fill="#d1fae5" />
      <rect x="80" y="96" width="300" height="24" fill="#bfdbfe" />
      <text x="285" y="77" textAnchor="middle" fontSize="12">許容応力帯</text>
      <text x="230" y="113" textAnchor="middle" fontSize="12">実応力</text>
      <line x1="380" y1="96" x2="380" y2="150" stroke="#ef4444" strokeWidth="2" />
      <text x="380" y="164" textAnchor="middle" fontSize="12">σmax ≤ σallow</text>
    </svg>
  );
}
