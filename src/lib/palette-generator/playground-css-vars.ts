import { wcagContrast } from 'culori';
import { generateDarkScale, generateScale } from './generate-scale';

type CssVarMap = Record<string, string>;

function onColor(bgHex: string): string {
  const onWhite = wcagContrast('#ffffff', bgHex) ?? 1;
  const onBlack = wcagContrast('#111111', bgHex) ?? 1;
  return onWhite + 5 >= onBlack ? '#ffffff' : '#111111';
}

/**
 * Playground copy uses the fixed neutral ramp only (same step numbers as the generator UI):
 * - Text (step 11) → `--gray-11` — paragraphs, card descriptions, footer tagline (inherits), etc.
 * - Text+ (step 12) → `--gray-12` — headings, banner H1, header nav/links/chrome (`--theme-header-text-color`)
 * Values swap with site theme via `design-tokens.css` on `[data-mode="light"|"dark"]`.
 * Search “Search all” stays on `--theme-primary-color` (SearchBar + `searchButtonBrand`).
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

export function buildPlaygroundCssVars(baseHex: string, scaleIsDark: boolean): CssVarMap {
  const { diagnostics } = scaleIsDark ? generateDarkScale(baseHex) : generateScale(baseHex);
  if (diagnostics.length < 12) return {};

  const s1 = diagnostics[0].hex;
  const s2 = diagnostics[1].hex;
  const s3 = diagnostics[2].hex;
  const s4 = diagnostics[3].hex;
  const s6 = diagnostics[5].hex;
  const s7 = diagnostics[6].hex;
  const s8 = diagnostics[7].hex;
  const s9 = diagnostics[8].hex;
  const s11 = diagnostics[10].hex;
  const s12 = diagnostics[11].hex;

  const branded: CssVarMap = {
    '--theme-primary-color': s9,
    '--theme-on-primary-color': onColor(s9),

    '--theme-header-background-color': s2,
    '--theme-header-text-color': s11,
    '--theme-banner-background-color': s1,
    '--theme-banner-text-color': s11,
    '--theme-footer-background-color': s2,
    '--theme-footer-text-color': s7,
    '--theme-text-color': s11,
    '--theme-headline-color': s12,

    '--ds-color-neutral-0': s1,
    '--ds-color-neutral-25': s2,
    '--ds-color-neutral-50': s3,
    '--ds-color-neutral-75': s4,
    '--ds-color-neutral-100': diagnostics[4].hex,
    '--ds-color-neutral-200': s6,
    '--ds-color-neutral-300': s7,
    '--ds-color-neutral-400': s8,
    '--ds-color-neutral-500': s9,
    '--ds-color-neutral-900': s11,
    '--ds-color-neutral-1000': s12,

    '--ds-color-brand-50': s3,
    '--ds-color-brand-75': s4,
    '--ds-border-neutral-hovered': s8,
    '--ds-border-neutral-strong-hovered': s9,
    '--ds-icon-information': s9,
    '--ds-background-information': s2,
    '--ds-link': s9,
  };

  /** Keep portal card icons on the generated brand ramp even when copy uses fixed grays. */
  const cardIconFromPalette: CssVarMap = { '--ds-card-icon-color': s9 };

  return {
    ...branded,
    ...neutralPortalTextOverrides(),
    ...cardIconFromPalette,
  };
}
