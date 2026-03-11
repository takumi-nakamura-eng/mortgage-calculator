import type { SteelShape } from '@/lib/steelWeight';
import type { BoltLengthSvgProps } from './bolt-length';

interface SteelWeightSvgProps extends BoltLengthSvgProps {
  shape?: SteelShape;
}

const COLORS = {
  fill: '#dbe4f0',
  stroke: '#1e3a5f',
  dim: '#4b5563',
  accent: '#2563eb',
  note: '#0f766e',
} as const;

export function SteelWeightSvg({
  width = '100%',
  height,
  maxWidth = 320,
  ariaLabel = '鋼材重量計算用断面図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
  shape = 'plate',
}: SteelWeightSvgProps) {
  return (
    <svg
      viewBox="0 0 280 220"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={{
        display: 'block',
        width: '100%',
        height: height ?? '100%',
        maxWidth,
        ...(framed ? { background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px' } : null),
      }}
    >
      {shape === 'plate' ? <PlateDiagram /> : null}
      {shape === 'roundBar' ? <RoundBarDiagram /> : null}
      {shape === 'flatBar' ? <FlatBarDiagram /> : null}
      {shape === 'roundPipe' ? <RoundPipeDiagram /> : null}
      {shape === 'rectPipe' ? <RectPipeDiagram /> : null}
      {shape === 'hBeam' ? <HBeamDiagram /> : null}
      {shape === 'channel' ? <ChannelDiagram /> : null}
      {shape === 'squareTube' ? <SquareTubeDiagram /> : null}
      <text x="140" y="206" textAnchor="middle" fontSize="11" fill={COLORS.note}>
        断面積 × 密度 で kg/m を計算
      </text>
    </svg>
  );
}

function PlateDiagram() {
  return (
    <>
      <rect x="55" y="88" width="170" height="32" rx="4" fill={COLORS.fill} stroke={COLORS.stroke} strokeWidth="2" />
      <DimH x1={55} x2={225} y={72} label="b" />
      <DimV x={40} y1={88} y2={120} label="t" />
    </>
  );
}

function RoundBarDiagram() {
  return (
    <>
      <circle cx="140" cy="104" r="54" fill={COLORS.fill} stroke={COLORS.stroke} strokeWidth="2" />
      <DimH x1={86} x2={194} y={176} label="d" />
    </>
  );
}

function FlatBarDiagram() {
  return (
    <>
      <rect x="72" y="70" width="136" height="72" rx="4" fill={COLORS.fill} stroke={COLORS.stroke} strokeWidth="2" />
      <DimH x1={72} x2={208} y={54} label="a" />
      <DimV x={56} y1={70} y2={142} label="b" />
    </>
  );
}

function RoundPipeDiagram() {
  return (
    <>
      <circle cx="140" cy="104" r="56" fill={COLORS.fill} stroke={COLORS.stroke} strokeWidth="2" />
      <circle cx="140" cy="104" r="40" fill="#fff" stroke={COLORS.stroke} strokeWidth="2" />
      <DimH x1={84} x2={196} y={176} label="D" />
      <text x="184" y="70" fontSize="12" fill={COLORS.dim}>t</text>
      <line x1="172" y1="72" x2="160" y2="84" stroke={COLORS.dim} strokeWidth="1.2" />
    </>
  );
}

function RectPipeDiagram() {
  return (
    <>
      <rect x="72" y="58" width="136" height="92" rx="4" fill={COLORS.fill} stroke={COLORS.stroke} strokeWidth="2" />
      <rect x="96" y="82" width="88" height="44" rx="2" fill="#fff" stroke={COLORS.stroke} strokeWidth="2" />
      <DimH x1={72} x2={208} y={44} label="B" />
      <DimV x={56} y1={58} y2={150} label="H" />
      <text x="196" y="78" fontSize="12" fill={COLORS.dim}>t</text>
      <line x1="188" y1="80" x2="182" y2="86" stroke={COLORS.dim} strokeWidth="1.2" />
    </>
  );
}

function HBeamDiagram() {
  return (
    <>
      <rect x="78" y="54" width="124" height="18" rx="2" fill={COLORS.fill} stroke={COLORS.stroke} strokeWidth="2" />
      <rect x="128" y="72" width="24" height="76" fill={COLORS.fill} stroke={COLORS.stroke} strokeWidth="2" />
      <rect x="78" y="148" width="124" height="18" rx="2" fill={COLORS.fill} stroke={COLORS.stroke} strokeWidth="2" />
      <DimH x1={78} x2={202} y={38} label="B" />
      <DimV x={62} y1={54} y2={166} label="H" />
      <text x="210" y="69" fontSize="12" fill={COLORS.dim}>tf</text>
      <text x="158" y="114" fontSize="12" fill={COLORS.dim}>tw</text>
    </>
  );
}

function ChannelDiagram() {
  return (
    <>
      <path d="M90 54 H196 V72 H116 V148 H196 V166 H90 Z" fill={COLORS.fill} stroke={COLORS.stroke} strokeWidth="2" />
      <DimH x1={90} x2={196} y={38} label="B" />
      <DimV x={72} y1={54} y2={166} label="H" />
      <text x="205" y="69" fontSize="12" fill={COLORS.dim}>tf</text>
      <text x="124" y="114" fontSize="12" fill={COLORS.dim}>tw</text>
    </>
  );
}

function SquareTubeDiagram() {
  return (
    <>
      <rect x="74" y="58" width="132" height="132" rx="4" fill={COLORS.fill} stroke={COLORS.stroke} strokeWidth="2" />
      <rect x="98" y="82" width="84" height="84" rx="2" fill="#fff" stroke={COLORS.stroke} strokeWidth="2" />
      <DimH x1={74} x2={206} y={42} label="B" />
      <text x="194" y="78" fontSize="12" fill={COLORS.dim}>t</text>
      <line x1="188" y1="80" x2="182" y2="86" stroke={COLORS.dim} strokeWidth="1.2" />
    </>
  );
}

function DimH({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={COLORS.dim} strokeWidth="1" />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} stroke={COLORS.dim} strokeWidth="1" />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} stroke={COLORS.dim} strokeWidth="1" />
      <text x={(x1 + x2) / 2} y={y - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill={COLORS.accent}>
        {label}
      </text>
    </g>
  );
}

function DimV({ x, y1, y2, label }: { x: number; y1: number; y2: number; label: string }) {
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={COLORS.dim} strokeWidth="1" />
      <line x1={x - 4} y1={y1} x2={x + 4} y2={y1} stroke={COLORS.dim} strokeWidth="1" />
      <line x1={x - 4} y1={y2} x2={x + 4} y2={y2} stroke={COLORS.dim} strokeWidth="1" />
      <text x={x - 8} y={(y1 + y2) / 2 + 4} textAnchor="end" fontSize="12" fontWeight="700" fill={COLORS.accent}>
        {label}
      </text>
    </g>
  );
}
