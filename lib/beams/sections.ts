/**
 * Cross-section property calculator.
 *
 * All dimensions are in mm.
 * Results: I in mm⁴, Z in mm³, area in mm².
 *
 * Note: Calculations assume sharp corners (no fillet radius).
 * Actual JIS / standard section values may differ slightly due to corner radii.
 */

export type SectionShape =
  | 'H'
  | 'rect-tube'
  | 'circ-tube'
  | 'flat'
  | 'angle'
  | 'channel';

export interface SectionParam {
  key: string;
  label: string;
  unit: string;
  placeholder: string;
  hint?: string;
}

export interface SectionDef {
  shape: SectionShape;
  label: string;
  desc: string;
  params: SectionParam[];
}

export interface SectionResult {
  /** Strong axis (X-X) second moment of area [mm⁴] */
  I_mm4: number;
  /** Strong axis section modulus [mm³] */
  Z_mm3: number;
  /** Weak axis (Y-Y) second moment of area [mm⁴] – undefined if not calculable */
  Iy_mm4?: number;
  /** Weak axis section modulus [mm³] – undefined if not calculable */
  Zy_mm3?: number;
  /** Cross-sectional area [mm²] */
  area_mm2: number;
}

// ─── Section definitions ──────────────────────────────────────────────────────

export const SECTION_DEFS: SectionDef[] = [
  {
    shape: 'H',
    label: 'H形鋼',
    desc: 'H ビーム。強軸（フランジ面内）曲げ。',
    params: [
      { key: 'H',  label: '断面高さ H', unit: 'mm', placeholder: '200', hint: '外形全高' },
      { key: 'B',  label: 'フランジ幅 B', unit: 'mm', placeholder: '100' },
      { key: 'tw', label: 'ウェブ厚 tw',  unit: 'mm', placeholder: '5.5' },
      { key: 'tf', label: 'フランジ厚 tf', unit: 'mm', placeholder: '8' },
    ],
  },
  {
    shape: 'rect-tube',
    label: '角形鋼管（□鋼管）',
    desc: '正方形または長方形の中空断面。強軸曲げ。',
    params: [
      { key: 'H', label: '高さ H', unit: 'mm', placeholder: '150', hint: '曲げ方向の外寸' },
      { key: 'B', label: '幅 B',   unit: 'mm', placeholder: '100' },
      { key: 't', label: '板厚 t', unit: 'mm', placeholder: '6' },
    ],
  },
  {
    shape: 'circ-tube',
    label: '丸形鋼管（○鋼管）',
    desc: '円形中空断面（パイプ）。',
    params: [
      { key: 'D', label: '外径 D', unit: 'mm', placeholder: '139.8' },
      { key: 't', label: '板厚 t', unit: 'mm', placeholder: '6' },
    ],
  },
  {
    shape: 'flat',
    label: 'フラットバー（平鋼）',
    desc: '矩形断面（無垢）。強軸（高さ方向）曲げ。',
    params: [
      { key: 'H', label: '高さ H', unit: 'mm', placeholder: '100', hint: '曲げ方向の寸法' },
      { key: 'B', label: '幅 B',   unit: 'mm', placeholder: '50' },
    ],
  },
  {
    shape: 'angle',
    label: '等辺山形鋼（アングル）',
    desc: 'L 形等辺断面。一辺を水平として強軸（Ix）曲げ。角部の丸みは非考慮。',
    params: [
      { key: 'b', label: '辺長 b', unit: 'mm', placeholder: '75', hint: '両辺同一寸法' },
      { key: 't', label: '板厚 t', unit: 'mm', placeholder: '9' },
    ],
  },
  {
    shape: 'channel',
    label: '溝形鋼（チャンネル）',
    desc: 'C 形断面。強軸（フランジ面内）曲げ。',
    params: [
      { key: 'H',  label: '断面高さ H',  unit: 'mm', placeholder: '150' },
      { key: 'B',  label: 'フランジ幅 B', unit: 'mm', placeholder: '65' },
      { key: 'tw', label: 'ウェブ厚 tw',  unit: 'mm', placeholder: '6.5' },
      { key: 'tf', label: 'フランジ厚 tf', unit: 'mm', placeholder: '10' },
    ],
  },
];

