import React, { createContext, useContext, useState, useCallback } from 'react';
import type { PresetId, ThemeMode } from './presets';
import { presets } from './presets';
import type { CardLayout, SpacingScheme } from './presets/spacingSchemes';
import { buildColorEngineThemeVars } from './color-engine';
import type { PanelBackgroundMode } from './panelSurfaceGlass';

const PRESET_ID: PresetId = 'playground';

const SPACING_SCHEME_SESSION_KEY = 'playground:spacingScheme';
const CARD_LAYOUT_SESSION_KEY = 'playground:cardLayout';
const ICON_SIZE_SESSION_KEY = 'playground:iconSize';
const PORTAL_BANNER_STYLE_KEY = 'playground:portalBannerStyle';
const PORTAL_BANNER_IMAGE_KEY = 'playground:portalBannerImage';
const BANNER_PADDING_X_SESSION_KEY = 'playground:bannerPaddingX';
const PORTAL_BANNER_HEADING_COLOR_KEY = 'playground:portalBannerHeadingColor';
const PLAYGROUND_APPLY_BRAND_COLOR_KEY = 'playground:applyBrandColor';
const PLAYGROUND_PANEL_BACKGROUND_KEY = 'playground:panelBackgroundMode';

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

function readStoredPortalBannerStyle(fallback: PortalBannerStyle): PortalBannerStyle {
  if (typeof window === 'undefined') return fallback;
  const raw = window.sessionStorage.getItem(PORTAL_BANNER_STYLE_KEY);
  if (raw === 'colored' || raw === 'image') return raw;
  return fallback;
}

function readStoredPortalBannerImage(): string | null {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem(PORTAL_BANNER_IMAGE_KEY);
  if (!raw || !raw.startsWith('data:image/')) return null;
  return raw;
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

function readStoredApplyBrandColor(fallback: boolean): boolean {
  if (typeof window === 'undefined') return fallback;
  const raw = window.sessionStorage.getItem(PLAYGROUND_APPLY_BRAND_COLOR_KEY);
  if (raw == null) return fallback;
  return raw === 'true';
}

function readStoredPanelBackgroundMode(fallback: PanelBackgroundMode): PanelBackgroundMode {
  if (typeof window === 'undefined') return fallback;
  const raw = window.sessionStorage.getItem(PLAYGROUND_PANEL_BACKGROUND_KEY);
  if (raw === 'solid' || raw === 'translucent') return raw;
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
  /** Data URL from upload when `portalBannerStyle === 'image'`. */
  portalBannerImage: string | null;
  setPortalBannerImage: (v: string | null) => void;
  /** Drives portal banner top/bottom padding (same role as `PresetStyles.bannerPaddingX`). */
  bannerPaddingX: number;
  setBannerPaddingX: (v: number) => void;
  /** Portal banner main heading: white vs black. */
  portalBannerHeadingColor: PortalBannerHeadingColor;
  setPortalBannerHeadingColor: (v: PortalBannerHeadingColor) => void;
  /** When false, `--palette-step-*` follow the neutral ramp; hovers stay chromatic. */
  applyBrandColor: boolean;
  setApplyBrandColor: (v: boolean) => void;
  /** Header, cards, search: solid vs frosted glass (45% + blur). */
  panelBackgroundMode: PanelBackgroundMode;
  setPanelBackgroundMode: (v: PanelBackgroundMode) => void;
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
  const [spacingScheme, setSpacingSchemeState] = useState<SpacingScheme>(() =>
    readStoredSpacingScheme(presets[PRESET_ID].styles.spacingScheme),
  );
  const [cardLayout, setCardLayoutState] = useState<CardLayout>(() =>
    readStoredCardLayout(presets[PRESET_ID].cardLayout),
  );
  const [iconSize, setIconSizeState] = useState(() =>
    readStoredIconSize(presets[PRESET_ID].styles.iconSize),
  );
  const [showDescription, setShowDescription] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [portalBannerStyle, setPortalBannerStyleState] = useState<PortalBannerStyle>(() =>
    readStoredPortalBannerStyle('colored'),
  );
  const [portalBannerImage, setPortalBannerImageState] = useState<string | null>(() =>
    readStoredPortalBannerImage(),
  );
  const [bannerPaddingX, setBannerPaddingXState] = useState(() =>
    readStoredBannerPaddingX(presets[PRESET_ID].styles.bannerPaddingX),
  );
  const [portalBannerHeadingColor, setPortalBannerHeadingColorState] = useState<PortalBannerHeadingColor>(() =>
    readStoredPortalBannerHeadingColor('dark'),
  );
  const [applyBrandColor, setApplyBrandColorState] = useState(() => readStoredApplyBrandColor(true));
  const [panelBackgroundMode, setPanelBackgroundModeState] = useState<PanelBackgroundMode>(() =>
    readStoredPanelBackgroundMode('solid'),
  );

  const mode: ThemeMode = playgroundIsDark ? 'dark' : 'light';
  const toggleMode = useCallback(() => {
    setPlaygroundIsDark(v => !v);
  }, []);

  const setSpacingScheme = useCallback((v: SpacingScheme) => {
    setSpacingSchemeState(v);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SPACING_SCHEME_SESSION_KEY, v);
    }
  }, []);

  const setCardLayout = useCallback((v: CardLayout) => {
    setCardLayoutState(v);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(CARD_LAYOUT_SESSION_KEY, v);
    }
  }, []);

  const setIconSize = useCallback((v: number) => {
    const c = clampIconSize(v);
    setIconSizeState(c);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(ICON_SIZE_SESSION_KEY, String(c));
    }
  }, []);

  const setPortalBannerStyle = useCallback((v: PortalBannerStyle) => {
    setPortalBannerStyleState(v);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(PORTAL_BANNER_STYLE_KEY, v);
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

  const setApplyBrandColor = useCallback((v: boolean) => {
    setApplyBrandColorState(v);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(PLAYGROUND_APPLY_BRAND_COLOR_KEY, String(v));
    }
  }, []);

  const setPanelBackgroundMode = useCallback((v: PanelBackgroundMode) => {
    setPanelBackgroundModeState(v);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(PLAYGROUND_PANEL_BACKGROUND_KEY, v);
    }
  }, []);

  const currentPreset = presets[PRESET_ID];
  const colorEngineVars = buildColorEngineThemeVars(playgroundHex, playgroundIsDark, applyBrandColor);
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
        bannerPaddingX,
        setBannerPaddingX,
        portalBannerHeadingColor,
        setPortalBannerHeadingColor,
        applyBrandColor,
        setApplyBrandColor,
        panelBackgroundMode,
        setPanelBackgroundMode,
      }}
    >
      <div
        data-theme-root
        data-preset={PRESET_ID}
        data-mode={mode}
        data-panel-surface={panelBackgroundMode}
        style={themeStyle}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
