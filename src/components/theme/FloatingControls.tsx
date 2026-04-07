import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/lib/ThemeContext';
import { presets, presetOrder } from '@/lib/presets';
import type { PresetId } from '@/lib/presets';
import { spacingSchemes } from '@/lib/presets/spacingSchemes';

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

const Separator = () => (
  <div style={{ width: 1, height: 24, background: '#3F3F46', margin: '0 4px' }} />
);

const iconBtnStyle = (active: boolean): React.CSSProperties => ({
  width: 34,
  height: 34,
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  background: active ? '#3F3F46' : 'transparent',
  color: '#A1A1AA',
  fontSize: 14,
  fontFamily: "'PT Mono', monospace",
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const DescriptionPanel: React.FC<{ preset: PresetId }> = ({ preset }) => {
  const config = presets[preset];
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9998,
        background: '#18181B',
        borderRadius: 14,
        padding: '20px 24px',
        maxWidth: 440,
        width: '90vw',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        fontFamily: "'Inter', sans-serif",
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
