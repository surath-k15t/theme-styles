import React from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { DebugStrip } from './DebugStrip';
import { DescriptionPanel } from './DescriptionPanel';
import { ThemeSidePanel } from './ThemeSidePanel';

const FloatingControls: React.FC = () => {
  const { preset, mode, showDescription, setShowDescription, showDebug, setShowDebug } = useTheme();

  return (
    <>
      {showDebug && <DebugStrip preset={preset} mode={mode} />}
      {showDescription && <DescriptionPanel preset={preset} />}
      <ThemeSidePanel
        showDescription={showDescription}
        setShowDescription={setShowDescription}
        showDebug={showDebug}
        setShowDebug={setShowDebug}
      />
    </>
  );
};

export default FloatingControls;
