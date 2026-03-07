import type { CSSProperties } from 'react';

export interface BoltLengthSvgProps {
  width?: number | string;
  height?: number | string;
  maxWidth?: number;
  ariaLabel?: string;
  role?: 'img' | 'presentation';
  ariaHidden?: boolean;
  framed?: boolean;
  className?: string;
}

const BOLT_LENGTH_COLORS = {
  stroke: '#334155',
  text: '#334155',
  strongText: '#1f2937',
  centerline: '#94a3b8',
  head: '#94a3b8',
  shank: '#64748b',
  plateFill: '#dbeafe',
  plateStroke: '#1d4ed8',
  plainWasher: '#cbd5e1',
  springWasher: '#e2e8f0',
  nut: '#a3b8cf',
  thread: '#cbd5e1',
  frameFill: '#f8fafc',
  frameStroke: '#cbd5e1',
} as const;

function buildSvgStyle(options: Pick<BoltLengthSvgProps, 'maxWidth' | 'framed'>): CSSProperties {
  return {
    display: 'block',
    maxWidth: options.maxWidth !== undefined ? `${options.maxWidth}px` : '100%',
    ...(options.framed === false
      ? null
      : {
          background: BOLT_LENGTH_COLORS.frameFill,
          border: `1px solid ${BOLT_LENGTH_COLORS.frameStroke}`,
          borderRadius: '6px',
        }),
  };
}

function HorizontalDimension({
  x1,
  x2,
  y,
  label,
}: {
  x1: number;
  x2: number;
  y: number;
  label: string;
}) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={BOLT_LENGTH_COLORS.stroke} strokeWidth="1" />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} stroke={BOLT_LENGTH_COLORS.stroke} strokeWidth="1" />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} stroke={BOLT_LENGTH_COLORS.stroke} strokeWidth="1" />
      <text
        x={(x1 + x2) / 2}
        y={y + 13}
        textAnchor="middle"
        fontSize="11"
        fill={BOLT_LENGTH_COLORS.strongText}
        fontWeight={700}
      >
        {label}
      </text>
    </g>
  );
}

