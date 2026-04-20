import type { ColorUsageMode } from './colorCoverage';
import { resolveHeaderTintHex, siteHeaderForegroundHex, type SiteHeaderContrastInput } from './color-engine';
import type { PanelBackgroundMode } from './panelSurfaceGlass';

export type CustomChromeColors = {
  headerBg: string;
  headerText: string;
  footerBg: string;
  footerText: string;
  bannerBg: string;
  bannerText: string;
};

export const CUSTOM_COLORS_SESSION_KEY = 'playground:customChromeColors';

const HEX6 = /^#[0-9a-fA-F]{6}$/;

export function normalizeHex6(input: string, fallback: string): string {
  const t = input.trim();
  if (HEX6.test(t)) return t.toLowerCase();
  return fallback;
}

/** Palette-driven defaults for the six chrome slots (matches tokens + header contrast logic). */
export function computePaletteChromeColors(input: {
  engineVars: Record<string, string | undefined>;
  colorCoverage: ColorUsageMode;
  mode: 'light' | 'dark';
  panelBackgroundMode: PanelBackgroundMode;
  portalBannerStyle: 'colored' | 'image';
  portalBannerSolidBackgroundHex: string | null;
  portalBannerSolidBackgroundDefaultHex: string;
  portalBannerHeadingColor: 'light' | 'dark';
}): CustomChromeColors {
  const contrastInput: SiteHeaderContrastInput = {
    variant: 'portal',
    panelBackgroundMode: input.panelBackgroundMode,
    mode: input.mode,
    colorCoverage: input.colorCoverage,
    engineVars: input.engineVars,
    portalBannerStyle: input.portalBannerStyle,
    portalBannerSolidBackgroundHex: input.portalBannerSolidBackgroundHex,
    portalBannerSolidBackgroundDefaultHex: input.portalBannerSolidBackgroundDefaultHex,
  };

  const headerBg = resolveHeaderTintHex(input.engineVars, input.colorCoverage);
  const headerText = siteHeaderForegroundHex(contrastInput);
  const footerBg = input.engineVars['--palette-step-2'] ?? '#f4f5f7';
  const footerText = input.engineVars['--neutral-10'] ?? '#636363';
  const bannerBg = input.engineVars['--palette-step-3'] ?? '#e9eef7';
  const bannerText = input.portalBannerHeadingColor === 'light' ? '#ffffff' : '#0a0a0a';

  return {
    headerBg,
    headerText,
    footerBg,
    footerText,
    bannerBg,
    bannerText,
  };
}

export function readStoredCustomChrome(): { enabled: boolean; colors: CustomChromeColors } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(CUSTOM_COLORS_SESSION_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as Partial<{ enabled: boolean } & CustomChromeColors>;
    if (typeof o.enabled !== 'boolean') return null;
    const fb = '#000000';
    const colors: CustomChromeColors = {
      headerBg: typeof o.headerBg === 'string' ? normalizeHex6(o.headerBg, fb) : fb,
      headerText: typeof o.headerText === 'string' ? normalizeHex6(o.headerText, fb) : fb,
      footerBg: typeof o.footerBg === 'string' ? normalizeHex6(o.footerBg, fb) : fb,
      footerText: typeof o.footerText === 'string' ? normalizeHex6(o.footerText, fb) : fb,
      bannerBg: typeof o.bannerBg === 'string' ? normalizeHex6(o.bannerBg, fb) : fb,
      bannerText: typeof o.bannerText === 'string' ? normalizeHex6(o.bannerText, fb) : fb,
    };
    return { enabled: o.enabled, colors };
  } catch {
    return null;
  }
}

export function persistCustomChrome(enabled: boolean, colors: CustomChromeColors): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(
    CUSTOM_COLORS_SESSION_KEY,
    JSON.stringify({ enabled, ...colors }),
  );
}
