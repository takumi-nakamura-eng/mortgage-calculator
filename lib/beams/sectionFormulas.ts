import type { FormulaStep } from '@/lib/engHistory';
import type { SectionShape, SectionResult } from './sections';
import { fmt } from './units';

function n(value: number, digits = 1): string {
  return parseFloat(fmt(value, digits)).toLocaleString('ja-JP', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function n2(value: number): string {
  return n(value, 2);
}

function n4(value: number): string {
  return n(value, 1);
}

export function getSectionFormulaSteps(
  shape: SectionShape,
  dims: Record<string, number>,
  result: SectionResult,
): FormulaStep[] {
  switch (shape) {
    case 'H':
      return formulaH(dims, result);
    case 't-bar':
      return formulaTBar(dims, result);
    case 'rect-tube':
      return formulaRectTube(dims, result);
    case 'circ-tube':
      return formulaCircTube(dims, result);
    case 'round-bar':
      return formulaRoundBar(dims, result);
    case 'flat':
      return formulaFlat(dims, result);
    case 'angle':
      return formulaAngle(dims, result);
    case 'channel':
      return formulaChannel(dims, result);
  }
}

function formulaH(d: Record<string, number>, r: SectionResult): FormulaStep[] {
  const { H, B, tw, tf } = d;
  const hw = H - 2 * tf;
  return [
    { label: '中間寸法', expr: `hw = H - 2×tf = ${n(H)} - 2×${n(tf)} = ${n(hw)} mm` },
    { label: '断面積 A', expr: `A = 2×B×tf + hw×tw = 2×${n(B)}×${n(tf)} + ${n(hw)}×${n(tw)} = ${n2(r.area_mm2)} mm²` },
    { label: '断面二次モーメント Ix', expr: `Ix = (B×H³ − (B−tw)×hw³) / 12 = ${n4(r.I_mm4)} mm⁴` },
    { label: '断面係数 Zx', expr: `Zx = 2×Ix / H = ${n4(r.Z_mm3)} mm³` },
    ...(r.Iy_mm4 !== undefined ? [
      { label: '断面二次モーメント Iy', expr: `Iy = (2×tf×B³ + hw×tw³) / 12 = ${n4(r.Iy_mm4)} mm⁴` },
      { label: '断面係数 Zy', expr: `Zy = 2×Iy / B = ${n4(r.Zy_mm3!)} mm³` },
    ] : []),
  ];
}

function formulaTBar(d: Record<string, number>, r: SectionResult): FormulaStep[] {
  const { H, B, tw, tf } = d;
  const hw = H - tf;
  const areaFlange = B * tf;
  const areaWeb = tw * hw;
  const area = areaFlange + areaWeb;
  const yBar = (areaFlange * (tf / 2) + areaWeb * (tf + hw / 2)) / area;
  return [
    { label: '中間寸法', expr: `hw = H - tf = ${n(H)} - ${n(tf)} = ${n(hw)} mm` },
    { label: '断面積 A', expr: `A = B×tf + tw×hw = ${n(B)}×${n(tf)} + ${n(tw)}×${n(hw)} = ${n2(r.area_mm2)} mm²` },
    { label: '重心位置 ȳ', expr: `ȳ = (Af×yf + Aw×yw) / A = ${n2(yBar)} mm（上端基準）` },
    { label: '断面二次モーメント Ix', expr: `Ix = If + Iw = ${n4(r.I_mm4)} mm⁴` },
    { label: '断面係数 Zx', expr: `Zx = Ix / max(ȳ, H−ȳ) = ${n4(r.Z_mm3)} mm³` },
    ...(r.Iy_mm4 !== undefined ? [
      { label: '断面二次モーメント Iy', expr: `Iy = tf×B³/12 + hw×tw³/12 = ${n4(r.Iy_mm4)} mm⁴` },
      { label: '断面係数 Zy', expr: `Zy = 2×Iy / B = ${n4(r.Zy_mm3!)} mm³` },
    ] : []),
  ];
}

function formulaRectTube(d: Record<string, number>, r: SectionResult): FormulaStep[] {
  const { H, B, t } = d;
  const hi = H - 2 * t;
  const bi = B - 2 * t;
  return [
    { label: '中空内寸', expr: `hi = ${n(hi)} mm, bi = ${n(bi)} mm` },
    { label: '断面積 A', expr: `A = B×H − bi×hi = ${n2(r.area_mm2)} mm²` },
    { label: '断面二次モーメント Ix', expr: `Ix = (B×H³ − bi×hi³) / 12 = ${n4(r.I_mm4)} mm⁴` },
    { label: '断面係数 Zx', expr: `Zx = 2×Ix / H = ${n4(r.Z_mm3)} mm³` },
    ...(r.Iy_mm4 !== undefined ? [
      { label: '断面二次モーメント Iy', expr: `Iy = (H×B³ − hi×bi³) / 12 = ${n4(r.Iy_mm4)} mm⁴` },
      { label: '断面係数 Zy', expr: `Zy = 2×Iy / B = ${n4(r.Zy_mm3!)} mm³` },
    ] : []),
  ];
}

function formulaCircTube(d: Record<string, number>, r: SectionResult): FormulaStep[] {
  const { D, t } = d;
  const di = D - 2 * t;
  return [
    { label: '内径', expr: `di = D - 2×t = ${n(D)} - 2×${n(t)} = ${n(di)} mm` },
    { label: '断面積 A', expr: `A = π×(D² − di²) / 4 = ${n2(r.area_mm2)} mm²` },
    { label: '断面二次モーメント Ix = Iy', expr: `Ix = π×(D⁴ − di⁴) / 64 = ${n4(r.I_mm4)} mm⁴` },
    { label: '断面係数 Zx = Zy', expr: `Zx = π×(D⁴ − di⁴) / (32×D) = ${n4(r.Z_mm3)} mm³` },
  ];
}

function formulaRoundBar(d: Record<string, number>, r: SectionResult): FormulaStep[] {
  const { D } = d;
  return [
    { label: '断面積 A', expr: `A = π×D² / 4 = π×${n(D)}² / 4 = ${n2(r.area_mm2)} mm²` },
    { label: '断面二次モーメント Ix = Iy', expr: `Ix = π×D⁴ / 64 = ${n4(r.I_mm4)} mm⁴` },
    { label: '断面係数 Zx = Zy', expr: `Zx = π×D³ / 32 = ${n4(r.Z_mm3)} mm³` },
  ];
}

function formulaFlat(d: Record<string, number>, r: SectionResult): FormulaStep[] {
  const { H, B } = d;
  return [
    { label: '断面積 A', expr: `A = B×H = ${n(B)}×${n(H)} = ${n2(r.area_mm2)} mm²` },
    { label: '断面二次モーメント Ix', expr: `Ix = B×H³ / 12 = ${n4(r.I_mm4)} mm⁴` },
    { label: '断面係数 Zx', expr: `Zx = B×H² / 6 = ${n4(r.Z_mm3)} mm³` },
    ...(r.Iy_mm4 !== undefined ? [
      { label: '断面二次モーメント Iy', expr: `Iy = H×B³ / 12 = ${n4(r.Iy_mm4)} mm⁴` },
      { label: '断面係数 Zy', expr: `Zy = H×B² / 6 = ${n4(r.Zy_mm3!)} mm³` },
    ] : []),
  ];
}

function formulaAngle(d: Record<string, number>, r: SectionResult): FormulaStep[] {
  const { b, t } = d;
  const area = 2 * b * t - t * t;
  const yc = (b * b + b * t - t * t) / (2 * (2 * b - t));
  return [
    { label: '断面積 A', expr: `A = 2×b×t − t² = ${n2(area)} mm²` },
    { label: '重心位置 yc', expr: `yc = (b² + b×t − t²) / (2×(2b − t)) = ${n2(yc)} mm` },
    { label: '断面二次モーメント Ix = Iy', expr: `Ix = Iy = ${n4(r.I_mm4)} mm⁴` },
    { label: '断面係数 Zx = Zy', expr: `Z = Ix / max(yc, b−yc) = ${n4(r.Z_mm3)} mm³` },
  ];
}

function formulaChannel(d: Record<string, number>, r: SectionResult): FormulaStep[] {
  const { H, B, tw, tf } = d;
  const hw = H - 2 * tf;
  const area = tw * hw + 2 * B * tf;
  const xc = (B ** 2 * tf + hw * tw ** 2 / 2) / area;
  return [
    { label: '中間寸法', expr: `hw = H - 2×tf = ${n(hw)} mm` },
    { label: '断面積 A', expr: `A = tw×hw + 2×B×tf = ${n2(area)} mm²` },
    { label: '断面二次モーメント Ix', expr: `Ix = (B×H³ − (B−tw)×hw³) / 12 = ${n4(r.I_mm4)} mm⁴` },
    { label: '断面係数 Zx', expr: `Zx = 2×Ix / H = ${n4(r.Z_mm3)} mm³` },
    ...(r.Iy_mm4 !== undefined ? [
      { label: '弱軸重心 xc', expr: `xc = (B²×tf + hw×tw²/2) / A = ${n2(xc)} mm` },
      { label: '断面二次モーメント Iy', expr: `Iy = ${n4(r.Iy_mm4)} mm⁴` },
      { label: '断面係数 Zy', expr: `Zy = ${n4(r.Zy_mm3!)} mm³` },
    ] : []),
  ];
}
