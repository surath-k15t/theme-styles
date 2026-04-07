import type { PresetConfig } from './types';
import { baseStyles } from './baseStyles';

export const vectorPreset: PresetConfig = {
  id: 'vector',
  name: 'Vector',
  subtitle: 'The Technical',
  description: 'Engineered for precision and high information density. Designed for technical entities to navigate complex documentation with ease.',
  tags: ['Monospace accents', 'High density', 'Strict geometry', 'Utility-first', 'Standard layout'],
  swatchColor: '#FFFFFF',
  swatchBorder: true,
  brandName: 'Archway Systems',
  brandSubtitle: 'Archway Systems Documentations',
  logoType: 'material',
  logoIcon: 'change_history',
  apps: [
    { name: 'Archway Systems CLI', icon: 'terminal', iconType: 'material', description: 'Command-line interface for managing deployments and resources.' },
    { name: 'Archway Systems API Reference', icon: 'api', iconType: 'material', description: 'Complete REST and GraphQL endpoints' },
    { name: 'Archway Systems SDK', icon: 'code_blocks', iconType: 'material', description: 'Official client libraries.' },
    { name: 'Archway Systems Pipelines', icon: 'mediation', iconType: 'material', description: 'Define, schedule, and monitor data transformation pipelines.' },
    { name: 'Archway Systems Observe', icon: 'visibility', iconType: 'material', description: 'Distributed tracing, structured logging, and alerting in one unified observability surface.' },
    { name: 'Archway Systems Auth', icon: 'key', iconType: 'material', description: 'SSO, RBAC, and token management.' },
    { name: 'Archway Systems Gateway', icon: 'router', iconType: 'material', description: 'Managed API gateways.' },
    { name: 'Archway Systems Docs', icon: 'menu_book', iconType: 'material', description: 'The full Archway Systems knowledge base.' },
  ],
  cardLayout: 'grid-3col',
  cardsSectionHeading: "",
  bannerStyle: 'none',
  cssVars: {
    '--theme-text-font': "'IBM Plex Sans', ui-sans-serif, sans-serif",
    '--theme-headline-font': '"JetBrains Mono", "SF Mono", monospace',
    '--ds-font-weight-medium': '600',
    '--theme-text-color': 'var(--ds-color-grey-800)',
    '--theme-headline-color': 'var(--ds-color-grey-1000)',
    '--theme-primary-color': 'var(--ds-color-grey-900)',
    '--theme-on-primary-color': 'var(--ds-color-neutral-0)',
    '--theme-headline-scale': '0.95',
    '--theme-header-background-color': 'var(--ds-color-neutral-0)',
    '--theme-header-text-color': 'var(--ds-color-grey-1000)',
    '--theme-banner-background-color': 'var(--ds-color-neutral-25)',
    '--theme-banner-text-color': 'var(--ds-color-neutral-1000)',
    '--theme-footer-background-color': 'var(--ds-color-neutral-25)',
    '--theme-footer-text-color': 'var(--ds-color-neutral-400)',
    '--theme-content-width': '860px',
    '--theme-content-line-height': 'var(--ds-line-height-x-large)',
    '--theme-content-spacing': '1.5rem',
    '--ds-icon-information': 'var(--ds-color-teal-600)',
    '--ds-background-information': 'var(--ds-color-teal-100)',
  },
  darkCssVars: {
    '--ds-color-neutral-0': '#000000',
    '--ds-color-neutral-25': '#0a0a0a',
    '--ds-color-neutral-50': '#141414',
    '--ds-color-neutral-75': '#1e1e1e',
    '--ds-color-neutral-100': '#2e2e2e',
    '--ds-color-neutral-200': '#5a5a5a',
    '--ds-color-neutral-300': '#8a8a8a',
    '--ds-color-neutral-400': '#b0b0b0',
    '--ds-color-neutral-500': '#d0d0d0',
    '--ds-color-neutral-900': '#f0f0f0',
    '--ds-color-neutral-1000': '#FFFFFF',
    '--theme-header-background-color': '#000000',
    '--theme-header-text-color': '#d0d0d0',
    '--theme-banner-background-color': '#0a0a0a',
    '--theme-banner-text-color': '#d0d0d0',
    '--theme-footer-background-color': '#0a0a0a',
    '--theme-footer-text-color': '#8a8a8a',
    '--theme-primary-color': '#3DBAD9',
    '--theme-text-color': '#b0b0b0',
    '--theme-headline-color': '#d0d0d0',
    '--ds-color-teal-100': '#0a1a1e',
    '--ds-color-teal-600': '#3DBAD9',
    '--ds-icon-information': '#3DBAD9',
    '--ds-background-information': '#0a1a1e',
  },
  styles: {
    ...baseStyles,

    // Layout
    roundness: 0,
    spacingScheme: 'compact',

    // Header
    headerHeight: 54,
    headerPadding: '0 32px',
    headerBorderBottom: '1px solid var(--ds-border-neutral-strong)',
    headerPickerBorder: '1px solid transparent',

    // Banner
    bannerPaddingX: 64,
    bannerBackground: 'var(--theme-header-background-color)',

    // Typography — H1
    h1Size: 'var(--ds-font-size-2xl)',

    // Cards
    cardBackground: 'var(--ds-background-neutral-subtle)',
    cardBackgroundHover: 'var(--ds-background-neutral-subtle-hovered)',

    // Card icons
    iconSize: 48,

    // Article — layout
    sidebarPadding: '28px 0',
    contentPadding: '40px 56px',
    tocPadding: '40px 24px 40px 16px',
    tocBoxBorder: 'none',
    tocBoxPadding: '0',

    // Footer
    footerPadding: '28px 32px',

    // Search
    searchButtonBrand: true,
  },
};
