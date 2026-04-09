import React from 'react';
import { useTheme } from '@/lib/ThemeContext';
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
  const { preset } = useTheme();
  const s = presets[preset].styles;

  const btnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 4,
    padding: '0 16px',
    margin: 0,
    background: s.searchButtonBrand ? 'var(--theme-primary-color)' : 'var(--ds-background-neutral)',
    color: s.searchButtonTextColor ?? (s.searchButtonBrand ? 'var(--theme-on-primary-color)' : 'var(--ds-foreground)'),
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
  };

  // Gradient border technique: paint the border gradient via background-clip
  // when searchBorderGradient is set. The fill sits in padding-box, the gradient
  // in border-box — a transparent border lets the gradient show through.
  const glassFill = s.searchGlassBackground ?? 'var(--ds-surface)';
  const wrapperBackground = s.searchBorderGradient
    ? `linear-gradient(${glassFill}, ${glassFill}) padding-box, ${s.searchBorderGradient} border-box`
    : glassFill;
  const wrapperBorder = s.searchBorderGradient
    ? '2px solid transparent'
    : s.searchBorder ?? '1px solid var(--ds-border-neutral)';

  return (
    <div
      style={{
        maxWidth,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'stretch',
        background: wrapperBackground,
        borderRadius: 'var(--ds-radius-pill)',
        border: wrapperBorder,
        overflow: 'hidden',
        boxShadow,
        backdropFilter: s.searchBackdropFilter,
        WebkitBackdropFilter: s.searchBackdropFilter,
      }}
    >
      {/* Search icon */}
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: 18,
          padding: '0 12px',
          color: s.searchForegroundColor ?? 'var(--ds-foreground-subtle)',
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
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          padding: '12px 0',
          fontSize: 'var(--ds-font-size-md)',
          fontFamily: 'var(--ds-font-family-body)',
          fontWeight: 500,
          color: s.searchForegroundColor ?? 'var(--ds-foreground)',
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
