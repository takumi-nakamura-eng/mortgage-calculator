import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function AllowableStressBasicsSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = '許容応力の図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg
      viewBox="0 0 560 260"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={buildArticleDiagramStyle({ maxWidth, framed })}
    >
      <text x="92" y="92" fontSize="30" fontWeight="700" fill="#214d92">
        許容曲げ応力
      </text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">
        σallow と判定
      </text>
      <g transform="translate(248 46)">
        <rect x="0" y="46" width="206" height="26" rx="8" fill="#d9efe2" />
        <rect x="0" y="94" width="148" height="26" rx="8" fill="#dbeafe" />
        <line x1="148" y1="86" x2="148" y2="138" stroke="#d35d5d" strokeWidth="3" />
        <text x="162" y="116" fontSize="18" fontWeight="700" fill="#d35d5d">≤</text>
      </g>
    </svg>
  );
}
