'use client';

import { useState, useMemo } from 'react';
import { addEngHistoryEntry, type EngHistoryEntry, type FormulaStep } from '@/lib/engHistory';
import {
  BOLT_SIZES,
  BOLT_GRADES,
  AS_TABLE,
  GRADE_TABLE,
  type BoltSize,
  type BoltGrade,
} from '@/lib/bolts/data';
import {
  calcBoltStrength,
  type AreaMode,
  type StrengthBasis,
} from '@/lib/bolts/strength';
import { trackToolCalculate } from '@/lib/analytics/events';
import { printEngReport } from '@/lib/printReport';
import AdSenseBlock from '@/app/components/AdSenseBlock';
import ToolWorkbenchHeader from '@/app/components/ToolWorkbenchHeader';

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
  const [purpose, setPurpose] = useState('');

  // Advanced settings (collapsible)
  const [showSettings, setShowSettings] = useState(false);
  const [gammaT, setGammaT] = useState('1.5');
  const [gammaV, setGammaV] = useState('1.5');
  const [kvStr, setKvStr] = useState(DEFAULT_KV.toString());

  // Reference section
  const [showRef, setShowRef] = useState(false);
  const [lastEntry, setLastEntry] = useState<EngHistoryEntry | null>(null);

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
  const formulaSteps = useMemo<FormulaStep[]>(() => {
    if (!result) return [];
    const basisLabel = strengthBasis === 'Rm_min' ? 'Rm_min' : grade === '4.8' ? 'ReL_min' : 'Rp0.2_min';
    const steps: FormulaStep[] = [
      { label: '採用断面積 Aeff', expr: `Aeff = ${fmt(result.Aeff_mm2, 1)} mm² (${areaMode === 'As' ? 'ねじ有効断面積 As' : '軸断面積 A'})` },
      { label: '採用強度 S', expr: `S = ${fmt(result.S_Nmm2, 0)} N/mm² (${basisLabel})` },
      { label: '許容引張耐力', expr: `Ra_t = (Aeff × S) / γt / 1000 = (${fmt(result.Aeff_mm2, 1)} × ${fmt(result.S_Nmm2, 0)}) / ${gammaT} / 1000 = ${fmt(result.Ra_t_kN, 2)} kN/本\nRa_t_total = ${fmt(result.Ra_t_kN, 2)} × ${n} = ${fmt(result.Ra_t_total_kN, 2)} kN` },
      { label: '許容せん断耐力', expr: `Ra_v = (Aeff × S × kv) / γv / 1000 = (${fmt(result.Aeff_mm2, 1)} × ${fmt(result.S_Nmm2, 0)} × ${fmt(parseFloat(kvStr), 5)}) / ${gammaV} / 1000 = ${fmt(result.Ra_v_kN, 2)} kN/本\nRa_v_total = ${fmt(result.Ra_v_kN, 2)} × ${n} = ${fmt(result.Ra_v_total_kN, 2)} kN` },
    ];
    if (result.interaction) {
      steps.push({
        label: '相互作用チェック',
        expr: `N/Ra_t + V/Ra_v = ${fmt(result.interaction.N_kN, 2)} / ${fmt(result.Ra_t_total_kN, 2)} + ${fmt(result.interaction.V_kN, 2)} / ${fmt(result.Ra_v_total_kN, 2)} = ${fmt(result.interaction.ratio, 3)} → ${result.interaction.ok ? 'OK' : 'NG'}`,
      });
    }
    return steps;
  }, [result, areaMode, strengthBasis, grade, gammaT, gammaV, kvStr, n]);

  function handleSave() {
    if (!result) return;
    const entry = addEngHistoryEntry({
      toolId: 'bolt-strength',
      toolName: 'ボルト引張・せん断耐力計算',
      inputs: {
        material: 'JIS / ISO 規格値',
        purpose: purpose.trim() || undefined,
        shapeKey: 'bolt-strength',
        shapeName: '締結用ボルト',
        dims: {
          '呼び径': size,
          '強度区分': grade,
          '断面の扱い': areaMode === 'As' ? 'As（ねじ有効断面積）' : 'A（軸断面積）',
          '強度基準': strengthBasis === 'Rm_min' ? 'Rm_min（最小引張強さ）' : '耐力最小値',
          '本数 n': `${n} 本`,
          '引張力 N': tensionInput.trim() ? `${tensionInput} kN` : '未入力',
          'せん断力 V': shearInput.trim() ? `${shearInput} kN` : '未入力',
          '安全率・係数': `γt=${gammaT}, γv=${gammaV}, kv=${fmt(parseFloat(kvStr), 5)}`,
        },
        rawDims: {
          n,
          gammaT: parseFloat(gammaT),
          gammaV: parseFloat(gammaV),
          kv: parseFloat(kvStr),
          N_kN: tensionInput.trim() ? parseFloat(tensionInput) : 0,
          V_kN: shearInput.trim() ? parseFloat(shearInput) : 0,
        },
        diameter: size,
      },
      results: {
        Ra_t_kN: result.Ra_t_kN,
        Ra_v_kN: result.Ra_v_kN,
        Ra_t_total_kN: result.Ra_t_total_kN,
        Ra_v_total_kN: result.Ra_v_total_kN,
        boltInteractionRatio: result.interaction?.ratio,
        boltInteractionOK: result.interaction?.ok,
        Aeff_mm2: result.Aeff_mm2,
        S_Nmm2: result.S_Nmm2,
      },
      formulaSteps,
    });
    setLastEntry(entry);
    trackToolCalculate({ toolId: 'bolt-strength', category: 'ねじ・締結' });
  }

  return (
    <div className="section-prop-wrap">
      <section className="tool-workbench" aria-label="ボルト耐力計算の入力条件">
        <div className="tool-workbench__section">
          <ToolWorkbenchHeader title="入力条件" />

        <div className="beam-section">
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

        <div className="beam-section">
          <h2 className="beam-section-title">用途メモ（任意）</h2>
          <div className="form-group" style={{ maxWidth: 480 }}>
            <label htmlFor="bs-purpose">用途メモ</label>
            <input
              id="bs-purpose"
              type="text"
              placeholder="例: ベースプレート締結の一次確認"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              maxLength={120}
            />
          </div>
        </div>

        <div className="form-submit-row">
          <button type="button" className="calc-btn" disabled={!result} onClick={handleSave}>計算する</button>
          {lastEntry && (
            <button type="button" className="pdf-btn" onClick={() => printEngReport(lastEntry)}>
              PDF出力
            </button>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      {result ? (
        <div className="tool-workbench__section tool-workbench__section--results">
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

          <AdSenseBlock
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL}
            className="tool-ad tool-ad--inline"
            pageType="tool"
          />

          <div className="formula-steps-section" style={{ marginTop: '1rem' }}>
            <h3 className="formula-steps-title">計算式・途中経過</h3>
            {formulaSteps.map((step) => (
              <div key={step.label} className="formula-step-item">
                <span className="formula-step-label">{step.label}</span>
                <pre className="formula-step-expr">{step.expr}</pre>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="tool-workbench__section tool-workbench__section--results">
          <p className="beam-note" style={{ textAlign: 'center', padding: '1rem 0' }}>
            入力値を確認してください（本数は1以上の整数、安全率・kvは正の値）
          </p>
        </div>
      )}
      </section>

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
