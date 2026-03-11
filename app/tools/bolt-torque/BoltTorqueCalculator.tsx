'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  addEngHistoryEntry,
  type EngHistoryEntry,
} from '@/lib/engHistory';
import { printEngReport } from '@/lib/printReport';
import { trackToolCalculate } from '@/lib/analytics/events';
import {
  calculateBoltTorque,
  validateBoltTorqueInput,
  type BoltTorqueMode,
  type BoltStrengthClass,
} from '@/lib/bolts/torque';
import ToolWorkbenchHeader from '@/app/components/ToolWorkbenchHeader';
import AdSenseBlock from '@/app/components/AdSenseBlock';

const DIAMETER_PRESETS = [
  { label: 'M6', d: 6, p: 1 },
  { label: 'M8', d: 8, p: 1.25 },
  { label: 'M10', d: 10, p: 1.5 },
  { label: 'M12', d: 12, p: 1.75 },
  { label: 'M16', d: 16, p: 2 },
  { label: 'M20', d: 20, p: 2.5 },
  { label: 'M24', d: 24, p: 3 },
] as const;

function fmt(value: number | undefined | null, digits = 3): string {
  if (value == null || !Number.isFinite(value)) return '-';
  return value.toLocaleString('ja-JP', { maximumFractionDigits: digits });
}

