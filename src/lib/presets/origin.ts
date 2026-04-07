import type { PresetConfig } from './types';
import { baseStyles } from './baseStyles';

export const originPreset: PresetConfig = {
  id: 'origin',
  name: 'Origin',
  subtitle: 'The Standard',
  description: 'The balanced, neutral default look. A familiar starting point that works across industries — professional without being opinionated.',
  tags: ['Sans-serif', 'Neutral palette', 'Medium roundness', 'Standard spacing', 'Standard layout'],
  swatchColor: '#0d284f',
  brandName: 'Good Software',
  brandSubtitle: 'Good Software Help',
  logoType: 'material',
  logoIcon: 'diamond',
  apps: [
    { name: 'CleverApp', icon: 'origin/1.png', iconType: 'image', description: 'Track performance metrics and visualize key business data through customizable dashboards.' },
    { name: 'SmartApp Documentation', icon: 'origin/2.png', iconType: 'image', description: 'Full product reference covering setup, configuration, and advanced usage patterns for SmartApp.' },
    { name: 'WiseApp User Documentation', icon: 'origin/3.png', iconType: 'image', description: 'End-user guides, onboarding walkthroughs, and tips for getting the most out of WiseApp as a team.' },
    { name: 'FlowBoard', icon: 'origin/4.png', iconType: 'image', description: 'Visual workflow builder for mapping, automating, and monitoring multi-step business processes.' },
    { name: 'DataSync', icon: 'origin/5.png', iconType: 'image', description: 'Keep data consistent across services with real-time bidirectional sync and conflict resolution.' },
    { name: 'SecureVault', icon: 'origin/6.png', iconType: 'image', description: 'Encrypted credential storage with role-based access, audit trails, and automated key rotation.' },
    { name: 'NovaDeploy', icon: 'origin/7.png', iconType: 'image', description: 'CI/CD pipeline management with one-click rollbacks, environment promotion, and deployment health checks.' },
    { name: 'InsightHub', icon: 'origin/8.png', iconType: 'image', description: 'Central analytics workspace that aggregates signals from across your stack into a single pane of glass.' },
  ],
  cardLayout: 'grid-3col',
  bannerStyle: 'image',
  bannerImage: 'origin/banner.svg',
  cssVars: {
    '--theme-text-font': "'Inter', ui-sans-serif, sans-serif",
    '--theme-headline-font': "'Inter', ui-sans-serif, sans-serif",
    '--theme-primary-color': 'var(--ds-color-blue-600)',
    '--theme-on-primary-color': 'var(--ds-color-neutral-0)',
    '--theme-headline-scale': '1',
    '--theme-header-background-color': '#0d284f',
    '--theme-footer-background-color': '#385071',
    '--theme-content-width': '860px',
    '--theme-content-line-height': 'var(--ds-line-height-large)',
    '--theme-content-spacing': '1rem',
  },
  darkCssVars: {
    '--ds-color-neutral-0': '#0B1929',
    '--ds-color-neutral-25': '#0F2137',
    '--ds-color-neutral-50': '#152A42',
    '--ds-color-neutral-75': '#1E3654',
    '--ds-color-neutral-100': '#2A4A6B',
    '--ds-color-neutral-200': '#4A6F94',
    '--ds-color-neutral-300': '#7B9CBD',
    '--ds-color-neutral-400': '#A3BFDB',
    '--ds-color-neutral-500': '#C5D8EA',
    '--ds-color-neutral-900': '#E8F0F8',
    '--ds-color-neutral-1000': '#FFFFFF',
    '--theme-header-background-color': '#0d284f',
    '--theme-header-text-color': '#E8F0F8',
    '--theme-banner-text-color': '#E8F0F8',
    '--theme-footer-background-color': '#0A1A2E',
    '--theme-footer-text-color': '#7B9CBD',
    '--theme-primary-color': '#5A9AF5',
    '--ds-color-blue-100': '#0F2137',
    '--ds-color-blue-600': '#5A9AF5',
    '--ds-background-information': '#0F2137',
  },
  styles: {
    ...baseStyles,

    // Layout
    roundness: 1.5,
    spacingScheme: 'standard',

    // Banner
    bannerPaddingX: 128,
    bannerImageSide: 'full',

    // Typography — H1
    h1Size: 'var(--ds-font-size-4xl)',
    h1LineHeight: 'var(--ds-line-height-x-large)',

    // Card icons
    iconSize: 84,
    cardIconBackground: 'none',
  },
};
