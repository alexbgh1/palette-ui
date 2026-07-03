import { DEFAULT_APPEARANCE, DEFAULT_EXPORT_COLOR_SPACE } from "../../constants";
import type { GeneratedPalette, Appearance, ColorSpace } from "../../interfaces";

import { labels, themeComment } from "./_shared";
import { formatColor } from "../colorConvert";
import { withHash } from "../color";

export function buildTs(
  p: GeneratedPalette,
  semantic: boolean,
  colorSpace: ColorSpace = DEFAULT_EXPORT_COLOR_SPACE,
  raw = false,
  mode: Appearance = DEFAULT_APPEARANCE,
): string {
  const l = labels(semantic);
  const lines: string[] = [themeComment(mode, "js")];
  const fmt = (v: string) => formatColor(v, colorSpace, raw);

  lines.push(`export const mode = '${mode}';`, "");

  lines.push(`export const accent = {`);
  p.accentScale.forEach((v, i) => lines.push(`  '${l[i]}': '${fmt(v)}',`));
  lines.push("};", "");

  lines.push("export const accentAlpha = {");
  p.accentScaleAlpha.forEach((v, i) => lines.push(`  'a${l[i]}': '${fmt(v)}',`));
  lines.push("};", "");

  lines.push(`export const accentP3 = {`);
  p.accentScaleWideGamut.forEach((v, i) => lines.push(`  'p3-${l[i]}': '${v}',`));
  lines.push("};", "");

  lines.push("export const gray = {");
  p.grayScale.forEach((v, i) => lines.push(`  '${l[i]}': '${fmt(v)}',`));
  lines.push("};", "");

  lines.push("export const grayAlpha = {");
  p.grayScaleAlpha.forEach((v, i) => lines.push(`  'a${l[i]}': '${fmt(v)}',`));
  lines.push("};", "");

  lines.push(`export const accentContrast = '${fmt(p.accentContrast)}';`);
  lines.push(`export const accentSurface = '${fmt(p.accentSurface)}';`);
  lines.push(`export const background = '${fmt(withHash(p.background))}';`);

  return lines.join("\n");
}
