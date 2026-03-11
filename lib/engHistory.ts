/**
 * Engineering calculator history — localStorage-based.
 * Key: 'calcnavi_eng_history'
 * Max entries: 100
 */

export type EngToolId =
  | 'section-properties'
  | 'simple-beam'
  | 'cantilever'
  | 'simple-supported-point-load'
  | 'simple-supported-uniform-load'
  | 'cantilever-point-load'
  | 'cantilever-uniform-load'
  | 'bolt-length'
  | 'bolt-effective-thread-length'
  | 'steel-weight'
  | 'bolt-strength';

export interface FormulaStep {
  label: string;
  expr: string;
}

export interface EngInputSnapshot {
  material: string;
  purpose?: string;

  shapeKey: string;
  shapeName: string;
  dims: Record<string, string>;
  rawDims: Record<string, number>;

  loadCase?: 'center' | 'uniform';
  loadKN?: number;
  loadDisplayStr?: string;
  L_mm?: number;
  E_GPa?: number;
  sigmaAllow_MPa?: number;
  deflectionLimitN?: number;
  sectionMode?: 'direct' | 'shape';
  I_mm4_input?: number;
  Z_mm3_input?: number;

  boltPreset?: string;
  diameter?: string;
  itemRows?: string[];
}

export interface EngResultSnapshot {
  Ix_mm4?: number;
  Zx_mm3?: number;
  Iy_mm4?: number;
  Zy_mm3?: number;
  area_mm2?: number;
  weightKgPerM?: number | null;

  Mmax_kNm?: number;
  sigmaMax_MPa?: number;
  stressOK?: boolean;
  deltaMax_mm?: number;
  deltaAllow_mm?: number;
  deflectionOK?: boolean;

  lRequired_mm?: number;
  lBuy_mm?: number;
  tipAllowance_mm?: number;

  Ra_t_kN?: number;
  Ra_v_kN?: number;
  Ra_t_total_kN?: number;
  Ra_v_total_kN?: number;
  boltInteractionRatio?: number;
  boltInteractionOK?: boolean;
  Aeff_mm2?: number;
  S_Nmm2?: number;

  totalWeight_kg?: number;
  itemCount?: number;
  totalLoad_kN?: number;
  reactionSummary?: string[];
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
