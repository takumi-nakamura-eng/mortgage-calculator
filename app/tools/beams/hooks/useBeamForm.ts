'use client';

import { useCallback, useMemo, useState } from 'react';
import { validateBeamInputs, type BeamResult, type LoadCase } from '@/lib/beams/simpleBeam';
import { GPaToMPa, cm3ToMm3, cm4ToMm4, fmt, kNToKg, kgToKN } from '@/lib/beams/units';
import { calcSection, SECTION_DEFS, type SectionShape, validateSectionDims } from '@/lib/beams/sections';
import { addEngHistoryEntry, type EngHistoryEntry, type FormulaStep } from '@/lib/engHistory';
import { trackToolCalculate } from '@/lib/analytics/events';

export const MATERIAL_PRESETS = [
  { label: '炭素鋼（SS400 相当）', E_GPa: 205, sigmaAllow_MPa: 150 },
  { label: 'SUS304', E_GPa: 193, sigmaAllow_MPa: 130 },
  { label: 'アルミ（参考）', E_GPa: 69, sigmaAllow_MPa: 80 },
  { label: 'カスタム', E_GPa: null, sigmaAllow_MPa: null },
] as const;

export type LoadUnit = 'kg' | 'kN';
export type ZUnit = 'cm3' | 'mm3';
export type IUnit = 'cm4' | 'mm4';
export type SectionMode = 'shape' | 'direct';

type UseBeamFormOptions<TStep extends FormulaStep> = {
  defaultDeflectionN: number;
  toolId: 'simple-beam' | 'cantilever';
  toolName: string;
  analyticsToolId: string;
  calculateBeam: (params: {
    L: number;
    loadCase: LoadCase;
    loadN: number;
    E: number;
    I: number;
    Z: number;
    sigmaAllow: number;
    deflectionLimitN: number;
  }) => BeamResult;
  buildFormulaSteps: (params: {
    loadCase: LoadCase;
    loadKN: number;
    L_mm: number;
    E_GPa: number;
    I_mm4: number;
    Z_mm3: number;
    sigmaAllow: number;
    deflectionLimitN: number;
    result: BeamResult;
  }) => TStep[];
};

