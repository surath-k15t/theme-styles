import { PANEL_ISLAND_INSET, PANEL_POSITION_KEY } from './constants';

export function readPanelPosition(): { x: number; y: number } {
  if (typeof window === 'undefined') return { x: PANEL_ISLAND_INSET, y: PANEL_ISLAND_INSET };
  try {
    const raw = window.sessionStorage.getItem(PANEL_POSITION_KEY);
    if (raw) {
      const p = JSON.parse(raw) as { x?: unknown; y?: unknown };
      if (typeof p.x === 'number' && typeof p.y === 'number' && Number.isFinite(p.x) && Number.isFinite(p.y)) {
        return { x: p.x, y: p.y };
      }
    }
  } catch {
    /* ignore */
  }
  return { x: PANEL_ISLAND_INSET, y: PANEL_ISLAND_INSET };
}

export function getSessionString(key: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return window.sessionStorage.getItem(key) ?? fallback;
}

export function getSessionBool(key: string, fallback: boolean): boolean {
  if (typeof window === 'undefined') return fallback;
  const raw = window.sessionStorage.getItem(key);
  if (raw == null) return fallback;
  return raw === 'true';
}
