/** Legacy light ramp (non-chromatic fallback). */
export const LIGHT_L = [0.99, 0.97, 0.94, 0.91, 0.88, 0.83, 0.78, 0.72, 0.59, 0.55, 0.51, 0.32];

export const STANDARD_LIGHT_L9 = LIGHT_L[8];

/** Below this L at step 9: inverted lighter steps 10–11 (legacy path). */
export const DARK_SOLID_L_THRESHOLD = 0.4;

/** Radix light `:root` red P3 for #f66. */
export const RADIX_LIGHT_CHROMATIC_L = [
  0.993, 0.981, 0.957, 0.923, 0.893, 0.857, 0.806, 0.745, 0.704, 0.667, 0.578, 0.346,
];
export const RADIX_LIGHT_CHROMATIC_C = [
  0.0028, 0.0113, 0.0268, 0.0609, 0.0817, 0.0895, 0.0973, 0.119, 0.1872, 0.1904, 0.1868, 0.0817,
];

/** Radix light dusty / pastel (e.g. #a67d7d family). */
export const RADIX_LIGHT_CHROMATIC_SOFT_L = [
  0.994, 0.983, 0.954, 0.928, 0.896, 0.858, 0.81, 0.749, 0.628, 0.587, 0.549, 0.341,
];
export const RADIX_LIGHT_CHROMATIC_SOFT_C = [
  0.0027, 0.0068, 0.0181, 0.0343, 0.0445, 0.0515, 0.0515, 0.0515, 0.0515, 0.0515, 0.0515, 0.0515,
];

/** Radix light for dark solid #301313 — steps 10–11 lighter than 9. */
export const RADIX_LIGHT_CHROMATIC_DEEP_L = [
  0.994, 0.982, 0.956, 0.932, 0.91, 0.886, 0.853, 0.792, 0.231, 0.321, 0.498, 0.243,
];
export const RADIX_LIGHT_CHROMATIC_DEEP_C = [
  0.0066, 0.0088, 0.0135, 0.0203, 0.0229, 0.0298, 0.0371, 0.0496, 0.0474, 0.0474, 0.0471, 0.0474,
];

/** Radix light mid-L saturated #2d7c53. */
export const RADIX_LIGHT_CHROMATIC_MID_L = [
  0.994, 0.982, 0.959, 0.933, 0.901, 0.858, 0.799, 0.717, 0.526, 0.478, 0.529, 0.323,
];
export const RADIX_LIGHT_CHROMATIC_MID_C = [
  0.0031, 0.007, 0.0176, 0.0275, 0.0374, 0.0482, 0.0627, 0.0836, 0.1012, 0.1012, 0.1012, 0.0347,
];

export const RADIX_LIGHT_CHROMATIC_MIN_C = 0.004;
