import type { ColorUsageMode } from '../colorCoverage';
import type { CustomChromeColors } from '../customChromeColors';
import type { PanelBackgroundMode } from '../panelSurfaceGlass';
import { playgroundPreset } from './playground';
import { defaultIconSizeForSpacingScheme, type CardLayout, type SpacingScheme } from './spacingSchemes';

/** Default portal banner asset — keep in sync with `DEFAULT_PORTAL_BANNER_IMAGE_SRC` in `ThemeContext.tsx`. */
const PLAYGROUND_DEFAULT_BANNER_IMAGE_SRC = '/origin/banner.svg';

/** Named brand looks for the playground (Site tab → Brand Preset). */
export const BRAND_STYLE_PRESET_IDS = [
  'origin',
  'mono',
  'ignite',
  'corporate',
  'lucid',
  'aurora',
] as const;

export type BrandStylePresetId = (typeof BRAND_STYLE_PRESET_IDS)[number];

export function isBrandStylePresetId(s: string): s is BrandStylePresetId {
  return (BRAND_STYLE_PRESET_IDS as readonly string[]).includes(s);
}

export const BRAND_STYLE_PRESET_LABELS: Record<BrandStylePresetId, string> = {
  origin: 'Origin',
  mono: 'Mono',
  ignite: 'Ignite',
  corporate: 'Corporate',
  lucid: 'Lucid',
  aurora: 'Aurora',
};

/**
 * Snapshot of playground controls for a named brand style.
 * Unions mirror ThemeContext / floating controls — keep them aligned when wiring `apply`.
 */
export type BrandStyleSnapshotColorMode = 'light-only' | 'dark-only' | 'light-and-dark';

export type BrandStyleSnapshotRadiusTier = 'none' | 'small' | 'medium' | 'large' | 'full';

export type BrandStyleSnapshotBannerStyle = 'colored' | 'image';

export type BrandStyleSnapshotBannerHeading = 'light' | 'dark';

export interface BrandStyleSnapshot {
  playgroundHex?: string;
  playgroundIsDark?: boolean;
  colorModeSetting?: BrandStyleSnapshotColorMode;
  themeRadiusTier?: BrandStyleSnapshotRadiusTier;
  spacingScheme?: SpacingScheme;
  cardLayout?: CardLayout;
  iconSize?: number;
  portalBannerStyle?: BrandStyleSnapshotBannerStyle;
  portalBannerImage?: string | null;
  portalBannerSolidBackgroundHex?: string | null;
  bannerPaddingX?: number;
  portalBannerHeadingColor?: BrandStyleSnapshotBannerHeading;
  colorCoverage?: ColorUsageMode;
  panelBackgroundMode?: PanelBackgroundMode;
  customColorsEnabled?: boolean;
  customChrome?: Partial<CustomChromeColors>;
}

/**
 * Baseline snapshot: `playgroundPreset` plus the same initial values `ThemeProvider` uses
 * when there is no session storage (see `useState` fallbacks there).
 */
export function createPlaygroundDefaultBrandStyleSnapshot(): BrandStyleSnapshot {
  const spacingScheme = playgroundPreset.styles.spacingScheme;
  return {
    playgroundHex: playgroundPreset.swatchColor,
    playgroundIsDark: false,
    colorModeSetting: 'light-and-dark',
    themeRadiusTier: 'medium',
    spacingScheme,
    cardLayout: playgroundPreset.cardLayout,
    iconSize: defaultIconSizeForSpacingScheme(spacingScheme),
    portalBannerStyle: 'image',
    portalBannerImage: PLAYGROUND_DEFAULT_BANNER_IMAGE_SRC,
    portalBannerSolidBackgroundHex: null,
    bannerPaddingX: playgroundPreset.styles.bannerPaddingX,
    portalBannerHeadingColor: 'light',
    colorCoverage: 'prominent',
    panelBackgroundMode: 'solid',
    customColorsEnabled: true,
    customChrome: {
      headerBg: '#ffffff',
      headerText: '#0a0a0a',
      footerBg: '#f4f5f7',
      footerText: '#636363',
      bannerBg: '#f4f5f7',
      bannerText: '#ffffff',
    },
  };
}

/** Canonical “Origin” / shipped playground defaults (single reference — treat as read-only). */
export const playgroundDefaultBrandStyleSnapshot: BrandStyleSnapshot =
  createPlaygroundDefaultBrandStyleSnapshot();

function cloneBrandStyleSnapshot(s: BrandStyleSnapshot): BrandStyleSnapshot {
  return {
    ...s,
    customChrome: s.customChrome ? { ...s.customChrome } : undefined,
  };
}

const monoBrandStyleSnapshot: BrandStyleSnapshot = {
  playgroundHex: '#000000',
  playgroundIsDark: false,
  colorModeSetting: 'light-only',
  themeRadiusTier: 'none',
  spacingScheme: 'compact',
  cardLayout: 'grid-3col',
  iconSize: 72,
  portalBannerStyle: 'image',
  portalBannerImage: null,
  portalBannerSolidBackgroundHex: null,
  bannerPaddingX: 92,
  portalBannerHeadingColor: 'dark',
  colorCoverage: 'standard',
  panelBackgroundMode: 'solid',
  customColorsEnabled: true,
  customChrome: {
    headerBg: '#ffffff',
    headerText: '#000000',
    footerBg: '#ffffff',
    footerText: '#000000',
    bannerBg: '#ffffff',
    bannerText: '#000000',
  },
};

