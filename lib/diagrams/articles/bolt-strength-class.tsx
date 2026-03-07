import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function BoltStrengthClassSvg({
  width = 560,
  height = 200,
  maxWidth,
  ariaLabel = 'ボルト強度区分の読み方',
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
      <text x="280" y="30" textAnchor="middle" fontSize="14" fontWeight="bold">強度区分の読み方</text>
      <text x="280" y="70" textAnchor="middle" fontSize="36" fontWeight="bold" fill="#1d4ed8">8 . 8</text>
      <line x1="248" y1="80" x2="220" y2="110" stroke="#374151" strokeWidth="1.5" />
      <text x="160" y="125" textAnchor="middle" fontSize="12" fill="#374151">左の数字 × 100</text>
      <text x="160" y="142" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1d4ed8">
        = 引張強さ 800 MPa
      </text>
      <line x1="310" y1="80" x2="340" y2="110" stroke="#374151" strokeWidth="1.5" />
      <text x="400" y="125" textAnchor="middle" fontSize="12" fill="#374151">左 × 右 × 10</text>
      <text x="400" y="142" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ef4444">
        = 降伏点 640 MPa
      </text>
      <text x="280" y="180" textAnchor="middle" fontSize="11" fill="#64748b">
        降伏比 = 0.8（右の数字 ÷ 10）
      </text>
    </svg>
  );
}
