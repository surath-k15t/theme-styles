import React, { useCallback, useRef, useState } from 'react';
import {
  THEME_BANNER_PADDING_X_MAX,
  THEME_BANNER_PADDING_X_MIN,
  THEME_ICON_SIZE_MAX,
  THEME_ICON_SIZE_MIN,
  type PortalBannerStyle,
} from '@/lib/ThemeContext';
import { type CardLayout } from '@/lib/presets/spacingSchemes';
import { CARD_LAYOUT_LABELS, CARD_LAYOUT_OPTIONS, CMS } from '../constants';
import { K15tButton, Slider } from '@/components/theme-side-panel/k15t-primitives';
import { ConfigCategory, CmsFieldLabel, cmsSelectStyle } from '../cms-ui';
import styles from './PagesTab.module.css';

export interface PagesTabProps {
  cardLayout: CardLayout;
  setCardLayout: (v: CardLayout) => void;
  iconSize: number;
  setIconSize: (v: number) => void;
  setPortalBannerStyle: (v: PortalBannerStyle) => void;
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
  const [bannerFileName, setBannerFileName] = useState<string>('');

  const onBannerFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setBannerFileName(file.name);
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
      <ConfigCategory title="Portal Page">
        <div>
          <CmsFieldLabel title="Tile layout" hint="Set the layout and orientation of the content source tiles on the portal page." />
          <select
            value={cardLayout}
            onChange={e => setCardLayout(e.target.value as CardLayout)}
            aria-label="Portal app tiles layout"
            style={cmsSelectStyle}
          >
            {CARD_LAYOUT_OPTIONS.map(id => (
              <option key={id} value={id}>
                {CARD_LAYOUT_LABELS[id]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <CmsFieldLabel
            title="Icon size"
            hint={`The icon size on the content source tiles, in pixels.`}
          />
          <Slider
            label="The size of the icon container on content source tiles."
            min={THEME_ICON_SIZE_MIN}
            max={THEME_ICON_SIZE_MAX}
            step={1}
            value={iconSize}
            onChange={v => v != null && setIconSize(v)}
          />
        </div>
        <div>
          <CmsFieldLabel
            title="Banner padding"
            hint="The top and bottom spacing of the portal banner, in pixels."
          />
          <Slider
            label="Banner vertical padding"
            min={THEME_BANNER_PADDING_X_MIN}
            max={THEME_BANNER_PADDING_X_MAX}
            step={1}
            value={bannerPaddingX}
            onChange={v => v != null && setBannerPaddingX(v)}
          />
        </div>
        <div>
          <CmsFieldLabel title="Banner Image" />
          <div className={styles.fileUpload}>
            <input
              ref={bannerFileRef}
              type="file"
              accept="image/*"
              onChange={onBannerFile}
              aria-label="Upload banner image"
              className={styles.fileSelect}
            />
            <div className={styles.fileContainer}>
              <input
                type="text"
                readOnly
                placeholder=" "
                value={portalBannerImage ? bannerFileName || 'banner-image' : ''}
                className={styles.fileName}
                aria-label="Banner image file name"
                onClick={() => {
                  if (!portalBannerImage) bannerFileRef.current?.click();
                }}
              />

              {portalBannerImage ? (
                <button
                  type="button"
                  className={styles.clearFile}
                  aria-label="Clear banner image"
                  onClick={() => {
                    setPortalBannerImage(null);
                    setBannerFileName('');
                  }}
                >
                  <span className="material-symbols-outlined" aria-hidden>
                    close
                  </span>
                </button>
              ) : null}
            </div>

            <K15tButton type="button" appearance="secondary-strong" onClick={() => bannerFileRef.current?.click()}>
              {portalBannerImage ? 'Change file' : 'Upload file'}
            </K15tButton>
          </div>
        </div>
      </ConfigCategory>
    </>
  );
};
