import React from 'react';
import { CMS } from './constants';

export function CmsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        border: `1px solid ${CMS.border}`,
        borderRadius: 8,
        background: CMS.pageBg,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${CMS.border}` }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: CMS.text, letterSpacing: '-0.01em' }}>{title}</span>
      </div>
      <div style={{ padding: '20px' }}>{children}</div>
    </div>
  );
}

/**
 * Collapsible settings group: height follows content. The panel’s scroll region scrolls when
 * sections together exceed available space.
 */
export function CmsCollapsibleCard({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: `1px solid ${CMS.border}`,
        borderRadius: 8,
        background: CMS.pageBg,
        display: 'flex',
        flexDirection: 'column',
        flex: '0 0 auto',
        alignSelf: 'stretch',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          width: '100%',
          padding: '14px 20px',
          border: 'none',
          background: CMS.pageBg,
          cursor: 'pointer',
          flexShrink: 0,
          borderBottom: expanded ? `1px solid ${CMS.border}` : undefined,
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: CMS.text, letterSpacing: '-0.01em' }}>{title}</span>
        <span
          className="material-symbols-outlined"
          aria-hidden
          style={{
            fontSize: 22,
            color: CMS.textMuted,
            flexShrink: 0,
            transition: 'transform 0.2s ease',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          expand_more
        </span>
      </button>
      {expanded ? <div style={{ padding: '20px' }}>{children}</div> : null}
    </div>
  );
}

export function CmsNavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: '10px 6px',
        margin: '0 8px',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        background: active ? CMS.activeItemBg : 'transparent',
        color: active ? CMS.primary : CMS.textMuted,
        boxShadow: active ? '0 1px 2px rgba(9, 30, 66, 0.08)' : 'none',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 22, fontWeight: active ? 500 : 400 }}>
        {icon}
      </span>
      <span style={{ fontSize: 10, fontWeight: 600, lineHeight: 1.1, textAlign: 'center' }}>{label}</span>
    </button>
  );
}

export function CmsFieldLabel({ title, hint }: { title: string; hint?: string }) {
  return (
    <div style={{ marginBottom: hint ? 6 : 10 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: CMS.text }}>{title}</div>
      {hint ? (
        <div style={{ fontSize: 12, color: CMS.textMuted, marginTop: 4, lineHeight: 1.45 }}>{hint}</div>
      ) : null}
    </div>
  );
}

export function CmsToggleRow({
  label,
  description,
  checked,
  onChange,
  dividerTop = true,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  dividerTop?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '12px 0',
        borderTop: dividerTop ? `1px solid ${CMS.border}` : undefined,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: CMS.text }}>{label}</div>
        {description ? (
          <div style={{ fontSize: 12, color: CMS.textMuted, marginTop: 4, lineHeight: 1.45 }}>{description}</div>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          border: 'none',
          padding: 2,
          cursor: 'pointer',
          flexShrink: 0,
          background: checked ? CMS.primary : CMS.border,
          position: 'relative',
          transition: 'background 0.22s ease',
        }}
      >
        <span
          style={{
            display: 'block',
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            marginLeft: checked ? 20 : 0,
            transition: 'margin 0.22s ease',
            boxShadow: '0 1px 2px rgba(9, 30, 66, 0.2)',
          }}
        />
      </button>
    </div>
  );
}

/** Compact chip with chevron — for expandable panels (distinct from full-width mode toggles). */
export function CmsExpansionChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={active}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        padding: '6px 8px 6px 10px',
        borderRadius: 6,
        border: `1px dashed ${active ? CMS.primary : CMS.border}`,
        background: active ? 'rgba(12, 102, 228, 0.07)' : CMS.inputBg,
        color: CMS.text,
        fontSize: 11,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <span>{children}</span>
      <span
        className="material-symbols-outlined"
        aria-hidden
        style={{
          fontSize: 16,
          color: active ? CMS.primary : CMS.textMuted,
          transition: 'transform 0.22s ease',
          transform: active ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        expand_more
      </span>
    </button>
  );
}

export const cmsSelectStyle: React.CSSProperties = {
  width: '100%',
  margin: 0,
  padding: '10px 12px',
  borderRadius: 4,
  border: `1px solid ${CMS.border}`,
  background: CMS.inputBg,
  color: CMS.text,
  fontSize: 14,
  fontWeight: 500,
  fontFamily: "'Inter', ui-sans-serif, sans-serif",
  cursor: 'pointer',
  outline: 'none',
  boxSizing: 'border-box',
};
