import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { PresetConfig } from '@/lib/presets';
import {
  BRAND_STYLE_PRESET_IDS,
  BRAND_STYLE_PRESET_LABELS,
  countBrandStylePresetAffectedSettings,
  getBrandStyleSnapshot,
  type BrandStylePresetId,
} from '@/lib/brandStylePresets';
import type { BrandStyleSiteLabel } from '@/lib/ThemeContext';
import { useTheme } from '@/lib/ThemeContext';
import { CMS } from './constants';
import { CmsCard, CmsToggleRow } from './cms-ui';

export interface SiteTabProps {
  playgroundConfig: PresetConfig;
  showDescription: boolean;
  setShowDescription: (v: boolean) => void;
  showDebug: boolean;
  setShowDebug: (v: boolean) => void;
}

function currentPresetDisplayLine(label: BrandStyleSiteLabel): string {
  if (label === 'none') return 'None applied';
  if (label === 'custom') return 'Custom';
  return BRAND_STYLE_PRESET_LABELS[label];
}

function brandStylePreviewHref(id: BrandStylePresetId): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/?brandPreview=${encodeURIComponent(id)}`;
}

function PresetThumb({ presetId }: { presetId: BrandStylePresetId }) {
  const hex = getBrandStyleSnapshot(presetId).playgroundHex ?? '#0e305c';
  return (
    <div
      style={{
        width: 112,
        height: 76,
        borderRadius: 6,
        overflow: 'hidden',
        border: `1px solid ${CMS.border}`,
        background: CMS.inputBg,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      <div style={{ height: 20, background: hex, flexShrink: 0 }} />
      <div style={{ flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ height: 5, borderRadius: 2, background: CMS.border, opacity: 0.85 }} />
        <div style={{ height: 5, borderRadius: 2, background: CMS.border, opacity: 0.65 }} />
        <div style={{ height: 5, borderRadius: 2, background: CMS.border, opacity: 0.45, width: '72%' }} />
      </div>
    </div>
  );
}

/** Site tab: preset overview, style preset browser, and canvas tools. */
export const SiteTab: React.FC<SiteTabProps> = ({
  playgroundConfig,
  showDescription,
  setShowDescription,
  showDebug,
  setShowDebug,
}) => {
  const {
    lastAppliedBrandStylePresetId,
    applyBrandStylePreset,
    brandStyleSiteLabel,
  } = useTheme();

  const [browseOpen, setBrowseOpen] = useState(false);
  const [modalPick, setModalPick] = useState<BrandStylePresetId>('origin');

  const openBrowse = useCallback(() => {
    setModalPick(lastAppliedBrandStylePresetId ?? 'origin');
    setBrowseOpen(true);
  }, [lastAppliedBrandStylePresetId]);

  const closeBrowse = useCallback(() => setBrowseOpen(false), []);

  useEffect(() => {
    if (!browseOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeBrowse();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [browseOpen, closeBrowse]);

  const onApplyPreset = useCallback(() => {
    applyBrandStylePreset(modalPick);
    setBrowseOpen(false);
  }, [applyBrandStylePreset, modalPick]);

  const previewLinkStyle = useMemo(
    () =>
      ({
        fontSize: 13,
        fontWeight: 600,
        color: CMS.primary,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        padding: '6px 4px',
        borderRadius: 4,
      }) as const,
    [],
  );

  const modal =
    browseOpen && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="theme-playground-portal"
            role="presentation"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10050,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              background: 'rgba(9, 30, 66, 0.54)',
            }}
            onClick={closeBrowse}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="browse-style-presets-title"
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 600,
                maxHeight: '90vh',
                overflow: 'auto',
                borderRadius: 8,
                background: CMS.pageBg,
                boxShadow: '0 8px 32px rgba(9, 30, 66, 0.28)',
                border: `1px solid ${CMS.border}`,
                fontFamily: "'Inter', ui-sans-serif, sans-serif",
              }}
            >
              <div style={{ padding: '20px 22px 16px', borderBottom: `1px solid ${CMS.border}` }}>
                <h2
                  id="browse-style-presets-title"
                  style={{ margin: 0, fontSize: 18, fontWeight: 700, color: CMS.text, letterSpacing: '-0.02em' }}
                >
                  Browse brand presets
                </h2>
                <p style={{ margin: '8px 0 0', fontSize: 13, color: CMS.textMuted, lineHeight: 1.5 }}>
                  Choose a brand preset to get started quickly. You can customise anything afterwards.
                </p>
              </div>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {BRAND_STYLE_PRESET_IDS.map(id => {
                  const selected = modalPick === id;
                  const n = countBrandStylePresetAffectedSettings(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setModalPick(id)}
                      aria-pressed={selected}
                      aria-label={`${BRAND_STYLE_PRESET_LABELS[id]}, ${n} settings`}
                      style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'stretch',
                        gap: 16,
                        padding: 14,
                        borderRadius: 8,
                        cursor: 'pointer',
                        border: selected ? `2px solid ${CMS.primary}` : `1px solid ${CMS.border}`,
                        background: selected ? 'rgba(12, 102, 228, 0.06)' : CMS.pageBg,
                        outline: 'none',
                        fontFamily: 'inherit',
                        textAlign: 'left',
                        boxSizing: 'border-box',
                      }}
                    >
                      <PresetThumb presetId={id} />
                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          gap: 6,
                        }}
                      >
                        <div style={{ fontSize: 15, fontWeight: 700, color: CMS.text, lineHeight: 1.25 }}>
                          {BRAND_STYLE_PRESET_LABELS[id]}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: CMS.textMuted, lineHeight: 1.4 }}>
                          {n} settings are affected
                        </div>
                      </div>
                      <div
                        style={{
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          alignSelf: 'center',
                        }}
                      >
                        <a
                          href={brandStylePreviewHref(id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={previewLinkStyle}
                        >
                          Preview
                        </a>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div
                style={{
                  padding: '12px 16px 16px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 10,
                  borderTop: `1px solid ${CMS.border}`,
                }}
              >
                <button
                  type="button"
                  onClick={closeBrowse}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 4,
                    border: `1px solid ${CMS.border}`,
                    background: CMS.pageBg,
                    color: CMS.text,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onApplyPreset}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 4,
                    border: 'none',
                    background: CMS.primary,
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Apply preset
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <CmsCard title={playgroundConfig.name}>
        <p style={{ margin: 0, fontSize: 14, color: CMS.textMuted, lineHeight: 1.5 }}>
          {playgroundConfig.subtitle}
        </p>
        <p style={{ margin: '12px 0 0', fontSize: 13, color: CMS.textMuted, lineHeight: 1.55 }}>
          {playgroundConfig.description}
        </p>
      </CmsCard>
      <CmsCard title="Brand preset">
        <p style={{ margin: '0 0 14px', fontSize: 13, color: CMS.textMuted, lineHeight: 1.5 }}>
          Start from a preset and customize from there.
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ fontSize: 14, color: CMS.text, minWidth: 0, lineHeight: 1.4 }}>
            <span style={{ fontWeight: 600, color: CMS.textMuted }}>Current: </span>
            <span style={{ fontWeight: 600 }}>{currentPresetDisplayLine(brandStyleSiteLabel)}</span>
          </div>
          <button
            type="button"
            onClick={openBrowse}
            style={{
              padding: '8px 14px',
              borderRadius: 4,
              border: `1px solid ${CMS.primary}`,
              background: CMS.pageBg,
              color: CMS.primary,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              flexShrink: 0,
            }}
          >
            Browse presets
          </button>
        </div>
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
      {modal}
    </>
  );
};
