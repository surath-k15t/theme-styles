export function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

export function smoothstep01(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}
