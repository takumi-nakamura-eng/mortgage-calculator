import type { ReactNode } from 'react';
import type { SectionShape } from '@/lib/beams/sections';
import type { BoltLengthSvgProps } from './bolt-length';

const FILL = '#dde3ed';
const STROKE = '#1e3a5f';
const SW = 1.8;
const DIM = '#4b5563';
const LABEL = '#111827';
const AXIS_C = '#2563eb';
const LOAD_C = '#dc2626';
const ANN_C = '#6d28d9';
const FS = 12;
const FSS = 10;

interface SectionPropertiesSvgProps extends BoltLengthSvgProps {
  shape?: SectionShape;
}

export function SectionPropertiesSvg({
  width = '100%',
  height,
  maxWidth = 420,
  renderContext,
  ariaLabel = '断面図',
  role = 'img',
  ariaHidden,
  framed = false,
  className,
  shape = 'H',
}: SectionPropertiesSvgProps) {
  const resolvedMaxWidth = renderContext === 'card' ? undefined : maxWidth;
  const wrapperStyle = {
    width,
    height: height ?? '100%',
    maxWidth: resolvedMaxWidth,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const;

  return (
    <div className={className} style={wrapperStyle}>
      {shape === 'H' ? <HBeamDiagram width={width} height={height} ariaLabel={ariaLabel} role={role} ariaHidden={ariaHidden} framed={framed} /> : null}
      {shape === 't-bar' ? <TBarDiagram width={width} height={height} ariaLabel={ariaLabel} role={role} ariaHidden={ariaHidden} framed={framed} /> : null}
      {shape === 'rect-tube' ? <RectTubeDiagram width={width} height={height} ariaLabel={ariaLabel} role={role} ariaHidden={ariaHidden} framed={framed} /> : null}
      {shape === 'circ-tube' ? <CircTubeDiagram width={width} height={height} ariaLabel={ariaLabel} role={role} ariaHidden={ariaHidden} framed={framed} /> : null}
      {shape === 'round-bar' ? <RoundBarDiagram width={width} height={height} ariaLabel={ariaLabel} role={role} ariaHidden={ariaHidden} framed={framed} /> : null}
      {shape === 'flat' ? <FlatBarDiagram width={width} height={height} ariaLabel={ariaLabel} role={role} ariaHidden={ariaHidden} framed={framed} /> : null}
      {shape === 'angle' ? <AngleDiagram width={width} height={height} ariaLabel={ariaLabel} role={role} ariaHidden={ariaHidden} framed={framed} /> : null}
      {shape === 'channel' ? <ChannelDiagram width={width} height={height} ariaLabel={ariaLabel} role={role} ariaHidden={ariaHidden} framed={framed} /> : null}
    </div>
  );
}

function baseSvg(props: BoltLengthSvgProps & { label: string; children: ReactNode }) {
  const { width = '100%', height, ariaLabel, role, ariaHidden, framed = false, children } = props;
  return (
    <svg
      viewBox="0 0 280 230"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel ?? props.label}
      aria-hidden={ariaHidden}
      role={role}
      style={{
        display: 'block',
        width: '100%',
        height: height ?? '100%',
        maxWidth: '100%',
        ...(framed ? { background: '#f8fafc', border: '1px solid #d0d0d0', borderRadius: '4px' } : null),
      }}
    >
      {children}
    </svg>
  );
}

