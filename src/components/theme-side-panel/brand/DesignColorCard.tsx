import React from 'react';
import type { ScaleDiagnostic } from '@/lib/color-engine';
import type { ColorCoverageMode } from '@/lib/colorCoverage';
import type { ColorModeSetting } from '@/lib/ThemeContext';
import { useTheme } from '@/lib/ThemeContext';
import { K15tColorPicker, K15tRadioGroup } from '@/components/theme-side-panel/k15t-primitives';
import fieldRow from '@/components/theme-side-panel/k15t-primitives/k15t-field-row/field-row.module.css';
import { CMS } from '../constants';
import { CmsFieldLabel, cmsSelectStyle, CmsToggleRow } from '../cms-ui';
import { CustomColorsCard } from './CustomColorsCard';

export interface DesignColorCardProps {
  hex: string;
  isDark: boolean;
  inputValue: string;
  handleHexInput: (val: string) => void;
  diagnostics: ScaleDiagnostic[];
  panelBorder: string;
  panelFg: string;
  panelMuted: string;
  panelDrawerBg: string;
  showAdvanced: boolean;
  setShowAdvanced: React.Dispatch<React.SetStateAction<boolean>>;
  alphaOnBg: { step: number; a50: string; a15: string }[];
  colorCoverage: ColorCoverageMode;
  setColorCoverage: (v: ColorCoverageMode) => void;
}

/** Brand tab — Color: mode → brand / advanced / defaults → color usage (last). */
export const DesignColorCard: React.FC<DesignColorCardProps> = ({
  hex,
  isDark,
  inputValue,
  handleHexInput,
  diagnostics,
  panelBorder,
  panelFg,
  panelMuted,
  panelDrawerBg,
  showAdvanced,
  setShowAdvanced,
  alphaOnBg,
  colorCoverage,
  setColorCoverage,
}) => {
  const { colorModeSetting, setColorModeSetting, advancedColorPanelEnabled } = useTheme();

  return (
  <>
    {/* 1. Color mode — select (same control pattern as Pages tab / vpt3 theme `Select` for enum fields) */}
    <div>
      <CmsFieldLabel
        title="Color mode"
        hint="Set whether your site supports light mode, dark mode, or both."
      />
      <select
        aria-label="Color mode"
        value={colorModeSetting}
        onChange={e => setColorModeSetting(e.target.value as ColorModeSetting)}
        style={cmsSelectStyle}
      >
        <option value="light-only">Light</option>
        <option value="dark-only">Dark</option>
        <option value="light-and-dark">Light and dark</option>
      </select>
    </div>

    {/* 2. Brand color, accent ramp, Advanced, Default colors — inner stack `gap: 1rem` matches vpt3 `k15t-form` */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        className={fieldRow.controlOneLine}
        style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: 'center' }}
      >
        <div className={fieldRow.labelContainer}>
          <div
            style={{
              font: 'var(--font-body-strong-xs)',
              lineHeight: 'var(--line-height-m)',
              color: 'var(--foreground-resting)',
            }}
          >
            Brand color
          </div>
          <div
            style={{
              font: 'var(--font-body-default-xs)',
              lineHeight: 'var(--line-height-s)',
              color: 'var(--foreground-restrained)',
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            Your brand color is used to create a consistent color range for buttons, links, and accents.
          </div>
        </div>
        <div className={fieldRow.controlSlot}>
          <K15tColorPicker
            id="design-brand-hex"
            value={inputValue}
            onChange={v => handleHexInput(v ?? '')}
            placeholder="#0e305c"
            aria-label="Accent color hex value"
          />
        </div>
      </div>

        {advancedColorPanelEnabled ? (
          <>
            {/* Advanced — scale diagnostics + alpha (chromatic ramp) */}
            <div>
              <CmsToggleRow
                label="Advanced"
                description="View the full color scale values and alpha variants."
                checked={showAdvanced}
                onChange={setShowAdvanced}
              />
              {showAdvanced ? (
                <div
                  style={{
                    borderRadius: 10,
                    background: panelDrawerBg,
                    padding: 12,
                    marginTop: '0.75rem',
                    maxHeight: 220,
                    overflowY: 'auto',
                    color: panelFg,
                  }}
                >
                  <div
                    style={{
                      font: 'var(--font-body-strong-xxs)',
                      lineHeight: 'var(--line-height-m)',
                      color: panelMuted,
                      marginBottom: 8,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Scale diagnostics
                  </div>
                  {!isDark && alphaOnBg.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <div
                        style={{
                          font: 'var(--font-body-strong-xxs)',
                          lineHeight: 'var(--line-height-m)',
                          marginBottom: 6,
                          color: panelMuted,
                        }}
                      >
                        Alpha variants
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                        {alphaOnBg.map(({ step, a50, a15 }) => (
                          <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontFamily: "'PT Mono', monospace", fontSize: 10, color: panelFg }}>S{step}</span>
                            <span
                              title={a50}
                              style={{
                                width: 24,
                                height: 14,
                                borderRadius: 3,
                                background: a50,
                                border: `1px solid ${panelBorder}`,
                              }}
                            />
                            <span
                              title={a15}
                              style={{
                                width: 24,
                                height: 14,
                                borderRadius: 3,
                                background: a15,
                                border: `1px solid ${panelBorder}`,
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontFamily: "'PT Mono', monospace",
                      fontSize: 10,
                    }}
                  >
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${panelBorder}` }}>
                        {['#', 'L', 'C', 'Hex'].map(col => (
                          <th
                            key={col}
                            style={{
                              textAlign: 'left',
                              padding: '3px 4px 6px',
                              color: panelMuted,
                              font: 'var(--font-body-strong-xxs)',
                              lineHeight: 1,
                            }}
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {diagnostics.map(s => (
                        <tr key={s.step} style={{ borderBottom: `1px solid ${panelBorder}33` }}>
                          <td style={{ padding: '4px', color: panelMuted }}>{s.step}</td>
                          <td style={{ padding: '4px', color: panelFg }}>{s.l.toFixed(3)}</td>
                          <td style={{ padding: '4px', color: panelFg }}>{s.c.toFixed(4)}</td>
                          <td style={{ padding: '4px', color: panelFg }}>{s.hex}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          </>
        ) : null}
    </div>

    {/* 3. Color usage — last subsection */}
    <div>
      <CmsFieldLabel
        title="Color usage"
        hint="Choose how your brand color is applied to the UI."
      />
      <K15tRadioGroup.Root
        aria-label="Color usage"
        value={colorCoverage}
        onChange={v => setColorCoverage(v as ColorCoverageMode)}
      >
        <K15tRadioGroup.Item value="minimal" label="Minimal — Appears only on key interactive elements" />
        <K15tRadioGroup.Item value="standard" label="Standard — Used for accents and section highlights" />
        <K15tRadioGroup.Item value="prominent" label="Prominent — Applied broadly across navigation, cards, and UI elements" />
      </K15tRadioGroup.Root>
    </div>

    <CustomColorsCard />
  </>
  );
};
