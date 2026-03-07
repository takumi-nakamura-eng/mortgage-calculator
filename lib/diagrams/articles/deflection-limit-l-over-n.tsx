import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function DeflectionLimitLOverNSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = '許容たわみ L/200・L/300・L/400 の選び方',
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
      <text x="138" y="88" fontSize="34" fontWeight="700" fill="#214d92">
        許容たわみ
      </text>

      <g transform="translate(70 8)">
        <line x1="78" y1="156" x2="358" y2="156" stroke="#23415f" strokeWidth="14" strokeLinecap="round" />
        <polygon points="118,156 100,186 136,186" fill="#6883a5" />
        <polygon points="316,156 300,186 332,186" fill="none" stroke="#6883a5" strokeWidth="3" />
        <circle cx="316" cy="198" r="6.5" fill="none" stroke="#6883a5" strokeWidth="3" />
        <path d="M78 156 Q218 78 358 156" fill="none" stroke="#5e88c7" strokeWidth="5.5" strokeLinecap="round" />
        <text x="292" y="112" fontSize="22" fontWeight="700" fill="#4d74ad">δ</text>
      </g>
    </svg>
  );
}
