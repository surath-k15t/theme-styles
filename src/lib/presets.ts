/* ────────────────────────────────────────────
   Re-export barrel — all preset logic now lives
   in src/lib/presets/ (one file per preset).
   This file keeps existing imports working.
   ──────────────────────────────────────────── */
export type { PresetId, ThemeMode, PresetStyles, PresetConfig } from './presets/types';
export { baseStyles } from './presets/baseStyles';
export { presets, presetAdvancedColorPanelEnabled } from './presets/index';
