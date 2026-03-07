import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function SimpleBeamReactionBasicsSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = '単純梁の支持条件と反力',
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
      <text x="84" y="90" fontSize="30" fontWeight="700" fill="#214d92">
        単純梁
      </text>
      <text x="86" y="122" fontSize="20" fontWeight="700" fill="#55759a">
        reaction
      </text>

      <g transform="translate(206 26)">
        <line x1="26" y1="116" x2="286" y2="116" stroke="#23415f" strokeWidth="12" strokeLinecap="round" />
        <polygon points="54,116 40,140 68,140" fill="#6d87a6" />
        <polygon points="258,116 246,138 270,138" fill="none" stroke="#6d87a6" strokeWidth="3" />
        <circle cx="258" cy="145" r="5.5" fill="none" stroke="#6d87a6" strokeWidth="3" />
        <line x1="156" y1="42" x2="156" y2="102" stroke="#d35d5d" strokeWidth="4" strokeLinecap="round" />
        <polygon points="156,116 148,100 164,100" fill="#d35d5d" />
        <line x1="54" y1="174" x2="54" y2="136" stroke="#5a86c6" strokeWidth="3.5" strokeLinecap="round" />
        <polygon points="54,126 46,140 62,140" fill="#5a86c6" />
        <line x1="258" y1="174" x2="258" y2="136" stroke="#5a86c6" strokeWidth="3.5" strokeLinecap="round" />
        <polygon points="258,126 250,140 266,140" fill="#5a86c6" />
      </g>
    </svg>
  );
}
