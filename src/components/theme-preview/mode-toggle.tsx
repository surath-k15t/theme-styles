import React from 'react';

const APPEARANCE_BTN = {
  primary: '#0C66E4',
  border: '#DFE1E6',
  inputBg: '#F1F2F4',
  text: '#172B4D',
} as const;

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
    font: 'var(--font-body-strong-xxs)',
    lineHeight: 1,
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
      border: `2px solid ${selected ? APPEARANCE_BTN.primary : APPEARANCE_BTN.border}`,
      background: selected ? 'rgba(12, 102, 228, 0.08)' : APPEARANCE_BTN.inputBg,
      color: APPEARANCE_BTN.text,
      font: 'var(--font-body-strong-s)',
      lineHeight: 1,
      cursor: 'pointer',
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
