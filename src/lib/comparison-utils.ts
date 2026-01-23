const STORAGE_KEY = 'asx-saved-comparisons';

export interface SavedComparison {
  id: string;
  tickers: string[];
  savedAt: number;
  name?: string;
}

/**
 * Generate a unique ID for saved comparisons
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Save a comparison to localStorage
 */
export function saveComparison(tickers: string[], name?: string): SavedComparison {
  const saved = loadSavedComparisons();
  const newComparison: SavedComparison = {
    id: generateId(),
    tickers,
    savedAt: Date.now(),
    name,
  };
  saved.push(newComparison);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  return newComparison;
}

/**
 * Load all saved comparisons from localStorage
 */
export function loadSavedComparisons(): SavedComparison[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as SavedComparison[];
  } catch {
    return [];
  }
}

/**
 * Delete a saved comparison from localStorage
 */
export function deleteSavedComparison(id: string): void {
  const saved = loadSavedComparisons();
  const filtered = saved.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Generate a shareable URL from tickers
 */
export function generateShareUrl(tickers: string[]): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const params = new URLSearchParams();
  params.set('tickers', tickers.join(','));
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Parse tickers from URL search params
 */
export function parseTickersFromUrl(searchParams: URLSearchParams): string[] {
  const tickersParam = searchParams.get('tickers');
  if (!tickersParam) return [];
  return tickersParam
    .split(',')
    .map((t) => t.trim().toUpperCase())
    .filter((t) => t.length > 0);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
