/**
 * Generates and prints an A4-format calculation report.
 * Uses window.open + window.print (no external PDF library required).
 * The user can "Save as PDF" from the browser print dialog.
 */

import type { EngHistoryEntry } from './engHistory';
import { fmt } from './beams/units';
import { getSectionSVGString } from './beams/sectionSVG';
import type { SectionShape } from './beams/sections'; // for type cast

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

function numRow(label: string, mm: number, unitMm: string, toCm: number, unitCm: string, dec: number): string {
  const mmVal = parseFloat(fmt(mm, dec)).toLocaleString('ja-JP', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const cmVal = parseFloat(fmt(mm * toCm, dec)).toLocaleString('ja-JP', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  return `<tr><td>${label}</td><td class="val">${mmVal}</td><td>${unitMm}</td><td class="val">${cmVal}</td><td>${unitCm}</td></tr>`;
}

// ─── HTML builder ─────────────────────────────────────────────────────────────

function buildSectionPropertiesReport(entry: EngHistoryEntry): string {
  const r = entry.results;

  // ── SVG: use stored shapeKey (reliable) ──
  const svgString = getSectionSVGString(
    (entry.inputs.shapeKey ?? entry.inputs.shapeName) as SectionShape,
  );

  // ── Input rows (shape + dims + material) ──
  const inputRows = [
    `<tr><td>断面形状</td><td class="val" colspan="2">${entry.inputs.shapeName}</td></tr>`,
    ...Object.entries(entry.inputs.dims).map(
      ([label, val]) => `<tr><td>${label}</td><td class="val">${val}</td></tr>`,
    ),
    `<tr><td>材料</td><td class="val" colspan="2">${entry.inputs.material}</td></tr>`,
  ].join('');

  // ── Formula rows ──
  const formulaRows = entry.formulaSteps
    .map(s => `
      <div class="formula-step">
        <span class="formula-label">${s.label}</span>
        <pre class="formula-expr">${s.expr}</pre>
      </div>`)
    .join('');

  // ── Result rows ──
  let resultRows = '';
  if (r.Ix_mm4 !== undefined) resultRows += numRow('断面二次モーメント Ix（強軸）', r.Ix_mm4, 'mm⁴', 1/10000, 'cm⁴', 1);
  if (r.Zx_mm3 !== undefined) resultRows += numRow('断面係数 Zx（強軸）',          r.Zx_mm3, 'mm³', 1/1000,  'cm³', 2);
  if (r.Iy_mm4 !== undefined) resultRows += numRow('断面二次モーメント Iy（弱軸）', r.Iy_mm4, 'mm⁴', 1/10000, 'cm⁴', 1);
  if (r.Zy_mm3 !== undefined) resultRows += numRow('断面係数 Zy（弱軸）',           r.Zy_mm3, 'mm³', 1/1000,  'cm³', 2);
  if (r.area_mm2 !== undefined) resultRows += numRow('断面積 A',                    r.area_mm2, 'mm²', 1/100,  'cm²', 2);
  if (r.weightKgPerM != null)
    resultRows += `<tr><td>重量（単位長さあたり）</td><td class="val" colspan="4">${fmt(r.weightKgPerM, 3)} kg/m</td></tr>`;

  const purposeLine = `<div class="report-purpose">計算用途：${entry.inputs.purpose ?? ''}</div>`;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>断面性能計算書 — calcnavi</title>
<style>
  @page { size: A4 portrait; margin: 16mm 14mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', Meiryo, sans-serif; font-size: 10pt; color: #1a1a1a; line-height: 1.55; }

  /* ── Header ── */
  .report-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #1e3a5f; padding-bottom: 7px; margin-bottom: 12px; }
  .report-title  { font-size: 16pt; font-weight: 700; color: #1e3a5f; line-height: 1.2; }
  .report-subtitle { font-size: 9pt; color: #555; margin-top: 3px; }
  .report-meta   { font-size: 8pt; color: #555; text-align: right; line-height: 1.7; }
  .report-purpose { font-size: 9pt; color: #1e3a5f; font-weight: 600; margin-top: 3px; }
  .report-meta a { color: #2563eb; text-decoration: none; }

  /* ── Section headings ── */
  h2 { font-size: 10.5pt; font-weight: 700; color: #1e3a5f; border-left: 3px solid #2563eb; padding-left: 7px; margin: 12px 0 6px; }

  /* ── Layout: SVG + inputs side by side ── */
  .input-row { display: flex; gap: 12px; align-items: flex-start; }
  .svg-box { flex: 0 0 180px; }
  .svg-box svg { width: 180px; height: auto; display: block; background: #f8fafc; border: 1px solid #d0d0d0; border-radius: 4px; }
  .input-table-wrap { flex: 1 1 auto; }

  /* ── Input / result tables ── */
  table { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
  table td { border: 1px solid #d0d0d0; padding: 4px 7px; }
  table td:first-child { background: #f0f4ff; font-weight: 500; }
  table td.val { font-weight: 700; }

  /* ── Result table ── */
  table.results th { background: #1e3a5f; color: #fff; padding: 5px 7px; text-align: left; font-size: 8.5pt; }
  table.results td.val { text-align: right; font-variant-numeric: tabular-nums; }
  table.results tr:nth-child(even) td { background: #f7f8fc; }

  /* ── Formula block ── */
  .formula-step        { margin-bottom: 6px; }
  .formula-label       { font-size: 8.5pt; font-weight: 700; color: #374151; display: block; margin-bottom: 1px; }
  pre.formula-expr     { font-family: 'Courier New', Courier, monospace; font-size: 9pt;
                         background: #f5f5f5; border-left: 3px solid #93c5fd;
                         padding: 4px 8px; white-space: pre-wrap; word-break: break-all; }

  /* ── Disclaimer ── */
  .disclaimer { margin-top: 14px; border: 1.5px solid #f59e0b; border-radius: 4px; padding: 8px 10px;
                background: #fffbeb; font-size: 8pt; color: #78350f; line-height: 1.65; }
  .disclaimer strong { display: block; font-size: 8.5pt; margin-bottom: 3px; }

  /* ── Footer ── */
  .report-footer { margin-top: 10px; border-top: 1px solid #ccc; padding-top: 5px;
                   font-size: 7.5pt; color: #888; display: flex; justify-content: space-between; }
  .report-footer a { color: #2563eb; text-decoration: none; }

  /* ── Note ── */
  .note { font-size: 8pt; color: #555; margin-top: 6px; padding: 4px 8px; background: #f5f5f5; border-left: 2px solid #aaa; }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>

<div class="report-header">
  <div>
    <div class="report-title">断面性能計算書</div>
    <div class="report-subtitle">断面形状：${entry.inputs.shapeName}</div>
  ${purposeLine}
  </div>
  <div class="report-meta">
    <a href="https://calcnavi.com/tools/section-properties" target="_blank" rel="noopener">calcnavi</a><br>
    計算日時：${fmtDate(entry.timestamp)}
  </div>
</div>

<h2>① 入力</h2>
<div class="input-row">
  <div class="svg-box">
    ${svgString}
    <p style="font-size:7pt;color:#6d28d9;text-align:center;margin-top:3px;">紫線：計算で使用した中間寸法</p>
  </div>
  <div class="input-table-wrap">
    <table>
      <tbody>${inputRows}</tbody>
    </table>
  </div>
</div>

<h2>② 計算式</h2>
${formulaRows}
<p class="note">※ 角部の丸み（フィレット半径）は非考慮。JIS 規格品の断面性能表と値が異なる場合があります。</p>

<h2>③ 計算結果</h2>
<table class="results">
  <thead>
    <tr><th>項目</th><th style="text-align:right;">mm 単位</th><th>—</th><th style="text-align:right;">cm 単位</th><th>—</th></tr>
  </thead>
  <tbody>${resultRows}</tbody>
</table>

<div class="disclaimer">
  <strong>【免責事項】この計算書をご使用になる前に必ずお読みください</strong>
  本計算書は参考情報であり、設計・施工・検査の根拠としてそのまま使用することはできません。
  実際の構造設計には、適切な資格を持つ技術者による検討・確認が必要です。
  計算式には角部の丸み（フィレット）を考慮していないため、JIS 規格値と差が生じる場合があります。
  本ツールの使用により生じた損害について、calcnavi は一切の責任を負いません。
</div>

<div class="report-footer">
  <span>生成ツール：<a href="https://calcnavi.com/tools/section-properties" target="_blank" rel="noopener">calcnavi — 断面性能計算</a></span>
  <span>このドキュメントは参考用途のみに使用してください</span>
</div>

</body>
</html>`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function printEngReport(entry: EngHistoryEntry): void {
  let html = '';
  if (entry.toolId === 'section-properties') {
    html = buildSectionPropertiesReport(entry);
  } else {
    html = `<!DOCTYPE html><html lang="ja"><body>
      <h1 style="font-family:sans-serif">${entry.toolName}</h1>
      <p style="font-family:sans-serif">印刷対応準備中</p>
      </body></html>`;
  }

  const win = window.open('', '_blank', 'width=900,height=1100');
  if (!win) {
    alert('ポップアップがブロックされました。ブラウザの設定でポップアップを許可してください。');
    return;
  }
  win.document.write(html);
  win.document.close();
  win.onload = () => {
    win.focus();
    win.print();
  };
}
