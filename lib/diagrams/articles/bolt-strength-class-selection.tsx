import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function BoltStrengthClassSelectionSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = 'ボルト強度区分の読み方',
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
        強度区分
      </text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">
        8.8 の見方
      </text>

      <g transform="translate(246 36)">
        <rect x="16" y="54" width="138" height="26" rx="8" fill="#dbeafe" stroke="#5b86c4" strokeWidth="2" />
        <rect x="68" y="80" width="34" height="110" rx="6" fill="#b9c7d7" />
        <rect x="28" y="190" width="114" height="20" rx="8" fill="#d6e4f4" />
        <text x="84" y="42" textAnchor="middle" fontSize="36" fontWeight="700" fill="#244a84">
          8.8
        </text>
        <line x1="57" y1="46" x2="57" y2="18" stroke="#d35d5d" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="112" y1="46" x2="112" y2="18" stroke="#5a86c6" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="57" cy="15" r="6" fill="#f8d3d3" stroke="#d35d5d" strokeWidth="2" />
        <circle cx="112" cy="15" r="6" fill="#dbeafe" stroke="#5a86c6" strokeWidth="2" />
      </g>
    </svg>
  );
}
