'use client';

import { fmt } from '@/lib/beams/units';
import { SECTION_DEFS, type SectionShape } from '@/lib/beams/sections';
import { buildBeamFormulaSteps } from '@/lib/beams/beamFormulas';
import { calcSimpleBeam } from '@/lib/beams/simpleBeam';
import { printEngReport } from '@/lib/printReport';
import { MATERIAL_PRESETS, useBeamForm, type LoadUnit, type ZUnit, type IUnit } from '../hooks/useBeamForm';
import BeamCalculatorLayout from '../components/BeamCalculatorLayout';
import BeamDiagram from './BeamDiagram';

// ─── Component ────────────────────────────────────────────────────────────────

export default function SimpleSupportedCalculator() {
  const {
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
    currentShapeDef,
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
    handleMaterialChange,
    handleLoadUnitChange,
    handleZUnitChange,
    handleIUnitChange,
    handleSectionModeChange,
    handleShapeChange,
    handleCalculate,
  } = useBeamForm({
    defaultDeflectionN: 300,
    toolId: 'simple-beam',
    toolName: '単純梁計算',
    analyticsToolId: 'beam',
    calculateBeam: calcSimpleBeam,
    buildFormulaSteps: buildBeamFormulaSteps,
  });

  const spanLabel = L && !isNaN(parseFloat(L)) && parseFloat(L) > 0 ? `${L} mm` : undefined;
  const loadLabelForDiagram = loadKNDisplay ? `${loadKNDisplay} kN` : undefined;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
    <BeamCalculatorLayout
      diagram={<BeamDiagram loadCase={loadCase} spanLabel={spanLabel} loadLabel={loadLabelForDiagram} />}
      onSubmit={handleCalculate}
    >
        {/* ① Material */}
        <section className="beam-section">
          <h2 className="beam-section-title">① 材質・ヤング率</h2>
          <div className="beam-row">
            <div className="form-group" style={{ flex: '1 1 200px' }}>
              <label htmlFor="material">材質プリセット</label>
              <select
                id="material"
                value={materialIdx}
                onChange={(e) => handleMaterialChange(Number(e.target.value))}
              >
                {MATERIAL_PRESETS.map((m, i) => (
                  <option key={m.label} value={i}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ flex: '1 1 160px' }}>
              <label htmlFor="E_GPa">
                ヤング率 E <span className="unit-label">[GPa]</span>
                {!isCustomMaterial && <span className="beam-note-inline">固定値</span>}
              </label>
              <input
                id="E_GPa"
                type="number"
                min="0.001"
                step="any"
                placeholder="例: 205"
                value={E_GPa}
                disabled={!isCustomMaterial}
                onChange={(e) => setE_GPa(e.target.value)}
                className={`${formErrors['E'] ? 'input-error' : ''}${!isCustomMaterial ? ' input-disabled' : ''}`}
              />
              {formErrors['E'] && <span className="error-message">{formErrors['E']}</span>}
            </div>
            <div className="form-group" style={{ flex: '1 1 180px' }}>
              <label htmlFor="sigmaAllow">
                許容曲げ応力 σ_allow <span className="unit-label">[MPa]</span>
                <span className="beam-note-inline">※要確認</span>
              </label>
              <input
                id="sigmaAllow"
                type="number"
                min="0.001"
                step="any"
                placeholder="例: 150"
                value={sigmaAllow}
                onChange={(e) => setSigmaAllow(e.target.value)}
                className={formErrors['sigmaAllow'] ? 'input-error' : ''}
              />
              {formErrors['sigmaAllow'] && (
                <span className="error-message">{formErrors['sigmaAllow']}</span>
              )}
            </div>
          </div>
          <p className="beam-note">
            許容応力の初期値はあくまで目安です。設計基準・仕様書に従い必ず調整してください。
            ヤング率はプリセット選択時は固定値として扱います（カスタムを選択すると編集可能）。
          </p>
        </section>

        {/* ② Span */}
        <section className="beam-section">
          <h2 className="beam-section-title">② スパン</h2>
          <div className="beam-row">
            <div className="form-group" style={{ flex: '1 1 200px' }}>
              <label htmlFor="L">
                スパン L <span className="unit-label">[mm]</span>
              </label>
              <input
                id="L"
                type="number"
                min="0.001"
                step="any"
                placeholder="例: 2000"
                value={L}
                onChange={(e) => setL(e.target.value)}
                className={formErrors['L'] ? 'input-error' : ''}
              />
              {formErrors['L'] && <span className="error-message">{formErrors['L']}</span>}
            </div>
          </div>
        </section>

        {/* ③ Load */}
        <section className="beam-section">
          <h2 className="beam-section-title">③ 荷重</h2>
          <div className="beam-row" style={{ marginBottom: '0.75rem' }}>
            <div className="beam-toggle-group">
              <button
                type="button"
                className={`beam-toggle-btn${loadCase === 'center' ? ' beam-toggle-btn--active' : ''}`}
                onClick={() => { setLoadCase('center'); setLoadValue(''); }}
              >
                中央集中荷重
              </button>
              <button
                type="button"
                className={`beam-toggle-btn${loadCase === 'uniform' ? ' beam-toggle-btn--active' : ''}`}
                onClick={() => { setLoadCase('uniform'); setLoadValue(''); }}
              >
                等分布荷重（総荷重入力）
              </button>
            </div>
          </div>

          <div className="beam-row">
            <div className="form-group" style={{ flex: '1 1 220px' }}>
              <label htmlFor="loadValue">
                {loadCase === 'center' ? '集中荷重 P' : '総荷重 W_total'}
                {' '}<span className="unit-label">[{loadUnit}]</span>
              </label>
              <div className="input-with-unit">
                <input
                  id="loadValue"
                  type="number"
                  min="0.001"
                  step="any"
                  placeholder={loadUnit === 'kg' ? '例: 1000' : '例: 9.81'}
                  value={loadValue}
                  onChange={(e) => setLoadValue(e.target.value)}
                  className={formErrors['load'] ? 'input-error' : ''}
                />
                <div className="beam-toggle-group beam-toggle-group--small">
                  {(['kg', 'kN'] as LoadUnit[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      className={`beam-toggle-btn beam-toggle-btn--small${loadUnit === u ? ' beam-toggle-btn--active' : ''}`}
                      onClick={() => handleLoadUnitChange(u)}
                    >{u}</button>
                  ))}
                </div>
              </div>
              {formErrors['load'] && <span className="error-message">{formErrors['load']}</span>}
              {loadKNDisplay && (
                <span className="beam-conv">
                  → <strong>{loadKNDisplay} kN</strong>
                  {loadUnit === 'kg' && ` (${loadValue} kg × 9.80665 / 1000)`}
                </span>
              )}
            </div>
          </div>

          {loadCase === 'uniform' && wDisplay && (
            <div className="beam-formula-box">
              <span className="beam-formula-label">線荷重 w（自動計算）</span>
              <span className="beam-formula-value">
                w = W_total / L = <strong>{wDisplay} kN/mm</strong>
                <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                  = {wKNperMDisplay} kN/m
                </span>
              </span>
            </div>
          )}
        </section>

        {/* ④ Section */}
        <section className="beam-section">
          <h2 className="beam-section-title">④ 断面性能</h2>

          {/* Mode tab — 形状から計算 is the default (first) */}
          <div className="beam-toggle-group" style={{ marginBottom: '1.25rem', alignSelf: 'flex-start' }}>
            <button
              type="button"
              className={`beam-toggle-btn${sectionMode === 'shape' ? ' beam-toggle-btn--active' : ''}`}
              onClick={() => handleSectionModeChange('shape')}
            >
              形状から計算
            </button>
            <button
              type="button"
              className={`beam-toggle-btn${sectionMode === 'direct' ? ' beam-toggle-btn--active' : ''}`}
              onClick={() => handleSectionModeChange('direct')}
            >
              直接入力
            </button>
          </div>

          {sectionMode === 'shape' ? (
            /* ── Shape selector ── */
            <div>
              <div className="beam-row" style={{ marginBottom: '1rem' }}>
                <div className="form-group" style={{ flex: '1 1 240px' }}>
                  <label htmlFor="sectionShape">断面形状</label>
                  <select
                    id="sectionShape"
                    value={selectedShape}
                    onChange={(e) => handleShapeChange(e.target.value as SectionShape)}
                  >
                    {SECTION_DEFS.map((d) => (
                      <option key={d.shape} value={d.shape}>{d.label}</option>
                    ))}
                  </select>
                  <span className="beam-conv">{currentShapeDef.desc}</span>
                </div>
              </div>

              <div className="beam-row">
                {currentShapeDef.params.map((p) => (
                  <div key={p.key} className="form-group" style={{ flex: '1 1 140px' }}>
                    <label htmlFor={`dim-${p.key}`}>
                      {p.label} <span className="unit-label">[{p.unit}]</span>
                    </label>
                    <input
                      id={`dim-${p.key}`}
                      type="number"
                      min="0.001"
                      step="any"
                      placeholder={p.placeholder}
                      value={shapeDims[p.key] ?? ''}
                      onChange={(e) =>
                        setShapeDims((prev) => ({ ...prev, [p.key]: e.target.value }))
                      }
                    />
                    {p.hint && <span className="beam-conv">{p.hint}</span>}
                  </div>
                ))}
              </div>

              {shapeErrors.length > 0 && (
                <div style={{ marginTop: '0.75rem' }}>
                  {shapeErrors.map((err, i) => (
                    <p key={i} className="error-message">{err}</p>
                  ))}
                </div>
              )}

              {shapeResult && shapeErrors.length === 0 && (
                <div className="beam-section-result">
                  <span className="beam-section-result-item">
                    <span className="beam-section-result-label">I =</span>
                    <strong>{fmt(shapeResult.I_mm4, 0)} mm⁴</strong>
                    <span className="beam-conv-inline">= {fmt(shapeResult.I_mm4 / 10000, 2)} cm⁴</span>
                  </span>
                  <span className="beam-section-result-item">
                    <span className="beam-section-result-label">Z =</span>
                    <strong>{fmt(shapeResult.Z_mm3, 0)} mm³</strong>
                    <span className="beam-conv-inline">= {fmt(shapeResult.Z_mm3 / 1000, 2)} cm³</span>
                  </span>
                  <span className="beam-section-result-item">
                    <span className="beam-section-result-label">断面積 A =</span>
                    <strong>{fmt(shapeResult.area_mm2, 1)} mm²</strong>
                    <span className="beam-conv-inline">= {fmt(shapeResult.area_mm2 / 100, 2)} cm²</span>
                  </span>
                </div>
              )}

              {formErrors['section'] && (
                <span className="error-message" style={{ marginTop: '0.5rem', display: 'block' }}>
                  {formErrors['section']}
                </span>
              )}

              <p className="beam-note" style={{ marginTop: '0.75rem' }}>
                ※ 角部の丸み（フィレット半径）は非考慮のため、JIS 規格品の断面性能表と若干異なる場合があります。
              </p>
            </div>
          ) : (
            /* ── Direct input ── */
            <div className="beam-row">
              <div className="form-group" style={{ flex: '1 1 220px' }}>
                <label htmlFor="Z">
                  断面係数 Z <span className="unit-label">[{ZUnit}]</span>
                </label>
                <div className="input-with-unit">
                  <input
                    id="Z"
                    type="number"
                    min="0.001"
                    step="any"
                    placeholder={ZUnit === 'cm3' ? '例: 1000' : '例: 1000000'}
                    value={Z}
                    onChange={(e) => setZ(e.target.value)}
                    className={formErrors['Z'] ? 'input-error' : ''}
                  />
                  <div className="beam-toggle-group beam-toggle-group--small">
                    {(['cm3', 'mm3'] as ZUnit[]).map((u) => (
                      <button
                        key={u}
                        type="button"
                        className={`beam-toggle-btn beam-toggle-btn--small${ZUnit === u ? ' beam-toggle-btn--active' : ''}`}
                        onClick={() => handleZUnitChange(u)}
                      >{u === 'cm3' ? 'cm³' : 'mm³'}</button>
                    ))}
                  </div>
                </div>
                {formErrors['Z'] && <span className="error-message">{formErrors['Z']}</span>}
              </div>

              <div className="form-group" style={{ flex: '1 1 220px' }}>
                <label htmlFor="I">
                  断面二次モーメント I <span className="unit-label">[{IUnit}]</span>
                </label>
                <div className="input-with-unit">
                  <input
                    id="I"
                    type="number"
                    min="0.001"
                    step="any"
                    placeholder={IUnit === 'cm4' ? '例: 10000' : '例: 100000000'}
                    value={I}
                    onChange={(e) => setI(e.target.value)}
                    className={formErrors['I'] ? 'input-error' : ''}
                  />
                  <div className="beam-toggle-group beam-toggle-group--small">
                    {(['cm4', 'mm4'] as IUnit[]).map((u) => (
                      <button
                        key={u}
                        type="button"
                        className={`beam-toggle-btn beam-toggle-btn--small${IUnit === u ? ' beam-toggle-btn--active' : ''}`}
                        onClick={() => handleIUnitChange(u)}
                      >{u === 'cm4' ? 'cm⁴' : 'mm⁴'}</button>
                    ))}
                  </div>
                </div>
                {formErrors['I'] && <span className="error-message">{formErrors['I']}</span>}
              </div>
            </div>
          )}
        </section>

        {/* ⑤ Allowable deflection */}
        <section className="beam-section">
          <h2 className="beam-section-title">⑤ 許容たわみ基準</h2>
          <div className="beam-row" style={{ alignItems: 'flex-start', gap: '1rem' }}>
            <div className="form-group" style={{ flex: '0 0 auto', maxWidth: 260 }}>
              <label htmlFor="deflectionN">
                分母 N（L / N）
                <span className="unit-label" style={{ marginLeft: 6 }}>例: 300 → L/300</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--text-muted)' }}>L /</span>
                <input
                  id="deflectionN"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="300"
                  value={deflectionNStr}
                  onChange={(e) => setDeflectionNStr(e.target.value)}
                  className={formErrors['deflection'] ? 'input-error' : ''}
                  style={{ width: 100 }}
                />
              </div>
              {formErrors['deflection'] && (
                <span className="error-message">{formErrors['deflection']}</span>
              )}
              {L && !isNaN(parseFloat(L)) && parseFloat(L) > 0 && deflectionN > 0 && (
                <span className="beam-conv">
                  → δ_allow = {fmt(parseFloat(L) / deflectionN, 2)} mm（L = {L} mm）
                </span>
              )}
            </div>

            <div className="beam-deflection-ref">
              <p className="beam-ref-title">📖 参考：許容たわみの目安（日本）</p>
              <ul className="beam-ref-text-list">
                <li><strong>L/200〜L/250</strong>：一般的な鉄骨梁・屋根梁の目安（AIJ 鋼構造設計規準）</li>
                <li><strong>L/300</strong>：床梁・天井仕上げのある部材（変形による影響を考慮）</li>
                <li><strong>L/400〜L/500</strong>：精密機器架台・クレーン梁など、変形に敏感な用途</li>
              </ul>
              <p className="beam-ref-note">
                ※ 根拠規準：
                <a href="https://www.aij.or.jp/paper/detail.html?productId=623" target="_blank" rel="noopener noreferrer">
                  AIJ 鋼構造設計規準
                </a>、
                建築基準法施行令第82条（構造計算基準）。
                最終判断は必ず設計者が適用規準を確認してください。
              </p>
            </div>
          </div>
        </section>

        {/* ⑥ Purpose */}
        <section className="beam-section">
          <h2 className="beam-section-title">⑥ 計算用途（任意）</h2>
          <div className="form-group" style={{ maxWidth: 480 }}>
            <label htmlFor="purpose">計算用途・メモ</label>
            <input
              id="purpose"
              type="text"
              placeholder="例：2F床梁 中央スパン検討"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              maxLength={120}
            />
          </div>
        </section>

        {/* Warnings */}
        {formWarnings.length > 0 && (
          <div className="beam-warnings">
            {formWarnings.map((w, i) => (
              <p key={i} className="beam-warning-item">⚠ {w}</p>
            ))}
          </div>
        )}

        <div className="form-submit-row">
          <button type="submit" className="calc-btn">計算する</button>
        </div>
    </BeamCalculatorLayout>

      {/* ── RESULTS ── */}
      {result && (
        <div className="results" style={{ marginTop: '2rem' }}>
          <div className="section-results-header">
            <h2>計算結果</h2>
            {lastEntry && (
              <button
                type="button"
                className="pdf-btn"
                onClick={() => printEngReport(lastEntry)}
              >
                PDF 出力
              </button>
            )}
          </div>

          <p className="result-meta">
            {loadCase === 'center' ? '中央集中荷重' : '等分布荷重（総荷重入力）'}
            {loadKNNormalized !== null && ` / 荷重 ${fmt(loadKNNormalized, 2)} kN`}
            {loadUnit === 'kg' && loadValue && ` (${loadValue} kg)`}
            {` / スパン L = ${L} mm`}
            {sectionMode === 'shape' && ` / ${currentShapeDef.label}`}
          </p>

          <div className="result-cards">
            <div className="result-card">
              <p className="result-label">最大曲げモーメント M_max</p>
              <p className="result-value" style={{ fontSize: '1.25rem' }}>
                {fmt(result.Mmax_kNm, 3)} kN·m
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                = {(result.Mmax_Nmm / 1e6).toFixed(3)} × 10⁶ N·mm
              </p>
            </div>

            <div className={`result-card${result.stressOK ? ' result-card--ok' : ' result-card--ng'}`}>
              <p className="result-label">曲げ応力 σ_max</p>
              <p className="result-value" style={{ fontSize: '1.25rem' }}>
                {fmt(result.sigmaMax, 1)} MPa
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                許容 σ_allow = {result.sigmaAllow} MPa
              </p>
              <p className={`beam-judgement${result.stressOK ? ' beam-judgement--ok' : ' beam-judgement--ng'}`}>
                {result.stressOK ? '✓ OK' : '✗ NG'}
              </p>
            </div>

            <div className={`result-card${result.deflectionOK ? ' result-card--ok' : ' result-card--ng'}`}>
              <p className="result-label">最大たわみ δ_max</p>
              <p className="result-value" style={{ fontSize: '1.25rem' }}>
                {fmt(result.deltaMax, 2)} mm
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                許容 δ_allow = L/{deflectionN} = {fmt(result.deltaAllow, 2)} mm
              </p>
              <p className={`beam-judgement${result.deflectionOK ? ' beam-judgement--ok' : ' beam-judgement--ng'}`}>
                {result.deflectionOK ? '✓ OK' : '✗ NG'}
              </p>
            </div>
          </div>

          {loadCase === 'uniform' && result.w_kN_per_m !== undefined && (
            <div className="beam-formula-box" style={{ marginTop: 0 }}>
              <span className="beam-formula-label">線荷重 w（内部値）</span>
              <span className="beam-formula-value">
                w = {fmt(result.w_N_per_mm!, 6)} N/mm
                <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                  = <strong>{fmt(result.w_kN_per_m!, 4)} kN/m</strong>
                </span>
              </span>
            </div>
          )}

          {sectionMode === 'shape' && shapeResult && (
            <div className="beam-formula-box">
              <span className="beam-formula-label">使用断面値（{currentShapeDef.label}）</span>
              <span className="beam-formula-value">
                I = {fmt(shapeResult.I_mm4, 0)} mm⁴
                &nbsp;/&nbsp;
                Z = {fmt(shapeResult.Z_mm3, 0)} mm³
              </span>
            </div>
          )}

          {/* Formula steps */}
          {formulaSteps.length > 0 && (
            <div className="formula-steps-section" style={{ marginTop: '1.5rem' }}>
              <h3 className="formula-steps-title">計算式・途中経過</h3>
              {formulaSteps.map((s, i) => (
                <div key={i} className="formula-step-item">
                  <span className="formula-step-label">{s.label}</span>
                  <pre className="formula-step-expr">{s.expr}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── NOTES ── */}
      <div className="beam-notes-section">
        <h3>注記</h3>
        <ul>
          <li>梁の自重（等分布荷重相当）は本ツールでは考慮していません。</li>
          <li>断面形状から計算する場合、角部の丸み（フィレット半径）は非考慮のため、JIS 規格品の断面性能表と若干異なる場合があります。</li>
          <li>許容応力・許容たわみは用途・適用規準によって異なります。入力値・選択値に基づく簡易判定です。</li>
          <li>計算結果は参考値です。最終判断は設計基準・仕様書・専門家にご確認ください。</li>
        </ul>
      </div>
    </>
  );
}
