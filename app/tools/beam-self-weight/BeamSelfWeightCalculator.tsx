'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  addEngHistoryEntry,
  type EngHistoryEntry,
} from '@/lib/engHistory';
import { printEngReport } from '@/lib/printReport';
import { trackToolCalculate } from '@/lib/analytics/events';
import {
  calculateBeamSelfWeight,
  getBeamSelfWeightShapes,
  validateBeamSelfWeightInput,
} from '@/lib/beams/selfWeight';
import { SECTION_DEFS, type SectionShape } from '@/lib/beams/sections';
import ToolWorkbenchHeader from '@/app/components/ToolWorkbenchHeader';
import AdSenseBlock from '@/app/components/AdSenseBlock';
import { SectionDiagram } from '@/app/tools/section-properties/SectionDiagram';

const DENSITY_OPTIONS = [
  { label: '一般構造用鋼材 7850 kg/m³', value: 7850 },
  { label: 'ステンレス 7930 kg/m³', value: 7930 },
] as const;

function fmt(value: number | undefined | null, digits = 3): string {
  if (value == null || !Number.isFinite(value)) return '-';
  return value.toLocaleString('ja-JP', { maximumFractionDigits: digits });
}

export default function BeamSelfWeightCalculator() {
  const shapes = getBeamSelfWeightShapes();
  const [shape, setShape] = useState<SectionShape>('H');
  const [shapeDims, setShapeDims] = useState<Record<string, string>>({});
  const [length, setLength] = useState('4');
  const [density, setDensity] = useState(String(DENSITY_OPTIONS[0].value));
  const [purpose, setPurpose] = useState('');
  const [copied, setCopied] = useState(false);
  const [lastEntry, setLastEntry] = useState<EngHistoryEntry | null>(null);
  const [committed, setCommitted] = useState<ReturnType<typeof calculateBeamSelfWeight> | null>(null);

  const currentDef = shapes.find((item) => item.shape === shape) ?? SECTION_DEFS[0];
  const parsedDims = (() => {
    const next: Record<string, number> = {};
    for (const param of currentDef.params) next[param.key] = parseFloat(shapeDims[param.key] ?? '');
    return next;
  })();

  const parsed = {
    shape,
    dims: parsedDims,
    length_m: parseFloat(length),
    density_kg_m3: parseFloat(density),
  };

  const errors = validateBeamSelfWeightInput(parsed);

  async function handleCopy() {
    if (!committed) return;
    const text = fmt(committed.selfWeight_kN_m, 4);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleCalculate() {
    if (errors.length > 0) return;
    const result = calculateBeamSelfWeight(parsed);
    if (!result) return;
    const entry = addEngHistoryEntry({
      toolId: 'beam-self-weight',
      toolName: '梁自重計算',
      inputs: {
        material: '',
        purpose: purpose.trim() || undefined,
        shapeKey: shape,
        shapeName: currentDef.label,
        dims: Object.fromEntries(currentDef.params.map((param) => [param.label, `${shapeDims[param.key] ?? ''} ${param.unit}`])),
        rawDims: { ...parsed.dims, length_m: parsed.length_m, density_kg_m3: parsed.density_kg_m3 },
      },
      results: {
        area_mm2: result.section.area_mm2,
        unitWeight_kg_m: result.unitWeight_kg_m,
        selfWeight_kN_m: result.selfWeight_kN_m,
        totalWeight_kg: result.totalWeight_kg,
        totalWeight_kN: result.totalWeight_kN,
      },
      formulaSteps: result.formulaSteps,
    });
    setCommitted(result);
    setLastEntry(entry);
    trackToolCalculate({ toolId: 'beam-self-weight', category: '梁・断面' });
  }

  return (
    <div className="section-prop-wrap">
      <section className="tool-workbench" aria-label="梁自重計算の入力条件">
        <div className="tool-workbench__section">
          <ToolWorkbenchHeader title="入力条件" />
          <div className="beam-section">
            <h2 className="beam-section-title">① 断面形状</h2>
            <div className="section-shape-tabs">
              {shapes.map((item) => (
                <button
                  key={item.shape}
                  type="button"
                  className={`section-shape-tab${shape === item.shape ? ' section-shape-tab--active' : ''}`}
                  onClick={() => {
                    setShape(item.shape);
                    setShapeDims({});
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="beam-section">
            <h2 className="beam-section-title">② 寸法・長さ</h2>
            <div className="section-main-row">
              <div className="section-diagram-box">
                <SectionDiagram shape={shape} />
              </div>
              <div className="section-inputs-box section-properties-form">
                {currentDef.params.map((param) => (
                  <div key={param.key} className="form-group section-properties-form__field">
                    <label>{param.label} [{param.unit}]</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={shapeDims[param.key] ?? ''}
                      onChange={(e) => setShapeDims((prev) => ({ ...prev, [param.key]: e.target.value }))}
                    />
                  </div>
                ))}
                <Field label="長さ L [m]" value={length} onChange={setLength} />
                <div className="form-group section-properties-form__field">
                  <label>密度</label>
                  <select value={density} onChange={(e) => setDensity(e.target.value)}>
                    {DENSITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group section-properties-form__purpose">
                  <label htmlFor="beam-self-purpose">用途メモ（任意）</label>
                  <input id="beam-self-purpose" type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
                </div>
                {errors.map((error) => (
                  <p key={error} className="error-message">{error}</p>
                ))}
              </div>
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
                  <ResultRow label="断面積 A" value={`${fmt(committed.section.area_mm2, 2)} mm²`} />
                  <ResultRow label="単位重量" value={`${fmt(committed.unitWeight_kg_m, 3)} kg/m`} />
                  <ResultRow label="梁自重" value={`${fmt(committed.selfWeight_kN_m, 4)} kN/m`} />
                  <ResultRow label="総重量" value={`${fmt(committed.totalWeight_kN, 4)} kN`} />
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <button type="button" className="pdf-btn" onClick={handleCopy}>等分布荷重をコピー</button>
              <Link href="/tools/beams/simple-supported-uniform-load" className="pdf-btn">単純梁へ</Link>
              <Link href="/tools/beams/cantilever-uniform-load" className="pdf-btn">片持ち梁へ</Link>
              {copied ? <span className="beam-note">コピーしました</span> : null}
            </div>
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
