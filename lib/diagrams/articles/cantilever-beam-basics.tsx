import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function CantileverBeamBasicsSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = '片持ち梁の模式図',
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
        片持ち梁
      </text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">
        cantilever
      </text>

      <g transform="translate(206 38)">
        <rect x="0" y="26" width="22" height="152" rx="6" fill="#d2dbe7" />
        <line x1="0" y1="40" x2="22" y2="58" stroke="#9fb1c7" strokeWidth="1.4" />
        <line x1="0" y1="64" x2="22" y2="82" stroke="#9fb1c7" strokeWidth="1.4" />
        <line x1="0" y1="88" x2="22" y2="106" stroke="#9fb1c7" strokeWidth="1.4" />
        <line x1="0" y1="112" x2="22" y2="130" stroke="#9fb1c7" strokeWidth="1.4" />
        <line x1="0" y1="136" x2="22" y2="154" stroke="#9fb1c7" strokeWidth="1.4" />
        <rect x="22" y="96" width="250" height="14" rx="7" fill="#5b86c4" />
        <path d="M22 103 Q132 100 272 114" fill="none" stroke="#8fb5e2" strokeWidth="4" strokeLinecap="round" />
        <line x1="272" y1="36" x2="272" y2="86" stroke="#d35d5d" strokeWidth="3.5" strokeLinecap="round" />
        <polygon points="272,98 264,82 280,82" fill="#d35d5d" />
        <text x="272" y="26" textAnchor="middle" fontSize="16" fontWeight="700" fill="#d35d5d">P</text>
        <text x="238" y="138" fontSize="28" fontWeight="700" fill="#5b86c4">δ</text>
      </g>
    </svg>
  );
}
