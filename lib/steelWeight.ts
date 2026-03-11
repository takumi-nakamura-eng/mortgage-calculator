import { kgToKN } from './beams/units';

export type SteelShape =
  | 'plate'
  | 'roundBar'
  | 'flatBar'
  | 'roundPipe'
  | 'rectPipe'
  | 'hBeam'
  | 'channel'
  | 'squareTube';

export interface ShapeDef {
  shape: SteelShape;
  label: string;
  params: { key: string; label: string; unit: string; placeholder: string }[];
}

export const SHAPE_DEFS: ShapeDef[] = [
  {
    shape: 'plate',
    label: '平板（鋼板）',
    params: [
      { key: 'b', label: '幅 b', unit: 'mm', placeholder: '100' },
      { key: 't', label: '厚 t', unit: 'mm', placeholder: '9' },
    ],
  },
  {
    shape: 'roundBar',
    label: '丸棒',
    params: [{ key: 'd', label: '直径 d', unit: 'mm', placeholder: '20' }],
  },
  {
    shape: 'flatBar',
    label: '角棒',
    params: [
      { key: 'a', label: '辺 a', unit: 'mm', placeholder: '30' },
      { key: 'b', label: '辺 b', unit: 'mm', placeholder: '30' },
    ],
  },
  {
    shape: 'roundPipe',
    label: '丸パイプ',
    params: [
      { key: 'D', label: '外径 D', unit: 'mm', placeholder: '60' },
      { key: 't', label: '肉厚 t', unit: 'mm', placeholder: '3' },
    ],
  },
  {
    shape: 'rectPipe',
    label: '角パイプ',
    params: [
      { key: 'B', label: '外寸 B', unit: 'mm', placeholder: '50' },
      { key: 'H', label: '外寸 H', unit: 'mm', placeholder: '50' },
      { key: 't', label: '肉厚 t', unit: 'mm', placeholder: '3.2' },
    ],
  },
  {
    shape: 'hBeam',
    label: 'H形鋼',
    params: [
      { key: 'H', label: '断面高さ H', unit: 'mm', placeholder: '200' },
      { key: 'B', label: 'フランジ幅 B', unit: 'mm', placeholder: '100' },
      { key: 'tw', label: 'ウェブ厚 tw', unit: 'mm', placeholder: '5.5' },
      { key: 'tf', label: 'フランジ厚 tf', unit: 'mm', placeholder: '8' },
    ],
  },
  {
    shape: 'channel',
    label: 'Cチャンネル',
    params: [
      { key: 'H', label: '断面高さ H', unit: 'mm', placeholder: '150' },
      { key: 'B', label: 'フランジ幅 B', unit: 'mm', placeholder: '65' },
      { key: 'tw', label: 'ウェブ厚 tw', unit: 'mm', placeholder: '6.5' },
      { key: 'tf', label: 'フランジ厚 tf', unit: 'mm', placeholder: '10' },
    ],
  },
  {
    shape: 'squareTube',
    label: '角形鋼管',
    params: [
      { key: 'B', label: '外寸 B', unit: 'mm', placeholder: '100' },
      { key: 't', label: '肉厚 t', unit: 'mm', placeholder: '4.5' },
    ],
  },
];

export function calcArea_m2(shape: SteelShape, dims: Record<string, number>): number | null {
  const mm2m = 1 / 1000;

  switch (shape) {
    case 'plate':
      return validRect(dims.b, dims.t) ? dims.b * mm2m * dims.t * mm2m : null;
    case 'roundBar':
      return dims.d > 0 ? Math.PI * (dims.d * mm2m) ** 2 / 4 : null;
    case 'flatBar':
      return validRect(dims.a, dims.b) ? dims.a * mm2m * dims.b * mm2m : null;
    case 'roundPipe': {
      const { D, t } = dims;
      if (!validPositive(D, t) || D <= 2 * t) return null;
      const Do = D * mm2m;
      const Di = (D - 2 * t) * mm2m;
      return Math.PI * (Do ** 2 - Di ** 2) / 4;
    }
    case 'rectPipe': {
      const { B, H, t } = dims;
      if (!validPositive(B, H, t) || B <= 2 * t || H <= 2 * t) return null;
      const Bo = B * mm2m;
      const Ho = H * mm2m;
      const Bi = (B - 2 * t) * mm2m;
      const Hi = (H - 2 * t) * mm2m;
      return Bo * Ho - Bi * Hi;
    }
    case 'squareTube': {
      const { B, t } = dims;
      if (!validPositive(B, t) || B <= 2 * t) return null;
      const Bo = B * mm2m;
      const Bi = (B - 2 * t) * mm2m;
      return Bo ** 2 - Bi ** 2;
    }
    case 'hBeam': {
      const { H, B, tw, tf } = dims;
      if (!validPositive(H, B, tw, tf) || H <= 2 * tf || B <= tw) return null;
      return ((2 * B * tf) + tw * (H - 2 * tf)) / 1_000_000;
    }
    case 'channel': {
      const { H, B, tw, tf } = dims;
      if (!validPositive(H, B, tw, tf) || H <= 2 * tf || B <= tw) return null;
      return (tw * (H - 2 * tf) + 2 * B * tf) / 1_000_000;
    }
    default:
      return null;
  }
}

