import { kgToKN } from './units';
import {
  SECTION_DEFS,
  calcSection,
  validateSectionDims,
  type SectionShape,
  type SectionResult,
} from './sections';

export interface BeamSelfWeightInput {
  shape: SectionShape;
  dims: Record<string, number>;
  length_m: number;
  density_kg_m3: number;
}

export interface BeamSelfWeightResult {
  section: SectionResult;
  unitWeight_kg_m: number;
  selfWeight_kN_m: number;
  totalWeight_kg: number;
  totalWeight_kN: number;
  formulaSteps: Array<{ label: string; expr: string }>;
}

export function validateBeamSelfWeightInput(input: BeamSelfWeightInput): string[] {
  const errors = validateSectionDims(input.shape, input.dims);
  if (!(input.length_m > 0)) errors.push('長さ L は正の値を入力してください。');
  if (!(input.density_kg_m3 > 0)) errors.push('密度は正の値を入力してください。');
  return errors;
}

export function calculateBeamSelfWeight(input: BeamSelfWeightInput): BeamSelfWeightResult | null {
  const section = calcSection(input.shape, input.dims);
  if (!section) return null;

  const area_m2 = section.area_mm2 / 1_000_000;
  const unitWeight_kg_m = area_m2 * input.density_kg_m3;
  const selfWeight_kN_m = kgToKN(unitWeight_kg_m);
  const totalWeight_kg = unitWeight_kg_m * input.length_m;
  const totalWeight_kN = kgToKN(totalWeight_kg);

  return {
    section,
    unitWeight_kg_m,
    selfWeight_kN_m,
    totalWeight_kg,
    totalWeight_kN,
    formulaSteps: [
      {
        label: '断面積換算',
        expr: `A = ${formatValue(section.area_mm2)} mm² = ${formatValue(area_m2)} m²`,
      },
      {
        label: '単位重量',
        expr: `w = ρ × A = ${formatValue(input.density_kg_m3)} × ${formatValue(area_m2)} = ${formatValue(unitWeight_kg_m)} kg/m`,
      },
      {
        label: '梁自重',
        expr: `q = ${formatValue(unitWeight_kg_m)} kg/m × 9.80665 / 1000 = ${formatValue(selfWeight_kN_m)} kN/m`,
      },
    ],
  };
}

export function getBeamSelfWeightShapes() {
  return SECTION_DEFS.filter((definition) =>
    ['H', 'rect-tube', 'circ-tube', 'round-bar', 'flat', 'channel', 't-bar'].includes(definition.shape),
  );
}

function formatValue(value: number): string {
  return value.toFixed(4).replace(/\.?0+$/, '');
}
