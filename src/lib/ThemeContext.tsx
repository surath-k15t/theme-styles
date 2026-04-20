import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type { PresetId, ThemeMode } from './presets';
import { presets, presetAdvancedColorPanelEnabled } from './presets';
import { defaultIconSizeForSpacingScheme, type CardLayout, type SpacingScheme } from './presets/spacingSchemes';
import { buildColorEngineThemeVars } from './color-engine';
import type { ColorCoverageMode, ColorUsageMode } from './colorCoverage';
import { persistColorUsage, readStoredColorUsage } from './colorCoverage';
import {
  computePaletteChromeColors,
  persistCustomChrome,
  readStoredCustomChrome,
  type CustomChromeColors,
} from './customChromeColors';
import type { PanelBackgroundMode } from './panelSurfaceGlass';

export type { ColorCoverageMode, ColorUsageMode } from './colorCoverage';
export type { CustomChromeColors } from './customChromeColors';

const PRESET_ID: PresetId = 'playground';

const SPACING_SCHEME_SESSION_KEY = 'playground:spacingScheme';
const CARD_LAYOUT_SESSION_KEY = 'playground:cardLayout';
const ICON_SIZE_SESSION_KEY = 'playground:iconSize';
const PORTAL_BANNER_STYLE_KEY = 'playground:portalBannerStyle';
const PORTAL_BANNER_IMAGE_KEY = 'playground:portalBannerImage';
/** Solid banner (`colored`): optional hex override for `--theme-banner-background-color`. */
const PORTAL_BANNER_SOLID_HEX_KEY = 'playground:portalBannerSolidBackgroundHex';

/** Shipped asset (Vite `public/origin/banner.svg`) — default portal banner when no upload is stored. */
export const DEFAULT_PORTAL_BANNER_IMAGE_SRC = '/origin/banner.svg';
const BANNER_PADDING_X_SESSION_KEY = 'playground:bannerPaddingX';
const PORTAL_BANNER_HEADING_COLOR_KEY = 'playground:portalBannerHeadingColor';
const PLAYGROUND_PANEL_BACKGROUND_KEY = 'playground:panelBackgroundMode';
const PLAYGROUND_COLOR_MODE_SETTING_KEY = 'playground:colorModeSetting';
/** Same key as `PLAYGROUND_IS_DARK_KEY` in floating-controls/constants (avoid circular import). */
const PLAYGROUND_IS_DARK_STORAGE_KEY = 'color-engine:isDark';

/** How the preview may switch between light and dark. */
export type ColorModeSetting = 'light-only' | 'dark-only' | 'light-and-dark';

/** Portal banner background mode (Pages tab). */
export type PortalBannerStyle = 'colored' | 'image';

/** Portal banner H1: white (`light`) or black (`dark`). */
export type PortalBannerHeadingColor = 'light' | 'dark';

/** Portal app card icon container (px); slider range in theme panel. */
export const THEME_ICON_SIZE_MIN = 32;
export const THEME_ICON_SIZE_MAX = 200;

/** Portal banner vertical padding driver (`bannerPaddingX` in presets); slider in Pages tab. */
export const THEME_BANNER_PADDING_X_MIN = 32;
export const THEME_BANNER_PADDING_X_MAX = 400;

function clampIconSize(n: number): number {
  return Math.min(THEME_ICON_SIZE_MAX, Math.max(THEME_ICON_SIZE_MIN, Math.round(n)));
}

function clampBannerPaddingX(n: number): number {
  return Math.min(THEME_BANNER_PADDING_X_MAX, Math.max(THEME_BANNER_PADDING_X_MIN, Math.round(n)));
}

const CARD_LAYOUT_IDS: CardLayout[] = [
  'grid-3col',
  'grid-2col',
  'list-1col',
  'list-2col',
  'list-3col',
];

function readStoredSpacingScheme(fallback: SpacingScheme): SpacingScheme {
  if (typeof window === 'undefined') return fallback;
  const raw = window.sessionStorage.getItem(SPACING_SCHEME_SESSION_KEY);
  if (raw === 'compact' || raw === 'standard' || raw === 'spacious') return raw;
  return fallback;
}

function readStoredCardLayout(fallback: CardLayout): CardLayout {
  if (typeof window === 'undefined') return fallback;
  const raw = window.sessionStorage.getItem(CARD_LAYOUT_SESSION_KEY);
  if (raw && (CARD_LAYOUT_IDS as readonly string[]).includes(raw)) return raw as CardLayout;
  return fallback;
}

