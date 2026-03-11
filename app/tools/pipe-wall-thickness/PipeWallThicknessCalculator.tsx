'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  addEngHistoryEntry,
  type EngHistoryEntry,
} from '@/lib/engHistory';
import { printEngReport } from '@/lib/printReport';
import { trackToolCalculate } from '@/lib/analytics/events';
import {
  calculatePipeThickness,
  validatePipeThicknessInput,
} from '@/lib/piping/wallThickness';
import ToolWorkbenchHeader from '@/app/components/ToolWorkbenchHeader';
import AdSenseBlock from '@/app/components/AdSenseBlock';

function fmt(value: number | undefined, digits = 3): string {
  if (value == null || !Number.isFinite(value)) return '-';
  return value.toLocaleString('ja-JP', { maximumFractionDigits: digits });
}

export default function PipeWallThicknessCalculator() {
  const [pressure, setPressure] = useState('980');
  const [diameter, setDiameter] = useState('114.3');
  const [yieldStress, setYieldStress] = useState('235');
  const [designFactor, setDesignFactor] = useState('0.72');
  const [efficiency, setEfficiency] = useState('1');
  const [allowance, setAllowance] = useState('1');
  const [purpose, setPurpose] = useState('');
  const [lastEntry, setLastEntry] = useState<EngHistoryEntry | null>(null);
  const [committed, setCommitted] = useState<ReturnType<typeof calculatePipeThickness> | null>(null);

  const parsed = useMemo(
    () => ({
      pressure_kPa: parseFloat(pressure),
      outerDiameter_mm: parseFloat(diameter),
      yieldStress_MPa: parseFloat(yieldStress),
      designFactor: parseFloat(designFactor),
      jointEfficiency: parseFloat(efficiency),
      corrosionAllowance_mm: parseFloat(allowance),
    }),
    [allowance, designFactor, diameter, efficiency, pressure, yieldStress],
  );

  const errors = useMemo(() => validatePipeThicknessInput(parsed), [parsed]);

  function handleCalculate() {
    if (errors.length > 0) return;
    const result = calculatePipeThickness(parsed);
    const entry = addEngHistoryEntry({
      toolId: 'pipe-wall-thickness',
      toolName: '配管肉厚計算',
      inputs: {
        material: '',
        purpose: purpose.trim() || undefined,
        shapeKey: 'pipe',
        shapeName: '配管',
        dims: {
          '設計圧力 P': `${pressure} kPa`,
          '外径 D': `${diameter} mm`,
          '最小降伏応力 S': `${yieldStress} MPa`,
          '設計係数 F': designFactor,
          '溶接効率 E': efficiency,
          '腐食余裕 A': `${allowance} mm`,
        },
        rawDims: parsed,
      },
      results: {
        requiredThickness_mm: result.requiredThickness_mm,
        nominalThickness_mm: result.nominalThickness_mm,
        thicknessRatio: result.thicknessRatio,
        safetyFactor: result.safetyFactor,
        pressure_kPa: parsed.pressure_kPa,
      },
      formulaSteps: result.formulaSteps,
    });
    setCommitted(result);
    setLastEntry(entry);
    trackToolCalculate({ toolId: 'pipe-wall-thickness', category: '配管' });
  }

  return (
    <div className="section-prop-wrap">
      <section className="tool-workbench" aria-label="配管肉厚計算の入力条件">
        <div className="tool-workbench__section">
          <ToolWorkbenchHeader title="入力条件" />
          <div className="beam-section">
            <h2 className="beam-section-title">① 圧力・寸法</h2>
            <div className="section-inputs-box section-properties-form">
              <Field label="設計圧力 P [kPa]" value={pressure} onChange={setPressure} />
              <Field label="外径 D [mm]" value={diameter} onChange={setDiameter} />
              <Field label="最小降伏応力 S [MPa]" value={yieldStress} onChange={setYieldStress} />
              <Field label="設計係数 F" value={designFactor} onChange={setDesignFactor} />
              <Field label="溶接効率 E" value={efficiency} onChange={setEfficiency} />
              <Field label="腐食余裕 A [mm]" value={allowance} onChange={setAllowance} />
              <div className="form-group section-properties-form__purpose">
                <label htmlFor="pipe-purpose">用途メモ（任意）</label>
                <input id="pipe-purpose" type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
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
                  <ResultRow label="必要肉厚 t" value={`${fmt(committed.requiredThickness_mm, 3)} mm`} />
                  <ResultRow label="名目肉厚 t_n" value={`${fmt(committed.nominalThickness_mm, 3)} mm`} />
                  <ResultRow label="肉厚比 t/D" value={fmt(committed.thicknessRatio, 5)} />
                  <ResultRow label="安全率" value={fmt(committed.safetyFactor, 3)} />
                </tbody>
              </table>
            </div>
            <p className="beam-note" style={{ marginTop: '1rem' }}>
              <Link href="/articles/steel-material-properties">配管スケジュール表を確認する前提記事へ</Link>
            </p>
          </div>
          <div className="beam-section">
            <h2 className="beam-section-title">計算式</h2>
            {committed.formulaSteps.map((step) => (
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
