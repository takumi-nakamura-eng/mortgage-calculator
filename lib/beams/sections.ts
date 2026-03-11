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
  | 't-bar'
  | 'rect-tube'
  | 'circ-tube'
  | 'round-bar'
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
  I_mm4: number;
  Z_mm3: number;
  Iy_mm4?: number;
  Zy_mm3?: number;
  area_mm2: number;
  rx_mm: number;
  ry_mm?: number;
  weight_kg_per_m: number;
}

export const SECTION_DEFS: SectionDef[] = [
  {
    shape: 'H',
    label: 'H形鋼',
    desc: 'H ビーム。強軸（フランジ面内）曲げ。',
    params: [
      { key: 'H', label: '断面高さ H', unit: 'mm', placeholder: '200', hint: '外形全高' },
      { key: 'B', label: 'フランジ幅 B', unit: 'mm', placeholder: '100' },
      { key: 'tw', label: 'ウェブ厚 tw', unit: 'mm', placeholder: '5.5' },
      { key: 'tf', label: 'フランジ厚 tf', unit: 'mm', placeholder: '8' },
    ],
  },
  {
    shape: 't-bar',
    label: 'T形鋼（Tバー）',
    desc: 'T形断面。フランジ上・ウェブ下の一般的なTバーを想定。',
    params: [
      { key: 'H', label: '断面高さ H', unit: 'mm', placeholder: '150' },
      { key: 'B', label: 'フランジ幅 B', unit: 'mm', placeholder: '100' },
      { key: 'tw', label: 'ウェブ厚 tw', unit: 'mm', placeholder: '8' },
      { key: 'tf', label: 'フランジ厚 tf', unit: 'mm', placeholder: '12' },
    ],
  },
  {
    shape: 'rect-tube',
    label: '角形鋼管（□鋼管）',
    desc: '正方形または長方形の中空断面。強軸曲げ。',
    params: [
      { key: 'H', label: '高さ H', unit: 'mm', placeholder: '150', hint: '曲げ方向の外寸' },
      { key: 'B', label: '幅 B', unit: 'mm', placeholder: '100' },
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
    shape: 'round-bar',
    label: '丸棒（丸鋼）',
    desc: '無垢の円形断面。',
    params: [
      { key: 'D', label: '直径 D', unit: 'mm', placeholder: '32' },
    ],
  },
  {
    shape: 'flat',
    label: 'フラットバー（平鋼）',
    desc: '矩形断面（無垢）。強軸（高さ方向）曲げ。',
    params: [
      { key: 'H', label: '高さ H', unit: 'mm', placeholder: '100', hint: '曲げ方向の寸法' },
      { key: 'B', label: '幅 B', unit: 'mm', placeholder: '50' },
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
      { key: 'H', label: '断面高さ H', unit: 'mm', placeholder: '150' },
      { key: 'B', label: 'フランジ幅 B', unit: 'mm', placeholder: '65' },
      { key: 'tw', label: 'ウェブ厚 tw', unit: 'mm', placeholder: '6.5' },
      { key: 'tf', label: 'フランジ厚 tf', unit: 'mm', placeholder: '10' },
    ],
  },
];

function calcH(H: number, B: number, tw: number, tf: number): SectionResult {
  const hw = H - 2 * tf;
  const I_mm4 = (B * H ** 3 - (B - tw) * hw ** 3) / 12;
  const Z_mm3 = (2 * I_mm4) / H;
  const Iy_mm4 = (2 * tf * B ** 3 + hw * tw ** 3) / 12;
  const Zy_mm3 = (2 * Iy_mm4) / B;
  const area_mm2 = 2 * B * tf + tw * hw;
  return finalizeSection({ I_mm4, Z_mm3, Iy_mm4, Zy_mm3, area_mm2 });
}

function calcTBar(H: number, B: number, tw: number, tf: number): SectionResult {
  const hw = H - tf;
  const areaFlange = B * tf;
  const areaWeb = tw * hw;
  const area_mm2 = areaFlange + areaWeb;
  const yFlange = tf / 2;
  const yWeb = tf + hw / 2;
  const yBar = (areaFlange * yFlange + areaWeb * yWeb) / area_mm2;
  const IFlange = (B * tf ** 3) / 12 + areaFlange * (yBar - yFlange) ** 2;
  const IWeb = (tw * hw ** 3) / 12 + areaWeb * (yWeb - yBar) ** 2;
  const I_mm4 = IFlange + IWeb;
  const Z_mm3 = I_mm4 / Math.max(yBar, H - yBar);
  const Iy_mm4 = (tf * B ** 3) / 12 + (hw * tw ** 3) / 12;
  const Zy_mm3 = (2 * Iy_mm4) / B;
  return finalizeSection({ I_mm4, Z_mm3, Iy_mm4, Zy_mm3, area_mm2 });
}

function calcRectTube(H: number, B: number, t: number): SectionResult {
  const hi = H - 2 * t;
  const bi = B - 2 * t;
  const I_mm4 = (B * H ** 3 - bi * hi ** 3) / 12;
  const Z_mm3 = (2 * I_mm4) / H;
  const Iy_mm4 = (H * B ** 3 - hi * bi ** 3) / 12;
  const Zy_mm3 = (2 * Iy_mm4) / B;
  const area_mm2 = B * H - bi * hi;
  return finalizeSection({ I_mm4, Z_mm3, Iy_mm4, Zy_mm3, area_mm2 });
}

function calcCircTube(D: number, t: number): SectionResult {
  const d = D - 2 * t;
  const I_mm4 = (Math.PI * (D ** 4 - d ** 4)) / 64;
  const Z_mm3 = (Math.PI * (D ** 4 - d ** 4)) / (32 * D);
  const area_mm2 = (Math.PI * (D ** 2 - d ** 2)) / 4;
  return finalizeSection({ I_mm4, Z_mm3, Iy_mm4: I_mm4, Zy_mm3: Z_mm3, area_mm2 });
}

function calcRoundBar(D: number): SectionResult {
  const I_mm4 = (Math.PI * D ** 4) / 64;
  const Z_mm3 = (Math.PI * D ** 3) / 32;
  const area_mm2 = (Math.PI * D ** 2) / 4;
  return finalizeSection({ I_mm4, Z_mm3, Iy_mm4: I_mm4, Zy_mm3: Z_mm3, area_mm2 });
}

function calcFlat(H: number, B: number): SectionResult {
  const I_mm4 = (B * H ** 3) / 12;
  const Z_mm3 = (B * H ** 2) / 6;
  const Iy_mm4 = (H * B ** 3) / 12;
  const Zy_mm3 = (H * B ** 2) / 6;
  const area_mm2 = B * H;
  return finalizeSection({ I_mm4, Z_mm3, Iy_mm4, Zy_mm3, area_mm2 });
}

function calcAngle(b: number, t: number): SectionResult {
  const area_mm2 = 2 * b * t - t * t;
  const yc = (b * b + b * t - t * t) / (2 * (2 * b - t));
  const I_h = (b * t ** 3) / 12 + b * t * (yc - t / 2) ** 2;
  const I_v = (t * (b - t) ** 3) / 12 + t * (b - t) * ((b + t) / 2 - yc) ** 2;
  const I_mm4 = I_h + I_v;
  const Z_mm3 = I_mm4 / Math.max(yc, b - yc);
  return finalizeSection({ I_mm4, Z_mm3, Iy_mm4: I_mm4, Zy_mm3: Z_mm3, area_mm2 });
}

function calcChannel(H: number, B: number, tw: number, tf: number): SectionResult {
  const hw = H - 2 * tf;
  const area_mm2 = tw * hw + 2 * B * tf;
  const I_mm4 = (B * H ** 3 - (B - tw) * hw ** 3) / 12;
  const Z_mm3 = (2 * I_mm4) / H;
  const xc = (B ** 2 * tf + hw * tw ** 2 / 2) / area_mm2;
  const Iy_flanges = 2 * ((tf * B ** 3) / 12 + tf * B * (B / 2 - xc) ** 2);
  const Iy_web = (hw * tw ** 3) / 12 + hw * tw * (xc - tw / 2) ** 2;
  const Iy_mm4 = Iy_flanges + Iy_web;
  const Zy_mm3 = Iy_mm4 / Math.max(xc, B - xc);
  return finalizeSection({ I_mm4, Z_mm3, Iy_mm4, Zy_mm3, area_mm2 });
}

export function calcSection(shape: SectionShape, dims: Record<string, number>): SectionResult | null {
  try {
    switch (shape) {
      case 'H':
        return calcH(dims.H, dims.B, dims.tw, dims.tf);
      case 't-bar':
        return calcTBar(dims.H, dims.B, dims.tw, dims.tf);
      case 'rect-tube':
        return calcRectTube(dims.H, dims.B, dims.t);
      case 'circ-tube':
        return calcCircTube(dims.D, dims.t);
      case 'round-bar':
        return calcRoundBar(dims.D);
      case 'flat':
        return calcFlat(dims.H, dims.B);
      case 'angle':
        return calcAngle(dims.b, dims.t);
      case 'channel':
        return calcChannel(dims.H, dims.B, dims.tw, dims.tf);
    }
  } catch {
    return null;
  }
}

export function validateSectionDims(shape: SectionShape, dims: Record<string, number>): string[] {
  const errors: string[] = [];
  const def = SECTION_DEFS.find((definition) => definition.shape === shape);
  if (!def) return ['不明な断面形状です。'];

  for (const param of def.params) {
    const value = dims[param.key];
    if (value === undefined || isNaN(value) || value <= 0) {
      errors.push(`${param.label} は正の数を入力してください。`);
    }
  }
  if (errors.length > 0) return errors;

  switch (shape) {
    case 'H':
    case 't-bar':
    case 'channel':
      if (dims.tf >= dims.H) errors.push('フランジ厚 tf は断面高さ H より小さくしてください。');
      if (dims.tw >= dims.B) errors.push('ウェブ厚 tw はフランジ幅 B より小さくしてください。');
      if (shape !== 't-bar' && dims.tf * 2 >= dims.H) {
        errors.push('フランジ厚 tf × 2 が断面高さ H 以上です。');
      }
      break;
    case 'rect-tube':
      if (dims.t * 2 >= dims.H) errors.push('板厚 t × 2 が高さ H 以上です。');
      if (dims.t * 2 >= dims.B) errors.push('板厚 t × 2 が幅 B 以上です。');
      break;
    case 'circ-tube':
      if (dims.t * 2 >= dims.D) errors.push('板厚 t × 2 が外径 D 以上です。');
      break;
    case 'round-bar':
      break;
    case 'angle':
      if (dims.t >= dims.b) errors.push('板厚 t が辺長 b 以上です。');
      break;
    case 'flat':
      break;
  }

  return errors;
}

function finalizeSection(base: {
  I_mm4: number;
  Z_mm3: number;
  Iy_mm4?: number;
  Zy_mm3?: number;
  area_mm2: number;
}): SectionResult {
  return {
    ...base,
    rx_mm: Math.sqrt(base.I_mm4 / base.area_mm2),
    ry_mm: base.Iy_mm4 !== undefined ? Math.sqrt(base.Iy_mm4 / base.area_mm2) : undefined,
    weight_kg_per_m: base.area_mm2 * 0.00785,
  };
}
