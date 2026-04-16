import {
  argbFromHex,
  hexFromArgb,
  Hct,
  TonalPalette,
} from '@material/material-color-utilities';
import { converter, formatHex, parse, wcagContrast } from 'culori';
import type { GenerateScaleResult, ScaleDiagnostic } from './types';

const toOklch = converter('oklch');

/**
 * Eleven interior tones **T6…T86** plus **T94** for the second-lightest step in light order.
 * Step 1 (lightest in light mode) uses {@link MATERIAL_LIGHT_END_TONE} instead of T94 so the swatch
 * reads almost white while keeping the palette’s hue/chroma.
 */
export const MATERIAL_TONAL_STOPS = [24, 44, 53, 30, 70, 82, 88, 91, 93, 95, 97, 99] as const;

/** HCT tone for ramp step 1 in light ordering — near-white with a hint of the key color. */
export const MATERIAL_LIGHT_END_TONE = 98;

export interface MaterialToneShade {
  tone: number;
  hex: string;
}

function parseSourceArgb(inputHex: string): number | null {
  const raw = inputHex.trim();
  if (!raw) return null;
  const normalized = raw.startsWith('#') ? raw : `#${raw}`;
  try {
    return argbFromHex(normalized);
  } catch {
    return null;
  }
}

/** Fixed 1-based ramp slot where the exact user primary hex is always pinned. */
export const MATERIAL_PRIMARY_PINNED_STEP = 9;

/**
 * 1-based ramp slot (same in light and dark) where the **exact user hex** is pinned.
 * This is fixed so primary UI tokens always use the chosen brand color at a stable step.
 */
export function materialPinnedPrimaryStep(_inputHex: string): number {
  return MATERIAL_PRIMARY_PINNED_STEP;
}

/** @deprecated Use {@link materialPinnedPrimaryStep}; `isDark` is ignored (pin is mode-agnostic). */
export function materialKeyColorStep(inputHex: string, _isDark?: boolean): number {
  return materialPinnedPrimaryStep(inputHex);
}

/** M3 tone (0–100) shown at this 1-based ramp step for the active mode ordering. */
export function materialToneAtDisplayStep(step1Based: number, isDark: boolean): number {
  const tones = MATERIAL_TONAL_STOPS;
  const i = Math.max(0, Math.min(11, step1Based - 1));
  if (!isDark) {
    if (i === 0) return MATERIAL_LIGHT_END_TONE;
    return tones[tones.length - 1 - i]!;
  }
  return tones[i]!;
}

/** Public parse for playground / theme (same rules as the ramp). */
export function parseMaterialSourceArgb(inputHex: string): number | null {
  return parseSourceArgb(inputHex);
}

/** HCT tone (0–100) of the seed color; `null` if hex is invalid. */
export function materialSeedHctTone(inputHex: string): number | null {
  const a = parseSourceArgb(inputHex);
  if (a == null) return null;
  return Hct.fromInt(a).tone;
}

/**
 * Source tonal ramp: {@link TonalPalette.fromInt} (seed HCT), matching the Material Theme Builder
 * “source color” strip — not CorePalette **a1** (used only by {@link Scheme} for UI primary roles).
 */
function primaryPaletteFromSourceArgb(sourceArgb: number) {
  return TonalPalette.fromInt(sourceArgb);
}

/** Full Material source tonal shades (T0…T100), ordered light → dark for easy picking. */
export function materialAllToneShades(inputHex: string): MaterialToneShade[] {
  const sourceArgb = parseSourceArgb(inputHex);
  if (sourceArgb == null) return [];
  const primary = primaryPaletteFromSourceArgb(sourceArgb);
  const shades: MaterialToneShade[] = [];
  for (let tone = 100; tone >= 0; tone--) {
    shades.push({ tone, hex: hexFromArgb(primary.tone(tone)) });
  }
  return shades;
}

function toneForStep(stepIndex: number, mode: 'light' | 'dark'): number {
  const tones = MATERIAL_TONAL_STOPS;
  if (mode === 'light') {
    if (stepIndex === 0) return MATERIAL_LIGHT_END_TONE;
    return tones[tones.length - 1 - stepIndex]!;
  }
  return tones[stepIndex]!;
}

