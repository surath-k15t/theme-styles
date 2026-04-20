import type { CardLayout, SpacingScheme } from './spacingSchemes';

export type PresetId = 'playground';
export type ThemeMode = 'light' | 'dark';

export type { CardLayout, SpacingScheme } from './spacingSchemes';

export interface PresetStyles {
  // Header
  headerHeight: number;
  headerPadding: string;
  headerBorderBottom: string;
  headerPickerBorder: string;
  headerBackground: string;

  // Banner
  /** X value (px) driving computed padding. See Banner.tsx for the full formula. */
  bannerPaddingX: number;
  bannerBackground: string;
  bannerTextColor: string;

  // Typography scale — H1, H2, H3, P
  h1Size: string;
  h1Weight: string;
  h1Color: string;
  h1LetterSpacing: string;
  h1LineHeight: string;
  h1PaddingBottom: string;

  h2Size: string;
  h2Weight: string;
  h2Color: string;
  h2LetterSpacing: string;
  h2LineHeight: string;

  h3Size: string;
  h3Weight: string;
  h3Color: string;
  h3LetterSpacing: string;
  h3FontFamily?: string;  // overrides headline font for card titles (defaults to var(--ds-font-family-headline))

  pSize: string;
  pWeight: string;
  pColor: string;

  // Canvas (main content area background)ä
  portalCanvasBackground: string;
  articleCanvasBackground: string;

  /** When true, the banner slides up behind the sticky header so the header blurs the banner image */
  bannerOverlapHeader?: boolean;

  // App cards section
  /** Named spacing scheme — drives section padding, card padding, icon gap and heading margin */
  spacingScheme: SpacingScheme;
  /** Horizontal (left/right) padding of the cards section wrapper in px; defaults to 24 */
  cardsSectionPaddingSides?: number;

  // Radius — single factor driving the full --ds-radius-* token scale
  /** Multiplier for the radius token scale. 0 = sharp, 1 = default, 2 = rounded, 4 = very round */
  roundness: number;

  // Individual card styles
  cardBorder: string;
  cardBackground: string;
  cardBackgroundHover: string;
  cardBorderHover: string | null;  // null = no border change on hover

  // Card icon styles
  /** Container box size in px. Icon render size = iconSize/2 when a background is set, iconSize when no background. */
  iconSize: number;
  cardIconTextGap?: number; // gap (px) between icon and text block in list-style cards; defaults to 16
  cardIconColor: string;
  cardIconBackground: string;     // 'none' for no background box

  // Article page — layout
  sidebarPadding: string;
  contentPadding: string;
  tocPadding: string;
  tocBoxBorder: string;
  tocBoxPadding: string;

  // Page tree (left sidebar) — colors
  sidebarItemColor: string;
  sidebarItemHoverBackground: string;
  sidebarSelectedColor: string;
  sidebarSelectedBackground: string;
  sidebarSelectedBorder: string;

  // TOC (right sidebar) — colors
  tocItemColor: string;
  tocItemHoverColor: string;
  tocItemHoverBackground: string;
  tocSelectedColor: string;
  tocSelectedBorder: string;

  // Footer
  footerPadding: string;

  // Search bar
  searchButtonBrand: boolean;
  /** Frosted blur applied to the search bar wrapper (e.g. 'blur(20px)') */
  searchBackdropFilter?: string;
  /** Solid fill behind the search bar glass (e.g. 'rgba(255,255,255,0.30)') */
  searchGlassBackground?: string;
  /** Plain border override (e.g. '1px solid #FFFFFF'); used when no gradient border is needed */
  searchBorder?: string;
  /** Color for the search icon and input text (e.g. '#FFFFFF' for dark backgrounds) */
  searchForegroundColor?: string;
  /** Explicit color for the 'Search all' button text; overrides the brand/default color */
  searchButtonTextColor?: string;
  /** Font weight for the 'Search all' button text */
  searchButtonFontWeight?: number;
  /** Gradient string for the border (triggers the background-clip gradient-border technique) */
  searchBorderGradient?: string;

  // Frosted glass / backdrop filters (optional, used by Aurora)
  headerBackdropFilter?: string;
  cardBackdropFilter?: string;

  // When false, card description text is hidden (default: true)
  cardShowDescription?: boolean;

  // Banner image (optional decorative image)
  bannerImageOpacity?: number;           // 0–1, default 1
  bannerImageSide?: 'left' | 'right' | 'full'; // placement, default 'right'
  bannerImageMaxHeight?: string;         // CSS value, default '100%'
}

export interface PresetConfig {
  id: PresetId;
  name: string;
  subtitle: string;
  description: string;
  tags: string[];
  swatchColor: string;
  swatchBorder?: boolean;
  brandName: string;
  brandSubtitle: string;
  logoType: 'material' | 'emoji' | 'badge';
  logoIcon: string;
  apps: { name: string; icon: string; iconType: 'material' | 'emoji' | 'image'; description?: string }[];
  /** Section heading above the app cards grid (defaults to "Our apps") */
  cardsSectionHeading?: string;
  cardLayout: CardLayout;
  /**
   * Controls how the banner background is rendered:
   * - 'none'     — blends with the portal canvas (no distinct banner bg)
   * - 'colored'  — solid/custom color set via `styles.bannerBackground`
   * - 'gradient' — flowing gradient from `--K15t-color-brand-100|400|700` (palette steps 3/6/9)
   * - 'image'    — full-width decorative image (set via `bannerImage`)
   */
  bannerStyle: 'none' | 'colored' | 'gradient' | 'image';
  /** Optional URL for a decorative image displayed inside the banner */
  bannerImage?: string;
  /** Light-mode CSS custom properties applied as inline style on data-theme-root */
  cssVars: Record<string, string>;
  /** Dark-mode overrides merged on top of cssVars when mode === 'dark' */
  darkCssVars: Record<string, string>;
  styles: PresetStyles;
  /**
   * Feature flag for the Brand panel “Advanced” color diagnostics toggle (scale table + alpha).
   * `true` or string `'true'` enables it; `false`, `'false'`, or omitted hides it (default).
   */
  advanced?: boolean | 'true' | 'false';
}

/** Whether the preset enables the Advanced color diagnostics UI. */
export function presetAdvancedColorPanelEnabled(
  advanced: PresetConfig['advanced'],
): boolean {
  if (advanced === true || advanced === 'true') return true;
  return false;
}
