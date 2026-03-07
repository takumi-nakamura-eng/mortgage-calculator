import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function MomentOfInertiaBasicsSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = '断面二次モーメントIとたわみの関係',
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
        断面二次モーメント
      </text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">
        I とたわみ
      </text>
      <g transform="translate(244 36)">
        <line x1="0" y1="78" x2="204" y2="78" stroke="#6c7f93" strokeWidth="12" strokeLinecap="round" />
        <path d="M0 78 Q102 26 204 78" fill="none" stroke="#d35d5d" strokeWidth="4" strokeLinecap="round" />
        <line x1="0" y1="162" x2="204" y2="162" stroke="#6c7f93" strokeWidth="12" strokeLinecap="round" />
        <path d="M0 162 Q102 138 204 162" fill="none" stroke="#5b86c4" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}
