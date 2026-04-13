import React from 'react';
import type { ScaleDiagnostic } from '@/lib/color-engine';
import { CMS, SECTION_GAP } from './constants';
import { CmsToggleRow } from './cms-ui';
import { AppearanceBtn, MoonIcon, pillToggleStyle, SunIcon } from './mode-toggle';

export interface DesignColorCardProps {
  hex: string;
  isDark: boolean;
  inputValue: string;
  handleHexInput: (val: string) => void;
  setPlaygroundHex: (v: string) => void;
  setPlaygroundIsDark: (v: boolean) => void;
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
  showNeutralScale: boolean;
  setShowNeutralScale: React.Dispatch<React.SetStateAction<boolean>>;
  alphaOnBg: { step: number; a50: string; a15: string }[];
  applyBrandColor: boolean;
  setApplyBrandColor: (v: boolean) => void;
}

function sectionLabel(text: string, panelFg: string) {
  return (
    <div
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: panelFg,
        marginBottom: 10,
        letterSpacing: '-0.01em',
      }}
    >
      {text}
    </div>
  );
}

/** Design tab — Color: accent ramp, neutral scale, light/dark, advanced diagnostics. */
export const DesignColorCard: React.FC<DesignColorCardProps> = ({
  hex,
  isDark,
  inputValue,
  handleHexInput,
  setPlaygroundHex,
  setPlaygroundIsDark,
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
  showNeutralScale,
  setShowNeutralScale,
  alphaOnBg,
  applyBrandColor,
  setApplyBrandColor,
}) => (
  <>
    {/* Accent color — continuous strip palette */}
    <div style={{ marginBottom: SECTION_GAP }}>
      {sectionLabel('Accent color', panelFg)}
      <div
        role="group"
        aria-label="Chromatic palette, click a step to set base color"
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
                title={s.hex}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <input
          type="text"
          value={inputValue}
          onChange={e => handleHexInput(e.target.value)}
          placeholder="#157F78"
          aria-label="Base hex color"
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
          aria-label="Pick base color"
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
    </div>

    {/* Neutral scale — fixed 12-step ramp (theme tokens `--gray-*`) */}
    <div style={{ marginBottom: SECTION_GAP }}>
      {sectionLabel('Neutral scale', panelFg)}
      <div
        aria-hidden
        style={{
          display: 'flex',
          alignItems: 'stretch',
          borderRadius: 8,
          overflow: 'hidden',
          border: `1px solid ${panelBorder}`,
          minHeight: 36,
        }}
      >
        {neutralScaleHexes.map((hexValue, i) => (
          <React.Fragment key={`${hexValue}-${i}`}>
            {i > 0 ? <div style={{ width: 1, background: showcaseRampDivider, flexShrink: 0 }} /> : null}
            <div title={hexValue} style={{ flex: 1, minWidth: 0, minHeight: 36, background: hexValue }} />
          </React.Fragment>
        ))}
      </div>
      <div style={{ fontSize: 11, color: panelMuted, marginTop: 8, lineHeight: 1.4 }}>
        Fixed neutral ramp for this mode (same tokens as the rest of the UI).
      </div>
    </div>

    <div style={{ marginBottom: SECTION_GAP }}>
      <CmsToggleRow
        label="Apply brand color"
        description="Off uses the neutral scale for resting UI; hovers and search accent stay on your picked color."
        checked={applyBrandColor}
        onChange={setApplyBrandColor}
        dividerTop={false}
      />
    </div>

    <div style={{ display: 'flex', gap: 8, marginBottom: SECTION_GAP }}>
      <AppearanceBtn selected={!isDark} onClick={() => setPlaygroundIsDark(false)}>
        <SunIcon muted={!isDark ? CMS.primary : CMS.textMuted} />
        Light
      </AppearanceBtn>
      <AppearanceBtn selected={isDark} onClick={() => setPlaygroundIsDark(true)}>
        <MoonIcon muted={isDark ? CMS.primary : CMS.textMuted} />
        Dark
      </AppearanceBtn>
    </div>

    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={() => setShowAdvanced(v => !v)}
          style={pillToggleStyle(showAdvanced, panelBorder, panelFg, panelMuted)}
        >
          Advanced
        </button>
        <button
          type="button"
          onClick={() => setShowNeutralScale(v => !v)}
          style={pillToggleStyle(showNeutralScale, panelBorder, panelFg, panelMuted)}
        >
          Neutral ramp
        </button>
      </div>
    </div>

    {(showAdvanced || showNeutralScale) && (
      <div
        style={{
          borderRadius: 10,
          background: panelDrawerBg,
          border: `1px solid ${panelBorder}`,
          padding: 12,
          marginBottom: 14,
          maxHeight: 200,
          overflowY: 'auto',
          color: panelFg,
        }}
      >
        {showAdvanced && (
          <div style={{ marginBottom: showNeutralScale ? 14 : 0 }}>
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
              Advanced
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
        )}

        {showNeutralScale && (
          <div>
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
              Neutral ramp
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'stretch',
                gap: 0,
                borderRadius: 8,
                overflow: 'hidden',
                border: `1px solid ${panelBorder}`,
              }}
            >
              {neutralScaleHexes.map((hexValue, i) => (
                <React.Fragment key={`${hexValue}-${i}`}>
                  {i > 0 ? <div style={{ width: 1, background: showcaseRampDivider, flexShrink: 0 }} /> : null}
                  <div title={hexValue} style={{ flex: 1, minWidth: 0, height: 28, background: hexValue }} />
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    )}
  </>
);
