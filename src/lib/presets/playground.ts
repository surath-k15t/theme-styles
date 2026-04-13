import type { PresetConfig } from './types';
import { baseStyles } from './baseStyles';

export const playgroundPreset: PresetConfig = {
  id: 'playground',
  name: 'Playground',
  subtitle: 'The Experiment',
  description: 'Standalone theme lab: base layout, live color engine, and neutral text tokens. This app ships only this preset.',
  tags: ['Playground', 'Color engine', 'Neutral text', 'Base styles'],
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
  cardLayout: 'list-3col',
  bannerStyle: 'colored',
  /* Typography & layout only — chromatic: --ds-color-brand-* (color engine) + neutral scale via --gray-* from neutral-ramp. */
  cssVars: {
    '--theme-text-font':     "'Inter', ui-sans-serif, sans-serif",
    '--theme-headline-font': "'Inter', ui-sans-serif, sans-serif",
    '--theme-headline-scale': '1',
    '--theme-content-width':       '860px',
    '--theme-content-line-height': 'var(--ds-line-height-large)',
    '--theme-content-spacing':     '1rem',
  },
  darkCssVars: {},
  styles: {
    ...baseStyles,
    roundness: 3.5,
    searchButtonBrand: true,
  },
};
