import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/lib/ThemeContext';
import { presets, presetOrder } from '@/lib/presets';
import type { PresetId } from '@/lib/presets';
import { spacingSchemes } from '@/lib/presets/spacingSchemes';
import { parse, converter, clampChroma, formatHex, wcagContrast } from 'culori';

// ─── Colour generation ────────────────────────────────────────────────────────

const toOklch = converter('oklch');

interface ColorStep {
  step:     number;
  hex:      string;
  l:        number;
  c:        number;
  h:        number;
  contrast: number; // WCAG contrast ratio vs. Step 1 (the background)
}

/** Fixed lightness targets — light mode (template; Step 9 may be replaced by dynamic anchor) */
const LIGHT_L = [0.99, 0.97, 0.94, 0.91, 0.88, 0.83, 0.78, 0.72, 0.59, 0.55, 0.51, 0.32];
/** Dark mode: ramp so Step 1 is the darkest surface */
const DARK_L = [0.12, 0.16, 0.20, 0.25, 0.31, 0.38, 0.45, 0.54, 0.70, 0.75, 0.87, 0.96];

/** Radix-style default “Solid” step in light mode (OKLCH L) */
const STANDARD_LIGHT_L9 = LIGHT_L[8];
/** Default “Solid” step in dark mode */
const STANDARD_DARK_L9 = DARK_L[8];
/**
 * Below this L at Step 9 (light mode), Steps 10–11 are hovers/text *lighter* than the solid
 * instead of the default darker text ramp.
 */
const DARK_SOLID_L_THRESHOLD = 0.4;

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

/**
 * Per-step chroma: input chroma is the peak at Step 9; Steps 8 and 10 stay tight to that peak
 * (no long ramp that crushes chroma before Step 9).
 */
function resolveChroma(i: number, peakC: number): number {
  if (peakC <= 0) return 0;
  if (i === 0) return Math.min(peakC * 0.06, 0.008);
  if (i === 1) return Math.min(peakC * 0.09, 0.012);
  if (i <= 6) {
    const t = (i - 2) / 5;
    return peakC * (0.2 + 0.62 * t);
  }
  if (i === 7) return peakC * 0.94;
  if (i === 8) return peakC;
  if (i === 9) return peakC * 0.94;
  if (i === 10) return peakC * 0.9;
  return peakC * 0.3;
}

/**
 * Dynamic anchoring (light): if input L is darker than the standard Step-9 target, use input L
 * for Step 9 instead of forcing STANDARD_LIGHT_L9.
 */
function buildLightnessTargetsLight(L_in: number): number[] {
  const row = LIGHT_L.slice();
  const L9 =
    L_in < STANDARD_LIGHT_L9 ? clamp01(L_in) : STANDARD_LIGHT_L9;
  row[8] = L9;

  if (L9 < DARK_SOLID_L_THRESHOLD) {
    row[9] = clamp01(L9 + 0.05);
    row[10] = clamp01(L9 + 0.15);
    row[11] = clamp01(Math.max(0.06, L9 - 0.1));
  }
  return row;
}

/**
 * Dark mode: same idea — if the accent is darker than the template Step 9, anchor there;
 * very dark Step 9 uses lighter Steps 10–11 for hover/text.
 */
function buildLightnessTargetsDark(L_in: number): number[] {
  const row = DARK_L.slice();
  const L9 =
    L_in < STANDARD_DARK_L9 ? clamp01(L_in) : STANDARD_DARK_L9;
  row[8] = L9;

  if (row[8] <= row[7]) {
    row[7] = clamp01(row[8] - 0.04);
    for (let j = 6; j >= 0; j--) {
      if (row[j] >= row[j + 1]) {
        row[j] = clamp01(row[j + 1] - 0.035);
      }
    }
  }

  if (L9 < 0.45) {
    row[9] = clamp01(L9 + 0.05);
    row[10] = clamp01(L9 + 0.15);
    row[11] = Math.max(row[10] + 0.04, DARK_L[11]);
  }

  for (let i = 1; i < 12; i++) {
    if (row[i] < row[i - 1]) row[i] = clamp01(row[i - 1] + 0.008);
  }
  return row;
}

function generateScale(hex: string, isDark: boolean): ColorStep[] {
  const parsed = parse(hex);
  if (!parsed) return [];
  const base = toOklch(parsed);
  if (base == null || base.l == null) return [];

  const peakC = base.c ?? 0;
  const h = base.h ?? 0;
  const L_in = base.l;

  const targets = isDark ? buildLightnessTargetsDark(L_in) : buildLightnessTargetsLight(L_in);

  const raw = targets.map((l, i) => {
    const c = resolveChroma(i, peakC);
    const inGamut = toOklch(clampChroma({ mode: 'oklch' as const, l, c, h }, 'oklch'));
    return {
      step: i + 1,
      hex: formatHex(inGamut ?? { mode: 'oklch' as const, l, c: 0, h }) ?? '#000000',
      l: inGamut?.l ?? l,
      c: (inGamut as { c?: number }).c ?? 0,
      h: (inGamut as { h?: number }).h ?? h,
    };
  });

  const bgHex = raw[0].hex;
  return raw.map(s => ({
    ...s,
    contrast: Number((wcagContrast(s.hex, bgHex) ?? 1).toFixed(2)),
  }));
}

