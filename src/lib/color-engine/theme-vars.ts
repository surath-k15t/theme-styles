import type { CssVarMap } from './neutral-ramp';
import { buildNeutralSolidCssVars } from './neutral-ramp';
import { buildPlaygroundCssVars } from './playground-css-vars';

/**
 * All color-engine output for `data-theme-root`: fixed neutral scale (`--gray-1`…`12` on the theme root)
 * plus chromatic steps (`--palette-step-*`), on-primary, and portal text overrides.
 * `isDark` must match `data-mode="dark"|"light"` on the same node.
 *
 * `applyBrandColor`: when false, `--palette-step-*` mirror the neutral ramp; hovers stay chromatic.
 */
export function buildColorEngineThemeVars(
  baseHex: string,
  isDark: boolean,
  applyBrandColor = true,
): CssVarMap {
  return {
    ...buildNeutralSolidCssVars(isDark),
    ...buildPlaygroundCssVars(baseHex, isDark, applyBrandColor),
  };
}
