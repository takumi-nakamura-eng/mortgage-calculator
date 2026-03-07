import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function AnchorBoltSelectionBasicsSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = 'アンカーボルト選定の概略図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg viewBox="0 0 560 260" preserveAspectRatio="xMidYMid meet" width={width} height={height} aria-label={ariaHidden ? undefined : ariaLabel} aria-hidden={ariaHidden} role={role} className={className} style={buildArticleDiagramStyle({ maxWidth, framed })}>
      <text x="92" y="92" fontSize="30" fontWeight="700" fill="#214d92">アンカー選定</text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">径・本数・埋込み</text>
      <g transform="translate(256 34)">
        <rect x="0" y="146" width="188" height="24" rx="8" fill="#e2e8f0" />
        <rect x="42" y="22" width="18" height="124" rx="6" fill="#b9c7d7" />
        <rect x="126" y="38" width="18" height="108" rx="6" fill="#b9c7d7" />
        <line x1="42" y1="82" x2="42" y2="170" stroke="#d35d5d" strokeWidth="3" />
        <line x1="126" y1="98" x2="126" y2="170" stroke="#5b86c4" strokeWidth="3" />
      </g>
    </svg>
  );
}
