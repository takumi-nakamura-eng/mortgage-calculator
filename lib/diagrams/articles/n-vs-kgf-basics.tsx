import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function NVsKgfBasicsSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = 'Nとkgfの違いの概略図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg viewBox="0 0 560 260" preserveAspectRatio="xMidYMid meet" width={width} height={height} aria-label={ariaHidden ? undefined : ariaLabel} aria-hidden={ariaHidden} role={role} className={className} style={buildArticleDiagramStyle({ maxWidth, framed })}>
      <text x="102" y="92" fontSize="30" fontWeight="700" fill="#214d92">N と kgf</text>
      <text x="104" y="124" fontSize="20" fontWeight="700" fill="#55759a">単位の混同を防ぐ</text>
      <g transform="translate(284 54)">
        <rect x="0" y="24" width="90" height="72" rx="14" fill="#dbeafe" stroke="#5b86c4" strokeWidth="2" />
        <rect x="110" y="24" width="90" height="72" rx="14" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
        <text x="45" y="68" textAnchor="middle" fontSize="28" fontWeight="700" fill="#214d92">N</text>
        <text x="155" y="68" textAnchor="middle" fontSize="28" fontWeight="700" fill="#475569">kgf</text>
        <line x1="90" y1="60" x2="110" y2="60" stroke="#d35d5d" strokeWidth="3.5" />
        <polygon points="118,60 106,54 106,66" fill="#d35d5d" />
      </g>
    </svg>
  );
}
