# Color engine

Turns a **single brand color** (hex or any string Culori can parse) into a **12-step OKLCH-based chromatic palette**: backgrounds, UI chrome, borders, solid + hover, and text steps. Output is **sRGB hex** after gamut clamping, plus per-step **L / C / h** diagnostics and **WCAG contrast** vs step 1.

**Neutral scale** (fixed neutral ramp for typography and UI neutrals) lives in `neutral-ramp.ts` as **12 sRGB solids**; `ThemeContext` injects them as `--gray-1`…`--gray-12` on `data-theme-root`. Alpha / P3 refinements remain in `design-tokens.css`.

The **Playground** preset (`FloatingControls` → `ColorEnginePlayground`) uses the **v2** chromatic API: `generateScale` (light) and `generateDarkScale` (dark).

---

## Quick start

```ts
import {
  generateScale,
  generateDarkScale,
  alphaVariantMatchingSolid,
  buildColorEngineThemeVars,
  neutralSolidsForMode,
} from '@/lib/color-engine';

const { scale, diagnostics } = generateScale('#157F78');
// diagnostics[0]..[11] → steps 1–12: { step, l, c, h, hex, contrast }

const dark = generateDarkScale('#157F78');

const vars = buildColorEngineThemeVars('#157F78', false); // light: neutrals + --palette-step-*

// rgba that composites onto bg to match a solid (linear RGB solve)
const overlay = alphaVariantMatchingSolid(solidHex, bgHex, 0.5);
```

### Types

| Export | Description |
|--------|-------------|
| `GenerateScaleResult` | `{ scale: string[]; diagnostics: ScaleDiagnostic[] }` |
| `ScaleDiagnostic` | `{ step, l, c, h, hex, contrast }` |
| `ColorStep` | Legacy row shape; optional `isBrand` |
| `generateScaleLegacy(hex, isDark)` | Alternate Radix-template engine (see below) |

---

## Architecture

```
index.ts
├── theme-vars.ts          ← buildColorEngineThemeVars (neutrals + chromatic for theme root)
├── neutral-ramp.ts        ← fixed 12 neutral solids + buildNeutralSolidCssVars
├── playground-css-vars.ts ← chromatic steps + on-primary + portal text overrides
├── generate-scale.ts      ← v2 light + dark chromatic (playground)
├── generate-scale-legacy.ts
├── light-chromatic.ts     ← legacy Radix light templates + smoothstep blends
├── dark-chromatic.ts      ← legacy Radix dark templates + smoothstep blends
├── light-templates.ts     ← fixed OKLCH L/C arrays (bright, soft, deep, mid)
├── dark-templates.ts      ← muted / bright dark chromatic templates
├── math.ts                ← clamp01, smoothstep01
├── black-solids.ts        ← achromatic black anchor rows (legacy)
├── legacy-ramp.ts         ← resolveChroma for non-template legacy path
├── alpha-variants.ts      ← matching rgba over a background
└── types.ts
```

