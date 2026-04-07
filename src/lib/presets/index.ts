export type { PresetId, ThemeMode, PresetStyles, PresetConfig } from './types';
export { baseStyles } from './baseStyles';

import type { PresetId, PresetConfig } from './types';
import { originPreset } from './origin';
import { vectorPreset } from './vector';
import { ignitePreset } from './ignite';
import { legacyPreset } from './legacy';
import { lucidPreset } from './lucid';
import { auroraPreset } from './aurora';
import { playgroundPreset } from './playground';

export const presets: Record<PresetId, PresetConfig> = {
  origin: originPreset,
  vector: vectorPreset,
  ignite: ignitePreset,
  legacy: legacyPreset,
  lucid: lucidPreset,
  aurora: auroraPreset,
  playground: playgroundPreset,
};

export const presetOrder: PresetId[] = ['origin', 'vector', 'ignite', 'legacy', 'lucid', 'aurora', 'playground'];
