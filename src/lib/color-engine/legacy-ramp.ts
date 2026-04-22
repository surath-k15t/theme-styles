/** Per-step chroma for legacy light/dark fallback (non-Radix chromatic path). */
export function resolveChroma(i: number, peakC: number): number {
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
