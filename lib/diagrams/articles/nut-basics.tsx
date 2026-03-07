import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function NutBasicsSvg({
  width = 560,
  height = 200,
  maxWidth,
  ariaLabel = 'ナット断面と高さ寸法の説明図',
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
      <polygon points="140,50 200,50 230,90 200,130 140,130 110,90" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="2" />
      <circle cx="170" cy="90" r="22" fill="#f0f9ff" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="170" y="94" textAnchor="middle" fontSize="10" fill="#64748b">ねじ穴</text>
      <line x1="250" y1="50" x2="250" y2="130" stroke="#ef4444" strokeWidth="2" />
      <line x1="240" y1="50" x2="260" y2="50" stroke="#ef4444" strokeWidth="1.5" />
      <line x1="240" y1="130" x2="260" y2="130" stroke="#ef4444" strokeWidth="1.5" />
      <text x="270" y="94" fontSize="13" fontWeight="bold" fill="#ef4444">高さ m</text>
      <line x1="110" y1="148" x2="230" y2="148" stroke="#374151" strokeWidth="1" />
      <line x1="110" y1="143" x2="110" y2="153" stroke="#374151" strokeWidth="1" />
      <line x1="230" y1="143" x2="230" y2="153" stroke="#374151" strokeWidth="1" />
      <text x="170" y="165" textAnchor="middle" fontSize="11" fill="#374151">二面幅 s</text>
      <text x="170" y="38" textAnchor="middle" fontSize="12" fontWeight="bold">六角ナット断面</text>
      <rect x="340" y="50" width="60" height="80" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="1.5" rx="2" />
      <text x="370" y="95" textAnchor="middle" fontSize="11">1種</text>
      <rect x="430" y="80" width="60" height="50" fill="#e0f2fe" stroke="#1d4ed8" strokeWidth="1.5" rx="2" />
      <text x="460" y="110" textAnchor="middle" fontSize="11">3種</text>
      <text x="415" y="38" textAnchor="middle" fontSize="11" fontWeight="bold">高さの違い</text>
    </svg>
  );
}
