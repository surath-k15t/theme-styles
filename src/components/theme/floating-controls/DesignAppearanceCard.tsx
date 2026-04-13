import React from 'react';
import { THEME_RADIUS_TIER_VALUES } from '@/lib/ThemeContext';
import type { ThemeRadiusTier } from '@/lib/ThemeContext';
import type { PanelBackgroundMode } from '@/lib/panelSurfaceGlass';
import type { SpacingScheme } from '@/lib/presets/spacingSchemes';
import {
  CMS,
  RADIUS_LABELS,
  RADIUS_TIERS,
  SPACING_LABELS,
  SPACING_OPTIONS,
} from './constants';
import { CmsFieldLabel } from './cms-ui';

export interface DesignAppearanceCardProps {
  themeRadiusTier: ThemeRadiusTier;
  setThemeRadiusTier: (v: ThemeRadiusTier) => void;
  spacingScheme: SpacingScheme;
  setSpacingScheme: (v: SpacingScheme) => void;
  panelBackgroundMode: PanelBackgroundMode;
  setPanelBackgroundMode: (v: PanelBackgroundMode) => void;
}

/** Design tab — Appearance: corner radius + site spacing. */
export const DesignAppearanceCard: React.FC<DesignAppearanceCardProps> = ({
  themeRadiusTier,
  setThemeRadiusTier,
  spacingScheme,
  setSpacingScheme,
  panelBackgroundMode,
  setPanelBackgroundMode,
}) => (
  <>
    <div style={{ marginBottom: 24 }}>
      <CmsFieldLabel title="Corner radius" hint="Multiplier for card and UI radii across the preview." />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {RADIUS_TIERS.map(tier => {
          const selected = themeRadiusTier === tier;
          const r = THEME_RADIUS_TIER_VALUES[tier];
          const previewR = tier === 'none' ? 0 : Math.min(10, 2 + r * 0.8);
          return (
            <button
              key={tier}
              type="button"
              onClick={() => setThemeRadiusTier(tier)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '8px 6px',
                minWidth: 48,
                borderRadius: 4,
                border: `2px solid ${selected ? CMS.primary : CMS.border}`,
                background: selected ? 'rgba(12, 102, 228, 0.08)' : CMS.inputBg,
                cursor: 'pointer',
                color: CMS.text,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  background: '#DFE1E6',
                  borderRadius: previewR,
                }}
              />
              <span style={{ fontSize: 10, fontWeight: 600, color: CMS.textMuted }}>{RADIUS_LABELS[tier]}</span>
            </button>
          );
        })}
      </div>
    </div>
    <div style={{ marginBottom: 24 }}>
      <CmsFieldLabel
        title="Spacing"
        hint="Density across the site — padding, gaps, and line heights for cards and content."
      />
      <div style={{ display: 'flex', gap: 8 }}>
        {SPACING_OPTIONS.map(id => {
          const selected = spacingScheme === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setSpacingScheme(id)}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 4,
                border: `2px solid ${selected ? CMS.primary : CMS.border}`,
                background: selected ? 'rgba(12, 102, 228, 0.08)' : CMS.inputBg,
                color: CMS.text,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {SPACING_LABELS[id]}
            </button>
          );
        })}
      </div>
    </div>

    <div role="radiogroup" aria-label="Panel backgrounds">
      <CmsFieldLabel
        title="Panel backgrounds"
        hint="Header, app cards, and search bar: opaque (solid) or frosted glass (45% fill + blur)."
      />
      <div style={{ display: 'flex', gap: 8 }}>
        {(['solid', 'translucent'] as const).map(id => {
          const selected = panelBackgroundMode === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setPanelBackgroundMode(id)}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 4,
                border: `2px solid ${selected ? CMS.primary : CMS.border}`,
                background: selected ? 'rgba(12, 102, 228, 0.08)' : CMS.inputBg,
                color: CMS.text,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {id === 'solid' ? 'Solid' : 'Translucent'}
            </button>
          );
        })}
      </div>
    </div>
  </>
);
