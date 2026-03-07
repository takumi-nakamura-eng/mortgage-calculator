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
  height = 180,
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
      viewBox="0 0 560 180"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={style}
    >
      <line x1="56" y1="130" x2="504" y2="130" stroke={THREE_THREADS_COLORS.guide} strokeDasharray="4 4" />
      <rect x="88" y="118" width="300" height="24" rx="4" fill={THREE_THREADS_COLORS.body} stroke={THREE_THREADS_COLORS.stroke} />
      <rect x="184" y="96" width="92" height="68" rx="6" fill={THREE_THREADS_COLORS.nutFill} stroke={THREE_THREADS_COLORS.nutStroke} strokeWidth="1.4" />

      {[388, 402, 416, 430, 444].map((x) => (
        <line key={x} x1={x} y1="118" x2={x} y2="142" stroke={THREE_THREADS_COLORS.threadFill} strokeWidth="1.2" />
      ))}

      <line x1="276" y1="84" x2="388" y2="84" stroke={THREE_THREADS_COLORS.stroke} strokeWidth="1" />
      <line x1="276" y1="80" x2="276" y2="88" stroke={THREE_THREADS_COLORS.stroke} strokeWidth="1" />
      <line x1="388" y1="80" x2="388" y2="88" stroke={THREE_THREADS_COLORS.stroke} strokeWidth="1" />
      <text x="332" y="72" textAnchor="middle" fontSize="12" fill={THREE_THREADS_COLORS.text} fontWeight={700}>
        ナット高さ
      </text>

      <line x1="388" y1="94" x2="444" y2="94" stroke={THREE_THREADS_COLORS.caution} strokeWidth="2.5" />
      <line x1="388" y1="88" x2="388" y2="100" stroke={THREE_THREADS_COLORS.caution} strokeWidth="2" />
      <line x1="444" y1="88" x2="444" y2="100" stroke={THREE_THREADS_COLORS.caution} strokeWidth="2" />
      <text x="416" y="80" textAnchor="middle" fontSize="12" fill={THREE_THREADS_COLORS.caution} fontWeight={700}>
        3山以上
      </text>

      <text x="230" y="148" textAnchor="middle" fontSize="12" fill={THREE_THREADS_COLORS.nutStroke} fontWeight={700}>
        ナット
      </text>
      <text x="426" y="148" textAnchor="middle" fontSize="12" fill={THREE_THREADS_COLORS.text} fontWeight={700}>
        余長 3p
      </text>
      <text x="90" y="108" fontSize="11" fill={THREE_THREADS_COLORS.subtleText}>
        不完全ねじ部をナット外へ逃がす
      </text>
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

  return `<svg viewBox="0 0 560 180" preserveAspectRatio="xMidYMid meet"${xmlns} width="${width}" height="${height}" aria-label="ナットから先端3山以上を出すボルト締結の概略図" style="display:block${maxWidthStyle};background:${THREE_THREADS_COLORS.frameFill};border:1px solid ${THREE_THREADS_COLORS.frameStroke};border-radius:6px;">
  <line x1="56" y1="130" x2="504" y2="130" stroke="${THREE_THREADS_COLORS.guide}" stroke-dasharray="4 4"/>
  <rect x="88" y="118" width="300" height="24" rx="4" fill="${THREE_THREADS_COLORS.body}" stroke="${THREE_THREADS_COLORS.stroke}"/>
  <rect x="184" y="96" width="92" height="68" rx="6" fill="${THREE_THREADS_COLORS.nutFill}" stroke="${THREE_THREADS_COLORS.nutStroke}" stroke-width="1.4"/>
  ${[388, 402, 416, 430, 444].map(threadLineMarkup).join('\n  ')}
  <line x1="276" y1="84" x2="388" y2="84" stroke="${THREE_THREADS_COLORS.stroke}" stroke-width="1"/>
  <line x1="276" y1="80" x2="276" y2="88" stroke="${THREE_THREADS_COLORS.stroke}" stroke-width="1"/>
  <line x1="388" y1="80" x2="388" y2="88" stroke="${THREE_THREADS_COLORS.stroke}" stroke-width="1"/>
  <text x="332" y="72" text-anchor="middle" font-size="12" fill="${THREE_THREADS_COLORS.text}" font-weight="700">ナット高さ</text>
  <line x1="388" y1="94" x2="444" y2="94" stroke="${THREE_THREADS_COLORS.caution}" stroke-width="2.5"/>
  <line x1="388" y1="88" x2="388" y2="100" stroke="${THREE_THREADS_COLORS.caution}" stroke-width="2"/>
  <line x1="444" y1="88" x2="444" y2="100" stroke="${THREE_THREADS_COLORS.caution}" stroke-width="2"/>
  <text x="416" y="80" text-anchor="middle" font-size="12" fill="${THREE_THREADS_COLORS.caution}" font-weight="700">3山以上</text>
  <text x="230" y="148" text-anchor="middle" font-size="12" fill="${THREE_THREADS_COLORS.nutStroke}" font-weight="700">ナット</text>
  <text x="426" y="148" text-anchor="middle" font-size="12" fill="${THREE_THREADS_COLORS.text}" font-weight="700">余長 3p</text>
  <text x="90" y="108" font-size="11" fill="${THREE_THREADS_COLORS.subtleText}">不完全ねじ部をナット外へ逃がす</text>
  </svg>`;
}
