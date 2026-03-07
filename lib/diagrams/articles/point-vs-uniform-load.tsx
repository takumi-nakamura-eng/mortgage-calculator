import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function PointVsUniformLoadSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = '集中荷重と等分布荷重の比較図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg viewBox="0 0 560 260" preserveAspectRatio="xMidYMid meet" width={width} height={height} aria-label={ariaHidden ? undefined : ariaLabel} aria-hidden={ariaHidden} role={role} className={className} style={buildArticleDiagramStyle({ maxWidth, framed })}>
      <text x="74" y="92" fontSize="30" fontWeight="700" fill="#214d92">荷重の違い</text>
      <text x="76" y="124" fontSize="20" fontWeight="700" fill="#55759a">集中荷重と等分布</text>
      <g transform="translate(256 42)">
        <line x1="10" y1="78" x2="120" y2="78" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
        <line x1="64" y1="18" x2="64" y2="58" stroke="#d35d5d" strokeWidth="3.5" />
        <polygon points="64,66 58,56 70,56" fill="#d35d5d" />
        <line x1="142" y1="78" x2="252" y2="78" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
        <line x1="162" y1="20" x2="162" y2="56" stroke="#5b86c4" strokeWidth="3" />
        <polygon points="162,64 156,54 168,54" fill="#5b86c4" />
        <line x1="196" y1="20" x2="196" y2="56" stroke="#5b86c4" strokeWidth="3" />
        <polygon points="196,64 190,54 202,54" fill="#5b86c4" />
        <line x1="230" y1="20" x2="230" y2="56" stroke="#5b86c4" strokeWidth="3" />
        <polygon points="230,64 224,54 236,54" fill="#5b86c4" />
      </g>
    </svg>
  );
}
