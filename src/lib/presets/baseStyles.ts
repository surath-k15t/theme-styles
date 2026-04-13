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
  bannerBackground: 'var(--theme-banner-background-color)',
  bannerTextColor: 'var(--theme-banner-text-color)',
  bannerOverlapHeader: false,

  // Typography: H1 (banner main heading)
  h1Size: 'var(--ds-font-size-2xl)',
  h1Weight: 'var(--ds-font-weight-medium)',
  h1Color: 'inherit',
  h1LetterSpacing: 'normal',
  h1LineHeight: 'var(--ds-line-height-x-small)',
  h1PaddingBottom: '0px',
  headerBackground: 'var(--theme-header-background-color)',

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
  pColor: 'var(--ds-foreground-subtle)',

  portalCanvasBackground: 'var(--ds-canvas)',
  articleCanvasBackground: 'var(--ds-canvas)',

  spacingScheme: 'standard',
  roundness: 2,

  cardBorder: '1px solid var(--ds-border-brand-strong)',
  cardBackground: 'var(--ds-surface)',
  cardBackgroundHover: 'var(--ds-surface-hovered)',
  cardBorderHover: 'var(--palette-step-8)',
  iconSize: 58,
  cardIconColor: 'var(--ds-card-icon-color)',
  //cardIconBackground: 'var(--ds-background-neutral)',

  sidebarPadding: '20px 0',
  contentPadding: '32px 48px',
  tocPadding: '32px 24px 32px 16px',
  tocBoxBorder: '1px solid var(--ds-border-brand-strong)',
  tocBoxPadding: '16px',

  // Page tree colors
  sidebarItemColor: 'var(--ds-foreground-subtle)',
  sidebarItemHoverBackground: 'var(--ds-background-neutral-subtle-hovered)',
  sidebarSelectedColor: 'var(--theme-primary-color)',
  sidebarSelectedBackground: 'var(--ds-background-neutral)',
  sidebarSelectedBorder: '2px solid var(--theme-primary-color)',

  // TOC colors
  tocItemColor: 'var(--ds-foreground-subtle)',
  tocItemHoverColor: 'var(--ds-foreground)',
  tocItemHoverBackground: 'var(--ds-background-neutral-subtle-hovered)',
  tocSelectedColor: 'var(--ds-foreground)',
  tocSelectedBorder: '2px solid var(--theme-primary-color)',

  footerPadding: '20px 24px',

  searchButtonBrand: false,
};
