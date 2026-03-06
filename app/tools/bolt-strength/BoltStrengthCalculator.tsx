'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  BOLT_SIZES,
  BOLT_GRADES,
  AS_TABLE,
  GRADE_TABLE,
  type BoltSize,
  type BoltGrade,
} from '@/lib/boltData';
import {
  calcBoltStrength,
  type AreaMode,
  type StrengthBasis,
} from '@/lib/boltStrength';
import { trackToolCalculate } from '@/lib/analytics/events';

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(v: number, d: number = 2): string {
  if (!isFinite(v)) return '-';
  return v.toLocaleString('ja-JP', { minimumFractionDigits: 0, maximumFractionDigits: d });
}

const DEFAULT_KV = 1 / Math.sqrt(3); // 0.5773502691896258

// ─── Component ──────────────────────────────────────────────────────────────

export default function BoltStrengthCalculator() {
  // Inputs
  const [size, setSize] = useState<BoltSize>('M16');
  const [grade, setGrade] = useState<BoltGrade>('8.8');
  const [areaMode, setAreaMode] = useState<AreaMode>('As');
  const [strengthBasis, setStrengthBasis] = useState<StrengthBasis>('Rm_min');
  const [nStr, setNStr] = useState('1');
  const [tensionInput, setTensionInput] = useState('');
  const [shearInput, setShearInput] = useState('');

  // Advanced settings (collapsible)
  const [showSettings, setShowSettings] = useState(false);
  const [gammaT, setGammaT] = useState('1.5');
  const [gammaV, setGammaV] = useState('1.5');
  const [kvStr, setKvStr] = useState(DEFAULT_KV.toString());

  // Reference section
  const [showRef, setShowRef] = useState(false);

  // Track first calculation
  const [tracked, setTracked] = useState(false);

  // Compute
  const result = useMemo(() => {
    const n = parseInt(nStr, 10);
    const gt = parseFloat(gammaT);
    const gv = parseFloat(gammaV);
    const kv = parseFloat(kvStr);

    if (isNaN(n) || n < 1 || !Number.isInteger(n)) return null;
    if (isNaN(gt) || gt <= 0) return null;
    if (isNaN(gv) || gv <= 0) return null;
    if (isNaN(kv) || kv <= 0) return null;

    const N_kN = tensionInput.trim() !== '' ? parseFloat(tensionInput) : undefined;
    const V_kN = shearInput.trim() !== '' ? parseFloat(shearInput) : undefined;

    if (N_kN !== undefined && (isNaN(N_kN) || N_kN < 0)) return null;
    if (V_kN !== undefined && (isNaN(V_kN) || V_kN < 0)) return null;

    return calcBoltStrength({
      size,
      grade,
      areaMode,
      strengthBasis,
      n,
      gamma_t: gt,
      gamma_v: gv,
      kv,
      N_kN,
      V_kN,
    });
  }, [size, grade, areaMode, strengthBasis, nStr, tensionInput, shearInput, gammaT, gammaV, kvStr]);

  // Track once per session
  useEffect(() => {
    if (!result || tracked) return;
    trackToolCalculate({ toolId: 'bolt-strength', category: 'ねじ・締結' });
    const timer = window.setTimeout(() => setTracked(true), 0);
    return () => window.clearTimeout(timer);
  }, [result, tracked]);

  // Copy handler
  function handleCopy() {
    if (!result) return;
    const n = parseInt(nStr, 10);
    const lines = [
      `[ボルト引張・せん断耐力] ${size} / ${grade} / ${areaMode === 'As' ? 'ねじ有効断面積' : '軸断面積'} / ${strengthBasis === 'Rm_min' ? '引張強さ' : '耐力'} / ${n}本`,
      `Aeff = ${fmt(result.Aeff_mm2, 1)} mm²`,
      `S = ${fmt(result.S_Nmm2, 0)} N/mm²`,
      `許容引張耐力 = ${fmt(result.Ra_t_kN, 2)} kN/本 × ${n} = ${fmt(result.Ra_t_total_kN, 2)} kN`,
      `許容せん断耐力 = ${fmt(result.Ra_v_kN, 2)} kN/本 × ${n} = ${fmt(result.Ra_v_total_kN, 2)} kN`,
    ];
    if (result.interaction) {
      const ia = result.interaction;
      lines.push(`相互作用 = ${fmt(ia.ratio, 3)} → ${ia.ok ? 'OK' : 'NG'}${ia.margin !== null ? ` (余裕率 ${fmt(ia.margin, 2)})` : ''}`);
    }
    navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
  }

  const n = parseInt(nStr, 10);

  return (
    <div className="section-prop-wrap">
      {/* ── Inputs ── */}
      <div className="beam-section">
        <h2 className="beam-section-title">入力</h2>

        <div className="beam-row" style={{ marginBottom: '0.75rem' }}>
          <div className="form-group" style={{ flex: '1 1 120px' }}>
            <label htmlFor="bs-size">ボルト呼び径</label>
            <select id="bs-size" value={size} onChange={(e) => setSize(e.target.value as BoltSize)}>
              {BOLT_SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ flex: '1 1 120px' }}>
            <label htmlFor="bs-grade">強度区分</label>
            <select id="bs-grade" value={grade} onChange={(e) => setGrade(e.target.value as BoltGrade)}>
              {BOLT_GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ flex: '1 1 140px' }}>
            <label htmlFor="bs-area">断面の扱い</label>
            <select id="bs-area" value={areaMode} onChange={(e) => setAreaMode(e.target.value as AreaMode)}>
              <option value="As">As（ねじ有効断面積）</option>
              <option value="A">A（軸断面積）</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: '0 0 80px' }}>
            <label htmlFor="bs-n">本数 n</label>
            <input
              id="bs-n"
              type="number"
              min="1"
              step="1"
              value={nStr}
              onChange={(e) => setNStr(e.target.value)}
            />
          </div>
        </div>

        <div className="beam-row" style={{ marginBottom: '0.75rem' }}>
          <div className="form-group" style={{ flex: '1 1 200px' }}>
            <label htmlFor="bs-strength-basis">強度基準</label>
            <select id="bs-strength-basis" value={strengthBasis} onChange={(e) => setStrengthBasis(e.target.value as StrengthBasis)}>
              <option value="Rm_min">Rm_min（最小引張強さ）</option>
              <option value="YieldOrProof_min">耐力最小値（ReL / Rp0.2）</option>
            </select>
          </div>
        </div>

        {/* Interaction loads */}
        <div className="beam-row" style={{ marginBottom: '0.75rem' }}>
          <div className="form-group" style={{ flex: '1 1 140px' }}>
            <label htmlFor="bs-N">引張力 N <span className="unit-label">[kN]</span></label>
            <input
              id="bs-N"
              type="number"
              min="0"
              step="any"
              placeholder="任意"
              value={tensionInput}
              onChange={(e) => setTensionInput(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: '1 1 140px' }}>
            <label htmlFor="bs-V">せん断力 V <span className="unit-label">[kN]</span></label>
            <input
              id="bs-V"
              type="number"
              min="0"
              step="any"
              placeholder="任意"
              value={shearInput}
              onChange={(e) => setShearInput(e.target.value)}
            />
          </div>
        </div>
        <p className="beam-note">引張力・せん断力を入力すると相互作用チェックを行います（任意）</p>

        {/* Advanced settings */}
        <button
          type="button"
          className="bs-toggle-btn"
          onClick={() => setShowSettings((prev) => !prev)}
        >
          {showSettings ? '▾ 詳細設定を閉じる' : '▸ 詳細設定（安全率・kv）'}
        </button>
        {showSettings && (
          <div className="beam-row" style={{ marginTop: '0.5rem' }}>
            <div className="form-group" style={{ flex: '0 0 100px' }}>
              <label htmlFor="bs-gt">γt（引張）</label>
              <input id="bs-gt" type="number" min="0.001" step="any" value={gammaT} onChange={(e) => setGammaT(e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: '0 0 100px' }}>
              <label htmlFor="bs-gv">γv（せん断）</label>
              <input id="bs-gv" type="number" min="0.001" step="any" value={gammaV} onChange={(e) => setGammaV(e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: '0 0 140px' }}>
              <label htmlFor="bs-kv">kv（せん断係数）</label>
              <input id="bs-kv" type="number" min="0.001" step="any" value={kvStr} onChange={(e) => setKvStr(e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {/* ── Results ── */}
      {result ? (
        <div className="beam-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h2 className="beam-section-title" style={{ margin: 0 }}>計算結果</h2>
            <button type="button" className="sw-small-btn" onClick={handleCopy}>結果コピー</button>
          </div>

          <div className="bs-result-grid">
            {/* Tensile */}
            <div className="bs-result-card">
              <p className="bs-result-card-title">許容引張耐力</p>
              <p className="bs-result-main">{fmt(result.Ra_t_kN, 2)} <span className="bs-result-unit">kN/本</span></p>
              {n > 1 && (
                <p className="bs-result-total">× {n}本 = <strong>{fmt(result.Ra_t_total_kN, 2)}</strong> kN</p>
              )}
            </div>

            {/* Shear */}
            <div className="bs-result-card">
              <p className="bs-result-card-title">許容せん断耐力</p>
              <p className="bs-result-main">{fmt(result.Ra_v_kN, 2)} <span className="bs-result-unit">kN/本</span></p>
              {n > 1 && (
                <p className="bs-result-total">× {n}本 = <strong>{fmt(result.Ra_v_total_kN, 2)}</strong> kN</p>
              )}
            </div>
          </div>

          {/* Interaction */}
          {result.interaction && (
            <div className={`bs-interaction ${result.interaction.ok ? 'bs-interaction--ok' : 'bs-interaction--ng'}`}>
              <p className="bs-interaction-title">相互作用チェック</p>
              <p className="bs-interaction-formula">
                N/Ra_t + V/Ra_v = {fmt(result.interaction.N_kN, 1)}/{fmt(result.Ra_t_total_kN, 1)} + {fmt(result.interaction.V_kN, 1)}/{fmt(result.Ra_v_total_kN, 1)} = <strong>{fmt(result.interaction.ratio, 3)}</strong>
              </p>
              <p className="bs-interaction-judge">
                判定：<strong>{result.interaction.ok ? 'OK ≤ 1.0' : 'NG > 1.0'}</strong>
                {result.interaction.margin !== null && (
                  <span className="bs-interaction-margin">（余裕率 {fmt(result.interaction.margin, 2)}）</span>
                )}
              </p>
            </div>
          )}

          {/* Adopted values */}
          <div className="bs-adopted">
            <p className="bs-adopted-title">採用値</p>
            <div className="bs-adopted-grid">
              <span>Aeff = {fmt(result.Aeff_mm2, 1)} mm²（{areaMode === 'As' ? 'ねじ有効断面積' : '軸断面積'}）</span>
              <span>S = {fmt(result.S_Nmm2, 0)} N/mm²（{strengthBasis === 'Rm_min' ? 'Rm_min' : grade === '4.8' ? 'ReL_min' : 'Rp0.2_min'}）</span>
              <span>γt = {gammaT}　γv = {gammaV}　kv = {fmt(parseFloat(kvStr), 5)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="beam-section">
          <p className="beam-note" style={{ textAlign: 'center', padding: '1rem 0' }}>
            入力値を確認してください（本数は1以上の整数、安全率・kvは正の値）
          </p>
        </div>
      )}

      {/* ── Reference ── */}
      <button
        type="button"
        className="bs-toggle-btn"
        onClick={() => setShowRef((prev) => !prev)}
        style={{ marginTop: '0.5rem' }}
      >
        {showRef ? '▾ 根拠・計算式を閉じる' : '▸ 根拠・計算式'}
      </button>
      {showRef && (
        <div className="beam-section" style={{ fontSize: '0.8125rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>このツールの固定値</h3>

          <p style={{ fontWeight: 600, marginBottom: '0.375rem' }}>ねじ有効断面積 As [mm²]（ISOメートル並目）</p>
          <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
            <table className="sw-table" style={{ fontSize: '0.75rem' }}>
              <thead><tr>{BOLT_SIZES.map((s) => <th key={s}>{s}</th>)}</tr></thead>
              <tbody><tr>{BOLT_SIZES.map((s) => <td key={s}>{AS_TABLE[s]}</td>)}</tr></tbody>
            </table>
          </div>

          <p style={{ fontWeight: 600, marginBottom: '0.375rem' }}>強度区分 [N/mm²]</p>
          <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
            <table className="sw-table" style={{ fontSize: '0.75rem' }}>
              <thead>
                <tr><th>区分</th><th>Rm_min</th><th>ReL_min</th><th>Rp0.2_min</th><th>備考</th></tr>
              </thead>
              <tbody>
                {BOLT_GRADES.map((g) => (
                  <tr key={g}>
                    <td style={{ fontWeight: 600 }}>{g}</td>
                    <td>{GRADE_TABLE[g].Rm_min}</td>
                    <td>{GRADE_TABLE[g].ReL_min ?? '-'}</td>
                    <td>{GRADE_TABLE[g].Rp02_min ?? '-'}</td>
                    <td style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{GRADE_TABLE[g].note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary)' }}>使用式</h3>
          <div className="bs-formula-list">
            <p><strong>有効断面積：</strong>As = テーブル値（上記）/ A = π d² / 4</p>
            <p><strong>素材引張耐力：</strong>Rt = Aeff × S [N]</p>
            <p><strong>素材せん断耐力：</strong>Rv = Rt × kv [N]　（kv = 1/√3 ≈ 0.577）</p>
            <p><strong>許容引張耐力：</strong>Ra_t = Rt / γt / 1000 [kN]</p>
            <p><strong>許容せん断耐力：</strong>Ra_v = Rv / γv / 1000 [kN]</p>
            <p><strong>相互作用式：</strong>(N / Ra_t_total) + (V / Ra_v_total) ≤ 1.0</p>
          </div>

          <div className="beam-notes-section" style={{ marginTop: '1rem' }}>
            <h3>注記</h3>
            <ul>
              <li>対象は締結用ボルト（鋼材同士の締結）です。コンクリートアンカー等の破壊モードは対象外です。</li>
              <li>As値はISO 898-1の並目ねじ相当です。細目ねじは異なります。</li>
              <li>8.8の耐力は d ≤ 16mm の保守値（640 N/mm²）を採用しています。</li>
              <li>安全率γのデフォルト1.5は一般的な短期許容値の目安です。設計基準に合わせて変更してください。</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
