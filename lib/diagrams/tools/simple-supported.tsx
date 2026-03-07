import type { BoltLengthSvgProps } from './bolt-length';
import type { LoadCase } from '@/lib/beams/simpleBeam';

interface SimpleSupportedSvgProps extends BoltLengthSvgProps {
  loadCase?: LoadCase;
  spanLabel?: string;
  loadLabel?: string;
}

const W = 360;
const H_SVG = 180;
const BEAM_Y = 90;
const BEAM_H = 14;
const BEAM_X1 = 40;
const BEAM_X2 = 320;
const SUP_H = 18;

export function SimpleSupportedSvg({
  width = '100%',
  height,
  maxWidth = 420,
  ariaLabel = '単純梁模式図',
  role = 'img',
  ariaHidden,
  framed = false,
  className,
  loadCase = 'center',
  spanLabel,
  loadLabel,
}: SimpleSupportedSvgProps) {
  const beamTop = BEAM_Y - BEAM_H / 2;
  const beamBot = BEAM_Y + BEAM_H / 2;
  const pinLeft = trianglePoints(BEAM_X1, beamBot, SUP_H);
  const rolRight = trianglePoints(BEAM_X2, beamBot, SUP_H);
  const arrowLen = 38;
  const arrowHeadSize = 8;
  const loads: Array<{ x: number; label?: string }> = (() => {
    if (loadCase === 'center') {
      return [{ x: (BEAM_X1 + BEAM_X2) / 2, label: loadLabel }];
    }
    const count = 7;
    const step = (BEAM_X2 - BEAM_X1) / (count - 1);
    return Array.from({ length: count }, (_, i) => ({
      x: BEAM_X1 + i * step,
      label: i === Math.floor(count / 2) ? loadLabel : undefined,
    }));
  })();
  const arrowTopY = beamTop - arrowLen;

  return (
    <svg
      viewBox={`0 0 ${W} ${H_SVG}`}
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={{ display: 'block', maxWidth: `${maxWidth}px`, ...(framed ? { background: '#f8fafc', border: '1px solid #d0d0d0', borderRadius: '4px' } : null) }}
    >
      <GroundHatch x={BEAM_X1} y={beamBot + SUP_H} />
      <GroundHatch x={BEAM_X2} y={beamBot + SUP_H} roller />
      <rect x={BEAM_X1} y={beamTop} width={BEAM_X2 - BEAM_X1} height={BEAM_H} fill="#2563eb" rx={2} />
      <polygon points={pinLeft} fill="#1e3a5f" />
      <polygon points={rolRight} fill="none" stroke="#1e3a5f" strokeWidth={2} />
      <circle cx={BEAM_X2} cy={beamBot + SUP_H + 5} r={5} fill="none" stroke="#1e3a5f" strokeWidth={2} />
      {loads.map((ld, i) => (
        <g key={i}>
          <line x1={ld.x} y1={arrowTopY} x2={ld.x} y2={beamTop - 1} stroke="#dc2626" strokeWidth={loadCase === 'center' ? 2.5 : 1.5} />
          <polygon points={arrowHead(ld.x, beamTop - 1, arrowHeadSize)} fill="#dc2626" />
          {ld.label ? <text x={ld.x} y={arrowTopY - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">{ld.label}</text> : null}
        </g>
      ))}
      {loadCase === 'uniform' ? <line x1={BEAM_X1} y1={arrowTopY} x2={BEAM_X2} y2={arrowTopY} stroke="#dc2626" strokeWidth={2} /> : null}
      {spanLabel ? <SpanDim x1={BEAM_X1} x2={BEAM_X2} y={beamBot + SUP_H + 28} label={`L = ${spanLabel}`} /> : null}
      <text x={BEAM_X1} y={beamBot + SUP_H + (spanLabel ? 14 : 20)} textAnchor="middle" fontSize={9} fill="#555">ピン</text>
      <text x={BEAM_X2} y={beamBot + SUP_H + (spanLabel ? 14 : 20)} textAnchor="middle" fontSize={9} fill="#555">ローラ</text>
    </svg>
  );
}

function trianglePoints(cx: number, baseY: number, h: number): string {
  const hw = h * 0.7;
  return `${cx},${baseY} ${cx - hw},${baseY + h} ${cx + hw},${baseY + h}`;
}

function arrowHead(x: number, tipY: number, size: number): string {
  return `${x},${tipY} ${x - size / 2},${tipY - size} ${x + size / 2},${tipY - size}`;
}

function GroundHatch({ x, y }: { x: number; y: number; roller?: boolean }) {
  const w = 28;
  const step = 6;
  const lines = [];
  for (let i = 0; i <= w; i += step) {
    lines.push(<line key={i} x1={x - w / 2 + i} y1={y} x2={x - w / 2 + i - 8} y2={y + 10} stroke="#888" strokeWidth={1} />);
  }
  return (
    <g>
      <line x1={x - w / 2} y1={y} x2={x + w / 2} y2={y} stroke="#555" strokeWidth={1.5} />
      {lines}
    </g>
  );
}

function SpanDim({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  const tick = 5;
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="#374151" strokeWidth={1} />
      <line x1={x1} y1={y - tick} x2={x1} y2={y + tick} stroke="#374151" strokeWidth={1} />
      <line x1={x2} y1={y - tick} x2={x2} y2={y + tick} stroke="#374151" strokeWidth={1} />
      <text x={(x1 + x2) / 2} y={y + 13} textAnchor="middle" fontSize={11} fontWeight={600} fill="#374151">{label}</text>
    </g>
  );
}
