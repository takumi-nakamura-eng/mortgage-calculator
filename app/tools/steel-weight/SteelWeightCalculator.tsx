'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { addEngHistoryEntry, type EngHistoryEntry } from '@/lib/engHistory';
import {
  SHAPE_DEFS,
  validateDims,
  buildItem,
  recalcItem,
  dimSummary,
  loadItems,
  saveItems,
  type SteelShape,
  type SteelWeightItem,
} from '@/lib/steelWeight';
import { trackToolCalculate } from '@/lib/analytics/events';
import { printEngReport } from '@/lib/printReport';
import { DENSITY_PRESETS, resolveDensity } from '@/lib/materialPresets';
import ToolWorkbenchHeader from '@/app/components/ToolWorkbenchHeader';
import { SteelWeightSvg } from '@/lib/diagrams/tools/steel-weight';

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmtNum(v: number, d: number = 3): string {
  if (!isFinite(v)) return '-';
  return v.toLocaleString('ja-JP', { minimumFractionDigits: 0, maximumFractionDigits: d });
}

function shapeLabel(shape: SteelShape): string {
  return SHAPE_DEFS.find((d) => d.shape === shape)?.label ?? shape;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function SteelWeightCalculator() {
  // ── Items state ──
  const [items, setItems] = useState<SteelWeightItem[]>(() => loadItems());

  // Persist on change
  useEffect(() => {
    saveItems(items);
  }, [items]);

  // ── Input state ──
  const [selectedShape, setSelectedShape] = useState<SteelShape>('plate');
  const [shapeDims, setShapeDims] = useState<Record<string, string>>({});
  const [Lm, setLm] = useState<string>('1');
  const [n, setN] = useState<string>('1');
  const [densityIdx, setDensityIdx] = useState(0);
  const [customDensity, setCustomDensity] = useState<string>('7850');
  const [note, setNote] = useState<string>('');
  const [lastEntry, setLastEntry] = useState<EngHistoryEntry | null>(null);

  // ── Edit state ──
  const [editId, setEditId] = useState<string | null>(null);
  const [editShape, setEditShape] = useState<SteelShape>('plate');
  const [editDims, setEditDims] = useState<Record<string, string>>({});
  const [editLm, setEditLm] = useState<string>('');
  const [editN, setEditN] = useState<string>('');
  const [editDensityIdx, setEditDensityIdx] = useState(0);
  const [editCustomDensity, setEditCustomDensity] = useState<string>('7850');
  const [editNote, setEditNote] = useState<string>('');

  const currentDef = SHAPE_DEFS.find((d) => d.shape === selectedShape)!;

  // ── Parse & validate add form ──
  const parsedDims = useMemo(() => {
    const nums: Record<string, number> = {};
    for (const p of currentDef.params) {
      nums[p.key] = parseFloat(shapeDims[p.key] ?? '');
    }
    return nums;
  }, [currentDef, shapeDims]);

  const hasAnyInput = useMemo(
    () => currentDef.params.some((p) => !isNaN(parsedDims[p.key])),
    [currentDef, parsedDims],
  );

  const addErrors = useMemo(() => {
    if (!hasAnyInput) return [];
    return validateDims(selectedShape, parsedDims);
  }, [hasAnyInput, selectedShape, parsedDims]);

  const density = useMemo(() => resolveDensity(densityIdx, customDensity), [densityIdx, customDensity]);

  const canAdd = useMemo(() => {
    if (addErrors.length > 0) return false;
    if (density === null) return false;
    const lVal = parseFloat(Lm);
    const nVal = parseInt(n, 10);
    if (isNaN(lVal) || lVal <= 0) return false;
    if (isNaN(nVal) || nVal <= 0) return false;
    return currentDef.params.every(
      (p) => !isNaN(parsedDims[p.key]) && parsedDims[p.key] > 0,
    );
  }, [addErrors, density, Lm, n, currentDef, parsedDims]);

  // ── Edit form validation ──
  const editDef = SHAPE_DEFS.find((d) => d.shape === editShape)!;

  const editParsedDims = useMemo(() => {
    if (!editDef) return {};
    const nums: Record<string, number> = {};
    for (const p of editDef.params) {
      nums[p.key] = parseFloat(editDims[p.key] ?? '');
    }
    return nums;
  }, [editDef, editDims]);

  const editErrors = useMemo(() => {
    if (!editDef) return [];
    const hasInput = editDef.params.some((p) => !isNaN(editParsedDims[p.key]));
    if (!hasInput) return [];
    return validateDims(editShape, editParsedDims);
  }, [editDef, editShape, editParsedDims]);

  const editDensity = useMemo(
    () => resolveDensity(editDensityIdx, editCustomDensity),
    [editDensityIdx, editCustomDensity],
  );

  const canSaveEdit = useMemo(() => {
    if (!editDef) return false;
    if (editErrors.length > 0) return false;
    if (editDensity === null) return false;
    const lVal = parseFloat(editLm);
    const nVal = parseInt(editN, 10);
    if (isNaN(lVal) || lVal <= 0) return false;
    if (isNaN(nVal) || nVal <= 0) return false;
    return editDef.params.every(
      (p) => !isNaN(editParsedDims[p.key]) && editParsedDims[p.key] > 0,
    );
  }, [editDef, editErrors, editDensity, editLm, editN, editParsedDims]);

  // ── Totals ──
  const totalW = useMemo(() => items.reduce((s, i) => s + i.W_kg, 0), [items]);
  const totalLoad = useMemo(() => items.reduce((s, i) => s + i.W_kN, 0), [items]);
  const totalCount = items.length;

  function buildSnapshotData(snapshotItems: SteelWeightItem[]): Omit<EngHistoryEntry, 'id' | 'timestamp'> | null {
    if (snapshotItems.length === 0) return null;
    const dims: Record<string, string> = {};
    snapshotItems.forEach((item, index) => {
      dims[`${index + 1}. ${shapeLabel(item.shape)}`] =
        `${dimSummary(item.shape, item.dims)} / L=${item.Lm} m / n=${item.n} / 単位重量=${fmtNum(item.w_kgm, 3)} kg/m / 重量=${fmtNum(item.W_kg, 2)} kg${item.note ? ` / ${item.note}` : ''}`;
    });
    return {
      toolId: 'steel-weight',
      toolName: '鋼材重量計算',
      inputs: {
        material: '行ごとに密度保持',
        shapeKey: 'steel-weight',
        shapeName: '鋼材明細',
        dims,
        rawDims: {},
        itemRows: Object.values(dims),
      },
      results: {
        totalWeight_kg: snapshotItems.reduce((sum, item) => sum + item.W_kg, 0),
        totalLoad_kN: snapshotItems.reduce((sum, item) => sum + item.W_kN, 0),
        itemCount: snapshotItems.length,
      },
      formulaSteps: [],
    };
  }

  function persistSnapshot(snapshotItems: SteelWeightItem[]): EngHistoryEntry | null {
    const snapshot = buildSnapshotData(snapshotItems);
    if (!snapshot) return null;
    const entry = addEngHistoryEntry(snapshot);
    setLastEntry(entry);
    return entry;
  }

  // ── Handlers ──
  function handleShapeChange(shape: SteelShape) {
    setSelectedShape(shape);
    setShapeDims({});
  }

  function handleAdd() {
    if (!canAdd || density === null) return;
    const item = buildItem(
      selectedShape,
      parsedDims,
      parseFloat(Lm),
      parseInt(n, 10),
      density,
      note.trim(),
    );
    if (!item) return;
    const nextItems = [...items, item];
    setItems(nextItems);
    // Reset length/count/note but keep shape & density
    setShapeDims({});
    setLm('1');
    setN('1');
    setNote('');
    persistSnapshot(nextItems);
    trackToolCalculate({ toolId: 'steel-weight', category: '材料・重量' });
  }

  function handleDelete(id: string) {
    if (!window.confirm('この行を削除しますか？')) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (editId === id) setEditId(null);
  }

  function startEdit(item: SteelWeightItem) {
    setEditId(item.id);
    setEditShape(item.shape);
    const dims: Record<string, string> = {};
    for (const [k, v] of Object.entries(item.dims)) {
      dims[k] = String(v);
    }
    setEditDims(dims);
    setEditLm(String(item.Lm));
    setEditN(String(item.n));
    setEditNote(item.note);
    // Find matching density preset
    const presetIdx = DENSITY_PRESETS.findIndex((p) => p.density === item.rho);
    if (presetIdx >= 0) {
      setEditDensityIdx(presetIdx);
    } else {
      setEditDensityIdx(DENSITY_PRESETS.length - 1); // custom
      setEditCustomDensity(String(item.rho));
    }
  }

  function handleSaveEdit() {
    if (!canSaveEdit || editId === null || editDensity === null) return;
    const nextItems = items.map((item) => {
        if (item.id !== editId) return item;
        return recalcItem({
          ...item,
          shape: editShape,
          dims: { ...editParsedDims },
          Lm: parseFloat(editLm),
          n: parseInt(editN, 10),
          rho: editDensity,
          note: editNote.trim(),
        });
      });
    setItems(nextItems);
    persistSnapshot(nextItems);
    setEditId(null);
  }

  function handleCancelEdit() {
    setEditId(null);
  }

  const handleClearAll = useCallback(() => {
    if (items.length === 0) return;
    if (!window.confirm('すべての行を削除しますか？')) return;
    setItems([]);
    setEditId(null);
    setLastEntry(null);
  }, [items.length]);

  function handleSaveSnapshot() {
    const entry = persistSnapshot(items);
    if (!entry) return;
  }

  function handleCopyTSV() {
    const header = ['No', '形状', '寸法', 'L [m]', 'n', '単位重量 [kg/m]', '重量 [kg]', '荷重 [kN]', '備考'].join('\t');
    const rows = items.map((item, i) => [
      i + 1,
      shapeLabel(item.shape),
      dimSummary(item.shape, item.dims),
      item.Lm,
      item.n,
      fmtNum(item.w_kgm, 3),
      fmtNum(item.W_kg, 2),
      fmtNum(item.W_kN, 3),
      item.note,
    ].join('\t'));
    const footer = `\t\t\t\t\t合計\t${fmtNum(totalW, 2)}\t${fmtNum(totalLoad, 3)}`;
    const tsv = [header, ...rows, footer].join('\n');
    navigator.clipboard.writeText(tsv).catch(() => {
      // fallback: do nothing
    });
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="section-prop-wrap">
      <section className="tool-workbench" aria-label="鋼材重量計算の入力条件">
        <div className="tool-workbench__section">
          <ToolWorkbenchHeader title="入力条件" />
          <div className="beam-section">
            <h2 className="beam-section-title">① 断面形状を選択</h2>

            <div className="section-shape-tabs">
              {SHAPE_DEFS.map((d) => (
                <button
                  key={d.shape}
                  type="button"
                  onClick={() => handleShapeChange(d.shape)}
                  className={`section-shape-tab${selectedShape === d.shape ? ' section-shape-tab--active' : ''}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <p className="beam-note" style={{ marginTop: '0.5rem' }}>
              寸法ラベルは図の記号に合わせています。断面寸法を入力して、長さと本数から重量と荷重を集計します。
            </p>
          </div>

          <div className="beam-section">
            <h2 className="beam-section-title">② 断面寸法を入力</h2>
            <div className="section-main-row">
              <div className="section-diagram-box">
                <SteelWeightSvg shape={selectedShape} maxWidth={280} />
                <p className="section-diagram-caption">
                  寸法記号は入力欄と対応します。長さ L と本数 n は次のセクションで入力します。
                </p>
              </div>

              <div className="section-inputs-box section-properties-form">
                {currentDef.params.map((p) => (
                  <div key={p.key} className="form-group section-properties-form__field">
                    <label htmlFor={`sw-${p.key}`}>
                      {p.label} <span className="unit-label">[{p.unit}]</span>
                    </label>
                    <input
                      id={`sw-${p.key}`}
                      type="number"
                      min="0.001"
                      step="any"
                      placeholder={p.placeholder}
                      value={shapeDims[p.key] ?? ''}
                      onChange={(e) => setShapeDims((prev) => ({ ...prev, [p.key]: e.target.value }))}
                    />
                  </div>
                ))}
                {addErrors.map((err, i) => (
                  <p key={i} className="error-message">{err}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="beam-section">
            <h2 className="beam-section-title">③ 長さ・本数・密度</h2>
            <div className="beam-row" style={{ marginBottom: '0.75rem' }}>
              <div className="form-group" style={{ flex: '1 1 100px' }}>
                <label htmlFor="sw-L">長さ L <span className="unit-label">[m]</span></label>
                <input
                  id="sw-L"
                  type="number"
                  min="0.001"
                  step="any"
                  placeholder="1"
                  value={Lm}
                  onChange={(e) => setLm(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ flex: '0 0 80px' }}>
                <label htmlFor="sw-n">本数</label>
                <input
                  id="sw-n"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="1"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                />
              </div>
            </div>

            <div className="beam-row" style={{ marginBottom: '0.75rem' }}>
              <div className="form-group" style={{ flex: '1 1 200px' }}>
                <label htmlFor="sw-density-preset">密度プリセット</label>
                <select
                  id="sw-density-preset"
                  value={densityIdx}
                  onChange={(e) => setDensityIdx(Number(e.target.value))}
                >
                  {DENSITY_PRESETS.map((d, i) => (
                    <option key={i} value={i}>
                      {d.label}{d.density !== null ? ` (${d.density} kg/m³)` : ''}
                    </option>
                  ))}
                </select>
              </div>
              {DENSITY_PRESETS[densityIdx].density === null && (
                <div className="form-group" style={{ flex: '0 0 140px' }}>
                  <label htmlFor="sw-custom-density">密度 <span className="unit-label">[kg/m³]</span></label>
                  <input
                    id="sw-custom-density"
                    type="number"
                    min="0.001"
                    step="any"
                    placeholder="7850"
                    value={customDensity}
                    onChange={(e) => setCustomDensity(e.target.value)}
                  />
                </div>
              )}
              <div className="form-group" style={{ flex: '1 1 180px' }}>
                <label htmlFor="sw-note">備考（任意）</label>
                <input
                  id="sw-note"
                  type="text"
                  placeholder="例: ベースプレート"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={60}
                />
              </div>
            </div>

            <div className="form-submit-row">
              <button
                type="button"
                className="calc-btn"
                disabled={!canAdd}
                onClick={handleAdd}
              >
                追加
              </button>
              {canAdd && density !== null && (
                <span className="beam-note">
                  単位重量 {fmtNum((density * (buildItem(selectedShape, parsedDims, 1, 1, density, '')?.w_kgm ?? 0) / density), 3)} kg/m
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="tool-workbench__section tool-workbench__section--results">
          <div className="beam-section" style={{ padding: '1rem 0.75rem', marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', padding: '0 0.5rem' }}>
              <h2 className="beam-section-title" style={{ margin: 0 }}>明細テーブル</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {items.length > 0 && (
                  <>
                    <button type="button" className="sw-small-btn sw-small-btn--primary" onClick={handleSaveSnapshot}>
                      履歴に保存
                    </button>
                    <button type="button" className="pdf-btn pdf-btn--sm" onClick={() => lastEntry && printEngReport(lastEntry)} disabled={!lastEntry}>
                      PDF出力
                    </button>
                    <button type="button" className="sw-small-btn" onClick={handleCopyTSV} title="TSVコピー">
                      コピー
                    </button>
                    <button type="button" className="sw-small-btn sw-small-btn--danger" onClick={handleClearAll}>
                      全削除
                    </button>
                  </>
                )}
              </div>
            </div>

        {items.length === 0 ? (
          <p className="beam-note" style={{ textAlign: 'center', padding: '2rem 0' }}>
            上のフォームから鋼材を追加してください
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="sw-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>形状</th>
                  <th>寸法</th>
                  <th>L [m]</th>
                  <th>n</th>
                  <th>単位重量 [kg/m]</th>
                  <th>重量 [kg]</th>
                  <th>荷重 [kN]</th>
                  <th>備考</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) =>
                  editId === item.id ? (
                    <EditRow
                      key={item.id}
                      idx={idx}
                      editShape={editShape}
                      setEditShape={setEditShape}
                      editDims={editDims}
                      setEditDims={setEditDims}
                      editLm={editLm}
                      setEditLm={setEditLm}
                      editN={editN}
                      setEditN={setEditN}
                      editDensityIdx={editDensityIdx}
                      setEditDensityIdx={setEditDensityIdx}
                      editCustomDensity={editCustomDensity}
                      setEditCustomDensity={setEditCustomDensity}
                      editNote={editNote}
                      setEditNote={setEditNote}
                      editErrors={editErrors}
                      canSave={canSaveEdit}
                      onSave={handleSaveEdit}
                      onCancel={handleCancelEdit}
                    />
                  ) : (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>{shapeLabel(item.shape)}</td>
                      <td className="sw-dim-cell">{dimSummary(item.shape, item.dims)}</td>
                      <td>{item.Lm}</td>
                      <td>{item.n}</td>
                      <td>{fmtNum(item.w_kgm, 3)}</td>
                      <td className="sw-weight-cell">{fmtNum(item.W_kg, 2)}</td>
                      <td className="sw-weight-cell">{fmtNum(item.W_kN, 3)}</td>
                      <td className="sw-note-cell">{item.note}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button
                            type="button"
                            className="sw-small-btn"
                            onClick={() => startEdit(item)}
                          >
                            編集
                          </button>
                          <button
                            type="button"
                            className="sw-small-btn sw-small-btn--danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
              <tfoot>
                <tr className="sw-total-row">
                  <td colSpan={6} style={{ textAlign: 'right', fontWeight: 700 }}>
                    合計（{totalCount}行）
                  </td>
                  <td style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                    {fmtNum(totalW, 2)} kg
                  </td>
                  <td style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                    {fmtNum(totalLoad, 3)} kN
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* ── Total summary (emphasized) ── */}
      {items.length > 0 && (
        <div className="sw-total-summary">
          <span className="sw-total-label">総重量</span>
          <span className="sw-total-value">{fmtNum(totalW, 2)} <span className="sw-total-unit">kg</span></span>
        </div>
      )}
      {items.length > 0 && (
        <div className="sw-total-summary" style={{ marginTop: '0.75rem' }}>
          <span className="sw-total-label">総荷重</span>
          <span className="sw-total-value">{fmtNum(totalLoad, 3)} <span className="sw-total-unit">kN</span></span>
        </div>
      )}
        </div>
      </section>
    </div>
  );
}

// ─── Inline edit row ────────────────────────────────────────────────────────

function EditRow({
  idx,
  editShape,
  setEditShape,
  editDims,
  setEditDims,
  editLm,
  setEditLm,
  editN,
  setEditN,
  editDensityIdx,
  setEditDensityIdx,
  editCustomDensity,
  setEditCustomDensity,
  editNote,
  setEditNote,
  editErrors,
  canSave,
  onSave,
  onCancel,
}: {
  idx: number;
  editShape: SteelShape;
  setEditShape: (s: SteelShape) => void;
  editDims: Record<string, string>;
  setEditDims: (d: Record<string, string>) => void;
  editLm: string;
  setEditLm: (v: string) => void;
  editN: string;
  setEditN: (v: string) => void;
  editDensityIdx: number;
  setEditDensityIdx: (i: number) => void;
  editCustomDensity: string;
  setEditCustomDensity: (v: string) => void;
  editNote: string;
  setEditNote: (v: string) => void;
  editErrors: string[];
  canSave: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  const def = SHAPE_DEFS.find((d) => d.shape === editShape)!;

  return (
    <tr className="sw-edit-row">
      <td>{idx + 1}</td>
      <td colSpan={8}>
        <div className="sw-edit-fields">
          <div className="form-group" style={{ flex: '0 0 130px' }}>
            <label>形状</label>
            <select
              value={editShape}
              onChange={(e) => {
                setEditShape(e.target.value as SteelShape);
                setEditDims({});
              }}
            >
              {SHAPE_DEFS.map((d) => (
                <option key={d.shape} value={d.shape}>{d.label}</option>
              ))}
            </select>
          </div>
          {def.params.map((p) => (
            <div key={p.key} className="form-group" style={{ flex: '0 0 90px' }}>
              <label>{p.label} <span className="unit-label">[{p.unit}]</span></label>
              <input
                type="number"
                min="0.001"
                step="any"
                value={editDims[p.key] ?? ''}
                onChange={(e) => setEditDims({ ...editDims, [p.key]: e.target.value })}
              />
            </div>
          ))}
          <div className="form-group" style={{ flex: '0 0 80px' }}>
            <label>L <span className="unit-label">[m]</span></label>
            <input
              type="number"
              min="0.001"
              step="any"
              value={editLm}
              onChange={(e) => setEditLm(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: '0 0 60px' }}>
            <label>n</label>
            <input
              type="number"
              min="1"
              step="1"
              value={editN}
              onChange={(e) => setEditN(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: '1 1 150px' }}>
            <label>密度</label>
            <select
              value={editDensityIdx}
              onChange={(e) => setEditDensityIdx(Number(e.target.value))}
            >
              {DENSITY_PRESETS.map((d, i) => (
                <option key={i} value={i}>
                  {d.label}{d.density !== null ? ` (${d.density})` : ''}
                </option>
              ))}
            </select>
          </div>
          {DENSITY_PRESETS[editDensityIdx].density === null && (
            <div className="form-group" style={{ flex: '0 0 100px' }}>
              <label>ρ <span className="unit-label">[kg/m³]</span></label>
              <input
                type="number"
                min="0.001"
                step="any"
                value={editCustomDensity}
                onChange={(e) => setEditCustomDensity(e.target.value)}
              />
            </div>
          )}
          <div className="form-group" style={{ flex: '1 1 120px' }}>
            <label>備考</label>
            <input
              type="text"
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              maxLength={60}
            />
          </div>
        </div>
        {editErrors.map((err, i) => (
          <p key={i} className="error-message" style={{ margin: '0.25rem 0 0' }}>{err}</p>
        ))}
      </td>
      <td>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <button type="button" className="sw-small-btn sw-small-btn--primary" disabled={!canSave} onClick={onSave}>
            保存
          </button>
          <button type="button" className="sw-small-btn" onClick={onCancel}>
            取消
          </button>
        </div>
      </td>
    </tr>
  );
}
