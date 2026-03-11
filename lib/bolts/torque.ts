export type BoltTorqueMode = 'preload-to-torque' | 'torque-to-preload';
export type BoltStrengthClass = '4.8' | '8.8' | '10.9';

export interface BoltTorqueInput {
  nominalDiameter_mm: number;
  pitch_mm: number;
  strengthClass: BoltStrengthClass;
  frictionCoefficient: number;
  mode: BoltTorqueMode;
  targetPreload_kN?: number;
  targetTorque_Nm?: number;
}

export interface BoltTorqueResult {
  nutFactor: number;
  torque_Nm: number | null;
  preload_kN: number | null;
  tensileStressArea_mm2: number;
  tensileStress_MPa: number;
  proofStress_MPa: number;
  proofStressRatio: number;
  bearingStress_MPa: number;
  recommendedSafetyRange: string;
  formulaSteps: Array<{ label: string; expr: string }>;
}

const PROOF_STRESS_MPA: Record<BoltStrengthClass, number> = {
  '4.8': 320,
  '8.8': 600,
  '10.9': 830,
};

export function validateBoltTorqueInput(input: BoltTorqueInput): string[] {
  const errors: string[] = [];
  if (!(input.nominalDiameter_mm > 0)) errors.push('呼び径 d は正の値を入力してください。');
  if (!(input.pitch_mm > 0)) errors.push('ピッチ P は正の値を入力してください。');
  if (!(input.frictionCoefficient > 0)) errors.push('摩擦係数 μ は正の値を入力してください。');
  if (input.mode === 'preload-to-torque' && !(input.targetPreload_kN && input.targetPreload_kN > 0)) {
    errors.push('目標軸力 F_t は正の値を入力してください。');
  }
  if (input.mode === 'torque-to-preload' && !(input.targetTorque_Nm && input.targetTorque_Nm > 0)) {
    errors.push('目標トルク T は正の値を入力してください。');
  }
  return errors;
}

export function calculateBoltTorque(input: BoltTorqueInput): BoltTorqueResult {
  const nutFactor = calculateNutFactor(input.nominalDiameter_mm, input.pitch_mm, input.frictionCoefficient);
  const tensileStressArea_mm2 = tensileStressArea(input.nominalDiameter_mm, input.pitch_mm);
  const proofStress_MPa = PROOF_STRESS_MPA[input.strengthClass];

  let torque_Nm: number | null = null;
  let preload_kN: number | null = null;

  if (input.mode === 'preload-to-torque') {
    preload_kN = input.targetPreload_kN ?? 0;
    torque_Nm = nutFactor * preload_kN;
  } else {
    torque_Nm = input.targetTorque_Nm ?? 0;
    preload_kN = torque_Nm / nutFactor;
  }

  const tensileStress_MPa = ((preload_kN ?? 0) * 1000) / tensileStressArea_mm2;
  const proofStressRatio = proofStress_MPa > 0 ? tensileStress_MPa / proofStress_MPa : 0;
  const bearingStress_MPa = ((preload_kN ?? 0) * 1000) / (Math.PI * input.nominalDiameter_mm * input.pitch_mm);

  return {
    nutFactor,
    torque_Nm,
    preload_kN,
    tensileStressArea_mm2,
    tensileStress_MPa,
    proofStress_MPa,
    proofStressRatio,
    bearingStress_MPa,
    recommendedSafetyRange: recommendSafetyRange(proofStressRatio),
    formulaSteps: [
      {
        label: '工具係数',
        expr: `K = ((0.12 + 0.58μ) + 0.02 × P / d) × d = ((0.12 + 0.58 × ${formatValue(input.frictionCoefficient)}) + 0.02 × ${formatValue(input.pitch_mm)} / ${formatValue(input.nominalDiameter_mm)}) × ${formatValue(input.nominalDiameter_mm)} = ${formatValue(nutFactor)} N·m/kN`,
      },
      input.mode === 'preload-to-torque'
        ? {
            label: '締付けトルク',
            expr: `T = K × F_t = ${formatValue(nutFactor)} × ${formatValue(preload_kN)} = ${formatValue(torque_Nm)} N·m`,
          }
        : {
            label: '軸力',
            expr: `F_t = T / K = ${formatValue(torque_Nm)} / ${formatValue(nutFactor)} = ${formatValue(preload_kN)} kN`,
          },
      {
        label: '軸応力',
        expr: `σ = F_t / A_s = ${formatValue((preload_kN ?? 0) * 1000)} / ${formatValue(tensileStressArea_mm2)} = ${formatValue(tensileStress_MPa)} MPa`,
      },
    ],
  };
}

export function calculateNutFactor(diameter_mm: number, pitch_mm: number, frictionCoefficient: number): number {
  const base = 0.12 + 0.58 * frictionCoefficient;
  const pitchTerm = 0.02 * (pitch_mm / diameter_mm);
  return (base + pitchTerm) * diameter_mm;
}

export function tensileStressArea(diameter_mm: number, pitch_mm: number): number {
  return (Math.PI / 4) * (diameter_mm - 0.9382 * pitch_mm) ** 2;
}

function recommendSafetyRange(ratio: number): string {
  if (ratio < 0.5) return '軸力は低めです。0.6〜0.8 程度を目安に再確認してください。';
  if (ratio <= 0.8) return '推奨範囲です。';
  if (ratio <= 1.0) return '高めです。締付け条件を再確認してください。';
  return '耐力超過の恐れがあります。条件を見直してください。';
}

function formatValue(value?: number | null): string {
  if (value == null || !Number.isFinite(value)) return '-';
  return value.toFixed(3).replace(/\.?0+$/, '');
}
