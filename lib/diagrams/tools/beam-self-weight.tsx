import type { BoltLengthSvgProps } from './bolt-length';

export function BeamSelfWeightSvg({
  width = 240,
  height = 140,
  maxWidth = 240,
  ariaLabel = '梁自重図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: BoltLengthSvgProps) {
  return (
    <svg
      viewBox="0 0 240 140"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={{ display: 'block', maxWidth, ...(framed ? { background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px' } : null) }}
    >
      <rect x="38" y="70" width="164" height="12" rx="5" fill="#2563eb" />
      <polygon points="46,82 34,100 58,100" fill="#334155" />
      <polygon points="194,82 182,100 206,100" fill="none" stroke="#334155" strokeWidth="2" />
      <circle cx="194" cy="105" r="4" fill="none" stroke="#334155" strokeWidth="2" />
      {[56, 82, 108, 134, 160, 186].map((x) => (
        <g key={x}>
          <line x1={x} y1="34" x2={x} y2="64" stroke="#dc2626" strokeWidth="1.5" />
          <polygon points={`${x},70 ${x - 4},62 ${x + 4},62`} fill="#dc2626" />
        </g>
      ))}
      <text x="120" y="28" textAnchor="middle" fontSize="11" fill="#dc2626">q = self weight</text>
      <text x="120" y="122" textAnchor="middle" fontSize="11" fill="#334155">断面寸法から kN/m を算定</text>
    </svg>
  );
}
