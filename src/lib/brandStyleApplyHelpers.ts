import { buildColorEngineThemeVars } from './color-engine';
import { computePaletteChromeColors, type CustomChromeColors } from './customChromeColors';
import { presets } from './presets';
import type {
  BrandStyleSnapshot,
  BrandStyleSnapshotBannerHeading,
  BrandStyleSnapshotBannerStyle,
  BrandStyleSnapshotColorMode,
  BrandStyleSnapshotRadiusTier,
} from './presets/brandStyles';
import type { CardLayout, SpacingScheme } from './presets/spacingSchemes';

const PLAYGROUND_PRESET_ID = 'playground' as const;

/** Subset of theme state used to detect drift from the last-applied brand snapshot. */
export type BrandStyleComparePin = {
  playgroundHex: string;
  playgroundIsDark: boolean;
  colorModeSetting: BrandStyleSnapshotColorMode;
  themeRadiusTier: BrandStyleSnapshotRadiusTier;
  spacingScheme: SpacingScheme;
  cardLayout: CardLayout;
  iconSize: number;
  portalBannerStyle: BrandStyleSnapshotBannerStyle;
  portalBannerImage: string | null;
  portalBannerSolidBackgroundHex: string | null;
  bannerPaddingX: number;
  portalBannerHeadingColor: BrandStyleSnapshotBannerHeading;
  colorCoverage: NonNullable<BrandStyleSnapshot['colorCoverage']>;
  panelBackgroundMode: NonNullable<BrandStyleSnapshot['panelBackgroundMode']>;
  customColorsEnabled: boolean;
  customChrome: CustomChromeColors;
};

function normHex(h: string): string {
  return h.trim().toLowerCase();
}

/** Palette-derived chrome merged with snapshot overrides (same as ThemeProvider apply). */
export function buildMergedCustomChromeForSnapshot(snap: BrandStyleSnapshot): CustomChromeColors {
  const hex = snap.playgroundHex ?? presets[PLAYGROUND_PRESET_ID].swatchColor;
  const isDark = snap.playgroundIsDark ?? false;
  const modeUi: 'light' | 'dark' = isDark ? 'dark' : 'light';
  const engineVars = buildColorEngineThemeVars(hex, isDark);
  const solidDefault = engineVars['--palette-step-1'] ?? '#f4f5f7';
  const paletteChrome = computePaletteChromeColors({
    engineVars,
    colorCoverage: snap.colorCoverage ?? 'standard',
    mode: modeUi,
    panelBackgroundMode: snap.panelBackgroundMode ?? 'solid',
    portalBannerStyle: snap.portalBannerStyle ?? 'image',
    portalBannerSolidBackgroundHex: snap.portalBannerSolidBackgroundHex ?? null,
    portalBannerSolidBackgroundDefaultHex: solidDefault,
    portalBannerHeadingColor: snap.portalBannerHeadingColor ?? 'light',
  });
  return { ...paletteChrome, ...snap.customChrome };
}

const CHROME_KEYS: (keyof CustomChromeColors)[] = [
  'headerBg',
  'headerText',
  'footerBg',
  'footerText',
  'bannerBg',
  'bannerText',
];

export function playgroundMatchesBrandSnapshot(
  snap: BrandStyleSnapshot,
  p: BrandStyleComparePin,
): boolean {
  if (snap.playgroundHex !== undefined && normHex(snap.playgroundHex) !== normHex(p.playgroundHex)) {
    return false;
  }

  if (snap.playgroundIsDark !== undefined && snap.playgroundIsDark !== p.playgroundIsDark) return false;
  if (snap.colorModeSetting !== undefined && snap.colorModeSetting !== p.colorModeSetting) return false;
  if (snap.themeRadiusTier !== undefined && snap.themeRadiusTier !== p.themeRadiusTier) return false;
  if (snap.spacingScheme !== undefined && snap.spacingScheme !== p.spacingScheme) return false;
  if (snap.cardLayout !== undefined && snap.cardLayout !== p.cardLayout) return false;
  if (snap.iconSize !== undefined && snap.iconSize !== p.iconSize) return false;
  if (snap.portalBannerStyle !== undefined && snap.portalBannerStyle !== p.portalBannerStyle) return false;
  if (snap.portalBannerImage !== undefined && snap.portalBannerImage !== p.portalBannerImage) return false;
  if (snap.portalBannerSolidBackgroundHex !== undefined) {
    const a = snap.portalBannerSolidBackgroundHex
      ? normHex(snap.portalBannerSolidBackgroundHex)
      : null;
    const b = p.portalBannerSolidBackgroundHex ? normHex(p.portalBannerSolidBackgroundHex) : null;
    if (a !== b) return false;
  }
  if (snap.bannerPaddingX !== undefined && snap.bannerPaddingX !== p.bannerPaddingX) return false;
  if (snap.portalBannerHeadingColor !== undefined && snap.portalBannerHeadingColor !== p.portalBannerHeadingColor) {
    return false;
  }
  if (snap.colorCoverage !== undefined && snap.colorCoverage !== p.colorCoverage) return false;
  if (snap.panelBackgroundMode !== undefined && snap.panelBackgroundMode !== p.panelBackgroundMode) return false;

  if (snap.customColorsEnabled !== undefined) {
    if (snap.customColorsEnabled !== p.customColorsEnabled) return false;
    if (snap.customColorsEnabled) {
      const expected = buildMergedCustomChromeForSnapshot(snap);
      for (const k of CHROME_KEYS) {
        if (normHex(expected[k]) !== normHex(p.customChrome[k])) return false;
      }
    }
  }

  return true;
}
