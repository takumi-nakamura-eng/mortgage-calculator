import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function BeamSelfWeightCalculationSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = '梁の自重計算の概略図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg viewBox="0 0 560 260" preserveAspectRatio="xMidYMid meet" width={width} height={height} aria-label={ariaHidden ? undefined : ariaLabel} aria-hidden={ariaHidden} role={role} className={className} style={buildArticleDiagramStyle({ maxWidth, framed })}>
      <text x="86" y="92" fontSize="30" fontWeight="700" fill="#214d92">梁の自重</text>
      <text x="88" y="124" fontSize="20" fontWeight="700" fill="#55759a">kg/m から kN/m</text>
      <g transform="translate(250 38)">
        <rect x="18" y="28" width="142" height="18" rx="7" fill="#dbeafe" stroke="#5b86c4" strokeWidth="2" />
        <rect x="76" y="46" width="26" height="100" rx="6" fill="#b9c7d7" />
        <rect x="18" y="146" width="142" height="18" rx="7" fill="#dbeafe" stroke="#5b86c4" strokeWidth="2" />
        <line x1="184" y1="46" x2="184" y2="146" stroke="#5b86c4" strokeWidth="3" />
        <line x1="198" y1="46" x2="198" y2="146" stroke="#5b86c4" strokeWidth="3" />
        <line x1="212" y1="46" x2="212" y2="146" stroke="#5b86c4" strokeWidth="3" />
      </g>
    </svg>
  );
}
