import React, { createContext, useContext, useState, useCallback } from 'react';
import type { PresetId, ThemeMode } from './presets';
import { presets } from './presets';
import { buildColorEngineThemeVars } from './color-engine';

const PRESET_ID: PresetId = 'playground';

/** Radix-style radius steps → `--theme-roundness` / `--ds-radius-factor`. */
export type ThemeRadiusTier = 'none' | 'small' | 'medium' | 'large' | 'full';

export const THEME_RADIUS_TIER_VALUES: Record<ThemeRadiusTier, number> = {
  none: 0,
  small: 1.25,
  medium: 3.5,
  large: 6,
  full: 12,
};

interface ThemeContextType {
  preset: PresetId;
  mode: ThemeMode;
  toggleMode: () => void;
  playgroundHex: string;
  setPlaygroundHex: (hex: string) => void;
  playgroundIsDark: boolean;
  setPlaygroundIsDark: (v: boolean) => void;
  themeRadiusTier: ThemeRadiusTier;
  setThemeRadiusTier: (v: ThemeRadiusTier) => void;
  showDescription: boolean;
  setShowDescription: (v: boolean) => void;
  showDebug: boolean;
  setShowDebug: (v: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playgroundHex, setPlaygroundHex] = useState('#157F78');
  /** Single light/dark switch: color engine (floating bar) + header toggle both use this. Drives `data-mode`, neutrals, and chromatic scale. */
  const [playgroundIsDark, setPlaygroundIsDark] = useState(false);
  const [themeRadiusTier, setThemeRadiusTier] = useState<ThemeRadiusTier>('medium');
  const [showDescription, setShowDescription] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const mode: ThemeMode = playgroundIsDark ? 'dark' : 'light';
  const toggleMode = useCallback(() => {
    setPlaygroundIsDark(v => !v);
  }, []);

  const currentPreset = presets[PRESET_ID];
  const colorEngineVars = buildColorEngineThemeVars(playgroundHex, playgroundIsDark);
  const themeStyle = {
    ...currentPreset.cssVars,
    ...(playgroundIsDark ? currentPreset.darkCssVars : {}),
    ...colorEngineVars,
    '--theme-roundness': String(THEME_RADIUS_TIER_VALUES[themeRadiusTier]),
  } as React.CSSProperties;

  return (
    <ThemeContext.Provider
      value={{
        preset: PRESET_ID,
        mode,
        toggleMode,
        playgroundHex,
        setPlaygroundHex,
        playgroundIsDark,
        setPlaygroundIsDark,
        themeRadiusTier,
        setThemeRadiusTier,
        showDescription,
        setShowDescription,
        showDebug,
        setShowDebug,
      }}
    >
      <div data-theme-root data-preset={PRESET_ID} data-mode={mode} style={themeStyle}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
