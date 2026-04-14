import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { argbFromHex, Hct } from '@material/material-color-utilities';
import {
  MATERIAL_LIGHT_END_TONE,
  materialPinnedPrimaryStep,
  materialPrimary12Step,
  materialToneAtDisplayStep,
} from '@/lib/color-engine';

const M2_DOC =
  'https://m2.material.io/design/color/the-color-system.html#tools-for-picking-colors';

const M2_SHADE_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

function m2StyleShade(lightToDarkIndex: number): string {
  const j = Math.round((lightToDarkIndex / 11) * (M2_SHADE_STOPS.length - 1));
  return String(M2_SHADE_STOPS[Math.max(0, Math.min(M2_SHADE_STOPS.length - 1, j))]!);
}

function parseArgb(hex: string): number | null {
  const t = hex.trim();
  if (!t) return null;
  const n = t.startsWith('#') ? t : `#${t}`;
  try {
    return argbFromHex(n);
  } catch {
    return null;
  }
}

const labFont =
  "'Inter', 'Roboto', 'Helvetica Neue', Arial, ui-sans-serif, system-ui, sans-serif";

const sectionOverline: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#757575',
  marginBottom: 6,
};

const MaterialPaletteLab: React.FC = () => {
  const [primaryHex, setPrimaryHex] = useState('#6750a4');

  const primaryArgb = useMemo(() => parseArgb(primaryHex), [primaryHex]);

  const sourceHct = useMemo(() => {
    if (primaryArgb == null) return null;
    return Hct.fromInt(primaryArgb);
  }, [primaryArgb]);

  const primaryScaleResult = useMemo(() => {
    if (primaryArgb == null) return null;
    return materialPrimary12Step(primaryHex, 'light');
  }, [primaryArgb, primaryHex]);

  const primaryScale = primaryScaleResult?.scale ?? [];
  const primaryPinnedStep = primaryArgb != null ? materialPinnedPrimaryStep(primaryHex) : null;

  const primaryColorInputValue = /^#[0-9a-fA-F]{6}$/.test(primaryHex) ? primaryHex : '#6750a4';

  return (
    <div
      style={{
        minHeight: '100vh',
        fontFamily: labFont,
        background: '#eceff1',
        color: '#212121',
        padding: '28px 20px 56px',
      }}
    >
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        <div
          style={{
            marginBottom: 24,
            display: 'flex',
            alignItems: 'baseline',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <Link
              to="/"
              style={{ color: '#546e7a', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}
            >
              ← Portal
            </Link>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em' }}>
              Primary palette
            </h1>
          </div>
          <a
            href={M2_DOC}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 13, color: '#1565c0', fontWeight: 500 }}
          >
            Material Design 2 — Color system
          </a>
        </div>

        <p style={{ margin: '0 0 24px', fontSize: 14, color: '#546e7a', lineHeight: 1.65, maxWidth: 820 }}>
          Single primary ramp (same as the app). Step <strong>1</strong> uses HCT tone <strong>T{MATERIAL_LIGHT_END_TONE}</strong>{' '}
          so the light end reads almost white but keeps the key hue; steps <strong>2–12</strong> follow{' '}
          <strong>T86…T6</strong>. M2-style shade labels are a reading aid only. Your exact primary hex is pinned at step{' '}
          {primaryPinnedStep ?? '—'}.
        </p>

        <Panel style={{ marginBottom: 24 }}>
          <div style={sectionOverline}>Primary</div>
          <p style={{ margin: '0 0 12px', fontSize: 12, color: '#757575' }}>Main brand color</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#757575' }}>
              <span style={{ fontWeight: 600 }}>Picker</span>
              <input
                type="color"
                value={primaryColorInputValue}
                onChange={e => setPrimaryHex(e.target.value)}
                style={{
                  width: 52,
                  height: 44,
                  padding: 0,
                  border: '1px solid #bdbdbd',
                  borderRadius: 2,
                  cursor: 'pointer',
                  background: '#fff',
                }}
                aria-label="Primary color"
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#757575', flex: 1 }}>
              <span style={{ fontWeight: 600 }}>Hex</span>
              <input
                type="text"
                value={primaryHex}
                onChange={e => setPrimaryHex(e.target.value)}
                spellCheck={false}
                style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: 14,
                  padding: '10px 12px',
                  borderRadius: 2,
                  border: '1px solid #bdbdbd',
                  width: '100%',
                  maxWidth: 200,
                  boxSizing: 'border-box',
                }}
              />
            </label>
          </div>
        </Panel>

        {sourceHct && primaryScale.length === 12 ? (
          <Panel style={{ marginBottom: 0 }}>
            <div style={sectionOverline}>Ramp</div>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#757575' }}>
              Source tonal curve + exact primary pin (light ordering).
            </p>
            <RampRow scale={primaryScale} primaryStep={primaryPinnedStep} />
            <div style={{ marginTop: 14, fontSize: 13, color: '#616161' }}>
              HCT — hue <strong>{sourceHct.hue.toFixed(1)}°</strong>, chroma{' '}
              <strong>{sourceHct.chroma.toFixed(2)}</strong>, tone <strong>{sourceHct.tone.toFixed(1)}</strong>
            </div>
          </Panel>
        ) : (
          <Panel>
            <span style={{ fontSize: 14, color: '#c62828' }}>Enter a valid primary hex (#RRGGBB).</span>
          </Panel>
        )}
      </div>
    </div>
  );
};

function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        padding: 20,
        background: '#fff',
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function RampRow({ scale, primaryStep }: { scale: string[]; primaryStep: number | null }) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid #bdbdbd',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)',
      }}
    >
      {scale.map((c, i) => {
        const step = i + 1;
        const isPrimary = primaryStep != null && step === primaryStep;
        const m2 = m2StyleShade(i);
        const tone = materialToneAtDisplayStep(step, false);
        return (
          <div
            key={`${c}-${i}`}
            style={{
              flex: 1,
              minWidth: 0,
              position: 'relative',
              borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.12)' : undefined,
            }}
          >
            <div style={{ height: 72, background: c }} title={c} />
            <div
              style={{
                padding: '8px 4px 10px',
                textAlign: 'center',
                background: '#fafafa',
                borderTop: '1px solid #e0e0e0',
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#212121',
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {m2}
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 500,
                  color: '#9e9e9e',
                  letterSpacing: '0.02em',
                }}
              >
                T{tone}
              </div>
              <div
                style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: 9,
                  color: '#757575',
                  wordBreak: 'break-all',
                  marginTop: 4,
                  lineHeight: 1.25,
                }}
              >
                {c}
              </div>
            </div>
            {isPrimary ? (
              <div
                style={{
                  position: 'absolute',
                  top: 6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  pointerEvents: 'none',
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '3px 6px',
                    borderRadius: 2,
                    background: 'rgba(21,101,192,0.92)',
                    color: '#fff',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                >
                  Primary
                </span>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default MaterialPaletteLab;
