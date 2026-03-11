export type WeldJointType = 'fillet' | 'butt';
export type WeldStrengthMode = 'required-length' | 'allowable-load';

export interface WeldStrengthInput {
  jointType: WeldJointType;
  mode: WeldStrengthMode;
  weldSize_mm?: number;
  throatThickness_mm?: number;
  allowableStress_MPa: number;
  designLoad_kN?: number;
  weldLength_mm?: number;
  weldCount: number;
}

export interface WeldStrengthResult {
  throatThickness_mm: number;
  effectiveArea_mm2: number;
  requiredLength_mm: number | null;
  allowableLoad_kN: number | null;
  actualStress_MPa: number | null;
  safetyFactor: number | null;
  formulaSteps: Array<{ label: string; expr: string }>;
}

export function resolveWeldThroatThickness(input: Pick<WeldStrengthInput, 'jointType' | 'weldSize_mm' | 'throatThickness_mm'>): number {
  if (input.jointType === 'fillet') {
    return 0.707 * (input.weldSize_mm ?? 0);
  }
  return input.throatThickness_mm ?? 0;
}

export function validateWeldStrengthInput(input: WeldStrengthInput): string[] {
  const errors: string[] = [];
  const throat = resolveWeldThroatThickness(input);
  if (input.jointType === 'fillet' && (!input.weldSize_mm || input.weldSize_mm <= 0)) {
    errors.push('脚長 a は正の値を入力してください。');
  }
  if (input.jointType === 'butt' && (!input.throatThickness_mm || input.throatThickness_mm <= 0)) {
    errors.push('のど厚 t は正の値を入力してください。');
  }
  if (!(input.allowableStress_MPa > 0)) errors.push('許容溶接応力 σ_allow は正の値を入力してください。');
  if (!(input.weldCount > 0)) errors.push('溶接本数 n は 1 以上を入力してください。');
  if (!(throat > 0)) errors.push('有効のど厚 t が 0 以下です。');
  if (input.mode === 'required-length' && !(input.designLoad_kN && input.designLoad_kN > 0)) {
    errors.push('設計荷重 F は正の値を入力してください。');
  }
  if (input.mode === 'allowable-load' && !(input.weldLength_mm && input.weldLength_mm > 0)) {
    errors.push('設計溶接長さ l は正の値を入力してください。');
  }
  return errors;
}

export function calculateWeldStrength(input: WeldStrengthInput): WeldStrengthResult {
  const throatThickness_mm = resolveWeldThroatThickness(input);
  const formulaSteps: WeldStrengthResult['formulaSteps'] = [];

  if (input.mode === 'required-length') {
    const designLoad_N = (input.designLoad_kN ?? 0) * 1000;
    const requiredLength_mm = designLoad_N / (input.allowableStress_MPa * throatThickness_mm * input.weldCount);
    const effectiveArea_mm2 = throatThickness_mm * requiredLength_mm * input.weldCount;
    const actualStress_MPa = effectiveArea_mm2 > 0 ? designLoad_N / effectiveArea_mm2 : null;
    const safetyFactor = actualStress_MPa ? input.allowableStress_MPa / actualStress_MPa : null;

    formulaSteps.push(
      {
        label: 'のど厚',
        expr:
          input.jointType === 'fillet'
            ? `t = 0.707 × a = 0.707 × ${formatValue(input.weldSize_mm)} = ${formatValue(throatThickness_mm)} mm`
            : `t = ${formatValue(throatThickness_mm)} mm`,
      },
      {
        label: '必要溶接長さ',
        expr: `l = F / (σ_allow × t × n) = ${formatValue(designLoad_N)} / (${formatValue(input.allowableStress_MPa)} × ${formatValue(throatThickness_mm)} × ${input.weldCount}) = ${formatValue(requiredLength_mm)} mm`,
      },
      {
        label: '実効応力',
        expr: `σ = F / (t × l × n) = ${formatValue(designLoad_N)} / (${formatValue(throatThickness_mm)} × ${formatValue(requiredLength_mm)} × ${input.weldCount}) = ${formatValue(actualStress_MPa)} MPa`,
      },
    );

    return {
      throatThickness_mm,
      effectiveArea_mm2,
      requiredLength_mm,
      allowableLoad_kN: null,
      actualStress_MPa,
      safetyFactor,
      formulaSteps,
    };
  }

  const effectiveArea_mm2 = throatThickness_mm * (input.weldLength_mm ?? 0) * input.weldCount;
  const allowableLoad_N = input.allowableStress_MPa * effectiveArea_mm2;
  const allowableLoad_kN = allowableLoad_N / 1000;
  const actualStress_MPa = allowableLoad_N > 0 ? allowableLoad_N / effectiveArea_mm2 : null;
  const safetyFactor = actualStress_MPa ? input.allowableStress_MPa / actualStress_MPa : null;

  formulaSteps.push(
    {
      label: 'のど厚',
      expr:
        input.jointType === 'fillet'
          ? `t = 0.707 × a = 0.707 × ${formatValue(input.weldSize_mm)} = ${formatValue(throatThickness_mm)} mm`
          : `t = ${formatValue(throatThickness_mm)} mm`,
    },
    {
      label: '有効断面積',
      expr: `A = t × l × n = ${formatValue(throatThickness_mm)} × ${formatValue(input.weldLength_mm)} × ${input.weldCount} = ${formatValue(effectiveArea_mm2)} mm²`,
    },
    {
      label: '許容荷重',
      expr: `F_allow = σ_allow × A = ${formatValue(input.allowableStress_MPa)} × ${formatValue(effectiveArea_mm2)} = ${formatValue(allowableLoad_N)} N = ${formatValue(allowableLoad_kN)} kN`,
    },
  );

  return {
    throatThickness_mm,
    effectiveArea_mm2,
    requiredLength_mm: null,
    allowableLoad_kN,
    actualStress_MPa,
    safetyFactor,
    formulaSteps,
  };
}

function formatValue(value?: number | null): string {
  if (value == null || !Number.isFinite(value)) return '-';
  return value.toFixed(3).replace(/\.?0+$/, '');
}
