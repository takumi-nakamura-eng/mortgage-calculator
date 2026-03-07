import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function GripLengthBasicsSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = 'ボルト長さの決め方とグリップ長の見方',
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
      <text x="92" y="92" fontSize="32" fontWeight="700" fill="#214d92">
        ボルト長さ
      </text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">
        グリップ長
      </text>

      <g transform="translate(210 28)">
        <rect x="94" y="18" width="78" height="22" rx="5" fill="#6b7c93" />
        <rect x="124" y="40" width="18" height="150" rx="3" fill="#9aa9bc" />
        <rect x="102" y="40" width="62" height="10" rx="2" fill="#dbeafe" stroke="#5b86c4" strokeWidth="1.5" />
        <rect x="104" y="50" width="58" height="8" rx="2" fill="#fde2e2" stroke="#dd6b6b" strokeWidth="1.2" />
        <rect x="74" y="58" width="118" height="44" fill="#e8eef5" stroke="#8aa0bb" strokeWidth="1.5" />
        <rect x="74" y="102" width="118" height="44" fill="#f4f7fa" stroke="#8aa0bb" strokeWidth="1.5" />
        <rect x="101" y="146" width="64" height="20" rx="4" fill="#d9e9fb" stroke="#5b86c4" strokeWidth="1.5" />
        <line x1="50" y1="40" x2="50" y2="146" stroke="#45a06b" strokeWidth="3" />
        <line x1="44" y1="40" x2="56" y2="40" stroke="#45a06b" strokeWidth="2" />
        <line x1="44" y1="146" x2="56" y2="146" stroke="#45a06b" strokeWidth="2" />
        <text
          x="30"
          y="93"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="#2f7a52"
          transform="rotate(-90, 30, 93)"
        >
          grip
        </text>
      </g>
    </svg>
  );
}
