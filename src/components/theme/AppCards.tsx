import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/lib/ThemeContext';
import { presets } from '@/lib/presets';
import { spacingSchemes } from '@/lib/presets/spacingSchemes';

interface AppIconProps {
  icon: string;
  iconType: 'material' | 'emoji' | 'image';
  listMode?: boolean;
  iconRenderSize: number;
  iconContainerSize: number;
  iconColor: string;
  iconBackground: string;
}

const AppIcon: React.FC<AppIconProps> = ({
  icon,
  iconType,
  listMode,
  iconRenderSize,
  iconContainerSize,
  iconColor,
  iconBackground,
}) => {
  const hasBackground = iconBackground !== 'none';
  const boxSize = iconContainerSize;
  const isImageList = iconType === 'image' && listMode;
  return (
    <div
      style={{
        width: boxSize,
        height: isImageList ? undefined : boxSize,   // let height be driven by card in list+image mode
        alignSelf: isImageList ? 'stretch' : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: hasBackground ? 'var(--ds-radius-small)' : undefined,
        background: hasBackground ? (listMode ? 'var(--ds-color-brand-100)' : iconBackground) : undefined,
        fontSize: iconType === 'emoji' ? iconRenderSize : undefined,
        flexShrink: 0,
        overflow: isImageList ? 'hidden' : undefined,
      }}
    >
      {iconType === 'material' ? (
        <span className="material-symbols-outlined" style={{ fontSize: iconRenderSize, color: iconColor }}>
          {icon}
        </span>
      ) : iconType === 'image' && listMode ? (
        // In list cards, the image stretches to fill the full card height
        <img
          src={icon}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
          }}
        />
      ) : iconType === 'image' ? (
        // In grid cards, the image fits inside the icon container
        <img
          src={icon}
          alt=""
          style={{
            width: iconRenderSize,
            height: iconRenderSize,
            objectFit: 'contain',
            borderRadius: hasBackground ? 'var(--ds-radius-small)' : undefined,
            display: 'block',
          }}
        />
      ) : (
        icon
      )}
    </div>
  );
};

const AppCards: React.FC = () => {
  const { preset } = useTheme();
  const config = presets[preset];
  const s = config.styles;
  const navigate = useNavigate();
  const layout = config.cardLayout;
  // list-style: icon beside text in a flex row
  const isListStyle = layout === 'list-1col' || layout === 'list-2col' || layout === 'list-3col';
  // left-aligned: grid cards where icon is on top but text is left-aligned (not centred)
  const isLeftAligned = isListStyle || layout === 'grid-2col';
  const gridTemplateColumns =
    layout === 'grid-3col' ? 'repeat(3, 1fr)' :
    layout === 'grid-2col' ? 'repeat(2, 1fr)' :
    layout === 'list-3col' ? 'repeat(3, 1fr)' :
    layout === 'list-2col' ? 'repeat(2, 1fr)' :
    '1fr'; // list-1col
  const showDescription = s.cardShowDescription !== false && layout !== 'list-3col';
  const hasImageList = isListStyle && config.apps.some(a => a.iconType === 'image');

  const scheme = spacingSchemes[s.spacingScheme];
  const sectionSides = s.cardsSectionPaddingSides ?? 24;
  const sectionPadding = `${scheme.sectionPaddingV}px ${sectionSides}px`;
  const cardPadding = scheme.cardPadding[layout];
  const iconTextGap = s.cardIconTextGap ?? scheme.cardIconTextGap;
  const cardsGap = scheme.cardsGap[layout];
  const iconContainerSize = s.iconSize;
  const iconRenderSize = s.cardIconBackground !== 'none'
    ? Math.round(s.iconSize / 2)
    : s.iconSize;

  return (
    <div style={{ maxWidth: 1024, margin: '0 auto', padding: sectionPadding }}>
      <h2
        style={{
          fontFamily: 'var(--ds-font-family-headline)',
          fontSize: s.h2Size,
          fontWeight: s.h2Weight,
          color: s.h2Color,
          letterSpacing: s.h2LetterSpacing,
          lineHeight: s.h2LineHeight,
          marginBottom: scheme.cardsHeadingMarginBottom,
        }}
      >
        {config.cardsSectionHeading ?? 'Our apps'}
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns,
          gap: cardsGap,
        }}
      >
        {config.apps.map(app => (
          <div
            key={app.name}
            onClick={() => navigate(`/article/${encodeURIComponent(app.name)}`)}
            style={{
              border: s.cardBorder,
              borderRadius: 'var(--ds-radius-medium)',
              background: s.cardBackground,
              backdropFilter: s.cardBackdropFilter,
              WebkitBackdropFilter: s.cardBackdropFilter,
              padding: cardPadding,
              cursor: 'pointer',
              transition: 'border-color 0.15s, background 0.15s',
              display: isListStyle ? 'flex' : 'block',
              alignItems: isListStyle ? (hasImageList ? 'stretch' : 'center') : undefined,
              gap: isListStyle ? iconTextGap : undefined,
              textAlign: isLeftAligned ? 'left' : 'center',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = s.cardBackgroundHover;
              if (s.cardBorderHover) {
                el.style.borderColor = s.cardBorderHover;
              }
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = s.cardBackground;
              if (s.cardBorderHover) {
                el.style.border = s.cardBorder;
              }
            }}
          >
            <div style={{ display: isListStyle ? 'block' : 'flex', justifyContent: isLeftAligned ? 'flex-start' : 'center', marginBottom: isListStyle ? 0 : 14, flexShrink: 0 }}>
              <AppIcon
                icon={app.icon}
                iconType={app.iconType}
                listMode={isListStyle}
                iconRenderSize={iconRenderSize}
                iconContainerSize={iconContainerSize}
                iconColor={s.cardIconColor}
                iconBackground={s.cardIconBackground}
              />
            </div>
            <div style={{ alignSelf: hasImageList && isListStyle ? 'center' : undefined }}>
              <div
                style={{
                  fontFamily: s.h3FontFamily ?? 'var(--ds-font-family-headline)',
                  fontWeight: s.h3Weight,
                  color: s.h3Color,
                  fontSize: s.h3Size,
                  letterSpacing: s.h3LetterSpacing,
                  lineHeight: scheme.cardTitleLineHeight,
                  marginBottom: showDescription ? 4 : 0,
                }}
              >
                {app.name}
              </div>
              {showDescription && (
                <div
                  style={{
                    fontFamily: 'var(--ds-font-family-body)',
                    color: s.pColor,
                    fontSize: s.pSize,
                    fontWeight: s.pWeight,
                    lineHeight: scheme.cardBodyLineHeight,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {app.description ?? 'Documentation and guides'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppCards;
