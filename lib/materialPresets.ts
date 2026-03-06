export type DensityPreset = {
  label: string;
  density: number | null;
};

export const DENSITY_PRESETS: readonly DensityPreset[] = [
  { label: '一般鋼材（SS400 等）', density: 7850 },
  { label: 'SUS304 / SUS316', density: 7930 },
  { label: 'アルミ合金', density: 2700 },
  { label: 'カスタム', density: null },
] as const;

export function resolveDensity(
  presetIndex: number,
  customDensity: string,
  presets: readonly DensityPreset[] = DENSITY_PRESETS,
): number | null {
  const preset = presets[presetIndex];
  if (!preset) return null;
  if (preset.density !== null) return preset.density;

  const parsed = parseFloat(customDensity);
  return isNaN(parsed) || parsed <= 0 ? null : parsed;
}

export type BeamMaterialPreset = {
  label: string;
  E_GPa: number | null;
  sigmaAllow_MPa: number | null;
};

export const BEAM_MATERIAL_PRESETS: readonly BeamMaterialPreset[] = [
  { label: '炭素鋼（SS400 相当）', E_GPa: 205, sigmaAllow_MPa: 150 },
  { label: 'SUS304', E_GPa: 193, sigmaAllow_MPa: 130 },
  { label: 'アルミ（参考）', E_GPa: 69, sigmaAllow_MPa: 80 },
  { label: 'カスタム', E_GPa: null, sigmaAllow_MPa: null },
] as const;
