import type { FormulaStep } from '@/lib/engHistory';

export type BeamSupport = 'simple-supported' | 'cantilever';
export type BeamLoadType = 'point' | 'uniform';

export interface BeamCaseInput {
  support: BeamSupport;
  loadType: BeamLoadType;
  E_GPa: number;
  sigmaAllow_MPa: number;
  spanMm: number;
  loadValue: number;
  I_mm4: number;
  Z_mm3: number;
  deflectionLimitDenominator: number;
}

export interface BeamCaseValidationResult {
  errors: Record<string, string>;
  warnings: string[];
}

export interface BeamReaction {
  label: string;
  value: number;
  unit: 'kN' | 'kN·m';
}

export interface BeamCaseResult {
  reactions: BeamReaction[];
  maxMoment_kNm: number;
  maxDeflection_mm: number;
  maxBendingStress_MPa: number;
  allowableStress_MPa: number;
  stressOk: boolean;
  allowableDeflection_mm: number;
  deflectionOk: boolean;
  totalLoad_kN: number;
  lineLoad_kN_per_m: number | null;
}

const SUPPORT_LABEL: Record<BeamSupport, string> = {
  'simple-supported': '単純梁',
  cantilever: '片持ち梁',
};

const LOAD_LABEL: Record<BeamLoadType, string> = {
  point: '集中荷重',
  uniform: '等分布荷重',
};

export function validateBeamCaseInput(input: Partial<BeamCaseInput>): BeamCaseValidationResult {
  const errors: Record<string, string> = {};
  const warnings: string[] = [];

  if (!isPositiveNumber(input.E_GPa)) errors.E_GPa = 'ヤング率 E は正の数を入力してください。';
  if (!isPositiveNumber(input.sigmaAllow_MPa)) errors.sigmaAllow = '許容曲げ応力は正の数を入力してください。';
  if (!isPositiveNumber(input.spanMm)) errors.span = 'スパン L は正の数を入力してください。';
  if (!isPositiveNumber(input.loadValue)) errors.load = '荷重は正の数を入力してください。';
  if (!isPositiveNumber(input.I_mm4)) errors.I = '断面二次モーメント I は正の数を入力してください。';
  if (!isPositiveNumber(input.Z_mm3)) errors.Z = '断面係数 Z は正の数を入力してください。';
  if (!isPositiveNumber(input.deflectionLimitDenominator)) {
    errors.deflection = '許容たわみ比 N/L は正の数を入力してください。';
  }

  if (isPositiveNumber(input.spanMm) && input.spanMm! > 100_000) {
    warnings.push('スパンが非常に長いため、入力単位を確認してください。');
  }
  if (isPositiveNumber(input.loadValue) && input.loadValue! > 1_000) {
    warnings.push('荷重値が大きいため、入力単位を確認してください。');
  }

  return { errors, warnings };
}

export function calculateBeamCase(input: BeamCaseInput): BeamCaseResult {
  const { support, loadType, E_GPa, sigmaAllow_MPa, spanMm, loadValue, I_mm4, Z_mm3, deflectionLimitDenominator } = input;
  const E_MPa = E_GPa * 1000;
  const L = spanMm;

  let totalLoadN: number;
  let maxMomentNmm: number;
  let maxDeflectionMm: number;
  let reactions: BeamReaction[];
  let lineLoadKNPerM: number | null = null;

  if (loadType === 'point') {
    const P = loadValue * 1000;
    totalLoadN = P;

    if (support === 'simple-supported') {
      reactions = [
        { label: '左支点反力 RA', value: loadValue / 2, unit: 'kN' },
        { label: '右支点反力 RB', value: loadValue / 2, unit: 'kN' },
      ];
      maxMomentNmm = (P * L) / 4;
      maxDeflectionMm = (P * L ** 3) / (48 * E_MPa * I_mm4);
    } else {
      reactions = [
        { label: '固定端反力 V', value: loadValue, unit: 'kN' },
        { label: '固定端モーメント M', value: (loadValue * L) / 1000, unit: 'kN·m' },
      ];
      maxMomentNmm = P * L;
      maxDeflectionMm = (P * L ** 3) / (3 * E_MPa * I_mm4);
    }
  } else {
    lineLoadKNPerM = loadValue;
    const w = loadValue;
    totalLoadN = w * L;

    if (support === 'simple-supported') {
      const totalLoadKN = (w * L) / 1000;
      reactions = [
        { label: '左支点反力 RA', value: totalLoadKN / 2, unit: 'kN' },
        { label: '右支点反力 RB', value: totalLoadKN / 2, unit: 'kN' },
      ];
      maxMomentNmm = (w * L ** 2) / 8;
      maxDeflectionMm = (5 * w * L ** 4) / (384 * E_MPa * I_mm4);
    } else {
      const totalLoadKN = (w * L) / 1000;
      reactions = [
        { label: '固定端反力 V', value: totalLoadKN, unit: 'kN' },
        { label: '固定端モーメント M', value: (w * L ** 2) / 1_000_000, unit: 'kN·m' },
      ];
      maxMomentNmm = (w * L ** 2) / 2;
      maxDeflectionMm = (w * L ** 4) / (8 * E_MPa * I_mm4);
    }
  }

  const maxMoment_kNm = maxMomentNmm / 1_000_000;
  const maxBendingStress_MPa = maxMomentNmm / Z_mm3;
  const allowableDeflection_mm = L / deflectionLimitDenominator;

  return {
    reactions,
    maxMoment_kNm,
    maxDeflection_mm: maxDeflectionMm,
    maxBendingStress_MPa,
    allowableStress_MPa: sigmaAllow_MPa,
    stressOk: maxBendingStress_MPa <= sigmaAllow_MPa,
    allowableDeflection_mm,
    deflectionOk: maxDeflectionMm <= allowableDeflection_mm,
    totalLoad_kN: totalLoadN / 1000,
    lineLoad_kN_per_m: lineLoadKNPerM,
  };
}

