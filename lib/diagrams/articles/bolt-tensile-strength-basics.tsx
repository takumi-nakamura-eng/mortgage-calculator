import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function BoltTensileStrengthBasicsSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = 'ボルト引張強度の概略図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg viewBox="0 0 560 260" preserveAspectRatio="xMidYMid meet" width={width} height={height} aria-label={ariaHidden ? undefined : ariaLabel} aria-hidden={ariaHidden} role={role} className={className} style={buildArticleDiagramStyle({ maxWidth, framed })}>
      <text x="88" y="92" fontSize="30" fontWeight="700" fill="#214d92">引張強度</text>
      <text x="90" y="124" fontSize="20" fontWeight="700" fill="#55759a">軸力と有効断面</text>
      <g transform="translate(266 40)">
        <rect x="16" y="78" width="148" height="28" rx="14" fill="#c7d2de" />
        <rect x="56" y="54" width="68" height="76" rx="14" fill="#dbeafe" stroke="#5b86c4" strokeWidth="2" />
        <line x1="90" y1="10" x2="90" y2="44" stroke="#d35d5d" strokeWidth="4" />
        <polygon points="90,0 82,14 98,14" fill="#d35d5d" />
        <line x1="90" y1="176" x2="90" y2="138" stroke="#d35d5d" strokeWidth="4" />
        <polygon points="90,186 82,172 98,172" fill="#d35d5d" />
      </g>
    </svg>
  );
}
