import type { BoltLengthSvgProps } from './bolt-length';

export function SectionComparisonSvg({
  width = 240,
  height = 140,
  maxWidth = 240,
  ariaLabel = '断面比較図',
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
      <rect x="32" y="42" width="42" height="56" fill="#cbd5e1" stroke="#334155" />
      <rect x="98" y="34" width="50" height="72" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="2" />
      <circle cx="190" cy="72" r="28" fill="#e2e8f0" stroke="#334155" strokeWidth="2" />
      <text x="53" y="114" textAnchor="middle" fontSize="10" fill="#475569">A</text>
      <text x="123" y="114" textAnchor="middle" fontSize="10" fill="#1d4ed8">B</text>
      <text x="190" y="114" textAnchor="middle" fontSize="10" fill="#475569">C</text>
      <text x="120" y="24" textAnchor="middle" fontSize="11" fill="#334155">I / Z / A / 重量 を比較</text>
    </svg>
  );
}
