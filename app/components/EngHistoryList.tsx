'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  loadEngHistory,
  deleteEngHistoryEntry,
  clearEngHistory,
  type EngHistoryEntry,
} from '@/lib/engHistory';
import { printEngReport } from '@/lib/printReport';
import { fmt } from '@/lib/beams/units';

const fmtDate = (ts: number) =>
  new Date(ts).toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });

function numFmt(v: number, d: number): string {
  return parseFloat(fmt(v, d)).toLocaleString('ja-JP', {
    minimumFractionDigits: d, maximumFractionDigits: d,
  });
}

// ─── Single card ──────────────────────────────────────────────────────────────

function EngHistoryCard({
  entry,
  onDelete,
}: {
  entry: EngHistoryEntry;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const r = entry.results;

  return (
    <li className="eng-history-card">
      <div className="history-card-top">
        <div className="eng-history-card-meta">
          <span className="eng-history-tool-badge">{entry.toolName}</span>
          <span className="history-date">{fmtDate(entry.timestamp)}</span>
          <span className="eng-history-shape">{entry.inputs.shapeName}</span>
          {entry.inputs.purpose && (
            <span className="eng-history-purpose">📌 {entry.inputs.purpose}</span>
          )}
        </div>
        <div className="eng-history-card-actions">
          <button
            type="button"
            className="pdf-btn pdf-btn--sm"
            onClick={() => printEngReport(entry)}
          >
            PDF出力
          </button>
          <button
            type="button"
            className="btn-icon"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? '折りたたむ' : '詳細を表示'}
          >
            {expanded ? '▲' : '▼'}
          </button>
          <button
            type="button"
            className="btn-delete"
            onClick={() => onDelete(entry.id)}
            aria-label="この履歴を削除"
          >
            削除
          </button>
        </div>
      </div>

      {/* Summary row */}
      <div className="eng-history-summary">
        {r.Ix_mm4 !== undefined && (
          <span>Ix = {numFmt(r.Ix_mm4 / 10000, 1)} cm⁴</span>
        )}
        {r.Zx_mm3 !== undefined && (
          <span>Zx = {numFmt(r.Zx_mm3 / 1000, 2)} cm³</span>
        )}
        {r.area_mm2 !== undefined && (
          <span>A = {numFmt(r.area_mm2 / 100, 2)} cm²</span>
        )}
        {r.weightKgPerM != null && (
          <span>重量 = {fmt(r.weightKgPerM, 3)} kg/m</span>
        )}
        {r.Mmax_kNm !== undefined && (
          <span>Mmax = {fmt(r.Mmax_kNm, 3)} kN·m</span>
        )}
        {r.sigmaMax_MPa !== undefined && (
          <span>σ = {fmt(r.sigmaMax_MPa, 2)} MPa</span>
        )}
        {r.deltaMax_mm !== undefined && (
          <span>δ = {fmt(r.deltaMax_mm, 2)} mm</span>
        )}
        {r.lBuy_mm !== undefined && (
          <span>推奨購入長さ = {fmt(r.lBuy_mm, 0)} mm</span>
        )}
        {r.Ra_t_total_kN !== undefined && (
          <span>引張耐力 = {fmt(r.Ra_t_total_kN, 2)} kN</span>
        )}
        {r.Ra_v_total_kN !== undefined && (
          <span>せん断耐力 = {fmt(r.Ra_v_total_kN, 2)} kN</span>
        )}
        {r.boltInteractionRatio !== undefined && (
          <span>相互作用 = {fmt(r.boltInteractionRatio, 3)}</span>
        )}
        {r.totalWeight_kg !== undefined && (
          <span>総重量 = {fmt(r.totalWeight_kg, 2)} kg</span>
        )}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="eng-history-detail">
          {/* Inputs */}
          <div className="eng-history-detail-section">
            <p className="eng-history-detail-title">入力寸法</p>
            <table className="eng-history-dim-table">
              <tbody>
                {Object.entries(entry.inputs.dims).map(([label, val]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td className="val">{val}</td>
                  </tr>
                ))}
                {entry.inputs.material && (
                  <tr>
                    <td>材料</td>
                    <td className="val">{entry.inputs.material}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Formula steps */}
          <div className="eng-history-detail-section">
            <p className="eng-history-detail-title">計算式</p>
            <div className="formula-steps-list formula-steps-list--compact">
              {entry.formulaSteps.map((s, i) => (
                <div key={i} className="formula-step-item">
                  <span className="formula-step-label">{s.label}</span>
                  <pre className="formula-step-expr">{s.expr}</pre>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="eng-history-detail-section">
            <p className="eng-history-detail-title">計算結果</p>
            <div className="eng-history-result-grid">
              {r.Ix_mm4 !== undefined && <HistResultRow label="Ix（強軸）" mm={r.Ix_mm4} unitMm="mm⁴" toCm={1/10000} unitCm="cm⁴" dec={1} />}
              {r.Zx_mm3 !== undefined && <HistResultRow label="Zx（強軸）" mm={r.Zx_mm3} unitMm="mm³" toCm={1/1000}  unitCm="cm³" dec={2} />}
              {r.Iy_mm4 !== undefined && <HistResultRow label="Iy（弱軸）" mm={r.Iy_mm4} unitMm="mm⁴" toCm={1/10000} unitCm="cm⁴" dec={1} />}
              {r.Zy_mm3 !== undefined && <HistResultRow label="Zy（弱軸）" mm={r.Zy_mm3} unitMm="mm³" toCm={1/1000}  unitCm="cm³" dec={2} />}
              {r.area_mm2 !== undefined && <HistResultRow label="断面積 A"  mm={r.area_mm2} unitMm="mm²" toCm={1/100}  unitCm="cm²" dec={2} />}
              {r.weightKgPerM != null && (
                <div className="eng-hist-result-row">
                  <span className="eng-hist-result-label">重量</span>
                  <span className="eng-hist-result-value"><strong>{fmt(r.weightKgPerM, 3)}</strong> kg/m</span>
                </div>
              )}
              {r.Mmax_kNm !== undefined && (
                <div className="eng-hist-result-row">
                  <span className="eng-hist-result-label">最大曲げモーメント</span>
                  <span className="eng-hist-result-value"><strong>{fmt(r.Mmax_kNm, 3)}</strong> kN·m</span>
                </div>
              )}
              {r.sigmaMax_MPa !== undefined && (
                <div className="eng-hist-result-row">
                  <span className="eng-hist-result-label">曲げ応力</span>
                  <span className="eng-hist-result-value">
                    <strong>{fmt(r.sigmaMax_MPa, 2)}</strong> MPa
                    <span className="eng-hist-result-sub"> ({r.stressOK ? 'OK' : 'NG'})</span>
                  </span>
                </div>
              )}
              {r.deltaMax_mm !== undefined && (
                <div className="eng-hist-result-row">
                  <span className="eng-hist-result-label">最大たわみ</span>
                  <span className="eng-hist-result-value">
                    <strong>{fmt(r.deltaMax_mm, 2)}</strong> mm
                    <span className="eng-hist-result-sub"> / 許容 {fmt(r.deltaAllow_mm ?? 0, 2)} mm ({r.deflectionOK ? 'OK' : 'NG'})</span>
                  </span>
                </div>
              )}
              {r.lRequired_mm !== undefined && (
                <div className="eng-hist-result-row">
                  <span className="eng-hist-result-label">必要長さ</span>
                  <span className="eng-hist-result-value"><strong>{fmt(r.lRequired_mm, 2)}</strong> mm</span>
                </div>
              )}
              {r.lBuy_mm !== undefined && (
                <div className="eng-hist-result-row">
                  <span className="eng-hist-result-label">推奨購入長さ</span>
                  <span className="eng-hist-result-value"><strong>{fmt(r.lBuy_mm, 0)}</strong> mm</span>
                </div>
              )}
              {r.Ra_t_kN !== undefined && (
                <div className="eng-hist-result-row">
                  <span className="eng-hist-result-label">許容引張耐力</span>
                  <span className="eng-hist-result-value"><strong>{fmt(r.Ra_t_kN, 2)}</strong> kN/本</span>
                </div>
              )}
              {r.Ra_v_kN !== undefined && (
                <div className="eng-hist-result-row">
                  <span className="eng-hist-result-label">許容せん断耐力</span>
                  <span className="eng-hist-result-value"><strong>{fmt(r.Ra_v_kN, 2)}</strong> kN/本</span>
                </div>
              )}
              {r.Ra_t_total_kN !== undefined && (
                <div className="eng-hist-result-row">
                  <span className="eng-hist-result-label">引張耐力合計</span>
                  <span className="eng-hist-result-value"><strong>{fmt(r.Ra_t_total_kN, 2)}</strong> kN</span>
                </div>
              )}
              {r.Ra_v_total_kN !== undefined && (
                <div className="eng-hist-result-row">
                  <span className="eng-hist-result-label">せん断耐力合計</span>
                  <span className="eng-hist-result-value"><strong>{fmt(r.Ra_v_total_kN, 2)}</strong> kN</span>
                </div>
              )}
              {r.boltInteractionRatio !== undefined && (
                <div className="eng-hist-result-row">
                  <span className="eng-hist-result-label">相互作用比</span>
                  <span className="eng-hist-result-value">
                    <strong>{fmt(r.boltInteractionRatio, 3)}</strong>
                    <span className="eng-hist-result-sub"> ({r.boltInteractionOK ? 'OK' : 'NG'})</span>
                  </span>
                </div>
              )}
              {r.totalWeight_kg !== undefined && (
                <div className="eng-hist-result-row">
                  <span className="eng-hist-result-label">総重量</span>
                  <span className="eng-hist-result-value"><strong>{fmt(r.totalWeight_kg, 2)}</strong> kg</span>
                </div>
              )}
              {r.itemCount !== undefined && (
                <div className="eng-hist-result-row">
                  <span className="eng-hist-result-label">明細行数</span>
                  <span className="eng-hist-result-value"><strong>{r.itemCount}</strong> 行</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

function HistResultRow({ label, mm, unitMm, toCm, unitCm, dec }: {
  label: string; mm: number; unitMm: string; toCm: number; unitCm: string; dec: number;
}) {
  return (
    <div className="eng-hist-result-row">
      <span className="eng-hist-result-label">{label}</span>
      <span className="eng-hist-result-value">
        <strong>{fmt(mm, dec)}</strong> {unitMm}
        <span className="eng-hist-result-sub"> = {fmt(mm * toCm, dec)} {unitCm}</span>
      </span>
    </div>
  );
}

// ─── List ─────────────────────────────────────────────────────────────────────

export default function EngHistoryList() {
  const [history, setHistory] = useState<EngHistoryEntry[]>(() => loadEngHistory());

  function handleDelete(id: string) {
    if (!confirm('この計算履歴を削除しますか？')) return;
    deleteEngHistoryEntry(id);
    setHistory(loadEngHistory());
  }

  function handleClearAll() {
    if (!confirm('工学計算の履歴をすべて削除しますか？この操作は元に戻せません。')) return;
    clearEngHistory();
    setHistory([]);
  }

  if (history.length === 0) {
    return (
      <div className="eng-history-empty">
        <p>工学計算の履歴がまだありません。</p>
        <Link href="/tools/section-properties" className="btn-primary">断面性能を計算する</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="history-header">
        <p>{history.length} 件の履歴</p>
        <button type="button" onClick={handleClearAll} className="btn-danger">
          全て削除
        </button>
      </div>
      <ul className="history-list" style={{ listStyle: 'none', padding: 0 }}>
        {history.map((entry) => (
          <EngHistoryCard key={entry.id} entry={entry} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
}
