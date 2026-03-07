import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function ChemicalVsMechanicalAnchorSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = '接着系と金属系アンカーの比較図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg viewBox="0 0 560 260" preserveAspectRatio="xMidYMid meet" width={width} height={height} aria-label={ariaHidden ? undefined : ariaLabel} aria-hidden={ariaHidden} role={role} className={className} style={buildArticleDiagramStyle({ maxWidth, framed })}>
      <text x="92" y="92" fontSize="30" fontWeight="700" fill="#214d92">接着系と金属系</text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">アンカー比較</text>
      <g transform="translate(258 40)">
        <rect x="0" y="136" width="90" height="22" rx="8" fill="#e2e8f0" />
        <rect x="18" y="46" width="14" height="90" rx="6" fill="#b9c7d7" />
        <rect x="12" y="28" width="26" height="20" rx="6" fill="#6c7f93" />
        <rect x="114" y="136" width="90" height="22" rx="8" fill="#e2e8f0" />
        <rect x="154" y="26" width="12" height="110" rx="6" fill="#d35d5d" />
        <path d="M138 40 Q160 10 182 40" fill="none" stroke="#d35d5d" strokeWidth="6" strokeLinecap="round" />
      </g>
    </svg>
  );
}