export function buildBeamCaseFormulaSteps(input: BeamCaseInput, result: BeamCaseResult): FormulaStep[] {
  const E_MPa = input.E_GPa * 1000;
  const L = input.spanMm;
  const steps: FormulaStep[] = [
    {
      label: '入力条件',
      expr:
        `${SUPPORT_LABEL[input.support]} / ${LOAD_LABEL[input.loadType]}\n` +
        `E = ${input.E_GPa} GPa = ${E_MPa.toLocaleString('ja-JP')} MPa\n` +
        `L = ${L.toLocaleString('ja-JP')} mm\n` +
        `I = ${input.I_mm4.toLocaleString('ja-JP')} mm⁴\n` +
        `Z = ${input.Z_mm3.toLocaleString('ja-JP')} mm³`,
    },
  ];

  if (input.loadType === 'point') {
    const P = input.loadValue;
    steps.push({
      label: '荷重条件',
      expr: `P = ${P.toLocaleString('ja-JP')} kN`,
    });
  } else {
    steps.push({
      label: '荷重条件',
      expr:
        `w = ${input.loadValue.toLocaleString('ja-JP')} kN/m\n` +
        `総荷重 W = w × L = ${input.loadValue} × ${L / 1000} = ${formatNumber(result.totalLoad_kN, 3)} kN`,
    });
  }

  const momentExpr = getMomentExpression(input);
  const deflectionExpr = getDeflectionExpression(input);

  steps.push(
    {
      label: '反力',
      expr: result.reactions.map((reaction) => `${reaction.label} = ${formatNumber(reaction.value, 3)} ${reaction.unit}`).join('\n'),
    },
    {
      label: '最大曲げモーメント',
      expr: `${momentExpr}\nMmax = ${formatNumber(result.maxMoment_kNm, 4)} kN·m`,
    },
    {
      label: '最大たわみ',
      expr: `${deflectionExpr}\nδmax = ${formatNumber(result.maxDeflection_mm, 4)} mm`,
    },
    {
      label: '最大曲げ応力',
      expr:
        `σmax = Mmax / Z = ${(result.maxMoment_kNm * 1_000_000).toLocaleString('ja-JP')} / ${input.Z_mm3.toLocaleString('ja-JP')}\n` +
        `= ${formatNumber(result.maxBendingStress_MPa, 3)} MPa`,
    },
    {
      label: '許容値との比較',
      expr:
        `応力: ${formatNumber(result.maxBendingStress_MPa, 3)} / ${formatNumber(result.allowableStress_MPa, 3)} MPa → ${result.stressOk ? 'OK' : 'NG'}\n` +
        `たわみ: ${formatNumber(result.maxDeflection_mm, 3)} / ${formatNumber(result.allowableDeflection_mm, 3)} mm → ${result.deflectionOk ? 'OK' : 'NG'} (L/${input.deflectionLimitDenominator})`,
    },
  );

  return steps;
}

function getMomentExpression(input: BeamCaseInput): string {
  const Lm = input.spanMm / 1000;

  if (input.support === 'simple-supported' && input.loadType === 'point') {
    return `Mmax = P × L / 4 = ${input.loadValue} × ${Lm} / 4`;
  }
  if (input.support === 'simple-supported' && input.loadType === 'uniform') {
    return `Mmax = w × L² / 8 = ${input.loadValue} × ${Lm}² / 8`;
  }
  if (input.support === 'cantilever' && input.loadType === 'point') {
    return `Mmax = P × L = ${input.loadValue} × ${Lm}`;
  }
  return `Mmax = w × L² / 2 = ${input.loadValue} × ${Lm}² / 2`;
}

function getDeflectionExpression(input: BeamCaseInput): string {
  const E_MPa = input.E_GPa * 1000;

  if (input.support === 'simple-supported' && input.loadType === 'point') {
    return `δmax = PL³ / 48EI = (${input.loadValue * 1000} × ${input.spanMm}³) / (48 × ${E_MPa} × ${input.I_mm4})`;
  }
  if (input.support === 'simple-supported' && input.loadType === 'uniform') {
    return `δmax = 5wL⁴ / 384EI = (5 × ${input.loadValue} × ${input.spanMm}⁴) / (384 × ${E_MPa} × ${input.I_mm4})`;
  }
  if (input.support === 'cantilever' && input.loadType === 'point') {
    return `δmax = PL³ / 3EI = (${input.loadValue * 1000} × ${input.spanMm}³) / (3 × ${E_MPa} × ${input.I_mm4})`;
  }
  return `δmax = wL⁴ / 8EI = (${input.loadValue} × ${input.spanMm}⁴) / (8 × ${E_MPa} × ${input.I_mm4})`;
}

function formatNumber(value: number, digits: number): string {
  return value.toLocaleString('ja-JP', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

function isPositiveNumber(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}