export function useBeamForm<TStep extends FormulaStep>(options: UseBeamFormOptions<TStep>) {
  const [materialIdx, setMaterialIdx] = useState(0);
  const [E_GPa, setE_GPa] = useState<string>('205');
  const [sigmaAllow, setSigmaAllow] = useState<string>('150');
  const isCustomMaterial = materialIdx === 3;

  const [L, setL] = useState<string>('');
  const [loadCase, setLoadCase] = useState<LoadCase>('center');
  const [loadValue, setLoadValue] = useState<string>('');
  const [loadUnit, setLoadUnit] = useState<LoadUnit>('kg');

  const [sectionMode, setSectionMode] = useState<SectionMode>('shape');
  const [Z, setZ] = useState<string>('');
  const [ZUnit, setZUnit] = useState<ZUnit>('cm3');
  const [I, setI] = useState<string>('');
  const [IUnit, setIUnit] = useState<IUnit>('cm4');

  const [selectedShape, setSelectedShape] = useState<SectionShape>('H');
  const [shapeDims, setShapeDims] = useState<Record<string, string>>({});

  const [deflectionNStr, setDeflectionNStr] = useState<string>(String(options.defaultDeflectionN));
  const deflectionN = (() => {
    const n = parseInt(deflectionNStr, 10);
    return isNaN(n) || n <= 0 ? options.defaultDeflectionN : n;
  })();

  const [purpose, setPurpose] = useState<string>('');
  const [result, setResult] = useState<BeamResult | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formWarnings, setFormWarnings] = useState<string[]>([]);
  const [loadKNNormalized, setLoadKNNormalized] = useState<number | null>(null);
  const [lastEntry, setLastEntry] = useState<EngHistoryEntry | null>(null);
  const [formulaSteps, setFormulaSteps] = useState<TStep[]>([]);

  const shapeResult = useMemo(() => {
    if (sectionMode !== 'shape') return null;
    const def = SECTION_DEFS.find((d) => d.shape === selectedShape);
    if (!def) return null;
    const nums: Record<string, number> = {};
    for (const p of def.params) {
      const v = parseFloat(shapeDims[p.key] ?? '');
      if (isNaN(v) || v <= 0) return null;
      nums[p.key] = v;
    }
    if (validateSectionDims(selectedShape, nums).length > 0) return null;
    return calcSection(selectedShape, nums);
  }, [sectionMode, selectedShape, shapeDims]);

  const shapeErrors = useMemo(() => {
    if (sectionMode !== 'shape') return [];
    const def = SECTION_DEFS.find((d) => d.shape === selectedShape);
    if (!def) return [];
    const nums: Record<string, number> = {};
    let hasAnyInput = false;
    for (const p of def.params) {
      const v = parseFloat(shapeDims[p.key] ?? '');
      if (!isNaN(v)) hasAnyInput = true;
      nums[p.key] = v;
    }
    if (!hasAnyInput) return [];
    return validateSectionDims(selectedShape, nums);
  }, [sectionMode, selectedShape, shapeDims]);

  function handleMaterialChange(idx: number) {
    setMaterialIdx(idx);
    const preset = MATERIAL_PRESETS[idx];
    if (preset.E_GPa !== null) setE_GPa(String(preset.E_GPa));
    if (preset.sigmaAllow_MPa !== null) setSigmaAllow(String(preset.sigmaAllow_MPa));
  }

  const handleLoadUnitChange = useCallback((newUnit: LoadUnit) => {
    if (newUnit === loadUnit) return;
    const v = parseFloat(loadValue);
    if (!isNaN(v) && v > 0) {
      setLoadValue(newUnit === 'kN' ? fmt(kgToKN(v), 4) : fmt(kNToKg(v), 2));
    }
    setLoadUnit(newUnit);
  }, [loadUnit, loadValue]);

  const handleZUnitChange = useCallback((newUnit: ZUnit) => {
    if (newUnit === ZUnit) return;
    const v = parseFloat(Z);
    if (!isNaN(v) && v > 0) {
      setZ(newUnit === 'mm3' ? fmt(v * 1000, 4) : fmt(v / 1000, 6));
    }
    setZUnit(newUnit);
  }, [ZUnit, Z]);

  const handleIUnitChange = useCallback((newUnit: IUnit) => {
    if (newUnit === IUnit) return;
    const v = parseFloat(I);
    if (!isNaN(v) && v > 0) {
      setI(newUnit === 'mm4' ? fmt(v * 10000, 4) : fmt(v / 10000, 6));
    }
    setIUnit(newUnit);
  }, [IUnit, I]);

  function handleSectionModeChange(mode: SectionMode) {
    setSectionMode(mode);
    setResult(null);
    setFormErrors({});
    setLastEntry(null);
    setFormulaSteps([]);
  }

  function handleShapeChange(shape: SectionShape) {
    setSelectedShape(shape);
    setShapeDims({});
    setResult(null);
    setLastEntry(null);
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = {};
    const warnings: string[] = [];

    const L_mm = parseFloat(L);
    const loadRaw = parseFloat(loadValue);
    const loadKN = isNaN(loadRaw) ? null : loadUnit === 'kg' ? kgToKN(loadRaw) : loadRaw;
    const E_GPa_num = parseFloat(E_GPa);
    const E_MPa = isNaN(E_GPa_num) ? null : GPaToMPa(E_GPa_num);
    const sigmaNum = parseFloat(sigmaAllow);

    let I_mm4: number | null = null;
    let Z_mm3: number | null = null;

    if (sectionMode === 'direct') {
      const Z_raw = parseFloat(Z);
      Z_mm3 = isNaN(Z_raw) ? null : ZUnit === 'cm3' ? cm3ToMm3(Z_raw) : Z_raw;
      const I_raw = parseFloat(I);
      I_mm4 = isNaN(I_raw) ? null : IUnit === 'cm4' ? cm4ToMm4(I_raw) : I_raw;
    } else if (!shapeResult) {
      errors.section = '断面寸法を正しく入力してください。';
    } else {
      I_mm4 = shapeResult.I_mm4;
      Z_mm3 = shapeResult.Z_mm3;
    }

    if (isNaN(deflectionN) || deflectionN <= 0) {
      errors.deflection = '許容たわみ基準に正の整数を入力してください。';
    }

    const validation = validateBeamInputs(
      isNaN(L_mm) ? null : L_mm,
      loadKN,
      E_MPa,
      I_mm4,
      Z_mm3,
      isNaN(sigmaNum) ? null : sigmaNum,
    );

    for (const err of validation.errors) errors[err.field] = err.message;
    for (const w of validation.warnings) warnings.push(w.message);

    setFormErrors(errors);
    setFormWarnings(warnings);

    if (Object.keys(errors).length > 0) {
      setResult(null);
      setLoadKNNormalized(null);
      setLastEntry(null);
      setFormulaSteps([]);
      return;
    }

    const res = options.calculateBeam({
      L: L_mm,
      loadCase,
      loadN: loadKN! * 1000,
      E: E_MPa!,
      I: I_mm4!,
      Z: Z_mm3!,
      sigmaAllow: sigmaNum,
      deflectionLimitN: deflectionN,
    });

    setResult(res);
    setLoadKNNormalized(loadKN!);

    const steps = options.buildFormulaSteps({
      loadCase,
      loadKN: loadKN!,
      L_mm,
      E_GPa: E_GPa_num,
      I_mm4: I_mm4!,
      Z_mm3: Z_mm3!,
      sigmaAllow: sigmaNum,
      deflectionLimitN: deflectionN,
      result: res,
    });
    setFormulaSteps(steps);

    const currentShapeDef = SECTION_DEFS.find((d) => d.shape === selectedShape)!;
    const materialLabel = MATERIAL_PRESETS[materialIdx].label;

    const dimMap: Record<string, string> = {};
    if (sectionMode === 'shape') {
      for (const p of currentShapeDef.params) {
        const v = shapeDims[p.key] ?? '';
        if (v) dimMap[p.label] = `${v} ${p.unit}`;
      }
    }

    const rawDimsMap: Record<string, number> = {};
    if (sectionMode === 'shape') {
      for (const p of currentShapeDef.params) {
        const v = parseFloat(shapeDims[p.key] ?? '');
        if (!isNaN(v)) rawDimsMap[p.key] = v;
      }
    }

    const loadDisplayStr = loadUnit === 'kg'
      ? `${parseFloat(loadValue).toLocaleString('ja-JP')} kg = ${fmt(loadKN!, 3)} kN`
      : `${fmt(loadKN!, 3)} kN`;

    const entry = addEngHistoryEntry({
      toolId: options.toolId,
      toolName: options.toolName,
      inputs: {
        material: materialLabel,
        purpose: purpose.trim() || undefined,
        shapeKey: sectionMode === 'shape' ? selectedShape : '',
        shapeName: sectionMode === 'shape' ? currentShapeDef.label : '直接入力',
        dims: dimMap,
        rawDims: rawDimsMap,
        loadCase,
        loadKN: loadKN!,
        loadDisplayStr,
        L_mm,
        E_GPa: E_GPa_num,
        sigmaAllow_MPa: sigmaNum,
        deflectionLimitN: deflectionN,
        sectionMode,
        I_mm4_input: sectionMode === 'direct' ? I_mm4! : undefined,
        Z_mm3_input: sectionMode === 'direct' ? Z_mm3! : undefined,
      },
      results: {
        Mmax_kNm: res.Mmax_kNm,
        sigmaMax_MPa: res.sigmaMax,
        stressOK: res.stressOK,
        deltaMax_mm: res.deltaMax,
        deltaAllow_mm: res.deltaAllow,
        deflectionOK: res.deflectionOK,
      },
      formulaSteps: steps,
    });
    setLastEntry(entry);
    trackToolCalculate({ toolId: options.analyticsToolId, category: '梁・断面' });
  }

  const loadKNDisplay =
    loadValue && !isNaN(parseFloat(loadValue))
      ? loadUnit === 'kg'
        ? fmt(kgToKN(parseFloat(loadValue)), 2)
        : fmt(parseFloat(loadValue), 2)
      : null;

  const wDisplay =
    loadKNDisplay && L && !isNaN(parseFloat(L)) && parseFloat(L) > 0
      ? fmt(parseFloat(loadKNDisplay) / parseFloat(L), 6)
      : null;

  const wKNperMDisplay = wDisplay ? fmt(parseFloat(wDisplay) * 1000, 4) : null;

  return {
    materialIdx,
    E_GPa,
    sigmaAllow,
    isCustomMaterial,
    L,
    loadCase,
    loadValue,
    loadUnit,
    sectionMode,
    Z,
    ZUnit,
    I,
    IUnit,
    selectedShape,
    shapeDims,
    deflectionNStr,
    deflectionN,
    purpose,
    result,
    formErrors,
    formWarnings,
    loadKNNormalized,
    lastEntry,
    formulaSteps,
    shapeResult,
    shapeErrors,
    loadKNDisplay,
    wDisplay,
    wKNperMDisplay,
    currentShapeDef: SECTION_DEFS.find((d) => d.shape === selectedShape)!,
    setE_GPa,
    setSigmaAllow,
    setL,
    setLoadCase,
    setLoadValue,
    setZ,
    setI,
    setShapeDims,
    setDeflectionNStr,
    setPurpose,
    setFormulaSteps,
    setLastEntry,
    handleMaterialChange,
    handleLoadUnitChange,
    handleZUnitChange,
    handleIUnitChange,
    handleSectionModeChange,
    handleShapeChange,
    handleCalculate,
  };
}
