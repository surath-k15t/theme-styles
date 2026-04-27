import React from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { DebugStrip } from './theme-preview/DebugStrip';
import { DescriptionPanel } from './theme-preview/DescriptionPanel';
import { ThemeSidePanel } from './theme-side-panel/ThemeSidePanel';

const FloatingControls: React.FC = () => {
  const { preset, mode, showDescription, showDebug } = useTheme();

  return (
    <>
      {showDebug && <DebugStrip preset={preset} mode={mode} />}
      {showDescription && <DescriptionPanel preset={preset} />}
      <ThemeSidePanel />
    </>
  );
};

export default FloatingControls;
