import React from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { presets } from '@/lib/presets';
import { useNavigate } from 'react-router-dom';

/* ── Logo ─────────────────────────────────────────── */
const Logo: React.FC = () => {
  const { preset } = useTheme();
  const config = presets[preset];

  if (config.logoType === 'badge') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          borderRadius: 'var(--ds-radius-small)',
          background: 'var(--theme-primary-color)',
          color: 'var(--theme-on-primary-color)',
          fontSize: 11,
          fontWeight: 700,
          fontFamily: 'var(--ds-font-family-headline)',
          letterSpacing: '0.5px',
          flexShrink: 0,
        }}
      >
        {config.logoIcon}
      </span>
    );
  }
  if (config.logoType === 'emoji') {
    return <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{config.logoIcon}</span>;
  }
  return (
    <span className="material-symbols-outlined" style={{ fontSize: 22, flexShrink: 0 }}>
      {config.logoIcon}
    </span>
  );
};

/* ── Picker (version / variant select) ───────────── */
const Picker: React.FC<{
  label: string;
  options: string[];
  pickerBorder: string;
  headerText: string;
}> = ({ label, options, pickerBorder, headerText }) => (
  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
    <select
      aria-label={label}
      style={{
        appearance: 'none',
        WebkitAppearance: 'none',
        background: 'transparent',
        border: pickerBorder,
        borderRadius: 'var(--ds-radius-small)',
        color: headerText,
        fontSize: 13,
        padding: '5px 28px 5px 10px',
        cursor: 'pointer',
        fontFamily: 'var(--ds-font-family-body)',
        outline: 'none',
        height: 32,
      }}
    >
      {options.map(opt => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <span
      className="material-symbols-outlined"
      style={{
        position: 'absolute',
        right: 6,
        pointerEvents: 'none',
        fontSize: 16,
        color: headerText,
        opacity: 0.7,
      }}
    >
      expand_more
    </span>
  </div>
);

/* ── Main Header ──────────────────────────────────── */
interface SiteHeaderProps {
  variant?: 'portal' | 'article';
  appName?: string;
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ variant = 'portal', appName }) => {
  const { preset, mode, toggleMode } = useTheme();
  const config = presets[preset];
  const s = config.styles;
  const navigate = useNavigate();

  const headerText = 'var(--theme-header-text-color)';

  const iconBtnStyle: React.CSSProperties = {
    background: 'transparent',
    border: s.headerPickerBorder,
    borderRadius: 'var(--ds-radius-small)',
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: headerText,
    flexShrink: 0,
    padding: 0,
  };

  return (
    <header
      style={{
        background: s.headerBackground,
        backdropFilter: s.headerBackdropFilter,
        WebkitBackdropFilter: s.headerBackdropFilter,
        color: headerText,
        borderBottom: s.headerBorderBottom,
        position: 'sticky',
        top: 0,
        zIndex: 50,
        fontFamily: 'var(--ds-font-family-body)',
        fontSize: 'var(--ds-font-size-sm)',
      }}
    >
      <div
        style={{
          padding: s.headerPadding,
          height: s.headerHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        {/* ── header-site-branding ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
          }}
        >
          <span
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/')}
            aria-label="Go to homepage"
          >
            <Logo />
          </span>

          <span
            style={{
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              color: 'var(--theme-headline-color)',
            }}
            onClick={() => navigate('/')}
          >
            {config.brandName}
          </span>

          {/* App name — article only (acts as header-site-name) */}
          {variant === 'article' && appName && (
            <span
              style={{
                fontSize: 13,
                color: headerText,
                opacity: 0.7,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              onClick={() => navigate('/')}
            >
              {appName}
            </span>
          )}
        </div>

        {/* ── header-content ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>

          {/* header-links */}
          <nav aria-label="Header links">
            <ul
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                listStyle: 'none',
                margin: 0,
                padding: 0,
              }}
            >
              {["What's New?", 'Support', 'Contact Us'].map(link => (
                <li key={link}>
                  <a
                    href="#"
                    style={{
                      color: headerText,
                      textDecoration: 'none',
                      opacity: 0.85,
                      fontSize: 13,
                      whiteSpace: 'nowrap',
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
                    onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.85')}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* header-pickers: version + variant (article only) */}
          {variant === 'article' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Picker
                label="Page version"
                options={['4.1', '4.0', '3.0']}
                pickerBorder={s.headerPickerBorder}
                headerText={headerText}
              />
              <Picker
                label="Page variant"
                options={['Basic', 'Enterprise', 'Premium']}
                pickerBorder={s.headerPickerBorder}
                headerText={headerText}
              />
            </div>
          )}

          {/* header-pickers: mode toggle (icon-only, bordered button) */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={toggleMode}
              title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              style={iconBtnStyle}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                {mode === 'light' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
