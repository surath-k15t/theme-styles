import React from 'react';
import type { PresetConfig } from '@/lib/presets';
import { CMS } from './constants';
import { CmsCard, CmsToggleRow } from './cms-ui';

export interface SiteTabProps {
  playgroundConfig: PresetConfig;
  showDescription: boolean;
  setShowDescription: (v: boolean) => void;
  showDebug: boolean;
  setShowDebug: (v: boolean) => void;
}

/** Site tab: preset overview and canvas tools. */
export const SiteTab: React.FC<SiteTabProps> = ({
  playgroundConfig,
  showDescription,
  setShowDescription,
  showDebug,
  setShowDebug,
}) => (
  <>
    <CmsCard title={playgroundConfig.name}>
      <p style={{ margin: 0, fontSize: 14, color: CMS.textMuted, lineHeight: 1.5 }}>
        {playgroundConfig.subtitle}
      </p>
      <p style={{ margin: '12px 0 0', fontSize: 13, color: CMS.textMuted, lineHeight: 1.55 }}>
        {playgroundConfig.description}
      </p>
    </CmsCard>
    <CmsCard title="Tools">
      <CmsToggleRow
        dividerTop={false}
        label="Description panel"
        description="Show preset details in a floating panel on the canvas."
        checked={showDescription}
        onChange={setShowDescription}
      />
      <CmsToggleRow
        label="Debug strip"
        description="Show theme token readout at the top of the page."
        checked={showDebug}
        onChange={setShowDebug}
      />
    </CmsCard>
  </>
);
