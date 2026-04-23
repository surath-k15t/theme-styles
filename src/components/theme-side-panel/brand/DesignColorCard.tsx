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
  setPlaygroundHex: (v: string) => void;
  setInputValue: (v: string) => void;
  diagnostics: ScaleDiagnostic[];
  accentSelectedStep: number;
  neutralScaleHexes: readonly string[];
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
  setPlaygroundHex,
  setInputValue,
  diagnostics,
  accentSelectedStep,
  neutralScaleHexes,
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
  /** Light → dark (left → right): all 12 engine steps = `--palette-step-1`…`12` (brand-25 … brand-950). */
  const brandScaleStops = [
    { tone: '25', step: 1 },
    { tone: '50', step: 2 },
    { tone: '100', step: 3 },
    { tone: '200', step: 4 },
    { tone: '300', step: 5 },
    { tone: '400', step: 6 },
    { tone: '500', step: 7 },
    { tone: '600', step: 8 },
    { tone: '700', step: 9 },
    { tone: '800', step: 10 },
    { tone: '900', step: 11 },
    { tone: '950', step: 12 },
  ] as const;

  return (
  <>
    {/* 1. Color theme — select (same control pattern as Pages tab / vpt3 theme `Select` for enum fields) */}
    <div>
      <CmsFieldLabel
        title="Color theme"
        hint="Whether your site supports light, dark, or both."
      />
      <select
        aria-label="Color theme"
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
            Your brand color generates the accent scale used across your site.
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
      <div
        role="group"
        aria-label="Brand color palette; selected step shows a checkmark with large rounded corners"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: 0,
          padding: 0,
        }}
      >
        {brandScaleStops.map(({ tone, step }) => {
          const swatch = diagnostics[step - 1];
          if (!swatch) return null;
          const selected = step === accentSelectedStep;
          const checkFg = step >= 6 ? '#ffffff' : '#0a0a0a';
          return (
            <button
              key={step}
              type="button"
              title={`${swatch.hex} — brand ${tone}`}
              aria-label={`Brand ${tone}, ${swatch.hex}`}
              aria-current={selected ? 'true' : undefined}
              onClick={() => {
                setPlaygroundHex(swatch.hex);
                setInputValue(swatch.hex);
              }}
              style={{
                flex: '0 0 32px',
                width: 32,
                height: 32,
                border: 'none',
                borderRadius: selected ? 100 : 0,
                background: swatch.hex,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                flexShrink: 0,
                boxShadow: 'none',
              }}
            >
              {selected ? (
                <span
                  className="material-symbols-outlined"
                  aria-hidden
                  style={{
                    color: checkFg,
                    fontSize: 16,
                    fontVariationSettings: "'FILL' 1, 'wght' 500",
                  }}
                >
                  check
                </span>
              ) : null}
            </button>
          );
        })}
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

      <div>
        <CmsFieldLabel
          title="Default colors"
          hint="The neutral colors used across your site."
        />
        <div
          role="group"
          aria-label="Default neutral colors, read-only"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            gap: 0,
            padding: 0,
          }}
        >
          {neutralScaleHexes.slice(1, -1).map((hexValue, i) => (
            <div
              key={`${hexValue}-${i}`}
              title={`${hexValue} (reference)`}
              aria-hidden
              style={{
                flex: '0 0 32px',
                width: 32,
                height: 32,
                background: hexValue,
                boxShadow: 'none',
                borderRadius: 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>

    {/* 3. Color usage — last subsection */}
    <div>
      <CmsFieldLabel
        title="Color usage"
        hint="Choose how your brand colors are applied to the UI."
      />
      <K15tRadioGroup.Root
        aria-label="Color usage"
        value={colorCoverage}
        onChange={v => setColorCoverage(v as ColorCoverageMode)}
      >
        <K15tRadioGroup.Item value="minimal" label="Minimal" />
        <K15tRadioGroup.Item value="subtle" label="Subtle" />
        <K15tRadioGroup.Item value="standard" label="Standard" />
      </K15tRadioGroup.Root>
    </div>

    <CustomColorsCard />
  </>
  );
};
