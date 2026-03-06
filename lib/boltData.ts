/**
 * Bolt data tables — fixed values embedded from the specification.
 * DO NOT fetch or search for these values externally.
 */

// ─── Bolt sizes (ISO metric coarse thread) ─────────────────────────────────

// NOTE: 強度計算は一般的なメトリック並目サイズを広く扱う（M6〜M24, M14/M18/M22含む）。
// 長さ計算ツールは lib/bolts/specs.ts の実装意図により対象サイズを限定している。

export const BOLT_SIZES = ['M6', 'M8', 'M10', 'M12', 'M14', 'M16', 'M18', 'M20', 'M22', 'M24'] as const;
export type BoltSize = (typeof BOLT_SIZES)[number];

/** Nominal stress area As [mm²] — ISO metric coarse thread */
export const AS_TABLE: Record<BoltSize, number> = {
  M6:  20.1,
  M8:  36.6,
  M10: 58.0,
  M12: 84.3,
  M14: 115.0,
  M16: 157.0,
  M18: 192.0,
  M20: 245.0,
  M22: 303.0,
  M24: 353.0,
};

/** Nominal diameter d [mm] for shank area A = π d² / 4 */
export const D_TABLE: Record<BoltSize, number> = {
  M6:  6,
  M8:  8,
  M10: 10,
  M12: 12,
  M14: 14,
  M16: 16,
  M18: 18,
  M20: 20,
  M22: 22,
  M24: 24,
};

// ─── Bolt grades (JIS/ISO compatible) ───────────────────────────────────────

export const BOLT_GRADES = ['4.8', '8.8', '10.9'] as const;
export type BoltGrade = (typeof BOLT_GRADES)[number];

export interface GradeData {
  Rm_min: number;       // Minimum tensile strength [N/mm²]
  ReL_min?: number;     // Minimum yield point (4.8 only) [N/mm²]
  Rp02_min?: number;    // Minimum 0.2% proof stress (8.8/10.9) [N/mm²]
  note: string;
}

export const GRADE_TABLE: Record<BoltGrade, GradeData> = {
  '4.8': {
    Rm_min: 420,
    ReL_min: 340,
    note: '4.8は降伏点(ReL)最小値を採用',
  },
  '8.8': {
    Rm_min: 800,
    Rp02_min: 640,
    note: '8.8は0.2%耐力(Rp0.2)最小値を採用（d≤16相当の保守値）',
  },
  '10.9': {
    Rm_min: 1040,
    Rp02_min: 940,
    note: '10.9は0.2%耐力(Rp0.2)最小値を採用',
  },
};

/** Get yield/proof min for a grade */
export function getYieldOrProofMin(grade: BoltGrade): number {
  const g = GRADE_TABLE[grade];
  return g.ReL_min ?? g.Rp02_min ?? g.Rm_min;
}
