'use client';

import { useState, useMemo } from 'react';
import {
  calcSection,
  validateSectionDims,
  SECTION_DEFS,
  type SectionShape,
  type SectionResult,
} from '@/lib/beams/sections';
import { fmt } from '@/lib/beams/units';
import { getSectionFormulaSteps } from '@/lib/beams/sectionFormulas';
import {
  addEngHistoryEntry,
  type EngHistoryEntry,
} from '@/lib/engHistory';
import { printEngReport } from '@/lib/printReport';
import { SectionDiagram } from './SectionDiagram';

// ─── Material density presets ─────────────────────────────────────────────────

const DENSITY_PRESETS = [
  { label: '一般鋼材（SS400 等）', density: 7850 },
  { label: 'SUS304 / SUS316',     density: 7930 },
  { label: 'アルミ合金',           density: 2700 },
  { label: 'カスタム',             density: null },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SectionPropertiesCalculator() {
  // ── Inputs ────────────────────────────────────────────────────────────────
  const [selectedShape, setSelectedShape] = useState<SectionShape>('H');
  const [shapeDims, setShapeDims]         = useState<Record<string, string>>({});
  const [densityIdx, setDensityIdx]       = useState(0);
  const [customDensity, setCustomDensity] = useState<string>('7850');
  const [purpose, setPurpose]             = useState<string>('');

  // ── Committed result (only set when "計算する" is clicked) ────────────────
  const [committedResult, setCommittedResult] = useState<{
    result: SectionResult;
    weightKgPerM: number | null;
    steps: ReturnType<typeof getSectionFormulaSteps>;
    shapeName: string;
    dims: Record<string, string>;
    material: string;
    entry: EngHistoryEntry;
  } | null>(null);

  const currentDef = SECTION_DEFS.find((d) => d.shape === selectedShape)!;

  // ── Parse dims ────────────────────────────────────────────────────────────
  const parsedDims = useMemo(() => {
    const nums: Record<string, number> = {};
    for (const p of currentDef.params) {
      const v = parseFloat(shapeDims[p.key] ?? '');
      nums[p.key] = v;
    }
    return nums;
  }, [currentDef, shapeDims]);

  // ── Live validation (for input feedback only) ─────────────────────────────
  const hasAnyInput = useMemo(
    () => currentDef.params.some((p) => !isNaN(parsedDims[p.key])),
    [currentDef, parsedDims],
  );

  const dimErrors = useMemo(() => {
    if (!hasAnyInput) return [];
    return validateSectionDims(selectedShape, parsedDims);
  }, [hasAnyInput, selectedShape, parsedDims]);

  const canCalculate = useMemo(() => {
    if (dimErrors.length > 0) return false;
    return currentDef.params.every(
      (p) => !isNaN(parsedDims[p.key]) && parsedDims[p.key] > 0,
    );
  }, [dimErrors, currentDef, parsedDims]);

  // ── Density ───────────────────────────────────────────────────────────────
  const density = useMemo(() => {
    const preset = DENSITY_PRESETS[densityIdx];
    if (preset.density !== null) return preset.density;
    const v = parseFloat(customDensity);
    return isNaN(v) || v <= 0 ? null : v;
  }, [densityIdx, customDensity]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleShapeChange(shape: SectionShape) {
    setSelectedShape(shape);
    setShapeDims({});
    setCommittedResult(null);
  }

  function setDim(key: string, val: string) {
    setShapeDims((prev) => ({ ...prev, [key]: val }));
  }

  function handleCalculate() {
    if (!canCalculate) return;

    const result = calcSection(selectedShape, parsedDims);
    if (!result) return;

    const weightKgPerM = density !== null ? result.area_mm2 * density / 1e6 : null;
    const steps = getSectionFormulaSteps(selectedShape, parsedDims, result);
    const materialLabel = DENSITY_PRESETS[densityIdx].density !== null
      ? DENSITY_PRESETS[densityIdx].label
      : `カスタム (${customDensity} kg/m³)`;

    // Build input snapshot for history/PDF
    const dims: Record<string, string> = {};
    for (const p of currentDef.params) {
      dims[p.label] = `${shapeDims[p.key]} ${p.unit}`;
    }

    const entry = addEngHistoryEntry({
      toolId: 'section-properties',
      toolName: '断面性能計算',
      inputs: {
        shapeKey: selectedShape,
        shapeName: currentDef.label,
        dims,
        rawDims: parsedDims,
        material: materialLabel,
        purpose: purpose.trim() || undefined,
      },
      results: {
        Ix_mm4:       result.I_mm4,
        Zx_mm3:       result.Z_mm3,
        Iy_mm4:       result.Iy_mm4,
        Zy_mm3:       result.Zy_mm3,
        area_mm2:     result.area_mm2,
        weightKgPerM: weightKgPerM,
      },
      formulaSteps: steps,
    });

    setCommittedResult({ result, weightKgPerM, steps, shapeName: currentDef.label, dims, material: materialLabel, entry });
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="section-prop-wrap">

      {/* ── Shape selector ── */}
      <div className="beam-section">
        <h2 className="beam-section-title">① 断面形状を選択</h2>
        <div className="section-shape-tabs">
          {SECTION_DEFS.map((d) => (
            <button
              key={d.shape}
              type="button"
              onClick={() => handleShapeChange(d.shape)}
              className={`section-shape-tab${selectedShape === d.shape ? ' section-shape-tab--active' : ''}`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <p className="beam-note" style={{ marginTop: '0.5rem' }}>{currentDef.desc}</p>
      </div>

      {/* ── Diagram + Inputs ── */}
      <div className="beam-section">
        <h2 className="beam-section-title">② 断面寸法を入力</h2>
        <div className="section-main-row">
          <div className="section-diagram-box">
            <SectionDiagram shape={selectedShape} />
            <p className="section-diagram-caption">
              青破線：中立軸（X-X 強軸）　赤矢印：荷重方向<br />
              <span style={{ color: '#6d28d9' }}>紫：公式で使用する中間寸法の識別子</span>
            </p>
          </div>

          <div className="section-inputs-box">
            {currentDef.params.map((p) => (
              <div key={p.key} className="form-group">
                <label htmlFor={`sp-${p.key}`}>
                  {p.label} <span className="unit-label">[{p.unit}]</span>
                </label>
                <input
                  id={`sp-${p.key}`}
                  type="number"
                  min="0.001"
                  step="any"
                  placeholder={p.placeholder}
                  value={shapeDims[p.key] ?? ''}
                  onChange={(e) => setDim(p.key, e.target.value)}
                />
                {p.hint && <span className="beam-conv">{p.hint}</span>}
              </div>
            ))}
            {dimErrors.map((err, i) => (
              <p key={i} className="error-message">{err}</p>
            ))}
          </div>
        </div>
      </div>

      {/* ── Material density ── */}
      <div className="beam-section">
        <h2 className="beam-section-title">③ 材料（重量計算用）</h2>
        <div className="beam-row">
          <div className="form-group" style={{ flex: '1 1 220px' }}>
            <label htmlFor="density-preset">材料プリセット</label>
            <select
              id="density-preset"
              value={densityIdx}
              onChange={(e) => setDensityIdx(Number(e.target.value))}
            >
              {DENSITY_PRESETS.map((d, i) => (
                <option key={i} value={i}>{d.label}</option>
              ))}
            </select>
          </div>
          {DENSITY_PRESETS[densityIdx].density === null && (
            <div className="form-group" style={{ flex: '1 1 180px' }}>
              <label htmlFor="custom-density">
                密度 <span className="unit-label">[kg/m³]</span>
              </label>
              <input
                id="custom-density"
                type="number"
                min="0.001"
                step="any"
                placeholder="7850"
                value={customDensity}
                onChange={(e) => setCustomDensity(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Purpose (optional) ── */}
      <div className="beam-section">
        <h2 className="beam-section-title">④ 計算用途（任意）</h2>
        <div className="form-group" style={{ maxWidth: '480px' }}>
          <label htmlFor="calc-purpose">
            用途メモ
            <span className="beam-conv" style={{ marginLeft: '0.5rem' }}>PDF出力・履歴に表示されます</span>
          </label>
          <input
            id="calc-purpose"
            type="text"
            placeholder="例：梁の断面検討、架台柱の座屈確認"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            maxLength={100}
          />
        </div>
      </div>

      {/* ── Calculate button ── */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          className="calc-btn"
          disabled={!canCalculate}
          onClick={handleCalculate}
        >
          計算する
        </button>
      </div>

      {/* ── Committed results ── */}
      {committedResult && (
        <>
          {/* Formula steps */}
          <div className="beam-section formula-steps-section">
            <h2 className="beam-section-title">計算式（途中式）</h2>
            <div className="formula-steps-list">
              {committedResult.steps.map((s, i) => (
                <div key={i} className="formula-step-item">
                  <span className="formula-step-label">{s.label}</span>
                  <pre className="formula-step-expr">{s.expr}</pre>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="beam-section section-results">
            <div className="section-results-header">
              <h2 className="beam-section-title" style={{ margin: 0 }}>計算結果</h2>
              <button
                type="button"
                className="pdf-btn"
                onClick={() => printEngReport(committedResult.entry)}
              >
                PDF出力
              </button>
            </div>
            <p className="beam-note" style={{ marginBottom: '1rem' }}>
              ※ 角部の丸み（フィレット半径）は非考慮。JIS 規格品の断面性能表と若干異なる場合があります。
            </p>

            <div className="section-result-grid">
              <div className="section-result-group">
                <p className="section-result-group-title">強軸（X-X 軸）</p>
                <ResultRow label="断面二次モーメント Ix" mm={committedResult.result.I_mm4}   unitMm="mm⁴" toCm={1/10000} unitCm="cm⁴" decimals={1} />
                <ResultRow label="断面係数 Zx"           mm={committedResult.result.Z_mm3}   unitMm="mm³" toCm={1/1000}  unitCm="cm³" decimals={2} />
              </div>

              {committedResult.result.Iy_mm4 !== undefined && (
                <div className="section-result-group">
                  <p className="section-result-group-title">弱軸（Y-Y 軸）</p>
                  <ResultRow label="断面二次モーメント Iy" mm={committedResult.result.Iy_mm4}   unitMm="mm⁴" toCm={1/10000} unitCm="cm⁴" decimals={1} />
                  <ResultRow label="断面係数 Zy"           mm={committedResult.result.Zy_mm3!} unitMm="mm³" toCm={1/1000}  unitCm="cm³" decimals={2} />
                </div>
              )}

              <div className="section-result-group">
                <p className="section-result-group-title">断面積・重量</p>
                <ResultRow label="断面積 A" mm={committedResult.result.area_mm2} unitMm="mm²" toCm={1/100} unitCm="cm²" decimals={2} />
                {committedResult.weightKgPerM !== null && (
                  <div className="section-result-row">
                    <span className="section-result-label">重量</span>
                    <span className="section-result-value">
                      <strong>{fmt(committedResult.weightKgPerM, 3)}</strong>
                      <span className="section-result-unit">kg/m</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <p className="beam-note" style={{ marginTop: '1rem' }}>
              重量計算式：A [mm²] × 密度 [kg/m³] / 1,000,000
            </p>
          </div>
        </>
      )}

      {/* ── Notes ── */}
      <div className="beam-notes-section">
        <h3>注記</h3>
        <ul>
          <li>強軸（X-X 軸）：断面図の水平中立軸まわりの断面性能。梁として使う場合の通常の曲げ軸です。</li>
          <li>弱軸（Y-Y 軸）：強軸に直交する軸まわりの断面性能。柱・座屈検討などで使用します。</li>
          <li>等辺山形鋼（アングル）は等辺のため Ix = Iy となります。主軸は 45° 方向です。</li>
          <li>角部の丸み（フィレット半径）は非考慮のため、JIS G 3192 等の断面性能表と若干異なります。</li>
          <li>計算結果は「計算する」ボタン押下時に履歴に保存されます（ブラウザに最大 100 件）。</li>
        </ul>
      </div>
    </div>
  );
}

// ─── ResultRow helper ─────────────────────────────────────────────────────────

function ResultRow({
  label, mm, unitMm, toCm, unitCm, decimals,
}: {
  label: string;
  mm: number;
  unitMm: string;
  toCm: number;
  unitCm: string;
  decimals: number;
}) {
  return (
    <div className="section-result-row">
      <span className="section-result-label">{label}</span>
      <span className="section-result-value">
        <strong>{fmt(mm, decimals)}</strong>
        <span className="section-result-unit">{unitMm}</span>
        <span className="section-result-sub">= {fmt(mm * toCm, decimals)} {unitCm}</span>
      </span>
    </div>
  );
}
