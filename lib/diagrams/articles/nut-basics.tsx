import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function NutBasicsSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = 'ナット断面と高さ寸法の説明図',
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
        六角ナット
      </text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">
        1種と3種
      </text>
      <g transform="translate(250 32)">
        <polygon points="0,72 34,28 92,28 126,72 92,116 34,116" fill="#dbeafe" stroke="#5b86c4" strokeWidth="2" />
        <circle cx="63" cy="72" r="20" fill="#f8fbff" stroke="#8ea4bd" strokeWidth="2" />
        <line x1="144" y1="28" x2="144" y2="116" stroke="#d35d5d" strokeWidth="3" />
        <rect x="188" y="38" width="58" height="78" rx="6" fill="#dbeafe" stroke="#5b86c4" strokeWidth="2" />
        <rect x="264" y="62" width="58" height="54" rx="6" fill="#eef3f8" stroke="#8ea4bd" strokeWidth="2" />
      </g>
    </svg>
  );
}
