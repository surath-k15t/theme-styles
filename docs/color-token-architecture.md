```mermaid
flowchart TB
  subgraph inputs["User + app state"]
    H["Brand hex\n`playgroundHex`"]
    M["Light / dark preview\n`playgroundIsDark`"]
    C["Color coverage\n`minimal` / `subtle` / `balanced`"]
  end

  subgraph fixed["Fixed neutral palette"]
    NR["`neutral-ramp.ts`\n`NEUTRAL_SOLIDS_LIGHT` / `_DARK`"]
    NV["`buildNeutralSolidCssVars(isDark)`"]
    G1["`--gray-1` … `--gray-12`"]
    NR --> NV --> G1
  end

  subgraph accent["Accent ramp from brand hex"]
    GS["`generateScale(hex)` light"]
    GD["`generateDarkScale(hex)` dark"]
    H --> GS
    H --> GD
    M --> GS
    M --> GD
    D12["12 × `{ hex }` diagnostics"]
    GS --> D12
    GD --> D12
  end

  subgraph merge["`buildPlaygroundCssVars(hex, isDark, colorCoverage)`"]
    CH["`--chromatic-step-1…12`\n= accent ramp always"]
    PAL["`--palette-step-1…12`"]
    C --> PAL
    D12 --> CH
    D12 --> PALuse{Balanced?}
    NR --> PALcopy["Copy neutral hexes\nas pseudo brand steps"]
    PALuse -->|yes| PAL
    PALuse -->|no subtle/minimal| PALcopy
    PALcopy --> PAL
    CAN["`--K15t-canvas`"]
    C --> CAN
    CAN --> B1["Balanced:\n`palette-step-1`"]
    CAN --> B2["Subtle:\n`#fff` light / `gray-1` dark"]
    CAN --> B3["Minimal:\n`gray-1`"]
    ON["`--theme-on-primary-color`\nfrom chromatic step 9"]
    TXT["Portal text overrides\n→ `gray-11` / `gray-12`"]
    ICON["`--K15t-card-icon-color`\nchromatic 9 / 11"]
    MIN["Minimal only:\nheader `gray-1`,\nborder `gray-3`"]
    D12 --> ON
    CH --> ICON
    C --> MIN
    G1 --> TXT
  end

  subgraph root["`ThemeProvider` → `data-theme-root`"]
    TV["`style={…preset cssVars,\n…buildColorEngineThemeVars}`"]
    DT["`design-tokens.css`\n`--K15t-color-brand-*` → `--palette-step-*`"]
    TV --> DT
  end

  merge --> TV
  fixed --> TV

  subgraph ui["How the UI picks colors"]
    SEM["Semantic tokens\n`--K15t-surface`, `--theme-primary-color`, …"]
    REACT["Some React reads `colorCoverage`\ne.g. SearchBar, AppCards minimal"]
    C --> REACT
    CH --> REACT
    DT --> SEM
    SEM --> UI1["Cards, header, search shell…"]
    REACT --> UI2["Search fill `chromatic-step-9`\nwhen not Balanced"]
    REACT --> UI3["Minimal cards:\nwhite / `gray-2`"]
  end
```
