import React, { createContext, useContext, useState, useCallback } from 'react';
import type { PresetId, ThemeMode } from './presets';
import { presets } from './presets';
import { buildPlaygroundCssVars } from './palette-generator/playground-css-vars';

interface ThemeContextType {
  preset: PresetId;
  mode: ThemeMode;
  setPreset: (p: PresetId) => void;
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
  const [preset, setPreset] = useState<PresetId>('origin');
  const [mode, setMode] = useState<ThemeMode>('light');
  const [playgroundHex, setPlaygroundHex] = useState('#157F78');
  const [playgroundIsDark, setPlaygroundIsDark] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const toggleMode = useCallback(() => {
    setMode(m => (m === 'light' ? 'dark' : 'light'));
  }, []);

  const currentPreset = presets[preset];
  const playgroundVars =
    preset === 'playground'
      ? buildPlaygroundCssVars(playgroundHex, playgroundIsDark)
      : {};
  const themeStyle = {
    ...currentPreset.cssVars,
    ...(mode === 'dark' ? currentPreset.darkCssVars : {}),
    ...playgroundVars,
    '--theme-roundness': String(currentPreset.styles.roundness),
  } as React.CSSProperties;

  return (
    <ThemeContext.Provider
      value={{
        preset,
        mode,
        setPreset,
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
      <div data-theme-root data-preset={preset} data-mode={mode} style={themeStyle}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
