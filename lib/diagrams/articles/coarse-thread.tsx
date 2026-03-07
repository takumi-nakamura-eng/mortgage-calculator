import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function CoarseThreadSvg({
  width = 560,
  height = 180,
  maxWidth,
  ariaLabel = '並目と細目のイメージ',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg
      viewBox="0 0 560 180"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={buildArticleDiagramStyle({ maxWidth, framed })}
    >
      <polyline
        points="60,120 90,90 120,120 150,90 180,120 210,90 240,120"
        fill="none"
        stroke="#1d4ed8"
        strokeWidth="3"
      />
      <polyline
        points="320,120 335,90 350,120 365,90 380,120 395,90 410,120 425,90 440,120"
        fill="none"
        stroke="#dc2626"
        strokeWidth="3"
      />
      <text x="150" y="145" textAnchor="middle" fontSize="12">並目（ピッチ大）</text>
      <text x="380" y="145" textAnchor="middle" fontSize="12">細目（ピッチ小）</text>
    </svg>
  );
}
