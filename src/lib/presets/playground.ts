import type { PresetConfig } from './types';
import { baseStyles } from './baseStyles';

export const playgroundPreset: PresetConfig = {
  id: 'playground',
  name: 'Playground',
  subtitle: 'The Experiment',
  description: 'A clean canvas built on pure base styles. No preset-specific overrides — the perfect starting point for testing spacing schemes, layouts, and component behaviour.',
  tags: ['Base styles', 'Teal brand', 'Clean canvas', 'Experimental', 'Standard layout'],
  swatchColor: '#157F78',
  brandName: 'Playground',
  brandSubtitle: 'Playground Docs',
  logoType: 'emoji',
  logoIcon: '🧪',
  apps: [
    { name: 'Getting Started',  icon: 'rocket_launch',     iconType: 'material', description: 'Quick-start guide covering installation, configuration, and your first integration.' },
    { name: 'API Reference',    icon: 'api',               iconType: 'material', description: 'Full endpoint documentation with request shapes, response schemas, and code examples.' },
    { name: 'Components',       icon: 'widgets',           iconType: 'material', description: 'Interactive component library with live previews, props tables, and usage guidelines.' },
    { name: 'Theming',          icon: 'palette',           iconType: 'material', description: 'Customise colours, typography, and spacing using design tokens and CSS variables.' },
    { name: 'Accessibility',    icon: 'accessibility_new', iconType: 'material', description: 'WCAG guidelines and best practices for building inclusive, keyboard-navigable interfaces.' },
    { name: 'Changelog',        icon: 'history',           iconType: 'material', description: 'A full record of releases, deprecations, fixes, and breaking changes across every version.' },
  ],
  cardLayout: 'grid-3col',
  bannerStyle: 'colored',
  cssVars: {
    '--theme-text-font':     "'Inter', ui-sans-serif, sans-serif",
    '--theme-headline-font': "'Inter', ui-sans-serif, sans-serif",

    // Brand — #157F78 sits between Radix teal-10 (#0d9b8a) and teal-11 (#008573); WCAG AA on white ~4.9:1
    '--theme-primary-color':    '#157F78',
    '--theme-on-primary-color': '#ffffff',

    '--theme-headline-scale': '1',

    // Header / banner / footer — Radix teal-12 (exact)
    '--theme-header-background-color': '#0d3d38',
    '--theme-header-text-color':       '#e0f8f3', // teal-3
    '--theme-banner-background-color': '#0d3d38',
    '--theme-banner-text-color':       '#e0f8f3', // teal-3
    '--theme-footer-background-color': '#0d3d38',
    '--theme-footer-text-color':       '#83cdc1', // teal-7

    '--theme-content-width':       '860px',
    '--theme-content-line-height': 'var(--ds-line-height-large)',
    '--theme-content-spacing':     '1rem',

    // Radix teal scale (exact values from @radix-ui/colors)
    '--ds-color-brand-50': '#f3fbf9', // teal-2 — very light hover / icon bg
    '--ds-color-brand-75': '#e0f8f3', // teal-3 — selected states

    '--ds-border-neutral-hovered':        '#157F78',
    '--ds-border-neutral-strong-hovered': '#157F78',
    '--ds-icon-information':              '#157F78',
    '--ds-background-information':        '#f3fbf9', // teal-2
    '--ds-link':                          '#157F78',
  },
  darkCssVars: {
    // Teal-tinted neutral surface ramp (dark)
    '--ds-color-neutral-0':    '#0d1514', // dark teal-1
    '--ds-color-neutral-25':   '#111c1b', // dark teal-2
    '--ds-color-neutral-50':   '#0d2d2a', // dark teal-3
    '--ds-color-neutral-75':   '#023b37', // dark teal-4
    '--ds-color-neutral-100':  '#084843', // dark teal-5
    '--ds-color-neutral-200':  '#1c6961', // dark teal-7
    '--ds-color-neutral-300':  '#207e73', // dark teal-8
    '--ds-color-neutral-400':  '#0eb39e', // dark teal-10
    '--ds-color-neutral-500':  '#0bd8b6', // dark teal-11
    '--ds-color-neutral-900':  '#adf0dd', // dark teal-12
    '--ds-color-neutral-1000': '#ffffff',

    '--theme-primary-color':    '#0eb39e', // dark teal-10 — sufficient contrast on dark surfaces
    '--theme-on-primary-color': '#ffffff',

    // Darker than dark teal-1 — intentionally deep for the chrome
    '--theme-header-background-color': '#071412',
    '--theme-header-text-color':       '#0bd8b6', // dark teal-11
    '--theme-banner-background-color': '#071412',
    '--theme-banner-text-color':       '#0bd8b6', // dark teal-11
    '--theme-footer-background-color': '#071412',
    '--theme-footer-text-color':       '#1c6961', // dark teal-7

    '--ds-color-brand-50':                '#111c1b', // dark teal-2
    '--ds-color-brand-75':                '#0d2d2a', // dark teal-3
    '--ds-border-neutral-hovered':        '#0eb39e', // dark teal-10
    '--ds-border-neutral-strong-hovered': '#0eb39e', // dark teal-10
    '--ds-icon-information':              '#0eb39e', // dark teal-10
    '--ds-background-information':        '#111c1b', // dark teal-2
    '--ds-link':                          '#0eb39e', // dark teal-10
  },
  styles: {
    ...baseStyles,
    roundness: 1.5,
  },
};