export function BoltLengthSvg({
  width = 420,
  height = 176,
  maxWidth,
  ariaLabel = 'ボルト締結の概略図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: BoltLengthSvgProps) {
  const style = buildSvgStyle({ maxWidth, framed });

  return (
    <svg
      viewBox="0 0 620 260"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={style}
    >
      <line x1="90" y1="132" x2="530" y2="132" stroke={BOLT_LENGTH_COLORS.centerline} strokeDasharray="4 3" strokeWidth="1" />

      <polygon
        points="214,98 248,98 259,112 259,152 248,166 214,166 203,152 203,112"
        fill={BOLT_LENGTH_COLORS.head}
        stroke={BOLT_LENGTH_COLORS.stroke}
        strokeWidth="1.4"
      />
      <rect x="248" y="120" width="166" height="24" fill={BOLT_LENGTH_COLORS.shank} stroke={BOLT_LENGTH_COLORS.stroke} strokeWidth="1" />

      <rect x="248" y="92" width="70" height="80" fill={BOLT_LENGTH_COLORS.plateFill} stroke={BOLT_LENGTH_COLORS.plateStroke} strokeWidth="1.3" />

      <rect x="318" y="96" width="12" height="72" fill={BOLT_LENGTH_COLORS.plainWasher} stroke={BOLT_LENGTH_COLORS.stroke} strokeWidth="1.2" />
      <rect x="330" y="100" width="12" height="64" fill={BOLT_LENGTH_COLORS.springWasher} stroke={BOLT_LENGTH_COLORS.stroke} strokeDasharray="4 2" strokeWidth="1.2" />

      <polygon
        points="342,104 394,104 402,114 402,150 394,160 342,160"
        fill={BOLT_LENGTH_COLORS.nut}
        stroke={BOLT_LENGTH_COLORS.stroke}
        strokeWidth="1.3"
      />

      {[394, 399, 404, 409, 414].map((x) => (
        <line key={x} x1={x} y1="120" x2={x} y2="144" stroke={BOLT_LENGTH_COLORS.thread} strokeWidth="1.1" />
      ))}

      <text x="231" y="88" textAnchor="middle" fontSize="12" fill={BOLT_LENGTH_COLORS.text} fontWeight={700}>ボルト</text>
      <text x="283" y="88" textAnchor="middle" fontSize="12" fill={BOLT_LENGTH_COLORS.plateStroke} fontWeight={700}>締結体</text>

      <text x="306" y="64" textAnchor="end" fontSize="11" fill={BOLT_LENGTH_COLORS.text} fontWeight={700}>平座金</text>
      <line x1="307" y1="68" x2="324" y2="96" stroke={BOLT_LENGTH_COLORS.stroke} strokeWidth="1" />

      <text x="352" y="64" textAnchor="start" fontSize="11" fill={BOLT_LENGTH_COLORS.text} fontWeight={700}>ばね座金</text>
      <line x1="354" y1="68" x2="336" y2="100" stroke={BOLT_LENGTH_COLORS.stroke} strokeWidth="1" />

      <text x="368" y="96" textAnchor="middle" fontSize="12" fill={BOLT_LENGTH_COLORS.text} fontWeight={700}>ナット</text>

      <HorizontalDimension x1={248} x2={414} y={34} label="L_required（首下長さ）" />

      <HorizontalDimension x1={248} x2={318} y={212} label="t" />
      <HorizontalDimension x1={342} x2={394} y={212} label="Hnut" />
      <HorizontalDimension x1={394} x2={414} y={212} label=">3p" />

      <line x1="318" y1="212" x2="330" y2="212" stroke={BOLT_LENGTH_COLORS.stroke} strokeWidth="1" />
      <line x1="318" y1="208" x2="318" y2="216" stroke={BOLT_LENGTH_COLORS.stroke} strokeWidth="1" />
      <line x1="330" y1="208" x2="330" y2="216" stroke={BOLT_LENGTH_COLORS.stroke} strokeWidth="1" />
      <text x="308" y="198" textAnchor="middle" fontSize="12" fill={BOLT_LENGTH_COLORS.strongText} fontWeight={700}>Hpw</text>
      <line x1="312" y1="201" x2="324" y2="209" stroke={BOLT_LENGTH_COLORS.stroke} strokeWidth="1" />

      <line x1="330" y1="212" x2="342" y2="212" stroke={BOLT_LENGTH_COLORS.stroke} strokeWidth="1" />
      <line x1="330" y1="208" x2="330" y2="216" stroke={BOLT_LENGTH_COLORS.stroke} strokeWidth="1" />
      <line x1="342" y1="208" x2="342" y2="216" stroke={BOLT_LENGTH_COLORS.stroke} strokeWidth="1" />
      <text x="354" y="198" textAnchor="middle" fontSize="12" fill={BOLT_LENGTH_COLORS.strongText} fontWeight={700}>Hsw</text>
      <line x1="350" y1="201" x2="336" y2="209" stroke={BOLT_LENGTH_COLORS.stroke} strokeWidth="1" />
    </svg>
  );
}

interface BoltSvgMarkupOptions {
  width?: number | string;
  height?: number | string;
  maxWidth?: number;
  includeXmlns?: boolean;
}

function hdim(x1: number, x2: number, y: number, label: string): string {
  const cx = (x1 + x2) / 2;
  return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${BOLT_LENGTH_COLORS.stroke}" stroke-width="1"/>
  <line x1="${x1}" y1="${y - 4}" x2="${x1}" y2="${y + 4}" stroke="${BOLT_LENGTH_COLORS.stroke}" stroke-width="1"/>
  <line x1="${x2}" y1="${y - 4}" x2="${x2}" y2="${y + 4}" stroke="${BOLT_LENGTH_COLORS.stroke}" stroke-width="1"/>
  <text x="${cx}" y="${y + 13}" text-anchor="middle" font-size="11" fill="${BOLT_LENGTH_COLORS.strongText}" font-weight="700">${label}</text>`;
}

export function getBoltLengthSvgMarkup(options: BoltSvgMarkupOptions = {}): string {
  const {
    width = 420,
    height = 176,
    maxWidth,
    includeXmlns = true,
  } = options;
  const maxWidthStyle = maxWidth !== undefined ? `;max-width:${maxWidth}px` : ';max-width:100%';
  const xmlns = includeXmlns ? ' xmlns="http://www.w3.org/2000/svg"' : '';

  return `<svg viewBox="0 0 620 260" preserveAspectRatio="xMidYMid meet"${xmlns} width="${width}" height="${height}" aria-label="ボルト締結の概略図" style="display:block${maxWidthStyle};background:${BOLT_LENGTH_COLORS.frameFill};border:1px solid ${BOLT_LENGTH_COLORS.frameStroke};border-radius:6px;">
  <line x1="90" y1="132" x2="530" y2="132" stroke="${BOLT_LENGTH_COLORS.centerline}" stroke-dasharray="4 3" stroke-width="1"/>
  <polygon points="214,98 248,98 259,112 259,152 248,166 214,166 203,152 203,112" fill="${BOLT_LENGTH_COLORS.head}" stroke="${BOLT_LENGTH_COLORS.stroke}" stroke-width="1.4"/>
  <rect x="248" y="120" width="166" height="24" fill="${BOLT_LENGTH_COLORS.shank}" stroke="${BOLT_LENGTH_COLORS.stroke}" stroke-width="1"/>
  <rect x="248" y="92" width="70" height="80" fill="${BOLT_LENGTH_COLORS.plateFill}" stroke="${BOLT_LENGTH_COLORS.plateStroke}" stroke-width="1.3"/>
  <rect x="318" y="96" width="12" height="72" fill="${BOLT_LENGTH_COLORS.plainWasher}" stroke="${BOLT_LENGTH_COLORS.stroke}" stroke-width="1.2"/>
  <rect x="330" y="100" width="12" height="64" fill="${BOLT_LENGTH_COLORS.springWasher}" stroke="${BOLT_LENGTH_COLORS.stroke}" stroke-dasharray="4 2" stroke-width="1.2"/>
  <polygon points="342,104 394,104 402,114 402,150 394,160 342,160" fill="${BOLT_LENGTH_COLORS.nut}" stroke="${BOLT_LENGTH_COLORS.stroke}" stroke-width="1.3"/>
  <line x1="394" y1="120" x2="394" y2="144" stroke="${BOLT_LENGTH_COLORS.thread}" stroke-width="1.1"/>
  <line x1="399" y1="120" x2="399" y2="144" stroke="${BOLT_LENGTH_COLORS.thread}" stroke-width="1.1"/>
  <line x1="404" y1="120" x2="404" y2="144" stroke="${BOLT_LENGTH_COLORS.thread}" stroke-width="1.1"/>
  <line x1="409" y1="120" x2="409" y2="144" stroke="${BOLT_LENGTH_COLORS.thread}" stroke-width="1.1"/>
  <line x1="414" y1="120" x2="414" y2="144" stroke="${BOLT_LENGTH_COLORS.thread}" stroke-width="1.1"/>
  <text x="231" y="88" text-anchor="middle" font-size="12" fill="${BOLT_LENGTH_COLORS.text}" font-weight="700">ボルト</text>
  <text x="283" y="88" text-anchor="middle" font-size="12" fill="${BOLT_LENGTH_COLORS.plateStroke}" font-weight="700">締結体</text>
  <text x="306" y="64" text-anchor="end" font-size="11" fill="${BOLT_LENGTH_COLORS.text}" font-weight="700">平座金</text>
  <line x1="307" y1="68" x2="324" y2="96" stroke="${BOLT_LENGTH_COLORS.stroke}" stroke-width="1"/>
  <text x="352" y="64" text-anchor="start" font-size="11" fill="${BOLT_LENGTH_COLORS.text}" font-weight="700">ばね座金</text>
  <line x1="354" y1="68" x2="336" y2="100" stroke="${BOLT_LENGTH_COLORS.stroke}" stroke-width="1"/>
  <text x="368" y="96" text-anchor="middle" font-size="12" fill="${BOLT_LENGTH_COLORS.text}" font-weight="700">ナット</text>
  ${hdim(248, 414, 34, 'L_required（首下長さ）')}
  ${hdim(248, 318, 212, 't')}
  ${hdim(342, 394, 212, 'Hnut')}
  ${hdim(394, 414, 212, '>3p')}
  <line x1="318" y1="212" x2="330" y2="212" stroke="${BOLT_LENGTH_COLORS.stroke}" stroke-width="1"/>
  <line x1="318" y1="208" x2="318" y2="216" stroke="${BOLT_LENGTH_COLORS.stroke}" stroke-width="1"/>
  <line x1="330" y1="208" x2="330" y2="216" stroke="${BOLT_LENGTH_COLORS.stroke}" stroke-width="1"/>
  <text x="308" y="198" text-anchor="middle" font-size="12" fill="${BOLT_LENGTH_COLORS.strongText}" font-weight="700">Hpw</text>
  <line x1="312" y1="201" x2="324" y2="209" stroke="${BOLT_LENGTH_COLORS.stroke}" stroke-width="1"/>
  <line x1="330" y1="212" x2="342" y2="212" stroke="${BOLT_LENGTH_COLORS.stroke}" stroke-width="1"/>
  <line x1="330" y1="208" x2="330" y2="216" stroke="${BOLT_LENGTH_COLORS.stroke}" stroke-width="1"/>
  <line x1="342" y1="208" x2="342" y2="216" stroke="${BOLT_LENGTH_COLORS.stroke}" stroke-width="1"/>
  <text x="354" y="198" text-anchor="middle" font-size="12" fill="${BOLT_LENGTH_COLORS.strongText}" font-weight="700">Hsw</text>
  <line x1="350" y1="201" x2="336" y2="209" stroke="${BOLT_LENGTH_COLORS.stroke}" stroke-width="1"/>
  </svg>`;
}

export function getBoltLengthSvgString(): string {
  return getBoltLengthSvgMarkup();
}
