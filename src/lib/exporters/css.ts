import { COLOR_SPACES_VALUES, DEFAULT_EXPORT_COLOR_SPACE, DEFAULT_APPEARANCE, APPEARANCES } from "../../constants";
import type { GeneratedPalette, Appearance, ColorSpace } from "../../interfaces";

import { labels } from "./_shared";

import { formatColor, formatChannels } from "../colorConvert";
import { withHash } from "../color";

function pushOpacityPair(lines: string[], varName: string, value: string, colorSpace: ColorSpace): void {
  const channels = formatChannels(value, colorSpace);
  lines.push(`  ${varName}-${colorSpace}: ${channels};`);
  lines.push(`  ${varName}: ${colorSpace}(var(${varName}-${colorSpace}) / <alpha-value>);`);
}

export function buildCss(
  p: GeneratedPalette,
  semantic: boolean,
  colorSpace: ColorSpace = DEFAULT_EXPORT_COLOR_SPACE,
  opacity = false,
  mode: Appearance = DEFAULT_APPEARANCE,
): string {
  const l = labels(semantic);
  const acc = semantic ? "--" : "--accent-";
  const gray = "--gray-";
  const lines: string[] = [`/* ${mode === APPEARANCES.dark ? "Dark" : "Light"} mode */`, ":root {"];
  const fmt = (v: string) => formatColor(v, colorSpace, false);

  const pushVar = (varName: string, value: string) => {
    if (opacity && colorSpace !== COLOR_SPACES_VALUES.hex) {
      pushOpacityPair(lines, varName, value, colorSpace);
    } else {
      lines.push(`  ${varName}: ${fmt(value)};`);
    }
  };

  p.accentScale.forEach((v, i) => pushVar(`${acc}${l[i]}`, v));
  p.accentScaleAlpha.forEach((v, i) => pushVar(`${acc}a${semantic ? l[i] : i + 1}`, v));
  p.accentScaleWideGamut.forEach((v, i) => lines.push(`  ${acc}p3-${semantic ? l[i] : i + 1}: ${v};`));
  p.grayScale.forEach((v, i) => pushVar(`${gray}${l[i]}`, v));
  p.grayScaleAlpha.forEach((v, i) => pushVar(`${gray}a${semantic ? l[i] : i + 1}`, v));
  pushVar(`${acc}contrast`, p.accentContrast);
  pushVar(`${acc}surface`, p.accentSurface);
  pushVar("--background", withHash(p.background));
  lines.push("}");
  return lines.join("\n");
}
