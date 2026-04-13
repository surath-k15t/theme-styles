import React from 'react';
import { useTheme } from '@/lib/ThemeContext';
import {
  THEME_RADIUS_TIER_VALUES,
} from '@/lib/ThemeContext';
import type { PresetId } from '@/lib/presets';
import { presets } from '@/lib/presets';
import { spacingSchemes } from '@/lib/presets/spacingSchemes';

/** Resolves a --ds-line-height-* CSS var reference to its numeric value */
const lhNum = (token: string): string => {
  const map: Record<string, string> = {
    'var(--ds-line-height-x-small)': '1.1',
    'var(--ds-line-height-small)': '1.3',
    'var(--ds-line-height-medium)': '1.5',
    'var(--ds-line-height-large)': '1.7',
    'var(--ds-line-height-x-large)': '1.9',
  };
  return map[token] ?? token;
};

export const DebugStrip: React.FC<{ preset: PresetId; mode: string }> = ({ preset, mode }) => {
  const {
    themeRadiusTier,
    spacingScheme,
    cardLayout,
    iconSize,
    bannerPaddingX,
    portalBannerHeadingColor,
  } = useTheme();
  const config = presets[preset];
  const s = config.styles;
  const vars = config.cssVars;
  const scheme = spacingSchemes[spacingScheme];

  const hasIconBg = s.cardIconBackground !== 'none';
  const iconRender = hasIconBg ? Math.round(iconSize / 2) : iconSize;

  const tokens: { label: string; value: string; color?: string }[] = [
    { label: 'mode', value: mode },
    { label: 'scheme', value: spacingScheme },
    { label: 'layout', value: cardLayout },
    {
      label: 'icon',
      value: hasIconBg ? `${iconRender}px in ${iconSize}px` : `${iconRender}px`,
    },
    {
      label: 'roundness',
      value: `${THEME_RADIUS_TIER_VALUES[themeRadiusTier]} (${themeRadiusTier})`,
    },
    { label: 'banner pad', value: `${bannerPaddingX}px` },
    { label: 'banner h1', value: portalBannerHeadingColor },
    { label: 'primary', value: vars['--theme-primary-color'] ?? '—', color: vars['--theme-primary-color'] },
    { label: 'title LH', value: lhNum(scheme.cardTitleLineHeight) },
    { label: 'body LH', value: lhNum(scheme.cardBodyLineHeight) },
    { label: 'content LH', value: lhNum(vars['--theme-content-line-height'] ?? '—') },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9998,
        background: '#18181B',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        flexWrap: 'wrap',
        fontFamily: "'PT Mono', monospace",
        fontSize: 11,
      }}
    >
      {tokens.map(({ label, value, color }) => (
        <span key={label} style={{ color: '#71717A' }}>
          {label}: <span style={{ color: color ?? '#E4E4E7' }}>{value}</span>
        </span>
      ))}
    </div>
  );
};
