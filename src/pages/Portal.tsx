import React from 'react';
import SiteHeader from '@/components/theme/SiteHeader';
import SiteFooter from '@/components/theme/SiteFooter';
import Banner from '@/components/theme/Banner';
import AppCards from '@/components/theme/AppCards';
import { useTheme } from '@/lib/ThemeContext';
import { presets } from '@/lib/presets';

const Portal: React.FC = () => {
  const { preset } = useTheme();
  const s = presets[preset].styles;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader variant="portal" />
      <div style={{ marginTop: s.bannerOverlapHeader ? -s.headerHeight : 0 }}>
        <Banner />
      </div>
      <div style={{ flex: 1, background: s.portalCanvasBackground }}>
        <AppCards />
      </div>
      <SiteFooter />
    </div>
  );
};

export default Portal;
