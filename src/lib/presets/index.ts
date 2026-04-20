export type { PresetId, ThemeMode, PresetStyles, PresetConfig } from './types';
export { presetAdvancedColorPanelEnabled } from './types';
export { baseStyles } from './baseStyles';

import type { PresetId, PresetConfig } from './types';
import { playgroundPreset } from './playground';

export const presets: Record<PresetId, PresetConfig> = {
  playground: playgroundPreset,
};
