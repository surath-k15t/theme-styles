import React from 'react';
import { CMS } from './constants';

export function pillToggleStyle(
  active: boolean,
  border: string,
  fg: string,
  muted: string,
): React.CSSProperties {
  return {
    padding: '5px 10px',
    borderRadius: 8,
    border: `1px solid ${active ? fg : border}`,
    cursor: 'pointer',
    fontSize: 11,
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    background: active ? 'rgba(0,0,0,0.06)' : 'transparent',
    color: active ? fg : muted,
  };
}

export const AppearanceBtn: React.FC<{
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}> = ({ children, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '10px 12px',
      borderRadius: 8,
      border: `2px solid ${selected ? CMS.primary : CMS.border}`,
      background: selected ? 'rgba(12, 102, 228, 0.08)' : CMS.inputBg,
      color: CMS.text,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: "'Inter', sans-serif",
    }}
  >
    {children}
  </button>
);

export function SunIcon({ muted }: { muted: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden style={{ color: muted }}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MoonIcon({ muted }: { muted: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden style={{ color: muted }}>
      <path
        d="M21 14.5A8.5 8.5 0 0 1 9.5 3 6.5 6.5 0 1 0 21 14.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
