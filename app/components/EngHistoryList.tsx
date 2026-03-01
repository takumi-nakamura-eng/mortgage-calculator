'use client';

import { useState, useEffect } from 'react';
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
                <tr>
                  <td>材料</td>
                  <td className="val">{entry.inputs.material}</td>
                </tr>
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
  const [history, setHistory] = useState<EngHistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadEngHistory());
  }, []);

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
        <a href="/tools/section-properties" className="btn-primary">断面性能を計算する</a>
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
