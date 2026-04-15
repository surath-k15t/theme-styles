import type { ColorUsageMode } from '@/lib/colorCoverage';
import type { CssVarMap } from './neutral-ramp';
import { buildNeutralSolidCssVars } from './neutral-ramp';
import { buildPlaygroundCssVars } from './playground-css-vars';

/**
 * All color-engine output for `data-theme-root`: fixed neutral scale (`--neutral-0`…`13`)
 * plus chromatic steps (`--palette-step-*`), on-primary, and portal text overrides.
 * `isDark` must match `data-mode="dark"|"light"` on the same node.
 *
 * **Standard** = full chromatic `--palette-step-*`. **Subtle / Minimal** = neutral palette steps +
 * chromatic `--chromatic-step-*` (see `buildPlaygroundCssVars`).
 */
export function buildColorEngineThemeVars(
  baseHex: string,
  isDark: boolean,
  colorUsage: ColorUsageMode = 'standard',
): CssVarMap {
  return {
    ...buildNeutralSolidCssVars(isDark),
    ...buildPlaygroundCssVars(baseHex, isDark, colorUsage),
  };
}
