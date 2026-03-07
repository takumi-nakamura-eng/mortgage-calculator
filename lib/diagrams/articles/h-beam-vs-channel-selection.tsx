import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function HBeamVsChannelSelectionSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = 'Hとチャンネル比較',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg
      viewBox="0 0 560 260"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={buildArticleDiagramStyle({ maxWidth, framed })}
    >
      <text x="92" y="92" fontSize="30" fontWeight="700" fill="#214d92">
        H と C
      </text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">
        断面の選び方
      </text>

      <g transform="translate(246 30)">
        <rect x="6" y="34" width="86" height="20" rx="4" fill="#dbeafe" stroke="#5b86c4" strokeWidth="2" />
        <rect x="39" y="54" width="20" height="96" rx="4" fill="#b9c7d7" />
        <rect x="6" y="150" width="86" height="20" rx="4" fill="#dbeafe" stroke="#5b86c4" strokeWidth="2" />

        <rect x="152" y="34" width="76" height="20" rx="4" fill="#eef3f8" stroke="#8ea4bd" strokeWidth="2" />
        <rect x="152" y="54" width="20" height="116" rx="4" fill="#c6d2df" />
        <rect x="152" y="150" width="76" height="20" rx="4" fill="#eef3f8" stroke="#8ea4bd" strokeWidth="2" />

        <line x1="114" y1="64" x2="140" y2="64" stroke="#9db0c5" strokeWidth="2" strokeDasharray="6 6" />
        <line x1="114" y1="98" x2="140" y2="98" stroke="#9db0c5" strokeWidth="2" strokeDasharray="6 6" />
        <line x1="114" y1="132" x2="140" y2="132" stroke="#9db0c5" strokeWidth="2" strokeDasharray="6 6" />
      </g>
    </svg>
  );
}