export default function BoltTorqueCalculator() {
  const [preset, setPreset] = useState('M12');
  const [diameter, setDiameter] = useState('12');
  const [pitch, setPitch] = useState('1.75');
  const [strengthClass, setStrengthClass] = useState<BoltStrengthClass>('8.8');
  const [friction, setFriction] = useState('0.15');
  const [mode, setMode] = useState<BoltTorqueMode>('preload-to-torque');
  const [preload, setPreload] = useState('35');
  const [torque, setTorque] = useState('85');
  const [purpose, setPurpose] = useState('');
  const [lastEntry, setLastEntry] = useState<EngHistoryEntry | null>(null);
  const [committed, setCommitted] = useState<ReturnType<typeof calculateBoltTorque> | null>(null);

  const parsed = useMemo(
    () => ({
      nominalDiameter_mm: parseFloat(diameter),
      pitch_mm: parseFloat(pitch),
      strengthClass,
      frictionCoefficient: parseFloat(friction),
      mode,
      targetPreload_kN: parseFloat(preload),
      targetTorque_Nm: parseFloat(torque),
    }),
    [diameter, friction, mode, pitch, preload, strengthClass, torque],
  );

  const errors = useMemo(() => validateBoltTorqueInput(parsed), [parsed]);

  function handlePresetChange(value: string) {
    setPreset(value);
    const matched = DIAMETER_PRESETS.find((item) => item.label === value);
    if (!matched) return;
    setDiameter(String(matched.d));
    setPitch(String(matched.p));
  }

  function handleCalculate() {
    if (errors.length > 0) return;
    const result = calculateBoltTorque(parsed);
    const entry = addEngHistoryEntry({
      toolId: 'bolt-torque',
      toolName: 'ボルトトルク計算',
      inputs: {
        material: '',
        purpose: purpose.trim() || undefined,
        shapeKey: preset,
        shapeName: `ボルト ${preset}`,
        dims: {
          呼び径: `${diameter} mm`,
          ピッチ: `${pitch} mm`,
          強度区分: strengthClass,
          摩擦係数: friction,
          モード: mode === 'preload-to-torque' ? '軸力→トルク' : 'トルク→軸力',
          ...(mode === 'preload-to-torque' ? { '目標軸力 F_t': `${preload} kN` } : { '目標トルク T': `${torque} N·m` }),
        },
        rawDims: {
          nominalDiameter_mm: parsed.nominalDiameter_mm,
          pitch_mm: parsed.pitch_mm,
          frictionCoefficient: parsed.frictionCoefficient,
          targetPreload_kN: parsed.targetPreload_kN ?? 0,
          targetTorque_Nm: parsed.targetTorque_Nm ?? 0,
        },
        mode,
      },
      results: {
        torque_Nm: result.torque_Nm ?? undefined,
        preload_kN: result.preload_kN ?? undefined,
        nutFactor: result.nutFactor,
        tensileStress_MPa: result.tensileStress_MPa,
        proofStressRatio: result.proofStressRatio,
        bearingStress_MPa: result.bearingStress_MPa,
      },
      formulaSteps: result.formulaSteps,
    });
    setCommitted(result);
    setLastEntry(entry);
    trackToolCalculate({ toolId: 'bolt-torque', category: 'ねじ・締結' });
  }

  return (
    <div className="section-prop-wrap">
      <section className="tool-workbench" aria-label="ボルトトルク計算の入力条件">
        <div className="tool-workbench__section">
          <ToolWorkbenchHeader title="入力条件" />
          <div className="beam-section">
            <h2 className="beam-section-title">① ボルト条件</h2>
            <div className="section-inputs-box section-properties-form">
              <div className="form-group section-properties-form__field">
                <label>呼び径プリセット</label>
                <select value={preset} onChange={(e) => handlePresetChange(e.target.value)}>
                  {DIAMETER_PRESETS.map((item) => (
                    <option key={item.label} value={item.label}>{item.label}</option>
                  ))}
                </select>
              </div>
              <Field label="呼び径 d [mm]" value={diameter} onChange={setDiameter} />
              <Field label="ピッチ P [mm]" value={pitch} onChange={setPitch} />
              <div className="form-group section-properties-form__field">
                <label>強度区分</label>
                <select value={strengthClass} onChange={(e) => setStrengthClass(e.target.value as BoltStrengthClass)}>
                  <option value="4.8">4.8</option>
                  <option value="8.8">8.8</option>
                  <option value="10.9">10.9</option>
                </select>
              </div>
              <Field label="摩擦係数 μ" value={friction} onChange={setFriction} />
            </div>
          </div>

          <div className="beam-section">
            <h2 className="beam-section-title">② モード</h2>
            <div className="section-shape-tabs">
              {(['preload-to-torque', 'torque-to-preload'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`section-shape-tab${mode === value ? ' section-shape-tab--active' : ''}`}
                  onClick={() => setMode(value)}
                >
                  {value === 'preload-to-torque' ? '軸力→トルク' : 'トルク→軸力'}
                </button>
              ))}
            </div>
          </div>

          <div className="beam-section">
            <h2 className="beam-section-title">③ 目標値</h2>
            <div className="section-inputs-box section-properties-form">
              {mode === 'preload-to-torque' ? (
                <Field label="目標軸力 F_t [kN]" value={preload} onChange={setPreload} />
              ) : (
                <Field label="目標トルク T [N·m]" value={torque} onChange={setTorque} />
              )}
              <div className="form-group section-properties-form__purpose">
                <label htmlFor="torque-purpose">用途メモ（任意）</label>
                <input id="torque-purpose" type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
              </div>
              {errors.map((error) => (
                <p key={error} className="error-message">{error}</p>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button type="button" className="calc-btn" disabled={errors.length > 0} onClick={handleCalculate}>
              計算する
            </button>
          </div>
        </div>
      </section>

      {committed ? (
        <>
          <div className="beam-section section-results">
            <div className="section-results-header">
              <h2 className="beam-section-title" style={{ margin: 0 }}>計算結果</h2>
              <button type="button" className="pdf-btn" onClick={() => lastEntry && printEngReport(lastEntry)}>
                PDF出力
              </button>
            </div>
            <div className="beam-result-table-wrap">
              <table className="beam-result-table">
                <tbody>
                  <ResultRow label={mode === 'preload-to-torque' ? '計算トルク' : '計算軸力'} value={mode === 'preload-to-torque' ? `${fmt(committed.torque_Nm, 2)} N·m` : `${fmt(committed.preload_kN, 3)} kN`} />
                  <ResultRow label="工具係数 K" value={`${fmt(committed.nutFactor, 3)} N·m/kN`} />
                  <ResultRow label="推奨安全率範囲" value={committed.recommendedSafetyRange} />
                  <ResultRow label="ねじ面圧" value={`${fmt(committed.bearingStress_MPa, 1)} MPa`} />
                  <ResultRow label="軸応力 / 耐力比" value={`${fmt(committed.tensileStress_MPa, 1)} MPa / ${fmt(committed.proofStressRatio, 3)}`} />
                </tbody>
              </table>
            </div>
            <p className="beam-note" style={{ marginTop: '1rem' }}>
              <Link href="/articles/bolt-strength-class-selection">ボルト強度区分の解説へ</Link>
            </p>
          </div>
          <div className="beam-section">
            <h2 className="beam-section-title">計算式</h2>
            {committed.formulaSteps.map((step) => (
              <div key={step.label} className="formula-block">
                <p className="formula-block__label">{step.label}</p>
                <pre className="formula-block__expr">{step.expr}</pre>
              </div>
            ))}
          </div>
          <AdSenseBlock slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL} className="tool-ad" pageType="tool" />
        </>
      ) : null}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="form-group section-properties-form__field">
      <label>{label}</label>
      <input type="number" min="0" step="any" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <th>{label}</th>
      <td className="val">{value}</td>
    </tr>
  );
}
