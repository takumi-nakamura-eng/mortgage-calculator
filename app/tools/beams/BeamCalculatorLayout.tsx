'use client';

import type { ReactNode } from 'react';
import { printEngReport } from '@/lib/printReport';
import { BEAM_MATERIAL_PRESETS } from '@/lib/materialPresets';
import { fmt } from '@/lib/beams/units';
import { SECTION_DEFS, type SectionShape } from '@/lib/beams/sections';
import type { BeamResult } from '@/lib/beams/simpleBeam';
import type { EngHistoryEntry, FormulaStep } from '@/lib/engHistory';
import AdSenseBlock from '@/app/components/AdSenseBlock';
import ToolWorkbenchHeader from '@/app/components/ToolWorkbenchHeader';
import type { BeamFormActions, BeamFormState, IUnit, LoadUnit, SectionMode, ZUnit } from './useBeamForm';

interface BeamCalculatorText {
  spanSectionTitle: string;
  spanPlaceholder: string;
  centerLoadButtonLabel: string;
  centerLoadInputLabel: string;
  loadPlaceholder: Record<LoadUnit, string>;
  deflectionExample: string;
  deflectionPlaceholder: string;
  deflectionReferenceTitle: string;
  deflectionReferenceItems: ReactNode[];
  deflectionReferenceNote: ReactNode;
  purposePlaceholder: string;
  resultLoadCaseLabel: Record<'center' | 'uniform', string>;
  resultMomentLabel: string;
  resultDeflectionLabel: string;
  notes: string[];
}

interface BeamCalculatorLayoutProps {
  form: BeamFormState;
  actions: BeamFormActions;
  formErrors: Record<string, string>;
  formWarnings: string[];
  result: BeamResult | null;
  loadKNNormalized: number | null;
  lastEntry: EngHistoryEntry | null;
  formulaSteps: FormulaStep[];
  text: BeamCalculatorText;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onLoadCaseChange: (loadCase: 'center' | 'uniform') => void;
  onSectionModeChange: (mode: SectionMode) => void;
  onShapeChange: (shape: SectionShape) => void;
}

