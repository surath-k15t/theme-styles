import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { presets } from '@/lib/presets';
import type { PresetId } from '@/lib/presets';
import { spacingSchemes } from '@/lib/presets/spacingSchemes';
import {
  alphaVariantMatchingSolid,
  generateDarkScale,
  generateScale,
  neutralSolidsForMode,
} from '@/lib/color-engine';

// ─── FloatingControls ─────────────────────────────────────────────────────────

const FloatingControls: React.FC = () => {
  const { preset, mode, showDescription, setShowDescription, showDebug, setShowDebug } = useTheme();
  const playgroundConfig = presets.playground;

  return (
    <>
      {/* Debug strip */}
      {showDebug && <DebugStrip preset={preset} mode={mode} />}

      {/* Description panel */}
      {showDescription && <DescriptionPanel preset={preset} />}

      <ColorEnginePlayground />

      {/* Toolbar — single Playground theme */}
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            color: '#E4E4E7',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: playgroundConfig.swatchColor,
              flexShrink: 0,
            }}
          />
          {playgroundConfig.name}
        </div>

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

// ─── Color engine playground (chromatic scale + fixed neutrals) ───────────────

const PLAYGROUND_HEX_KEY = 'color-engine:hex';
const PLAYGROUND_INPUT_KEY = 'color-engine:input';
const PLAYGROUND_IS_DARK_KEY = 'color-engine:isDark';

/** Sits above the bottom toolbar (`bottom: 24`, ~52px tall). */
const PALETTE_BAR_BOTTOM_PX = 24 + 52 + 10;
const PALETTE_BAR_MAX_WIDTH = 'min(960px, calc(100vw - 24px))';

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

const ColorEnginePlayground: React.FC = () => {
  const {
    playgroundHex,
    setPlaygroundHex,
    playgroundIsDark,
    setPlaygroundIsDark,
  } = useTheme();
  const [inputValue, setInputValue] = useState(() =>
    getSessionString(PLAYGROUND_INPUT_KEY, playgroundHex),
  );
  const hex = playgroundHex;
  const isDark = playgroundIsDark;
  /* Fixed neutrals from color-engine (same as `--gray-*` on the theme root). */
  const neutralScaleHexes = neutralSolidsForMode(isDark);
  const [showAdvanced, setShowAdvanced] = useState(false);
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

  // Drawer / table — light text on dark panel is avoided; follow preview mode
  const border = isDark ? '#2e2e32' : '#e4e4e7';
  const fg = isDark ? '#e4e4e7' : '#18181b';
  const muted = '#71717a';

  function handleHexInput(val: string) {
    setInputValue(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) setPlaygroundHex(val);
  }

  if (diagnostics.length < 12) return null;

  const glassBar: React.CSSProperties = {
    borderRadius: 14,
    background: '#000000ae',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
  };

  const drawerBg = isDark ? 'rgba(17,17,19,0.96)' : 'rgba(255,255,255,0.96)';

  const rampDivider = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.12)';

  const miniBtn = (active: boolean): React.CSSProperties => ({
    padding: '5px 10px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontSize: 11,
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    background: active ? '#3f3f46' : 'transparent',
    color: active ? '#fafafa' : '#a1a1aa',
  });

  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: PALETTE_BAR_BOTTOM_PX,
        zIndex: 9998,
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'stretch',
        gap: 8,
        width: PALETTE_BAR_MAX_WIDTH,
        maxWidth: 'calc(100vw - 24px)',
        fontFamily: "'Inter', ui-sans-serif, sans-serif",
      }}
    >
      {/* Main horizontal bar — directly above the Playground toolbar */}
      <div
        style={{
          ...glassBar,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
          padding: '8px 12px',
          color: '#e4e4e7',
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
          Color engine
        </span>
        <span style={{ fontSize: 10, color: '#71717a', whiteSpace: 'nowrap' }}>
          {isDark ? 'Dark' : 'Light'}
        </span>

        <input
          type="text"
          value={inputValue}
          onChange={e => handleHexInput(e.target.value)}
          placeholder="#157F78"
          aria-label="Base hex color"
          style={{
            fontFamily: "'PT Mono', monospace",
            fontSize: 12,
            padding: '5px 8px',
            borderRadius: 7,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(0,0,0,0.35)',
            color: '#e4e4e7',
            width: 92,
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
          style={{ width: 32, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer', padding: 0 }}
        />
        <button
          type="button"
          onClick={() => setPlaygroundIsDark(!isDark)}
          style={{
            padding: '5px 9px',
            borderRadius: 7,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.08)',
            color: '#e4e4e7',
            fontSize: 11,
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
          }}
        >
          {isDark ? 'Light' : 'Dark'}
        </button>

        <div style={{ width: 1, height: 26, background: '#3f3f46', flexShrink: 0 }} />

        <div
          role="img"
          aria-label={`Generated ramp, base at step ${brandStep}`}
          style={{
            flex: '1 1 220px',
            minWidth: 160,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'stretch',
            gap: 0,
            minHeight: 44,
          }}
        >
          {diagnostics.map((s, i) => {
            const isBase = s.step === brandStep;
            const h = isBase ? 42 : 28;
            return (
              <React.Fragment key={s.step}>
                {i > 0 ? (
                  <div
                    style={{
                      width: 1,
                      flexShrink: 0,
                      alignSelf: 'stretch',
                      minHeight: h,
                      background: rampDivider,
                    }}
                  />
                ) : null}
                <div
                  title={s.hex}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: h,
                      background: s.hex,
                      borderRadius: isBase ? 3 : 2,
                      boxShadow: isBase ? '0 0 0 2px rgba(255,255,255,0.45)' : undefined,
                    }}
                  />
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div style={{ width: 1, height: 26, background: '#3f3f46', flexShrink: 0 }} />

        <button
          type="button"
          onClick={() => setShowAdvanced(v => !v)}
          style={miniBtn(showAdvanced)}
        >
          Advanced
        </button>
        <button
          type="button"
          onClick={() => setShowNeutralScale(v => !v)}
          style={miniBtn(showNeutralScale)}
        >
          Neutral
        </button>
      </div>

      {/* Drawer opens above the bar */}
      {(showAdvanced || showNeutralScale) && (
        <div
          style={{
            borderRadius: 14,
            background: drawerBg,
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: `1px solid ${border}`,
            boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
            padding: 12,
            maxHeight: 'min(36vh, 260px)',
            overflowY: 'auto',
            color: fg,
          }}
        >
          {showAdvanced && (
            <div style={{ marginBottom: showNeutralScale ? 14 : 0 }}>
              <div style={{ fontWeight: 700, fontSize: 11, color: muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Advanced
              </div>
              {!isDark && alphaOnBg.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 11, color: muted }}>Alpha variants</div>
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

          {showNeutralScale && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 11, color: muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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
                    <div
                      title={`${hexValue}`}
                      style={{ flex: 1, minWidth: 0, height: 28, background: hexValue }}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
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
        bottom:         148,
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
