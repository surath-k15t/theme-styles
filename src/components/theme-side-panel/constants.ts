import type { ThemeRadiusTier } from '@/lib/ThemeContext';
import type { CardLayout, SpacingScheme } from '@/lib/presets/spacingSchemes';

/** CMS-style settings shell (reference: admin sidebar + white main). */
export const CMS = {
  sidebarBg: '#F4F5F7',
  sidebarBorder: '#DFE1E6',
  pageBg: '#FFFFFF',
  text: '#172B4D',
  textMuted: '#5E6C84',
  border: '#DFE1E6',
  primary: '#0C66E4',
  inputBg: '#F1F2F4',
  activeItemBg: '#FFFFFF',
} as const;

export const PANEL_SHELL_WIDTH = 560;
export const SIDEBAR_WIDTH = 64;
/** Inset from viewport so the shell reads as a floating island, not edge-to-edge. */
export const PANEL_ISLAND_INSET = 20;
/** Matches vpt3 `config-category` / `k15t-form` stack spacing between fields (`1rem`). */
export const SECTION_GAP = 16;

export const PLAYGROUND_HEX_KEY = 'color-engine:hex';
export const PLAYGROUND_INPUT_KEY = 'color-engine:input';
export const PLAYGROUND_IS_DARK_KEY = 'color-engine:isDark';
export const PANEL_POSITION_KEY = 'playground:panelPosition';

export const RADIUS_TIERS: ThemeRadiusTier[] = ['none', 'small', 'medium', 'large', 'full'];
export const RADIUS_LABELS: Record<ThemeRadiusTier, string> = {
  none: 'None',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  full: 'Full',
};

export const SPACING_OPTIONS: SpacingScheme[] = ['compact', 'standard', 'spacious'];
export const SPACING_LABELS: Record<SpacingScheme, string> = {
  compact: 'Compact',
  standard: 'Standard',
  spacious: 'Spacious',
};

export const CARD_LAYOUT_OPTIONS: CardLayout[] = [
  'list-1col',
  'list-2col',
  'list-3col',
  'grid-2col',
  'grid-3col',
];

/** Short labels for the card layout dropdown. */
export const CARD_LAYOUT_LABELS: Record<CardLayout, string> = {
  'list-1col': 'Horizontal - 1 column',
  'list-2col': 'Horizontal - 2 columns',
  'list-3col': 'Horizontal - 3 columns',
  'grid-2col': 'Vertical - 2 columns',
  'grid-3col': 'Vertical - 3 columns',
};
