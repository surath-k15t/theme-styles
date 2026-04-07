import type { PresetConfig } from './types';
import { baseStyles } from './baseStyles';

export const auroraPreset: PresetConfig = {
  id: 'aurora',
  name: 'Aurora',
  subtitle: 'The Atmosphere',
  description: 'Warmth through soft, shifting gradients. A modern, approachable aesthetic that uses subtle color transitions to create a welcoming atmosphere.',
  tags: ['Soft sans', 'Pastel gradients', 'High roundness', 'Brand warmth', 'Standard layout'],
  swatchColor: '#CDDCFD',
  brandName: 'Aura Wellness',
  brandSubtitle: 'Aura Help Center',
  logoType: 'emoji',
  logoIcon: '✦',
  apps: [
    { name: 'Aura Wellness Studio', icon: 'auto_awesome', iconType: 'material' },
    { name: 'Aura Wellness Insights', icon: 'insights', iconType: 'material' },
    { name: 'Aura Wellness Connect', icon: 'hub', iconType: 'material' },
    { name: 'Aura Wellness Flows', icon: 'account_tree', iconType: 'material' },
    { name: 'Aura Wellness Signals', icon: 'graphic_eq', iconType: 'material' },
    { name: 'Aura Wellness Vault', icon: 'lock', iconType: 'material' },
    { name: 'Aura Wellness Scheduler', icon: 'calendar_today', iconType: 'material' },
    { name: 'Aura Wellness Pulse', icon: 'monitor_heart', iconType: 'material' },
  ],
  cardLayout: 'list-3col',
  bannerStyle: 'gradient',
  cssVars: {
    // User-editable gradient colors
    '--aurora-color-start': '#ACEBED',
    '--aurora-color-mid': '#CDDCFD',
    '--aurora-color-end': '#D4A6FF',

    '--theme-text-font': "'Montserrat', ui-sans-serif, sans-serif",
    '--theme-headline-font': "'Montserrat', ui-sans-serif, sans-serif",
    '--theme-text-color': '#2d2d4e',
    '--theme-headline-color': '#3a3570',
    '--theme-primary-color': '#7B61FF',
    '--theme-on-primary-color': '#FFFFFF',
    '--theme-headline-scale': '1.05',

    '--theme-header-background-color': 'rgba(255,255,255,0.72)',
    '--theme-header-text-color': '#2d2d4e',
    '--theme-banner-background-color': '#F0EDFF',
    '--theme-banner-text-color': '#2d2d4e',
    '--theme-footer-background-color': '#F5F3FF',
    '--theme-footer-text-color': '#5c3fec',

    '--theme-content-width': '880px',
    '--theme-content-line-height': 'var(--ds-line-height-large)',
    '--theme-content-spacing': '1.1rem',

    // Neutral scale — very light purple tints
    '--ds-color-neutral-25': '#FAFAFF',
    '--ds-color-neutral-50': '#F3F2FF',
    '--ds-color-neutral-75': '#ECEAFF',
    '--ds-color-neutral-100': '#DDD9FF',
    '--ds-color-neutral-200': '#B8B0F0',
    '--ds-color-neutral-300': '#9490D0',
    '--ds-color-neutral-400': '#6D6AA0',
    '--ds-color-neutral-500': '#4a4780',

    // Brand colors derived from the aurora gradient
    '--ds-color-brand-25': '#FAFAFF',
    '--ds-color-brand-50': '#F0EDFF',
    '--ds-color-brand-75': '#E6E0FF',
    '--ds-color-brand-100': '#D4CAFF',
    '--ds-color-brand-200': '#B8ADFF',

    '--ds-icon-information': '#7B61FF',
    '--ds-background-information': '#F0EDFF',
    '--ds-link': '#7B61FF',
    '--ds-font-weight-medium': '600',
  },
  darkCssVars: {
    '--ds-color-neutral-0': '#0f0e1a',
    '--ds-color-neutral-25': '#16152a',
    '--ds-color-neutral-50': '#1e1c38',
    '--ds-color-neutral-75': '#272545',
    '--ds-color-neutral-100': '#342f5c',
    '--ds-color-neutral-200': '#4e4880',
    '--ds-color-neutral-300': '#7570a8',
    '--ds-color-neutral-400': '#a09ac8',
    '--ds-color-neutral-500': '#cac5e8',
    '--ds-color-neutral-900': '#eeeaff',
    '--ds-color-neutral-1000': '#FFFFFF',

    '--theme-header-background-color': 'rgba(22,21,42,0.80)',
    '--theme-header-text-color': '#eeeaff',
    '--theme-banner-background-color': '#0f0e1a',
    '--theme-banner-text-color': '#eeeaff',
    '--theme-footer-background-color': '#16152a',
    '--theme-footer-text-color': '#a09ac8',
    '--theme-text-color': '#eeeaff',
    '--theme-headline-color': '#cac5e8',
    '--theme-primary-color': '#a594ff',
    '--theme-on-primary-color': '#0f0e1a',

    '--aurora-color-start': '#6ee7e7',
    '--aurora-color-mid': '#8db4f8',
    '--aurora-color-end': '#c084fc',

    '--ds-color-brand-50': '#1e1c38',
    '--ds-color-brand-75': '#272545',
    '--ds-color-brand-100': '#342f5c',
    '--ds-color-brand-200': '#4e4880',
    '--ds-icon-information': '#a594ff',
    '--ds-background-information': '#1e1c38',
    '--ds-link': '#a594ff',
  },
  styles: {
    ...baseStyles,

    // Layout
    roundness: 3.5,
    spacingScheme: 'standard',

    // Header — frosted glass with purple tint
    headerHeight: 60,
    headerPadding: '0 24px',
    headerBorderBottom: '1px solid rgba(123,97,255,0.15)',
    headerPickerBorder: '1px solid rgba(123,97,255,0.22)',
    headerBackground: 'var(--theme-header-background-color)',
    headerBackdropFilter: 'blur(16px) saturate(180%)',

    // Banner
    bannerPaddingX: 72,

    // Typography — H1
    h1Size: 'var(--ds-font-size-2xl)',
    h1Weight: '600',
    h1LineHeight: '1.15',
    h1PaddingBottom: '12px',

    // Typography — H2
    h2Size: 'var(--ds-font-size-xl)',
    h2Weight: '600',
    h2LetterSpacing: '-0.01em',

    // Typography — H3
    h3Size: 'var(--ds-font-size-md)',
    h3Weight: '600',

    // Typography — Body
    pSize: 'var(--ds-font-size-sm)',
    pWeight: '300',

    // Canvas
    portalCanvasBackground: '#FFFFFF',

    // Cards — frosted glass, border deepens on hover
    cardBorder: '1px solid rgba(123,97,255,0.14)',
    cardBackground: 'rgba(255,255,255,0.62)',
    cardBackgroundHover: 'rgba(250,247,255,0.72)',
    cardBorderHover: 'rgba(123, 97, 255, 0.36)',
    cardBackdropFilter: 'blur(14px) saturate(160%)',

    // Card icons — brand color, light tinted container
    iconSize: 48,
    cardIconColor: 'var(--theme-primary-color)',
    cardIconBackground: 'rgba(123,97,255,0.08)',

    // Article — TOC
    tocItemHoverColor: 'var(--theme-primary-color)',
    tocSelectedColor: 'var(--theme-primary-color)',

    // Search
    searchButtonBrand: true,
  },
};
