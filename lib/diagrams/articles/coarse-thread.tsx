import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function CoarseThreadSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = '並目と細目のイメージ',
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
        並目ねじ
      </text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">
        pitch の違い
      </text>
      <g transform="translate(248 52)">
        <polyline
          points="0,112 34,78 68,112 102,78 136,112 170,78 204,112"
          fill="none"
          stroke="#5b86c4"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="120,164 140,132 160,164 180,132 200,164 220,132 240,164 260,132 280,164"
          fill="none"
          stroke="#d35d5d"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
