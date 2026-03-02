'use client';

import { M12_REFERENCE_GEOMETRY } from '@/lib/bolts/specs';

const SCALE = 4;

function fmt1(v: number): string {
  return v.toFixed(1);
}

function fmt2(v: number): string {
  return v.toFixed(2);
}

function Hdim({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="#334155" strokeWidth="1.1" />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} stroke="#334155" strokeWidth="1.1" />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} stroke="#334155" strokeWidth="1.1" />
      <text x={(x1 + x2) / 2} y={y + 13} textAnchor="middle" fontSize="11" fontWeight={700} fill="#1f2937">
        {label}
      </text>
    </g>
  );
}

function Vdim({ x, y1, y2, label }: { x: number; y1: number; y2: number; label: string }) {
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke="#334155" strokeWidth="1.1" />
      <line x1={x - 4} y1={y1} x2={x + 4} y2={y1} stroke="#334155" strokeWidth="1.1" />
      <line x1={x - 4} y1={y2} x2={x + 4} y2={y2} stroke="#334155" strokeWidth="1.1" />
      <text x={x - 7} y={(y1 + y2) / 2 + 4} textAnchor="end" fontSize="11" fontWeight={700} fill="#1f2937">
        {label}
      </text>
    </g>
  );
}

export default function BoltDimensionDiagram() {
  const g = M12_REFERENCE_GEOMETRY;

  const dPx = g.threadDiameter_mm * SCALE;
  const sPx = g.headWidthAcrossFlats_mm * SCALE;
  const kPx = g.headHeight_mm * SCALE;
  const tPx = 12.0 * SCALE;
  const hNutPx = g.nutHeight_mm * SCALE;
  const hPwPx = g.plainWasherThickness_mm * SCALE;
  const hSwPx = g.springWasherThickness_mm * SCALE;
  const tipPx = g.threePitch_mm * SCALE;

  const odPwPx = g.plainWasherOuterDiameter_mm * SCALE;
  const odSwPx = g.springWasherOuterDiameter_mm * SCALE;

  const cy = 130;
  const headX = 80;
  const headY = cy - sPx / 2;

  const shankX1 = headX + kPx;
  const plateX1 = 150;
  const plateX2 = plateX1 + tPx;
  const pwX1 = plateX2 + 10;
  const pwX2 = pwX1 + hPwPx;
  const swX1 = pwX2;
  const swX2 = swX1 + hSwPx;
  const nutX1 = swX2;
  const nutX2 = nutX1 + hNutPx;
  const tipX1 = nutX2;
  const tipX2 = tipX1 + tipPx;

  const shaftY = cy - dPx / 2;

  return (
    <svg
      viewBox="0 0 520 290"
      width="100%"
      aria-label="M12ボルト締結の寸法概略図"
      style={{ display: 'block', maxWidth: 680 }}
    >
      <rect x="0" y="0" width="520" height="290" rx="10" fill="#f8fafc" stroke="#cbd5e1" />

      <line x1="50" y1={cy} x2="470" y2={cy} stroke="#94a3b8" strokeDasharray="4 3" />

      <polygon
        points={`${headX},${headY} ${headX + kPx},${headY} ${headX + kPx + 8},${headY + 12} ${headX + kPx + 8},${headY + sPx - 12} ${headX + kPx},${headY + sPx} ${headX},${headY + sPx} ${headX - 8},${headY + sPx - 12} ${headX - 8},${headY + 12}`}
        fill="#94a3b8"
        stroke="#334155"
        strokeWidth="1.4"
      />

      <rect
        x={shankX1}
        y={shaftY}
        width={tipX2 - shankX1}
        height={dPx}
        fill="#64748b"
        stroke="#334155"
        strokeWidth="1"
      />

      <rect x={plateX1} y={cy - 36} width={tPx} height="72" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="1.3" />

      <rect
        x={pwX1}
        y={cy - odPwPx / 2}
        width={hPwPx}
        height={odPwPx}
        fill="#cbd5e1"
        stroke="#334155"
        strokeWidth="1.2"
      />

      <rect
        x={swX1}
        y={cy - odSwPx / 2}
        width={hSwPx}
        height={odSwPx}
        fill="#e2e8f0"
        stroke="#334155"
        strokeDasharray="4 2"
        strokeWidth="1.2"
      />

      <polygon
        points={`${nutX1},${cy - 32} ${nutX2},${cy - 32} ${nutX2 + 8},${cy - 22} ${nutX2 + 8},${cy + 22} ${nutX2},${cy + 32} ${nutX1},${cy + 32}`}
        fill="#a3b8cf"
        stroke="#334155"
        strokeWidth="1.3"
      />

      <g>
        {Array.from({ length: 6 }).map((_, i) => {
          const x = tipX1 + 3 + i * ((tipPx - 6) / 5);
          return <line key={i} x1={x} y1={shaftY} x2={x} y2={shaftY + dPx} stroke="#cbd5e1" strokeWidth="1.1" />;
        })}
      </g>

      <text x={plateX1 + tPx / 2} y={cy - 44} textAnchor="middle" fontSize="10" fill="#1d4ed8" fontWeight={700}>
        締結体
      </text>
      <text x={pwX1 + hPwPx / 2} y={cy - odPwPx / 2 - 8} textAnchor="middle" fontSize="10" fill="#334155" fontWeight={700}>
        平座金
      </text>
      <text x={swX1 + hSwPx / 2 + 8} y={cy - odSwPx / 2 - 8} textAnchor="middle" fontSize="10" fill="#334155" fontWeight={700}>
        ばね座金
      </text>
      <text x={nutX1 + hNutPx / 2 + 4} y={cy - 40} textAnchor="middle" fontSize="10" fill="#334155" fontWeight={700}>
        ナット
      </text>

      <Hdim x1={plateX1} x2={plateX2} y={218} label={`t = ${fmt1(12.0)} mm`} />
      <Hdim x1={pwX1} x2={pwX2} y={236} label={`Hpw / tpw = ${fmt1(g.plainWasherThickness_mm)} mm`} />
      <Hdim x1={swX1} x2={swX2} y={254} label={`Hsw / tsw = ${fmt1(g.springWasherThickness_mm)} mm`} />
      <Hdim x1={nutX1} x2={nutX2} y={272} label={`Hnut = ${fmt1(g.nutHeight_mm)} mm`} />
      <Hdim x1={tipX1} x2={tipX2} y={200} label={`3p = ${fmt2(g.threePitch_mm)} mm`} />

      <Hdim x1={headX} x2={headX + kPx} y={62} label={`k = ${fmt1(g.headHeight_mm)} mm`} />
      <Vdim x={62} y1={headY} y2={headY + sPx} label={`s = ${fmt1(g.headWidthAcrossFlats_mm)} mm`} />
      <Vdim x={118} y1={shaftY} y2={shaftY + dPx} label={`d = ${fmt1(g.threadDiameter_mm)} mm`} />

      <Vdim
        x={332}
        y1={cy - odPwPx / 2}
        y2={cy + odPwPx / 2}
        label={`ODpw = ${fmt1(g.plainWasherOuterDiameter_mm)} mm`}
      />
      <Vdim
        x={355}
        y1={cy - odSwPx / 2}
        y2={cy + odSwPx / 2}
        label={`ODsw = ${fmt1(g.springWasherOuterDiameter_mm)} mm`}
      />

      <text x={395} y={44} fontSize="10" fill="#475569">
        平座金 ID = {fmt1(g.plainWasherInnerDiameter_mm)} mm / ばね座金 ID = {fmt1(g.springWasherInnerDiameter_mm)} mm
      </text>
    </svg>
  );
}
