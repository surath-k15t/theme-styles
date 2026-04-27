import React from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { presets } from '@/lib/presets';

const SiteFooter: React.FC = () => {
  const { preset } = useTheme();
  const config = presets[preset];
  const s = config.styles;

  return (
    <footer
      style={{
        background: 'var(--theme-footer-background-slot)',
        color: 'var(--theme-footer-text-slot)',
        padding: s.footerPadding,
        fontSize: 'var(--K15t-font-size-sm)',
        fontFamily: 'var(--K15t-font-family-body)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ font: 'var(--font-body-strong-s)', color: 'var(--theme-headline-color)' }}>
          {config.brandName}
        </span>
        <span style={{ opacity: 0.7 }}>Powered by Scroll Sites for Confluence</span>
      </div>
    </footer>
  );
};

export default SiteFooter;
