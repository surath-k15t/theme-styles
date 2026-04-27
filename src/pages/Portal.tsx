import React from 'react';
import SiteHeader from '@/components/theme-preview/SiteHeader';
import SiteFooter from '@/components/theme-preview/SiteFooter';
import Banner from '@/components/theme-preview/Banner';
import AppCards from '@/components/theme-preview/AppCards';
import { useTheme } from '@/lib/ThemeContext';
import { presets } from '@/lib/presets';

const Portal: React.FC = () => {
  const { preset, panelBackgroundMode } = useTheme();
  const s = presets[preset].styles;
  const pullBannerUnderNav =
    s.bannerOverlapHeader === true || panelBackgroundMode === 'translucent';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader variant="portal" />
      <div style={{ marginTop: pullBannerUnderNav ? -s.headerHeight : 0 }}>
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
