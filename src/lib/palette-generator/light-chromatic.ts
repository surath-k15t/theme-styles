import { RADIX_BLACK_SOLID_LIGHT_L } from './black-solids';
import { clamp01, smoothstep01 } from './math';
import {
  DARK_SOLID_L_THRESHOLD,
  LIGHT_L,
  RADIX_LIGHT_CHROMATIC_C,
  RADIX_LIGHT_CHROMATIC_DEEP_C,
  RADIX_LIGHT_CHROMATIC_DEEP_L,
  RADIX_LIGHT_CHROMATIC_L,
  RADIX_LIGHT_CHROMATIC_MID_C,
  RADIX_LIGHT_CHROMATIC_MID_L,
  RADIX_LIGHT_CHROMATIC_SOFT_C,
  RADIX_LIGHT_CHROMATIC_SOFT_L,
  STANDARD_LIGHT_L9,
} from './light-templates';

/**
 * Lighter brand colours → lower step index (0-based; step = index + 1).
 */
export function lightChromaticBrandAnchorIndex(L: number, C: number): number {
  let a = 8;
  if (L >= 0.935) a = 3;
  else if (L >= 0.9) a = 4;
  else if (L >= 0.86) a = 5;
  else if (L >= 0.8) a = 6;
  else if (L >= 0.74) a = 7;
  if (C < 0.055 && L >= 0.78) a = Math.max(3, a - 1);
  return a;
}

export function buildRadixLightChromaticLcFromTemplate(
  templateL: readonly number[],
  templateC: readonly number[],
  anchorIndex: number,
  LBrand: number,
  CBrand: number,
): { l: number; c: number }[] {
  const a = Math.min(8, Math.max(0, Math.floor(anchorIndex)));
  const cref = Math.max(templateC[a], 0.004);
  const sC = CBrand / cref;
  const deltaL = LBrand - templateL[a];
  const L_HEAD_CAP = 0.994;

  const rawL = templateL.map(t => t + deltaL);
  const outL: number[] = new Array(12);

  if (a > 0) {
    const headMax = Math.max(...rawL.slice(0, a));
    if (headMax > L_HEAD_CAP && headMax > LBrand) {
      const r = (L_HEAD_CAP - LBrand) / (headMax - LBrand);
      for (let i = 0; i < a; i++) {
        outL[i] = LBrand + (rawL[i] - LBrand) * r;
      }
    } else {
      for (let i = 0; i < a; i++) {
        outL[i] = clamp01(rawL[i]);
      }
    }
  }

  outL[a] = LBrand;
  for (let i = a + 1; i < 12; i++) {
    outL[i] = clamp01(rawL[i]);
  }

  return outL.map((l, i) => ({
    l: clamp01(l),
    c: Math.max(0, templateC[i] * sC),
  }));
}

export function buildRadixLightChromaticLc(
  LBrand: number,
  CBrand: number,
): { steps: { l: number; c: number }[]; anchorIndex: number } {
  const anchorIndex = lightChromaticBrandAnchorIndex(LBrand, CBrand);
  const bright = buildRadixLightChromaticLcFromTemplate(
    RADIX_LIGHT_CHROMATIC_L,
    RADIX_LIGHT_CHROMATIC_C,
    anchorIndex,
    LBrand,
    CBrand,
  );
  const soft = buildRadixLightChromaticLcFromTemplate(
    RADIX_LIGHT_CHROMATIC_SOFT_L,
    RADIX_LIGHT_CHROMATIC_SOFT_C,
    anchorIndex,
    LBrand,
    CBrand,
  );

  const tL = smoothstep01(0.74, 0.86, LBrand);
  const tLowC = 1 - smoothstep01(0.045, 0.115, CBrand);
  const t = clamp01(Math.max(tL, tLowC));

  const brightSoft = bright.map((b, i) => ({
    l: clamp01((1 - t) * b.l + t * soft[i].l),
    c: Math.max(0, (1 - t) * b.c + t * soft[i].c),
  }));

  const deep = buildRadixLightChromaticLcFromTemplate(
    RADIX_LIGHT_CHROMATIC_DEEP_L,
    RADIX_LIGHT_CHROMATIC_DEEP_C,
    anchorIndex,
    LBrand,
    CBrand,
  );

  /** Dark brand on light UI: Radix lifts steps 10–11 above the solid; fade in below ~L 0.5. */
  const tDeep = 1 - smoothstep01(0.42, 0.54, LBrand);

  const base = brightSoft.map((b, i) => ({
    l: clamp01((1 - tDeep) * b.l + tDeep * deep[i].l),
    c: Math.max(0, (1 - tDeep) * b.c + tDeep * deep[i].c),
  }));

  const mid = buildRadixLightChromaticLcFromTemplate(
    RADIX_LIGHT_CHROMATIC_MID_L,
    RADIX_LIGHT_CHROMATIC_MID_C,
    anchorIndex,
    LBrand,
    CBrand,
  );

  /** ~#2d7c53 L: bright template ref 0.704 makes ΔL too negative — blend mid curve for L ≈ 0.45–0.68. */
  const tMid =
    smoothstep01(0.45, 0.54, LBrand) * (1 - smoothstep01(0.6, 0.7, LBrand));

  const steps = base.map((b, i) => ({
    l: clamp01((1 - tMid) * b.l + tMid * mid[i].l),
    c: Math.max(0, (1 - tMid) * b.c + tMid * mid[i].c),
  }));

  return { steps, anchorIndex };
}

/** Legacy light lightness row (low chroma path). */
export function buildLightnessTargetsLight(L_in: number): number[] {
  const ref = STANDARD_LIGHT_L9;
  const L9 = clamp01(L_in);
  const delta = L9 - ref;
  const row = LIGHT_L.map((t, i) => (i === 8 ? L9 : clamp01(t + delta)));

  if (L9 < DARK_SOLID_L_THRESHOLD) {
    row[8] = L9;
    row[9] = clamp01(L9 + 0.05);
    row[10] = clamp01(L9 + 0.15);
    row[11] = clamp01(Math.max(0.06, L9 - 0.1));
  }
  return row;
}

/**
 * Near-achromatic dark solid on a light UI (picker bottom-left): keep Radix neutral-style light
 * chrome for steps 1–8, anchor step 9 to the pick, steps 10–11 lighter (same tail as the
 * dark-solid branch in buildLightnessTargetsLight).
 */
export function buildLightnessTargetsLowChromaDarkSolidLight(L_in: number): number[] {
  const L9 = clamp01(L_in);
  const head = RADIX_BLACK_SOLID_LIGHT_L.slice(0, 8);
  return [
    ...head,
    L9,
    clamp01(L9 + 0.05),
    clamp01(L9 + 0.15),
    clamp01(Math.max(0.06, L9 - 0.1)),
  ];
}
