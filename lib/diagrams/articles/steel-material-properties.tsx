import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function SteelMaterialPropertiesSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = '応力-ひずみ曲線の概念図',
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
        鋼材入力値
      </text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">
        E・σy・σallow
      </text>

      <g transform="translate(244 34)">
        <line x1="0" y1="168" x2="220" y2="168" stroke="#6c7f93" strokeWidth="2" />
        <line x1="0" y1="168" x2="0" y2="18" stroke="#6c7f93" strokeWidth="2" />
        <polyline points="0,168 66,110 84,106 132,88 188,72" fill="none" stroke="#5b86c4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="0" y1="106" x2="94" y2="106" stroke="#d35d5d" strokeWidth="2.5" strokeDasharray="7 6" />
        <line x1="0" y1="128" x2="70" y2="128" stroke="#45a06b" strokeWidth="2.5" strokeDasharray="7 6" />
        <text x="198" y="70" fontSize="28" fontWeight="700" fill="#5b86c4">E</text>
        <text x="102" y="110" fontSize="18" fontWeight="700" fill="#d35d5d">σy</text>
        <text x="78" y="132" fontSize="18" fontWeight="700" fill="#45a06b">σallow</text>
      </g>
    </svg>
  );
}
