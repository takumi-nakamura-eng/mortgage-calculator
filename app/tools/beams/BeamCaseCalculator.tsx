'use client';

import Link from 'next/link';
import { useState } from 'react';
import ToolWorkbenchHeader from '@/app/components/ToolWorkbenchHeader';
import { trackToolCalculate } from '@/lib/analytics/events';
import { addEngHistoryEntry, type EngHistoryEntry, type EngToolId } from '@/lib/engHistory';
import { printEngReport } from '@/lib/printReport';
import { BEAM_MATERIAL_PRESETS } from '@/lib/materialPresets';
import {
  buildBeamCaseFormulaSteps,
  calculateBeamCase,
  validateBeamCaseInput,
  type BeamLoadType,
  type BeamSupport,
  type BeamCaseInput,
  type BeamCaseResult,
} from '@/lib/beams/beamCases';

interface BeamCaseCalculatorProps {
  toolId: Extract<
    EngToolId,
    | 'simple-supported-point-load'
    | 'simple-supported-uniform-load'
    | 'cantilever-point-load'
    | 'cantilever-uniform-load'
  >;
  toolName: string;
  support: BeamSupport;
  loadType: BeamLoadType;
  defaultDeflectionLimit: number;
}

export default function BeamCaseCalculator({
  toolId,
  toolName,
  support,
  loadType,
  defaultDeflectionLimit,
}: BeamCaseCalculatorProps) {
  const [materialIdx, setMaterialIdx] = useState(0);
  const [E_GPa, setE_GPa] = useState(String(BEAM_MATERIAL_PRESETS[0].E_GPa ?? 205));
  const [sigmaAllow, setSigmaAllow] = useState(String(BEAM_MATERIAL_PRESETS[0].sigmaAllow_MPa ?? 150));
  const [spanMm, setSpanMm] = useState('');
  const [loadValue, setLoadValue] = useState('');
  const [I_mm4, setI_mm4] = useState('');
  const [Z_mm3, setZ_mm3] = useState('');
  const [deflectionLimit, setDeflectionLimit] = useState(String(defaultDeflectionLimit));
  const [purpose, setPurpose] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<string[]>([]);
  const [result, setResult] = useState<BeamCaseResult | null>(null);
  const [lastEntry, setLastEntry] = useState<EngHistoryEntry | null>(null);

  const isCustomMaterial = materialIdx === BEAM_MATERIAL_PRESETS.length - 1;
  const loadLabel = loadType === 'point' ? '荷重 P' : '等分布荷重 w';
  const loadUnit = loadType === 'point' ? 'kN' : 'kN/m';

  function handleMaterialChange(nextIdx: number) {
    setMaterialIdx(nextIdx);
    const preset = BEAM_MATERIAL_PRESETS[nextIdx];
    if (preset.E_GPa !== null) setE_GPa(String(preset.E_GPa));
    if (preset.sigmaAllow_MPa !== null) setSigmaAllow(String(preset.sigmaAllow_MPa));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input: Partial<BeamCaseInput> = {
      support,
      loadType,
      E_GPa: parseFloat(E_GPa),
      sigmaAllow_MPa: parseFloat(sigmaAllow),
      spanMm: parseFloat(spanMm),
      loadValue: parseFloat(loadValue),
      I_mm4: parseFloat(I_mm4),
      Z_mm3: parseFloat(Z_mm3),
      deflectionLimitDenominator: parseFloat(deflectionLimit),
    };

    const validation = validateBeamCaseInput(input);
    setErrors(validation.errors);
    setWarnings(validation.warnings);

    if (Object.keys(validation.errors).length > 0) {
      setResult(null);
      return;
    }

    const normalizedInput = input as BeamCaseInput;
    const nextResult = calculateBeamCase(normalizedInput);
    const formulaSteps = buildBeamCaseFormulaSteps(normalizedInput, nextResult);
    const entry = addEngHistoryEntry({
      toolId,
      toolName,
      inputs: {
        material: BEAM_MATERIAL_PRESETS[materialIdx].label,
        purpose: purpose.trim() || undefined,
        shapeKey: toolId,
        shapeName: toolName,
        dims: {
          '断面二次モーメント I': `${normalizedInput.I_mm4.toLocaleString('ja-JP')} mm⁴`,
          '断面係数 Z': `${normalizedInput.Z_mm3.toLocaleString('ja-JP')} mm³`,
        },
        rawDims: {
          I_mm4: normalizedInput.I_mm4,
          Z_mm3: normalizedInput.Z_mm3,
        },
        loadCase: loadType === 'point' ? 'center' : 'uniform',
        loadKN: loadType === 'point' ? normalizedInput.loadValue : nextResult.totalLoad_kN,
        loadDisplayStr:
          loadType === 'point'
            ? `${formatNumber(normalizedInput.loadValue, 3)} kN`
            : `${formatNumber(normalizedInput.loadValue, 3)} kN/m`,
        L_mm: normalizedInput.spanMm,
        E_GPa: normalizedInput.E_GPa,
        sigmaAllow_MPa: normalizedInput.sigmaAllow_MPa,
        deflectionLimitN: normalizedInput.deflectionLimitDenominator,
        sectionMode: 'direct',
        I_mm4_input: normalizedInput.I_mm4,
        Z_mm3_input: normalizedInput.Z_mm3,
      },
      results: {
        reactionSummary: nextResult.reactions.map((reaction) => `${reaction.label}: ${formatNumber(reaction.value, 3)} ${reaction.unit}`),
        Mmax_kNm: nextResult.maxMoment_kNm,
        sigmaMax_MPa: nextResult.maxBendingStress_MPa,
        stressOK: nextResult.stressOk,
        deltaMax_mm: nextResult.maxDeflection_mm,
        deltaAllow_mm: nextResult.allowableDeflection_mm,
        deflectionOK: nextResult.deflectionOk,
      },
      formulaSteps,
    });

    setResult(nextResult);
    setLastEntry(entry);
    trackToolCalculate({ toolId, category: '梁・断面' });
  }

  return (
    <section className="tool-workbench" aria-label={`${toolName}の入力条件`}>
      <div className="tool-workbench__section">
        <ToolWorkbenchHeader title="入力条件" />
        <form className="beam-form" onSubmit={handleSubmit}>
          <section className="beam-section">
            <h2 className="beam-section-title">① 材質 / ヤング率</h2>
            <div className="beam-row">
              <div className="form-group" style={{ flex: '1 1 220px' }}>
                <label htmlFor={`${toolId}-material`}>材質プリセット</label>
                <select
                  id={`${toolId}-material`}
                  value={materialIdx}
                  onChange={(event) => handleMaterialChange(Number(event.target.value))}
                >
                  {BEAM_MATERIAL_PRESETS.map((material, index) => (
                    <option key={material.label} value={index}>{material.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ flex: '1 1 180px' }}>
                <label htmlFor={`${toolId}-E`}>
                  ヤング率 E <span className="unit-label">[GPa]</span>
                </label>
                <input
                  id={`${toolId}-E`}
                  type="number"
                  min="0.001"
                  step="any"
                  value={E_GPa}
                  onChange={(event) => setE_GPa(event.target.value)}
                  disabled={!isCustomMaterial}
                  className={`${errors.E_GPa ? 'input-error' : ''}${!isCustomMaterial ? ' input-disabled' : ''}`}
                />
                {errors.E_GPa && <span className="error-message">{errors.E_GPa}</span>}
              </div>
              <div className="form-group" style={{ flex: '1 1 180px' }}>
                <label htmlFor={`${toolId}-sigma`}>
                  許容応力 <span className="unit-label">[MPa]</span>
                </label>
                <input
                  id={`${toolId}-sigma`}
                  type="number"
                  min="0.001"
                  step="any"
                  value={sigmaAllow}
                  onChange={(event) => setSigmaAllow(event.target.value)}
                  className={errors.sigmaAllow ? 'input-error' : ''}
                />
                {errors.sigmaAllow && <span className="error-message">{errors.sigmaAllow}</span>}
              </div>
            </div>
          </section>

          <section className="beam-section">
            <h2 className="beam-section-title">② スパン</h2>
            <div className="beam-row">
              <div className="form-group" style={{ flex: '1 1 220px' }}>
                <label htmlFor={`${toolId}-span`}>
                  スパン L <span className="unit-label">[mm]</span>
                </label>
                <input
                  id={`${toolId}-span`}
                  type="number"
                  min="0.001"
                  step="any"
                  placeholder="例: 3000"
                  value={spanMm}
                  onChange={(event) => setSpanMm(event.target.value)}
                  className={errors.span ? 'input-error' : ''}
                />
                {errors.span && <span className="error-message">{errors.span}</span>}
              </div>
            </div>
          </section>

          <section className="beam-section">
            <h2 className="beam-section-title">③ 荷重</h2>
            <div className="beam-row">
              <div className="form-group" style={{ flex: '1 1 220px' }}>
                <label htmlFor={`${toolId}-load`}>
                  {loadLabel} <span className="unit-label">[{loadUnit}]</span>
                </label>
                <input
                  id={`${toolId}-load`}
                  type="number"
                  min="0.001"
                  step="any"
                  placeholder={loadType === 'point' ? '例: 12' : '例: 3.5'}
                  value={loadValue}
                  onChange={(event) => setLoadValue(event.target.value)}
                  className={errors.load ? 'input-error' : ''}
                />
                {errors.load && <span className="error-message">{errors.load}</span>}
              </div>
            </div>
          </section>

          <section className="beam-section">
            <h2 className="beam-section-title">④ 断面性能</h2>
            <div className="beam-row">
              <div className="form-group" style={{ flex: '1 1 220px' }}>
                <label htmlFor={`${toolId}-I`}>
                  断面二次モーメント I <span className="unit-label">[mm⁴]</span>
                </label>
                <input
                  id={`${toolId}-I`}
                  type="number"
                  min="0.001"
                  step="any"
                  placeholder="例: 35400000"
                  value={I_mm4}
                  onChange={(event) => setI_mm4(event.target.value)}
                  className={errors.I ? 'input-error' : ''}
                />
                {errors.I && <span className="error-message">{errors.I}</span>}
              </div>
              <div className="form-group" style={{ flex: '1 1 220px' }}>
                <label htmlFor={`${toolId}-Z`}>
                  断面係数 Z <span className="unit-label">[mm³]</span>
                </label>
                <input
                  id={`${toolId}-Z`}
                  type="number"
                  min="0.001"
                  step="any"
                  placeholder="例: 354000"
                  value={Z_mm3}
                  onChange={(event) => setZ_mm3(event.target.value)}
                  className={errors.Z ? 'input-error' : ''}
                />
                {errors.Z && <span className="error-message">{errors.Z}</span>}
              </div>
            </div>
            <p className="beam-note">
              断面性能が未確定の場合は <Link href="/tools/section-properties">断面性能計算ツール</Link> で I と Z を確認してください。
            </p>
          </section>

          <section className="beam-section">
            <h2 className="beam-section-title">⑤ 許容たわみ比</h2>
            <div className="beam-row">
              <div className="form-group" style={{ flex: '1 1 220px' }}>
                <label htmlFor={`${toolId}-deflection`}>
                  N / L 比の分母 N <span className="unit-label">[-]</span>
                </label>
                <input
                  id={`${toolId}-deflection`}
                  type="number"
                  min="1"
                  step="1"
                  placeholder="例: 300"
                  value={deflectionLimit}
                  onChange={(event) => setDeflectionLimit(event.target.value)}
                  className={errors.deflection ? 'input-error' : ''}
                />
                {errors.deflection && <span className="error-message">{errors.deflection}</span>}
                <span className="beam-conv">許容たわみ = L / {deflectionLimit || defaultDeflectionLimit}</span>
              </div>
              <div className="form-group" style={{ flex: '1 1 260px' }}>
                <label htmlFor={`${toolId}-purpose`}>用途メモ（任意）</label>
                <input
                  id={`${toolId}-purpose`}
                  type="text"
                  placeholder="例: 床梁の一次検討"
                  value={purpose}
                  onChange={(event) => setPurpose(event.target.value)}
                  maxLength={100}
                />
              </div>
            </div>
          </section>

          {warnings.length > 0 ? (
            <div className="beam-warnings">
              {warnings.map((warning) => (
                <p key={warning} className="beam-warning-item">{warning}</p>
              ))}
            </div>
          ) : null}

          <div className="form-submit-row">
            <button type="submit" className="calc-btn">計算する</button>
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
          <div className="beam-section">
            <h2 className="beam-section-title">計算結果</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="sw-table">
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>結果</th>
                    <th>判定 / 比較</th>
                  </tr>
                </thead>
                <tbody>
                  {result.reactions.map((reaction) => (
                    <tr key={reaction.label}>
                      <td>{reaction.label}</td>
                      <td>{formatNumber(reaction.value, 3)} {reaction.unit}</td>
                      <td>-</td>
                    </tr>
                  ))}
                  <tr>
                    <td>最大曲げモーメント</td>
                    <td>{formatNumber(result.maxMoment_kNm, 4)} kN·m</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>最大たわみ</td>
                    <td>{formatNumber(result.maxDeflection_mm, 4)} mm</td>
                    <td>
                      許容 {formatNumber(result.allowableDeflection_mm, 4)} mm に対して {result.deflectionOk ? 'OK' : 'NG'}
                    </td>
                  </tr>
                  <tr>
                    <td>最大曲げ応力</td>
                    <td>{formatNumber(result.maxBendingStress_MPa, 3)} MPa</td>
                    <td>
                      許容 {formatNumber(result.allowableStress_MPa, 3)} MPa に対して {result.stressOk ? 'OK' : 'NG'}
                    </td>
                  </tr>
                  <tr>
                    <td>荷重条件</td>
                    <td>
                      {loadType === 'point'
                        ? `${formatNumber(result.totalLoad_kN, 3)} kN`
                        : `${formatNumber(result.lineLoad_kN_per_m ?? 0, 3)} kN/m`}
                    </td>
                    <td>
                      {loadType === 'uniform'
                        ? `総荷重 ${formatNumber(result.totalLoad_kN, 3)} kN`
                        : '集中荷重'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="beam-note" style={{ marginTop: '1rem' }}>
              自重や接合部の剛性低下は考慮していません。最終判断は適用基準と実部材条件を確認してください。
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function formatNumber(value: number, digits: number): string {
  return value.toLocaleString('ja-JP', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}
