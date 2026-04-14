import { Scheme, hexFromArgb } from '@material/material-color-utilities';
import { wcagContrast } from 'culori';
import { generateDarkScale, generateScale } from './generate-scale';
import { materialPinnedPrimaryStep, parseMaterialSourceArgb } from './material-palette-engine';
import { neutralSolidsForMode } from './neutral-ramp';

type CssVarMap = Record<string, string>;

/** Plain WCAG pick for neutrals (no legacy yellow / bias overrides). */
function onColorSimple(bgHex: string): string {
  const onWhite = wcagContrast('#ffffff', bgHex) ?? 1;
  const onBlack = wcagContrast('#111111', bgHex) ?? 1;
  return onWhite >= onBlack ? '#ffffff' : '#111111';
}

/**
 * Portal copy uses the fixed neutral scale from `neutral-ramp.ts` (injected as `--gray-*` on the theme root):
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

/** Live accent ramp (always from `generateScale` / `generateDarkScale`). */
function chromaticStepVars(diagnostics: { hex: string }[]): CssVarMap {
  const out: CssVarMap = {};
  for (let i = 0; i < 12; i++) {
    out[`--chromatic-step-${i + 1}`] = diagnostics[i].hex;
  }
  return out;
}

/**
 * Injects `--palette-step-*` (chromatic or neutral copy) plus on-primary and portal text overrides.
 *
 * `applyBrandColor`: when false, `--palette-step-*` mirror the neutral scale; semantic tokens that map
 * through `--ds-color-brand-*` (e.g. `--ds-surface`, `--ds-surface-hovered`) follow that ramp.
 */
export function buildPlaygroundCssVars(
  baseHex: string,
  scaleIsDark: boolean,
  applyBrandColor = true,
): CssVarMap {
  const { diagnostics } = scaleIsDark ? generateDarkScale(baseHex) : generateScale(baseHex);
  if (diagnostics.length < 12) return {};

  const neutral = neutralSolidsForMode(scaleIsDark);
  const paletteDiagnostics = applyBrandColor
    ? diagnostics
    : neutral.map(hex => ({ hex }));

  const pin = materialPinnedPrimaryStep(baseHex);
  const primaryStepHex = applyBrandColor
    ? diagnostics[pin - 1]?.hex ?? neutral[pin - 1]
    : neutral[pin - 1];
  const neutralStep3Hex = neutral[2];

  const sourceArgb = parseMaterialSourceArgb(baseHex);
  const scheme =
    applyBrandColor && sourceArgb != null
      ? scaleIsDark
        ? Scheme.dark(sourceArgb)
        : Scheme.light(sourceArgb)
      : null;

  const primaryVars: CssVarMap = applyBrandColor
    ? {
        '--ds-color-brand-700': `var(--palette-step-${pin})`,
        '--theme-primary-color': `var(--palette-step-${pin})`,
      }
    : {};

  return {
    ...chromaticStepVars(diagnostics),
    ...paletteStepVars(paletteDiagnostics),
    ...primaryVars,
    /*
     * Page canvas (`--ds-canvas` → portal/article bg): accent step 1 when brand is on; when off,
     * fixed white (light) or neutral ramp step 1 (dark) so the page floor is not chromatic.
     */
    '--ds-canvas': applyBrandColor
      ? 'var(--palette-step-1)'
      : scaleIsDark
        ? 'var(--gray-1)'
        : '#ffffff',
    '--theme-on-primary-color':
      scheme != null ? hexFromArgb(scheme.onPrimary) : onColorSimple(primaryStepHex),
    /* “Search all” when brand color off: fill is `--gray-3` — contrast vs that hex. */
    '--theme-on-search-neutral-fill': onColorSimple(neutralStep3Hex),
    ...neutralPortalTextOverrides(),
    '--ds-card-icon-color': applyBrandColor
      ? `var(--chromatic-step-${pin})`
      : scaleIsDark
        ? 'var(--chromatic-step-11)'
        : 'var(--chromatic-step-9)',
  };
}