function buildScaleFromPrimaryPalette(
  primary: TonalPalette,
  mode: 'light' | 'dark',
): string[] {
  const scale: string[] = [];
  for (let i = 0; i < 12; i++) {
    const tone = toneForStep(i, mode);
    scale.push(hexFromArgb(primary.tone(tone)));
  }
  return scale;
}

function normalizeInputHex6(inputHex: string): string | null {
  const raw = inputHex.trim();
  if (!raw) return null;
  const candidate = raw.startsWith('#') ? raw : `#${raw}`;
  const p = parse(candidate);
  if (!p) return null;
  return formatHex(p) ?? null;
}

function refreshDiagnosticRow(
  diagnostics: ScaleDiagnostic[],
  index: number,
  hex: string,
  bgHex: string,
): void {
  const rgb = parse(hex);
  const inGamut = rgb ? toOklch(rgb) : null;
  const row = diagnostics[index];
  if (!row) return;
  row.hex = hex;
  row.l = inGamut?.l ?? 0;
  row.c = (inGamut as { c?: number } | null)?.c ?? 0;
  const hVal = (inGamut as { h?: number } | null)?.h;
  row.h = hVal != null && Number.isFinite(hVal) ? hVal : 0;
  row.contrast = Number((wcagContrast(hex, bgHex) ?? 1).toFixed(2));
}

function pinExactUserHexOnRamp(
  inputHex: string,
  scale: string[],
  diagnostics: ScaleDiagnostic[],
): void {
  const exact = normalizeInputHex6(inputHex);
  if (!exact || diagnostics.length !== 12) return;
  const pin0 = materialPinnedPrimaryStep(inputHex) - 1;
  scale[pin0] = exact;
  const bgHex = scale[0] ?? '#000000';
  refreshDiagnosticRow(diagnostics, pin0, exact, bgHex);
  for (const row of diagnostics) {
    row.contrast = Number((wcagContrast(row.hex, bgHex) ?? 1).toFixed(2));
  }
}

function buildDiagnostics(scale: string[]): ScaleDiagnostic[] {
  const bgHex = scale[0] ?? '#000000';
  const diagnostics: ScaleDiagnostic[] = [];

  for (let i = 0; i < 12; i++) {
    const hex = scale[i] ?? '#000000';
    const rgb = parse(hex);
    const inGamut = rgb ? toOklch(rgb) : null;
    const l = inGamut?.l ?? 0;
    const c = (inGamut as { c?: number } | null)?.c ?? 0;
    const h = (inGamut as { h?: number } | null)?.h ?? 0;

    diagnostics.push({
      step: i + 1,
      l,
      c,
      h: Number.isFinite(h) ? h : 0,
      hex,
      contrast: 1,
    });
  }

  for (const row of diagnostics) {
    row.contrast = Number((wcagContrast(row.hex, bgHex) ?? 1).toFixed(2));
  }

  return diagnostics;
}

/**
 * 12-step brand ramp: {@link TonalPalette.fromInt} (seed). Light step 1 uses {@link MATERIAL_LIGHT_END_TONE};
 * steps 2–12 follow {@link MATERIAL_TONAL_STOPS} (T86…T6).
 */
export function materialPrimary12Step(
  inputHex: string,
  mode: 'light' | 'dark',
): GenerateScaleResult {
  const sourceArgb = parseSourceArgb(inputHex);
  if (sourceArgb == null) {
    return { scale: [], diagnostics: [] };
  }

  const primary = primaryPaletteFromSourceArgb(sourceArgb);
  const scale = buildScaleFromPrimaryPalette(primary, mode);
  const diagnostics = buildDiagnostics(scale);
  pinExactUserHexOnRamp(inputHex, scale, diagnostics);
  return { scale, diagnostics };
}

/**
 * Same 12-step ramp as the app (light end {@link MATERIAL_LIGHT_END_TONE}), from any {@link TonalPalette}.
 * Optionally pins an exact hex (same step rule as {@link materialPinnedPrimaryStep}).
 */
export function materialRamp12FromPaletteWithPin(
  palette: TonalPalette,
  pinHex: string | null,
  mode: 'light' | 'dark',
): string[] {
  const scale = buildScaleFromPrimaryPalette(palette, mode);
  if (pinHex) {
    const diagnostics = buildDiagnostics(scale);
    pinExactUserHexOnRamp(pinHex, scale, diagnostics);
  }
  return scale;
}
