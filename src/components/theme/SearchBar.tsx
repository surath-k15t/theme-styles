import React from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { PANEL_SURFACE_TRANSITION, panelSurfaceBackground } from '@/lib/panelSurfaceGlass';
import { presets } from '@/lib/presets';

interface SearchBarProps {
  placeholder?: string;
  maxWidth?: number;
  showDropdown?: boolean;
  boxShadow?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'How can we help you?',
  maxWidth = 560,
  showDropdown = true,
  boxShadow = '0 4px 20px rgba(0,0,0,0.10)',
}) => {
  const { preset, applyBrandColor, panelBackgroundMode, mode } = useTheme();
  const s = presets[preset].styles;
  const transl = panelBackgroundMode === 'translucent';

  /** Foreground for the trailing “Search all” + chevron. */
  const searchTrailingForeground =
    s.searchButtonTextColor ??
    (s.searchButtonBrand
      ? applyBrandColor
        ? 'var(--theme-on-primary-color)'
        : 'var(--theme-on-search-neutral-fill)'
      : 'var(--ds-foreground)');

  const fgReadabilityShadow =
    transl && mode === 'light'
      ? '0 1px 2px rgba(0,0,0,0.14)'
      : transl && mode === 'dark'
        ? '0 1px 3px rgba(0,0,0,0.45)'
        : undefined;

  const btnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 4,
    padding: '0 16px',
    margin: 0,
    background: s.searchButtonBrand
      ? applyBrandColor
        ? 'var(--theme-primary-color)'
        : 'var(--gray-3)'
      : 'var(--ds-background-neutral)',
    color: searchTrailingForeground,
    border: 'none',
    borderLeft: 'none',
    borderRadius: 0,
    fontFamily: 'var(--ds-font-family-body)',
    fontSize: 14,
    fontWeight: s.searchButtonFontWeight ?? 400,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    transition: 'opacity 0.15s',
    flexShrink: 0,
    textShadow: fgReadabilityShadow,
  };

  // Gradient border technique: paint the border gradient via background-clip
  // when searchBorderGradient is set. The fill sits in padding-box, the gradient
  // in border-box — a transparent border lets the gradient show through.
  const glassFill = s.searchGlassBackground ?? 'var(--ds-surface)';
  const wrapperBackground = s.searchBorderGradient
    ? `linear-gradient(${glassFill}, ${glassFill}) padding-box, ${s.searchBorderGradient} border-box`
    : glassFill;
  const translucentNeutralSearchBorder =
    transl && !s.searchBorderGradient
      ? `1px solid color-mix(in srgb, var(--gray-${mode === 'dark' ? '12' : '1'}) 25%, transparent)`
      : undefined;

  /** Solid panel mode: fixed chrome on the pill (translucent keeps neutral mix above). */
  const solidPanelSearchBorder =
    !transl && !s.searchBorderGradient
      ? mode === 'dark'
        ? '1px solid #000000'
        : '1px solid #ffffff'
      : undefined;

  const wrapperBorder = s.searchBorderGradient
    ? '2px solid transparent'
    : translucentNeutralSearchBorder ?? solidPanelSearchBorder ?? s.searchBorder ?? '1px solid var(--ds-border-neutral)';

  const outerBackground = s.searchBorderGradient
    ? wrapperBackground
    : panelSurfaceBackground(glassFill, panelBackgroundMode);
  const outerBackdrop = transl ? 'blur(30px)' : s.searchBackdropFilter;

  return (
    <div
      style={{
        maxWidth,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'stretch',
        background: outerBackground,
        borderRadius: 'var(--ds-radius-pill)',
        border: wrapperBorder,
        overflow: 'hidden',
        boxShadow,
        backdropFilter: outerBackdrop,
        WebkitBackdropFilter: outerBackdrop,
        transition: PANEL_SURFACE_TRANSITION,
      }}
    >
      {/* Search icon */}
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: 18,
          padding: '0 12px',
          color: s.searchForegroundColor ?? 'var(--ds-foreground-subtle)',
          //textShadow: fgReadabilityShadow,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        search
      </span>

      {/* Input */}
      <input
        type="text"
        placeholder={placeholder}
        className={transl && mode === 'light' ? 'placeholder:text-[var(--gray-11)]' : undefined}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          padding: '12px 0',
          fontSize: 'var(--ds-font-size-md)',
          fontFamily: 'var(--ds-font-family-body)',
          fontWeight: 500,
          color: s.searchForegroundColor ?? 'var(--ds-foreground)',
          //textShadow: fgReadabilityShadow,
          background: 'transparent',
          minWidth: 0,
        }}
      />

      {/* Search all button */}
      {showDropdown && (
        <button
          style={btnStyle}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
        >
          Search all
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            expand_more
          </span>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