export function validateDims(shape: SteelShape, dims: Record<string, number>): string[] {
  const errors: string[] = [];
  const def = SHAPE_DEFS.find((definition) => definition.shape === shape);
  if (!def) return ['不明な形状です'];

  for (const param of def.params) {
    const value = dims[param.key];
    if (value === undefined || isNaN(value)) continue;
    if (value <= 0) errors.push(`${param.label} は正の値を入力してください`);
  }

  if (shape === 'roundPipe' && dims.D > 0 && dims.t > 0 && dims.D <= 2 * dims.t) {
    errors.push('外径 D は肉厚 t の2倍より大きくしてください');
  }
  if (shape === 'rectPipe') {
    if (dims.B > 0 && dims.t > 0 && dims.B <= 2 * dims.t) errors.push('外寸 B は肉厚 t の2倍より大きくしてください');
    if (dims.H > 0 && dims.t > 0 && dims.H <= 2 * dims.t) errors.push('外寸 H は肉厚 t の2倍より大きくしてください');
  }
  if (shape === 'squareTube' && dims.B > 0 && dims.t > 0 && dims.B <= 2 * dims.t) {
    errors.push('外寸 B は肉厚 t の2倍より大きくしてください');
  }
  if ((shape === 'hBeam' || shape === 'channel') && dims.H > 0 && dims.tf > 0 && dims.H <= 2 * dims.tf) {
    errors.push('断面高さ H はフランジ厚 tf の2倍より大きくしてください');
  }
  if ((shape === 'hBeam' || shape === 'channel') && dims.B > 0 && dims.tw > 0 && dims.B <= dims.tw) {
    errors.push('フランジ幅 B はウェブ厚 tw より大きくしてください');
  }

  return errors;
}

export interface SteelWeightItem {
  id: string;
  shape: SteelShape;
  dims: Record<string, number>;
  Lm: number;
  n: number;
  rho: number;
  note: string;
  area_m2: number;
  w_kgm: number;
  W_kg: number;
  W_kN: number;
}

function weightKgToKN(weightKg: number): number {
  return kgToKN(weightKg);
}

export function buildItem(
  shape: SteelShape,
  dims: Record<string, number>,
  Lm: number,
  n: number,
  rho: number,
  note: string,
): SteelWeightItem | null {
  const area = calcArea_m2(shape, dims);
  if (area === null || Lm <= 0 || n <= 0 || rho <= 0) return null;
  const w = rho * area;
  const W = w * Lm * n;
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    shape,
    dims: { ...dims },
    Lm,
    n,
    rho,
    note,
    area_m2: area,
    w_kgm: w,
    W_kg: W,
    W_kN: weightKgToKN(W),
  };
}

export function recalcItem(item: SteelWeightItem): SteelWeightItem {
  const area = calcArea_m2(item.shape, item.dims);
  if (area === null) return item;
  const w = item.rho * area;
  const W = w * item.Lm * item.n;
  return { ...item, area_m2: area, w_kgm: w, W_kg: W, W_kN: weightKgToKN(W) };
}

export function dimSummary(shape: SteelShape, dims: Record<string, number>): string {
  const def = SHAPE_DEFS.find((definition) => definition.shape === shape);
  if (!def) return '';
  return def.params.map((param) => `${param.key}=${dims[param.key] ?? '?'}`).join(', ');
}

const STORAGE_KEY = 'calcnavi_steel_weight_items';

export function loadItems(): SteelWeightItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as SteelWeightItem[]).map((item) => ({
      ...item,
      W_kN: weightKgToKN(item.W_kg),
    }));
  } catch {
    return [];
  }
}

export function saveItems(items: SteelWeightItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota errors
  }
}

function validRect(a?: number, b?: number): a is number {
  return validPositive(a, b);
}

function validPositive(...values: Array<number | undefined>): boolean {
  return values.every((value) => typeof value === 'number' && Number.isFinite(value) && value > 0);
}