**Runtime dependency:** [Culori](https://github.com/Evercoder/culori) — `parse`, `converter('oklch')`, `clampChroma`, `formatHex`, `wcagContrast`.

---

## V2 engine (`generate-scale.ts`)

### Pipeline

1. Parse input → OKLCH **L, C, h** (hue defaults to `0` if missing).
2. Build a **lightness row** (12 values) and a **chroma function** `i ↦ C`.
3. For each step: `{ l, c, h }` → **`clampChroma`** → hex; contrast vs step 1.

### Light mode — `generateScale`

- **Lightness:** Starts from `L_BLUEPRINT`, sets step 9 to input **L**. Yellow/lime hues (60–110°) with **C ≥ 0.04** lift mid steps by `+0.05` with caps and ordering gaps. Step 10 is a **hover** offset from step 9 (±0.05 vs `DARK_SOLID_L = 0.4`). Very dark achromatic rows (`colorFactor === 0` and **L < 0.35**) override steps 10–12 **L** for a readable text ramp.
- **Chroma:** **`colorFactor`** lerps between a **low-chroma (achromatic) ramp** and a **saturated chroma ramp** (thresholds **C ∈ [0.005, 0.02]**). Uses `grayPeak = min(C×1.5, 0.01)` and `colorPeak = max(C, 0.04)` with per-step multipliers (`GRAY_C_MULTIPLIERS` / `C_MULTIPLIERS`). Steps 9, 10, 12 use raw **C**; step 11 uses the same peak lerp as the strong text step.

### Dark mode — `generateDarkScale`

- **Skeleton:** `DARK_L_BASE` for steps 1–8 **L**; steps 9–12 from **`computeDarkAnchorLC`** (or a **pure black** shortcut).
- **`darknessFade`:** `clamp01(L / 0.15)` — fades chroma toward neutral near black on steps 1–8 and step 11.
- **`colorFactor`:** Same as light for steps 1–8 chroma lerp (`DARK_GRAY` / `DARK_STD` multipliers).
- **`anchorFactor`:** `clamp01((C - 0.015) / 0.05)` — blends **muted** vs **vibrant** anchor targets for dark **L < 0.25** (cosine-based ideal **L** on hue, boosted **C** with floor and cap).
- **Pure black:** `L < 0.01 && C < 0.01` → fixed neutral **L** tail `0.536, 0.489, 0.769, 0.93` and **C = 0** on steps 9–12.

---

## Legacy engine (`generate-scale-legacy.ts`)

**Not** used by the playground unless you import it yourself. Branching order:

1. **Achromatic black anchor** — `isRadixBlackAchromaticAnchor` (`black-solids.ts`): fixed `RADIX_BLACK_SOLID_*` L/C rows, hue `RADIX_NEUTRAL_HUE`.
2. **Light, low chroma + dark solid** — neutral head + `buildLightnessTargetsLowChromaDarkSolidLight` + `resolveChroma`.
3. **Light chromatic** — `buildRadixLightChromaticLc`: scales Radix **bright / soft / deep / mid** templates from `light-templates.ts`, blended with **`smoothstep01`** (see [Curves](#curves-smoothstep-not-gaussian)).
4. **Dark chromatic** — `buildRadixDarkChromaticLc`: muted vs bright dark templates from `dark-templates.ts`, blended with smoothstep on L9/C9.
5. **Fallback** — `buildLightnessTargetsLight` / `buildLightnessTargetsDark` + `resolveChroma`.

---

## Curves: smoothstep, not Gaussian

`math.ts` defines **`smoothstep01(edge0, edge1, x)`** — a standard **Hermite S-curve** (`t²(3-2t)`), used to weight template blends in `light-chromatic.ts` and `dark-chromatic.ts`.

There is **no Gaussian (normal) distribution** in this package. V2 also uses **cosine-on-hue** for dark anchor **L** (`0.7 + 0.185·cos(h−135°)`). Chroma shaping is **piecewise linear ramps**, **min/max peaks**, and **lerps**.

---

## Alpha variants

`alphaVariantMatchingSolid(solidHex, bgHex, alpha)` solves for a foreground in **linear RGB** so that compositing over `bgHex` at `alpha` matches `solidHex` (within clamping). Handy for token-style **semi-transparent** borders and overlays.

---

## Related UI

- `src/components/theme/floating-controls/` — theme panel (`ThemeSidePanel`, `DesignColorCard`); calls v2 generators and shows alpha variants for selected steps. Import the shell via `FloatingControls.tsx`.

---

## Adding or tuning behavior

- **V2 light/dark rules:** edit `generate-scale.ts` only; keep `buildScaleFromTargets` as the single place that applies `clampChroma` + hex + contrast.
- **Neutral solids:** edit `neutral-ramp.ts`; `ThemeContext` spreads `buildColorEngineThemeVars(hex, playgroundIsDark)` so light/dark matches the floating control and header toggle.
- **Legacy Radix shapes:** adjust arrays in `light-templates.ts` / `dark-templates.ts` or blend weights in `*-chromatic.ts`.
- After changes, run `npm run build` and exercise the Playground preset in both light/dark toggles.
