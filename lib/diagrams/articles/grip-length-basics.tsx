import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function GripLengthBasicsSvg({
  width = 560,
  height = 220,
  maxWidth,
  ariaLabel = 'グリップ長さの定義図',
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
      <rect x="250" y="20" width="60" height="20" fill="#64748b" stroke="#374151" strokeWidth="1.5" rx="2" />
      <text x="280" y="14" textAnchor="middle" fontSize="10" fill="#374151">ボルト頭</text>
      <rect x="272" y="40" width="16" height="160" fill="#94a3b8" rx="1" />
      <rect x="255" y="40" width="50" height="8" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="1" />
      <text x="320" y="48" fontSize="10" fill="#1d4ed8">平座金</text>
      <rect x="258" y="48" width="44" height="7" fill="#fecaca" stroke="#ef4444" strokeWidth="1" />
      <text x="320" y="58" fontSize="10" fill="#ef4444">ばね座金</text>
      <rect x="230" y="55" width="100" height="40" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
      <text x="280" y="80" textAnchor="middle" fontSize="11" fill="#475569">板 t₁</text>
      <rect x="230" y="95" width="100" height="40" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" />
      <text x="280" y="120" textAnchor="middle" fontSize="11" fill="#475569">板 t₂</text>
      <rect x="255" y="135" width="50" height="20" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="1.5" rx="2" />
      <text x="320" y="148" fontSize="10" fill="#1d4ed8">ナット</text>
      <line x1="280" y1="155" x2="280" y2="200" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 3" />
      <text x="320" y="180" fontSize="10" fill="#374151">先端3山</text>
      <line x1="215" y1="40" x2="215" y2="135" stroke="#16a34a" strokeWidth="2" />
      <line x1="210" y1="40" x2="220" y2="40" stroke="#16a34a" strokeWidth="1.5" />
      <line x1="210" y1="135" x2="220" y2="135" stroke="#16a34a" strokeWidth="1.5" />
      <text
        x="195"
        y="92"
        textAnchor="middle"
        fontSize="11"
        fontWeight="bold"
        fill="#16a34a"
        transform="rotate(-90, 195, 92)"
      >
        グリップ長
      </text>
    </svg>
  );
}
