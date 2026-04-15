export type ColorUsageMode = 'standard' | 'subtle' | 'minimal';

/** @deprecated Use `ColorUsageMode` */
export type ColorCoverageMode = ColorUsageMode;

const STORAGE_KEY = 'playground:colorUsage';
const LEGACY_STORAGE_KEY = 'playground:colorCoverage';
/** Legacy boolean toggle — migrated on read. */
const LEGACY_APPLY_BRAND_KEY = 'playground:applyBrandColor';

export function usesStandardPalette(mode: ColorUsageMode): boolean {
  return mode === 'standard';
}

/** @deprecated Use `usesStandardPalette` */
export function usesBalancedPalette(mode: ColorUsageMode): boolean {
  return usesStandardPalette(mode);
}

export function usesNeutralPaletteSteps(mode: ColorUsageMode): boolean {
  return mode === 'subtle' || mode === 'minimal';
}

function normalizeStoredMode(raw: string | null): ColorUsageMode | null {
  if (raw === 'standard' || raw === 'subtle' || raw === 'minimal') return raw;
  if (raw === 'balanced') return 'standard';
  return null;
}

export function readStoredColorUsage(fallback: ColorUsageMode = 'standard'): ColorUsageMode {
  if (typeof window === 'undefined') return fallback;
  const primary = normalizeStoredMode(window.sessionStorage.getItem(STORAGE_KEY));
  if (primary) return primary;
  const legacy = normalizeStoredMode(window.sessionStorage.getItem(LEGACY_STORAGE_KEY));
  if (legacy) return legacy;
  const legacyBool = window.sessionStorage.getItem(LEGACY_APPLY_BRAND_KEY);
  if (legacyBool === 'false') return 'subtle';
  if (legacyBool === 'true') return 'standard';
  return fallback;
}

/** @deprecated Use `readStoredColorUsage` */
export function readStoredColorCoverage(fallback: ColorUsageMode = 'standard'): ColorUsageMode {
  return readStoredColorUsage(fallback);
}

export function persistColorUsage(mode: ColorUsageMode): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(STORAGE_KEY, mode);
  window.sessionStorage.removeItem(LEGACY_STORAGE_KEY);
}

/** @deprecated Use `persistColorUsage` */
export function persistColorCoverage(mode: ColorUsageMode): void {
  persistColorUsage(mode);
}
