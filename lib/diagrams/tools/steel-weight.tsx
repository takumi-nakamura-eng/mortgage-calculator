import type { BoltLengthSvgProps } from './bolt-length';

export function SteelWeightSvg({
  width = 240,
  height = 140,
  maxWidth = 240,
  ariaLabel = '鋼材重量図',
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
      <rect x="34" y="82" width="62" height="24" rx="3" fill="#cbd5e1" stroke="#334155" />
      <circle cx="148" cy="94" r="22" fill="none" stroke="#2563eb" strokeWidth="8" />
      <rect x="170" y="72" width="34" height="44" rx="4" fill="#e2e8f0" stroke="#334155" />
      <text x="120" y="38" textAnchor="middle" fontSize="11" fill="#334155">kg/m × 長さ × 本数</text>
      <text x="120" y="126" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8">重量集計</text>
    </svg>
  );
}
