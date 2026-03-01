/**
 * Engineering calculator history — localStorage-based.
 * Key: 'calcnavi_eng_history'
 * Max entries: 100
 */

export type EngToolId = 'section-properties' | 'simple-beam';

export interface FormulaStep {
  /** Label shown before the formula, e.g. "ウェブ高さ hw" */
  label: string;
  /** Formula with substituted values, e.g. "hw = H - 2×tf = 200 - 2×8 = 184 mm" */
  expr: string;
}

export interface EngInputSnapshot {
  /** SectionShape key, e.g. "H", "rect-tube" — used for SVG generation */
  shapeKey: string;
  /** Human-readable shape name, e.g. "H形鋼" */
  shapeName: string;
  /** Parameter label → "value unit" map, e.g. { "断面高さ H": "200 mm" } */
  dims: Record<string, string>;
  /** Raw numeric dims keyed by param key, e.g. { H: 200, B: 100 } — used for SVG */
  rawDims: Record<string, number>;
  /** Material label, e.g. "一般鋼材（SS400 等）" */
  material: string;
  /** Optional usage description, e.g. "梁の断面検討" */
  purpose?: string;
}

export interface EngResultSnapshot {
  Ix_mm4?: number;
  Zx_mm3?: number;
  Iy_mm4?: number;
  Zy_mm3?: number;
  area_mm2?: number;
  weightKgPerM?: number | null;
}

export interface EngHistoryEntry {
  id: string;
  toolId: EngToolId;
  toolName: string;
  timestamp: number;
  inputs: EngInputSnapshot;
  results: EngResultSnapshot;
  formulaSteps: FormulaStep[];
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

const STORAGE_KEY = 'calcnavi_eng_history';
const MAX_ENTRIES = 100;

export function loadEngHistory(): EngHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as EngHistoryEntry[];
  } catch {
    return [];
  }
}

function saveEngHistory(entries: EngHistoryEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    console.error('calcnavi: failed to save engineering history');
  }
}

export function addEngHistoryEntry(
  entry: Omit<EngHistoryEntry, 'id' | 'timestamp'>,
): EngHistoryEntry {
  const history = loadEngHistory();
  const newEntry: EngHistoryEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
  };
  history.unshift(newEntry);
  if (history.length > MAX_ENTRIES) history.splice(MAX_ENTRIES);
  saveEngHistory(history);
  return newEntry;
}

export function deleteEngHistoryEntry(id: string): void {
  const updated = loadEngHistory().filter((e) => e.id !== id);
  saveEngHistory(updated);
}

export function clearEngHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
