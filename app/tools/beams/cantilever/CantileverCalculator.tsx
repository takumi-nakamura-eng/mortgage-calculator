'use client';

import { useState } from 'react';
import { addEngHistoryEntry, type EngHistoryEntry, type FormulaStep } from '@/lib/engHistory';
import { trackToolCalculate } from '@/lib/analytics/events';
import { buildCantileverFormulaSteps } from '@/lib/beams/cantileverFormulas';
import { calcCantileverBeam } from '@/lib/beams/cantileverBeam';
import { validateBeamInputs, type BeamResult } from '@/lib/beams/simpleBeam';
import { cm3ToMm3, cm4ToMm4, fmt, GPaToMPa, kgToKN } from '@/lib/beams/units';
import { BEAM_MATERIAL_PRESETS } from '@/lib/materialPresets';
import BeamCalculatorLayout from '../BeamCalculatorLayout';
import { useBeamForm } from '../useBeamForm';

export default function CantileverCalculator() {
  const { state: form, actions } = useBeamForm(200);
  const [result, setResult] = useState<BeamResult | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formWarnings, setFormWarnings] = useState<string[]>([]);
  const [loadKNNormalized, setLoadKNNormalized] = useState<number | null>(null);
  const [lastEntry, setLastEntry] = useState<EngHistoryEntry | null>(null);
  const [formulaSteps, setFormulaSteps] = useState<FormulaStep[]>([]);

  function clearCalculatedState() {
    setResult(null);
    setFormErrors({});
    setFormWarnings([]);
    setLoadKNNormalized(null);
    setLastEntry(null);
    setFormulaSteps([]);
  }

  function handleCalculate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors: Record<string, string> = {};
    const warnings: string[] = [];
    const L_mm = parseFloat(form.L);
    const loadRaw = parseFloat(form.loadValue);
    const loadKN = Number.isNaN(loadRaw)
      ? null
      : form.loadUnit === 'kg' ? kgToKN(loadRaw) : loadRaw;
    const E_GPa_num = parseFloat(form.E_GPa);
    const E_MPa = Number.isNaN(E_GPa_num) ? null : GPaToMPa(E_GPa_num);
    const sigmaNum = parseFloat(form.sigmaAllow);

    let I_mm4: number | null = null;
    let Z_mm3: number | null = null;

    if (form.sectionMode === 'direct') {
      const Z_raw = parseFloat(form.Z);
      Z_mm3 = Number.isNaN(Z_raw) ? null : form.ZUnit === 'cm3' ? cm3ToMm3(Z_raw) : Z_raw;
      const I_raw = parseFloat(form.I);
      I_mm4 = Number.isNaN(I_raw) ? null : form.IUnit === 'cm4' ? cm4ToMm4(I_raw) : I_raw;
    } else if (!form.shapeResult) {
      errors.section = '断面寸法を正しく入力してください。';
    } else {
      I_mm4 = form.shapeResult.I_mm4;
      Z_mm3 = form.shapeResult.Z_mm3;
    }

    if (Number.isNaN(form.deflectionN) || form.deflectionN <= 0) {
      errors.deflection = '許容たわみ基準に正の整数を入力してください。';
    }

    const validation = validateBeamInputs(
      Number.isNaN(L_mm) ? null : L_mm,
      loadKN,
      E_MPa,
      I_mm4,
      Z_mm3,
      Number.isNaN(sigmaNum) ? null : sigmaNum,
    );

    for (const validationError of validation.errors) errors[validationError.field] = validationError.message;
    for (const warning of validation.warnings) warnings.push(warning.message);

    setFormErrors(errors);
    setFormWarnings(warnings);

    if (Object.keys(errors).length > 0) {
      setResult(null);
      setLoadKNNormalized(null);
      setLastEntry(null);
      setFormulaSteps([]);
      return;
    }

    const calculated = calcCantileverBeam({
      L: L_mm,
      loadCase: form.loadCase,
      loadN: loadKN! * 1000,
      E: E_MPa!,
      I: I_mm4!,
      Z: Z_mm3!,
      sigmaAllow: sigmaNum,
      deflectionLimitN: form.deflectionN,
    });

    setResult(calculated);
    setLoadKNNormalized(loadKN!);

    const steps = buildCantileverFormulaSteps({
      loadCase: form.loadCase,
      loadKN: loadKN!,
      L_mm,
      E_GPa: E_GPa_num,
      I_mm4: I_mm4!,
      Z_mm3: Z_mm3!,
      sigmaAllow: sigmaNum,
      deflectionLimitN: form.deflectionN,
      result: calculated,
    });
    setFormulaSteps(steps);

    const dimMap: Record<string, string> = {};
    const rawDimsMap: Record<string, number> = {};
    if (form.sectionMode === 'shape') {
      for (const param of form.currentShapeDef.params) {
        const value = form.shapeDims[param.key] ?? '';
        if (value) dimMap[param.label] = `${value} ${param.unit}`;
        const rawValue = parseFloat(form.shapeDims[param.key] ?? '');
        if (!Number.isNaN(rawValue)) rawDimsMap[param.key] = rawValue;
      }
    }

    const loadDisplayStr = form.loadUnit === 'kg'
      ? `${parseFloat(form.loadValue).toLocaleString('ja-JP')} kg = ${fmt(loadKN!, 3)} kN`
      : `${fmt(loadKN!, 3)} kN`;

    const entry = addEngHistoryEntry({
      toolId: 'cantilever',
      toolName: '片持ち梁計算',
      inputs: {
        material: BEAM_MATERIAL_PRESETS[form.materialIdx].label,
        purpose: form.purpose.trim() || undefined,
        shapeKey: form.sectionMode === 'shape' ? form.selectedShape : '',
        shapeName: form.sectionMode === 'shape' ? form.currentShapeDef.label : '直接入力',
        dims: dimMap,
        rawDims: rawDimsMap,
        loadCase: form.loadCase,
        loadKN: loadKN!,
        loadDisplayStr,
        L_mm,
        E_GPa: E_GPa_num,
        sigmaAllow_MPa: sigmaNum,
        deflectionLimitN: form.deflectionN,
        sectionMode: form.sectionMode,
        I_mm4_input: form.sectionMode === 'direct' ? I_mm4! : undefined,
        Z_mm3_input: form.sectionMode === 'direct' ? Z_mm3! : undefined,
      },
      results: {
        Mmax_kNm: calculated.Mmax_kNm,
        sigmaMax_MPa: calculated.sigmaMax,
        stressOK: calculated.stressOK,
        deltaMax_mm: calculated.deltaMax,
        deltaAllow_mm: calculated.deltaAllow,
        deflectionOK: calculated.deflectionOK,
      },
      formulaSteps: steps,
    });

    setLastEntry(entry);
    trackToolCalculate({ toolId: 'cantilever', category: '梁・断面' });
  }

  return (
    <BeamCalculatorLayout
      form={form}
      actions={actions}
      formErrors={formErrors}
      formWarnings={formWarnings}
      result={result}
      loadKNNormalized={loadKNNormalized}
      lastEntry={lastEntry}
      formulaSteps={formulaSteps}
      text={{
        spanSectionTitle: '② スパン（片持ち長さ）',
        spanPlaceholder: '例: 1000',
        centerLoadButtonLabel: '先端集中荷重',
        centerLoadInputLabel: '集中荷重 P',
        loadPlaceholder: { kg: '例: 500', kN: '例: 4.9' },
        deflectionExample: '例: 200 → L/200',
        deflectionPlaceholder: '200',
        deflectionReferenceTitle: '📖 参考：片持ち梁の許容たわみ目安',
        deflectionReferenceItems: [
          <><strong>L/150〜L/200</strong>：一般的な庇・ブラケットの目安</>,
          <><strong>L/250</strong>：仕上げ材のある片持ち梁（変形による影響を考慮）</>,
          <><strong>L/300〜L/400</strong>：精密機器架台・先端にセンサー等がある用途</>,
        ],
        deflectionReferenceNote: '※ 片持ち梁は単純梁よりたわみが大きいため、許容基準をやや緩めに設定することが一般的です。最終判断は必ず設計者が適用規準を確認してください。',
        purposePlaceholder: '例：庇ブラケット先端荷重検討',
        resultLoadCaseLabel: {
          center: '先端集中荷重',
          uniform: '等分布荷重（総荷重入力）',
        },
        resultMomentLabel: '最大曲げモーメント M_max（固定端）',
        resultDeflectionLabel: '最大たわみ δ_max（自由端）',
        notes: [
          '片持ち梁は固定端の剛性が計算通りであることが前提です。実際の溶接・ボルト接合では固定度が100%でない場合があります。',
          '梁の自重（等分布荷重相当）は本ツールでは考慮していません。',
          '断面形状から計算する場合、角部の丸み（フィレット半径）は非考慮のため、JIS 規格品の断面性能表と若干異なる場合があります。',
          '計算結果は参考値です。最終判断は設計基準・仕様書・専門家にご確認ください。',
        ],
      }}
      onSubmit={handleCalculate}
      onLoadCaseChange={(loadCase) => {
        actions.setLoadCase(loadCase);
        actions.setLoadValue('');
      }}
      onSectionModeChange={(mode) => {
        actions.handleSectionModeChange(mode);
        clearCalculatedState();
      }}
      onShapeChange={(shape) => {
        actions.handleShapeChange(shape);
        clearCalculatedState();
      }}
    />
  );
}
