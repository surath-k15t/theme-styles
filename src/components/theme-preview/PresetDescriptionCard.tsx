import React from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { presets } from '@/lib/presets';

const PresetDescriptionCard: React.FC = () => {
  const { preset } = useTheme();
  const config = presets[preset];

  return (
    <div style={{ maxWidth: 680, margin: '32px auto', padding: '0 24px' }}>
      <div
        style={{
          background: 'var(--K15t-surface)',
          border: '1px solid var(--K15t-border-brand-strong)',
          borderRadius: 'var(--K15t-radius-medium)',
          padding: '24px 28px',
          fontFamily: 'var(--K15t-font-family-body)',
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <span
            style={{
              fontFamily: 'var(--K15t-font-family-headline)',
              fontSize: 'var(--K15t-font-size-lg)',
              fontWeight: 'var(--K15t-font-weight-bold)',
              color: 'var(--theme-headline-color)',
            }}
          >
            {config.name}
          </span>
          <span
            style={{
              marginLeft: 8,
              fontStyle: 'italic',
              color: 'var(--K15t-foreground-subtle)',
              fontSize: 'var(--K15t-font-size-sm)',
            }}
          >
            — {config.subtitle}
          </span>
        </div>
        <p
          style={{
            color: 'var(--K15t-foreground-subtle)',
            lineHeight: 'var(--theme-content-line-height)',
            fontSize: 'var(--K15t-font-size-md)',
            marginBottom: 16,
          }}
        >
          {config.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {config.tags.map(tag => (
            <span
              key={tag}
              style={{
                padding: '3px 10px',
                borderRadius: 'var(--K15t-radius-small)',
                border: '1px solid var(--K15t-border-brand-strong)',
                fontSize: 12,
                color: 'var(--K15t-foreground-subtle)',
                fontFamily: 'var(--K15t-font-family-body)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PresetDescriptionCard;