function MaterialSection({
  form,
  actions,
  formErrors,
}: {
  form: BeamFormState;
  actions: BeamFormActions;
  formErrors: Record<string, string>;
}) {
  return (
    <section className="beam-section">
      <h2 className="beam-section-title">① 材質・ヤング率</h2>
      <div className="beam-row">
        <div className="form-group" style={{ flex: '1 1 200px' }}>
          <label htmlFor="material">材質プリセット</label>
          <select
            id="material"
            value={form.materialIdx}
            onChange={(event) => actions.handleMaterialChange(Number(event.target.value))}
          >
            {BEAM_MATERIAL_PRESETS.map((material, index) => (
              <option key={material.label} value={index}>{material.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ flex: '1 1 160px' }}>
          <label htmlFor="E_GPa">
            ヤング率 E <span className="unit-label">[GPa]</span>
            {!form.isCustomMaterial && <span className="beam-note-inline">固定値</span>}
          </label>
          <input
            id="E_GPa"
            type="number"
            min="0.001"
            step="any"
            placeholder="例: 205"
            value={form.E_GPa}
            disabled={!form.isCustomMaterial}
            onChange={(event) => actions.setE_GPa(event.target.value)}
            className={`${formErrors.E ? 'input-error' : ''}${!form.isCustomMaterial ? ' input-disabled' : ''}`}
          />
          {formErrors.E && <span className="error-message">{formErrors.E}</span>}
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
            value={form.sigmaAllow}
            onChange={(event) => actions.setSigmaAllow(event.target.value)}
            className={formErrors.sigmaAllow ? 'input-error' : ''}
          />
          {formErrors.sigmaAllow && <span className="error-message">{formErrors.sigmaAllow}</span>}
        </div>
      </div>
      <p className="beam-note">
        許容応力の初期値はあくまで目安です。設計基準・仕様書に従い必ず調整してください。
        ヤング率はプリセット選択時は固定値として扱います（カスタムを選択すると編集可能）。
      </p>
    </section>
  );
}

function SpanSection({
  form,
  actions,
  formErrors,
  title,
  placeholder,
}: {
  form: BeamFormState;
  actions: BeamFormActions;
  formErrors: Record<string, string>;
  title: string;
  placeholder: string;
}) {
  return (
    <section className="beam-section">
      <h2 className="beam-section-title">{title}</h2>
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
            placeholder={placeholder}
            value={form.L}
            onChange={(event) => actions.setL(event.target.value)}
            className={formErrors.L ? 'input-error' : ''}
          />
          {formErrors.L && <span className="error-message">{formErrors.L}</span>}
        </div>
      </div>
    </section>
  );
}

function LoadSection({
  form,
  actions,
  formErrors,
  text,
  onLoadCaseChange,
}: {
  form: BeamFormState;
  actions: BeamFormActions;
  formErrors: Record<string, string>;
  text: BeamCalculatorText;
  onLoadCaseChange: (loadCase: 'center' | 'uniform') => void;
}) {
  return (
    <section className="beam-section">
      <h2 className="beam-section-title">③ 荷重</h2>
      <div className="beam-row" style={{ marginBottom: '0.75rem' }}>
        <div className="beam-toggle-group">
          <button
            type="button"
            className={`beam-toggle-btn${form.loadCase === 'center' ? ' beam-toggle-btn--active' : ''}`}
            onClick={() => onLoadCaseChange('center')}
          >
            {text.centerLoadButtonLabel}
          </button>
          <button
            type="button"
            className={`beam-toggle-btn${form.loadCase === 'uniform' ? ' beam-toggle-btn--active' : ''}`}
            onClick={() => onLoadCaseChange('uniform')}
          >
            等分布荷重（総荷重入力）
          </button>
        </div>
      </div>

      <div className="beam-row">
        <div className="form-group" style={{ flex: '1 1 220px' }}>
          <label htmlFor="loadValue">
            {form.loadCase === 'center' ? text.centerLoadInputLabel : '総荷重 W_total'}
            {' '}<span className="unit-label">[{form.loadUnit}]</span>
          </label>
          <div className="input-with-unit">
            <input
              id="loadValue"
              type="number"
              min="0.001"
              step="any"
              placeholder={text.loadPlaceholder[form.loadUnit]}
              value={form.loadValue}
              onChange={(event) => actions.setLoadValue(event.target.value)}
              className={formErrors.load ? 'input-error' : ''}
            />
            <div className="beam-toggle-group beam-toggle-group--small">
              {(['kg', 'kN'] as LoadUnit[]).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  className={`beam-toggle-btn beam-toggle-btn--small${form.loadUnit === unit ? ' beam-toggle-btn--active' : ''}`}
                  onClick={() => actions.handleLoadUnitChange(unit)}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
          {formErrors.load && <span className="error-message">{formErrors.load}</span>}
          {form.loadKNDisplay && (
            <span className="beam-conv">
              → <strong>{form.loadKNDisplay} kN</strong>
              {form.loadUnit === 'kg' && ` (${form.loadValue} kg × 9.80665 / 1000)`}
            </span>
          )}
        </div>
      </div>

      {form.loadCase === 'uniform' && form.wDisplay && (
        <div className="beam-formula-box">
          <span className="beam-formula-label">線荷重 w（自動計算）</span>
          <span className="beam-formula-value">
            w = W_total / L = <strong>{form.wDisplay} kN/mm</strong>
            <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
              = {form.wKNperMDisplay} kN/m
            </span>
          </span>
        </div>
      )}
    </section>
  );
}

function ShapeSection({
  form,
  actions,
  formErrors,
  onShapeChange,
}: {
  form: BeamFormState;
  actions: BeamFormActions;
  formErrors: Record<string, string>;
  onShapeChange: (shape: SectionShape) => void;
}) {
  return (
    <div>
      <div className="beam-row" style={{ marginBottom: '1rem' }}>
        <div className="form-group" style={{ flex: '1 1 240px' }}>
          <label htmlFor="sectionShape">断面形状</label>
          <select
            id="sectionShape"
            value={form.selectedShape}
            onChange={(event) => onShapeChange(event.target.value as SectionShape)}
          >
            {SECTION_DEFS.map((definition) => (
              <option key={definition.shape} value={definition.shape}>{definition.label}</option>
            ))}
          </select>
          <span className="beam-conv">{form.currentShapeDef.desc}</span>
        </div>
      </div>

      <div className="beam-row">
        {form.currentShapeDef.params.map((param) => (
          <div key={param.key} className="form-group" style={{ flex: '1 1 140px' }}>
            <label htmlFor={`dim-${param.key}`}>
              {param.label} <span className="unit-label">[{param.unit}]</span>
            </label>
            <input
              id={`dim-${param.key}`}
              type="number"
              min="0.001"
              step="any"
              placeholder={param.placeholder}
              value={form.shapeDims[param.key] ?? ''}
              onChange={(event) => actions.setShapeDim(param.key, event.target.value)}
            />
            {param.hint && <span className="beam-conv">{param.hint}</span>}
          </div>
        ))}
      </div>

      {form.shapeErrors.length > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          {form.shapeErrors.map((error, index) => (
            <p key={index} className="error-message">{error}</p>
          ))}
        </div>
      )}

      {form.shapeResult && form.shapeErrors.length === 0 && (
        <div className="beam-section-result">
          <span className="beam-section-result-item">
            <span className="beam-section-result-label">I =</span>
            <strong>{fmt(form.shapeResult.I_mm4, 0)} mm⁴</strong>
            <span className="beam-conv-inline">= {fmt(form.shapeResult.I_mm4 / 10000, 2)} cm⁴</span>
          </span>
          <span className="beam-section-result-item">
            <span className="beam-section-result-label">Z =</span>
            <strong>{fmt(form.shapeResult.Z_mm3, 0)} mm³</strong>
            <span className="beam-conv-inline">= {fmt(form.shapeResult.Z_mm3 / 1000, 2)} cm³</span>
          </span>
          <span className="beam-section-result-item">
            <span className="beam-section-result-label">断面積 A =</span>
            <strong>{fmt(form.shapeResult.area_mm2, 1)} mm²</strong>
            <span className="beam-conv-inline">= {fmt(form.shapeResult.area_mm2 / 100, 2)} cm²</span>
          </span>
        </div>
      )}

      {formErrors.section && (
        <span className="error-message" style={{ marginTop: '0.5rem', display: 'block' }}>
          {formErrors.section}
        </span>
      )}

      <p className="beam-note" style={{ marginTop: '0.75rem' }}>
        ※ 角部の丸み（フィレット半径）は非考慮のため、JIS 規格品の断面性能表と若干異なる場合があります。
      </p>
    </div>
  );
}

function DirectSection({
  form,
  actions,
  formErrors,
}: {
  form: BeamFormState;
  actions: BeamFormActions;
  formErrors: Record<string, string>;
}) {
  return (
    <div className="beam-row">
      <div className="form-group" style={{ flex: '1 1 220px' }}>
        <label htmlFor="Z">
          断面係数 Z <span className="unit-label">[{form.ZUnit}]</span>
        </label>
        <div className="input-with-unit">
          <input
            id="Z"
            type="number"
            min="0.001"
            step="any"
            placeholder={form.ZUnit === 'cm3' ? '例: 1000' : '例: 1000000'}
            value={form.Z}
            onChange={(event) => actions.setZ(event.target.value)}
            className={formErrors.Z ? 'input-error' : ''}
          />
          <div className="beam-toggle-group beam-toggle-group--small">
            {(['cm3', 'mm3'] as ZUnit[]).map((unit) => (
              <button
                key={unit}
                type="button"
                className={`beam-toggle-btn beam-toggle-btn--small${form.ZUnit === unit ? ' beam-toggle-btn--active' : ''}`}
                onClick={() => actions.handleZUnitChange(unit)}
              >
                {unit === 'cm3' ? 'cm³' : 'mm³'}
              </button>
            ))}
          </div>
        </div>
        {formErrors.Z && <span className="error-message">{formErrors.Z}</span>}
      </div>

      <div className="form-group" style={{ flex: '1 1 220px' }}>
        <label htmlFor="I">
          断面二次モーメント I <span className="unit-label">[{form.IUnit}]</span>
        </label>
        <div className="input-with-unit">
          <input
            id="I"
            type="number"
            min="0.001"
            step="any"
            placeholder={form.IUnit === 'cm4' ? '例: 10000' : '例: 100000000'}
            value={form.I}
            onChange={(event) => actions.setI(event.target.value)}
            className={formErrors.I ? 'input-error' : ''}
          />
          <div className="beam-toggle-group beam-toggle-group--small">
            {(['cm4', 'mm4'] as IUnit[]).map((unit) => (
              <button
                key={unit}
                type="button"
                className={`beam-toggle-btn beam-toggle-btn--small${form.IUnit === unit ? ' beam-toggle-btn--active' : ''}`}
                onClick={() => actions.handleIUnitChange(unit)}
              >
                {unit === 'cm4' ? 'cm⁴' : 'mm⁴'}
              </button>
            ))}
          </div>
        </div>
        {formErrors.I && <span className="error-message">{formErrors.I}</span>}
      </div>
    </div>
  );
}

function DeflectionSection({
  form,
  actions,
  formErrors,
  text,
}: {
  form: BeamFormState;
  actions: BeamFormActions;
  formErrors: Record<string, string>;
  text: BeamCalculatorText;
}) {
  return (
    <section className="beam-section">
      <h2 className="beam-section-title">⑤ 許容たわみ基準</h2>
      <div className="beam-row" style={{ alignItems: 'flex-start', gap: '1rem' }}>
        <div className="form-group" style={{ flex: '0 0 auto', maxWidth: 260 }}>
          <label htmlFor="deflectionN">
            分母 N（L / N）
            <span className="unit-label" style={{ marginLeft: 6 }}>{text.deflectionExample}</span>
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--text-muted)' }}>L /</span>
            <input
              id="deflectionN"
              type="number"
              min="1"
              step="1"
              placeholder={text.deflectionPlaceholder}
              value={form.deflectionNStr}
              onChange={(event) => actions.setDeflectionNStr(event.target.value)}
              className={formErrors.deflection ? 'input-error' : ''}
              style={{ width: 100 }}
            />
          </div>
          {formErrors.deflection && <span className="error-message">{formErrors.deflection}</span>}
          {form.L && !Number.isNaN(parseFloat(form.L)) && parseFloat(form.L) > 0 && form.deflectionN > 0 && (
            <span className="beam-conv">
              → δ_allow = {fmt(parseFloat(form.L) / form.deflectionN, 2)} mm（L = {form.L} mm）
            </span>
          )}
        </div>

        <div className="beam-deflection-ref">
          <p className="beam-ref-title">{text.deflectionReferenceTitle}</p>
          <ul className="beam-ref-text-list">
            {text.deflectionReferenceItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className="beam-ref-note">{text.deflectionReferenceNote}</p>
        </div>
      </div>
    </section>
  );
}

function ResultSection({
  form,
  result,
  loadKNNormalized,
  lastEntry,
  formulaSteps,
  text,
}: {
  form: BeamFormState;
  result: BeamResult;
  loadKNNormalized: number | null;
  lastEntry: EngHistoryEntry | null;
  formulaSteps: FormulaStep[];
  text: BeamCalculatorText;
}) {
  return (
    <div className="results">
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
        {text.resultLoadCaseLabel[form.loadCase]}
        {loadKNNormalized !== null && ` / 荷重 ${fmt(loadKNNormalized, 2)} kN`}
        {form.loadUnit === 'kg' && form.loadValue && ` (${form.loadValue} kg)`}
        {` / スパン L = ${form.L} mm`}
        {form.sectionMode === 'shape' && ` / ${form.currentShapeDef.label}`}
      </p>

      <div className="result-cards">
        <div className="result-card">
          <p className="result-label">{text.resultMomentLabel}</p>
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
          <p className="result-label">{text.resultDeflectionLabel}</p>
          <p className="result-value" style={{ fontSize: '1.25rem' }}>
            {fmt(result.deltaMax, 2)} mm
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            許容 δ_allow = L/{form.deflectionN} = {fmt(result.deltaAllow, 2)} mm
          </p>
          <p className={`beam-judgement${result.deflectionOK ? ' beam-judgement--ok' : ' beam-judgement--ng'}`}>
            {result.deflectionOK ? '✓ OK' : '✗ NG'}
          </p>
        </div>
      </div>

      {form.loadCase === 'uniform' && result.w_kN_per_m !== undefined && (
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

      {form.sectionMode === 'shape' && form.shapeResult && (
        <div className="beam-formula-box">
          <span className="beam-formula-label">使用断面値（{form.currentShapeDef.label}）</span>
          <span className="beam-formula-value">
            I = {fmt(form.shapeResult.I_mm4, 0)} mm⁴
            &nbsp;/&nbsp;
            Z = {fmt(form.shapeResult.Z_mm3, 0)} mm³
          </span>
        </div>
      )}

      <AdSenseBlock
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL}
        className="tool-ad tool-ad--inline"
        pageType="tool"
      />

      {formulaSteps.length > 0 && (
        <div className="formula-steps-section" style={{ marginTop: '1rem' }}>
          <h3 className="formula-steps-title">計算式・途中経過</h3>
          {formulaSteps.map((step, index) => (
            <div key={index} className="formula-step-item">
              <span className="formula-step-label">{step.label}</span>
              <pre className="formula-step-expr">{step.expr}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BeamCalculatorLayout({
  form,
  actions,
  formErrors,
  formWarnings,
  result,
  loadKNNormalized,
  lastEntry,
  formulaSteps,
  text,
  onSubmit,
  onLoadCaseChange,
  onSectionModeChange,
  onShapeChange,
}: BeamCalculatorLayoutProps) {
  return (
    <div>
      <section className="tool-workbench" aria-label="梁計算の入力条件">
        <div className="tool-workbench__section">
          <ToolWorkbenchHeader title="入力条件" />
          <form className="beam-form" onSubmit={onSubmit} noValidate>
            <MaterialSection form={form} actions={actions} formErrors={formErrors} />
            <SpanSection
              form={form}
              actions={actions}
              formErrors={formErrors}
              title={text.spanSectionTitle}
              placeholder={text.spanPlaceholder}
            />
            <LoadSection
              form={form}
              actions={actions}
              formErrors={formErrors}
              text={text}
              onLoadCaseChange={onLoadCaseChange}
            />

            <section className="beam-section">
              <h2 className="beam-section-title">④ 断面性能</h2>
              <div className="beam-toggle-group" style={{ marginBottom: '1rem', alignSelf: 'flex-start' }}>
                <button
                  type="button"
                  className={`beam-toggle-btn${form.sectionMode === 'shape' ? ' beam-toggle-btn--active' : ''}`}
                  onClick={() => onSectionModeChange('shape')}
                >
                  形状から計算
                </button>
                <button
                  type="button"
                  className={`beam-toggle-btn${form.sectionMode === 'direct' ? ' beam-toggle-btn--active' : ''}`}
                  onClick={() => onSectionModeChange('direct')}
                >
                  直接入力
                </button>
              </div>

              {form.sectionMode === 'shape' ? (
                <ShapeSection form={form} actions={actions} formErrors={formErrors} onShapeChange={onShapeChange} />
              ) : (
                <DirectSection form={form} actions={actions} formErrors={formErrors} />
              )}
            </section>

            <DeflectionSection form={form} actions={actions} formErrors={formErrors} text={text} />

            <section className="beam-section">
              <h2 className="beam-section-title">⑥ 用途メモ（任意）</h2>
              <div className="form-group" style={{ maxWidth: 480 }}>
                <label htmlFor="purpose">用途メモ</label>
                <input
                  id="purpose"
                  type="text"
                  placeholder={text.purposePlaceholder}
                  value={form.purpose}
                  onChange={(event) => actions.setPurpose(event.target.value)}
                  maxLength={120}
                />
              </div>
            </section>

            {formWarnings.length > 0 && (
              <div className="beam-warnings">
                {formWarnings.map((warning, index) => (
                  <p key={index} className="beam-warning-item">⚠ {warning}</p>
                ))}
              </div>
            )}

            <div className="form-submit-row">
              <button type="submit" className="calc-btn">計算する</button>
            </div>
          </form>
        </div>

        {result && (
          <div className="tool-workbench__section tool-workbench__section--results">
            <ResultSection
              form={form}
              result={result}
              loadKNNormalized={loadKNNormalized}
              lastEntry={lastEntry}
              formulaSteps={formulaSteps}
              text={text}
            />
          </div>
        )}
      </section>
      <div className="beam-notes-section">
        <h3>注記</h3>
        <ul>
          {text.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
