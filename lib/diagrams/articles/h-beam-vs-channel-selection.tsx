import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function HBeamVsChannelSelectionSvg({
  width = 560,
  height = 200,
  maxWidth,
  ariaLabel = 'Hとチャンネル比較',
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
      <rect x="100" y="40" width="100" height="20" fill="#dbeafe" stroke="#1d4ed8" />
      <rect x="140" y="60" width="20" height="80" fill="#dbeafe" stroke="#1d4ed8" />
      <rect x="100" y="140" width="100" height="20" fill="#dbeafe" stroke="#1d4ed8" />
      <rect x="320" y="40" width="90" height="20" fill="#fee2e2" stroke="#dc2626" />
      <rect x="320" y="60" width="20" height="100" fill="#fee2e2" stroke="#dc2626" />
      <rect x="320" y="140" width="90" height="20" fill="#fee2e2" stroke="#dc2626" />
      <text x="150" y="28" textAnchor="middle" fontSize="12">H形鋼</text>
      <text x="365" y="28" textAnchor="middle" fontSize="12">チャンネル</text>
    </svg>
  );
}
