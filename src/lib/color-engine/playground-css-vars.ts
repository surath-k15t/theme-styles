import { wcagContrast } from 'culori';
import { generateDarkScale, generateScale } from './generate-scale';

type CssVarMap = Record<string, string>;

function onColor(bgHex: string): string {
  const onWhite = wcagContrast('#ffffff', bgHex) ?? 1;
  const onBlack = wcagContrast('#111111', bgHex) ?? 1;
  return onWhite >= onBlack ? '#ffffff' : '#111111';
}

/**
 * Portal copy uses the fixed neutral ramp from `neutral-ramp.ts` (injected as `--gray-*` on the theme root):
 * - Text (step 11) → `--gray-11` — paragraphs, card descriptions, footer tagline (inherits), etc.
 * - Text+ (step 12) → `--gray-12` — headings, banner H1, header nav/chrome (`--theme-header-text-color`)
 * `scaleIsDark` must match `data-mode` on `data-theme-root` (both driven from the same state in ThemeContext).
 */
function neutralPortalTextOverrides(): CssVarMap {
  const text = 'var(--gray-11)';
  const textPlus = 'var(--gray-12)';
  return {
    '--neutral-text': text,
    '--neutral-text-plus': textPlus,
    '--theme-header-text-color': textPlus,
    '--theme-banner-text-color': textPlus,
    '--theme-footer-text-color': text,
    '--theme-text-color': text,
    '--theme-headline-color': textPlus,
    '--ds-foreground': text,
    '--ds-foreground-subtle': text,
  };
}

function paletteStepVars(diagnostics: { hex: string }[]): CssVarMap {
  const out: CssVarMap = {};
  for (let i = 0; i < 12; i++) {
    out[`--palette-step-${i + 1}`] = diagnostics[i].hex;
  }
  return out;
}

/**
 * Injects the 12-step chromatic output as `--palette-step-*`. Brand tokens in `design-tokens.css`
 * reference those steps; this file adds on-primary + portal text overrides.
 */
export function buildPlaygroundCssVars(baseHex: string, scaleIsDark: boolean): CssVarMap {
  const { diagnostics } = scaleIsDark ? generateDarkScale(baseHex) : generateScale(baseHex);
  if (diagnostics.length < 12) return {};

  const s9 = diagnostics[8].hex;

  return {
    ...paletteStepVars(diagnostics),
    '--theme-on-primary-color': onColor(s9),
    ...neutralPortalTextOverrides(),
    '--ds-card-icon-color': 'var(--ds-icon-brand)',
  };
}
