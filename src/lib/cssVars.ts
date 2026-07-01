import type { GeneratedPalette } from "../interfaces";

export function buildCssVars(palette: GeneratedPalette): string {
  const lines: string[] = [];
  palette.accentScale.forEach((v, i) => lines.push(`  --accent-${i + 1}: ${v};`));
  palette.accentScaleAlpha.forEach((v, i) => lines.push(`  --accent-a${i + 1}: ${v};`));
  palette.grayScale.forEach((v, i) => lines.push(`  --gray-${i + 1}: ${v};`));
  palette.grayScaleAlpha.forEach((v, i) => lines.push(`  --gray-a${i + 1}: ${v};`));
  lines.push(`  --accent-contrast: ${palette.accentContrast};`);
  lines.push(`  --accent-surface: ${palette.accentSurface};`);
  return `:root {\n${lines.join("\n")}\n}`;
}