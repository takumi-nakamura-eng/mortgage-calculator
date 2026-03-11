'use client';

import { useMemo, useState } from 'react';
import {
  addEngHistoryEntry,
  type EngHistoryEntry,
} from '@/lib/engHistory';
import { printEngReport } from '@/lib/printReport';
import { trackToolCalculate } from '@/lib/analytics/events';
import {
  calculateWeldStrength,
  validateWeldStrengthInput,
  type WeldJointType,
  type WeldStrengthMode,
} from '@/lib/welding/strength';
import ToolWorkbenchHeader from '@/app/components/ToolWorkbenchHeader';
import AdSenseBlock from '@/app/components/AdSenseBlock';

function fmt(value: number | null | undefined, digits = 3): string {
  if (value == null || !Number.isFinite(value)) return '-';
  return value.toLocaleString('ja-JP', { maximumFractionDigits: digits });
}

export default function WeldStrengthCalculator() {
  const [jointType, setJointType] = useState<WeldJointType>('fillet');
  const [mode, setMode] = useState<WeldStrengthMode>('required-length');
  const [weldSize, setWeldSize] = useState('6');
  const [throatThickness, setThroatThickness] = useState('6');
  const [allowableStress, setAllowableStress] = useState('120');
  const [designLoad, setDesignLoad] = useState('25');
  const [weldLength, setWeldLength] = useState('120');
  const [weldCount, setWeldCount] = useState('2');
  const [purpose, setPurpose] = useState('');
  const [lastEntry, setLastEntry] = useState<EngHistoryEntry | null>(null);
  const [committed, setCommitted] = useState<{
    mode: WeldStrengthMode;
    result: ReturnType<typeof calculateWeldStrength>;
  } | null>(null);

  const parsed = useMemo(
    () => ({
      jointType,
      mode,
      weldSize_mm: parseFloat(weldSize),
      throatThickness_mm: parseFloat(throatThickness),
      allowableStress_MPa: parseFloat(allowableStress),
      designLoad_kN: parseFloat(designLoad),
      weldLength_mm: parseFloat(weldLength),
      weldCount: parseFloat(weldCount),
    }),
    [allowableStress, designLoad, jointType, mode, throatThickness, weldCount, weldLength, weldSize],
  );

  const errors = useMemo(() => validateWeldStrengthInput(parsed), [parsed]);

  function handleCalculate() {
    if (errors.length > 0) return;
    const result = calculateWeldStrength(parsed);
    const entry = addEngHistoryEntry({
      toolId: 'weld-strength',
      toolName: '溶接強度計算',
      inputs: {
        material: '',
        purpose: purpose.trim() || undefined,
        shapeKey: parsed.jointType,
        shapeName: parsed.jointType === 'fillet' ? '隅肉溶接' : '突合せ溶接',
        dims: {
          接合形式: parsed.jointType === 'fillet' ? '隅肉溶接' : '突合せ溶接',
          入力モード: parsed.mode === 'required-length' ? '荷重→必要溶接長さ' : '溶接長さ→許容荷重',
          ...(parsed.jointType === 'fillet'
            ? { '脚長 a': `${weldSize} mm` }
            : { 'のど厚 t': `${throatThickness} mm` }),
          '許容溶接応力': `${allowableStress} MPa`,
          ...(parsed.mode === 'required-length'
            ? { '設計荷重 F': `${designLoad} kN` }
            : { '溶接長さ l': `${weldLength} mm` }),
          '溶接本数 n': weldCount,
        },
        rawDims: {
          weldSize_mm: parsed.weldSize_mm ?? 0,
          throatThickness_mm: parsed.throatThickness_mm ?? 0,
          allowableStress_MPa: parsed.allowableStress_MPa,
          designLoad_kN: parsed.designLoad_kN ?? 0,
          weldLength_mm: parsed.weldLength_mm ?? 0,
          weldCount: parsed.weldCount,
        },
        mode: parsed.mode,
      },
      results: {
        requiredLength_mm: result.requiredLength_mm ?? undefined,
        allowableLoad_kN: result.allowableLoad_kN ?? undefined,
        actualStress_MPa: result.actualStress_MPa ?? undefined,
        safetyFactor: result.safetyFactor ?? undefined,
        effectiveArea_mm2: result.effectiveArea_mm2,
      },
      formulaSteps: result.formulaSteps,
    });
    setCommitted({ mode: parsed.mode, result });
    setLastEntry(entry);
    trackToolCalculate({ toolId: 'weld-strength', category: '溶接' });
  }

  return (
    <div className="section-prop-wrap">
      <section className="tool-workbench" aria-label="溶接強度計算の入力条件">
        <div className="tool-workbench__section">
          <ToolWorkbenchHeader title="入力条件" />

          <div className="beam-section">
            <h2 className="beam-section-title">① 接合形式</h2>
            <div className="section-shape-tabs">
              {(['fillet', 'butt'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`section-shape-tab${jointType === value ? ' section-shape-tab--active' : ''}`}
                  onClick={() => setJointType(value)}
                >
                  {value === 'fillet' ? 'フィレット溶接' : '突合せ溶接'}
                </button>
              ))}
            </div>
          </div>

          <div className="beam-section">
            <h2 className="beam-section-title">② 計算モード</h2>
            <div className="section-shape-tabs">
              {(['required-length', 'allowable-load'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`section-shape-tab${mode === value ? ' section-shape-tab--active' : ''}`}
                  onClick={() => setMode(value)}
                >
                  {value === 'required-length' ? '荷重から必要溶接長さ' : '溶接長さから許容荷重'}
                </button>
              ))}
            </div>
          </div>

          <div className="beam-section">
            <h2 className="beam-section-title">③ 入力</h2>
            <div className="section-inputs-box section-properties-form">
              {jointType === 'fillet' ? (
                <Field label="脚長 a [mm]" value={weldSize} onChange={setWeldSize} />
              ) : (
                <Field label="のど厚 t [mm]" value={throatThickness} onChange={setThroatThickness} />
              )}
              <Field label="許容溶接応力 σ_allow [MPa]" value={allowableStress} onChange={setAllowableStress} />
              {mode === 'required-length' ? (
                <Field label="設計荷重 F [kN]" value={designLoad} onChange={setDesignLoad} />
              ) : (
                <Field label="設計溶接長さ l [mm]" value={weldLength} onChange={setWeldLength} />
              )}
              <Field label="溶接本数 n" value={weldCount} onChange={setWeldCount} />
              <div className="form-group section-properties-form__purpose">
                <label htmlFor="weld-purpose">用途メモ（任意）</label>
                <input id="weld-purpose" type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
              </div>
              {errors.map((error) => (
                <p key={error} className="error-message">{error}</p>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button type="button" className="calc-btn" disabled={errors.length > 0} onClick={handleCalculate}>
              計算する
            </button>
          </div>
        </div>
      </section>

      {committed ? (
        <>
          <div className="beam-section section-results">
            <div className="section-results-header">
              <h2 className="beam-section-title" style={{ margin: 0 }}>計算結果</h2>
              <button type="button" className="pdf-btn" onClick={() => lastEntry && printEngReport(lastEntry)}>
                PDF出力
              </button>
            </div>
            <div className="beam-result-table-wrap">
              <table className="beam-result-table">
                <tbody>
                  <ResultRow label="有効のど厚 t" value={`${fmt(committed.result.throatThickness_mm, 3)} mm`} />
                  <ResultRow label="断面積" value={`${fmt(committed.result.effectiveArea_mm2, 2)} mm²`} />
                  <ResultRow
                    label={committed.mode === 'required-length' ? '必要溶接長さ' : '許容荷重'}
                    value={
                      committed.mode === 'required-length'
                        ? `${fmt(committed.result.requiredLength_mm, 2)} mm`
                        : `${fmt(committed.result.allowableLoad_kN, 3)} kN`
                    }
                  />
                  <ResultRow label="実効応力" value={`${fmt(committed.result.actualStress_MPa, 2)} MPa`} />
                  <ResultRow label="安全率" value={fmt(committed.result.safetyFactor, 3)} />
                </tbody>
              </table>
            </div>
          </div>
          <div className="beam-section">
            <h2 className="beam-section-title">計算式</h2>
            {committed.result.formulaSteps.map((step) => (
              <div key={step.label} className="formula-block">
                <p className="formula-block__label">{step.label}</p>
                <pre className="formula-block__expr">{step.expr}</pre>
              </div>
            ))}
          </div>
          <AdSenseBlock slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL} className="tool-ad" pageType="tool" />
        </>
      ) : null}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="form-group section-properties-form__field">
      <label>{label}</label>
      <input type="number" min="0" step="any" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <th>{label}</th>
      <td className="val">{value}</td>
    </tr>
  );
}
