import React from 'react';
import type { ScaleDiagnostic } from '@/lib/color-engine';
import type { ColorModeSetting } from '@/lib/ThemeContext';
import { useTheme } from '@/lib/ThemeContext';
import { CMS, SECTION_GAP } from './constants';
import { CmsFieldLabel, cmsSelectStyle, CmsToggleRow } from './cms-ui';

export interface DesignColorCardProps {
  hex: string;
  isDark: boolean;
  inputValue: string;
  handleHexInput: (val: string) => void;
  setPlaygroundHex: (v: string) => void;
  setInputValue: (v: string) => void;
  diagnostics: ScaleDiagnostic[];
  accentSelectedStep: number;
  neutralScaleHexes: string[];
  panelBorder: string;
  panelFg: string;
  panelMuted: string;
  panelDrawerBg: string;
  showcaseRampDivider: string;
  showAdvanced: boolean;
  setShowAdvanced: React.Dispatch<React.SetStateAction<boolean>>;
  alphaOnBg: { step: number; a50: string; a15: string }[];
  applyBrandColor: boolean;
  setApplyBrandColor: (v: boolean) => void;
}

function subsectionDivider(panelBorder: string) {
  return {
    borderTop: `1px solid ${panelBorder}`,
    paddingTop: SECTION_GAP,
    marginTop: SECTION_GAP,
  } as const;
}

/** Design tab — Color: mode; apply brand (with brand + advanced nested when on); default reference strip. */
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
  showcaseRampDivider,
  showAdvanced,
  setShowAdvanced,
  alphaOnBg,
  applyBrandColor,
  setApplyBrandColor,
}) => {
  const { colorModeSetting, setColorModeSetting } = useTheme();

  return (
  <>
    {/* 1. Color mode */}
    <div>
      <CmsFieldLabel
        title="Color mode"
        hint="Sets whether your site supports light mode, dark mode, or both. When both are enabled, visitors can switch using the toggle in the site header."
      />
      <select
        aria-label="Color mode"
        value={colorModeSetting}
        onChange={e => setColorModeSetting(e.target.value as ColorModeSetting)}
        style={cmsSelectStyle}
      >
        <option value="light-only">Light mode only</option>
        <option value="dark-only">Dark mode only</option>
        <option value="light-and-dark">Light and dark mode</option>
      </select>
    </div>

    {/* 2. Apply brand color — Brand color + Advanced are part of this group when on */}
    <div style={subsectionDivider(panelBorder)}>
      <CmsToggleRow
        label="Apply brand color"
        description="When off, your site uses the default colors below. Search and interactive highlights still use your brand color."
        checked={applyBrandColor}
        onChange={setApplyBrandColor}
        dividerTop={false}
      />
      {applyBrandColor ? (
        <div style={{ marginTop: SECTION_GAP }}>
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
              aria-label="Brand color hex value"
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
              aria-label="Pick brand color with color picker"
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
          aria-label="Accent palette derived from your brand color; click a step to set the base color"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            borderRadius: 8,
            overflow: 'hidden',
            border: `1px solid ${panelBorder}`,
            minHeight: 52,
            background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
          }}
        >
          {diagnostics.map((s, i) => {
            const selected = s.step === accentSelectedStep;
            const barH = selected ? 46 : 32;
            const isAnchorStep = s.step === 9;
            const title =
              selected && isAnchorStep
                ? `${s.hex} — Your color (step 9)`
                : selected
                  ? `${s.hex} — selected`
                  : isAnchorStep
                    ? `${s.hex} — step 9 (accent anchor)`
                    : s.hex;
            return (
              <React.Fragment key={s.step}>
                {i > 0 ? (
                  <div
                    style={{
                      width: 1,
                      flexShrink: 0,
                      alignSelf: 'stretch',
                      minHeight: barH,
                      background: showcaseRampDivider,
                    }}
                  />
                ) : null}
                <button
                  type="button"
                  title={title}
                  onClick={() => {
                    setPlaygroundHex(s.hex);
                    setInputValue(s.hex);
                  }}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    border: 'none',
                    padding: '0 0 4px',
                    cursor: 'pointer',
                    background: 'transparent',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      width: '100%',
                      height: barH,
                      background: s.hex,
                      borderRadius: selected ? 3 : 2,
                      boxShadow: selected
                        ? isDark
                          ? '0 0 0 2px #fafafa'
                          : '0 0 0 2px #18181b'
                        : undefined,
                    }}
                  />
                </button>
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: panelMuted, marginTop: 10, lineHeight: 1.4 }}>
          Step 9 is your brand color. The full scale is derived from it.
        </div>

        {/* Advanced — same block as Brand color (no rule above) */}
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
        </div>
      ) : null}
    </div>

    {/* 3. Default colors — read-only reference, always visible */}
    <div style={subsectionDivider(panelBorder)}>
      <CmsFieldLabel
        title="Default colors"
        hint="Shown for reference only. These colors are applied across your site when brand color is off."
      />
      <div
        role="group"
        aria-label="Default neutral colors, read-only"
        style={{
          display: 'flex',
          alignItems: 'stretch',
          borderRadius: 8,
          overflow: 'hidden',
          border: `1px dashed ${panelBorder}`,
          minHeight: 36,
          opacity: 0.95,
        }}
      >
        {neutralScaleHexes.map((hexValue, i) => (
          <React.Fragment key={`${hexValue}-${i}`}>
            {i > 0 ? <div style={{ width: 1, background: showcaseRampDivider, flexShrink: 0 }} /> : null}
            <div
              title={`${hexValue} (reference)`}
              style={{ flex: 1, minWidth: 0, minHeight: 36, background: hexValue }}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  </>
  );
};
