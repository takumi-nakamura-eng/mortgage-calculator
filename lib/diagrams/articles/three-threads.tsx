import type { CSSProperties } from 'react';

export interface ThreeThreadsSvgProps {
  width?: number | string;
  height?: number | string;
  maxWidth?: number;
  ariaLabel?: string;
  role?: 'img' | 'presentation';
  ariaHidden?: boolean;
  framed?: boolean;
  className?: string;
}

const THREE_THREADS_COLORS = {
  stroke: '#334155',
  text: '#1f2937',
  subtleText: '#475569',
  frameFill: '#f8fafc',
  frameStroke: '#cbd5e1',
  body: '#cbd5e1',
  nutFill: '#bfdbfe',
  nutStroke: '#1d4ed8',
  threadFill: '#94a3b8',
  caution: '#dc2626',
  guide: '#94a3b8',
} as const;

function buildSvgStyle(options: Pick<ThreeThreadsSvgProps, 'maxWidth' | 'framed'>): CSSProperties {
  return {
    display: 'block',
    maxWidth: options.maxWidth !== undefined ? `${options.maxWidth}px` : '100%',
    ...(options.framed === false
      ? null
      : {
          background: THREE_THREADS_COLORS.frameFill,
          border: `1px solid ${THREE_THREADS_COLORS.frameStroke}`,
          borderRadius: '6px',
        }),
  };
}

function threadLineMarkup(x: number): string {
  return `<line x1="${x}" y1="118" x2="${x}" y2="142" stroke="${THREE_THREADS_COLORS.threadFill}" stroke-width="1.2"/>`;
}

export function ThreeThreadsSvg({
  width = 560,
  height = 260,
  maxWidth,
  ariaLabel = 'ナットから先端3山以上を出すボルト締結の概略図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ThreeThreadsSvgProps) {
  const style = buildSvgStyle({ maxWidth, framed });

  return (
    <svg
      viewBox="0 0 560 260"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={style}
    >
      <text x="92" y="92" fontSize="30" fontWeight="700" fill="#214d92">
        先端 3山
      </text>
      <text x="94" y="124" fontSize="20" fontWeight="700" fill="#55759a">
        余長 3p
      </text>
      <g transform="translate(242 52)">
        <rect x="0" y="86" width="250" height="24" rx="6" fill={THREE_THREADS_COLORS.body} stroke={THREE_THREADS_COLORS.stroke} />
        <rect x="86" y="64" width="88" height="68" rx="8" fill={THREE_THREADS_COLORS.nutFill} stroke={THREE_THREADS_COLORS.nutStroke} strokeWidth="1.6" />
        {[250, 264, 278, 292].map((x) => (
          <line key={x} x1={x} y1="86" x2={x} y2="110" stroke={THREE_THREADS_COLORS.threadFill} strokeWidth="1.5" />
        ))}
        <line x1="174" y1="54" x2="292" y2="54" stroke={THREE_THREADS_COLORS.caution} strokeWidth="2.5" />
        <line x1="174" y1="48" x2="174" y2="60" stroke={THREE_THREADS_COLORS.caution} strokeWidth="2" />
        <line x1="292" y1="48" x2="292" y2="60" stroke={THREE_THREADS_COLORS.caution} strokeWidth="2" />
      </g>
    </svg>
  );
}

interface ThreeThreadsSvgMarkupOptions {
  width?: number | string;
  height?: number | string;
  maxWidth?: number;
  includeXmlns?: boolean;
}

export function getThreeThreadsSvgMarkup(options: ThreeThreadsSvgMarkupOptions = {}): string {
  const {
    width = 560,
    height = 180,
    maxWidth,
    includeXmlns = true,
  } = options;
  const maxWidthStyle = maxWidth !== undefined ? `;max-width:${maxWidth}px` : ';max-width:100%';
  const xmlns = includeXmlns ? ' xmlns="http://www.w3.org/2000/svg"' : '';

  return `<svg viewBox="0 0 560 260" preserveAspectRatio="xMidYMid meet"${xmlns} width="${width}" height="${height}" aria-label="ナットから先端3山以上を出すボルト締結の概略図" style="display:block${maxWidthStyle};background:${THREE_THREADS_COLORS.frameFill};border:1px solid ${THREE_THREADS_COLORS.frameStroke};border-radius:6px;">
  <text x="92" y="92" font-size="30" font-weight="700" fill="#214d92">先端 3山</text>
  <text x="94" y="124" font-size="20" font-weight="700" fill="#55759a">余長 3p</text>
  <g transform="translate(242 52)">
  <rect x="0" y="86" width="250" height="24" rx="6" fill="${THREE_THREADS_COLORS.body}" stroke="${THREE_THREADS_COLORS.stroke}"/>
  <rect x="86" y="64" width="88" height="68" rx="8" fill="${THREE_THREADS_COLORS.nutFill}" stroke="${THREE_THREADS_COLORS.nutStroke}" stroke-width="1.6"/>
  ${[250, 264, 278, 292].map(threadLineMarkup).join('\n  ')}
  <line x1="174" y1="54" x2="292" y2="54" stroke="${THREE_THREADS_COLORS.caution}" stroke-width="2.5"/>
  <line x1="174" y1="48" x2="174" y2="60" stroke="${THREE_THREADS_COLORS.caution}" stroke-width="2"/>
  <line x1="292" y1="48" x2="292" y2="60" stroke="${THREE_THREADS_COLORS.caution}" stroke-width="2"/>
  </g>
  </svg>`;
}
