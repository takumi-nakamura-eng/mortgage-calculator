/**
 * Unit conversion utilities for beam calculations.
 * All internal calculations use N–mm–MPa (N/mm²) system.
 */

// ─── Mass / Force ────────────────────────────────────────────────────────────

/** kg → kN */
export function kgToKN(kg: number): number {
  return (kg * 9.80665) / 1000;
}

/** kN → kg */
export function kNToKg(kN: number): number {
  return (kN * 1000) / 9.80665;
}

/** kN → N */
export function kNToN(kN: number): number {
  return kN * 1000;
}

// ─── Elastic Modulus ─────────────────────────────────────────────────────────

/** GPa → MPa (= N/mm²) */
export function GPaToMPa(GPa: number): number {
  return GPa * 1000;
}

// ─── Section modulus Z ───────────────────────────────────────────────────────

/** cm³ → mm³ */
export function cm3ToMm3(cm3: number): number {
  return cm3 * 1000;
}

/** mm³ → cm³ */
export function mm3ToCm3(mm3: number): number {
  return mm3 / 1000;
}

// ─── Second moment of area I ─────────────────────────────────────────────────

/** cm⁴ → mm⁴ */
export function cm4ToMm4(cm4: number): number {
  return cm4 * 10000;
}

/** mm⁴ → cm⁴ */
export function mm4ToCm4(mm4: number): number {
  return mm4 / 10000;
}

// ─── Display helpers ─────────────────────────────────────────────────────────

/**
 * Round to given decimal places using ROUND_HALF_UP semantics.
 */
export function roundHalfUp(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor + Number.EPSILON) / factor;
}

/**
 * Format a number with fixed decimal places.
 */
export function fmt(value: number, decimals: number): string {
  return roundHalfUp(value, decimals).toFixed(decimals);
}
