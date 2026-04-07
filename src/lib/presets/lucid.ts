import type { PresetConfig } from './types';
import { baseStyles } from './baseStyles';

export const lucidPreset: PresetConfig = {
  id: 'lucid',
  name: 'Lucid',
  subtitle: 'The Precision',
  description: 'Crystal clear simplicity inspired by high-end tech. Focuses on generous white space and crisp typography to make content feel weightless.',
  tags: ['Modern sans', 'Minimalist', 'High white space', 'Precision blue', 'Spacious layout'],
  swatchColor: '#007AFF',
  brandName: 'Clearview',
  brandSubtitle: 'Clearview Support',
  logoType: 'material',
  logoIcon: 'lens_blur',
  apps: [
    { name: 'Clearview Studio', icon: 'palette', iconType: 'material', description: 'Design, prototype, and publish.' },
    { name: 'Clearview Mail', icon: 'mail', iconType: 'material', description: 'Focused email built around clarity.' },
    { name: 'Clearview Photos', icon: 'photo_library', iconType: 'material', description: 'Intelligently organised photo library with non-destructive editing and seamless device sync.' },
    { name: 'Clearview Notes', icon: 'edit_note', iconType: 'material', description: 'Capture ideas instantly.' },
    { name: 'Clearview Calendar', icon: 'calendar_month', iconType: 'material', description: 'Scheduling across teams and time zones.' },
    { name: 'Clearview Maps', icon: 'map', iconType: 'material', description: 'High-fidelity maps with real-time updates.' },
    { name: 'Clearview Health', icon: 'favorite', iconType: 'material', description: 'A private, consolidated view of your health data.' },
    { name: 'Clearview Cloud', icon: 'cloud', iconType: 'material', description: 'Secure, end-to-end encrypted storage that keeps every device in sync without compromise on privacy or performance.' },
  ],
  cardLayout: 'grid-3col',
  bannerStyle: 'none',
  cssVars: {
    '--theme-text-font': "-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    '--theme-headline-font': "-apple-system, 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    '--theme-text-color': '#1d1d1f',
    '--theme-headline-color': '#1d1d1f',
    '--theme-primary-color': '#007AFF',
    '--theme-on-primary-color': '#FFFFFF',
    '--theme-headline-scale': '1',
    '--theme-header-background-color': '#F5F5F7',
    '--theme-header-text-color': '#1d1d1f',
    '--theme-banner-background-color': '#FBFBFD',
    '--theme-banner-text-color': '#1d1d1f',
    '--theme-footer-background-color': '#F5F5F7',
    '--theme-footer-text-color': '#86868b',
    '--theme-content-width': '860px',
    '--theme-content-line-height': 'var(--ds-line-height-large)',
    '--theme-content-spacing': '1.125rem',
    '--ds-color-neutral-25': '#F5F5F7',
    '--ds-color-neutral-50': '#F0F0F2',
    '--ds-color-neutral-75': '#E8E8ED',
    '--ds-color-neutral-100': '#D2D2D7',
    '--ds-color-neutral-200': '#86868b',
    '--ds-color-neutral-300': '#6e6e73',
    '--ds-color-neutral-400': '#424245',
    '--ds-color-neutral-500': '#1d1d1f',
    '--ds-border-neutral-strong': '#D2D2D7',
    '--ds-border-neutral-strong-hovered': '#86868b',
    '--ds-background-neutral-subtle-hovered': '#F5F5F7',
    '--ds-link': '#007AFF',
    '--ds-icon-information': '#007AFF',
    '--ds-background-information': '#EBF3FE',
    '--ds-font-weight-medium': '500',
  },
  darkCssVars: {
    '--ds-color-neutral-0': '#000000',
    '--ds-color-neutral-25': '#1c1c1e',
    '--ds-color-neutral-50': '#2c2c2e',
    '--ds-color-neutral-75': '#38383a',
    '--ds-color-neutral-100': '#48484a',
    '--ds-color-neutral-200': '#636366',
    '--ds-color-neutral-300': '#8e8e93',
    '--ds-color-neutral-400': '#aeaeb2',
    '--ds-color-neutral-500': '#d1d1d6',
    '--ds-color-neutral-900': '#f2f2f7',
    '--ds-color-neutral-1000': '#FFFFFF',
    '--theme-header-background-color': '#1c1c1e',
    '--theme-header-text-color': '#f2f2f7',
    '--theme-banner-background-color': '#000000',
    '--theme-banner-text-color': '#f2f2f7',
    '--theme-footer-background-color': '#1c1c1e',
    '--theme-footer-text-color': '#8e8e93',
    '--theme-text-color': '#f2f2f7',
    '--theme-headline-color': '#f2f2f7',
    '--theme-primary-color': '#0A84FF',
    '--theme-on-primary-color': '#000000',
    '--ds-surface': '#000000',
    '--ds-surface-hovered': '#1c1c1e',
    '--ds-border-neutral-strong': '#38383a',
    '--ds-border-neutral-strong-hovered': '#636366',
    '--ds-background-neutral-subtle-hovered': '#1c1c1e',
    '--ds-link': '#0A84FF',
    '--ds-icon-information': '#0A84FF',
    '--ds-background-information': '#0a1a2e',
  },
  styles: {
    ...baseStyles,

    // Layout
    roundness: 4,
    spacingScheme: 'spacious',

    // Header — light separator, blends with banner
    headerHeight: 52,
    headerPadding: '0 20px',
    headerBorderBottom: '1px solid rgba(0,0,0,0.08)',
    headerPickerBorder: '1px solid rgba(0,0,0,0.12)',
    headerBackground: 'var(--theme-banner-background-color)',

    // Banner
    bannerPaddingX: 120,

    // Typography — H1
    h1Size: 'var(--ds-font-size-5xl)',
    h1Weight: '600',
    h1LetterSpacing: '-0.03em',
    h1LineHeight: '1.1',
    h1PaddingBottom: '18px',

    // Typography — H2
    h2Size: 'var(--ds-font-size-4xl)',
    h2Weight: '600',
    h2LetterSpacing: '-0.01em',

    // Typography — H3
    h3Size: 'var(--ds-font-size-xl)',
    h3Weight: '600',

    // Typography — Body
    pSize: 'var(--ds-font-size-md)',

    // Canvas
    portalCanvasBackground: 'var(--theme-banner-background-color)',

    // Cards
    cardBorder: 'none',
    cardBackground: '#FFFFFF',
    cardBackgroundHover: 'var(--ds-color-neutral-25)',
    cardBorderHover: null,

    // Card icons
    iconSize: 56,
    cardIconColor: 'var(--theme-primary-color)',
    cardIconBackground: 'none',

    // Article — layout
    sidebarPadding: '16px 0',
    contentPadding: '36px 48px',
    tocPadding: '42px 20px 42px 12px',
    tocBoxBorder: 'none',
    tocBoxPadding: '0',

    // Article — sidebar
    sidebarSelectedBackground: 'var(--ds-background-neutral-subtle-hovered)',

    // Article — TOC
    tocItemHoverColor: 'var(--theme-primary-color)',
    tocSelectedColor: 'var(--theme-primary-color)',

    // Footer
    footerPadding: '20px 20px',

    // Search
    searchButtonBrand: true,
  },
};
