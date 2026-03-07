import type { BoltLengthSvgProps } from './bolt-length';

export function BoltStrengthSvg({
  width = 240,
  height = 140,
  maxWidth = 240,
  ariaLabel = 'ボルト強度図',
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
      <rect x="62" y="62" width="108" height="16" rx="4" fill="#94a3b8" stroke="#334155" />
      <rect x="40" y="56" width="28" height="28" rx="6" fill="#64748b" stroke="#334155" />
      <line x1="116" y1="26" x2="116" y2="58" stroke="#dc2626" strokeWidth="2.5" />
      <polygon points="116,64 110,54 122,54" fill="#dc2626" />
      <text x="128" y="36" fontSize="11" fill="#dc2626">引張</text>
      <line x1="178" y1="70" x2="214" y2="70" stroke="#2563eb" strokeWidth="2.5" />
      <polygon points="214,70 204,64 204,76" fill="#2563eb" />
      <text x="182" y="58" fontSize="11" fill="#2563eb">せん断</text>
      <text x="120" y="112" textAnchor="middle" fontSize="11" fill="#334155">許容引張・せん断耐力</text>
    </svg>
  );
}
