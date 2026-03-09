import type { EngHistoryEntry } from './engHistory';
import { fmt } from './beams/units';
import { getSectionSVGString } from './beams/sectionSVG';
import type { SectionShape } from './beams/sections';
import { getBoltLengthSvgString } from './diagrams/tools/bolt-length';

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function baseStyle(title: string): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>${title} - calcnavi</title>
<style>
@page { size: A4 portrait; margin: 16mm 14mm; }
* { box-sizing: border-box; }
body { font-family: 'Helvetica Neue', Arial, 'Noto Sans JP', sans-serif; font-size: 10pt; color: #111; line-height: 1.55; }
h1 { font-size: 16pt; margin: 0; color: #1e3a5f; }
h2 { font-size: 11pt; margin: 16px 0 8px; border-left: 3px solid #2563eb; padding-left: 8px; }
.meta { font-size: 8.5pt; color: #555; margin-top: 4px; }
table { width: 100%; border-collapse: collapse; font-size: 9.25pt; }
th, td { border: 1px solid #d5d5d5; padding: 5px 8px; text-align: left; vertical-align: top; }
th { background: #f3f6ff; }
.val { text-align: right; font-variant-numeric: tabular-nums; }
.formula-step { margin-bottom: 6px; }
.formula-step-label { font-weight: 700; font-size: 8.5pt; color: #374151; }
.formula-step-expr { margin: 2px 0 0; padding: 5px 7px; background: #f6f7f9; border-left: 3px solid #93c5fd; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap; font-size: 7.8pt; line-height: 1.35; }
.compact-grid { display: grid; grid-template-columns: 190px 1fr; gap: 12px; align-items: start; }
.compact-grid > div { min-width: 0; }
.compact-panel { break-inside: avoid; page-break-inside: avoid; }
.compact-panel h2 { margin-top: 0; }
.report-table--fixed { table-layout: fixed; }
.report-table--fixed th, .report-table--fixed td { word-break: break-word; }
.report-table--fixed td.val { text-align: right; }
.compact-note { font-size: 8pt; color: #4b5563; margin-top: 6px; }
.disclaimer { margin-top: 12px; font-size: 8pt; color: #78350f; background: #fffbeb; border: 1px solid #f59e0b; border-radius: 4px; padding: 8px 10px; }
.footer { margin-top: 12px; border-top: 1px solid #ddd; padding-top: 6px; font-size: 7.5pt; color: #777; }
.footer a { color: inherit; text-decoration: underline; }
</style>
</head>
<body>`;
}

function withFixedCols(rows: string): string {
  return `<table class="report-table--fixed"><colgroup><col style="width:42%"/><col style="width:58%"/></colgroup><tbody>${rows}</tbody></table>`;
}

function buildFormulaSteps(entry: EngHistoryEntry): string {
  if (entry.formulaSteps.length === 0) return '<p>途中式なし</p>';
  return entry.formulaSteps
    .map(
      (step) =>
        `<div class="formula-step"><div class="formula-step-label">${step.label}</div><pre class="formula-step-expr">${step.expr}</pre></div>`,
    )
    .join('');
}

function buildCommonCompactReport(options: {
  title: string;
  toolUrl: string;
  timestamp: number;
  metaPurpose?: string;
  figureHtml?: string;
  figureNote?: string;
  inputRows: string;
  resultRows: string;
  steps: string;
  disclaimer: string;
}): string {
  const {
    title,
    toolUrl,
    timestamp,
    metaPurpose,
    figureHtml,
    figureNote,
    inputRows,
    resultRows,
    steps,
    disclaimer,
  } = options;

  return `${baseStyle(title)}
<h1>${title}</h1>
<div class="meta">計算日時: ${fmtDate(timestamp)} / 用途: ${metaPurpose ?? '-'}</div>
<div class="compact-grid">
  <div class="compact-panel">
    <h2>① 図解</h2>
    ${figureHtml ?? '<p class="compact-note">図解なし</p>'}
    ${figureNote ? `<p class="compact-note">${figureNote}</p>` : ''}
  </div>
  <div>
    <div class="compact-panel">
      <h2>② 入力</h2>
      ${withFixedCols(inputRows)}
    </div>
    <div class="compact-panel" style="margin-top:10px">
      <h2>③ 計算結果</h2>
      ${withFixedCols(resultRows)}
    </div>
  </div>
</div>
<div class="compact-panel">
  <h2>④ 計算式</h2>
  ${steps}
</div>
<div class="disclaimer">${disclaimer}</div>
<div class="footer"><a href="${toolUrl}">${toolUrl}</a></div>
</body></html>`;
}

function buildSectionPropertiesReport(entry: EngHistoryEntry): string {
  const result = entry.results;
  const svg = getSectionSVGString((entry.inputs.shapeKey || 'H') as SectionShape);
  const inputRows = [
    `<tr><th>断面形状</th><td>${entry.inputs.shapeName}</td></tr>`,
    ...Object.entries(entry.inputs.dims).map(([key, value]) => `<tr><th>${key}</th><td class="val">${value}</td></tr>`),
    entry.inputs.material ? `<tr><th>材料</th><td class="val">${entry.inputs.material}</td></tr>` : '',
  ].join('');
  const resultRows = [
    result.Ix_mm4 !== undefined ? `<tr><th>Ix</th><td class="val">${fmt(result.Ix_mm4, 1)} mm⁴</td></tr>` : '',
    result.Zx_mm3 !== undefined ? `<tr><th>Zx</th><td class="val">${fmt(result.Zx_mm3, 2)} mm³</td></tr>` : '',
    result.Iy_mm4 !== undefined ? `<tr><th>Iy</th><td class="val">${fmt(result.Iy_mm4, 1)} mm⁴</td></tr>` : '',
    result.Zy_mm3 !== undefined ? `<tr><th>Zy</th><td class="val">${fmt(result.Zy_mm3, 2)} mm³</td></tr>` : '',
    result.area_mm2 !== undefined ? `<tr><th>断面積</th><td class="val">${fmt(result.area_mm2, 2)} mm²</td></tr>` : '',
  ].join('');

  return buildCommonCompactReport({
    title: '断面性能計算書',
    toolUrl: 'https://calcnavi.com/tools/section-properties',
    timestamp: entry.timestamp,
    metaPurpose: entry.inputs.purpose,
    figureHtml: `<div style="max-width:190px">${svg}</div>`,
    inputRows,
    resultRows,
    steps: buildFormulaSteps(entry),
    disclaimer: '本計算書は参考値です。最終設計判断は必ず規格・仕様書・有資格者の確認を行ってください。',
  });
}

function buildBeamLikeReport(
  entry: EngHistoryEntry,
  title: string,
  toolUrl: string,
  beamType: 'simple' | 'cantilever',
): string {
  const result = entry.results;
  const inputRows = [
    `<tr><th>荷重条件</th><td class="val">${entry.inputs.loadCase === 'uniform' ? '等分布荷重' : beamType === 'cantilever' ? '先端集中荷重' : '中央集中荷重'}</td></tr>`,
    `<tr><th>荷重</th><td class="val">${entry.inputs.loadDisplayStr ?? '-'}</td></tr>`,
    `<tr><th>スパン L</th><td class="val">${entry.inputs.L_mm ?? '-'} mm</td></tr>`,
    `<tr><th>ヤング率 E</th><td class="val">${entry.inputs.E_GPa ?? '-'} GPa</td></tr>`,
    `<tr><th>許容曲げ応力</th><td class="val">${entry.inputs.sigmaAllow_MPa ?? '-'} MPa</td></tr>`,
    `<tr><th>許容たわみ基準</th><td class="val">L/${entry.inputs.deflectionLimitN ?? '-'}</td></tr>`,
    entry.inputs.sectionMode === 'direct'
      ? `<tr><th>断面入力</th><td class="val">I=${fmt(entry.inputs.I_mm4_input ?? 0, 2)} mm⁴ / Z=${fmt(entry.inputs.Z_mm3_input ?? 0, 2)} mm³</td></tr>`
      : `<tr><th>断面形状</th><td class="val">${entry.inputs.shapeName}</td></tr>`,
  ].join('');
  const resultRows = [
    `<tr><th>最大曲げモーメント</th><td class="val">${fmt(result.Mmax_kNm ?? 0, 3)} kN·m</td></tr>`,
    `<tr><th>曲げ応力</th><td class="val">${fmt(result.sigmaMax_MPa ?? 0, 2)} MPa (${result.stressOK ? 'OK' : 'NG'})</td></tr>`,
    `<tr><th>最大たわみ</th><td class="val">${fmt(result.deltaMax_mm ?? 0, 2)} mm</td></tr>`,
    `<tr><th>許容たわみ</th><td class="val">${fmt(result.deltaAllow_mm ?? 0, 2)} mm (${result.deflectionOK ? 'OK' : 'NG'})</td></tr>`,
  ].join('');

  return buildCommonCompactReport({
    title,
    toolUrl,
    timestamp: entry.timestamp,
    metaPurpose: entry.inputs.purpose,
    figureNote: '入力条件、結果、途中式を A4 1枚で確認するための計算書です。',
    inputRows,
    resultRows,
    steps: buildFormulaSteps(entry),
    disclaimer: '本計算書は参考値です。判定結果は設計基準・仕様書を優先して最終判断してください。',
  });
}

function buildBoltReport(entry: EngHistoryEntry): string {
  const result = entry.results;
  const svg = getBoltLengthSvgString();
  const inputRows = [
    `<tr><th>呼び径</th><td class="val">${entry.inputs.diameter ?? '-'}</td></tr>`,
    ...Object.entries(entry.inputs.dims).map(([key, value]) => `<tr><th>${key}</th><td class="val">${value}</td></tr>`),
  ].join('');
  const resultRows = [
    `<tr><th>必要長さ L_required</th><td class="val">${fmt(result.lRequired_mm ?? 0, 2)} mm</td></tr>`,
    `<tr><th>推奨購入長さ</th><td class="val">${fmt(result.lBuy_mm ?? 0, 0)} mm</td></tr>`,
    `<tr><th>先端余長</th><td class="val">${fmt(result.tipAllowance_mm ?? 0, 2)} mm</td></tr>`,
  ].join('');

  return buildCommonCompactReport({
    title: 'ボルト長さ計算書',
    toolUrl: 'https://calcnavi.com/tools/bolt-length',
    timestamp: entry.timestamp,
    metaPurpose: entry.inputs.purpose,
    figureHtml: `<div style="max-width:180px">${svg}</div>`,
    figureNote: '必要長さと座金・ナット位置の確認用図です。',
    inputRows,
    resultRows,
    steps: buildFormulaSteps(entry),
    disclaimer: '本計算書は参考値です。実調達時はJIS規格・メーカー寸法を必ず確認してください。',
  });
}

function buildBoltStrengthReport(entry: EngHistoryEntry): string {
  const result = entry.results;
  const inputRows = Object.entries(entry.inputs.dims)
    .map(([key, value]) => `<tr><th>${key}</th><td class="val">${value}</td></tr>`)
    .join('');
  const resultRows = [
    `<tr><th>許容引張耐力</th><td class="val">${fmt(result.Ra_t_kN ?? 0, 2)} kN/本</td></tr>`,
    `<tr><th>許容引張耐力合計</th><td class="val">${fmt(result.Ra_t_total_kN ?? 0, 2)} kN</td></tr>`,
    `<tr><th>許容せん断耐力</th><td class="val">${fmt(result.Ra_v_kN ?? 0, 2)} kN/本</td></tr>`,
    `<tr><th>許容せん断耐力合計</th><td class="val">${fmt(result.Ra_v_total_kN ?? 0, 2)} kN</td></tr>`,
    result.boltInteractionRatio !== undefined
      ? `<tr><th>相互作用比</th><td class="val">${fmt(result.boltInteractionRatio, 3)} (${result.boltInteractionOK ? 'OK' : 'NG'})</td></tr>`
      : '',
  ].join('');

  return buildCommonCompactReport({
    title: 'ボルト引張・せん断耐力計算書',
    toolUrl: 'https://calcnavi.com/tools/bolt-strength',
    timestamp: entry.timestamp,
    metaPurpose: entry.inputs.purpose,
    figureNote: '引張・せん断耐力と相互作用比の確認用計算書です。',
    inputRows,
    resultRows,
    steps: buildFormulaSteps(entry),
    disclaimer: '本計算書は参考値です。適用規格・安全率・破壊モードの最終確認を行ってください。',
  });
}

function buildSteelWeightReport(entry: EngHistoryEntry): string {
  const inputRows = Object.entries(entry.inputs.dims)
    .map(([key, value]) => `<tr><th>${key}</th><td class="val">${value}</td></tr>`)
    .join('');
  const resultRows = [
    `<tr><th>明細行数</th><td class="val">${entry.results.itemCount ?? 0} 行</td></tr>`,
    `<tr><th>総重量</th><td class="val">${fmt(entry.results.totalWeight_kg ?? 0, 2)} kg</td></tr>`,
  ].join('');

  return buildCommonCompactReport({
    title: '鋼材重量集計書',
    toolUrl: 'https://calcnavi.com/tools/steel-weight',
    timestamp: entry.timestamp,
    metaPurpose: entry.inputs.purpose,
    figureNote: '現在の明細テーブル全体をスナップショット保存した集計書です。',
    inputRows,
    resultRows,
    steps: buildFormulaSteps(entry),
    disclaimer: '本計算書は参考値です。重量拾い・発注前に寸法、数量、密度条件を再確認してください。',
  });
}

export function printEngReport(entry: EngHistoryEntry): void {
  let html = '';

  if (entry.toolId === 'section-properties') {
    html = buildSectionPropertiesReport(entry);
  } else if (entry.toolId === 'simple-beam') {
    html = buildBeamLikeReport(entry, '単純梁（単純支持）計算書', 'https://calcnavi.com/tools/beams/simple-supported', 'simple');
  } else if (entry.toolId === 'cantilever') {
    html = buildBeamLikeReport(entry, '片持ち梁（カンチレバー）計算書', 'https://calcnavi.com/tools/beams/cantilever', 'cantilever');
  } else if (entry.toolId === 'bolt-length') {
    html = buildBoltReport(entry);
  } else if (entry.toolId === 'bolt-strength') {
    html = buildBoltStrengthReport(entry);
  } else if (entry.toolId === 'steel-weight') {
    html = buildSteelWeightReport(entry);
  }

  if (!html) {
    alert('このツールのPDF出力はまだ準備中です。');
    return;
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
