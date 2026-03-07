import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function CChannelVsLightGaugeSelectionSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = 'C形鋼と軽量形鋼の比較図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg viewBox="0 0 560 260" preserveAspectRatio="xMidYMid meet" width={width} height={height} aria-label={ariaHidden ? undefined : ariaLabel} aria-hidden={ariaHidden} role={role} className={className} style={buildArticleDiagramStyle({ maxWidth, framed })}>
      <text x="82" y="92" fontSize="30" fontWeight="700" fill="#214d92">C形鋼比較</text>
      <text x="84" y="124" fontSize="20" fontWeight="700" fill="#55759a">下地と架台で使い分け</text>
      <g transform="translate(258 46)">
        <path d="M18 20 H98 V42 H42 V132 H98 V154 H18 Z" fill="#dbeafe" stroke="#5b86c4" strokeWidth="2" />
        <path d="M146 20 H232 V40 H168 V58 H218 V78 H168 V96 H232 V116 H168 V154 H146 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
      </g>
    </svg>
  );
}
