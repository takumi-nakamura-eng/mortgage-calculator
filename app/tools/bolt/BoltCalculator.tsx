'use client';

import { useState } from 'react';

type Diameter = 'M6' | 'M8' | 'M10' | 'M12' | 'M16' | 'M20' | 'M24';

const SPECS: Record<Diameter, { p: number; Hnut: number; Hpw: number; Hsw: number }> = {
  M6:  { p: 1.0,  Hnut: 5.2,  Hpw: 1.6, Hsw: 1.6 },
  M8:  { p: 1.25, Hnut: 6.8,  Hpw: 1.6, Hsw: 2.0 },
  M10: { p: 1.5,  Hnut: 8.4,  Hpw: 2.0, Hsw: 2.5 },
  M12: { p: 1.75, Hnut: 10.8, Hpw: 2.5, Hsw: 3.0 },
  M16: { p: 2.0,  Hnut: 14.8, Hpw: 3.0, Hsw: 4.0 },
  M20: { p: 2.5,  Hnut: 18.0, Hpw: 3.0, Hsw: 5.1 },
  M24: { p: 3.0,  Hnut: 21.5, Hpw: 4.0, Hsw: 5.6 },
};

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
}

export default function BoltCalculator() {
  const [diam, setDiam] = useState<Diameter>('M12');
  const [n, setN] = useState('1');
  const [pw, setPw] = useState('1');
  const [sw, setSw] = useState('1');
  const [t, setT] = useState('');
  const [tError, setTError] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tVal = parseFloat(t);
    if (!t || isNaN(tVal) || tVal <= 0) {
      setTError('締結厚さを正の数で入力してください。');
      return;
    }
    setTError('');

    const spec = SPECS[diam];
    const nv = Math.max(0, parseInt(n) || 0);
    const pwv = Math.max(0, parseInt(pw) || 0);
    const swv = Math.max(0, parseInt(sw) || 0);
    const tip = 3 * spec.p;
    const lRequired =
      tVal + nv * spec.Hnut + pwv * spec.Hpw + swv * spec.Hsw + tip;

    setResult({
      lRequired,
      lBuy: ceilToBuyLength(lRequired),
      tipAllowance: tip,
      diam,
      breakdown: [
        { label: '締結厚さ t', value: tVal },
        { label: `六角ナット N × ${nv}`, value: nv * spec.Hnut },
        { label: `平座金 PW × ${pwv}`, value: pwv * spec.Hpw },
        { label: `ばね座金 SW × ${swv}`, value: swv * spec.Hsw },
        { label: '先端余長 (3p)', value: tip },
      ],
    });
  }

  return (
    <>
      <form className="loan-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="diam">呼び径</label>
          <select
            id="diam"
            value={diam}
            onChange={(e) => setDiam(e.target.value as Diameter)}
          >
            {(Object.keys(SPECS) as Diameter[]).map((d) => (
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
            onChange={(e) => { setT(e.target.value); setTError(''); }}
            className={tError ? 'input-error' : ''}
          />
          {tError && <span className="error-message">{tError}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="nNut">
            六角ナット N (枚){' '}
            <small style={{ color: 'var(--text-muted)', fontWeight: 400 }}>JIS B 1181（1種）</small>
          </label>
          <input id="nNut" type="number" min="0" max="10" value={n} onChange={(e) => setN(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="nPw">
            平座金 PW (枚){' '}
            <small style={{ color: 'var(--text-muted)', fontWeight: 400 }}>JIS B 1256（並形）</small>
          </label>
          <input id="nPw" type="number" min="0" max="10" value={pw} onChange={(e) => setPw(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="nSw">
            ばね座金 SW (枚){' '}
            <small style={{ color: 'var(--text-muted)', fontWeight: 400 }}>JIS B 1251</small>
          </label>
          <input id="nSw" type="number" min="0" max="10" value={sw} onChange={(e) => setSw(e.target.value)} />
        </div>

        <div className="form-submit-row">
          <button type="submit" className="btn-primary">計算する</button>
        </div>
      </form>

      {result && (
        <div className="results" style={{ marginTop: '2rem' }}>
          <h2>計算結果</h2>
          <p className="result-meta">
            呼び径 {result.diam}（ピッチ {SPECS[result.diam].p} mm）
          </p>
          <div className="result-cards">
            <div className="result-card result-card--primary">
              <p className="result-label">推奨購入長さ</p>
              <p className="result-value">{result.lBuy} mm</p>
            </div>
            <div className="result-card">
              <p className="result-label">計算値</p>
              <p className="result-value">{result.lRequired.toFixed(1)} mm</p>
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
                      <td>{row.value.toFixed(1)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{ textAlign: 'left', fontWeight: 700, color: 'var(--primary)' }}>
                      合計 (L_required)
                    </td>
                    <td style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      {result.lRequired.toFixed(1)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
          <li>推奨購入長さ：≤100mm → 5mm刻み / ≤200mm → 10mm刻み / 200mm超 → 25mm刻み</li>
        </ul>
      </div>

      <div className="table-section" style={{ marginTop: '3rem' }}>
        <h3>参考寸法テーブル</h3>
        <div className="table-container" style={{ maxHeight: 'none' }}>
          <table className="amortization-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>呼び径</th>
                <th>p (mm)</th>
                <th>Hnut (mm)</th>
                <th>Hpw (mm)</th>
                <th>Hsw (mm)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(SPECS).map(([d, s]) => (
                <tr key={d}>
                  <td style={{ textAlign: 'left', fontWeight: 500 }}>{d}</td>
                  <td>{s.p}</td>
                  <td>{s.Hnut}</td>
                  <td>{s.Hpw}</td>
                  <td>{s.Hsw}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.75rem', lineHeight: 1.7 }}>
          Hnut：JIS B 1181（スタイル1相当）｜Hpw：JIS B 1256 並形相当｜Hsw：JIS B 1251 厚さ最小値
        </p>
      </div>
    </>
  );
}
