import { clampChroma, converter, formatHex, parse, wcagContrast } from 'culori';
import type { GenerateScaleResult, ScaleDiagnostic } from './types';

const toOklch = converter('oklch');

/** Step 9 lightness threshold: below = “dark solid” (hover/text invert lighter). */
const DARK_SOLID_L = 0.4;

/** Standard blueprint L for step 9 before anchor override (documentation ref). */
const STANDARD_L9 = 0.593;

const L_BLUEPRINT: readonly number[] = [
  0.992, 0.982, 0.958, 0.932, 0.906, 0.885, 0.833, 0.767,
  STANDARD_L9,
  0,
  0.53, 0.32,
];

const YELLOW_LIME_H_MIN = 60;
const YELLOW_LIME_H_MAX = 110;
const YELLOW_L_SHIFT = 0.05;

/** Below this input C, skip yellow/lime L shift (gray / custom scale). */
const MUTED_CHROMA_CUTOFF = 0.04;

/** Yellow/lime: caps on min(Standard_L + 0.05, Max) so steps stay off pure white and ordered. */
const YELLOW_STEP3_MAX_L = 0.974;
const YELLOW_STEP4_MAX_L = 0.953;
const YELLOW_STEP5_MAX_L = 0.925;

/** Min gap so a step stays darker (lower L) than the previous UI step after yellow lift. */
const YELLOW_STEP_ORDER_GAP = 0.006;

/** Below this C, colorFactor = 0 (full gray ramp); blend through 0.015 up to COLOR_FACTOR_FULL at 0.020+. */
const COLOR_FACTOR_GRAY = 0.005;
const COLOR_FACTOR_FULL = 0.02;
const COLOR_FACTOR_RANGE = COLOR_FACTOR_FULL - COLOR_FACTOR_GRAY;

const GRAY_C_MULTIPLIERS = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1.0, 1.0] as const;
const DARK_GRAY_C_MULTIPLIERS = [0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9, 1.0] as const;
const DARK_STD_C_MULTIPLIERS = [0.05, 0.15, 0.25, 0.4, 0.55, 0.75, 0.9, 1.0] as const;
const DARK_L_BASE: readonly number[] = [0, 0.18, 0.245, 0.285, 0.325, 0.375, 0.435, 0.515];
/** Dark anchor / text chroma: C ≤ 0.015 → gray-muted; C ≥ 0.065 → vibrant (lerp between). */
const ANCHOR_COLOR_GRAY = 0.015;
const ANCHOR_COLOR_FULL = 0.065;
const ANCHOR_COLOR_RANGE = ANCHOR_COLOR_FULL - ANCHOR_COLOR_GRAY;
/** Step 11 lightness: yellow/green band gets lifted text L. */
const STEP11_LUMINOUS_H_MIN = 60;
const STEP11_LUMINOUS_H_MAX = 130;

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

function isYellowLimeHue(h: number | undefined): boolean {
  if (h == null || !Number.isFinite(h)) return false;
  return h >= YELLOW_LIME_H_MIN && h <= YELLOW_LIME_H_MAX;
}

function colorFactorFromChroma(brandC: number): number {
  const c = Math.max(0, brandC);
  return clamp01((c - COLOR_FACTOR_GRAY) / COLOR_FACTOR_RANGE);
}

function grayColorPeaks(brandC: number): { grayPeak: number; colorPeak: number } {
  const c = Math.max(0, brandC);
  return {
    grayPeak: Math.min(c * 1.5, 0.01),
    colorPeak: Math.max(c, 0.04),
  };
}

/** Blend weight for dark steps 9–12 (muted vs vibrant targets). */
function anchorColorFactorFromChroma(brandC: number): number {
  const c = Math.max(0, brandC);
  return clamp01((c - ANCHOR_COLOR_GRAY) / ANCHOR_COLOR_RANGE);
}

/**
 * Radix-style: scale steps 1–8 toward a peak chroma floor so muted inputs still get
 * visible border/UI chroma. Steps 1–8 use peak; steps 9–10 & 12 use exact input C; step 11 uses peak.
 */
const C_MULTIPLIERS = [0.07, 0.13, 0.39, 0.61, 0.8, 0.95, 1.0, 1.0] as const;

