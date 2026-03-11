import type { BoltLengthSvgProps } from './bolt-length';

export function BoltTorqueSvg({
  width = 240,
  height = 140,
  maxWidth = 240,
  ariaLabel = 'ボルトトルク図',
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
      <rect x="94" y="54" width="52" height="26" rx="4" fill="#94a3b8" stroke="#334155" />
      <rect x="68" y="60" width="28" height="14" rx="3" fill="#64748b" stroke="#334155" />
      <path d="M146 66 A28 28 0 0 1 184 38" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
      <polygon points="182,34 186,44 176,42" fill="#f59e0b" />
      <text x="188" y="38" fontSize="11" fill="#92400e">T</text>
      <line x1="120" y1="22" x2="120" y2="52" stroke="#dc2626" strokeWidth="2" />
      <polygon points="120,58 114,48 126,48" fill="#dc2626" />
      <text x="132" y="34" fontSize="11" fill="#dc2626">F_t</text>
      <text x="120" y="116" textAnchor="middle" fontSize="11" fill="#334155">軸力とトルクの相互換算</text>
    </svg>
  );
}
