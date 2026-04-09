export interface ColorStep {
  step: number;
  hex: string;
  l: number;
  c: number;
  h: number;
  contrast: number;
  /** Light chromatic: picked brand may sit on step 4–9 depending on L/C */
  isBrand?: boolean;
}

/** Per-step output from {@link generateScale} (v2 blueprint). */
export interface ScaleDiagnostic {
  step: number;
  l: number;
  c: number;
  h: number;
  hex: string;
  contrast: number;
}

export interface GenerateScaleResult {
  scale: string[];
  diagnostics: ScaleDiagnostic[];
}
