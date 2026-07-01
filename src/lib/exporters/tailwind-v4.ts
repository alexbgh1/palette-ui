import { APPEARANCES, COLOR_SPACES_VALUES, DEFAULT_APPEARANCE, DEFAULT_EXPORT_COLOR_SPACE } from "../../constants";
import type { GeneratedPalette, Appearance, ColorSpace } from "../../interfaces";

import { labels } from "./_shared";
import { formatColor } from "../colorConvert";
import { withHash } from "../color";

export function buildTailwindV4(
  p: GeneratedPalette,
  semantic: boolean,
  colorSpace: ColorSpace = DEFAULT_EXPORT_COLOR_SPACE,
  opacity = false,
  mode: Appearance = DEFAULT_APPEARANCE,
): string {
  const l = labels(semantic);
  const lines: string[] = [`/* ${mode === APPEARANCES.dark ? "Dark" : "Light"} mode */`, "@theme {"];

  const fmt = (v: string) => formatColor(v, colorSpace, false);
  const varName = (suffix: string) => `--color-${suffix}`;

  const pushVar = (cssVarName: string, value: string) => {
    if (opacity && colorSpace !== COLOR_SPACES_VALUES.hex) {
      lines.push(`  ${cssVarName}: ${colorSpace}(var(${cssVarName}) / <alpha-value>);`);
    } else {
      lines.push(`  ${cssVarName}: ${fmt(value)};`);
    }
  };

  p.accentScale.forEach((v, i) => pushVar(varName(`accent-${l[i]}`), v));
  p.accentScaleAlpha.forEach((v, i) => pushVar(varName(`accent-a${semantic ? l[i] : i + 1}`), v));
  p.grayScale.forEach((v, i) => pushVar(varName(`gray-${l[i]}`), v));
  lines.push(`  ${varName("background")}: ${fmt(withHash(p.background))};`);
  lines.push("}");
  return lines.join("\n");
}
