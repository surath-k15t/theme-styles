import React, { useCallback, useEffect, useRef } from 'react';
import {
  THEME_BANNER_PADDING_X_MAX,
  THEME_BANNER_PADDING_X_MIN,
  THEME_ICON_SIZE_MAX,
  THEME_ICON_SIZE_MIN,
} from '@/lib/ThemeContext';
import { type CardLayout } from '@/lib/presets/spacingSchemes';
import { CARD_LAYOUT_LABELS, CARD_LAYOUT_OPTIONS, CMS } from './constants';
import { CmsCard, CmsFieldLabel, cmsSelectStyle } from './cms-ui';

export interface PagesTabProps {
  cardLayout: CardLayout;
  setCardLayout: (v: CardLayout) => void;
  iconSize: number;
  setIconSize: (v: number) => void;
  setPortalBannerStyle: (v: 'image') => void;
  portalBannerImage: string | null;
  setPortalBannerImage: (v: string | null) => void;
  bannerPaddingX: number;
  setBannerPaddingX: (v: number) => void;
}

/** Pages tab: portal page layout and banner options. */
export const PagesTab: React.FC<PagesTabProps> = ({
  cardLayout,
  setCardLayout,
  iconSize,
  setIconSize,
  setPortalBannerStyle,
  portalBannerImage,
  setPortalBannerImage,
  bannerPaddingX,
  setBannerPaddingX,
}) => {
  const bannerFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPortalBannerStyle('image');
  }, [setPortalBannerStyle]);

  const onBannerFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPortalBannerImage(reader.result);
          setPortalBannerStyle('image');
        }
      };
      reader.readAsDataURL(file);
    },
    [setPortalBannerImage, setPortalBannerStyle],
  );

  return (
    <>
      <CmsCard title="Portal Page">
        <div style={{ marginBottom: 24 }}>
          <CmsFieldLabel title="Card layout" hint="The layout of app cards on the portal home page." />
          <select
            value={cardLayout}
            onChange={e => setCardLayout(e.target.value as CardLayout)}
            aria-label="Portal app cards layout"
            style={cmsSelectStyle}
          >
            {CARD_LAYOUT_OPTIONS.map(id => (
              <option key={id} value={id}>
                {CARD_LAYOUT_LABELS[id]}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 24 }}>
          <CmsFieldLabel
            title="Icon size"
            hint={`The size of the icon container on content source cards.`}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <input
              type="range"
              min={THEME_ICON_SIZE_MIN}
              max={THEME_ICON_SIZE_MAX}
              step={1}
              value={iconSize}
              onChange={e => setIconSize(Number(e.target.value))}
              aria-label="The size of the icon container on content source cards."
              style={{
                flex: 1,
                minWidth: 0,
                height: 6,
                accentColor: CMS.primary,
                cursor: 'pointer',
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'PT Mono', ui-monospace, monospace",
                color: CMS.text,
                minWidth: 52,
                textAlign: 'right',
              }}
            >
              {iconSize}px
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11,
              fontWeight: 500,
              color: CMS.textMuted,
            }}
          >
            <span>{THEME_ICON_SIZE_MIN}px</span>
            <span>{THEME_ICON_SIZE_MAX}px</span>
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <CmsFieldLabel
            title="Banner padding"
            hint="The top and bottom padding of the portal banner"
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <input
              type="range"
              min={THEME_BANNER_PADDING_X_MIN}
              max={THEME_BANNER_PADDING_X_MAX}
              step={1}
              value={bannerPaddingX}
              onChange={e => setBannerPaddingX(Number(e.target.value))}
              aria-label="Banner vertical padding"
              style={{
                flex: 1,
                minWidth: 0,
                height: 6,
                accentColor: CMS.primary,
                cursor: 'pointer',
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'PT Mono', ui-monospace, monospace",
                color: CMS.text,
                minWidth: 44,
                textAlign: 'right',
              }}
            >
              {bannerPaddingX}px
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11,
              fontWeight: 500,
              color: CMS.textMuted,
            }}
          >
            <span>{THEME_BANNER_PADDING_X_MIN}px</span>
            <span>{THEME_BANNER_PADDING_X_MAX}px</span>
          </div>
        </div>
        <div>
          <CmsFieldLabel title="Banner Image" hint="Set an image for the banner." />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              ref={bannerFileRef}
              type="file"
              accept="image/*"
              onChange={onBannerFile}
              aria-label="Upload banner image"
              style={{ display: 'none' }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => bannerFileRef.current?.click()}
                style={{
                  padding: '8px 14px',
                  borderRadius: 4,
                  border: `1px solid ${CMS.border}`,
                  background: CMS.inputBg,
                  color: CMS.text,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Inter', ui-sans-serif, sans-serif",
                }}
              >
                Choose image…
              </button>
              {portalBannerImage ? (
                <button
                  type="button"
                  onClick={() => setPortalBannerImage(null)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 4,
                    border: `1px solid ${CMS.border}`,
                    background: CMS.pageBg,
                    color: CMS.textMuted,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: "'Inter', ui-sans-serif, sans-serif",
                  }}
                >
                  Remove image
                </button>
              ) : null}
            </div>
            {portalBannerImage ? (
              <div
                style={{
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: `1px solid ${CMS.border}`,
                  maxHeight: 120,
                  background: CMS.inputBg,
                }}
              >
                <img
                  src={portalBannerImage}
                  alt="Banner preview"
                  style={{ width: '100%', height: '100%', maxHeight: 120, objectFit: 'cover', display: 'block' }}
                />
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 12, color: CMS.textMuted, lineHeight: 1.45 }}>
                No image yet — upload one to show it on the portal banner.
              </p>
            )}
          </div>
        </div>
      </CmsCard>
    </>
  );
};
