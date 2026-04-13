import React from 'react';
import type { PresetId } from '@/lib/presets';
import { presets } from '@/lib/presets';
import { PANEL_ISLAND_INSET } from './constants';

export const DescriptionPanel: React.FC<{ preset: PresetId }> = ({ preset }) => {
  const config = presets[preset];
  return (
    <div
      style={{
        position: 'fixed',
        top: PANEL_ISLAND_INSET,
        right: PANEL_ISLAND_INSET,
        zIndex: 9997,
        background: '#18181B',
        borderRadius: 12,
        padding: '20px 24px',
        maxWidth: 400,
        width: 'min(400px, calc(100vw - 48px))',
        maxHeight: `calc(100vh - ${PANEL_ISLAND_INSET * 2}px)`,
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
