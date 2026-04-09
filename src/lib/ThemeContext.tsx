import React, { createContext, useContext, useState, useCallback } from 'react';
import type { PresetId, ThemeMode } from './presets';
import { presets } from './presets';
import { buildColorEngineThemeVars } from './color-engine';

const PRESET_ID: PresetId = 'playground';

interface ThemeContextType {
  preset: PresetId;
  mode: ThemeMode;
  toggleMode: () => void;
  playgroundHex: string;
  setPlaygroundHex: (hex: string) => void;
  playgroundIsDark: boolean;
  setPlaygroundIsDark: (v: boolean) => void;
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
    '--theme-roundness': String(currentPreset.styles.roundness),
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
