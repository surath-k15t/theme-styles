import { clampChroma, converter, formatHex, parse } from 'culori';

const toLrgb = converter('lrgb');

/**
 * Linear-RGB foreground that composites over `bgHex` with opacity `alpha` to match `solidHex`
 * (within gamut after clamping). Returns an `rgba(...)` string in sRGB.
 */
export function alphaVariantMatchingSolid(
  solidHex: string,
  bgHex: string,
  alpha: number,
): string {
  const a = Math.min(1, Math.max(0.02, alpha));
  const solid = parse(solidHex);
  const bg = parse(bgHex);
  if (!solid || !bg) return 'rgba(0,0,0,0)';

  const S = toLrgb(clampChroma(solid, 'lrgb'));
  const B = toLrgb(clampChroma(bg, 'lrgb'));
  if (!S || !B || S.mode !== 'lrgb' || B.mode !== 'lrgb') return 'rgba(0,0,0,0)';

  const inv = 1 / a;
  const fg = {
    mode: 'lrgb' as const,
    r: Math.min(1, Math.max(0, (S.r - (1 - a) * B.r) * inv)),
    g: Math.min(1, Math.max(0, (S.g - (1 - a) * B.g) * inv)),
    b: Math.min(1, Math.max(0, (S.b - (1 - a) * B.b) * inv)),
  };

  const clamped = clampChroma(fg, 'lrgb');
  const rgb = clamped && clamped.mode === 'lrgb' ? clamped : fg;
  const hex = formatHex({ mode: 'rgb', r: rgb.r, g: rgb.g, b: rgb.b });
  if (!hex) {
    return `rgba(${Math.round(rgb.r * 255)},${Math.round(rgb.g * 255)},${Math.round(rgb.b * 255)},${a})`;
  }
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return `rgba(0,0,0,${a})`;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}
