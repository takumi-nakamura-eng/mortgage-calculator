import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function DeflectionLimitLOverNSvg({
  width = 560,
  height = 200,
  maxWidth,
  ariaLabel = '許容たわみ L/200・L/300・L/400 の選び方',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg
      viewBox="0 0 560 200"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={buildArticleDiagramStyle({ maxWidth, framed })}
    >
      <rect x="0" y="0" width="560" height="200" fill="#f8fafc" />
      <rect x="20" y="18" width="520" height="164" rx="18" fill="#ffffff" stroke="#cbd5e1" />

      <text x="280" y="72" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0f172a">
        L/200・L/300・L/400 の選び方
      </text>

      <line x1="72" y1="136" x2="488" y2="136" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
      <polygon points="92,136 80,154 104,154" fill="#334155" />
      <polygon points="468,136 456,154 480,154" fill="none" stroke="#334155" strokeWidth="2" />
      <circle cx="468" cy="160" r="4" fill="none" stroke="#334155" strokeWidth="2" />

      <path d="M72 136 Q280 102 488 136" fill="none" stroke="#2563eb" strokeWidth="3.5" />
    </svg>
  );
}
