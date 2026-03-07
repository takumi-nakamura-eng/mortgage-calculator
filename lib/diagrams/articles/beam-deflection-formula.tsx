import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function BeamDeflectionFormulaSvg({
  width = 560,
  height = 200,
  maxWidth,
  ariaLabel = 'たわみ公式の概要図',
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
      <text x="150" y="20" textAnchor="middle" fontSize="12" fontWeight="bold">単純梁</text>
      <rect x="50" y="40" width="200" height="10" fill="#2563eb" rx="2" />
      <polygon points="50,50 40,65 60,65" fill="#1e3a5f" />
      <polygon points="250,50 240,65 260,65" fill="none" stroke="#1e3a5f" strokeWidth="1.5" />
      <path d="M 150,50 Q 150,80 150,50" stroke="#ef4444" strokeWidth="0" />
      <line x1="150" y1="25" x2="150" y2="38" stroke="#dc2626" strokeWidth="2" />
      <polygon points="150,40 146,32 154,32" fill="#dc2626" />
      <text x="150" y="90" textAnchor="middle" fontSize="11" fill="#374151">δ = PL³/48EI</text>
      <text x="430" y="20" textAnchor="middle" fontSize="12" fontWeight="bold">片持ち梁</text>
      <rect x="330" y="28" width="15" height="40" fill="#d1d5db" stroke="#374151" strokeWidth="1" />
      <rect x="345" y="40" width="200" height="10" fill="#2563eb" rx="2" />
      <line x1="545" y1="25" x2="545" y2="38" stroke="#dc2626" strokeWidth="2" />
      <polygon points="545,40 541,32 549,32" fill="#dc2626" />
      <text x="430" y="90" textAnchor="middle" fontSize="11" fill="#374151">δ = PL³/3EI</text>
      <text x="280" y="130" textAnchor="middle" fontSize="12" fill="#64748b">
        EI = 曲げ剛性（ヤング率 × 断面二次モーメント）
      </text>
      <text x="280" y="155" textAnchor="middle" fontSize="11" fill="#64748b">
        EIが大きいほどたわみにくい
      </text>
    </svg>
  );
}
