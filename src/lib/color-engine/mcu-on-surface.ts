import { Contrast, Hct, argbFromRgb } from '@material/material-color-utilities';
import type { ColorUsageMode } from '../colorCoverage';

/** Matches `panelSurfaceGlass`: frosted layer is this fraction of the tint color over the backdrop. */
const HEADER_GLASS_TINT_ALPHA = 0.45;

/** Stand-in when the portal banner is an image (no single sampled color without canvas work). */
const PORTAL_IMAGE_BANNER_UNDERLAY_HEX = '#64748b';

function parseHexRgb(hex: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** sRGB source-over: `top` at opacity `topAlpha` over opaque `bottom`. */
export function compositeSrgbOver(bottomHex: string, topHex: string, topAlpha: number): string {
  const a = Math.min(1, Math.max(0, topAlpha));
  const B = parseHexRgb(bottomHex);
  const T = parseHexRgb(topHex);
  if (!B || !T) return topHex;
  const r = Math.round(B[0] * (1 - a) + T[0] * a);
  const g = Math.round(B[1] * (1 - a) + T[1] * a);
  const b = Math.round(B[2] * (1 - a) + T[2] * a);
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

function argbFromHex6(hex: string): number | null {
  const rgb = parseHexRgb(hex);
  if (!rgb) return null;
  return argbFromRgb(rgb[0], rgb[1], rgb[2]);
}

/**
 * Same idea as `ON_SOLID_LIGHT_FOREGROUND_WCAG_BIAS` in `playground-css-vars.ts`:
 * Material’s `Contrast.ratioOfTones` (WCAG-style luminance) often scores **black** slightly
 * higher than **white** on mid-tone chromatic surfaces. A bias nudges toward light labels
 * where the math is close (e.g. brand purples); frosted stacks need a bit more nudge — see
 * `HEADER_TRANSLUCENT_WHITE_RATIO_BIAS`.
 */
const MCU_WHITE_TONE_RATIO_BIAS = 1.12;

/** Glass composites often land near tone ~50–60 where black “wins” by a small margin. */
const HEADER_TRANSLUCENT_WHITE_RATIO_BIAS = 1.35;

export type McuOnSurfaceOptions = {
  /** Multiply Material’s white-side ratio before comparing to black (default `MCU_WHITE_TONE_RATIO_BIAS`). */
  whiteToneRatioBias?: number;
};

/**
 * Foreground for UI on a solid surface using Material Color Utilities:
 * `Hct` tone of the background vs `Contrast.ratioOfTones` to T100 (white) and T0 (black).
 */
export function mcuForegroundOnSurfaceHex(
  bgHex: string,
  options?: McuOnSurfaceOptions,
): '#ffffff' | '#0a0a0a' {
  const bias = options?.whiteToneRatioBias ?? MCU_WHITE_TONE_RATIO_BIAS;
  const argb = argbFromHex6(bgHex);
  if (argb == null) return '#0a0a0a';
  const tone = Hct.fromInt(argb).tone;
  const rWhite = Contrast.ratioOfTones(100, tone);
  const rBlack = Contrast.ratioOfTones(0, tone);
  return rWhite * bias >= rBlack ? '#ffffff' : '#0a0a0a';
}

/** Opaque header tint before glass (`color-mix` top color), aligned with alias token usage. */
export function resolveHeaderTintHex(
  engineVars: Record<string, string | undefined>,
  colorCoverage: ColorUsageMode,
): string {
  if (colorCoverage === 'minimal') {
    return engineVars['--neutral-1'] ?? '#fcfcfc';
  }
  return engineVars['--palette-step-2'] ?? '#f9f9f9';
}

function resolveBannerBaseHexForPortalGlass(input: {
  portalBannerStyle: 'colored' | 'image';
  portalBannerSolidBackgroundHex: string | null;
  portalBannerSolidBackgroundDefaultHex: string;
}): string {
  if (input.portalBannerStyle === 'colored') {
    return input.portalBannerSolidBackgroundHex ?? input.portalBannerSolidBackgroundDefaultHex;
  }
  return PORTAL_IMAGE_BANNER_UNDERLAY_HEX;
}

export type SiteHeaderContrastInput = {
  variant: 'portal' | 'article';
  panelBackgroundMode: 'solid' | 'translucent';
  mode: 'light' | 'dark';
  colorCoverage: ColorUsageMode;
  engineVars: Record<string, string | undefined>;
  portalBannerStyle: 'colored' | 'image';
  portalBannerSolidBackgroundHex: string | null;
  portalBannerSolidBackgroundDefaultHex: string;
};

/** Approximate color the eye reads through the header bar (solid, or glass over canvas / banner). */
export function effectiveSiteHeaderBackgroundHex(input: SiteHeaderContrastInput): string {
  const tint = resolveHeaderTintHex(input.engineVars, input.colorCoverage);
  const transl = input.panelBackgroundMode === 'translucent';
  const portalGlass = input.variant === 'portal' && transl;

  if (portalGlass) {
    const banner = resolveBannerBaseHexForPortalGlass({
      portalBannerStyle: input.portalBannerStyle,
      portalBannerSolidBackgroundHex: input.portalBannerSolidBackgroundHex,
      portalBannerSolidBackgroundDefaultHex: input.portalBannerSolidBackgroundDefaultHex,
    });
    return compositeSrgbOver(banner, tint, HEADER_GLASS_TINT_ALPHA);
  }

  if (transl) {
    const canvas =
      input.mode === 'dark'
        ? (input.engineVars['--neutral-0'] ?? '#000000')
        : (input.engineVars['--neutral-2'] ?? '#f9f9f9');
    return compositeSrgbOver(canvas, tint, HEADER_GLASS_TINT_ALPHA);
  }

  return tint;
}

export function siteHeaderForegroundHex(input: SiteHeaderContrastInput): '#ffffff' | '#0a0a0a' {
  const bg = effectiveSiteHeaderBackgroundHex(input);
  const transl = input.panelBackgroundMode === 'translucent';
  return mcuForegroundOnSurfaceHex(bg, {
    whiteToneRatioBias: transl ? HEADER_TRANSLUCENT_WHITE_RATIO_BIAS : MCU_WHITE_TONE_RATIO_BIAS,
  });
}
