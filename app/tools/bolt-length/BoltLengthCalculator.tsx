'use client';

import Link from 'next/link';
import { useState } from 'react';
import { addEngHistoryEntry, type EngHistoryEntry, type FormulaStep } from '@/lib/engHistory';
import { printEngReport } from '@/lib/printReport';
import { trackToolCalculate } from '@/lib/analytics/events';
import { calcBoltLength } from '@/lib/bolts/length';
import { BOLT_CALC_SPECS, type Diameter } from '@/lib/bolts/specs';
import AdSenseBlock from '@/app/components/AdSenseBlock';
import ToolWorkbenchHeader from '@/app/components/ToolWorkbenchHeader';

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

interface Result {
  lRequired: number;
  lBuy: number;
  tipAllowance: number;
  breakdown: { label: string; value: number }[];
  diam: Diameter;
  steps: FormulaStep[];
}

export default function BoltLengthCalculator() {
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

    const nv = parsedN.value;
    const pwv = parsedPw.value;
    const swv = parsedSw.value;
    const spec = BOLT_CALC_SPECS[diam];
    const nextResult: Result = calcBoltLength({
      diam,
      thicknessMm: tVal,
      nutCount: nv,
      plainWasherCount: pwv,
      springWasherCount: swv,
    });
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
        lRequired_mm: nextResult.lRequired,
        lBuy_mm: nextResult.lBuy,
        tipAllowance_mm: nextResult.tipAllowance,
      },
      formulaSteps: nextResult.steps,
    });
    setLastEntry(entry);

    trackToolCalculate({ toolId: 'bolt-length', category: 'ねじ・締結' });
  }

  return (
    <section className="tool-workbench bolt-length-workbench" aria-label="ボルト長さ計算エリア">
      <div className="tool-workbench__section">
        <ToolWorkbenchHeader title="入力条件" />

        <form className="loan-form bolt-length-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group bolt-length-form__field bolt-length-form__field--diameter">
            <label htmlFor="diam">呼び径</label>
            <select id="diam" value={diam} onChange={(e) => setDiam(e.target.value as Diameter)}>
              {(Object.keys(BOLT_CALC_SPECS) as Diameter[]).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="form-group bolt-length-form__field bolt-length-form__field--thickness">
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

          <div className="form-group bolt-length-form__field">
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

          <div className="form-group bolt-length-form__field">
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

          <div className="form-group bolt-length-form__field">
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

          <div className="form-group bolt-length-form__purpose">
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
      </div>

      {result ? (
        <div className="tool-workbench__section tool-workbench__section--results">
          <div className="results bolt-length-results">
            <h2>計算結果</h2>
            <p className="result-meta">
              呼び径 {result.diam}（ピッチ {BOLT_CALC_SPECS[result.diam].p} mm）
            </p>
            <div className="result-cards bolt-length-result-cards">
              <div className="result-card result-card--primary">
                <p className="result-label">推奨購入長さ</p>
                <p className="result-value">{result.lBuy} mm</p>
              </div>
              <div className="result-card">
                <p className="result-label">計算値</p>
                <p className="result-value">{result.lRequired.toFixed(2)} mm</p>
              </div>
            </div>

            <AdSenseBlock
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL}
              className="tool-ad tool-ad--inline"
              pageType="tool"
            />

            <div className="formula-steps-section bolt-length-results__panel">
              <h3 className="formula-steps-title">計算式・途中経過</h3>
              {result.steps.map((step) => (
                <div key={step.label} className="formula-step">
                  <div className="formula-step-label">{step.label}</div>
                  <pre className="formula-step-expr">{step.expr}</pre>
                </div>
              ))}
            </div>
            <p className="beam-note" style={{ marginTop: '1rem' }}>
              ねじ山のかみ合い余裕を別で確認する場合は <Link href="/tools/bolt-effective-thread-length">ボルト有効ねじ長さチェック</Link> を使ってください。
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
