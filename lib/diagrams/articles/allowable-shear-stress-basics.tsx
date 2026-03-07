import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function AllowableShearStressBasicsSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = '許容せん断応力の概略図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg viewBox="0 0 560 260" preserveAspectRatio="xMidYMid meet" width={width} height={height} aria-label={ariaHidden ? undefined : ariaLabel} aria-hidden={ariaHidden} role={role} className={className} style={buildArticleDiagramStyle({ maxWidth, framed })}>
      <text x="74" y="92" fontSize="30" fontWeight="700" fill="#214d92">許容せん断応力</text>
      <text x="76" y="124" fontSize="20" fontWeight="700" fill="#55759a">ボルトと部材の一次判断</text>
      <g transform="translate(262 42)">
        <rect x="22" y="44" width="74" height="92" rx="10" fill="#dbeafe" stroke="#5b86c4" strokeWidth="2" />
        <rect x="96" y="44" width="74" height="92" rx="10" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
        <line x1="56" y1="90" x2="132" y2="90" stroke="#d35d5d" strokeWidth="4" />
        <polygon points="142,90 128,84 128,96" fill="#d35d5d" />
        <line x1="58" y1="110" x2="134" y2="110" stroke="#d35d5d" strokeWidth="4" />
        <polygon points="48,110 62,104 62,116" fill="#d35d5d" />
      </g>
    </svg>
  );
}
