import { clamp01, smoothstep01 } from './math';
import {
  DARK_L,
  RADIX_DARK_CHROMATIC_BRIGHT_C,
  RADIX_DARK_CHROMATIC_BRIGHT_L,
  RADIX_DARK_CHROMATIC_BRIGHT_REF_C9,
  RADIX_DARK_CHROMATIC_BRIGHT_REF_L9,
  RADIX_DARK_CHROMATIC_MUTED_C,
  RADIX_DARK_CHROMATIC_MUTED_L,
  RADIX_DARK_CHROMATIC_MUTED_REF_C9,
  RADIX_DARK_CHROMATIC_MUTED_REF_L9,
  STANDARD_DARK_L9,
} from './dark-templates';

export function buildRadixDarkChromaticLc(L9: number, C9: number): { l: number; c: number }[] {
  const tL = smoothstep01(0.52, 0.66, L9);
  const tC = smoothstep01(0.085, 0.125, C9);
  const t = clamp01(Math.max(tL, tC));

  const sMutedL = L9 / RADIX_DARK_CHROMATIC_MUTED_REF_L9;
  const sMutedC = C9 / RADIX_DARK_CHROMATIC_MUTED_REF_C9;
  const sBrightL = L9 / RADIX_DARK_CHROMATIC_BRIGHT_REF_L9;
  const sBrightC = C9 / RADIX_DARK_CHROMATIC_BRIGHT_REF_C9;

  return Array.from({ length: 12 }, (_, i: number) => {
    const lM = clamp01(RADIX_DARK_CHROMATIC_MUTED_L[i] * sMutedL);
    const cM = Math.max(0, RADIX_DARK_CHROMATIC_MUTED_C[i] * sMutedC);
    const lB = clamp01(RADIX_DARK_CHROMATIC_BRIGHT_L[i] * sBrightL);
    const cB = Math.max(0, RADIX_DARK_CHROMATIC_BRIGHT_C[i] * sBrightC);
    return {
      l: clamp01((1 - t) * lM + t * lB),
      c: Math.max(0, (1 - t) * cM + t * cB),
    };
  });
}

/** Legacy dark lightness row (low chroma path). */
export function buildLightnessTargetsDark(L_in: number): number[] {
  const row = DARK_L.slice();
  const L9 = L_in < STANDARD_DARK_L9 ? clamp01(L_in) : STANDARD_DARK_L9;
  row[8] = L9;

  if (row[8] <= row[7]) {
    row[7] = clamp01(row[8] - 0.04);
    for (let j = 6; j >= 0; j--) {
      if (row[j] >= row[j + 1]) {
        row[j] = clamp01(row[j + 1] - 0.035);
      }
    }
  }

  if (L9 < 0.45) {
    row[9] = clamp01(L9 + 0.05);
    row[10] = clamp01(L9 + 0.15);
    row[11] = Math.max(row[10] + 0.04, DARK_L[11]);
  }

  for (let i = 1; i < 12; i++) {
    if (row[i] < row[i - 1]) row[i] = clamp01(row[i - 1] + 0.008);
  }
  return row;
}