// ─── FloatingControls ─────────────────────────────────────────────────────────

const FloatingControls: React.FC = () => {
  const { preset, mode, setPreset, showDescription, setShowDescription, showDebug, setShowDebug } = useTheme();
  const navigate = useNavigate();

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

const ColorPalettePlayground: React.FC = () => {
  const [inputValue, setInputValue] = useState('#157F78');
  const [hex, setHex]               = useState('#157F78');
  const [isDark, setIsDark]         = useState(false);

  const scale = useMemo(() => generateScale(hex, isDark), [hex, isDark]);

  // Local palette UI colours — independent of the site theme
  const bg      = isDark ? '#111113' : '#f5f7fa';
  const surface = isDark ? '#18181b' : '#ffffff';
  const border  = isDark ? '#2e2e32' : '#e4e4e7';
  const fg      = isDark ? '#e4e4e7' : '#18181b';
  const muted   = '#71717a';

  function handleHexInput(val: string) {
    setInputValue(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) setHex(val);
  }

  function pickSwatch(swatchHex: string) {
    setHex(swatchHex);
    setInputValue(swatchHex);
  }

  /** Returns white or near-black — whichever reads better on the given swatch colour */
  function textOn(swatchHex: string): string {
    const onWhite = wcagContrast('#ffffff', swatchHex) ?? 1;
    const onBlack = wcagContrast('#18181b', swatchHex) ?? 1;
    return onWhite >= onBlack ? '#ffffff' : '#18181b';
  }

  if (scale.length < 12) return null;

  const s2  = scale[1];
  const s3  = scale[2];
  const s6  = scale[5];
  const s9  = scale[8];
  const s11 = scale[10];

  return (
    <div style={{
      position:   'fixed',
      inset:      0,
      zIndex:     9990,
      overflowY:  'auto',
      background: bg,
      color:      fg,
      fontFamily: "'Inter', ui-sans-serif, sans-serif",
      paddingBottom: 120,
    }}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '44px 28px 0' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>
            Colour Palette Generator
          </h2>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: muted, lineHeight: 1.55 }}>
            12-step OKLCH scale · Radix-style semantics · Step 9 uses dynamic anchoring (input L when darker than the default solid).
            Very dark solids lift Steps 10–11 for hovers/text. Click any swatch to use it as the new base.
          </p>
        </div>

        {/* ── Control Panel ── */}
        <div style={{
          display:    'flex',
          alignItems: 'center',
          gap:        10,
          flexWrap:   'wrap',
          background: surface,
          borderRadius: 12,
          padding:    '12px 16px',
          border:     `1px solid ${border}`,
          marginBottom: 22,
        }}>
          <span style={{ fontSize: 12, color: muted }}>Base colour</span>

          {/* Hex text input */}
          <input
            type="text"
            value={inputValue}
            onChange={e => handleHexInput(e.target.value)}
            placeholder="#157F78"
            style={{
              fontFamily:   "'PT Mono', monospace",
              fontSize:     13,
              padding:      '6px 10px',
              borderRadius: 7,
              border:       `1px solid ${border}`,
              background:   bg,
              color:        fg,
              width:        110,
              outline:      'none',
            }}
          />

          {/* Native colour picker */}
          <input
            type="color"
            value={hex}
            onChange={e => { setHex(e.target.value); setInputValue(e.target.value); }}
            style={{ width: 36, height: 32, borderRadius: 7, border: 'none', cursor: 'pointer', padding: 2 }}
          />

          <div style={{ flex: 1 }} />

          {/* Dark / Light toggle */}
          <button
            onClick={() => setIsDark(d => !d)}
            style={{
              padding:      '6px 13px',
              borderRadius: 7,
              border:       `1px solid ${border}`,
              background:   isDark ? '#3f3f46' : '#f4f4f5',
              color:        fg,
              fontSize:     12,
              cursor:       'pointer',
              fontFamily:   "'Inter', sans-serif",
              fontWeight:   500,
            }}
          >
            {isDark ? '☀ Light mode' : '🌙 Dark mode'}
          </button>
        </div>

        {/* ── Palette Strip ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 5, marginBottom: 5 }}>
          {scale.map(s => {
            const txt   = textOn(s.hex);
            const dim   = txt === '#ffffff' ? 'rgba(255,255,255,0.48)' : 'rgba(0,0,0,0.38)';
            const brand = s.step === 9;
            return (
              <div
                key={s.step}
                onClick={() => pickSwatch(s.hex)}
                title={`Step ${s.step} · ${s.hex} · ${s.contrast.toFixed(2)}:1`}
                style={{
                  background:    s.hex,
                  borderRadius:  10,
                  padding:       '10px 7px 8px',
                  display:       'flex',
                  flexDirection: 'column',
                  gap:           3,
                  minHeight:     104,
                  cursor:        'pointer',
                  outline:       brand ? `2.5px solid ${fg}` : 'none',
                  outlineOffset: brand ? '2px' : '0',
                }}
              >
                <span style={{ fontSize: 10.5, fontWeight: 700, color: dim }}>{s.step}</span>
                <span style={{
                  fontSize:    8.5,
                  color:       txt,
                  fontFamily:  "'PT Mono', monospace",
                  marginTop:   'auto',
                  lineHeight:  1.35,
                }}>
                  {s.hex}
                </span>
                <span style={{ fontSize: 8.5, color: dim, fontFamily: "'PT Mono', monospace" }}>
                  {s.contrast.toFixed(2)}:1
                </span>
              </div>
            );
          })}
        </div>

        {/* Semantic step labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 5, marginBottom: 28 }}>
          {scale.map((s, i) => (
            <div key={s.step} style={{
              textAlign:  'center',
              fontSize:   9,
              color:      muted,
              fontFamily: "'PT Mono', monospace",
              lineHeight: 1.4,
            }}>
              {STEP_LABELS[i]}
            </div>
          ))}
        </div>

        {/* ── Bottom row: Sandbox + Diagnostics ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 32 }}>

          {/* Component Sandbox */}
          <div style={{
            background:   surface,
            borderRadius: 12,
            padding:      '18px 20px',
            border:       `1px solid ${border}`,
          }}>
            <div style={{
              fontSize:      10.5,
              fontWeight:    600,
              color:         muted,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              marginBottom:  18,
            }}>
              Component Sandbox
            </div>

            {/* Primary button — Step 9 background, white text */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: muted, marginBottom: 7 }}>
                Primary · Step 9 bg / white text
              </div>
              <button style={{
                background:   s9.hex,
                color:        '#ffffff',
                border:       'none',
                borderRadius: 7,
                padding:      '8px 16px',
                fontSize:     13,
                fontWeight:   600,
                fontFamily:   "'Inter', sans-serif",
                cursor:       'pointer',
              }}>
                Get started →
              </button>
            </div>

            {/* Ghost button — Step 3 background, Step 11 text */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: muted, marginBottom: 7 }}>
                Ghost · Step 3 bg / Step 11 text
              </div>
              <button style={{
                background:   s3.hex,
                color:        s11.hex,
                border:       'none',
                borderRadius: 7,
                padding:      '8px 16px',
                fontSize:     13,
                fontWeight:   500,
                fontFamily:   "'Inter', sans-serif",
                cursor:       'pointer',
              }}>
                Learn more
              </button>
            </div>

            {/* Card — Step 2 background, Step 6 border */}
            <div>
              <div style={{ fontSize: 11, color: muted, marginBottom: 7 }}>
                Card · Step 2 bg / Step 6 border
              </div>
              <div style={{
                background:   s2.hex,
                border:       `1px solid ${s6.hex}`,
                borderRadius: 10,
                padding:      '12px 14px',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: s11.hex, marginBottom: 3 }}>
                  Card title
                </div>
                <div style={{ fontSize: 12, color: muted, lineHeight: 1.5 }}>
                  Background from Step 2 · border from Step 6 · text from Step 11.
                </div>
              </div>
            </div>
          </div>

          {/* OKLCH Diagnostic Table */}
          <div style={{
            background:   surface,
            borderRadius: 12,
            padding:      '18px 20px',
            border:       `1px solid ${border}`,
            overflowX:    'auto',
          }}>
            <div style={{
              fontSize:      10.5,
              fontWeight:    600,
              color:         muted,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              marginBottom:  18,
            }}>
              OKLCH Diagnostics
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'PT Mono', monospace", fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${border}` }}>
                  {['#', 'L', 'C', 'H', 'Hex', 'CR'].map(col => (
                    <th key={col} style={{
                      textAlign:   'left',
                      padding:     '3px 6px 7px',
                      color:       muted,
                      fontWeight:  600,
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scale.map(s => {
                  const crColor = s.contrast >= 4.5
                    ? '#22c55e'
                    : s.contrast >= 3
                      ? '#f59e0b'
                      : muted;
                  return (
                    <tr key={s.step} style={{ borderBottom: `1px solid ${border}44` }}>
                      <td style={{ padding: '4px 6px', color: muted }}>{s.step}</td>
                      <td style={{ padding: '4px 6px', color: fg }}>{s.l.toFixed(3)}</td>
                      <td style={{ padding: '4px 6px', color: fg }}>{s.c.toFixed(4)}</td>
                      <td style={{ padding: '4px 6px', color: fg }}>{(s.h ?? 0).toFixed(1)}°</td>
                      <td style={{ padding: '4px 6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <span style={{
                            width:        10,
                            height:       10,
                            borderRadius: 2,
                            background:   s.hex,
                            flexShrink:   0,
                            border:       `1px solid ${border}`,
                          }} />
                          <span style={{ color: fg }}>{s.hex}</span>
                        </span>
                      </td>
                      <td style={{ padding: '4px 6px', color: crColor, fontWeight: 600 }}>
                        {s.contrast.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

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