function readStoredIconSize(fallback: number): number {
  const normalizedFallback = clampIconSize(fallback);
  if (typeof window === 'undefined') return normalizedFallback;
  const raw = window.sessionStorage.getItem(ICON_SIZE_SESSION_KEY);
  if (!raw) return normalizedFallback;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n)) return normalizedFallback;
  return clampIconSize(n);
}

function readStoredPortalBannerStyle(_fallback: PortalBannerStyle): PortalBannerStyle {
  if (typeof window === 'undefined') return 'image';
  const raw = window.sessionStorage.getItem(PORTAL_BANNER_STYLE_KEY);
  if (raw === 'image') return 'image';
  return 'image';
}

function readStoredPortalBannerImage(): string | null {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem(PORTAL_BANNER_IMAGE_KEY);
  if (!raw) return null;
  if (raw.startsWith('data:image/')) return raw;
  if (raw.startsWith('/')) return raw;
  return null;
}

function readStoredPortalBannerSolidHex(): string | null {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem(PORTAL_BANNER_SOLID_HEX_KEY);
  if (!raw) return null;
  if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw.toLowerCase();
  return null;
}

function readStoredBannerPaddingX(fallback: number): number {
  const fb = clampBannerPaddingX(fallback);
  if (typeof window === 'undefined') return fb;
  const raw = window.sessionStorage.getItem(BANNER_PADDING_X_SESSION_KEY);
  if (!raw) return fb;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n)) return fb;
  return clampBannerPaddingX(n);
}

function readStoredPortalBannerHeadingColor(fallback: PortalBannerHeadingColor): PortalBannerHeadingColor {
  if (typeof window === 'undefined') return fallback;
  const raw = window.sessionStorage.getItem(PORTAL_BANNER_HEADING_COLOR_KEY);
  if (raw === 'light' || raw === 'dark') return raw;
  return fallback;
}

function readStoredPanelBackgroundMode(fallback: PanelBackgroundMode): PanelBackgroundMode {
  if (typeof window === 'undefined') return fallback;
  const raw = window.sessionStorage.getItem(PLAYGROUND_PANEL_BACKGROUND_KEY);
  if (raw === 'solid' || raw === 'translucent') return raw;
  return fallback;
}

function readStoredColorModeSetting(fallback: ColorModeSetting): ColorModeSetting {
  if (typeof window === 'undefined') return fallback;
  const raw = window.sessionStorage.getItem(PLAYGROUND_COLOR_MODE_SETTING_KEY);
  if (raw === 'light-only' || raw === 'dark-only' || raw === 'light-and-dark') return raw;
  return fallback;
}

