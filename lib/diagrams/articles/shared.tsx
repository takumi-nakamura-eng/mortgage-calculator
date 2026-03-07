import type { CSSProperties } from 'react';

export interface ArticleDiagramProps {
  width?: number | string;
  height?: number | string;
  maxWidth?: number;
  ariaLabel?: string;
  role?: 'img' | 'presentation';
  ariaHidden?: boolean;
  framed?: boolean;
  className?: string;
}

const ARTICLE_DIAGRAM_FRAME = {
  fill: '#f8fafc',
  stroke: '#cbd5e1',
} as const;

export function buildArticleDiagramStyle(
  options: Pick<ArticleDiagramProps, 'maxWidth' | 'framed'>,
): CSSProperties {
  return {
    display: 'block',
    maxWidth: options.maxWidth !== undefined ? `${options.maxWidth}px` : '100%',
    ...(options.framed === false
      ? null
      : {
          background: ARTICLE_DIAGRAM_FRAME.fill,
          border: `1px solid ${ARTICLE_DIAGRAM_FRAME.stroke}`,
          borderRadius: '6px',
        }),
  };
}
