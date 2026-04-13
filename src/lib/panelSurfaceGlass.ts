export type PanelBackgroundMode = 'solid' | 'translucent';

/** 45% opaque mix over transparent — preserves the underlying token (accent or neutral). */
export function panelSurfaceBackground(colorCss: string, mode: PanelBackgroundMode): string {
  if (mode !== 'translucent') return colorCss;
  return `color-mix(in srgb, ${colorCss} 45%, transparent)`;
}

export function panelSurfaceBackdrop(mode: PanelBackgroundMode): string | undefined {
  return mode === 'translucent' ? 'blur(30px)' : undefined;
}

export const PANEL_SURFACE_TRANSITION =
  'background 0.3s ease, backdrop-filter 0.3s ease, -webkit-backdrop-filter 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease' as const;
