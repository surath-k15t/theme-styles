import React, { useEffect, useState } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { normalizeHex6 } from '@/lib/customChromeColors';
import { CMS, SECTION_GAP } from './constants';
import { CmsFieldLabel } from './cms-ui';

function ChromeHexRow({
  label,
  value,
  onCommit,
  panelBorder,
  panelFg,
}: {
  label: string;
  value: string;
  onCommit: (hex: string) => void;
  panelBorder: string;
  panelFg: string;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);

  const commit = (raw: string) => {
    const next = normalizeHex6(raw, value);
    onCommit(next);
    setDraft(next);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: CMS.text, flexShrink: 0 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1, maxWidth: 220 }}>
        <input
          type="text"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={() => commit(draft)}
          onKeyDown={e => {
            if (e.key === 'Enter') commit((e.target as HTMLInputElement).value);
          }}
          aria-label={label}
          style={{
            flex: 1,
            minWidth: 0,
            fontFamily: "'PT Mono', monospace",
            fontSize: 12,
            padding: '6px 8px',
            borderRadius: 6,
            border: `1px solid ${panelBorder}`,
            background: 'rgba(0,0,0,0.04)',
            color: panelFg,
            outline: 'none',
          }}
        />
        <input
          type="color"
          value={normalizeHex6(draft, value)}
          onChange={e => commit(e.target.value)}
          aria-label={`${label} picker`}
          style={{
            width: 36,
            height: 32,
            borderRadius: 6,
            border: `1px solid ${panelBorder}`,
            cursor: 'pointer',
            padding: 2,
            background: 'transparent',
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  );
}

function ChromeSection({
  title,
  expanded,
  onToggle,
  onReset,
  children,
  panelBorder,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  onReset: () => void;
  children: React.ReactNode;
  panelBorder: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${panelBorder}`,
        borderRadius: 8,
        background: CMS.pageBg,
        marginTop: SECTION_GAP,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '12px 14px',
          borderBottom: expanded ? `1px solid ${panelBorder}` : undefined,
        }}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0,
            fontSize: 14,
            fontWeight: 600,
            color: CMS.text,
            fontFamily: "'Inter', ui-sans-serif, sans-serif",
          }}
        >
          {title}
          <span
            className="material-symbols-outlined"
            aria-hidden
            style={{
              fontSize: 20,
              color: CMS.textMuted,
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          >
            expand_more
          </span>
        </button>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onReset();
          }}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--neutral-9)',
            fontFamily: "'Inter', ui-sans-serif, sans-serif",
            textAlign: 'right',
            maxWidth: '55%',
            lineHeight: 1.25,
          }}
        >
          Reset to brand color
        </button>
      </div>
      {expanded ? <div style={{ padding: '14px 16px 8px' }}>{children}</div> : null}
    </div>
  );
}

export const CustomColorsCard: React.FC<{
  panelBorder: string;
  panelFg: string;
}> = ({ panelBorder, panelFg }) => {
  const {
    customColorsEnabled,
    setCustomColorsEnabled,
    customChrome,
    setCustomChrome,
    resetCustomChromeSection,
  } = useTheme();

  const [open, setOpen] = useState({ header: false, footer: false, banner: false });

  useEffect(() => {
    if (customColorsEnabled) {
      setOpen({ header: false, footer: false, banner: false });
    }
  }, [customColorsEnabled]);

  return (
    <div style={{ borderTop: `1px solid ${panelBorder}`, paddingTop: SECTION_GAP, marginTop: SECTION_GAP }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <CmsFieldLabel
            title="Advanced color overrides"
            hint="Customize individual component colors independently from your brand palette."
          />
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={customColorsEnabled}
          title={customColorsEnabled ? 'Disable custom colors' : 'Enable custom colors'}
          onClick={() => setCustomColorsEnabled(!customColorsEnabled)}
          style={{
            width: 44,
            height: 24,
            borderRadius: 12,
            border: 'none',
            padding: 2,
            cursor: 'pointer',
            flexShrink: 0,
            background: customColorsEnabled ? CMS.primary : CMS.border,
            position: 'relative',
            transition: 'background 0.15s ease',
            marginTop: 2,
          }}
        >
          <span
            style={{
              display: 'block',
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: '#fff',
              marginLeft: customColorsEnabled ? 20 : 0,
              transition: 'margin 0.15s ease',
              boxShadow: '0 1px 2px rgba(9, 30, 66, 0.2)',
            }}
          />
        </button>
      </div>

      {customColorsEnabled ? (
        <>
          <ChromeSection
            title="Header"
            expanded={open.header}
            onToggle={() => setOpen(o => ({ ...o, header: !o.header }))}
            onReset={() => resetCustomChromeSection('header')}
            panelBorder={panelBorder}
          >
            <ChromeHexRow
              label="Background color"
              value={customChrome.headerBg}
              onCommit={v => setCustomChrome({ headerBg: v })}
              panelBorder={panelBorder}
              panelFg={panelFg}
            />
            <ChromeHexRow
              label="Text color"
              value={customChrome.headerText}
              onCommit={v => setCustomChrome({ headerText: v })}
              panelBorder={panelBorder}
              panelFg={panelFg}
            />
          </ChromeSection>

          <ChromeSection
            title="Footer"
            expanded={open.footer}
            onToggle={() => setOpen(o => ({ ...o, footer: !o.footer }))}
            onReset={() => resetCustomChromeSection('footer')}
            panelBorder={panelBorder}
          >
            <ChromeHexRow
              label="Background color"
              value={customChrome.footerBg}
              onCommit={v => setCustomChrome({ footerBg: v })}
              panelBorder={panelBorder}
              panelFg={panelFg}
            />
            <ChromeHexRow
              label="Text color"
              value={customChrome.footerText}
              onCommit={v => setCustomChrome({ footerText: v })}
              panelBorder={panelBorder}
              panelFg={panelFg}
            />
          </ChromeSection>

          <ChromeSection
            title="Banner"
            expanded={open.banner}
            onToggle={() => setOpen(o => ({ ...o, banner: !o.banner }))}
            onReset={() => resetCustomChromeSection('banner')}
            panelBorder={panelBorder}
          >
            <ChromeHexRow
              label="Background color"
              value={customChrome.bannerBg}
              onCommit={v => setCustomChrome({ bannerBg: v })}
              panelBorder={panelBorder}
              panelFg={panelFg}
            />
            <ChromeHexRow
              label="Text color"
              value={customChrome.bannerText}
              onCommit={v => setCustomChrome({ bannerText: v })}
              panelBorder={panelBorder}
              panelFg={panelFg}
            />
          </ChromeSection>
        </>
      ) : null}
    </div>
  );
};