const igniteBrandStyleSnapshot: BrandStyleSnapshot = {
  playgroundHex: '#EDB007',
  playgroundIsDark: true,
  colorModeSetting: 'dark-only',
  themeRadiusTier: 'medium',
  spacingScheme: 'spacious',
  panelBackgroundMode: 'translucent',
  colorCoverage: 'standard',
  customColorsEnabled: false,
  portalBannerStyle: 'image',
  portalBannerImage: '/bold/bannerImageForBold.png',
  portalBannerSolidBackgroundHex: null,
  portalBannerHeadingColor: 'light',
  cardLayout: 'list-1col',
  iconSize: 128,
  bannerPaddingX: 300,
};

const auroraBrandStyleSnapshot: BrandStyleSnapshot = {
  playgroundHex: '#7056FF',
  playgroundIsDark: false,
  colorModeSetting: 'light-only',
  themeRadiusTier: 'medium',
  spacingScheme: 'standard',
  panelBackgroundMode: 'solid',
  colorCoverage: 'prominent',
  customColorsEnabled: true,
  customChrome: {
    bannerText: '#000000',
  },
  portalBannerStyle: 'image',
  portalBannerImage: '/bannerImageforAura.png',
  portalBannerSolidBackgroundHex: null,
  portalBannerHeadingColor: 'light',
  cardLayout: 'list-3col',
  iconSize: 58,
  bannerPaddingX: 115,
};

const corporateBrandStyleSnapshot: BrandStyleSnapshot = {
  playgroundHex: '#AF7B0E',
  playgroundIsDark: false,
  colorModeSetting: 'light-only',
  themeRadiusTier: 'small',
  spacingScheme: 'standard',
  panelBackgroundMode: 'solid',
  colorCoverage: 'prominent',
  customColorsEnabled: true,
  customChrome: {
    headerBg: '#2c2c2c',
    headerText: '#ffffff',
    footerBg: '#2c2c2c',
    footerText: '#ffffff',
  },
  portalBannerStyle: 'image',
  portalBannerImage: '/bannerImageForLegacy.png',
  portalBannerSolidBackgroundHex: null,
  portalBannerHeadingColor: 'light',
  cardLayout: 'list-2col',
  iconSize: 58,
  bannerPaddingX: 82,
};

/** Lucid: light blue brand, minimal ramp, spacious grid-3col, full chrome slots, no banner image. */
const lucidBrandStyleSnapshot: BrandStyleSnapshot = {
  playgroundHex: '#0066FF',
  playgroundIsDark: false,
  colorModeSetting: 'light-only',
  themeRadiusTier: 'large',
  spacingScheme: 'spacious',
  panelBackgroundMode: 'solid',
  colorCoverage: 'minimal',
  customColorsEnabled: true,
  customChrome: {
    headerBg: '#F9F9F9',
    headerText: '#0A0A0A',
    footerBg: '#FFFFFF',
    footerText: '#818181',
    bannerBg: '#F9F9F9',
    bannerText: '#000000',
  },
  portalBannerStyle: 'image',
  portalBannerImage: null,
  portalBannerSolidBackgroundHex: null,
  portalBannerHeadingColor: 'dark',
  cardLayout: 'grid-3col',
  iconSize: 96,
  bannerPaddingX: 160,
};

/**
 * Per named look. `origin` matches playground defaults; other entries start as copies so each
 * style can diverge without mutating Origin.
 */
export const brandStyleSnapshots: Record<BrandStylePresetId, BrandStyleSnapshot> = {
  origin: playgroundDefaultBrandStyleSnapshot,
  mono: cloneBrandStyleSnapshot(monoBrandStyleSnapshot),
  ignite: cloneBrandStyleSnapshot(igniteBrandStyleSnapshot),
  corporate: cloneBrandStyleSnapshot(corporateBrandStyleSnapshot),
  lucid: cloneBrandStyleSnapshot(lucidBrandStyleSnapshot),
  aurora: cloneBrandStyleSnapshot(auroraBrandStyleSnapshot),
};

export function getBrandStyleSnapshot(id: BrandStylePresetId): BrandStyleSnapshot {
  return brandStyleSnapshots[id];
}

/** Approximate count of controls represented by a snapshot (for “Browse style presets” cards). */
export function countBrandStylePresetAffectedSettings(id: BrandStylePresetId): number {
  const s = brandStyleSnapshots[id];
  let c = 0;
  for (const [k, v] of Object.entries(s) as [keyof BrandStyleSnapshot, unknown][]) {
    if (v === undefined) continue;
    if (k === 'customChrome' && v && typeof v === 'object') {
      c += Object.keys(v as Record<string, unknown>).length;
    } else {
      c += 1;
    }
  }
  return c;
}
