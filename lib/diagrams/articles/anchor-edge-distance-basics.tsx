import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function AnchorEdgeDistanceBasicsSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = 'アンカーの縁端距離とピッチの図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg viewBox="0 0 560 260" preserveAspectRatio="xMidYMid meet" width={width} height={height} aria-label={ariaHidden ? undefined : ariaLabel} aria-hidden={ariaHidden} role={role} className={className} style={buildArticleDiagramStyle({ maxWidth, framed })}>
      <text x="92" y="92" fontSize="30" fontWeight="700" fill="#214d92">縁端距離</text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">edge & pitch</text>
      <g transform="translate(258 36)">
        <rect x="0" y="42" width="176" height="120" rx="10" fill="#eef3f8" />
        <circle cx="44" cy="92" r="10" fill="#5b86c4" />
        <circle cx="122" cy="92" r="10" fill="#5b86c4" />
        <line x1="18" y1="24" x2="44" y2="24" stroke="#d35d5d" strokeWidth="3" />
        <line x1="44" y1="24" x2="44" y2="82" stroke="#d35d5d" strokeWidth="3" />
        <line x1="44" y1="18" x2="44" y2="30" stroke="#d35d5d" strokeWidth="2" />
        <line x1="18" y1="18" x2="18" y2="30" stroke="#d35d5d" strokeWidth="2" />
        <line x1="44" y1="182" x2="122" y2="182" stroke="#5b86c4" strokeWidth="3" />
      </g>
    </svg>
  );
}
