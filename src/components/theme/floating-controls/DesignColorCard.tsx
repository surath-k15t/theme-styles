import React, { useMemo } from 'react';
import {
  materialAllToneShades,
  materialPinnedPrimaryStep,
  materialSeedHctTone,
  materialToneAtDisplayStep,
  type ScaleDiagnostic,
} from '@/lib/color-engine';
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

/** M2-style shade numbers for a row ordered dark (left) → light (right), 12 columns. */
const M2_SHADE_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

function m2ShadeLabelDarkLeft(visualIndex: number): string {
  const j = Math.round(((11 - visualIndex) / 11) * (M2_SHADE_STOPS.length - 1));
  return String(M2_SHADE_STOPS[Math.max(0, Math.min(M2_SHADE_STOPS.length - 1, j))]!);
}

const RAMP_RECT_H = 36;
const RAMP_CIRCLE = 42;

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
  const primaryPinStep = materialPinnedPrimaryStep(hex);
  const seedHctTone = materialSeedHctTone(hex);
  const rampToneAtKey = materialToneAtDisplayStep(primaryPinStep, isDark);

  /** M2-style strip: dark on the left, light on the right (light mode array is reversed). */
  const rampDisplayOrder = useMemo(
    () => (isDark ? diagnostics : [...diagnostics].reverse()),
    [diagnostics, isDark],
  );
  const allToneShades = useMemo(() => materialAllToneShades(hex), [hex]);

  return (
  <>
    {/* 1. Color mode */}
    <div>
      <CmsFieldLabel
        title="Color mode"
        hint="Whether your site supports light mode, dark mode, or both."
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
        description="Use a custom brand color for your site"
        checked={applyBrandColor}
        onChange={setApplyBrandColor}
        dividerTop={false}
      />
      {applyBrandColor ? (
        <div style={{ marginTop: SECTION_GAP }}>
          <CmsFieldLabel
            title="Brand color"
              hint="Pick the brand color to match your site's brand identity. A full color scale is generated from it."
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
        <div>
          <div
            style={{
              fontWeight: 600,
              fontSize: 10,
              color: panelMuted,
              marginBottom: 8,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Primary
          </div>
          <div
            role="group"
            aria-label="Primary palette from brand color; click a swatch to use that shade"
            style={{
              display: 'flex',
              alignItems: 'stretch',
              borderRadius: 8,
              overflow: 'hidden',
              border: `1px solid ${panelBorder}`,
              background: isDark ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 0.03)',
            }}
          >
            {rampDisplayOrder.map((s, visualIndex) => {
              const selected = s.step === accentSelectedStep;
              const isKeyColorStep = s.step === primaryPinStep;
              const tone = materialToneAtDisplayStep(s.step, isDark);
              const shadeLabel = m2ShadeLabelDarkLeft(visualIndex);
              const seedToneLabel = seedHctTone != null ? `${Math.round(seedHctTone)}` : '?';
              const lightSurface = Math.round(tone) >= 88;
              const pGlyphColor = lightSurface ? '#1a1a1a' : '#fff';
              const pGlyphShadow = lightSurface ? undefined : '0 0 2px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.25)';
              const title =
                selected && isKeyColorStep
                  ? `${s.hex} — primary (your color, HCT ${seedToneLabel})`
                  : selected
                    ? `${s.hex} — selected`
                    : isKeyColorStep
                      ? `${s.hex} — primary (step ${primaryPinStep}, nominal T${Math.round(rampToneAtKey)})`
                      : s.hex;

              return (
                <button
                  key={s.step}
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
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    justifyContent: 'flex-end',
                    border: 'none',
                    padding: 0,
                    margin: 0,
                    cursor: 'pointer',
                    background: 'transparent',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      minHeight: RAMP_CIRCLE + 6,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      padding: isKeyColorStep ? '0 5px' : 0,
                      boxSizing: 'border-box',
                    }}
                  >
                    {isKeyColorStep ? (
                      <div
                        style={{
                          width: RAMP_CIRCLE,
                          height: RAMP_CIRCLE,
                          borderRadius: '50%',
                          background: s.hex,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: pGlyphColor,
                          fontWeight: 700,
                          fontSize: 15,
                          lineHeight: 1,
                          fontFamily: "'Inter', ui-sans-serif, sans-serif",
                          boxShadow:
                            selected && isDark
                              ? '0 0 0 2px #fafafa, 0 2px 8px rgba(0,0,0,0.25)'
                              : selected
                                ? '0 0 0 2px #18181b, 0 2px 8px rgba(0,0,0,0.2)'
                                : '0 2px 8px rgba(0,0,0,0.2)',
                          textShadow: pGlyphShadow,
                        }}
                      >
                        P
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: RAMP_RECT_H,
                          background: s.hex,
                          alignSelf: 'stretch',
                          boxShadow: selected
                            ? isDark
                              ? `inset 0 0 0 2px #fafafa`
                              : `inset 0 0 0 2px #18181b`
                            : undefined,
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      padding: '6px 2px 8px',
                      textAlign: 'center',
                      borderTop: `1px solid ${showcaseRampDivider}`,
                      background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(250,250,250,0.95)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: panelFg,
                        lineHeight: 1.2,
                      }}
                    >
                      {shadeLabel}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 500,
                        color: panelMuted,
                        marginTop: 2,
                        fontFamily: "'PT Mono', monospace",
                      }}
                    >
                      T{Math.round(tone)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: SECTION_GAP }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 10,
              color: panelMuted,
              marginBottom: 8,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            All generated shades (T100 to T0)
          </div>
          <div
            role="group"
            aria-label="All generated Material shades; click a swatch to use that shade"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
              gap: 6,
            }}
          >
            {allToneShades.map(({ tone, hex: shadeHex }) => {
              const selected = shadeHex.toLowerCase() === hex.toLowerCase();
              return (
                <button
                  key={tone}
                  type="button"
                  title={`${shadeHex} — T${tone}`}
                  onClick={() => {
                    setPlaygroundHex(shadeHex);
                    setInputValue(shadeHex);
                  }}
                  style={{
                    border: selected
                      ? isDark
                        ? '2px solid #fafafa'
                        : '2px solid #18181b'
                      : `1px solid ${panelBorder}`,
                    borderRadius: 6,
                    padding: 0,
                    margin: 0,
                    cursor: 'pointer',
                    background: 'transparent',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ height: 26, background: shadeHex }} />
                  <div
                    style={{
                      padding: '3px 2px',
                      fontSize: 9,
                      fontWeight: 600,
                      lineHeight: 1.1,
                      color: panelMuted,
                      fontFamily: "'PT Mono', monospace",
                    }}
                  >
                    T{tone}
                  </div>
                </button>
              );
            })}
          </div>
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
        hint="The default color scale applied across your site when brand color is off."
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
