import React from 'react';

/* ── Confluence "C" logo mark ─────────────────────── */
const ConfluenceLogo: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" rx="4" fill="#0052CC" />
    <path
      d="M3.5 13.6c.2-.3 4.6-7 4.6-7 .3-.5 1-.5 1.3 0l1.5 2.4-3.3 5a.76.76 0 0 1-.65.37H3.85a.38.38 0 0 1-.35-.57zM16.5 6.4c-.2.3-4.6 7-4.6 7-.3.5-1 .5-1.3 0L9.1 11l3.3-5a.76.76 0 0 1 .65-.37h2.1a.38.38 0 0 1 .35.57z"
      fill="white"
    />
  </svg>
);

/* ── Icon button helper ───────────────────────────── */
const IconBtn: React.FC<{ icon: string; label: string; size?: number }> = ({
  icon,
  label,
  size = 18,
}) => (
  <button
    aria-label={label}
    title={label}
    style={{
      background: 'transparent',
      border: 'none',
      borderRadius: 4,
      width: 32,
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: '#44546F',
      flexShrink: 0,
      padding: 0,
    }}
    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#091E420F')}
    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
  >
    <span className="material-symbols-outlined" style={{ fontSize: size }}>
      {icon}
    </span>
  </button>
);

/* ── ConfluenceTopNav ─────────────────────────────── */
const ConfluenceTopNav: React.FC = () => (
  <div
    style={{
      height: 56,
      borderBottom: '1px solid #DCDFE4',
      background: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '0 12px',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
      flexShrink: 0,
    }}
  >
    {/* Left — app switcher + logo */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
      <IconBtn icon="apps" label="App switcher" />
      <IconBtn icon="dashboard" label="Home" />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '0 6px 0 2px',
          cursor: 'pointer',
        }}
      >
        <ConfluenceLogo />
        <span style={{ fontSize: 14, fontWeight: 600, color: '#172B4D', whiteSpace: 'nowrap' }}>
          Confluence
        </span>
      </div>
    </div>

    {/* Center — search + create */}
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minWidth: 0,
      }}
    >
      {/* Search bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: '#FFFFFF',
          border: '1px solid #B3B9C4',
          borderRadius: 4,
          padding: '0 10px',
          height: 32,
          width: '100%',
          maxWidth: 680,
          cursor: 'text',
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 16, color: '#626F86', flexShrink: 0 }}
        >
          search
        </span>
        <span style={{ fontSize: 14, color: '#626F86', userSelect: 'none' }}>Search</span>
      </div>

      {/* Create button */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: '#0052CC',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: 4,
          padding: '0 12px',
          height: 32,
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#0747A6')}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#0052CC')}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
          add
        </span>
        Create
      </button>
    </div>

    {/* Right — Rovo, notifications, help, settings, avatar */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
      {/* Ask Rovo */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'transparent',
          border: '1px solid #B3B9C4',
          borderRadius: 4,
          padding: '0 10px',
          height: 32,
          fontSize: 13,
          fontWeight: 500,
          color: '#172B4D',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#091E420F')}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
      >
        {/* Rovo coloured icon */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="8" fill="url(#rovoGrad)" />
          <defs>
            <linearGradient id="rovoGrad" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0052CC" />
              <stop offset="1" stopColor="#6554C0" />
            </linearGradient>
          </defs>
          <path
            d="M5 10.5 8 5.5l3 5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        Ask Rovo
      </button>

      <IconBtn icon="notifications" label="Notifications" />
      <IconBtn icon="help" label="Help" />
      <IconBtn icon="settings" label="Settings" />

      {/* User avatar */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0052CC, #6554C0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 11,
          fontWeight: 700,
          cursor: 'pointer',
          flexShrink: 0,
          marginLeft: 2,
        }}
      >
        SC
      </div>
    </div>
  </div>
);

export default ConfluenceTopNav;