// ─── Individual calculators ───────────────────────────────────────────────────

/**
 * H-beam (I-section)
 * Strong axis:  Ix = (B·H³ − (B−tw)·hw³) / 12
 * Weak axis:    Iy = (2·tf·B³ + hw·tw³) / 12
 */
function calcH(H: number, B: number, tw: number, tf: number): SectionResult {
  const hw = H - 2 * tf;
  const I_mm4  = (B * H ** 3 - (B - tw) * hw ** 3) / 12;
  const Z_mm3  = (2 * I_mm4) / H;
  const Iy_mm4 = (2 * tf * B ** 3 + hw * tw ** 3) / 12;
  const Zy_mm3 = (2 * Iy_mm4) / B;
  const area_mm2 = 2 * B * tf + tw * hw;
  return { I_mm4, Z_mm3, Iy_mm4, Zy_mm3, area_mm2 };
}

/**
 * Rectangular hollow section
 * Strong axis:  Ix = (B·H³ − bi·hi³) / 12
 * Weak axis:    Iy = (H·B³ − hi·bi³) / 12
 */
function calcRectTube(H: number, B: number, t: number): SectionResult {
  const hi = H - 2 * t;
  const bi = B - 2 * t;
  const I_mm4  = (B * H ** 3 - bi * hi ** 3) / 12;
  const Z_mm3  = (2 * I_mm4) / H;
  const Iy_mm4 = (H * B ** 3 - hi * bi ** 3) / 12;
  const Zy_mm3 = (2 * Iy_mm4) / B;
  const area_mm2 = B * H - bi * hi;
  return { I_mm4, Z_mm3, Iy_mm4, Zy_mm3, area_mm2 };
}

/**
 * Circular hollow section
 * Ix = Iy = π(D⁴−d⁴)/64  (symmetric)
 */
function calcCircTube(D: number, t: number): SectionResult {
  const d = D - 2 * t;
  const I_mm4  = (Math.PI * (D ** 4 - d ** 4)) / 64;
  const Z_mm3  = (Math.PI * (D ** 4 - d ** 4)) / (32 * D);
  const area_mm2 = (Math.PI * (D ** 2 - d ** 2)) / 4;
  return { I_mm4, Z_mm3, Iy_mm4: I_mm4, Zy_mm3: Z_mm3, area_mm2 };
}

/**
 * Solid rectangular section (flat bar)
 * Strong axis: Ix = B·H³/12,  Zx = B·H²/6
 * Weak axis:   Iy = H·B³/12,  Zy = H·B²/6
 */
function calcFlat(H: number, B: number): SectionResult {
  const I_mm4  = (B * H ** 3) / 12;
  const Z_mm3  = (B * H ** 2) / 6;
  const Iy_mm4 = (H * B ** 3) / 12;
  const Zy_mm3 = (H * B ** 2) / 6;
  const area_mm2 = B * H;
  return { I_mm4, Z_mm3, Iy_mm4, Zy_mm3, area_mm2 };
}

/**
 * Equal-leg angle — centroidal axes parallel to each leg.
 * For equal legs: Ix = Iy (by symmetry of the 45° principal axes).
 *
 * Centroid from base: yc = (b²+bt−t²) / (2(2b−t))
 * Ix = b·t³/12 + b·t·(yc−t/2)² + t·(b−t)³/12 + t·(b−t)·((b+t)/2−yc)²
 * Zx = Ix / max(yc, b−yc)
 *
 * Note: does not account for corner fillet radius.
 */
function calcAngle(b: number, t: number): SectionResult {
  const area_mm2 = 2 * b * t - t * t;
  const yc = (b * b + b * t - t * t) / (2 * (2 * b - t));
  const I_h  = (b * t ** 3) / 12 + b * t * (yc - t / 2) ** 2;
  const I_v  = (t * (b - t) ** 3) / 12 + t * (b - t) * ((b + t) / 2 - yc) ** 2;
  const I_mm4 = I_h + I_v;
  const Z_mm3 = I_mm4 / Math.max(yc, b - yc);
  // For equal-leg angle: Iy = Ix (centroidal axes parallel to each leg are equal)
  return { I_mm4, Z_mm3, Iy_mm4: I_mm4, Zy_mm3: Z_mm3, area_mm2 };
}

