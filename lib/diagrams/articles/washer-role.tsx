import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function WasherRoleSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = '座金の配置と種類の説明図',
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
        座金の役割
      </text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">
        平座金とばね座金
      </text>

      <g transform="translate(248 30)">
        <rect x="0" y="154" width="180" height="28" rx="8" fill="#e2e8f0" />
        <rect x="76" y="16" width="28" height="138" rx="7" fill="#b9c7d7" />
        <rect x="56" y="132" width="68" height="12" rx="6" fill="#f6d3d3" stroke="#d35d5d" strokeWidth="2" />
        <rect x="44" y="144" width="92" height="12" rx="6" fill="#dbeafe" stroke="#5b86c4" strokeWidth="2" />
        <rect x="70" y="6" width="40" height="14" rx="7" fill="#6c7f93" />
        <text x="150" y="140" fontSize="18" fontWeight="700" fill="#d35d5d">ばね</text>
        <text x="150" y="158" fontSize="18" fontWeight="700" fill="#5b86c4">平座金</text>
      </g>
    </svg>
  );
}
