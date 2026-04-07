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
        background: 'var(--theme-footer-background-color)',
        color: 'var(--theme-footer-text-color)',
        padding: s.footerPadding,
        fontSize: 'var(--ds-font-size-sm)',
        fontFamily: 'var(--ds-font-family-body)',
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
        <span style={{ fontWeight: 500 }}>{config.brandName}</span>
        <span style={{ opacity: 0.7 }}>Powered by Scroll Sites for Confluence</span>
      </div>
    </footer>
  );
};

export default SiteFooter;
