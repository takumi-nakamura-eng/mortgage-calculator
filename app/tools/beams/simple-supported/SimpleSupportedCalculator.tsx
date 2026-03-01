'use client';

import { useState, useCallback } from 'react';
import {
  calcSimpleBeam,
  validateBeamInputs,
  type LoadCase,
  type BeamResult,
  type ValidationError,
  type ValidationWarning,
} from '@/lib/beams/simpleBeam';
import {
  kgToKN,
  kNToKg,
  GPaToMPa,
  cm3ToMm3,
  cm4ToMm4,
  fmt,
} from '@/lib/beams/units';

// ─── Constants ────────────────────────────────────────────────────────────────

const MATERIAL_PRESETS = [
  { label: '炭素鋼（一般）', E_GPa: 205, sigmaAllow_MPa: 150 },
  { label: 'SUS304', E_GPa: 193, sigmaAllow_MPa: 130 },
  { label: 'アルミ（参考）', E_GPa: 69, sigmaAllow_MPa: 80 },
  { label: 'カスタム', E_GPa: null, sigmaAllow_MPa: null },
] as const;

const DEFLECTION_LIMITS = [200, 250, 300, 360, 400] as const;

type LoadUnit = 'kg' | 'kN';
type ZUnit = 'cm3' | 'mm3';
type IUnit = 'cm4' | 'mm4';

// ─── Component ────────────────────────────────────────────────────────────────

