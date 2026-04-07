import type { PresetConfig } from './types';
import { baseStyles } from './baseStyles';

export const ignitePreset: PresetConfig = {
  id: 'ignite',
  name: 'Ignite',
  subtitle: 'The Cinematic',
  description: 'Bold and immersive. Uses deep tones and blurs to turn a help center into a powerful, cinematic extension of a brand\'s identity.',
  tags: ['Sans-serif', 'Dark theme', 'Glassmorphism', 'Immersive imagery', 'Spacious layout'],
  swatchColor: '#f5ab18',
  brandName: 'Aether Gaming',
  brandSubtitle: 'Aether - documentation',
  logoType: 'emoji',
  logoIcon: '🚀',
  apps: [
    {
      name: 'Aether Gaming Save the World Goes Free-to-Play April 16',
      icon: '/bold/analytics.png',
      iconType: 'image',
      description: 'Save the World is now available to all players at no cost starting April 16. Complete new daily missions to earn exclusive limited-time cosmetics.',
    },
    {
      name: 'Aether Gaming v29.40 – Advanced Building Physics',
      icon: '/bold/1.png',
      iconType: 'image',
      description: 'Structural integrity simulation now applies to all player-built structures in Creative and competitive modes. Buildings respond dynamically to environmental forces.',
    },
    {
      name: 'Launchpad Analytics — Real-Time Dashboard v2',
      icon: '/bold/2.png',
      iconType: 'image',
      description: 'Redesigned event pipeline now surfaces session metrics with sub-second latency. Funnel breakdowns and cohort views have been unified into a single workspace.',
    },
    {
      name: 'Launchpad Connect — OAuth 2.1 & Webhook Retry',
      icon: '/bold/connect.png',
      iconType: 'image',
      description: 'All third-party integrations now support OAuth 2.1 PKCE flows. Failed webhook deliveries automatically retry with configurable exponential back-off.',
    },
    {
      name: 'Launchpad Flows — Conditional Branching Engine',
      icon: '/bold/3.png',
      iconType: 'image',
      description: 'Multi-path branching logic is now available in all automation workflows. Set conditions based on user attributes, event properties, or external API responses.',
    },
    {
      name: 'Launchpad Signals — Predictive Churn Scoring',
      icon: '/bold/4.png',
      iconType: 'image',
      description: 'ML-powered churn risk scores are now computed daily for every active account segment. Trigger automated re-engagement campaigns directly from the Signals dashboard.',
    },
    {
      name: 'Launchpad Vault — Field-Level Encryption GA',
      icon: '/bold/2.png',
      iconType: 'image',
      description: 'Per-field AES-256 encryption is now generally available for all stored PII and payment data. Key rotation policies can be configured without service interruption.',
    },
    {
      name: 'Launchpad Scheduler — Distributed Cron v3',
      icon: '/bold/1.png',
      iconType: 'image',
      description: 'Job scheduling now supports multi-region failover and timezone-aware execution windows. Monitor run history and set alerting thresholds from a single control pane.',
    },
  ],
  cardLayout: 'list-1col',
  cardsSectionHeading: "🔥 What's New?",
  bannerStyle: 'image',
  bannerImage: '/bold/bannerImageForBold.png',
  cssVars: {
    '--theme-text-font': "'Montserrat', ui-sans-serif, sans-serif",
    '--theme-headline-font': "'Anton SC', ui-sans-serif, sans-serif",
    '--theme-headline-color': '#FFFFFF',
    '--theme-primary-color': '#F5C518',
    '--theme-on-primary-color': '#000000',
    '--theme-headline-scale': '1.15',
    '--theme-header-background-color': '#000000',
    '--theme-header-text-color': '#FFFFFF',
    '--theme-banner-background-color': '#0a0a0a',
    '--theme-banner-text-color': '#FFFFFF',
    '--theme-footer-background-color': '#000000',
    '--theme-footer-text-color': '#AAAAAA',
    '--theme-content-width': '900px',
    '--theme-content-line-height': 'var(--ds-line-height-large)',
    '--theme-content-spacing': '1rem',

    // Dark neutral scale
    '--ds-color-neutral-0':    '#0a0a0a',
    '--ds-color-neutral-25':   '#111111',
    '--ds-color-neutral-50':   '#1a1a1a',
    '--ds-color-neutral-75':   '#222222',
    '--ds-color-neutral-100':  '#2d2d2d',
    '--ds-color-neutral-200':  '#3d3d3d',
    '--ds-color-neutral-300':  '#555555',
    '--ds-color-neutral-400':  '#777777',
    '--ds-color-neutral-500':  '#999999',
    '--ds-color-neutral-700':  '#bbbbbb',
    '--ds-color-neutral-800':  '#cccccc',
    '--ds-color-neutral-900':  '#e0e0e0',
    '--ds-color-neutral-1000': '#FFFFFF',

    // Yellow brand tints
    '--ds-color-brand-25':  '#1a1400',
    '--ds-color-brand-50':  '#2a2100',
    '--ds-color-brand-75':  '#3d3100',
    '--ds-color-brand-100': '#554400',
    '--ds-color-brand-200': '#8a7000',
    '--ds-icon-information':    '#F5C518',
    '--ds-background-information': '#2a2100',
    '--ds-link': '#F5C518',
  },
  // Theme is dark by default — darkCssVars only deepens a few surfaces
  darkCssVars: {
    '--ds-color-neutral-0':  '#000000',
    '--ds-color-neutral-25': '#0a0a0a',
    '--ds-color-neutral-50': '#111111',
    '--theme-footer-background-color': '#000000',
  },
  styles: {
    ...baseStyles,

    // Layout
    roundness: 2.5,
    spacingScheme: 'spacious',

    // Header — frosted glass, slides behind banner image
    bannerOverlapHeader: true,
    headerBackground: 'rgba(0, 0, 0, 0.43)',
    headerBackdropFilter: 'blur(30px)',

    // Banner
    bannerPaddingX: 220,
    bannerImageSide: 'full', // can be a default setting

    // Typography — H1
    h1Size: 'var(--ds-font-size-6xl)',
    h1LetterSpacing: '0.05em', //optional?
    h1PaddingBottom: '18px',

    // Typography — H2
    h2Size: 'var(--ds-font-size-3xl)',
    h2LetterSpacing: '0.02em', //optional?

    // Typography — H3
    h3Size: 'var(--ds-font-size-sm)',
    h3FontFamily: "'Montserrat', ui-sans-serif, sans-serif",
    h3Weight: '800',

    // Typography — Body
    pSize: 'var(--ds-font-size-sm)',
    pWeight: '300',
    pColor: '#ffffff97', //color palette

    // Cards (color pallete)
    cardBorder: '1px solid var(--ds-color-neutral-100)',
    cardBackground: 'var(--ds-color-neutral-50)',
    cardBackgroundHover: 'var(--ds-color-neutral-75)',
    cardBorderHover: 'var(--ds-color-neutral-300)',

    // Card icons
    iconSize: 110,

    // Article — TOC
    tocItemHoverColor: 'var(--theme-primary-color)',
    tocSelectedColor: 'var(--theme-primary-color)',

    // Search
    searchButtonBrand: true,
    searchBackdropFilter: 'blur(10px)',
    searchGlassBackground: 'rgba(152, 152, 152, 0.3)',
    searchBorder: '1px solid rgba(197, 197, 197, 0.3)',
    searchForegroundColor: '#FFFFFF',
    searchButtonTextColor: '#FFFFFF',
    searchButtonFontWeight: 600,
  },
};
