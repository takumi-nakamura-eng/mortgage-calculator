import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function HBeamSizeReadingSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = 'H形鋼サイズの読み方',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg viewBox="0 0 560 260" preserveAspectRatio="xMidYMid meet" width={width} height={height} aria-label={ariaHidden ? undefined : ariaLabel} aria-hidden={ariaHidden} role={role} className={className} style={buildArticleDiagramStyle({ maxWidth, framed })}>
      <text x="92" y="92" fontSize="30" fontWeight="700" fill="#214d92">H形鋼サイズ</text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">200×100×5.5×8</text>
      <g transform="translate(266 34)">
        <rect x="0" y="26" width="104" height="20" rx="4" fill="#dbeafe" stroke="#5b86c4" strokeWidth="2" />
        <rect x="42" y="46" width="20" height="100" rx="4" fill="#b9c7d7" />
        <rect x="0" y="146" width="104" height="20" rx="4" fill="#dbeafe" stroke="#5b86c4" strokeWidth="2" />
        <line x1="0" y1="8" x2="104" y2="8" stroke="#d35d5d" strokeWidth="3" />
        <line x1="122" y1="26" x2="122" y2="166" stroke="#5b86c4" strokeWidth="3" />
      </g>
    </svg>
  );
}