/** Steps 1–8 & step 11: lerp gray vs color peaks. Steps 9, 10, 12: exact brand C. */
function targetChromaForStep(
  stepIndex: number,
  brandC: number,
  colorFactor: number,
): number {
  const c = Math.max(0, brandC);
  const { grayPeak, colorPeak } = grayColorPeaks(c);

  if (stepIndex <= 7) {
    const grayMult = GRAY_C_MULTIPLIERS[stepIndex];
    const colorMult = C_MULTIPLIERS[stepIndex];
    const targetIfGray = grayPeak * grayMult;
    const targetIfColor = colorPeak * colorMult;
    return targetIfGray * (1 - colorFactor) + targetIfColor * colorFactor;
  }
  if (stepIndex === 10) {
    const step11GrayTarget = grayPeak;
    const step11ColorTarget = colorPeak;
    return step11GrayTarget * (1 - colorFactor) + step11ColorTarget * colorFactor;
  }
  return c;
}

function buildLightnessRow(
  LInput: number,
  h: number | undefined,
  cIn: number,
  colorFactor: number,
): number[] {
  const L = [...L_BLUEPRINT];
  const L9 = LInput;

  const applyYellowShift =
    cIn >= MUTED_CHROMA_CUTOFF && isYellowLimeHue(h);

  if (applyYellowShift) {
    L[2] = Math.min(L_BLUEPRINT[2] + YELLOW_L_SHIFT, YELLOW_STEP3_MAX_L);
    L[3] = Math.min(L_BLUEPRINT[3] + YELLOW_L_SHIFT, YELLOW_STEP4_MAX_L);
    L[4] = Math.min(L_BLUEPRINT[4] + YELLOW_L_SHIFT, YELLOW_STEP5_MAX_L);
    for (let i = 5; i <= 7; i++) {
      const shifted = L_BLUEPRINT[i] + YELLOW_L_SHIFT;
      L[i] = Math.min(shifted, L[i - 1] - YELLOW_STEP_ORDER_GAP, 0.999);
    }
  }

  L[8] = L9;

  let hover =
    L9 > DARK_SOLID_L ? L9 - 0.05 : L9 + 0.05;
  if (applyYellowShift) {
    hover = Math.min(hover + YELLOW_L_SHIFT, 0.999);
    if (L9 > DARK_SOLID_L) {
      hover = Math.min(hover, L9 - YELLOW_STEP_ORDER_GAP);
    } else {
      hover = Math.max(hover, L9 + YELLOW_STEP_ORDER_GAP);
    }
  }
  L[9] = clamp01(hover);

  if (colorFactor === 0 && LInput < 0.35) {
    L[9] = 0.305;
    L[10] = 0.503;
    L[11] = 0.241;
  }

  return L;
}

/** Dark steps 1–8 only; steps 9–12 use explicit L/C from `computeDarkAnchorLC`. */
function targetDarkChromaForStep(
  stepIndex: number,
  colorFactor: number,
  grayPeak: number,
  colorPeak: number,
  darknessFade: number,
): number {
  if (stepIndex > 7) return 0;

  const grayMult = DARK_GRAY_C_MULTIPLIERS[stepIndex];
  const colorMult = DARK_STD_C_MULTIPLIERS[stepIndex];
  const targetIfGray = grayPeak * grayMult;
  const targetIfColor = colorPeak * colorMult;
  const blendedTargetC =
    targetIfGray * (1 - colorFactor) + targetIfColor * colorFactor;
  return blendedTargetC * darknessFade;
}

function computeDarkAnchorLC(
  brandL: number,
  brandC: number,
  hUse: number,
  darknessFade: number,
  anchorFactor: number,
  isPureBlack: boolean,
): {
  step9L: number;
  step9C: number;
  step10L: number;
  step10C: number;
  step11L: number;
  step11C: number;
  step12L: number;
  step12C: number;
} {
  let step9L = brandL;
  let step9C = brandC;

  if (!isPureBlack && brandL < 0.25) {
    const hueRad = (hUse - 135) * (Math.PI / 180);
    const vibrantIdealL = 0.7 + 0.185 * Math.cos(hueRad);
    const vibrantIdealC = Math.max(
      0.08 * darknessFade,
      Math.min(brandC * 1.5, 0.12),
    );
    const grayIdealL = Math.max(brandL, 0.45);
    const grayIdealC = brandC;

    step9L = grayIdealL * (1 - anchorFactor) + vibrantIdealL * anchorFactor;
    step9C = grayIdealC * (1 - anchorFactor) + vibrantIdealC * anchorFactor;
  }

  const step10L = clamp01(
    step9L < 0.45 ? step9L + 0.055 : step9L - 0.045,
  );
  const step10C = step9C;

  const isLuminousHue =
    hUse >= STEP11_LUMINOUS_H_MIN && hUse <= STEP11_LUMINOUS_H_MAX;
  const step11L = isLuminousHue || step9L > 0.85 ? 0.815 : 0.78;

  const { grayPeak, colorPeak } = grayColorPeaks(brandC);
  const step11C =
    (grayPeak * (1 - anchorFactor) + colorPeak * anchorFactor) * darknessFade;

  const step12L = 0.93;
  const step12C = brandC * 0.5;

  return {
    step9L,
    step9C,
    step10L,
    step10C,
    step11L,
    step11C,
    step12L,
    step12C,
  };
}

