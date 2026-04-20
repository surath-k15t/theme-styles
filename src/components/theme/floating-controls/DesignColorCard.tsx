import React from 'react';
import type { ScaleDiagnostic } from '@/lib/color-engine';
import type { ColorCoverageMode } from '@/lib/colorCoverage';
import type { ColorModeSetting } from '@/lib/ThemeContext';
import { useTheme } from '@/lib/ThemeContext';
import { CMS, SECTION_GAP } from './constants';
import { CmsFieldLabel, cmsSelectStyle, CmsToggleRow } from './cms-ui';
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

function subsectionDivider(panelBorder: string) {
  return {
    borderTop: `1px solid ${panelBorder}`,
    paddingTop: SECTION_GAP,
    marginTop: SECTION_GAP,
  } as const;
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
    {/* 1. Color mode */}
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

    {/* 2. Brand color, accent ramp, Advanced, Default colors */}
    <div style={subsectionDivider(panelBorder)}>
      <CmsFieldLabel
        title="Brand color"
        hint="Your brand color generates the accent scale used across your site."
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <input
          id="design-brand-hex"
          type="text"
          value={inputValue}
          onChange={e => handleHexInput(e.target.value)}
          placeholder="#0e305c"
          aria-label="Accent color hex value"
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
          value={hex}
          onChange={e => {
            setPlaygroundHex(e.target.value);
            setInputValue(e.target.value);
          }}
          aria-label="Pick accent color with color picker"
          style={{
            width: 36,
            height: 32,
            borderRadius: 6,
            border: `1px solid ${panelBorder}`,
            cursor: 'pointer',
            padding: 2,
            background: 'transparent',
          }}
        />
      </div>
      <div
        role="group"
        aria-label="Brand color palette; selected step shows a checkmark with large rounded corners"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'stretch',
          gap: 0,
          width: '100%',
          minWidth: 0,
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
                flex: '1 1 0',
                minWidth: 0,
                width: '100%',
                aspectRatio: '1',
                height: 'auto',
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
                  style={{ color: checkFg, fontSize: 16, fontWeight: 700 }}
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
            <div style={{ marginTop: SECTION_GAP }}>
              <CmsToggleRow
                label="Advanced"
                description="View the full color scale values and alpha variants."
                checked={showAdvanced}
                onChange={setShowAdvanced}
                dividerTop={false}
              />
              {showAdvanced ? (
                <div
                  style={{
                    borderRadius: 10,
                    background: panelDrawerBg,
                    border: `1px solid ${panelBorder}`,
                    padding: 12,
                    marginTop: 12,
                    maxHeight: 220,
                    overflowY: 'auto',
                    color: panelFg,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 10,
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
                      <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 11, color: panelMuted }}>
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
                            style={{ textAlign: 'left', padding: '3px 4px 6px', color: panelMuted, fontWeight: 600 }}
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

      <div style={{ marginTop: SECTION_GAP }}>
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
            justifyContent: 'stretch',
            gap: 0,
            width: '100%',
            minWidth: 0,
            padding: 0,
          }}
        >
          {neutralScaleHexes.slice(1, -1).map((hexValue, i) => (
            <div
              key={`${hexValue}-${i}`}
              title={`${hexValue} (reference)`}
              aria-hidden
              style={{
                flex: '1 1 0',
                minWidth: 0,
                width: '100%',
                aspectRatio: '1',
                height: 'auto',
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
    <div style={subsectionDivider(panelBorder)}>
      <CmsFieldLabel
        title="Color usage"
        hint="Choose how your brand colors are applied to the UI."
      />
      <div
        role="radiogroup"
        aria-label="Color usage"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
      >
        {(
          [
            { id: 'minimal' as const, label: 'Minimal' },
            { id: 'subtle' as const, label: 'Subtle' },
            { id: 'standard' as const, label: 'Standard' },
          ] as const
        ).map(({ id, label }) => {
          const selected = colorCoverage === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setColorCoverage(id)}
              style={{
                flex: '1 1 90px',
                minWidth: 0,
                padding: '8px 10px',
                borderRadius: 4,
                border: `2px solid ${selected ? CMS.primary : CMS.border}`,
                background: selected ? 'rgba(12, 102, 228, 0.08)' : CMS.inputBg,
                color: CMS.text,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Inter', ui-sans-serif, sans-serif",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>

    <CustomColorsCard panelBorder={panelBorder} panelFg={panelFg} />
  </>
  );
};
