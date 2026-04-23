import React, { useEffect, useState } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { normalizeHex6 } from '@/lib/customChromeColors';
import { K15tColorPicker } from '@/components/theme-side-panel/k15t-primitives';
import { CmsFieldLabel, CmsSwitch } from '../cms-ui';
import styles from './CustomColorsCard.module.css';

function ChromeHexRow({
  label,
  value,
  onCommit,
}: {
  label: string;
  value: string;
  onCommit: (hex: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);

  const commit = (raw: string) => {
    const next = normalizeHex6(raw, value);
    onCommit(next);
    setDraft(next);
  };

  return (
    <div className={styles.controlOneLine}>
      <span className={styles.controlOneLineLabel}>
        {label}
      </span>
      <div className={styles.controlOneLinePicker}>
        <K15tColorPicker
          value={draft}
          onChange={v => setDraft(v ?? '')}
          onValueCommit={v => commit(normalizeHex6(v, value))}
          onKeyDown={e => {
            if (e.key === 'Enter') commit(normalizeHex6((e.target as HTMLInputElement).value, value));
          }}
          aria-label={label}
        />
      </div>
    </div>
  );
}

function ChromeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>{title}</div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

export const CustomColorsCard: React.FC = () => {
  const {
    customColorsEnabled,
    setCustomColorsEnabled,
    customChrome,
    setCustomChrome,
  } = useTheme();

  return (
    <div style={{ paddingTop: 0, marginTop: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <CmsFieldLabel
            title="Advanced color overrides"
            hint="Customize individual component colors independently from your brand palette."
          />
        </div>
        <CmsSwitch
          checked={customColorsEnabled}
          onChange={setCustomColorsEnabled}
          title={customColorsEnabled ? 'Disable custom colors' : 'Enable custom colors'}
        />
      </div>

      {customColorsEnabled ? (
        <>
          <ChromeSection title="Header">
            <ChromeHexRow
              label="Background color"
              value={customChrome.headerBg}
              onCommit={v => setCustomChrome({ headerBg: v })}
            />
            <ChromeHexRow
              label="Text color"
              value={customChrome.headerText}
              onCommit={v => setCustomChrome({ headerText: v })}
            />
          </ChromeSection>

          <ChromeSection title="Footer">
            <ChromeHexRow
              label="Background color"
              value={customChrome.footerBg}
              onCommit={v => setCustomChrome({ footerBg: v })}
            />
            <ChromeHexRow
              label="Text color"
              value={customChrome.footerText}
              onCommit={v => setCustomChrome({ footerText: v })}
            />
          </ChromeSection>

          <ChromeSection title="Banner">
            <ChromeHexRow
              label="Background color"
              value={customChrome.bannerBg}
              onCommit={v => setCustomChrome({ bannerBg: v })}
            />
            <ChromeHexRow
              label="Text color"
              value={customChrome.bannerText}
              onCommit={v => setCustomChrome({ bannerText: v })}
            />
          </ChromeSection>
        </>
      ) : null}
    </div>
  );
};
