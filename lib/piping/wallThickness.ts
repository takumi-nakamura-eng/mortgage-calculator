export interface PipeThicknessInput {
  pressure_kPa: number;
  outerDiameter_mm: number;
  yieldStress_MPa: number;
  designFactor: number;
  jointEfficiency: number;
  corrosionAllowance_mm: number;
}

export interface PipeThicknessResult {
  requiredThickness_mm: number;
  nominalThickness_mm: number;
  thicknessRatio: number;
  safetyFactor: number;
  formulaSteps: Array<{ label: string; expr: string }>;
}

export function validatePipeThicknessInput(input: PipeThicknessInput): string[] {
  const errors: string[] = [];
  if (!(input.pressure_kPa > 0)) errors.push('設計圧力 P は正の値を入力してください。');
  if (!(input.outerDiameter_mm > 0)) errors.push('外径 D は正の値を入力してください。');
  if (!(input.yieldStress_MPa > 0)) errors.push('最小降伏応力 S は正の値を入力してください。');
  if (!(input.designFactor > 0 && input.designFactor <= 1)) errors.push('設計係数 F は 0 を超え 1 以下で入力してください。');
  if (!(input.jointEfficiency > 0 && input.jointEfficiency <= 1)) errors.push('溶接効率 E は 0 を超え 1 以下で入力してください。');
  if (input.corrosionAllowance_mm < 0) errors.push('腐食余裕 A は 0 以上を入力してください。');
  return errors;
}

export function calculatePipeThickness(input: PipeThicknessInput): PipeThicknessResult {
  const pressure_MPa = input.pressure_kPa / 1000;
  const requiredThickness_mm =
    (pressure_MPa * input.outerDiameter_mm) /
    (2 * input.designFactor * input.yieldStress_MPa * input.jointEfficiency);
  const nominalThickness_mm = requiredThickness_mm + input.corrosionAllowance_mm;
  const thicknessRatio = requiredThickness_mm / input.outerDiameter_mm;
  const safetyFactor = 1 / (input.designFactor * input.jointEfficiency);

  return {
    requiredThickness_mm,
    nominalThickness_mm,
    thicknessRatio,
    safetyFactor,
    formulaSteps: [
      {
        label: '設計圧力換算',
        expr: `P = ${formatValue(input.pressure_kPa)} kPa = ${formatValue(pressure_MPa)} MPa`,
      },
      {
        label: '必要肉厚',
        expr: `t = (P × D) / (2 × F × S × E) = (${formatValue(pressure_MPa)} × ${formatValue(input.outerDiameter_mm)}) / (2 × ${formatValue(input.designFactor)} × ${formatValue(input.yieldStress_MPa)} × ${formatValue(input.jointEfficiency)}) = ${formatValue(requiredThickness_mm)} mm`,
      },
      {
        label: '名目肉厚',
        expr: `t_n = t + A = ${formatValue(requiredThickness_mm)} + ${formatValue(input.corrosionAllowance_mm)} = ${formatValue(nominalThickness_mm)} mm`,
      },
    ],
  };
}

function formatValue(value: number): string {
  return value.toFixed(4).replace(/\.?0+$/, '');
}
