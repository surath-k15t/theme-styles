# Theme Presets — Developer Portal UI Kit

A React + TypeScript theming system for building branded developer portals. It ships with a set of curated theme presets, a design token architecture, and a live preview interface so you can see every preset in context.

## Overview

The project is structured around **preset configurations** — each preset defines a complete visual identity including color tokens, typography, spacing, card layouts, icon sizing, border radius, and banner styles. All of these feed into a central `ThemeContext` that injects CSS custom properties at runtime, so switching themes requires zero page reload.

### Preset library

| Preset | Character |
|---|---|
| **Origin** | Clean, neutral, enterprise-ready |
| **Vector** | Sharp, flat, zero-radius precision |
| **Ignite** | Bold, energetic, high contrast |
| **Legacy** | Subtle, muted, documentation-first |
| **Lucid** | Highly rounded, soft, modern |
| **Aurora** | Gradient-heavy, frosted glass, immersive |
| **Playground** | Teal-accented, balanced default for prototyping |

### Design token architecture

All visual properties flow through a CSS token chain. Radius is a good example:

```
roundness (preset style) → --theme-roundness → --K15t-radius-factor → --K15t-radius-small / medium / large / pill
```

Components hardcode the appropriate token step (e.g. cards use `--K15t-radius-medium`, search uses `--K15t-radius-pill`) rather than receiving per-preset overrides. This means changing a single `roundness` number in a preset reshapes the entire UI consistently.

Other token families cover spacing schemes (`compact` / `standard` / `spacious`), icon sizes, card gaps per layout type, and typography scales.

## Tech stack

- **React 18** + **TypeScript**
- **Vite** (dev server + build)
- **Tailwind CSS** + **shadcn/ui**
- **@radix-ui/colors** for color palette primitives

## Getting started

### Prerequisites

- Node.js 18+ (recommended: install via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm 9+

### Clone and install

```sh
git clone https://github.com/surath-k15t/theme-styles.git
cd theme-styles
brew install npm
npm install
```

### Run the dev server

```sh
npm run dev
```

The app will be available at `http://localhost:8080` by default. The dev server supports hot module replacement, so edits to preset files are reflected instantly.

### Build for production

```sh
npm run build
```

Output goes to `dist/`.

## Project structure

```
src/
├── components/
│   └── theme/          # ThemeContext, AppCards, Banner, SearchBar, FloatingControls, etc.
├── lib/
│   └── presets/
│       ├── types.ts        # PresetConfig + PresetStyles interfaces
│       ├── baseStyles.ts   # Default values shared across all presets
│       ├── spacingSchemes.ts
│       ├── index.ts        # Exports all presets
│       ├── origin.ts
│       ├── vector.ts
│       ├── ignite.ts
│       ├── legacy.ts
│       ├── lucid.ts
│       ├── aurora.ts
│       └── playground.ts
├── pages/              # Portal, Article page layouts
├── global.css          # Tailwind + base shell styles
├── design-tokens-HCTheme/      # core-tokens.css, alias-tokens.css, theme-tokens.css (imported from baseStyles.ts)
└── index.css
```

## Adding a new preset

1. Create `src/lib/presets/yourpreset.ts` — copy `playground.ts` as a starting point.
2. Fill in the `PresetConfig` object, including `id`, `name`, `cssVars`, `darkCssVars`, and `styles`.
3. Add your preset ID to the `PresetId` union in `types.ts`.
4. Export it from `src/lib/presets/index.ts`.

The `roundness` value in `styles` is the main lever for border radius across the whole UI — `0` is fully sharp, `1` is the default scale, and `4` gives very rounded corners everywhere.

## License

MIT
