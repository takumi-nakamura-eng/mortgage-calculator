'use client';

import { useState } from 'react';
import { addEngHistoryEntry, type EngHistoryEntry, type FormulaStep } from '@/lib/engHistory';
import { printEngReport } from '@/lib/printReport';
import { trackToolCalculate } from '@/lib/analytics/events';
import { BOLT_CALC_SPECS, type Diameter } from '@/lib/bolts/specs';
import BoltDimensionDiagram from './BoltDimensionDiagram';

function parseIntegerInRange(
  value: string,
  fieldLabel: string,
  min: number,
  max: number,
): { ok: true; value: number } | { ok: false; error: string } {
  if (value.trim() === '') {
    return { ok: false, error: `${fieldLabel}を入力してください。` };
  }
  if (!/^\d+$/.test(value.trim())) {
    return { ok: false, error: `${fieldLabel}は整数で入力してください。` };
  }
  const num = Number(value);
  if (num < min || num > max) {
    return { ok: false, error: `${fieldLabel}は${min}〜${max}の範囲で入力してください。` };
  }
  return { ok: true, value: num };
}

function ceilToBuyLength(mm: number): number {
  const step = mm <= 100 ? 5 : mm <= 200 ? 10 : 25;
  return Math.ceil(mm / step) * step;
}

interface Result {
  lRequired: number;
  lBuy: number;
  tipAllowance: number;
  breakdown: { label: string; value: number }[];
  diam: Diameter;
  steps: FormulaStep[];
}

