import { APPEARANCES, COLOR_SPACES_VALUES, DEFAULT_APPEARANCE, DEFAULT_EXPORT_COLOR_SPACE } from "../../constants";
import type { GeneratedPalette, Appearance, ColorSpace } from "../../interfaces";

import { labels } from "./_shared";

import { formatColor, formatChannels } from "../colorConvert";
import { withHash } from "../color";

export function buildScss(
  p: GeneratedPalette,
  semantic: boolean,
  colorSpace: ColorSpace = DEFAULT_EXPORT_COLOR_SPACE,
  opacity = false,
  mode: Appearance = DEFAULT_APPEARANCE,
): string {
  const l = labels(semantic);
  const acc = semantic ? "$" : "$accent-";
  const gray = "$gray-";
  const lines: string[] = [`// ${mode === APPEARANCES.dark ? "Dark" : "Light"} mode`];
  const fmt = (v: string) => formatColor(v, colorSpace, false);

  const pushVar = (varName: string, cssVarName: string, value: string) => {
    if (opacity && colorSpace !== COLOR_SPACES_VALUES.hex) {
      const channels = formatChannels(value, colorSpace);
      lines.push(`${varName}-${colorSpace}: ${channels};`);
      lines.push(`// Usage: ${colorSpace}(var(${cssVarName}-${colorSpace}) / 0.5)`);
    } else {
      lines.push(`${varName}: ${fmt(value)};`);
    }
  };

  p.accentScale.forEach((v, i) => {
    const cssVar = semantic ? `--${l[i]}` : `--accent-${i + 1}`;
    pushVar(`${acc}${l[i]}`, cssVar, v);
  });
  p.accentScaleAlpha.forEach((v, i) => {
    const suffix = semantic ? l[i] : String(i + 1);
    pushVar(`${acc}a${suffix}`, `--accent-a${suffix}`, v);
  });
  p.grayScale.forEach((v, i) => {
    pushVar(`${gray}${l[i]}`, `--gray-${l[i]}`, v);
  });

  lines.push(`${acc}contrast: ${fmt(p.accentContrast)};`);
  lines.push(`${acc}surface: ${fmt(p.accentSurface)};`);
  lines.push(`$background: ${fmt(withHash(p.background))};`);

  return lines.join("\n");
}
