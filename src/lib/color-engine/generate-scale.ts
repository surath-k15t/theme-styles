import type { GenerateScaleResult } from './types';
import { materialPrimary12Step } from './material-palette-engine';

/** 12-step brand ramp: Material 3 `themeFromSourceColor` primary {@link TonalPalette} at tones 0…100. */
export function generateScale(inputHex: string): GenerateScaleResult {
  return materialPrimary12Step(inputHex, 'light');
}

/** Dark ordering: step 1 = lowest tone (darkest surfaces), step 12 = tone 100. */
export function generateDarkScale(inputHex: string): GenerateScaleResult {
  return materialPrimary12Step(inputHex, 'dark');
}
