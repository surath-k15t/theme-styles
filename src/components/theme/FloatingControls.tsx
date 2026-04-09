import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { presets, presetOrder } from '@/lib/presets';
import type { PresetId } from '@/lib/presets';
import { spacingSchemes } from '@/lib/presets/spacingSchemes';
import { wcagContrast } from 'culori';
import {
  alphaVariantMatchingSolid,
  generateDarkScale,
  generateScale,
} from '@/lib/palette-generator';

// ─── FloatingControls ─────────────────────────────────────────────────────────

const FloatingControls: React.FC = () => {
  const { preset, mode, setPreset, showDescription, setShowDescription, showDebug, setShowDebug } = useTheme();

  const handlePresetSwitch = (id: PresetId) => {
    setPreset(id);
  };

  return (
    <>
      {/* Debug strip */}
      {showDebug && <DebugStrip preset={preset} mode={mode} />}

      {/* Description panel */}
      {showDescription && <DescriptionPanel preset={preset} />}

      {/* Colour palette playground — visible only when playground preset is active */}
      {preset === 'playground' && <ColorPalettePlayground />}

      {/* Switcher bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: '#000000ae',
          backdropFilter: 'blur(15px)',
          borderRadius: 14,
          padding: '6px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {presetOrder.map(id => {
          const p = presets[id];
          const active = preset === id;
          return (
            <button
              key={id}
              onClick={() => handlePresetSwitch(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                background: active ? '#FFFFFF' : 'transparent',
                color: active ? '#18181B' : '#A1A1AA',
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.15s',
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: p.swatchColor.startsWith('linear-gradient') ? p.swatchColor : p.swatchColor,
                  backgroundImage: p.id === 'aurora' ? 'linear-gradient(135deg, #ACEBED 0%, #CDDCFD 50%, #D4A6FF 100%)' : undefined,
                  border: p.swatchBorder ? '1.5px solid #71717A' : 'none',
                  flexShrink: 0,
                }}
              />
              {p.name}
            </button>
          );
        })}

        <Separator />

        <button
          onClick={() => setShowDescription(!showDescription)}
          style={iconBtnStyle(showDescription)}
          title="Toggle description"
        >
          ⓘ
        </button>

        <Separator />

        <button
          onClick={() => setShowDebug(!showDebug)}
          style={iconBtnStyle(showDebug)}
          title="Toggle debug strip"
        >
          {'{}'}
        </button>
      </div>
    </>
  );
};

// ─── Colour Palette Playground ────────────────────────────────────────────────

const STEP_LABELS = [
  'App bg', 'Subtle bg', 'UI', 'UI hover', 'UI active',
  'Separator', 'Border', 'Border h', 'Solid', 'Solid h',
  'Text', 'Text +',
];

const NEUTRAL_SCALE_LIGHT = [
  '#fcfcfc', '#f9f9f9', '#f0f0f0', '#e8e8e8', '#e1e1e1', '#d9d9d9',
  '#cecece', '#bbbbbb', '#8c8c8c', '#818181', '#636363', '#1f1f1f',
];

/** Matches `design-tokens.css` — [data-theme-root][data-mode="dark"] gray solids. */
const NEUTRAL_SCALE_DARK = [
  '#000', '#121212', '#1f1f1f', '#282828', '#303030', '#3a3a3a',
  '#474747', '#606060', '#6d6d6d', '#7a7a7a', '#b3b3b3', '#eee',
];

const PLAYGROUND_HEX_KEY = 'palette-playground:hex';
const PLAYGROUND_INPUT_KEY = 'palette-playground:input';
const PLAYGROUND_IS_DARK_KEY = 'palette-playground:isDark';

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

const ColorPalettePlayground: React.FC = () => {
  const {
    playgroundHex,
    setPlaygroundHex,
    playgroundIsDark,
    setPlaygroundIsDark,
    mode: siteMode,
  } = useTheme();
  const [inputValue, setInputValue] = useState(() =>
    getSessionString(PLAYGROUND_INPUT_KEY, playgroundHex),
  );
  const hex = playgroundHex;
  const isDark = playgroundIsDark;
  /* Dark ramp when previewing dark scale in the panel and/or site theme is dark (matches CSS `--gray-*`). */
  const neutralScaleHexes =
    isDark || siteMode === 'dark' ? NEUTRAL_SCALE_DARK : NEUTRAL_SCALE_LIGHT;
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showGeneratedScale, setShowGeneratedScale] = useState(false);
  const [showNeutralScale, setShowNeutralScale] = useState(false);

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
    // hydrate once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { diagnostics, brandStep } = useMemo(() => {
    if (isDark) {
      const { diagnostics: steps } = generateDarkScale(hex);
      return {
        diagnostics: steps,
        brandStep: 9,
      };
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

  // Local palette UI colours — independent of the site theme
  const bg      = isDark ? '#111113' : '#ffffff';
  const surface = isDark ? '#18181b' : '#ffffff';
  const border  = isDark ? '#2e2e32' : '#e4e4e7';
  const fg      = isDark ? '#e4e4e7' : '#18181b';
  const muted   = '#71717a';
  const sectionHeaderBg = isDark ? '#222227' : '#fafafa';

  function handleHexInput(val: string) {
    setInputValue(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) setPlaygroundHex(val);
  }

  /** Returns white or near-black — whichever reads better on the given swatch colour */
  function textOn(swatchHex: string): string {
    const onWhite = wcagContrast('#ffffff', swatchHex) ?? 1;
    const onBlack = wcagContrast('#18181b', swatchHex) ?? 1;
    return onWhite >= onBlack ? '#ffffff' : '#18181b';
  }

  if (diagnostics.length < 12) return null;

  return (
    <div style={{
      position: 'fixed',
      right: 24,
      top: 84,
      bottom: 92,
      width: 360,
      maxWidth: 'calc(100vw - 32px)',
      zIndex: 9990,
      overflowY: 'auto',
      background: bg,
      color: fg,
      fontFamily: "'Inter', ui-sans-serif, sans-serif",
      borderRadius: 14,
      border: `1px solid ${border}`,
      boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
    }}>
      <div style={{ padding: 14 }}>
        {/* Header */}
        <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>
              Palette Generator
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: muted }}>
              {isDark ? 'Dark scale' : 'Light scale'}
            </p>
          </div>
          <button
            onClick={() => setPlaygroundIsDark(!isDark)}
            style={{
              padding: '5px 9px',
              borderRadius: 7,
              border: `1px solid ${border}`,
              background: isDark ? '#3f3f46' : '#f4f4f5',
              color: fg,
              fontSize: 11,
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
            }}
          >
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: surface,
          borderRadius: 12,
          padding: '10px 12px',
          border: `1px solid ${border}`,
          marginBottom: 10,
        }}>
          <input
            type="text"
            value={inputValue}
            onChange={e => handleHexInput(e.target.value)}
            placeholder="#157F78"
            style={{
              fontFamily:   "'PT Mono', monospace",
              fontSize: 12,
              padding: '6px 8px',
              borderRadius: 7,
              border: `1px solid ${border}`,
              background: bg,
              color: fg,
              width: 102,
              outline: 'none',
            }}
          />
          <input
            type="color"
            value={hex}
            onChange={e => { setPlaygroundHex(e.target.value); setInputValue(e.target.value); }}
            style={{ width: 36, height: 32, borderRadius: 7, border: 'none', cursor: 'pointer', padding: 2 }}
          />
          <span style={{ marginLeft: 'auto', fontSize: 11, color: muted }}>
            Base color
          </span>
        </div>

        {/* Generated palette (collapsed by default) */}
        <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, marginBottom: 10, overflow: 'hidden' }}>
          <button
            type="button"
            onClick={() => setShowGeneratedScale(v => !v)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              border: 'none',
              borderBottom: showGeneratedScale ? `1px solid ${border}44` : 'none',
              background: sectionHeaderBg,
              color: fg,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              textAlign: 'left',
            }}
          >
            <span>Generated palette</span>
            <span style={{ color: muted }}>{showGeneratedScale ? 'Hide' : 'Show'}</span>
          </button>
          {showGeneratedScale && (
            <>
              {diagnostics.map((s, i) => {
                const txt = textOn(s.hex);
                const rowLabel = STEP_LABELS[i] ?? `Step ${s.step}`;
                const isBrand = s.step === brandStep;
                return (
                  <div
                    key={s.step}
                    title={`Step ${s.step} · ${s.hex}`}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '7px 9px',
                      borderTop: i === 0 ? 'none' : `1px solid ${border}44`,
                      background: 'transparent',
                      color: fg,
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        background: s.hex,
                        border: `1px solid ${border}`,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 11, color: muted, width: 14, fontFamily: "'PT Mono', monospace" }}>
                      {s.step}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: isBrand ? 700 : 500, flex: 1 }}>
                      {rowLabel}
                    </span>
                    <span style={{ fontSize: 11, fontFamily: "'PT Mono', monospace", color: txt === '#ffffff' ? '#16a34a' : '#52525b' }}>
                      {s.hex}
                    </span>
                  </div>
                );
              })}
              <div style={{ borderTop: `1px solid ${border}44` }}>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(v => !v)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    border: 'none',
                    borderBottom: showAdvanced ? `1px solid ${border}44` : 'none',
                    background: sectionHeaderBg,
                    color: fg,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>Advanced</span>
                  <span style={{ color: muted }}>{showAdvanced ? 'Hide' : 'Show'}</span>
                </button>
                {showAdvanced && (
                  <div style={{ padding: 10 }}>
                    {!isDark && alphaOnBg.length > 0 && (
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 11, color: muted }}>
                          Alpha variants
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                          {alphaOnBg.map(({ step, a50, a15 }) => (
                            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontFamily: "'PT Mono', monospace", fontSize: 10 }}>S{step}</span>
                              <span title={a50} style={{ width: 24, height: 14, borderRadius: 3, background: a50, border: `1px solid ${border}` }} />
                              <span title={a15} style={{ width: 24, height: 14, borderRadius: 3, background: a15, border: `1px solid ${border}` }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'PT Mono', monospace", fontSize: 10.5 }}>
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
              </div>
            </>
          )}
        </div>

        {/* Neutral scale (collapsed by default) */}
        <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, marginBottom: 10, overflow: 'hidden' }}>
          <button
            type="button"
            onClick={() => setShowNeutralScale(v => !v)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              border: 'none',
              borderBottom: showNeutralScale ? `1px solid ${border}44` : 'none',
              background: sectionHeaderBg,
              color: fg,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              textAlign: 'left',
            }}
          >
            <span>Neutral scale</span>
            <span style={{ color: muted }}>{showNeutralScale ? 'Hide' : 'Show'}</span>
          </button>
          {showNeutralScale && neutralScaleHexes.map((hexValue, i) => (
            <div
              key={`${hexValue}-${i}`}
              title={`Gray ${i + 1} · ${hexValue}`}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 9px',
                borderTop: i === 0 ? 'none' : `1px solid ${border}44`,
                background: 'transparent',
                color: fg,
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  background: hexValue,
                  border: `1px solid ${border}`,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 11, color: muted, width: 14, fontFamily: "'PT Mono', monospace" }}>
                {i + 1}
              </span>
              <span style={{ fontSize: 12, fontWeight: 500, flex: 1 }}>
                {STEP_LABELS[i] ?? `Gray ${i + 1}`}
              </span>
              <span style={{ fontSize: 11, fontFamily: "'PT Mono', monospace", color: textOn(hexValue) === '#ffffff' ? '#16a34a' : '#52525b' }}>
                {hexValue}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Shared sub-components ────────────────────────────────────────────────────

const Separator = () => (
  <div style={{ width: 1, height: 24, background: '#3F3F46', margin: '0 4px' }} />
);

const iconBtnStyle = (active: boolean): React.CSSProperties => ({
  width:          34,
  height:         34,
  borderRadius:   8,
  border:         'none',
  cursor:         'pointer',
  background:     active ? '#3F3F46' : 'transparent',
  color:          '#A1A1AA',
  fontSize:       14,
  fontFamily:     "'PT Mono', monospace",
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
});

const DescriptionPanel: React.FC<{ preset: PresetId }> = ({ preset }) => {
  const config = presets[preset];
  return (
    <div
      style={{
        position:       'fixed',
        bottom:         80,
        left:           '50%',
        transform:      'translateX(-50%)',
        zIndex:         9998,
        background:     '#18181B',
        borderRadius:   14,
        padding:        '20px 24px',
        maxWidth:       440,
        width:          '90vw',
        boxShadow:      '0 8px 32px rgba(0,0,0,0.4)',
        fontFamily:     "'Inter', sans-serif",
      }}
    >
      <div style={{ fontWeight: 700, color: '#FFF', fontSize: 15, marginBottom: 2 }}>
        {config.name}
      </div>
      <div style={{ fontStyle: 'italic', color: '#71717A', fontSize: 13, marginBottom: 10 }}>
        {config.subtitle}
      </div>
      <p style={{ color: '#A1A1AA', fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
        {config.description}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {config.tags.map(tag => (
          <span
            key={tag}
            style={{
              padding:      '2px 8px',
              borderRadius: 4,
              border:       '1px solid #3F3F46',
              color:        '#A1A1AA',
              fontSize:     11,
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
    'var(--ds-line-height-small)':   '1.3',
    'var(--ds-line-height-medium)':  '1.5',
    'var(--ds-line-height-large)':   '1.7',
    'var(--ds-line-height-x-large)': '1.9',
  };
  return map[token] ?? token;
};

const DebugStrip: React.FC<{ preset: PresetId; mode: string }> = ({ preset, mode }) => {
  const config = presets[preset];
  const s = config.styles;
  const vars = config.cssVars;
  const scheme = spacingSchemes[s.spacingScheme];

  const hasIconBg = s.cardIconBackground !== 'none';
  const iconRender = hasIconBg ? Math.round(s.iconSize / 2) : s.iconSize;

  const tokens: { label: string; value: string; color?: string }[] = [
    { label: 'mode',       value: mode },
    { label: 'scheme',     value: s.spacingScheme },
    { label: 'icon',       value: hasIconBg ? `${iconRender}px in ${s.iconSize}px` : `${iconRender}px` },
    { label: 'roundness',  value: String(s.roundness) },
    { label: 'primary',    value: vars['--theme-primary-color'] ?? '—', color: vars['--theme-primary-color'] },
    { label: 'title LH',   value: lhNum(scheme.cardTitleLineHeight) },
    { label: 'body LH',    value: lhNum(scheme.cardBodyLineHeight) },
    { label: 'content LH', value: lhNum(vars['--theme-content-line-height'] ?? '—') },
  ];

  return (
    <div
      style={{
        position:        'fixed',
        top:             0,
        left:            0,
        right:           0,
        zIndex:          9998,
        background:      '#18181B',
        padding:         '8px 16px',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        gap:             20,
        flexWrap:        'wrap',
        fontFamily:      "'PT Mono', monospace",
        fontSize:        11,
      }}
    >
      {tokens.map(({ label, value, color }) => (
        <span key={label} style={{ color: '#71717A' }}>
          {label}:{' '}
          <span style={{ color: color ?? '#E4E4E7' }}>
            {value}
          </span>
        </span>
      ))}
    </div>
  );
};

export default FloatingControls;
