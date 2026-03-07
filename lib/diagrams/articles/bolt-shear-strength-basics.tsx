import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function BoltShearStrengthBasicsSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = 'ボルトせん断強度の概略図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg viewBox="0 0 560 260" preserveAspectRatio="xMidYMid meet" width={width} height={height} aria-label={ariaHidden ? undefined : ariaLabel} aria-hidden={ariaHidden} role={role} className={className} style={buildArticleDiagramStyle({ maxWidth, framed })}>
      <text x="92" y="92" fontSize="30" fontWeight="700" fill="#214d92">ボルトせん断</text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">shear</text>
      <g transform="translate(260 44)">
        <rect x="34" y="26" width="18" height="126" rx="6" fill="#b9c7d7" />
        <rect x="0" y="64" width="120" height="20" rx="8" fill="#dbeafe" stroke="#5b86c4" strokeWidth="2" />
        <rect x="0" y="96" width="120" height="20" rx="8" fill="#eef3f8" stroke="#8ea4bd" strokeWidth="2" />
        <line x1="136" y1="90" x2="212" y2="90" stroke="#d35d5d" strokeWidth="4" />
      </g>
    </svg>
  );
}
