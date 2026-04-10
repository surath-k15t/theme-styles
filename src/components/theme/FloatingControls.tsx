import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { presets } from '@/lib/presets';
import type { PresetId } from '@/lib/presets';
import { spacingSchemes } from '@/lib/presets/spacingSchemes';
import type { ThemeRadiusTier } from '@/lib/ThemeContext';
import { THEME_RADIUS_TIER_VALUES } from '@/lib/ThemeContext';
import {
  alphaVariantMatchingSolid,
  generateDarkScale,
  generateScale,
  neutralSolidsForMode,
} from '@/lib/color-engine';

const THEME_PANEL_WIDTH = 480;
const SECTION_GAP = 20;

const PLAYGROUND_HEX_KEY = 'color-engine:hex';
const PLAYGROUND_INPUT_KEY = 'color-engine:input';
const PLAYGROUND_IS_DARK_KEY = 'color-engine:isDark';

function getSessionString(key: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return window.sessionStorage.getItem(key) ?? fallback;
}

function getSessionBool(key: string, fallback: boolean): boolean {
  if (typeof window === 'undefined') return fallback;
  const raw = window.sessionStorage.getItem(key);
  if (raw == null) return fallback;
  return raw === 'true';
}

const RADIUS_TIERS: ThemeRadiusTier[] = ['none', 'small', 'medium', 'large', 'full'];
const RADIUS_LABELS: Record<ThemeRadiusTier, string> = {
  none: 'None',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  full: 'Full',
};

// ─── FloatingControls ─────────────────────────────────────────────────────────

const FloatingControls: React.FC = () => {
  const { preset, mode, showDescription, setShowDescription, showDebug, setShowDebug } = useTheme();

  return (
    <>
      {showDebug && <DebugStrip preset={preset} mode={mode} />}
      {showDescription && <DescriptionPanel preset={preset} />}
      <ThemeSidePanel
        showDescription={showDescription}
        setShowDescription={setShowDescription}
        showDebug={showDebug}
        setShowDebug={setShowDebug}
      />
    </>
  );
};

// ─── Radix-style theme panel (right, vertical) ────────────────────────────────

