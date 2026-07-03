import { APPEARANCES, DEFAULT_APPEARANCE, DEFAULT_EXPORT_COLOR_SPACE } from "../../constants";
import type { GeneratedPalette, Appearance, ColorSpace } from "../../interfaces";

import { labels, themeComment } from "./_shared";
import { formatColor } from "../colorConvert";
import { withHash } from "../color";

export function buildTailwindV4(
  p: GeneratedPalette,
  semantic: boolean,
  colorSpace: ColorSpace = DEFAULT_EXPORT_COLOR_SPACE,
  mode: Appearance = DEFAULT_APPEARANCE,
): string {
  const l = labels(semantic);
  const fmt = (v: string) => formatColor(v, colorSpace, false);
  const varName = (suffix: string) => `--color-${suffix}`;

  const themeLines: string[] = [];
  const indent = mode === APPEARANCES.dark ? "    " : "  ";
  const pushVar = (cssVarName: string, value: string) => themeLines.push(`${indent}${cssVarName}: ${fmt(value)};`);

  p.accentScale.forEach((v, i) => pushVar(varName(`accent-${l[i]}`), v));
  p.accentScaleAlpha.forEach((v, i) => pushVar(varName(`accent-a${l[i]}`), v));
  p.accentScaleWideGamut.forEach((v, i) => themeLines.push(`${indent}${varName(`accent-p3-${l[i]}`)}: ${v};`));
  pushVar(varName("accent-contrast"), p.accentContrast);
  pushVar(varName("accent-surface"), p.accentSurface);
  p.grayScale.forEach((v, i) => pushVar(varName(`gray-${l[i]}`), v));
  p.grayScaleAlpha.forEach((v, i) => pushVar(varName(`gray-a${l[i]}`), v));
  themeLines.push(`${indent}${varName("background")}: ${fmt(withHash(p.background))};`);

  const inner = themeLines.join("\n");

  if (mode === APPEARANCES.dark) {
    return [themeComment(mode), ".dark {", "  @theme {", inner, "  }", "}"].join("\n");
  }

  return [themeComment(mode), "@theme {", inner, "}"].join("\n");
}
