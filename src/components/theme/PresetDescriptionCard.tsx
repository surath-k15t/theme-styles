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
          background: 'var(--ds-surface)',
          border: '1px solid var(--ds-border-brand-strong)',
          borderRadius: 'var(--ds-radius-medium)',
          padding: '24px 28px',
          fontFamily: 'var(--ds-font-family-body)',
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <span
            style={{
              fontFamily: 'var(--ds-font-family-headline)',
              fontSize: 'var(--ds-font-size-lg)',
              fontWeight: 'var(--ds-font-weight-bold)',
              color: 'var(--theme-headline-color)',
            }}
          >
            {config.name}
          </span>
          <span
            style={{
              marginLeft: 8,
              fontStyle: 'italic',
              color: 'var(--ds-foreground-subtle)',
              fontSize: 'var(--ds-font-size-sm)',
            }}
          >
            — {config.subtitle}
          </span>
        </div>
        <p
          style={{
            color: 'var(--ds-foreground-subtle)',
            lineHeight: 'var(--theme-content-line-height)',
            fontSize: 'var(--ds-font-size-md)',
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
                borderRadius: 'var(--ds-radius-small)',
                border: '1px solid var(--ds-border-brand-strong)',
                fontSize: 12,
                color: 'var(--ds-foreground-subtle)',
                fontFamily: 'var(--ds-font-family-body)',
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
