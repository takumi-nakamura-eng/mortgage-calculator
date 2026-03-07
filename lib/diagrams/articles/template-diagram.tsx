import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function TemplateDiagramSvg({
  width = 560,
  height = 180,
  maxWidth,
  ariaLabel = '説明図',
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
      <rect x="40" y="75" width="480" height="30" fill="#dbeafe" stroke="#1d4ed8" />
      <line x1="80" y1="105" x2="80" y2="150" stroke="#6b7280" strokeWidth="3" />
      <line x1="480" y1="105" x2="480" y2="150" stroke="#6b7280" strokeWidth="3" />
      <text x="280" y="60" textAnchor="middle" fontSize="14">図は1枚必須</text>
    </svg>
  );
}