const ThemeSidePanel: React.FC<{
  showDescription: boolean;
  setShowDescription: (v: boolean) => void;
  showDebug: boolean;
  setShowDebug: (v: boolean) => void;
}> = ({ showDescription, setShowDescription, showDebug, setShowDebug }) => {
  const playgroundConfig = presets.playground;
  const {
    playgroundHex,
    setPlaygroundHex,
    playgroundIsDark,
    setPlaygroundIsDark,
    themeRadiusTier,
    setThemeRadiusTier,
  } = useTheme();

  const [inputValue, setInputValue] = useState(() =>
    getSessionString(PLAYGROUND_INPUT_KEY, playgroundHex),
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showNeutralScale, setShowNeutralScale] = useState(false);

  const hex = playgroundHex;
  const isDark = playgroundIsDark;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(PLAYGROUND_INPUT_KEY, inputValue);
  }, [inputValue]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(PLAYGROUND_HEX_KEY, playgroundHex);
  }, [playgroundHex]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(PLAYGROUND_IS_DARK_KEY, String(playgroundIsDark));
  }, [playgroundIsDark]);

  useEffect(() => {
    const savedHex = getSessionString(PLAYGROUND_HEX_KEY, playgroundHex);
    const savedDark = getSessionBool(PLAYGROUND_IS_DARK_KEY, playgroundIsDark);
    if (savedHex !== playgroundHex) setPlaygroundHex(savedHex);
    if (savedDark !== playgroundIsDark) setPlaygroundIsDark(savedDark);
    if (inputValue !== savedHex) setInputValue(savedHex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { diagnostics, brandStep } = useMemo(() => {
    if (isDark) {
      const { diagnostics: steps } = generateDarkScale(hex);
      return { diagnostics: steps, brandStep: 9 };
    }
    const { diagnostics: rows } = generateScale(hex);
    return { diagnostics: rows, brandStep: 9 };
  }, [hex, isDark]);

  const alphaOnBg = useMemo(() => {
    if (diagnostics.length < 1) return [];
    const step1 = diagnostics[0].hex;
    return [3, 9, 11]
      .filter(step => step <= diagnostics.length)
      .map(step => {
        const solid = diagnostics[step - 1].hex;
        return {
          step,
          a50: alphaVariantMatchingSolid(solid, step1, 0.5),
          a15: alphaVariantMatchingSolid(solid, step1, 0.15),
        };
      });
  }, [diagnostics]);

  const neutralScaleHexes = neutralSolidsForMode(isDark);

  const border = isDark ? '#3f3f46' : '#e4e4e7';
  const fg = isDark ? '#fafafa' : '#18181b';
  const muted = isDark ? '#a1a1aa' : '#71717a';
  const panelBg = isDark ? 'rgba(24,24,27,0.92)' : 'rgba(255,255,255,0.96)';
  const rampDivider = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
  const drawerBg = isDark ? 'rgba(39,39,42,0.98)' : 'rgba(250,250,250,0.98)';

  function handleHexInput(val: string) {
    setInputValue(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) setPlaygroundHex(val);
  }

  const normalizedHex = hex.replace(/^#/, '').toLowerCase();
  const accentSelectedStep = useMemo(() => {
    const idx = diagnostics.findIndex(s => s.hex.replace(/^#/, '').toLowerCase() === normalizedHex);
    if (idx >= 0) return diagnostics[idx].step;
    return brandStep;
  }, [diagnostics, normalizedHex, brandStep]);

  if (diagnostics.length < 12) return null;

  const sectionLabel = (text: string) => (
    <div
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: fg,
        marginBottom: 10,
        letterSpacing: '-0.01em',
      }}
    >
      {text}
    </div>
  );

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 16,
        zIndex: 9998,
        width: THEME_PANEL_WIDTH,
        maxWidth: 'calc(100vw - 32px)',
        maxHeight: 'calc(100vh - 48px)',
        overflowY: 'auto',
        fontFamily: "'Inter', ui-sans-serif, sans-serif",
        borderRadius: 12,
        border: `1px solid ${border}`,
        background: panelBg,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.45)' : '0 12px 40px rgba(0,0,0,0.12)',
        padding: '16px 16px 18px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: SECTION_GAP,
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: fg, letterSpacing: '-0.02em' }}>Theme</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: playgroundConfig.swatchColor,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 12, color: muted, fontWeight: 500 }}>{playgroundConfig.name}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <HeaderIconBtn
            title="Toggle description"
            ariaLabel="Description"
            onClick={() => setShowDescription(!showDescription)}
            active={showDescription}
            isDark={isDark}
          >
            ⓘ
          </HeaderIconBtn>
          <HeaderIconBtn
            title="Toggle debug strip"
            ariaLabel="Debug"
            onClick={() => setShowDebug(!showDebug)}
            active={showDebug}
            isDark={isDark}
          >
            {'{}'}
          </HeaderIconBtn>
        </div>
      </div>

      {/* Accent color — continuous strip palette */}
      <div style={{ marginBottom: SECTION_GAP }}>
        {sectionLabel('Accent color')}
        <div
          role="group"
          aria-label="Chromatic palette, click a step to set base color"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            borderRadius: 8,
            overflow: 'hidden',
            border: `1px solid ${border}`,
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
                      background: rampDivider,
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
              border: `1px solid ${border}`,
              background: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.04)',
              color: fg,
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
              border: `1px solid ${border}`,
              cursor: 'pointer',
              padding: 2,
              background: 'transparent',
            }}
          />
        </div>
      </div>

      {/* Gray — neutral ramp as palette strip */}
      <div style={{ marginBottom: SECTION_GAP }}>
        {sectionLabel('Gray color')}
        <div
          aria-hidden
          style={{
            display: 'flex',
            alignItems: 'stretch',
            borderRadius: 8,
            overflow: 'hidden',
            border: `1px solid ${border}`,
            minHeight: 36,
          }}
        >
          {neutralScaleHexes.map((hexValue, i) => (
            <React.Fragment key={`${hexValue}-${i}`}>
              {i > 0 ? <div style={{ width: 1, background: rampDivider, flexShrink: 0 }} /> : null}
              <div
                title={hexValue}
                style={{ flex: 1, minWidth: 0, minHeight: 36, background: hexValue }}
              />
            </React.Fragment>
          ))}
        </div>
        <div style={{ fontSize: 11, color: muted, marginTop: 8, lineHeight: 1.4 }}>
          Fixed neutral ramp for this mode (same as app grays).
        </div>
      </div>

      {/* Advanced */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => setShowAdvanced(v => !v)}
            style={pillToggleStyle(showAdvanced, isDark, border, fg, muted)}
          >
            Advanced
          </button>
          <button
            type="button"
            onClick={() => setShowNeutralScale(v => !v)}
            style={pillToggleStyle(showNeutralScale, isDark, border, fg, muted)}
          >
            Neutral strip
          </button>
        </div>
      </div>

      {(showAdvanced || showNeutralScale) && (
        <div
          style={{
            borderRadius: 10,
            background: drawerBg,
            border: `1px solid ${border}`,
            padding: 12,
            marginBottom: 14,
            maxHeight: 200,
            overflowY: 'auto',
            color: fg,
          }}
        >
          {showAdvanced && (
            <div style={{ marginBottom: showNeutralScale ? 14 : 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 10,
                  color: muted,
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Advanced
              </div>
              {!isDark && alphaOnBg.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 11, color: muted }}>
                    Alpha variants
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                    {alphaOnBg.map(({ step, a50, a15 }) => (
                      <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: "'PT Mono', monospace", fontSize: 10 }}>S{step}</span>
                        <span
                          title={a50}
                          style={{
                            width: 24,
                            height: 14,
                            borderRadius: 3,
                            background: a50,
                            border: `1px solid ${border}`,
                          }}
                        />
                        <span
                          title={a15}
                          style={{
                            width: 24,
                            height: 14,
                            borderRadius: 3,
                            background: a15,
                            border: `1px solid ${border}`,
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
                  <tr style={{ borderBottom: `1px solid ${border}` }}>
                    {['#', 'L', 'C', 'Hex'].map(col => (
                      <th key={col} style={{ textAlign: 'left', padding: '3px 4px 6px', color: muted, fontWeight: 600 }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {diagnostics.map(s => (
                    <tr key={s.step} style={{ borderBottom: `1px solid ${border}33` }}>
                      <td style={{ padding: '4px', color: muted }}>{s.step}</td>
                      <td style={{ padding: '4px', color: fg }}>{s.l.toFixed(3)}</td>
                      <td style={{ padding: '4px', color: fg }}>{s.c.toFixed(4)}</td>
                      <td style={{ padding: '4px', color: fg }}>{s.hex}</td>
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
                  color: muted,
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Fixed neutral ramp
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: 0,
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: `1px solid ${border}`,
                }}
              >
                {neutralScaleHexes.map((hexValue, i) => (
                  <React.Fragment key={`${hexValue}-${i}`}>
                    {i > 0 ? <div style={{ width: 1, background: rampDivider, flexShrink: 0 }} /> : null}
                    <div title={hexValue} style={{ flex: 1, minWidth: 0, height: 28, background: hexValue }} />
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Appearance */}
      <div style={{ marginBottom: SECTION_GAP }}>
        {sectionLabel('Appearance')}
        <div style={{ display: 'flex', gap: 8 }}>
          <AppearanceBtn
            selected={!isDark}
            onClick={() => setPlaygroundIsDark(false)}
            isDark={isDark}
            borderColor={border}
          >
            <SunIcon muted={muted} />
            Light
          </AppearanceBtn>
          <AppearanceBtn
            selected={isDark}
            onClick={() => setPlaygroundIsDark(true)}
            isDark={isDark}
            borderColor={border}
          >
            <MoonIcon muted={muted} />
            Dark
          </AppearanceBtn>
        </div>
      </div>

      {/* Radius */}
      <div style={{ marginBottom: 0 }}>
        {sectionLabel('Radius')}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {RADIUS_TIERS.map(tier => {
            const selected = themeRadiusTier === tier;
            const r = THEME_RADIUS_TIER_VALUES[tier];
            const previewR = tier === 'none' ? 0 : Math.min(10, 2 + r * 0.8);
            return (
              <button
                key={tier}
                type="button"
                onClick={() => setThemeRadiusTier(tier)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 6px',
                  minWidth: 48,
                  borderRadius: 8,
                  border: selected ? `2px solid ${fg}` : `1px solid ${border}`,
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  color: fg,
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    background: isDark ? '#3f3f46' : '#e4e4e7',
                    borderRadius: previewR,
                  }}
                />
                <span style={{ fontSize: 10, fontWeight: 600, color: muted }}>{RADIUS_LABELS[tier]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function pillToggleStyle(
  active: boolean,
  isDark: boolean,
  border: string,
  fg: string,
  muted: string,
): React.CSSProperties {
  return {
    padding: '5px 10px',
    borderRadius: 8,
    border: `1px solid ${active ? fg : border}`,
    cursor: 'pointer',
    fontSize: 11,
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    background: active ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)') : 'transparent',
    color: active ? fg : muted,
  };
}

const HeaderIconBtn: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  ariaLabel: string;
  active?: boolean;
  isDark: boolean;
}> = ({ children, onClick, title, ariaLabel, active, isDark }) => (
  <button
    type="button"
    title={title}
    aria-label={ariaLabel}
    onClick={onClick}
    style={{
      width: 32,
      height: 32,
      borderRadius: 6,
      border: `1px solid ${isDark ? '#3f3f46' : '#e4e4e7'}`,
      cursor: 'pointer',
      background: active ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)') : 'transparent',
      color: isDark ? '#a1a1aa' : '#52525b',
      fontSize: 13,
      fontFamily: "'PT Mono', ui-monospace, monospace",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {children}
  </button>
);

const AppearanceBtn: React.FC<{
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  isDark: boolean;
  borderColor: string;
}> = ({ children, selected, onClick, isDark, borderColor }) => (
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
      border: selected ? `2px solid ${isDark ? '#fafafa' : '#18181b'}` : `1px solid ${borderColor}`,
      background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
      color: isDark ? '#fafafa' : '#18181b',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: "'Inter', sans-serif",
    }}
  >
    {children}
  </button>
);

function SunIcon({ muted }: { muted: string }) {
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

function MoonIcon({ muted }: { muted: string }) {
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

// ─── Shared sub-components ────────────────────────────────────────────────────

const DescriptionPanel: React.FC<{ preset: PresetId }> = ({ preset }) => {
  const config = presets[preset];
  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        left: 24,
        zIndex: 9998,
        background: '#18181B',
        borderRadius: 12,
        padding: '20px 24px',
        maxWidth: 400,
        width: 'min(400px, calc(100vw - 48px))',
        maxHeight: 'calc(100vh - 48px)',
        overflowY: 'auto',
        boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ fontWeight: 700, color: '#FFF', fontSize: 15, marginBottom: 2 }}>{config.name}</div>
      <div style={{ fontStyle: 'italic', color: '#71717A', fontSize: 13, marginBottom: 10 }}>{config.subtitle}</div>
      <p style={{ color: '#A1A1AA', fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>{config.description}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {config.tags.map(tag => (
          <span
            key={tag}
            style={{
              padding: '2px 8px',
              borderRadius: 4,
              border: '1px solid #3F3F46',
              color: '#A1A1AA',
              fontSize: 11,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

/** Resolves a --ds-line-height-* CSS var reference to its numeric value */
const lhNum = (token: string): string => {
  const map: Record<string, string> = {
    'var(--ds-line-height-x-small)': '1.1',
    'var(--ds-line-height-small)': '1.3',
    'var(--ds-line-height-medium)': '1.5',
    'var(--ds-line-height-large)': '1.7',
    'var(--ds-line-height-x-large)': '1.9',
  };
  return map[token] ?? token;
};

const DebugStrip: React.FC<{ preset: PresetId; mode: string }> = ({ preset, mode }) => {
  const { themeRadiusTier } = useTheme();
  const config = presets[preset];
  const s = config.styles;
  const vars = config.cssVars;
  const scheme = spacingSchemes[s.spacingScheme];

  const hasIconBg = s.cardIconBackground !== 'none';
  const iconRender = hasIconBg ? Math.round(s.iconSize / 2) : s.iconSize;

  const tokens: { label: string; value: string; color?: string }[] = [
    { label: 'mode', value: mode },
    { label: 'scheme', value: s.spacingScheme },
    {
      label: 'icon',
      value: hasIconBg ? `${iconRender}px in ${s.iconSize}px` : `${iconRender}px`,
    },
    {
      label: 'roundness',
      value: `${THEME_RADIUS_TIER_VALUES[themeRadiusTier]} (${themeRadiusTier})`,
    },
    { label: 'primary', value: vars['--theme-primary-color'] ?? '—', color: vars['--theme-primary-color'] },
    { label: 'title LH', value: lhNum(scheme.cardTitleLineHeight) },
    { label: 'body LH', value: lhNum(scheme.cardBodyLineHeight) },
    { label: 'content LH', value: lhNum(vars['--theme-content-line-height'] ?? '—') },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9998,
        background: '#18181B',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        flexWrap: 'wrap',
        fontFamily: "'PT Mono', monospace",
        fontSize: 11,
      }}
    >
      {tokens.map(({ label, value, color }) => (
        <span key={label} style={{ color: '#71717A' }}>
          {label}: <span style={{ color: color ?? '#E4E4E7' }}>{value}</span>
        </span>
      ))}
    </div>
  );
};

export default FloatingControls;