/** 12-step OKLCH scale: blueprint L, lerp gray/color peak ramp (1–8), exact brand L/C on steps 9–10 & 12. */
export function generateScale(inputHex: string): GenerateScaleResult {
  const parsed = parse(inputHex);
  if (!parsed) {
    return { scale: [], diagnostics: [] };
  }

  const base = toOklch(parsed);
  if (base == null || base.l == null) {
    return { scale: [], diagnostics: [] };
  }

  const LInput = clamp01(base.l);
  const cIn = Math.max(0, base.c ?? 0);
  const colorFactor = colorFactorFromChroma(cIn);
  const h =
    base.h != null && Number.isFinite(base.h) ? base.h : undefined;

  const Lrow = buildLightnessRow(LInput, h, cIn, colorFactor);
  const hUse = h ?? 0;

  return buildScaleFromTargets(
    Lrow,
    i => targetChromaForStep(i, cIn, colorFactor),
    hUse,
  );
}

function buildScaleFromTargets(
  lightnessTargets: readonly number[],
  chromaForIndex: (i: number) => number,
  hUse: number,
): GenerateScaleResult {
  const diagnostics: ScaleDiagnostic[] = [];
  const scale: string[] = [];
  let bgHex = '#000000';

  for (let i = 0; i < 12; i++) {
    const l = lightnessTargets[i];
    const c = chromaForIndex(i);
    const raw = { mode: 'oklch' as const, l, c, h: hUse };
    const inGamut = toOklch(clampChroma(raw, 'oklch'));
    const hex = formatHex(inGamut ?? raw) ?? '#000000';

    if (i === 0) bgHex = hex;

    diagnostics.push({
      step: i + 1,
      l: inGamut?.l ?? l,
      c: (inGamut as { c?: number }).c ?? c,
      h: (inGamut as { h?: number }).h ?? hUse,
      hex,
      contrast: 1,
    });
    scale.push(hex);
  }

  for (const row of diagnostics) {
    row.contrast = Number((wcagContrast(row.hex, bgHex) ?? 1).toFixed(2));
  }
  return { scale, diagnostics };
}

/** Dark generator using Radix-like perceptual skeleton and pivots. */
export function generateDarkScale(inputHex: string): GenerateScaleResult {
  const parsed = parse(inputHex);
  if (!parsed) return { scale: [], diagnostics: [] };

  const base = toOklch(parsed);
  if (base == null || base.l == null) return { scale: [], diagnostics: [] };

  const brandL = clamp01(base.l);
  const brandC = Math.max(0, base.c ?? 0);
  const h = base.h != null && Number.isFinite(base.h) ? base.h : undefined;
  const hUse = h ?? 0;
  const colorFactor = colorFactorFromChroma(brandC);
  const anchorFactor = anchorColorFactorFromChroma(brandC);
  const { grayPeak, colorPeak } = grayColorPeaks(brandC);
  const isPureBlack = brandL < 0.01 && brandC < 0.01;

  const darknessFade = Math.max(0, Math.min(1, brandL / 0.15));

  const chromaSteps1to8 = (i: number) =>
    targetDarkChromaForStep(i, colorFactor, grayPeak, colorPeak, darknessFade);

  if (isPureBlack) {
    const L = [...DARK_L_BASE, 0.536, 0.489, 0.769, 0.93];
    return buildScaleFromTargets(
      L,
      i => (i < 8 ? chromaSteps1to8(i) : 0),
      hUse,
    );
  }

  const anchor = computeDarkAnchorLC(
    brandL,
    brandC,
    hUse,
    darknessFade,
    anchorFactor,
    false,
  );

  const L = [
    ...DARK_L_BASE,
    clamp01(anchor.step9L),
    anchor.step10L,
    anchor.step11L,
    anchor.step12L,
  ];

  const chromaForIndex = (i: number): number => {
    if (i < 8) return chromaSteps1to8(i);
    if (i === 8) return Math.max(0, anchor.step9C);
    if (i === 9) return Math.max(0, anchor.step10C);
    if (i === 10) return Math.max(0, anchor.step11C);
    return Math.max(0, anchor.step12C);
  };

  return buildScaleFromTargets(L, chromaForIndex, hUse);
}
