import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function RoundVsSquareTubeSelectionSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = '丸パイプと角パイプの比較図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg viewBox="0 0 560 260" preserveAspectRatio="xMidYMid meet" width={width} height={height} aria-label={ariaHidden ? undefined : ariaLabel} aria-hidden={ariaHidden} role={role} className={className} style={buildArticleDiagramStyle({ maxWidth, framed })}>
      <text x="92" y="92" fontSize="30" fontWeight="700" fill="#214d92">丸と角</text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">パイプ比較</text>
      <g transform="translate(270 46)">
        <circle cx="54" cy="74" r="42" fill="#eef3f8" stroke="#8ea4bd" strokeWidth="3" />
        <rect x="132" y="32" width="84" height="84" rx="10" fill="#eef3f8" stroke="#8ea4bd" strokeWidth="3" />
        <line x1="52" y1="136" x2="52" y2="174" stroke="#5b86c4" strokeWidth="4" />
        <line x1="174" y1="136" x2="174" y2="174" stroke="#d35d5d" strokeWidth="4" />
      </g>
    </svg>
  );
}
