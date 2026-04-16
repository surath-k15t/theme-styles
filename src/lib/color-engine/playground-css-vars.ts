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
 * Injects accent steps (`--palette-step-*`, `--chromatic-step-*`) and contrast picks from hex math.
 * Color coverage is not handled here; usage behavior lives in `src/design-tokens/alias-tokens.css`.
 */
export function buildPlaygroundCssVars(
  baseHex: string,
  scaleIsDark: boolean,
): CssVarMap {
  const { diagnostics } = scaleIsDark ? generateDarkScale(baseHex) : generateScale(baseHex);
  if (diagnostics.length < 12) return {};

  const neutral = neutralSolidsForMode(scaleIsDark);

  const chromaticStep9Hex = diagnostics[8]!.hex;
  /** Neutral step used for search fill contrast — index 3 on the 14-step ramp. */
  const neutralStep3Hex = neutral[3]!;

  return {
    ...chromaticStepVars(diagnostics),
    ...paletteStepVars(diagnostics),
    '--theme-on-primary-color': onColor(chromaticStep9Hex),
    '--theme-on-search-neutral-fill': onColor(neutralStep3Hex),
  };
}
