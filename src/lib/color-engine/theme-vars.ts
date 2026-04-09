import type { CssVarMap } from './neutral-ramp';
import { buildNeutralSolidCssVars } from './neutral-ramp';
import { buildPlaygroundCssVars } from './playground-css-vars';

/**
 * All color-engine output for `data-theme-root`: fixed neutral solids (`--gray-1`…`12`)
 * plus chromatic steps (`--palette-step-*`), on-primary, and portal text overrides.
 * `isDark` must match `data-mode="dark"|"light"` on the same node.
 */
export function buildColorEngineThemeVars(baseHex: string, isDark: boolean): CssVarMap {
  return {
    ...buildNeutralSolidCssVars(isDark),
    ...buildPlaygroundCssVars(baseHex, isDark),
  };
}
