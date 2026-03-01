/**
 * Generates human-readable formula steps for cross-section property calculations.
 *
 * Each step contains:
 *   label  – what the step calculates (e.g. "ウェブ高さ hw")
 *   expr   – formula = substitution = result  (e.g. "hw = H - 2×tf = 200 - 2×8 = 184 mm")
 */

import type { FormulaStep } from '@/lib/engHistory';
import type { SectionShape, SectionResult } from './sections';
import { fmt } from './units';

/** Format a number for display (commas, round to significant digits) */
function n(v: number, d = 1): string {
  return parseFloat(fmt(v, d)).toLocaleString('ja-JP', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}
function n2(v: number): string { return n(v, 2); }
function n4(v: number): string { return n(v, 1); } // for I in mm⁴

export function getSectionFormulaSteps(
  shape: SectionShape,
  dims: Record<string, number>,
  result: SectionResult,
): FormulaStep[] {
  switch (shape) {
    case 'H':         return formulaH(dims, result);
    case 'rect-tube': return formulaRectTube(dims, result);
    case 'circ-tube': return formulaCircTube(dims, result);
    case 'flat':      return formulaFlat(dims, result);
    case 'angle':     return formulaAngle(dims, result);
    case 'channel':   return formulaChannel(dims, result);
  }
}

// ─── H-beam ───────────────────────────────────────────────────────────────────

function formulaH(d: Record<string, number>, r: SectionResult): FormulaStep[] {
  const { H, B, tw, tf } = d;
  const hw = H - 2 * tf;
  return [
    {
      label: '中間寸法',
      expr:  `hw = H - 2×tf = ${n(H,1)} - 2×${n(tf,1)} = ${n(hw,1)} mm`,
    },
    {
      label: '断面積 A',
      expr:  `A = 2×B×tf + hw×tw = 2×${n(B,1)}×${n(tf,1)} + ${n(hw,1)}×${n(tw,1)} = ${n2(r.area_mm2)} mm²`,
    },
    {
      label: '断面二次モーメント Ix（強軸）',
      expr:  `Ix = (B×H³ − (B−tw)×hw³) / 12\n    = (${n(B,1)}×${n(H,1)}³ − (${n(B,1)}−${n(tw,1)})×${n(hw,1)}³) / 12\n    = ${n4(r.I_mm4)} mm⁴`,
    },
    {
      label: '断面係数 Zx（強軸）',
      expr:  `Zx = 2×Ix / H = 2×${n4(r.I_mm4)} / ${n(H,1)} = ${n4(r.Z_mm3)} mm³`,
    },
    ...(r.Iy_mm4 !== undefined ? [
      {
        label: '断面二次モーメント Iy（弱軸）',
        expr:  `Iy = (2×tf×B³ + hw×tw³) / 12\n    = (2×${n(tf,1)}×${n(B,1)}³ + ${n(hw,1)}×${n(tw,1)}³) / 12\n    = ${n4(r.Iy_mm4)} mm⁴`,
      },
      {
        label: '断面係数 Zy（弱軸）',
        expr:  `Zy = 2×Iy / B = 2×${n4(r.Iy_mm4)} / ${n(B,1)} = ${n4(r.Zy_mm3!)} mm³`,
      },
    ] : []),
  ];
}

// ─── Rectangular tube ─────────────────────────────────────────────────────────

function formulaRectTube(d: Record<string, number>, r: SectionResult): FormulaStep[] {
  const { H, B, t } = d;
  const hi = H - 2 * t;
  const bi = B - 2 * t;
  return [
    {
      label: '中空内寸',
      expr:  `hi = H - 2×t = ${n(H,1)} - 2×${n(t,1)} = ${n(hi,1)} mm,  bi = B - 2×t = ${n(B,1)} - 2×${n(t,1)} = ${n(bi,1)} mm`,
    },
    {
      label: '断面積 A',
      expr:  `A = B×H − bi×hi = ${n(B,1)}×${n(H,1)} − ${n(bi,1)}×${n(hi,1)} = ${n2(r.area_mm2)} mm²`,
    },
    {
      label: '断面二次モーメント Ix（強軸）',
      expr:  `Ix = (B×H³ − bi×hi³) / 12\n    = (${n(B,1)}×${n(H,1)}³ − ${n(bi,1)}×${n(hi,1)}³) / 12\n    = ${n4(r.I_mm4)} mm⁴`,
    },
    {
      label: '断面係数 Zx（強軸）',
      expr:  `Zx = 2×Ix / H = 2×${n4(r.I_mm4)} / ${n(H,1)} = ${n4(r.Z_mm3)} mm³`,
    },
    ...(r.Iy_mm4 !== undefined ? [
      {
        label: '断面二次モーメント Iy（弱軸）',
        expr:  `Iy = (H×B³ − hi×bi³) / 12\n    = (${n(H,1)}×${n(B,1)}³ − ${n(hi,1)}×${n(bi,1)}³) / 12\n    = ${n4(r.Iy_mm4)} mm⁴`,
      },
      {
        label: '断面係数 Zy（弱軸）',
        expr:  `Zy = 2×Iy / B = 2×${n4(r.Iy_mm4)} / ${n(B,1)} = ${n4(r.Zy_mm3!)} mm³`,
      },
    ] : []),
  ];
}

// ─── Circular tube ────────────────────────────────────────────────────────────

function formulaCircTube(d: Record<string, number>, r: SectionResult): FormulaStep[] {
  const { D, t } = d;
  const di = D - 2 * t;
  return [
    {
      label: '内径',
      expr:  `di = D - 2×t = ${n(D,1)} - 2×${n(t,1)} = ${n(di,1)} mm`,
    },
    {
      label: '断面積 A',
      expr:  `A = π×(D² − di²) / 4 = π×(${n(D,1)}² − ${n(di,1)}²) / 4 = ${n2(r.area_mm2)} mm²`,
    },
    {
      label: '断面二次モーメント Ix = Iy（円対称）',
      expr:  `Ix = π×(D⁴ − di⁴) / 64\n    = π×(${n(D,1)}⁴ − ${n(di,1)}⁴) / 64\n    = ${n4(r.I_mm4)} mm⁴`,
    },
    {
      label: '断面係数 Zx = Zy',
      expr:  `Zx = π×(D⁴ − di⁴) / (32×D) = ${n4(r.Z_mm3)} mm³`,
    },
  ];
}

// ─── Flat bar ─────────────────────────────────────────────────────────────────

function formulaFlat(d: Record<string, number>, r: SectionResult): FormulaStep[] {
  const { H, B } = d;
  return [
    {
      label: '断面積 A',
      expr:  `A = B×H = ${n(B,1)}×${n(H,1)} = ${n2(r.area_mm2)} mm²`,
    },
    {
      label: '断面二次モーメント Ix（強軸）',
      expr:  `Ix = B×H³ / 12 = ${n(B,1)}×${n(H,1)}³ / 12 = ${n4(r.I_mm4)} mm⁴`,
    },
    {
      label: '断面係数 Zx（強軸）',
      expr:  `Zx = B×H² / 6 = ${n(B,1)}×${n(H,1)}² / 6 = ${n4(r.Z_mm3)} mm³`,
    },
    ...(r.Iy_mm4 !== undefined ? [
      {
        label: '断面二次モーメント Iy（弱軸）',
        expr:  `Iy = H×B³ / 12 = ${n(H,1)}×${n(B,1)}³ / 12 = ${n4(r.Iy_mm4)} mm⁴`,
      },
      {
        label: '断面係数 Zy（弱軸）',
        expr:  `Zy = H×B² / 6 = ${n(H,1)}×${n(B,1)}² / 6 = ${n4(r.Zy_mm3!)} mm³`,
      },
    ] : []),
  ];
}

// ─── Equal-leg angle ──────────────────────────────────────────────────────────

function formulaAngle(d: Record<string, number>, r: SectionResult): FormulaStep[] {
  const { b, t } = d;
  const area = 2 * b * t - t * t;
  const yc   = (b * b + b * t - t * t) / (2 * (2 * b - t));
  return [
    {
      label: '断面積 A',
      expr:  `A = 2×b×t − t² = 2×${n(b,1)}×${n(t,1)} − ${n(t,1)}² = ${n2(area)} mm²`,
    },
    {
      label: '重心位置 yc（脚先端から）',
      expr:  `yc = (b² + b×t − t²) / (2×(2b − t))\n    = (${n(b,1)}² + ${n(b,1)}×${n(t,1)} − ${n(t,1)}²) / (2×(2×${n(b,1)} − ${n(t,1)}))\n    = ${n2(yc)} mm`,
    },
    {
      label: '断面二次モーメント Ix（強軸）',
      expr:  `Ix = Iy = ${n4(r.I_mm4)} mm⁴（等辺のため強軸＝弱軸）`,
    },
    {
      label: '断面係数 Zx',
      expr:  `Zx = Ix / max(yc, b−yc) = ${n4(r.I_mm4)} / ${n2(Math.max(yc, b - yc))} = ${n4(r.Z_mm3)} mm³`,
    },
  ];
}

// ─── Channel ──────────────────────────────────────────────────────────────────

function formulaChannel(d: Record<string, number>, r: SectionResult): FormulaStep[] {
  const { H, B, tw, tf } = d;
  const hw   = H - 2 * tf;
  const area = tw * hw + 2 * B * tf;
  const xc   = (B ** 2 * tf + hw * tw ** 2 / 2) / area;
  return [
    {
      label: '中間寸法',
      expr:  `hw = H - 2×tf = ${n(H,1)} - 2×${n(tf,1)} = ${n(hw,1)} mm`,
    },
    {
      label: '断面積 A',
      expr:  `A = tw×hw + 2×B×tf = ${n(tw,1)}×${n(hw,1)} + 2×${n(B,1)}×${n(tf,1)} = ${n2(area)} mm²`,
    },
    {
      label: '断面二次モーメント Ix（強軸）',
      expr:  `Ix = (B×H³ − (B−tw)×hw³) / 12\n    = (${n(B,1)}×${n(H,1)}³ − (${n(B,1)}−${n(tw,1)})×${n(hw,1)}³) / 12\n    = ${n4(r.I_mm4)} mm⁴`,
    },
    {
      label: '断面係数 Zx（強軸）',
      expr:  `Zx = 2×Ix / H = 2×${n4(r.I_mm4)} / ${n(H,1)} = ${n4(r.Z_mm3)} mm³`,
    },
    ...(r.Iy_mm4 !== undefined ? [
      {
        label: '弱軸重心 xc（ウェブ背面から）',
        expr:  `xc = (B²×tf + hw×tw²/2) / A\n    = (${n(B,1)}²×${n(tf,1)} + ${n(hw,1)}×${n(tw,1)}²/2) / ${n2(area)}\n    = ${n2(xc)} mm`,
      },
      {
        label: '断面二次モーメント Iy（弱軸）',
        expr:  `Iy = 2×(tf×B³/12 + tf×B×(B/2−xc)²) + hw×tw³/12 + hw×tw×(xc−tw/2)²\n    = ${n4(r.Iy_mm4)} mm⁴`,
      },
      {
        label: '断面係数 Zy（弱軸）',
        expr:  `Zy = Iy / max(xc, B−xc) = ${n4(r.Zy_mm3!)} mm³`,
      },
    ] : []),
  ];
}
