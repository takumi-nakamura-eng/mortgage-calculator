import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function SteelWeightCalculationBasicsSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = '鋼材重量計算の概略図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg viewBox="0 0 560 260" preserveAspectRatio="xMidYMid meet" width={width} height={height} aria-label={ariaHidden ? undefined : ariaLabel} aria-hidden={ariaHidden} role={role} className={className} style={buildArticleDiagramStyle({ maxWidth, framed })}>
      <text x="92" y="92" fontSize="30" fontWeight="700" fill="#214d92">鋼材重量</text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">kg/m と総重量</text>
      <g transform="translate(258 38)">
        <rect x="0" y="44" width="138" height="22" rx="8" fill="#dbeafe" stroke="#5b86c4" strokeWidth="2" />
        <rect x="54" y="66" width="30" height="86" rx="6" fill="#b9c7d7" />
        <line x1="158" y1="86" x2="198" y2="86" stroke="#5b86c4" strokeWidth="4" />
        <line x1="158" y1="118" x2="214" y2="118" stroke="#5b86c4" strokeWidth="4" />
        <line x1="158" y1="150" x2="228" y2="150" stroke="#5b86c4" strokeWidth="4" />
      </g>
    </svg>
  );
}
