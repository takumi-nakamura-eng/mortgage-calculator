export type Diameter = 'M6' | 'M8' | 'M10' | 'M12' | 'M16' | 'M20' | 'M24';

export interface BoltCalcSpec {
  p: number;
  Hnut: number;
  Hpw: number;
  Hsw: number;
}

export const BOLT_CALC_SPECS: Record<Diameter, BoltCalcSpec> = {
  M6: { p: 1.0, Hnut: 5.2, Hpw: 1.6, Hsw: 1.6 },
  M8: { p: 1.25, Hnut: 6.8, Hpw: 1.6, Hsw: 2.0 },
  M10: { p: 1.5, Hnut: 8.4, Hpw: 2.0, Hsw: 2.5 },
  M12: { p: 1.75, Hnut: 10.8, Hpw: 2.5, Hsw: 3.0 },
  M16: { p: 2.0, Hnut: 14.8, Hpw: 3.0, Hsw: 4.0 },
  M20: { p: 2.5, Hnut: 18.0, Hpw: 3.0, Hsw: 5.1 },
  M24: { p: 3.0, Hnut: 21.5, Hpw: 4.0, Hsw: 5.6 },
};

export const M12_REFERENCE_GEOMETRY = {
  threadDiameter_mm: 12.0,
  pitch_mm: 1.75,
  threePitch_mm: 5.25,
  headWidthAcrossFlats_mm: 19.0,
  headHeight_mm: 7.5,
  nutHeight_mm: 10.8,
  plainWasherOuterDiameter_mm: 24.0,
  plainWasherInnerDiameter_mm: 13.0,
  plainWasherThickness_mm: 2.5,
  springWasherOuterDiameter_mm: 21.8,
  springWasherInnerDiameter_mm: 12.2,
  springWasherThickness_mm: 3.0,
} as const;

export const M12_REFERENCE_NOTE =
  'M12並目・JIS系代表寸法の概略。実調達はメーカー寸法優先。';
