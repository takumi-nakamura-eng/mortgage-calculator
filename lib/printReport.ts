import type { EngHistoryEntry } from './engHistory';
import { fmt } from './beams/units';
import { getSectionSVGString } from './beams/sectionSVG';
import type { SectionShape } from './beams/sections';
import { getBoltSVGString } from './bolts/boltSVG';

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
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
table { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
th, td { border: 1px solid #d5d5d5; padding: 5px 8px; text-align: left; }
th { background: #f3f6ff; }
.val { text-align: right; font-variant-numeric: tabular-nums; }
.formula-step { margin-bottom: 8px; }
.formula-step-label { font-weight: 700; font-size: 8.5pt; color: #374151; }
.formula-step-expr { margin: 2px 0 0; padding: 6px 8px; background: #f6f7f9; border-left: 3px solid #93c5fd; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap; }
.disclaimer { margin-top: 14px; font-size: 8pt; color: #78350f; background: #fffbeb; border: 1px solid #f59e0b; border-radius: 4px; padding: 8px 10px; }
.footer { margin-top: 12px; border-top: 1px solid #ddd; padding-top: 6px; font-size: 7.5pt; color: #777; }
</style>
</head>
<body>`;
}

function buildFormulaSteps(entry: EngHistoryEntry): string {
  if (entry.formulaSteps.length === 0) return '<p>途中式なし</p>';
  return entry.formulaSteps
    .map((s) => `<div class="formula-step"><div class="formula-step-label">${s.label}</div><pre class="formula-step-expr">${s.expr}</pre></div>`)
    .join('');
}

function buildSectionPropertiesReport(entry: EngHistoryEntry): string {
  const r = entry.results;
  const svg = getSectionSVGString((entry.inputs.shapeKey || 'H') as SectionShape);
  const inputRows = [
    `<tr><th>断面形状</th><td>${entry.inputs.shapeName}</td></tr>`,
    ...Object.entries(entry.inputs.dims).map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`),
    `<tr><th>材料</th><td>${entry.inputs.material}</td></tr>`,
  ].join('');

  const resultRows = [
    r.Ix_mm4 !== undefined ? `<tr><th>Ix</th><td class="val">${fmt(r.Ix_mm4, 1)} mm⁴</td></tr>` : '',
    r.Zx_mm3 !== undefined ? `<tr><th>Zx</th><td class="val">${fmt(r.Zx_mm3, 2)} mm³</td></tr>` : '',
    r.Iy_mm4 !== undefined ? `<tr><th>Iy</th><td class="val">${fmt(r.Iy_mm4, 1)} mm⁴</td></tr>` : '',
    r.Zy_mm3 !== undefined ? `<tr><th>Zy</th><td class="val">${fmt(r.Zy_mm3, 2)} mm³</td></tr>` : '',
    r.area_mm2 !== undefined ? `<tr><th>断面積</th><td class="val">${fmt(r.area_mm2, 2)} mm²</td></tr>` : '',
    r.weightKgPerM != null ? `<tr><th>重量</th><td class="val">${fmt(r.weightKgPerM, 3)} kg/m</td></tr>` : '',
  ].join('');

  return `${baseStyle('断面性能計算書')}
<h1>断面性能計算書</h1>
<div class="meta">計算日時: ${fmtDate(entry.timestamp)} / 用途: ${entry.inputs.purpose ?? '-'}</div>
<h2>① 図解</h2>
<div style="max-width:220px">${svg}</div>
<h2>② 入力</h2>
<table><tbody>${inputRows}</tbody></table>
<h2>③ 計算式</h2>
${buildFormulaSteps(entry)}
<h2>④ 計算結果</h2>
<table><tbody>${resultRows}</tbody></table>
<div class="disclaimer">本計算書は参考値です。最終設計判断は必ず規格・仕様書・有資格者の確認を行ってください。</div>
<div class="footer">calcnavi / tools/section-properties</div>
</body></html>`;
}

function buildSimpleBeamReport(entry: EngHistoryEntry): string {
  const r = entry.results;
  const inputRows = [
    `<tr><th>荷重条件</th><td>${entry.inputs.loadCase === 'uniform' ? '等分布荷重' : '中央集中荷重'}</td></tr>`,
    `<tr><th>荷重</th><td>${entry.inputs.loadDisplayStr ?? '-'}</td></tr>`,
    `<tr><th>スパン L</th><td>${entry.inputs.L_mm ?? '-'} mm</td></tr>`,
    `<tr><th>ヤング率 E</th><td>${entry.inputs.E_GPa ?? '-'} GPa</td></tr>`,
    `<tr><th>許容曲げ応力</th><td>${entry.inputs.sigmaAllow_MPa ?? '-'} MPa</td></tr>`,
    `<tr><th>許容たわみ基準</th><td>L/${entry.inputs.deflectionLimitN ?? '-'}</td></tr>`,
    entry.inputs.sectionMode === 'direct'
      ? `<tr><th>断面入力</th><td>I=${fmt(entry.inputs.I_mm4_input ?? 0, 2)} mm⁴, Z=${fmt(entry.inputs.Z_mm3_input ?? 0, 2)} mm³</td></tr>`
      : `<tr><th>断面形状</th><td>${entry.inputs.shapeName}</td></tr>`,
  ].join('');

  const resultRows = [
    `<tr><th>最大曲げモーメント</th><td class="val">${fmt(r.Mmax_kNm ?? 0, 3)} kN·m</td></tr>`,
    `<tr><th>曲げ応力</th><td class="val">${fmt(r.sigmaMax_MPa ?? 0, 2)} MPa (${r.stressOK ? 'OK' : 'NG'})</td></tr>`,
    `<tr><th>最大たわみ</th><td class="val">${fmt(r.deltaMax_mm ?? 0, 2)} mm</td></tr>`,
    `<tr><th>許容たわみ</th><td class="val">${fmt(r.deltaAllow_mm ?? 0, 2)} mm (${r.deflectionOK ? 'OK' : 'NG'})</td></tr>`,
  ].join('');

  return `${baseStyle('単純梁計算書')}
<h1>単純梁（単純支持）計算書</h1>
<div class="meta">計算日時: ${fmtDate(entry.timestamp)} / 用途: ${entry.inputs.purpose ?? '-'}</div>
<h2>① 入力</h2>
<table><tbody>${inputRows}</tbody></table>
<h2>② 計算式</h2>
${buildFormulaSteps(entry)}
<h2>③ 計算結果</h2>
<table><tbody>${resultRows}</tbody></table>
<div class="disclaimer">本計算書は参考値です。判定結果は設計基準・仕様書を優先して最終判断してください。</div>
<div class="footer">calcnavi / tools/beams/simple-supported</div>
</body></html>`;
}

function buildBoltReport(entry: EngHistoryEntry): string {
  const r = entry.results;
  const svg = getBoltSVGString();
  const inputRows = [
    `<tr><th>呼び径</th><td>${entry.inputs.diameter ?? '-'}</td></tr>`,
    ...Object.entries(entry.inputs.dims).map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`),
  ].join('');

  const resultRows = [
    `<tr><th>必要長さ L_required</th><td class="val">${fmt(r.lRequired_mm ?? 0, 2)} mm</td></tr>`,
    `<tr><th>推奨購入長さ</th><td class="val">${fmt(r.lBuy_mm ?? 0, 0)} mm</td></tr>`,
    `<tr><th>先端余長</th><td class="val">${fmt(r.tipAllowance_mm ?? 0, 2)} mm</td></tr>`,
  ].join('');

  return `${baseStyle('ボルト長さ計算書')}
<h1>ボルト長さ計算書</h1>
<div class="meta">計算日時: ${fmtDate(entry.timestamp)} / 用途: ${entry.inputs.purpose ?? '-'}</div>
<h2>① 図解</h2>
<div style="max-width:420px">${svg}</div>
<h2>② 入力</h2>
<table><tbody>${inputRows}</tbody></table>
<h2>③ 計算式</h2>
${buildFormulaSteps(entry)}
<h2>④ 計算結果</h2>
<table><tbody>${resultRows}</tbody></table>
<div class="disclaimer">本計算書は参考値です。実調達時はJIS規格・メーカー寸法を必ず確認してください。</div>
<div class="footer">calcnavi / tools/bolt</div>
</body></html>`;
}

export function printEngReport(entry: EngHistoryEntry): void {
  let html = '';

  if (entry.toolId === 'section-properties') {
    html = buildSectionPropertiesReport(entry);
  } else if (entry.toolId === 'simple-beam') {
    html = buildSimpleBeamReport(entry);
  } else if (entry.toolId === 'bolt-length') {
    html = buildBoltReport(entry);
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
