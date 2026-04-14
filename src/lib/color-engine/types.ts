/** Per-step output from {@link generateScale} / {@link generateDarkScale}. */
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