function HDim({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) { const mx = (x1 + x2) / 2; return <g><line x1={x1} y1={y} x2={x2} y2={y} stroke={DIM} strokeWidth="0.8" /><line x1={x1} y1={y - 4} x2={x1} y2={y + 4} stroke={DIM} strokeWidth="0.8" /><line x1={x2} y1={y - 4} x2={x2} y2={y + 4} stroke={DIM} strokeWidth="0.8" /><text x={mx} y={y - 5} textAnchor="middle" fontSize={FS} fontWeight="700" fill={LABEL}>{label}</text></g>; }
function VDim({ x, y1, y2, label }: { x: number; y1: number; y2: number; label: string }) { const my = (y1 + y2) / 2; return <g><line x1={x} y1={y1} x2={x} y2={y2} stroke={DIM} strokeWidth="0.8" /><line x1={x - 4} y1={y1} x2={x + 4} y2={y1} stroke={DIM} strokeWidth="0.8" /><line x1={x - 4} y1={y2} x2={x + 4} y2={y2} stroke={DIM} strokeWidth="0.8" /><text x={x - 7} y={my + 4} textAnchor="end" fontSize={FS} fontWeight="700" fill={LABEL}>{label}</text></g>; }
function Leader({ lx, ly, label, textAnchor = 'start' }: { lx: number; ly: number; label: string; textAnchor?: string }) { return <text x={lx} y={ly} fontSize={FSS} fill={DIM} textAnchor={textAnchor as 'start' | 'middle' | 'end'}>{label}</text>; }
function LoadArrow({ cx, top }: { cx: number; top: number }) { return <g><line x1={cx} y1={top - 18} x2={cx} y2={top - 2} stroke={LOAD_C} strokeWidth="2" /><polygon points={`${cx - 5},${top - 2} ${cx + 5},${top - 2} ${cx},${top + 6}`} fill={LOAD_C} /><text x={cx + 8} y={top - 8} fontSize={FSS} fill={LOAD_C}>荷重</text></g>; }
function NeutralAxis({ y, x1 = 50, x2 = 230 }: { y: number; x1?: number; x2?: number }) { return <g><line x1={x1} y1={y} x2={x2} y2={y} stroke={AXIS_C} strokeWidth="1.2" strokeDasharray="6 3" /><text x={x1 - 2} y={y + 4} fontSize={FSS} fill={AXIS_C} textAnchor="end" fontStyle="italic">x</text><text x={x2 + 2} y={y + 4} fontSize={FSS} fill={AXIS_C} fontStyle="italic">x</text></g>; }
function Ann({ y, text }: { y: number; text: string }) { return <text x={140} y={y} textAnchor="middle" fontSize={8.5} fill={ANN_C} fontFamily="'Courier New', Courier, monospace" fontStyle="italic">{text}</text>; }

function HBeamDiagram(props: BoltLengthSvgProps) { const B = 100, H = 150, tf = 13, tw = 10; const lx = 90, ty = 40; const cx = lx + B / 2; const by = ty + H; const ny = ty + H / 2; const hw_s = H - 2 * tf; return baseSvg({ ...props, label: 'H形鋼断面図', children: <><rect x={lx} y={ty} width={B} height={tf} fill={FILL} stroke={STROKE} strokeWidth={SW} /><rect x={cx - tw / 2} y={ty + tf} width={tw} height={hw_s} fill={FILL} stroke={STROKE} strokeWidth={SW} /><rect x={lx} y={by - tf} width={B} height={tf} fill={FILL} stroke={STROKE} strokeWidth={SW} /><NeutralAxis y={ny} /><LoadArrow cx={cx} top={ty} /><VDim x={lx - 18} y1={ty} y2={by} label="H" /><HDim x1={lx} x2={lx + B} y={ty - 16} label="B" /><Leader lx={lx + B + 6} ly={ty + tf / 2 + 3} label="tf" /><line x1={lx + B} y1={ty + tf / 2} x2={lx + B + 5} y2={ty + tf / 2} stroke={DIM} strokeWidth="0.7" /><Leader lx={cx + tw / 2 + 5} ly={ny + 3} label="tw" /><line x1={cx + tw / 2} y1={ny} x2={cx + tw / 2 + 4} y2={ny} stroke={DIM} strokeWidth="0.7" /><line x1={cx - tw / 2 - 6} y1={ty + tf} x2={cx - tw / 2 - 6} y2={by - tf} stroke={ANN_C} strokeWidth="0.8" strokeDasharray="3 2" /><text x={cx - tw / 2 - 9} y={ny + 4} textAnchor="end" fontSize={9} fill={ANN_C} fontStyle="italic">hw</text><Ann y={212} text="hw = H − 2×tf" /></> }); }
function TBarDiagram(props: BoltLengthSvgProps) { const B = 110, H = 150, tf = 16, tw = 12; const lx = 85, ty = 40; const cx = lx + B / 2; const by = ty + H; const hw = H - tf; const ny = ty + 58; return baseSvg({ ...props, label: 'T形鋼断面図', children: <><rect x={lx} y={ty} width={B} height={tf} fill={FILL} stroke={STROKE} strokeWidth={SW} /><rect x={cx - tw / 2} y={ty + tf} width={tw} height={hw} fill={FILL} stroke={STROKE} strokeWidth={SW} /><NeutralAxis y={ny} /><LoadArrow cx={cx} top={ty} /><VDim x={lx - 18} y1={ty} y2={by} label="H" /><HDim x1={lx} x2={lx + B} y={ty - 16} label="B" /><Leader lx={lx + B + 6} ly={ty + tf / 2 + 3} label="tf" /><Leader lx={cx + tw / 2 + 6} ly={ty + tf + hw / 2} label="tw" /><line x1={cx + tw / 2} y1={ty + tf + hw / 2} x2={cx + tw / 2 + 5} y2={ty + tf + hw / 2} stroke={DIM} strokeWidth="0.7" /><Ann y={212} text="hw = H − tf" /></> }); }
function RectTubeDiagram(props: BoltLengthSvgProps) { const B = 100, H = 150, t = 13; const lx = 90, ty = 40; const cx = lx + B / 2; const by = ty + H; const ny = ty + H / 2; return baseSvg({ ...props, label: '角形鋼管断面図', children: <><rect x={lx} y={ty} width={B} height={H} fill={FILL} stroke={STROKE} strokeWidth={SW} /><rect x={lx + t} y={ty + t} width={B - 2 * t} height={H - 2 * t} fill="white" stroke={STROKE} strokeWidth={SW} /><NeutralAxis y={ny} /><LoadArrow cx={cx} top={ty} /><VDim x={lx - 18} y1={ty} y2={by} label="H" /><HDim x1={lx} x2={lx + B} y={ty - 16} label="B" /><Leader lx={lx + B + 6} ly={ty + t / 2 + 3} label="t" /><line x1={lx + B} y1={ty + t / 2} x2={lx + B + 5} y2={ty + t / 2} stroke={DIM} strokeWidth="0.7" /><Leader lx={lx + t / 2 - 4} ly={ty - 4} label="t" textAnchor="middle" /><Ann y={210} text="hi = H − 2t,  bi = B − 2t" /></> }); }
function CircTubeDiagram(props: BoltLengthSvgProps) { const R = 68, r = 52; const cx = 140, cy = 115; return baseSvg({ ...props, label: '丸形鋼管断面図', children: <><circle cx={cx} cy={cy} r={R} fill={FILL} stroke={STROKE} strokeWidth={SW} /><circle cx={cx} cy={cy} r={r} fill="white" stroke={STROKE} strokeWidth={SW} /><NeutralAxis y={cy} /><LoadArrow cx={cx} top={cy - R} /><HDim x1={cx - R} x2={cx + R} y={cy + R + 18} label="D（外径）" /><line x1={cx} y1={cy - R} x2={cx} y2={cy - r} stroke={DIM} strokeWidth="1.5" /><line x1={cx - 5} y1={cy - R} x2={cx + 5} y2={cy - R} stroke={DIM} strokeWidth="0.8" /><line x1={cx - 5} y1={cy - r} x2={cx + 5} y2={cy - r} stroke={DIM} strokeWidth="0.8" /><text x={cx + 7} y={cy - R + (R - r) / 2 + 4} fontSize={FS} fontWeight="700" fill={LABEL}>t</text><line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={ANN_C} strokeWidth="0.7" strokeDasharray="3 2" /><text x={cx + r + 5} y={cy + 4} fontSize={9} fill={ANN_C} fontStyle="italic">di</text><Ann y={215} text="di = D − 2t（内径）" /></> }); }
function RoundBarDiagram(props: BoltLengthSvgProps) { const R = 64; const cx = 140, cy = 115; return baseSvg({ ...props, label: '丸棒断面図', children: <><circle cx={cx} cy={cy} r={R} fill={FILL} stroke={STROKE} strokeWidth={SW} /><NeutralAxis y={cy} /><LoadArrow cx={cx} top={cy - R} /><HDim x1={cx - R} x2={cx + R} y={cy + R + 18} label="D（直径）" /><Ann y={214} text="Ix = Iy = πD⁴ / 64" /></> }); }
function FlatBarDiagram(props: BoltLengthSvgProps) { const B = 80, H = 150; const lx = 100, ty = 40; const cx = lx + B / 2; const by = ty + H; const ny = ty + H / 2; return baseSvg({ ...props, label: 'フラットバー断面図', children: <><rect x={lx} y={ty} width={B} height={H} fill={FILL} stroke={STROKE} strokeWidth={SW} /><NeutralAxis y={ny} /><LoadArrow cx={cx} top={ty} /><VDim x={lx - 18} y1={ty} y2={by} label="H" /><HDim x1={lx} x2={lx + B} y={ty - 16} label="B" /><Ann y={212} text="Ix = B×H³/12,  Iy = H×B³/12" /></> }); }
function AngleDiagram(props: BoltLengthSvgProps) { const b = 125, t = 13; const ox = 70, oy = 190; const pts = [[ox, oy - b], [ox + t, oy - b], [ox + t, oy - t], [ox + b, oy - t], [ox + b, oy], [ox, oy]].map((p) => p.join(',')).join(' '); const yc_s = (b * b + b * t - t * t) / (2 * (2 * b - t)); const ny = oy - yc_s; return baseSvg({ ...props, label: '等辺山形鋼断面図', children: <><polygon points={pts} fill={FILL} stroke={STROKE} strokeWidth={SW} /><NeutralAxis y={ny} x1={42} x2={220} /><LoadArrow cx={ox + t / 2} top={oy - b} /><VDim x={ox - 18} y1={oy - b} y2={oy} label="b" /><HDim x1={ox} x2={ox + b} y={oy + 16} label="b" /><HDim x1={ox} x2={ox + t} y={oy - b / 2} label="t" /><line x1={ox - 5} y1={ny} x2={ox} y2={ny} stroke={ANN_C} strokeWidth="0.8" /><text x={ox - 7} y={ny + 3} textAnchor="end" fontSize={9} fill={ANN_C} fontStyle="italic">yc</text><Ann y={210} text="yc = (b²+bt−t²) / (2(2b−t))" /></> }); }
function ChannelDiagram(props: BoltLengthSvgProps) { const H = 150, B = 75, tw = 10, tf = 13; const ox = 90, ty = 40; const by = ty + H; const cxShape = ox + B / 2; const ny = ty + H / 2; const pts = [[ox, ty], [ox + B, ty], [ox + B, ty + tf], [ox + tw, ty + tf], [ox + tw, by - tf], [ox + B, by - tf], [ox + B, by], [ox, by]].map((p) => p.join(',')).join(' '); return baseSvg({ ...props, label: '溝形鋼断面図', children: <><polygon points={pts} fill={FILL} stroke={STROKE} strokeWidth={SW} /><NeutralAxis y={ny} /><LoadArrow cx={cxShape} top={ty} /><VDim x={ox - 18} y1={ty} y2={by} label="H" /><HDim x1={ox} x2={ox + B} y={ty - 16} label="B" /><Leader lx={ox + B + 6} ly={ty + tf / 2 + 3} label="tf" /><line x1={ox + B} y1={ty + tf / 2} x2={ox + B + 5} y2={ty + tf / 2} stroke={DIM} strokeWidth="0.7" /><Leader lx={ox + tw / 2 - 4} ly={ny - 4} label="tw" textAnchor="middle" /><line x1={ox - 5} y1={ty + tf} x2={ox} y2={ty + tf} stroke={ANN_C} strokeWidth="0.8" /><line x1={ox - 5} y1={by - tf} x2={ox} y2={by - tf} stroke={ANN_C} strokeWidth="0.8" /><line x1={ox - 4} y1={ty + tf} x2={ox - 4} y2={by - tf} stroke={ANN_C} strokeWidth="0.8" strokeDasharray="3 2" /><text x={ox - 7} y={ny + 3} textAnchor="end" fontSize={9} fill={ANN_C} fontStyle="italic">hw</text><Ann y={212} text="hw = H − 2×tf,  xc = (B²tf + hw·tw²/2) / A" /></> }); }
