import React from 'react';
import type { ThemeRadiusTier } from '@/lib/ThemeContext';
import type { PanelBackgroundMode } from '@/lib/panelSurfaceGlass';
import type { SpacingScheme } from '@/lib/presets/spacingSchemes';
import { K15tRadioGroup, Slider } from '@/components/theme-side-panel/k15t-primitives';
import { RADIUS_TIERS, SPACING_LABELS, SPACING_OPTIONS } from '../constants';
import { CmsFieldLabel } from '../cms-ui';

export interface DesignAppearanceCardProps {
  themeRadiusTier: ThemeRadiusTier;
  setThemeRadiusTier: (v: ThemeRadiusTier) => void;
  spacingScheme: SpacingScheme;
  setSpacingScheme: (v: SpacingScheme) => void;
  panelBackgroundMode: PanelBackgroundMode;
  setPanelBackgroundMode: (v: PanelBackgroundMode) => void;
}

/** Brand tab — Appearance: radius, spacing, background. */
export const DesignAppearanceCard: React.FC<DesignAppearanceCardProps> = ({
  themeRadiusTier,
  setThemeRadiusTier,
  spacingScheme,
  setSpacingScheme,
  panelBackgroundMode,
  setPanelBackgroundMode,
}) => (
  <>
    <div>
      <CmsFieldLabel
        title="Corner radius"
        hint="Controls how rounded cards and buttons appear across your site."
      />
      <Slider
        id="design-corner-radius"
        label="Corner radius"
        min={0}
        max={RADIUS_TIERS.length - 1}
        step={1}
        value={Math.max(0, RADIUS_TIERS.indexOf(themeRadiusTier))}
        onChange={v => {
          if (v == null) return;
          const i = Math.min(RADIUS_TIERS.length - 1, Math.max(0, Math.round(v)));
          setThemeRadiusTier(RADIUS_TIERS[i]!);
        }}
      />
    </div>
    <div>
      <CmsFieldLabel
        title="Spacing"
        hint="Controls padding, gaps, and line height across your site."
      />
      <K15tRadioGroup.Root
        aria-label="Spacing"
        value={spacingScheme}
        onChange={v => setSpacingScheme(v as SpacingScheme)}
      >
        {SPACING_OPTIONS.map(id => (
          <K15tRadioGroup.Item key={id} value={id} label={SPACING_LABELS[id]} />
        ))}
      </K15tRadioGroup.Root>
    </div>

    <div>
      <CmsFieldLabel
        title="Background style"
        hint="Choose between a solid or frosted glass effect for the header, cards, and search bar."
      />
      <K15tRadioGroup.Root
        aria-label="Background style"
        value={panelBackgroundMode}
        onChange={v => setPanelBackgroundMode(v as PanelBackgroundMode)}
      >
        <K15tRadioGroup.Item value="solid" label="Solid" />
        <K15tRadioGroup.Item value="translucent" label="Frosted Glass" />
      </K15tRadioGroup.Root>
    </div>
  </>
);
