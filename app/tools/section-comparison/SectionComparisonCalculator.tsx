'use client';

import { useMemo, useState } from 'react';
import {
  addEngHistoryEntry,
  type EngHistoryEntry,
} from '@/lib/engHistory';
import { printEngReport } from '@/lib/printReport';
import { trackToolCalculate } from '@/lib/analytics/events';
import {
  compareSections,
  type SectionComparisonInputItem,
} from '@/lib/sections/comparison';
import { SECTION_DEFS, type SectionShape } from '@/lib/beams/sections';
import ToolWorkbenchHeader from '@/app/components/ToolWorkbenchHeader';
import AdSenseBlock from '@/app/components/AdSenseBlock';
import { SectionDiagram } from '@/app/tools/section-properties/SectionDiagram';

interface CardState extends SectionComparisonInputItem {
  shapeDims: Record<string, string>;
}

function createCard(shape: SectionShape = 'H'): CardState {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    shape,
    dims: {},
    shapeDims: {},
  };
}

function fmt(value: number | undefined | null, digits = 3): string {
  if (value == null || !Number.isFinite(value)) return '-';
  return value.toLocaleString('ja-JP', { maximumFractionDigits: digits });
}

function toCsvCell(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

export default function SectionComparisonCalculator() {
  const [cards, setCards] = useState<CardState[]>([createCard('H'), createCard('rect-tube')]);
  const [purpose, setPurpose] = useState('');
  const [lastEntry, setLastEntry] = useState<EngHistoryEntry | null>(null);
  const [committed, setCommitted] = useState<ReturnType<typeof compareSections> | null>(null);

  const parsedItems = useMemo<SectionComparisonInputItem[]>(
    () =>
      cards.map((card) => ({
        id: card.id,
        shape: card.shape,
        dims: Object.fromEntries(Object.entries(card.shapeDims).map(([key, value]) => [key, parseFloat(value)])),
      })),
    [cards],
  );

  function setCardShape(id: string, shape: SectionShape) {
    setCards((prev) => prev.map((card) => (card.id === id ? { ...card, shape, shapeDims: {} } : card)));
  }

  function setCardDim(id: string, key: string, value: string) {
    setCards((prev) => prev.map((card) => (card.id === id ? { ...card, shapeDims: { ...card.shapeDims, [key]: value } } : card)));
  }

  function handleCalculate() {
    const result = compareSections(parsedItems, (shape) => SECTION_DEFS.find((definition) => definition.shape === shape)?.label ?? shape);
    if (result.rows.length === 0) return;
    const entry = addEngHistoryEntry({
      toolId: 'section-comparison',
      toolName: '断面係数比較',
      inputs: {
        material: '',
        purpose: purpose.trim() || undefined,
        shapeKey: 'comparison',
        shapeName: '複数断面比較',
        dims: Object.fromEntries(
          result.rows.map((row, index) => [
            `比較断面 ${index + 1}`,
            `${row.shapeLabel} / A=${fmt(row.section.area_mm2, 1)} mm² / Z=${fmt(row.section.Z_mm3, 1)} mm³`,
          ]),
        ),
        rawDims: {},
        itemRows: result.rows.map((row) => `${row.shapeLabel},${fmt(row.section.I_mm4, 1)},${fmt(row.section.Z_mm3, 1)},${fmt(row.section.area_mm2, 1)},${fmt(row.section.weight_kg_per_m, 3)}`),
      },
      results: {
        itemCount: result.rows.length,
        comparisonSummary: result.rows.map((row) => `${row.shapeLabel}: Z/A=${fmt(row.efficiency_Z_over_A, 3)}`),
      },
      formulaSteps: [
        { label: '比較指標', expr: '効率指標 = Z / A （断面係数を断面積で割った値）' },
      ],
    });
    setCommitted(result);
    setLastEntry(entry);
    trackToolCalculate({ toolId: 'section-comparison', category: '梁・断面' });
  }

  function handleCsvExport() {
    if (!committed) return;
    const rows: string[][] = [
      ['形状', 'Ix(mm4)', 'Zx(mm3)', 'A(mm2)', '重量(kg/m)', 'Z/A'],
      ...committed.rows.map((row) => [
        row.shapeLabel,
        fmt(row.section.I_mm4, 1),
        fmt(row.section.Z_mm3, 1),
        fmt(row.section.area_mm2, 1),
        fmt(row.section.weight_kg_per_m, 3),
        fmt(row.efficiency_Z_over_A, 3),
      ]),
    ];
    const csv = rows.map((row) => row.map(toCsvCell).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'section-comparison.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="section-prop-wrap">
      <section className="tool-workbench" aria-label="断面係数比較の入力条件">
        <div className="tool-workbench__section">
          <ToolWorkbenchHeader title="入力条件" />
          <div className="beam-section">
            <h2 className="beam-section-title">① 比較カード</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {cards.map((card, index) => {
                const def = SECTION_DEFS.find((item) => item.shape === card.shape)!;
                return (
                  <div key={card.id} className="section-main-row" style={{ alignItems: 'stretch', border: '1px solid #dbe4f0', borderRadius: '12px', padding: '1rem' }}>
                    <div className="section-diagram-box">
                      <p className="beam-note" style={{ marginBottom: '0.5rem' }}>比較断面 {index + 1}</p>
                      <SectionDiagram shape={card.shape} />
                    </div>
                    <div className="section-inputs-box section-properties-form">
                      <div className="form-group section-properties-form__field">
                        <label>形状</label>
                        <select value={card.shape} onChange={(e) => setCardShape(card.id, e.target.value as SectionShape)}>
                          {SECTION_DEFS.map((item) => (
                            <option key={item.shape} value={item.shape}>{item.label}</option>
                          ))}
                        </select>
                      </div>
                      {def.params.map((param) => (
                        <div key={param.key} className="form-group section-properties-form__field">
                          <label>{param.label} [{param.unit}]</label>
                          <input type="number" min="0" step="any" value={card.shapeDims[param.key] ?? ''} onChange={(e) => setCardDim(card.id, param.key, e.target.value)} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" className="pdf-btn" onClick={() => setCards((prev) => [...prev, createCard('H')])}>カード追加</button>
              {cards.length > 1 ? (
                <button type="button" className="pdf-btn" onClick={() => setCards((prev) => prev.slice(0, -1))}>最後のカード削除</button>
              ) : null}
            </div>
          </div>
          <div className="beam-section">
            <h2 className="beam-section-title">② 計算</h2>
            <div className="form-group section-properties-form__purpose">
              <label htmlFor="comparison-purpose">用途メモ（任意）</label>
              <input id="comparison-purpose" type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button type="button" className="calc-btn" onClick={handleCalculate}>
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
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="pdf-btn" onClick={() => lastEntry && printEngReport(lastEntry)}>PDF出力</button>
                <button type="button" className="pdf-btn" onClick={handleCsvExport}>CSV出力</button>
              </div>
            </div>
            <div className="beam-result-table-wrap">
              <table className="beam-result-table">
                <thead>
                  <tr>
                    <th>形状</th>
                    <th>Ix</th>
                    <th>Zx</th>
                    <th>A</th>
                    <th>重量</th>
                    <th>Z/A</th>
                  </tr>
                </thead>
                <tbody>
                  {committed.rows.map((row) => (
                    <tr key={row.id} style={row.id === committed.bestId ? { background: '#eff6ff' } : undefined}>
                      <td>{row.shapeLabel}{row.id === committed.bestId ? '（最良）' : ''}</td>
                      <td className="val">{fmt(row.section.I_mm4, 1)}</td>
                      <td className="val">{fmt(row.section.Z_mm3, 1)}</td>
                      <td className="val">{fmt(row.section.area_mm2, 1)}</td>
                      <td className="val">{fmt(row.section.weight_kg_per_m, 3)}</td>
                      <td className="val">{fmt(row.efficiency_Z_over_A, 3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="beam-section">
            <h2 className="beam-section-title">計算式</h2>
            <div className="formula-block">
              <p className="formula-block__label">評価指標</p>
              <pre className="formula-block__expr">Z / A が大きいほど、同じ断面積当たりの曲げ効率が高いとみなします。</pre>
            </div>
          </div>
          <AdSenseBlock slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL} className="tool-ad" pageType="tool" />
        </>
      ) : null}
    </div>
  );
}
