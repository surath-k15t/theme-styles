import React from 'react';
import type { ThemeRadiusTier } from '@/lib/ThemeContext';
import type { PanelBackgroundMode } from '@/lib/panelSurfaceGlass';
import type { SpacingScheme } from '@/lib/presets/spacingSchemes';
import {
  CMS,
  RADIUS_LABELS,
  RADIUS_TIERS,
  SECTION_GAP,
  SPACING_LABELS,
  SPACING_OPTIONS,
} from './constants';
import { CmsFieldLabel } from './cms-ui';

/** Top-left corner radius inside each tile glyph (px at 40×40). */
const RADIUS_GLYPH_PX: Record<ThemeRadiusTier, number> = {
  none: 0,
  small: 4,
  medium: 9,
  large: 15,
  full: 20,
};

const RADIUS_TILE_GLYPH = 40;
const RADIUS_EDGE = '#172B4D';
const RADIUS_FILL = 'linear-gradient(145deg, rgba(12, 102, 228, 0.42) 0%, rgba(12, 102, 228, 0.12) 38%, transparent 52%)';

function RadiusOptionTile({
  tier,
  label,
  selected,
  onSelect,
}: {
  tier: ThemeRadiusTier;
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const r = RADIUS_GLYPH_PX[tier];
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: 10,
        minWidth: 56,
        background: '#FFFFFF',
        cursor: 'pointer',
        border: selected ? '3px solid #111111' : `1px solid ${CMS.border}`,
        borderRadius: 2,
        boxSizing: 'border-box',
        color: CMS.text,
      }}
    >
      <div
        style={{
          width: RADIUS_TILE_GLYPH,
          height: RADIUS_TILE_GLYPH,
          position: 'relative',
          background: '#F4F5F7',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderTop: `3px solid ${RADIUS_EDGE}`,
            borderLeft: `3px solid ${RADIUS_EDGE}`,
            borderTopLeftRadius: r,
            background: RADIUS_FILL,
            boxSizing: 'border-box',
          }}
        />
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: selected ? CMS.text : CMS.textMuted,
          letterSpacing: '-0.01em',
        }}
      >
        {label}
      </span>
    </button>
  );
}

export interface DesignAppearanceCardProps {
  themeRadiusTier: ThemeRadiusTier;
  setThemeRadiusTier: (v: ThemeRadiusTier) => void;
  spacingScheme: SpacingScheme;
  setSpacingScheme: (v: SpacingScheme) => void;
  panelBackgroundMode: PanelBackgroundMode;
  setPanelBackgroundMode: (v: PanelBackgroundMode) => void;
}

/** Design tab — Appearance: radius, spacing, background style (aligned with Color card rhythm). */
export const DesignAppearanceCard: React.FC<DesignAppearanceCardProps> = ({
  themeRadiusTier,
  setThemeRadiusTier,
  spacingScheme,
  setSpacingScheme,
  panelBackgroundMode,
  setPanelBackgroundMode,
}) => (
  <>
    <div style={{ marginBottom: SECTION_GAP }}>
      <CmsFieldLabel
        title="Corner radius"
        hint="Controls how rounded cards and buttons appear across your site."
      />
      <div
        role="radiogroup"
        aria-label="Corner radius"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-start' }}
      >
        {RADIUS_TIERS.map(tier => (
          <RadiusOptionTile
            key={tier}
            tier={tier}
            label={RADIUS_LABELS[tier]}
            selected={themeRadiusTier === tier}
            onSelect={() => setThemeRadiusTier(tier)}
          />
        ))}
      </div>
    </div>
    <div style={{ marginBottom: SECTION_GAP }}>
      <CmsFieldLabel
        title="Spacing"
        hint="Controls padding, gaps, and line height across your site."
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

    <div role="radiogroup" aria-label="Background style">
      <CmsFieldLabel
        title="Background style"
        hint="Choose between a solid or frosted glass effect for the header, cards, and search bar."
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
              {id === 'solid' ? 'Solid' : 'Frosted Glass'}
            </button>
          );
        })}
      </div>
    </div>
  </>
);
