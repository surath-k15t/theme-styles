import type { CssVarMap } from './neutral-ramp';
import { buildNeutralSolidCssVars } from './neutral-ramp';
import { buildPlaygroundCssVars } from './playground-css-vars';

/**
 * All color-engine output for `data-theme-root`: fixed neutral scale (`--neutral-0`…`13`)
 * plus accent steps (`--palette-step-*`, `--chromatic-step-*`) and contrast vars.
 * `isDark` must match `data-mode="dark"|"light"` on the same node.
 */
export function buildColorEngineThemeVars(
  baseHex: string,
  isDark: boolean,
): CssVarMap {
  return {
    ...buildNeutralSolidCssVars(isDark),
    ...buildPlaygroundCssVars(baseHex, isDark),
  };
}