function readStoredPlaygroundIsDark(fallback: boolean): boolean {
  if (typeof window === 'undefined') return fallback;
  const raw = window.sessionStorage.getItem(PLAYGROUND_IS_DARK_STORAGE_KEY);
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return fallback;
}

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
  /** When `light-and-dark`, site header and panel header may show a toggle. */
  colorModeSetting: ColorModeSetting;
  setColorModeSetting: (v: ColorModeSetting) => void;
  playgroundHex: string;
  setPlaygroundHex: (hex: string) => void;
  playgroundIsDark: boolean;
  setPlaygroundIsDark: (v: boolean) => void;
  themeRadiusTier: ThemeRadiusTier;
  setThemeRadiusTier: (v: ThemeRadiusTier) => void;
  spacingScheme: SpacingScheme;
  setSpacingScheme: (v: SpacingScheme) => void;
  cardLayout: CardLayout;
  setCardLayout: (v: CardLayout) => void;
  /** App card icon container size (px). */
  iconSize: number;
  setIconSize: (v: number) => void;
  showDescription: boolean;
  setShowDescription: (v: boolean) => void;
  showDebug: boolean;
  setShowDebug: (v: boolean) => void;
  /** Portal home banner: solid brand tint vs uploaded image. */
  portalBannerStyle: PortalBannerStyle;
  setPortalBannerStyle: (v: PortalBannerStyle) => void;
  /** Banner image: data URL from upload and/or default `/origin/banner.svg` when `portalBannerStyle === 'image'`. */
  portalBannerImage: string | null;
  setPortalBannerImage: (v: string | null) => void;
  /** Solid banner only: custom fill hex, or null to use `--theme-banner-background-color` from tokens. */
  portalBannerSolidBackgroundHex: string | null;
  setPortalBannerSolidBackgroundHex: (v: string | null) => void;
  /** Engine `--palette-step-1` for the solid-banner color input when no custom hex is stored. */
  portalBannerSolidBackgroundDefaultHex: string;
  /** Drives portal banner top/bottom padding (same role as `PresetStyles.bannerPaddingX`). */
  bannerPaddingX: number;
  setBannerPaddingX: (v: number) => void;
  /** Portal banner main heading: white vs black. */
  portalBannerHeadingColor: PortalBannerHeadingColor;
  setPortalBannerHeadingColor: (v: PortalBannerHeadingColor) => void;
  /** Playground color usage: Standard (full ramp), Subtle (neutral surfaces + chromatic accents), Minimal (like Subtle + neutral canvas/header + flat cards). */
  colorCoverage: ColorUsageMode;
  setColorCoverage: (v: ColorUsageMode) => void;
  /** Header, cards, search: solid vs frosted glass (45% + blur). */
  panelBackgroundMode: PanelBackgroundMode;
  setPanelBackgroundMode: (v: PanelBackgroundMode) => void;
  /** From preset `advanced`: show the Brand panel “Advanced” color diagnostics toggle. */
  advancedColorPanelEnabled: boolean;
  /** When true, `--theme-custom-*` on the theme root override header/footer/banner chrome. */
  customColorsEnabled: boolean;
  setCustomColorsEnabled: (v: boolean) => void;
  customChrome: CustomChromeColors;
  setCustomChrome: (patch: Partial<CustomChromeColors>) => void;
  resetCustomChromeSection: (section: 'header' | 'footer' | 'banner') => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playgroundHex, setPlaygroundHex] = useState('#0e305c');
  const [colorModeSetting, setColorModeSettingState] = useState<ColorModeSetting>(() =>
    readStoredColorModeSetting('light-and-dark'),
  );
  /** Single light/dark switch: drives `data-mode`, neutrals, and chromatic scale. */
  const [playgroundIsDark, setPlaygroundIsDark] = useState(() => {
    const setting = readStoredColorModeSetting('light-and-dark');
    if (setting === 'light-only') return false;
    if (setting === 'dark-only') return true;
    return readStoredPlaygroundIsDark(false);
  });
  const [themeRadiusTier, setThemeRadiusTier] = useState<ThemeRadiusTier>('medium');
  const initialSpacingScheme = readStoredSpacingScheme(presets[PRESET_ID].styles.spacingScheme);
  const spacingSchemeRef = useRef<SpacingScheme>(initialSpacingScheme);
  const [spacingScheme, setSpacingSchemeState] = useState<SpacingScheme>(initialSpacingScheme);
  const [cardLayout, setCardLayoutState] = useState<CardLayout>(() =>
    readStoredCardLayout(presets[PRESET_ID].cardLayout),
  );
  const [iconSize, setIconSizeState] = useState(() =>
    readStoredIconSize(defaultIconSizeForSpacingScheme(initialSpacingScheme)),
  );
  const [showDescription, setShowDescription] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [portalBannerStyle, setPortalBannerStyleState] = useState<PortalBannerStyle>(() =>
    readStoredPortalBannerStyle('image'),
  );
  const [portalBannerImage, setPortalBannerImageState] = useState<string | null>(() =>
    readStoredPortalBannerImage() ?? DEFAULT_PORTAL_BANNER_IMAGE_SRC,
  );
  const [bannerPaddingX, setBannerPaddingXState] = useState(() =>
    readStoredBannerPaddingX(presets[PRESET_ID].styles.bannerPaddingX),
  );
  const [portalBannerHeadingColor, setPortalBannerHeadingColorState] = useState<PortalBannerHeadingColor>(() =>
    readStoredPortalBannerHeadingColor('light'),
  );
  const [colorCoverage, setColorCoverageState] = useState<ColorUsageMode>(() => readStoredColorUsage('standard'));
  const [panelBackgroundMode, setPanelBackgroundModeState] = useState<PanelBackgroundMode>(() =>
    readStoredPanelBackgroundMode('solid'),
  );
  const [portalBannerSolidBackgroundHex, setPortalBannerSolidBackgroundHexState] = useState<string | null>(() =>
    readStoredPortalBannerSolidHex(),
  );

  const defaultChromePlaceholder: CustomChromeColors = {
    headerBg: '#f4f5f7',
    headerText: '#0a0a0a',
    footerBg: '#f4f5f7',
    footerText: '#636363',
    bannerBg: '#f4f5f7',
    bannerText: '#ffffff',
  };
  const [customColorsEnabled, setCustomColorsEnabledState] = useState(() => readStoredCustomChrome()?.enabled ?? false);
  const [customChrome, setCustomChromeState] = useState<CustomChromeColors>(() => {
    const s = readStoredCustomChrome();
    return s?.colors ?? defaultChromePlaceholder;
  });

  const mode: ThemeMode = playgroundIsDark ? 'dark' : 'light';
  const toggleMode = useCallback(() => {
    setPlaygroundIsDark(v => !v);
  }, []);

  /** Lock preview to light or dark when the setting is not `light-and-dark`. */
  useEffect(() => {
    if (colorModeSetting === 'light-only') setPlaygroundIsDark(false);
    else if (colorModeSetting === 'dark-only') setPlaygroundIsDark(true);
  }, [colorModeSetting]);

  const setColorModeSetting = useCallback((v: ColorModeSetting) => {
    setColorModeSettingState(v);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(PLAYGROUND_COLOR_MODE_SETTING_KEY, v);
    }
  }, []);

  const setIconSize = useCallback((v: number) => {
    const c = clampIconSize(v);
    setIconSizeState(c);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(ICON_SIZE_SESSION_KEY, String(c));
    }
  }, []);

  const setSpacingScheme = useCallback(
    (v: SpacingScheme) => {
      const prev = spacingSchemeRef.current;
      spacingSchemeRef.current = v;
      setSpacingSchemeState(v);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(SPACING_SCHEME_SESSION_KEY, v);
      }
      if (prev !== v) {
        setIconSize(defaultIconSizeForSpacingScheme(v));
      }
    },
    [setIconSize],
  );

  const setCardLayout = useCallback((v: CardLayout) => {
    setCardLayoutState(v);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(CARD_LAYOUT_SESSION_KEY, v);
    }
  }, []);

  const setPortalBannerStyle = useCallback((_v: PortalBannerStyle) => {
    const next: PortalBannerStyle = 'image';
    setPortalBannerStyleState(next);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(PORTAL_BANNER_STYLE_KEY, next);
    }
  }, []);

  const setPortalBannerImage = useCallback((v: string | null) => {
    setPortalBannerImageState(v);
    if (typeof window !== 'undefined') {
      if (v) window.sessionStorage.setItem(PORTAL_BANNER_IMAGE_KEY, v);
      else window.sessionStorage.removeItem(PORTAL_BANNER_IMAGE_KEY);
    }
  }, []);

  const setBannerPaddingX = useCallback((v: number) => {
    const c = clampBannerPaddingX(v);
    setBannerPaddingXState(c);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(BANNER_PADDING_X_SESSION_KEY, String(c));
    }
  }, []);

  const setPortalBannerHeadingColor = useCallback((v: PortalBannerHeadingColor) => {
    setPortalBannerHeadingColorState(v);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(PORTAL_BANNER_HEADING_COLOR_KEY, v);
    }
  }, []);

  const setColorCoverage = useCallback((v: ColorUsageMode) => {
    setColorCoverageState(v);
    persistColorUsage(v);
  }, []);

  const setPanelBackgroundMode = useCallback((v: PanelBackgroundMode) => {
    setPanelBackgroundModeState(v);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(PLAYGROUND_PANEL_BACKGROUND_KEY, v);
    }
  }, []);

  const setPortalBannerSolidBackgroundHex = useCallback((v: string | null) => {
    setPortalBannerSolidBackgroundHexState(v);
    if (typeof window !== 'undefined') {
      if (v && /^#[0-9a-fA-F]{6}$/.test(v)) {
        window.sessionStorage.setItem(PORTAL_BANNER_SOLID_HEX_KEY, v.toLowerCase());
      } else {
        window.sessionStorage.removeItem(PORTAL_BANNER_SOLID_HEX_KEY);
      }
    }
  }, []);

  const currentPreset = presets[PRESET_ID];
  const advancedColorPanelEnabled = presetAdvancedColorPanelEnabled(currentPreset.advanced);
  const colorEngineVars = buildColorEngineThemeVars(playgroundHex, playgroundIsDark);
  const portalBannerSolidBackgroundDefaultHex = colorEngineVars['--palette-step-1'] ?? '#f4f5f7';

  const setCustomColorsEnabled = useCallback(
    (enabled: boolean) => {
      setCustomColorsEnabledState(enabled);
      if (enabled) {
        setCustomChromeState(
          computePaletteChromeColors({
            engineVars: colorEngineVars,
            colorCoverage,
            mode,
            panelBackgroundMode,
            portalBannerStyle,
            portalBannerSolidBackgroundHex,
            portalBannerSolidBackgroundDefaultHex,
            portalBannerHeadingColor,
          }),
        );
      }
    },
    [
      colorEngineVars,
      colorCoverage,
      mode,
      panelBackgroundMode,
      portalBannerStyle,
      portalBannerSolidBackgroundHex,
      portalBannerSolidBackgroundDefaultHex,
      portalBannerHeadingColor,
    ],
  );

  const setCustomChrome = useCallback((patch: Partial<CustomChromeColors>) => {
    setCustomChromeState(c => ({ ...c, ...patch }));
  }, []);

  const resetCustomChromeSection = useCallback(
    (section: 'header' | 'footer' | 'banner') => {
      const d = computePaletteChromeColors({
        engineVars: colorEngineVars,
        colorCoverage,
        mode,
        panelBackgroundMode,
        portalBannerStyle,
        portalBannerSolidBackgroundHex,
        portalBannerSolidBackgroundDefaultHex,
        portalBannerHeadingColor,
      });
      if (section === 'header') {
        setCustomChromeState(c => ({ ...c, headerBg: d.headerBg, headerText: d.headerText }));
      } else if (section === 'footer') {
        setCustomChromeState(c => ({ ...c, footerBg: d.footerBg, footerText: d.footerText }));
      } else {
        setCustomChromeState(c => ({ ...c, bannerBg: d.bannerBg, bannerText: d.bannerText }));
      }
    },
    [
      colorEngineVars,
      colorCoverage,
      mode,
      panelBackgroundMode,
      portalBannerStyle,
      portalBannerSolidBackgroundHex,
      portalBannerSolidBackgroundDefaultHex,
      portalBannerHeadingColor,
    ],
  );

  useEffect(() => {
    persistCustomChrome(customColorsEnabled, customChrome);
  }, [customColorsEnabled, customChrome]);

  const customChromeCss = useMemo(() => {
    if (!customColorsEnabled) return {} as React.CSSProperties;
    return {
      '--theme-custom-header-bg': customChrome.headerBg,
      '--theme-custom-header-text': customChrome.headerText,
      '--theme-custom-footer-bg': customChrome.footerBg,
      '--theme-custom-footer-text': customChrome.footerText,
      '--theme-custom-banner-bg': customChrome.bannerBg,
      '--theme-custom-banner-text': customChrome.bannerText,
    } as React.CSSProperties;
  }, [customColorsEnabled, customChrome]);

  const themeStyle = {
    ...currentPreset.cssVars,
    ...(playgroundIsDark ? currentPreset.darkCssVars : {}),
    ...colorEngineVars,
    '--theme-roundness': String(THEME_RADIUS_TIER_VALUES[themeRadiusTier]),
    ...(portalBannerStyle === 'colored' && portalBannerSolidBackgroundHex
      ? { '--theme-banner-background-color': portalBannerSolidBackgroundHex }
      : {}),
    ...customChromeCss,
  } as React.CSSProperties;

  return (
    <ThemeContext.Provider
      value={{
        preset: PRESET_ID,
        mode,
        toggleMode,
        colorModeSetting,
        setColorModeSetting,
        playgroundHex,
        setPlaygroundHex,
        playgroundIsDark,
        setPlaygroundIsDark,
        themeRadiusTier,
        setThemeRadiusTier,
        spacingScheme,
        setSpacingScheme,
        cardLayout,
        setCardLayout,
        iconSize,
        setIconSize,
        showDescription,
        setShowDescription,
        showDebug,
        setShowDebug,
        portalBannerStyle,
        setPortalBannerStyle,
        portalBannerImage,
        setPortalBannerImage,
        portalBannerSolidBackgroundHex,
        setPortalBannerSolidBackgroundHex,
        portalBannerSolidBackgroundDefaultHex,
        bannerPaddingX,
        setBannerPaddingX,
        portalBannerHeadingColor,
        setPortalBannerHeadingColor,
        colorCoverage,
        setColorCoverage,
        panelBackgroundMode,
        setPanelBackgroundMode,
        advancedColorPanelEnabled,
        customColorsEnabled,
        setCustomColorsEnabled,
        customChrome,
        setCustomChrome,
        resetCustomChromeSection,
      }}
    >
      <div
        data-theme-root
        data-preset={PRESET_ID}
        data-mode={mode}
        data-panel-surface={panelBackgroundMode}
        data-color-usage={colorCoverage}
        data-custom-colors={customColorsEnabled ? 'on' : 'off'}
        style={themeStyle}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
