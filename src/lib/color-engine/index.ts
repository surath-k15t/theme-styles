export { alphaVariantMatchingSolid } from './alpha-variants';
export { generateDarkScale, generateScale } from './generate-scale';
export { generateScaleLegacy } from './generate-scale-legacy';
export {
  buildNeutralSolidCssVars,
  neutralSolidsForMode,
  NEUTRAL_SOLIDS_DARK,
  NEUTRAL_SOLIDS_LIGHT,
} from './neutral-ramp';
export { buildPlaygroundCssVars } from './playground-css-vars';
export {
  compositeSrgbOver,
  effectiveSiteHeaderBackgroundHex,
  mcuForegroundOnSurfaceHex,
  resolveHeaderTintHex,
  siteHeaderForegroundHex,
} from './mcu-on-surface';
export type { McuOnSurfaceOptions, SiteHeaderContrastInput } from './mcu-on-surface';
export { buildColorEngineThemeVars } from './theme-vars';
export type { ColorStep, GenerateScaleResult, ScaleDiagnostic } from './types';
