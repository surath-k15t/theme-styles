/**
 * Fixed 14-step neutral scale (engine primitives). Not derived from the chromatic scale.
 * Injected on `data-theme-root` as `--neutral-0`…`--neutral-13`.
 * Core tokens (`--K15t-color-neutral-*` in CSS) reference these.
 */

export const NEUTRAL_SOLIDS_LIGHT = [
  '#ffffff',
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
  '#000000',
] as const;

export const NEUTRAL_SOLIDS_DARK = [
  '#000000',
  '#0a0a0a',
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
  '#eeeeee',
  '#ffffff',
] as const;

export function neutralSolidsForMode(isDark: boolean): readonly string[] {
  return isDark ? NEUTRAL_SOLIDS_DARK : NEUTRAL_SOLIDS_LIGHT;
}

export type CssVarMap = Record<string, string>;

/** Emits `--neutral-0`…`--neutral-13` for the active engine theme (`playgroundIsDark` / `data-mode`). */
export function buildNeutralSolidCssVars(isDark: boolean): CssVarMap {
  const solids = neutralSolidsForMode(isDark);
  const out: CssVarMap = {};
  for (let i = 0; i < 14; i++) {
    out[`--neutral-${i}`] = solids[i]!;
  }
  return out;
}
