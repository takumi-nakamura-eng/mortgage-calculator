/**
 * Simple beam (simply supported, pin–roller) calculation library.
 *
 * ALL internal units: N, mm, MPa (= N/mm²)
 *
 * Exported functions are pure and dependency-free so they are
 * straightforward to unit-test.
 */

import { kNToN } from './units';

// ─── Types ────────────────────────────────────────────────────────────────────

export type LoadCase = 'center' | 'uniform';

/** Inputs already normalised to internal units (N, mm, MPa). */
export interface BeamInputsInternal {
  /** Span [mm] */
  L: number;
  /** Load case */
  loadCase: LoadCase;
  /**
   * For 'center': concentrated load at mid-span [N]
   * For 'uniform': total load [N] — will be divided by L to get w [N/mm]
   */
  loadN: number;
  /** Young's modulus [MPa = N/mm²] */
  E: number;
  /** Second moment of area [mm⁴] */
  I: number;
  /** Section modulus [mm³] */
  Z: number;
  /** Allowable bending stress [MPa] */
  sigmaAllow: number;
  /** Deflection limit denominator n  →  δ_allow = L / n */
  deflectionLimitN: number;
}

export interface BeamResult {
  /** Maximum bending moment [N·mm] */
  Mmax_Nmm: number;
  /** Maximum bending moment [kN·m] */
  Mmax_kNm: number;
  /** Maximum bending stress [MPa] */
  sigmaMax: number;
  /** Allowable bending stress [MPa] */
  sigmaAllow: number;
  /** Stress judgement */
  stressOK: boolean;
  /** Maximum deflection [mm] */
  deltaMax: number;
  /** Allowable deflection [mm] */
  deltaAllow: number;
  /** Deflection judgement */
  deflectionOK: boolean;
  /**
   * Distributed load intensity [N/mm].
   * Only meaningful for 'uniform' load case; undefined for 'center'.
   */
  w_N_per_mm?: number;
  /** w in kN/m for display. */
  w_kN_per_m?: number;
}

// ─── Core calculation ─────────────────────────────────────────────────────────

/**
 * Calculate simple beam results.
 *
 * @param inputs - Normalised inputs in N–mm–MPa
 * @returns Calculation results
 */
export function calcSimpleBeam(inputs: BeamInputsInternal): BeamResult {
  const { L, loadCase, loadN, E, I, Z, sigmaAllow, deflectionLimitN } = inputs;

  let Mmax_Nmm: number;
  let deltaMax: number;
  let w_N_per_mm: number | undefined;
  let w_kN_per_m: number | undefined;

  if (loadCase === 'center') {
    // Concentrated load P at mid-span
    const P = loadN; // [N]
    Mmax_Nmm = (P * L) / 4;
    deltaMax = (P * Math.pow(L, 3)) / (48 * E * I);
  } else {
    // Uniformly distributed load (total load W_total → line load w)
    const w = loadN / L; // [N/mm]
    w_N_per_mm = w;
    w_kN_per_m = w * 1000; // N/mm → kN/m (×1000)
    Mmax_Nmm = (w * L * L) / 8;
    deltaMax = (5 * w * Math.pow(L, 4)) / (384 * E * I);
  }

  const Mmax_kNm = Mmax_Nmm / 1e6; // N·mm → kN·m
  const sigmaMax = Mmax_Nmm / Z; // MPa
  const deltaAllow = L / deflectionLimitN; // mm

  return {
    Mmax_Nmm,
    Mmax_kNm,
    sigmaMax,
    sigmaAllow,
    stressOK: sigmaMax <= sigmaAllow,
    deltaMax,
    deltaAllow,
    deflectionOK: deltaMax <= deltaAllow,
    w_N_per_mm,
    w_kN_per_m,
  };
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
}

export interface ValidationResult {
  errors: ValidationError[];
  warnings: ValidationWarning[];
  valid: boolean;
}

/**
 * Validate raw UI inputs.
 * Inputs are in UI units (kN for load, GPa for E etc.) so the thresholds
 * below are in those units.
 *
 * @param L        span [mm]
 * @param loadKN   load in kN (P or W_total)
 * @param E_MPa    Young's modulus [MPa]
 * @param I_mm4    second moment of area [mm⁴]
 * @param Z_mm3    section modulus [mm³]
 * @param sigmaAllow  allowable stress [MPa]
 */
export function validateBeamInputs(
  L: number | null,
  loadKN: number | null,
  E_MPa: number | null,
  I_mm4: number | null,
  Z_mm3: number | null,
  sigmaAllow: number | null,
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // ── Errors (block calculation) ──────────────────────────────────────────
  if (L === null || isNaN(L) || L <= 0) {
    errors.push({ field: 'L', message: 'スパン L は正の数を入力してください。' });
  }
  if (loadKN === null || isNaN(loadKN) || loadKN <= 0) {
    errors.push({ field: 'load', message: '荷重は正の数を入力してください。' });
  }
  if (E_MPa === null || isNaN(E_MPa) || E_MPa <= 0) {
    errors.push({ field: 'E', message: 'ヤング率 E は正の数を入力してください。' });
  }
  if (I_mm4 === null || isNaN(I_mm4) || I_mm4 <= 0) {
    errors.push({ field: 'I', message: '断面二次モーメント I は正の数を入力してください。' });
  }
  if (Z_mm3 === null || isNaN(Z_mm3) || Z_mm3 <= 0) {
    errors.push({ field: 'Z', message: '断面係数 Z は正の数を入力してください。' });
  }
  if (sigmaAllow === null || isNaN(sigmaAllow) || sigmaAllow <= 0) {
    errors.push({ field: 'sigmaAllow', message: '許容曲げ応力 σ_allow は正の数を入力してください。' });
  }

  // ── Warnings (allow calculation, but alert user) ─────────────────────────
  if (L !== null && !isNaN(L) && L > 0) {
    if (L < 50) {
      warnings.push({ field: 'L', message: 'スパンが非常に短い（L < 50 mm）。単位を確認してください。' });
    }
    if (L > 100_000) {
      warnings.push({ field: 'L', message: 'スパンが非常に長い（L > 100,000 mm）。単位を確認してください。' });
    }
  }
  if (loadKN !== null && !isNaN(loadKN) && loadKN > 500) {
    warnings.push({ field: 'load', message: '荷重が非常に大きい（> 500 kN）。単位・入力値を確認してください。' });
  }

  return { errors, warnings, valid: errors.length === 0 };
}

// ─── Helpers re-exported for convenience ─────────────────────────────────────

/** Convert kN load to internal N value (used by UI layer). */
export function loadKNToN(kN: number): number {
  return kNToN(kN);
}
