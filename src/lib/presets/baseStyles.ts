import '../../design-tokens/core-tokens.css';
import '../../design-tokens/alias-tokens.css';
import '../../design-tokens/theme-tokens.css';

import type { PresetStyles } from './types';

/* ────────────────────────────────────────────
   Shared defaults — most presets share these.
   Each preset spreads baseStyles and overrides
   only the properties it needs to change.
   ──────────────────────────────────────────── */
export const baseStyles: PresetStyles = {
  headerHeight: 80,
  headerPadding: '0 24px',
  headerBorderBottom: 'none',
  headerPickerBorder: '1px solid rgba(255,255,255,0.22)',

  bannerPaddingX: 158,
  bannerBackground: 'var(--theme-banner-background-slot)',
  bannerTextColor: 'var(--theme-banner-text-slot)',
  bannerOverlapHeader: false,

  // Typography: H1 (banner main heading)
  h1Size: 'var(--ds-font-size-2xl)',
  h1Weight: 'var(--ds-font-weight-medium)',
  h1Color: 'inherit',
  h1LetterSpacing: 'normal',
  h1LineHeight: 'var(--ds-line-height-x-small)',
  h1PaddingBottom: '0px',
  headerBackground: 'var(--theme-header-background-slot)',

  // Typography: H2 (section headings like "Our Apps")
  h2Size: 'var(--ds-font-size-xl)',
  h2Weight: 'var(--ds-font-weight-medium)',
  h2Color: 'var(--theme-headline-color)',
  h2LetterSpacing: 'normal',
  h2LineHeight: 'var(--ds-line-height-small)',

  // Typography: H3 (card titles)
  h3Size: 'var(--ds-font-size-md)',
  h3Weight: 'var(--ds-font-weight-medium)',
  h3Color: 'var(--theme-headline-color)',
  h3LetterSpacing: 'normal',

  // Typography: P (card descriptions, body text)
  pSize: 'var(--ds-font-size-sm)',
  pWeight: 'var(--ds-font-weight-regular)',
  pColor: 'var(--K15t-foreground-subtle)',

  portalCanvasBackground: 'var(--K15t-canvas)',
  articleCanvasBackground: 'var(--K15t-canvas)',

  spacingScheme: 'standard',
  roundness: 2,

  cardBorder: 'var(--K15t-app-card-border)',
  cardBackground: 'var(--K15t-app-card-background)',
  cardBackgroundHover: 'var(--K15t-app-card-background-hover)',
  cardBorderHover: 'var(--K15t-app-card-border-color-hovered)',
  iconSize: 58,
  cardIconColor: 'var(--K15t-card-icon-color)',
  cardIconBackground: 'var(--K15t-background-neutral)',

  sidebarPadding: '20px 0',
  contentPadding: '32px 48px',
  tocPadding: '32px 24px 32px 16px',
  tocBoxBorder: '1px solid var(--K15t-border-brand-strong)',
  tocBoxPadding: '16px',

  // Page tree colors
  sidebarItemColor: 'var(--K15t-foreground-subtle)',
  sidebarItemHoverBackground: 'var(--K15t-background-neutral-subtle-hovered)',
  sidebarSelectedColor: 'var(--chromatic-step-9)',
  sidebarSelectedBackground: 'var(--K15t-background-neutral)',
  sidebarSelectedBorder: '2px solid var(--chromatic-step-9)',

  // TOC colors
  tocItemColor: 'var(--K15t-foreground-subtle)',
  tocItemHoverColor: 'var(--K15t-foreground)',
  tocItemHoverBackground: 'var(--K15t-background-neutral-subtle-hovered)',
  tocSelectedColor: 'var(--K15t-foreground)',
  tocSelectedBorder: '2px solid var(--chromatic-step-9)',

  footerPadding: '20px 24px',

  searchButtonBrand: false,
};