export default function BoltCalculator() {
  const [diam, setDiam] = useState<Diameter>('M12');
  const [n, setN] = useState('1');
  const [pw, setPw] = useState('1');
  const [sw, setSw] = useState('0');
  const [t, setT] = useState('12');
  const [purpose, setPurpose] = useState('');
  const [tError, setTError] = useState('');
  const [nError, setNError] = useState('');
  const [pwError, setPwError] = useState('');
  const [swError, setSwError] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [lastEntry, setLastEntry] = useState<EngHistoryEntry | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const tVal = parseFloat(t);
    if (!t || isNaN(tVal) || tVal <= 0) {
      setTError('締結厚さを正の数で入力してください。');
      return;
    }
    setTError('');

    const parsedN = parseIntegerInRange(n, '六角ナット N', 0, 10);
    const parsedPw = parseIntegerInRange(pw, '平座金 PW', 0, 10);
    const parsedSw = parseIntegerInRange(sw, 'ばね座金 SW', 0, 10);
    setNError(parsedN.ok ? '' : parsedN.error);
    setPwError(parsedPw.ok ? '' : parsedPw.error);
    setSwError(parsedSw.ok ? '' : parsedSw.error);
    if (!parsedN.ok || !parsedPw.ok || !parsedSw.ok) return;

    const spec = BOLT_CALC_SPECS[diam];
    const nv = parsedN.value;
    const pwv = parsedPw.value;
    const swv = parsedSw.value;

    const nutTerm = nv * spec.Hnut;
    const pwTerm = pwv * spec.Hpw;
    const swTerm = swv * spec.Hsw;
    const tip = 3 * spec.p;

    const lRequired = tVal + nutTerm + pwTerm + swTerm + tip;
    const lBuy = ceilToBuyLength(lRequired);

    const steps: FormulaStep[] = [
      {
        label: '先端余長',
        expr: `先端余長 = 3p = 3 × ${spec.p.toFixed(2)} = ${tip.toFixed(2)} mm`,
      },
      {
        label: '必要長さ',
        expr:
          `L_required = t + N×Hnut + PW×Hpw + SW×Hsw + 3p\n` +
          `= ${tVal.toFixed(1)} + ${nv}×${spec.Hnut.toFixed(1)} + ${pwv}×${spec.Hpw.toFixed(1)} + ${swv}×${spec.Hsw.toFixed(1)} + ${tip.toFixed(2)}\n` +
          `= ${lRequired.toFixed(2)} mm`,
      },
      {
        label: '推奨購入長さ',
        expr: `規格刻みに切り上げ: ceil(${lRequired.toFixed(2)}) -> ${lBuy} mm`,
      },
    ];

    const nextResult: Result = {
      lRequired,
      lBuy,
      tipAllowance: tip,
      diam,
      steps,
      breakdown: [
        { label: '締結厚さ t', value: tVal },
        { label: `六角ナット N × ${nv}`, value: nutTerm },
        { label: `平座金 PW × ${pwv}`, value: pwTerm },
        { label: `ばね座金 SW × ${swv}`, value: swTerm },
        { label: '先端余長 (3p)', value: tip },
      ],
    };
    setResult(nextResult);

    const entry = addEngHistoryEntry({
      toolId: 'bolt-length',
      toolName: 'ボルト長さ計算',
      inputs: {
        material: 'JIS規格値',
        purpose: purpose.trim() || undefined,
        shapeKey: 'bolt-length',
        shapeName: 'ボルト締結',
        dims: {
          '締結厚さ t': `${tVal.toFixed(1)} mm`,
          ナット枚数: `${nv} 枚`,
          平座金枚数: `${pwv} 枚`,
          ばね座金枚数: `${swv} 枚`,
          ピッチ: `${spec.p} mm`,
        },
        rawDims: {
          t: tVal,
          n: nv,
          pw: pwv,
          sw: swv,
          p: spec.p,
        },
        boltPreset: undefined,
        diameter: diam,
      },
      results: {
        lRequired_mm: lRequired,
        lBuy_mm: lBuy,
        tipAllowance_mm: tip,
      },
      formulaSteps: steps,
    });
    setLastEntry(entry);

    trackToolCalculate({ toolId: 'bolt-length', category: 'ねじ・締結' });
  }

  return (
    <>
      <div className="beam-diagram-wrapper">
        <BoltDimensionDiagram />
      </div>

      <form className="loan-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="diam">呼び径</label>
          <select id="diam" value={diam} onChange={(e) => setDiam(e.target.value as Diameter)}>
            {(Object.keys(BOLT_CALC_SPECS) as Diameter[]).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="thickness">締結厚さ t (mm)</label>
          <input
            id="thickness"
            type="number"
            min="0.1"
            step="0.1"
            placeholder="例: 20"
            value={t}
            onChange={(e) => {
              setT(e.target.value);
              setTError('');
            }}
            className={tError ? 'input-error' : ''}
          />
          {tError && <span className="error-message">{tError}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="nNut">六角ナット N (枚)</label>
          <input
            id="nNut"
            type="number"
            min="0"
            max="10"
            step="1"
            value={n}
            onChange={(e) => {
              setN(e.target.value);
              setNError('');
            }}
            className={nError ? 'input-error' : ''}
          />
          {nError && <span className="error-message">{nError}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="nPw">平座金 PW (枚)</label>
          <input
            id="nPw"
            type="number"
            min="0"
            max="10"
            step="1"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setPwError('');
            }}
            className={pwError ? 'input-error' : ''}
          />
          {pwError && <span className="error-message">{pwError}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="nSw">ばね座金 SW (枚)</label>
          <input
            id="nSw"
            type="number"
            min="0"
            max="10"
            step="1"
            value={sw}
            onChange={(e) => {
              setSw(e.target.value);
              setSwError('');
            }}
            className={swError ? 'input-error' : ''}
          />
          {swError && <span className="error-message">{swError}</span>}
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="bolt-purpose">用途メモ（任意）</label>
          <input
            id="bolt-purpose"
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="例: モーターベース固定"
            maxLength={100}
          />
        </div>

        <div className="form-submit-row">
          <button type="submit" className="btn-primary">計算する</button>
          {lastEntry && (
            <button type="button" className="pdf-btn" onClick={() => printEngReport(lastEntry)}>
              PDF出力
            </button>
          )}
        </div>
      </form>

      {result && (
        <div className="results" style={{ marginTop: '2rem' }}>
          <h2>計算結果</h2>
          <p className="result-meta">
            呼び径 {result.diam}（ピッチ {BOLT_CALC_SPECS[result.diam].p} mm）
          </p>
          <div className="result-cards">
            <div className="result-card result-card--primary">
              <p className="result-label">推奨購入長さ</p>
              <p className="result-value">{result.lBuy} mm</p>
            </div>
            <div className="result-card">
              <p className="result-label">計算値</p>
              <p className="result-value">{result.lRequired.toFixed(2)} mm</p>
            </div>
          </div>

          <div className="table-section">
            <h3>内訳</h3>
            <div className="table-container" style={{ maxHeight: 'none' }}>
              <table className="amortization-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>項目</th>
                    <th>寸法 (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.breakdown.map((row) => (
                    <tr key={row.label}>
                      <td style={{ textAlign: 'left', color: 'var(--text)', fontWeight: 400 }}>
                        {row.label}
                      </td>
                      <td>{row.value.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{ textAlign: 'left', fontWeight: 700, color: 'var(--primary)' }}>
                      合計 (L_required)
                    </td>
                    <td style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      {result.lRequired.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="formula-steps-section" style={{ marginTop: '1.5rem' }}>
            <h3 className="formula-steps-title">計算式・途中経過</h3>
            {result.steps.map((step) => (
              <div key={step.label} className="formula-step-item">
                <span className="formula-step-label">{step.label}</span>
                <pre className="formula-step-expr">{step.expr}</pre>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginTop: '2rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>計算式</h3>
        <code style={{ display: 'block', fontFamily: 'monospace', fontSize: '0.875rem', background: 'var(--bg)', padding: '0.625rem 0.875rem', borderRadius: '0.5rem', marginBottom: '0.75rem', color: 'var(--text)' }}>
          L_required = t + N×Hnut + PW×Hpw + SW×Hsw + 3p
        </code>
        <ul style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', paddingLeft: '1.25rem', lineHeight: 1.7 }}>
          <li>3p = ピッチ p × 3（先端3山分）</li>
          <li>推奨購入長さ: 100mm以下は5mm刻み、200mm以下は10mm刻み、200mm超は25mm刻み</li>
        </ul>
      </div>
    </>
  );
}
