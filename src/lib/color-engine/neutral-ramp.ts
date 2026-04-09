/**
 * Fixed 12-step neutral solids (app bg → text+). Not derived from the chromatic scale.
 * Injected on `data-theme-root` as `--gray-1`…`--gray-12`; `design-tokens.css` maps `--ds-color-neutral-*` to these.
 */

export const NEUTRAL_SOLIDS_LIGHT = [
  '#fcfcfc',
  '#f9f9f9',
  '#f0f0f0',
  '#e8e8e8',
  '#e1e1e1',
  '#d9d9d9',
  '#cecece',
  '#bbbbbb',
  '#8c8c8c',
  '#818181',
  '#636363',
  '#1f1f1f',
] as const;

export const NEUTRAL_SOLIDS_DARK = [
  '#000',
  '#121212',
  '#1f1f1f',
  '#282828',
  '#303030',
  '#3a3a3a',
  '#474747',
  '#606060',
  '#6d6d6d',
  '#7a7a7a',
  '#b3b3b3',
  '#eee',
] as const;

export function neutralSolidsForMode(isDark: boolean): readonly string[] {
  return isDark ? NEUTRAL_SOLIDS_DARK : NEUTRAL_SOLIDS_LIGHT;
}

export type CssVarMap = Record<string, string>;

/** Emits `--gray-1`…`--gray-12` for the active engine theme (`playgroundIsDark` / `data-mode`). */
export function buildNeutralSolidCssVars(isDark: boolean): CssVarMap {
  const solids = neutralSolidsForMode(isDark);
  const out: CssVarMap = {};
  for (let i = 0; i < 12; i++) {
    out[`--gray-${i + 1}`] = solids[i];
  }
  return out;
}
