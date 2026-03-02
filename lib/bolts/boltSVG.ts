import { M12_REFERENCE_GEOMETRY } from './specs';

const SCALE = 3.5;

function fmt1(v: number): string {
  return v.toFixed(1);
}

function fmt2(v: number): string {
  return v.toFixed(2);
}

function hdim(x1: number, x2: number, y: number, label: string): string {
  const cx = (x1 + x2) / 2;
  return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#334155" stroke-width="1"/>
  <line x1="${x1}" y1="${y - 4}" x2="${x1}" y2="${y + 4}" stroke="#334155" stroke-width="1"/>
  <line x1="${x2}" y1="${y - 4}" x2="${x2}" y2="${y + 4}" stroke="#334155" stroke-width="1"/>
  <text x="${cx}" y="${y + 12}" text-anchor="middle" font-size="9.5" fill="#1f2937" font-weight="700">${label}</text>`;
}

function vdim(x: number, y1: number, y2: number, label: string): string {
  const cy = (y1 + y2) / 2;
  return `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#334155" stroke-width="1"/>
  <line x1="${x - 4}" y1="${y1}" x2="${x + 4}" y2="${y1}" stroke="#334155" stroke-width="1"/>
  <line x1="${x - 4}" y1="${y2}" x2="${x + 4}" y2="${y2}" stroke="#334155" stroke-width="1"/>
  <text x="${x - 6}" y="${cy + 3}" text-anchor="end" font-size="9.5" fill="#1f2937" font-weight="700">${label}</text>`;
}

export function getBoltSVGString(): string {
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

  const cy = 115;
  const headX = 56;
  const headY = cy - sPx / 2;

  const shankX1 = headX + kPx;
  const plateX1 = 110;
  const plateX2 = plateX1 + tPx;
  const pwX1 = plateX2 + 8;
  const pwX2 = pwX1 + hPwPx;
  const swX1 = pwX2;
  const swX2 = swX1 + hSwPx;
  const nutX1 = swX2;
  const nutX2 = nutX1 + hNutPx;
  const tipX1 = nutX2;
  const tipX2 = tipX1 + tipPx;

  const shaftY = cy - dPx / 2;

  return `<svg viewBox="0 0 430 250" xmlns="http://www.w3.org/2000/svg" width="400" height="232" style="display:block;max-width:100%;background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px;">
  <line x1="32" y1="${cy}" x2="398" y2="${cy}" stroke="#94a3b8" stroke-dasharray="4 3" stroke-width="1"/>

  <polygon points="${headX},${headY} ${headX + kPx},${headY} ${headX + kPx + 8},${headY + 12} ${headX + kPx + 8},${headY + sPx - 12} ${headX + kPx},${headY + sPx} ${headX},${headY + sPx} ${headX - 8},${headY + sPx - 12} ${headX - 8},${headY + 12}" fill="#94a3b8" stroke="#334155" stroke-width="1.2"/>

  <rect x="${shankX1}" y="${shaftY}" width="${tipX2 - shankX1}" height="${dPx}" fill="#64748b" stroke="#334155" stroke-width="1"/>
  <rect x="${plateX1}" y="${cy - 30}" width="${tPx}" height="60" fill="#dbeafe" stroke="#1d4ed8" stroke-width="1.2"/>
  <rect x="${pwX1}" y="${cy - odPwPx / 2}" width="${hPwPx}" height="${odPwPx}" fill="#cbd5e1" stroke="#334155" stroke-width="1"/>
  <rect x="${swX1}" y="${cy - odSwPx / 2}" width="${hSwPx}" height="${odSwPx}" fill="#e2e8f0" stroke="#334155" stroke-width="1" stroke-dasharray="4 2"/>
  <polygon points="${nutX1},${cy - 28} ${nutX2},${cy - 28} ${nutX2 + 8},${cy - 20} ${nutX2 + 8},${cy + 20} ${nutX2},${cy + 28} ${nutX1},${cy + 28}" fill="#a3b8cf" stroke="#334155" stroke-width="1.2"/>

  ${Array.from({ length: 5 }).map((_, i) => {
    const x = tipX1 + 3 + i * ((tipPx - 6) / 4);
    return `<line x1="${x}" y1="${shaftY}" x2="${x}" y2="${shaftY + dPx}" stroke="#cbd5e1" stroke-width="1"/>`;
  }).join('')}

  ${hdim(plateX1, plateX2, 184, `t = ${fmt1(12.0)} mm`)}
  ${hdim(pwX1, pwX2, 199, `Hpw/tpw = ${fmt1(g.plainWasherThickness_mm)} mm`)}
  ${hdim(swX1, swX2, 214, `Hsw/tsw = ${fmt1(g.springWasherThickness_mm)} mm`)}
  ${hdim(nutX1, nutX2, 229, `Hnut = ${fmt1(g.nutHeight_mm)} mm`)}
  ${hdim(tipX1, tipX2, 169, `3p = ${fmt2(g.threePitch_mm)} mm`)}
  ${hdim(headX, headX + kPx, 48, `k = ${fmt1(g.headHeight_mm)} mm`)}

  ${vdim(38, headY, headY + sPx, `s = ${fmt1(g.headWidthAcrossFlats_mm)} mm`)}
  ${vdim(96, shaftY, shaftY + dPx, `d = ${fmt1(g.threadDiameter_mm)} mm`)}
  ${vdim(286, cy - odPwPx / 2, cy + odPwPx / 2, `ODpw = ${fmt1(g.plainWasherOuterDiameter_mm)} mm`)}
  ${vdim(308, cy - odSwPx / 2, cy + odSwPx / 2, `ODsw = ${fmt1(g.springWasherOuterDiameter_mm)} mm`)}

  <text x="316" y="34" font-size="9" fill="#475569">平座金ID=${fmt1(g.plainWasherInnerDiameter_mm)} mm / ばね座金ID=${fmt1(g.springWasherInnerDiameter_mm)} mm</text>
  </svg>`;
}
