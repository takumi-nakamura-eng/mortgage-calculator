import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function WasherRoleSvg({
  width = 560,
  height = 220,
  maxWidth,
  ariaLabel = '座金の配置と種類の説明図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg
      viewBox="0 0 560 220"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={buildArticleDiagramStyle({ maxWidth, framed })}
    >
      <rect x="80" y="140" width="400" height="30" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
      <text x="280" y="160" textAnchor="middle" fontSize="11" fill="#475569">母材</text>
      <rect x="272" y="30" width="16" height="110" fill="#94a3b8" rx="2" />
      <rect x="245" y="120" width="70" height="12" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="1.5" rx="1" />
      <text x="340" y="130" fontSize="11" fill="#1d4ed8" fontWeight="bold">平座金 t₁</text>
      <rect x="255" y="105" width="50" height="12" fill="#fecaca" stroke="#ef4444" strokeWidth="1.5" rx="1" />
      <text x="340" y="115" fontSize="11" fill="#ef4444" fontWeight="bold">ばね座金 t₂</text>
      <line x1="230" y1="105" x2="230" y2="140" stroke="#374151" strokeWidth="1" />
      <line x1="225" y1="105" x2="235" y2="105" stroke="#374151" strokeWidth="1" />
      <line x1="225" y1="140" x2="235" y2="140" stroke="#374151" strokeWidth="1" />
      <text x="210" y="126" textAnchor="middle" fontSize="10" fill="#374151">合計厚</text>
      <rect x="258" y="90" width="44" height="15" fill="#64748b" stroke="#374151" strokeWidth="1" rx="2" />
      <text x="280" y="84" textAnchor="middle" fontSize="10" fill="#374151">ボルト頭</text>
      <text x="280" y="20" textAnchor="middle" fontSize="12" fontWeight="bold">座金の配置</text>
    </svg>
  );
}
