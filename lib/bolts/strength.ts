/**
 * Bolt tensile / shear strength calculation — pure functions.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * 検算ケース1: M16, 8.8, As, Rm_min, n=1, γt=γv=1.5, kv=0.57735…
 *   Aeff = 157.0 mm²
 *   S    = 800 N/mm²
 *   Rt   = 157.0 * 800 = 125,600 N
 *   Rv   = 125,600 * 0.57735… = 72,524.96… N
 *   Ra_t = 125,600 / 1.5 / 1000 = 83.733… kN
 *   Ra_v = 72,524.96… / 1.5 / 1000 = 48.350… kN
 *
 * 検算ケース2: M20, 10.9, As, Rp0.2_min=940, n=4, γt=γv=1.5, kv=0.57735…
 *   Aeff = 245.0 mm²
 *   S    = 940 N/mm²
 *   Rt   = 245.0 * 940 = 230,300 N
 *   Rv   = 230,300 * 0.57735… = 132,971.7… N
 *   Ra_t = 230,300 / 1.5 / 1000 = 153.533… kN/本
 *   Ra_v = 132,971.7… / 1.5 / 1000 = 88.648… kN/本
 *   Ra_t_total = 153.533… * 4 = 614.133… kN
 *   Ra_v_total = 88.648… * 4 = 354.590… kN
 *   相互作用: N=500kN, V=100kN → 500/614.133 + 100/354.590 = 0.8140… + 0.2820… = 1.096… → NG
 *   相互作用: N=400kN, V=100kN → 400/614.133 + 100/354.590 = 0.6512… + 0.2820… = 0.9332… → OK
 * ───────────────────────────────────────────────────────────────────────────
 */

import {
  AS_TABLE,
  D_TABLE,
  GRADE_TABLE,
  getYieldOrProofMin,
  type BoltSize,
  type BoltGrade,
} from './data';

// ─── Types ──────────────────────────────────────────────────────────────────

export type AreaMode = 'As' | 'A';
export type StrengthBasis = 'Rm_min' | 'YieldOrProof_min';

export interface BoltStrengthInput {
  size: BoltSize;
  grade: BoltGrade;
  areaMode: AreaMode;
  strengthBasis: StrengthBasis;
  n: number;
  gamma_t: number;
  gamma_v: number;
  kv: number;
  N_kN?: number;   // tensile load [kN] (for interaction)
  V_kN?: number;   // shear load [kN] (for interaction)
}

export interface BoltStrengthResult {
  Aeff_mm2: number;
  S_Nmm2: number;
  Rt_N: number;          // Material tensile capacity per bolt [N]
  Rv_N: number;          // Material shear capacity per bolt [N]
  Ra_t_kN: number;       // Allowable tensile per bolt [kN]
  Ra_v_kN: number;       // Allowable shear per bolt [kN]
  Ra_t_total_kN: number; // Total allowable tensile [kN]
  Ra_v_total_kN: number; // Total allowable shear [kN]
  interaction?: {
    N_kN: number;
    V_kN: number;
    ratio: number;        // (N/Ra_t_total) + (V/Ra_v_total)
    ok: boolean;
    margin: number | null; // 1/ratio when ratio > 0
  };
}

// ─── Main calculation ───────────────────────────────────────────────────────

export function calcBoltStrength(input: BoltStrengthInput): BoltStrengthResult | null {
  const { size, grade, areaMode, strengthBasis, n, gamma_t, gamma_v, kv, N_kN, V_kN } = input;

  if (n < 1 || !Number.isInteger(n)) return null;
  if (gamma_t <= 0 || gamma_v <= 0 || kv <= 0) return null;

  // Effective area
  const Aeff = areaMode === 'As'
    ? AS_TABLE[size]
    : Math.PI * D_TABLE[size] ** 2 / 4;

  // Strength
  const S = strengthBasis === 'Rm_min'
    ? GRADE_TABLE[grade].Rm_min
    : getYieldOrProofMin(grade);

  // Material capacity per bolt [N]
  const Rt = Aeff * S;
  const Rv = Rt * kv;

  // Allowable per bolt [kN]
  const Ra_t = Rt / gamma_t / 1000;
  const Ra_v = Rv / gamma_v / 1000;

  // Total
  const Ra_t_total = Ra_t * n;
  const Ra_v_total = Ra_v * n;

  // Interaction (only when at least one load is provided)
  let interaction: BoltStrengthResult['interaction'] = undefined;
  const hasN = N_kN !== undefined && N_kN >= 0;
  const hasV = V_kN !== undefined && V_kN >= 0;
  if (hasN || hasV) {
    const nVal = hasN ? N_kN! : 0;
    const vVal = hasV ? V_kN! : 0;
    const ratioT = Ra_t_total > 0 ? nVal / Ra_t_total : Infinity;
    const ratioV = Ra_v_total > 0 ? vVal / Ra_v_total : Infinity;
    const ratio = ratioT + ratioV;
    interaction = {
      N_kN: nVal,
      V_kN: vVal,
      ratio,
      ok: ratio <= 1.0,
      margin: ratio > 0 && isFinite(ratio) ? 1 / ratio : null,
    };
  }

  return {
    Aeff_mm2: Aeff,
    S_Nmm2: S,
    Rt_N: Rt,
    Rv_N: Rv,
    Ra_t_kN: Ra_t,
    Ra_v_kN: Ra_v,
    Ra_t_total_kN: Ra_t_total,
    Ra_v_total_kN: Ra_v_total,
    interaction,
  };
}
