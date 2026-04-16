# Color engine

**Material 3** for `data-theme-root`: **12** tones **T6–T94** on [`TonalPalette.fromInt`](https://github.com/material-foundation/material-color-utilities) (seed), then the **exact user hex** is **pinned** at a fixed step via {@link materialPinnedPrimaryStep}. **`--theme-primary-color`**, **`--ds-color-brand-700`**, and card icon use that step. **`Scheme`** still supplies **`--theme-on-primary-color`**. Neutrals → **`--gray-*`**. **`alphaVariantMatchingSolid`** (Culori) for translucent UI.

## Layout

```
index.ts
├── theme-vars.ts            buildColorEngineThemeVars
├── neutral-ramp.ts          NEUTRAL_SOLIDS_* , buildNeutralSolidCssVars
├── playground-css-vars.ts   palette + Scheme on-primary + portal overrides
├── generate-scale.ts        → material-palette-engine
├── material-palette-engine.ts
├── alpha-variants.ts
└── types.ts
```

**Dependencies:** `@material/material-color-utilities`, `culori`.

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
const vars = buildColorEngineThemeVars('#157F78', false);
const overlay = alphaVariantMatchingSolid(solidHex, bgHex, 0.5);
```

After changes, run `npm run build` and check the Playground in light and dark.
