import React, { useCallback, useRef } from 'react';
import {
  THEME_BANNER_PADDING_X_MAX,
  THEME_BANNER_PADDING_X_MIN,
  THEME_ICON_SIZE_MAX,
  THEME_ICON_SIZE_MIN,
  type PortalBannerHeadingColor,
  type PortalBannerStyle,
} from '@/lib/ThemeContext';
import type { CardLayout } from '@/lib/presets/spacingSchemes';
import { CARD_LAYOUT_LABELS, CARD_LAYOUT_OPTIONS, CMS } from './constants';
import { CmsCard, CmsFieldLabel, cmsSelectStyle } from './cms-ui';

export interface PagesTabProps {
  cardLayout: CardLayout;
  setCardLayout: (v: CardLayout) => void;
  iconSize: number;
  setIconSize: (v: number) => void;
  portalBannerStyle: PortalBannerStyle;
  setPortalBannerStyle: (v: PortalBannerStyle) => void;
  portalBannerImage: string | null;
  setPortalBannerImage: (v: string | null) => void;
  bannerPaddingX: number;
  setBannerPaddingX: (v: number) => void;
  portalBannerHeadingColor: PortalBannerHeadingColor;
  setPortalBannerHeadingColor: (v: PortalBannerHeadingColor) => void;
}

/** Pages tab: portal page layout and banner options. */
export const PagesTab: React.FC<PagesTabProps> = ({
  cardLayout,
  setCardLayout,
  iconSize,
  setIconSize,
  portalBannerStyle,
  setPortalBannerStyle,
  portalBannerImage,
  setPortalBannerImage,
  bannerPaddingX,
  setBannerPaddingX,
  portalBannerHeadingColor,
  setPortalBannerHeadingColor,
}) => {
  const bannerFileRef = useRef<HTMLInputElement>(null);

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
          <CmsFieldLabel title="Card layout" hint="How app cards are arranged on the portal home." />
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
            hint="Icon container in pixels. With a background well, the glyph uses half this size."
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <input
              type="range"
              min={THEME_ICON_SIZE_MIN}
              max={THEME_ICON_SIZE_MAX}
              step={1}
              value={iconSize}
              onChange={e => setIconSize(Number(e.target.value))}
              aria-label="App card icon container size in pixels"
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
            hint="Controls top and bottom padding of the hero banner — higher values make the banner taller."
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
        <div style={{ marginBottom: 24 }}>
          <CmsFieldLabel
            title="Banner heading"
            hint="Color of the main title on the hero banner — Light is white, Dark is black."
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setPortalBannerHeadingColor('light')}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 4,
                border: `2px solid ${portalBannerHeadingColor === 'light' ? CMS.primary : CMS.border}`,
                background: portalBannerHeadingColor === 'light' ? 'rgba(12, 102, 228, 0.08)' : CMS.inputBg,
                color: CMS.text,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => setPortalBannerHeadingColor('dark')}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 4,
                border: `2px solid ${portalBannerHeadingColor === 'dark' ? CMS.primary : CMS.border}`,
                background: portalBannerHeadingColor === 'dark' ? 'rgba(12, 102, 228, 0.08)' : CMS.inputBg,
                color: CMS.text,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Dark
            </button>
          </div>
        </div>
        <div>
          <CmsFieldLabel
            title="Banner"
            hint="Color uses the theme banner tint. Image adds your picture behind the title (stored in this session only)."
          />
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              type="button"
              onClick={() => setPortalBannerStyle('colored')}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 4,
                border: `2px solid ${portalBannerStyle === 'colored' ? CMS.primary : CMS.border}`,
                background: portalBannerStyle === 'colored' ? 'rgba(12, 102, 228, 0.08)' : CMS.inputBg,
                color: CMS.text,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Color
            </button>
            <button
              type="button"
              onClick={() => setPortalBannerStyle('image')}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 4,
                border: `2px solid ${portalBannerStyle === 'image' ? CMS.primary : CMS.border}`,
                background: portalBannerStyle === 'image' ? 'rgba(12, 102, 228, 0.08)' : CMS.inputBg,
                color: CMS.text,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Image
            </button>
          </div>
          {portalBannerStyle === 'image' && (
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
          )}
        </div>
      </CmsCard>
    </>
  );
};
