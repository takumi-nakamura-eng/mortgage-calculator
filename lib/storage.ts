import type { HistoryEntry } from '@/lib/types';

const STORAGE_KEY = 'calcnavi_history';

export function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveHistory(history: HistoryEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    console.error('Failed to save history to localStorage');
  }
}

export function addHistoryEntry(
  entry: Omit<HistoryEntry, 'id' | 'timestamp'>,
): HistoryEntry {
  const history = loadHistory();
  const newEntry: HistoryEntry = {
    ...entry,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };
  history.unshift(newEntry);
  // Keep only the 50 most recent entries
  if (history.length > 50) history.splice(50);
  saveHistory(history);
  return newEntry;
}

export function deleteHistoryEntry(id: string): void {
  const history = loadHistory().filter((e) => e.id !== id);
  saveHistory(history);
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
