/* ─────────────────────────────────────────────────────────
   Portal spacing schemes
   ─────────────────────────────────────────────────────────
   Three density levels: compact · standard · spacious.
   Presets pick a scheme; cardsSectionPaddingSides stays as a
   per-preset override for the few design-specific cases
   (e.g. Lucid's full-bleed section).
   ───────────────────────────────────────────────────────── */

export type SpacingScheme = 'compact' | 'standard' | 'spacious';
export type CardLayout = 'grid-3col' | 'grid-2col' | 'list-1col' | 'list-2col' | 'list-3col';

export interface SpacingSchemeValues {
  /** Vertical padding (top & bottom) of the cards section wrapper */
  sectionPaddingV: number;
  /** Internal padding per card layout type (CSS shorthand) */
  cardPadding: Record<CardLayout, string>;
  /** Default gap (px) between icon and text in list-style cards */
  cardIconTextGap: number;
  /** Bottom margin below the section heading */
  cardsHeadingMarginBottom: number;
  /** Gap between cards in px — varies by layout type */
  cardsGap: Record<CardLayout, number>;
  /** Line height for card titles (h3) — maps to --ds-line-height-* token */
  cardTitleLineHeight: string;
  /** Line height for card body / description text — maps to --ds-line-height-* token */
  cardBodyLineHeight: string;
}

export const spacingSchemes: Record<SpacingScheme, SpacingSchemeValues> = {
  compact: {
    sectionPaddingV:          24,
    cardPadding: {
      'grid-3col': '32px 24px',
      'grid-2col': '32px 24px',
      'list-1col': '12px 16px',
      'list-2col': '16px 16px',
      'list-3col': '16px 16px',
    },
    cardIconTextGap:          12,
    cardsHeadingMarginBottom: 24,
    cardsGap: {
      'grid-3col': 0,
      'grid-2col': 0,
      'list-1col': 0,
      'list-2col': 0,
      'list-3col': 0,
    },
    cardTitleLineHeight:      'var(--ds-line-height-x-small)',
    cardBodyLineHeight:       'var(--ds-line-height-small)',
  },
  standard: {
    sectionPaddingV:          48,
    cardPadding: {
      'grid-3col': '32px 24px',
      'grid-2col': '24px 24px',
      'list-1col': '18px 18px',
      'list-2col': '16px 16px',
      'list-3col': '16px 16px',
    },
    cardIconTextGap:          16,
    cardsHeadingMarginBottom: 32,
    cardsGap: {
      'grid-3col': 24,
      'grid-2col': 24,
      'list-1col': 18,
      'list-2col': 18,
      'list-3col': 18,
    },
    cardTitleLineHeight:      'var(--ds-line-height-small)',
    cardBodyLineHeight:       'var(--ds-line-height-medium)',
  },
  spacious: {
    sectionPaddingV:          108,
    cardPadding: {
      'grid-3col': '38px 32px',
      'grid-2col': '32px 32px',
      'list-1col': '0px 24px 0px 0px',
      'list-2col': '0px 32px 0px 0px',
      'list-3col': '0px 24px 0px 0px',
    },
    cardIconTextGap:          24,
    cardsHeadingMarginBottom: 32,
    cardsGap: {
      'grid-3col': 32,
      'grid-2col': 32,
      'list-1col': 32,
      'list-2col': 32,
      'list-3col': 32,
    },
    cardTitleLineHeight:      'var(--ds-line-height-medium)',
    cardBodyLineHeight:       'var(--ds-line-height-medium)',
  },
};
