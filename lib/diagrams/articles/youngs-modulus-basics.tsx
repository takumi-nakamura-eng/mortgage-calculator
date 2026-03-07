import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function YoungsModulusBasicsSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = 'ヤング率の概略図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg viewBox="0 0 560 260" preserveAspectRatio="xMidYMid meet" width={width} height={height} aria-label={ariaHidden ? undefined : ariaLabel} aria-hidden={ariaHidden} role={role} className={className} style={buildArticleDiagramStyle({ maxWidth, framed })}>
      <text x="90" y="92" fontSize="30" fontWeight="700" fill="#214d92">ヤング率</text>
      <text x="92" y="124" fontSize="20" fontWeight="700" fill="#55759a">たわみとの関係</text>
      <g transform="translate(266 38)">
        <line x1="10" y1="170" x2="10" y2="18" stroke="#64748b" strokeWidth="2" />
        <line x1="10" y1="170" x2="214" y2="170" stroke="#64748b" strokeWidth="2" />
        <line x1="38" y1="150" x2="178" y2="42" stroke="#214d92" strokeWidth="4" strokeLinecap="round" />
        <line x1="38" y1="150" x2="126" y2="86" stroke="#9db6d5" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}
