import type { FormulaStep } from '@/lib/engHistory';
import { BOLT_CALC_SPECS, type Diameter } from './specs';

export interface BoltEffectiveThreadInput {
  diameter: Diameter;
  plateThicknessMm: number;
  nutCount: number;
  plainWasherCount: number;
  springWasherCount: number;
}

export interface BoltEffectiveThreadResult {
  diameter: Diameter;
  nominalDiameterMm: number;
  pitchMm: number;
  gripLengthMm: number;
  engagedThreadLengthMm: number;
  minimumEngagementMm: number;
  requiredThreadLengthMm: number;
  threadProjectionMm: number;
  engagementOk: boolean;
  steps: FormulaStep[];
}

export function calculateBoltEffectiveThread(input: BoltEffectiveThreadInput): BoltEffectiveThreadResult {
  const spec = BOLT_CALC_SPECS[input.diameter];
  const nominalDiameterMm = Number(input.diameter.replace('M', ''));
  const washerStackMm = input.plainWasherCount * spec.Hpw + input.springWasherCount * spec.Hsw;
  const gripLengthMm = input.plateThicknessMm + washerStackMm;
  const engagedThreadLengthMm = input.nutCount * spec.Hnut;
  const minimumEngagementMm = nominalDiameterMm * 0.8;
  const threadProjectionMm = 3 * spec.p;
  const requiredThreadLengthMm = gripLengthMm + engagedThreadLengthMm + threadProjectionMm;
  const engagementOk = engagedThreadLengthMm >= minimumEngagementMm;

  return {
    diameter: input.diameter,
    nominalDiameterMm,
    pitchMm: spec.p,
    gripLengthMm,
    engagedThreadLengthMm,
    minimumEngagementMm,
    requiredThreadLengthMm,
    threadProjectionMm,
    engagementOk,
    steps: [
      {
        label: 'グリップ長',
        expr: `Lgrip = t + PW×Hpw + SW×Hsw = ${input.plateThicknessMm.toFixed(1)} + ${input.plainWasherCount}×${spec.Hpw.toFixed(1)} + ${input.springWasherCount}×${spec.Hsw.toFixed(1)} = ${gripLengthMm.toFixed(2)} mm`,
      },
      {
        label: 'かみ合い長',
        expr: `Le = N×Hnut = ${input.nutCount}×${spec.Hnut.toFixed(1)} = ${engagedThreadLengthMm.toFixed(2)} mm`,
      },
      {
        label: '必要かみ合い長の目安',
        expr: `Le,min = 0.8d = 0.8×${nominalDiameterMm.toFixed(1)} = ${minimumEngagementMm.toFixed(2)} mm`,
      },
      {
        label: '必要ねじ長さ',
        expr: `Lthread = Lgrip + Le + 3p = ${gripLengthMm.toFixed(2)} + ${engagedThreadLengthMm.toFixed(2)} + ${threadProjectionMm.toFixed(2)} = ${requiredThreadLengthMm.toFixed(2)} mm`,
      },
    ],
  };
}
