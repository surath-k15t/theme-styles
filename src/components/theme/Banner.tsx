import React from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { presets } from '@/lib/presets';
import SearchBar from '@/components/theme/SearchBar';

const Banner: React.FC = () => {
  const { preset } = useTheme();
  const config = presets[preset];
  const s = config.styles;
  const isBold = preset === 'ignite';

  // For 'none', the banner seamlessly blends into the portal canvas background.
  // For all other styles, the explicit bannerBackground drives the base color.
  const bannerBg = config.bannerStyle === 'none' ? s.portalCanvasBackground : s.bannerBackground;

  // Compute padding from the single X value:
  //   top    = X           (+ headerHeight when bannerOverlapHeader is true)
  //   right  = 24px        (fixed)
  //   bottom = 0.5 × X    (when bannerStyle === 'none')
  //            X           (all other styles)
  //   left   = 24px        (fixed)
  const x = s.bannerPaddingX;
  const topPad    = s.bannerOverlapHeader == true ? x + s.headerHeight : x;
  const bottomPad = config.bannerStyle === 'none' ? Math.round(x * 0.5) : x;
  const computedPadding = `${topPad}px 24px ${bottomPad}px`;

  return (
    <div
      style={{
        background: bannerBg,
        color: s.bannerTextColor,
        padding: computedPadding,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--ds-font-family-body)',
      }}
    >
      {/* Gradient overlay — colors driven by --aurora-color-* CSS vars */}
      {config.bannerStyle === 'gradient' && (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, var(--aurora-color-start) 0%, var(--aurora-color-mid) 51.3%, var(--aurora-color-end) 100%)',
              opacity: 0.8,
            }}
          />
          {/* Easing layer — fades the gradient into the canvas below */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, transparent 0%, rgba(243,243,243,0.50) 45%, rgba(247,247,247,0.67) 60%, rgba(251,251,251,0.85) 77%, white 100%)',
            }}
          />
        </>
      )}

      {/* Full-width banner image */}
      {config.bannerStyle === 'image' && config.bannerImage && (() => {
        const side = s.bannerImageSide ?? 'right';
        const opacity = s.bannerImageOpacity ?? 1;
        const maxHeight = s.bannerImageMaxHeight ?? '100%';
        const maskImage =
          side === 'right'
            ? 'linear-gradient(to right, transparent 0%, black 30%)'
            : side === 'left'
            ? 'linear-gradient(to left, transparent 0%, black 30%)'
            : undefined;
        return (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: side === 'full' ? 'center' : side === 'right' ? 'flex-end' : 'flex-start',
              overflow: 'hidden',
              opacity,
              maskImage,
              WebkitMaskImage: maskImage,
            }}
          >
            <img
              src={config.bannerImage}
              aria-hidden
              style={{
                height: maxHeight,
                width: side === 'full' ? '100%' : 'auto',
                objectFit: side === 'full' ? 'cover' : 'contain',
                objectPosition: 'center',
                display: 'block',
                flexShrink: 0,
              }}
            />
          </div>
        );
      })()}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1
          style={{
            fontFamily: 'var(--ds-font-family-headline)',
            fontSize: s.h1Size,
            fontWeight: isBold ? 700 : s.h1Weight,
            color: s.h1Color,
            letterSpacing: s.h1LetterSpacing,
            lineHeight: s.h1LineHeight,
            paddingBottom: s.h1PaddingBottom,
            marginBottom: 24,
            textWrap: 'balance',
          }}
        >
          {config.brandSubtitle}
        </h1>

        <SearchBar />
      </div>
    </div>
  );
};

export default Banner;
