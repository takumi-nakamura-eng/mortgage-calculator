import type { BoltLengthSvgProps } from './bolt-length';

export function WeldStrengthSvg({
  width = 240,
  height = 140,
  maxWidth = 240,
  ariaLabel = '溶接強度図',
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
      <rect x="34" y="84" width="70" height="16" fill="#94a3b8" />
      <rect x="104" y="54" width="16" height="46" fill="#94a3b8" />
      <polygon points="104,84 120,84 104,68" fill="#f59e0b" stroke="#92400e" />
      <line x1="112" y1="26" x2="112" y2="58" stroke="#dc2626" strokeWidth="2.2" />
      <polygon points="112,64 106,54 118,54" fill="#dc2626" />
      <text x="124" y="40" fontSize="11" fill="#dc2626">F</text>
      <line x1="132" y1="102" x2="202" y2="102" stroke="#2563eb" strokeWidth="1.5" />
      <line x1="132" y1="96" x2="132" y2="108" stroke="#2563eb" />
      <line x1="202" y1="96" x2="202" y2="108" stroke="#2563eb" />
      <text x="167" y="94" textAnchor="middle" fontSize="11" fill="#2563eb">l</text>
      <text x="166" y="122" textAnchor="middle" fontSize="11" fill="#334155">のど厚と溶接長を確認</text>
    </svg>
  );
}