export default function SimpleSupportedCalculator() {
  // ── Material ────────────────────────────────────────────────────────────
  const [materialIdx, setMaterialIdx] = useState(0);
  const [E_GPa, setE_GPa] = useState<string>('205');
  const [sigmaAllow, setSigmaAllow] = useState<string>('150');

  // ── Span ────────────────────────────────────────────────────────────────
  const [L, setL] = useState<string>('');

  // ── Load ────────────────────────────────────────────────────────────────
  const [loadCase, setLoadCase] = useState<LoadCase>('center');
  const [loadValue, setLoadValue] = useState<string>('');
  const [loadUnit, setLoadUnit] = useState<LoadUnit>('kg');

  // ── Section ─────────────────────────────────────────────────────────────
  const [Z, setZ] = useState<string>('');
  const [ZUnit, setZUnit] = useState<ZUnit>('cm3');
  const [I, setI] = useState<string>('');
  const [IUnit, setIUnit] = useState<IUnit>('cm4');

  // ── Deflection limit ─────────────────────────────────────────────────────
  const [deflectionN, setDeflectionN] = useState<number>(300);

  // ── Results ──────────────────────────────────────────────────────────────
  const [result, setResult] = useState<BeamResult | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [warnings, setWarnings] = useState<ValidationWarning[]>([]);
  const [loadKNNormalized, setLoadKNNormalized] = useState<number | null>(null);

  // ── Material preset change ────────────────────────────────────────────────
  function handleMaterialChange(idx: number) {
    setMaterialIdx(idx);
    const preset = MATERIAL_PRESETS[idx];
    if (preset.E_GPa !== null) setE_GPa(String(preset.E_GPa));
    if (preset.sigmaAllow_MPa !== null) setSigmaAllow(String(preset.sigmaAllow_MPa));
  }

  // ── Load unit toggle: convert displayed value to keep same physics ────────
  const handleLoadUnitChange = useCallback(
    (newUnit: LoadUnit) => {
      if (newUnit === loadUnit) return;
      const v = parseFloat(loadValue);
      if (!isNaN(v) && v > 0) {
        if (loadUnit === 'kg' && newUnit === 'kN') {
          setLoadValue(fmt(kgToKN(v), 4));
        } else if (loadUnit === 'kN' && newUnit === 'kg') {
          setLoadValue(fmt(kNToKg(v), 2));
        }
      }
      setLoadUnit(newUnit);
    },
    [loadUnit, loadValue],
  );

  // ── Z unit toggle ─────────────────────────────────────────────────────────
  const handleZUnitChange = useCallback(
    (newUnit: ZUnit) => {
      if (newUnit === ZUnit) return;
      const v = parseFloat(Z);
      if (!isNaN(v) && v > 0) {
        if (ZUnit === 'cm3' && newUnit === 'mm3') {
          setZ(fmt(v * 1000, 4));
        } else if (ZUnit === 'mm3' && newUnit === 'cm3') {
          setZ(fmt(v / 1000, 6));
        }
      }
      setZUnit(newUnit);
    },
    [ZUnit, Z],
  );

  // ── I unit toggle ─────────────────────────────────────────────────────────
  const handleIUnitChange = useCallback(
    (newUnit: IUnit) => {
      if (newUnit === IUnit) return;
      const v = parseFloat(I);
      if (!isNaN(v) && v > 0) {
        if (IUnit === 'cm4' && newUnit === 'mm4') {
          setI(fmt(v * 10000, 4));
        } else if (IUnit === 'mm4' && newUnit === 'cm4') {
          setI(fmt(v / 10000, 6));
        }
      }
      setIUnit(newUnit);
    },
    [IUnit, I],
  );

  // ── Calculation ───────────────────────────────────────────────────────────
  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();

    // Parse & normalise inputs
    const L_mm = parseFloat(L);

    const loadRaw = parseFloat(loadValue);
    const loadKN = isNaN(loadRaw)
      ? null
      : loadUnit === 'kg'
      ? kgToKN(loadRaw)
      : loadRaw;

    const E_GPa_num = parseFloat(E_GPa);
    const E_MPa = isNaN(E_GPa_num) ? null : GPaToMPa(E_GPa_num);

    const Z_raw = parseFloat(Z);
    const Z_mm3 = isNaN(Z_raw) ? null : ZUnit === 'cm3' ? cm3ToMm3(Z_raw) : Z_raw;

    const I_raw = parseFloat(I);
    const I_mm4 = isNaN(I_raw) ? null : IUnit === 'cm4' ? cm4ToMm4(I_raw) : I_raw;

    const sigmaAllowNum = parseFloat(sigmaAllow);

    // Validate
    const validation = validateBeamInputs(
      isNaN(L_mm) ? null : L_mm,
      loadKN,
      E_MPa,
      I_mm4,
      Z_mm3,
      isNaN(sigmaAllowNum) ? null : sigmaAllowNum,
    );

    setErrors(validation.errors);
    setWarnings(validation.warnings);

    if (!validation.valid) {
      setResult(null);
      setLoadKNNormalized(null);
      return;
    }

    // Calculate
    const loadN = loadKN! * 1000;
    const res = calcSimpleBeam({
      L: L_mm,
      loadCase,
      loadN,
      E: E_MPa!,
      I: I_mm4!,
      Z: Z_mm3!,
      sigmaAllow: sigmaAllowNum,
      deflectionLimitN: deflectionN,
    });

    setResult(res);
    setLoadKNNormalized(loadKN!);
  }

  // ── Error helper ─────────────────────────────────────────────────────────
  function fieldError(field: string): string | undefined {
    return errors.find((e) => e.field === field)?.message;
  }

  // ── Computed display values ───────────────────────────────────────────────
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

  const wKNperMDisplay =
    wDisplay ? fmt(parseFloat(wDisplay) * 1000, 4) : null;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── INPUT FORM ── */}
      <form className="beam-form" onSubmit={handleCalculate} noValidate>

        {/* 1. Material */}
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
            <div className="form-group" style={{ flex: '1 1 180px' }}>
              <label htmlFor="E_GPa">
                ヤング率 E{' '}
                <span className="unit-label">[GPa]</span>
              </label>
              <input
                id="E_GPa"
                type="number"
                min="0.001"
                step="any"
                placeholder="例: 205"
                value={E_GPa}
                onChange={(e) => { setE_GPa(e.target.value); setMaterialIdx(3); }}
                className={fieldError('E') ? 'input-error' : ''}
              />
              {fieldError('E') && <span className="error-message">{fieldError('E')}</span>}
            </div>
            <div className="form-group" style={{ flex: '1 1 180px' }}>
              <label htmlFor="sigmaAllow">
                許容曲げ応力 σ_allow{' '}
                <span className="unit-label">[MPa]</span>
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
                className={fieldError('sigmaAllow') ? 'input-error' : ''}
              />
              {fieldError('sigmaAllow') && <span className="error-message">{fieldError('sigmaAllow')}</span>}
            </div>
          </div>
          <p className="beam-note">
            許容応力の初期値はあくまで目安です。設計基準・仕様書に従い必ず調整してください。
          </p>
        </section>

        {/* 2. Span */}
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
                className={fieldError('L') ? 'input-error' : ''}
              />
              {fieldError('L') && <span className="error-message">{fieldError('L')}</span>}
            </div>
          </div>
        </section>

        {/* 3. Load */}
        <section className="beam-section">
          <h2 className="beam-section-title">③ 荷重</h2>
          {/* Load case selector */}
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
                {' '}
                <span className="unit-label">[{loadUnit}]</span>
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
                  className={fieldError('load') ? 'input-error' : ''}
                />
                <div className="beam-toggle-group beam-toggle-group--small">
                  <button
                    type="button"
                    className={`beam-toggle-btn beam-toggle-btn--small${loadUnit === 'kg' ? ' beam-toggle-btn--active' : ''}`}
                    onClick={() => handleLoadUnitChange('kg')}
                  >
                    kg
                  </button>
                  <button
                    type="button"
                    className={`beam-toggle-btn beam-toggle-btn--small${loadUnit === 'kN' ? ' beam-toggle-btn--active' : ''}`}
                    onClick={() => handleLoadUnitChange('kN')}
                  >
                    kN
                  </button>
                </div>
              </div>
              {fieldError('load') && <span className="error-message">{fieldError('load')}</span>}
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

        {/* 4. Section properties */}
        <section className="beam-section">
          <h2 className="beam-section-title">④ 断面性能（直接入力）</h2>
          <p className="beam-note" style={{ marginBottom: '1rem' }}>
            断面係数 Z・断面二次モーメント I をカタログや計算ツールから入力してください。
          </p>
          <div className="beam-row">
            {/* Z */}
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
                  className={fieldError('Z') ? 'input-error' : ''}
                />
                <div className="beam-toggle-group beam-toggle-group--small">
                  <button
                    type="button"
                    className={`beam-toggle-btn beam-toggle-btn--small${ZUnit === 'cm3' ? ' beam-toggle-btn--active' : ''}`}
                    onClick={() => handleZUnitChange('cm3')}
                  >
                    cm³
                  </button>
                  <button
                    type="button"
                    className={`beam-toggle-btn beam-toggle-btn--small${ZUnit === 'mm3' ? ' beam-toggle-btn--active' : ''}`}
                    onClick={() => handleZUnitChange('mm3')}
                  >
                    mm³
                  </button>
                </div>
              </div>
              {fieldError('Z') && <span className="error-message">{fieldError('Z')}</span>}
            </div>

            {/* I */}
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
                  className={fieldError('I') ? 'input-error' : ''}
                />
                <div className="beam-toggle-group beam-toggle-group--small">
                  <button
                    type="button"
                    className={`beam-toggle-btn beam-toggle-btn--small${IUnit === 'cm4' ? ' beam-toggle-btn--active' : ''}`}
                    onClick={() => handleIUnitChange('cm4')}
                  >
                    cm⁴
                  </button>
                  <button
                    type="button"
                    className={`beam-toggle-btn beam-toggle-btn--small${IUnit === 'mm4' ? ' beam-toggle-btn--active' : ''}`}
                    onClick={() => handleIUnitChange('mm4')}
                  >
                    mm⁴
                  </button>
                </div>
              </div>
              {fieldError('I') && <span className="error-message">{fieldError('I')}</span>}
            </div>
          </div>
        </section>

        {/* 5. Allowables */}
        <section className="beam-section">
          <h2 className="beam-section-title">⑤ 許容値</h2>
          <div className="beam-row">
            <div className="form-group" style={{ flex: '1 1 200px' }}>
              <label htmlFor="deflectionN">
                許容たわみ基準
              </label>
              <select
                id="deflectionN"
                value={deflectionN}
                onChange={(e) => setDeflectionN(Number(e.target.value))}
              >
                {DEFLECTION_LIMITS.map((n) => (
                  <option key={n} value={n}>L / {n}</option>
                ))}
              </select>
              {L && !isNaN(parseFloat(L)) && parseFloat(L) > 0 && (
                <span className="beam-conv">
                  → δ_allow = {fmt(parseFloat(L) / deflectionN, 2)} mm
                  （L = {L} mm）
                </span>
              )}
            </div>
          </div>

          {/* Deflection limit reference */}
          <div className="beam-ref-box">
            <p className="beam-ref-title">📖 許容たわみの参考</p>
            <p className="beam-ref-text">
              許容たわみは用途・適用規準によって異なります。下記は一般的な参考情報です。
              最終判断は設計基準・仕様書に従ってください。
            </p>
            <ul className="beam-ref-links">
              <li>
                <a
                  href="https://www.clearcalcs.com/support/advanced-tips-and-tricks/how-to-design-a-steel-beam-to-aisc-360-16"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AISC 360-16 鋼梁設計とたわみ制限の解説（英語）→ L/360 など
                </a>
              </li>
              <li>
                <a
                  href="https://fgg-web.fgg.uni-lj.si/~/pmoze/esdep/master/wg14/l1000.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Eurocode 系のたわみ目安解説（英語）→ L/250〜L/300 など
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="beam-warnings">
            {warnings.map((w, i) => (
              <p key={i} className="beam-warning-item">⚠ {w.message}</p>
            ))}
          </div>
        )}

        {/* Submit */}
        <div className="form-submit-row">
          <button type="submit" className="btn-primary">計算する</button>
        </div>
      </form>

      {/* ── RESULTS ── */}
      {result && (
        <div className="results" style={{ marginTop: '2rem' }}>
          <h2>計算結果</h2>
          <p className="result-meta">
            {loadCase === 'center' ? '中央集中荷重' : '等分布荷重（総荷重入力）'}
            {' / '}
            {loadKNNormalized !== null && `荷重 ${fmt(loadKNNormalized, 2)} kN`}
            {loadUnit === 'kg' && loadValue && ` (${loadValue} kg)`}
            {' / '}
            スパン L = {L} mm
          </p>

          <div className="result-cards">
            {/* Bending moment */}
            <div className="result-card">
              <p className="result-label">最大曲げモーメント M_max</p>
              <p className="result-value" style={{ fontSize: '1.25rem' }}>
                {fmt(result.Mmax_kNm, 3)} kN·m
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                = {(result.Mmax_Nmm / 1e6).toFixed(3)} × 10⁶ N·mm
              </p>
            </div>

            {/* Stress */}
            <div
              className={`result-card${result.stressOK ? ' result-card--ok' : ' result-card--ng'}`}
            >
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

            {/* Deflection */}
            <div
              className={`result-card${result.deflectionOK ? ' result-card--ok' : ' result-card--ng'}`}
            >
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

          {/* Distributed load detail */}
          {loadCase === 'uniform' && result.w_kN_per_m !== undefined && (
            <div className="beam-formula-box" style={{ marginTop: '0' }}>
              <span className="beam-formula-label">線荷重 w（内部値）</span>
              <span className="beam-formula-value">
                w = {fmt(result.w_N_per_mm!, 6)} N/mm
                <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                  = <strong>{fmt(result.w_kN_per_m!, 4)} kN/m</strong>
                </span>
              </span>
            </div>
          )}

          {/* Formulas reference */}
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '1.5rem',
              marginTop: '1.5rem',
            }}
          >
            <h3
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.75rem',
              }}
            >
              使用した計算式（N–mm–MPa 系）
            </h3>
            {loadCase === 'center' ? (
              <>
                <code style={codeStyle}>M_max = P × L / 4</code>
                <code style={codeStyle}>δ_max = P × L³ / (48 × E × I)</code>
              </>
            ) : (
              <>
                <code style={codeStyle}>w = W_total / L　（線荷重）</code>
                <code style={codeStyle}>M_max = w × L² / 8</code>
                <code style={codeStyle}>δ_max = 5 × w × L⁴ / (384 × E × I)</code>
              </>
            )}
            <code style={codeStyle}>σ_max = M_max / Z</code>
          </div>
        </div>
      )}

      {/* ── NOTES ── */}
      <div className="beam-notes-section">
        <h3>注記</h3>
        <ul>
          <li>梁の自重（等分布荷重相当）は本ツールでは考慮していません（将来追加予定）。</li>
          <li>許容応力・許容たわみは用途・適用規準によって異なります。ここでは入力値・選択値に基づく簡易判定です。</li>
          <li>計算結果は参考値です。最終判断は設計基準・仕様書・専門家にご確認ください。</li>
        </ul>
      </div>
    </div>
  );
}

const codeStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'monospace',
  fontSize: '0.875rem',
  background: 'var(--bg)',
  padding: '0.5rem 0.875rem',
  borderRadius: '0.5rem',
  marginBottom: '0.375rem',
  color: 'var(--text)',
};
