import { clampChroma, converter, formatHex, parse, wcagContrast } from 'culori';
import {
  isRadixBlackAchromaticAnchor,
  RADIX_BLACK_SOLID_DARK_CHROMA,
  RADIX_BLACK_SOLID_DARK_L,
  RADIX_BLACK_SOLID_LIGHT_CHROMA,
  RADIX_BLACK_SOLID_LIGHT_L,
  RADIX_NEUTRAL_HUE,
} from './black-solids';
import { buildRadixDarkChromaticLc, buildLightnessTargetsDark } from './dark-chromatic';
import { RADIX_DARK_CHROMATIC_MIN_C } from './dark-templates';
import {
  buildLightnessTargetsLight,
  buildLightnessTargetsLowChromaDarkSolidLight,
  buildRadixLightChromaticLc,
} from './light-chromatic';
import { RADIX_LIGHT_CHROMATIC_MIN_C, STANDARD_LIGHT_L9 } from './light-templates';
import { resolveChroma } from './legacy-ramp';
import type { ColorStep } from './types';

const toOklch = converter('oklch');

function mapRowToSteps(
  mapper: (i: number) => { l: number; c: number; h: number },
): ColorStep[] {
  const raw = Array.from({ length: 12 }, (_, i) => {
    const { l, c, h } = mapper(i);
    const inGamut = toOklch(clampChroma({ mode: 'oklch' as const, l, c, h }, 'oklch'));
    return {
      step: i + 1,
      hex: formatHex(inGamut ?? { mode: 'oklch' as const, l, c, h }) ?? '#000000',
      l: inGamut?.l ?? l,
      c: (inGamut as { c?: number }).c ?? c,
      h: (inGamut as { h?: number }).h ?? h,
    };
  });
  const bgHex = raw[0].hex;
  return raw.map(s => ({
    ...s,
    contrast: Number((wcagContrast(s.hex, bgHex) ?? 1).toFixed(2)),
  }));
}

export function generateScaleLegacy(hex: string, isDark: boolean): ColorStep[] {
  const parsed = parse(hex);
  if (!parsed) return [];
  const base = toOklch(parsed);
  if (base == null || base.l == null) return [];

  const peakC = base.c ?? 0;
  const L_in = base.l;

  if (isRadixBlackAchromaticAnchor(L_in, peakC)) {
    const L_row = isDark ? RADIX_BLACK_SOLID_DARK_L : RADIX_BLACK_SOLID_LIGHT_L;
    const C_row = isDark ? RADIX_BLACK_SOLID_DARK_CHROMA : RADIX_BLACK_SOLID_LIGHT_CHROMA;
    return mapRowToSteps(i => ({
      l: L_row[i],
      c: C_row[i],
      h: RADIX_NEUTRAL_HUE,
    }));
  }

  /**
   * Low chroma + solid darker than the default Radix step-9 ref: legacy LIGHT_L shift makes
   * steps 10–11 darker than the solid (and can crush chrome). Use neutral head + anchored tail
   * (see #4a4847: L≈0.403, C≈0.003 — just above DARK_SOLID_L_THRESHOLD).
   */
  if (!isDark && peakC < RADIX_LIGHT_CHROMATIC_MIN_C && L_in < STANDARD_LIGHT_L9) {
    const targets = buildLightnessTargetsLowChromaDarkSolidLight(L_in);
    const h =
      base.h != null && Number.isFinite(base.h) ? base.h : RADIX_NEUTRAL_HUE;
    const raw = targets.map((l, i) => {
      const c = resolveChroma(i, peakC);
      const inGamut = toOklch(clampChroma({ mode: 'oklch' as const, l, c, h }, 'oklch'));
      return {
        step: i + 1,
        hex: formatHex(inGamut ?? { mode: 'oklch' as const, l, c: 0, h }) ?? '#000000',
        l: inGamut?.l ?? l,
        c: (inGamut as { c?: number }).c ?? 0,
        h: (inGamut as { h?: number }).h ?? h,
      };
    });
    const bgHex = raw[0].hex;
    return raw.map(s => ({
      ...s,
      contrast: Number((wcagContrast(s.hex, bgHex) ?? 1).toFixed(2)),
    }));
  }

  if (!isDark && peakC >= RADIX_LIGHT_CHROMATIC_MIN_C) {
    const hue =
      base.h != null && Number.isFinite(base.h) ? base.h : RADIX_NEUTRAL_HUE;
    const { steps: lc, anchorIndex } = buildRadixLightChromaticLc(L_in, peakC);
    const raw = mapRowToSteps(i => ({
      l: lc[i].l,
      c: lc[i].c,
      h: hue,
    }));
    const anchor = toOklch(
      clampChroma(
        {
          mode: 'oklch' as const,
          l: base.l!,
          c: peakC,
          h: base.h ?? hue,
        },
        'oklch',
      ),
    );
    const ah = anchor ?? {
      mode: 'oklch' as const,
      l: base.l!,
      c: peakC,
      h: base.h ?? hue,
    };
    const hexBrand = formatHex(ah) ?? raw[anchorIndex].hex;
    const bgHex = raw[0].hex;
    raw[anchorIndex] = {
      step: anchorIndex + 1,
      hex: hexBrand,
      l: ah.l ?? base.l!,
      c: (ah as { c?: number }).c ?? peakC,
      h: (ah as { h?: number }).h ?? hue,
      isBrand: true,
      contrast: Number((wcagContrast(hexBrand, bgHex) ?? 1).toFixed(2)),
    };
    return raw.map(s => ({
      ...s,
      contrast: Number((wcagContrast(s.hex, bgHex) ?? 1).toFixed(2)),
    }));
  }

  if (isDark && peakC >= RADIX_DARK_CHROMATIC_MIN_C) {
    const hue =
      base.h != null && Number.isFinite(base.h) ? base.h : 0;
    const lc = buildRadixDarkChromaticLc(L_in, peakC);
    return mapRowToSteps(i => ({
      l: lc[i].l,
      c: lc[i].c,
      h: hue,
    }));
  }

  const h =
    base.h != null && Number.isFinite(base.h) ? base.h : RADIX_NEUTRAL_HUE;
  const targets = isDark ? buildLightnessTargetsDark(L_in) : buildLightnessTargetsLight(L_in);

  const raw = targets.map((l, i) => {
    const c = resolveChroma(i, peakC);
    const inGamut = toOklch(clampChroma({ mode: 'oklch' as const, l, c, h }, 'oklch'));
    return {
      step: i + 1,
      hex: formatHex(inGamut ?? { mode: 'oklch' as const, l, c: 0, h }) ?? '#000000',
      l: inGamut?.l ?? l,
      c: (inGamut as { c?: number }).c ?? 0,
      h: (inGamut as { h?: number }).h ?? h,
    };
  });

  const bgHex = raw[0].hex;
  return raw.map(s => ({
    ...s,
    contrast: Number((wcagContrast(s.hex, bgHex) ?? 1).toFixed(2)),
  }));
}
