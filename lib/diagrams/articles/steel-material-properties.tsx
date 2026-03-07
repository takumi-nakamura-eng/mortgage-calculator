import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function SteelMaterialPropertiesSvg({
  width = 560,
  height = 200,
  maxWidth,
  ariaLabel = '応力-ひずみ曲線の概念図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg
      viewBox="0 0 560 200"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={buildArticleDiagramStyle({ maxWidth, framed })}
    >
      <line x1="80" y1="170" x2="500" y2="170" stroke="#374151" strokeWidth="1.5" />
      <line x1="80" y1="170" x2="80" y2="20" stroke="#374151" strokeWidth="1.5" />
      <text x="500" y="188" textAnchor="end" fontSize="11" fill="#374151">ひずみ ε</text>
      <text x="72" y="20" textAnchor="end" fontSize="11" fill="#374151">応力 σ</text>
      <polyline points="80,170 200,70 220,68 240,65 350,50 450,40" fill="none" stroke="#2563eb" strokeWidth="2.5" />
      <text x="460" y="38" fontSize="11" fontWeight="bold" fill="#2563eb">SS400</text>
      <line x1="80" y1="70" x2="210" y2="70" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" />
      <text x="70" y="74" textAnchor="end" fontSize="10" fill="#ef4444">σ_y</text>
      <line x1="80" y1="40" x2="460" y2="40" stroke="#16a34a" strokeWidth="1" strokeDasharray="4 3" />
      <text x="70" y="44" textAnchor="end" fontSize="10" fill="#16a34a">σ_u</text>
      <line x1="80" y1="110" x2="160" y2="110" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 3" />
      <text x="170" y="114" fontSize="10" fill="#f59e0b">許容応力 σ_allow</text>
      <text x="280" y="195" textAnchor="middle" fontSize="10" fill="#64748b">
        降伏点σ_y以下の弾性範囲で設計する
      </text>
    </svg>
  );
}
