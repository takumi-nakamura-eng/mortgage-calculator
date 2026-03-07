import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function UniformLoadBasicsSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = '等分布荷重の概略図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg viewBox="0 0 560 260" preserveAspectRatio="xMidYMid meet" width={width} height={height} aria-label={ariaHidden ? undefined : ariaLabel} aria-hidden={ariaHidden} role={role} className={className} style={buildArticleDiagramStyle({ maxWidth, framed })}>
      <text x="90" y="92" fontSize="30" fontWeight="700" fill="#214d92">等分布荷重</text>
      <text x="92" y="124" fontSize="20" fontWeight="700" fill="#55759a">kN/m の入れ方</text>
      <g transform="translate(250 42)">
        <line x1="20" y1="124" x2="218" y2="124" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
        <polygon points="38,124 24,146 52,146" fill="#334155" />
        <polygon points="200,124 186,146 214,146" fill="none" stroke="#334155" strokeWidth="2" />
        <circle cx="200" cy="151" r="4" fill="none" stroke="#334155" strokeWidth="2" />
        <line x1="44" y1="34" x2="44" y2="102" stroke="#5b86c4" strokeWidth="3" />
        <polygon points="44,110 38,100 50,100" fill="#5b86c4" />
        <line x1="84" y1="34" x2="84" y2="102" stroke="#5b86c4" strokeWidth="3" />
        <polygon points="84,110 78,100 90,100" fill="#5b86c4" />
        <line x1="124" y1="34" x2="124" y2="102" stroke="#5b86c4" strokeWidth="3" />
        <polygon points="124,110 118,100 130,100" fill="#5b86c4" />
        <line x1="164" y1="34" x2="164" y2="102" stroke="#5b86c4" strokeWidth="3" />
        <polygon points="164,110 158,100 170,100" fill="#5b86c4" />
      </g>
    </svg>
  );
}