/**
 * Channel (C-section) — symmetric about horizontal (strong) axis.
 *
 * Strong axis X-X:
 *   Ix = (B·H³ − (B−tw)·hw³) / 12
 *   Zx = 2·Ix / H
 *
 * Weak axis Y-Y (centroid from web back):
 *   xc = (B²·tf + hw·tw²/2) / area
 *   Iy = 2·(tf·B³/12 + tf·B·(B/2−xc)²) + hw·tw³/12 + hw·tw·(xc−tw/2)²
 *   Zy = Iy / max(xc, B−xc)
 */
function calcChannel(H: number, B: number, tw: number, tf: number): SectionResult {
  const hw = H - 2 * tf;
  const area_mm2 = tw * hw + 2 * B * tf;

  // Strong axis
  const I_mm4 = (B * H ** 3 - (B - tw) * hw ** 3) / 12;
  const Z_mm3 = (2 * I_mm4) / H;

  // Weak axis
  const xc = (B ** 2 * tf + hw * tw ** 2 / 2) / area_mm2;
  const Iy_flanges = 2 * ((tf * B ** 3) / 12 + tf * B * (B / 2 - xc) ** 2);
  const Iy_web     = (hw * tw ** 3) / 12 + hw * tw * (xc - tw / 2) ** 2;
  const Iy_mm4 = Iy_flanges + Iy_web;
  const Zy_mm3 = Iy_mm4 / Math.max(xc, B - xc);

  return { I_mm4, Z_mm3, Iy_mm4, Zy_mm3, area_mm2 };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function calcSection(
  shape: SectionShape,
  dims: Record<string, number>,
): SectionResult | null {
  try {
    switch (shape) {
      case 'H':         return calcH(dims.H, dims.B, dims.tw, dims.tf);
      case 'rect-tube': return calcRectTube(dims.H, dims.B, dims.t);
      case 'circ-tube': return calcCircTube(dims.D, dims.t);
      case 'flat':      return calcFlat(dims.H, dims.B);
      case 'angle':     return calcAngle(dims.b, dims.t);
      case 'channel':   return calcChannel(dims.H, dims.B, dims.tw, dims.tf);
    }
  } catch {
    return null;
  }
}

export function validateSectionDims(
  shape: SectionShape,
  dims: Record<string, number>,
): string[] {
  const errors: string[] = [];
  const def = SECTION_DEFS.find((d) => d.shape === shape);
  if (!def) return ['不明な断面形状です。'];

  for (const p of def.params) {
    const v = dims[p.key];
    if (v === undefined || isNaN(v) || v <= 0) {
      errors.push(`${p.label} は正の数を入力してください。`);
    }
  }
  if (errors.length > 0) return errors;

  switch (shape) {
    case 'H':
      if (dims.tf * 2 >= dims.H)
        errors.push('フランジ厚 tf × 2 が断面高さ H 以上です。');
      if (dims.tw >= dims.B)
        errors.push('ウェブ厚 tw がフランジ幅 B 以上です。');
      break;
    case 'rect-tube':
      if (dims.t * 2 >= dims.H) errors.push('板厚 t × 2 が高さ H 以上です。');
      if (dims.t * 2 >= dims.B) errors.push('板厚 t × 2 が幅 B 以上です。');
      break;
    case 'circ-tube':
      if (dims.t * 2 >= dims.D) errors.push('板厚 t × 2 が外径 D 以上です。');
      break;
    case 'angle':
      if (dims.t >= dims.b) errors.push('板厚 t が辺長 b 以上です。');
      break;
    case 'channel':
      if (dims.tf * 2 >= dims.H)
        errors.push('フランジ厚 tf × 2 が断面高さ H 以上です。');
      if (dims.tw >= dims.B)
        errors.push('ウェブ厚 tw がフランジ幅 B 以上です。');
      break;
  }
  return errors;
}
