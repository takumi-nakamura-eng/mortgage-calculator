import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function SectionModulusBasicsSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = '断面係数の図',
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
        断面係数
      </text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">
        Z と曲げ応力
      </text>
      <g transform="translate(250 34)">
        <rect x="0" y="24" width="112" height="132" rx="8" fill="#dbeafe" stroke="#5b86c4" strokeWidth="2" />
        <line x1="0" y1="90" x2="112" y2="90" stroke="#d35d5d" strokeWidth="3" strokeDasharray="8 7" />
        <line x1="166" y1="134" x2="262" y2="134" stroke="#6c7f93" strokeWidth="12" strokeLinecap="round" />
        <line x1="214" y1="134" x2="214" y2="76" stroke="#d35d5d" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}
