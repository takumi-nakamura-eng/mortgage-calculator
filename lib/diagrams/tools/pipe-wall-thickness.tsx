import type { BoltLengthSvgProps } from './bolt-length';

export function PipeWallThicknessSvg({
  width = 240,
  height = 140,
  maxWidth = 240,
  ariaLabel = '配管肉厚図',
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
      <circle cx="120" cy="74" r="40" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="2" />
      <circle cx="120" cy="74" r="28" fill="#fff" stroke="#1d4ed8" strokeWidth="2" />
      <line x1="80" y1="122" x2="160" y2="122" stroke="#2563eb" />
      <line x1="80" y1="116" x2="80" y2="128" stroke="#2563eb" />
      <line x1="160" y1="116" x2="160" y2="128" stroke="#2563eb" />
      <text x="120" y="114" textAnchor="middle" fontSize="11" fill="#2563eb">D</text>
      <line x1="120" y1="34" x2="120" y2="46" stroke="#dc2626" strokeWidth="1.8" />
      <line x1="120" y1="46" x2="132" y2="58" stroke="#dc2626" strokeWidth="1.8" />
      <text x="136" y="52" fontSize="11" fill="#dc2626">t</text>
      <text x="120" y="20" textAnchor="middle" fontSize="11" fill="#334155">必要肉厚 / 名目肉厚</text>
    </svg>
  );
}
