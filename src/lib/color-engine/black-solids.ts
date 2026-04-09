/** Hue Radix uses for neutral custom scales (achromatic anchor). */
export const RADIX_NEUTRAL_HUE = 277.7;

/** Radix light / dark fixed scales for accent #000000 (P3 OKLCH → 0–1). */
export const RADIX_BLACK_SOLID_LIGHT_L = [
  0.991, 0.982, 0.956, 0.931, 0.91, 0.888, 0.853, 0.794, 0, 0.3, 0.503, 0.241,
];
export const RADIX_BLACK_SOLID_LIGHT_CHROMA = [
  0.0015, 0.003, 0.0045, 0.0061, 0.0077, 0.0093, 0.0117, 0.016, 0, 0.0099, 0.0139, 0.0099,
];
export const RADIX_BLACK_SOLID_DARK_L = [
  0, 0.185, 0.24, 0.277, 0.31, 0.348, 0.4, 0.491, 0.54, 0.493, 0.77, 0.949,
];
export const RADIX_BLACK_SOLID_DARK_CHROMA = [
  0.0042, 0.004, 0.0055, 0.0075, 0.0089, 0.01, 0.0121, 0.0157, 0.0167, 0.0157, 0.0138, 0.0026,
];

export const ACHROMATIC_C_MAX = 0.003;
export const BLACK_ANCHOR_L_MAX = 0.02;

export function isRadixBlackAchromaticAnchor(L_in: number, c: number): boolean {
  return L_in <= BLACK_ANCHOR_L_MAX && c <= ACHROMATIC_C_MAX;
}
