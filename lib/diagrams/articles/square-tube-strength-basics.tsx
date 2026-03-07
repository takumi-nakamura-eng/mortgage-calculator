import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function SquareTubeStrengthBasicsSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = '角パイプ強度計算の概略図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg viewBox="0 0 560 260" preserveAspectRatio="xMidYMid meet" width={width} height={height} aria-label={ariaHidden ? undefined : ariaLabel} aria-hidden={ariaHidden} role={role} className={className} style={buildArticleDiagramStyle({ maxWidth, framed })}>
      <text x="92" y="92" fontSize="30" fontWeight="700" fill="#214d92">角パイプ強度</text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">I と Z</text>
      <g transform="translate(264 38)">
        <rect x="0" y="40" width="110" height="110" rx="10" fill="#eef3f8" stroke="#8ea4bd" strokeWidth="2" />
        <rect x="22" y="62" width="66" height="66" rx="8" fill="#ffffff" stroke="#8ea4bd" strokeWidth="2" />
        <line x1="146" y1="110" x2="226" y2="110" stroke="#6c7f93" strokeWidth="10" strokeLinecap="round" />
        <path d="M146 110 Q186 78 226 110" fill="none" stroke="#5b86c4" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}
