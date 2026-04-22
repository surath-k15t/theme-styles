export type { PresetId, ThemeMode, PresetStyles, PresetConfig } from './types';
export { presetAdvancedColorPanelEnabled } from './types';
export { baseStyles } from './baseStyles';
export {
  BRAND_STYLE_PRESET_IDS,
  BRAND_STYLE_PRESET_LABELS,
  brandStyleSnapshots,
  countBrandStylePresetAffectedSettings,
  createPlaygroundDefaultBrandStyleSnapshot,
  getBrandStyleSnapshot,
  isBrandStylePresetId,
  playgroundDefaultBrandStyleSnapshot,
} from './brandStyles';
export type {
  BrandStylePresetId,
  BrandStyleSnapshot,
  BrandStyleSnapshotBannerHeading,
  BrandStyleSnapshotBannerStyle,
  BrandStyleSnapshotColorMode,
  BrandStyleSnapshotRadiusTier,
} from './brandStyles';

import type { PresetId, PresetConfig } from './types';
import { playgroundPreset } from './playground';

export const presets: Record<PresetId, PresetConfig> = {
  playground: playgroundPreset,
};
