import { APPEARANCES, DEFAULT_APPEARANCE, DEFAULT_EXPORT_COLOR_SPACE } from "../../constants";
import type { GeneratedPalette, Appearance, ColorSpace } from "../../interfaces";

import { labels } from "./_shared";
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
  const accName = semantic ? "colors" : "accent";
  const lines: string[] = [`// ${mode === APPEARANCES.dark ? "Dark" : "Light"} mode`];
  const fmt = (v: string) => formatColor(v, colorSpace, raw);

  lines.push(`export const ${accName} = {`);
  p.accentScale.forEach((v, i) => lines.push(`  '${l[i]}': '${fmt(v)}',`));
  lines.push("};");
  lines.push("");

  lines.push("export const accentAlpha = {");
  p.accentScaleAlpha.forEach((v, i) => lines.push(`  '${semantic ? "a" + l[i] : "a" + (i + 1)}': '${fmt(v)}',`));
  lines.push("};");
  lines.push("");

  lines.push("export const gray = {");
  p.grayScale.forEach((v, i) => lines.push(`  '${l[i]}': '${fmt(v)}',`));
  lines.push("};");
  lines.push("");

  lines.push(`export const accentContrast = '${fmt(p.accentContrast)}';`);
  lines.push(`export const accentSurface = '${fmt(p.accentSurface)}';`);
  lines.push(`export const background = '${fmt(withHash(p.background))}';`);

  return lines.join("\n");
}
