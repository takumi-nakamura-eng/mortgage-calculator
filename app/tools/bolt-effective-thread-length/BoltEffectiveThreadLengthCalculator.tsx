'use client';

import Link from 'next/link';
import { useState } from 'react';
import ToolWorkbenchHeader from '@/app/components/ToolWorkbenchHeader';
import { trackToolCalculate } from '@/lib/analytics/events';
import { calculateBoltEffectiveThread } from '@/lib/bolts/effectiveThread';
import { BOLT_CALC_SPECS, type Diameter } from '@/lib/bolts/specs';
import { addEngHistoryEntry, type EngHistoryEntry } from '@/lib/engHistory';
import { printEngReport } from '@/lib/printReport';

function parseWholeNumber(value: string, label: string): string {
  if (!/^\d+$/.test(value.trim())) return `${label}は0以上の整数で入力してください。`;
  return '';
}

export default function BoltEffectiveThreadLengthCalculator() {
  const [diameter, setDiameter] = useState<Diameter>('M12');
  const [plateThickness, setPlateThickness] = useState('12');
  const [nutCount, setNutCount] = useState('1');
  const [plainWasherCount, setPlainWasherCount] = useState('1');
  const [springWasherCount, setSpringWasherCount] = useState('0');
  const [purpose, setPurpose] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ReturnType<typeof calculateBoltEffectiveThread> | null>(null);
  const [lastEntry, setLastEntry] = useState<EngHistoryEntry | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    const thicknessValue = parseFloat(plateThickness);
    if (!Number.isFinite(thicknessValue) || thicknessValue <= 0) {
      nextErrors.plateThickness = '板厚 t は正の数を入力してください。';
    }

    const nutError = parseWholeNumber(nutCount, 'ナット枚数');
    const plainWasherError = parseWholeNumber(plainWasherCount, '平座金枚数');
    const springWasherError = parseWholeNumber(springWasherCount, 'ばね座金枚数');
    if (nutError) nextErrors.nutCount = nutError;
    if (plainWasherError) nextErrors.plainWasherCount = plainWasherError;
    if (springWasherError) nextErrors.springWasherCount = springWasherError;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setResult(null);
      return;
    }

    const calculated = calculateBoltEffectiveThread({
      diameter,
      plateThicknessMm: thicknessValue,
      nutCount: parseInt(nutCount, 10),
      plainWasherCount: parseInt(plainWasherCount, 10),
      springWasherCount: parseInt(springWasherCount, 10),
    });

    const entry = addEngHistoryEntry({
      toolId: 'bolt-effective-thread-length',
      toolName: 'ボルト有効ねじ長さチェック',
      inputs: {
        material: 'JIS規格値',
        purpose: purpose.trim() || undefined,
        shapeKey: 'bolt-effective-thread-length',
        shapeName: '有効ねじ長さ',
        dims: {
          呼び径: diameter,
          '板厚 t': `${thicknessValue.toFixed(1)} mm`,
          ナット枚数: `${nutCount} 枚`,
          平座金枚数: `${plainWasherCount} 枚`,
          ばね座金枚数: `${springWasherCount} 枚`,
        },
        rawDims: {
          plateThicknessMm: thicknessValue,
          nutCount: parseInt(nutCount, 10),
          plainWasherCount: parseInt(plainWasherCount, 10),
          springWasherCount: parseInt(springWasherCount, 10),
        },
        diameter,
      },
      results: {
        lRequired_mm: calculated.requiredThreadLengthMm,
        tipAllowance_mm: calculated.threadProjectionMm,
      },
      formulaSteps: calculated.steps,
    });

    setResult(calculated);
    setLastEntry(entry);
    trackToolCalculate({ toolId: 'bolt-effective-thread-length', category: 'ねじ・締結' });
  }

  return (
    <section className="tool-workbench bolt-length-workbench" aria-label="ボルト有効ねじ長さチェック">
      <div className="tool-workbench__section">
        <ToolWorkbenchHeader title="入力条件" />
        <form className="loan-form bolt-length-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group bolt-length-form__field bolt-length-form__field--diameter">
            <label htmlFor="betl-diameter">呼び径</label>
            <select id="betl-diameter" value={diameter} onChange={(event) => setDiameter(event.target.value as Diameter)}>
              {(Object.keys(BOLT_CALC_SPECS) as Diameter[]).map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="form-group bolt-length-form__field bolt-length-form__field--thickness">
            <label htmlFor="betl-thickness">板厚 t (mm)</label>
            <input
              id="betl-thickness"
              type="number"
              min="0.1"
              step="0.1"
              value={plateThickness}
              onChange={(event) => setPlateThickness(event.target.value)}
              className={errors.plateThickness ? 'input-error' : ''}
            />
            {errors.plateThickness && <span className="error-message">{errors.plateThickness}</span>}
          </div>

          <div className="form-group bolt-length-form__field">
            <label htmlFor="betl-nut-count">ナット枚数</label>
            <input
              id="betl-nut-count"
              type="number"
              min="0"
              step="1"
              value={nutCount}
              onChange={(event) => setNutCount(event.target.value)}
              className={errors.nutCount ? 'input-error' : ''}
            />
            {errors.nutCount && <span className="error-message">{errors.nutCount}</span>}
          </div>

          <div className="form-group bolt-length-form__field">
            <label htmlFor="betl-plain-washer">平座金枚数</label>
            <input
              id="betl-plain-washer"
              type="number"
              min="0"
              step="1"
              value={plainWasherCount}
              onChange={(event) => setPlainWasherCount(event.target.value)}
              className={errors.plainWasherCount ? 'input-error' : ''}
            />
            {errors.plainWasherCount && <span className="error-message">{errors.plainWasherCount}</span>}
          </div>

          <div className="form-group bolt-length-form__field">
            <label htmlFor="betl-spring-washer">ばね座金枚数</label>
            <input
              id="betl-spring-washer"
              type="number"
              min="0"
              step="1"
              value={springWasherCount}
              onChange={(event) => setSpringWasherCount(event.target.value)}
              className={errors.springWasherCount ? 'input-error' : ''}
            />
            {errors.springWasherCount && <span className="error-message">{errors.springWasherCount}</span>}
          </div>

          <div className="form-group bolt-length-form__purpose">
            <label htmlFor="betl-purpose">用途メモ（任意）</label>
            <input
              id="betl-purpose"
              type="text"
              value={purpose}
              onChange={(event) => setPurpose(event.target.value)}
              placeholder="例: ベースプレート締結"
              maxLength={100}
            />
          </div>

          <div className="form-submit-row">
            <button type="submit" className="btn-primary">チェックする</button>
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
            <h2>チェック結果</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="sw-table">
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>結果</th>
                    <th>判定 / 補足</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>グリップ長</td>
                    <td>{result.gripLengthMm.toFixed(2)} mm</td>
                    <td>板厚 + 座金構成</td>
                  </tr>
                  <tr>
                    <td>有効かみ合い長</td>
                    <td>{result.engagedThreadLengthMm.toFixed(2)} mm</td>
                    <td>
                      目安 {result.minimumEngagementMm.toFixed(2)} mm に対して {result.engagementOk ? 'OK' : 'NG'}
                    </td>
                  </tr>
                  <tr>
                    <td>必要ねじ長さ</td>
                    <td>{result.requiredThreadLengthMm.toFixed(2)} mm</td>
                    <td>グリップ長 + ナット高さ + 先端3p</td>
                  </tr>
                  <tr>
                    <td>先端余長</td>
                    <td>{result.threadProjectionMm.toFixed(2)} mm</td>
                    <td>3p = 3 × {result.pitchMm.toFixed(2)} mm</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="beam-note" style={{ marginTop: '1rem' }}>
              購入長さまで確認する場合は <Link href="/tools/bolt-length">ボルト長さ計算ツール</Link> を使ってください。
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
