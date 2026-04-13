import { converter, parse, wcagContrast } from 'culori';
import { generateDarkScale, generateScale } from './generate-scale';
import { neutralSolidsForMode } from './neutral-ramp';

type CssVarMap = Record<string, string>;

const toOklch = converter('oklch');

/**
 * Gold / yellow / amber solids: prefer light foreground so mid yellows (e.g. `#d69c1f`) read with
 * white label text instead of WCAG’s black-on-gold pick. Skips near-neutral chroma and very pale yellows.
 */
const ON_SOLID_YELLOW_OKLCH_H_MIN = 58;
const ON_SOLID_YELLOW_OKLCH_H_MAX = 105;
const ON_SOLID_YELLOW_CHROMA_MIN = 0.04;
const ON_SOLID_YELLOW_LIGHTNESS_MAX = 0.82;

function preferWhiteForYellowFamilySolid(bgHex: string): boolean {
  const rgb = parse(bgHex);
  if (!rgb) return false;
  const o = toOklch(rgb);
  if (!o || o.mode !== 'oklch') return false;
  const c = o.c ?? 0;
  if (c < ON_SOLID_YELLOW_CHROMA_MIN) return false;
  const h = o.h;
  if (h === undefined || Number.isNaN(h)) return false;
  if (h < ON_SOLID_YELLOW_OKLCH_H_MIN || h > ON_SOLID_YELLOW_OKLCH_H_MAX) return false;
  const l = o.l ?? 0;
  return l <= ON_SOLID_YELLOW_LIGHTNESS_MAX;
}

/**
 * White’s WCAG contrast is scaled by this before comparing to black, so light text wins on
 * many vibrant brand solids (e.g. `#7b61ff` where black is only slightly “better” on paper).
 * Light pastels still get dark text when black is clearly stronger.
 */
const ON_SOLID_LIGHT_FOREGROUND_WCAG_BIAS = 1.12;

/** Picks `#ffffff` vs `#111111` for text on solid fills (`--theme-on-primary-color`, search pill, etc.). */
function onColor(bgHex: string): string {
  if (preferWhiteForYellowFamilySolid(bgHex)) return '#ffffff';
  const onWhite = wcagContrast('#ffffff', bgHex) ?? 1;
  const onBlack = wcagContrast('#111111', bgHex) ?? 1;
  return onWhite * ON_SOLID_LIGHT_FOREGROUND_WCAG_BIAS >= onBlack ? '#ffffff' : '#111111';
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
 * When `--palette-step-*` is neutral, keep hovers on the real accent (matches `design-tokens`
 * brand-50 / 400 / 500 → steps 2, 6, 7).
 */
const CHROMATIC_HOVER_VARS: CssVarMap = {
  '--ds-surface-hovered': 'var(--chromatic-step-2)',
  '--ds-surface-raised-hovered': 'var(--chromatic-step-2)',
  '--ds-border-brand-hovered': 'var(--chromatic-step-6)',
  '--ds-border-brand-strong-hovered': 'var(--chromatic-step-7)',
};

/**
 * Injects `--palette-step-*` (chromatic or neutral copy) plus on-primary and portal text overrides.
 *
 * `applyBrandColor`: when false, palette mirrors the neutral scale so resting UI uses that ramp; hover
 * tokens are still overridden to `--chromatic-step-*` so cards keep brand-colored hovers.
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

  const s9 = applyBrandColor ? diagnostics[8].hex : neutral[8];
  const neutralStep3Hex = neutral[2];

  return {
    ...chromaticStepVars(diagnostics),
    ...paletteStepVars(paletteDiagnostics),
    /*
     * Page canvas (`--ds-canvas` → portal/article bg): accent step 1 when brand is on; when off,
     * fixed white (light) or neutral ramp step 1 (dark) so the page floor is not chromatic.
     */
    '--ds-canvas': applyBrandColor
      ? 'var(--palette-step-1)'
      : scaleIsDark
        ? 'var(--gray-1)'
        : '#ffffff',
    '--theme-on-primary-color': onColor(s9),
    /* “Search all” when brand color off: fill is `--gray-3` — contrast vs that hex. */
    '--theme-on-search-neutral-fill': onColor(neutralStep3Hex),
    ...neutralPortalTextOverrides(),
    /* Showcase / user icons — always chromatic; not affected by `applyBrandColor` (palette may be neutral). */
    '--ds-card-icon-color': scaleIsDark ? 'var(--chromatic-step-11)' : 'var(--chromatic-step-9)',
    ...(applyBrandColor ? {} : CHROMATIC_HOVER_VARS),
  };
}
